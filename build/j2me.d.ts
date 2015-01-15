declare var jsGlobal: any;
declare var inBrowser: boolean;
declare var putstr: any;
declare var printErr: any;
/** @const */ declare var release: boolean;
/** @const */ declare var profile: boolean;
declare var dateNow: () => number;
declare var dump: (message: string) => void;
declare function dumpLine(s: any): void;
declare function log(message?: any, ...optionalParams: any[]): void;
declare function warn(message?: any, ...optionalParams: any[]): void;
interface String {
    padRight(c: string, n: number): string;
    padLeft(c: string, n: number): string;
    endsWith(s: string): boolean;
}
interface Function {
    boundTo: boolean;
}
interface Math {
    imul(a: number, b: number): number;
    /**
     * Returns the number of leading zeros of a number.
     * @param x A numeric expression.
     */
    clz32(x: number): number;
}
interface Error {
    stack: string;
}
interface Uint8ClampedArray extends ArrayBufferView {
    BYTES_PER_ELEMENT: number;
    length: number;
    [index: number]: number;
    get(index: number): number;
    set(index: number, value: number): void;
    set(array: Uint8Array, offset?: number): void;
    set(array: number[], offset?: number): void;
    subarray(begin: number, end?: number): Uint8ClampedArray;
}
declare var Uint8ClampedArray: {
    new (length: number): Uint8ClampedArray;
    new (array: Uint8Array): Uint8ClampedArray;
    new (array: number[]): Uint8ClampedArray;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8ClampedArray;
    prototype: Uint8ClampedArray;
    BYTES_PER_ELEMENT: number;
};
declare module J2ME {
    function isIdentifierStart(c: any): boolean;
    function isIdentifierPart(c: any): boolean;
    enum CharacterCodes {
        _0 = 48,
        _1 = 49,
        _2 = 50,
        _3 = 51,
        _4 = 52,
        _5 = 53,
        _6 = 54,
        _7 = 55,
        _8 = 56,
        _9 = 57,
    }
    /**
     * The buffer length required to contain any unsigned 32-bit integer.
     */
    /** @const */ var UINT32_CHAR_BUFFER_LENGTH: number;
    /** @const */ var UINT32_MAX: number;
    /** @const */ var UINT32_MAX_DIV_10: number;
    /** @const */ var UINT32_MAX_MOD_10: number;
    function isString(value: any): boolean;
    function isFunction(value: any): boolean;
    function isNumber(value: any): boolean;
    function isInteger(value: any): boolean;
    function isArray(value: any): boolean;
    function isNumberOrString(value: any): boolean;
    function isObject(value: any): boolean;
    function toNumber(x: any): number;
    function isNumericString(value: string): boolean;
    /**
     * Whether the specified |value| is a number or the string representation of a number.
     */
    function isNumeric(value: any): boolean;
    /**
     * Whether the specified |value| is an unsigned 32 bit number expressed as a number
     * or string.
     */
    function isIndex(value: any): boolean;
    function isNullOrUndefined(value: any): boolean;
    module Debug {
        function backtrace(): any;
        function error(message: string): void;
        function assert(condition: any, message?: any): void;
        function assertUnreachable(msg: string): void;
        function assertNotImplemented(condition: boolean, message: string): void;
        function warning(message: string): void;
        function notUsed(message: string): void;
        function notImplemented(message: string): void;
        function abstractMethod(message: string): void;
        function somewhatImplemented(message: string): void;
        function unexpected(message?: any): void;
        function untested(message?: any): void;
    }
    function getTicks(): number;
    module ArrayUtilities {
        /**
         * Pops elements from a source array into a destination array. This avoids
         * allocations and should be faster. The elements in the destination array
         * are pushed in the same order as they appear in the source array:
         *
         * popManyInto([1, 2, 3], 2, dst) => dst = [2, 3]
         */
        function popManyInto(src: any[], count: number, dst: any[]): void;
        function popMany<T>(array: T[], count: number): T[];
        /**
         * Just deletes several array elements from the end of the list.
         */
        function popManyIntoVoid(array: any[], count: number): void;
        function pushMany(dst: any[], src: any[]): void;
        function top(array: any[]): any;
        function last(array: any[]): any;
        function peek(array: any[]): any;
        function indexOf<T>(array: T[], value: T): number;
        function pushUnique<T>(array: T[], value: T): number;
        function unique<T>(array: T[]): T[];
        function copyFrom(dst: any[], src: any[]): void;
        /**
         * Makes sure that a typed array has the requested capacity. If required, it creates a new
         * instance of the array's class with a power-of-two capacity at least as large as required.
         *
         * Note: untyped because generics with constraints are pretty annoying.
         */
        function ensureTypedArrayCapacity(array: any, capacity: number): any;
    }
    module ObjectUtilities {
        function boxValue(value: any): any;
        function toKeyValueArray(object: Object): any[];
        function isPrototypeWriteable(object: Object): boolean;
        function hasOwnProperty(object: Object, name: string): boolean;
        function propertyIsEnumerable(object: Object, name: string): boolean;
        function getOwnPropertyDescriptor(object: Object, name: string): PropertyDescriptor;
        function hasOwnGetter(object: Object, name: string): boolean;
        function getOwnGetter(object: Object, name: string): () => any;
        function hasOwnSetter(object: Object, name: string): boolean;
        function createObject(prototype: Object): any;
        function createEmptyObject(): any;
        function createMap<K, V>(): Map<K, V>;
        function createArrayMap<K, V>(): Map<K, V>;
        function defineReadOnlyProperty(object: Object, name: string, value: any): void;
        function getOwnPropertyDescriptors(object: Object): Map<string, PropertyDescriptor>;
        function cloneObject(object: Object): Object;
        function copyProperties(object: Object, template: Object): void;
        function copyOwnProperties(object: Object, template: Object): void;
        function copyOwnPropertyDescriptors(object: Object, template: Object, overwrite?: boolean): void;
        function getLatestGetterOrSetterPropertyDescriptor(object: any, name: any): PropertyDescriptor;
        function defineNonEnumerableGetterOrSetter(obj: any, name: any, value: any, isGetter: any): void;
        function defineNonEnumerableGetter(obj: any, name: any, getter: any): void;
        function defineNonEnumerableSetter(obj: any, name: any, setter: any): void;
        function defineNonEnumerableProperty(obj: any, name: any, value: any): void;
        function defineNonEnumerableForwardingProperty(obj: any, name: any, otherName: any): void;
        function defineNewNonEnumerableProperty(obj: any, name: any, value: any): void;
    }
    module FunctionUtilities {
        function makeForwardingGetter(target: string): () => any;
        function makeForwardingSetter(target: string): (any: any) => void;
        /**
         * Attaches a property to the bound function so we can detect when if it
         * ever gets rebound.
         * TODO: find out why we need this, maybe remove it.
         */
        function bindSafely(fn: Function, object: Object): any;
    }
    module StringUtilities {
        function repeatString(c: string, n: number): string;
        function memorySizeToString(value: number): string;
        /**
         * Returns a reasonably sized description of the |value|, to be used for debugging purposes.
         */
        function toSafeString(value: any): string;
        function toSafeArrayString(array: any): string;
        function utf8decode(str: string): Uint8Array;
        function utf8encode(bytes: Uint8Array): string;
        function base64ArrayBuffer(arrayBuffer: ArrayBuffer): string;
        function escapeString(str: string): string;
        /**
         * Workaround for max stack size limit.
         */
        function fromCharCodeArray(buffer: Uint8Array): string;
        function variableLengthEncodeInt32(n: any): string;
        function toEncoding(n: any): string;
        function fromEncoding(s: any): any;
        function variableLengthDecodeInt32(s: any): number;
        function trimMiddle(s: string, maxLength: number): string;
        function multiple(s: string, count: number): string;
        function indexOfAny(s: string, chars: string[], position: number): number;
        /**
         * The concatN() functions concatenate multiple strings in a way that
         * avoids creating intermediate strings, unlike String.prototype.concat().
         *
         * Note that these functions don't have identical behaviour to using '+',
         * because they will ignore any arguments that are |undefined| or |null|.
         * This usually doesn't matter.
         */
        function concat3(s0: any, s1: any, s2: any): string;
        function concat4(s0: any, s1: any, s2: any, s3: any): string;
        function concat5(s0: any, s1: any, s2: any, s3: any, s4: any): string;
        function concat6(s0: any, s1: any, s2: any, s3: any, s4: any, s5: any): string;
        function concat7(s0: any, s1: any, s2: any, s3: any, s4: any, s5: any, s6: any): string;
        function concat8(s0: any, s1: any, s2: any, s3: any, s4: any, s5: any, s6: any, s7: any): string;
        function concat9(s0: any, s1: any, s2: any, s3: any, s4: any, s5: any, s6: any, s7: any, s8: any): string;
    }
    module HashUtilities {
        function hashBytesTo32BitsMD5(data: Uint8Array, offset: number, length: number): number;
        function hashBytesTo32BitsAdler(data: Uint8Array, offset: number, length: number): number;
    }
    /**
     * Marsaglia's algorithm, adapted from V8. Use this if you want a deterministic random number.
     */
    class Random {
        private static _state;
        static seed(seed: number): void;
        static next(): number;
    }
    module NumberUtilities {
        function pow2(exponent: number): number;
        function clamp(value: number, min: number, max: number): number;
        /**
         * Rounds *.5 to the nearest even number.
         * See https://en.wikipedia.org/wiki/Rounding#Round_half_to_even for details.
         */
        function roundHalfEven(value: number): number;
        function epsilonEquals(value: number, other: number): boolean;
    }
    enum Numbers {
        MaxU16 = 65535,
        MaxI16 = 32767,
        MinI16 = -32768,
    }
    module IntegerUtilities {
        var i8: Int8Array;
        var u8: Uint8Array;
        var i32: Int32Array;
        var f32: Float32Array;
        var f64: Float64Array;
        var nativeLittleEndian: boolean;
        /**
         * Convert a float into 32 bits.
         */
        function floatToInt32(v: number): number;
        /**
         * Convert 32 bits into a float.
         */
        function int32ToFloat(i: number): number;
        /**
         * Swap the bytes of a 16 bit number.
         */
        function swap16(i: number): number;
        /**
         * Swap the bytes of a 32 bit number.
         */
        function swap32(i: number): number;
        /**
         * Converts a number to s8.u8 fixed point representation.
         */
        function toS8U8(v: number): number;
        /**
         * Converts a number from s8.u8 fixed point representation.
         */
        function fromS8U8(i: number): number;
        /**
         * Round trips a number through s8.u8 conversion.
         */
        function clampS8U8(v: number): number;
        /**
         * Converts a number to signed 16 bits.
         */
        function toS16(v: number): number;
        function bitCount(i: number): number;
        function ones(i: number): number;
        function trailingZeros(i: number): number;
        function getFlags(i: number, flags: string[]): string;
        function isPowerOfTwo(x: number): boolean;
        function roundToMultipleOfFour(x: number): number;
        function nearestPowerOfTwo(x: number): number;
        function roundToMultipleOfPowerOfTwo(i: number, powerOfTwo: number): number;
    }
    enum LogLevel {
        Error = 1,
        Warn = 2,
        Debug = 4,
        Log = 8,
        Info = 16,
        All = 31,
    }
    class IndentingWriter {
        static PURPLE: string;
        static YELLOW: string;
        static GREEN: string;
        static RED: string;
        static BOLD_RED: string;
        static ENDC: string;
        static logLevel: LogLevel;
        static stdout: any;
        static stdoutNoNewline: any;
        static stderr: any;
        private _tab;
        private _padding;
        private _suppressOutput;
        private _out;
        private _outNoNewline;
        constructor(suppressOutput?: boolean, out?: any);
        write(str?: string, writePadding?: boolean): void;
        writeLn(str?: string): void;
        writeTimeLn(str?: string): void;
        writeComment(str: string): void;
        writeLns(str: string): void;
        errorLn(str: string): void;
        warnLn(str: string): void;
        debugLn(str: string): void;
        logLn(str: string): void;
        infoLn(str: string): void;
        yellowLn(str: string): void;
        greenLn(str: string): void;
        boldRedLn(str: string): void;
        redLn(str: string): void;
        purpleLn(str: string): void;
        colorLn(color: string, str: string): void;
        redLns(str: string): void;
        colorLns(color: string, str: string): void;
        enter(str: string): void;
        leaveAndEnter(str: string): void;
        leave(str: string): void;
        indent(): void;
        outdent(): void;
        writeArray(arr: any[], detailed?: boolean, noNumbers?: boolean): void;
    }
    class SortedList<T> {
        static RETURN: number;
        static DELETE: number;
        private _compare;
        private _head;
        private _length;
        constructor(compare: (l: T, r: T) => number);
        push(value: T): void;
        /**
         * Visitors can return RETURN if they wish to stop the iteration or DELETE if they need to delete the current node.
         * NOTE: DELETE most likley doesn't work if there are multiple active iterations going on.
         */
        forEach(visitor: (value: T) => any): void;
        isEmpty(): boolean;
        pop(): T;
        contains(value: T): boolean;
        toString(): string;
    }
    module BitSets {
        var ADDRESS_BITS_PER_WORD: number;
        var BITS_PER_WORD: number;
        var BIT_INDEX_MASK: number;
        interface BitSet {
            set: (i: any) => void;
            setAll: () => void;
            assign: (set: BitSet) => void;
            clear: (i: number) => void;
            get: (i: number) => boolean;
            clearAll: () => void;
            intersect: (other: BitSet) => void;
            subtract: (other: BitSet) => void;
            negate: () => void;
            forEach: (fn: any) => void;
            toArray: () => boolean[];
            equals: (other: BitSet) => boolean;
            contains: (other: BitSet) => boolean;
            isEmpty: () => boolean;
            clone: () => BitSet;
            recount: () => void;
            toString: (names: string[]) => string;
            toBitString: (on: string, off: string) => string;
        }
        class Uint32ArrayBitSet implements BitSet {
            size: number;
            bits: Uint32Array;
            count: number;
            dirty: number;
            length: number;
            constructor(length: number);
            recount(): void;
            set(i: any): void;
            setAll(): void;
            assign(set: any): void;
            nextSetBit(from: number, to: number): number;
            clear(i: any): void;
            get(i: any): boolean;
            clearAll(): void;
            private _union(other);
            intersect(other: Uint32ArrayBitSet): void;
            subtract(other: Uint32ArrayBitSet): void;
            negate(): void;
            forEach(fn: any): void;
            toArray(): boolean[];
            equals(other: Uint32ArrayBitSet): boolean;
            contains(other: Uint32ArrayBitSet): boolean;
            toBitString: (on: string, off: string) => string;
            toString: (names: string[]) => string;
            isEmpty(): boolean;
            clone(): Uint32ArrayBitSet;
        }
        class Uint32BitSet implements BitSet {
            size: number;
            bits: number;
            count: number;
            dirty: number;
            singleWord: boolean;
            length: number;
            constructor(length: number);
            recount(): void;
            set(i: any): void;
            setAll(): void;
            assign(set: Uint32BitSet): void;
            clear(i: number): void;
            get(i: number): boolean;
            clearAll(): void;
            private _union(other);
            intersect(other: Uint32BitSet): void;
            subtract(other: Uint32BitSet): void;
            negate(): void;
            forEach(fn: any): void;
            toArray(): boolean[];
            equals(other: Uint32BitSet): boolean;
            contains(other: Uint32BitSet): boolean;
            toBitString: (on: string, off: string) => string;
            toString: (names: string[]) => string;
            isEmpty(): boolean;
            clone(): Uint32BitSet;
        }
        function BitSetFunctor(length: number): () => any;
    }
    class ColorStyle {
        static TabToolbar: string;
        static Toolbars: string;
        static HighlightBlue: string;
        static LightText: string;
        static ForegroundText: string;
        static Black: string;
        static VeryDark: string;
        static Dark: string;
        static Light: string;
        static Grey: string;
        static DarkGrey: string;
        static Blue: string;
        static Purple: string;
        static Pink: string;
        static Red: string;
        static Orange: string;
        static LightOrange: string;
        static Green: string;
        static BlueGrey: string;
        private static _randomStyleCache;
        private static _nextStyle;
        static randomStyle(): any;
        static contrastStyle(rgb: string): string;
        static reset(): void;
    }
    /**
     * Simple pool allocator for ArrayBuffers. This reduces memory usage in data structures
     * that resize buffers.
     */
    class ArrayBufferPool {
        private _list;
        private _maxSize;
        private static _enabled;
        /**
         * Creates a pool that manages a pool of a |maxSize| number of array buffers.
         */
        constructor(maxSize?: number);
        /**
         * Creates or reuses an existing array buffer that is at least the
         * specified |length|.
         */
        acquire(length: number): ArrayBuffer;
        /**
         * Releases an array buffer that is no longer needed back to the pool.
         */
        release(buffer: ArrayBuffer): void;
        /**
         * Resizes a Uint8Array to have the given length.
         */
        ensureUint8ArrayLength(array: Uint8Array, length: number): Uint8Array;
        /**
         * Resizes a Float64Array to have the given length.
         */
        ensureFloat64ArrayLength(array: Float64Array, length: number): Float64Array;
    }
}
declare module J2ME {
    var ATTRIBUTE_TYPES: {
        ConstantValue: string;
        Code: string;
        Exceptions: string;
        InnerClasses: string;
        Synthetic: string;
        SourceFile: string;
        LineNumberTable: string;
        LocalVariableTable: string;
        Deprecated: string;
        StackMap: string;
    };
    enum ACCESS_FLAGS {
        ACC_PUBLIC = 1,
        ACC_PRIVATE = 2,
        ACC_PROTECTED = 4,
        ACC_STATIC = 8,
        ACC_FINAL = 16,
        ACC_SYNCHRONIZED = 32,
        ACC_VOLATILE = 64,
        ACC_TRANSIENT = 128,
        ACC_NATIVE = 256,
        ACC_INTERFACE = 512,
        ACC_ABSTRACT = 1024,
    }
    module AccessFlags {
        function isPublic(flags: any): boolean;
        function isPrivate(flags: any): boolean;
        function isProtected(flags: any): boolean;
        function isStatic(flags: any): boolean;
        function isFinal(flags: any): boolean;
        function isSynchronized(flags: any): boolean;
        function isVolatile(flags: any): boolean;
        function isTransient(flags: any): boolean;
        function isNative(flags: any): boolean;
        function isInterface(flags: any): boolean;
        function isAbstract(flags: any): boolean;
    }
    function getClassImage(classBytes: any): any;
}
declare module J2ME {
    class Reader {
        view: DataView;
        u8: Uint8Array;
        offset: number;
        static arrays: string[][];
        private static makeArrays(length);
        static getArray(length: number): string[];
        constructor(buffer: ArrayBuffer, offset?: number);
        read8(): number;
        read16(): number;
        read32(): number;
        readInteger(): number;
        readFloat(): number;
        readDouble(): number;
        readStringFast(length: number): string;
        readString(length: any): any;
        readStringSlow(length: any): any;
        readBytes(length: any): ArrayBuffer;
    }
}
/**
 * Option and Argument Management
 *
 * Options are configuration settings sprinkled throughout the code. They can be grouped into sets of
 * options called |OptionSets| which can form a hierarchy of options. For instance:
 *
 * var set = new OptionSet();
 * var opt = set.register(new Option("v", "verbose", "boolean", false, "Enables verbose logging."));
 *
 * creates an option set with one option in it. The option can be changed directly using |opt.value = true| or
 * automatically using the |ArgumentParser|:
 *
 * var parser = new ArgumentParser();
 * parser.addBoundOptionSet(set);
 * parser.parse(["-v"]);
 *
 * The |ArgumentParser| can also be used directly:
 *
 * var parser = new ArgumentParser();
 * argumentParser.addArgument("h", "help", "boolean", {parse: function (x) {
 *   printUsage();
 * }});
 */
