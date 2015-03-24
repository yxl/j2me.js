/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

interface Array<T> {
  push2: (value) => void;
  pop2: () => any;
  pushKind: (kind: J2ME.Kind, value) => void;
  popKind: (kind: J2ME.Kind) => any;
  read: (i) => any;
}

module J2ME {
  import assert = Debug.assert;
  import Bytecodes = Bytecode.Bytecodes;
  declare var VM;
  declare var setZeroTimeout;

  export enum WriterFlags {
    None  = 0x00,
    Trace = 0x01,
    Link  = 0x02,
    Init  = 0x04,
    Perf  = 0x08,
    Load  = 0x10,
    JIT   = 0x20,
    Code  = 0x40,
    Thread = 0x80,

    All   = Trace | Link | Init | Perf | Load | JIT | Code | Thread
  }

  /**
   * Toggle VM tracing here.
   */
  export var writers = WriterFlags.None;

  Array.prototype.push2 = function(value) {
    this.push(value);
    this.push(null);
    return value;
  }

  Array.prototype.pop2 = function() {
    this.pop();
    return this.pop();
  }

  Array.prototype.pushKind = function(kind: Kind, value) {
    if (isTwoSlot(kind)) {
      this.push2(value);
      return;
    }
    this.push(value);
  }

  Array.prototype.popKind = function(kind: Kind) {
    if (isTwoSlot(kind)) {
      return this.pop2();
    }
    return this.pop();
  }

  // A convenience function for retrieving values in reverse order
  // from the end of the stack.  stack.read(1) returns the topmost item
  // on the stack, while stack.read(2) returns the one underneath it.
  Array.prototype.read = function(i) {
    return this[this.length - i];
  };

  export var frameCount = 0;

  export class Frame {
    methodInfo: MethodInfo;
    local: any [];
    stack: any [];
    code: Uint8Array;
    pc: number;
    opPC: number;
    cp: any;
    localBase: number;
    lockObject: java.lang.Object;

    static dirtyStack: Frame [] = [];

    /**
     * Denotes the start of the context frame stack.
     */
    static Start: Frame = Frame.create(null, null, 0);

    /**
     * Marks a frame set.
     */
    static Marker: Frame = Frame.create(null, null, 0);

    static isMarker(frame: Frame) {
      return frame.methodInfo === null;
    }

    constructor(methodInfo: MethodInfo, local: any [], localBase: number) {
      frameCount ++;
      this.reset(methodInfo, local, localBase);
    }

    reset(methodInfo: MethodInfo, local: any [], localBase: number) {
      this.methodInfo = methodInfo;
      this.cp = methodInfo ? methodInfo.classInfo.constantPool : null;
      this.code = methodInfo ? methodInfo.codeAttribute.code : null;
      this.pc = 0;
      this.opPC = 0;
      this.stack = [];
      this.local = local;
      this.localBase = localBase;
      this.lockObject = null;
    }

    static create(methodInfo: MethodInfo, local: any [], localBase: number): Frame {
      var dirtyStack = Frame.dirtyStack;
      if (dirtyStack.length) {
        var frame = dirtyStack.pop();
        frame.reset(methodInfo, local, localBase);
        return frame;
      } else {
        return new Frame(methodInfo, local, localBase);
      }
    }

    free() {
      release || assert(!Frame.isMarker(this));
      Frame.dirtyStack.push(this);
    }

    getLocal(i: number): any {
      return this.local[this.localBase + i];
    }

    setLocal(i: number, value: any) {
      this.local[this.localBase + i] = value;
    }

    incLocal(i: number, value: any) {
      var j = this.localBase + i;
      this.local[j] = this.local[j] + value | 0;
    }

    read8(): number {
      return this.code[this.pc++];
    }

    peek8(): number {
      return this.code[this.pc];
    }

    read16(): number {
      var code = this.code
      return code[this.pc++] << 8 | code[this.pc++];
    }

    patch(offset: number, oldValue: Bytecodes, newValue: Bytecodes) {
      release || assert(this.code[this.pc - offset] === oldValue);
      this.code[this.pc - offset] = newValue;
    }

    read32(): number {
      return this.read32Signed() >>> 0;
    }

    read8Signed(): number {
      return this.code[this.pc++] << 24 >> 24;
    }

