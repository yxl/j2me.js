/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var $: J2ME.Runtime; // The currently-executing runtime.

interface Math {
  fround(value: number): number;
}
interface Long {
  isZero(): boolean;
}
declare var Long: {
  new (low: number, high: number): Long;
  ZERO: Long;
  fromBits(lowBits: number, highBits: number): Long;
  fromInt(value: number);
  fromNumber(value: number);
}

interface Promise {
  catch(onRejected: { (reason: any): any; }): Promise;
}

interface CompiledMethodCache {
  get(key: string): { key: string; source: string; referencedClasses: string[]; };
  put(obj: { key: string; source: string; referencedClasses: string[]; }): Promise;
}

interface AOTMetaData {
  /**
   * On stack replacement pc entry points.
   */
  osr: number [];
}

declare var throwHelper;
declare var throwPause;
declare var throwYield;

module J2ME {
  declare var Native, config;
  declare var VM;
  declare var CompiledMethodCache;

  export var aotMetaData = <{string: AOTMetaData}>Object.create(null);

  /**
   * Turns on just-in-time compilation of methods.
   */
  export var enableRuntimeCompilation = true;

  /**
   * Turns on onStackReplacement
   */
  export var enableOnStackReplacement = true;

  /**
   * Turns on caching of JIT-compiled methods.
   */
  export var enableCompiledMethodCache = true && typeof CompiledMethodCache !== "undefined";

  /**
   * Traces method execution.
   */
  export var traceWriter = null;

  /**
   * Traces performance problems.
   */
  export var perfWriter = null;

  /**
   * Traces linking and class loading.
   */
  export var linkWriter = null;

  /**
   * Traces JIT compilation.
   */
  export var jitWriter = null;

  /**
   * Traces class loading.
   */
  export var loadWriter = null;

  /**
   * Traces winding and unwinding.
   */
  export var windingWriter = null;

  /**
   * Traces class initialization.
   */
  export var initWriter = null;

  /**
   * Traces thread execution.
   */
  export var threadWriter = null;

  /**
   * Traces generated code.
   */
  export var codeWriter = null;

  export enum MethodState {
    /**
     * All methods start in this state.
     */
    Cold = 0,

    /**
     * Methods have this state if code has been compiled for them or
     * there is a native implementation that needs to be used.
     */
    Compiled = 1,

    /**
     * We don't want to compiled these methods, they may be too large
     * to benefit from JIT compilation.
     */
    NotCompiled = 2,

    /**
     * Methods are not compiled because of some exception.
     */
    CannotCompile = 3
  }

  declare var Shumway;

  export var timeline;
  export var threadTimeline;
  export var methodTimelines = [];
  export var nativeCounter = release ? null : new Metrics.Counter(true);
  export var runtimeCounter = release ? null : new Metrics.Counter(true);
  export var baselineMethodCounter = release ? null : new Metrics.Counter(true);
  export var asyncCounter = release ? null : new Metrics.Counter(true);
  export var jitMethodInfos = {};

  export var unwindCount = 0;

  if (typeof Shumway !== "undefined") {
    timeline = new Shumway.Tools.Profiler.TimelineBuffer("Runtime");
    threadTimeline = new Shumway.Tools.Profiler.TimelineBuffer("Threads");
  }

  export function enterTimeline(name: string, data?: any) {
    timeline && timeline.enter(name, data);
  }

  export function leaveTimeline(name?: string, data?: any) {
    timeline && timeline.leave(name, data);
  }

  export var Klasses = {
    java: {
      lang: {
        Object: null,
        Class: null,
        String: null,
        Thread: null,
        IllegalArgumentException: null,
        IllegalStateException: null,
        NullPointerException: null,
        RuntimeException: null,
        IndexOutOfBoundsException: null,
        ArrayIndexOutOfBoundsException: null,
        StringIndexOutOfBoundsException: null,
        ArrayStoreException: null,
        IllegalMonitorStateException: null,
        ClassCastException: null,
        NegativeArraySizeException: null,
        ArithmeticException: null,
        ClassNotFoundException: null,
        SecurityException: null,
        IllegalThreadStateException: null,
        InstantiationException: null,
        Exception: null
      },
      io: {
        IOException: null,
        UTFDataFormatException: null,
        UnsupportedEncodingException: null
      }
    },
    javax: {
      microedition: {
        media: {
          MediaException: null
        }
      }
    },
    boolean: null,
    char: null,
    float: null,
    double: null,
    byte: null,
    short: null,
    int: null,
    long: null
  };

  function Int64Array(size: number) {
    var array = Array(size);
    for (var i = 0; i < size; i++) {
      array[i] = Long.ZERO;
    }
    // We can't put the klass on the prototype.
    (<any>array).klass = Klasses.long;
    return array;
  }

  var arrays = {
    'Z': Uint8Array,
    'C': Uint16Array,
    'F': Float32Array,
    'D': Float64Array,
    'B': Int8Array,
    'S': Int16Array,
    'I': Int32Array,
    'J': Int64Array
  };

  export function getArrayConstructor(type: string): Function {
    return arrays[type];
  }

  /**
   * We can't always mutate the |__proto__|.
   */
  function isPrototypeOfFunctionMutable(fn: Function): boolean {
    // We don't list all builtins here, since not all of them are used in the object
    // hierarchy.
    switch (fn) {
      case Object:
      case Array:
      case Uint8Array:
      case Uint16Array:
      case Float32Array:
      case Float64Array:
      case Int8Array:
      case Int16Array:
      case Int32Array:
        return false;
      default:
        return true;
    }
  }

  export var stdoutWriter = new IndentingWriter();
  export var stderrWriter = new IndentingWriter(false, IndentingWriter.stderr);

  export enum ExecutionPhase {
    /**
     * Default runtime behaviour.
     */
    Runtime = 0,

    /**
     * When compiling code statically.
     */
    Compiler = 1
  }

  export var phase = ExecutionPhase.Runtime;

  export var internedStrings: Map<string, java.lang.String> = new Map<string, java.lang.String>();

  declare var util;

  import assert = J2ME.Debug.assert;

  export enum RuntimeStatus {
    New       = 1,
    Started   = 2,
    Stopping  = 3, // Unused
    Stopped   = 4
  }

  export enum MethodType {
    Interpreted,
    Native,
    Compiled
  }

  var hashMap = Object.create(null);

  var hashArray = new Int32Array(1024);

  function hashString(s: string) {
    if (hashArray.length < s.length) {
      hashArray = new Int32Array((hashArray.length * 2 / 3) | 0);
    }
    var data = hashArray;
    for (var i = 0; i < s.length; i++) {
      data[i] = s.charCodeAt(i);
    }
    var hash = HashUtilities.hashBytesTo32BitsMurmur(data, 0, s.length);

    if (!release) { // Check to see that no collisions have ever happened.
      if (hashMap[hash] && hashMap[hash] !== s) {
        assert(false, "This is very bad.")
      }
      hashMap[hash] = s;
    }

    return hash;
  }

  export function hashUTF8String(s: Uint8Array): number {
    var hash = HashUtilities.hashBytesTo32BitsMurmur(s, 0, s.length);
    if (!release) { // Check to see that no collisions have ever happened.
      if (hashMap[hash] && hashMap[hash] !== s) {
        assert(false, "This is very bad.")
      }
      hashMap[hash] = s;
    }

    return hash;
  }

  function isIdentifierChar(c: number): boolean {
    return (c >= 97   && c <= 122)   || // a .. z
           (c >= 65   && c <=  90)   || // A .. Z
           (c === 36) || (c === 95);    // $ && _
  }

  function isDigit(c: number): boolean {
    return c >= 48 && c <= 57;
  }

  function needsEscaping(s: string): boolean {
    var l = s.length;
    for (var i = 0; i < l; i++) {
      var c = s.charCodeAt(i);
      if (!isIdentifierChar(c)) {
        return true;
      }
    }
    return false;
  }

  // Fast lookup table.
  var map = new Array(128);
  for (var i = 0; i < 128; i++) {
    map[i] = String.fromCharCode(i);
  }

  // Patch up some entries.
  var invalidChars = "[];/<>()";
  var replaceChars = "abc_defg";
  for (var i = 0; i < invalidChars.length; i++) {
    map[invalidChars.charCodeAt(i)] = replaceChars[i];
  }

  // Reuse array.
  var T = new Array(1024);

  export function escapeString(s: string): string {
    if (!needsEscaping(s)) {
      return s;
    }
    var l = s.length;
    var r = T;
    r.length = l;
    for (var i = 0; i < l; i++) {
      var c = s.charCodeAt(i);
      if (i === 0 && isDigit(c)) {
        r[i] = String.fromCharCode(c - 48 + 97); // Map 0 .. 9 to a .. j
      } else if (c < 128) {
        r[i] = map[c]
      } else {
        r[i] = s[i];
      }
    }
    return r.join("");
  }

  var stringHashes = Object.create(null);
  var stringHashCount = 0;