declare module J2ME.Options {
    class Argument {
        shortName: string;
        longName: string;
        type: any;
        options: any;
        positional: boolean;
        parseFn: any;
        value: any;
        constructor(shortName: any, longName: any, type: any, options: any);
        parse(value: any): void;
    }
    class ArgumentParser {
        args: any[];
        constructor();
        addArgument(shortName: any, longName: any, type: any, options: any): Argument;
        addBoundOption(option: any): void;
        addBoundOptionSet(optionSet: any): void;
        getUsage(): string;
        parse(args: any): any[];
    }
    class OptionSet {
        name: string;
        settings: any;
        options: any;
        open: boolean;
        constructor(name: string, settings?: any);
        register(option: any): any;
        trace(writer: any): void;
        getSettings(): {};
        setSettings(settings: any): void;
    }
    class Option {
        longName: string;
        shortName: string;
        type: string;
        defaultValue: any;
        value: any;
        description: string;
        config: any;
        /**
         * Dat GUI control.
         */
        ctrl: any;
        constructor(shortName: any, longName: any, type: any, defaultValue: any, description: any, config?: any);
        parse(value: any): void;
        trace(writer: any): void;
    }
}
declare module J2ME.Metrics {
    class Timer {
        private static _base;
        private static _top;
        private static _flat;
        private static _flatStack;
        private _parent;
        private _name;
        private _begin;
        private _last;
        private _total;
        private _count;
        private _timers;
        constructor(parent: Timer, name: string);
        static time(name: any, fn: Function): void;
        static start(name: any): void;
        static stop(): void;
        static stopStart(name: any): void;
        start(): void;
        stop(): void;
        toJSON(): {
            name: string;
            total: number;
            timers: Map<string, Timer>;
        };
        trace(writer: IndentingWriter): void;
        static trace(writer: IndentingWriter): void;
    }
    /**
     * Quick way to count named events.
     */
    class Counter {
        static instance: Counter;
        private _enabled;
        private _counts;
        private _times;
        counts: Map<string, number>;
        constructor(enabled: boolean);
        setEnabled(enabled: boolean): void;
        clear(): void;
        toJSON(): {
            counts: Map<string, number>;
            times: Map<string, number>;
        };
        count(name: string, increment?: number, time?: number): any;
        trace(writer: IndentingWriter): void;
        private _pairToString(times, pair);
        toStringSorted(): string;
        traceSorted(writer: IndentingWriter, inline?: boolean): void;
    }
    class Average {
        private _samples;
        private _count;
        private _index;
        constructor(max: any);
        push(sample: number): void;
        average(): number;
    }
}
declare module J2ME.Bytecode {
    class Bytes {
        /**
         * Gets a signed 1-byte value.
         */
        static beS1(data: Uint8Array, bci: number): number;
        /**
         * Gets a signed 2-byte big-endian value.
         */
        static beS2(data: Uint8Array, bci: number): number;
        /**
         * Gets an unsigned 1-byte value.
         */
        static beU1(data: Uint8Array, bci: number): number;
        /**
         * Gets an unsigned 2-byte big-endian value.
         */
        static beU2(data: Uint8Array, bci: number): number;
        /**
         * Gets a signed 4-byte big-endian value.
         */
        static beS4(data: Uint8Array, bci: number): number;
        /**
         * Gets either a signed 2-byte or a signed 4-byte big-endian value.
         */
        static beSVar(data: Uint8Array, bci: number, fourByte: boolean): number;
    }
    enum Condition {
        /**
         * Equal.
         */
        EQ = 0,
        /**
         * Not equal.
         */
        NE = 1,
        /**
         * Signed less than.
         */
        LT = 2,
        /**
         * Signed less than or equal.
         */
        LE = 3,
        /**
         * Signed greater than.
         */
        GT = 4,
        /**
         * Signed greater than or equal.
         */
        GE = 5,
        /**
         * Unsigned greater than or equal ("above than or equal").
         */
        AE = 6,
        /**
         * Unsigned less than or equal ("below than or equal").
         */
        BE = 7,
        /**
         * Unsigned greater than ("above than").
         */
        AT = 8,
        /**
         * Unsigned less than ("below than").
         */
        BT = 9,
        /**
         * Operation produced an overflow.
         */
        OF = 10,
        /**
         * Operation did not produce an overflow.
         */
        NOF = 11,
    }
    /**
     * The definitions of the bytecodes that are valid input to the compiler and
     * related utility methods. This comprises two groups: the standard Java
     * bytecodes defined by <a href=
     * "http://java.sun.com/docs/books/jvms/second_edition/html/VMSpecTOC.doc.html">
     * Java Virtual Machine Specification</a>, and a set of <i>extended</i>
     * bytecodes that support low-level programming, for example, memory barriers.
     *
     * The extended bytecodes are one or three bytes in size. The one-byte bytecodes
     * follow the values in the standard set, with no gap. The three-byte extended
     * bytecodes share a common first byte and carry additional instruction-specific
     * information in the second and third bytes.
     */
    enum Bytecodes {
        NOP = 0,
        ACONST_NULL = 1,
        ICONST_M1 = 2,
        ICONST_0 = 3,
        ICONST_1 = 4,
        ICONST_2 = 5,
        ICONST_3 = 6,
        ICONST_4 = 7,
        ICONST_5 = 8,
        LCONST_0 = 9,
        LCONST_1 = 10,
        FCONST_0 = 11,
        FCONST_1 = 12,
        FCONST_2 = 13,
        DCONST_0 = 14,
        DCONST_1 = 15,
        BIPUSH = 16,
        SIPUSH = 17,
        LDC = 18,
        LDC_W = 19,
        LDC2_W = 20,
        ILOAD = 21,
        LLOAD = 22,
        FLOAD = 23,
        DLOAD = 24,
        ALOAD = 25,
        ILOAD_0 = 26,
        ILOAD_1 = 27,
        ILOAD_2 = 28,
        ILOAD_3 = 29,
        LLOAD_0 = 30,
        LLOAD_1 = 31,
        LLOAD_2 = 32,
        LLOAD_3 = 33,
        FLOAD_0 = 34,
        FLOAD_1 = 35,
        FLOAD_2 = 36,
        FLOAD_3 = 37,
        DLOAD_0 = 38,
        DLOAD_1 = 39,
        DLOAD_2 = 40,
        DLOAD_3 = 41,
        ALOAD_0 = 42,
        ALOAD_1 = 43,
        ALOAD_2 = 44,
        ALOAD_3 = 45,
        IALOAD = 46,
        LALOAD = 47,
        FALOAD = 48,
        DALOAD = 49,
        AALOAD = 50,
        BALOAD = 51,
        CALOAD = 52,
        SALOAD = 53,
        ISTORE = 54,
        LSTORE = 55,
        FSTORE = 56,
        DSTORE = 57,
        ASTORE = 58,
        ISTORE_0 = 59,
        ISTORE_1 = 60,
        ISTORE_2 = 61,
        ISTORE_3 = 62,
        LSTORE_0 = 63,
        LSTORE_1 = 64,
        LSTORE_2 = 65,
        LSTORE_3 = 66,
        FSTORE_0 = 67,
        FSTORE_1 = 68,
        FSTORE_2 = 69,
        FSTORE_3 = 70,
        DSTORE_0 = 71,
        DSTORE_1 = 72,
        DSTORE_2 = 73,
        DSTORE_3 = 74,
        ASTORE_0 = 75,
        ASTORE_1 = 76,
        ASTORE_2 = 77,
        ASTORE_3 = 78,
        IASTORE = 79,
        LASTORE = 80,
        FASTORE = 81,
        DASTORE = 82,
        AASTORE = 83,
        BASTORE = 84,
        CASTORE = 85,
        SASTORE = 86,
        POP = 87,
        POP2 = 88,
        DUP = 89,
        DUP_X1 = 90,
        DUP_X2 = 91,
        DUP2 = 92,
        DUP2_X1 = 93,
        DUP2_X2 = 94,
        SWAP = 95,
        IADD = 96,
        LADD = 97,
        FADD = 98,
        DADD = 99,
        ISUB = 100,
        LSUB = 101,
        FSUB = 102,
        DSUB = 103,
        IMUL = 104,
        LMUL = 105,
        FMUL = 106,
        DMUL = 107,
        IDIV = 108,
        LDIV = 109,
        FDIV = 110,
        DDIV = 111,
        IREM = 112,
        LREM = 113,
        FREM = 114,
        DREM = 115,
        INEG = 116,
        LNEG = 117,
        FNEG = 118,
        DNEG = 119,
        ISHL = 120,
        LSHL = 121,
        ISHR = 122,
        LSHR = 123,
        IUSHR = 124,
        LUSHR = 125,
        IAND = 126,
        LAND = 127,
        IOR = 128,
        LOR = 129,
        IXOR = 130,
        LXOR = 131,
        IINC = 132,
        I2L = 133,
        I2F = 134,
        I2D = 135,
        L2I = 136,
        L2F = 137,
        L2D = 138,
        F2I = 139,
        F2L = 140,
        F2D = 141,
        D2I = 142,
        D2L = 143,
        D2F = 144,
        I2B = 145,
        I2C = 146,
        I2S = 147,
        LCMP = 148,
        FCMPL = 149,
        FCMPG = 150,
        DCMPL = 151,
        DCMPG = 152,
        IFEQ = 153,
        IFNE = 154,
        IFLT = 155,
        IFGE = 156,
        IFGT = 157,
        IFLE = 158,
        IF_ICMPEQ = 159,
        IF_ICMPNE = 160,
        IF_ICMPLT = 161,
        IF_ICMPGE = 162,
        IF_ICMPGT = 163,
        IF_ICMPLE = 164,
        IF_ACMPEQ = 165,
        IF_ACMPNE = 166,
        GOTO = 167,
        JSR = 168,
        RET = 169,
        TABLESWITCH = 170,
        LOOKUPSWITCH = 171,
        IRETURN = 172,
        LRETURN = 173,
        FRETURN = 174,
        DRETURN = 175,
        ARETURN = 176,
        RETURN = 177,
        GETSTATIC = 178,
        PUTSTATIC = 179,
        GETFIELD = 180,
        PUTFIELD = 181,
        INVOKEVIRTUAL = 182,
        INVOKESPECIAL = 183,
        INVOKESTATIC = 184,
        INVOKEINTERFACE = 185,
        XXXUNUSEDXXX = 186,
        NEW = 187,
        NEWARRAY = 188,
        ANEWARRAY = 189,
        ARRAYLENGTH = 190,
        ATHROW = 191,
        CHECKCAST = 192,
        INSTANCEOF = 193,
        MONITORENTER = 194,
        MONITOREXIT = 195,
        WIDE = 196,
        MULTIANEWARRAY = 197,
        IFNULL = 198,
        IFNONNULL = 199,
        GOTO_W = 200,
        JSR_W = 201,
        BREAKPOINT = 202,
        ALOAD_ILOAD = 210,
        IINC_GOTO = 211,
        ARRAYLENGTH_IF_ICMPGE = 212,
        ILLEGAL = 255,
        END = 256,
        /**
         * The last opcode defined by the JVM specification. To iterate over all JVM bytecodes:
         */
        LAST_JVM_OPCODE,
    }
    /**
     * A array that maps from a bytecode value to the set of {@link Flags} for the corresponding instruction.
     */
    var flags: Uint32Array;
    /**
     * A array that maps from a bytecode value to the length in bytes for the corresponding instruction.
     */
    var length: Uint32Array;
    /**
     * Only call this before the compiler is used.
     */
    function defineBytecodes(): void;
    /**
     * Gets the length of an instruction denoted by a given opcode.
     */
    function lengthOf(opcode: Bytecodes): number;
    function lengthAt(code: Uint8Array, bci: number): number;
    /**
     * Determines if a given opcode denotes an instruction that can cause an implicit exception.
     */
    function canTrap(opcode: Bytecodes): boolean;
    /**
     * Determines if a given opcode is a return bytecode.
     */
    function isReturn(opcode: Bytecodes): boolean;
    class BytecodeSwitch {
        /**
         * The bytecode array or {@code null} if {@link #stream} is not {@code null}.
         */
        private code;
        /**
         * Index of start of switch instruction.
         */
        protected bci: number;
        /**
         * Index of the start of the additional data for the switch instruction, aligned to a multiple of four from the method start.
         */
        protected alignedBci: number;
        /**
         * Constructor for a bytecode array.
         * @param code the bytecode array containing the switch instruction.
         * @param bci the index in the array of the switch instruction
         */
        constructor(code: Uint8Array, bci: number);
        /**
         * Gets the index of the instruction denoted by the {@code i}'th switch target.
         * @param i index of the switch target
         * @return the index of the instruction denoted by the {@code i}'th switch target
         */
        targetAt(i: number): number;
        /**
         * Gets the index of the instruction for the default switch target.
         * @return the index of the instruction for the default switch target
         */
        defaultTarget(): number;
        /**
         * Gets the offset from the start of the switch instruction to the default switch target.
         * @return the offset to the default switch target
         */
        defaultOffset(): number;
        /**
         * Gets the key at {@code i}'th switch target index.
         * @param i the switch target index
         * @return the key at {@code i}'th switch target index
         */
        keyAt(i: number): number;
        /**
         * Gets the offset from the start of the switch instruction for the {@code i}'th switch target.
         * @param i the switch target index
         * @return the offset to the {@code i}'th switch target
         */
        offsetAt(i: number): number;
        /**
         * Gets the number of switch targets.
         * @return the number of switch targets
         */
        numberOfCases(): number;
        /**
         * Gets the total size in bytes of the switch instruction.
         * @return the total size in bytes of the switch instruction
         */
        size(): number;
        /**
         * Reads the signed value at given bytecode index.
         * @param bci the start index of the value to retrieve
         * @return the signed, 4-byte value in the bytecode array starting at {@code bci}
         */
        protected readWord(bci: number): number;
    }
    class BytecodeTableSwitch extends BytecodeSwitch {
        private static OFFSET_TO_LOW_KEY;
        private static OFFSET_TO_HIGH_KEY;
        private static OFFSET_TO_FIRST_JUMP_OFFSET;
        private static JUMP_OFFSET_SIZE;
        /**
         * Constructor for a bytecode array.
         * @param code the bytecode array containing the switch instruction.
         * @param bci the index in the array of the switch instruction
         */
        constructor(code: Uint8Array, bci: number);
        /**
         * Gets the low key of the table switch.
         */
        lowKey(): number;
        /**
         * Gets the high key of the table switch.
         */
        highKey(): number;
        keyAt(i: number): number;
        defaultOffset(): number;
        offsetAt(i: number): number;
        numberOfCases(): number;
        size(): number;
    }
    class BytecodeLookupSwitch extends BytecodeSwitch {
        private static OFFSET_TO_NUMBER_PAIRS;
        private static OFFSET_TO_FIRST_PAIR_MATCH;
        private static OFFSET_TO_FIRST_PAIR_OFFSET;
        private static PAIR_SIZE;
        constructor(code: Uint8Array, bci: number);
        defaultOffset(): number;
        offsetAt(i: number): number;
        keyAt(i: any): number;
        numberOfCases(): number;
        size(): number;
    }
    /**
     * A utility class that makes iterating over bytecodes and reading operands
     * simpler and less error prone. For example, it handles the {@link Bytecodes#WIDE} instruction
     * and wide variants of instructions internally.
     */
    class BytecodeStream {
        private _code;
        private _opcode;
        private _currentBCI;
        private _nextBCI;
        constructor(code: Uint8Array);
        /**
         * Advances to the next bytecode.
         */
        next(): void;
        /**
         * Gets the bytecode index of the end of the code.
         */
        endBCI(): number;
        /**
         * Gets the next bytecode index (no side-effects).
         */
        nextBCI: number;
        /**
         * Gets the current bytecode index.
         */
        currentBCI: number;
        /**
         * Gets the current opcode. This method will never return the
         * {@link Bytecodes#WIDE WIDE} opcode, but will instead
         * return the opcode that is modified by the {@code WIDE} opcode.
         * @return the current opcode; {@link Bytecodes#END} if at or beyond the end of the code
         */
        currentBC(): Bytecodes;
        rawCurrentBC(): Bytecodes;
        /**
         * Sets the current opcode.
         */
        writeCurrentBC(bc: Bytecodes): void;
        /**
         * Gets the next opcode.
         * @return the next opcode; {@link Bytecodes#END} if at or beyond the end of the code
         */
        nextBC(): Bytecodes;
        /**
         * Reads the index of a local variable for one of the load or store instructions.
         * The WIDE modifier is handled internally.
         */
        readLocalIndex(): number;
        /**
         * Read the delta for an {@link Bytecodes#IINC} bytecode.
         */
        readIncrement(): number;
        /**
         * Read the destination of a {@link Bytecodes#GOTO} or {@code IF} instructions.
         * @return the destination bytecode index
         */
        readBranchDest(): number;
        /**
         * Read the destination of a {@link Bytecodes#GOTO_W} or {@link Bytecodes#JSR_W} instructions.
         * @return the destination bytecode index
         */
        readFarBranchDest(): number;
        /**
         * Read a signed 4-byte integer from the bytecode stream at the specified bytecode index.
         * @param bci the bytecode index
         * @return the integer value
         */
        readInt(bci: number): number;
        /**
         * Reads an unsigned, 1-byte value from the bytecode stream at the specified bytecode index.
         * @param bci the bytecode index
         * @return the byte
         */
        readUByte(bci: number): number;
        /**
         * Reads a constant pool index for the current instruction.
         * @return the constant pool index
         */
        readCPI(): number;
        /**
         * Reads a signed, 1-byte value for the current instruction (e.g. BIPUSH).
         */
        readByte(): number;
        /**
         * Reads a signed, 2-byte short for the current instruction (e.g. SIPUSH).
         */
        readShort(): number;
        /**
         * Sets the bytecode index to the specified value.
         * If {@code bci} is beyond the end of the array, {@link #currentBC} will return
         * {@link Bytecodes#END} and other methods may throw {@link ArrayIndexOutOfBoundsException}.
         * @param bci the new bytecode index
         */
        setBCI(bci: number): void;
    }
}
declare module J2ME {
    enum Kind {
        Boolean = 0,
        Byte = 1,
        Short = 2,
        Char = 3,
        Int = 4,
        Float = 5,
        Long = 6,
        Double = 7,
        Reference = 8,
        Void = 9,
        Illegal = 10,
        Store = 11,
    }
    var valueKinds: Kind[];
    function stackKind(kind: Kind): Kind;
    function arrayTypeCodeToKind(typeCode: any): Kind;
    function kindCharacter(kind: Kind): string;
    function getSignatureKind(signature: string): Kind;
    class TypeDescriptor {
        value: string;
        kind: Kind;
        private static canonicalTypeDescriptors;
        constructor(value: string, kind: Kind);
        toString(): string;
        static getArrayDimensions(descriptor: TypeDescriptor): number;
        static getArrayDescriptorForDescriptor(descriptor: TypeDescriptor, dimensions: number): TypeDescriptor;
        static parseTypeDescriptor(value: string, startIndex: number): TypeDescriptor;
        private static parseClassName(value, startIndex, index, separator);
        static makeTypeDescriptor(value: string): any;
    }
    class AtomicTypeDescriptor extends TypeDescriptor {
        kind: Kind;
        constructor(kind: Kind);
        static Boolean: AtomicTypeDescriptor;
        static Byte: AtomicTypeDescriptor;
        static Char: AtomicTypeDescriptor;
        static Double: AtomicTypeDescriptor;
        static Float: AtomicTypeDescriptor;
        static Int: AtomicTypeDescriptor;
        static Long: AtomicTypeDescriptor;
        static Short: AtomicTypeDescriptor;
        static Void: AtomicTypeDescriptor;
    }
    class SignatureDescriptor {
        value: string;
        private static canonicalSignatureDescriptors;
        typeDescriptors: TypeDescriptor[];
        private _argumentSlotCount;
        constructor(value: string);
        toString(): string;
        hasTwoSlotArguments(): boolean;
        /**
         * Number of arguments, this may be less than the value returned by |getArgumentSlotCount|.
         */
        getArgumentCount(): number;
        /**
         * Number of slots consumed by the arguments.
         */
        getArgumentSlotCount(): number;
        static makeSignatureDescriptor(value: string): any;
        static parse(value: string, startIndex: number): TypeDescriptor[];
    }
}
declare module J2ME {
    class ClassRegistry {
        /**
         * List of directories to look for source files in.
         */
        sourceDirectories: string[];
        /**
         * All source code, only ever used for debugging.
         */
        sourceFiles: Map<string, string[]>;
        /**
         * List of classes whose sources files were not found. We keep track
         * of them so we don't have to search for them over and over.
         */
        missingSourceFiles: Map<string, string[]>;
        jarFiles: Map<string, any>;
        classFiles: Map<string, any>;
        classes: Map<string, ClassInfo>;
        preInitializedClasses: ClassInfo[];
        java_lang_Object: ClassInfo;
        java_lang_Class: ClassInfo;
        java_lang_String: ClassInfo;
        java_lang_Thread: ClassInfo;
        constructor();
        initializeBuiltinClasses(): void;
        isPreInitializedClass(classInfo: ClassInfo): boolean;
        addPath(name: string, buffer: ArrayBuffer): void;
        addSourceDirectory(name: string): void;
        getSourceLine(sourceLocation: SourceLocation): string;
        loadFileFromJar(jarName: string, fileName: string): ArrayBuffer;
        loadFile(fileName: string): ArrayBuffer;
        loadClassBytes(bytes: ArrayBuffer): ClassInfo;
        loadClassFile(fileName: string): ClassInfo;
        loadAllClassFiles(): void;
        loadClass(className: string): ClassInfo;
        getEntryPoint(classInfo: ClassInfo): MethodInfo;
        getClass(className: string): ClassInfo;
        createArrayClass(typeName: string): ArrayClassInfo;
        getField(classInfo: any, fieldKey: any): any;
        getMethod(classInfo: any, methodKey: any): any;
    }
    var ClassNotFoundException: (message: any) => void;
}
declare module J2ME {
    var CLASSES: ClassRegistry;
    import Isolate = com.sun.cldc.isolate.Isolate;
    class JVM {
        constructor();
        startIsolate0(className: string, args: string[]): void;
        startIsolate(isolate: Isolate): void;
    }
}
declare var JVM: typeof J2ME.JVM;
declare module J2ME {
    class SourceLocation {
        className: string;
        sourceFile: string;
        lineNumber: number;
        constructor(className: string, sourceFile: string, lineNumber: number);
        toString(): string;
        equals(other: SourceLocation): boolean;
    }
    class FieldInfo {
        classInfo: ClassInfo;
        access_flags: number;
        name: string;
        signature: string;
        private static _nextiId;
        id: number;
        isStatic: boolean;
        constantValue: any;
        mangledName: string;
        key: string;
        kind: Kind;
        constructor(classInfo: ClassInfo, access_flags: number, name: string, signature: string);
        get(object: java.lang.Object): any;
        set(object: java.lang.Object, value: any): void;
        getStatic(): any;
        setStatic(value: any): void;
        toString(): string;
    }
    /**
     * Required params:
     *   - name
     *   - signature
     *   - classInfo
     *
     * Optional params:
     *   - attributes (defaults to [])
     *   - code (if not provided, pulls from attributes)
     *   - isNative, isPublic, isStatic, isSynchronized
     */
    class MethodInfo {
        name: string;
        classInfo: ClassInfo;
        code: Uint8Array;
        isNative: boolean;
        isPublic: boolean;
        isStatic: boolean;
        isSynchronized: boolean;
        exception_table: ExceptionHandler[];
        max_locals: number;
        max_stack: number;
        /**
         * The number of arguments to pop of the stack when calling this function.
         */
        argumentSlots: number;
        hasTwoSlotArguments: boolean;
        signatureDescriptor: SignatureDescriptor;
        signature: string;
        implKey: string;
        key: string;
        alternateImpl: () => any;
        fn: () => any;
        attributes: any[];
        mangledName: string;
        mangledClassAndMethodName: string;
        line_number_table: {
            start_pc: number;
            line_number: number;
        }[];
        /**
         * Approximate number of bytecodes executed in this method.
         */
        opCount: number;
        /**
         * Whether this method's bytecode has been optimized for quicker interpretation.
         */
        isOptimized: boolean;
        constructor(opts: any);
        getReturnKind(): Kind;
        getSourceLocationForPC(pc: number): SourceLocation;
    }
    class ClassInfo {
        className: string;
        c: string;
        superClass: ClassInfo;
        superClassName: string;
        interfaces: ClassInfo[];
        fields: FieldInfo[];
        methods: MethodInfo[];
        classes: any[];
        constant_pool: ConstantPoolEntry[];
        isArrayClass: boolean;
        elementClass: ClassInfo;
        klass: Klass;
        access_flags: number;
        vmc: any;
        vfc: any;
        mangledName: string;
        thread: any;
        sourceFile: string;
        constructor(classBytes: any);
        complete(): void;
        /**
         * Gets the class hierarchy in derived -> base order.
         */
        private _getClassHierarchy();
        private _mangleFields();
        isInterface: boolean;
        isFinal: boolean;
        implementsInterface(iface: any): boolean;
        isAssignableTo(toClass: ClassInfo): boolean;
        /**
         * java.lang.Class object for this class info. This is a not where static properties
         * are stored for this class.
         */
        getClassObject(ctx: Context): java.lang.Class;
        /**
         * Object that holds static properties for this class.
         */
        getStaticObject(ctx: Context): java.lang.Object;
        getField(fieldKey: string): FieldInfo;
        getClassInitLockObject(ctx: Context): any;
        toString(): string;
    }
    class ArrayClassInfo extends ClassInfo {
        constructor(className: string, elementClass?: any);
        implementsInterface(iface: any): boolean;
    }
    class PrimitiveClassInfo extends ClassInfo {
        constructor(className: string, mangledName: string);
        static Z: PrimitiveClassInfo;
        static C: PrimitiveClassInfo;
        static F: PrimitiveClassInfo;
        static D: PrimitiveClassInfo;
        static B: PrimitiveClassInfo;
        static S: PrimitiveClassInfo;
        static I: PrimitiveClassInfo;
        static J: PrimitiveClassInfo;
    }
    class PrimitiveArrayClassInfo extends ArrayClassInfo {
        constructor(className: string, elementClass?: any);
        superClass: ClassInfo;
        static Z: PrimitiveArrayClassInfo;
        static C: PrimitiveArrayClassInfo;
        static F: PrimitiveArrayClassInfo;
        static D: PrimitiveArrayClassInfo;
        static B: PrimitiveArrayClassInfo;
        static S: PrimitiveArrayClassInfo;
        static I: PrimitiveArrayClassInfo;
        static J: PrimitiveArrayClassInfo;
    }
}
declare var FieldInfo: typeof J2ME.FieldInfo;
declare var MethodInfo: typeof J2ME.MethodInfo;
declare var ClassInfo: typeof J2ME.ClassInfo;
declare module J2ME {
    var Bindings: {
        "java/lang/Object": {
            native: {
                "hashCode.()I": () => number;
            };
        };
    };
}
declare var $: J2ME.Runtime;
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
    fromInt(value: number): any;
    fromNumber(value: number): any;
};
declare var throwHelper: any;
declare var throwPause: any;
declare var throwYield: any;
declare module J2ME {
    var traceWriter: any;
    var linkWriter: any;
    var initWriter: any;
    var timeline: any;
    var methodTimeline: any;
    var nativeCounter: Metrics.Counter;
    var runtimeCounter: Metrics.Counter;
    var jitMethodInfos: {};
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(name?: string, data?: any): void;
    var Klasses: {
        java: {
            lang: {
                Object: any;
                Class: any;
                String: any;
                Thread: any;
                IllegalArgumentException: any;
                IllegalStateException: any;
                NullPointerException: any;
                RuntimeException: any;
                IndexOutOfBoundsException: any;
                ArrayIndexOutOfBoundsException: any;
                StringIndexOutOfBoundsException: any;
                ArrayStoreException: any;
                IllegalMonitorStateException: any;
                ClassCastException: any;
                NegativeArraySizeException: any;
                ArithmeticException: any;
                ClassNotFoundException: any;
                SecurityException: any;
                IllegalThreadStateException: any;
                Exception: any;
            };
            io: {
                IOException: any;
                UTFDataFormatException: any;
                UnsupportedEncodingException: any;
            };
        };
        javax: {
            microedition: {
                media: {
                    MediaException: any;
                };
            };
        };
        boolean: any;
        char: any;
        float: any;
        double: any;
        byte: any;
        short: any;
        int: any;
        long: any;
    };
    function getArrayConstructor(type: string): Function;
    var stdoutWriter: IndentingWriter;
    var stderrWriter: IndentingWriter;
    enum ExecutionPhase {
        /**
         * Default runtime behaviour.
         */
        Runtime = 0,
        /**
         * When compiling code statically.
         */
        Compiler = 1,
    }
    var phase: ExecutionPhase;
    var internedStrings: Map<string, java.lang.String>;
    enum RuntimeStatus {
        New = 1,
        Started = 2,
        Stopping = 3,
        Stopped = 4,
    }
    enum MethodType {
        Interpreted = 0,
        Native = 1,
        Compiled = 2,
    }
    function escapeString(s: string): string;
    function hashStringToString(s: string): any;
    function mangleClassAndMethod(methodInfo: MethodInfo): string;
    function mangleMethod(methodInfo: MethodInfo): string;
    function mangleClass(classInfo: ClassInfo): any;
    /**
     * This class is abstract and should never be initialized. It only acts as a template for
     * actual runtime objects.
     */
    class RuntimeTemplate {
        static all: Set<{}>;
        jvm: JVM;
        status: RuntimeStatus;
        waiting: any[];
        threadCount: number;
        initialized: any;
        pending: any;
        staticFields: any;
        classObjects: any;
        classInitLockObjects: any;
        ctx: Context;
        isolate: com.sun.cldc.isolate.Isolate;
        mainThread: java.lang.Thread;
        private static _nextRuntimeId;
        private _runtimeId;
        private _nextHashCode;
        constructor(jvm: JVM);
        /**
         * Generates a new hash code for the specified |object|.
         */
        nextHashCode(): number;
        waitStatus(callback: any): void;
        updateStatus(status: RuntimeStatus): void;
        addContext(ctx: any): void;
        removeContext(ctx: any): void;
        newStringConstant(s: string): java.lang.String;
        setStatic(field: any, value: any): void;
        getStatic(field: any): any;
        newIOException(str?: string): java.io.IOException;
        newUnsupportedEncodingException(str?: string): java.io.UnsupportedEncodingException;
        newUTFDataFormatException(str?: string): java.io.UTFDataFormatException;
        newSecurityException(str?: string): java.lang.SecurityException;
        newIllegalThreadStateException(str?: string): java.lang.IllegalThreadStateException;
        newRuntimeException(str?: string): java.lang.RuntimeException;
        newIndexOutOfBoundsException(str?: string): java.lang.IndexOutOfBoundsException;
        newArrayIndexOutOfBoundsException(str?: string): java.lang.ArrayIndexOutOfBoundsException;
        newStringIndexOutOfBoundsException(str?: string): java.lang.StringIndexOutOfBoundsException;
        newArrayStoreException(str?: string): java.lang.ArrayStoreException;
        newIllegalMonitorStateException(str?: string): java.lang.IllegalMonitorStateException;
        newClassCastException(str?: string): java.lang.ClassCastException;
        newArithmeticException(str?: string): java.lang.ArithmeticException;
        newClassNotFoundException(str?: string): java.lang.ClassNotFoundException;
        newIllegalArgumentException(str?: string): java.lang.IllegalArgumentException;
        newIllegalStateException(str?: string): java.lang.IllegalStateException;
        newNegativeArraySizeException(str?: string): java.lang.NegativeArraySizeException;
        newNullPointerException(str?: string): java.lang.NullPointerException;
        newMediaException(str?: string): javax.microedition.media.MediaException;
        newException(str?: string): java.lang.Exception;
    }
    enum VMState {
        Running = 0,
        Yielding = 1,
        Pausing = 2,
    }
    class Runtime extends RuntimeTemplate {
        private static _nextId;
        id: number;
        /**
         * Bailout callback whenever a JIT frame is unwound.
         */
        B(bci: number, local: any[], stack: any[]): void;
        yield(): void;
        pause(): void;
        constructor(jvm: JVM);
    }
    class Class {
        klass: Klass;
        constructor(klass: Klass);
    }
    /**
     * Representation of a template class.
     */
    interface Klass extends Function {
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
        display: Klass[];
        /**
         * Flattened array of super klasses. This makes type checking easy,
         * see |classInstanceOf|.
         */
        interfaces: Klass[];
        /**
         * Depth in the class hierarchy.
         */
        depth: number;
        classSymbols: string[];
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
    }
    class RuntimeKlass {
        templateKlass: Klass;
        /**
         * Java class object. This is only available on runtime klasses and it points to itself. We go trough
         * this indirection in VM code for now so that we can easily change it later if we need to.
         */
        classObject: java.lang.Class;
        /**
         * Whether this class is a runtime class.
         */
        constructor(templateKlass: Klass);
    }
    class Lock {
        thread: java.lang.Thread;
        level: number;
        constructor(thread: java.lang.Thread, level: number);
    }
    module java.lang {
        interface Object {
            /**
             * Reference to the runtime klass.
             */
            klass: Klass;
            /**
             * All objects have an internal hash code.
             */
            _hashCode: number;
            /**
             * Some objects may have a lock.
             */
            _lock: Lock;
            waiting: Context[];
            clone(): Object;
            equals(obj: Object): boolean;
            finalize(): void;
            getClass(): Class;
            hashCode(): number;
            notify(): void;
            notifyAll(): void;
            toString(): String;
            notify(): void;
            notify(timeout: number): void;
            notify(timeout: number, nanos: number): void;
        }
        interface Class extends Object {
            /**
             * RuntimeKlass associated with this Class object.
             */
            runtimeKlass: RuntimeKlass;
        }
        interface String extends Object {
            str: string;
        }
        interface Thread extends Object {
            pid: number;
            alive: boolean;
        }
        interface Exception extends Object {
            message: string;
        }
        interface IllegalArgumentException extends Exception {
        }
        interface IllegalStateException extends Exception {
        }
        interface NullPointerException extends Exception {
        }
        interface RuntimeException extends Exception {
        }
        interface IndexOutOfBoundsException extends Exception {
        }
        interface ArrayIndexOutOfBoundsException extends Exception {
        }
        interface StringIndexOutOfBoundsException extends Exception {
        }
        interface ArrayStoreException extends Exception {
        }
        interface IllegalMonitorStateException extends Exception {
        }
        interface ClassCastException extends Exception {
        }
        interface NegativeArraySizeException extends Exception {
        }
        interface ArithmeticException extends Exception {
        }
        interface ClassNotFoundException extends Exception {
        }
        interface SecurityException extends Exception {
        }
        interface IllegalThreadStateException extends Exception {
        }
    }
    module java.io {
        interface IOException extends lang.Exception {
        }
        interface UTFDataFormatException extends lang.Exception {
        }
        interface UnsupportedEncodingException extends lang.Exception {
        }
    }
    module javax.microedition.media {
        interface MediaException extends java.lang.Exception {
        }
    }
    module com.sun.cldc.isolate {
        interface Isolate extends java.lang.Object {
            id: number;
            runtime: Runtime;
        }
    }
    /**
     * Registers the klass as a getter on the runtime template. On first access, the getter creates a runtime klass and
     * adds it to the runtime.
     */
    function registerKlass(klass: Klass, classInfo: ClassInfo): void;
    function registerKlassSymbol(className: string): void;
    function registerKlassSymbols(classNames: string[]): void;
    function getRuntimeKlass(runtime: Runtime, klass: Klass): RuntimeKlass;
    function getKlass(classInfo: ClassInfo): Klass;
    function makeArrayKlassConstructor(elementKlass: Klass): Klass;
    function linkKlass(classInfo: ClassInfo): void;
    function extendKlass(klass: Klass, superKlass: Klass): void;
    function isAssignableTo(from: Klass, to: Klass): boolean;
    function instanceOfKlass(object: java.lang.Object, klass: Klass): boolean;
    function instanceOfInterface(object: java.lang.Object, klass: Klass): boolean;
    function checkCastKlass(object: java.lang.Object, klass: Klass): void;
    function checkCastInterface(object: java.lang.Object, klass: Klass): void;
    function newObject(klass: Klass): java.lang.Object;
    function newString(str: string): java.lang.String;
    function newStringConstant(str: string): java.lang.String;
    function newArray(klass: Klass, size: number): any;
    function newObjectArray(size: number): java.lang.Object[];
    function newStringArray(size: number): java.lang.String[];
    function newByteArray(size: number): number[];
    function getArrayKlass(elementKlass: Klass): Klass;
    function toDebugString(value: any): string;
    function fromJavaString(value: java.lang.String): string;
    function checkDivideByZero(value: number): void;
    function checkDivideByZeroLong(value: Long): void;
    /**
     * Do bounds check using only one branch. The math works out because array.length
     * can't be larger than 2^31 - 1. So |index| >>> 0 will be larger than
     * array.length if it is less than zero. We need to make the right side unsigned
     * as well because otherwise the SM optimization that converts this to an
     * unsinged branch doesn't kick in.
     */
    function checkArrayBounds(array: any[], index: number): void;
    function checkArrayStore(array: java.lang.Object, value: any): void;
    function checkNull(object: java.lang.Object): void;
    enum Constants {
        INT_MAX = 2147483647,
        INT_MIN = -2147483648,
    }
    function monitorEnter(object: java.lang.Object): void;
    function monitorExit(object: java.lang.Object): void;
}
declare var Runtime: typeof J2ME.Runtime;
/**
 * Are we currently unwinding the stack because of a Yield? This technically
 * belonges to a context but we store it in the global object because it is
 * read very often.
 */