    read16Signed(): number {
      var pc = this.pc;
      var code = this.code;
      this.pc = pc + 2
      return (code[pc] << 8 | code[pc + 1]) << 16 >> 16;
    }

    readTargetPC(): number {
      var pc = this.pc;
      var code = this.code;
      this.pc = pc + 2
      var offset = (code[pc] << 8 | code[pc + 1]) << 16 >> 16;
      return pc - 1 + offset;
    }

    read32Signed(): number {
      return this.read16() << 16 | this.read16();
    }

    tableSwitch(): number {
      var start = this.pc;
      while ((this.pc & 3) != 0) {
        this.pc++;
      }
      var def = this.read32Signed();
      var low = this.read32Signed();
      var high = this.read32Signed();
      var value = this.stack.pop();
      var pc;
      if (value < low || value > high) {
        pc = def;
      } else {
        this.pc += (value - low) << 2;
        pc = this.read32Signed();
      }
      return start - 1 + pc;
    }

    lookupSwitch(): number {
      var start = this.pc;
      while ((this.pc & 3) != 0) {
        this.pc++;
      }
      var pc = this.read32Signed();
      var size = this.read32();
      var value = this.stack.pop();
      lookup:
      for (var i = 0; i < size; i++) {
        var key = this.read32Signed();
        var offset = this.read32Signed();
        if (key === value) {
          pc = offset;
        }
        if (key >= value) {
          break lookup;
        }
      }
      return start - 1 + pc;
    }

    wide() {
      var stack = this.stack;
      var op = this.read8();
      switch (op) {
        case Bytecodes.ILOAD:
        case Bytecodes.FLOAD:
        case Bytecodes.ALOAD:
          stack.push(this.getLocal(this.read16()));
          break;
        case Bytecodes.LLOAD:
        case Bytecodes.DLOAD:
          stack.push2(this.getLocal(this.read16()));
          break;
        case Bytecodes.ISTORE:
        case Bytecodes.FSTORE:
        case Bytecodes.ASTORE:
          this.setLocal(this.read16(), stack.pop());
          break;
        case Bytecodes.LSTORE:
        case Bytecodes.DSTORE:
          this.setLocal(this.read16(), stack.pop2());
          break;
        case Bytecodes.IINC:
          var index = this.read16();
          var value = this.read16Signed();
          this.setLocal(index, this.getLocal(index) + value);
          break;
        case Bytecodes.RET:
          this.pc = this.getLocal(this.read16());
          break;
        default:
          var opName = Bytecodes[op];
          throw new Error("Wide opcode " + opName + " [" + op + "] not supported.");
      }
    }

    /**
     * Returns the |object| on which a call to the specified |methodInfo| would be
     * called.
     */
    peekInvokeObject(methodInfo: MethodInfo): java.lang.Object {
      release || assert(!methodInfo.isStatic);
      var i = this.stack.length - methodInfo.argumentSlots - 1;
      release || assert (i >= 0);
      release || assert (this.stack[i] !== undefined);
      return this.stack[i];
    }

    popArgumentsInto(methodInfo: MethodInfo, args): any [] {
      var stack = this.stack;
      var signatureKinds = methodInfo.signatureKinds;
      var argumentSlots = methodInfo.argumentSlots;
      for (var i = 1, j = stack.length - argumentSlots, k = 0; i < signatureKinds.length; i++) {
        args[k++] = stack[j++];
        if (isTwoSlot(signatureKinds[i])) {
          j++;
        }
      }
      release || assert(j === stack.length && k === signatureKinds.length - 1);
      stack.length -= argumentSlots;
      args.length = k;
      return args;
    }

    toString() {
      return this.methodInfo.implKey + " " + this.pc;
    }

    trace(writer: IndentingWriter) {
      var localStr = this.local.map(function (x) {
        return toDebugString(x);
      }).join(", ");

      var stackStr = this.stack.map(function (x) {
        return toDebugString(x);
      }).join(", ");

      writer.writeLn(("" + this.pc).padLeft(" ", 4) + " " + localStr + " | " + stackStr);
    }
  }

  export class Context {
    private static _nextId: number = 0;
    private static _colors = [
      IndentingWriter.PURPLE,
      IndentingWriter.YELLOW,
      IndentingWriter.GREEN,
      IndentingWriter.RED,
      IndentingWriter.BOLD_RED
    ];
    private static writer: IndentingWriter = new IndentingWriter(false, function (s) {
      console.log(s);
    });