  function hashStringStrong(s): string {
    // Hash with Murmur hash.
    var result = StringUtilities.variableLengthEncodeInt32(hashString(s));
    // Also use the length for some more precision.
    result += StringUtilities.toEncoding(s.length & 0x3f);
    return result;
  }

  export function hashStringToString(s: string) {
    if (stringHashCount > 1024) {
      return hashStringStrong(s);
    }
    var c = stringHashes[s];
    if (c) {
      return c;
    }
    c = stringHashes[s] = hashStringStrong(s);
    stringHashCount ++;
    return c;
  }

  /**
   * This class is abstract and should never be initialized. It only acts as a template for
   * actual runtime objects.
   */
  export class RuntimeTemplate {
    static all = new Set();
    jvm: JVM;
    status: RuntimeStatus;
    waiting: any [];
    threadCount: number;
    initialized: any;
    pending: any;
    staticFields: any;
    classObjects: any;
    ctx: Context;
    allCtxs: Set<Context>;

    isolate: com.sun.cldc.isolate.Isolate;
    priority: number = ISOLATE_NORM_PRIORITY;
    mainThread: java.lang.Thread;

    private static _nextRuntimeId: number = 0;
    private _runtimeId: number;
    private _nextHashCode: number;

    constructor(jvm: JVM) {
      this.jvm = jvm;
      this.status = RuntimeStatus.New;
      this.waiting = [];
      this.threadCount = 0;
      this.initialized = Object.create(null);
      this.pending = {};
      this.staticFields = {};
      this.classObjects = {};
      this.ctx = null;
      this.allCtxs = new Set();
      this._runtimeId = RuntimeTemplate._nextRuntimeId ++;
      this._nextHashCode = this._runtimeId << 24;
    }
    
    preInitializeClasses(ctx: Context) {
      var prevCtx = $ ? $.ctx : null;
      var preInit = CLASSES.preInitializedClasses;
      ctx.setAsCurrentContext();
      for (var i = 0; i < preInit.length; i++) {
        var runtimeKlass = this.getRuntimeKlass(preInit[i].klass);
        var methodInfo = runtimeKlass.classObject.klass.classInfo.getMethodByNameString("initialize", "()V");
        runtimeKlass.classObject[methodInfo.virtualName]();
        // runtimeKlass.classObject.initialize();
        release || Debug.assert(!U, "Unexpected unwind during preInitializeClasses.");
      }
      ctx.clearCurrentContext();
      if (prevCtx) {
        prevCtx.setAsCurrentContext();
      }
    }

    /**
     * After class intialization is finished the init9 method will invoke this so
     * any further initialize calls can be avoided. This isn't set on the first call
     * to a class initializer because there can be multiple calls into initialize from
     * different threads that need trigger the Class.initialize() code so they block.
     */
    setClassInitialized(runtimeKlass: RuntimeKlass) {
      var className = runtimeKlass.templateKlass.classInfo.getClassNameSlow();
      this.initialized[className] = true;
    }

    getRuntimeKlass(klass: Klass): RuntimeKlass {
      var runtimeKlass = this[klass.classInfo.mangledName];
      return runtimeKlass;
    }

    /**
     * Generates a new hash code for the specified |object|.
     */
    nextHashCode(): number {
      return this._nextHashCode ++;
    }

    waitStatus(callback) {
      this.waiting.push(callback);
    }

    updateStatus(status: RuntimeStatus) {
      this.status = status;
      var waiting = this.waiting;
      this.waiting = [];
      waiting.forEach(function (callback) {
        try {
          callback();
        } catch (ex) {
          // If the callback calls Runtime.prototype.waitStatus to continue waiting,
          // then waitStatus will throw VM.Pause, which shouldn't propagate up to
          // the caller of Runtime.prototype.updateStatus, so we silently ignore it
          // (along with any other exceptions thrown by the callback, so they don't
          // propagate to the caller of updateStatus).
        }
      });
    }

    addContext(ctx) {
      ++this.threadCount;
      RuntimeTemplate.all.add(this);
      this.allCtxs.add(ctx);
    }

    removeContext(ctx) {
      if (!--this.threadCount) {
        RuntimeTemplate.all.delete(this);
        this.updateStatus(RuntimeStatus.Stopped);
      }
      this.allCtxs.delete(ctx);
    }

    newStringConstant(s: string): java.lang.String {
      if (internedStrings.has(s)) {
        return internedStrings.get(s);
      }
      var obj = J2ME.newString(s);
      internedStrings.set(s, obj);
      return obj;
    }

    setStatic(field, value) {
      this.staticFields[field.id] = value;
    }

    getStatic(field) {
      return this.staticFields[field.id];
    }

    newIOException(str?: string): java.io.IOException {
      return <java.io.IOException>$.ctx.createException(
        "java/io/IOException", str);
    }

    newUnsupportedEncodingException(str?: string): java.io.UnsupportedEncodingException {
      return <java.io.UnsupportedEncodingException>$.ctx.createException(
        "java/io/UnsupportedEncodingException", str);
    }

    newUTFDataFormatException(str?: string): java.io.UTFDataFormatException {
      return <java.io.UTFDataFormatException>$.ctx.createException(
        "java/io/UTFDataFormatException", str);
    }

    newSecurityException(str?: string): java.lang.SecurityException {
      return <java.lang.SecurityException>$.ctx.createException(
        "java/lang/SecurityException", str);
    }

    newIllegalThreadStateException(str?: string): java.lang.IllegalThreadStateException {
      return <java.lang.IllegalThreadStateException>$.ctx.createException(
        "java/lang/IllegalThreadStateException", str);
    }

    newRuntimeException(str?: string): java.lang.RuntimeException {
      return <java.lang.RuntimeException>$.ctx.createException(
        "java/lang/RuntimeException", str);
    }

    newIndexOutOfBoundsException(str?: string): java.lang.IndexOutOfBoundsException {
      return <java.lang.IndexOutOfBoundsException>$.ctx.createException(
        "java/lang/IndexOutOfBoundsException", str);
    }

    newArrayIndexOutOfBoundsException(str?: string): java.lang.ArrayIndexOutOfBoundsException {
      return <java.lang.ArrayIndexOutOfBoundsException>$.ctx.createException(
        "java/lang/ArrayIndexOutOfBoundsException", str);
    }

    newStringIndexOutOfBoundsException(str?: string): java.lang.StringIndexOutOfBoundsException {
      return <java.lang.StringIndexOutOfBoundsException>$.ctx.createException(
        "java/lang/StringIndexOutOfBoundsException", str);
    }

    newArrayStoreException(str?: string): java.lang.ArrayStoreException {
      return <java.lang.ArrayStoreException>$.ctx.createException(
        "java/lang/ArrayStoreException", str);
    }

    newIllegalMonitorStateException(str?: string): java.lang.IllegalMonitorStateException {
      return <java.lang.IllegalMonitorStateException>$.ctx.createException(
        "java/lang/IllegalMonitorStateException", str);
    }

    newClassCastException(str?: string): java.lang.ClassCastException {
      return <java.lang.ClassCastException>$.ctx.createException(
        "java/lang/ClassCastException", str);
    }

    newArithmeticException(str?: string): java.lang.ArithmeticException {
      return <java.lang.ArithmeticException>$.ctx.createException(
        "java/lang/ArithmeticException", str);
    }

    newClassNotFoundException(str?: string): java.lang.ClassNotFoundException {
      return <java.lang.ClassNotFoundException>$.ctx.createException(
        "java/lang/ClassNotFoundException", str);
    }

    newIllegalArgumentException(str?: string): java.lang.IllegalArgumentException {
      return <java.lang.IllegalArgumentException>$.ctx.createException(
        "java/lang/IllegalArgumentException", str);
    }

    newIllegalStateException(str?: string): java.lang.IllegalStateException {
      return <java.lang.IllegalStateException>$.ctx.createException(
        "java/lang/IllegalStateException", str);
    }

    newNegativeArraySizeException(str?: string): java.lang.NegativeArraySizeException {
      return <java.lang.NegativeArraySizeException>$.ctx.createException(
        "java/lang/NegativeArraySizeException", str);
    }

    newNullPointerException(str?: string): java.lang.NullPointerException {
      return <java.lang.NullPointerException>$.ctx.createException(
        "java/lang/NullPointerException", str);
    }

    newMediaException(str?: string): javax.microedition.media.MediaException {
      return <javax.microedition.media.MediaException>$.ctx.createException(
        "javax/microedition/media/MediaException", str);
    }

    newInstantiationException(str?: string): java.lang.InstantiationException {
      return <java.lang.InstantiationException>$.ctx.createException(
        "java/lang/InstantiationException", str);
    }

    newException(str?: string): java.lang.Exception {
      return <java.lang.Exception>$.ctx.createException(
        "java/lang/Exception", str);
    }

  }

  export enum VMState {
    Running = 0,
    Yielding = 1,
    Pausing = 2,
    Stopping = 3
  }