declare var U: J2ME.VMState;
/**
 * Runtime exports for compiled code.
 */
declare var $IOK: typeof J2ME.instanceOfKlass;
declare var $IOI: typeof J2ME.instanceOfInterface;
declare var $CCK: typeof J2ME.checkCastKlass;
declare var $CCI: typeof J2ME.checkCastInterface;
declare var $AK: typeof J2ME.getArrayKlass;
declare var $NA: typeof J2ME.newArray;
declare var $S: typeof J2ME.newStringConstant;
declare var $CDZ: typeof J2ME.checkDivideByZero;
declare var $CDZL: typeof J2ME.checkDivideByZeroLong;
declare var $CAB: typeof J2ME.checkArrayBounds;
declare var $CAS: typeof J2ME.checkArrayStore;
declare var $ME: typeof J2ME.monitorEnter;
declare var $MX: typeof J2ME.monitorExit;
declare module J2ME {
    var interpreterCounter: Metrics.Counter;
    /**
     * The number of opcodes executed thus far.
     */
    var ops: number;
    function interpret(): any;
    class VM {
        static execute: typeof interpret;
        static Yield: {
            toString: () => string;
        };
        static Pause: {
            toString: () => string;
        };
        static DEBUG: boolean;
        static DEBUG_PRINT_ALL_EXCEPTIONS: boolean;
    }
}
declare var VM: typeof J2ME.VM;
interface Array<T> {
    push2: (value: any) => void;
    pop2: () => any;
    pushKind: (kind: J2ME.Kind, value: any) => void;
    popKind: (kind: J2ME.Kind) => any;
    read: (i: any) => any;
}
declare module J2ME {
    class Frame {
        methodInfo: MethodInfo;
        local: any[];
        stack: any[];
        code: Uint8Array;
        pc: number;
        opPc: number;
        cp: any;
        localBase: number;
        lockObject: java.lang.Object;
        constructor(methodInfo: MethodInfo, local: any[], localBase: number);
        getLocal(i: number): any;
        setLocal(i: number, value: any): void;
        read8(): number;
        peek8(): number;
        read16(): number;
        read32(): number;
        read8Signed(): number;
        read16Signed(): number;
        readTargetPC(): number;
        read32Signed(): number;
        tableSwitch(): number;
        lookupSwitch(): number;
        wide(): void;
        /**
         * Returns the |object| on which a call to the specified |methodInfo| would be
         * called.
         */
        peekInvokeObject(methodInfo: MethodInfo): java.lang.Object;
        popArgumentsInto(signatureDescriptor: SignatureDescriptor, args: any): any[];
        trace(writer: IndentingWriter): void;
    }
    class Context {
        runtime: Runtime;
        private static _nextId;
        private static _colors;
        private static writer;
        id: number;
        frames: Frame[];
        frameSets: Frame[][];
        bailoutFrames: any[];
        lockTimeout: number;
        lockLevel: number;
        thread: java.lang.Thread;
        writer: IndentingWriter;
        constructor(runtime: Runtime);
        static color(id: any): any;
        static currentContextPrefix(): string;
        static setWriters(writer: IndentingWriter): void;
        kill(): void;
        current(): Frame;
        executeNewFrameSet(frames: Frame[]): any;
        getClassInitFrame(classInfo: ClassInfo): Frame;
        pushClassInitFrame(classInfo: ClassInfo): void;
        createException(className: string, message?: string): java.lang.Object;
        setAsCurrentContext(): void;
        clearCurrentContext(): void;
        start(frame: Frame): void;
        private execute();
        resume(): void;
        block(obj: any, queue: any, lockLevel: any): void;
        unblock(obj: any, queue: any, notifyAll: any, callback: any): void;
        wakeup(obj: any): void;
        monitorEnter(object: java.lang.Object): void;
        monitorExit(object: java.lang.Object): void;
        wait(object: java.lang.Object, timeout: any): void;
        notify(obj: any, notifyAll: any): void;
        bailout(methodInfo: MethodInfo, pc: number, local: any[], stack: any[]): void;
        resolve(cp: any, idx: number, isStatic: boolean): any;
    }
}
declare var Context: typeof J2ME.Context;
declare var Frame: typeof J2ME.Frame;
declare function countTimeline(message: string, object?: Object): void;
declare function enterTimeline(message: string): void;
declare function leaveTimeline(message?: string): void;
declare module J2ME {
    class CompilerBailout {
        message: string;
        constructor(message: string);
    }
}
/**
 * SSA-based Sea-of-Nodes IR based on Cliff Click's Work: A simple graph-based intermediate
 * representation (http://doi.acm.org/10.1145/202530.202534)
 *
 * Node Hierarchy:
 *
 * Node
 *  - Control
 *    - Region
 *      - Start
 *    - End
 *      - Stop
 *      - If
 *      - Jump
 *  - Value
 *    - Constant, Parameter, Phi, Binary, GetProperty ...
 *
 * Control flow is modeled with control edges rather than with CFGs. Each basic block is represented
 * as a region node which has control dependencies on predecessor regions. Nodes that are dependent
 * on the execution of a region, have a |control| property assigned to the region they belong to.
 *
 * Memory (and the external world) is modeled as an SSA value called the Store. Nodes that mutate the
 * Store produce a new Store.
 *
 * Nodes that produce multiple values, such as Ifs which produce two values (a True and False control
 * value) can have their values projected (extracted) using Projection nodes.
 *
 * A node scheduler is responsible for serializing nodes back into a CFG such that all dependencies
 * are satisfied.
 *
 * Compiler Pipeline:
 *
 * Graph Builder -> IR (DFG) -> Optimizations -> CFG -> Restructuring -> Backend
 *
 */