    id: number;

    /*
     * Contains method frames separated by special frame instances called marker frames. These
     * mark the position in the frame stack where the interpreter starts execution.
     *
     * During normal execution, a marker frame is inserted on every call to |executeFrame|, so
     * the stack looks something like:
     *
     *     frame stack: [start, f0, m, f1, m, f2]
     *                   ^          ^      ^
     *                   |          |      |
     *   js call stack:  I ........ I .... I ...
     *
     * After unwinding, the frame stack is compacted:
     *
     *     frame stack: [start, f0, f1, f2]
     *                   ^       ^
     *                   |       |
     *   js call stack:  I ..... I .......
     *
     */
    frames: Frame [];
    bailoutFrames: Frame [];
    lockTimeout: number;
    lockLevel: number;
    thread: java.lang.Thread;
    writer: IndentingWriter;
    constructor(public runtime: Runtime) {
      var id = this.id = Context._nextId ++;
      this.frames = [];
      this.bailoutFrames = [];
      this.runtime = runtime;
      this.runtime.addContext(this);
      this.writer = new IndentingWriter(false, function (s) {
        console.log(s);
      });
    }

    public static color(id) {
      if (inBrowser) {
        return id;
      }
      return Context._colors[id % Context._colors.length] + id + IndentingWriter.ENDC;
    }
    public static currentContextPrefix() {
      if ($) {
        return Context.color($.id) + ":" + Context.color($.ctx.id);
      }
      return "";
    }

    /**
     * Sets global writers. Uncomment these if you want to see trace output.
     */
    static setWriters(writer: IndentingWriter) {
      traceWriter = writers & WriterFlags.Trace ? writer : null;
      perfWriter = writers & WriterFlags.Perf ? writer : null;
      linkWriter = writers & WriterFlags.Link ? writer : null;
      jitWriter = writers & WriterFlags.JIT ? writer : null;
      codeWriter = writers & WriterFlags.Code ? writer : null;
      initWriter = writers & WriterFlags.Init ? writer : null;
      threadWriter = writers & WriterFlags.Thread ? writer : null;
      loadWriter = writers & WriterFlags.Load ? writer : null;
    }

    getPriority() {
      if (this.thread) {
        return this.thread.priority;
      }
      return NORMAL_PRIORITY;
    }

    kill() {
      if (this.thread) {
        this.thread.alive = false;
      }
      this.runtime.removeContext(this);
    }

    current(): Frame {
      var frames = this.frames;
      return frames[frames.length - 1];
    }

    private popMarkerFrame() {
      var marker = this.frames.pop();
      release || assert (Frame.isMarker(marker));
    }

    executeFrame(frame: Frame) {
      var frames = this.frames;
      frames.push(Frame.Marker, frame);

      try {
        var returnValue = VM.execute();
        if (U) {
          // Prepend all frames up until the first marker to the bailout frames.
          while (true) {
            var frame = frames.pop();
            if (Frame.isMarker(frame)) {
              break;
            }
            this.bailoutFrames.unshift(frame);
          }
          return;
        }
      } catch (e) {
        this.popMarkerFrame();
        throwHelper(e);
      }
      this.popMarkerFrame();
      return returnValue;
    }

    createException(className: string, message?: string) {
      if (!message) {
        message = "";
      }
      message = "" + message;
      var classInfo = CLASSES.loadAndLinkClass(className);
      classInitCheck(classInfo);
      release || Debug.assert(!U, "Unexpected unwind during createException.");
      runtimeCounter && runtimeCounter.count("createException " + className);
      var exception = new classInfo.klass();
      var methodInfo = classInfo.getMethodByNameString("<init>", "(Ljava/lang/String;)V");
      getLinkedMethod(methodInfo).call(exception, message ? newString(message) : null);
      return exception;
    }

    setAsCurrentContext() {
      if ($) {
        threadTimeline && threadTimeline.leave();
      }
      threadTimeline && threadTimeline.enter(this.runtime.id + ":" + this.id);
      $ = this.runtime;
      if ($.ctx === this) {
        return;
      }
      $.ctx = this;
      Context.setWriters(this.writer);
    }