  /** @const */ export var MAX_PRIORITY: number = 10;
  /** @const */ export var MIN_PRIORITY: number = 1;
  /** @const */ export var NORMAL_PRIORITY: number = 5;

  /** @const */ export var ISOLATE_MIN_PRIORITY: number = 1;
  /** @const */ export var ISOLATE_NORM_PRIORITY: number = 2;
  /** @const */ export var ISOLATE_MAX_PRIORITY: number = 3;

  class PriorityQueue {
    private _top: number;
    private _queues: Context[][];

    constructor() {
      this._top = MIN_PRIORITY + ISOLATE_MIN_PRIORITY;
      this._queues = [];
      for (var i = MIN_PRIORITY + ISOLATE_MIN_PRIORITY; i <= MAX_PRIORITY + ISOLATE_MAX_PRIORITY; i++) {
        this._queues[i] = [];
      }
    }

    enqueue(ctx: Context) {
      var priority = ctx.getPriority() + ctx.runtime.priority;
      release || assert(priority >= MIN_PRIORITY + ISOLATE_MIN_PRIORITY && priority <= MAX_PRIORITY + ISOLATE_MAX_PRIORITY,
                        "Invalid priority: " + priority);
      this._queues[priority].push(ctx);
      this._top = Math.max(priority, this._top);
    }

    dequeue(): Context {
      if (this.isEmpty()) {
        return null;
      }
      var ctx = this._queues[this._top].shift();
      while (this._queues[this._top].length === 0 && this._top > MIN_PRIORITY + ISOLATE_MIN_PRIORITY) {
        this._top--;
      }
      return ctx;
    }

    isEmpty() {
      return this._top === MIN_PRIORITY + ISOLATE_MIN_PRIORITY && this._queues[this._top].length === 0;
    }
  }

  export class Runtime extends RuntimeTemplate {
    private static _nextId: number = 0;
    private static _runningQueue: PriorityQueue = new PriorityQueue();
    private static _processQueueScheduled: boolean = false;

    id: number;


    /*
     * The thread scheduler uses green thread algorithm, which a non-preemptive,
     * priority based algorithm.
     * All Java threads have a priority and the thread with he highest priority
     * is scheduled to run.
     * In case two threads have the same priority a FIFO ordering is followed.
     * A different thread is invoked to run only if the current thread blocks or
     * terminates.
     */
    static scheduleRunningContext(ctx: Context) {
      Runtime._runningQueue.enqueue(ctx);
      Runtime.processRunningQueue();
    }

    private static processRunningQueue() {
      if (Runtime._processQueueScheduled) {
        return;
      }
      Runtime._processQueueScheduled = true;
      (<any>window).setZeroTimeout(function() {
        Runtime._processQueueScheduled = false;
        try {
          Runtime._runningQueue.dequeue().execute();
        } finally {
          if (!Runtime._runningQueue.isEmpty()) {
            Runtime.processRunningQueue();
          }
        }
      });
    }

    /**
     * Bailout callback whenever a JIT frame is unwound.
     */
    B(pc: number, nextPC: number, local: any [], stack: any [], lockObject: java.lang.Object) {
      var methodInfo = jitMethodInfos[(<any>arguments.callee.caller).name];
      release || assert(methodInfo !== undefined);
      $.ctx.bailout(methodInfo, pc, nextPC, local, stack, lockObject);
    }

    /**
     * Bailout callback whenever a JIT frame is unwound that uses a slightly different calling
     * convetion that makes it more convenient to emit in some cases.
     */
    T(location: UnwindThrowLocation, local: any [], stack: any [], lockObject: java.lang.Object) {
      var methodInfo = jitMethodInfos[(<any>arguments.callee.caller).name];
      release || assert(methodInfo !== undefined);
      $.ctx.bailout(methodInfo, location.getPC(), location.getNextPC(), local, stack.slice(0, location.getSP()), lockObject);
    }

    yield(reason: string) {
      unwindCount ++;
      threadWriter && threadWriter.writeLn("yielding " + reason);
      runtimeCounter && runtimeCounter.count("yielding " + reason);
      U = VMState.Yielding;
    }

    pause(reason: string) {
      unwindCount ++;
      threadWriter && threadWriter.writeLn("pausing " + reason);
      runtimeCounter && runtimeCounter.count("pausing " + reason);
      U = VMState.Pausing;
    }

    stop() {
      U = VMState.Stopping;
    }

    constructor(jvm: JVM) {
      super(jvm);
      this.id = Runtime._nextId ++;
    }
  }

  export class Class {
    constructor(public klass: Klass) {
      // ...
    }
  }

  /**
   * Representation of a template class.
   */
  export interface Klass extends Function {
    new (): java.lang.Object;

    /**
     * Array klass of this klass, constructed via \arrayKlass\.
     */
    arrayKlass: Klass;

    superKlass: Klass;

    /**
     * Would be nice to remove this. So we try not to depend on it too much.
     */
    classInfo: ClassInfo;

    /**
     * Flattened array of super klasses. This makes type checking easy,
     * see |classInstanceOf|.
     */
    display: Klass [];

    /**
     * Flattened array of super klasses. This makes type checking easy,
     * see |classInstanceOf|.
     */
    interfaces: Klass [];

    /**
     * Depth in the class hierarchy.
     */
    depth: number;

    classSymbols: string [];

    /**
     * Static constructor, not all klasses have one.
     */
    staticConstructor: () => void;

    /**
     * Whether this class is an interface class.
     */
    isInterfaceKlass: boolean;

    isArrayKlass: boolean;

    elementKlass: Klass;

    /**
     * Links class method.
     */
    m(index: number): Function;

    /**
     * Resolve constant pool entry.
     */
    c(index: number): any;

    /**
     * Linked class methods.
     */
    M: Function[];
  }

  export class RuntimeKlass {
    templateKlass: Klass;

    /**
     * Java class object. This is only available on runtime klasses and it points to itself. We go trough
     * this indirection in VM code for now so that we can easily change it later if we need to.
     */
    classObject: java.lang.Class;

    /**
     * Whether this class is a runtime class.
     */
    // isRuntimeKlass: boolean;

    constructor(templateKlass: Klass) {
      this.templateKlass = templateKlass;
    }
  }

  export class Lock {
    ready: Context [];
    waiting: Context [];

    constructor(public thread: java.lang.Thread, public level: number) {
      this.ready = [];
      this.waiting = [];
    }
  }