declare module J2ME.C4.IR {
    interface NodeVisitor {
        (node: Node): void;
    }
    interface BlockVisitor {
        (block: Block): void;
    }
    function visitArrayInputs(array: Node[], visitor: NodeVisitor, ignoreNull?: boolean): void;
    enum NodeFlags {
        None = 0,
    }
    class Node {
        abstract: boolean;
        kind: Kind;
        isDeleted: boolean;
        private static _nextID;
        static getNextID(): number;
        id: number;
        control: Control;
        nodeName: string;
        variable: Variable;
        mustFloat: boolean;
        mustNotFloat: boolean;
        shouldFloat: boolean;
        shouldNotFloat: boolean;
        handlesAssignment: boolean;
        constructor();
        compile: (cx: any) => void;
        visitInputs(visitor: NodeVisitor): void;
        static startNumbering(): void;
        static stopNumbering(): void;
        toString(brief?: boolean): any;
        visitInputsNoConstants(visitor: NodeVisitor): void;
        replaceInput(oldInput: Node, newInput: Node): number;
    }
    class Control extends Node {
        block: Block;
        constructor();
    }
    class Region extends Control {
        entryState: any;
        predecessors: Control[];
        constructor(control: Control);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Start extends Region {
        constructor();
        visitInputs(visitor: NodeVisitor): void;
    }
    class End extends Control {
        control: Control;
        constructor(control: Control);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Stop extends End {
        store: Store;
        argument: Value;
        constructor(control: Control, store: Store, argument: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class If extends End {
        predicate: Value;
        constructor(control: Control, predicate: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Switch extends End {
        determinant: Value;
        constructor(control: any, determinant: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Jump extends End {
        constructor(control: any);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Value extends Node {
        constructor();
    }
    class Store extends Value {
        constructor();
    }
    class StoreDependent extends Value {
        control: Control;
        store: Store;
        loads: Node[];
        constructor(control: Control, store: Store);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Call extends StoreDependent {
        callee: Value;
        object: Value;
        args: Value[];
        constructor(control: Control, store: Store, callee: Value, object: Value, args: Value[]);
        visitInputs(visitor: NodeVisitor): void;
    }
    class New extends StoreDependent {
        callee: Value;
        args: Value[];
        constructor(control: Control, store: Store, callee: Value, args: Value[]);
        visitInputs(visitor: NodeVisitor): void;
    }
    class GetProperty extends StoreDependent {
        object: Value;
        name: Value;
        constructor(control: Control, store: Store, object: Value, name: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class SetProperty extends StoreDependent {
        object: Value;
        name: Value;
        value: Value;
        constructor(control: Control, store: Store, object: Value, name: Value, value: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class DeleteProperty extends StoreDependent {
        object: Value;
        name: Value;
        constructor(control: any, store: any, object: Value, name: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class CallProperty extends StoreDependent {
        object: Value;
        name: Value;
        args: Value[];
        constructor(control: Control, store: Store, object: Value, name: Value, args: Value[]);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Phi extends Value {
        control: Control;
        isLoop: boolean;
        sealed: boolean;
        args: Value[];
        constructor(control: Control, value: Value);
        visitInputs(visitor: NodeVisitor): void;
        seal(): void;
        pushValue(x: Value): void;
    }
    class Variable extends Value {
        name: string;
        constructor(name: string);
    }
    class Copy extends Value {
        argument: Value;
        constructor(argument: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Move extends Value {
        to: Variable;
        from: Value;
        constructor(to: Variable, from: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    enum ProjectionType {
        CASE = 0,
        TRUE = 1,
        FALSE = 2,
        STORE = 3,
        CONTEXT = 4,
    }
    class Projection extends Value {
        argument: Node;
        type: ProjectionType;
        selector: Constant;
        constructor(argument: Node, type: ProjectionType, selector?: Constant);
        visitInputs(visitor: NodeVisitor): void;
        project(): Node;
    }
    class Latch extends Value {
        control: Control;
        condition: Value;
        left: Value;
        right: Value;
        constructor(control: Control, condition: Value, left: Value, right: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Operator {
        name: string;
        evaluate: Function;
        isBinary: boolean;
        not: Operator;
        static byName: Map<string, Operator>;
        constructor(name: string, evaluate: Function, isBinary: boolean);
        static IADD: Operator;
        static LADD: Operator;
        static FADD: Operator;
        static DADD: Operator;
        static ISUB: Operator;
        static LSUB: Operator;
        static FSUB: Operator;
        static DSUB: Operator;
        static IMUL: Operator;
        static LMUL: Operator;
        static FMUL: Operator;
        static DMUL: Operator;
        static IDIV: Operator;
        static LDIV: Operator;
        static FDIV: Operator;
        static DDIV: Operator;
        static IREM: Operator;
        static LREM: Operator;
        static FREM: Operator;
        static DREM: Operator;
        static INEG: Operator;
        static LNEG: Operator;
        static FNEG: Operator;
        static DNEG: Operator;
        static AND: Operator;
        static OR: Operator;
        static XOR: Operator;
        static LSH: Operator;
        static RSH: Operator;
        static URSH: Operator;
        static SEQ: Operator;
        static SNE: Operator;
        static EQ: Operator;
        static NE: Operator;
        static LE: Operator;
        static GT: Operator;
        static LT: Operator;
        static GE: Operator;
        static PLUS: Operator;
        static NEG: Operator;
        static TRUE: Operator;
        static FALSE: Operator;
        static TYPE_OF: Operator;
        static BITWISE_NOT: Operator;
        static linkOpposites(a: Operator, b: Operator): void;
        static fromName(name: string): any;
    }
    class Binary extends Value {
        operator: Operator;
        left: Value;
        right: Value;
        constructor(operator: Operator, left: Value, right: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Unary extends Value {
        operator: Operator;
        argument: Value;
        constructor(operator: Operator, argument: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Constant extends Value {
        value: any;
        constructor(value: any);
    }
    class GlobalProperty extends Value {
        name: string;
        constructor(name: string);
    }
    class This extends Value {
        control: Control;
        constructor(control: Control);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Throw extends Value {
        control: Control;
        argument: Value;
        constructor(control: Control, argument: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Arguments extends Value {
        control: Control;
        constructor(control: Control);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Parameter extends Value {
        control: Control;
        index: number;
        name: string;
        constructor(control: Control, index: number, name: string);
        visitInputs(visitor: NodeVisitor): void;
    }
    class NewArray extends Value {
        control: Control;
        elements: Value[];
        constructor(control: Control, elements: Value[]);
        visitInputs(visitor: NodeVisitor): void;
    }
    class NewObject extends Value {
        control: Control;
        properties: KeyValuePair[];
        constructor(control: Control, properties: KeyValuePair[]);
        visitInputs(visitor: NodeVisitor): void;
    }
    class KeyValuePair extends Value {
        key: Value;
        value: Value;
        constructor(key: Value, value: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    function nameOf(node: any): any;
}
declare module J2ME.C4.IR {
    function isNotPhi(phi: any): boolean;
    function isPhi(phi: any): boolean;
    function isStore(store: any): boolean;
    function isConstant(constant: any): boolean;
    function isControlOrNull(control: any): boolean;
    function isStoreOrNull(store: any): boolean;
    function isControl(control: any): boolean;
    function isValueOrNull(value: any): boolean;
    function isValue(value: any): boolean;
    function isProjection(node: any, type: any): boolean;
    var Null: Constant;
    var Undefined: Constant;
    var True: Constant;
    var False: Constant;
    class Block {
        id: number;
        rpo: number;
        name: string;
        phis: Phi[];
        loops: number;
        nodes: Node[];
        region: Node;
        dominator: Block;
        successors: Block[];
        predecessors: Block[];
        isLoopHeader: boolean;
        /**
         * This is added by the codegen.
         */
        compile: (cx: any, state: any) => void;
        /**
         * This is stuff added on by the looper which needs to be really cleaned up.
         */
        dominatees: Block[];
        npredecessors: number;
        level: number;
        frontier: any;
        constructor(id: number, start?: Region, end?: Node);
        pushSuccessorAt(successor: Block, index: number, pushPredecessor?: boolean): void;
        pushSuccessor(successor: Block, pushPredecessor?: boolean): void;
        pushPredecessor(predecessor: Block): void;
        visitNodes(fn: NodeVisitor): void;
        visitSuccessors(fn: BlockVisitor): void;
        visitPredecessors(fn: BlockVisitor): void;
        append(node: Node): void;
        toString(): string;
        trace(writer: IndentingWriter): void;
    }
    class DFG {
        exit: Node;
        start: Node;
        constructor(exit: Node);
        buildCFG(): CFG;
        static preOrderDepthFirstSearch(root: Node, visitChildren: any, pre: NodeVisitor): void;
        static postOrderDepthFirstSearch(root: Node, visitChildren: any, post: NodeVisitor): void;
        forEachInPreOrderDepthFirstSearch(visitor: NodeVisitor): void;
        forEach(visitor: NodeVisitor, postOrder: boolean): void;
        traceMetrics(writer: IndentingWriter): void;
        trace(writer: IndentingWriter): void;
    }
    interface UseEntry {
        def: Node;
        uses: Node[];
    }
    class Uses {
        entries: UseEntry[];
        constructor();
        addUse(def: Node, use: Node): void;
        trace(writer: any): void;
        replace(def: Node, value: Node): boolean;
        updateUses(def: Node, value: Node, useEntries: UseEntry[], writer: IndentingWriter): boolean;
    }
    class CFG {
        dfg: DFG;
        exit: Block;
        root: Block;
        order: Block[];
        blocks: Block[];
        nextBlockID: number;
        blockNames: Map<string, Block>;
        setConstructor: any;
        constructor();
        static fromDFG(dfg: any): CFG;
        /**
         * Makes sure root node has no predecessors and that there is only one
         * exit node.
         */
        buildRootAndExit(): void;
        buildBlock(start: any, end: any): Block;
        createBlockSet(): any;
        computeReversePostOrder(): any[];
        depthFirstSearch(preFn: any, postFn?: any): void;
        computeDominators(apply: any): Int32Array;
        computeLoops(): void;
        /**
         * Computes def-use chains.
         *
         * () -> Map[id -> {def:Node, uses:Array[Node]}]
         */
        computeUses(): Uses;
        verify(): void;
        /**
         * Simplifies phis of the form:
         *
         * replace |x = phi(y)| -> y
         * replace |x = phi(x, y)| -> y
         * replace |x = phi(y, y, x, y, x)| -> |phi(y, x)| -> y
         */
        optimizePhis(): void;
        /**
         * "A critical edge is an edge which is neither the only edge leaving its source block, nor the only edge entering
         * its destination block. These edges must be split: a new block must be created in the middle of the edge, in order
         * to insert computations on the edge without affecting any other edges." - Wikipedia
         */
        splitCriticalEdges(): number;
        /**
         * Allocate virtual registers and break out of SSA.
         */
        allocateVariables(): void;
        scheduleEarly(): void;
        trace(writer: IndentingWriter): void;
    }
    /**
     * Peephole optimizations:
     */
    class PeepholeOptimizer {
        foldUnary(node: any): any;
        foldBinary(node: any): any;
        fold(node: any): any;
    }
}
/**
 * Like most JITs we don't need all the fancy AST serialization, this
 * is a quick and dirty AST writer.
 */
declare module J2ME.C4.AST {
    class Node {
        type: string;
        toSource(precedence: number): string;
    }
    class Statement extends Node {
    }
    class Expression extends Node {
    }
    class Program extends Node {
        body: Node[];
        constructor(body: Node[]);
    }
    class EmptyStatement extends Statement {
    }
    class BlockStatement extends Statement {
        body: Statement[];
        end: IR.Node;
        constructor(body: Statement[]);
        toSource(precedence: number): string;
    }
    class ExpressionStatement extends Statement {
        expression: Expression;
        constructor(expression: Expression);
        toSource(precedence: number): string;
    }
    class IfStatement extends Statement {
        test: Expression;
        consequent: Statement;
        alternate: Statement;
        constructor(test: Expression, consequent: Statement, alternate?: Statement);
        toSource(precedence: number): string;
    }
    class LabeledStatement extends Statement {
        label: Identifier;
        body: Statement;
        constructor(label: Identifier, body: Statement);
    }
    class BreakStatement extends Statement {
        label: Identifier;
        constructor(label: Identifier);
        toSource(precedence: number): string;
    }
    class ContinueStatement extends Statement {
        label: Identifier;
        constructor(label: Identifier);
        toSource(precedence: number): string;
    }
    class WithStatement extends Statement {
        object: Expression;
        body: Statement;
        constructor(object: Expression, body: Statement);
    }
    class SwitchStatement extends Statement {
        discriminant: Expression;
        cases: SwitchCase[];
        lexical: boolean;
        constructor(discriminant: Expression, cases: SwitchCase[], lexical: boolean);
        toSource(precedence: number): string;
    }
    class ReturnStatement extends Statement {
        argument: Expression;
        constructor(argument: Expression);
        toSource(precedence: number): string;
    }
    class ThrowStatement extends Statement {
        argument: Expression;
        constructor(argument: Expression);
        toSource(precedence: number): string;
    }
    class TryStatement extends Statement {
        block: BlockStatement;
        handlers: CatchClause;
        guardedHandlers: CatchClause[];
        finalizer: BlockStatement;
        constructor(block: BlockStatement, handlers: CatchClause, guardedHandlers: CatchClause[], finalizer: BlockStatement);
        toSource(precedence: number): string;
    }
    class WhileStatement extends Statement {
        test: Expression;
        body: Statement;
        constructor(test: Expression, body: Statement);
        toSource(precedence: number): string;
    }
    class DoWhileStatement extends Statement {
        body: Statement;
        test: Expression;
        constructor(body: Statement, test: Expression);
    }
    class ForStatement extends Statement {
        init: Node;
        test: Expression;
        update: Expression;
        body: Statement;
        constructor(init: Node, test: Expression, update: Expression, body: Statement);
    }
    class ForInStatement extends Statement {
        left: Node;
        right: Expression;
        body: Statement;
        each: boolean;
        constructor(left: Node, right: Expression, body: Statement, each: boolean);
    }
    class DebuggerStatement extends Statement {
    }
    class Declaration extends Statement {
    }
    class FunctionDeclaration extends Declaration {
        id: Identifier;
        params: Node[];
        defaults: Expression[];
        rest: Identifier;
        body: BlockStatement;
        generator: boolean;
        expression: boolean;
        constructor(id: Identifier, params: Node[], defaults: Expression[], rest: Identifier, body: BlockStatement, generator: boolean, expression: boolean);
    }
    class VariableDeclaration extends Declaration {
        declarations: VariableDeclarator[];
        kind: string;
        constructor(declarations: VariableDeclarator[], kind: string);
        toSource(precedence: number): string;
    }
    class VariableDeclarator extends Node {
        id: Node;
        init: Node;
        constructor(id: Node, init?: Node);
        toSource(precedence: number): string;
    }
    class Identifier extends Expression {
        name: string;
        constructor(name: string);
        toSource(precedence: number): string;
    }
    class Literal extends Expression {
        value: any;
        constructor(value: any);
        toSource(precedence: number): string;
    }
    class ThisExpression extends Expression {
        toSource(precedence: number): string;
    }
    class ArrayExpression extends Expression {
        elements: Expression[];
        constructor(elements: Expression[]);
        toSource(precedence: number): string;
    }
    class ObjectExpression extends Expression {
        properties: Property[];
        constructor(properties: Property[]);
        toSource(precedence: number): string;
    }
    class FunctionExpression extends Expression {
        id: Identifier;
        params: Node[];
        defaults: Expression[];
        rest: Identifier;
        body: BlockStatement;
        generator: boolean;
        expression: boolean;
        constructor(id: Identifier, params: Node[], defaults: Expression[], rest: Identifier, body: BlockStatement, generator: boolean, expression: boolean);
    }
    class SequenceExpression extends Expression {
        expressions: Expression[];
        constructor(expressions: Expression[]);
        toSource(precedence: number): string;
    }
    class UnaryExpression extends Expression {
        operator: string;
        prefix: boolean;
        argument: Expression;
        constructor(operator: string, prefix: boolean, argument: Expression);
        toSource(precedence: number): string;
    }
    class BinaryExpression extends Expression {
        operator: string;
        left: Expression;
        right: Expression;
        constructor(operator: string, left: Expression, right: Expression);
        toSource(precedence: number): string;
    }
    class AssignmentExpression extends Expression {
        operator: string;
        left: Expression;
        right: Expression;
        constructor(operator: string, left: Expression, right: Expression);
        toSource(precedence: number): string;
    }
    class UpdateExpression extends Expression {
        operator: string;
        argument: Expression;
        prefix: boolean;
        constructor(operator: string, argument: Expression, prefix: boolean);
    }
    class LogicalExpression extends BinaryExpression {
        constructor(operator: string, left: Expression, right: Expression);
    }
    class ConditionalExpression extends Expression {
        test: Expression;
        consequent: Expression;
        alternate: Expression;
        constructor(test: Expression, consequent: Expression, alternate: Expression);
        toSource(precedence: number): string;
    }
    class NewExpression extends Expression {
        callee: Expression;
        arguments: Expression[];
        constructor(callee: Expression, _arguments: Expression[]);
        toSource(precedence: number): string;
    }
    class CallExpression extends Expression {
        callee: Expression;
        arguments: Expression[];
        constructor(callee: Expression, _arguments: Expression[]);
        toSource(precedence: number): string;
    }
    class MemberExpression extends Expression {
        object: Expression;
        property: Node;
        computed: boolean;
        constructor(object: Expression, property: Node, computed: boolean);
        toSource(precedence: number): string;
    }
    class Property extends Node {
        key: Node;
        value: Expression;
        kind: string;
        constructor(key: Node, value: Expression, kind: string);
        toSource(precedence: number): string;
    }
    class SwitchCase extends Node {
        test: Expression;
        consequent: Statement[];
        constructor(test: Expression, consequent: Statement[]);
        toSource(precedence: number): string;
    }
    class CatchClause extends Node {
        param: Node;
        guard: Expression;
        body: BlockStatement;
        constructor(param: Node, guard: Expression, body: BlockStatement);
    }
}
declare module J2ME.C4.Looper {
    import CFG = IR.CFG;
    import Block = IR.Block;
    import BlockVisitor = IR.BlockVisitor;
    module Control {
        enum Kind {
            SEQ = 1,
            LOOP = 2,
            IF = 3,
            CASE = 4,
            SWITCH = 5,
            LABEL_CASE = 6,
            LABEL_SWITCH = 7,
            EXIT = 8,
            BREAK = 9,
            CONTINUE = 10,
            TRY = 11,
            CATCH = 12,
        }
        class ControlNode {
            kind: Kind;
            constructor(kind: Kind);
            compile: (cx: Backend.Context) => AST.Node;
        }
        class Seq extends ControlNode {
            body: any;
            constructor(body: any);
            trace(writer: any): void;
            first(): any;
            slice(begin: any, end: any): Seq;
        }
        class Loop extends ControlNode {
            body: any;
            constructor(body: any);
            trace(writer: any): void;
        }
        class If extends ControlNode {
            cond: any;
            then: any;
            nothingThrownLabel: any;
            negated: boolean;
            else: any;
            constructor(cond: any, then: any, els: any, nothingThrownLabel?: any);
            trace(writer: any): void;
        }
        class Case extends ControlNode {
            index: any;
            body: any;
            constructor(index: any, body: any);
            trace(writer: any): void;
        }
        class Switch extends ControlNode {
            determinant: any;
            cases: any;
            nothingThrownLabel: any;
            constructor(determinant: any, cases: any, nothingThrownLabel?: any);
            trace(writer: any): void;
        }
        class LabelCase extends ControlNode {
            labels: any;
            body: any;
            constructor(labels: any, body: any);
            trace(writer: any): void;
        }
        class LabelSwitch extends ControlNode {
            cases: any;
            labelMap: any;
            constructor(cases: any);
            trace(writer: any): void;
        }
        class Exit extends ControlNode {
            label: any;
            constructor(label: any);
            trace(writer: any): void;
        }
        class Break extends ControlNode {
            label: any;
            head: any;
            constructor(label: any, head: any);
            trace(writer: any): void;
        }
        class Continue extends ControlNode {
            label: any;
            head: any;
            necessary: boolean;
            constructor(label: any, head: any);
            trace(writer: any): void;
        }
        class Try extends ControlNode {
            body: any;
            catches: any;
            nothingThrownLabel: boolean;
            constructor(body: any, catches: any);
            trace(writer: any): void;
        }
        class Catch extends ControlNode {
            varName: any;
            typeName: any;
            body: any;
            constructor(varName: any, typeName: any, body: any);
            trace(writer: any): void;
        }
    }
    class BlockSet extends BitSets.Uint32ArrayBitSet {
        blockById: Map<number, Block>;
        constructor(length: number, blockById: Map<number, Block>);
        forEachBlock(fn: BlockVisitor): void;
        choose(): Block;
        members(): Block[];
        setBlocks(bs: Block[]): void;
    }
    class Analysis {
        blocks: Block[];
        boundBlockSet: any;
        analyzedControlFlow: boolean;
        markedLoops: boolean;
        hasExceptions: boolean;
        restructuredControlFlow: boolean;
        controlTree: Control.ControlNode;
        constructor(cfg: CFG);
        makeBlockSetFactory(length: number, blockById: Block[]): void;
        normalizeReachableBlocks(root: any): void;
        computeDominance(): void;
        computeFrontiers(): void;
        analyzeControlFlow(): boolean;
        markLoops(): boolean;
        induceControlTree(): void;
        restructureControlFlow(): boolean;
    }
    function analyze(cfg: CFG): Control.ControlNode;
}
declare module J2ME.C4.Backend {
    import Identifier = AST.Identifier;
    import CallExpression = AST.CallExpression;
    import AssignmentExpression = AST.AssignmentExpression;
    import BlockStatement = AST.BlockStatement;
    import WhileStatement = AST.WhileStatement;
    import Variable = IR.Variable;
    import Constant = IR.Constant;
    function constant(value: any, cx?: Context): AST.Node;
    function id(name: any): Identifier;
    function isIdentifierName(s: any): boolean;
    function property(obj: any, ...args: any[]): any;
    function call(callee: any, args: any): CallExpression;
    function callCall(callee: any, object: any, args: any): CallExpression;
    function assignment(left: any, right: any): AssignmentExpression;
    class Context {
        label: Variable;
        variables: any[];
        constants: any[];
        parameters: any[];
        useConstant(constant: Constant): number;
        useVariable(variable: Variable): number;
        useParameter(parameter: IR.Parameter): IR.Parameter;
        compileLabelBody(node: any): any[];
        compileBreak(node: any): BlockStatement;
        compileContinue(node: any): BlockStatement;
        compileExit(node: any): BlockStatement;
        compileIf(node: any): any;
        compileSwitch(node: any): any;
        compileLabelSwitch(node: any): any;
        compileLoop(node: any): WhileStatement;
        compileSequence(node: any): BlockStatement;
        compileBlock(block: any): BlockStatement;
    }
    function compileValue(value: any, cx: Context, noVariable?: any): any;
    function compileValues(values: any, cx: Context): any;
    class Compilation {
        parameters: string[];
        body: string;
        constants: any[];
        static id: number;
        constructor(parameters: string[], body: string, constants: any[]);
        /**
         * Object references are stored on the compilation object in a property called |constants|. Some of
         * these constants are |LazyInitializer|s and the backend makes sure to emit a call to a function
         * named |C| that resolves them.
         */
        C(index: number): any;
    }
    function generate(cfg: any): Compilation;
}
/**
 * Created by mbebenita on 10/21/14.
 */
declare module J2ME.C4.IR {
    class JVMLong extends Value {
        lowBits: number;
        highBits: number;
        kind: Kind;
        constructor(lowBits: number, highBits: number, kind?: Kind);
        toString(): string;
    }
    class JVMString extends Constant {
        constructor(value: string);
        toString(): string;
    }
    class JVMClass extends Constant {
        constructor(classInfo: ClassInfo);
        toString(): string;
    }
    class JVMNewArray extends StoreDependent {
        control: Control;
        store: Store;
        arrayKind: Kind;
        length: Value;
        constructor(control: Control, store: Store, arrayKind: Kind, length: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMNewObjectArray extends StoreDependent {
        control: Control;
        store: Store;
        classInfo: ClassInfo;
        length: Value;
        constructor(control: Control, store: Store, classInfo: ClassInfo, length: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMLongBinary extends Value {
        operator: Operator;
        a: Value;
        b: Value;
        constructor(operator: Operator, a: Value, b: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMLongUnary extends Value {
        operator: Operator;
        a: Value;
        constructor(operator: Operator, a: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMFloatCompare extends Value {
        control: Control;
        a: Value;
        b: Value;
        lessThan: boolean;
        constructor(control: Control, a: Value, b: Value, lessThan: boolean);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMLongCompare extends Value {
        control: Control;
        a: Value;
        b: Value;
        constructor(control: Control, a: Value, b: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMStoreIndexed extends StoreDependent {
        kind: Kind;
        array: Value;
        index: Value;
        value: Value;
        constructor(control: Control, store: Store, kind: Kind, array: Value, index: Value, value: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMLoadIndexed extends StoreDependent {
        kind: Kind;
        array: Value;
        index: Value;
        constructor(control: Control, store: Store, kind: Kind, array: Value, index: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMConvert extends Value {
        from: Kind;
        to: Kind;
        value: Value;
        constructor(from: Kind, to: Kind, value: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMInvoke extends StoreDependent {
        state: State;
        opcode: Bytecode.Bytecodes;
        object: Value;
        methodInfo: MethodInfo;
        args: Value[];
        constructor(control: Control, store: Store, state: State, opcode: Bytecode.Bytecodes, object: Value, methodInfo: MethodInfo, args: Value[]);
        visitInputs(visitor: NodeVisitor): void;
        replaceInput(oldInput: Node, newInput: Node): number;
    }
    class JVMNew extends StoreDependent {
        classInfo: ClassInfo;
        constructor(control: Control, store: Store, classInfo: ClassInfo);
    }
    class JVMThrow extends StoreDependent {
        object: Value;
        constructor(control: Control, store: Store, object: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMCheckCast extends StoreDependent {
        object: Value;
        classInfo: ClassInfo;
        constructor(control: Control, store: Store, object: Value, classInfo: ClassInfo);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMInstanceOf extends StoreDependent {
        object: Value;
        classInfo: ClassInfo;
        constructor(control: Control, store: Store, object: Value, classInfo: ClassInfo);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMCheckArithmetic extends StoreDependent {
        value: Value;
        constructor(control: Control, store: Store, value: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMGetField extends StoreDependent {
        object: Value;
        fieldInfo: FieldInfo;
        constructor(control: Control, store: Store, object: Value, fieldInfo: FieldInfo);
        visitInputs(visitor: NodeVisitor): void;
    }
    class JVMPutField extends StoreDependent {
        object: Value;
        fieldInfo: FieldInfo;
        value: Value;
        constructor(control: Control, store: Store, object: Value, fieldInfo: FieldInfo, value: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
}
declare module J2ME.C4.Backend {
}
declare module J2ME.Bytecode {
    class Block {
        startBci: number;
        endBci: number;
        isExceptionEntry: boolean;
        isLoopHeader: boolean;
        isLoopEnd: boolean;
        blockID: number;
        region: C4.IR.Region;
        successors: Block[];
        normalSuccessors: number;
        visited: boolean;
        active: boolean;
        loops: number;
        exits: number;
        loopID: number;
        constructor();
        clone(): Block;
    }
    class ExceptionBlock extends Block {
        handler: ExceptionHandler;
        deoptBci: number;
    }
    class BlockMap {
        method: MethodInfo;
        blocks: Block[];
        private blockMap;
        private startBlock;
        private canTrap;
        exceptionHandlers: ExceptionHandler[];
        constructor(method: MethodInfo);
        build(): void;
        private makeExceptionEntries();
        private computeLoopStores();
        private initializeBlockIDs();
        getBlock(bci: number): Block;
        private makeBlock(startBci);
        private makeSwitchSuccessors(tswitch);
        private setSuccessors(predBci, successors);
        canTrapAt(opcode: Bytecodes, bci: number): boolean;
        private iterateOverBytecodes();
        /**
         * The next available loop number.
         */
        private _nextLoop;
        /**
         * Mark the block as a loop header, using the next available loop number.
         * Also checks for corner cases that we don't want to compile.
         */
        private makeLoopHeader(block);
        private handlerIsCatchAll(handler);
        private exceptionDispatch;
        private makeExceptionDispatch(handlers, index, bci);
        private addExceptionEdges();
        private fixLoopBits();
        private computeBlockOrder();
        /**
         * Depth-first traversal of the control flow graph. The flag {@linkplain Block#visited} is used to
         * visit every block only once. The flag {@linkplain Block#active} is used to detect cycles (backward
         * edges).
         */
        private computeBlockOrderFrom(block);
        trace(writer: IndentingWriter, traceBytecode?: boolean): void;
    }
}
declare module J2ME {
    var counter: Metrics.Counter;
    function printResults(): void;
    import IR = C4.IR;
    import Node = IR.Node;
    import Value = IR.Value;
    import Phi = IR.Phi;
    import Control = IR.Control;
    enum YieldReason {
        None = 0,
        Root = 1,
        Synchronized = 2,
        MonitorEnterExit = 3,
        Virtual = 4,
        Cycle = 5,
    }
    /**
     * Root set of methods that can yield. Keep this up to date or else the compiler will not generate yield code
     * at the right spots.
     */
    var yieldMap: {
        "java/lang/Thread.sleep.(J)V": YieldReason;
        "com/sun/cldc/isolate/Isolate.waitStatus.(I)V": YieldReason;
        "com/sun/midp/links/LinkPortal.getLinkCount0.()I": YieldReason;
        "com/sun/midp/links/Link.receive0.(Lcom/sun/midp/links/LinkMessage;Lcom/sun/midp/links/Link;)V": YieldReason;
        "com/nokia/mid/impl/jms/core/Launcher.handleContent.(Ljava/lang/String;)V": YieldReason;
        "com/sun/midp/util/isolate/InterIsolateMutex.lock0.(I)V": YieldReason;
        "com/sun/midp/events/NativeEventMonitor.waitForNativeEvent.(Lcom/sun/midp/events/NativeEvent;)I": YieldReason;
        "com/sun/midp/main/CommandState.exitInternal.(I)V": YieldReason;
        "com/sun/midp/io/j2me/push/ConnectionRegistry.poll0.(J)I": YieldReason;
        "com/sun/midp/rms/RecordStoreUtil.exists.(Ljava/lang/String;Ljava/lang/String;I)Z": YieldReason;
        "com/sun/midp/rms/RecordStoreUtil.deleteFile.(Ljava/lang/String;Ljava/lang/String;I)V": YieldReason;
        "com/sun/midp/rms/RecordStoreFile.openRecordStoreFile.(Ljava/lang/String;Ljava/lang/String;I)I": YieldReason;
        "com/ibm/oti/connection/file/Connection.existsImpl.([B)Z": YieldReason;
        "com/ibm/oti/connection/file/Connection.fileSizeImpl.([B)J": YieldReason;
        "com/ibm/oti/connection/file/Connection.isDirectoryImpl.([B)Z": YieldReason;
        "com/ibm/oti/connection/file/Connection.listImpl.([B[BZ)[[B": YieldReason;
        "com/ibm/oti/connection/file/Connection.mkdirImpl.([B)I": YieldReason;
        "com/ibm/oti/connection/file/Connection.newFileImpl.([B)I": YieldReason;
        "com/ibm/oti/connection/file/Connection.deleteFileImpl.([B)Z": YieldReason;
        "com/ibm/oti/connection/file/Connection.lastModifiedImpl.([B)J": YieldReason;
        "com/ibm/oti/connection/file/Connection.renameImpl.([B[B)V": YieldReason;
        "com/ibm/oti/connection/file/Connection.truncateImpl.([BJ)V": YieldReason;
        "com/ibm/oti/connection/file/FCInputStream.openImpl.([B)I": YieldReason;
        "com/ibm/oti/connection/file/FCOutputStream.openImpl.([B)I": YieldReason;
        "com/ibm/oti/connection/file/FCOutputStream.openOffsetImpl.([BJ)I": YieldReason;
        "com/sun/midp/io/j2me/storage/RandomAccessStream.open.(Ljava/lang/String;I)I": YieldReason;
        "javax/microedition/lcdui/ImageDataFactory.createImmutableImageDecodeImage.(Ljavax/microedition/lcdui/ImageData;[BII)V": YieldReason;
        "com/nokia/mid/ui/TextEditorThread.sleep.()V": YieldReason;
        "com/nokia/mid/ui/VKVisibilityNotificationRunnable.sleepUntilVKVisibilityChange.()Z": YieldReason;
        "org/mozilla/io/LocalMsgConnection.init.(Ljava/lang/String;)V": YieldReason;
        "org/mozilla/io/LocalMsgConnection.receiveData.([B)I": YieldReason;
        "com/sun/mmedia/PlayerImpl.nRealize.(ILjava/lang/String;)Z": YieldReason;
        "com/sun/mmedia/DirectRecord.nPause.(I)I": YieldReason;
        "com/sun/mmedia/DirectRecord.nStop.(I)I": YieldReason;
        "com/sun/mmedia/DirectRecord.nClose.(I)I": YieldReason;
        "com/sun/mmedia/DirectRecord.nStart.(I)I": YieldReason;
        "com/sun/midp/io/j2me/socket/Protocol.open0.([BI)V": YieldReason;
        "com/sun/midp/io/j2me/socket/Protocol.read0.([BII)I": YieldReason;
        "com/sun/midp/io/j2me/socket/Protocol.write0.([BII)I": YieldReason;
        "com/sun/midp/io/j2me/socket/Protocol.close0.()V": YieldReason;
        "com/sun/midp/io/j2me/sms/Protocol.receive0.(IIILcom/sun/midp/io/j2me/sms/Protocol$SMSPacket;)I": YieldReason;
        "com/sun/midp/io/j2me/sms/Protocol.send0.(IILjava/lang/String;II[B)I": YieldReason;
        "com/sun/j2me/pim/PIMProxy.getNextItemDescription0.(I[I)Z": YieldReason;
        "java/lang/Object.wait.(J)V": YieldReason;
        "java/lang/Class.invoke_clinit.()V": YieldReason;
        "java/lang/Class.newInstance.()Ljava/lang/Object;": YieldReason;
        "java/lang/Thread.yield.()V": YieldReason;
    };
    function isTwoSlot(kind: Kind): boolean;
    function assertHigh(x: Value): void;
    enum CompilationTarget {
        Runtime = 0,
        Buildtime = 1,
        Static = 2,
    }
    enum TAGS {
        CONSTANT_Class = 7,
        CONSTANT_Fieldref = 9,
        CONSTANT_Methodref = 10,
        CONSTANT_InterfaceMethodref = 11,
        CONSTANT_String = 8,
        CONSTANT_Integer = 3,
        CONSTANT_Float = 4,
        CONSTANT_Long = 5,
        CONSTANT_Double = 6,
        CONSTANT_NameAndType = 12,
        CONSTANT_Utf8 = 1,
        CONSTANT_Unicode = 2,
    }
    interface ConstantPoolEntry {
        tag: TAGS;
        name_index: number;
        bytes: string;
        class_index: number;
        name_and_type_index: number;
        signature_index: number;
        string_index: number;
        integer: number;
        float: number;
        double: number;
        highBits: number;
        lowBits: number;
    }
    interface ExceptionHandler {
        start_pc: number;
        end_pc: number;
        handler_pc: number;
        catch_type: number;
    }
    class CompiledMethodInfo {
        args: string[];
        body: string;
        referencedClasses: ClassInfo[];
        constructor(args: string[], body: string, referencedClasses: ClassInfo[]);
    }
    class State {
        private static _nextID;
        id: number;
        bci: number;
        local: Value[];
        stack: Value[];
        store: Value;
        loads: Value[];
        constructor(bci?: number);
        clone(bci: number): State;
        matches(other: State): boolean;
        makeLoopPhis(control: Control, dirtyLocals: boolean[]): State;
        static tryOptimizePhi(x: Value): Value;
        optimize(): void;
        static mergeValue(control: Control, a: Value, b: Value): Phi;
        static mergeValues(control: Control, a: Value[], b: Value[]): void;
        merge(control: Control, other: State): void;
        trace(writer: IndentingWriter): void;
        static toBriefString(x: Node): string;
        toString(): string;
        /**
         * Pushes a value onto the stack without checking the type.
         */
        xpush(x: Node): void;
        /**
         * Pushes a value onto the stack and checks that it is an int.
         */
        ipush(x: Node): void;
        /**
         * Pushes a value onto the stack and checks that it is a float.
         * @param x the instruction to push onto the stack
         */
        fpush(x: Node): void;
        /**
         * Pushes a value onto the stack and checks that it is an object.
         */
        apush(x: Node): void;
        /**
         * Pushes a value onto the stack and checks that it is a long.
         */
        lpush(x: Node): void;
        /**
         * Pushes a value onto the stack and checks that it is a double.
         */
        dpush(x: Node): void;
        /**
         * Pushes an instruction onto the stack with the expected type.
         */
        push(kind: Kind, x: Value): void;
        /**
         * Pops an instruction off the stack with the expected type.
         */
        pop(kind: Kind): Value;
        /**
         * Pops a value off of the stack without checking the type.
         */
        xpop(): Value;
        /**
         * Pops a value off of the stack and checks that it is an int.
         */
        ipop(): Value;
        /**
         * Pops a value off of the stack and checks that it is a float.
         */
        fpop(): Value;
        /**
         * Pops a value off of the stack and checks that it is an object.
         */
        apop(): Value;
        /**
         * Pops a value off of the stack and checks that it is a long.
         */
        lpop(): Value;
        /**
         * Pops a value off of the stack and checks that it is a double.
         */
        dpop(): Value;
        peek(): Value;
        /**
         * Loads the local variable at the specified index.
         */
        loadLocal(i: number): Value;
        /**
         * Stores a given local variable at the specified index. If the value takes up two slots,
         * then the next local variable index is also overwritten.
         */
        storeLocal(i: number, x: Value): void;
    }
    function quote(s: any): string;
    function compileMethodInfo(methodInfo: MethodInfo, ctx: Context, target: CompilationTarget): CompiledMethodInfo;
}
declare module J2ME {
    class Emitter {
        writer: IndentingWriter;
        closure: boolean;
        debugInfo: boolean;
        klassHeaderOnly: boolean;
        definitions: boolean;
        constructor(writer: IndentingWriter, closure: boolean, debugInfo: boolean, klassHeaderOnly?: boolean, definitions?: boolean);
    }
    function signatureToDefinition(signature: string, includeReturnType?: boolean, excludeArgumentNames?: boolean): string;
    function emitMethodDefinition(emitter: Emitter, methodInfo: MethodInfo): void;
    function emitFieldDefinition(emitter: Emitter, fieldInfo: FieldInfo): void;
    function emitKlass(emitter: Emitter, classInfo: ClassInfo): void;
    function emitReferencedSymbols(emitter: Emitter, classInfo: ClassInfo, compiledMethods: CompiledMethodInfo[]): void;
    function compile(jvm: any, jarFilter: (jarFile: string) => boolean, classFilter: (classInfo: ClassInfo) => boolean, methodFilter: (methodInfo: MethodInfo) => boolean, fileFilter: string, debugInfo: boolean, tsDefinitions: boolean): void;
}