    clearCurrentContext() {
      if ($) {
        threadTimeline && threadTimeline.leave();
      }
      $ = null;
      Context.setWriters(Context.writer);
    }

    start(frames: Frame[]) {
      frames.unshift(Frame.Start);
      this.frames = frames;
      this.resume();
    }

    execute() {
      this.setAsCurrentContext();
      do {
        VM.execute();
        if (U) {
          if (this.bailoutFrames.length) {
            Array.prototype.push.apply(this.frames, this.bailoutFrames);
            this.bailoutFrames = [];
          }
          var frames = this.frames;
          switch (U) {
            case VMState.Yielding:
              this.resume();
              break;
            case VMState.Pausing:
              break;
            case VMState.Stopping:
              this.clearCurrentContext();
              this.kill();
              return;
          }
          U = VMState.Running;
          this.clearCurrentContext();
          return;
        }
      } while (this.current() !== Frame.Start);
      this.kill();
    }

    resume() {
      Runtime.scheduleRunningContext(this);
    }

    block(obj, queue, lockLevel) {
      obj._lock[queue].push(this);
      this.lockLevel = lockLevel;
      $.pause("block");
    }

    unblock(obj, queue, notifyAll) {
      while (obj._lock[queue].length) {
        var ctx = obj._lock[queue].pop();
        if (!ctx)
          continue;
          ctx.wakeup(obj)
        if (!notifyAll)
          break;
      }
    }

    wakeup(obj) {
      if (this.lockTimeout !== null) {
        window.clearTimeout(this.lockTimeout);
        this.lockTimeout = null;
      }
      if (obj._lock.level !== 0) {
        obj._lock.ready.push(this);
      } else {
        while (this.lockLevel-- > 0) {
          this.monitorEnter(obj);
          if (U === VMState.Pausing || U === VMState.Stopping) {
            return;
          }
        }
        this.resume();
      }
    }

    monitorEnter(object: java.lang.Object) {
      var lock = object._lock;
      if (lock && lock.level === 0) {
        lock.thread = this.thread;
        lock.level = 1;
        return;
      }
      if (!lock) {
        object._lock = new Lock(this.thread, 1);
        return;
      }
      if (lock.thread === this.thread) {
        ++lock.level;
        return;
      }
      this.block(object, "ready", 1);
    }

    monitorExit(object: java.lang.Object) {
      var lock = object._lock;
      if (lock.level === 1 && lock.ready.length === 0) {
        lock.level = 0;
        return;
      }
      if (lock.thread !== this.thread)
        throw $.newIllegalMonitorStateException();
      if (--lock.level > 0) {
        return;
      }
      this.unblock(object, "ready", false);
    }

    wait(object: java.lang.Object, timeout) {
      var lock = object._lock;
      if (timeout < 0)
        throw $.newIllegalArgumentException();
      if (!lock || lock.thread !== this.thread)
        throw $.newIllegalMonitorStateException();
      var lockLevel = lock.level;
      for (var i = lockLevel; i > 0; i--) {
        this.monitorExit(object);
      }
      if (timeout) {
        var self = this;
        this.lockTimeout = window.setTimeout(function () {
          for (var i = 0; i < lock.waiting.length; i++) {
            var ctx = lock.waiting[i];
            if (ctx === self) {
              lock.waiting[i] = null;
              ctx.wakeup(object);
            }
          }
        }, timeout);
      } else {
        this.lockTimeout = null;
      }
      this.block(object, "waiting", lockLevel);
    }

    notify(obj, notifyAll) {
      if (!obj._lock || obj._lock.thread !== this.thread)
        throw $.newIllegalMonitorStateException();

      this.unblock(obj, "waiting", notifyAll);
    }

    bailout(methodInfo: MethodInfo, pc: number, nextPC: number, local: any [], stack: any [], lockObject: java.lang.Object) {
      // perfWriter && perfWriter.writeLn("C Unwind: " + methodInfo.implKey);
      var frame = Frame.create(methodInfo, local, 0);
      frame.stack = stack;
      frame.pc = nextPC;
      frame.opPC = pc;
      frame.lockObject = lockObject;
      this.bailoutFrames.unshift(frame);
    }
  }
}

var Context = J2ME.Context;
var Frame = J2ME.Frame;