  function initializeClassObject(runtimeKlass: RuntimeKlass) {
    linkWriter && linkWriter.writeLn("Initializing Class Object For: " + runtimeKlass.templateKlass);
    release || assert(!runtimeKlass.classObject);
    runtimeKlass.classObject = <java.lang.Class><any>new Klasses.java.lang.Class();
    runtimeKlass.classObject.runtimeKlass = runtimeKlass;
    var className = runtimeKlass.templateKlass.classInfo.getClassNameSlow();
    if (className === "java/lang/Object" ||
        className === "java/lang/Class" ||
        className === "java/lang/String" ||
        className === "java/lang/Thread") {
      (<any>runtimeKlass.classObject).status = 4;
      $.setClassInitialized(runtimeKlass);
      return;
    }
    var fields = runtimeKlass.templateKlass.classInfo.getFields();
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (field.isStatic) {
        var kind = getSignatureKind(field.utf8Signature);
        var defaultValue;
        switch (kind) {
          case Kind.Reference:
            defaultValue = null;
            break;
          case Kind.Long:
            defaultValue = Long.ZERO;
            break;
          default:
            defaultValue = 0;
            break;
        }
        field.set(<java.lang.Object><any>runtimeKlass, defaultValue);
      }
    }
  }

  /**
   * Registers the klass as a getter on the runtime template. On first access, the getter creates a runtime klass and
   * adds it to the runtime.
   */
  export function registerKlass(klass: Klass, classInfo: ClassInfo) {
    linkWriter && linkWriter.writeLn("Registering Klass: " + classInfo.getClassNameSlow());
    Object.defineProperty(RuntimeTemplate.prototype, classInfo.mangledName, {
      configurable: true,
      get: function () {
        linkWriter && linkWriter.writeLn("Creating Runtime Klass: " + classInfo.getClassNameSlow());
        release || assert(!(klass instanceof RuntimeKlass));
        var runtimeKlass = new RuntimeKlass(klass);
        initializeClassObject(runtimeKlass);
        Object.defineProperty(this, classInfo.mangledName, {
          value: runtimeKlass
        });
        return runtimeKlass;
      }
    });
  }

  var unresolvedSymbols = Object.create(null);

  function findKlass(classInfo: ClassInfo) {
    if (unresolvedSymbols[classInfo.mangledName]) {
      return null;
    }
    var klass = jsGlobal[classInfo.mangledName];
    if (klass) {
      return klass;
    }
    return null;
  }

  export function registerKlassSymbol(className: string) {
    // TODO: This needs to be kept in sync to how mangleClass works.
    var mangledName = mangleClassName(toUTF8(className));
    if (RuntimeTemplate.prototype.hasOwnProperty(mangledName)) {
      return;
    }
    linkWriter && linkWriter.writeLn("Registering Klass Symbol: " + className);
    if (!RuntimeTemplate.prototype.hasOwnProperty(mangledName)) {
      Object.defineProperty(RuntimeTemplate.prototype, mangledName, {
        configurable: true,
        get: function lazyKlass() {
          linkWriter && linkWriter.writeLn("Load Klass: " + className);
          CLASSES.loadAndLinkClass(className);
          return this[mangledName]; // This should not be recursive at this point.
        }
      });
    }

    if (!jsGlobal.hasOwnProperty(mangledName)) {
      unresolvedSymbols[mangledName] = true;
      Object.defineProperty(jsGlobal, mangledName, {
        configurable: true,
        get: function () {
          linkWriter && linkWriter.writeLn("Load Klass: " + className);
          CLASSES.loadAndLinkClass(className);
          return this[mangledName]; // This should not be recursive at this point.
        }
      });
    }
  }

  export function registerKlassSymbols(classNames: string []) {
    for (var i = 0; i < classNames.length; i++) {
      var className = classNames[i];
      registerKlassSymbol(className);
    }
  }

  function setKlassSymbol(mangledName: string, klass: Klass) {
    Object.defineProperty(jsGlobal, mangledName, {
      value: klass
    });
  }

  function emitKlassConstructor(classInfo: ClassInfo, mangledName: string): Klass {
    var klass: Klass;
    enterTimeline("emitKlassConstructor");
    // TODO: Creating and evaling a Klass here may be too slow at startup. Consider
    // creating a closure, which will probably be slower at runtime.
    var source = [];
    var writer = new IndentingWriter(false, function (x) {
        source.push(x);
    });
    var emitter = new Emitter(writer, false, true, true);
    J2ME.emitKlass(emitter, classInfo);
    (1, eval)(source.join("\n"));
    leaveTimeline("emitKlassConstructor");
    // consoleWriter.writeLn("Synthesizing Klass: " + classInfo.getClassNameSlow());
    // consoleWriter.writeLn(source);
    klass = <Klass>jsGlobal[mangledName];
    release || assert(klass, mangledName);
    klass.toString = function () {
      return "[Synthesized Klass " + classInfo.getClassNameSlow() + "]";
    };
    return klass;
  }

  export function getKlass(classInfo: ClassInfo): Klass {
    if (!classInfo) {
      return null;
    }
    if (classInfo.klass) {
      return classInfo.klass;
    }
    return makeKlass(classInfo);
  }

  function makeKlass(classInfo: ClassInfo): Klass {
    var klass = findKlass(classInfo);
    if (klass) {
      release || assert (!classInfo.isInterface, "Interfaces should not be compiled.");
      linkWriter && linkWriter.greenLn("Found Compiled Klass: " + classInfo.getClassNameSlow());
      release || assert(!classInfo.klass);
      classInfo.klass = klass;
      klass.toString = function () {
        return "[Compiled Klass " + classInfo.getClassNameSlow() + "]";
      };
      if (klass.classSymbols) {
        registerKlassSymbols(klass.classSymbols);
      }
    } else {
      klass = makeKlassConstructor(classInfo);
      release || assert(!classInfo.klass);
      classInfo.klass = klass;
    }

    if (classInfo.superClass && !classInfo.superClass.klass &&
      J2ME.phase === J2ME.ExecutionPhase.Runtime) {
      J2ME.linkKlass(classInfo.superClass);
    }

    var superKlass = getKlass(classInfo.superClass);

    enterTimeline("extendKlass");
    extendKlass(classInfo, klass, superKlass);
    leaveTimeline("extendKlass");

    enterTimeline("registerKlass");
    registerKlass(klass, classInfo);
    leaveTimeline("registerKlass");

    if (classInfo instanceof ArrayClassInfo) {
      klass.isArrayKlass = true;
      var elementKlass = getKlass(classInfo.elementClass);
      elementKlass.arrayKlass = klass;
      klass.elementKlass = elementKlass;
    }

    klass.classInfo = classInfo;

    if (!classInfo.isInterface) {
      initializeInterfaces(klass, classInfo);
    }

    return klass;
  }

  function makeKlassConstructor(classInfo: ClassInfo): Klass {
    var klass: Klass;
    var mangledName = classInfo.mangledName;
    if (classInfo.isInterface) {
      klass = <Klass><any>function () {
        Debug.unexpected("Should never be instantiated.")
      };
      klass.isInterfaceKlass = true;
      klass.toString = function () {
        return "[Interface Klass " + classInfo.getClassNameSlow() + "]";
      };
      setKlassSymbol(mangledName, klass);
    } else if (classInfo instanceof ArrayClassInfo) {
      var elementKlass = getKlass(classInfo.elementClass);
      // Have we already created one? We need to maintain pointer identity.
      if (elementKlass.arrayKlass) {
        return elementKlass.arrayKlass;
      }
      klass = makeArrayKlassConstructor(elementKlass);
    } else if (classInfo instanceof PrimitiveClassInfo) {
      klass = <Klass><any>function () {
        Debug.unexpected("Should never be instantiated.")
      };
      klass.toString = function () {
        return "[Primitive Klass " + classInfo.getClassNameSlow() + "]";
      };
    } else {
      klass = emitKlassConstructor(classInfo, mangledName);
    }
    return klass;
  }

  export function makeArrayKlassConstructor(elementKlass: Klass): Klass {
    var klass = <Klass><any> getArrayConstructor(elementKlass.classInfo.getClassNameSlow());
    if (!klass) {
      klass = <Klass><any> function (size: number) {
        var array = createEmptyObjectArray(size);
        (<any>array).klass = klass;
        return array;
      };
      klass.toString = function () {
        return "[Array of " + elementKlass + "]";
      };
    } else {
      release || assert(!klass.prototype.hasOwnProperty("klass"));
      klass.prototype.klass = klass;
      klass.toString = function () {
        return "[Array of " + elementKlass + "]";
      };
    }
    return klass;
  }

  /**
   * TODO: Find out if we need to also run class initialization here, or if the
   * callers should be calling that instead of this.
   */
  export function linkKlass(classInfo: ClassInfo) {
    // We shouldn't do any linking if we're not in the runtime phase.
    if (phase !== ExecutionPhase.Runtime) {
      return;
    }
    if (classInfo.klass) {
      return;
    }
    enterTimeline("linkKlass", {classInfo: classInfo});
    var mangledName = classInfo.mangledName;
    var klass;
    classInfo.klass = klass = getKlass(classInfo);
    classInfo.klass.classInfo = classInfo;
    if (classInfo instanceof PrimitiveClassInfo) {
      switch (classInfo) {
        case PrimitiveClassInfo.Z: Klasses.boolean = klass; break;
        case PrimitiveClassInfo.C: Klasses.char    = klass; break;
        case PrimitiveClassInfo.F: Klasses.float   = klass; break;
        case PrimitiveClassInfo.D: Klasses.double  = klass; break;
        case PrimitiveClassInfo.B: Klasses.byte    = klass; break;
        case PrimitiveClassInfo.S: Klasses.short   = klass; break;
        case PrimitiveClassInfo.I: Klasses.int     = klass; break;
        case PrimitiveClassInfo.J: Klasses.long    = klass; break;
        default: J2ME.Debug.assertUnreachable("linking primitive " + classInfo.getClassNameSlow())
      }
    } else {
      switch (classInfo.getClassNameSlow()) {
        case "java/lang/Object": Klasses.java.lang.Object = klass; break;
        case "java/lang/Class" : Klasses.java.lang.Class  = klass; break;
        case "java/lang/String": Klasses.java.lang.String = klass; break;
        case "java/lang/Thread": Klasses.java.lang.Thread = klass; break;
        case "java/lang/Exception": Klasses.java.lang.Exception = klass; break;
        case "java/lang/InstantiationException": Klasses.java.lang.InstantiationException = klass; break;
        case "java/lang/IllegalArgumentException": Klasses.java.lang.IllegalArgumentException = klass; break;
        case "java/lang/NegativeArraySizeException": Klasses.java.lang.NegativeArraySizeException = klass; break;
        case "java/lang/IllegalStateException": Klasses.java.lang.IllegalStateException = klass; break;
        case "java/lang/NullPointerException": Klasses.java.lang.NullPointerException = klass; break;
        case "java/lang/RuntimeException": Klasses.java.lang.RuntimeException = klass; break;
        case "java/lang/IndexOutOfBoundsException": Klasses.java.lang.IndexOutOfBoundsException = klass; break;
        case "java/lang/ArrayIndexOutOfBoundsException": Klasses.java.lang.ArrayIndexOutOfBoundsException = klass; break;
        case "java/lang/StringIndexOutOfBoundsException": Klasses.java.lang.StringIndexOutOfBoundsException = klass; break;
        case "java/lang/ArrayStoreException": Klasses.java.lang.ArrayStoreException = klass; break;
        case "java/lang/IllegalMonitorStateException": Klasses.java.lang.IllegalMonitorStateException = klass; break;
        case "java/lang/ClassCastException": Klasses.java.lang.ClassCastException = klass; break;
        case "java/lang/ArithmeticException": Klasses.java.lang.ArithmeticException = klass; break;
        case "java/lang/NegativeArraySizeException": Klasses.java.lang.NegativeArraySizeException = klass; break;
        case "java/lang/ClassNotFoundException": Klasses.java.lang.ClassNotFoundException = klass; break;
        case "javax/microedition/media/MediaException": Klasses.javax.microedition.media.MediaException = klass; break;
        case "java/lang/SecurityException": Klasses.java.lang.SecurityException = klass; break;
        case "java/lang/IllegalThreadStateException": Klasses.java.lang.IllegalThreadStateException = klass; break;
        case "java/io/IOException": Klasses.java.io.IOException = klass; break;
        case "java/io/UnsupportedEncodingException": Klasses.java.io.UnsupportedEncodingException = klass; break;
        case "java/io/UTFDataFormatException": Klasses.java.io.UTFDataFormatException = klass; break;
      }
    }
    linkWriter && linkWriter.writeLn("Link: " + classInfo.getClassNameSlow() + " -> " + klass);

    enterTimeline("linkKlassMethods");
    linkKlassMethods(classInfo.klass);
    leaveTimeline("linkKlassMethods");

    enterTimeline("linkKlassFields");
    linkKlassFields(classInfo.klass);
    leaveTimeline("linkKlassFields");
    leaveTimeline("linkKlass");

    if (klass === Klasses.java.lang.Object) {
      extendKlass(classInfo, <Klass><any>Array, Klasses.java.lang.Object);
    }
  }

  function findNativeMethodBinding(methodInfo: MethodInfo) {
    var classBindings = BindingsMap.get(methodInfo.classInfo.utf8Name);
    if (classBindings && classBindings.native) {
      var method = classBindings.native[methodInfo.name + "." + methodInfo.signature];
      if (method) {
        return method;
      }
    }
    return null;
  }

  function reportError(method, key) {
    return function() {
      try {
        return method.apply(this, arguments);
      } catch (e) {
        // Filter JAVA exception and only report the native js exception, which
        // cannnot be handled properly by the JAVA code.
        if (!e.klass) {
          stderrWriter.errorLn("Native " + key + " throws: " + e);
        }
        throw e;
      }
    };
  }

  function findNativeMethodImplementation(methodInfo: MethodInfo) {
    // Look in bindings first.
    var binding = findNativeMethodBinding(methodInfo);
    if (binding) {
      return release ? binding : reportError(binding, methodInfo.implKey);
    }
    if (methodInfo.isNative) {
      var implKey = methodInfo.implKey;
      if (implKey in Native) {
        return release ? Native[implKey] : reportError(Native[implKey], implKey);
      } else {
        // Some Native MethodInfos are constructed but never called;
        // that's fine, unless we actually try to call them.
        return function missingImplementation() {
          stderrWriter.errorLn("implKey " + implKey + " is native but does not have an implementation.");
        }
      }
    }
    return null;
  }

  function prepareInterpretedMethod(methodInfo: MethodInfo): Function {

    // Adapter for the most common case.
    if (!methodInfo.isSynchronized && !methodInfo.hasTwoSlotArguments) {
      var method = function fastInterpreterFrameAdapter() {
        var frame = Frame.create(methodInfo, []);
        var j = 0;
        if (!methodInfo.isStatic) {
          frame.local[j++] = this;
        }
        var slots = methodInfo.argumentSlots;
        for (var i = 0; i < slots; i++) {
          frame.local[j++] = arguments[i];
        }
        return $.ctx.executeFrame(frame);
      };
      (<any>method).methodInfo = methodInfo;
      return method;
    }

    var method = function interpreterFrameAdapter() {
      var frame = Frame.create(methodInfo, []);
      var j = 0;
      if (!methodInfo.isStatic) {
        frame.local[j++] = this;
      }
      var signatureKinds = methodInfo.signatureKinds;
      release || assert (arguments.length === signatureKinds.length - 1,
        "Number of adapter frame arguments (" + arguments.length + ") does not match signature descriptor.");
      for (var i = 1; i < signatureKinds.length; i++) {
        frame.local[j++] = arguments[i - 1];
        if (isTwoSlot(signatureKinds[i])) {
          frame.local[j++] = null;
        }
      }
      if (methodInfo.isSynchronized) {
        if (!frame.lockObject) {
          frame.lockObject = methodInfo.isStatic
            ? methodInfo.classInfo.getClassObject()
            : frame.local[0];
        }
        $.ctx.monitorEnter(frame.lockObject);
        if (U === VMState.Pausing) {
          $.ctx.pushFrame(frame);
          return;
        }
      }
      return $.ctx.executeFrame(frame);
    };
    (<any>method).methodInfo = methodInfo;
    return method;
  }

  function findCompiledMethod(klass: Klass, methodInfo: MethodInfo): Function {
    var fn = jsGlobal[methodInfo.mangledClassAndMethodName];
    if (fn) {
      aotMethodCount++;
      methodInfo.onStackReplacementEntryPoints = aotMetaData[methodInfo.mangledClassAndMethodName].osr;
      return fn;
    }
    if (enableCompiledMethodCache) {
      var cachedMethod;
      if ((cachedMethod = CompiledMethodCache.get(methodInfo.implKey))) {
        cachedMethodCount ++;
        linkMethod(methodInfo, cachedMethod.source, cachedMethod.referencedClasses, cachedMethod.onStackReplacementEntryPoints);
      }
    }

    return jsGlobal[methodInfo.mangledClassAndMethodName];
  }

  /**
   * Creates convenience getters / setters on Java objects.
   */
  function linkKlassFields(klass: Klass) {
    var classInfo = klass.classInfo;
    var classBindings = BindingsMap.get(classInfo.utf8Name);
    if (classBindings && classBindings.fields) {
      release || assert(!classBindings.fields.staticSymbols, "Static fields are not supported yet");

      var instanceSymbols = classBindings.fields.instanceSymbols;

      for (var fieldName in instanceSymbols) {
        var fieldSignature = instanceSymbols[fieldName];

        var field = classInfo.getFieldByName(toUTF8(fieldName), toUTF8(fieldSignature), false);

        release || assert(!field.isStatic, "Static field was defined as instance in BindingsMap");
        var object = field.isStatic ? klass : klass.prototype;
        release || assert (!object.hasOwnProperty(fieldName), "Should not overwrite existing properties.");
        var getter = FunctionUtilities.makeForwardingGetter(field.mangledName);
        var setter;
        if (release) {
          setter = FunctionUtilities.makeForwardingSetter(field.mangledName);
        } else {
          setter = FunctionUtilities.makeDebugForwardingSetter(field.mangledName, getKindCheck(field.kind));
        }
        Object.defineProperty(object, fieldName, {
          get: getter,
          set: setter,
          configurable: true,
          enumerable: false
        });
        delete instanceSymbols[fieldName];
      }

      if (!release) {
        if (classBindings.fields.staticSymbols) {
          var staticSymbolNames = Object.keys(classBindings.fields.staticSymbols);
          assert(staticSymbolNames.length === 0, "Unlinked symbols: " + staticSymbolNames.join(", "));
        }
        if (classBindings.fields.instanceSymbols) {
          var instanceSymbolNames = Object.keys(classBindings.fields.instanceSymbols);
          assert(instanceSymbolNames.length === 0, "Unlinked symbols: " + instanceSymbolNames.join(", "));
        }
      }
    }
  }

  function profilingWrapper(fn: Function, methodInfo: MethodInfo, methodType: MethodType) {
    if (methodType === MethodType.Interpreted) {
      // Profiling for interpreted functions is handled by the context.
      return fn;
    }
    var code;
    if (methodInfo.isNative) {
      if (methodInfo.returnKind === Kind.Void) {
        code = new Uint8Array([Bytecode.Bytecodes.RETURN]);
      } else if (isTwoSlot(methodInfo.returnKind)) {
        code = new Uint8Array([Bytecode.Bytecodes.LRETURN]);
      } else {
        code = new Uint8Array([Bytecode.Bytecodes.IRETURN]);
      }
    }


    return function (a, b, c, d) {
      var key = methodInfo.implKey;
      try {
        var ctx = $.ctx;
        ctx.enterMethodTimeline(key, methodType);
        var r;
        switch (arguments.length) {
          case 0:
            r = fn.call(this);
            break;
          case 1:
            r = fn.call(this, a);
            break;
          case 2:
            r = fn.call(this, a, b);
            break;
          case 3:
            r = fn.call(this, a, b, c);
            break;
          default:
            r = fn.apply(this, arguments);
        }
        if (U) {
          if (methodInfo.isNative) {
            // A fake frame that just returns is pushed so when the ctx resumes from the unwind
            // the frame will be popped triggering a leaveMethodTimeline.
            var fauxFrame = Frame.create(null, []);
            fauxFrame.methodInfo = methodInfo;
            fauxFrame.code = code;
            ctx.bailoutFrames.unshift(fauxFrame);
          }
        } else {
          ctx.leaveMethodTimeline(key, methodType);
        }
      } catch (e) {
        ctx.leaveMethodTimeline(key, methodType);
        throw e;
      }
      return r;
    };
  }

  function tracingWrapper(fn: Function, methodInfo: MethodInfo, methodType: MethodType) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      traceWriter.enter("> " + MethodType[methodType][0] + " " + methodInfo.implKey + " " + (methodInfo.stats.callCount ++));
      var s = performance.now();
      var value = fn.apply(this, args);
      traceWriter.outdent();
      return value;
    };
  }

  export function getLinkedMethod(methodInfo: MethodInfo) {
    if (methodInfo.fn) {
      return methodInfo.fn;
    }
    linkKlassMethod(methodInfo.classInfo.klass, methodInfo);
    assert (methodInfo.fn);
    return methodInfo.fn;
  }

  function linkKlassMethod(klass: Klass, methodInfo: MethodInfo) {
    runtimeCounter && runtimeCounter.count("linkKlassMethod");
    var fn;
    var methodType;
    var nativeMethod = findNativeMethodImplementation(methodInfo);
    if (nativeMethod) {
      linkWriter && linkWriter.writeLn("Method: " + methodInfo.name + methodInfo.signature + " -> Native");
      fn = nativeMethod;
      methodType = MethodType.Native;
      methodInfo.state = MethodState.Compiled;
    } else {
      fn = findCompiledMethod(klass, methodInfo);
      if (fn) {
        linkWriter && linkWriter.greenLn("Method: " + methodInfo.name + methodInfo.signature + " -> Compiled");
        methodType = MethodType.Compiled;
        // Save method info so that we can figure out where we are bailing
        // out from.
        jitMethodInfos[fn.name] = methodInfo;
        methodInfo.state = MethodState.Compiled;
      } else {
        linkWriter && linkWriter.warnLn("Method: " + methodInfo.name + methodInfo.signature + " -> Interpreter");
        methodType = MethodType.Interpreted;
        fn = prepareInterpretedMethod(methodInfo);
      }
    }

    if (profile || traceWriter) {
      fn = wrapMethod(fn, methodInfo, methodType);
    }

    klass.M[methodInfo.index] = methodInfo.fn = fn;

    if (!methodInfo.isStatic && methodInfo.virtualName) {
      release || assert(klass.prototype.hasOwnProperty(methodInfo.virtualName));
      klass.prototype[methodInfo.virtualName] = fn;
      var classBindings = BindingsMap.get(klass.classInfo.utf8Name);
      if (classBindings && classBindings.methods && classBindings.methods.instanceSymbols) {
        var methodKey = classBindings.methods.instanceSymbols[methodInfo.name + "." + methodInfo.signature];
        if (methodKey) {
          klass.prototype[methodKey] = fn;
        }
      }
    }
  }

  function linkKlassMethods(klass: Klass) {
    var methods = klass.classInfo.getMethods();
    if (!methods) {
      return;
    }
    linkWriter && linkWriter.enter("Link Klass Methods: " + klass);
    var methods = klass.classInfo.getMethods();

    var vTable = klass.classInfo.vTable;
    if (vTable) {
      // Eagerly install interface forwarders.
      for (var i = 0; i < vTable.length; i++) {
        var methodInfo = vTable[i];
        if (methodInfo.implementsInterface) {
          release || assert(methodInfo.mangledName);
          klass.prototype[methodInfo.mangledName] = makeInterfaceMethodForwarder(methodInfo.vTableIndex);
        }
      }
    }

    linkWriter && linkWriter.outdent();
  }

  /**
   * Creates lookup tables used to efficiently implement type checks.
   */
  function initializeKlassTables(klass: Klass) {
    linkWriter && linkWriter.writeLn("initializeKlassTables: " + klass);
    klass.depth = klass.superKlass ? klass.superKlass.depth + 1 : 0;
    assert (klass.display === undefined, "Display should only be defined once.")
    var display = klass.display = new Array(32);

    var i = klass.depth;
    while (klass) {
      display[i--] = klass;
      klass = klass.superKlass;
    }
    release || assert(i === -1, i);
  }

  function initializeInterfaces(klass: Klass, classInfo: ClassInfo) {
    release || assert (!klass.interfaces);
    var interfaces = klass.interfaces = klass.superKlass ? klass.superKlass.interfaces.slice() : [];

    var interfaceClassInfos = classInfo.getAllInterfaces();
    if (interfaceClassInfos) {
      for (var j = 0; j < interfaceClassInfos.length; j++) {
        ArrayUtilities.pushUnique(interfaces, getKlass(interfaceClassInfos[j]));
      }
    }
  }

  // Links the virtual method at a given index.
  function linkVirtualMethodByIndex(self: java.lang.Object, index: number) {
    // Self is the object on which the trampoline is called. We want to figure
    // out the appropriate prototype object where we need to link the method. To
    // do this we look at self's class vTable, then find out the class of the
    // bound method and then call linkKlassMethod to patch it on the appropriate
    // prototype.
    var klass = self.klass;
    var classInfo = klass.classInfo;
    var methodInfo = classInfo.vTable[index];
    var methodKlass = methodInfo.classInfo.klass;
    linkKlassMethod(methodKlass, methodInfo);
    release || assert(methodInfo.fn);
    return methodInfo.fn;
  }

  // Cache interface forwarders.
  var interfaceMethodForwarders = new Array(256);

  // Creates a forwarder function that dispatches to a specified virtual
  // name. These are used for interface dispatch.
  function makeInterfaceMethodForwarder(index: number) {
    var forwarder = interfaceMethodForwarders[index];
    if (forwarder) {
      return forwarder;
    }
    runtimeCounter && runtimeCounter.count("makeInterfaceMethodForwarder");
    return interfaceMethodForwarders[index] = new Function("return this.v" + index + ".apply(this, arguments);");
  }

  // Cache virtual trampolines.
  var virtualMethodTrampolines = new Array(256);

  // Creates a reusable trampoline function for a given index in the vTable.
  function makeVirtualMethodTrampoline(index: number) {
    var trampoline = virtualMethodTrampolines[index];
    if (trampoline) {
      return trampoline;
    }
    runtimeCounter && runtimeCounter.count("makeVirtualMethodTrampoline");
    return virtualMethodTrampolines[index] = function vTrampoline() {
      return linkVirtualMethodByIndex(this, index).apply(this, arguments);
    };
  }

  function linkMethodByIndex(klass: Klass, index: number) {
    var methodInfo = klass.classInfo.getMethodByIndex(index);
    linkKlassMethod(klass, methodInfo);
    release || assert(methodInfo.fn);
    return methodInfo.fn;
  }

  function makeMethodTrampoline(klass: Klass, index: number) {
    runtimeCounter && runtimeCounter.count("makeMethodTrampoline");
    return function () {
      return linkMethodByIndex(klass, index).apply(this, arguments);
    };
  }

  // Inserts trampolines for virtual methods on prototype objects whenever new methods
  // are defined. Inherited methods don't need trampolines since they already have them
  // in the super class prototypes.
  function initializeKlassVirtualMethodTrampolines(classInfo: ClassInfo, klass: Klass) {
    var vTable = classInfo.vTable;
    for (var i = 0; i < vTable.length; i++) {
      if (vTable[i].classInfo === classInfo) {
        runtimeCounter && runtimeCounter.count("fillTrampoline");
        // TODO: Uncomment this assertion. Array prototype has Object prototype on the
        // prototype hierarchy, and trips this assert since it already has the virtual
        // trampolines installed.
        // assert (!klass.prototype.hasOwnProperty("v" + i));
        klass.prototype["v" + i] = makeVirtualMethodTrampoline(i);
      }
    }
  }

  function initializeKlassMethodTrampolines(classInfo: ClassInfo, klass: Klass) {
    var count = classInfo.getMethodCount();
    for (var i = 0; i < count; i++) {
      klass["m" + i] = makeMethodTrampoline(klass, i);
    }
  }

  function klassMethodLink(index: number) {
    var klass: Klass = this;
    var fn = klass.M[index];
    if (fn) {
      return fn;
    }
    linkKlassMethod(klass, klass.classInfo.getMethodByIndex(index));
    release || assert(klass.M[index], "Method should be linked now.");
    return klass.M[index];
  }

  function klassResolveConstantPoolEntry(index: number) {
    var klass: Klass = this;
    return klass.classInfo.constantPool.resolve(index, TAGS.CONSTANT_Any);
  }

  export function extendKlass(classInfo: ClassInfo, klass: Klass, superKlass: Klass) {
    klass.superKlass = superKlass;
    if (superKlass) {
      if (isPrototypeOfFunctionMutable(klass)) {
        linkWriter && linkWriter.writeLn("Extending: " + klass + " -> " + superKlass);
        klass.prototype = Object.create(superKlass.prototype);
        release || assert((<any>Object).getPrototypeOf(klass.prototype) === superKlass.prototype);
      } else {
        release || assert(!superKlass.superKlass, "Should not have a super-super-klass.");
        for (var key in superKlass.prototype) {
          klass.prototype[key] = superKlass.prototype[key];
        }
      }
    } else {
      klass.prototype = {};
    }
    klass.prototype.klass = klass;
    initializeKlassTables(klass);
    initializeKlassVirtualMethodTrampolines(classInfo, klass);

    // Method linking.
    klass.m = klassMethodLink;
    klass.c = klassResolveConstantPoolEntry;
    klass.M = new Array(classInfo.getMethodCount());
  }

  /**
   * Number of methods that have been compiled thus far.
   */
  export var compiledMethodCount = 0;

  /**
   * Number of methods that have not been compiled thus far.
   */
  export var notCompiledMethodCount = 0;

  /**
   * Number of methods that have been loaded from the code cache thus far.
   */
  export var cachedMethodCount = 0;

  /**
   * Number of methods that have been loaded from ahead of time compiled code thus far.
   */
  export var aotMethodCount = 0;

  /**
   * Number of ms that have been spent compiled code thus far.
   */
  var totalJITTime = 0;

  /**
   * Compiles method and links it up at runtime.
   */
  export function compileAndLinkMethod(methodInfo: MethodInfo) {
    // Don't do anything if we're past the compiled state.
    if (methodInfo.state >= MethodState.Compiled) {
      return;
    }

    // Don't compile methods that are too large.
    if (methodInfo.codeAttribute.code.length > 3000 && !config.forceRuntimeCompilation) {
      jitWriter && jitWriter.writeLn("Not compiling: " + methodInfo.implKey + " because it's too large. " + methodInfo.codeAttribute.code.length);
      methodInfo.state = MethodState.NotCompiled;
      notCompiledMethodCount ++;
      return;
    }

    if (enableCompiledMethodCache) {
      var cachedMethod;
      if (cachedMethod = CompiledMethodCache.get(methodInfo.implKey)) {
        cachedMethodCount ++;
        jitWriter && jitWriter.writeLn("Getting " + methodInfo.implKey + " from compiled method cache");
        return linkMethod(methodInfo, cachedMethod.source, cachedMethod.referencedClasses, cachedMethod.onStackReplacementEntryPoints);
      }
    }

    var mangledClassAndMethodName = methodInfo.mangledClassAndMethodName;

    jitWriter && jitWriter.enter("Compiling: " + methodInfo.implKey + ", currentBytecodeCount: " + methodInfo.stats.bytecodeCount);
    var s = performance.now();

    var compiledMethod;
    enterTimeline("Compiling");
    try {
      compiledMethod = baselineCompileMethod(methodInfo, CompilationTarget[enableCompiledMethodCache ? "Static" : "Runtime"]);
      compiledMethodCount ++;
    } catch (e) {
      methodInfo.state = MethodState.CannotCompile;
      jitWriter && jitWriter.writeLn("Cannot compile: " + methodInfo.implKey + " because of " + e);
      leaveTimeline("Compiling");
      return;
    }
    leaveTimeline("Compiling");
    var compiledMethodName = mangledClassAndMethodName;
    var source = "function " + compiledMethodName +
                 "(" + compiledMethod.args.join(",") + ") {\n" +
                   compiledMethod.body +
                 "\n}";

    codeWriter && codeWriter.writeLns(source);
    var referencedClasses = compiledMethod.referencedClasses.map(function(v) { return v.getClassNameSlow() });

    if (enableCompiledMethodCache) {
      CompiledMethodCache.put({
        key: methodInfo.implKey,
        source: source,
        referencedClasses: referencedClasses,
        onStackReplacementEntryPoints: compiledMethod.onStackReplacementEntryPoints
      });
    }

    linkMethod(methodInfo, source, referencedClasses, compiledMethod.onStackReplacementEntryPoints);

    var methodJITTime = (performance.now() - s);
    totalJITTime += methodJITTime;
    if (jitWriter) {
      jitWriter.leave(
        "Compilation Done: " + methodJITTime.toFixed(2) + " ms, " +
        "codeSize: " + methodInfo.codeAttribute.code.length + ", " +
        "sourceSize: " + compiledMethod.body.length);
      jitWriter.writeLn("Total: " + totalJITTime.toFixed(2) + " ms");
    }
  }

  function wrapMethod(fn, methodInfo: MethodInfo, methodType: MethodType) {
    if (profile) {
      fn = profilingWrapper(fn, methodInfo, methodType);
    }

    if (traceWriter) {
      fn = tracingWrapper(fn, methodInfo, methodType);
    }
    return fn;
  }

  /**
   * Links up compiled method at runtime.
   */
  export function linkMethod(methodInfo: MethodInfo, source: string, referencedClasses: string[], onStackReplacementEntryPoints: any) {
    jitWriter && jitWriter.writeLn("Link method: " + methodInfo.implKey);

    enterTimeline("Eval Compiled Code");
    // This overwrites the method on the global object.
    (1, eval)(source);
    leaveTimeline("Eval Compiled Code");

    var mangledClassAndMethodName = methodInfo.mangledClassAndMethodName;
    var fn = jsGlobal[mangledClassAndMethodName];
    if (profile || traceWriter) {
      fn = wrapMethod(fn, methodInfo, MethodType.Compiled);
    }
    var klass = methodInfo.classInfo.klass;
    klass.M[methodInfo.index] = methodInfo.fn = fn;
    methodInfo.state = MethodState.Compiled;
    methodInfo.onStackReplacementEntryPoints = onStackReplacementEntryPoints;

    // Link member methods on the prototype.
    if (!methodInfo.isStatic && methodInfo.virtualName) {
      klass.prototype[methodInfo.virtualName] = fn;
    }

    // Make JITed code available in the |jitMethodInfos| so that bailout
    // code can figure out the caller.
    jitMethodInfos[mangledClassAndMethodName] = methodInfo;

    // Make sure all the referenced symbols are registered.
    for (var i = 0; i < referencedClasses.length; i++) {
      registerKlassSymbol(referencedClasses[i]);
    }
  }

  export function isAssignableTo(from: Klass, to: Klass): boolean {
    if (from === to) {
      return true;
    }
    if (to.isInterfaceKlass) {
      return from.interfaces.indexOf(to) >= 0;
    } else if (to.isArrayKlass) {
      if (!from.isArrayKlass) {
        return false;
      }
      return isAssignableTo(from.elementKlass, to.elementKlass);
    }
    return from.display[to.depth] === to;
  }

  export function instanceOfKlass(object: java.lang.Object, klass: Klass): boolean {
    return object !== null && isAssignableTo(object.klass, klass);
  }

  export function instanceOfInterface(object: java.lang.Object, klass: Klass): boolean {
    release || assert(klass.isInterfaceKlass);
    return object !== null && isAssignableTo(object.klass, klass);
  }

  export function checkCastKlass(object: java.lang.Object, klass: Klass) {
    if (object !== null && !isAssignableTo(object.klass, klass)) {
      throw $.newClassCastException();
    }
  }

  export function checkCastInterface(object: java.lang.Object, klass: Klass) {
    if (object !== null && !isAssignableTo(object.klass, klass)) {
      throw $.newClassCastException();
    }
  }

  function createEmptyObjectArray(size: number) {
    var array = new Array(size);
    for (var i = 0; i < size; i++) {
      array[i] = null;
    }
    return array;
  }

  export function newObject(klass: Klass): java.lang.Object {
    return new klass();
  }

  export function newString(str: string): java.lang.String {
    if (str === null || str === undefined) {
      return null;
    }
    var object = <java.lang.String>newObject(Klasses.java.lang.String);
    object.str = str;
    return object;
  }

  export function newArray(klass: Klass, size: number) {
    if (size < 0) {
      throwNegativeArraySizeException();
    }
    var constructor: any = getArrayKlass(klass);
    return new constructor(size);
  }
  
  export function newMultiArray(klass: Klass, lengths: number[]) {
    var length = lengths[0];
    var array = newArray(klass.elementKlass, length);
    if (lengths.length > 1) {
      lengths = lengths.slice(1);
      for (var i = 0; i < length; i++) {
        array[i] = newMultiArray(klass.elementKlass, lengths);
      }
    }
    return array;
  }

  export function throwNegativeArraySizeException() {
    throw $.newNegativeArraySizeException();
  }

  export function newObjectArray(size: number): java.lang.Object[] {
    return newArray(Klasses.java.lang.Object, size);
  }

  export function newStringArray(size: number): java.lang.String[]  {
    return newArray(Klasses.java.lang.String, size);
  }

  export function newByteArray(size: number): number[]  {
    return newArray(Klasses.byte, size);
  }

  export function newIntArray(size: number): number[]  {
    return newArray(Klasses.int, size);
  }

  export function getArrayKlass(elementKlass: Klass): Klass {
    // Have we already created one? We need to maintain pointer identity.
    if (elementKlass.arrayKlass) {
      return elementKlass.arrayKlass;
    }
    var className = elementKlass.classInfo.getClassNameSlow();
    if (!(elementKlass.classInfo instanceof PrimitiveClassInfo) && className[0] !== "[") {
      className = "L" + className + ";";
    }
    className = "[" + className;
    return getKlass(CLASSES.getClass(className));
  }

  export function toDebugString(value: any): string {
    if (typeof value !== "object") {
      return String(value);
    }
    if (value === undefined) {
      return "undefined";
    }
    if (!value) {
      return "null";
    }
    if (!value.klass) {
      return "no klass";
    }
    if (!value.klass.classInfo) {
      return value.klass + " no classInfo"
    }
    var hashcode = "";
    if (value._hashCode) {
      hashcode = " 0x" + value._hashCode.toString(16).toUpperCase();
    }
    if (value instanceof Klasses.java.lang.String) {
      return "\"" + value.str + "\"";
    }
    return "[" + value.klass.classInfo.getClassNameSlow() + hashcode + "]";
  }

  export function fromJavaString(value: java.lang.String): string {
    if (!value) {
      return null;
    }
    return value.str;
  }

  export function checkDivideByZero(value: number) {
    if (value === 0) {
      throwArithmeticException();
    }
  }

  export function checkDivideByZeroLong(value: Long) {
    if (value.isZero()) {
      throwArithmeticException();
    }
  }

  /**
   * Do bounds check using only one branch. The math works out because array.length
   * can't be larger than 2^31 - 1. So |index| >>> 0 will be larger than
   * array.length if it is less than zero. We need to make the right side unsigned
   * as well because otherwise the SM optimization that converts this to an
   * unsinged branch doesn't kick in.
   */
  export function checkArrayBounds(array: any [], index: number) {
    if ((index >>> 0) >= (array.length >>> 0)) {
      throw $.newArrayIndexOutOfBoundsException(String(index));
    }
  }

  export function throwArrayIndexOutOfBoundsException(index: number) {
    throw $.newArrayIndexOutOfBoundsException(String(index));
  }

  export function throwArithmeticException() {
    throw $.newArithmeticException("/ by zero");
  }

  export function checkArrayStore(array: java.lang.Object, value: any) {
    var arrayKlass = array.klass;
    if (value && !isAssignableTo(value.klass, arrayKlass.elementKlass)) {
      throw $.newArrayStoreException();
    }
  }

  export function checkNull(object: java.lang.Object) {
    if (!object) {
      throw $.newNullPointerException();
    }
  }

  export enum Constants {
    BYTE_MIN = -128,
    BYTE_MAX = 127,
    SHORT_MIN = -32768,
    SHORT_MAX = 32767,
    CHAR_MIN = 0,
    CHAR_MAX = 65535,
    INT_MIN = -2147483648,
    INT_MAX =  2147483647
  }

  export function monitorEnter(object: J2ME.java.lang.Object) {
    $.ctx.monitorEnter(object);
  }

  export function monitorExit(object: J2ME.java.lang.Object) {
    $.ctx.monitorExit(object);
  }

  export function translateException(e) {
    if (e.name === "TypeError") {
      // JavaScript's TypeError is analogous to a NullPointerException.
      return $.newNullPointerException(e.message);
    }
    return e;
  }

  var initializeMethodInfo = null;
  export function classInitCheck(classInfo: ClassInfo) {
    if (classInfo instanceof ArrayClassInfo || $.initialized[classInfo.getClassNameSlow()]) {
      return;
    }
    linkKlass(classInfo);
    var runtimeKlass = $.getRuntimeKlass(classInfo.klass);
    if (!initializeMethodInfo) {
      initializeMethodInfo = Klasses.java.lang.Class.classInfo.getMethodByNameString("initialize", "()V");
    }
    runtimeKlass.classObject[initializeMethodInfo.virtualName]();
  }

  /**
   * Last time we preempted a thread.
   */
  var lastPreemption = 0;

  /**
   * Number of ms between preemptions, chosen arbitrarily.
   */
  var preemptionInterval = 100;

  /**
   * Number of preemptions thus far.
   */
  export var preemptionCount = 0;

  /**
   * TODO: We will almost always preempt the next time we call this if the application
   * has been idle. Figure out a better heurisitc here, maybe measure the frequency at
   * at which |checkPreemption| is invoked and ony preempt if the frequency is sustained
   * for a longer period of time *and* the time since we last preempted is above the
   * |preemptionInterval|.
   */
  export function preempt() {
    var now = performance.now();
    var elapsed = now - lastPreemption;
    if (elapsed > preemptionInterval) {
      lastPreemption = now;
      preemptionCount ++;
      threadWriter && threadWriter.writeLn("Preemption timeout: " + elapsed.toFixed(2) + " ms, samples: " + PS + ", count: " + preemptionCount);
      $.yield("preemption");
    }
  }

  export class UnwindThrowLocation {
    static instance: UnwindThrowLocation = new UnwindThrowLocation();
    pc: number;
    sp: number;
    nextPC: number;
    constructor() {
      this.pc = 0;
      this.sp = 0;
      this.nextPC = 0;
    }
    setLocation(pc: number, nextPC: number, sp: number) {
      this.pc = pc;
      this.sp = sp;
      this.nextPC = nextPC;
      return this;
    }
    getPC() {
      return this.pc;
    }
    getSP() {
      return this.sp;
    }
    getNextPC() {
      return this.nextPC;
    }
  }

  /**
   * Generic unwind throw.
   */
  export function throwUnwind(pc: number, nextPC: number = pc + 3, sp: number = 0) {
    throw UnwindThrowLocation.instance.setLocation(pc, nextPC, sp);
  }

  /**
   * Unwind throws with different stack heights. This is useful so we can
   * save a few bytes encoding the stack height in the function name.
   */
  export function throwUnwind0(pc: number, nextPC: number = pc + 3) {
    throwUnwind(pc, nextPC, 0);
  }

  export function throwUnwind1(pc: number, nextPC: number = pc + 3) {
    throwUnwind(pc, nextPC, 1);
  }

  export function throwUnwind2(pc: number, nextPC: number = pc + 3) {
    throwUnwind(pc, nextPC, 2);
  }

  export function throwUnwind3(pc: number, nextPC: number = pc + 3) {
    throwUnwind(pc, nextPC, 3);
  }

  export function throwUnwind4(pc: number, nextPC: number = pc + 3) {
    throwUnwind(pc, nextPC, 4);
  }

  export function throwUnwind5(pc: number, nextPC: number = pc + 3) {
    throwUnwind(pc, nextPC, 5);
  }

  export function throwUnwind6(pc: number, nextPC: number = pc + 3) {
    throwUnwind(pc, nextPC, 6);
  }

  export function throwUnwind7(pc: number, nextPC: number = pc + 3) {
    throwUnwind(pc, nextPC, 7);
  }
}

var Runtime = J2ME.Runtime;

var AOTMD = J2ME.aotMetaData;

/**
 * Are we currently unwinding the stack because of a Yield? This technically
 * belonges to a context but we store it in the global object because it is
 * read very often.
 */
var U: J2ME.VMState = J2ME.VMState.Running;

// Several unwind throws for different stack heights.

var B0 = J2ME.throwUnwind0;
var B1 = J2ME.throwUnwind1;
var B2 = J2ME.throwUnwind2;
var B3 = J2ME.throwUnwind3;
var B4 = J2ME.throwUnwind4;
var B5 = J2ME.throwUnwind5;
var B6 = J2ME.throwUnwind6;
var B7 = J2ME.throwUnwind7;

/**
 * OSR Frame.
 */
var O: J2ME.Frame = null;

/**
 * Runtime exports for compiled code.
 * DO NOT use these short names outside of compiled code.
 */
var IOK = J2ME.instanceOfKlass;
var IOI = J2ME.instanceOfInterface;

var CCK = J2ME.checkCastKlass;
var CCI = J2ME.checkCastInterface;

var AK = J2ME.getArrayKlass;
var NA = J2ME.newArray;
var NM = J2ME.newMultiArray;

var CDZ = J2ME.checkDivideByZero;
var CDZL = J2ME.checkDivideByZeroLong;

var CAB = J2ME.checkArrayBounds;
var CAS = J2ME.checkArrayStore;

var ME = J2ME.monitorEnter;
var MX = J2ME.monitorExit;
var TE = J2ME.translateException;
var TI = J2ME.throwArrayIndexOutOfBoundsException;
var TA = J2ME.throwArithmeticException;
var TN = J2ME.throwNegativeArraySizeException;

var PE = J2ME.preempt;
var PS = 0; // Preemption samples.
