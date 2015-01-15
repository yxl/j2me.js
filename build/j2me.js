/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var jsGlobal = (function () {
    return this || (1, eval)('this');
})();
var inBrowser = typeof console != "undefined";
// declare var print;
// declare var console;
// declare var performance;
// declare var XMLHttpRequest;
// declare var document;
// declare var getComputedStyle;
/** @const */ var release = true;
/** @const */ var profile = false;
function dumpLine(s) {
    if (typeof dump !== "undefined") {
        dump(s + "\n");
    }
}
if (!jsGlobal.performance) {
    jsGlobal.performance = {};
}
if (!jsGlobal.performance.now) {
    jsGlobal.performance.now = typeof dateNow !== 'undefined' ? dateNow : Date.now;
}
function log(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (inBrowser) {
        console.log.apply(console, arguments);
    }
    else {
        jsGlobal.print.apply(jsGlobal, arguments);
    }
}
function warn(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (inBrowser) {
        console.warn.apply(console, arguments);
    }
    else {
        jsGlobal.print(J2ME.IndentingWriter.RED + message + J2ME.IndentingWriter.ENDC);
    }
}
var J2ME;
(function (J2ME) {
    function isIdentifierStart(c) {
        return (c === '$') || (c === '_') || (c === '\\') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    }
    J2ME.isIdentifierStart = isIdentifierStart;
    function isIdentifierPart(c) {
        return (c === '$') || (c === '_') || (c === '\\') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || ((c >= '0') && (c <= '9'));
    }
    J2ME.isIdentifierPart = isIdentifierPart;
    (function (CharacterCodes) {
        CharacterCodes[CharacterCodes["_0"] = 48] = "_0";
        CharacterCodes[CharacterCodes["_1"] = 49] = "_1";
        CharacterCodes[CharacterCodes["_2"] = 50] = "_2";
        CharacterCodes[CharacterCodes["_3"] = 51] = "_3";
        CharacterCodes[CharacterCodes["_4"] = 52] = "_4";
        CharacterCodes[CharacterCodes["_5"] = 53] = "_5";
        CharacterCodes[CharacterCodes["_6"] = 54] = "_6";
        CharacterCodes[CharacterCodes["_7"] = 55] = "_7";
        CharacterCodes[CharacterCodes["_8"] = 56] = "_8";
        CharacterCodes[CharacterCodes["_9"] = 57] = "_9";
    })(J2ME.CharacterCodes || (J2ME.CharacterCodes = {}));
    var CharacterCodes = J2ME.CharacterCodes;
    /**
     * The buffer length required to contain any unsigned 32-bit integer.
     */
    /** @const */ J2ME.UINT32_CHAR_BUFFER_LENGTH = 10; // "4294967295".length;
    /** @const */ J2ME.UINT32_MAX = 0xFFFFFFFF;
    /** @const */ J2ME.UINT32_MAX_DIV_10 = 0x19999999; // UINT32_MAX / 10;
    /** @const */ J2ME.UINT32_MAX_MOD_10 = 0x5; // UINT32_MAX % 10
    function isString(value) {
        return typeof value === "string";
    }
    J2ME.isString = isString;
    function isFunction(value) {
        return typeof value === "function";
    }
    J2ME.isFunction = isFunction;
    function isNumber(value) {
        return typeof value === "number";
    }
    J2ME.isNumber = isNumber;
    function isInteger(value) {
        return (value | 0) === value;
    }
    J2ME.isInteger = isInteger;
    function isArray(value) {
        return value instanceof Array;
    }
    J2ME.isArray = isArray;
    function isNumberOrString(value) {
        return typeof value === "number" || typeof value === "string";
    }
    J2ME.isNumberOrString = isNumberOrString;
    function isObject(value) {
        return typeof value === "object" || typeof value === 'function';
    }
    J2ME.isObject = isObject;
    function toNumber(x) {
        return +x;
    }
    J2ME.toNumber = toNumber;
    function isNumericString(value) {
        // ECMAScript 5.1 - 9.8.1 Note 1, this expression is true for all
        // numbers x other than -0.
        return String(Number(value)) === value;
    }
    J2ME.isNumericString = isNumericString;
    /**
     * Whether the specified |value| is a number or the string representation of a number.
     */
    function isNumeric(value) {
        if (typeof value === "number") {
            return true;
        }
        if (typeof value === "string") {
            // |value| is rarely numeric (it's usually an identifier), and the
            // isIndex()/isNumericString() pair is slow and expensive, so we do a
            // quick check for obvious non-numericalness first. Just checking if the
            // first char is a 7-bit identifier char catches most cases.
            var c = value.charCodeAt(0);
            if ((65 <= c && c <= 90) || (97 <= c && c <= 122) || (c === 36) || (c === 95)) {
                return false;
            }
            return isIndex(value) || isNumericString(value);
        }
        // Debug.notImplemented(typeof value);
        return false;
    }
    J2ME.isNumeric = isNumeric;
    /**
     * Whether the specified |value| is an unsigned 32 bit number expressed as a number
     * or string.
     */
    function isIndex(value) {
        // js/src/vm/String.cpp JSFlatString::isIndexSlow
        // http://dxr.mozilla.org/mozilla-central/source/js/src/vm/String.cpp#474
        var index = 0;
        if (typeof value === "number") {
            index = (value | 0);
            if (value === index && index >= 0) {
                return true;
            }
            return value >>> 0 === value;
        }
        if (typeof value !== "string") {
            return false;
        }
        var length = value.length;
        if (length === 0) {
            return false;
        }
        if (value === "0") {
            return true;
        }
        // Is there any way this will fit?
        if (length > J2ME.UINT32_CHAR_BUFFER_LENGTH) {
            return false;
        }
        var i = 0;
        index = value.charCodeAt(i++) - 48 /* _0 */;
        if (index < 1 || index > 9) {
            return false;
        }
        var oldIndex = 0;
        var c = 0;
        while (i < length) {
            c = value.charCodeAt(i++) - 48 /* _0 */;
            if (c < 0 || c > 9) {
                return false;
            }
            oldIndex = index;
            index = 10 * index + c;
        }
        /*
         * Look out for "4294967296" and larger-number strings that fit in UINT32_CHAR_BUFFER_LENGTH.
         * Only unsigned 32-bit integers shall pass.
         */
        if ((oldIndex < J2ME.UINT32_MAX_DIV_10) || (oldIndex === J2ME.UINT32_MAX_DIV_10 && c <= J2ME.UINT32_MAX_MOD_10)) {
            return true;
        }
        return false;
    }
    J2ME.isIndex = isIndex;
    function isNullOrUndefined(value) {
        return value == undefined;
    }
    J2ME.isNullOrUndefined = isNullOrUndefined;
    var Debug;
    (function (Debug) {
        function backtrace() {
            try {
                throw new Error();
            }
            catch (e) {
                return e.stack ? e.stack.split('\n').slice(2).join('\n') : '';
            }
        }
        Debug.backtrace = backtrace;
        function error(message) {
            throw new Error(message);
        }
        Debug.error = error;
        function assert(condition, message) {
            if (message === void 0) { message = "assertion failed"; }
            if (condition === "") {
                condition = true;
            }
            if (!condition) {
                Debug.error(message.toString());
            }
        }
        Debug.assert = assert;
        function assertUnreachable(msg) {
            var location = new Error().stack.split('\n')[1];
            throw new Error("Reached unreachable location " + location + msg);
        }
        Debug.assertUnreachable = assertUnreachable;
        function assertNotImplemented(condition, message) {
            if (!condition) {
                Debug.error("notImplemented: " + message);
            }
        }
        Debug.assertNotImplemented = assertNotImplemented;
        function warning(message) {
            release || warn(message);
        }
        Debug.warning = warning;
        function notUsed(message) {
            release || Debug.assert(false, "Not Used " + message);
        }
        Debug.notUsed = notUsed;
        function notImplemented(message) {
            log("release: " + release);
            release || Debug.assert(false, "Not Implemented " + message);
        }
        Debug.notImplemented = notImplemented;
        function abstractMethod(message) {
            Debug.assert(false, "Abstract Method " + message);
        }
        Debug.abstractMethod = abstractMethod;
        var somewhatImplementedCache = {};
        function somewhatImplemented(message) {
            if (somewhatImplementedCache[message]) {
                return;
            }
            somewhatImplementedCache[message] = true;
            Debug.warning("somewhatImplemented: " + message);
        }
        Debug.somewhatImplemented = somewhatImplemented;
        function unexpected(message) {
            Debug.assert(false, "Unexpected: " + message);
        }
        Debug.unexpected = unexpected;
        function untested(message) {
            Debug.warning("Congratulations, you've found a code path for which we haven't found a test case. Please submit the test case: " + message);
        }
        Debug.untested = untested;
    })(Debug = J2ME.Debug || (J2ME.Debug = {}));
    function getTicks() {
        return performance.now();
    }
    J2ME.getTicks = getTicks;
    var ArrayUtilities;
    (function (ArrayUtilities) {
        var assert = Debug.assert;
        /**
         * Pops elements from a source array into a destination array. This avoids
         * allocations and should be faster. The elements in the destination array
         * are pushed in the same order as they appear in the source array:
         *
         * popManyInto([1, 2, 3], 2, dst) => dst = [2, 3]
         */
        function popManyInto(src, count, dst) {
            release || assert(src.length >= count);
            for (var i = count - 1; i >= 0; i--) {
                dst[i] = src.pop();
            }
            dst.length = count;
        }
        ArrayUtilities.popManyInto = popManyInto;
        function popMany(array, count) {
            release || assert(array.length >= count);
            var start = array.length - count;
            var result = array.slice(start, this.length);
            array.splice(start, count);
            return result;
        }
        ArrayUtilities.popMany = popMany;
        /**
         * Just deletes several array elements from the end of the list.
         */
        function popManyIntoVoid(array, count) {
            release || assert(array.length >= count);
            array.length = array.length - count;
        }
        ArrayUtilities.popManyIntoVoid = popManyIntoVoid;
        function pushMany(dst, src) {
            for (var i = 0; i < src.length; i++) {
                dst.push(src[i]);
            }
        }
        ArrayUtilities.pushMany = pushMany;
        function top(array) {
            return array.length && array[array.length - 1];
        }
        ArrayUtilities.top = top;
        function last(array) {
            return array.length && array[array.length - 1];
        }
        ArrayUtilities.last = last;
        function peek(array) {
            release || assert(array.length > 0);
            return array[array.length - 1];
        }
        ArrayUtilities.peek = peek;
        function indexOf(array, value) {
            for (var i = 0, j = array.length; i < j; i++) {
                if (array[i] === value) {
                    return i;
                }
            }
            return -1;
        }
        ArrayUtilities.indexOf = indexOf;
        function pushUnique(array, value) {
            for (var i = 0, j = array.length; i < j; i++) {
                if (array[i] === value) {
                    return i;
                }
            }
            array.push(value);
            return array.length - 1;
        }
        ArrayUtilities.pushUnique = pushUnique;
        function unique(array) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                pushUnique(result, array[i]);
            }
            return result;
        }
        ArrayUtilities.unique = unique;
        function copyFrom(dst, src) {
            dst.length = 0;
            ArrayUtilities.pushMany(dst, src);
        }
        ArrayUtilities.copyFrom = copyFrom;
        /**
         * Makes sure that a typed array has the requested capacity. If required, it creates a new
         * instance of the array's class with a power-of-two capacity at least as large as required.
         *
         * Note: untyped because generics with constraints are pretty annoying.
         */
        function ensureTypedArrayCapacity(array, capacity) {
            if (array.length < capacity) {
                var oldArray = array;
                array = new array.constructor(IntegerUtilities.nearestPowerOfTwo(capacity));
                array.set(oldArray, 0);
            }
            return array;
        }
        ArrayUtilities.ensureTypedArrayCapacity = ensureTypedArrayCapacity;
    })(ArrayUtilities = J2ME.ArrayUtilities || (J2ME.ArrayUtilities = {}));
    var ObjectUtilities;
    (function (ObjectUtilities) {
        function boxValue(value) {
            if (isNullOrUndefined(value) || isObject(value)) {
                return value;
            }
            return Object(value);
        }
        ObjectUtilities.boxValue = boxValue;
        function toKeyValueArray(object) {
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var array = [];
            for (var k in object) {
                if (hasOwnProperty.call(object, k)) {
                    array.push([k, object[k]]);
                }
            }
            return array;
        }
        ObjectUtilities.toKeyValueArray = toKeyValueArray;
        function isPrototypeWriteable(object) {
            return Object.getOwnPropertyDescriptor(object, "prototype").writable;
        }
        ObjectUtilities.isPrototypeWriteable = isPrototypeWriteable;
        function hasOwnProperty(object, name) {
            return Object.prototype.hasOwnProperty.call(object, name);
        }
        ObjectUtilities.hasOwnProperty = hasOwnProperty;
        function propertyIsEnumerable(object, name) {
            return Object.prototype.propertyIsEnumerable.call(object, name);
        }
        ObjectUtilities.propertyIsEnumerable = propertyIsEnumerable;
        function getOwnPropertyDescriptor(object, name) {
            return Object.getOwnPropertyDescriptor(object, name);
        }
        ObjectUtilities.getOwnPropertyDescriptor = getOwnPropertyDescriptor;
        function hasOwnGetter(object, name) {
            var d = Object.getOwnPropertyDescriptor(object, name);
            return !!(d && d.get);
        }
        ObjectUtilities.hasOwnGetter = hasOwnGetter;
        function getOwnGetter(object, name) {
            var d = Object.getOwnPropertyDescriptor(object, name);
            return d ? d.get : null;
        }
        ObjectUtilities.getOwnGetter = getOwnGetter;
        function hasOwnSetter(object, name) {
            var d = Object.getOwnPropertyDescriptor(object, name);
            return !!(d && !!d.set);
        }
        ObjectUtilities.hasOwnSetter = hasOwnSetter;
        function createObject(prototype) {
            return Object.create(prototype);
        }
        ObjectUtilities.createObject = createObject;
        function createEmptyObject() {
            return Object.create(null);
        }
        ObjectUtilities.createEmptyObject = createEmptyObject;
        function createMap() {
            return Object.create(null);
        }
        ObjectUtilities.createMap = createMap;
        function createArrayMap() {
            return [];
        }
        ObjectUtilities.createArrayMap = createArrayMap;
        function defineReadOnlyProperty(object, name, value) {
            Object.defineProperty(object, name, {
                value: value,
                writable: false,
                configurable: true,
                enumerable: false
            });
        }
        ObjectUtilities.defineReadOnlyProperty = defineReadOnlyProperty;
        function getOwnPropertyDescriptors(object) {
            var o = ObjectUtilities.createMap();
            var properties = Object.getOwnPropertyNames(object);
            for (var i = 0; i < properties.length; i++) {
                o[properties[i]] = Object.getOwnPropertyDescriptor(object, properties[i]);
            }
            return o;
        }
        ObjectUtilities.getOwnPropertyDescriptors = getOwnPropertyDescriptors;
        function cloneObject(object) {
            var clone = Object.create(Object.getPrototypeOf(object));
            copyOwnProperties(clone, object);
            return clone;
        }
        ObjectUtilities.cloneObject = cloneObject;
        function copyProperties(object, template) {
            for (var property in template) {
                object[property] = template[property];
            }
        }
        ObjectUtilities.copyProperties = copyProperties;
        function copyOwnProperties(object, template) {
            for (var property in template) {
                if (hasOwnProperty(template, property)) {
                    object[property] = template[property];
                }
            }
        }
        ObjectUtilities.copyOwnProperties = copyOwnProperties;
        function copyOwnPropertyDescriptors(object, template, overwrite) {
            if (overwrite === void 0) { overwrite = true; }
            for (var property in template) {
                if (hasOwnProperty(template, property)) {
                    var descriptor = Object.getOwnPropertyDescriptor(template, property);
                    if (!overwrite && hasOwnProperty(object, property)) {
                        continue;
                    }
                    release || Debug.assert(descriptor);
                    try {
                        Object.defineProperty(object, property, descriptor);
                    }
                    catch (e) {
                    }
                }
            }
        }
        ObjectUtilities.copyOwnPropertyDescriptors = copyOwnPropertyDescriptors;
        function getLatestGetterOrSetterPropertyDescriptor(object, name) {
            var descriptor = {};
            while (object) {
                var tmp = Object.getOwnPropertyDescriptor(object, name);
                if (tmp) {
                    descriptor.get = descriptor.get || tmp.get;
                    descriptor.set = descriptor.set || tmp.set;
                }
                if (descriptor.get && descriptor.set) {
                    break;
                }
                object = Object.getPrototypeOf(object);
            }
            return descriptor;
        }
        ObjectUtilities.getLatestGetterOrSetterPropertyDescriptor = getLatestGetterOrSetterPropertyDescriptor;
        function defineNonEnumerableGetterOrSetter(obj, name, value, isGetter) {
            var descriptor = ObjectUtilities.getLatestGetterOrSetterPropertyDescriptor(obj, name);
            descriptor.configurable = true;
            descriptor.enumerable = false;
            if (isGetter) {
                descriptor.get = value;
            }
            else {
                descriptor.set = value;
            }
            Object.defineProperty(obj, name, descriptor);
        }
        ObjectUtilities.defineNonEnumerableGetterOrSetter = defineNonEnumerableGetterOrSetter;
        function defineNonEnumerableGetter(obj, name, getter) {
            Object.defineProperty(obj, name, { get: getter, configurable: true, enumerable: false });
        }
        ObjectUtilities.defineNonEnumerableGetter = defineNonEnumerableGetter;
        function defineNonEnumerableSetter(obj, name, setter) {
            Object.defineProperty(obj, name, { set: setter, configurable: true, enumerable: false });
        }
        ObjectUtilities.defineNonEnumerableSetter = defineNonEnumerableSetter;
        function defineNonEnumerableProperty(obj, name, value) {
            Object.defineProperty(obj, name, { value: value, writable: true, configurable: true, enumerable: false });
        }
        ObjectUtilities.defineNonEnumerableProperty = defineNonEnumerableProperty;
        function defineNonEnumerableForwardingProperty(obj, name, otherName) {
            Object.defineProperty(obj, name, {
                get: FunctionUtilities.makeForwardingGetter(otherName),
                set: FunctionUtilities.makeForwardingSetter(otherName),
                configurable: true,
                enumerable: false
            });
        }
        ObjectUtilities.defineNonEnumerableForwardingProperty = defineNonEnumerableForwardingProperty;
        function defineNewNonEnumerableProperty(obj, name, value) {
            release || Debug.assert(!Object.prototype.hasOwnProperty.call(obj, name), "Property: " + name + " already exits.");
            ObjectUtilities.defineNonEnumerableProperty(obj, name, value);
        }
        ObjectUtilities.defineNewNonEnumerableProperty = defineNewNonEnumerableProperty;
    })(ObjectUtilities = J2ME.ObjectUtilities || (J2ME.ObjectUtilities = {}));
    var FunctionUtilities;
    (function (FunctionUtilities) {
        function makeForwardingGetter(target) {
            return new Function("return this[\"" + target + "\"]");
        }
        FunctionUtilities.makeForwardingGetter = makeForwardingGetter;
        function makeForwardingSetter(target) {
            return new Function("value", "this[\"" + target + "\"] = value;");
        }
        FunctionUtilities.makeForwardingSetter = makeForwardingSetter;
        /**
         * Attaches a property to the bound function so we can detect when if it
         * ever gets rebound.
         * TODO: find out why we need this, maybe remove it.
         */
        function bindSafely(fn, object) {
            release || Debug.assert(!fn.boundTo && object);
            var f = fn.bind(object);
            f.boundTo = object;
            return f;
        }
        FunctionUtilities.bindSafely = bindSafely;
    })(FunctionUtilities = J2ME.FunctionUtilities || (J2ME.FunctionUtilities = {}));
    var StringUtilities;
    (function (StringUtilities) {
        var assert = Debug.assert;
        function repeatString(c, n) {
            var s = "";
            for (var i = 0; i < n; i++) {
                s += c;
            }
            return s;
        }
        StringUtilities.repeatString = repeatString;
        function memorySizeToString(value) {
            value |= 0;
            var K = 1024;
            var M = K * K;
            if (value < K) {
                return value + " B";
            }
            else if (value < M) {
                return (value / K).toFixed(2) + "KB";
            }
            else {
                return (value / M).toFixed(2) + "MB";
            }
        }
        StringUtilities.memorySizeToString = memorySizeToString;
        /**
         * Returns a reasonably sized description of the |value|, to be used for debugging purposes.
         */
        function toSafeString(value) {
            if (typeof value === "string") {
                return "\"" + value + "\"";
            }
            if (typeof value === "number" || typeof value === "boolean") {
                return String(value);
            }
            if (value instanceof Array) {
                return "[] " + value.length;
            }
            return typeof value;
        }
        StringUtilities.toSafeString = toSafeString;
        function toSafeArrayString(array) {
            var str = [];
            for (var i = 0; i < array.length; i++) {
                str.push(toSafeString(array[i]));
            }
            return str.join(", ");
        }
        StringUtilities.toSafeArrayString = toSafeArrayString;
        function utf8decode(str) {
            var bytes = new Uint8Array(str.length * 4);
            var b = 0;
            for (var i = 0, j = str.length; i < j; i++) {
                var code = str.charCodeAt(i);
                if (code <= 0x7f) {
                    bytes[b++] = code;
                    continue;
                }
                if (0xD800 <= code && code <= 0xDBFF) {
                    var codeLow = str.charCodeAt(i + 1);
                    if (0xDC00 <= codeLow && codeLow <= 0xDFFF) {
                        // convert only when both high and low surrogates are present
                        code = ((code & 0x3FF) << 10) + (codeLow & 0x3FF) + 0x10000;
                        ++i;
                    }
                }
                if ((code & 0xFFE00000) !== 0) {
                    bytes[b++] = 0xF8 | ((code >>> 24) & 0x03);
                    bytes[b++] = 0x80 | ((code >>> 18) & 0x3F);
                    bytes[b++] = 0x80 | ((code >>> 12) & 0x3F);
                    bytes[b++] = 0x80 | ((code >>> 6) & 0x3F);
                    bytes[b++] = 0x80 | (code & 0x3F);
                }
                else if ((code & 0xFFFF0000) !== 0) {
                    bytes[b++] = 0xF0 | ((code >>> 18) & 0x07);
                    bytes[b++] = 0x80 | ((code >>> 12) & 0x3F);
                    bytes[b++] = 0x80 | ((code >>> 6) & 0x3F);
                    bytes[b++] = 0x80 | (code & 0x3F);
                }
                else if ((code & 0xFFFFF800) !== 0) {
                    bytes[b++] = 0xE0 | ((code >>> 12) & 0x0F);
                    bytes[b++] = 0x80 | ((code >>> 6) & 0x3F);
                    bytes[b++] = 0x80 | (code & 0x3F);
                }
                else {
                    bytes[b++] = 0xC0 | ((code >>> 6) & 0x1F);
                    bytes[b++] = 0x80 | (code & 0x3F);
                }
            }
            return bytes.subarray(0, b);
        }
        StringUtilities.utf8decode = utf8decode;
        function utf8encode(bytes) {
            var j = 0, str = "";
            while (j < bytes.length) {
                var b1 = bytes[j++] & 0xFF;
                if (b1 <= 0x7F) {
                    str += String.fromCharCode(b1);
                }
                else {
                    var currentPrefix = 0xC0;
                    var validBits = 5;
                    do {
                        var mask = (currentPrefix >> 1) | 0x80;
                        if ((b1 & mask) === currentPrefix)
                            break;
                        currentPrefix = (currentPrefix >> 1) | 0x80;
                        --validBits;
                    } while (validBits >= 0);
                    if (validBits <= 0) {
                        // Invalid UTF8 character -- copying as is
                        str += String.fromCharCode(b1);
                        continue;
                    }
                    var code = (b1 & ((1 << validBits) - 1));
                    var invalid = false;
                    for (var i = 5; i >= validBits; --i) {
                        var bi = bytes[j++];
                        if ((bi & 0xC0) != 0x80) {
                            // Invalid UTF8 character sequence
                            invalid = true;
                            break;
                        }
                        code = (code << 6) | (bi & 0x3F);
                    }
                    if (invalid) {
                        for (var k = j - (7 - i); k < j; ++k) {
                            str += String.fromCharCode(bytes[k] & 255);
                        }
                        continue;
                    }
                    if (code >= 0x10000) {
                        str += String.fromCharCode((((code - 0x10000) >> 10) & 0x3FF) | 0xD800, (code & 0x3FF) | 0xDC00);
                    }
                    else {
                        str += String.fromCharCode(code);
                    }
                }
            }
            return str;
        }
        StringUtilities.utf8encode = utf8encode;
        // https://gist.github.com/958841
        function base64ArrayBuffer(arrayBuffer) {
            var base64 = '';
            var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var bytes = new Uint8Array(arrayBuffer);
            var byteLength = bytes.byteLength;
            var byteRemainder = byteLength % 3;
            var mainLength = byteLength - byteRemainder;
            var a, b, c, d;
            var chunk;
            for (var i = 0; i < mainLength; i = i + 3) {
                // Combine the three bytes into a single integer
                chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                // Use bitmasks to extract 6-bit segments from the triplet
                a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
                b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
                c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
                d = chunk & 63; // 63 = 2^6 - 1
                // Convert the raw binary segments to the appropriate ASCII encoding
                base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
            }
            // Deal with the remaining bytes and padding
            if (byteRemainder == 1) {
                chunk = bytes[mainLength];
                a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
                // Set the 4 least significant bits to zero
                b = (chunk & 3) << 4; // 3 = 2^2 - 1
                base64 += encodings[a] + encodings[b] + '==';
            }
            else if (byteRemainder == 2) {
                chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
                a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
                b = (chunk & 1008) >> 4; // 1008 = (2^6 - 1) << 4
                // Set the 2 least significant bits to zero
                c = (chunk & 15) << 2; // 15 = 2^4 - 1
                base64 += encodings[a] + encodings[b] + encodings[c] + '=';
            }
            return base64;
        }
        StringUtilities.base64ArrayBuffer = base64ArrayBuffer;
        function escapeString(str) {
            if (str !== undefined) {
                str = str.replace(/[^\w$]/gi, "$"); /* No dots, colons, dashes and /s */
                if (/^\d/.test(str)) {
                    str = '$' + str;
                }
            }
            return str;
        }
        StringUtilities.escapeString = escapeString;
        /**
         * Workaround for max stack size limit.
         */
        function fromCharCodeArray(buffer) {
            var str = "", SLICE = 1024 * 16;
            for (var i = 0; i < buffer.length; i += SLICE) {
                var chunk = Math.min(buffer.length - i, SLICE);
                str += String.fromCharCode.apply(null, buffer.subarray(i, i + chunk));
            }
            return str;
        }
        StringUtilities.fromCharCodeArray = fromCharCodeArray;
        var _encoding = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_';
        function variableLengthEncodeInt32(n) {
            var e = _encoding;
            var bitCount = (32 - Math.clz32(n));
            release || assert(bitCount <= 32, bitCount);
            var l = Math.ceil(bitCount / 6);
            // Encode length followed by six bit chunks.
            var s = e[l];
            for (var i = l - 1; i >= 0; i--) {
                var offset = (i * 6);
                s += e[(n >> offset) & 0x3F];
            }
            release || assert(StringUtilities.variableLengthDecodeInt32(s) === n, n + " : " + s + " - " + l + " bits: " + bitCount);
            return s;
        }
        StringUtilities.variableLengthEncodeInt32 = variableLengthEncodeInt32;
        function toEncoding(n) {
            return _encoding[n];
        }
        StringUtilities.toEncoding = toEncoding;
        function fromEncoding(s) {
            var c = s.charCodeAt(0);
            var e = 0;
            if (c >= 65 && c <= 90) {
                return c - 65;
            }
            else if (c >= 97 && c <= 122) {
                return c - 71;
            }
            else if (c >= 48 && c <= 57) {
                return c + 4;
            }
            else if (c === 36) {
                return 62;
            }
            else if (c === 95) {
                return 63;
            }
            release || assert(false, "Invalid Encoding");
        }
        StringUtilities.fromEncoding = fromEncoding;
        function variableLengthDecodeInt32(s) {
            var l = StringUtilities.fromEncoding(s[0]);
            var n = 0;
            for (var i = 0; i < l; i++) {
                var offset = ((l - i - 1) * 6);
                n |= StringUtilities.fromEncoding(s[1 + i]) << offset;
            }
            return n;
        }
        StringUtilities.variableLengthDecodeInt32 = variableLengthDecodeInt32;
        function trimMiddle(s, maxLength) {
            if (s.length <= maxLength) {
                return s;
            }
            var leftHalf = maxLength >> 1;
            var rightHalf = maxLength - leftHalf - 1;
            return s.substr(0, leftHalf) + "\u2026" + s.substr(s.length - rightHalf, rightHalf);
        }
        StringUtilities.trimMiddle = trimMiddle;
        function multiple(s, count) {
            var o = "";
            for (var i = 0; i < count; i++) {
                o += s;
            }
            return o;
        }
        StringUtilities.multiple = multiple;
        function indexOfAny(s, chars, position) {
            var index = s.length;
            for (var i = 0; i < chars.length; i++) {
                var j = s.indexOf(chars[i], position);
                if (j >= 0) {
                    index = Math.min(index, j);
                }
            }
            return index === s.length ? -1 : index;
        }
        StringUtilities.indexOfAny = indexOfAny;
        var _concat3array = new Array(3);
        var _concat4array = new Array(4);
        var _concat5array = new Array(5);
        var _concat6array = new Array(6);
        var _concat7array = new Array(7);
        var _concat8array = new Array(8);
        var _concat9array = new Array(9);
        /**
         * The concatN() functions concatenate multiple strings in a way that
         * avoids creating intermediate strings, unlike String.prototype.concat().
         *
         * Note that these functions don't have identical behaviour to using '+',
         * because they will ignore any arguments that are |undefined| or |null|.
         * This usually doesn't matter.
         */
        function concat3(s0, s1, s2) {
            _concat3array[0] = s0;
            _concat3array[1] = s1;
            _concat3array[2] = s2;
            return _concat3array.join('');
        }
        StringUtilities.concat3 = concat3;
        function concat4(s0, s1, s2, s3) {
            _concat4array[0] = s0;
            _concat4array[1] = s1;
            _concat4array[2] = s2;
            _concat4array[3] = s3;
            return _concat4array.join('');
        }
        StringUtilities.concat4 = concat4;
        function concat5(s0, s1, s2, s3, s4) {
            _concat5array[0] = s0;
            _concat5array[1] = s1;
            _concat5array[2] = s2;
            _concat5array[3] = s3;
            _concat5array[4] = s4;
            return _concat5array.join('');
        }
        StringUtilities.concat5 = concat5;
        function concat6(s0, s1, s2, s3, s4, s5) {
            _concat6array[0] = s0;
            _concat6array[1] = s1;
            _concat6array[2] = s2;
            _concat6array[3] = s3;
            _concat6array[4] = s4;
            _concat6array[5] = s5;
            return _concat6array.join('');
        }
        StringUtilities.concat6 = concat6;
        function concat7(s0, s1, s2, s3, s4, s5, s6) {
            _concat7array[0] = s0;
            _concat7array[1] = s1;
            _concat7array[2] = s2;
            _concat7array[3] = s3;
            _concat7array[4] = s4;
            _concat7array[5] = s5;
            _concat7array[6] = s6;
            return _concat7array.join('');
        }
        StringUtilities.concat7 = concat7;
        function concat8(s0, s1, s2, s3, s4, s5, s6, s7) {
            _concat8array[0] = s0;
            _concat8array[1] = s1;
            _concat8array[2] = s2;
            _concat8array[3] = s3;
            _concat8array[4] = s4;
            _concat8array[5] = s5;
            _concat8array[6] = s6;
            _concat8array[7] = s7;
            return _concat8array.join('');
        }
        StringUtilities.concat8 = concat8;
        function concat9(s0, s1, s2, s3, s4, s5, s6, s7, s8) {
            _concat9array[0] = s0;
            _concat9array[1] = s1;
            _concat9array[2] = s2;
            _concat9array[3] = s3;
            _concat9array[4] = s4;
            _concat9array[5] = s5;
            _concat9array[6] = s6;
            _concat9array[7] = s7;
            _concat9array[8] = s8;
            return _concat9array.join('');
        }
        StringUtilities.concat9 = concat9;
    })(StringUtilities = J2ME.StringUtilities || (J2ME.StringUtilities = {}));
    var HashUtilities;
    (function (HashUtilities) {
        var _md5R = new Uint8Array([
            7,
            12,
            17,
            22,
            7,
            12,
            17,
            22,
            7,
            12,
            17,
            22,
            7,
            12,
            17,
            22,
            5,
            9,
            14,
            20,
            5,
            9,
            14,
            20,
            5,
            9,
            14,
            20,
            5,
            9,
            14,
            20,
            4,
            11,
            16,
            23,
            4,
            11,
            16,
            23,
            4,
            11,
            16,
            23,
            4,
            11,
            16,
            23,
            6,
            10,
            15,
            21,
            6,
            10,
            15,
            21,
            6,
            10,
            15,
            21,
            6,
            10,
            15,
            21
        ]);
        var _md5K = new Int32Array([
            -680876936,
            -389564586,
            606105819,
            -1044525330,
            -176418897,
            1200080426,
            -1473231341,
            -45705983,
            1770035416,
            -1958414417,
            -42063,
            -1990404162,
            1804603682,
            -40341101,
            -1502002290,
            1236535329,
            -165796510,
            -1069501632,
            643717713,
            -373897302,
            -701558691,
            38016083,
            -660478335,
            -405537848,
            568446438,
            -1019803690,
            -187363961,
            1163531501,
            -1444681467,
            -51403784,
            1735328473,
            -1926607734,
            -378558,
            -2022574463,
            1839030562,
            -35309556,
            -1530992060,
            1272893353,
            -155497632,
            -1094730640,
            681279174,
            -358537222,
            -722521979,
            76029189,
            -640364487,
            -421815835,
            530742520,
            -995338651,
            -198630844,
            1126891415,
            -1416354905,
            -57434055,
            1700485571,
            -1894986606,
            -1051523,
            -2054922799,
            1873313359,
            -30611744,
            -1560198380,
            1309151649,
            -145523070,
            -1120210379,
            718787259,
            -343485551
        ]);
        function hashBytesTo32BitsMD5(data, offset, length) {
            var r = _md5R;
            var k = _md5K;
            var h0 = 1732584193, h1 = -271733879, h2 = -1732584194, h3 = 271733878;
            // pre-processing
            var paddedLength = (length + 72) & ~63; // data + 9 extra bytes
            var padded = new Uint8Array(paddedLength);
            var i, j, n;
            for (i = 0; i < length; ++i) {
                padded[i] = data[offset++];
            }
            padded[i++] = 0x80;
            n = paddedLength - 8;
            while (i < n) {
                padded[i++] = 0;
            }
            padded[i++] = (length << 3) & 0xFF;
            padded[i++] = (length >> 5) & 0xFF;
            padded[i++] = (length >> 13) & 0xFF;
            padded[i++] = (length >> 21) & 0xFF;
            padded[i++] = (length >>> 29) & 0xFF;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            // chunking
            // TODO ArrayBuffer ?
            var w = new Int32Array(16);
            for (i = 0; i < paddedLength;) {
                for (j = 0; j < 16; ++j, i += 4) {
                    w[j] = (padded[i] | (padded[i + 1] << 8) | (padded[i + 2] << 16) | (padded[i + 3] << 24));
                }
                var a = h0, b = h1, c = h2, d = h3, f, g;
                for (j = 0; j < 64; ++j) {
                    if (j < 16) {
                        f = (b & c) | ((~b) & d);
                        g = j;
                    }
                    else if (j < 32) {
                        f = (d & b) | ((~d) & c);
                        g = (5 * j + 1) & 15;
                    }
                    else if (j < 48) {
                        f = b ^ c ^ d;
                        g = (3 * j + 5) & 15;
                    }
                    else {
                        f = c ^ (b | (~d));
                        g = (7 * j) & 15;
                    }
                    var tmp = d, rotateArg = (a + f + k[j] + w[g]) | 0, rotate = r[j];
                    d = c;
                    c = b;
                    b = (b + ((rotateArg << rotate) | (rotateArg >>> (32 - rotate)))) | 0;
                    a = tmp;
                }
                h0 = (h0 + a) | 0;
                h1 = (h1 + b) | 0;
                h2 = (h2 + c) | 0;
                h3 = (h3 + d) | 0;
            }
            return h0;
        }
        HashUtilities.hashBytesTo32BitsMD5 = hashBytesTo32BitsMD5;
        function hashBytesTo32BitsAdler(data, offset, length) {
            var a = 1;
            var b = 0;
            var end = offset + length;
            for (var i = offset; i < end; ++i) {
                a = (a + (data[i] & 0xff)) % 65521;
                b = (b + a) % 65521;
            }
            return (b << 16) | a;
        }
        HashUtilities.hashBytesTo32BitsAdler = hashBytesTo32BitsAdler;
    })(HashUtilities = J2ME.HashUtilities || (J2ME.HashUtilities = {}));
    /**
     * Marsaglia's algorithm, adapted from V8. Use this if you want a deterministic random number.
     */
    var Random = (function () {
        function Random() {
        }
        Random.seed = function (seed) {
            Random._state[0] = seed;
            Random._state[1] = seed;
        };
        Random.next = function () {
            var s = this._state;
            var r0 = (Math.imul(18273, s[0] & 0xFFFF) + (s[0] >>> 16)) | 0;
            s[0] = r0;
            var r1 = (Math.imul(36969, s[1] & 0xFFFF) + (s[1] >>> 16)) | 0;
            s[1] = r1;
            var x = ((r0 << 16) + (r1 & 0xFFFF)) | 0;
            // Division by 0x100000000 through multiplication by reciprocal.
            return (x < 0 ? (x + 0x100000000) : x) * 2.3283064365386962890625e-10;
        };
        Random._state = new Uint32Array([0xDEAD, 0xBEEF]);
        return Random;
    })();
    J2ME.Random = Random;
    Math.random = function random() {
        return Random.next();
    };
    var NumberUtilities;
    (function (NumberUtilities) {
        function pow2(exponent) {
            if (exponent === (exponent | 0)) {
                if (exponent < 0) {
                    return 1 / (1 << -exponent);
                }
                return 1 << exponent;
            }
            return Math.pow(2, exponent);
        }
        NumberUtilities.pow2 = pow2;
        function clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }
        NumberUtilities.clamp = clamp;
        /**
         * Rounds *.5 to the nearest even number.
         * See https://en.wikipedia.org/wiki/Rounding#Round_half_to_even for details.
         */
        function roundHalfEven(value) {
            if (Math.abs(value % 1) === 0.5) {
                var floor = Math.floor(value);
                return floor % 2 === 0 ? floor : Math.ceil(value);
            }
            return Math.round(value);
        }
        NumberUtilities.roundHalfEven = roundHalfEven;
        function epsilonEquals(value, other) {
            return Math.abs(value - other) < 0.0000001;
        }
        NumberUtilities.epsilonEquals = epsilonEquals;
    })(NumberUtilities = J2ME.NumberUtilities || (J2ME.NumberUtilities = {}));
    (function (Numbers) {
        Numbers[Numbers["MaxU16"] = 0xFFFF] = "MaxU16";
        Numbers[Numbers["MaxI16"] = 0x7FFF] = "MaxI16";
        Numbers[Numbers["MinI16"] = -0x8000] = "MinI16";
    })(J2ME.Numbers || (J2ME.Numbers = {}));
    var Numbers = J2ME.Numbers;
    var IntegerUtilities;
    (function (IntegerUtilities) {
        var sharedBuffer = new ArrayBuffer(8);
        IntegerUtilities.i8 = new Int8Array(sharedBuffer);
        IntegerUtilities.u8 = new Uint8Array(sharedBuffer);
        IntegerUtilities.i32 = new Int32Array(sharedBuffer);
        IntegerUtilities.f32 = new Float32Array(sharedBuffer);
        IntegerUtilities.f64 = new Float64Array(sharedBuffer);
        IntegerUtilities.nativeLittleEndian = new Int8Array(new Int32Array([1]).buffer)[0] === 1;
        /**
         * Convert a float into 32 bits.
         */
        function floatToInt32(v) {
            IntegerUtilities.f32[0] = v;
            return IntegerUtilities.i32[0];
        }
        IntegerUtilities.floatToInt32 = floatToInt32;
        /**
         * Convert 32 bits into a float.
         */
        function int32ToFloat(i) {
            IntegerUtilities.i32[0] = i;
            return IntegerUtilities.f32[0];
        }
        IntegerUtilities.int32ToFloat = int32ToFloat;
        /**
         * Swap the bytes of a 16 bit number.
         */
        function swap16(i) {
            return ((i & 0xFF) << 8) | ((i >> 8) & 0xFF);
        }
        IntegerUtilities.swap16 = swap16;
        /**
         * Swap the bytes of a 32 bit number.
         */
        function swap32(i) {
            return ((i & 0xFF) << 24) | ((i & 0xFF00) << 8) | ((i >> 8) & 0xFF00) | ((i >> 24) & 0xFF);
        }
        IntegerUtilities.swap32 = swap32;
        /**
         * Converts a number to s8.u8 fixed point representation.
         */
        function toS8U8(v) {
            return ((v * 256) << 16) >> 16;
        }
        IntegerUtilities.toS8U8 = toS8U8;
        /**
         * Converts a number from s8.u8 fixed point representation.
         */
        function fromS8U8(i) {
            return i / 256;
        }
        IntegerUtilities.fromS8U8 = fromS8U8;
        /**
         * Round trips a number through s8.u8 conversion.
         */
        function clampS8U8(v) {
            return fromS8U8(toS8U8(v));
        }
        IntegerUtilities.clampS8U8 = clampS8U8;
        /**
         * Converts a number to signed 16 bits.
         */
        function toS16(v) {
            return (v << 16) >> 16;
        }
        IntegerUtilities.toS16 = toS16;
        function bitCount(i) {
            i = i - ((i >> 1) & 0x55555555);
            i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
            return (((i + (i >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
        }
        IntegerUtilities.bitCount = bitCount;
        function ones(i) {
            i = i - ((i >> 1) & 0x55555555);
            i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
            return ((i + (i >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
        }
        IntegerUtilities.ones = ones;
        function trailingZeros(i) {
            return IntegerUtilities.ones((i & -i) - 1);
        }
        IntegerUtilities.trailingZeros = trailingZeros;
        function getFlags(i, flags) {
            var str = "";
            for (var i = 0; i < flags.length; i++) {
                if (i & (1 << i)) {
                    str += flags[i] + " ";
                }
            }
            if (str.length === 0) {
                return "";
            }
            return str.trim();
        }
        IntegerUtilities.getFlags = getFlags;
        function isPowerOfTwo(x) {
            return x && ((x & (x - 1)) === 0);
        }
        IntegerUtilities.isPowerOfTwo = isPowerOfTwo;
        function roundToMultipleOfFour(x) {
            return (x + 3) & ~0x3;
        }
        IntegerUtilities.roundToMultipleOfFour = roundToMultipleOfFour;
        function nearestPowerOfTwo(x) {
            x--;
            x |= x >> 1;
            x |= x >> 2;
            x |= x >> 4;
            x |= x >> 8;
            x |= x >> 16;
            x++;
            return x;
        }
        IntegerUtilities.nearestPowerOfTwo = nearestPowerOfTwo;
        function roundToMultipleOfPowerOfTwo(i, powerOfTwo) {
            var x = (1 << powerOfTwo) - 1;
            return (i + x) & ~x; // Round up to multiple of power of two.
        }
        IntegerUtilities.roundToMultipleOfPowerOfTwo = roundToMultipleOfPowerOfTwo;
        /**
         * Polyfill imul.
         */
        if (!Math.imul) {
            Math.imul = function imul(a, b) {
                var ah = (a >>> 16) & 0xffff;
                var al = a & 0xffff;
                var bh = (b >>> 16) & 0xffff;
                var bl = b & 0xffff;
                // the shift by 0 fixes the sign on the high part
                // the final |0 converts the unsigned value into a signed value
                return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
            };
        }
        /**
         * Polyfill clz32.
         */
        if (!Math.clz32) {
            Math.clz32 = function clz32(i) {
                i |= (i >> 1);
                i |= (i >> 2);
                i |= (i >> 4);
                i |= (i >> 8);
                i |= (i >> 16);
                return 32 - IntegerUtilities.ones(i);
            };
        }
    })(IntegerUtilities = J2ME.IntegerUtilities || (J2ME.IntegerUtilities = {}));
    (function (LogLevel) {
        LogLevel[LogLevel["Error"] = 0x1] = "Error";
        LogLevel[LogLevel["Warn"] = 0x2] = "Warn";
        LogLevel[LogLevel["Debug"] = 0x4] = "Debug";
        LogLevel[LogLevel["Log"] = 0x8] = "Log";
        LogLevel[LogLevel["Info"] = 0x10] = "Info";
        LogLevel[LogLevel["All"] = 0x1f] = "All";
    })(J2ME.LogLevel || (J2ME.LogLevel = {}));
    var LogLevel = J2ME.LogLevel;
    var IndentingWriter = (function () {
        function IndentingWriter(suppressOutput, out) {
            if (suppressOutput === void 0) { suppressOutput = false; }
            this._tab = "  ";
            this._padding = "";
            this._suppressOutput = suppressOutput;
            this._out = out || IndentingWriter.stdout;
            this._outNoNewline = out || IndentingWriter.stdoutNoNewline;
        }
        IndentingWriter.prototype.write = function (str, writePadding) {
            if (str === void 0) { str = ""; }
            if (writePadding === void 0) { writePadding = false; }
            if (!this._suppressOutput) {
                this._outNoNewline((writePadding ? this._padding : "") + str);
            }
        };
        IndentingWriter.prototype.writeLn = function (str) {
            if (str === void 0) { str = ""; }
            if (!this._suppressOutput) {
                this._out(this._padding + str);
            }
        };
        IndentingWriter.prototype.writeTimeLn = function (str) {
            if (str === void 0) { str = ""; }
            if (!this._suppressOutput) {
                this._out(this._padding + performance.now().toFixed(2) + " " + str);
            }
        };
        IndentingWriter.prototype.writeComment = function (str) {
            var lines = str.split("\n");
            if (lines.length === 1) {
                this.writeLn("// " + lines[0]);
            }
            else {
                this.writeLn("/**");
                for (var i = 0; i < lines.length; i++) {
                    this.writeLn(" * " + lines[i]);
                }
                this.writeLn(" */");
            }
        };
        IndentingWriter.prototype.writeLns = function (str) {
            var lines = str.split("\n");
            for (var i = 0; i < lines.length; i++) {
                this.writeLn(lines[i]);
            }
        };
        IndentingWriter.prototype.errorLn = function (str) {
            if (IndentingWriter.logLevel & 1 /* Error */) {
                this.boldRedLn(str);
            }
        };
        IndentingWriter.prototype.warnLn = function (str) {
            if (IndentingWriter.logLevel & 2 /* Warn */) {
                this.yellowLn(str);
            }
        };
        IndentingWriter.prototype.debugLn = function (str) {
            if (IndentingWriter.logLevel & 4 /* Debug */) {
                this.purpleLn(str);
            }
        };
        IndentingWriter.prototype.logLn = function (str) {
            if (IndentingWriter.logLevel & 8 /* Log */) {
                this.writeLn(str);
            }
        };
        IndentingWriter.prototype.infoLn = function (str) {
            if (IndentingWriter.logLevel & 16 /* Info */) {
                this.writeLn(str);
            }
        };
        IndentingWriter.prototype.yellowLn = function (str) {
            this.colorLn(IndentingWriter.YELLOW, str);
        };
        IndentingWriter.prototype.greenLn = function (str) {
            this.colorLn(IndentingWriter.GREEN, str);
        };
        IndentingWriter.prototype.boldRedLn = function (str) {
            this.colorLn(IndentingWriter.BOLD_RED, str);
        };
        IndentingWriter.prototype.redLn = function (str) {
            this.colorLn(IndentingWriter.RED, str);
        };
        IndentingWriter.prototype.purpleLn = function (str) {
            this.colorLn(IndentingWriter.PURPLE, str);
        };
        IndentingWriter.prototype.colorLn = function (color, str) {
            if (!this._suppressOutput) {
                if (!inBrowser) {
                    this._out(this._padding + color + str + IndentingWriter.ENDC);
                }
                else {
                    this._out(this._padding + str);
                }
            }
        };
        IndentingWriter.prototype.redLns = function (str) {
            this.colorLns(IndentingWriter.RED, str);
        };
        IndentingWriter.prototype.colorLns = function (color, str) {
            var lines = str.split("\n");
            for (var i = 0; i < lines.length; i++) {
                this.colorLn(color, lines[i]);
            }
        };
        IndentingWriter.prototype.enter = function (str) {
            if (!this._suppressOutput) {
                this._out(this._padding + str);
            }
            this.indent();
        };
        IndentingWriter.prototype.leaveAndEnter = function (str) {
            this.leave(str);
            this.indent();
        };
        IndentingWriter.prototype.leave = function (str) {
            this.outdent();
            if (!this._suppressOutput) {
                this._out(this._padding + str);
            }
        };
        IndentingWriter.prototype.indent = function () {
            this._padding += this._tab;
        };
        IndentingWriter.prototype.outdent = function () {
            if (this._padding.length > 0) {
                this._padding = this._padding.substring(0, this._padding.length - this._tab.length);
            }
        };
        IndentingWriter.prototype.writeArray = function (arr, detailed, noNumbers) {
            if (detailed === void 0) { detailed = false; }
            if (noNumbers === void 0) { noNumbers = false; }
            detailed = detailed || false;
            for (var i = 0, j = arr.length; i < j; i++) {
                var prefix = "";
                if (detailed) {
                    if (arr[i] === null) {
                        prefix = "null";
                    }
                    else if (arr[i] === undefined) {
                        prefix = "undefined";
                    }
                    else {
                        prefix = arr[i].constructor.name;
                    }
                    prefix += " ";
                }
                var number = noNumbers ? "" : ("" + i).padRight(' ', 4);
                this.writeLn(number + prefix + arr[i]);
            }
        };
        IndentingWriter.PURPLE = '\033[94m';
        IndentingWriter.YELLOW = '\033[93m';
        IndentingWriter.GREEN = '\033[92m';
        IndentingWriter.RED = '\033[91m';
        IndentingWriter.BOLD_RED = '\033[1;91m';
        IndentingWriter.ENDC = '\033[0m';
        IndentingWriter.logLevel = 31 /* All */;
        IndentingWriter.stdout = inBrowser ? console.info.bind(console) : print;
        IndentingWriter.stdoutNoNewline = inBrowser ? console.info.bind(console) : putstr;
        IndentingWriter.stderr = inBrowser ? console.error.bind(console) : printErr;
        return IndentingWriter;
    })();
    J2ME.IndentingWriter = IndentingWriter;
    /**
     * Insertion sort SortedList backed by a linked list.
     */
    var SortedListNode = (function () {
        function SortedListNode(value, next) {
            this.value = value;
            this.next = next;
        }
        return SortedListNode;
    })();
    var SortedList = (function () {
        function SortedList(compare) {
            release || Debug.assert(compare);
            this._compare = compare;
            this._head = null;
            this._length = 0;
        }
        SortedList.prototype.push = function (value) {
            release || Debug.assert(value !== undefined);
            this._length++;
            if (!this._head) {
                this._head = new SortedListNode(value, null);
                return;
            }
            var curr = this._head;
            var prev = null;
            var node = new SortedListNode(value, null);
            var compare = this._compare;
            while (curr) {
                if (compare(curr.value, node.value) > 0) {
                    if (prev) {
                        node.next = curr;
                        prev.next = node;
                    }
                    else {
                        node.next = this._head;
                        this._head = node;
                    }
                    return;
                }
                prev = curr;
                curr = curr.next;
            }
            prev.next = node;
        };
        /**
         * Visitors can return RETURN if they wish to stop the iteration or DELETE if they need to delete the current node.
         * NOTE: DELETE most likley doesn't work if there are multiple active iterations going on.
         */
        SortedList.prototype.forEach = function (visitor) {
            var curr = this._head;
            var last = null;
            while (curr) {
                var result = visitor(curr.value);
                if (result === SortedList.RETURN) {
                    return;
                }
                else if (result === SortedList.DELETE) {
                    if (!last) {
                        curr = this._head = this._head.next;
                    }
                    else {
                        curr = last.next = curr.next;
                    }
                }
                else {
                    last = curr;
                    curr = curr.next;
                }
            }
        };
        SortedList.prototype.isEmpty = function () {
            return !this._head;
        };
        SortedList.prototype.pop = function () {
            if (!this._head) {
                return undefined;
            }
            this._length--;
            var ret = this._head;
            this._head = this._head.next;
            return ret.value;
        };
        SortedList.prototype.contains = function (value) {
            var curr = this._head;
            while (curr) {
                if (curr.value === value) {
                    return true;
                }
                curr = curr.next;
            }
            return false;
        };
        SortedList.prototype.toString = function () {
            var str = "[";
            var curr = this._head;
            while (curr) {
                str += curr.value.toString();
                curr = curr.next;
                if (curr) {
                    str += ",";
                }
            }
            str += "]";
            return str;
        };
        SortedList.RETURN = 1;
        SortedList.DELETE = 2;
        return SortedList;
    })();
    J2ME.SortedList = SortedList;
    var BitSets;
    (function (BitSets) {
        var assert = Debug.assert;
        BitSets.ADDRESS_BITS_PER_WORD = 5;
        BitSets.BITS_PER_WORD = 1 << BitSets.ADDRESS_BITS_PER_WORD;
        BitSets.BIT_INDEX_MASK = BitSets.BITS_PER_WORD - 1;
        function getSize(length) {
            return ((length + (BitSets.BITS_PER_WORD - 1)) >> BitSets.ADDRESS_BITS_PER_WORD) << BitSets.ADDRESS_BITS_PER_WORD;
        }
        function toBitString(on, off) {
            var self = this;
            on = on || "1";
            off = off || "0";
            var str = "";
            for (var i = 0; i < length; i++) {
                str += self.get(i) ? on : off;
            }
            return str;
        }
        function toString(names) {
            var self = this;
            var set = [];
            for (var i = 0; i < length; i++) {
                if (self.get(i)) {
                    set.push(names ? names[i] : i);
                }
            }
            return set.join(", ");
        }
        var Uint32ArrayBitSet = (function () {
            function Uint32ArrayBitSet(length) {
                this.size = getSize(length);
                this.count = 0;
                this.dirty = 0;
                this.length = length;
                this.bits = new Uint32Array(this.size >> BitSets.ADDRESS_BITS_PER_WORD);
            }
            Uint32ArrayBitSet.prototype.recount = function () {
                if (!this.dirty) {
                    return;
                }
                var bits = this.bits;
                var c = 0;
                for (var i = 0, j = bits.length; i < j; i++) {
                    var v = bits[i];
                    v = v - ((v >> 1) & 0x55555555);
                    v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
                    c += ((v + (v >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
                }
                this.count = c;
                this.dirty = 0;
            };
            Uint32ArrayBitSet.prototype.set = function (i) {
                var n = i >> BitSets.ADDRESS_BITS_PER_WORD;
                var old = this.bits[n];
                var b = old | (1 << (i & BitSets.BIT_INDEX_MASK));
                this.bits[n] = b;
                this.dirty |= old ^ b;
            };
            Uint32ArrayBitSet.prototype.setAll = function () {
                var bits = this.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    bits[i] = 0xFFFFFFFF;
                }
                this.count = this.size;
                this.dirty = 0;
            };
            Uint32ArrayBitSet.prototype.assign = function (set) {
                this.count = set.count;
                this.dirty = set.dirty;
                this.size = set.size;
                for (var i = 0, j = this.bits.length; i < j; i++) {
                    this.bits[i] = set.bits[i];
                }
            };
            Uint32ArrayBitSet.prototype.nextSetBit = function (from, to) {
                if (from === to) {
                    return -1;
                }
                var bits = this.bits;
                for (var i = from; i < to; i++) {
                    var word = bits[i >> BitSets.ADDRESS_BITS_PER_WORD];
                    if (((word & 1 << (i & BitSets.BIT_INDEX_MASK))) !== 0) {
                        return i;
                    }
                }
            };
            Uint32ArrayBitSet.prototype.clear = function (i) {
                var n = i >> BitSets.ADDRESS_BITS_PER_WORD;
                var old = this.bits[n];
                var b = old & ~(1 << (i & BitSets.BIT_INDEX_MASK));
                this.bits[n] = b;
                this.dirty |= old ^ b;
            };
            Uint32ArrayBitSet.prototype.get = function (i) {
                var word = this.bits[i >> BitSets.ADDRESS_BITS_PER_WORD];
                return ((word & 1 << (i & BitSets.BIT_INDEX_MASK))) !== 0;
            };
            Uint32ArrayBitSet.prototype.clearAll = function () {
                var bits = this.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    bits[i] = 0;
                }
                this.count = 0;
                this.dirty = 0;
            };
            Uint32ArrayBitSet.prototype._union = function (other) {
                var dirty = this.dirty;
                var bits = this.bits;
                var otherBits = other.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    var old = bits[i];
                    var b = old | otherBits[i];
                    bits[i] = b;
                    dirty |= old ^ b;
                }
                this.dirty = dirty;
            };
            Uint32ArrayBitSet.prototype.intersect = function (other) {
                var dirty = this.dirty;
                var bits = this.bits;
                var otherBits = other.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    var old = bits[i];
                    var b = old & otherBits[i];
                    bits[i] = b;
                    dirty |= old ^ b;
                }
                this.dirty = dirty;
            };
            Uint32ArrayBitSet.prototype.subtract = function (other) {
                var dirty = this.dirty;
                var bits = this.bits;
                var otherBits = other.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    var old = bits[i];
                    var b = old & ~otherBits[i];
                    bits[i] = b;
                    dirty |= old ^ b;
                }
                this.dirty = dirty;
            };
            Uint32ArrayBitSet.prototype.negate = function () {
                var dirty = this.dirty;
                var bits = this.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    var old = bits[i];
                    var b = ~old;
                    bits[i] = b;
                    dirty |= old ^ b;
                }
                this.dirty = dirty;
            };
            Uint32ArrayBitSet.prototype.forEach = function (fn) {
                release || assert(fn);
                var bits = this.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    var word = bits[i];
                    if (word) {
                        for (var k = 0; k < BitSets.BITS_PER_WORD; k++) {
                            if (word & (1 << k)) {
                                fn(i * BitSets.BITS_PER_WORD + k);
                            }
                        }
                    }
                }
            };
            Uint32ArrayBitSet.prototype.toArray = function () {
                var set = [];
                var bits = this.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    var word = bits[i];
                    if (word) {
                        for (var k = 0; k < BitSets.BITS_PER_WORD; k++) {
                            if (word & (1 << k)) {
                                set.push(i * BitSets.BITS_PER_WORD + k);
                            }
                        }
                    }
                }
                return set;
            };
            Uint32ArrayBitSet.prototype.equals = function (other) {
                if (this.size !== other.size) {
                    return false;
                }
                var bits = this.bits;
                var otherBits = other.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    if (bits[i] !== otherBits[i]) {
                        return false;
                    }
                }
                return true;
            };
            Uint32ArrayBitSet.prototype.contains = function (other) {
                if (this.size !== other.size) {
                    return false;
                }
                var bits = this.bits;
                var otherBits = other.bits;
                for (var i = 0, j = bits.length; i < j; i++) {
                    if ((bits[i] | otherBits[i]) !== bits[i]) {
                        return false;
                    }
                }
                return true;
            };
            Uint32ArrayBitSet.prototype.isEmpty = function () {
                this.recount();
                return this.count === 0;
            };
            Uint32ArrayBitSet.prototype.clone = function () {
                var set = new Uint32ArrayBitSet(this.length);
                set._union(this);
                return set;
            };
            return Uint32ArrayBitSet;
        })();
        BitSets.Uint32ArrayBitSet = Uint32ArrayBitSet;
        var Uint32BitSet = (function () {
            function Uint32BitSet(length) {
                this.count = 0;
                this.dirty = 0;
                this.size = getSize(length);
                this.bits = 0;
                this.singleWord = true;
                this.length = length;
            }
            Uint32BitSet.prototype.recount = function () {
                if (!this.dirty) {
                    return;
                }
                var c = 0;
                var v = this.bits;
                v = v - ((v >> 1) & 0x55555555);
                v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
                c += ((v + (v >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
                this.count = c;
                this.dirty = 0;
            };
            Uint32BitSet.prototype.set = function (i) {
                var old = this.bits;
                var b = old | (1 << (i & BitSets.BIT_INDEX_MASK));
                this.bits = b;
                this.dirty |= old ^ b;
            };
            Uint32BitSet.prototype.setAll = function () {
                this.bits = 0xFFFFFFFF;
                this.count = this.size;
                this.dirty = 0;
            };
            Uint32BitSet.prototype.assign = function (set) {
                this.count = set.count;
                this.dirty = set.dirty;
                this.size = set.size;
                this.bits = set.bits;
            };
            Uint32BitSet.prototype.clear = function (i) {
                var old = this.bits;
                var b = old & ~(1 << (i & BitSets.BIT_INDEX_MASK));
                this.bits = b;
                this.dirty |= old ^ b;
            };
            Uint32BitSet.prototype.get = function (i) {
                return ((this.bits & 1 << (i & BitSets.BIT_INDEX_MASK))) !== 0;
            };
            Uint32BitSet.prototype.clearAll = function () {
                this.bits = 0;
                this.count = 0;
                this.dirty = 0;
            };
            Uint32BitSet.prototype._union = function (other) {
                var old = this.bits;
                var b = old | other.bits;
                this.bits = b;
                this.dirty = old ^ b;
            };
            Uint32BitSet.prototype.intersect = function (other) {
                var old = this.bits;
                var b = old & other.bits;
                this.bits = b;
                this.dirty = old ^ b;
            };
            Uint32BitSet.prototype.subtract = function (other) {
                var old = this.bits;
                var b = old & ~other.bits;
                this.bits = b;
                this.dirty = old ^ b;
            };
            Uint32BitSet.prototype.negate = function () {
                var old = this.bits;
                var b = ~old;
                this.bits = b;
                this.dirty = old ^ b;
            };
            Uint32BitSet.prototype.forEach = function (fn) {
                release || assert(fn);
                var word = this.bits;
                if (word) {
                    for (var k = 0; k < BitSets.BITS_PER_WORD; k++) {
                        if (word & (1 << k)) {
                            fn(k);
                        }
                    }
                }
            };
            Uint32BitSet.prototype.toArray = function () {
                var set = [];
                var word = this.bits;
                if (word) {
                    for (var k = 0; k < BitSets.BITS_PER_WORD; k++) {
                        if (word & (1 << k)) {
                            set.push(k);
                        }
                    }
                }
                return set;
            };
            Uint32BitSet.prototype.equals = function (other) {
                return this.bits === other.bits;
            };
            Uint32BitSet.prototype.contains = function (other) {
                var bits = this.bits;
                return (bits | other.bits) === bits;
            };
            Uint32BitSet.prototype.isEmpty = function () {
                this.recount();
                return this.count === 0;
            };
            Uint32BitSet.prototype.clone = function () {
                var set = new Uint32BitSet(this.length);
                set._union(this);
                return set;
            };
            return Uint32BitSet;
        })();
        BitSets.Uint32BitSet = Uint32BitSet;
        Uint32BitSet.prototype.toString = toString;
        Uint32BitSet.prototype.toBitString = toBitString;
        Uint32ArrayBitSet.prototype.toString = toString;
        Uint32ArrayBitSet.prototype.toBitString = toBitString;
        function BitSetFunctor(length) {
            var shouldUseSingleWord = (getSize(length) >> BitSets.ADDRESS_BITS_PER_WORD) === 1;
            var type = (shouldUseSingleWord ? Uint32BitSet : Uint32ArrayBitSet);
            return function () {
                return new type(length);
            };
        }
        BitSets.BitSetFunctor = BitSetFunctor;
    })(BitSets = J2ME.BitSets || (J2ME.BitSets = {}));
    var ColorStyle = (function () {
        function ColorStyle() {
        }
        ColorStyle.randomStyle = function () {
            if (!ColorStyle._randomStyleCache) {
                ColorStyle._randomStyleCache = [
                    "#ff5e3a",
                    "#ff9500",
                    "#ffdb4c",
                    "#87fc70",
                    "#52edc7",
                    "#1ad6fd",
                    "#c644fc",
                    "#ef4db6",
                    "#4a4a4a",
                    "#dbddde",
                    "#ff3b30",
                    "#ff9500",
                    "#ffcc00",
                    "#4cd964",
                    "#34aadc",
                    "#007aff",
                    "#5856d6",
                    "#ff2d55",
                    "#8e8e93",
                    "#c7c7cc",
                    "#5ad427",
                    "#c86edf",
                    "#d1eefc",
                    "#e0f8d8",
                    "#fb2b69",
                    "#f7f7f7",
                    "#1d77ef",
                    "#d6cec3",
                    "#55efcb",
                    "#ff4981",
                    "#ffd3e0",
                    "#f7f7f7",
                    "#ff1300",
                    "#1f1f21",
                    "#bdbec2",
                    "#ff3a2d"
                ];
            }
            return ColorStyle._randomStyleCache[(ColorStyle._nextStyle++) % ColorStyle._randomStyleCache.length];
        };
        ColorStyle.contrastStyle = function (rgb) {
            // http://www.w3.org/TR/AERT#color-contrast
            var c = parseInt(rgb.substr(1), 16);
            var yiq = (((c >> 16) * 299) + (((c >> 8) & 0xff) * 587) + ((c & 0xff) * 114)) / 1000;
            return (yiq >= 128) ? '#000000' : '#ffffff';
        };
        ColorStyle.reset = function () {
            ColorStyle._nextStyle = 0;
        };
        ColorStyle.TabToolbar = "#252c33";
        ColorStyle.Toolbars = "#343c45";
        ColorStyle.HighlightBlue = "#1d4f73";
        ColorStyle.LightText = "#f5f7fa";
        ColorStyle.ForegroundText = "#b6babf";
        ColorStyle.Black = "#000000";
        ColorStyle.VeryDark = "#14171a";
        ColorStyle.Dark = "#181d20";
        ColorStyle.Light = "#a9bacb";
        ColorStyle.Grey = "#8fa1b2";
        ColorStyle.DarkGrey = "#5f7387";
        ColorStyle.Blue = "#46afe3";
        ColorStyle.Purple = "#6b7abb";
        ColorStyle.Pink = "#df80ff";
        ColorStyle.Red = "#eb5368";
        ColorStyle.Orange = "#d96629";
        ColorStyle.LightOrange = "#d99b28";
        ColorStyle.Green = "#70bf53";
        ColorStyle.BlueGrey = "#5e88b0";
        ColorStyle._nextStyle = 0;
        return ColorStyle;
    })();
    J2ME.ColorStyle = ColorStyle;
    /**
     * Simple pool allocator for ArrayBuffers. This reduces memory usage in data structures
     * that resize buffers.
     */
    var ArrayBufferPool = (function () {
        /**
         * Creates a pool that manages a pool of a |maxSize| number of array buffers.
         */
        function ArrayBufferPool(maxSize) {
            if (maxSize === void 0) { maxSize = 32; }
            this._list = [];
            this._maxSize = maxSize;
        }
        /**
         * Creates or reuses an existing array buffer that is at least the
         * specified |length|.
         */
        ArrayBufferPool.prototype.acquire = function (length) {
            if (ArrayBufferPool._enabled) {
                var list = this._list;
                for (var i = 0; i < list.length; i++) {
                    var buffer = list[i];
                    if (buffer.byteLength >= length) {
                        list.splice(i, 1);
                        return buffer;
                    }
                }
            }
            return new ArrayBuffer(length);
        };
        /**
         * Releases an array buffer that is no longer needed back to the pool.
         */
        ArrayBufferPool.prototype.release = function (buffer) {
            if (ArrayBufferPool._enabled) {
                var list = this._list;
                release || Debug.assert(ArrayUtilities.indexOf(list, buffer) < 0);
                if (list.length === this._maxSize) {
                    list.shift();
                }
                list.push(buffer);
            }
        };
        /**
         * Resizes a Uint8Array to have the given length.
         */
        ArrayBufferPool.prototype.ensureUint8ArrayLength = function (array, length) {
            if (array.length >= length) {
                return array;
            }
            var newLength = Math.max(array.length + length, ((array.length * 3) >> 1) + 1);
            var newArray = new Uint8Array(this.acquire(newLength), 0, newLength);
            newArray.set(array);
            this.release(array.buffer);
            return newArray;
        };
        /**
         * Resizes a Float64Array to have the given length.
         */
        ArrayBufferPool.prototype.ensureFloat64ArrayLength = function (array, length) {
            if (array.length >= length) {
                return array;
            }
            var newLength = Math.max(array.length + length, ((array.length * 3) >> 1) + 1);
            var newArray = new Float64Array(this.acquire(newLength * Float64Array.BYTES_PER_ELEMENT), 0, newLength);
            newArray.set(array);
            this.release(array.buffer);
            return newArray;
        };
        ArrayBufferPool._enabled = true;
        return ArrayBufferPool;
    })();
    J2ME.ArrayBufferPool = ArrayBufferPool;
})(J2ME || (J2ME = {}));
/**
 * Extend builtin prototypes.
 *
 * TODO: Go through the code and remove all references to these.
 */
(function () {
    function extendBuiltin(prototype, property, value) {
        if (!prototype[property]) {
            Object.defineProperty(prototype, property, { value: value, writable: true, configurable: true, enumerable: false });
        }
    }
    function removeColors(s) {
        return s.replace(/\033\[[0-9]*m/g, "");
    }
    extendBuiltin(String.prototype, "padRight", function (c, n) {
        var str = this;
        var length = removeColors(str).length;
        if (!c || length >= n) {
            return str;
        }
        var max = (n - length) / c.length;
        for (var i = 0; i < max; i++) {
            str += c;
        }
        return str;
    });
    extendBuiltin(String.prototype, "padLeft", function (c, n) {
        var str = this;
        var length = str.length;
        if (!c || length >= n) {
            return str;
        }
        var max = (n - length) / c.length;
        for (var i = 0; i < max; i++) {
            str = c + str;
        }
        return str;
    });
    extendBuiltin(String.prototype, "trim", function () {
        return this.replace(/^\s+|\s+$/g, "");
    });
    extendBuiltin(String.prototype, "endsWith", function (str) {
        return this.indexOf(str, this.length - str.length) !== -1;
    });
    extendBuiltin(Array.prototype, "replace", function (x, y) {
        if (x === y) {
            return 0;
        }
        var count = 0;
        for (var i = 0; i < this.length; i++) {
            if (this[i] === x) {
                this[i] = y;
                count++;
            }
        }
        return count;
    });
})();
var J2ME;
(function (J2ME) {
    J2ME.ATTRIBUTE_TYPES = {
        ConstantValue: "ConstantValue",
        Code: "Code",
        Exceptions: "Exceptions",
        InnerClasses: "InnerClasses",
        Synthetic: "Synthetic",
        SourceFile: "SourceFile",
        LineNumberTable: "LineNumberTable",
        LocalVariableTable: "LocalVariableTable",
        Deprecated: "Deprecated",
        StackMap: "StackMap"
    };
    (function (ACCESS_FLAGS) {
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_PUBLIC"] = 0x0001] = "ACC_PUBLIC";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_PRIVATE"] = 0x0002] = "ACC_PRIVATE";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_PROTECTED"] = 0x0004] = "ACC_PROTECTED";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_STATIC"] = 0x0008] = "ACC_STATIC";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_FINAL"] = 0x0010] = "ACC_FINAL";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_SYNCHRONIZED"] = 0x0020] = "ACC_SYNCHRONIZED";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_VOLATILE"] = 0x0040] = "ACC_VOLATILE";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_TRANSIENT"] = 0x0080] = "ACC_TRANSIENT";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_NATIVE"] = 0x0100] = "ACC_NATIVE";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_INTERFACE"] = 0x0200] = "ACC_INTERFACE";
        ACCESS_FLAGS[ACCESS_FLAGS["ACC_ABSTRACT"] = 0x0400] = "ACC_ABSTRACT";
    })(J2ME.ACCESS_FLAGS || (J2ME.ACCESS_FLAGS = {}));
    var ACCESS_FLAGS = J2ME.ACCESS_FLAGS;
    var AccessFlags;
    (function (AccessFlags) {
        function isPublic(flags) {
            return (flags & 1 /* ACC_PUBLIC */) === 1 /* ACC_PUBLIC */;
        }
        AccessFlags.isPublic = isPublic;
        function isPrivate(flags) {
            return (flags & 2 /* ACC_PRIVATE */) === 2 /* ACC_PRIVATE */;
        }
        AccessFlags.isPrivate = isPrivate;
        function isProtected(flags) {
            return (flags & 4 /* ACC_PROTECTED */) === 4 /* ACC_PROTECTED */;
        }
        AccessFlags.isProtected = isProtected;
        function isStatic(flags) {
            return (flags & 8 /* ACC_STATIC */) === 8 /* ACC_STATIC */;
        }
        AccessFlags.isStatic = isStatic;
        function isFinal(flags) {
            return (flags & 16 /* ACC_FINAL */) === 16 /* ACC_FINAL */;
        }
        AccessFlags.isFinal = isFinal;
        function isSynchronized(flags) {
            return (flags & 32 /* ACC_SYNCHRONIZED */) === 32 /* ACC_SYNCHRONIZED */;
        }
        AccessFlags.isSynchronized = isSynchronized;
        function isVolatile(flags) {
            return (flags & 64 /* ACC_VOLATILE */) === 64 /* ACC_VOLATILE */;
        }
        AccessFlags.isVolatile = isVolatile;
        function isTransient(flags) {
            return (flags & 128 /* ACC_TRANSIENT */) === 128 /* ACC_TRANSIENT */;
        }
        AccessFlags.isTransient = isTransient;
        function isNative(flags) {
            return (flags & 256 /* ACC_NATIVE */) === 256 /* ACC_NATIVE */;
        }
        AccessFlags.isNative = isNative;
        function isInterface(flags) {
            return (flags & 512 /* ACC_INTERFACE */) === 512 /* ACC_INTERFACE */;
        }
        AccessFlags.isInterface = isInterface;
        function isAbstract(flags) {
            return (flags & 1024 /* ACC_ABSTRACT */) === 1024 /* ACC_ABSTRACT */;
        }
        AccessFlags.isAbstract = isAbstract;
    })(AccessFlags = J2ME.AccessFlags || (J2ME.AccessFlags = {}));
    function getClassImage(classBytes) {
        var classImage = {};
        var getAttributes = function (attribute_name_index, bytes) {
            var reader = new J2ME.Reader(bytes);
            var attribute = { attribute_name_index: attribute_name_index };
            var item = classImage.constant_pool[attribute_name_index];
            switch (item.tag) {
                case 5 /* CONSTANT_Long */:
                case 4 /* CONSTANT_Float */:
                case 6 /* CONSTANT_Double */:
                case 3 /* CONSTANT_Integer */:
                case 8 /* CONSTANT_String */:
                    attribute.type = J2ME.ATTRIBUTE_TYPES.ConstantValue;
                    attribute.info = reader.read16();
                    return attribute;
                case 1 /* CONSTANT_Utf8 */:
                    switch (item.bytes) {
                        case J2ME.ATTRIBUTE_TYPES.Code:
                            attribute.type = J2ME.ATTRIBUTE_TYPES.Code;
                            attribute.max_stack = reader.read16();
                            attribute.max_locals = reader.read16();
                            var code_length = reader.read32();
                            attribute.code = reader.readBytes(code_length);
                            var exception_table_length = reader.read16();
                            attribute.exception_table = [];
                            for (var i = 0; i < exception_table_length; i++) {
                                attribute.exception_table.push({
                                    start_pc: reader.read16(),
                                    end_pc: reader.read16(),
                                    handler_pc: reader.read16(),
                                    catch_type: reader.read16()
                                });
                            }
                            var attributes_count = reader.read16();
                            attribute.attributes = [];
                            for (var i = 0; i < attributes_count; i++) {
                                var attribute_name_index = reader.read16();
                                var attribute_length = reader.read32();
                                var info = getAttributes(attribute_name_index, reader.readBytes(attribute_length));
                                attribute.attributes.push({ attribute_name_index: attribute_name_index, info: info });
                            }
                            return attribute;
                        case J2ME.ATTRIBUTE_TYPES.SourceFile:
                            attribute.type = J2ME.ATTRIBUTE_TYPES.SourceFile;
                            attribute.sourcefile_index = reader.read16();
                            return attribute;
                        case J2ME.ATTRIBUTE_TYPES.LineNumberTable:
                            attribute.type = J2ME.ATTRIBUTE_TYPES.LineNumberTable;
                            if (!release) {
                                var line_number_table_length = reader.read16();
                                attribute.line_number_table = [];
                                for (var i = 0; i < line_number_table_length; i++) {
                                    attribute.line_number_table.push({
                                        start_pc: reader.read16(),
                                        line_number: reader.read16()
                                    });
                                }
                            }
                            return attribute;
                        case J2ME.ATTRIBUTE_TYPES.Exceptions:
                            attribute.type = J2ME.ATTRIBUTE_TYPES.Exceptions;
                            var number_of_exceptions = reader.read16();
                            attribute.exception_index_table = [];
                            for (var i = 0; i < number_of_exceptions; i++) {
                                attribute.exception_index_table.push(reader.read16());
                            }
                            return attribute;
                        case J2ME.ATTRIBUTE_TYPES.InnerClasses:
                            attribute.type = J2ME.ATTRIBUTE_TYPES.InnerClasses;
                            var number_of_classes = reader.read16();
                            attribute.classes = [];
                            for (var i = 0; i < number_of_classes; i++) {
                                var inner = {};
                                inner.inner_class_info_index = reader.read16();
                                inner.outer_class_info_index = reader.read16();
                                inner.inner_name_index = reader.read16();
                                inner.inner_class_access_flags = reader.read16();
                                attribute.classes.push(inner);
                            }
                            return attribute;
                        case J2ME.ATTRIBUTE_TYPES.Synthetic:
                            attribute.type = J2ME.ATTRIBUTE_TYPES.Synthetic;
                            return attribute;
                        case J2ME.ATTRIBUTE_TYPES.Deprecated:
                            attribute.type = J2ME.ATTRIBUTE_TYPES.Deprecated;
                            return attribute;
                        case J2ME.ATTRIBUTE_TYPES.StackMap:
                            attribute.type = J2ME.ATTRIBUTE_TYPES.StackMap;
                            return attribute;
                        default:
                            throw new Error("This attribute type is not supported yet. [" + JSON.stringify(item) + "]");
                    }
                default:
                    throw new Error("This attribute type is not supported yet. [" + JSON.stringify(item) + "]");
            }
        };
        var reader = new J2ME.Reader(classBytes);
        classImage.magic = reader.read32().toString(16);
        classImage.version = {
            minor_version: reader.read16(),
            major_version: reader.read16()
        };
        classImage.constant_pool = [null];
        var constant_pool_count = reader.read16();
        for (var i = 1; i < constant_pool_count; i++) {
            var tag = reader.read8();
            switch (tag) {
                case 7 /* CONSTANT_Class */:
                    var name_index = reader.read16();
                    classImage.constant_pool.push({ tag: tag, name_index: name_index });
                    break;
                case 1 /* CONSTANT_Utf8 */:
                    var length = reader.read16();
                    var bytes = reader.readString(length);
                    classImage.constant_pool.push({ tag: tag, bytes: bytes });
                    break;
                case 10 /* CONSTANT_Methodref */:
                    var class_index = reader.read16();
                    var name_and_type_index = reader.read16();
                    classImage.constant_pool.push({ tag: tag, class_index: class_index, name_and_type_index: name_and_type_index });
                    break;
                case 12 /* CONSTANT_NameAndType */:
                    var name_index = reader.read16();
                    var signature_index = reader.read16();
                    classImage.constant_pool.push({ tag: tag, name_index: name_index, signature_index: signature_index });
                    break;
                case 9 /* CONSTANT_Fieldref */:
                    var class_index = reader.read16();
                    var name_and_type_index = reader.read16();
                    classImage.constant_pool.push({ tag: tag, class_index: class_index, name_and_type_index: name_and_type_index });
                    break;
                case 8 /* CONSTANT_String */:
                    var string_index = reader.read16();
                    classImage.constant_pool.push({ tag: tag, string_index: string_index });
                    break;
                case 3 /* CONSTANT_Integer */:
                    classImage.constant_pool.push({ tag: tag, integer: reader.readInteger() });
                    break;
                case 4 /* CONSTANT_Float */:
                    classImage.constant_pool.push({ tag: tag, float: reader.readFloat() });
                    break;
                case 6 /* CONSTANT_Double */:
                    classImage.constant_pool.push({ tag: tag, double: reader.readDouble() });
                    classImage.constant_pool.push(null);
                    ++i;
                    break;
                case 5 /* CONSTANT_Long */:
                    classImage.constant_pool.push({ tag: tag, highBits: reader.readInteger(), lowBits: reader.readInteger() });
                    classImage.constant_pool.push(null);
                    ++i;
                    break;
                case 9 /* CONSTANT_Fieldref */:
                case 10 /* CONSTANT_Methodref */:
                case 11 /* CONSTANT_InterfaceMethodref */:
                    var class_index = reader.read16();
                    var name_and_type_index = reader.read16();
                    classImage.constant_pool.push({ tag: tag, class_index: class_index, name_and_type_index: name_and_type_index });
                    break;
                default:
                    throw new Error("tag " + tag + " not supported.");
            }
        }
        classImage.access_flags = reader.read16();
        classImage.this_class = reader.read16();
        classImage.super_class = reader.read16();
        classImage.interfaces = [];
        var interfaces_count = reader.read16();
        for (var i = 0; i < interfaces_count; i++) {
            var index = reader.read16();
            if (index != 0) {
                classImage.interfaces.push(index);
            }
        }
        classImage.fields = [];
        var fields_count = reader.read16();
        for (var i = 0; i < fields_count; i++) {
            var field_info = { access_flags: reader.read16(), name_index: reader.read16(), descriptor_index: reader.read16(), attributes: [] };
            var attributes_count = reader.read16();
            for (var j = 0; j < attributes_count; j++) {
                var attribute_name_index = reader.read16();
                var attribute_length = reader.read32();
                var info = reader.readBytes(attribute_length);
                field_info.attributes.push({ attribute_name_index: attribute_name_index, info: info });
            }
            classImage.fields.push(field_info);
        }
        classImage.methods = [];
        var methods_count = reader.read16();
        for (var i = 0; i < methods_count; i++) {
            var method_info = { access_flags: reader.read16(), name_index: reader.read16(), signature_index: reader.read16(), attributes: [] };
            var attributes_count = reader.read16();
            for (var j = 0; j < attributes_count; j++) {
                var attribute_name_index = reader.read16();
                var attribute_length = reader.read32();
                var info = getAttributes(attribute_name_index, reader.readBytes(attribute_length));
                method_info.attributes.push({ attribute_name_index: attribute_name_index, info: info });
            }
            classImage.methods.push(method_info);
        }
        classImage.attributes = [];
        var attributes_count = reader.read16();
        for (var i = 0; i < attributes_count; i++) {
            var attribute_name_index = reader.read16();
            var attribute_length = reader.read32();
            var info = getAttributes(attribute_name_index, reader.readBytes(attribute_length));
            classImage.attributes.push({ attribute_name_index: attribute_name_index, info: info });
        }
        return classImage;
    }
    J2ME.getClassImage = getClassImage;
    ;
})(J2ME || (J2ME = {}));
var J2ME;
(function (J2ME) {
    var Reader = (function () {
        function Reader(buffer, offset) {
            if (offset === void 0) { offset = 0; }
            this.view = new DataView(buffer);
            this.u8 = new Uint8Array(buffer);
            this.offset = offset;
        }
        Reader.makeArrays = function (length) {
            var arrays = [];
            for (var i = 0; i < length; i++) {
                arrays.push(new Array(i));
            }
            return arrays;
        };
        Reader.getArray = function (length) {
            return Reader.arrays[length];
        };
        Reader.prototype.read8 = function () {
            return this.u8[this.offset++];
        };
        Reader.prototype.read16 = function () {
            var u8 = this.u8;
            var o = this.offset;
            this.offset += 2;
            return u8[o] << 8 | u8[o + 1];
        };
        Reader.prototype.read32 = function () {
            return this.readInteger() >>> 0;
        };
        Reader.prototype.readInteger = function () {
            var o = this.offset;
            var u8 = this.u8;
            var a = u8[o + 0];
            var b = u8[o + 1];
            var c = u8[o + 2];
            var d = u8[o + 3];
            this.offset = o + 4;
            return (a << 24) | (b << 16) | (c << 8) | d;
        };
        Reader.prototype.readFloat = function () {
            var data = this.view.getFloat32(this.offset, false);
            this.offset += 4;
            return data;
        };
        Reader.prototype.readDouble = function () {
            var data = this.view.getFloat64(this.offset, false);
            this.offset += 8;
            return data;
        };
        Reader.prototype.readStringFast = function (length) {
            var a = Reader.getArray(length);
            var i = 0, j = 0;
            var o = this.offset;
            var e = o + length;
            var u8 = this.u8;
            while (o < e) {
                var x = u8[o++];
                if (x <= 0x7f) {
                    // Code points in the range '\u0001' to '\u007F' are represented by a
                    // single byte.
                    // The 7 bits of data in the byte give the value of the code point
                    // represented.
                    a[j++] = String.fromCharCode(x);
                }
                else if (x <= 0xdf) {
                    // The null code point ('\u0000') and code points in the range '\u0080'
                    // to '\u07FF' are represented by a pair of bytes x and y.
                    var y = u8[o++];
                    a[j++] = String.fromCharCode(((x & 0x1f) << 6) + (y & 0x3f));
                }
                else {
                    // Code points in the range '\u0800' to '\uFFFF' are represented by 3
                    // bytes x, y, and z.
                    var y = u8[o++];
                    var z = u8[o++];
                    a[j++] = String.fromCharCode(((x & 0xf) << 12) + ((y & 0x3f) << 6) + (z & 0x3f));
                }
            }
            this.offset = o;
            if (j !== a.length) {
                var b = Reader.getArray(j);
                for (var i = 0; i < j; i++) {
                    b[i] = a[i];
                }
                a = b;
            }
            return a.join("");
        };
        Reader.prototype.readString = function (length) {
            if (length === 1) {
                var c = this.u8[this.offset];
                if (c <= 0x7f) {
                    this.offset++;
                    return String.fromCharCode(c);
                }
            }
            else if (length < 128) {
                return this.readStringFast(length);
            }
            return this.readStringSlow(length);
        };
        Reader.prototype.readStringSlow = function (length) {
            // NB: no need to create a new slice.
            var data = new Uint8Array(this.view.buffer, this.offset, length);
            this.offset += length;
            try {
                var s = util.decodeUtf8Array(data);
                return s;
            }
            catch (e) {
                return util.javaUTF8Decode(data);
            }
        };
        Reader.prototype.readBytes = function (length) {
            var data = this.u8.buffer.slice(this.offset, this.offset + length);
            this.offset += length;
            return data;
        };
        Reader.arrays = Reader.makeArrays(128);
        return Reader;
    })();
    J2ME.Reader = Reader;
})(J2ME || (J2ME = {}));
/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
var J2ME;
(function (J2ME) {
    var Options;
    (function (Options) {
        var isObject = J2ME.isObject;
        var assert = J2ME.Debug.assert;
        var Argument = (function () {
            function Argument(shortName, longName, type, options) {
                this.shortName = shortName;
                this.longName = longName;
                this.type = type;
                options = options || {};
                this.positional = options.positional;
                this.parseFn = options.parse;
                this.value = options.defaultValue;
            }
            Argument.prototype.parse = function (value) {
                if (this.type === "boolean") {
                    release || assert(typeof value === "boolean");
                    this.value = value;
                }
                else if (this.type === "number") {
                    release || assert(!isNaN(value), value + " is not a number");
                    this.value = parseInt(value, 10);
                }
                else {
                    this.value = value;
                }
                if (this.parseFn) {
                    this.parseFn(this.value);
                }
            };
            return Argument;
        })();
        Options.Argument = Argument;
        var ArgumentParser = (function () {
            function ArgumentParser() {
                this.args = [];
            }
            ArgumentParser.prototype.addArgument = function (shortName, longName, type, options) {
                var argument = new Argument(shortName, longName, type, options);
                this.args.push(argument);
                return argument;
            };
            ArgumentParser.prototype.addBoundOption = function (option) {
                var options = { parse: function (x) {
                    option.value = x;
                } };
                this.args.push(new Argument(option.shortName, option.longName, option.type, options));
            };
            ArgumentParser.prototype.addBoundOptionSet = function (optionSet) {
                var self = this;
                optionSet.options.forEach(function (x) {
                    if (x instanceof OptionSet) {
                        self.addBoundOptionSet(x);
                    }
                    else {
                        release || assert(x instanceof Option);
                        self.addBoundOption(x);
                    }
                });
            };
            ArgumentParser.prototype.getUsage = function () {
                var str = "";
                this.args.forEach(function (x) {
                    if (!x.positional) {
                        str += "[-" + x.shortName + "|--" + x.longName + (x.type === "boolean" ? "" : " " + x.type[0].toUpperCase()) + "]";
                    }
                    else {
                        str += x.longName;
                    }
                    str += " ";
                });
                return str;
            };
            ArgumentParser.prototype.parse = function (args) {
                var nonPositionalArgumentMap = {};
                var positionalArgumentList = [];
                this.args.forEach(function (x) {
                    if (x.positional) {
                        positionalArgumentList.push(x);
                    }
                    else {
                        nonPositionalArgumentMap["-" + x.shortName] = x;
                        nonPositionalArgumentMap["--" + x.longName] = x;
                    }
                });
                var leftoverArguments = [];
                while (args.length) {
                    var argString = args.shift();
                    var argument = null, value = argString;
                    if (argString == '--') {
                        leftoverArguments = leftoverArguments.concat(args);
                        break;
                    }
                    else if (argString.slice(0, 1) == '-' || argString.slice(0, 2) == '--') {
                        argument = nonPositionalArgumentMap[argString];
                        // release || assert(argument, "Argument " + argString + " is unknown.");
                        if (!argument) {
                            continue;
                        }
                        if (argument.type !== "boolean") {
                            if (argument.type.indexOf("[]") > 0) {
                                value = [];
                                while (args.length && args[0][0] != '-') {
                                    value.push(args.shift());
                                }
                            }
                            else {
                                value = args.shift();
                            }
                            release || assert(value !== "-" && value !== "--", "Argument " + argString + " must have a value.");
                        }
                        else {
                            value = true;
                        }
                    }
                    else if (positionalArgumentList.length) {
                        argument = positionalArgumentList.shift();
                    }
                    else {
                        leftoverArguments.push(value);
                    }
                    if (argument) {
                        argument.parse(value);
                    }
                }
                release || assert(positionalArgumentList.length === 0, "Missing positional arguments.");
                return leftoverArguments;
            };
            return ArgumentParser;
        })();
        Options.ArgumentParser = ArgumentParser;
        var OptionSet = (function () {
            function OptionSet(name, settings) {
                if (settings === void 0) { settings = null; }
                this.open = false;
                this.name = name;
                this.settings = settings || {};
                this.options = [];
            }
            OptionSet.prototype.register = function (option) {
                if (option instanceof OptionSet) {
                    for (var i = 0; i < this.options.length; i++) {
                        var optionSet = this.options[i];
                        if (optionSet instanceof OptionSet && optionSet.name === option.name) {
                            return optionSet;
                        }
                    }
                }
                this.options.push(option);
                if (this.settings) {
                    if (option instanceof OptionSet) {
                        var optionSettings = this.settings[option.name];
                        if (isObject(optionSettings)) {
                            option.settings = optionSettings.settings;
                            option.open = optionSettings.open;
                        }
                    }
                    else {
                        // build_bundle chokes on this:
                        // if (!isNullOrUndefined(this.settings[option.longName])) {
                        if (typeof this.settings[option.longName] !== "undefined") {
                            switch (option.type) {
                                case "boolean":
                                    option.value = !!this.settings[option.longName];
                                    break;
                                case "number":
                                    option.value = +this.settings[option.longName];
                                    break;
                                default:
                                    option.value = this.settings[option.longName];
                                    break;
                            }
                        }
                    }
                }
                return option;
            };
            OptionSet.prototype.trace = function (writer) {
                writer.enter(this.name + " {");
                this.options.forEach(function (option) {
                    option.trace(writer);
                });
                writer.leave("}");
            };
            OptionSet.prototype.getSettings = function () {
                var settings = {};
                this.options.forEach(function (option) {
                    if (option instanceof OptionSet) {
                        settings[option.name] = {
                            settings: option.getSettings(),
                            open: option.open
                        };
                    }
                    else {
                        settings[option.longName] = option.value;
                    }
                });
                return settings;
            };
            OptionSet.prototype.setSettings = function (settings) {
                if (!settings) {
                    return;
                }
                this.options.forEach(function (option) {
                    if (option instanceof OptionSet) {
                        if (option.name in settings) {
                            option.setSettings(settings[option.name].settings);
                        }
                    }
                    else {
                        if (option.longName in settings) {
                            option.value = settings[option.longName];
                        }
                    }
                });
            };
            return OptionSet;
        })();
        Options.OptionSet = OptionSet;
        var Option = (function () {
            // config:
            //  { range: { min: 1, max: 5, step: 1 } }
            //  { list: [ "item 1", "item 2", "item 3" ] }
            //  { choices: { "choice 1": 1, "choice 2": 2, "choice 3": 3 } }
            function Option(shortName, longName, type, defaultValue, description, config) {
                if (config === void 0) { config = null; }
                this.longName = longName;
                this.shortName = shortName;
                this.type = type;
                this.defaultValue = defaultValue;
                this.value = defaultValue;
                this.description = description;
                this.config = config;
            }
            Option.prototype.parse = function (value) {
                this.value = value;
            };
            Option.prototype.trace = function (writer) {
                writer.writeLn(("-" + this.shortName + "|--" + this.longName).padRight(" ", 30) + " = " + this.type + " " + this.value + " [" + this.defaultValue + "]" + " (" + this.description + ")");
            };
            return Option;
        })();
        Options.Option = Option;
    })(Options = J2ME.Options || (J2ME.Options = {}));
})(J2ME || (J2ME = {}));
/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var J2ME;
(function (J2ME) {
    var Metrics;
    (function (Metrics) {
        var Timer = (function () {
            function Timer(parent, name) {
                this._parent = parent;
                this._timers = J2ME.ObjectUtilities.createMap();
                this._name = name;
                this._begin = 0;
                this._last = 0;
                this._total = 0;
                this._count = 0;
            }
            Timer.time = function (name, fn) {
                Timer.start(name);
                fn();
                Timer.stop();
            };
            Timer.start = function (name) {
                Timer._top = Timer._top._timers[name] || (Timer._top._timers[name] = new Timer(Timer._top, name));
                Timer._top.start();
                var tmp = Timer._flat._timers[name] || (Timer._flat._timers[name] = new Timer(Timer._flat, name));
                tmp.start();
                Timer._flatStack.push(tmp);
            };
            Timer.stop = function () {
                Timer._top.stop();
                Timer._top = Timer._top._parent;
                Timer._flatStack.pop().stop();
            };
            Timer.stopStart = function (name) {
                Timer.stop();
                Timer.start(name);
            };
            Timer.prototype.start = function () {
                this._begin = J2ME.getTicks();
            };
            Timer.prototype.stop = function () {
                this._last = J2ME.getTicks() - this._begin;
                this._total += this._last;
                this._count += 1;
            };
            Timer.prototype.toJSON = function () {
                return { name: this._name, total: this._total, timers: this._timers };
            };
            Timer.prototype.trace = function (writer) {
                writer.enter(this._name + ": " + this._total.toFixed(2) + " ms" + ", count: " + this._count + ", average: " + (this._total / this._count).toFixed(2) + " ms");
                for (var name in this._timers) {
                    this._timers[name].trace(writer);
                }
                writer.outdent();
            };
            Timer.trace = function (writer) {
                Timer._base.trace(writer);
                Timer._flat.trace(writer);
            };
            Timer._base = new Timer(null, "Total");
            Timer._top = Timer._base;
            Timer._flat = new Timer(null, "Flat");
            Timer._flatStack = [];
            return Timer;
        })();
        Metrics.Timer = Timer;
        /**
         * Quick way to count named events.
         */
        var Counter = (function () {
            function Counter(enabled) {
                this._enabled = enabled;
                this.clear();
            }
            Object.defineProperty(Counter.prototype, "counts", {
                get: function () {
                    return this._counts;
                },
                enumerable: true,
                configurable: true
            });
            Counter.prototype.setEnabled = function (enabled) {
                this._enabled = enabled;
            };
            Counter.prototype.clear = function () {
                this._counts = J2ME.ObjectUtilities.createMap();
                this._times = J2ME.ObjectUtilities.createMap();
            };
            Counter.prototype.toJSON = function () {
                return {
                    counts: this._counts,
                    times: this._times
                };
            };
            Counter.prototype.count = function (name, increment, time) {
                if (increment === void 0) { increment = 1; }
                if (time === void 0) { time = 0; }
                if (!this._enabled) {
                    return;
                }
                if (this._counts[name] === undefined) {
                    this._counts[name] = 0;
                    this._times[name] = 0;
                }
                this._counts[name] += increment;
                this._times[name] += time;
                return this._counts[name];
            };
            Counter.prototype.trace = function (writer) {
                for (var name in this._counts) {
                    writer.writeLn(name + ": " + this._counts[name]);
                }
            };
            Counter.prototype._pairToString = function (times, pair) {
                var name = pair[0];
                var count = pair[1];
                var time = times[name];
                var line = count + ": " + name;
                if (time) {
                    line += ", " + time.toFixed(4);
                    if (count > 1) {
                        line += " (" + (time / count).toFixed(4) + ")";
                    }
                }
                return line;
            };
            Counter.prototype.toStringSorted = function () {
                var self = this;
                var times = this._times;
                var pairs = [];
                for (var name in this._counts) {
                    pairs.push([name, this._counts[name]]);
                }
                pairs.sort(function (a, b) {
                    return b[1] - a[1];
                });
                return (pairs.map(function (pair) {
                    return self._pairToString(times, pair);
                }).join(", "));
            };
            Counter.prototype.traceSorted = function (writer, inline) {
                if (inline === void 0) { inline = false; }
                var self = this;
                var times = this._times;
                var pairs = [];
                for (var name in this._counts) {
                    pairs.push([name, this._counts[name]]);
                }
                pairs.sort(function (a, b) {
                    return b[1] - a[1];
                });
                if (inline) {
                    writer.writeLn(pairs.map(function (pair) {
                        return self._pairToString(times, pair);
                    }).join(", "));
                }
                else {
                    pairs.forEach(function (pair) {
                        writer.writeLn(self._pairToString(times, pair));
                    });
                }
            };
            Counter.instance = new Counter(true);
            return Counter;
        })();
        Metrics.Counter = Counter;
        var Average = (function () {
            function Average(max) {
                this._samples = new Float64Array(max);
                this._count = 0;
                this._index = 0;
            }
            Average.prototype.push = function (sample) {
                if (this._count < this._samples.length) {
                    this._count++;
                }
                this._index++;
                this._samples[this._index % this._samples.length] = sample;
            };
            Average.prototype.average = function () {
                var sum = 0;
                for (var i = 0; i < this._count; i++) {
                    sum += this._samples[i];
                }
                return sum / this._count;
            };
            return Average;
        })();
        Metrics.Average = Average;
    })(Metrics = J2ME.Metrics || (J2ME.Metrics = {}));
})(J2ME || (J2ME = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var J2ME;
(function (J2ME) {
    var Bytecode;
    (function (Bytecode) {
        var assert = J2ME.Debug.assert;
        var Bytes = (function () {
            function Bytes() {
            }
            /**
             * Gets a signed 1-byte value.
             */
            Bytes.beS1 = function (data, bci) {
                return (data[bci] << 24) >> 24;
            };
            /**
             * Gets a signed 2-byte big-endian value.
             */
            Bytes.beS2 = function (data, bci) {
                return ((data[bci] << 8) | (data[bci + 1] & 0xff)) << 16 >> 16;
            };
            /**
             * Gets an unsigned 1-byte value.
             */
            Bytes.beU1 = function (data, bci) {
                return data[bci] & 0xff;
            };
            /**
             * Gets an unsigned 2-byte big-endian value.
             */
            Bytes.beU2 = function (data, bci) {
                return ((data[bci] & 0xff) << 8) | (data[bci + 1] & 0xff);
            };
            /**
             * Gets a signed 4-byte big-endian value.
             */
            Bytes.beS4 = function (data, bci) {
                return (data[bci] << 24) | ((data[bci + 1] & 0xff) << 16) | ((data[bci + 2] & 0xff) << 8) | (data[bci + 3] & 0xff);
            };
            /**
             * Gets either a signed 2-byte or a signed 4-byte big-endian value.
             */
            Bytes.beSVar = function (data, bci, fourByte) {
                if (fourByte) {
                    return Bytes.beS4(data, bci);
                }
                else {
                    return Bytes.beS2(data, bci);
                }
            };
            return Bytes;
        })();
        Bytecode.Bytes = Bytes;
        (function (Condition) {
            /**
             * Equal.
             */
            Condition[Condition["EQ"] = 0] = "EQ";
            /**
             * Not equal.
             */
            Condition[Condition["NE"] = 1] = "NE";
            /**
             * Signed less than.
             */
            Condition[Condition["LT"] = 2] = "LT";
            /**
             * Signed less than or equal.
             */
            Condition[Condition["LE"] = 3] = "LE";
            /**
             * Signed greater than.
             */
            Condition[Condition["GT"] = 4] = "GT";
            /**
             * Signed greater than or equal.
             */
            Condition[Condition["GE"] = 5] = "GE";
            /**
             * Unsigned greater than or equal ("above than or equal").
             */
            Condition[Condition["AE"] = 6] = "AE";
            /**
             * Unsigned less than or equal ("below than or equal").
             */
            Condition[Condition["BE"] = 7] = "BE";
            /**
             * Unsigned greater than ("above than").
             */
            Condition[Condition["AT"] = 8] = "AT";
            /**
             * Unsigned less than ("below than").
             */
            Condition[Condition["BT"] = 9] = "BT";
            /**
             * Operation produced an overflow.
             */
            Condition[Condition["OF"] = 10] = "OF";
            /**
             * Operation did not produce an overflow.
             */
            Condition[Condition["NOF"] = 11] = "NOF";
        })(Bytecode.Condition || (Bytecode.Condition = {}));
        var Condition = Bytecode.Condition;
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
        (function (Bytecodes) {
            Bytecodes[Bytecodes["NOP"] = 0] = "NOP";
            Bytecodes[Bytecodes["ACONST_NULL"] = 1] = "ACONST_NULL";
            Bytecodes[Bytecodes["ICONST_M1"] = 2] = "ICONST_M1";
            Bytecodes[Bytecodes["ICONST_0"] = 3] = "ICONST_0";
            Bytecodes[Bytecodes["ICONST_1"] = 4] = "ICONST_1";
            Bytecodes[Bytecodes["ICONST_2"] = 5] = "ICONST_2";
            Bytecodes[Bytecodes["ICONST_3"] = 6] = "ICONST_3";
            Bytecodes[Bytecodes["ICONST_4"] = 7] = "ICONST_4";
            Bytecodes[Bytecodes["ICONST_5"] = 8] = "ICONST_5";
            Bytecodes[Bytecodes["LCONST_0"] = 9] = "LCONST_0";
            Bytecodes[Bytecodes["LCONST_1"] = 10] = "LCONST_1";
            Bytecodes[Bytecodes["FCONST_0"] = 11] = "FCONST_0";
            Bytecodes[Bytecodes["FCONST_1"] = 12] = "FCONST_1";
            Bytecodes[Bytecodes["FCONST_2"] = 13] = "FCONST_2";
            Bytecodes[Bytecodes["DCONST_0"] = 14] = "DCONST_0";
            Bytecodes[Bytecodes["DCONST_1"] = 15] = "DCONST_1";
            Bytecodes[Bytecodes["BIPUSH"] = 16] = "BIPUSH";
            Bytecodes[Bytecodes["SIPUSH"] = 17] = "SIPUSH";
            Bytecodes[Bytecodes["LDC"] = 18] = "LDC";
            Bytecodes[Bytecodes["LDC_W"] = 19] = "LDC_W";
            Bytecodes[Bytecodes["LDC2_W"] = 20] = "LDC2_W";
            Bytecodes[Bytecodes["ILOAD"] = 21] = "ILOAD";
            Bytecodes[Bytecodes["LLOAD"] = 22] = "LLOAD";
            Bytecodes[Bytecodes["FLOAD"] = 23] = "FLOAD";
            Bytecodes[Bytecodes["DLOAD"] = 24] = "DLOAD";
            Bytecodes[Bytecodes["ALOAD"] = 25] = "ALOAD";
            Bytecodes[Bytecodes["ILOAD_0"] = 26] = "ILOAD_0";
            Bytecodes[Bytecodes["ILOAD_1"] = 27] = "ILOAD_1";
            Bytecodes[Bytecodes["ILOAD_2"] = 28] = "ILOAD_2";
            Bytecodes[Bytecodes["ILOAD_3"] = 29] = "ILOAD_3";
            Bytecodes[Bytecodes["LLOAD_0"] = 30] = "LLOAD_0";
            Bytecodes[Bytecodes["LLOAD_1"] = 31] = "LLOAD_1";
            Bytecodes[Bytecodes["LLOAD_2"] = 32] = "LLOAD_2";
            Bytecodes[Bytecodes["LLOAD_3"] = 33] = "LLOAD_3";
            Bytecodes[Bytecodes["FLOAD_0"] = 34] = "FLOAD_0";
            Bytecodes[Bytecodes["FLOAD_1"] = 35] = "FLOAD_1";
            Bytecodes[Bytecodes["FLOAD_2"] = 36] = "FLOAD_2";
            Bytecodes[Bytecodes["FLOAD_3"] = 37] = "FLOAD_3";
            Bytecodes[Bytecodes["DLOAD_0"] = 38] = "DLOAD_0";
            Bytecodes[Bytecodes["DLOAD_1"] = 39] = "DLOAD_1";
            Bytecodes[Bytecodes["DLOAD_2"] = 40] = "DLOAD_2";
            Bytecodes[Bytecodes["DLOAD_3"] = 41] = "DLOAD_3";
            Bytecodes[Bytecodes["ALOAD_0"] = 42] = "ALOAD_0";
            Bytecodes[Bytecodes["ALOAD_1"] = 43] = "ALOAD_1";
            Bytecodes[Bytecodes["ALOAD_2"] = 44] = "ALOAD_2";
            Bytecodes[Bytecodes["ALOAD_3"] = 45] = "ALOAD_3";
            Bytecodes[Bytecodes["IALOAD"] = 46] = "IALOAD";
            Bytecodes[Bytecodes["LALOAD"] = 47] = "LALOAD";
            Bytecodes[Bytecodes["FALOAD"] = 48] = "FALOAD";
            Bytecodes[Bytecodes["DALOAD"] = 49] = "DALOAD";
            Bytecodes[Bytecodes["AALOAD"] = 50] = "AALOAD";
            Bytecodes[Bytecodes["BALOAD"] = 51] = "BALOAD";
            Bytecodes[Bytecodes["CALOAD"] = 52] = "CALOAD";
            Bytecodes[Bytecodes["SALOAD"] = 53] = "SALOAD";
            Bytecodes[Bytecodes["ISTORE"] = 54] = "ISTORE";
            Bytecodes[Bytecodes["LSTORE"] = 55] = "LSTORE";
            Bytecodes[Bytecodes["FSTORE"] = 56] = "FSTORE";
            Bytecodes[Bytecodes["DSTORE"] = 57] = "DSTORE";
            Bytecodes[Bytecodes["ASTORE"] = 58] = "ASTORE";
            Bytecodes[Bytecodes["ISTORE_0"] = 59] = "ISTORE_0";
            Bytecodes[Bytecodes["ISTORE_1"] = 60] = "ISTORE_1";
            Bytecodes[Bytecodes["ISTORE_2"] = 61] = "ISTORE_2";
            Bytecodes[Bytecodes["ISTORE_3"] = 62] = "ISTORE_3";
            Bytecodes[Bytecodes["LSTORE_0"] = 63] = "LSTORE_0";
            Bytecodes[Bytecodes["LSTORE_1"] = 64] = "LSTORE_1";
            Bytecodes[Bytecodes["LSTORE_2"] = 65] = "LSTORE_2";
            Bytecodes[Bytecodes["LSTORE_3"] = 66] = "LSTORE_3";
            Bytecodes[Bytecodes["FSTORE_0"] = 67] = "FSTORE_0";
            Bytecodes[Bytecodes["FSTORE_1"] = 68] = "FSTORE_1";
            Bytecodes[Bytecodes["FSTORE_2"] = 69] = "FSTORE_2";
            Bytecodes[Bytecodes["FSTORE_3"] = 70] = "FSTORE_3";
            Bytecodes[Bytecodes["DSTORE_0"] = 71] = "DSTORE_0";
            Bytecodes[Bytecodes["DSTORE_1"] = 72] = "DSTORE_1";
            Bytecodes[Bytecodes["DSTORE_2"] = 73] = "DSTORE_2";
            Bytecodes[Bytecodes["DSTORE_3"] = 74] = "DSTORE_3";
            Bytecodes[Bytecodes["ASTORE_0"] = 75] = "ASTORE_0";
            Bytecodes[Bytecodes["ASTORE_1"] = 76] = "ASTORE_1";
            Bytecodes[Bytecodes["ASTORE_2"] = 77] = "ASTORE_2";
            Bytecodes[Bytecodes["ASTORE_3"] = 78] = "ASTORE_3";
            Bytecodes[Bytecodes["IASTORE"] = 79] = "IASTORE";
            Bytecodes[Bytecodes["LASTORE"] = 80] = "LASTORE";
            Bytecodes[Bytecodes["FASTORE"] = 81] = "FASTORE";
            Bytecodes[Bytecodes["DASTORE"] = 82] = "DASTORE";
            Bytecodes[Bytecodes["AASTORE"] = 83] = "AASTORE";
            Bytecodes[Bytecodes["BASTORE"] = 84] = "BASTORE";
            Bytecodes[Bytecodes["CASTORE"] = 85] = "CASTORE";
            Bytecodes[Bytecodes["SASTORE"] = 86] = "SASTORE";
            Bytecodes[Bytecodes["POP"] = 87] = "POP";
            Bytecodes[Bytecodes["POP2"] = 88] = "POP2";
            Bytecodes[Bytecodes["DUP"] = 89] = "DUP";
            Bytecodes[Bytecodes["DUP_X1"] = 90] = "DUP_X1";
            Bytecodes[Bytecodes["DUP_X2"] = 91] = "DUP_X2";
            Bytecodes[Bytecodes["DUP2"] = 92] = "DUP2";
            Bytecodes[Bytecodes["DUP2_X1"] = 93] = "DUP2_X1";
            Bytecodes[Bytecodes["DUP2_X2"] = 94] = "DUP2_X2";
            Bytecodes[Bytecodes["SWAP"] = 95] = "SWAP";
            Bytecodes[Bytecodes["IADD"] = 96] = "IADD";
            Bytecodes[Bytecodes["LADD"] = 97] = "LADD";
            Bytecodes[Bytecodes["FADD"] = 98] = "FADD";
            Bytecodes[Bytecodes["DADD"] = 99] = "DADD";
            Bytecodes[Bytecodes["ISUB"] = 100] = "ISUB";
            Bytecodes[Bytecodes["LSUB"] = 101] = "LSUB";
            Bytecodes[Bytecodes["FSUB"] = 102] = "FSUB";
            Bytecodes[Bytecodes["DSUB"] = 103] = "DSUB";
            Bytecodes[Bytecodes["IMUL"] = 104] = "IMUL";
            Bytecodes[Bytecodes["LMUL"] = 105] = "LMUL";
            Bytecodes[Bytecodes["FMUL"] = 106] = "FMUL";
            Bytecodes[Bytecodes["DMUL"] = 107] = "DMUL";
            Bytecodes[Bytecodes["IDIV"] = 108] = "IDIV";
            Bytecodes[Bytecodes["LDIV"] = 109] = "LDIV";
            Bytecodes[Bytecodes["FDIV"] = 110] = "FDIV";
            Bytecodes[Bytecodes["DDIV"] = 111] = "DDIV";
            Bytecodes[Bytecodes["IREM"] = 112] = "IREM";
            Bytecodes[Bytecodes["LREM"] = 113] = "LREM";
            Bytecodes[Bytecodes["FREM"] = 114] = "FREM";
            Bytecodes[Bytecodes["DREM"] = 115] = "DREM";
            Bytecodes[Bytecodes["INEG"] = 116] = "INEG";
            Bytecodes[Bytecodes["LNEG"] = 117] = "LNEG";
            Bytecodes[Bytecodes["FNEG"] = 118] = "FNEG";
            Bytecodes[Bytecodes["DNEG"] = 119] = "DNEG";
            Bytecodes[Bytecodes["ISHL"] = 120] = "ISHL";
            Bytecodes[Bytecodes["LSHL"] = 121] = "LSHL";
            Bytecodes[Bytecodes["ISHR"] = 122] = "ISHR";
            Bytecodes[Bytecodes["LSHR"] = 123] = "LSHR";
            Bytecodes[Bytecodes["IUSHR"] = 124] = "IUSHR";
            Bytecodes[Bytecodes["LUSHR"] = 125] = "LUSHR";
            Bytecodes[Bytecodes["IAND"] = 126] = "IAND";
            Bytecodes[Bytecodes["LAND"] = 127] = "LAND";
            Bytecodes[Bytecodes["IOR"] = 128] = "IOR";
            Bytecodes[Bytecodes["LOR"] = 129] = "LOR";
            Bytecodes[Bytecodes["IXOR"] = 130] = "IXOR";
            Bytecodes[Bytecodes["LXOR"] = 131] = "LXOR";
            Bytecodes[Bytecodes["IINC"] = 132] = "IINC";
            Bytecodes[Bytecodes["I2L"] = 133] = "I2L";
            Bytecodes[Bytecodes["I2F"] = 134] = "I2F";
            Bytecodes[Bytecodes["I2D"] = 135] = "I2D";
            Bytecodes[Bytecodes["L2I"] = 136] = "L2I";
            Bytecodes[Bytecodes["L2F"] = 137] = "L2F";
            Bytecodes[Bytecodes["L2D"] = 138] = "L2D";
            Bytecodes[Bytecodes["F2I"] = 139] = "F2I";
            Bytecodes[Bytecodes["F2L"] = 140] = "F2L";
            Bytecodes[Bytecodes["F2D"] = 141] = "F2D";
            Bytecodes[Bytecodes["D2I"] = 142] = "D2I";
            Bytecodes[Bytecodes["D2L"] = 143] = "D2L";
            Bytecodes[Bytecodes["D2F"] = 144] = "D2F";
            Bytecodes[Bytecodes["I2B"] = 145] = "I2B";
            Bytecodes[Bytecodes["I2C"] = 146] = "I2C";
            Bytecodes[Bytecodes["I2S"] = 147] = "I2S";
            Bytecodes[Bytecodes["LCMP"] = 148] = "LCMP";
            Bytecodes[Bytecodes["FCMPL"] = 149] = "FCMPL";
            Bytecodes[Bytecodes["FCMPG"] = 150] = "FCMPG";
            Bytecodes[Bytecodes["DCMPL"] = 151] = "DCMPL";
            Bytecodes[Bytecodes["DCMPG"] = 152] = "DCMPG";
            Bytecodes[Bytecodes["IFEQ"] = 153] = "IFEQ";
            Bytecodes[Bytecodes["IFNE"] = 154] = "IFNE";
            Bytecodes[Bytecodes["IFLT"] = 155] = "IFLT";
            Bytecodes[Bytecodes["IFGE"] = 156] = "IFGE";
            Bytecodes[Bytecodes["IFGT"] = 157] = "IFGT";
            Bytecodes[Bytecodes["IFLE"] = 158] = "IFLE";
            Bytecodes[Bytecodes["IF_ICMPEQ"] = 159] = "IF_ICMPEQ";
            Bytecodes[Bytecodes["IF_ICMPNE"] = 160] = "IF_ICMPNE";
            Bytecodes[Bytecodes["IF_ICMPLT"] = 161] = "IF_ICMPLT";
            Bytecodes[Bytecodes["IF_ICMPGE"] = 162] = "IF_ICMPGE";
            Bytecodes[Bytecodes["IF_ICMPGT"] = 163] = "IF_ICMPGT";
            Bytecodes[Bytecodes["IF_ICMPLE"] = 164] = "IF_ICMPLE";
            Bytecodes[Bytecodes["IF_ACMPEQ"] = 165] = "IF_ACMPEQ";
            Bytecodes[Bytecodes["IF_ACMPNE"] = 166] = "IF_ACMPNE";
            Bytecodes[Bytecodes["GOTO"] = 167] = "GOTO";
            Bytecodes[Bytecodes["JSR"] = 168] = "JSR";
            Bytecodes[Bytecodes["RET"] = 169] = "RET";
            Bytecodes[Bytecodes["TABLESWITCH"] = 170] = "TABLESWITCH";
            Bytecodes[Bytecodes["LOOKUPSWITCH"] = 171] = "LOOKUPSWITCH";
            Bytecodes[Bytecodes["IRETURN"] = 172] = "IRETURN";
            Bytecodes[Bytecodes["LRETURN"] = 173] = "LRETURN";
            Bytecodes[Bytecodes["FRETURN"] = 174] = "FRETURN";
            Bytecodes[Bytecodes["DRETURN"] = 175] = "DRETURN";
            Bytecodes[Bytecodes["ARETURN"] = 176] = "ARETURN";
            Bytecodes[Bytecodes["RETURN"] = 177] = "RETURN";
            Bytecodes[Bytecodes["GETSTATIC"] = 178] = "GETSTATIC";
            Bytecodes[Bytecodes["PUTSTATIC"] = 179] = "PUTSTATIC";
            Bytecodes[Bytecodes["GETFIELD"] = 180] = "GETFIELD";
            Bytecodes[Bytecodes["PUTFIELD"] = 181] = "PUTFIELD";
            Bytecodes[Bytecodes["INVOKEVIRTUAL"] = 182] = "INVOKEVIRTUAL";
            Bytecodes[Bytecodes["INVOKESPECIAL"] = 183] = "INVOKESPECIAL";
            Bytecodes[Bytecodes["INVOKESTATIC"] = 184] = "INVOKESTATIC";
            Bytecodes[Bytecodes["INVOKEINTERFACE"] = 185] = "INVOKEINTERFACE";
            Bytecodes[Bytecodes["XXXUNUSEDXXX"] = 186] = "XXXUNUSEDXXX";
            Bytecodes[Bytecodes["NEW"] = 187] = "NEW";
            Bytecodes[Bytecodes["NEWARRAY"] = 188] = "NEWARRAY";
            Bytecodes[Bytecodes["ANEWARRAY"] = 189] = "ANEWARRAY";
            Bytecodes[Bytecodes["ARRAYLENGTH"] = 190] = "ARRAYLENGTH";
            Bytecodes[Bytecodes["ATHROW"] = 191] = "ATHROW";
            Bytecodes[Bytecodes["CHECKCAST"] = 192] = "CHECKCAST";
            Bytecodes[Bytecodes["INSTANCEOF"] = 193] = "INSTANCEOF";
            Bytecodes[Bytecodes["MONITORENTER"] = 194] = "MONITORENTER";
            Bytecodes[Bytecodes["MONITOREXIT"] = 195] = "MONITOREXIT";
            Bytecodes[Bytecodes["WIDE"] = 196] = "WIDE";
            Bytecodes[Bytecodes["MULTIANEWARRAY"] = 197] = "MULTIANEWARRAY";
            Bytecodes[Bytecodes["IFNULL"] = 198] = "IFNULL";
            Bytecodes[Bytecodes["IFNONNULL"] = 199] = "IFNONNULL";
            Bytecodes[Bytecodes["GOTO_W"] = 200] = "GOTO_W";
            Bytecodes[Bytecodes["JSR_W"] = 201] = "JSR_W";
            Bytecodes[Bytecodes["BREAKPOINT"] = 202] = "BREAKPOINT";
            Bytecodes[Bytecodes["ALOAD_ILOAD"] = 210] = "ALOAD_ILOAD";
            Bytecodes[Bytecodes["IINC_GOTO"] = 211] = "IINC_GOTO";
            Bytecodes[Bytecodes["ARRAYLENGTH_IF_ICMPGE"] = 212] = "ARRAYLENGTH_IF_ICMPGE";
            Bytecodes[Bytecodes["ILLEGAL"] = 255] = "ILLEGAL";
            Bytecodes[Bytecodes["END"] = 256] = "END";
            /**
             * The last opcode defined by the JVM specification. To iterate over all JVM bytecodes:
             */
            Bytecodes[Bytecodes["LAST_JVM_OPCODE"] = 201 /* JSR_W */] = "LAST_JVM_OPCODE";
        })(Bytecode.Bytecodes || (Bytecode.Bytecodes = {}));
        var Bytecodes = Bytecode.Bytecodes;
        var Flags;
        (function (Flags) {
            /**
             * Denotes an instruction that ends a basic block and does not let control flow fall through to its lexical successor.
             */
            Flags[Flags["STOP"] = 0x00000001] = "STOP";
            /**
             * Denotes an instruction that ends a basic block and may let control flow fall through to its lexical successor.
             * In practice this means it is a conditional branch.
             */
            Flags[Flags["FALL_THROUGH"] = 0x00000002] = "FALL_THROUGH";
            /**
             * Denotes an instruction that has a 2 or 4 byte operand that is an offset to another instruction in the same method.
             * This does not include the {@link Bytecodes#TABLESWITCH} or {@link Bytecodes#LOOKUPSWITCH} instructions.
             */
            Flags[Flags["BRANCH"] = 0x00000004] = "BRANCH";
            /**
             * Denotes an instruction that reads the value of a static or instance field.
             */
            Flags[Flags["FIELD_READ"] = 0x00000008] = "FIELD_READ";
            /**
             * Denotes an instruction that writes the value of a static or instance field.
             */
            Flags[Flags["FIELD_WRITE"] = 0x00000010] = "FIELD_WRITE";
            /**
             * Denotes an instruction that is not defined in the JVM specification.
             */
            Flags[Flags["EXTENSION"] = 0x00000020] = "EXTENSION";
            /**
             * Denotes an instruction that can cause aFlags.TRAP.
             */
            Flags[Flags["TRAP"] = 0x00000080] = "TRAP";
            /**
             * Denotes an instruction that is commutative.
             */
            Flags[Flags["COMMUTATIVE"] = 0x00000100] = "COMMUTATIVE";
            /**
             * Denotes an instruction that is associative.
             */
            Flags[Flags["ASSOCIATIVE"] = 0x00000200] = "ASSOCIATIVE";
            /**
             * Denotes an instruction that loads an operand.
             */
            Flags[Flags["LOAD"] = 0x00000400] = "LOAD";
            /**
             * Denotes an instruction that stores an operand.
             */
            Flags[Flags["STORE"] = 0x00000800] = "STORE";
            /**
             * Denotes the 4 INVOKE* instructions.
             */
            Flags[Flags["INVOKE"] = 0x00001000] = "INVOKE";
            /**
             * Denotes a return instruction that ends a basic block.
             */
            Flags[Flags["RETURN"] = 0x00002000] = "RETURN";
        })(Flags || (Flags = {}));
        /**
         * A array that maps from a bytecode value to the set of {@link Flags} for the corresponding instruction.
         */
        Bytecode.flags = new Uint32Array(256);
        /**
         * A array that maps from a bytecode value to the length in bytes for the corresponding instruction.
         */
        Bytecode.length = new Uint32Array(256);
        var writer = new J2ME.IndentingWriter();
        function define(opcode, name, format, flags_) {
            if (flags_ === void 0) { flags_ = 0; }
            var instructionLength = format.length;
            Bytecode.length[opcode] = instructionLength;
            Bytecode.flags[opcode] = flags_;
            release || assert(!isConditionalBranch(opcode) || isBranch(opcode), "a conditional branch must also be a branch");
        }
        /**
         * Only call this before the compiler is used.
         */
        function defineBytecodes() {
            define(0 /* NOP */, "nop", "b");
            define(1 /* ACONST_NULL */, "aconst_null", "b");
            define(2 /* ICONST_M1 */, "iconst_m1", "b");
            define(3 /* ICONST_0 */, "iconst_0", "b");
            define(4 /* ICONST_1 */, "iconst_1", "b");
            define(5 /* ICONST_2 */, "iconst_2", "b");
            define(6 /* ICONST_3 */, "iconst_3", "b");
            define(7 /* ICONST_4 */, "iconst_4", "b");
            define(8 /* ICONST_5 */, "iconst_5", "b");
            define(9 /* LCONST_0 */, "lconst_0", "b");
            define(10 /* LCONST_1 */, "lconst_1", "b");
            define(11 /* FCONST_0 */, "fconst_0", "b");
            define(12 /* FCONST_1 */, "fconst_1", "b");
            define(13 /* FCONST_2 */, "fconst_2", "b");
            define(14 /* DCONST_0 */, "dconst_0", "b");
            define(15 /* DCONST_1 */, "dconst_1", "b");
            define(16 /* BIPUSH */, "bipush", "bc");
            define(17 /* SIPUSH */, "sipush", "bcc");
            define(18 /* LDC */, "ldc", "bi", 128 /* TRAP */);
            define(19 /* LDC_W */, "ldc_w", "bii", 128 /* TRAP */);
            define(20 /* LDC2_W */, "ldc2_w", "bii", 128 /* TRAP */);
            define(21 /* ILOAD */, "iload", "bi", 1024 /* LOAD */);
            define(22 /* LLOAD */, "lload", "bi", 1024 /* LOAD */);
            define(23 /* FLOAD */, "fload", "bi", 1024 /* LOAD */);
            define(24 /* DLOAD */, "dload", "bi", 1024 /* LOAD */);
            define(25 /* ALOAD */, "aload", "bi", 1024 /* LOAD */);
            define(26 /* ILOAD_0 */, "iload_0", "b", 1024 /* LOAD */);
            define(27 /* ILOAD_1 */, "iload_1", "b", 1024 /* LOAD */);
            define(28 /* ILOAD_2 */, "iload_2", "b", 1024 /* LOAD */);
            define(29 /* ILOAD_3 */, "iload_3", "b", 1024 /* LOAD */);
            define(30 /* LLOAD_0 */, "lload_0", "b", 1024 /* LOAD */);
            define(31 /* LLOAD_1 */, "lload_1", "b", 1024 /* LOAD */);
            define(32 /* LLOAD_2 */, "lload_2", "b", 1024 /* LOAD */);
            define(33 /* LLOAD_3 */, "lload_3", "b", 1024 /* LOAD */);
            define(34 /* FLOAD_0 */, "fload_0", "b", 1024 /* LOAD */);
            define(35 /* FLOAD_1 */, "fload_1", "b", 1024 /* LOAD */);
            define(36 /* FLOAD_2 */, "fload_2", "b", 1024 /* LOAD */);
            define(37 /* FLOAD_3 */, "fload_3", "b", 1024 /* LOAD */);
            define(38 /* DLOAD_0 */, "dload_0", "b", 1024 /* LOAD */);
            define(39 /* DLOAD_1 */, "dload_1", "b", 1024 /* LOAD */);
            define(40 /* DLOAD_2 */, "dload_2", "b", 1024 /* LOAD */);
            define(41 /* DLOAD_3 */, "dload_3", "b", 1024 /* LOAD */);
            define(42 /* ALOAD_0 */, "aload_0", "b", 1024 /* LOAD */);
            define(43 /* ALOAD_1 */, "aload_1", "b", 1024 /* LOAD */);
            define(44 /* ALOAD_2 */, "aload_2", "b", 1024 /* LOAD */);
            define(45 /* ALOAD_3 */, "aload_3", "b", 1024 /* LOAD */);
            define(46 /* IALOAD */, "iaload", "b", 128 /* TRAP */);
            define(47 /* LALOAD */, "laload", "b", 128 /* TRAP */);
            define(48 /* FALOAD */, "faload", "b", 128 /* TRAP */);
            define(49 /* DALOAD */, "daload", "b", 128 /* TRAP */);
            define(50 /* AALOAD */, "aaload", "b", 128 /* TRAP */);
            define(51 /* BALOAD */, "baload", "b", 128 /* TRAP */);
            define(52 /* CALOAD */, "caload", "b", 128 /* TRAP */);
            define(53 /* SALOAD */, "saload", "b", 128 /* TRAP */);
            define(54 /* ISTORE */, "istore", "bi", 2048 /* STORE */);
            define(55 /* LSTORE */, "lstore", "bi", 2048 /* STORE */);
            define(56 /* FSTORE */, "fstore", "bi", 2048 /* STORE */);
            define(57 /* DSTORE */, "dstore", "bi", 2048 /* STORE */);
            define(58 /* ASTORE */, "astore", "bi", 2048 /* STORE */);
            define(59 /* ISTORE_0 */, "istore_0", "b", 2048 /* STORE */);
            define(60 /* ISTORE_1 */, "istore_1", "b", 2048 /* STORE */);
            define(61 /* ISTORE_2 */, "istore_2", "b", 2048 /* STORE */);
            define(62 /* ISTORE_3 */, "istore_3", "b", 2048 /* STORE */);
            define(63 /* LSTORE_0 */, "lstore_0", "b", 2048 /* STORE */);
            define(64 /* LSTORE_1 */, "lstore_1", "b", 2048 /* STORE */);
            define(65 /* LSTORE_2 */, "lstore_2", "b", 2048 /* STORE */);
            define(66 /* LSTORE_3 */, "lstore_3", "b", 2048 /* STORE */);
            define(67 /* FSTORE_0 */, "fstore_0", "b", 2048 /* STORE */);
            define(68 /* FSTORE_1 */, "fstore_1", "b", 2048 /* STORE */);
            define(69 /* FSTORE_2 */, "fstore_2", "b", 2048 /* STORE */);
            define(70 /* FSTORE_3 */, "fstore_3", "b", 2048 /* STORE */);
            define(71 /* DSTORE_0 */, "dstore_0", "b", 2048 /* STORE */);
            define(72 /* DSTORE_1 */, "dstore_1", "b", 2048 /* STORE */);
            define(73 /* DSTORE_2 */, "dstore_2", "b", 2048 /* STORE */);
            define(74 /* DSTORE_3 */, "dstore_3", "b", 2048 /* STORE */);
            define(75 /* ASTORE_0 */, "astore_0", "b", 2048 /* STORE */);
            define(76 /* ASTORE_1 */, "astore_1", "b", 2048 /* STORE */);
            define(77 /* ASTORE_2 */, "astore_2", "b", 2048 /* STORE */);
            define(78 /* ASTORE_3 */, "astore_3", "b", 2048 /* STORE */);
            define(79 /* IASTORE */, "iastore", "b", 128 /* TRAP */);
            define(80 /* LASTORE */, "lastore", "b", 128 /* TRAP */);
            define(81 /* FASTORE */, "fastore", "b", 128 /* TRAP */);
            define(82 /* DASTORE */, "dastore", "b", 128 /* TRAP */);
            define(83 /* AASTORE */, "aastore", "b", 128 /* TRAP */);
            define(84 /* BASTORE */, "bastore", "b", 128 /* TRAP */);
            define(85 /* CASTORE */, "castore", "b", 128 /* TRAP */);
            define(86 /* SASTORE */, "sastore", "b", 128 /* TRAP */);
            define(87 /* POP */, "pop", "b");
            define(88 /* POP2 */, "pop2", "b");
            define(89 /* DUP */, "dup", "b");
            define(90 /* DUP_X1 */, "dup_x1", "b");
            define(91 /* DUP_X2 */, "dup_x2", "b");
            define(92 /* DUP2 */, "dup2", "b");
            define(93 /* DUP2_X1 */, "dup2_x1", "b");
            define(94 /* DUP2_X2 */, "dup2_x2", "b");
            define(95 /* SWAP */, "swap", "b");
            define(96 /* IADD */, "iadd", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(97 /* LADD */, "ladd", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(98 /* FADD */, "fadd", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(99 /* DADD */, "dadd", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(100 /* ISUB */, "isub", "b");
            define(101 /* LSUB */, "lsub", "b");
            define(102 /* FSUB */, "fsub", "b");
            define(103 /* DSUB */, "dsub", "b");
            define(104 /* IMUL */, "imul", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(105 /* LMUL */, "lmul", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(106 /* FMUL */, "fmul", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(107 /* DMUL */, "dmul", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(108 /* IDIV */, "idiv", "b", 128 /* TRAP */);
            define(109 /* LDIV */, "ldiv", "b", 128 /* TRAP */);
            define(110 /* FDIV */, "fdiv", "b");
            define(111 /* DDIV */, "ddiv", "b");
            define(112 /* IREM */, "irem", "b", 128 /* TRAP */);
            define(113 /* LREM */, "lrem", "b", 128 /* TRAP */);
            define(114 /* FREM */, "frem", "b");
            define(115 /* DREM */, "drem", "b");
            define(116 /* INEG */, "ineg", "b");
            define(117 /* LNEG */, "lneg", "b");
            define(118 /* FNEG */, "fneg", "b");
            define(119 /* DNEG */, "dneg", "b");
            define(120 /* ISHL */, "ishl", "b");
            define(121 /* LSHL */, "lshl", "b");
            define(122 /* ISHR */, "ishr", "b");
            define(123 /* LSHR */, "lshr", "b");
            define(124 /* IUSHR */, "iushr", "b");
            define(125 /* LUSHR */, "lushr", "b");
            define(126 /* IAND */, "iand", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(127 /* LAND */, "land", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(128 /* IOR */, "ior", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(129 /* LOR */, "lor", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(130 /* IXOR */, "ixor", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(131 /* LXOR */, "lxor", "b", 256 /* COMMUTATIVE */ | 512 /* ASSOCIATIVE */);
            define(132 /* IINC */, "iinc", "bic", 1024 /* LOAD */ | 2048 /* STORE */);
            define(133 /* I2L */, "i2l", "b");
            define(134 /* I2F */, "i2f", "b");
            define(135 /* I2D */, "i2d", "b");
            define(136 /* L2I */, "l2i", "b");
            define(137 /* L2F */, "l2f", "b");
            define(138 /* L2D */, "l2d", "b");
            define(139 /* F2I */, "f2i", "b");
            define(140 /* F2L */, "f2l", "b");
            define(141 /* F2D */, "f2d", "b");
            define(142 /* D2I */, "d2i", "b");
            define(143 /* D2L */, "d2l", "b");
            define(144 /* D2F */, "d2f", "b");
            define(145 /* I2B */, "i2b", "b");
            define(146 /* I2C */, "i2c", "b");
            define(147 /* I2S */, "i2s", "b");
            define(148 /* LCMP */, "lcmp", "b");
            define(149 /* FCMPL */, "fcmpl", "b");
            define(150 /* FCMPG */, "fcmpg", "b");
            define(151 /* DCMPL */, "dcmpl", "b");
            define(152 /* DCMPG */, "dcmpg", "b");
            define(153 /* IFEQ */, "ifeq", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(154 /* IFNE */, "ifne", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(155 /* IFLT */, "iflt", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(156 /* IFGE */, "ifge", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(157 /* IFGT */, "ifgt", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(158 /* IFLE */, "ifle", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(159 /* IF_ICMPEQ */, "if_icmpeq", "boo", 256 /* COMMUTATIVE */ | 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(160 /* IF_ICMPNE */, "if_icmpne", "boo", 256 /* COMMUTATIVE */ | 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(161 /* IF_ICMPLT */, "if_icmplt", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(162 /* IF_ICMPGE */, "if_icmpge", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(163 /* IF_ICMPGT */, "if_icmpgt", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(164 /* IF_ICMPLE */, "if_icmple", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(165 /* IF_ACMPEQ */, "if_acmpeq", "boo", 256 /* COMMUTATIVE */ | 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(166 /* IF_ACMPNE */, "if_acmpne", "boo", 256 /* COMMUTATIVE */ | 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(167 /* GOTO */, "goto", "boo", 1 /* STOP */ | 4 /* BRANCH */);
            define(168 /* JSR */, "jsr", "boo", 1 /* STOP */ | 4 /* BRANCH */);
            define(169 /* RET */, "ret", "bi", 1 /* STOP */);
            define(170 /* TABLESWITCH */, "tableswitch", "", 1 /* STOP */);
            define(171 /* LOOKUPSWITCH */, "lookupswitch", "", 1 /* STOP */);
            define(172 /* IRETURN */, "ireturn", "b", 128 /* TRAP */ | 1 /* STOP */ | 8192 /* RETURN */);
            define(173 /* LRETURN */, "lreturn", "b", 128 /* TRAP */ | 1 /* STOP */ | 8192 /* RETURN */);
            define(174 /* FRETURN */, "freturn", "b", 128 /* TRAP */ | 1 /* STOP */ | 8192 /* RETURN */);
            define(175 /* DRETURN */, "dreturn", "b", 128 /* TRAP */ | 1 /* STOP */ | 8192 /* RETURN */);
            define(176 /* ARETURN */, "areturn", "b", 128 /* TRAP */ | 1 /* STOP */ | 8192 /* RETURN */);
            define(177 /* RETURN */, "return", "b", 128 /* TRAP */ | 1 /* STOP */ | 8192 /* RETURN */);
            define(178 /* GETSTATIC */, "getstatic", "bjj", 128 /* TRAP */ | 8 /* FIELD_READ */);
            define(179 /* PUTSTATIC */, "putstatic", "bjj", 128 /* TRAP */ | 16 /* FIELD_WRITE */);
            define(180 /* GETFIELD */, "getfield", "bjj", 128 /* TRAP */ | 8 /* FIELD_READ */);
            define(181 /* PUTFIELD */, "putfield", "bjj", 128 /* TRAP */ | 16 /* FIELD_WRITE */);
            define(182 /* INVOKEVIRTUAL */, "invokevirtual", "bjj", 128 /* TRAP */ | 4096 /* INVOKE */);
            define(183 /* INVOKESPECIAL */, "invokespecial", "bjj", 128 /* TRAP */ | 4096 /* INVOKE */);
            define(184 /* INVOKESTATIC */, "invokestatic", "bjj", 128 /* TRAP */ | 4096 /* INVOKE */);
            define(185 /* INVOKEINTERFACE */, "invokeinterface", "bjja_", 128 /* TRAP */ | 4096 /* INVOKE */);
            define(186 /* XXXUNUSEDXXX */, "xxxunusedxxx", "");
            define(187 /* NEW */, "new", "bii", 128 /* TRAP */);
            define(188 /* NEWARRAY */, "newarray", "bc", 128 /* TRAP */);
            define(189 /* ANEWARRAY */, "anewarray", "bii", 128 /* TRAP */);
            define(190 /* ARRAYLENGTH */, "arraylength", "b", 128 /* TRAP */);
            define(191 /* ATHROW */, "athrow", "b", 128 /* TRAP */ | 1 /* STOP */);
            define(192 /* CHECKCAST */, "checkcast", "bii", 128 /* TRAP */);
            define(193 /* INSTANCEOF */, "instanceof", "bii", 128 /* TRAP */);
            define(194 /* MONITORENTER */, "monitorenter", "b", 128 /* TRAP */);
            define(195 /* MONITOREXIT */, "monitorexit", "b", 128 /* TRAP */);
            define(196 /* WIDE */, "wide", "");
            define(197 /* MULTIANEWARRAY */, "multianewarray", "biic", 128 /* TRAP */);
            define(198 /* IFNULL */, "ifnull", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(199 /* IFNONNULL */, "ifnonnull", "boo", 2 /* FALL_THROUGH */ | 4 /* BRANCH */);
            define(200 /* GOTO_W */, "goto_w", "boooo", 1 /* STOP */ | 4 /* BRANCH */);
            define(201 /* JSR_W */, "jsr_w", "boooo", 1 /* STOP */ | 4 /* BRANCH */);
            define(202 /* BREAKPOINT */, "breakpoint", "b", 128 /* TRAP */);
            define(210 /* ALOAD_ILOAD */, "aload_iload", "bi", 1024 /* LOAD */);
            define(211 /* IINC_GOTO */, "iinc_goto", "bic", 1024 /* LOAD */ | 2048 /* STORE */ | 1 /* STOP */ | 4 /* BRANCH */);
            define(212 /* ARRAYLENGTH_IF_ICMPGE */, "arraylength_IF_ICMPGE", "b", 256 /* COMMUTATIVE */ | 2 /* FALL_THROUGH */ | 4 /* BRANCH */ | 128 /* TRAP */);
        }
        Bytecode.defineBytecodes = defineBytecodes;
        defineBytecodes();
        /**
         * Gets the length of an instruction denoted by a given opcode.
         */
        function lengthOf(opcode) {
            return Bytecode.length[opcode & 0xff];
        }
        Bytecode.lengthOf = lengthOf;
        function lengthAt(code, bci) {
            var opcode = Bytes.beU1(code, bci);
            var _length = Bytecode.length[opcode & 0xff];
            if (_length == 0) {
                switch (opcode) {
                    case 170 /* TABLESWITCH */: {
                        return new BytecodeTableSwitch(code, bci).size();
                    }
                    case 171 /* LOOKUPSWITCH */: {
                        return new BytecodeLookupSwitch(code, bci).size();
                    }
                    case 196 /* WIDE */: {
                        var opc = Bytes.beU1(code, bci + 1);
                        if (opc == 169 /* RET */) {
                            return 4;
                        }
                        else if (opc == 132 /* IINC */) {
                            return 6;
                        }
                        else {
                            return 4; // a load or store bytecode
                        }
                    }
                    default:
                        throw new Error("unknown variable-length bytecode: " + opcode);
                }
            }
            return _length;
        }
        Bytecode.lengthAt = lengthAt;
        /**
         * Determines if an opcode is commutative.
         */
        function isCommutative(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 256 /* COMMUTATIVE */) != 0;
        }
        /**
         * Determines if a given opcode denotes an instruction that can cause an implicit exception.
         */
        function canTrap(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 128 /* TRAP */) != 0;
        }
        Bytecode.canTrap = canTrap;
        /**
         * Determines if a given opcode denotes an instruction that loads a local variable to the operand stack.
         */
        function isLoad(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 1024 /* LOAD */) != 0;
        }
        /**
         * Determines if a given opcode denotes an instruction that ends a basic block and does not let control flow fall
         * through to its lexical successor.
         */
        function isStop(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 1 /* STOP */) != 0;
        }
        /**
         * Determines if a given opcode denotes an instruction that stores a value to a local variable
         * after popping it from the operand stack.
         */
        function isInvoke(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 4096 /* INVOKE */) != 0;
        }
        /**
         * Determines if a given opcode denotes an instruction that stores a value to a local variable
         * after popping it from the operand stack.
         */
        function isStore(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 2048 /* STORE */) != 0;
        }
        /**
         * Determines if a given opcode is an instruction that delimits a basic block.
         */
        function isBlockEnd(opcode) {
            return (Bytecode.flags[opcode & 0xff] & (1 /* STOP */ | 2 /* FALL_THROUGH */)) != 0;
        }
        /**
         * Determines if a given opcode is an instruction that has a 2 or 4 byte operand that is an offset to another
         * instruction in the same method. This does not include the {@linkplain #TABLESWITCH switch} instructions.
         */
        function isBranch(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 4 /* BRANCH */) != 0;
        }
        /**
         * Determines if a given opcode denotes a conditional branch.
         */
        function isConditionalBranch(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 2 /* FALL_THROUGH */) != 0;
        }
        /**
         * Determines if a given opcode denotes a standard bytecode. A standard bytecode is
         * defined in the JVM specification.
         */
        function isStandard(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 32 /* EXTENSION */) == 0;
        }
        /**
         * Determines if a given opcode denotes an extended bytecode.
         */
        function isExtended(opcode) {
            return (Bytecode.flags[opcode & 0xff] & 32 /* EXTENSION */) != 0;
        }
        /**
         * Determines if a given opcode is a three-byte extended bytecode.
         */
        function isThreeByteExtended(opcode) {
            return (opcode & ~0xff) != 0;
        }
        /**
         * Determines if a given opcode is a return bytecode.
         */
        function isReturn(opcode) {
            return !!(Bytecode.flags[opcode & 0xff] & 8192 /* RETURN */);
        }
        Bytecode.isReturn = isReturn;
        var BytecodeSwitch = (function () {
            /**
             * Constructor for a bytecode array.
             * @param code the bytecode array containing the switch instruction.
             * @param bci the index in the array of the switch instruction
             */
            function BytecodeSwitch(code, bci) {
                this.alignedBci = (bci + 4) & 0xfffffffc;
                this.code = code;
                this.bci = bci;
            }
            /**
             * Gets the index of the instruction denoted by the {@code i}'th switch target.
             * @param i index of the switch target
             * @return the index of the instruction denoted by the {@code i}'th switch target
             */
            BytecodeSwitch.prototype.targetAt = function (i) {
                return this.bci + this.offsetAt(i);
            };
            /**
             * Gets the index of the instruction for the default switch target.
             * @return the index of the instruction for the default switch target
             */
            BytecodeSwitch.prototype.defaultTarget = function () {
                return this.bci + this.defaultOffset();
            };
            /**
             * Gets the offset from the start of the switch instruction to the default switch target.
             * @return the offset to the default switch target
             */
            BytecodeSwitch.prototype.defaultOffset = function () {
                throw J2ME.Debug.abstractMethod("defaultOffset");
            };
            /**
             * Gets the key at {@code i}'th switch target index.
             * @param i the switch target index
             * @return the key at {@code i}'th switch target index
             */
            BytecodeSwitch.prototype.keyAt = function (i) {
                throw J2ME.Debug.abstractMethod("keyAt");
            };
            /**
             * Gets the offset from the start of the switch instruction for the {@code i}'th switch target.
             * @param i the switch target index
             * @return the offset to the {@code i}'th switch target
             */
            BytecodeSwitch.prototype.offsetAt = function (i) {
                throw J2ME.Debug.abstractMethod("offsetAt");
            };
            /**
             * Gets the number of switch targets.
             * @return the number of switch targets
             */
            BytecodeSwitch.prototype.numberOfCases = function () {
                throw J2ME.Debug.abstractMethod("numberOfCases");
            };
            /**
             * Gets the total size in bytes of the switch instruction.
             * @return the total size in bytes of the switch instruction
             */
            BytecodeSwitch.prototype.size = function () {
                throw J2ME.Debug.abstractMethod("size");
            };
            /**
             * Reads the signed value at given bytecode index.
             * @param bci the start index of the value to retrieve
             * @return the signed, 4-byte value in the bytecode array starting at {@code bci}
             */
            BytecodeSwitch.prototype.readWord = function (bci) {
                return Bytes.beS4(this.code, bci);
            };
            return BytecodeSwitch;
        })();
        Bytecode.BytecodeSwitch = BytecodeSwitch;
        var BytecodeTableSwitch = (function (_super) {
            __extends(BytecodeTableSwitch, _super);
            /**
             * Constructor for a bytecode array.
             * @param code the bytecode array containing the switch instruction.
             * @param bci the index in the array of the switch instruction
             */
            function BytecodeTableSwitch(code, bci) {
                _super.call(this, code, bci);
            }
            /**
             * Gets the low key of the table switch.
             */
            BytecodeTableSwitch.prototype.lowKey = function () {
                return this.readWord(this.alignedBci + BytecodeTableSwitch.OFFSET_TO_LOW_KEY);
            };
            /**
             * Gets the high key of the table switch.
             */
            BytecodeTableSwitch.prototype.highKey = function () {
                return this.readWord(this.alignedBci + BytecodeTableSwitch.OFFSET_TO_HIGH_KEY);
            };
            BytecodeTableSwitch.prototype.keyAt = function (i) {
                return this.lowKey() + i;
            };
            BytecodeTableSwitch.prototype.defaultOffset = function () {
                return this.readWord(this.alignedBci);
            };
            BytecodeTableSwitch.prototype.offsetAt = function (i) {
                return this.readWord(this.alignedBci + BytecodeTableSwitch.OFFSET_TO_FIRST_JUMP_OFFSET + BytecodeTableSwitch.JUMP_OFFSET_SIZE * i);
            };
            BytecodeTableSwitch.prototype.numberOfCases = function () {
                return this.highKey() - this.lowKey() + 1;
            };
            BytecodeTableSwitch.prototype.size = function () {
                return this.alignedBci + BytecodeTableSwitch.OFFSET_TO_FIRST_JUMP_OFFSET + BytecodeTableSwitch.JUMP_OFFSET_SIZE * this.numberOfCases() - this.bci;
            };
            BytecodeTableSwitch.OFFSET_TO_LOW_KEY = 4;
            BytecodeTableSwitch.OFFSET_TO_HIGH_KEY = 8;
            BytecodeTableSwitch.OFFSET_TO_FIRST_JUMP_OFFSET = 12;
            BytecodeTableSwitch.JUMP_OFFSET_SIZE = 4;
            return BytecodeTableSwitch;
        })(BytecodeSwitch);
        Bytecode.BytecodeTableSwitch = BytecodeTableSwitch;
        var BytecodeLookupSwitch = (function (_super) {
            __extends(BytecodeLookupSwitch, _super);
            function BytecodeLookupSwitch(code, bci) {
                _super.call(this, code, bci);
            }
            BytecodeLookupSwitch.prototype.defaultOffset = function () {
                return this.readWord(this.alignedBci);
            };
            BytecodeLookupSwitch.prototype.offsetAt = function (i) {
                return this.readWord(this.alignedBci + BytecodeLookupSwitch.OFFSET_TO_FIRST_PAIR_OFFSET + BytecodeLookupSwitch.PAIR_SIZE * i);
            };
            BytecodeLookupSwitch.prototype.keyAt = function (i) {
                return this.readWord(this.alignedBci + BytecodeLookupSwitch.OFFSET_TO_FIRST_PAIR_MATCH + BytecodeLookupSwitch.PAIR_SIZE * i);
            };
            BytecodeLookupSwitch.prototype.numberOfCases = function () {
                return this.readWord(this.alignedBci + BytecodeLookupSwitch.OFFSET_TO_NUMBER_PAIRS);
            };
            BytecodeLookupSwitch.prototype.size = function () {
                return this.alignedBci + BytecodeLookupSwitch.OFFSET_TO_FIRST_PAIR_MATCH + BytecodeLookupSwitch.PAIR_SIZE * this.numberOfCases() - this.bci;
            };
            BytecodeLookupSwitch.OFFSET_TO_NUMBER_PAIRS = 4;
            BytecodeLookupSwitch.OFFSET_TO_FIRST_PAIR_MATCH = 8;
            BytecodeLookupSwitch.OFFSET_TO_FIRST_PAIR_OFFSET = 12;
            BytecodeLookupSwitch.PAIR_SIZE = 8;
            return BytecodeLookupSwitch;
        })(BytecodeSwitch);
        Bytecode.BytecodeLookupSwitch = BytecodeLookupSwitch;
        /**
         * A utility class that makes iterating over bytecodes and reading operands
         * simpler and less error prone. For example, it handles the {@link Bytecodes#WIDE} instruction
         * and wide variants of instructions internally.
         */
        var BytecodeStream = (function () {
            function BytecodeStream(code) {
                assert(code, "No Code");
                this._code = code;
                this.setBCI(0);
            }
            /**
             * Advances to the next bytecode.
             */
            BytecodeStream.prototype.next = function () {
                this.setBCI(this.nextBCI);
            };
            /**
             * Gets the bytecode index of the end of the code.
             */
            BytecodeStream.prototype.endBCI = function () {
                return this._code.length;
            };
            Object.defineProperty(BytecodeStream.prototype, "nextBCI", {
                /**
                 * Gets the next bytecode index (no side-effects).
                 */
                get: function () {
                    return this._nextBCI;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BytecodeStream.prototype, "currentBCI", {
                /**
                 * Gets the current bytecode index.
                 */
                get: function () {
                    return this._currentBCI;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the current opcode. This method will never return the
             * {@link Bytecodes#WIDE WIDE} opcode, but will instead
             * return the opcode that is modified by the {@code WIDE} opcode.
             * @return the current opcode; {@link Bytecodes#END} if at or beyond the end of the code
             */
            BytecodeStream.prototype.currentBC = function () {
                if (this._opcode === 196 /* WIDE */) {
                    return Bytes.beU1(this._code, this._currentBCI + 1);
                }
                else {
                    return this._opcode;
                }
            };
            BytecodeStream.prototype.rawCurrentBC = function () {
                return this._opcode;
            };
            /**
             * Sets the current opcode.
             */
            BytecodeStream.prototype.writeCurrentBC = function (bc) {
                assert(lengthOf(this.currentBC()) === lengthOf(bc));
                this._code[this._currentBCI] = bc;
            };
            /**
             * Gets the next opcode.
             * @return the next opcode; {@link Bytecodes#END} if at or beyond the end of the code
             */
            BytecodeStream.prototype.nextBC = function () {
                return Bytes.beU1(this._code, this._nextBCI);
            };
            /**
             * Reads the index of a local variable for one of the load or store instructions.
             * The WIDE modifier is handled internally.
             */
            BytecodeStream.prototype.readLocalIndex = function () {
                // read local variable index for load/store
                if (this._opcode == 196 /* WIDE */) {
                    return Bytes.beU2(this._code, this._currentBCI + 2);
                }
                return Bytes.beU1(this._code, this._currentBCI + 1);
            };
            /**
             * Read the delta for an {@link Bytecodes#IINC} bytecode.
             */
            BytecodeStream.prototype.readIncrement = function () {
                // read the delta for the iinc bytecode
                if (this._opcode == 196 /* WIDE */) {
                    return Bytes.beS2(this._code, this._currentBCI + 4);
                }
                return Bytes.beS1(this._code, this._currentBCI + 2);
            };
            /**
             * Read the destination of a {@link Bytecodes#GOTO} or {@code IF} instructions.
             * @return the destination bytecode index
             */
            BytecodeStream.prototype.readBranchDest = function () {
                // reads the destination for a branch bytecode
                return this._currentBCI + Bytes.beS2(this._code, this._currentBCI + 1);
            };
            /**
             * Read the destination of a {@link Bytecodes#GOTO_W} or {@link Bytecodes#JSR_W} instructions.
             * @return the destination bytecode index
             */
            BytecodeStream.prototype.readFarBranchDest = function () {
                // reads the destination for a wide branch bytecode
                return this._currentBCI + Bytes.beS4(this._code, this._currentBCI + 1);
            };
            /**
             * Read a signed 4-byte integer from the bytecode stream at the specified bytecode index.
             * @param bci the bytecode index
             * @return the integer value
             */
            BytecodeStream.prototype.readInt = function (bci) {
                // reads a 4-byte signed value
                return Bytes.beS4(this._code, bci);
            };
            /**
             * Reads an unsigned, 1-byte value from the bytecode stream at the specified bytecode index.
             * @param bci the bytecode index
             * @return the byte
             */
            BytecodeStream.prototype.readUByte = function (bci) {
                return Bytes.beU1(this._code, bci);
            };
            /**
             * Reads a constant pool index for the current instruction.
             * @return the constant pool index
             */
            BytecodeStream.prototype.readCPI = function () {
                if (this._opcode == 18 /* LDC */) {
                    return Bytes.beU1(this._code, this._currentBCI + 1);
                }
                return Bytes.beU2(this._code, this._currentBCI + 1) << 16 >> 16;
            };
            /**
             * Reads a signed, 1-byte value for the current instruction (e.g. BIPUSH).
             */
            BytecodeStream.prototype.readByte = function () {
                return this._code[this._currentBCI + 1] << 24 >> 24;
            };
            /**
             * Reads a signed, 2-byte short for the current instruction (e.g. SIPUSH).
             */
            BytecodeStream.prototype.readShort = function () {
                return Bytes.beS2(this._code, this._currentBCI + 1) << 16 >> 16;
            };
            /**
             * Sets the bytecode index to the specified value.
             * If {@code bci} is beyond the end of the array, {@link #currentBC} will return
             * {@link Bytecodes#END} and other methods may throw {@link ArrayIndexOutOfBoundsException}.
             * @param bci the new bytecode index
             */
            BytecodeStream.prototype.setBCI = function (bci) {
                this._currentBCI = bci;
                if (this._currentBCI < this._code.length) {
                    this._opcode = Bytes.beU1(this._code, bci);
                    this._nextBCI = bci + lengthAt(this._code, bci);
                }
                else {
                    this._opcode = 256 /* END */;
                    this._nextBCI = this._currentBCI;
                }
            };
            return BytecodeStream;
        })();
        Bytecode.BytecodeStream = BytecodeStream;
    })(Bytecode = J2ME.Bytecode || (J2ME.Bytecode = {}));
})(J2ME || (J2ME = {}));
var J2ME;
(function (J2ME) {
    var assert = J2ME.Debug.assert;
    var writer = new J2ME.IndentingWriter();
    (function (Kind) {
        Kind[Kind["Boolean"] = 0] = "Boolean";
        Kind[Kind["Byte"] = 1] = "Byte";
        Kind[Kind["Short"] = 2] = "Short";
        Kind[Kind["Char"] = 3] = "Char";
        Kind[Kind["Int"] = 4] = "Int";
        Kind[Kind["Float"] = 5] = "Float";
        Kind[Kind["Long"] = 6] = "Long";
        Kind[Kind["Double"] = 7] = "Double";
        Kind[Kind["Reference"] = 8] = "Reference";
        Kind[Kind["Void"] = 9] = "Void";
        Kind[Kind["Illegal"] = 10] = "Illegal";
        Kind[Kind["Store"] = 11] = "Store";
    })(J2ME.Kind || (J2ME.Kind = {}));
    var Kind = J2ME.Kind;
    J2ME.valueKinds = [
        0 /* Boolean */,
        3 /* Char */,
        5 /* Float */,
        7 /* Double */,
        1 /* Byte */,
        2 /* Short */,
        4 /* Int */,
        6 /* Long */
    ];
    function stackKind(kind) {
        switch (kind) {
            case 0 /* Boolean */: return 4 /* Int */;
            case 1 /* Byte */: return 4 /* Int */;
            case 2 /* Short */: return 4 /* Int */;
            case 3 /* Char */: return 4 /* Int */;
            case 4 /* Int */: return 4 /* Int */;
            case 5 /* Float */: return 5 /* Float */;
            case 6 /* Long */: return 6 /* Long */;
            case 7 /* Double */: return 7 /* Double */;
            case 8 /* Reference */: return 8 /* Reference */;
            default: throw J2ME.Debug.unexpected("Unknown stack kind: " + kind);
        }
    }
    J2ME.stackKind = stackKind;
    function arrayTypeCodeToKind(typeCode) {
        switch (typeCode) {
            case 4: return 0 /* Boolean */;
            case 5: return 3 /* Char */;
            case 6: return 5 /* Float */;
            case 7: return 7 /* Double */;
            case 8: return 1 /* Byte */;
            case 9: return 2 /* Short */;
            case 10: return 4 /* Int */;
            case 11: return 6 /* Long */;
            default: throw J2ME.Debug.unexpected("Unknown array type code: " + typeCode);
        }
    }
    J2ME.arrayTypeCodeToKind = arrayTypeCodeToKind;
    function kindCharacter(kind) {
        switch (kind) {
            case 0 /* Boolean */:
                return 'Z';
            case 1 /* Byte */:
                return 'B';
            case 2 /* Short */:
                return 'S';
            case 3 /* Char */:
                return 'C';
            case 4 /* Int */:
                return 'I';
            case 5 /* Float */:
                return 'F';
            case 6 /* Long */:
                return 'J';
            case 7 /* Double */:
                return 'D';
            case 8 /* Reference */:
                return 'R';
            case 9 /* Void */:
                return 'V';
        }
    }
    J2ME.kindCharacter = kindCharacter;
    function getSignatureKind(signature) {
        switch (signature[0]) {
            case 'Z':
                return 0 /* Boolean */;
            case 'B':
                return 1 /* Byte */;
            case 'S':
                return 2 /* Short */;
            case 'C':
                return 3 /* Char */;
            case 'I':
                return 4 /* Int */;
            case 'F':
                return 5 /* Float */;
            case 'J':
                return 6 /* Long */;
            case 'D':
                return 7 /* Double */;
            case '[':
            case 'L':
                return 8 /* Reference */;
            case 'V':
                return 9 /* Void */;
        }
    }
    J2ME.getSignatureKind = getSignatureKind;
    var TypeDescriptor = (function () {
        function TypeDescriptor(value, kind) {
            this.value = value;
            this.kind = kind;
            release || assert(!TypeDescriptor.canonicalTypeDescriptors[value]);
            TypeDescriptor.canonicalTypeDescriptors[value] = this;
        }
        TypeDescriptor.prototype.toString = function () {
            return this.value;
        };
        TypeDescriptor.getArrayDimensions = function (descriptor) {
            var s = descriptor.toString();
            var dimension = 0;
            while (s.charAt(dimension) === '[') {
                dimension++;
            }
            return dimension;
        };
        TypeDescriptor.getArrayDescriptorForDescriptor = function (descriptor, dimensions) {
            release || assert(dimensions > 0);
            var componentString = descriptor.toString();
            if (TypeDescriptor.getArrayDimensions(descriptor) + dimensions > 255) {
                throw "Array type with more than 255 dimensions";
            }
            for (var i = 0; i !== dimensions; ++i) {
                componentString = "[" + componentString;
            }
            return TypeDescriptor.makeTypeDescriptor(componentString);
        };
        TypeDescriptor.parseTypeDescriptor = function (value, startIndex) {
            switch (value[startIndex]) {
                case 'Z':
                    return AtomicTypeDescriptor.Boolean;
                case 'B':
                    return AtomicTypeDescriptor.Byte;
                case 'C':
                    return AtomicTypeDescriptor.Char;
                case 'D':
                    return AtomicTypeDescriptor.Double;
                case 'F':
                    return AtomicTypeDescriptor.Float;
                case 'I':
                    return AtomicTypeDescriptor.Int;
                case 'J':
                    return AtomicTypeDescriptor.Long;
                case 'S':
                    return AtomicTypeDescriptor.Short;
                case 'V':
                    return AtomicTypeDescriptor.Void;
                case 'L': {
                    // parse a slashified Java class name
                    var endIndex = TypeDescriptor.parseClassName(value, startIndex, startIndex + 1, '/');
                    if (endIndex > startIndex + 1 && endIndex < value.length && value.charAt(endIndex) === ';') {
                        return TypeDescriptor.makeTypeDescriptor(value.substring(startIndex, endIndex + 1));
                    }
                    J2ME.Debug.unexpected();
                }
                case '[': {
                    // compute the number of dimensions
                    var index = startIndex;
                    while (index < value.length && value.charAt(index) === '[') {
                        index++;
                    }
                    var dimensions = index - startIndex;
                    if (dimensions > 255) {
                        throw "array with more than 255 dimensions";
                        ;
                    }
                    var component = TypeDescriptor.parseTypeDescriptor(value, index);
                    return TypeDescriptor.getArrayDescriptorForDescriptor(component, dimensions);
                }
                default:
                    J2ME.Debug.unexpected(value[startIndex]);
            }
        };
        TypeDescriptor.parseClassName = function (value, startIndex, index, separator) {
            var position = index;
            var length = value.length;
            while (position < length) {
                var nextch = value.charAt(position);
                if (nextch === '.' || nextch === '/') {
                    if (separator !== nextch) {
                        return position;
                    }
                }
                else if (nextch === ';' || nextch === '[') {
                    return position;
                }
                position++;
            }
            return position;
        };
        TypeDescriptor.makeTypeDescriptor = function (value) {
            var typeDescriptor = TypeDescriptor.canonicalTypeDescriptors[value];
            if (!typeDescriptor) {
                // creating the type descriptor entry will add it to the canonical mapping.
                typeDescriptor = new TypeDescriptor(value, 8 /* Reference */);
            }
            return typeDescriptor;
        };
        TypeDescriptor.canonicalTypeDescriptors = [];
        return TypeDescriptor;
    })();
    J2ME.TypeDescriptor = TypeDescriptor;
    var AtomicTypeDescriptor = (function (_super) {
        __extends(AtomicTypeDescriptor, _super);
        function AtomicTypeDescriptor(kind) {
            _super.call(this, kindCharacter(kind), kind);
            this.kind = kind;
        }
        AtomicTypeDescriptor.Boolean = new AtomicTypeDescriptor(0 /* Boolean */);
        AtomicTypeDescriptor.Byte = new AtomicTypeDescriptor(1 /* Byte */);
        AtomicTypeDescriptor.Char = new AtomicTypeDescriptor(3 /* Char */);
        AtomicTypeDescriptor.Double = new AtomicTypeDescriptor(7 /* Double */);
        AtomicTypeDescriptor.Float = new AtomicTypeDescriptor(5 /* Float */);
        AtomicTypeDescriptor.Int = new AtomicTypeDescriptor(4 /* Int */);
        AtomicTypeDescriptor.Long = new AtomicTypeDescriptor(6 /* Long */);
        AtomicTypeDescriptor.Short = new AtomicTypeDescriptor(2 /* Short */);
        AtomicTypeDescriptor.Void = new AtomicTypeDescriptor(9 /* Void */);
        return AtomicTypeDescriptor;
    })(TypeDescriptor);
    J2ME.AtomicTypeDescriptor = AtomicTypeDescriptor;
    var SignatureDescriptor = (function () {
        function SignatureDescriptor(value) {
            this.value = value;
            this._argumentSlotCount = -1;
            release || assert(!SignatureDescriptor.canonicalSignatureDescriptors[value]);
            SignatureDescriptor.canonicalSignatureDescriptors[value] = this;
            this.typeDescriptors = SignatureDescriptor.parse(value, 0);
        }
        SignatureDescriptor.prototype.toString = function () {
            return this.value;
        };
        SignatureDescriptor.prototype.hasTwoSlotArguments = function () {
            return this.getArgumentCount() < this.getArgumentSlotCount();
        };
        /**
         * Number of arguments, this may be less than the value returned by |getArgumentSlotCount|.
         */
        SignatureDescriptor.prototype.getArgumentCount = function () {
            return this.typeDescriptors.length - 1;
        };
        /**
         * Number of slots consumed by the arguments.
         */
        SignatureDescriptor.prototype.getArgumentSlotCount = function () {
            if (this._argumentSlotCount < 0) {
                var count = 0;
                for (var i = 1; i < this.typeDescriptors.length; i++) {
                    var typeDescriptor = this.typeDescriptors[i];
                    count += J2ME.isTwoSlot(typeDescriptor.kind) ? 2 : 1;
                }
                this._argumentSlotCount = count;
            }
            return this._argumentSlotCount;
        };
        SignatureDescriptor.makeSignatureDescriptor = function (value) {
            var signatureDescriptor = SignatureDescriptor.canonicalSignatureDescriptors[value];
            if (!signatureDescriptor) {
                // creating the signaature descriptor entry will add it to the canonical mapping.
                signatureDescriptor = new SignatureDescriptor(value);
            }
            return signatureDescriptor;
        };
        SignatureDescriptor.parse = function (value, startIndex) {
            if ((startIndex > value.length - 3) || value.charAt(startIndex) !== '(') {
                throw "Invalid method signature: " + value;
            }
            var typeDescriptors = [];
            typeDescriptors.push(AtomicTypeDescriptor.Void); // placeholder until the return type is parsed
            var i = startIndex + 1;
            while (value.charAt(i) !== ')') {
                var descriptor = TypeDescriptor.parseTypeDescriptor(value, i);
                typeDescriptors.push(descriptor);
                i = i + descriptor.toString().length;
                if (i >= value.length) {
                    throw "Invalid method signature: " + value;
                }
            }
            i++;
            var descriptor = TypeDescriptor.parseTypeDescriptor(value, i);
            if (i + descriptor.toString().length !== value.length) {
                throw "Invalid method signature: " + value;
            }
            // Plug in the return type
            typeDescriptors[0] = descriptor;
            return typeDescriptors;
        };
        SignatureDescriptor.canonicalSignatureDescriptors = [];
        return SignatureDescriptor;
    })();
    J2ME.SignatureDescriptor = SignatureDescriptor;
})(J2ME || (J2ME = {}));
var J2ME;
(function (J2ME) {
    var ClassRegistry = (function () {
        function ClassRegistry() {
            this.sourceDirectories = [];
            this.sourceFiles = Object.create(null);
            this.missingSourceFiles = Object.create(null);
            this.jarFiles = Object.create(null);
            this.classFiles = Object.create(null);
            this.classes = Object.create(null);
            this.preInitializedClasses = [];
        }
        ClassRegistry.prototype.initializeBuiltinClasses = function () {
            // These classes are guaranteed to not have a static initializer.
            J2ME.enterTimeline("initializeBuiltinClasses");
            this.java_lang_Object = this.loadClass("java/lang/Object");
            this.java_lang_Class = this.loadClass("java/lang/Class");
            this.java_lang_String = this.loadClass("java/lang/String");
            this.java_lang_Thread = this.loadClass("java/lang/Thread");
            this.preInitializedClasses.push(this.java_lang_Object);
            this.preInitializedClasses.push(this.java_lang_Class);
            this.preInitializedClasses.push(this.java_lang_String);
            this.preInitializedClasses.push(this.java_lang_Thread);
            /**
             * We force these additinoal frequently used classes to be initialized so that
             * we can generate more optimal AOT code that skips the class initialization
             * check.
             */
            var classNames = [
                "java/lang/Integer",
                "java/lang/Character",
                "java/lang/Math",
                "java/util/HashtableEntry"
            ];
            for (var i = 0; i < classNames.length; i++) {
                this.preInitializedClasses.push(this.loadClass(classNames[i]));
            }
            for (var i = 0; i < "ZCFDBSIJ".length; i++) {
                var typeName = "ZCFDBSIJ"[i];
                J2ME.linkKlass(J2ME.PrimitiveClassInfo[typeName]);
                this.getClass("[" + typeName);
            }
            J2ME.leaveTimeline("initializeBuiltinClasses");
        };
        ClassRegistry.prototype.isPreInitializedClass = function (classInfo) {
            return this.preInitializedClasses.indexOf(classInfo) >= 0;
        };
        ClassRegistry.prototype.addPath = function (name, buffer) {
            if (name.substr(-4) === ".jar") {
                this.jarFiles[name] = new ZipFile(buffer);
            }
            else {
                this.classFiles[name] = buffer;
            }
        };
        ClassRegistry.prototype.addSourceDirectory = function (name) {
            this.sourceDirectories.push(name);
        };
        ClassRegistry.prototype.getSourceLine = function (sourceLocation) {
            if (typeof snarf === "undefined") {
                // Sorry, no snarf in the browser. Do async loading instead.
                return null;
            }
            var source = this.sourceFiles[sourceLocation.className];
            if (!source && !this.missingSourceFiles[sourceLocation.className]) {
                for (var i = 0; i < this.sourceDirectories.length; i++) {
                    try {
                        var path = this.sourceDirectories[i] + "/" + sourceLocation.className + ".java";
                        var file = snarf(path);
                        if (file) {
                            source = this.sourceFiles[sourceLocation.className] = file.split("\n");
                        }
                    }
                    catch (x) {
                    }
                }
            }
            if (source) {
                return source[sourceLocation.lineNumber - 1];
            }
            this.missingSourceFiles[sourceLocation.className] = true;
            return null;
        };
        ClassRegistry.prototype.loadFileFromJar = function (jarName, fileName) {
            var zip = this.jarFiles[jarName];
            if (!zip)
                return null;
            if (!(fileName in zip.directory))
                return null;
            var bytes = zip.read(fileName);
            return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        };
        ClassRegistry.prototype.loadFile = function (fileName) {
            var classFiles = this.classFiles;
            var data = classFiles[fileName];
            if (data) {
                return data;
            }
            var jarFiles = this.jarFiles;
            for (var k in jarFiles) {
                var zip = jarFiles[k];
                if (fileName in zip.directory) {
                    J2ME.enterTimeline("ZIP", { file: fileName });
                    var bytes = zip.read(fileName);
                    data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
                    J2ME.leaveTimeline("ZIP");
                    break;
                }
            }
            if (data) {
                classFiles[fileName] = data;
            }
            return data;
        };
        ClassRegistry.prototype.loadClassBytes = function (bytes) {
            J2ME.enterTimeline("loadClassBytes");
            var classInfo = new J2ME.ClassInfo(bytes);
            J2ME.leaveTimeline("loadClassBytes", { className: classInfo.className });
            this.classes[classInfo.className] = classInfo;
            return classInfo;
        };
        ClassRegistry.prototype.loadClassFile = function (fileName) {
            var bytes = this.loadFile(fileName);
            if (!bytes)
                throw new (J2ME.ClassNotFoundException)(fileName);
            var self = this;
            var classInfo = this.loadClassBytes(bytes);
            if (classInfo.superClassName)
                classInfo.superClass = this.loadClass(classInfo.superClassName);
            var classes = classInfo.classes;
            classes.forEach(function (c, n) {
                classes[n] = self.loadClass(c);
            });
            classInfo.complete();
            if (J2ME.phase === 0 /* Runtime */) {
                J2ME.linkKlass(classInfo);
            }
            return classInfo;
        };
        ClassRegistry.prototype.loadAllClassFiles = function () {
            var jarFiles = this.jarFiles;
            for (var k in jarFiles) {
                var zip = jarFiles[k];
                for (var fileName in zip.directory) {
                    if (fileName.substr(-6) === ".class") {
                        this.loadClassFile(fileName);
                    }
                }
            }
        };
        ClassRegistry.prototype.loadClass = function (className) {
            var classInfo = this.classes[className];
            if (classInfo)
                return classInfo;
            return this.loadClassFile(className + ".class");
        };
        ClassRegistry.prototype.getEntryPoint = function (classInfo) {
            var methods = classInfo.methods;
            for (var i = 0; i < methods.length; i++) {
                var method = methods[i];
                if (method.isPublic && method.isStatic && !method.isNative && method.name === "main" && method.signature === "([Ljava/lang/String;)V") {
                    return method;
                }
            }
        };
        ClassRegistry.prototype.getClass = function (className) {
            var classInfo = this.classes[className];
            if (!classInfo) {
                if (className[0] === "[") {
                    classInfo = this.createArrayClass(className);
                }
                else {
                    classInfo = this.loadClass(className);
                }
                if (!classInfo)
                    return null;
            }
            return classInfo;
        };
        ClassRegistry.prototype.createArrayClass = function (typeName) {
            var elementType = typeName.substr(1);
            var constructor = J2ME.getArrayConstructor(elementType);
            var classInfo;
            if (constructor) {
                classInfo = J2ME.PrimitiveArrayClassInfo[elementType];
            }
            else {
                if (elementType[0] === "L") {
                    elementType = elementType.substr(1).replace(";", "");
                }
                classInfo = new J2ME.ArrayClassInfo(typeName, this.getClass(elementType));
            }
            if (J2ME.phase === 0 /* Runtime */) {
                J2ME.linkKlass(classInfo);
            }
            return this.classes[typeName] = classInfo;
        };
        ClassRegistry.prototype.getField = function (classInfo, fieldKey) {
            if (classInfo.vfc[fieldKey]) {
                return classInfo.vfc[fieldKey];
            }
            do {
                var fields = classInfo.fields;
                for (var i = 0; i < fields.length; ++i) {
                    var field = fields[i];
                    if (!field.key) {
                        field.key = (J2ME.AccessFlags.isStatic(field.access_flags) ? "S" : "I") + "." + field.name + "." + field.signature;
                    }
                    if (field.key === fieldKey) {
                        return classInfo.vfc[fieldKey] = field;
                    }
                }
                if (fieldKey[0] === 'S') {
                    for (var n = 0; n < classInfo.interfaces.length; ++n) {
                        var field = this.getField(classInfo.interfaces[n], fieldKey);
                        if (field) {
                            return classInfo.vfc[fieldKey] = field;
                        }
                    }
                }
                classInfo = classInfo.superClass;
            } while (classInfo);
        };
        ClassRegistry.prototype.getMethod = function (classInfo, methodKey) {
            var c = classInfo;
            do {
                var methods = c.methods;
                for (var i = 0; i < methods.length; ++i) {
                    var method = methods[i];
                    if (method.key === methodKey) {
                        return classInfo.vmc[methodKey] = method;
                    }
                }
                c = c.superClass;
            } while (c);
            if (J2ME.AccessFlags.isInterface(classInfo.access_flags)) {
                for (var n = 0; n < classInfo.interfaces.length; ++n) {
                    var method = this.getMethod(classInfo.interfaces[n], methodKey);
                    if (method) {
                        return classInfo.vmc[methodKey] = method;
                    }
                }
            }
        };
        return ClassRegistry;
    })();
    J2ME.ClassRegistry = ClassRegistry;
    J2ME.ClassNotFoundException = function (message) {
        this.message = message;
    };
    J2ME.ClassNotFoundException.prototype = Object.create(Error.prototype);
    J2ME.ClassNotFoundException.prototype.name = "ClassNotFoundException";
    J2ME.ClassNotFoundException.prototype.constructor = J2ME.ClassNotFoundException;
})(J2ME || (J2ME = {}));
var J2ME;
(function (J2ME) {
    J2ME.CLASSES = new J2ME.ClassRegistry();
    var JVM = (function () {
        function JVM() {
            // ...
        }
        JVM.prototype.startIsolate0 = function (className, args) {
            var runtime = new J2ME.Runtime(this);
            var ctx = new J2ME.Context(runtime);
            ctx.setAsCurrentContext();
            var isolateClassInfo = J2ME.CLASSES.getClass("com/sun/cldc/isolate/Isolate");
            var isolate = J2ME.newObject(isolateClassInfo.klass);
            isolate.id = util.id();
            var array = J2ME.newStringArray(args.length);
            for (var n = 0; n < args.length; ++n)
                array[n] = args[n] ? J2ME.newString(args[n]) : null;
            ctx.executeNewFrameSet([
                new J2ME.Frame(J2ME.CLASSES.getMethod(isolateClassInfo, "I.<init>.(Ljava/lang/String;[Ljava/lang/String;)V"), [isolate, J2ME.newString(className.replace(/\./g, "/")), array], 0)
            ]);
            ctx.start(new J2ME.Frame(J2ME.CLASSES.getMethod(isolateClassInfo, "I.start.()V"), [isolate], 0));
        };
        JVM.prototype.startIsolate = function (isolate) {
            var mainClass = util.fromJavaString(isolate.klass.classInfo.getField("I._mainClass.Ljava/lang/String;").get(isolate)).replace(/\./g, "/");
            var mainArgs = isolate.klass.classInfo.getField("I._mainArgs.[Ljava/lang/String;").get(isolate);
            var runtime = new J2ME.Runtime(this);
            var ctx = new J2ME.Context(runtime);
            isolate.runtime = runtime;
            runtime.isolate = isolate;
            runtime.updateStatus(2 /* Started */);
            var classInfo = J2ME.CLASSES.getClass(mainClass);
            if (!classInfo)
                throw new Error("Could not find or load main class " + mainClass);
            var entryPoint = J2ME.CLASSES.getEntryPoint(classInfo);
            if (!entryPoint)
                throw new Error("Could not find main method in class " + mainClass);
            ctx.thread = runtime.mainThread = util.newObject(J2ME.CLASSES.java_lang_Thread);
            ctx.thread.pid = util.id();
            ctx.thread.alive = true;
            var oldCtx = $.ctx;
            ctx.setAsCurrentContext();
            ctx.executeNewFrameSet([new J2ME.Frame(J2ME.CLASSES.getMethod(J2ME.CLASSES.java_lang_Thread, "I.<init>.(Ljava/lang/String;)V"), [runtime.mainThread, J2ME.newString("main")], 0)]);
            oldCtx.setAsCurrentContext();
            var args = J2ME.newStringArray(mainArgs.length);
            for (var n = 0; n < mainArgs.length; ++n) {
                args[n] = mainArgs[n];
            }
            ctx.start(new J2ME.Frame(entryPoint, [args], 0));
        };
        return JVM;
    })();
    J2ME.JVM = JVM;
})(J2ME || (J2ME = {}));
Object.defineProperty(jsGlobal, "CLASSES", {
    get: function () {
        return J2ME.CLASSES;
    }
});
var JVM = J2ME.JVM;
var J2ME;
(function (J2ME) {
    var SourceLocation = (function () {
        function SourceLocation(className, sourceFile, lineNumber) {
            this.className = className;
            this.sourceFile = sourceFile;
            this.lineNumber = lineNumber;
            // ...
        }
        SourceLocation.prototype.toString = function () {
            return this.sourceFile + ":" + this.lineNumber;
        };
        SourceLocation.prototype.equals = function (other) {
            if (!other) {
                return false;
            }
            return this.sourceFile === other.sourceFile && this.lineNumber === other.lineNumber;
        };
        return SourceLocation;
    })();
    J2ME.SourceLocation = SourceLocation;
    var FieldInfo = (function () {
        function FieldInfo(classInfo, access_flags, name, signature) {
            this.classInfo = classInfo;
            this.access_flags = access_flags;
            this.name = name;
            this.signature = signature;
            this.id = FieldInfo._nextiId++;
            this.isStatic = J2ME.AccessFlags.isStatic(access_flags);
            this.constantValue = undefined;
            this.mangledName = undefined;
            this.key = undefined;
            this.kind = J2ME.getSignatureKind(signature);
        }
        FieldInfo.prototype.get = function (object) {
            return object[this.mangledName];
        };
        FieldInfo.prototype.set = function (object, value) {
            object[this.mangledName] = value;
        };
        FieldInfo.prototype.getStatic = function () {
            return this.get(this.classInfo.getStaticObject($.ctx));
        };
        FieldInfo.prototype.setStatic = function (value) {
            return this.set(this.classInfo.getStaticObject($.ctx), value);
        };
        FieldInfo.prototype.toString = function () {
            return "[field " + this.name + "]";
        };
        FieldInfo._nextiId = 0;
        return FieldInfo;
    })();
    J2ME.FieldInfo = FieldInfo;
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
    var MethodInfo = (function () {
        function MethodInfo(opts) {
            this.name = opts.name;
            this.signature = opts.signature;
            this.classInfo = opts.classInfo;
            this.attributes = opts.attributes || [];
            // Use code if provided, otherwise search for the code within attributes.
            if (opts.code) {
                this.code = opts.code;
                this.exception_table = [];
                this.max_locals = undefined; // Unused for now.
            }
            else {
                for (var i = 0; i < this.attributes.length; i++) {
                    var a = this.attributes[i];
                    if (a.info.type === J2ME.ATTRIBUTE_TYPES.Code) {
                        this.code = new Uint8Array(a.info.code);
                        this.exception_table = a.info.exception_table;
                        this.max_locals = a.info.max_locals;
                        this.max_stack = a.info.max_stack;
                        var codeAttributes = a.info.attributes;
                        for (var j = 0; j < codeAttributes.length; j++) {
                            var b = codeAttributes[j];
                            if (b.info.type === J2ME.ATTRIBUTE_TYPES.LineNumberTable) {
                                this.line_number_table = b.info.line_number_table;
                            }
                        }
                        break;
                    }
                }
            }
            this.isNative = opts.isNative;
            this.isPublic = opts.isPublic;
            this.isStatic = opts.isStatic;
            this.isSynchronized = opts.isSynchronized;
            this.key = (this.isStatic ? "S." : "I.") + this.name + "." + this.signature;
            this.implKey = this.classInfo.className + "." + this.name + "." + this.signature;
            this.mangledName = J2ME.mangleMethod(this);
            this.mangledClassAndMethodName = J2ME.mangleClassAndMethod(this);
            this.signatureDescriptor = J2ME.SignatureDescriptor.makeSignatureDescriptor(this.signature);
            this.hasTwoSlotArguments = this.signatureDescriptor.hasTwoSlotArguments();
            this.argumentSlots = this.signatureDescriptor.getArgumentSlotCount();
            this.opCount = 0;
            this.isOptimized = false;
        }
        MethodInfo.prototype.getReturnKind = function () {
            return this.signatureDescriptor.typeDescriptors[0].kind;
        };
        MethodInfo.prototype.getSourceLocationForPC = function (pc) {
            var sourceFile = this.classInfo.sourceFile || null;
            if (!sourceFile) {
                return null;
            }
            var lineNumber = -1;
            if (this.line_number_table && this.line_number_table.length) {
                var table = this.line_number_table;
                for (var i = 0; i < table.length; i++) {
                    if (pc >= table[i].start_pc) {
                        lineNumber = table[i].line_number;
                    }
                    else if (pc < table[i].start_pc) {
                        break;
                    }
                }
            }
            return new SourceLocation(this.classInfo.className, sourceFile, lineNumber);
        };
        return MethodInfo;
    })();
    J2ME.MethodInfo = MethodInfo;
    var ClassInfo = (function () {
        function ClassInfo(classBytes) {
            J2ME.enterTimeline("getClassImage");
            var classImage = J2ME.getClassImage(classBytes);
            J2ME.leaveTimeline("getClassImage");
            var cp = classImage.constant_pool;
            this.className = cp[cp[classImage.this_class].name_index].bytes;
            this.superClassName = classImage.super_class ? cp[cp[classImage.super_class].name_index].bytes : null;
            this.access_flags = classImage.access_flags;
            this.constant_pool = cp;
            // Cache for virtual methods and fields
            this.vmc = {};
            this.vfc = {};
            this.mangledName = J2ME.mangleClass(this);
            var self = this;
            this.interfaces = [];
            for (var i = 0; i < classImage.interfaces.length; i++) {
                var j = classImage.interfaces[i];
                var int = J2ME.CLASSES.loadClass(cp[cp[j].name_index].bytes);
                self.interfaces.push(int);
                self.interfaces = self.interfaces.concat(int.interfaces);
            }
            this.fields = [];
            for (var i = 0; i < classImage.fields.length; i++) {
                var f = classImage.fields[i];
                var field = new FieldInfo(self, f.access_flags, cp[f.name_index].bytes, cp[f.descriptor_index].bytes);
                f.attributes.forEach(function (attribute) {
                    if (cp[attribute.attribute_name_index].bytes === "ConstantValue")
                        field.constantValue = new DataView(attribute.info).getUint16(0, false);
                });
                self.fields.push(field);
            }
            J2ME.enterTimeline("methods");
            this.methods = [];
            for (var i = 0; i < classImage.methods.length; i++) {
                var m = classImage.methods[i];
                this.methods.push(new MethodInfo({
                    name: cp[m.name_index].bytes,
                    signature: cp[m.signature_index].bytes,
                    classInfo: self,
                    attributes: m.attributes,
                    isNative: J2ME.AccessFlags.isNative(m.access_flags),
                    isPublic: J2ME.AccessFlags.isPublic(m.access_flags),
                    isStatic: J2ME.AccessFlags.isStatic(m.access_flags),
                    isSynchronized: J2ME.AccessFlags.isSynchronized(m.access_flags)
                }));
            }
            J2ME.leaveTimeline("methods");
            var classes = this.classes = [];
            for (var i = 0; i < classImage.attributes.length; i++) {
                var a = classImage.attributes[i];
                if (a.info.type === J2ME.ATTRIBUTE_TYPES.InnerClasses) {
                    a.info.classes.forEach(function (c) {
                        classes.push(cp[cp[c.inner_class_info_index].name_index].bytes);
                        if (c.outer_class_info_index)
                            classes.push(cp[cp[c.outer_class_info_index].name_index].bytes);
                    });
                }
                else if (a.info.type === J2ME.ATTRIBUTE_TYPES.SourceFile) {
                    self.sourceFile = cp[a.info.sourcefile_index].bytes;
                }
            }
        }
        ClassInfo.prototype.complete = function () {
            J2ME.enterTimeline("mangleFields");
            this._mangleFields();
            J2ME.leaveTimeline("mangleFields");
        };
        /**
         * Gets the class hierarchy in derived -> base order.
         */
        ClassInfo.prototype._getClassHierarchy = function () {
            var classHierarchy = [];
            var classInfo = this;
            do {
                classHierarchy.push(classInfo);
                classInfo = classInfo.superClass;
            } while (classInfo);
            return classHierarchy;
        };
        ClassInfo.prototype._mangleFields = function () {
            if (false) {
                // Safe mangling that includes className, fieldName and signature.
                var fields = this.fields;
                for (var j = 0; j < fields.length; j++) {
                    var fieldInfo = fields[j];
                    fieldInfo.mangledName = "$" + J2ME.escapeString(fieldInfo.classInfo.className + "_" + fieldInfo.name + "_" + fieldInfo.signature);
                }
                return;
            }
            // Keep track of how many times a field name was used and resolve conflicts by
            // prefixing filed names with numbers.
            var classInfo;
            var classHierarchy = this._getClassHierarchy();
            var count = Object.create(null);
            for (var i = classHierarchy.length - 1; i >= 0; i--) {
                classInfo = classHierarchy[i];
                var fields = classInfo.fields;
                for (var j = 0; j < fields.length; j++) {
                    var field = fields[j];
                    var fieldName = field.name;
                    if (count[field.name] === undefined) {
                        count[fieldName] = 0;
                    }
                    var fieldCount = count[fieldName];
                    // Only mangle this classInfo's fields.
                    if (i === 0) {
                        field.mangledName = "$" + (fieldCount ? "$" + fieldCount : "") + field.name;
                    }
                    count[fieldName]++;
                }
            }
        };
        Object.defineProperty(ClassInfo.prototype, "isInterface", {
            get: function () {
                return J2ME.AccessFlags.isInterface(this.access_flags);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClassInfo.prototype, "isFinal", {
            get: function () {
                return J2ME.AccessFlags.isFinal(this.access_flags);
            },
            enumerable: true,
            configurable: true
        });
        ClassInfo.prototype.implementsInterface = function (iface) {
            var classInfo = this;
            do {
                var interfaces = classInfo.interfaces;
                for (var n = 0; n < interfaces.length; ++n) {
                    if (interfaces[n] === iface)
                        return true;
                }
                classInfo = classInfo.superClass;
            } while (classInfo);
            return false;
        };
        ClassInfo.prototype.isAssignableTo = function (toClass) {
            if (this === toClass || toClass === J2ME.CLASSES.java_lang_Object)
                return true;
            if (J2ME.AccessFlags.isInterface(toClass.access_flags) && this.implementsInterface(toClass))
                return true;
            if (this.elementClass && toClass.elementClass)
                return this.elementClass.isAssignableTo(toClass.elementClass);
            return this.superClass ? this.superClass.isAssignableTo(toClass) : false;
        };
        /**
         * java.lang.Class object for this class info. This is a not where static properties
         * are stored for this class.
         */
        ClassInfo.prototype.getClassObject = function (ctx) {
            return J2ME.getRuntimeKlass(ctx.runtime, this.klass).classObject;
        };
        /**
         * Object that holds static properties for this class.
         */
        ClassInfo.prototype.getStaticObject = function (ctx) {
            return J2ME.getRuntimeKlass(ctx.runtime, this.klass);
        };
        ClassInfo.prototype.getField = function (fieldKey) {
            return J2ME.CLASSES.getField(this, fieldKey);
        };
        ClassInfo.prototype.getClassInitLockObject = function (ctx) {
            if (!(this.className in ctx.runtime.classInitLockObjects)) {
                ctx.runtime.classInitLockObjects[this.className] = {
                    classInfo: this
                };
            }
            return ctx.runtime.classInitLockObjects[this.className];
        };
        ClassInfo.prototype.toString = function () {
            return "[class " + this.className + "]";
        };
        return ClassInfo;
    })();
    J2ME.ClassInfo = ClassInfo;
    var ArrayClassInfo = (function (_super) {
        __extends(ArrayClassInfo, _super);
        function ArrayClassInfo(className, elementClass) {
            false && _super.call(this, null);
            this.className = className;
            // TODO this may need to change for compiled code.
            this.mangledName = className;
            this.superClass = J2ME.CLASSES.java_lang_Object;
            this.superClassName = "java/lang/Object";
            this.access_flags = 0;
            this.elementClass = elementClass;
            this.vmc = {};
            this.vfc = {};
        }
        ArrayClassInfo.prototype.implementsInterface = function (iface) {
            return false;
        };
        return ArrayClassInfo;
    })(ClassInfo);
    J2ME.ArrayClassInfo = ArrayClassInfo;
    ArrayClassInfo.prototype.fields = [];
    ArrayClassInfo.prototype.methods = [];
    ArrayClassInfo.prototype.interfaces = [];
    ArrayClassInfo.prototype.isArrayClass = true;
    var PrimitiveClassInfo = (function (_super) {
        __extends(PrimitiveClassInfo, _super);
        function PrimitiveClassInfo(className, mangledName) {
            false && _super.call(this, null);
            this.className = className;
            this.mangledName = mangledName;
        }
        PrimitiveClassInfo.Z = new PrimitiveClassInfo("Z", "boolean");
        PrimitiveClassInfo.C = new PrimitiveClassInfo("C", "char");
        PrimitiveClassInfo.F = new PrimitiveClassInfo("F", "float");
        PrimitiveClassInfo.D = new PrimitiveClassInfo("D", "double");
        PrimitiveClassInfo.B = new PrimitiveClassInfo("B", "byte");
        PrimitiveClassInfo.S = new PrimitiveClassInfo("S", "short");
        PrimitiveClassInfo.I = new PrimitiveClassInfo("I", "int");
        PrimitiveClassInfo.J = new PrimitiveClassInfo("J", "long");
        return PrimitiveClassInfo;
    })(ClassInfo);
    J2ME.PrimitiveClassInfo = PrimitiveClassInfo;
    PrimitiveClassInfo.prototype.fields = [];
    PrimitiveClassInfo.prototype.methods = [];
    PrimitiveClassInfo.prototype.interfaces = [];
    var PrimitiveArrayClassInfo = (function (_super) {
        __extends(PrimitiveArrayClassInfo, _super);
        function PrimitiveArrayClassInfo(className, elementClass) {
            _super.call(this, className, elementClass);
        }
        Object.defineProperty(PrimitiveArrayClassInfo.prototype, "superClass", {
            get: function () {
                return J2ME.CLASSES.java_lang_Object;
            },
            enumerable: true,
            configurable: true
        });
        PrimitiveArrayClassInfo.Z = new PrimitiveArrayClassInfo("[Z", PrimitiveClassInfo.Z);
        PrimitiveArrayClassInfo.C = new PrimitiveArrayClassInfo("[C", PrimitiveClassInfo.C);
        PrimitiveArrayClassInfo.F = new PrimitiveArrayClassInfo("[F", PrimitiveClassInfo.F);
        PrimitiveArrayClassInfo.D = new PrimitiveArrayClassInfo("[D", PrimitiveClassInfo.D);
        PrimitiveArrayClassInfo.B = new PrimitiveArrayClassInfo("[B", PrimitiveClassInfo.B);
        PrimitiveArrayClassInfo.S = new PrimitiveArrayClassInfo("[S", PrimitiveClassInfo.S);
        PrimitiveArrayClassInfo.I = new PrimitiveArrayClassInfo("[I", PrimitiveClassInfo.I);
        PrimitiveArrayClassInfo.J = new PrimitiveArrayClassInfo("[J", PrimitiveClassInfo.J);
        return PrimitiveArrayClassInfo;
    })(ArrayClassInfo);
    J2ME.PrimitiveArrayClassInfo = PrimitiveArrayClassInfo;
    PrimitiveClassInfo.prototype.fields = [];
    PrimitiveClassInfo.prototype.methods = [];
    PrimitiveClassInfo.prototype.interfaces = [];
})(J2ME || (J2ME = {}));
var FieldInfo = J2ME.FieldInfo;
var MethodInfo = J2ME.MethodInfo;
var ClassInfo = J2ME.ClassInfo;
var J2ME;
(function (J2ME) {
    J2ME.Bindings = {
        "java/lang/Object": {
            native: {
                "hashCode.()I": function () {
                    var self = this;
                    if (self._hashCode) {
                        return self._hashCode;
                    }
                    return self._hashCode = $.nextHashCode();
                }
            }
        }
    };
})(J2ME || (J2ME = {}));
var $; // The currently-executing runtime.
var J2ME;
(function (J2ME) {
    J2ME.traceWriter = null;
    J2ME.linkWriter = null;
    J2ME.initWriter = null;
    J2ME.timeline;
    J2ME.methodTimeline;
    J2ME.nativeCounter = new J2ME.Metrics.Counter(true);
    J2ME.runtimeCounter = new J2ME.Metrics.Counter(true);
    J2ME.jitMethodInfos = {};
    if (false && typeof Shumway !== "undefined") {
        J2ME.timeline = new Shumway.Tools.Profiler.TimelineBuffer("Runtime");
        J2ME.methodTimeline = new Shumway.Tools.Profiler.TimelineBuffer("Methods");
    }
    function enterTimeline(name, data) {
        J2ME.timeline && J2ME.timeline.enter(name, data);
    }
    J2ME.enterTimeline = enterTimeline;
    function leaveTimeline(name, data) {
        J2ME.timeline && J2ME.timeline.leave(name, data);
    }
    J2ME.leaveTimeline = leaveTimeline;
    J2ME.Klasses = {
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
    function Int64Array(size) {
        var array = Array(size);
        for (var i = 0; i < size; i++) {
            array[i] = Long.ZERO;
        }
        // We can't put the klass on the prototype.
        array.klass = J2ME.Klasses.long;
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
    function getArrayConstructor(type) {
        return arrays[type];
    }
    J2ME.getArrayConstructor = getArrayConstructor;
    /**
     * We can't always mutate the |__proto__|.
     */
    function isPrototypeOfFunctionMutable(fn) {
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
    J2ME.stdoutWriter = new J2ME.IndentingWriter();
    J2ME.stderrWriter = new J2ME.IndentingWriter(false, J2ME.IndentingWriter.stderr);
    (function (ExecutionPhase) {
        /**
         * Default runtime behaviour.
         */
        ExecutionPhase[ExecutionPhase["Runtime"] = 0] = "Runtime";
        /**
         * When compiling code statically.
         */
        ExecutionPhase[ExecutionPhase["Compiler"] = 1] = "Compiler";
    })(J2ME.ExecutionPhase || (J2ME.ExecutionPhase = {}));
    var ExecutionPhase = J2ME.ExecutionPhase;
    J2ME.phase = 0 /* Runtime */;
    J2ME.internedStrings = new Map();
    var assert = J2ME.Debug.assert;
    (function (RuntimeStatus) {
        RuntimeStatus[RuntimeStatus["New"] = 1] = "New";
        RuntimeStatus[RuntimeStatus["Started"] = 2] = "Started";
        RuntimeStatus[RuntimeStatus["Stopping"] = 3] = "Stopping";
        RuntimeStatus[RuntimeStatus["Stopped"] = 4] = "Stopped";
    })(J2ME.RuntimeStatus || (J2ME.RuntimeStatus = {}));
    var RuntimeStatus = J2ME.RuntimeStatus;
    (function (MethodType) {
        MethodType[MethodType["Interpreted"] = 0] = "Interpreted";
        MethodType[MethodType["Native"] = 1] = "Native";
        MethodType[MethodType["Compiled"] = 2] = "Compiled";
    })(J2ME.MethodType || (J2ME.MethodType = {}));
    var MethodType = J2ME.MethodType;
    var hashArray = new Int32Array(1024);
    function hashString(s) {
        if (hashArray.length < s.length) {
            hashArray = new Int32Array((hashArray.length * 2 / 3) | 0);
        }
        var data = hashArray;
        for (var i = 0; i < s.length; i++) {
            data[i] = s.charCodeAt(i);
        }
        return J2ME.HashUtilities.hashBytesTo32BitsAdler(data, 0, s.length);
    }
    var friendlyMangledNames = true;
    function isIdentifierChar(c) {
        return (c >= 97 && c <= 122) || (c >= 65 && c <= 90) || (c === 36) || (c === 95); // $ && _
    }
    function isDigit(c) {
        return c >= 48 && c <= 57;
    }
    var invalidChars = "[];/<>()";
    var replaceChars = "abc_defg";
    function needsEscaping(s) {
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
    function escapeString(s) {
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
            }
            else if (c < 128) {
                r[i] = map[c];
            }
            else {
                r[i] = s[i];
            }
        }
        return r.join("");
    }
    J2ME.escapeString = escapeString;
    var stringHashes = Object.create(null);
    var stringHasheCount = 0;
    function hashStringToString(s) {
        if (stringHasheCount > 1024) {
            return J2ME.StringUtilities.variableLengthEncodeInt32(hashString(s));
        }
        var c = stringHashes[s];
        if (c) {
            return c;
        }
        c = stringHashes[s] = J2ME.StringUtilities.variableLengthEncodeInt32(hashString(s));
        stringHasheCount++;
        return c;
    }
    J2ME.hashStringToString = hashStringToString;
    function mangleClassAndMethod(methodInfo) {
        var name = methodInfo.classInfo.className + "_" + methodInfo.name + "_" + hashStringToString(methodInfo.signature);
        if (friendlyMangledNames) {
            return escapeString(name);
        }
        var hash = hashString(name);
        return J2ME.StringUtilities.variableLengthEncodeInt32(hash);
    }
    J2ME.mangleClassAndMethod = mangleClassAndMethod;
    function mangleMethod(methodInfo) {
        var name = methodInfo.name + "_" + hashStringToString(methodInfo.signature);
        if (friendlyMangledNames) {
            return escapeString(name);
        }
        var hash = hashString(name);
        return J2ME.StringUtilities.variableLengthEncodeInt32(hash);
    }
    J2ME.mangleMethod = mangleMethod;
    function mangleClass(classInfo) {
        if (classInfo instanceof J2ME.PrimitiveArrayClassInfo) {
            switch (classInfo) {
                case J2ME.PrimitiveArrayClassInfo.Z: return "Uint8Array";
                case J2ME.PrimitiveArrayClassInfo.C: return "Uint16Array";
                case J2ME.PrimitiveArrayClassInfo.F: return "Float32Array";
                case J2ME.PrimitiveArrayClassInfo.D: return "Float64Array";
                case J2ME.PrimitiveArrayClassInfo.B: return "Int8Array";
                case J2ME.PrimitiveArrayClassInfo.S: return "Int16Array";
                case J2ME.PrimitiveArrayClassInfo.I: return "Int32Array";
                case J2ME.PrimitiveArrayClassInfo.J: return "Int64Array";
            }
        }
        else if (classInfo.isArrayClass) {
            return "$AK(" + mangleClass(classInfo.elementClass) + ")";
        }
        else {
            if (friendlyMangledNames) {
                return "$" + escapeString(classInfo.className);
            }
            var hash = hashString(classInfo.className);
            return "$" + J2ME.StringUtilities.variableLengthEncodeInt32(hash);
        }
    }
    J2ME.mangleClass = mangleClass;
    /**
     * This class is abstract and should never be initialized. It only acts as a template for
     * actual runtime objects.
     */
    var RuntimeTemplate = (function () {
        function RuntimeTemplate(jvm) {
            this.jvm = jvm;
            this.status = 1 /* New */;
            this.waiting = [];
            this.threadCount = 0;
            this.initialized = {};
            this.pending = {};
            this.staticFields = {};
            this.classObjects = {};
            this.ctx = null;
            this.classInitLockObjects = {};
            this._runtimeId = RuntimeTemplate._nextRuntimeId++;
            this._nextHashCode = this._runtimeId << 24;
        }
        /**
         * Generates a new hash code for the specified |object|.
         */
        RuntimeTemplate.prototype.nextHashCode = function () {
            return this._nextHashCode++;
        };
        RuntimeTemplate.prototype.waitStatus = function (callback) {
            this.waiting.push(callback);
        };
        RuntimeTemplate.prototype.updateStatus = function (status) {
            this.status = status;
            var waiting = this.waiting;
            this.waiting = [];
            waiting.forEach(function (callback) {
                try {
                    callback();
                }
                catch (ex) {
                }
            });
        };
        RuntimeTemplate.prototype.addContext = function (ctx) {
            ++this.threadCount;
            RuntimeTemplate.all.add(this);
        };
        RuntimeTemplate.prototype.removeContext = function (ctx) {
            if (!--this.threadCount) {
                RuntimeTemplate.all.delete(this);
                this.updateStatus(4 /* Stopped */);
            }
        };
        RuntimeTemplate.prototype.newStringConstant = function (s) {
            if (J2ME.internedStrings.has(s)) {
                return J2ME.internedStrings.get(s);
            }
            var obj = J2ME.newString(s);
            J2ME.internedStrings.set(s, obj);
            return obj;
        };
        RuntimeTemplate.prototype.setStatic = function (field, value) {
            this.staticFields[field.id] = value;
        };
        RuntimeTemplate.prototype.getStatic = function (field) {
            return this.staticFields[field.id];
        };
        RuntimeTemplate.prototype.newIOException = function (str) {
            return $.ctx.createException("java/io/IOException", str);
        };
        RuntimeTemplate.prototype.newUnsupportedEncodingException = function (str) {
            return $.ctx.createException("java/io/UnsupportedEncodingException", str);
        };
        RuntimeTemplate.prototype.newUTFDataFormatException = function (str) {
            return $.ctx.createException("java/io/UTFDataFormatException", str);
        };
        RuntimeTemplate.prototype.newSecurityException = function (str) {
            return $.ctx.createException("java/lang/SecurityException", str);
        };
        RuntimeTemplate.prototype.newIllegalThreadStateException = function (str) {
            return $.ctx.createException("java/lang/IllegalThreadStateException", str);
        };
        RuntimeTemplate.prototype.newRuntimeException = function (str) {
            return $.ctx.createException("java/lang/RuntimeException", str);
        };
        RuntimeTemplate.prototype.newIndexOutOfBoundsException = function (str) {
            return $.ctx.createException("java/lang/IndexOutOfBoundsException", str);
        };
        RuntimeTemplate.prototype.newArrayIndexOutOfBoundsException = function (str) {
            return $.ctx.createException("java/lang/ArrayIndexOutOfBoundsException", str);
        };
        RuntimeTemplate.prototype.newStringIndexOutOfBoundsException = function (str) {
            return $.ctx.createException("java/lang/StringIndexOutOfBoundsException", str);
        };
        RuntimeTemplate.prototype.newArrayStoreException = function (str) {
            return $.ctx.createException("java/lang/ArrayStoreException", str);
        };
        RuntimeTemplate.prototype.newIllegalMonitorStateException = function (str) {
            return $.ctx.createException("java/lang/IllegalMonitorStateException", str);
        };
        RuntimeTemplate.prototype.newClassCastException = function (str) {
            return $.ctx.createException("java/lang/ClassCastException", str);
        };
        RuntimeTemplate.prototype.newArithmeticException = function (str) {
            return $.ctx.createException("java/lang/ArithmeticException", str);
        };
        RuntimeTemplate.prototype.newClassNotFoundException = function (str) {
            return $.ctx.createException("java/lang/ClassNotFoundException", str);
        };
        RuntimeTemplate.prototype.newIllegalArgumentException = function (str) {
            return $.ctx.createException("java/lang/IllegalArgumentException", str);
        };
        RuntimeTemplate.prototype.newIllegalStateException = function (str) {
            return $.ctx.createException("java/lang/IllegalStateException", str);
        };
        RuntimeTemplate.prototype.newNegativeArraySizeException = function (str) {
            return $.ctx.createException("java/lang/NegativeArraySizeException", str);
        };
        RuntimeTemplate.prototype.newNullPointerException = function (str) {
            return $.ctx.createException("java/lang/NullPointerException", str);
        };
        RuntimeTemplate.prototype.newMediaException = function (str) {
            return $.ctx.createException("javax/microedition/media/MediaException", str);
        };
        RuntimeTemplate.prototype.newException = function (str) {
            return $.ctx.createException("java/lang/Exception", str);
        };
        RuntimeTemplate.all = new Set();
        RuntimeTemplate._nextRuntimeId = 0;
        return RuntimeTemplate;
    })();
    J2ME.RuntimeTemplate = RuntimeTemplate;
    (function (VMState) {
        VMState[VMState["Running"] = 0] = "Running";
        VMState[VMState["Yielding"] = 1] = "Yielding";
        VMState[VMState["Pausing"] = 2] = "Pausing";
    })(J2ME.VMState || (J2ME.VMState = {}));
    var VMState = J2ME.VMState;
    var Runtime = (function (_super) {
        __extends(Runtime, _super);
        function Runtime(jvm) {
            _super.call(this, jvm);
            this.id = Runtime._nextId++;
        }
        /**
         * Bailout callback whenever a JIT frame is unwound.
         */
        Runtime.prototype.B = function (bci, local, stack) {
            var methodInfo = J2ME.jitMethodInfos[arguments.callee.caller.name];
            release || assert(methodInfo !== undefined);
            $.ctx.bailout(methodInfo, bci, local, stack);
        };
        Runtime.prototype.yield = function () {
            U = 1 /* Yielding */;
        };
        Runtime.prototype.pause = function () {
            U = 2 /* Pausing */;
        };
        Runtime._nextId = 0;
        return Runtime;
    })(RuntimeTemplate);
    J2ME.Runtime = Runtime;
    var Class = (function () {
        function Class(klass) {
            this.klass = klass;
            // ...
        }
        return Class;
    })();
    J2ME.Class = Class;
    var RuntimeKlass = (function () {
        /**
         * Whether this class is a runtime class.
         */
        // isRuntimeKlass: boolean;
        function RuntimeKlass(templateKlass) {
            this.templateKlass = templateKlass;
        }
        return RuntimeKlass;
    })();
    J2ME.RuntimeKlass = RuntimeKlass;
    var Lock = (function () {
        function Lock(thread, level) {
            this.thread = thread;
            this.level = level;
            // ...
        }
        return Lock;
    })();
    J2ME.Lock = Lock;
    function initializeClassObject(runtimeKlass) {
        J2ME.linkWriter && J2ME.linkWriter.writeLn("Initializing Class Object For: " + runtimeKlass.templateKlass);
        release || assert(!runtimeKlass.classObject);
        runtimeKlass.classObject = new J2ME.Klasses.java.lang.Class();
        runtimeKlass.classObject.runtimeKlass = runtimeKlass;
        var fields = runtimeKlass.templateKlass.classInfo.fields;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (field.isStatic) {
                var kind = J2ME.TypeDescriptor.makeTypeDescriptor(field.signature).kind;
                var defaultValue;
                switch (kind) {
                    case 8 /* Reference */:
                        defaultValue = null;
                        break;
                    case 6 /* Long */:
                        defaultValue = Long.ZERO;
                        break;
                    default:
                        defaultValue = 0;
                        break;
                }
                field.set(runtimeKlass, defaultValue);
            }
        }
    }
    /**
     * Registers the klass as a getter on the runtime template. On first access, the getter creates a runtime klass and
     * adds it to the runtime.
     */
    function registerKlass(klass, classInfo) {
        J2ME.linkWriter && J2ME.linkWriter.writeLn("Registering Klass: " + classInfo.className);
        Object.defineProperty(RuntimeTemplate.prototype, classInfo.mangledName, {
            configurable: true,
            get: function () {
                J2ME.linkWriter && J2ME.linkWriter.writeLn("Creating Runtime Klass: " + classInfo.className);
                release || assert(!(klass instanceof RuntimeKlass));
                var runtimeKlass = new RuntimeKlass(klass);
                initializeClassObject(runtimeKlass);
                Object.defineProperty(this, classInfo.mangledName, {
                    value: runtimeKlass
                });
                J2ME.initWriter && J2ME.initWriter.writeLn("Running Static Constructor: " + classInfo.className);
                $.ctx.pushClassInitFrame(classInfo);
                release || assert(!U);
                //// TODO: monitorEnter
                //if (klass.staticInitializer) {
                //  klass.staticInitializer.call(runtimeKlass);
                //}
                //if (klass.staticConstructor) {
                //  klass.staticConstructor.call(runtimeKlass);
                //}
                return runtimeKlass;
            }
        });
    }
    J2ME.registerKlass = registerKlass;
    var unresolvedSymbols = Object.create(null);
    function findKlass(classInfo) {
        if (unresolvedSymbols[classInfo.mangledName]) {
            return null;
        }
        return jsGlobal[classInfo.mangledName];
    }
    function registerKlassSymbol(className) {
        J2ME.linkWriter && J2ME.linkWriter.writeLn("Registering Klass: " + className);
        // TODO: This needs to be kept in sync to how mangleClass works.
        var mangledName = "$" + escapeString(className);
        if (RuntimeTemplate.prototype.hasOwnProperty(mangledName)) {
            return;
        }
        if (!RuntimeTemplate.prototype.hasOwnProperty(mangledName)) {
            Object.defineProperty(RuntimeTemplate.prototype, mangledName, {
                configurable: true,
                get: function lazyKlass() {
                    J2ME.linkWriter && J2ME.linkWriter.writeLn("Initializing Klass: " + className);
                    J2ME.CLASSES.getClass(className);
                    return this[mangledName]; // This should not be recursive at this point.
                }
            });
        }
        if (!jsGlobal.hasOwnProperty(mangledName)) {
            unresolvedSymbols[mangledName] = true;
            Object.defineProperty(jsGlobal, mangledName, {
                configurable: true,
                get: function () {
                    J2ME.linkWriter && J2ME.linkWriter.writeLn("Initializing Klass: " + className);
                    J2ME.CLASSES.getClass(className);
                    return this[mangledName]; // This should not be recursive at this point.
                }
            });
        }
    }
    J2ME.registerKlassSymbol = registerKlassSymbol;
    function registerKlassSymbols(classNames) {
        for (var i = 0; i < classNames.length; i++) {
            var className = classNames[i];
            registerKlassSymbol(className);
        }
    }
    J2ME.registerKlassSymbols = registerKlassSymbols;
    function getRuntimeKlass(runtime, klass) {
        release || assert(!(klass instanceof RuntimeKlass));
        release || assert(klass.classInfo.mangledName);
        var runtimeKlass = runtime[klass.classInfo.mangledName];
        // assert(runtimeKlass instanceof RuntimeKlass);
        return runtimeKlass;
    }
    J2ME.getRuntimeKlass = getRuntimeKlass;
    function setKlassSymbol(mangledName, klass) {
        Object.defineProperty(jsGlobal, mangledName, {
            value: klass
        });
    }
    function emitKlassConstructor(classInfo, mangledName) {
        var klass;
        enterTimeline("emitKlassConstructor");
        // TODO: Creating and evaling a Klass here may be too slow at startup. Consider
        // creating a closure, which will probably be slower at runtime.
        var source = "";
        var writer = new J2ME.IndentingWriter(false, function (x) { return source += x + "\n"; });
        var emitter = new J2ME.Emitter(writer, false, true, true);
        J2ME.emitKlass(emitter, classInfo);
        (1, eval)(source);
        leaveTimeline("emitKlassConstructor");
        // consoleWriter.writeLn("Synthesizing Klass: " + classInfo.className);
        // consoleWriter.writeLn(source);
        klass = jsGlobal[mangledName];
        release || assert(klass, mangledName);
        klass.toString = function () {
            return "[Synthesized Klass " + classInfo.className + "]";
        };
        return klass;
    }
    function getKlass(classInfo) {
        if (!classInfo) {
            return null;
        }
        if (classInfo.klass) {
            return classInfo.klass;
        }
        return makeKlass(classInfo);
    }
    J2ME.getKlass = getKlass;
    function makeKlass(classInfo) {
        var klass = findKlass(classInfo);
        if (klass) {
            release || assert(!classInfo.isInterface, "Interfaces should not be compiled.");
            J2ME.linkWriter && J2ME.linkWriter.greenLn("Found Compiled Klass: " + classInfo.className);
            release || assert(!classInfo.klass);
            classInfo.klass = klass;
            klass.toString = function () {
                return "[Compiled Klass " + classInfo.className + "]";
            };
            if (klass.classSymbols) {
                registerKlassSymbols(klass.classSymbols);
            }
        }
        else {
            klass = makeKlassConstructor(classInfo);
        }
        if (classInfo.superClass && !classInfo.superClass.klass && J2ME.phase === 0 /* Runtime */) {
            J2ME.linkKlass(classInfo.superClass);
        }
        var superKlass = getKlass(classInfo.superClass);
        enterTimeline("extendKlass");
        extendKlass(klass, superKlass);
        leaveTimeline("extendKlass");
        enterTimeline("registerKlass");
        registerKlass(klass, classInfo);
        leaveTimeline("registerKlass");
        if (classInfo.isArrayClass) {
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
    function makeKlassConstructor(classInfo) {
        var klass;
        var mangledName = mangleClass(classInfo);
        if (classInfo.isInterface) {
            klass = function () {
                J2ME.Debug.unexpected("Should never be instantiated.");
            };
            klass.isInterfaceKlass = true;
            klass.toString = function () {
                return "[Interface Klass " + classInfo.className + "]";
            };
            setKlassSymbol(mangledName, klass);
        }
        else if (classInfo.isArrayClass) {
            var elementKlass = getKlass(classInfo.elementClass);
            // Have we already created one? We need to maintain pointer identity.
            if (elementKlass.arrayKlass) {
                return elementKlass.arrayKlass;
            }
            klass = makeArrayKlassConstructor(elementKlass);
        }
        else if (classInfo instanceof J2ME.PrimitiveClassInfo) {
            klass = function () {
                J2ME.Debug.unexpected("Should never be instantiated.");
            };
            klass.toString = function () {
                return "[Primitive Klass " + classInfo.className + "]";
            };
        }
        else {
            klass = emitKlassConstructor(classInfo, mangledName);
        }
        return klass;
    }
    function makeArrayKlassConstructor(elementKlass) {
        var klass = getArrayConstructor(elementKlass.classInfo.className);
        if (!klass) {
            klass = function (size) {
                var array = createEmptyObjectArray(size);
                array.klass = klass;
                return array;
            };
            klass.toString = function () {
                return "[Array of " + elementKlass + "]";
            };
        }
        else {
            release || assert(!klass.prototype.hasOwnProperty("klass"));
            klass.prototype.klass = klass;
            klass.toString = function () {
                return "[Array of " + elementKlass + "]";
            };
        }
        return klass;
    }
    J2ME.makeArrayKlassConstructor = makeArrayKlassConstructor;
    function linkKlass(classInfo) {
        enterTimeline("linkKlass", { classInfo: classInfo });
        var mangledName = mangleClass(classInfo);
        var klass;
        classInfo.klass = klass = getKlass(classInfo);
        classInfo.klass.classInfo = classInfo;
        if (classInfo instanceof J2ME.PrimitiveClassInfo) {
            switch (classInfo) {
                case J2ME.PrimitiveClassInfo.Z:
                    J2ME.Klasses.boolean = klass;
                    break;
                case J2ME.PrimitiveClassInfo.C:
                    J2ME.Klasses.char = klass;
                    break;
                case J2ME.PrimitiveClassInfo.F:
                    J2ME.Klasses.float = klass;
                    break;
                case J2ME.PrimitiveClassInfo.D:
                    J2ME.Klasses.double = klass;
                    break;
                case J2ME.PrimitiveClassInfo.B:
                    J2ME.Klasses.byte = klass;
                    break;
                case J2ME.PrimitiveClassInfo.S:
                    J2ME.Klasses.short = klass;
                    break;
                case J2ME.PrimitiveClassInfo.I:
                    J2ME.Klasses.int = klass;
                    break;
                case J2ME.PrimitiveClassInfo.J:
                    J2ME.Klasses.long = klass;
                    break;
                default: J2ME.Debug.assertUnreachable("linking primitive " + classInfo.className);
            }
        }
        else {
            switch (classInfo.className) {
                case "java/lang/Object":
                    J2ME.Klasses.java.lang.Object = klass;
                    break;
                case "java/lang/Class":
                    J2ME.Klasses.java.lang.Class = klass;
                    break;
                case "java/lang/String":
                    J2ME.Klasses.java.lang.String = klass;
                    break;
                case "java/lang/Thread":
                    J2ME.Klasses.java.lang.Thread = klass;
                    break;
                case "java/lang/Exception":
                    J2ME.Klasses.java.lang.Exception = klass;
                    break;
                case "java/lang/IllegalArgumentException":
                    J2ME.Klasses.java.lang.IllegalArgumentException = klass;
                    break;
                case "java/lang/NegativeArraySizeException":
                    J2ME.Klasses.java.lang.NegativeArraySizeException = klass;
                    break;
                case "java/lang/IllegalStateException":
                    J2ME.Klasses.java.lang.IllegalStateException = klass;
                    break;
                case "java/lang/NullPointerException":
                    J2ME.Klasses.java.lang.NullPointerException = klass;
                    break;
                case "java/lang/RuntimeException":
                    J2ME.Klasses.java.lang.RuntimeException = klass;
                    break;
                case "java/lang/IndexOutOfBoundsException":
                    J2ME.Klasses.java.lang.IndexOutOfBoundsException = klass;
                    break;
                case "java/lang/ArrayIndexOutOfBoundsException":
                    J2ME.Klasses.java.lang.ArrayIndexOutOfBoundsException = klass;
                    break;
                case "java/lang/StringIndexOutOfBoundsException":
                    J2ME.Klasses.java.lang.StringIndexOutOfBoundsException = klass;
                    break;
                case "java/lang/ArrayStoreException":
                    J2ME.Klasses.java.lang.ArrayStoreException = klass;
                    break;
                case "java/lang/IllegalMonitorStateException":
                    J2ME.Klasses.java.lang.IllegalMonitorStateException = klass;
                    break;
                case "java/lang/ClassCastException":
                    J2ME.Klasses.java.lang.ClassCastException = klass;
                    break;
                case "java/lang/ArithmeticException":
                    J2ME.Klasses.java.lang.ArithmeticException = klass;
                    break;
                case "java/lang/NegativeArraySizeException":
                    J2ME.Klasses.java.lang.NegativeArraySizeException = klass;
                    break;
                case "java/lang/ClassNotFoundException":
                    J2ME.Klasses.java.lang.ClassNotFoundException = klass;
                    break;
                case "javax/microedition/media/MediaException":
                    J2ME.Klasses.javax.microedition.media.MediaException = klass;
                    break;
                case "java/lang/SecurityException":
                    J2ME.Klasses.java.lang.SecurityException = klass;
                    break;
                case "java/lang/IllegalThreadStateException":
                    J2ME.Klasses.java.lang.IllegalThreadStateException = klass;
                    break;
                case "java/io/IOException":
                    J2ME.Klasses.java.io.IOException = klass;
                    break;
                case "java/io/UnsupportedEncodingException":
                    J2ME.Klasses.java.io.UnsupportedEncodingException = klass;
                    break;
                case "java/io/UTFDataFormatException":
                    J2ME.Klasses.java.io.UTFDataFormatException = klass;
                    break;
            }
        }
        J2ME.linkWriter && J2ME.linkWriter.writeLn("Link: " + classInfo.className + " -> " + klass);
        enterTimeline("linkKlassMethods");
        linkKlassMethods(classInfo.klass);
        leaveTimeline("linkKlassMethods");
        enterTimeline("linkKlassFields");
        linkKlassFields(classInfo.klass);
        leaveTimeline("linkKlassFields");
        leaveTimeline("linkKlass");
        if (klass === J2ME.Klasses.java.lang.Object) {
            extendKlass(Array, J2ME.Klasses.java.lang.Object);
        }
    }
    J2ME.linkKlass = linkKlass;
    function findNativeMethodBinding(methodInfo) {
        var classBindings = J2ME.Bindings[methodInfo.classInfo.className];
        if (classBindings && classBindings.native) {
            var method = classBindings.native[methodInfo.name + "." + methodInfo.signature];
            if (method) {
                return method;
            }
        }
        return null;
    }
    function findNativeMethodImplementation(methodInfo) {
        // Look in bindings first.
        var binding = findNativeMethodBinding(methodInfo);
        if (binding) {
            return binding;
        }
        var implKey = methodInfo.implKey;
        if (methodInfo.isNative) {
            if (implKey in Native) {
                return Native[implKey];
            }
            else {
                // Some Native MethodInfos are constructed but never called;
                // that's fine, unless we actually try to call them.
                return function missingImplementation() {
                    release || assert(false, "Method " + methodInfo.name + " is native but does not have an implementation.");
                };
            }
        }
        else if (implKey in Override) {
            return Override[implKey];
        }
        return null;
    }
    function prepareInterpretedMethod(methodInfo) {
        // Adapter for the most common case.
        if (!methodInfo.isSynchronized && !methodInfo.hasTwoSlotArguments) {
            return function fastInterpreterFrameAdapter() {
                var frame = new J2ME.Frame(methodInfo, [], 0);
                var j = 0;
                if (!methodInfo.isStatic) {
                    frame.setLocal(j++, this);
                }
                var slots = methodInfo.argumentSlots;
                for (var i = 0; i < slots; i++) {
                    frame.setLocal(j++, arguments[i]);
                }
                return $.ctx.executeNewFrameSet([frame]);
            };
        }
        return function interpreterFrameAdapter() {
            var frame = new J2ME.Frame(methodInfo, [], 0);
            var j = 0;
            if (!methodInfo.isStatic) {
                frame.setLocal(j++, this);
            }
            var typeDescriptors = methodInfo.signatureDescriptor.typeDescriptors;
            release || assert(arguments.length === typeDescriptors.length - 1, "Number of adapter frame arguments (" + arguments.length + ") does not match signature descriptor " + methodInfo.signatureDescriptor);
            for (var i = 1; i < typeDescriptors.length; i++) {
                frame.setLocal(j++, arguments[i - 1]);
                if (J2ME.isTwoSlot(typeDescriptors[i].kind)) {
                    frame.setLocal(j++, null);
                }
            }
            if (methodInfo.isSynchronized) {
                if (!frame.lockObject) {
                    frame.lockObject = methodInfo.isStatic ? methodInfo.classInfo.getClassObject($.ctx) : frame.getLocal(0);
                }
                $.ctx.monitorEnter(frame.lockObject);
                if (U === 2 /* Pausing */) {
                    $.ctx.frames.push(frame);
                    return;
                }
            }
            return $.ctx.executeNewFrameSet([frame]);
        };
    }
    function findCompiledMethod(klass, methodInfo) {
        return jsGlobal[methodInfo.mangledClassAndMethodName];
    }
    /**
     * Creates convenience getters / setters on Java objects.
     */
    function linkKlassFields(klass) {
        var classInfo = klass.classInfo;
        var fields = classInfo.fields;
        var classBindings = J2ME.Bindings[klass.classInfo.className];
        if (classBindings && classBindings.fields) {
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var key = field.name + "." + field.signature;
                var symbols = field.isStatic ? classBindings.fields.staticSymbols : classBindings.fields.instanceSymbols;
                if (symbols && symbols[key]) {
                    release || assert(!field.isStatic, "Static fields are not supported yet.");
                    var symbolName = symbols[key];
                    var object = field.isStatic ? klass : klass.prototype;
                    release || assert(!object.hasOwnProperty(symbolName), "Should not overwrite existing properties.");
                    J2ME.ObjectUtilities.defineNonEnumerableForwardingProperty(object, symbolName, field.mangledName);
                }
            }
        }
    }
    function linkKlassMethods(klass) {
        J2ME.linkWriter && J2ME.linkWriter.enter("Link Klass Methods: " + klass);
        var methods = klass.classInfo.methods;
        for (var i = 0; i < methods.length; i++) {
            var methodInfo = methods[i];
            var fn;
            var methodType;
            var nativeMethod = findNativeMethodImplementation(methods[i]);
            var methodDescription = methods[i].name + methods[i].signature;
            var updateGlobalObject = true;
            if (nativeMethod) {
                J2ME.linkWriter && J2ME.linkWriter.writeLn("Method: " + methodDescription + " -> Native / Override");
                fn = nativeMethod;
                methodType = 1 /* Native */;
            }
            else {
                fn = findCompiledMethod(klass, methodInfo);
                if (fn && !methodInfo.isSynchronized) {
                    J2ME.linkWriter && J2ME.linkWriter.greenLn("Method: " + methodDescription + " -> Compiled");
                    methodType = 2 /* Compiled */;
                    if (!J2ME.traceWriter) {
                        J2ME.linkWriter && J2ME.linkWriter.outdent();
                    }
                    // Save method info so that we can figure out where we are bailing
                    // out from.
                    J2ME.jitMethodInfos[fn.name] = methodInfo;
                    updateGlobalObject = false;
                }
                else {
                    J2ME.linkWriter && J2ME.linkWriter.warnLn("Method: " + methodDescription + " -> Interpreter");
                    methodType = 0 /* Interpreted */;
                    fn = prepareInterpretedMethod(methodInfo);
                }
            }
            if (false && J2ME.methodTimeline) {
                fn = profilingWrapper(fn, methodInfo, methodType);
                updateGlobalObject = true;
            }
            if (J2ME.traceWriter && methodType !== 0 /* Interpreted */) {
                fn = tracingWrapper(fn, methodInfo, methodType);
                updateGlobalObject = true;
            }
            methodInfo.fn = fn;
            // Link even non-static methods globally so they can be invoked statically via invokespecial.
            if (updateGlobalObject) {
                jsGlobal[methodInfo.mangledClassAndMethodName] = fn;
            }
            if (!methodInfo.isStatic) {
                klass.prototype[methodInfo.mangledName] = fn;
            }
        }
        J2ME.linkWriter && J2ME.linkWriter.outdent();
        function profilingWrapper(fn, methodInfo, methodType) {
            return function (a, b, c, d) {
                var key = MethodType[methodType];
                if (methodType === 0 /* Interpreted */) {
                    J2ME.nativeCounter.count(MethodType[0 /* Interpreted */]);
                    key += methodInfo.isSynchronized ? " Synchronized" : "";
                    key += methodInfo.exception_table.length ? " Has Exceptions" : "";
                }
                // var key = methodType !== MethodType.Interpreted ? MethodType[methodType] : methodInfo.implKey;
                // var key = MethodType[methodType] + " " + methodInfo.implKey;
                J2ME.nativeCounter.count(key);
                var s = J2ME.ops;
                try {
                    J2ME.methodTimeline.enter(key);
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
                    J2ME.methodTimeline.leave(key, s !== J2ME.ops ? { ops: J2ME.ops - s } : undefined);
                }
                catch (e) {
                    J2ME.methodTimeline.leave(key, s !== J2ME.ops ? { ops: J2ME.ops - s } : undefined);
                    throw e;
                }
                return r;
            };
        }
        function tracingWrapper(fn, methodInfo, methodType) {
            return function () {
                var args = Array.prototype.slice.apply(arguments);
                var printArgs = args.map(function (x) {
                    return toDebugString(x);
                }).join(", ");
                var printObj = "";
                if (!methodInfo.isStatic) {
                    printObj = " <" + toDebugString(this) + "> ";
                }
                J2ME.traceWriter.enter("> " + MethodType[methodType][0] + " " + methodInfo.classInfo.className + "/" + methodInfo.name + J2ME.signatureToDefinition(methodInfo.signature, true, true) + printObj + ", arguments: " + printArgs);
                var s = performance.now();
                var value = fn.apply(this, args);
                var elapsedStr = " " + (performance.now() - s).toFixed(4);
                if (methodInfo.getReturnKind() !== 9 /* Void */) {
                    J2ME.traceWriter.leave("< " + toDebugString(value) + elapsedStr);
                }
                else {
                    J2ME.traceWriter.leave("<" + elapsedStr);
                }
                return value;
            };
        }
    }
    /**
     * Creates lookup tables used to efficiently implement type checks.
     */
    function initializeKlassTables(klass) {
        klass.depth = klass.superKlass ? klass.superKlass.depth + 1 : 0;
        assert(klass.display === undefined, "Display should only be defined once.");
        var display = klass.display = new Array(32);
        var i = klass.depth;
        while (klass) {
            display[i--] = klass;
            klass = klass.superKlass;
        }
        release || assert(i === -1, i);
    }
    function initializeInterfaces(klass, classInfo) {
        release || assert(!klass.interfaces);
        var interfaces = klass.interfaces = klass.superKlass ? klass.superKlass.interfaces.slice() : [];
        var interfaceClassInfos = classInfo.interfaces;
        for (var j = 0; j < interfaceClassInfos.length; j++) {
            J2ME.ArrayUtilities.pushUnique(interfaces, getKlass(interfaceClassInfos[j]));
        }
    }
    function extendKlass(klass, superKlass) {
        klass.superKlass = superKlass;
        if (superKlass) {
            if (isPrototypeOfFunctionMutable(klass)) {
                J2ME.linkWriter && J2ME.linkWriter.writeLn("Extending: " + klass + " -> " + superKlass);
                klass.prototype = Object.create(superKlass.prototype);
                // (<any>Object).setPrototypeOf(klass.prototype, superKlass.prototype);
                release || assert(Object.getPrototypeOf(klass.prototype) === superKlass.prototype);
            }
            else {
                release || assert(!superKlass.superKlass, "Should not have a super-super-klass.");
                for (var key in superKlass.prototype) {
                    klass.prototype[key] = superKlass.prototype[key];
                }
            }
        }
        klass.prototype.klass = klass;
        initializeKlassTables(klass);
    }
    J2ME.extendKlass = extendKlass;
    function isAssignableTo(from, to) {
        if (to.isInterfaceKlass) {
            return from.interfaces.indexOf(to) >= 0;
        }
        else if (to.isArrayKlass) {
            if (!from.isArrayKlass) {
                return false;
            }
            return isAssignableTo(from.elementKlass, to.elementKlass);
        }
        return from.display[to.depth] === to;
    }
    J2ME.isAssignableTo = isAssignableTo;
    function instanceOfKlass(object, klass) {
        return object !== null && isAssignableTo(object.klass, klass);
    }
    J2ME.instanceOfKlass = instanceOfKlass;
    function instanceOfInterface(object, klass) {
        release || assert(klass.isInterfaceKlass);
        return object !== null && isAssignableTo(object.klass, klass);
    }
    J2ME.instanceOfInterface = instanceOfInterface;
    function checkCastKlass(object, klass) {
        if (object !== null && !isAssignableTo(object.klass, klass)) {
            throw $.newClassCastException();
        }
    }
    J2ME.checkCastKlass = checkCastKlass;
    function checkCastInterface(object, klass) {
        if (object !== null && !isAssignableTo(object.klass, klass)) {
            throw $.newClassCastException();
        }
    }
    J2ME.checkCastInterface = checkCastInterface;
    function createEmptyObjectArray(size) {
        var array = new Array(size);
        for (var i = 0; i < size; i++) {
            array[i] = null;
        }
        return array;
    }
    function newObject(klass) {
        return new klass();
    }
    J2ME.newObject = newObject;
    function newString(str) {
        if (str === null || str === undefined) {
            return null;
        }
        var object = newObject(J2ME.Klasses.java.lang.String);
        object.str = str;
        return object;
    }
    J2ME.newString = newString;
    function newStringConstant(str) {
        return $.newStringConstant(str);
    }
    J2ME.newStringConstant = newStringConstant;
    ;
    function newArray(klass, size) {
        var constructor = getArrayKlass(klass);
        return new constructor(size);
    }
    J2ME.newArray = newArray;
    function newObjectArray(size) {
        return newArray(J2ME.Klasses.java.lang.Object, size);
    }
    J2ME.newObjectArray = newObjectArray;
    function newStringArray(size) {
        return newArray(J2ME.Klasses.java.lang.String, size);
    }
    J2ME.newStringArray = newStringArray;
    function newByteArray(size) {
        return newArray(J2ME.Klasses.byte, size);
    }
    J2ME.newByteArray = newByteArray;
    function getArrayKlass(elementKlass) {
        // Have we already created one? We need to maintain pointer identity.
        if (elementKlass.arrayKlass) {
            return elementKlass.arrayKlass;
        }
        var className = elementKlass.classInfo.className;
        if (!(elementKlass.classInfo instanceof J2ME.PrimitiveClassInfo) && className[0] !== "[") {
            className = "L" + className + ";";
        }
        className = "[" + className;
        return getKlass(J2ME.CLASSES.getClass(className));
    }
    J2ME.getArrayKlass = getArrayKlass;
    function toDebugString(value) {
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
            return value.klass + " no classInfo";
        }
        var hashcode = "";
        if (value._hashCode) {
            hashcode = " 0x" + value._hashCode.toString(16).toUpperCase();
        }
        if (value instanceof J2ME.Klasses.java.lang.String) {
            return "\"" + value.str + "\"";
        }
        return "[" + value.klass.classInfo.className + hashcode + "]";
    }
    J2ME.toDebugString = toDebugString;
    function fromJavaString(value) {
        if (!value) {
            return null;
        }
        return value.str;
    }
    J2ME.fromJavaString = fromJavaString;
    function checkDivideByZero(value) {
        if (value === 0) {
            throw $.newArithmeticException("/ by zero");
        }
    }
    J2ME.checkDivideByZero = checkDivideByZero;
    function checkDivideByZeroLong(value) {
        if (value.isZero()) {
            throw $.newArithmeticException("/ by zero");
        }
    }
    J2ME.checkDivideByZeroLong = checkDivideByZeroLong;
    /**
     * Do bounds check using only one branch. The math works out because array.length
     * can't be larger than 2^31 - 1. So |index| >>> 0 will be larger than
     * array.length if it is less than zero. We need to make the right side unsigned
     * as well because otherwise the SM optimization that converts this to an
     * unsinged branch doesn't kick in.
     */
    function checkArrayBounds(array, index) {
        if ((index >>> 0) >= (array.length >>> 0)) {
            throw $.newArrayIndexOutOfBoundsException(String(index));
        }
    }
    J2ME.checkArrayBounds = checkArrayBounds;
    function checkArrayStore(array, value) {
        var arrayKlass = array.klass;
        if (value && !isAssignableTo(value.klass, arrayKlass.elementKlass)) {
            throw $.newArrayStoreException();
        }
    }
    J2ME.checkArrayStore = checkArrayStore;
    function checkNull(object) {
        if (!object) {
            throw $.newNullPointerException();
        }
    }
    J2ME.checkNull = checkNull;
    (function (Constants) {
        Constants[Constants["INT_MAX"] = 2147483647] = "INT_MAX";
        Constants[Constants["INT_MIN"] = -2147483648] = "INT_MIN";
    })(J2ME.Constants || (J2ME.Constants = {}));
    var Constants = J2ME.Constants;
    function monitorEnter(object) {
        $.ctx.monitorEnter(object);
    }
    J2ME.monitorEnter = monitorEnter;
    function monitorExit(object) {
        $.ctx.monitorExit(object);
    }
    J2ME.monitorExit = monitorExit;
})(J2ME || (J2ME = {}));
var Runtime = J2ME.Runtime;
/**
 * Are we currently unwinding the stack because of a Yield? This technically
 * belonges to a context but we store it in the global object because it is
 * read very often.
 */
var U = 0 /* Running */;
/**
 * Runtime exports for compiled code.
 */
var $IOK = J2ME.instanceOfKlass;
var $IOI = J2ME.instanceOfInterface;
var $CCK = J2ME.checkCastKlass;
var $CCI = J2ME.checkCastInterface;
var $AK = J2ME.getArrayKlass;
var $NA = J2ME.newArray;
var $S = J2ME.newStringConstant;
var $CDZ = J2ME.checkDivideByZero;
var $CDZL = J2ME.checkDivideByZeroLong;
var $CAB = J2ME.checkArrayBounds;
var $CAS = J2ME.checkArrayStore;
var $ME = J2ME.monitorEnter;
var $MX = J2ME.monitorExit;
var J2ME;
(function (J2ME) {
    var BytecodeStream = J2ME.Bytecode.BytecodeStream;
    var checkArrayBounds = J2ME.checkArrayBounds;
    var checkDivideByZero = J2ME.checkDivideByZero;
    var checkDivideByZeroLong = J2ME.checkDivideByZeroLong;
    var Bytecodes = J2ME.Bytecode.Bytecodes;
    var assert = J2ME.Debug.assert;
    var popManyInto = J2ME.ArrayUtilities.popManyInto;
    J2ME.interpreterCounter = new J2ME.Metrics.Counter(true);
    var traceArrayAccess = false;
    function traceArrayStore(index, array, value) {
        J2ME.traceWriter.writeLn(J2ME.toDebugString(array) + "[" + index + "] = " + J2ME.toDebugString(value));
    }
    function traceArrayLoad(index, array) {
        assert(array[index] !== undefined);
        J2ME.traceWriter.writeLn(J2ME.toDebugString(array) + "[" + index + "] (" + J2ME.toDebugString(array[index]) + ")");
    }
    /**
     * Optimize method bytecode.
     */
    function optimizeMethodBytecode(methodInfo) {
        J2ME.interpreterCounter.count("optimize: " + methodInfo.implKey);
        var stream = new BytecodeStream(methodInfo.code);
        while (stream.currentBC() !== 256 /* END */) {
            if (stream.rawCurrentBC() === 196 /* WIDE */) {
                stream.next();
                continue;
            }
            switch (stream.currentBC()) {
                case 25 /* ALOAD */:
                    if (stream.nextBC() === 21 /* ILOAD */) {
                        stream.writeCurrentBC(210 /* ALOAD_ILOAD */);
                    }
                    break;
                case 132 /* IINC */:
                    if (stream.nextBC() === 167 /* GOTO */) {
                        stream.writeCurrentBC(211 /* IINC_GOTO */);
                    }
                    break;
                case 190 /* ARRAYLENGTH */:
                    if (stream.nextBC() === 162 /* IF_ICMPGE */) {
                        stream.writeCurrentBC(212 /* ARRAYLENGTH_IF_ICMPGE */);
                    }
                    break;
            }
            stream.next();
        }
        methodInfo.isOptimized = true;
    }
    function resolve(index, cp, isStatic) {
        if (isStatic === void 0) { isStatic = false; }
        var entry = cp[index];
        if (entry.tag) {
            entry = $.ctx.resolve(cp, index, isStatic);
        }
        return entry;
    }
    function resolveField(index, cp, isStatic) {
        return resolve(index, cp, isStatic);
    }
    function resolveClass(index, cp, isStatic) {
        return resolve(index, cp, isStatic);
    }
    function resolveMethod(index, cp, isStatic) {
        return resolve(index, cp, isStatic);
    }
    /**
     * Debugging helper to make sure native methods were implemented correctly.
     */
    function checkReturnValue(methodInfo, returnValue) {
        if (returnValue instanceof Promise) {
            console.error("You forgot to call asyncImpl():", methodInfo.implKey);
        }
        else if (methodInfo.getReturnKind() === 9 /* Void */ && returnValue) {
            console.error("You returned something in a void method:", methodInfo.implKey);
        }
        else if (methodInfo.getReturnKind() !== 9 /* Void */ && (returnValue === undefined) && !U) {
            console.error("You returned undefined in a non-void method:", methodInfo.implKey);
        }
        else if (typeof returnValue === "string") {
            console.error("You returned a non-wrapped string:", methodInfo.implKey);
        }
        else if (returnValue === true || returnValue === false) {
            console.error("You returned a JS boolean:", methodInfo.implKey);
        }
    }
    /**
     * The number of opcodes executed thus far.
     */
    J2ME.ops = 0;
    /**
     * Temporarily used for fn.apply.
     */
    var argArray = [];
    var CONTINUE_AFTER_POPFRAME = {}; // Sentinel object.
    function popFrame(consumes) {
        var ctx = $.ctx;
        var frame = ctx.current();
        var cp = frame.cp;
        var stack = frame.stack;
        if (frame.lockObject)
            ctx.monitorExit(frame.lockObject);
        var callee = frame;
        ctx.frames.pop();
        var caller = frame = ctx.frames.length === 0 ? null : ctx.current();
        Instrument.callExitHooks(callee.methodInfo, caller, callee);
        if (frame === null) {
            var returnValue = null;
            switch (consumes) {
                case 2:
                    returnValue = callee.stack.pop2();
                    break;
                case 1:
                    returnValue = callee.stack.pop();
                    break;
            }
            return returnValue;
        }
        stack = frame.stack;
        cp = frame.cp;
        switch (consumes) {
            case 2:
                stack.push2(callee.stack.pop2());
                break;
            case 1:
                stack.push(callee.stack.pop());
                break;
        }
        return CONTINUE_AFTER_POPFRAME;
    }
    function buildExceptionLog(ex, stackTrace) {
        var className = ex.klass.classInfo.className;
        var detailMessage = util.fromJavaString(J2ME.CLASSES.getField(ex.klass.classInfo, "I.detailMessage.Ljava/lang/String;").get(ex));
        return className + ": " + (detailMessage || "") + "\n" + stackTrace.map(function (entry) {
            return " - " + entry.className + "." + entry.methodName + "(), pc=" + entry.offset;
        }).join("\n") + "\n\n";
    }
    function throw_(ex) {
        var ctx = $.ctx;
        var frame = ctx.current();
        var cp = frame.cp;
        var stack = frame.stack;
        var exClass = ex.class;
        if (!ex.stackTrace) {
            ex.stackTrace = [];
        }
        var stackTrace = ex.stackTrace;
        var classInfo;
        do {
            var exception_table = frame.methodInfo.exception_table;
            var handler_pc = null;
            for (var i = 0; exception_table && i < exception_table.length; i++) {
                if (frame.opPc >= exception_table[i].start_pc && frame.opPc < exception_table[i].end_pc) {
                    if (exception_table[i].catch_type === 0) {
                        handler_pc = exception_table[i].handler_pc;
                        break;
                    }
                    else {
                        classInfo = resolve(exception_table[i].catch_type, cp, false);
                        if (J2ME.isAssignableTo(ex.klass, classInfo.klass)) {
                            handler_pc = exception_table[i].handler_pc;
                            break;
                        }
                    }
                }
            }
            classInfo = frame.methodInfo.classInfo;
            if (classInfo && classInfo.className) {
                stackTrace.push({
                    className: classInfo.className,
                    methodName: frame.methodInfo.name,
                    offset: frame.pc
                });
            }
            if (handler_pc != null) {
                stack.length = 0;
                stack.push(ex);
                frame.pc = handler_pc;
                if (VM.DEBUG_PRINT_ALL_EXCEPTIONS) {
                    console.error(buildExceptionLog(ex, stackTrace));
                }
                return;
            }
            popFrame(0);
            frame = ctx.current();
            cp = frame && frame.cp || null;
            stack = frame && frame.stack || null;
        } while (frame);
        if (ctx.frameSets.length === 0) {
            ctx.kill();
            if (ctx.thread && ctx.thread.waiting && ctx.thread.waiting.length > 0) {
                console.error(buildExceptionLog(ex, stackTrace));
                ctx.thread.waiting.forEach(function (waitingCtx, n) {
                    ctx.thread.waiting[n] = null;
                    waitingCtx.wakeup(ctx.thread);
                });
            }
            throw new Error(buildExceptionLog(ex, stackTrace));
        }
        else {
            throw ex;
        }
    }
    function classInitCheck(classInfo, ip) {
        var ctx = $.ctx;
        if (classInfo.isArrayClass || ctx.runtime.initialized[classInfo.className])
            return;
        ctx.pushClassInitFrame(classInfo);
        if (U) {
            ctx.current().pc = ip;
            return;
        }
    }
    function interpret() {
        var ctx = $.ctx;
        var frame = ctx.current();
        var cp = frame.cp;
        var stack = frame.stack;
        var returnValue = null;
        var traceBytecodes = false;
        var traceSourceLocation = true;
        var lastSourceLocation;
        var index, value, constant;
        var a, b, c;
        var pc, startPc;
        var type;
        var size;
        var array;
        var object;
        var fieldInfo;
        var classInfo;
        if (!frame.methodInfo.isOptimized && frame.methodInfo.opCount > 100) {
            optimizeMethodBytecode(frame.methodInfo);
        }
        while (true) {
            J2ME.ops++;
            frame.methodInfo.opCount++;
            frame.opPc = frame.pc;
            var op = frame.read8();
            if (traceBytecodes) {
                if (traceSourceLocation) {
                    if (frame.methodInfo) {
                        var sourceLocation = frame.methodInfo.getSourceLocationForPC(frame.pc - 1);
                        if (sourceLocation && !sourceLocation.equals(lastSourceLocation)) {
                            J2ME.traceWriter && J2ME.traceWriter.greenLn(sourceLocation.toString() + " " + J2ME.CLASSES.getSourceLine(sourceLocation));
                            lastSourceLocation = sourceLocation;
                        }
                    }
                }
                if (J2ME.traceWriter) {
                    frame.trace(J2ME.traceWriter);
                }
            }
            try {
                switch (op) {
                    case 0 /* NOP */:
                        break;
                    case 1 /* ACONST_NULL */:
                        stack.push(null);
                        break;
                    case 2 /* ICONST_M1 */:
                    case 3 /* ICONST_0 */:
                    case 4 /* ICONST_1 */:
                    case 5 /* ICONST_2 */:
                    case 6 /* ICONST_3 */:
                    case 7 /* ICONST_4 */:
                    case 8 /* ICONST_5 */:
                        stack.push(op - 3 /* ICONST_0 */);
                        break;
                    case 11 /* FCONST_0 */:
                    case 12 /* FCONST_1 */:
                    case 13 /* FCONST_2 */:
                        stack.push(op - 11 /* FCONST_0 */);
                        break;
                    case 14 /* DCONST_0 */:
                    case 15 /* DCONST_1 */:
                        stack.push2(op - 14 /* DCONST_0 */);
                        break;
                    case 9 /* LCONST_0 */:
                    case 10 /* LCONST_1 */:
                        stack.push2(Long.fromInt(op - 9 /* LCONST_0 */));
                        break;
                    case 16 /* BIPUSH */:
                        stack.push(frame.read8Signed());
                        break;
                    case 17 /* SIPUSH */:
                        stack.push(frame.read16Signed());
                        break;
                    case 18 /* LDC */:
                    case 19 /* LDC_W */:
                        index = (op === 18 /* LDC */) ? frame.read8() : frame.read16();
                        constant = resolve(index, cp, false);
                        stack.push(constant);
                        break;
                    case 20 /* LDC2_W */:
                        index = frame.read16();
                        constant = resolve(index, cp, false);
                        stack.push2(constant);
                        break;
                    case 21 /* ILOAD */:
                        stack.push(frame.getLocal(frame.read8()));
                        break;
                    case 23 /* FLOAD */:
                        stack.push(frame.getLocal(frame.read8()));
                        break;
                    case 25 /* ALOAD */:
                        stack.push(frame.getLocal(frame.read8()));
                        break;
                    case 210 /* ALOAD_ILOAD */:
                        stack.push(frame.getLocal(frame.read8()));
                        frame.pc++;
                        stack.push(frame.getLocal(frame.read8()));
                        break;
                    case 22 /* LLOAD */:
                    case 24 /* DLOAD */:
                        stack.push2(frame.getLocal(frame.read8()));
                        break;
                    case 26 /* ILOAD_0 */:
                    case 27 /* ILOAD_1 */:
                    case 28 /* ILOAD_2 */:
                    case 29 /* ILOAD_3 */:
                        stack.push(frame.getLocal(op - 26 /* ILOAD_0 */));
                        break;
                    case 34 /* FLOAD_0 */:
                    case 35 /* FLOAD_1 */:
                    case 36 /* FLOAD_2 */:
                    case 37 /* FLOAD_3 */:
                        stack.push(frame.getLocal(op - 34 /* FLOAD_0 */));
                        break;
                    case 42 /* ALOAD_0 */:
                    case 43 /* ALOAD_1 */:
                    case 44 /* ALOAD_2 */:
                    case 45 /* ALOAD_3 */:
                        stack.push(frame.getLocal(op - 42 /* ALOAD_0 */));
                        break;
                    case 30 /* LLOAD_0 */:
                    case 31 /* LLOAD_1 */:
                    case 32 /* LLOAD_2 */:
                    case 33 /* LLOAD_3 */:
                        stack.push2(frame.getLocal(op - 30 /* LLOAD_0 */));
                        break;
                    case 38 /* DLOAD_0 */:
                    case 39 /* DLOAD_1 */:
                    case 40 /* DLOAD_2 */:
                    case 41 /* DLOAD_3 */:
                        stack.push2(frame.getLocal(op - 38 /* DLOAD_0 */));
                        break;
                    case 46 /* IALOAD */:
                    case 48 /* FALOAD */:
                    case 50 /* AALOAD */:
                    case 51 /* BALOAD */:
                    case 52 /* CALOAD */:
                    case 53 /* SALOAD */:
                        index = stack.pop();
                        array = stack.pop();
                        checkArrayBounds(array, index);
                        stack.push(array[index]);
                        break;
                    case 47 /* LALOAD */:
                    case 49 /* DALOAD */:
                        index = stack.pop();
                        array = stack.pop();
                        checkArrayBounds(array, index);
                        stack.push2(array[index]);
                        break;
                    case 54 /* ISTORE */:
                    case 56 /* FSTORE */:
                    case 58 /* ASTORE */:
                        frame.setLocal(frame.read8(), stack.pop());
                        break;
                    case 55 /* LSTORE */:
                    case 57 /* DSTORE */:
                        frame.setLocal(frame.read8(), stack.pop2());
                        break;
                    case 59 /* ISTORE_0 */:
                    case 67 /* FSTORE_0 */:
                    case 75 /* ASTORE_0 */:
                        frame.setLocal(0, stack.pop());
                        break;
                    case 60 /* ISTORE_1 */:
                    case 68 /* FSTORE_1 */:
                    case 76 /* ASTORE_1 */:
                        frame.setLocal(1, stack.pop());
                        break;
                    case 61 /* ISTORE_2 */:
                    case 69 /* FSTORE_2 */:
                    case 77 /* ASTORE_2 */:
                        frame.setLocal(2, stack.pop());
                        break;
                    case 62 /* ISTORE_3 */:
                    case 70 /* FSTORE_3 */:
                    case 78 /* ASTORE_3 */:
                        frame.setLocal(3, stack.pop());
                        break;
                    case 63 /* LSTORE_0 */:
                    case 71 /* DSTORE_0 */:
                        frame.setLocal(0, stack.pop2());
                        break;
                    case 64 /* LSTORE_1 */:
                    case 72 /* DSTORE_1 */:
                        frame.setLocal(1, stack.pop2());
                        break;
                    case 65 /* LSTORE_2 */:
                    case 73 /* DSTORE_2 */:
                        frame.setLocal(2, stack.pop2());
                        break;
                    case 66 /* LSTORE_3 */:
                    case 74 /* DSTORE_3 */:
                        frame.setLocal(3, stack.pop2());
                        break;
                    case 79 /* IASTORE */:
                    case 81 /* FASTORE */:
                    case 84 /* BASTORE */:
                    case 85 /* CASTORE */:
                    case 86 /* SASTORE */:
                        value = stack.pop();
                        index = stack.pop();
                        array = stack.pop();
                        checkArrayBounds(array, index);
                        array[index] = value;
                        break;
                    case 80 /* LASTORE */:
                    case 82 /* DASTORE */:
                        value = stack.pop2();
                        index = stack.pop();
                        array = stack.pop();
                        checkArrayBounds(array, index);
                        array[index] = value;
                        break;
                    case 83 /* AASTORE */:
                        value = stack.pop();
                        index = stack.pop();
                        array = stack.pop();
                        checkArrayBounds(array, index);
                        J2ME.checkArrayStore(array, value);
                        array[index] = value;
                        break;
                    case 87 /* POP */:
                        stack.pop();
                        break;
                    case 88 /* POP2 */:
                        stack.pop2();
                        break;
                    case 89 /* DUP */:
                        stack.push(stack[stack.length - 1]);
                        break;
                    case 90 /* DUP_X1 */:
                        a = stack.pop();
                        b = stack.pop();
                        stack.push(a);
                        stack.push(b);
                        stack.push(a);
                        break;
                    case 91 /* DUP_X2 */:
                        a = stack.pop();
                        b = stack.pop();
                        c = stack.pop();
                        stack.push(a);
                        stack.push(c);
                        stack.push(b);
                        stack.push(a);
                        break;
                    case 92 /* DUP2 */:
                        a = stack.pop();
                        b = stack.pop();
                        stack.push(b);
                        stack.push(a);
                        stack.push(b);
                        stack.push(a);
                        break;
                    case 93 /* DUP2_X1 */:
                        a = stack.pop();
                        b = stack.pop();
                        c = stack.pop();
                        stack.push(b);
                        stack.push(a);
                        stack.push(c);
                        stack.push(b);
                        stack.push(a);
                        break;
                    case 94 /* DUP2_X2 */:
                        a = stack.pop();
                        b = stack.pop();
                        c = stack.pop();
                        var d = stack.pop();
                        stack.push(b);
                        stack.push(a);
                        stack.push(d);
                        stack.push(c);
                        stack.push(b);
                        stack.push(a);
                        break;
                    case 95 /* SWAP */:
                        a = stack.pop();
                        b = stack.pop();
                        stack.push(a);
                        stack.push(b);
                        break;
                    case 132 /* IINC */:
                        index = frame.read8();
                        value = frame.read8Signed();
                        frame.setLocal(index, frame.getLocal(index) + value);
                        break;
                    case 211 /* IINC_GOTO */:
                        index = frame.read8();
                        value = frame.read8Signed();
                        frame.setLocal(index, frame.getLocal(index) + value);
                        frame.pc++;
                        frame.pc = frame.readTargetPC();
                        break;
                    case 96 /* IADD */:
                        stack.push((stack.pop() + stack.pop()) | 0);
                        break;
                    case 97 /* LADD */:
                        stack.push2(stack.pop2().add(stack.pop2()));
                        break;
                    case 98 /* FADD */:
                        stack.push(Math.fround(stack.pop() + stack.pop()));
                        break;
                    case 99 /* DADD */:
                        stack.push2(stack.pop2() + stack.pop2());
                        break;
                    case 100 /* ISUB */:
                        stack.push((-stack.pop() + stack.pop()) | 0);
                        break;
                    case 101 /* LSUB */:
                        stack.push2(stack.pop2().negate().add(stack.pop2()));
                        break;
                    case 102 /* FSUB */:
                        stack.push(Math.fround(-stack.pop() + stack.pop()));
                        break;
                    case 103 /* DSUB */:
                        stack.push2(-stack.pop2() + stack.pop2());
                        break;
                    case 104 /* IMUL */:
                        stack.push(Math.imul(stack.pop(), stack.pop()));
                        break;
                    case 105 /* LMUL */:
                        stack.push2(stack.pop2().multiply(stack.pop2()));
                        break;
                    case 106 /* FMUL */:
                        stack.push(Math.fround(stack.pop() * stack.pop()));
                        break;
                    case 107 /* DMUL */:
                        stack.push2(stack.pop2() * stack.pop2());
                        break;
                    case 108 /* IDIV */:
                        b = stack.pop();
                        a = stack.pop();
                        checkDivideByZero(b);
                        stack.push((a === -2147483648 /* INT_MIN */ && b === -1) ? a : ((a / b) | 0));
                        break;
                    case 109 /* LDIV */:
                        b = stack.pop2();
                        a = stack.pop2();
                        checkDivideByZeroLong(b);
                        stack.push2(a.div(b));
                        break;
                    case 110 /* FDIV */:
                        b = stack.pop();
                        a = stack.pop();
                        stack.push(Math.fround(a / b));
                        break;
                    case 111 /* DDIV */:
                        b = stack.pop2();
                        a = stack.pop2();
                        stack.push2(a / b);
                        break;
                    case 112 /* IREM */:
                        b = stack.pop();
                        a = stack.pop();
                        checkDivideByZero(b);
                        stack.push(a % b);
                        break;
                    case 113 /* LREM */:
                        b = stack.pop2();
                        a = stack.pop2();
                        checkDivideByZeroLong(b);
                        stack.push2(a.modulo(b));
                        break;
                    case 114 /* FREM */:
                        b = stack.pop();
                        a = stack.pop();
                        stack.push(Math.fround(a % b));
                        break;
                    case 115 /* DREM */:
                        b = stack.pop2();
                        a = stack.pop2();
                        stack.push2(a % b);
                        break;
                    case 116 /* INEG */:
                        stack.push((-stack.pop()) | 0);
                        break;
                    case 117 /* LNEG */:
                        stack.push2(stack.pop2().negate());
                        break;
                    case 118 /* FNEG */:
                        stack.push(-stack.pop());
                        break;
                    case 119 /* DNEG */:
                        stack.push2(-stack.pop2());
                        break;
                    case 120 /* ISHL */:
                        b = stack.pop();
                        a = stack.pop();
                        stack.push(a << b);
                        break;
                    case 121 /* LSHL */:
                        b = stack.pop();
                        a = stack.pop2();
                        stack.push2(a.shiftLeft(b));
                        break;
                    case 122 /* ISHR */:
                        b = stack.pop();
                        a = stack.pop();
                        stack.push(a >> b);
                        break;
                    case 123 /* LSHR */:
                        b = stack.pop();
                        a = stack.pop2();
                        stack.push2(a.shiftRight(b));
                        break;
                    case 124 /* IUSHR */:
                        b = stack.pop();
                        a = stack.pop();
                        stack.push(a >>> b);
                        break;
                    case 125 /* LUSHR */:
                        b = stack.pop();
                        a = stack.pop2();
                        stack.push2(a.shiftRightUnsigned(b));
                        break;
                    case 126 /* IAND */:
                        stack.push(stack.pop() & stack.pop());
                        break;
                    case 127 /* LAND */:
                        stack.push2(stack.pop2().and(stack.pop2()));
                        break;
                    case 128 /* IOR */:
                        stack.push(stack.pop() | stack.pop());
                        break;
                    case 129 /* LOR */:
                        stack.push2(stack.pop2().or(stack.pop2()));
                        break;
                    case 130 /* IXOR */:
                        stack.push(stack.pop() ^ stack.pop());
                        break;
                    case 131 /* LXOR */:
                        stack.push2(stack.pop2().xor(stack.pop2()));
                        break;
                    case 148 /* LCMP */:
                        b = stack.pop2();
                        a = stack.pop2();
                        if (a.greaterThan(b)) {
                            stack.push(1);
                        }
                        else if (a.lessThan(b)) {
                            stack.push(-1);
                        }
                        else {
                            stack.push(0);
                        }
                        break;
                    case 149 /* FCMPL */:
                        b = stack.pop();
                        a = stack.pop();
                        if (isNaN(a) || isNaN(b)) {
                            stack.push(-1);
                        }
                        else if (a > b) {
                            stack.push(1);
                        }
                        else if (a < b) {
                            stack.push(-1);
                        }
                        else {
                            stack.push(0);
                        }
                        break;
                    case 150 /* FCMPG */:
                        b = stack.pop();
                        a = stack.pop();
                        if (isNaN(a) || isNaN(b)) {
                            stack.push(1);
                        }
                        else if (a > b) {
                            stack.push(1);
                        }
                        else if (a < b) {
                            stack.push(-1);
                        }
                        else {
                            stack.push(0);
                        }
                        break;
                    case 151 /* DCMPL */:
                        b = stack.pop2();
                        a = stack.pop2();
                        if (isNaN(a) || isNaN(b)) {
                            stack.push(-1);
                        }
                        else if (a > b) {
                            stack.push(1);
                        }
                        else if (a < b) {
                            stack.push(-1);
                        }
                        else {
                            stack.push(0);
                        }
                        break;
                    case 152 /* DCMPG */:
                        b = stack.pop2();
                        a = stack.pop2();
                        if (isNaN(a) || isNaN(b)) {
                            stack.push(1);
                        }
                        else if (a > b) {
                            stack.push(1);
                        }
                        else if (a < b) {
                            stack.push(-1);
                        }
                        else {
                            stack.push(0);
                        }
                        break;
                    case 153 /* IFEQ */:
                        pc = frame.readTargetPC();
                        if (stack.pop() === 0) {
                            frame.pc = pc;
                        }
                        break;
                    case 154 /* IFNE */:
                        pc = frame.readTargetPC();
                        if (stack.pop() !== 0) {
                            frame.pc = pc;
                        }
                        break;
                    case 155 /* IFLT */:
                        pc = frame.readTargetPC();
                        if (stack.pop() < 0) {
                            frame.pc = pc;
                        }
                        break;
                    case 156 /* IFGE */:
                        pc = frame.readTargetPC();
                        if (stack.pop() >= 0) {
                            frame.pc = pc;
                        }
                        break;
                    case 157 /* IFGT */:
                        pc = frame.readTargetPC();
                        if (stack.pop() > 0) {
                            frame.pc = pc;
                        }
                        break;
                    case 158 /* IFLE */:
                        pc = frame.readTargetPC();
                        if (stack.pop() <= 0) {
                            frame.pc = pc;
                        }
                        break;
                    case 159 /* IF_ICMPEQ */:
                        pc = frame.readTargetPC();
                        if (stack.pop() === stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 160 /* IF_ICMPNE */:
                        pc = frame.readTargetPC();
                        if (stack.pop() !== stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 161 /* IF_ICMPLT */:
                        pc = frame.readTargetPC();
                        if (stack.pop() > stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 162 /* IF_ICMPGE */:
                        pc = frame.readTargetPC();
                        if (stack.pop() <= stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 163 /* IF_ICMPGT */:
                        pc = frame.readTargetPC();
                        if (stack.pop() < stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 164 /* IF_ICMPLE */:
                        pc = frame.readTargetPC();
                        if (stack.pop() >= stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 165 /* IF_ACMPEQ */:
                        pc = frame.readTargetPC();
                        if (stack.pop() === stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 166 /* IF_ACMPNE */:
                        pc = frame.readTargetPC();
                        if (stack.pop() !== stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 198 /* IFNULL */:
                        pc = frame.readTargetPC();
                        if (!stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 199 /* IFNONNULL */:
                        pc = frame.readTargetPC();
                        if (stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 167 /* GOTO */:
                        frame.pc = frame.readTargetPC();
                        break;
                    case 200 /* GOTO_W */:
                        frame.pc = frame.read32Signed() - 1;
                        break;
                    case 168 /* JSR */:
                        pc = frame.read16();
                        stack.push(frame.pc);
                        frame.pc = pc;
                        break;
                    case 201 /* JSR_W */:
                        pc = frame.read32();
                        stack.push(frame.pc);
                        frame.pc = pc;
                        break;
                    case 169 /* RET */:
                        frame.pc = frame.getLocal(frame.read8());
                        break;
                    case 133 /* I2L */:
                        stack.push2(Long.fromInt(stack.pop()));
                        break;
                    case 134 /* I2F */:
                        break;
                    case 135 /* I2D */:
                        stack.push2(stack.pop());
                        break;
                    case 136 /* L2I */:
                        stack.push(stack.pop2().toInt());
                        break;
                    case 137 /* L2F */:
                        stack.push(Math.fround(stack.pop2().toNumber()));
                        break;
                    case 138 /* L2D */:
                        stack.push2(stack.pop2().toNumber());
                        break;
                    case 139 /* F2I */:
                        stack.push(util.double2int(stack.pop()));
                        break;
                    case 140 /* F2L */:
                        stack.push2(Long.fromNumber(stack.pop()));
                        break;
                    case 141 /* F2D */:
                        stack.push2(stack.pop());
                        break;
                    case 142 /* D2I */:
                        stack.push(util.double2int(stack.pop2()));
                        break;
                    case 143 /* D2L */:
                        stack.push2(util.double2long(stack.pop2()));
                        break;
                    case 144 /* D2F */:
                        stack.push(Math.fround(stack.pop2()));
                        break;
                    case 145 /* I2B */:
                        stack.push((stack.pop() << 24) >> 24);
                        break;
                    case 146 /* I2C */:
                        stack.push(stack.pop() & 0xffff);
                        break;
                    case 147 /* I2S */:
                        stack.push((stack.pop() << 16) >> 16);
                        break;
                    case 170 /* TABLESWITCH */:
                        frame.pc = frame.tableSwitch();
                        break;
                    case 171 /* LOOKUPSWITCH */:
                        frame.pc = frame.lookupSwitch();
                        break;
                    case 188 /* NEWARRAY */:
                        type = frame.read8();
                        size = stack.pop();
                        if (size < 0) {
                            throw $.newNegativeArraySizeException();
                        }
                        stack.push(util.newPrimitiveArray("????ZCFDBSIJ"[type], size));
                        break;
                    case 189 /* ANEWARRAY */:
                        index = frame.read16();
                        classInfo = resolveClass(index, cp, false);
                        size = stack.pop();
                        if (size < 0) {
                            throw $.newNegativeArraySizeException();
                        }
                        stack.push(util.newArray(classInfo, size));
                        break;
                    case 197 /* MULTIANEWARRAY */:
                        index = frame.read16();
                        classInfo = resolveClass(index, cp, false);
                        var dimensions = frame.read8();
                        var lengths = new Array(dimensions);
                        for (var i = 0; i < dimensions; i++)
                            lengths[i] = stack.pop();
                        stack.push(util.newMultiArray(classInfo, lengths.reverse()));
                        break;
                    case 190 /* ARRAYLENGTH */:
                        array = stack.pop();
                        stack.push(array.length);
                        break;
                    case 212 /* ARRAYLENGTH_IF_ICMPGE */:
                        array = stack.pop();
                        stack.push(array.length);
                        frame.pc++;
                        pc = frame.readTargetPC();
                        if (stack.pop() <= stack.pop()) {
                            frame.pc = pc;
                        }
                        break;
                    case 180 /* GETFIELD */:
                        index = frame.read16();
                        fieldInfo = resolveField(index, cp, false);
                        object = stack.pop();
                        stack.pushKind(fieldInfo.kind, fieldInfo.get(object));
                        break;
                    case 181 /* PUTFIELD */:
                        index = frame.read16();
                        fieldInfo = resolveField(index, cp, false);
                        value = stack.popKind(fieldInfo.kind);
                        object = stack.pop();
                        fieldInfo.set(object, value);
                        break;
                    case 178 /* GETSTATIC */:
                        index = frame.read16();
                        fieldInfo = resolveField(index, cp, true);
                        classInitCheck(fieldInfo.classInfo, frame.pc - 3);
                        if (U) {
                            return;
                        }
                        value = fieldInfo.getStatic();
                        stack.pushKind(fieldInfo.kind, value);
                        break;
                    case 179 /* PUTSTATIC */:
                        index = frame.read16();
                        fieldInfo = resolveField(index, cp, true);
                        classInitCheck(fieldInfo.classInfo, frame.pc - 3);
                        if (U) {
                            return;
                        }
                        fieldInfo.setStatic(stack.popKind(fieldInfo.kind));
                        break;
                    case 187 /* NEW */:
                        index = frame.read16();
                        classInfo = resolveClass(index, cp, false);
                        classInitCheck(classInfo, frame.pc - 3);
                        if (U) {
                            return;
                        }
                        stack.push(util.newObject(classInfo));
                        break;
                    case 192 /* CHECKCAST */:
                        index = frame.read16();
                        classInfo = resolveClass(index, cp, false);
                        object = stack[stack.length - 1];
                        if (object && !J2ME.isAssignableTo(object.klass, classInfo.klass)) {
                            throw $.newClassCastException(object.klass.classInfo.className + " is not assignable to " + classInfo.className);
                        }
                        break;
                    case 193 /* INSTANCEOF */:
                        index = frame.read16();
                        classInfo = resolveClass(index, cp, false);
                        object = stack.pop();
                        var result = !object ? false : J2ME.isAssignableTo(object.klass, classInfo.klass);
                        stack.push(result ? 1 : 0);
                        break;
                    case 191 /* ATHROW */:
                        object = stack.pop();
                        if (!object) {
                            throw $.newNullPointerException();
                        }
                        throw object;
                        break;
                    case 194 /* MONITORENTER */:
                        object = stack.pop();
                        ctx.monitorEnter(object);
                        if (U === 2 /* Pausing */) {
                            return;
                        }
                        break;
                    case 195 /* MONITOREXIT */:
                        object = stack.pop();
                        ctx.monitorExit(object);
                        break;
                    case 196 /* WIDE */:
                        frame.wide();
                        break;
                    case 182 /* INVOKEVIRTUAL */:
                    case 183 /* INVOKESPECIAL */:
                    case 184 /* INVOKESTATIC */:
                    case 185 /* INVOKEINTERFACE */:
                        var startPc = frame.pc - 1;
                        index = frame.read16();
                        if (op === 185 /* INVOKEINTERFACE */) {
                            var argsNumber = frame.read8();
                            var zero = frame.read8();
                        }
                        var isStatic = (op === 184 /* INVOKESTATIC */);
                        var methodInfo = cp[index];
                        if (methodInfo.tag) {
                            methodInfo = resolve(index, cp, isStatic);
                            if (isStatic) {
                                classInitCheck(methodInfo.classInfo, startPc);
                                if (U) {
                                    return;
                                }
                            }
                        }
                        object = null;
                        var fn;
                        if (!isStatic) {
                            object = frame.peekInvokeObject(methodInfo);
                            switch (op) {
                                case 182 /* INVOKEVIRTUAL */:
                                case 185 /* INVOKEINTERFACE */:
                                    fn = object[methodInfo.mangledName];
                                    break;
                                case 183 /* INVOKESPECIAL */:
                                    J2ME.checkNull(object);
                                    fn = methodInfo.fn;
                                    break;
                            }
                        }
                        else {
                            fn = methodInfo.fn;
                        }
                        var returnValue;
                        var argumentSlots = methodInfo.hasTwoSlotArguments ? -1 : methodInfo.argumentSlots;
                        switch (argumentSlots) {
                            case 0:
                                returnValue = fn.call(object);
                                break;
                            case 1:
                                a = stack.pop();
                                returnValue = fn.call(object, a);
                                break;
                            case 2:
                                b = stack.pop();
                                a = stack.pop();
                                returnValue = fn.call(object, a, b);
                                break;
                            case 3:
                                c = stack.pop();
                                b = stack.pop();
                                a = stack.pop();
                                returnValue = fn.call(object, a, b, c);
                                break;
                            default:
                                if (methodInfo.hasTwoSlotArguments) {
                                    frame.popArgumentsInto(methodInfo.signatureDescriptor, argArray);
                                }
                                else {
                                    popManyInto(stack, methodInfo.argumentSlots, argArray);
                                }
                                var returnValue = fn.apply(object, argArray);
                        }
                        if (!isStatic)
                            stack.pop();
                        if (!release) {
                            checkReturnValue(methodInfo, returnValue);
                        }
                        if (U) {
                            return;
                        }
                        if (methodInfo.getReturnKind() !== 9 /* Void */) {
                            release || assert(returnValue !== undefined, methodInfo.signatureDescriptor + " " + methodInfo.returnKind + " " + 9 /* Void */);
                            if (J2ME.isTwoSlot(methodInfo.getReturnKind())) {
                                stack.push2(returnValue);
                            }
                            else {
                                stack.push(returnValue);
                            }
                        }
                        break;
                    case 177 /* RETURN */:
                        var returnValue = popFrame(0);
                        if (returnValue !== CONTINUE_AFTER_POPFRAME) {
                            return returnValue;
                        }
                        else {
                            frame = ctx.current();
                            cp = frame && frame.cp || null;
                            stack = frame && frame.stack || null;
                        }
                        break;
                    case 172 /* IRETURN */:
                    case 174 /* FRETURN */:
                    case 176 /* ARETURN */:
                        var returnValue = popFrame(1);
                        if (returnValue !== CONTINUE_AFTER_POPFRAME) {
                            return returnValue;
                        }
                        else {
                            frame = ctx.current();
                            cp = frame && frame.cp || null;
                            stack = frame && frame.stack || null;
                        }
                        break;
                    case 173 /* LRETURN */:
                    case 175 /* DRETURN */:
                        var returnValue = popFrame(2);
                        if (returnValue !== CONTINUE_AFTER_POPFRAME) {
                            return returnValue;
                        }
                        else {
                            frame = ctx.current();
                            cp = frame && frame.cp || null;
                            stack = frame && frame.stack || null;
                        }
                        break;
                    default:
                        var opName = Bytecodes[op];
                        throw new Error("Opcode " + opName + " [" + op + "] not supported.");
                }
            }
            catch (e) {
                // This could potentially hide interpreter exceptions. Maybe we should only do this for
                // compiled/native functions.
                if (e.name === "TypeError") {
                    // JavaScript's TypeError is analogous to a NullPointerException.
                    e = $.newNullPointerException(e.message);
                }
                else if (!e.klass) {
                    throw e;
                }
                throw_(e);
                frame = ctx.current();
                cp = frame && frame.cp || null;
                stack = frame && frame.stack || null;
                continue;
            }
        }
    }
    J2ME.interpret = interpret;
    var VM = (function () {
        function VM() {
        }
        VM.execute = interpret;
        VM.Yield = { toString: function () {
            return "YIELD";
        } };
        VM.Pause = { toString: function () {
            return "PAUSE";
        } };
        VM.DEBUG = false;
        VM.DEBUG_PRINT_ALL_EXCEPTIONS = false;
        return VM;
    })();
    J2ME.VM = VM;
})(J2ME || (J2ME = {}));
var VM = J2ME.VM;
var J2ME;
(function (J2ME) {
    var assert = J2ME.Debug.assert;
    var Bytecodes = J2ME.Bytecode.Bytecodes;
    Array.prototype.push2 = function (value) {
        this.push(value);
        this.push(null);
        return value;
    };
    Array.prototype.pop2 = function () {
        this.pop();
        return this.pop();
    };
    Array.prototype.pushKind = function (kind, value) {
        if (J2ME.isTwoSlot(kind)) {
            this.push2(value);
            return;
        }
        this.push(value);
    };
    Array.prototype.popKind = function (kind) {
        if (J2ME.isTwoSlot(kind)) {
            return this.pop2();
        }
        return this.pop();
    };
    // A convenience function for retrieving values in reverse order
    // from the end of the stack.  stack.read(1) returns the topmost item
    // on the stack, while stack.read(2) returns the one underneath it.
    Array.prototype.read = function (i) {
        return this[this.length - i];
    };
    var Frame = (function () {
        function Frame(methodInfo, local, localBase) {
            this.methodInfo = methodInfo;
            this.cp = methodInfo.classInfo.constant_pool;
            this.code = methodInfo.code;
            this.pc = 0;
            this.opPc = 0;
            this.stack = [];
            this.local = local;
            this.localBase = localBase;
            this.lockObject = null;
        }
        Frame.prototype.getLocal = function (i) {
            return this.local[this.localBase + i];
        };
        Frame.prototype.setLocal = function (i, value) {
            this.local[this.localBase + i] = value;
        };
        Frame.prototype.read8 = function () {
            return this.code[this.pc++];
        };
        Frame.prototype.peek8 = function () {
            return this.code[this.pc];
        };
        Frame.prototype.read16 = function () {
            var code = this.code;
            return code[this.pc++] << 8 | code[this.pc++];
        };
        Frame.prototype.read32 = function () {
            return this.read32Signed() >>> 0;
        };
        Frame.prototype.read8Signed = function () {
            return this.code[this.pc++] << 24 >> 24;
        };
        Frame.prototype.read16Signed = function () {
            var pc = this.pc;
            var code = this.code;
            this.pc = pc + 2;
            return (code[pc] << 8 | code[pc + 1]) << 16 >> 16;
        };
        Frame.prototype.readTargetPC = function () {
            var pc = this.pc;
            var code = this.code;
            this.pc = pc + 2;
            var offset = (code[pc] << 8 | code[pc + 1]) << 16 >> 16;
            return pc - 1 + offset;
        };
        Frame.prototype.read32Signed = function () {
            return this.read16() << 16 | this.read16();
        };
        Frame.prototype.tableSwitch = function () {
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
            }
            else {
                this.pc += (value - low) << 2;
                pc = this.read32Signed();
            }
            return start - 1 + pc;
        };
        Frame.prototype.lookupSwitch = function () {
            var start = this.pc;
            while ((this.pc & 3) != 0) {
                this.pc++;
            }
            var pc = this.read32Signed();
            var size = this.read32();
            var value = this.stack.pop();
            lookup: for (var i = 0; i < size; i++) {
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
        };
        Frame.prototype.wide = function () {
            var stack = this.stack;
            var op = this.read8();
            switch (op) {
                case 21 /* ILOAD */:
                case 23 /* FLOAD */:
                case 25 /* ALOAD */:
                    stack.push(this.getLocal(this.read16()));
                    break;
                case 22 /* LLOAD */:
                case 24 /* DLOAD */:
                    stack.push2(this.getLocal(this.read16()));
                    break;
                case 54 /* ISTORE */:
                case 56 /* FSTORE */:
                case 58 /* ASTORE */:
                    this.setLocal(this.read16(), stack.pop());
                    break;
                case 55 /* LSTORE */:
                case 57 /* DSTORE */:
                    this.setLocal(this.read16(), stack.pop2());
                    break;
                case 132 /* IINC */:
                    var index = this.read16();
                    var value = this.read16Signed();
                    this.setLocal(index, this.getLocal(index) + value);
                    break;
                case 169 /* RET */:
                    this.pc = this.getLocal(this.read16());
                    break;
                default:
                    var opName = Bytecodes[op];
                    throw new Error("Wide opcode " + opName + " [" + op + "] not supported.");
            }
        };
        /**
         * Returns the |object| on which a call to the specified |methodInfo| would be
         * called.
         */
        Frame.prototype.peekInvokeObject = function (methodInfo) {
            release || assert(!methodInfo.isStatic);
            var i = this.stack.length - methodInfo.argumentSlots - 1;
            release || assert(i >= 0);
            release || assert(this.stack[i] !== undefined);
            return this.stack[i];
        };
        Frame.prototype.popArgumentsInto = function (signatureDescriptor, args) {
            var stack = this.stack;
            var typeDescriptors = signatureDescriptor.typeDescriptors;
            var argumentSlotCount = signatureDescriptor.getArgumentSlotCount();
            for (var i = 1, j = stack.length - argumentSlotCount, k = 0; i < typeDescriptors.length; i++) {
                var typeDescriptor = typeDescriptors[i];
                args[k++] = stack[j++];
                if (J2ME.isTwoSlot(typeDescriptor.kind)) {
                    j++;
                }
            }
            release || assert(j === stack.length && k === signatureDescriptor.getArgumentCount());
            stack.length -= argumentSlotCount;
            args.length = k;
            return args;
        };
        Frame.prototype.trace = function (writer) {
            var localStr = this.local.map(function (x) {
                return J2ME.toDebugString(x);
            }).join(", ");
            var stackStr = this.stack.map(function (x) {
                return J2ME.toDebugString(x);
            }).join(", ");
            writer.writeLn(("" + this.pc).padLeft(" ", 4) + " " + localStr + " | " + stackStr);
        };
        return Frame;
    })();
    J2ME.Frame = Frame;
    var Context = (function () {
        function Context(runtime) {
            this.runtime = runtime;
            var id = this.id = Context._nextId++;
            this.frames = [];
            this.frameSets = [];
            this.bailoutFrames = [];
            this.runtime = runtime;
            this.runtime.addContext(this);
            this.writer = new J2ME.IndentingWriter(false, function (s) {
                console.log(s);
            });
        }
        Context.color = function (id) {
            if (inBrowser) {
                return id;
            }
            return Context._colors[id % Context._colors.length] + id + J2ME.IndentingWriter.ENDC;
        };
        Context.currentContextPrefix = function () {
            if ($) {
                return Context.color($.id) + ":" + Context.color($.ctx.id);
            }
            return "";
        };
        Context.setWriters = function (writer) {
            J2ME.traceWriter = null; // writer;
            J2ME.linkWriter = null; // writer;
            J2ME.initWriter = null; // writer;
        };
        Context.prototype.kill = function () {
            if (this.thread) {
                this.thread.alive = false;
            }
            this.runtime.removeContext(this);
        };
        Context.prototype.current = function () {
            var frames = this.frames;
            return frames[frames.length - 1];
        };
        Context.prototype.executeNewFrameSet = function (frames) {
            this.frameSets.push(this.frames);
            this.frames = frames;
            try {
                if (J2ME.traceWriter) {
                    var firstFrame = frames[0];
                    var frameDetails = firstFrame.methodInfo.classInfo.className + "/" + firstFrame.methodInfo.name + J2ME.signatureToDefinition(firstFrame.methodInfo.signature, true, true);
                    J2ME.traceWriter.enter("> " + J2ME.MethodType[0 /* Interpreted */][0] + " " + frameDetails);
                }
                var returnValue = VM.execute();
                if (U) {
                    // Append all the current frames to the parent frame set, so a single frame stack
                    // exists when the bailout finishes.
                    var currentFrames = this.frames;
                    this.frames = this.frameSets.pop();
                    for (var i = currentFrames.length - 1; i >= 0; i--) {
                        this.bailoutFrames.unshift(currentFrames[i]);
                    }
                    return;
                }
                if (J2ME.traceWriter) {
                    J2ME.traceWriter.leave("<");
                }
            }
            catch (e) {
                if (J2ME.traceWriter) {
                    J2ME.traceWriter.leave("< " + e);
                }
                assert(this.frames.length === 0);
                this.frames = this.frameSets.pop();
                throwHelper(e);
            }
            this.frames = this.frameSets.pop();
            return returnValue;
        };
        Context.prototype.getClassInitFrame = function (classInfo) {
            if (this.runtime.initialized[classInfo.className])
                return;
            classInfo.thread = this.thread;
            var syntheticMethod = new J2ME.MethodInfo({
                name: "ClassInitSynthetic",
                signature: "()V",
                isStatic: false,
                classInfo: {
                    className: classInfo.className,
                    vmc: {},
                    vfc: {},
                    constant_pool: [
                        null,
                        { tag: 10 /* CONSTANT_Methodref */, class_index: 2, name_and_type_index: 4 },
                        { tag: 7 /* CONSTANT_Class */, name_index: 3 },
                        { bytes: "java/lang/Class" },
                        { name_index: 5, signature_index: 6 },
                        { bytes: "invoke_clinit" },
                        { bytes: "()V" },
                        { tag: 10 /* CONSTANT_Methodref */, class_index: 2, name_and_type_index: 8 },
                        { name_index: 9, signature_index: 10 },
                        { bytes: "init9" },
                        { bytes: "()V" },
                    ],
                },
                code: new Uint8Array([
                    0x2a,
                    0x59,
                    0x59,
                    0x59,
                    0xc2,
                    0xb7,
                    0x00,
                    0x01,
                    0xb7,
                    0x00,
                    0x07,
                    0xc3,
                    0xb1,
                ])
            });
            return new Frame(syntheticMethod, [classInfo.getClassInitLockObject(this)], 0);
        };
        Context.prototype.pushClassInitFrame = function (classInfo) {
            if (this.runtime.initialized[classInfo.className])
                return;
            var classInitFrame = this.getClassInitFrame(classInfo);
            this.executeNewFrameSet([classInitFrame]);
        };
        Context.prototype.createException = function (className, message) {
            if (!message)
                message = "";
            message = "" + message;
            var classInfo = J2ME.CLASSES.getClass(className);
            J2ME.runtimeCounter && J2ME.runtimeCounter.count("createException " + className);
            var exception = new classInfo.klass();
            var methodInfo = J2ME.CLASSES.getMethod(classInfo, "I.<init>.(Ljava/lang/String;)V");
            jsGlobal[methodInfo.mangledClassAndMethodName].call(exception, message ? J2ME.newString(message) : null);
            return exception;
        };
        Context.prototype.setAsCurrentContext = function () {
            $ = this.runtime;
            if ($.ctx === this) {
                return;
            }
            $.ctx = this;
            Context.setWriters(this.writer);
        };
        Context.prototype.clearCurrentContext = function () {
            $ = null;
            Context.setWriters(Context.writer);
        };
        Context.prototype.start = function (frame) {
            this.frames = [frame];
            this.resume();
        };
        Context.prototype.execute = function () {
            Instrument.callResumeHooks(this.current());
            this.setAsCurrentContext();
            do {
                VM.execute();
                if (U) {
                    Array.prototype.push.apply(this.frames, this.bailoutFrames);
                    this.bailoutFrames = [];
                    switch (U) {
                        case 1 /* Yielding */:
                            this.resume();
                            break;
                        case 2 /* Pausing */:
                            Instrument.callPauseHooks(this.current());
                            break;
                    }
                    U = 0 /* Running */;
                    this.clearCurrentContext();
                    return;
                }
            } while (this.frames.length !== 0);
            this.kill();
        };
        Context.prototype.resume = function () {
            window.setZeroTimeout(this.execute.bind(this));
        };
        Context.prototype.block = function (obj, queue, lockLevel) {
            if (!obj[queue])
                obj[queue] = [];
            obj[queue].push(this);
            this.lockLevel = lockLevel;
            $.pause();
        };
        Context.prototype.unblock = function (obj, queue, notifyAll, callback) {
            while (obj[queue] && obj[queue].length) {
                var ctx = obj[queue].pop();
                if (!ctx)
                    continue;
                // Wait until next tick, so that we are sure to notify all waiting.
                window.setZeroTimeout(callback.bind(null, ctx));
                if (!notifyAll)
                    break;
            }
        };
        Context.prototype.wakeup = function (obj) {
            if (this.lockTimeout !== null) {
                window.clearTimeout(this.lockTimeout);
                this.lockTimeout = null;
            }
            if (obj._lock) {
                if (!obj.ready)
                    obj.ready = [];
                obj.ready.push(this);
            }
            else {
                while (this.lockLevel-- > 0) {
                    this.monitorEnter(obj);
                    if (U === 2 /* Pausing */) {
                        return;
                    }
                }
                this.resume();
            }
        };
        Context.prototype.monitorEnter = function (object) {
            var lock = object._lock;
            if (!lock) {
                object._lock = new J2ME.Lock(this.thread, 1);
                return;
            }
            if (lock.thread === this.thread) {
                ++lock.level;
                return;
            }
            this.block(object, "ready", 1);
        };
        Context.prototype.monitorExit = function (object) {
            var lock = object._lock;
            if (lock.thread !== this.thread)
                throw $.newIllegalMonitorStateException();
            if (--lock.level > 0) {
                return;
            }
            object._lock = null;
            this.unblock(object, "ready", false, function (ctx) {
                ctx.wakeup(object);
            });
        };
        Context.prototype.wait = function (object, timeout) {
            var lock = object._lock;
            if (timeout < 0)
                throw $.newIllegalArgumentException();
            if (!lock || lock.thread !== this.thread)
                throw $.newIllegalMonitorStateException();
            var lockLevel = lock.level;
            while (lock.level > 0)
                this.monitorExit(object);
            if (timeout) {
                var self = this;
                this.lockTimeout = window.setTimeout(function () {
                    object.waiting.forEach(function (ctx, n) {
                        if (ctx === self) {
                            object.waiting[n] = null;
                            ctx.wakeup(object);
                        }
                    });
                }, timeout);
            }
            else {
                this.lockTimeout = null;
            }
            this.block(object, "waiting", lockLevel);
        };
        Context.prototype.notify = function (obj, notifyAll) {
            if (!obj._lock || obj._lock.thread !== this.thread)
                throw $.newIllegalMonitorStateException();
            this.unblock(obj, "waiting", notifyAll, function (ctx) {
                ctx.wakeup(obj);
            });
        };
        Context.prototype.bailout = function (methodInfo, pc, local, stack) {
            var frame = new Frame(methodInfo, local, 0);
            frame.stack = stack;
            frame.pc = pc;
            this.bailoutFrames.unshift(frame);
        };
        Context.prototype.resolve = function (cp, idx, isStatic) {
            var constant = cp[idx];
            if (!constant.tag)
                return constant;
            switch (constant.tag) {
                case 3:
                    constant = constant.integer;
                    break;
                case 4:
                    constant = constant.float;
                    break;
                case 8:
                    constant = this.runtime.newStringConstant(cp[constant.string_index].bytes);
                    break;
                case 5:
                    constant = Long.fromBits(constant.lowBits, constant.highBits);
                    break;
                case 6:
                    constant = constant.double;
                    break;
                case 7:
                    constant = J2ME.CLASSES.getClass(cp[constant.name_index].bytes);
                    break;
                case 9:
                    var classInfo = this.resolve(cp, constant.class_index, isStatic);
                    var fieldName = cp[cp[constant.name_and_type_index].name_index].bytes;
                    var signature = cp[cp[constant.name_and_type_index].signature_index].bytes;
                    constant = J2ME.CLASSES.getField(classInfo, (isStatic ? "S" : "I") + "." + fieldName + "." + signature);
                    if (!constant) {
                        throw $.newRuntimeException(classInfo.className + "." + fieldName + "." + signature + " not found");
                    }
                    break;
                case 10:
                case 11:
                    var classInfo = this.resolve(cp, constant.class_index, isStatic);
                    var methodName = cp[cp[constant.name_and_type_index].name_index].bytes;
                    var signature = cp[cp[constant.name_and_type_index].signature_index].bytes;
                    constant = J2ME.CLASSES.getMethod(classInfo, (isStatic ? "S" : "I") + "." + methodName + "." + signature);
                    if (!constant) {
                        throw $.newRuntimeException(classInfo.className + "." + methodName + "." + signature + " not found");
                    }
                    break;
                default:
                    throw new Error("not support constant type");
            }
            return cp[idx] = constant;
        };
        Context._nextId = 0;
        Context._colors = [
            J2ME.IndentingWriter.PURPLE,
            J2ME.IndentingWriter.YELLOW,
            J2ME.IndentingWriter.GREEN,
            J2ME.IndentingWriter.RED,
            J2ME.IndentingWriter.BOLD_RED
        ];
        Context.writer = new J2ME.IndentingWriter(false, function (s) {
            console.log(s);
        });
        return Context;
    })();
    J2ME.Context = Context;
})(J2ME || (J2ME = {}));
var Context = J2ME.Context;
var Frame = J2ME.Frame;
function countTimeline(message, object) {
}
function enterTimeline(message) {
}
function leaveTimeline(message) {
}
var J2ME;
(function (J2ME) {
    var CompilerBailout = (function () {
        function CompilerBailout(message) {
            this.message = message;
            // ...
        }
        return CompilerBailout;
    })();
    J2ME.CompilerBailout = CompilerBailout;
})(J2ME || (J2ME = {}));
/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
var J2ME;
(function (J2ME) {
    var C4;
    (function (C4) {
        var IR;
        (function (IR) {
            var assert = J2ME.Debug.assert;
            var unexpected = J2ME.Debug.unexpected;
            var createEmptyObject = J2ME.ObjectUtilities.createEmptyObject;
            function visitArrayInputs(array, visitor, ignoreNull) {
                if (ignoreNull === void 0) { ignoreNull = false; }
                for (var i = 0; i < array.length; i++) {
                    if (ignoreNull && array[i] === null) {
                        continue;
                    }
                    visitor(array[i]);
                }
            }
            IR.visitArrayInputs = visitArrayInputs;
            (function (NodeFlags) {
                NodeFlags[NodeFlags["None"] = 0] = "None";
            })(IR.NodeFlags || (IR.NodeFlags = {}));
            var NodeFlags = IR.NodeFlags;
            var Node = (function () {
                function Node() {
                    this.id = Node.getNextID();
                }
                Node.getNextID = function () {
                    return Node._nextID[Node._nextID.length - 1] += 1;
                };
                Node.prototype.visitInputs = function (visitor) {
                };
                Node.startNumbering = function () {
                    Node._nextID.push(0);
                };
                Node.stopNumbering = function () {
                    Node._nextID.pop();
                };
                Node.prototype.toString = function (brief) {
                    if (brief) {
                        return nameOf(this);
                    }
                    var inputs = [];
                    this.visitInputs(function (input) {
                        inputs.push(nameOf(input));
                    });
                    var result = nameOf(this) + " = " + this.nodeName.toUpperCase();
                    if (inputs.length) {
                        result += " " + inputs.join(", ");
                    }
                    return result;
                };
                Node.prototype.visitInputsNoConstants = function (visitor) {
                    this.visitInputs(function (node) {
                        if (IR.isConstant(node)) {
                            return;
                        }
                        visitor(node);
                    });
                };
                Node.prototype.replaceInput = function (oldInput, newInput) {
                    var count = 0;
                    for (var k in this) {
                        var v = this[k];
                        if (v instanceof Node) {
                            if (v === oldInput) {
                                this[k] = newInput;
                                count++;
                            }
                        }
                        if (v instanceof Array) {
                            count += v.replace(oldInput, newInput);
                        }
                    }
                    return count;
                };
                Node._nextID = [];
                return Node;
            })();
            IR.Node = Node;
            Node.prototype.nodeName = "Node";
            var Control = (function (_super) {
                __extends(Control, _super);
                function Control() {
                    _super.call(this);
                }
                return Control;
            })(Node);
            IR.Control = Control;
            Control.prototype.nodeName = "Control";
            var Region = (function (_super) {
                __extends(Region, _super);
                function Region(control) {
                    _super.call(this);
                    this.predecessors = control ? [control] : [];
                }
                Region.prototype.visitInputs = function (visitor) {
                    visitArrayInputs(this.predecessors, visitor);
                };
                return Region;
            })(Control);
            IR.Region = Region;
            Region.prototype.nodeName = "Region";
            var Start = (function (_super) {
                __extends(Start, _super);
                function Start() {
                    _super.call(this, null);
                    this.control = this;
                }
                Start.prototype.visitInputs = function (visitor) {
                    visitArrayInputs(this.predecessors, visitor);
                };
                return Start;
            })(Region);
            IR.Start = Start;
            Start.prototype.nodeName = "Start";
            var End = (function (_super) {
                __extends(End, _super);
                function End(control) {
                    _super.call(this);
                    this.control = control;
                }
                End.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                };
                return End;
            })(Control);
            IR.End = End;
            End.prototype.nodeName = "End";
            var Stop = (function (_super) {
                __extends(Stop, _super);
                function Stop(control, store, argument) {
                    _super.call(this, control);
                    this.store = store;
                    this.argument = argument;
                }
                Stop.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                    visitor(this.store);
                    visitor(this.argument);
                };
                return Stop;
            })(End);
            IR.Stop = Stop;
            Stop.prototype.nodeName = "Stop";
            var If = (function (_super) {
                __extends(If, _super);
                function If(control, predicate) {
                    _super.call(this, control);
                    this.predicate = predicate;
                }
                If.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                    visitor(this.predicate);
                };
                return If;
            })(End);
            IR.If = If;
            If.prototype.nodeName = "If";
            var Switch = (function (_super) {
                __extends(Switch, _super);
                function Switch(control, determinant) {
                    _super.call(this, control);
                    this.determinant = determinant;
                }
                Switch.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                    visitor(this.determinant);
                };
                return Switch;
            })(End);
            IR.Switch = Switch;
            Switch.prototype.nodeName = "Switch";
            var Jump = (function (_super) {
                __extends(Jump, _super);
                function Jump(control) {
                    _super.call(this, control);
                }
                Jump.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                };
                return Jump;
            })(End);
            IR.Jump = Jump;
            Jump.prototype.nodeName = "Jump";
            var Value = (function (_super) {
                __extends(Value, _super);
                function Value() {
                    _super.call(this);
                }
                return Value;
            })(Node);
            IR.Value = Value;
            Value.prototype.nodeName = "Value";
            var Store = (function (_super) {
                __extends(Store, _super);
                function Store() {
                    _super.call(this);
                }
                return Store;
            })(Value);
            IR.Store = Store;
            Store.prototype.nodeName = "Store";
            var StoreDependent = (function (_super) {
                __extends(StoreDependent, _super);
                function StoreDependent(control, store) {
                    _super.call(this);
                    this.control = control;
                    this.store = store;
                }
                StoreDependent.prototype.visitInputs = function (visitor) {
                    this.control && visitor(this.control);
                    this.store && visitor(this.store);
                    this.loads && visitArrayInputs(this.loads, visitor);
                };
                return StoreDependent;
            })(Value);
            IR.StoreDependent = StoreDependent;
            StoreDependent.prototype.nodeName = "StoreDependent";
            var Call = (function (_super) {
                __extends(Call, _super);
                function Call(control, store, callee, object, args) {
                    _super.call(this, control, store);
                    this.callee = callee;
                    this.object = object;
                    this.args = args;
                }
                Call.prototype.visitInputs = function (visitor) {
                    this.control && visitor(this.control);
                    this.store && visitor(this.store);
                    this.loads && visitArrayInputs(this.loads, visitor);
                    visitor(this.callee);
                    this.object && visitor(this.object);
                    visitArrayInputs(this.args, visitor);
                };
                return Call;
            })(StoreDependent);
            IR.Call = Call;
            Call.prototype.nodeName = "Call";
            var New = (function (_super) {
                __extends(New, _super);
                function New(control, store, callee, args) {
                    _super.call(this, control, store);
                    this.callee = callee;
                    this.args = args;
                }
                New.prototype.visitInputs = function (visitor) {
                    this.control && visitor(this.control);
                    this.store && visitor(this.store);
                    this.loads && visitArrayInputs(this.loads, visitor);
                    visitor(this.callee);
                    visitArrayInputs(this.args, visitor);
                };
                return New;
            })(StoreDependent);
            IR.New = New;
            New.prototype.nodeName = "New";
            var GetProperty = (function (_super) {
                __extends(GetProperty, _super);
                function GetProperty(control, store, object, name) {
                    _super.call(this, control, store);
                    this.object = object;
                    this.name = name;
                }
                GetProperty.prototype.visitInputs = function (visitor) {
                    this.control && visitor(this.control);
                    this.store && visitor(this.store);
                    this.loads && visitArrayInputs(this.loads, visitor);
                    visitor(this.object);
                    visitor(this.name);
                };
                return GetProperty;
            })(StoreDependent);
            IR.GetProperty = GetProperty;
            GetProperty.prototype.nodeName = "GetProperty";
            var SetProperty = (function (_super) {
                __extends(SetProperty, _super);
                function SetProperty(control, store, object, name, value) {
                    _super.call(this, control, store);
                    this.object = object;
                    this.name = name;
                    this.value = value;
                }
                SetProperty.prototype.visitInputs = function (visitor) {
                    this.control && visitor(this.control);
                    this.store && visitor(this.store);
                    this.loads && visitArrayInputs(this.loads, visitor);
                    visitor(this.object);
                    visitor(this.name);
                    visitor(this.value);
                };
                return SetProperty;
            })(StoreDependent);
            IR.SetProperty = SetProperty;
            SetProperty.prototype.nodeName = "SetProperty";
            var DeleteProperty = (function (_super) {
                __extends(DeleteProperty, _super);
                function DeleteProperty(control, store, object, name) {
                    _super.call(this, control, store);
                    this.object = object;
                    this.name = name;
                }
                DeleteProperty.prototype.visitInputs = function (visitor) {
                    this.control && visitor(this.control);
                    this.store && visitor(this.store);
                    this.loads && visitArrayInputs(this.loads, visitor);
                    visitor(this.object);
                    visitor(this.name);
                };
                return DeleteProperty;
            })(StoreDependent);
            IR.DeleteProperty = DeleteProperty;
            DeleteProperty.prototype.nodeName = "DeleteProperty";
            var CallProperty = (function (_super) {
                __extends(CallProperty, _super);
                function CallProperty(control, store, object, name, args) {
                    _super.call(this, control, store);
                    this.object = object;
                    this.name = name;
                    this.args = args;
                }
                CallProperty.prototype.visitInputs = function (visitor) {
                    this.control && visitor(this.control);
                    this.store && visitor(this.store);
                    this.loads && visitArrayInputs(this.loads, visitor);
                    visitor(this.object);
                    visitor(this.name);
                    visitArrayInputs(this.args, visitor);
                };
                return CallProperty;
            })(StoreDependent);
            IR.CallProperty = CallProperty;
            CallProperty.prototype.nodeName = "CallProperty";
            var Phi = (function (_super) {
                __extends(Phi, _super);
                function Phi(control, value) {
                    _super.call(this);
                    this.control = control;
                    this.control = control;
                    this.args = value ? [value] : [];
                }
                Phi.prototype.visitInputs = function (visitor) {
                    this.control && visitor(this.control);
                    visitArrayInputs(this.args, visitor);
                };
                Phi.prototype.seal = function () {
                    this.sealed = true;
                };
                Phi.prototype.pushValue = function (x) {
                    release || assert(!this.sealed);
                    this.args.push(x);
                };
                return Phi;
            })(Value);
            IR.Phi = Phi;
            Phi.prototype.nodeName = "Phi";
            var Variable = (function (_super) {
                __extends(Variable, _super);
                function Variable(name) {
                    _super.call(this);
                    this.name = name;
                }
                return Variable;
            })(Value);
            IR.Variable = Variable;
            Variable.prototype.nodeName = "Variable";
            var Copy = (function (_super) {
                __extends(Copy, _super);
                function Copy(argument) {
                    _super.call(this);
                    this.argument = argument;
                }
                Copy.prototype.visitInputs = function (visitor) {
                    visitor(this.argument);
                };
                return Copy;
            })(Value);
            IR.Copy = Copy;
            Copy.prototype.nodeName = "Copy";
            var Move = (function (_super) {
                __extends(Move, _super);
                function Move(to, from) {
                    _super.call(this);
                    this.to = to;
                    this.from = from;
                }
                Move.prototype.visitInputs = function (visitor) {
                    visitor(this.to);
                    visitor(this.from);
                };
                return Move;
            })(Value);
            IR.Move = Move;
            Move.prototype.nodeName = "Move";
            (function (ProjectionType) {
                ProjectionType[ProjectionType["CASE"] = 0] = "CASE";
                ProjectionType[ProjectionType["TRUE"] = 1] = "TRUE";
                ProjectionType[ProjectionType["FALSE"] = 2] = "FALSE";
                ProjectionType[ProjectionType["STORE"] = 3] = "STORE";
                ProjectionType[ProjectionType["CONTEXT"] = 4] = "CONTEXT";
            })(IR.ProjectionType || (IR.ProjectionType = {}));
            var ProjectionType = IR.ProjectionType;
            var Projection = (function (_super) {
                __extends(Projection, _super);
                function Projection(argument, type, selector) {
                    _super.call(this);
                    this.argument = argument;
                    this.type = type;
                    this.selector = selector;
                }
                Projection.prototype.visitInputs = function (visitor) {
                    visitor(this.argument);
                };
                Projection.prototype.project = function () {
                    return this.argument;
                };
                return Projection;
            })(Value);
            IR.Projection = Projection;
            Projection.prototype.nodeName = "Projection";
            var Latch = (function (_super) {
                __extends(Latch, _super);
                function Latch(control, condition, left, right) {
                    _super.call(this);
                    this.control = control;
                    this.condition = condition;
                    this.left = left;
                    this.right = right;
                }
                Latch.prototype.visitInputs = function (visitor) {
                    this.control && visitor(this.control);
                    visitor(this.condition);
                    visitor(this.left);
                    visitor(this.right);
                };
                return Latch;
            })(Value);
            IR.Latch = Latch;
            Latch.prototype.nodeName = "Latch";
            var Operator = (function () {
                function Operator(name, evaluate, isBinary) {
                    this.name = name;
                    this.evaluate = evaluate;
                    this.isBinary = isBinary;
                    Operator.byName[name] = this;
                }
                Operator.linkOpposites = function (a, b) {
                    a.not = b;
                    b.not = a;
                };
                Operator.fromName = function (name) {
                    return Operator.byName[name];
                };
                Operator.byName = createEmptyObject();
                Operator.IADD = new Operator("+", function (l, r) { return (l + r) | 0; }, true);
                Operator.LADD = new Operator("+", function (l, r) { return l.add(r); }, true);
                Operator.FADD = new Operator("+", function (l, r) { return Math.fround(l + r); }, true);
                Operator.DADD = new Operator("+", function (l, r) { return +(l + r); }, true);
                Operator.ISUB = new Operator("-", function (l, r) { return (l - r) | 0; }, true);
                Operator.LSUB = new Operator("-", function (l, r) { return l.subtract(r); }, true);
                Operator.FSUB = new Operator("-", function (l, r) { return Math.fround(l - r); }, true);
                Operator.DSUB = new Operator("-", function (l, r) { return +(l - r); }, true);
                Operator.IMUL = new Operator("*", function (l, r) { return (l * r) | 0; }, true);
                Operator.LMUL = new Operator("*", function (l, r) { return l.multiply(r); }, true);
                Operator.FMUL = new Operator("*", function (l, r) { return Math.fround(l * r); }, true);
                Operator.DMUL = new Operator("*", function (l, r) { return +(l * r); }, true);
                Operator.IDIV = new Operator("/", function (l, r) { return (l / r) | 0; }, true);
                Operator.LDIV = new Operator("/", function (l, r) { return l.div(r); }, true);
                Operator.FDIV = new Operator("/", function (l, r) { return Math.fround(l / r); }, true);
                Operator.DDIV = new Operator("/", function (l, r) { return +(l / r); }, true);
                Operator.IREM = new Operator("%", function (l, r) { return (l % r) | 0; }, true);
                Operator.LREM = new Operator("%", function (l, r) { return l.modulo(r); }, true);
                Operator.FREM = new Operator("%", function (l, r) { return Math.fround(l % r); }, true);
                Operator.DREM = new Operator("%", function (l, r) { return +(l % r); }, true);
                Operator.INEG = new Operator("-", function (a) { return (-a) | 0; }, false);
                Operator.LNEG = new Operator("-", function (a) { return a.negate(); }, false);
                Operator.FNEG = new Operator("-", function (a) { return -a; }, false);
                Operator.DNEG = new Operator("-", function (a) { return -a; }, false);
                //    static ADD    = new Operator("+",   (l, r) => l + r,        true);
                //    static SUB    = new Operator("-",   (l, r) => l - r,        true);
                //    static MUL    = new Operator("*",   (l, r) => l * r,        true);
                //    static DIV    = new Operator("/",   (l, r) => l / r,        true);
                //    static MOD    = new Operator("%",   (l, r) => l % r,        true);
                Operator.AND = new Operator("&", function (l, r) { return l & r; }, true);
                Operator.OR = new Operator("|", function (l, r) { return l | r; }, true);
                Operator.XOR = new Operator("^", function (l, r) { return l ^ r; }, true);
                Operator.LSH = new Operator("<<", function (l, r) { return l << r; }, true);
                Operator.RSH = new Operator(">>", function (l, r) { return l >> r; }, true);
                Operator.URSH = new Operator(">>>", function (l, r) { return l >>> r; }, true);
                Operator.SEQ = new Operator("===", function (l, r) { return l === r; }, true);
                Operator.SNE = new Operator("!==", function (l, r) { return l !== r; }, true);
                Operator.EQ = new Operator("==", function (l, r) { return l == r; }, true);
                Operator.NE = new Operator("!=", function (l, r) { return l != r; }, true);
                Operator.LE = new Operator("<=", function (l, r) { return l <= r; }, true);
                Operator.GT = new Operator(">", function (l, r) { return l > r; }, true);
                Operator.LT = new Operator("<", function (l, r) { return l < r; }, true);
                Operator.GE = new Operator(">=", function (l, r) { return l >= r; }, true);
                Operator.PLUS = new Operator("+", function (a) { return +a; }, false);
                Operator.NEG = new Operator("-", function (a) { return -a; }, false);
                Operator.TRUE = new Operator("!!", function (a) { return !!a; }, false);
                Operator.FALSE = new Operator("!", function (a) { return !a; }, false);
                Operator.TYPE_OF = new Operator("typeof", function (a) { return typeof a; }, false);
                Operator.BITWISE_NOT = new Operator("~", function (a) { return ~a; }, false);
                return Operator;
            })();
            IR.Operator = Operator;
            Operator.linkOpposites(Operator.SEQ, Operator.SNE);
            Operator.linkOpposites(Operator.EQ, Operator.NE);
            Operator.linkOpposites(Operator.TRUE, Operator.FALSE);
            var Binary = (function (_super) {
                __extends(Binary, _super);
                function Binary(operator, left, right) {
                    _super.call(this);
                    this.operator = operator;
                    this.left = left;
                    this.right = right;
                }
                Binary.prototype.visitInputs = function (visitor) {
                    visitor(this.left);
                    visitor(this.right);
                };
                return Binary;
            })(Value);
            IR.Binary = Binary;
            Binary.prototype.nodeName = "Binary";
            var Unary = (function (_super) {
                __extends(Unary, _super);
                function Unary(operator, argument) {
                    _super.call(this);
                    this.operator = operator;
                    this.argument = argument;
                }
                Unary.prototype.visitInputs = function (visitor) {
                    visitor(this.argument);
                };
                return Unary;
            })(Value);
            IR.Unary = Unary;
            Unary.prototype.nodeName = "Unary";
            var Constant = (function (_super) {
                __extends(Constant, _super);
                function Constant(value) {
                    _super.call(this);
                    this.value = value;
                }
                return Constant;
            })(Value);
            IR.Constant = Constant;
            Constant.prototype.nodeName = "Constant";
            var GlobalProperty = (function (_super) {
                __extends(GlobalProperty, _super);
                function GlobalProperty(name) {
                    _super.call(this);
                    this.name = name;
                }
                return GlobalProperty;
            })(Value);
            IR.GlobalProperty = GlobalProperty;
            GlobalProperty.prototype.nodeName = "GlobalProperty";
            var This = (function (_super) {
                __extends(This, _super);
                function This(control) {
                    _super.call(this);
                    this.control = control;
                }
                This.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                };
                return This;
            })(Value);
            IR.This = This;
            This.prototype.nodeName = "This";
            var Throw = (function (_super) {
                __extends(Throw, _super);
                function Throw(control, argument) {
                    _super.call(this);
                    this.control = control;
                    this.argument = argument;
                }
                Throw.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                    visitor(this.argument);
                };
                return Throw;
            })(Value);
            IR.Throw = Throw;
            Throw.prototype.nodeName = "Throw";
            var Arguments = (function (_super) {
                __extends(Arguments, _super);
                function Arguments(control) {
                    _super.call(this);
                    this.control = control;
                }
                Arguments.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                };
                return Arguments;
            })(Value);
            IR.Arguments = Arguments;
            Arguments.prototype.nodeName = "Arguments";
            var Parameter = (function (_super) {
                __extends(Parameter, _super);
                function Parameter(control, index, name) {
                    _super.call(this);
                    this.control = control;
                    this.index = index;
                    this.name = name;
                }
                Parameter.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                };
                return Parameter;
            })(Value);
            IR.Parameter = Parameter;
            Parameter.prototype.nodeName = "Parameter";
            var NewArray = (function (_super) {
                __extends(NewArray, _super);
                function NewArray(control, elements) {
                    _super.call(this);
                    this.control = control;
                    this.elements = elements;
                }
                NewArray.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                    visitArrayInputs(this.elements, visitor);
                };
                return NewArray;
            })(Value);
            IR.NewArray = NewArray;
            NewArray.prototype.nodeName = "NewArray";
            var NewObject = (function (_super) {
                __extends(NewObject, _super);
                function NewObject(control, properties) {
                    _super.call(this);
                    this.control = control;
                    this.properties = properties;
                }
                NewObject.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                    visitArrayInputs(this.properties, visitor);
                };
                return NewObject;
            })(Value);
            IR.NewObject = NewObject;
            NewObject.prototype.nodeName = "NewObject";
            var KeyValuePair = (function (_super) {
                __extends(KeyValuePair, _super);
                function KeyValuePair(key, value) {
                    _super.call(this);
                    this.key = key;
                    this.value = value;
                }
                KeyValuePair.prototype.visitInputs = function (visitor) {
                    visitor(this.key);
                    visitor(this.value);
                };
                return KeyValuePair;
            })(Value);
            IR.KeyValuePair = KeyValuePair;
            KeyValuePair.prototype.mustFloat = true;
            KeyValuePair.prototype.nodeName = "KeyValuePair";
            function nameOf(node) {
                var useColors = false;
                var result;
                var m = J2ME.StringUtilities;
                if (node instanceof Constant) {
                    return J2ME.kindCharacter(node.kind) + node.value;
                }
                else if (node instanceof Variable) {
                    return node.name;
                }
                else if (node instanceof Parameter) {
                    return node.name;
                }
                else if (node instanceof Phi) {
                    return result = m.concat3("|", node.id, "|"), useColors ? m.concat3(J2ME.IndentingWriter.PURPLE, result, J2ME.IndentingWriter.ENDC) : result;
                }
                else if (node instanceof Control) {
                    return result = m.concat3("{", node.id, "}"), useColors ? m.concat3(J2ME.IndentingWriter.RED, result, J2ME.IndentingWriter.ENDC) : result;
                }
                else if (node instanceof Projection) {
                    if (node.type === 3 /* STORE */) {
                        return result = m.concat5("[", node.id, "->", node.argument.id, "]"), useColors ? m.concat3(J2ME.IndentingWriter.YELLOW, result, J2ME.IndentingWriter.ENDC) : result;
                    }
                    return result = m.concat3("(", node.id, ")"), useColors ? m.concat3(J2ME.IndentingWriter.GREEN, result, J2ME.IndentingWriter.ENDC) : result;
                }
                else if (node instanceof Value) {
                    return result = m.concat3("(", node.id, ")"), useColors ? m.concat3(J2ME.IndentingWriter.GREEN, result, J2ME.IndentingWriter.ENDC) : result;
                }
                else if (node instanceof Node) {
                    return node.id;
                }
                unexpected(node + " " + typeof node);
            }
            IR.nameOf = nameOf;
        })(IR = C4.IR || (C4.IR = {}));
    })(C4 = J2ME.C4 || (J2ME.C4 = {}));
})(J2ME || (J2ME = {}));
/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var J2ME;
(function (J2ME) {
    var C4;
    (function (C4) {
        var IR;
        (function (IR) {
            var assert = J2ME.Debug.assert;
            var unexpected = J2ME.Debug.unexpected;
            var top = J2ME.ArrayUtilities.top;
            var bitCount = J2ME.IntegerUtilities.bitCount;
            var pushUnique = J2ME.ArrayUtilities.pushUnique;
            var unique = J2ME.ArrayUtilities.unique;
            var debug = false;
            function toID(node) {
                return node.id;
            }
            function visitNothing() {
            }
            function isNotPhi(phi) {
                return !isPhi(phi);
            }
            IR.isNotPhi = isNotPhi;
            function isPhi(phi) {
                return phi instanceof IR.Phi;
            }
            IR.isPhi = isPhi;
            //  export function isScope(scope) {
            //    return isPhi(scope) || scope instanceof ASScope || isProjection(scope, ProjectionType.SCOPE);
            //  }
            //  export function isMultinameConstant(node) {
            //    return node instanceof Constant && node.value instanceof Multiname;
            //  }
            //
            //  export function isMultiname(name) {
            //    return isMultinameConstant(name) || name instanceof ASMultiname;
            //  }
            function isStore(store) {
                return isPhi(store) || store instanceof IR.Store || isProjection(store, 3 /* STORE */);
            }
            IR.isStore = isStore;
            function isConstant(constant) {
                return constant instanceof IR.Constant;
            }
            IR.isConstant = isConstant;
            function isBoolean(value) {
                return value === true || value === false;
            }
            function isControlOrNull(control) {
                return isControl(control) || control === null;
            }
            IR.isControlOrNull = isControlOrNull;
            function isStoreOrNull(store) {
                return isStore(store) || store === null;
            }
            IR.isStoreOrNull = isStoreOrNull;
            function isControl(control) {
                return control instanceof IR.Control;
            }
            IR.isControl = isControl;
            function isValueOrNull(value) {
                return isValue(value) || value === null;
            }
            IR.isValueOrNull = isValueOrNull;
            function isValue(value) {
                return value instanceof IR.Value;
            }
            IR.isValue = isValue;
            function isProjection(node, type) {
                return node instanceof IR.Projection && (!type || node.type === type);
            }
            IR.isProjection = isProjection;
            function followProjection(node) {
                return node instanceof IR.Projection ? node.project() : node;
            }
            IR.Null = new IR.Constant(null);
            IR.Undefined = new IR.Constant(undefined);
            IR.True = new IR.Constant(true);
            IR.False = new IR.Constant(false);
            var Block = (function () {
                function Block(id, start, end) {
                    this.id = id;
                    this.nodes = [start, end];
                    this.region = start;
                    this.successors = [];
                    this.predecessors = [];
                }
                Block.prototype.pushSuccessorAt = function (successor, index, pushPredecessor) {
                    release || assert(successor);
                    release || assert(!this.successors[index]);
                    this.successors[index] = successor;
                    if (pushPredecessor) {
                        successor.pushPredecessor(this);
                    }
                };
                Block.prototype.pushSuccessor = function (successor, pushPredecessor) {
                    release || assert(successor);
                    this.successors.push(successor);
                    if (pushPredecessor) {
                        successor.pushPredecessor(this);
                    }
                };
                Block.prototype.pushPredecessor = function (predecessor) {
                    release || assert(predecessor);
                    this.predecessors.push(predecessor);
                };
                Block.prototype.visitNodes = function (fn) {
                    var nodes = this.nodes;
                    for (var i = 0, j = nodes.length; i < j; i++) {
                        fn(nodes[i]);
                    }
                };
                Block.prototype.visitSuccessors = function (fn) {
                    var successors = this.successors;
                    for (var i = 0, j = successors.length; i < j; i++) {
                        fn(successors[i]);
                    }
                };
                Block.prototype.visitPredecessors = function (fn) {
                    var predecessors = this.predecessors;
                    for (var i = 0, j = predecessors.length; i < j; i++) {
                        fn(predecessors[i]);
                    }
                };
                Block.prototype.append = function (node) {
                    release || assert(this.nodes.length >= 2);
                    release || assert(isValue(node), node);
                    release || assert(isNotPhi(node));
                    release || assert(this.nodes.indexOf(node) < 0);
                    if (node.mustFloat) {
                        return;
                    }
                    this.nodes.splice(this.nodes.length - 1, 0, node);
                };
                Block.prototype.toString = function () {
                    return "B" + this.id + (this.name ? " (" + this.name + ")" : "");
                };
                Block.prototype.trace = function (writer) {
                    writer.writeLn(this.toString());
                };
                return Block;
            })();
            IR.Block = Block;
            var DFG = (function () {
                function DFG(exit) {
                    this.exit = exit;
                    this.exit = exit;
                }
                DFG.prototype.buildCFG = function () {
                    return CFG.fromDFG(this);
                };
                DFG.preOrderDepthFirstSearch = function (root, visitChildren, pre) {
                    var visited = [];
                    var worklist = [root];
                    var push = worklist.push.bind(worklist);
                    var node;
                    while ((node = worklist.pop())) {
                        if (visited[node.id] === 1) {
                            continue;
                        }
                        visited[node.id] = 1;
                        pre(node);
                        worklist.push(node);
                        visitChildren(node, push);
                    }
                };
                DFG.postOrderDepthFirstSearch = function (root, visitChildren, post) {
                    var ONE_TIME = 1, MANY_TIMES = 2;
                    var visited = [];
                    var worklist = [root];
                    function visitChild(child) {
                        if (!visited[child.id]) {
                            worklist.push(child);
                        }
                    }
                    var node;
                    while ((node = top(worklist))) {
                        if (visited[node.id]) {
                            if (visited[node.id] === ONE_TIME) {
                                visited[node.id] = MANY_TIMES;
                                post(node);
                            }
                            worklist.pop();
                            continue;
                        }
                        visited[node.id] = ONE_TIME;
                        visitChildren(node, visitChild);
                    }
                };
                DFG.prototype.forEachInPreOrderDepthFirstSearch = function (visitor) {
                    var visited = new Array(1024);
                    var worklist = [this.exit];
                    function push(node) {
                        if (isConstant(node)) {
                            return;
                        }
                        release || assert(node instanceof IR.Node);
                        worklist.push(node);
                    }
                    var node;
                    while ((node = worklist.pop())) {
                        if (visited[node.id]) {
                            continue;
                        }
                        visited[node.id] = 1;
                        visitor && visitor(node);
                        worklist.push(node);
                        node.visitInputs(push);
                    }
                };
                DFG.prototype.forEach = function (visitor, postOrder) {
                    var search = postOrder ? DFG.postOrderDepthFirstSearch : DFG.preOrderDepthFirstSearch;
                    search(this.exit, function (node, v) {
                        node.visitInputsNoConstants(v);
                    }, visitor);
                };
                DFG.prototype.traceMetrics = function (writer) {
                    var counter = new J2ME.Metrics.Counter(true);
                    DFG.preOrderDepthFirstSearch(this.exit, function (node, visitor) {
                        node.visitInputsNoConstants(visitor);
                    }, function (node) {
                        countTimeline(node.nodeName);
                    });
                    counter.trace(writer);
                };
                DFG.prototype.trace = function (writer) {
                    var nodes = [];
                    var visited = {};
                    function colorOf(node) {
                        if (node instanceof IR.Control) {
                            return "yellow";
                        }
                        else if (node instanceof IR.Phi) {
                            return "purple";
                        }
                        else if (node instanceof IR.Value) {
                            return "green";
                        }
                        return "white";
                    }
                    var blocks = [];
                    function followProjection(node) {
                        return node instanceof IR.Projection ? node.project() : node;
                    }
                    function next(node) {
                        node = followProjection(node);
                        if (!visited[node.id]) {
                            visited[node.id] = true;
                            var control = node;
                            if (control.block) {
                                blocks.push(control.block);
                            }
                            nodes.push(node);
                            node.visitInputsNoConstants(next);
                        }
                    }
                    next(this.exit);
                    writer.writeLn("");
                    writer.enter("digraph DFG {");
                    writer.writeLn("graph [bgcolor = gray10];");
                    writer.writeLn("edge [color = white];");
                    writer.writeLn("node [shape = box, fontname = Consolas, fontsize = 11, color = white, fontcolor = white];");
                    writer.writeLn("rankdir = BT;");
                    function writeNode(node) {
                        writer.writeLn("N" + node.id + " [label = \"" + node.toString() + "\", color = \"" + colorOf(node) + "\"];");
                    }
                    function defineNode(node) {
                        writer.writeLn("N" + node.id + ";");
                    }
                    blocks.forEach(function (block) {
                        writer.enter("subgraph cluster" + block.nodes[0].id + " { bgcolor = gray20;");
                        block.visitNodes(function (node) {
                            defineNode(followProjection(node));
                        });
                        writer.leave("}");
                    });
                    nodes.forEach(writeNode);
                    nodes.forEach(function (node) {
                        node.visitInputsNoConstants(function (input) {
                            input = followProjection(input);
                            writer.writeLn("N" + node.id + " -> " + "N" + input.id + " [color=" + colorOf(input) + "];");
                        });
                    });
                    writer.leave("}");
                    writer.writeLn("");
                };
                return DFG;
            })();
            IR.DFG = DFG;
            var Uses = (function () {
                function Uses() {
                    this.entries = [];
                }
                Uses.prototype.addUse = function (def, use) {
                    var entry = this.entries[def.id];
                    if (!entry) {
                        entry = this.entries[def.id] = { def: def, uses: [] };
                    }
                    pushUnique(entry.uses, use);
                };
                Uses.prototype.trace = function (writer) {
                    writer.enter("> Uses");
                    this.entries.forEach(function (entry) {
                        writer.writeLn(entry.def.id + " -> [" + entry.uses.map(toID).join(", ") + "] " + entry.def);
                    });
                    writer.leave("<");
                };
                Uses.prototype.replace = function (def, value) {
                    var entry = this.entries[def.id];
                    if (entry.uses.length === 0) {
                        return false;
                    }
                    var count = 0;
                    entry.uses.forEach(function (use) {
                        count += use.replaceInput(def, value);
                    });
                    release || assert(count >= entry.uses.length);
                    entry.uses = [];
                    return true;
                };
                Uses.prototype.updateUses = function (def, value, useEntries, writer) {
                    debug && writer.writeLn("Update " + def + " with " + value);
                    var entry = useEntries[def.id];
                    if (entry.uses.length === 0) {
                        return false;
                    }
                    debug && writer.writeLn("Replacing: " + def.id + " in [" + entry.uses.map(toID).join(", ") + "] with " + value.id);
                    var count = 0;
                    entry.uses.forEach(function (use) {
                        count += use.replaceInput(def, value);
                    });
                    release || assert(count >= entry.uses.length);
                    entry.uses = [];
                    return true;
                };
                return Uses;
            })();
            IR.Uses = Uses;
            var CFG = (function () {
                function CFG() {
                    this.nextBlockID = 0;
                    this.blocks = [];
                }
                CFG.fromDFG = function (dfg) {
                    var cfg = new CFG();
                    release || assert(dfg && dfg instanceof DFG);
                    cfg.dfg = dfg;
                    var visited = [];
                    function buildEnd(end) {
                        if (end instanceof IR.Projection) {
                            end = end.project();
                        }
                        release || assert(end instanceof IR.End || end instanceof IR.Start, end);
                        if (visited[end.id]) {
                            return;
                        }
                        visited[end.id] = true;
                        var start = end.control;
                        if (!(start instanceof IR.Region)) {
                            start = end.control = new IR.Region(start);
                        }
                        var block = start.block = cfg.buildBlock(start, end);
                        if (start instanceof IR.Start) {
                            cfg.root = block;
                        }
                        for (var i = 0; i < start.predecessors.length; i++) {
                            var c = start.predecessors[i];
                            var d;
                            var trueProjection = false;
                            if (c instanceof IR.Projection) {
                                d = c.project();
                                trueProjection = c.type === 1 /* TRUE */;
                            }
                            else {
                                d = c;
                            }
                            if (d instanceof IR.Region) {
                                d = new IR.Jump(c);
                                d = new IR.Projection(d, 1 /* TRUE */);
                                start.predecessors[i] = d;
                                d = d.project();
                                trueProjection = true;
                            }
                            buildEnd(d);
                            var controlBlock = d.control.block;
                            if (d instanceof IR.Switch) {
                                release || assert(isProjection(c, 0 /* CASE */));
                                controlBlock.pushSuccessorAt(block, c.selector.value, true);
                            }
                            else if (trueProjection && controlBlock.successors.length > 0) {
                                controlBlock.pushSuccessor(block, true);
                                controlBlock.hasFlippedSuccessors = true;
                            }
                            else {
                                controlBlock.pushSuccessor(block, true);
                            }
                        }
                    }
                    buildEnd(dfg.exit);
                    cfg.splitCriticalEdges();
                    cfg.exit = dfg.exit.control.block;
                    cfg.computeDominators(true);
                    return cfg;
                };
                /**
                 * Makes sure root node has no predecessors and that there is only one
                 * exit node.
                 */
                CFG.prototype.buildRootAndExit = function () {
                    release || assert(!this.root && !this.exit);
                    // Create new root node if the root node has predecessors.
                    if (this.blocks[0].predecessors.length > 0) {
                        this.root = new Block(this.nextBlockID++);
                        this.blocks.push(this.root);
                        this.root.pushSuccessor(this.blocks[0], true);
                    }
                    else {
                        this.root = this.blocks[0];
                    }
                    var exitBlocks = [];
                    for (var i = 0; i < this.blocks.length; i++) {
                        var block = this.blocks[i];
                        if (block.successors.length === 0) {
                            exitBlocks.push(block);
                        }
                    }
                    if (exitBlocks.length === 0) {
                        unexpected("Must have an exit block.");
                    }
                    else if (exitBlocks.length === 1 && exitBlocks[0] !== this.root) {
                        this.exit = exitBlocks[0];
                    }
                    else {
                        // Create new exit block to merge flow.
                        this.exit = new Block(this.nextBlockID++);
                        this.blocks.push(this.exit);
                        for (var i = 0; i < exitBlocks.length; i++) {
                            exitBlocks[i].pushSuccessor(this.exit, true);
                        }
                    }
                    release || assert(this.root && this.exit);
                    release || assert(this.root !== this.exit);
                };
                CFG.prototype.buildBlock = function (start, end) {
                    var block = new Block(this.nextBlockID++, start, end);
                    this.blocks.push(block);
                    return block;
                };
                CFG.prototype.createBlockSet = function () {
                    if (!this.setConstructor) {
                        this.setConstructor = J2ME.BitSets.BitSetFunctor(this.blocks.length);
                    }
                    return new this.setConstructor();
                };
                CFG.prototype.computeReversePostOrder = function () {
                    if (this.order) {
                        return this.order;
                    }
                    var order = this.order = [];
                    this.depthFirstSearch(null, order.push.bind(order));
                    order.reverse();
                    for (var i = 0; i < order.length; i++) {
                        order[i].rpo = i;
                    }
                    return order;
                };
                CFG.prototype.depthFirstSearch = function (preFn, postFn) {
                    var visited = this.createBlockSet();
                    function visit(node) {
                        visited.set(node.id);
                        if (preFn)
                            preFn(node);
                        var successors = node.successors;
                        for (var i = 0, j = successors.length; i < j; i++) {
                            var s = successors[i];
                            if (!visited.get(s.id)) {
                                visit(s);
                            }
                        }
                        if (postFn)
                            postFn(node);
                    }
                    visit(this.root);
                };
                CFG.prototype.computeDominators = function (apply) {
                    release || assert(this.root.predecessors.length === 0, "Root node " + this.root + " must not have predecessors.");
                    var dom = new Int32Array(this.blocks.length);
                    for (var i = 0; i < dom.length; i++) {
                        dom[i] = -1;
                    }
                    var map = this.createBlockSet();
                    function computeCommonDominator(a, b) {
                        map.clearAll();
                        while (a >= 0) {
                            map.set(a);
                            a = dom[a];
                        }
                        while (b >= 0 && !map.get(b)) {
                            b = dom[b];
                        }
                        return b;
                    }
                    function computeDominator(blockID, parentID) {
                        if (dom[blockID] < 0) {
                            dom[blockID] = parentID;
                        }
                        else {
                            dom[blockID] = computeCommonDominator(dom[blockID], parentID);
                        }
                    }
                    this.depthFirstSearch(function visit(block) {
                        var s = block.successors;
                        for (var i = 0, j = s.length; i < j; i++) {
                            computeDominator(s[i].id, block.id);
                        }
                    });
                    if (apply) {
                        for (var i = 0, j = this.blocks.length; i < j; i++) {
                            this.blocks[i].dominator = this.blocks[dom[i]];
                        }
                        function computeDominatorDepth(block) {
                            var dominatorDepth;
                            if (block.dominatorDepth !== undefined) {
                                return block.dominatorDepth;
                            }
                            else if (!block.dominator) {
                                dominatorDepth = 0;
                            }
                            else {
                                dominatorDepth = computeDominatorDepth(block.dominator) + 1;
                            }
                            return block.dominatorDepth = dominatorDepth;
                        }
                        for (var i = 0, j = this.blocks.length; i < j; i++) {
                            computeDominatorDepth(this.blocks[i]);
                        }
                    }
                    return dom;
                };
                CFG.prototype.computeLoops = function () {
                    var active = this.createBlockSet();
                    var visited = this.createBlockSet();
                    var nextLoop = 0;
                    function makeLoopHeader(block) {
                        if (!block.isLoopHeader) {
                            release || assert(nextLoop < 32, "Can't handle too many loops, fall back on BitMaps if it's a problem.");
                            block.isLoopHeader = true;
                            block.loops = 1 << nextLoop;
                            nextLoop += 1;
                        }
                        release || assert(bitCount(block.loops) === 1);
                    }
                    function visit(block) {
                        if (visited.get(block.id)) {
                            if (active.get(block.id)) {
                                makeLoopHeader(block);
                            }
                            return block.loops;
                        }
                        visited.set(block.id);
                        active.set(block.id);
                        var loops = 0;
                        for (var i = 0, j = block.successors.length; i < j; i++) {
                            loops |= visit(block.successors[i]);
                        }
                        if (block.isLoopHeader) {
                            release || assert(bitCount(block.loops) === 1);
                            loops &= ~block.loops;
                        }
                        block.loops = loops;
                        active.clear(block.id);
                        return loops;
                    }
                    var loop = visit(this.root);
                    release || assert(loop === 0);
                };
                /**
                 * Computes def-use chains.
                 *
                 * () -> Map[id -> {def:Node, uses:Array[Node]}]
                 */
                CFG.prototype.computeUses = function () {
                    J2ME.enterTimeline("computeUses");
                    var writer = debug && new J2ME.IndentingWriter();
                    debug && writer.enter("> Compute Uses");
                    var dfg = this.dfg;
                    var uses = new Uses();
                    dfg.forEachInPreOrderDepthFirstSearch(function (use) {
                        use.visitInputs(function (def) {
                            uses.addUse(def, use);
                        });
                    });
                    if (debug) {
                        writer.enter("> Uses");
                        uses.entries.forEach(function (entry) {
                            writer.writeLn(entry.def.id + " -> [" + entry.uses.map(toID).join(", ") + "] " + entry.def);
                        });
                        writer.leave("<");
                        writer.leave("<");
                    }
                    J2ME.leaveTimeline();
                    return uses;
                };
                CFG.prototype.verify = function () {
                    var writer = debug && new J2ME.IndentingWriter();
                    debug && writer.enter("> Verify");
                    var order = this.computeReversePostOrder();
                    order.forEach(function (block) {
                        if (block.phis) {
                            block.phis.forEach(function (phi) {
                                release || assert(phi.control === block.region);
                                release || assert(phi.args.length === block.predecessors.length);
                            });
                        }
                    });
                    debug && writer.leave("<");
                };
                /**
                 * Simplifies phis of the form:
                 *
                 * replace |x = phi(y)| -> y
                 * replace |x = phi(x, y)| -> y
                 * replace |x = phi(y, y, x, y, x)| -> |phi(y, x)| -> y
                 */
                CFG.prototype.optimizePhis = function () {
                    var writer = debug && new J2ME.IndentingWriter();
                    debug && writer.enter("> Optimize Phis");
                    var phis = [];
                    var useEntries = this.computeUses().entries;
                    useEntries.forEach(function (entry) {
                        if (isPhi(entry.def)) {
                            phis.push(entry.def);
                        }
                    });
                    debug && writer.writeLn("Trying to optimize " + phis.length + " phis.");
                    /**
                     * Updates all uses to a new definition. Returns true if anything was updated.
                     */
                    function updateUses(def, value) {
                        debug && writer.writeLn("Update " + def + " with " + value);
                        var entry = useEntries[def.id];
                        if (entry.uses.length === 0) {
                            return false;
                        }
                        debug && writer.writeLn("Replacing: " + def.id + " in [" + entry.uses.map(toID).join(", ") + "] with " + value.id);
                        var count = 0;
                        var entryUses = entry.uses;
                        for (var i = 0, j = entryUses.length; i < j; i++) {
                            count += entryUses[i].replaceInput(def, value);
                        }
                        release || assert(count >= entry.uses.length);
                        entry.uses = [];
                        return true;
                    }
                    function simplify(phi, args) {
                        args = unique(args);
                        if (args.length === 1) {
                            // x = phi(y) -> y
                            return args[0];
                        }
                        else {
                            if (args.length === 2) {
                                // x = phi(y, x) -> y
                                if (args[0] === phi) {
                                    return args[1];
                                }
                                else if (args[1] === phi) {
                                    return args[0];
                                }
                                return phi;
                            }
                        }
                        return phi;
                    }
                    var count = 0;
                    var iterations = 0;
                    var changed = true;
                    while (changed) {
                        iterations++;
                        changed = false;
                        phis.forEach(function (phi) {
                            var value = simplify(phi, phi.args);
                            if (value !== phi) {
                                if (updateUses(phi, value)) {
                                    changed = true;
                                    count++;
                                }
                            }
                        });
                    }
                    if (debug) {
                        writer.writeLn("Simplified " + count + " phis, in " + iterations + " iterations.");
                        writer.leave("<");
                    }
                };
                /**
                 * "A critical edge is an edge which is neither the only edge leaving its source block, nor the only edge entering
                 * its destination block. These edges must be split: a new block must be created in the middle of the edge, in order
                 * to insert computations on the edge without affecting any other edges." - Wikipedia
                 */
                CFG.prototype.splitCriticalEdges = function () {
                    var writer = debug && new J2ME.IndentingWriter();
                    var blocks = this.blocks;
                    var criticalEdges = [];
                    debug && writer.enter("> Splitting Critical Edges");
                    for (var i = 0; i < blocks.length; i++) {
                        var successors = blocks[i].successors;
                        if (successors.length > 1) {
                            for (var j = 0; j < successors.length; j++) {
                                if (successors[j].predecessors.length > 1) {
                                    criticalEdges.push({ from: blocks[i], to: successors[j] });
                                }
                            }
                        }
                    }
                    var criticalEdgeCount = criticalEdges.length;
                    if (criticalEdgeCount && debug) {
                        writer.writeLn("Splitting: " + criticalEdgeCount);
                        this.trace(writer);
                    }
                    var edge;
                    while ((edge = criticalEdges.pop())) {
                        var fromIndex = edge.from.successors.indexOf(edge.to);
                        var toIndex = edge.to.predecessors.indexOf(edge.from);
                        release || assert(fromIndex >= 0 && toIndex >= 0);
                        debug && writer.writeLn("Splitting critical edge: " + edge.from + " -> " + edge.to);
                        var toBlock = edge.to;
                        var toRegion = toBlock.region;
                        var control = toRegion.predecessors[toIndex];
                        var region = new IR.Region(control);
                        var jump = new IR.Jump(region);
                        var block = this.buildBlock(region, jump);
                        toRegion.predecessors[toIndex] = new IR.Projection(jump, 1 /* TRUE */);
                        var fromBlock = edge.from;
                        fromBlock.successors[fromIndex] = block;
                        block.pushPredecessor(fromBlock);
                        block.pushSuccessor(toBlock);
                        toBlock.predecessors[toIndex] = block;
                    }
                    if (criticalEdgeCount && debug) {
                        this.trace(writer);
                    }
                    if (criticalEdgeCount && !release) {
                        release || assert(this.splitCriticalEdges() === 0);
                    }
                    debug && writer.leave("<");
                    return criticalEdgeCount;
                };
                /**
                 * Allocate virtual registers and break out of SSA.
                 */
                CFG.prototype.allocateVariables = function () {
                    var writer = debug && new J2ME.IndentingWriter();
                    var uses = this.computeUses();
                    debug && writer.enter("> Allocating Virtual Registers");
                    var order = this.computeReversePostOrder();
                    function allocate(node) {
                        if (isProjection(node, 3 /* STORE */)) {
                            return;
                        }
                        //if (!uses[node.id]) {
                        //  return;
                        //}
                        if (node instanceof IR.SetProperty) {
                            return;
                        }
                        if (node instanceof IR.Value) {
                            node.variable = new IR.Variable("v" + node.id);
                            debug && writer.writeLn("Allocated: " + node.variable + " to " + node);
                        }
                    }
                    order.forEach(function (block) {
                        block.nodes.forEach(allocate);
                        if (block.phis) {
                            block.phis.forEach(allocate);
                        }
                    });
                    /**
                     * To break out of SSA form we need to emit moves in the phi's predecessor blocks. Here we
                     * collect the set of all moves in |blockMoves| : Map[id -> Array[Move]]
                     *
                     * The moves actually need to be emitted along the phi's predecessor edges. Emitting them in the
                     * predecessor blocks is only correct in the absence of CFG critical edges.
                     */
                    var blockMoves = [];
                    for (var i = 0; i < order.length; i++) {
                        var block = order[i];
                        var phis = block.phis;
                        var predecessors = block.predecessors;
                        if (phis) {
                            for (var j = 0; j < phis.length; j++) {
                                var phi = phis[j];
                                debug && writer.writeLn("Emitting moves for: " + phi);
                                var arguments = phi.args;
                                release || assert(predecessors.length === arguments.length);
                                for (var k = 0; k < predecessors.length; k++) {
                                    var predecessor = predecessors[k];
                                    var argument = arguments[k];
                                    if (argument.abstract || isProjection(argument, 3 /* STORE */)) {
                                        continue;
                                    }
                                    var moves = blockMoves[predecessor.id] || (blockMoves[predecessor.id] = []);
                                    argument = argument.variable || argument;
                                    if (phi.variable !== argument) {
                                        moves.push(new IR.Move(phi.variable, argument));
                                    }
                                }
                            }
                        }
                    }
                    /**
                     * All move instructions must execute simultaneously. Since there may be dependencies between
                     * source and destination operands we need to sort moves topologically. This is not always
                     * possible because of cyclic dependencies. In such cases break the cycles using temporaries.
                     *
                     * Simplest example where this happens:
                     *   var a, b, t;
                     *   while (true) {
                     *     t = a; a = b; b = t;
                     *   }
                     */
                    var blocks = this.blocks;
                    blockMoves.forEach(function (moves, blockID) {
                        var block = blocks[blockID];
                        var temporary = 0;
                        debug && writer.writeLn(block + " Moves: " + moves);
                        while (moves.length) {
                            for (var i = 0; i < moves.length; i++) {
                                var move = moves[i];
                                for (var j = 0; j < moves.length; j++) {
                                    if (i === j) {
                                        continue;
                                    }
                                    if (moves[j].from === move.to) {
                                        move = null;
                                        break;
                                    }
                                }
                                if (move) {
                                    moves.splice(i--, 1);
                                    block.append(move);
                                }
                            }
                            if (moves.length) {
                                // We have a cycle, break it with a temporary.
                                debug && writer.writeLn("Breaking Cycle");
                                // 1. Pick any move.
                                var move = moves[0];
                                // 2. Emit a move to save its destination in a temporary.
                                var temp = new IR.Variable("t" + temporary++);
                                blocks[blockID].append(new IR.Move(temp, move.to));
                                for (var i = 1; i < moves.length; i++) {
                                    if (moves[i].from === move.to) {
                                        moves[i].from = temp;
                                    }
                                }
                            }
                        }
                    });
                    debug && writer.leave("<");
                };
                CFG.prototype.scheduleEarly = function () {
                    var debugScheduler = false;
                    var writer = debugScheduler && new J2ME.IndentingWriter();
                    debugScheduler && writer.enter("> Schedule Early");
                    var cfg = this;
                    var dfg = this.dfg;
                    var scheduled = [];
                    var roots = [];
                    dfg.forEachInPreOrderDepthFirstSearch(function (node) {
                        if (node instanceof IR.Region || node instanceof IR.Jump) {
                            return;
                        }
                        if (node.control) {
                            roots.push(node);
                        }
                        if (isPhi(node)) {
                            var phi = node;
                            /**
                             * When breaking out of SSA, move instructions need to have non-floating source nodes. Otherwise
                             * the topological sorting of moves gets more complicated, especially when cyclic dependencies
                             * are involved. Here we just mark all floating inputs of phi nodes as non-floating which forces
                             * them to get scheduled.
                             *
                             * TODO: Find out if this requirement is too expensive. We can make the move insertion algorithm
                             * more intelligent so that it walks the inputs of floating nodes when looking for dependencies.
                             */
                            phi.args.forEach(function (input) {
                                if (shouldFloat(input)) {
                                    input.mustNotFloat = true;
                                }
                            });
                        }
                    });
                    if (debugScheduler) {
                        roots.forEach(function (node) {
                            writer && writer.writeLn("Root: " + node);
                        });
                    }
                    for (var i = 0; i < roots.length; i++) {
                        var root = roots[i];
                        if (root instanceof IR.Phi) {
                            var block = root.control.block;
                            (block.phis || (block.phis = [])).push(root);
                        }
                        if (root.control) {
                            schedule(root);
                        }
                    }
                    function isScheduled(node) {
                        return scheduled[node.id];
                    }
                    function shouldFloat(node) {
                        if (node.mustNotFloat || node.shouldNotFloat) {
                            return false;
                        }
                        if (node.mustFloat || node.shouldFloat) {
                            return true;
                        }
                        if (node instanceof IR.Parameter || node instanceof IR.This || node instanceof IR.Arguments) {
                            return true;
                        }
                        return node instanceof IR.Binary || node instanceof IR.Unary || node instanceof IR.Parameter;
                    }
                    function append(node) {
                        release || assert(!isScheduled(node), "Already scheduled " + node);
                        scheduled[node.id] = true;
                        release || assert(node.control, node);
                        if (shouldFloat(node)) {
                        }
                        else {
                            node.control.block.append(node);
                        }
                    }
                    function scheduleIn(node, region) {
                        release || assert(!node.control, node);
                        release || assert(!isScheduled(node));
                        release || assert(region);
                        debugScheduler && writer.writeLn("Scheduled: " + node + " in " + region);
                        node.control = region;
                        append(node);
                    }
                    function schedule(node) {
                        debugScheduler && writer.enter("> Schedule: " + node);
                        var inputs = [];
                        // node.checkInputVisitors();
                        node.visitInputs(function (input) {
                            if (isConstant(input)) {
                                {
                                    return;
                                }
                            }
                            if (isValue(input)) {
                                inputs.push(followProjection(input));
                            }
                        });
                        debugScheduler && writer.writeLn("Inputs: [" + inputs.map(toID) + "], length: " + inputs.length);
                        for (var i = 0; i < inputs.length; i++) {
                            var input = inputs[i];
                            if (isNotPhi(input) && !isScheduled(input)) {
                                schedule(input);
                            }
                        }
                        if (node.control) {
                            if (node instanceof IR.End || node instanceof IR.Phi || node instanceof IR.Start || isScheduled(node)) {
                            }
                            else {
                                append(node);
                            }
                        }
                        else {
                            if (inputs.length) {
                                var x = inputs[0].control;
                                for (var i = 1; i < inputs.length; i++) {
                                    var y = inputs[i].control;
                                    if (x.block.dominatorDepth < y.block.dominatorDepth) {
                                        x = y;
                                    }
                                }
                                scheduleIn(node, x);
                            }
                            else {
                                scheduleIn(node, cfg.root.region);
                            }
                        }
                        debugScheduler && writer.leave("<");
                    }
                    debugScheduler && writer.leave("<");
                    roots.forEach(function (node) {
                        node = followProjection(node);
                        if (node === dfg.start || node instanceof IR.Region) {
                            return;
                        }
                        release || assert(node.control, "Node is not scheduled: " + node);
                    });
                };
                CFG.prototype.trace = function (writer) {
                    var visited = [];
                    var blocks = [];
                    function next(block) {
                        if (!visited[block.id]) {
                            visited[block.id] = true;
                            blocks.push(block);
                            block.visitSuccessors(next);
                        }
                    }
                    var root = this.root;
                    var exit = this.exit;
                    next(root);
                    function colorOf(block) {
                        return "black";
                    }
                    function styleOf(block) {
                        return "filled";
                    }
                    function shapeOf(block) {
                        release || assert(block);
                        if (block === root) {
                            return "house";
                        }
                        else if (block === exit) {
                            return "invhouse";
                        }
                        return "box";
                    }
                    writer.writeLn("");
                    writer.enter("digraph CFG {");
                    writer.writeLn("graph [bgcolor = gray10];");
                    writer.writeLn("edge [fontname = Consolas, fontsize = 11, color = white, fontcolor = white];");
                    writer.writeLn("node [shape = box, fontname = Consolas, fontsize = 11, color = white, fontcolor = white, style = filled];");
                    writer.writeLn("rankdir = TB;");
                    blocks.forEach(function (block) {
                        var loopInfo = "";
                        var blockInfo = "";
                        var intervalInfo = "";
                        // if (block.dominatorDepth !== undefined) {
                        //  blockInfo = " D" + block.dominatorDepth;
                        // }
                        if (block.loops !== undefined) {
                        }
                        if (block.name !== undefined) {
                            blockInfo += " " + block.name;
                        }
                        if (block.rpo !== undefined) {
                            blockInfo += " O: " + block.rpo;
                        }
                        writer.writeLn("B" + block.id + " [label = \"B" + block.id + blockInfo + loopInfo + "\", fillcolor = \"" + colorOf(block) + "\", shape=" + shapeOf(block) + ", style=" + styleOf(block) + "];");
                    });
                    blocks.forEach(function (block) {
                        block.visitSuccessors(function (successor) {
                            writer.writeLn("B" + block.id + " -> " + "B" + successor.id);
                        });
                        if (block.dominator) {
                            writer.writeLn("B" + block.id + " -> " + "B" + block.dominator.id + " [color = orange];");
                        }
                        if (block.follow) {
                            writer.writeLn("B" + block.id + " -> " + "B" + block.follow.id + " [color = purple];");
                        }
                    });
                    writer.leave("}");
                    writer.writeLn("");
                };
                return CFG;
            })();
            IR.CFG = CFG;
            /**
             * Peephole optimizations:
             */
            var PeepholeOptimizer = (function () {
                function PeepholeOptimizer() {
                }
                PeepholeOptimizer.prototype.foldUnary = function (node) {
                    release || assert(node instanceof IR.Unary);
                    if (isConstant(node.argument)) {
                        return new IR.Constant(node.operator.evaluate(node.argument.value));
                    }
                    var argument = this.fold(node.argument);
                    if (node.operator === IR.Operator.TRUE) {
                        return argument;
                    }
                    if (argument instanceof IR.Unary) {
                        if (node.operator === IR.Operator.FALSE && argument.operator === IR.Operator.FALSE) {
                            return argument.argument;
                        }
                    }
                    else {
                        return new IR.Unary(node.operator, argument);
                    }
                    return node;
                };
                PeepholeOptimizer.prototype.foldBinary = function (node) {
                    release || assert(node instanceof IR.Binary);
                    if (isConstant(node.left) && isConstant(node.right)) {
                        return new IR.Constant(node.operator.evaluate(node.left.value, node.right.value));
                    }
                    return node;
                };
                PeepholeOptimizer.prototype.fold = function (node) {
                    if (node instanceof IR.Unary) {
                        return this.foldUnary(node);
                    }
                    else if (node instanceof IR.Binary) {
                        return this.foldBinary(node);
                    }
                    return node;
                };
                return PeepholeOptimizer;
            })();
            IR.PeepholeOptimizer = PeepholeOptimizer;
        })(IR = C4.IR || (C4.IR = {}));
    })(C4 = J2ME.C4 || (J2ME.C4 = {}));
})(J2ME || (J2ME = {}));
/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Like most JITs we don't need all the fancy AST serialization, this
 * is a quick and dirty AST writer.
 */
var J2ME;
(function (J2ME) {
    var C4;
    (function (C4) {
        var AST;
        (function (AST) {
            var notImplemented = J2ME.Debug.notImplemented;
            // The top part of this file is copied from escodegen.
            var json = false;
            var escapeless = false;
            var hexadecimal = false;
            var renumber = false;
            var quotes = "double";
            function stringToArray(str) {
                var length = str.length, result = [], i;
                for (i = 0; i < length; ++i) {
                    result[i] = str.charAt(i);
                }
                return result;
            }
            function escapeAllowedCharacter(ch, next) {
                var code = ch.charCodeAt(0), hex = code.toString(16), result = '\\';
                switch (ch) {
                    case '\b':
                        result += 'b';
                        break;
                    case '\f':
                        result += 'f';
                        break;
                    case '\t':
                        result += 't';
                        break;
                    default:
                        if (json || code > 0xff) {
                            result += 'u' + '0000'.slice(hex.length) + hex;
                        }
                        else if (ch === '\u0000' && '0123456789'.indexOf(next) < 0) {
                            result += '0';
                        }
                        else if (ch === '\x0B') {
                            result += 'x0B';
                        }
                        else {
                            result += 'x' + '00'.slice(hex.length) + hex;
                        }
                        break;
                }
                return result;
            }
            function escapeDisallowedCharacter(ch) {
                var result = '\\';
                switch (ch) {
                    case '\\':
                        result += '\\';
                        break;
                    case '\n':
                        result += 'n';
                        break;
                    case '\r':
                        result += 'r';
                        break;
                    case '\u2028':
                        result += 'u2028';
                        break;
                    case '\u2029':
                        result += 'u2029';
                        break;
                    default:
                        throw new Error('Incorrectly classified character');
                }
                return result;
            }
            var escapeStringCacheCount = 0;
            var escapeStringCache = Object.create(null);
            function escapeString(str) {
                var result, i, len, ch, singleQuotes = 0, doubleQuotes = 0, single, original = str;
                result = escapeStringCache[original];
                if (result) {
                    return result;
                }
                if (escapeStringCacheCount === 1024) {
                    escapeStringCache = Object.create(null);
                    escapeStringCacheCount = 0;
                }
                result = '';
                if (typeof str[0] === 'undefined') {
                    str = stringToArray(str);
                }
                for (i = 0, len = str.length; i < len; ++i) {
                    ch = str[i];
                    if (ch === '\'') {
                        ++singleQuotes;
                    }
                    else if (ch === '"') {
                        ++doubleQuotes;
                    }
                    else if (ch === '/' && json) {
                        result += '\\';
                    }
                    else if ('\\\n\r\u2028\u2029'.indexOf(ch) >= 0) {
                        result += escapeDisallowedCharacter(ch);
                        continue;
                    }
                    else if ((json && ch < ' ') || !(json || escapeless || (ch >= ' ' && ch <= '~'))) {
                        result += escapeAllowedCharacter(ch, str[i + 1]);
                        continue;
                    }
                    result += ch;
                }
                single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
                str = result;
                result = single ? '\'' : '"';
                if (typeof str[0] === 'undefined') {
                    str = stringToArray(str);
                }
                for (i = 0, len = str.length; i < len; ++i) {
                    ch = str[i];
                    if ((ch === '\'' && single) || (ch === '"' && !single)) {
                        result += '\\';
                    }
                    result += ch;
                }
                result += (single ? '\'' : '"');
                escapeStringCache[original] = result;
                escapeStringCacheCount++;
                return result;
            }
            var generateNumberCacheCount = 0;
            var generateNumberCache = Object.create(null);
            function generateNumber(value) {
                var result, point, temp, exponent, pos;
                if (value !== value) {
                    throw new Error('Numeric literal whose value is NaN');
                }
                if (value < 0 || (value === 0 && 1 / value < 0)) {
                    throw new Error('Numeric literal whose value is negative');
                }
                if (value === 1 / 0) {
                    return json ? 'null' : renumber ? '1e400' : '1e+400';
                }
                result = generateNumberCache[value];
                if (result) {
                    return result;
                }
                if (generateNumberCacheCount === 1024) {
                    generateNumberCache = Object.create(null);
                    generateNumberCacheCount = 0;
                }
                result = '' + value;
                if (!renumber || result.length < 3) {
                    generateNumberCache[value] = result;
                    generateNumberCacheCount++;
                    return result;
                }
                point = result.indexOf('.');
                if (!json && result.charAt(0) === '0' && point === 1) {
                    point = 0;
                    result = result.slice(1);
                }
                temp = result;
                result = result.replace('e+', 'e');
                exponent = 0;
                if ((pos = temp.indexOf('e')) > 0) {
                    exponent = +temp.slice(pos + 1);
                    temp = temp.slice(0, pos);
                }
                if (point >= 0) {
                    exponent -= temp.length - point - 1;
                    temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
                }
                pos = 0;
                while (temp.charAt(temp.length + pos - 1) === '0') {
                    --pos;
                }
                if (pos !== 0) {
                    exponent -= pos;
                    temp = temp.slice(0, pos);
                }
                if (exponent !== 0) {
                    temp += 'e' + exponent;
                }
                if ((temp.length < result.length || (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) && +temp === value) {
                    result = temp;
                }
                generateNumberCache[value] = result;
                generateNumberCacheCount++;
                return result;
            }
            var Precedence = {
                Default: 0,
                Sequence: 0,
                Assignment: 1,
                Conditional: 2,
                ArrowFunction: 2,
                LogicalOR: 3,
                LogicalAND: 4,
                BitwiseOR: 5,
                BitwiseXOR: 6,
                BitwiseAND: 7,
                Equality: 8,
                Relational: 9,
                BitwiseSHIFT: 10,
                Additive: 11,
                Multiplicative: 12,
                Unary: 13,
                Postfix: 14,
                Call: 15,
                New: 16,
                Member: 17,
                Primary: 18
            };
            var BinaryPrecedence = {
                '||': Precedence.LogicalOR,
                '&&': Precedence.LogicalAND,
                '|': Precedence.BitwiseOR,
                '^': Precedence.BitwiseXOR,
                '&': Precedence.BitwiseAND,
                '==': Precedence.Equality,
                '!=': Precedence.Equality,
                '===': Precedence.Equality,
                '!==': Precedence.Equality,
                'is': Precedence.Equality,
                'isnt': Precedence.Equality,
                '<': Precedence.Relational,
                '>': Precedence.Relational,
                '<=': Precedence.Relational,
                '>=': Precedence.Relational,
                'in': Precedence.Relational,
                'instanceof': Precedence.Relational,
                '<<': Precedence.BitwiseSHIFT,
                '>>': Precedence.BitwiseSHIFT,
                '>>>': Precedence.BitwiseSHIFT,
                '+': Precedence.Additive,
                '-': Precedence.Additive,
                '*': Precedence.Multiplicative,
                '%': Precedence.Multiplicative,
                '/': Precedence.Multiplicative
            };
            function toLiteralSource(value) {
                if (value === null) {
                    return 'null';
                }
                if (value === undefined) {
                    return 'undefined';
                }
                if (typeof value === 'string') {
                    return escapeString(value);
                }
                if (typeof value === 'number') {
                    return generateNumber(value);
                }
                if (typeof value === 'boolean') {
                    return value ? 'true' : 'false';
                }
                notImplemented(value);
            }
            function nodesToSource(nodes, precedence, separator) {
                var result = "";
                for (var i = 0; i < nodes.length; i++) {
                    result += nodes[i].toSource(precedence);
                    if (separator && (i < nodes.length - 1)) {
                        result += separator;
                    }
                }
                return result;
            }
            function alwaysParenthesize(text) {
                return '(' + text + ')';
            }
            function parenthesize(text, current, should) {
                if (current < should) {
                    return '(' + text + ')';
                }
                return text;
            }
            var Node = (function () {
                function Node() {
                }
                Node.prototype.toSource = function (precedence) {
                    notImplemented(this.type);
                    return "";
                };
                return Node;
            })();
            AST.Node = Node;
            var Statement = (function (_super) {
                __extends(Statement, _super);
                function Statement() {
                    _super.apply(this, arguments);
                }
                return Statement;
            })(Node);
            AST.Statement = Statement;
            var Expression = (function (_super) {
                __extends(Expression, _super);
                function Expression() {
                    _super.apply(this, arguments);
                }
                return Expression;
            })(Node);
            AST.Expression = Expression;
            var Program = (function (_super) {
                __extends(Program, _super);
                function Program(body) {
                    _super.call(this);
                    this.body = body;
                }
                return Program;
            })(Node);
            AST.Program = Program;
            var EmptyStatement = (function (_super) {
                __extends(EmptyStatement, _super);
                function EmptyStatement() {
                    _super.apply(this, arguments);
                }
                return EmptyStatement;
            })(Statement);
            AST.EmptyStatement = EmptyStatement;
            var BlockStatement = (function (_super) {
                __extends(BlockStatement, _super);
                function BlockStatement(body) {
                    _super.call(this);
                    this.body = body;
                }
                BlockStatement.prototype.toSource = function (precedence) {
                    return "{" + nodesToSource(this.body, precedence, "\n") + "}";
                };
                return BlockStatement;
            })(Statement);
            AST.BlockStatement = BlockStatement;
            var ExpressionStatement = (function (_super) {
                __extends(ExpressionStatement, _super);
                function ExpressionStatement(expression) {
                    _super.call(this);
                    this.expression = expression;
                }
                ExpressionStatement.prototype.toSource = function (precedence) {
                    return this.expression.toSource(Precedence.Sequence) + ";";
                };
                return ExpressionStatement;
            })(Statement);
            AST.ExpressionStatement = ExpressionStatement;
            var IfStatement = (function (_super) {
                __extends(IfStatement, _super);
                function IfStatement(test, consequent, alternate) {
                    _super.call(this);
                    this.test = test;
                    this.consequent = consequent;
                    this.alternate = alternate;
                }
                IfStatement.prototype.toSource = function (precedence) {
                    var result = "if(" + this.test.toSource(Precedence.Sequence) + "){" + this.consequent.toSource(Precedence.Sequence) + "}";
                    if (this.alternate) {
                        result += "else{" + this.alternate.toSource(Precedence.Sequence) + "}";
                    }
                    return result;
                };
                return IfStatement;
            })(Statement);
            AST.IfStatement = IfStatement;
            var LabeledStatement = (function (_super) {
                __extends(LabeledStatement, _super);
                function LabeledStatement(label, body) {
                    _super.call(this);
                    this.label = label;
                    this.body = body;
                }
                return LabeledStatement;
            })(Statement);
            AST.LabeledStatement = LabeledStatement;
            var BreakStatement = (function (_super) {
                __extends(BreakStatement, _super);
                function BreakStatement(label) {
                    _super.call(this);
                    this.label = label;
                }
                BreakStatement.prototype.toSource = function (precedence) {
                    var result = "break";
                    if (this.label) {
                        result += " " + this.label.toSource(Precedence.Default);
                    }
                    return result + ";";
                };
                return BreakStatement;
            })(Statement);
            AST.BreakStatement = BreakStatement;
            var ContinueStatement = (function (_super) {
                __extends(ContinueStatement, _super);
                function ContinueStatement(label) {
                    _super.call(this);
                    this.label = label;
                }
                ContinueStatement.prototype.toSource = function (precedence) {
                    var result = "continue";
                    if (this.label) {
                        result += " " + this.label.toSource(Precedence.Default);
                    }
                    return result + ";";
                };
                return ContinueStatement;
            })(Statement);
            AST.ContinueStatement = ContinueStatement;
            var WithStatement = (function (_super) {
                __extends(WithStatement, _super);
                function WithStatement(object, body) {
                    _super.call(this);
                    this.object = object;
                    this.body = body;
                }
                return WithStatement;
            })(Statement);
            AST.WithStatement = WithStatement;
            var SwitchStatement = (function (_super) {
                __extends(SwitchStatement, _super);
                function SwitchStatement(discriminant, cases, lexical) {
                    _super.call(this);
                    this.discriminant = discriminant;
                    this.cases = cases;
                    this.lexical = lexical;
                }
                SwitchStatement.prototype.toSource = function (precedence) {
                    return "switch(" + this.discriminant.toSource(Precedence.Sequence) + "){" + nodesToSource(this.cases, Precedence.Default, ";") + "};";
                };
                return SwitchStatement;
            })(Statement);
            AST.SwitchStatement = SwitchStatement;
            var ReturnStatement = (function (_super) {
                __extends(ReturnStatement, _super);
                function ReturnStatement(argument) {
                    _super.call(this);
                    this.argument = argument;
                }
                ReturnStatement.prototype.toSource = function (precedence) {
                    var result = "return";
                    if (this.argument) {
                        result += " " + this.argument.toSource(Precedence.Sequence);
                    }
                    return result + ";";
                };
                return ReturnStatement;
            })(Statement);
            AST.ReturnStatement = ReturnStatement;
            var ThrowStatement = (function (_super) {
                __extends(ThrowStatement, _super);
                function ThrowStatement(argument) {
                    _super.call(this);
                    this.argument = argument;
                }
                ThrowStatement.prototype.toSource = function (precedence) {
                    return "throw " + this.argument.toSource(Precedence.Sequence) + ";\n";
                };
                return ThrowStatement;
            })(Statement);
            AST.ThrowStatement = ThrowStatement;
            var TryStatement = (function (_super) {
                __extends(TryStatement, _super);
                function TryStatement(block, handlers, guardedHandlers, finalizer) {
                    _super.call(this);
                    this.block = block;
                    this.handlers = handlers;
                    this.guardedHandlers = guardedHandlers;
                    this.finalizer = finalizer;
                }
                TryStatement.prototype.toSource = function (precedence) {
                    if (this.guardedHandlers.length !== 0 || this.finalizer !== null) {
                        throw "TODO";
                    }
                    return "try " + this.block.toSource(Precedence.Sequence) + "  catch(" + this.handlers.param.toSource(Precedence.Sequence) + ") " + this.handlers.body.toSource(Precedence.Sequence);
                };
                return TryStatement;
            })(Statement);
            AST.TryStatement = TryStatement;
            var WhileStatement = (function (_super) {
                __extends(WhileStatement, _super);
                function WhileStatement(test, body) {
                    _super.call(this);
                    this.test = test;
                    this.body = body;
                }
                WhileStatement.prototype.toSource = function (precedence) {
                    return "while(" + this.test.toSource(Precedence.Sequence) + "){" + this.body.toSource(Precedence.Sequence) + "}";
                };
                return WhileStatement;
            })(Statement);
            AST.WhileStatement = WhileStatement;
            var DoWhileStatement = (function (_super) {
                __extends(DoWhileStatement, _super);
                function DoWhileStatement(body, test) {
                    _super.call(this);
                    this.body = body;
                    this.test = test;
                }
                return DoWhileStatement;
            })(Statement);
            AST.DoWhileStatement = DoWhileStatement;
            var ForStatement = (function (_super) {
                __extends(ForStatement, _super);
                function ForStatement(init, test, update, body) {
                    _super.call(this);
                    this.init = init;
                    this.test = test;
                    this.update = update;
                    this.body = body;
                }
                return ForStatement;
            })(Statement);
            AST.ForStatement = ForStatement;
            var ForInStatement = (function (_super) {
                __extends(ForInStatement, _super);
                function ForInStatement(left, right, body, each) {
                    _super.call(this);
                    this.left = left;
                    this.right = right;
                    this.body = body;
                    this.each = each;
                }
                return ForInStatement;
            })(Statement);
            AST.ForInStatement = ForInStatement;
            var DebuggerStatement = (function (_super) {
                __extends(DebuggerStatement, _super);
                function DebuggerStatement() {
                    _super.apply(this, arguments);
                }
                return DebuggerStatement;
            })(Statement);
            AST.DebuggerStatement = DebuggerStatement;
            var Declaration = (function (_super) {
                __extends(Declaration, _super);
                function Declaration() {
                    _super.apply(this, arguments);
                }
                return Declaration;
            })(Statement);
            AST.Declaration = Declaration;
            var FunctionDeclaration = (function (_super) {
                __extends(FunctionDeclaration, _super);
                function FunctionDeclaration(id, params, defaults, rest, body, generator, expression) {
                    _super.call(this);
                    this.id = id;
                    this.params = params;
                    this.defaults = defaults;
                    this.rest = rest;
                    this.body = body;
                    this.generator = generator;
                    this.expression = expression;
                }
                return FunctionDeclaration;
            })(Declaration);
            AST.FunctionDeclaration = FunctionDeclaration;
            var VariableDeclaration = (function (_super) {
                __extends(VariableDeclaration, _super);
                function VariableDeclaration(declarations, kind) {
                    _super.call(this);
                    this.declarations = declarations;
                    this.kind = kind;
                }
                VariableDeclaration.prototype.toSource = function (precedence) {
                    return this.kind + " " + nodesToSource(this.declarations, precedence, ",") + ";\n";
                };
                return VariableDeclaration;
            })(Declaration);
            AST.VariableDeclaration = VariableDeclaration;
            var VariableDeclarator = (function (_super) {
                __extends(VariableDeclarator, _super);
                function VariableDeclarator(id, init) {
                    _super.call(this);
                    this.id = id;
                    this.init = init;
                }
                VariableDeclarator.prototype.toSource = function (precedence) {
                    var result = this.id.toSource(Precedence.Assignment);
                    if (this.init) {
                        result += "=" + this.init.toSource(Precedence.Assignment);
                    }
                    return result;
                };
                return VariableDeclarator;
            })(Node);
            AST.VariableDeclarator = VariableDeclarator;
            var Identifier = (function (_super) {
                __extends(Identifier, _super);
                function Identifier(name) {
                    _super.call(this);
                    this.name = name;
                }
                Identifier.prototype.toSource = function (precedence) {
                    return this.name;
                };
                return Identifier;
            })(Expression);
            AST.Identifier = Identifier;
            var Literal = (function (_super) {
                __extends(Literal, _super);
                function Literal(value) {
                    _super.call(this);
                    this.value = value;
                }
                Literal.prototype.toSource = function (precedence) {
                    return toLiteralSource(this.value);
                };
                return Literal;
            })(Expression);
            AST.Literal = Literal;
            var ThisExpression = (function (_super) {
                __extends(ThisExpression, _super);
                function ThisExpression() {
                    _super.apply(this, arguments);
                }
                ThisExpression.prototype.toSource = function (precedence) {
                    return "this";
                };
                return ThisExpression;
            })(Expression);
            AST.ThisExpression = ThisExpression;
            var ArrayExpression = (function (_super) {
                __extends(ArrayExpression, _super);
                function ArrayExpression(elements) {
                    _super.call(this);
                    this.elements = elements;
                }
                ArrayExpression.prototype.toSource = function (precedence) {
                    return "[" + nodesToSource(this.elements, Precedence.Assignment, ",") + "]";
                };
                return ArrayExpression;
            })(Expression);
            AST.ArrayExpression = ArrayExpression;
            var ObjectExpression = (function (_super) {
                __extends(ObjectExpression, _super);
                function ObjectExpression(properties) {
                    _super.call(this);
                    this.properties = properties;
                }
                ObjectExpression.prototype.toSource = function (precedence) {
                    return "{" + nodesToSource(this.properties, Precedence.Sequence, ",") + "}";
                };
                return ObjectExpression;
            })(Expression);
            AST.ObjectExpression = ObjectExpression;
            var FunctionExpression = (function (_super) {
                __extends(FunctionExpression, _super);
                function FunctionExpression(id, params, defaults, rest, body, generator, expression) {
                    _super.call(this);
                    this.id = id;
                    this.params = params;
                    this.defaults = defaults;
                    this.rest = rest;
                    this.body = body;
                    this.generator = generator;
                    this.expression = expression;
                }
                return FunctionExpression;
            })(Expression);
            AST.FunctionExpression = FunctionExpression;
            var SequenceExpression = (function (_super) {
                __extends(SequenceExpression, _super);
                function SequenceExpression(expressions) {
                    _super.call(this);
                    this.expressions = expressions;
                }
                SequenceExpression.prototype.toSource = function (precedence) {
                    return "(" + this.expressions.map(function (x) { return x.toSource(precedence); }).join(", ") + ")";
                };
                return SequenceExpression;
            })(Expression);
            AST.SequenceExpression = SequenceExpression;
            var UnaryExpression = (function (_super) {
                __extends(UnaryExpression, _super);
                function UnaryExpression(operator, prefix, argument) {
                    _super.call(this);
                    this.operator = operator;
                    this.prefix = prefix;
                    this.argument = argument;
                }
                UnaryExpression.prototype.toSource = function (precedence) {
                    var argument = this.argument.toSource(Precedence.Unary);
                    var result = this.prefix ? this.operator + argument : argument + this.operator;
                    result = " " + result;
                    result = parenthesize(result, Precedence.Unary, precedence);
                    return result;
                };
                return UnaryExpression;
            })(Expression);
            AST.UnaryExpression = UnaryExpression;
            var BinaryExpression = (function (_super) {
                __extends(BinaryExpression, _super);
                function BinaryExpression(operator, left, right) {
                    _super.call(this);
                    this.operator = operator;
                    this.left = left;
                    this.right = right;
                }
                BinaryExpression.prototype.toSource = function (precedence) {
                    var currentPrecedence = BinaryPrecedence[this.operator];
                    var result = this.left.toSource(currentPrecedence) + " " + this.operator + " " + this.right.toSource(currentPrecedence + 1);
                    return parenthesize(result, currentPrecedence, precedence);
                };
                return BinaryExpression;
            })(Expression);
            AST.BinaryExpression = BinaryExpression;
            var AssignmentExpression = (function (_super) {
                __extends(AssignmentExpression, _super);
                function AssignmentExpression(operator, left, right) {
                    _super.call(this);
                    this.operator = operator;
                    this.left = left;
                    this.right = right;
                }
                AssignmentExpression.prototype.toSource = function (precedence) {
                    var result = this.left.toSource(Precedence.Assignment) + this.operator + this.right.toSource(Precedence.Assignment);
                    return parenthesize(result, Precedence.Assignment, precedence);
                };
                return AssignmentExpression;
            })(Expression);
            AST.AssignmentExpression = AssignmentExpression;
            var UpdateExpression = (function (_super) {
                __extends(UpdateExpression, _super);
                function UpdateExpression(operator, argument, prefix) {
                    _super.call(this);
                    this.operator = operator;
                    this.argument = argument;
                    this.prefix = prefix;
                }
                return UpdateExpression;
            })(Expression);
            AST.UpdateExpression = UpdateExpression;
            var LogicalExpression = (function (_super) {
                __extends(LogicalExpression, _super);
                function LogicalExpression(operator, left, right) {
                    _super.call(this, operator, left, right);
                }
                return LogicalExpression;
            })(BinaryExpression);
            AST.LogicalExpression = LogicalExpression;
            var ConditionalExpression = (function (_super) {
                __extends(ConditionalExpression, _super);
                function ConditionalExpression(test, consequent, alternate) {
                    _super.call(this);
                    this.test = test;
                    this.consequent = consequent;
                    this.alternate = alternate;
                }
                ConditionalExpression.prototype.toSource = function (precedence) {
                    return this.test.toSource(Precedence.LogicalOR) + "?" + this.consequent.toSource(Precedence.Assignment) + ":" + this.alternate.toSource(Precedence.Assignment);
                };
                return ConditionalExpression;
            })(Expression);
            AST.ConditionalExpression = ConditionalExpression;
            var NewExpression = (function (_super) {
                __extends(NewExpression, _super);
                function NewExpression(callee, _arguments) {
                    _super.call(this);
                    this.callee = callee;
                    this.arguments = _arguments;
                }
                NewExpression.prototype.toSource = function (precedence) {
                    return "new " + this.callee.toSource(precedence) + "(" + nodesToSource(this.arguments, precedence, ",") + ")";
                };
                return NewExpression;
            })(Expression);
            AST.NewExpression = NewExpression;
            var CallExpression = (function (_super) {
                __extends(CallExpression, _super);
                function CallExpression(callee, _arguments) {
                    _super.call(this);
                    this.callee = callee;
                    this.arguments = _arguments;
                }
                CallExpression.prototype.toSource = function (precedence) {
                    return this.callee.toSource(precedence) + "(" + nodesToSource(this.arguments, precedence, ",") + ")";
                };
                return CallExpression;
            })(Expression);
            AST.CallExpression = CallExpression;
            var MemberExpression = (function (_super) {
                __extends(MemberExpression, _super);
                function MemberExpression(object, property, computed) {
                    _super.call(this);
                    this.object = object;
                    this.property = property;
                    this.computed = computed;
                }
                MemberExpression.prototype.toSource = function (precedence) {
                    var result = this.object.toSource(Precedence.Call);
                    if (this.object instanceof Literal) {
                        result = alwaysParenthesize(result);
                    }
                    var property = this.property.toSource(Precedence.Sequence);
                    if (this.computed) {
                        result += "[" + property + "]";
                    }
                    else {
                        result += "." + property;
                    }
                    return parenthesize(result, Precedence.Member, precedence);
                };
                return MemberExpression;
            })(Expression);
            AST.MemberExpression = MemberExpression;
            var Property = (function (_super) {
                __extends(Property, _super);
                function Property(key, value, kind) {
                    _super.call(this);
                    this.key = key;
                    this.value = value;
                    this.kind = kind;
                }
                Property.prototype.toSource = function (precedence) {
                    return this.key.toSource(precedence) + ":" + this.value.toSource(precedence);
                };
                return Property;
            })(Node);
            AST.Property = Property;
            var SwitchCase = (function (_super) {
                __extends(SwitchCase, _super);
                function SwitchCase(test, consequent) {
                    _super.call(this);
                    this.test = test;
                    this.consequent = consequent;
                }
                SwitchCase.prototype.toSource = function (precedence) {
                    var result = this.test ? "case " + this.test.toSource(precedence) : "default";
                    return result + ": " + nodesToSource(this.consequent, precedence, ";");
                };
                return SwitchCase;
            })(Node);
            AST.SwitchCase = SwitchCase;
            var CatchClause = (function (_super) {
                __extends(CatchClause, _super);
                function CatchClause(param, guard, body) {
                    _super.call(this);
                    this.param = param;
                    this.guard = guard;
                    this.body = body;
                }
                return CatchClause;
            })(Node);
            AST.CatchClause = CatchClause;
            Node.prototype.type = "Node";
            Program.prototype.type = "Program";
            Statement.prototype.type = "Statement";
            EmptyStatement.prototype.type = "EmptyStatement";
            BlockStatement.prototype.type = "BlockStatement";
            ExpressionStatement.prototype.type = "ExpressionStatement";
            IfStatement.prototype.type = "IfStatement";
            LabeledStatement.prototype.type = "LabeledStatement";
            BreakStatement.prototype.type = "BreakStatement";
            ContinueStatement.prototype.type = "ContinueStatement";
            WithStatement.prototype.type = "WithStatement";
            SwitchStatement.prototype.type = "SwitchStatement";
            ReturnStatement.prototype.type = "ReturnStatement";
            ThrowStatement.prototype.type = "ThrowStatement";
            TryStatement.prototype.type = "TryStatement";
            WhileStatement.prototype.type = "WhileStatement";
            DoWhileStatement.prototype.type = "DoWhileStatement";
            ForStatement.prototype.type = "ForStatement";
            ForInStatement.prototype.type = "ForInStatement";
            DebuggerStatement.prototype.type = "DebuggerStatement";
            Declaration.prototype.type = "Declaration";
            FunctionDeclaration.prototype.type = "FunctionDeclaration";
            VariableDeclaration.prototype.type = "VariableDeclaration";
            VariableDeclarator.prototype.type = "VariableDeclarator";
            Expression.prototype.type = "Expression";
            Identifier.prototype.type = "Identifier";
            Literal.prototype.type = "Literal";
            ThisExpression.prototype.type = "ThisExpression";
            ArrayExpression.prototype.type = "ArrayExpression";
            ObjectExpression.prototype.type = "ObjectExpression";
            FunctionExpression.prototype.type = "FunctionExpression";
            SequenceExpression.prototype.type = "SequenceExpression";
            UnaryExpression.prototype.type = "UnaryExpression";
            BinaryExpression.prototype.type = "BinaryExpression";
            AssignmentExpression.prototype.type = "AssignmentExpression";
            UpdateExpression.prototype.type = "UpdateExpression";
            LogicalExpression.prototype.type = "LogicalExpression";
            ConditionalExpression.prototype.type = "ConditionalExpression";
            NewExpression.prototype.type = "NewExpression";
            CallExpression.prototype.type = "CallExpression";
            MemberExpression.prototype.type = "MemberExpression";
            Property.prototype.type = "Property";
            SwitchCase.prototype.type = "SwitchCase";
            CatchClause.prototype.type = "CatchClause";
        })(AST = C4.AST || (C4.AST = {}));
    })(C4 = J2ME.C4 || (J2ME.C4 = {}));
})(J2ME || (J2ME = {}));
/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var J2ME;
(function (J2ME) {
    var C4;
    (function (C4) {
        var Looper;
        (function (Looper) {
            var top = J2ME.ArrayUtilities.top;
            var peek = J2ME.ArrayUtilities.peek;
            var assert = J2ME.Debug.assert;
            var Control;
            (function (Control) {
                (function (Kind) {
                    Kind[Kind["SEQ"] = 1] = "SEQ";
                    Kind[Kind["LOOP"] = 2] = "LOOP";
                    Kind[Kind["IF"] = 3] = "IF";
                    Kind[Kind["CASE"] = 4] = "CASE";
                    Kind[Kind["SWITCH"] = 5] = "SWITCH";
                    Kind[Kind["LABEL_CASE"] = 6] = "LABEL_CASE";
                    Kind[Kind["LABEL_SWITCH"] = 7] = "LABEL_SWITCH";
                    Kind[Kind["EXIT"] = 8] = "EXIT";
                    Kind[Kind["BREAK"] = 9] = "BREAK";
                    Kind[Kind["CONTINUE"] = 10] = "CONTINUE";
                    Kind[Kind["TRY"] = 11] = "TRY";
                    Kind[Kind["CATCH"] = 12] = "CATCH";
                })(Control.Kind || (Control.Kind = {}));
                var Kind = Control.Kind;
                var ControlNode = (function () {
                    function ControlNode(kind) {
                        this.kind = kind;
                    }
                    return ControlNode;
                })();
                Control.ControlNode = ControlNode;
                var Seq = (function (_super) {
                    __extends(Seq, _super);
                    function Seq(body) {
                        _super.call(this, 1 /* SEQ */);
                        this.body = body;
                    }
                    Seq.prototype.trace = function (writer) {
                        var body = this.body;
                        for (var i = 0, j = body.length; i < j; i++) {
                            body[i].trace(writer);
                        }
                    };
                    Seq.prototype.first = function () {
                        return this.body[0];
                    };
                    Seq.prototype.slice = function (begin, end) {
                        return new Seq(this.body.slice(begin, end));
                    };
                    return Seq;
                })(ControlNode);
                Control.Seq = Seq;
                var Loop = (function (_super) {
                    __extends(Loop, _super);
                    function Loop(body) {
                        _super.call(this, 2 /* LOOP */);
                        this.body = body;
                    }
                    Loop.prototype.trace = function (writer) {
                        writer.enter("loop {");
                        this.body.trace(writer);
                        writer.leave("}");
                    };
                    return Loop;
                })(ControlNode);
                Control.Loop = Loop;
                var If = (function (_super) {
                    __extends(If, _super);
                    function If(cond, then, els, nothingThrownLabel) {
                        _super.call(this, 3 /* IF */);
                        this.cond = cond;
                        this.then = then;
                        this.nothingThrownLabel = nothingThrownLabel;
                        this.negated = false;
                        this.else = els;
                    }
                    If.prototype.trace = function (writer) {
                        this.cond.trace(writer);
                        if (this.nothingThrownLabel) {
                            writer.enter("if (label is " + this.nothingThrownLabel + ") {");
                        }
                        writer.enter("if" + (this.negated ? " not" : "") + " {");
                        this.then && this.then.trace(writer);
                        if (this.else) {
                            writer.outdent();
                            writer.enter("} else {");
                            this.else.trace(writer);
                        }
                        writer.leave("}");
                        if (this.nothingThrownLabel) {
                            writer.leave("}");
                        }
                    };
                    return If;
                })(ControlNode);
                Control.If = If;
                var Case = (function (_super) {
                    __extends(Case, _super);
                    function Case(index, body) {
                        _super.call(this, 4 /* CASE */);
                        this.index = index;
                        this.body = body;
                    }
                    Case.prototype.trace = function (writer) {
                        if (this.index >= 0) {
                            writer.writeLn("case " + this.index + ":");
                        }
                        else {
                            writer.writeLn("default:");
                        }
                        writer.indent();
                        this.body && this.body.trace(writer);
                        writer.outdent();
                    };
                    return Case;
                })(ControlNode);
                Control.Case = Case;
                var Switch = (function (_super) {
                    __extends(Switch, _super);
                    function Switch(determinant, cases, nothingThrownLabel) {
                        _super.call(this, 5 /* SWITCH */);
                        this.determinant = determinant;
                        this.cases = cases;
                        this.nothingThrownLabel = nothingThrownLabel;
                    }
                    Switch.prototype.trace = function (writer) {
                        if (this.nothingThrownLabel) {
                            writer.enter("if (label is " + this.nothingThrownLabel + ") {");
                        }
                        this.determinant.trace(writer);
                        writer.writeLn("switch {");
                        for (var i = 0, j = this.cases.length; i < j; i++) {
                            this.cases[i].trace(writer);
                        }
                        writer.writeLn("}");
                        if (this.nothingThrownLabel) {
                            writer.leave("}");
                        }
                    };
                    return Switch;
                })(ControlNode);
                Control.Switch = Switch;
                var LabelCase = (function (_super) {
                    __extends(LabelCase, _super);
                    function LabelCase(labels, body) {
                        _super.call(this, 6 /* LABEL_CASE */);
                        this.labels = labels;
                        this.body = body;
                    }
                    LabelCase.prototype.trace = function (writer) {
                        writer.enter("if (label is " + this.labels.join(" or ") + ") {");
                        this.body && this.body.trace(writer);
                        writer.leave("}");
                    };
                    return LabelCase;
                })(ControlNode);
                Control.LabelCase = LabelCase;
                var LabelSwitch = (function (_super) {
                    __extends(LabelSwitch, _super);
                    function LabelSwitch(cases) {
                        _super.call(this, 7 /* LABEL_SWITCH */);
                        this.cases = cases;
                        var labelMap = {};
                        for (var i = 0, j = cases.length; i < j; i++) {
                            var c = cases[i];
                            if (!c.labels) {
                            }
                            for (var k = 0, l = c.labels.length; k < l; k++) {
                                labelMap[c.labels[k]] = c;
                            }
                        }
                        this.labelMap = labelMap;
                    }
                    LabelSwitch.prototype.trace = function (writer) {
                        for (var i = 0, j = this.cases.length; i < j; i++) {
                            this.cases[i].trace(writer);
                        }
                    };
                    return LabelSwitch;
                })(ControlNode);
                Control.LabelSwitch = LabelSwitch;
                var Exit = (function (_super) {
                    __extends(Exit, _super);
                    function Exit(label) {
                        _super.call(this, 8 /* EXIT */);
                        this.label = label;
                    }
                    Exit.prototype.trace = function (writer) {
                        writer.writeLn("label = " + this.label);
                    };
                    return Exit;
                })(ControlNode);
                Control.Exit = Exit;
                var Break = (function (_super) {
                    __extends(Break, _super);
                    function Break(label, head) {
                        _super.call(this, 9 /* BREAK */);
                        this.label = label;
                        this.head = head;
                    }
                    Break.prototype.trace = function (writer) {
                        this.label && writer.writeLn("label = " + this.label);
                        writer.writeLn("break");
                    };
                    return Break;
                })(ControlNode);
                Control.Break = Break;
                var Continue = (function (_super) {
                    __extends(Continue, _super);
                    function Continue(label, head) {
                        _super.call(this, 10 /* CONTINUE */);
                        this.label = label;
                        this.head = head;
                        this.necessary = true;
                    }
                    Continue.prototype.trace = function (writer) {
                        this.label && writer.writeLn("label = " + this.label);
                        this.necessary && writer.writeLn("continue");
                    };
                    return Continue;
                })(ControlNode);
                Control.Continue = Continue;
                var Try = (function (_super) {
                    __extends(Try, _super);
                    function Try(body, catches) {
                        _super.call(this, 11 /* TRY */);
                        this.body = body;
                        this.catches = catches;
                    }
                    Try.prototype.trace = function (writer) {
                        writer.enter("try {");
                        this.body.trace(writer);
                        writer.writeLn("label = " + this.nothingThrownLabel);
                        for (var i = 0, j = this.catches.length; i < j; i++) {
                            this.catches[i].trace(writer);
                        }
                        writer.leave("}");
                    };
                    return Try;
                })(ControlNode);
                Control.Try = Try;
                var Catch = (function (_super) {
                    __extends(Catch, _super);
                    function Catch(varName, typeName, body) {
                        _super.call(this, 12 /* CATCH */);
                        this.varName = varName;
                        this.typeName = typeName;
                        this.body = body;
                    }
                    Catch.prototype.trace = function (writer) {
                        writer.outdent();
                        writer.enter("} catch (" + (this.varName || "e") + (this.typeName ? (" : " + this.typeName) : "") + ") {");
                        this.body.trace(writer);
                    };
                    return Catch;
                })(ControlNode);
                Control.Catch = Catch;
            })(Control = Looper.Control || (Looper.Control = {}));
            var BITS_PER_WORD = J2ME.BitSets.BITS_PER_WORD;
            var ADDRESS_BITS_PER_WORD = J2ME.BitSets.ADDRESS_BITS_PER_WORD;
            var BIT_INDEX_MASK = J2ME.BitSets.BIT_INDEX_MASK;
            var BlockSet = (function (_super) {
                __extends(BlockSet, _super);
                function BlockSet(length, blockById) {
                    _super.call(this, length);
                    this.blockById = blockById;
                }
                BlockSet.prototype.forEachBlock = function (fn) {
                    release || assert(fn);
                    var byId = this.blockById;
                    var bits = this.bits;
                    for (var i = 0, j = bits.length; i < j; i++) {
                        var word = bits[i];
                        if (word) {
                            for (var k = 0; k < BITS_PER_WORD; k++) {
                                if (word & (1 << k)) {
                                    fn(byId[i * BITS_PER_WORD + k]);
                                }
                            }
                        }
                    }
                };
                BlockSet.prototype.choose = function () {
                    var byId = this.blockById;
                    var bits = this.bits;
                    for (var i = 0, j = bits.length; i < j; i++) {
                        var word = bits[i];
                        if (word) {
                            for (var k = 0; k < BITS_PER_WORD; k++) {
                                if (word & (1 << k)) {
                                    return byId[i * BITS_PER_WORD + k];
                                }
                            }
                        }
                    }
                };
                BlockSet.prototype.members = function () {
                    var byId = this.blockById;
                    var set = [];
                    var bits = this.bits;
                    for (var i = 0, j = bits.length; i < j; i++) {
                        var word = bits[i];
                        if (word) {
                            for (var k = 0; k < BITS_PER_WORD; k++) {
                                if (word & (1 << k)) {
                                    set.push(byId[i * BITS_PER_WORD + k]);
                                }
                            }
                        }
                    }
                    return set;
                };
                BlockSet.prototype.setBlocks = function (bs) {
                    var bits = this.bits;
                    for (var i = 0, j = bs.length; i < j; i++) {
                        var id = bs[i].id;
                        bits[id >> ADDRESS_BITS_PER_WORD] |= 1 << (id & BIT_INDEX_MASK);
                    }
                };
                return BlockSet;
            })(J2ME.BitSets.Uint32ArrayBitSet);
            Looper.BlockSet = BlockSet;
            var Analysis = (function () {
                function Analysis(cfg) {
                    this.makeBlockSetFactory(cfg.blocks.length, cfg.blocks);
                    this.hasExceptions = false;
                    this.normalizeReachableBlocks(cfg.root);
                }
                Analysis.prototype.makeBlockSetFactory = function (length, blockById) {
                    release || assert(!this.boundBlockSet);
                    this.boundBlockSet = (function blockSet() {
                        return new BlockSet(length, blockById);
                    });
                };
                Analysis.prototype.normalizeReachableBlocks = function (root) {
                    // The root must not have preds!
                    release || assert(root.predecessors.length === 0);
                    var ONCE = 1;
                    var BUNCH_OF_TIMES = 2;
                    var BlockSet = this.boundBlockSet;
                    var blocks = [];
                    var visited = {};
                    var ancestors = {};
                    var worklist = [root];
                    var node;
                    ancestors[root.id] = true;
                    while ((node = top(worklist))) {
                        if (visited[node.id]) {
                            if (visited[node.id] === ONCE) {
                                visited[node.id] = BUNCH_OF_TIMES;
                                blocks.push(node);
                            }
                            ancestors[node.id] = false;
                            worklist.pop();
                            continue;
                        }
                        visited[node.id] = ONCE;
                        ancestors[node.id] = true;
                        var successors = node.successors;
                        for (var i = 0, j = successors.length; i < j; i++) {
                            var s = successors[i];
                            if (ancestors[s.id]) {
                                if (!node.spbacks) {
                                    node.spbacks = new BlockSet();
                                }
                                node.spbacks.set(s.id);
                            }
                            !visited[s.id] && worklist.push(s);
                        }
                    }
                    this.blocks = blocks.reverse();
                };
                //
                // Calculate the dominance relation iteratively.
                //
                // Algorithm is from [1].
                //
                // [1] Cooper et al. "A Simple, Fast Dominance Algorithm"
                //
                Analysis.prototype.computeDominance = function () {
                    function intersectDominators(doms, b1, b2) {
                        var finger1 = b1;
                        var finger2 = b2;
                        while (finger1 !== finger2) {
                            while (finger1 > finger2) {
                                finger1 = doms[finger1];
                            }
                            while (finger2 > finger1) {
                                finger2 = doms[finger2];
                            }
                        }
                        return finger1;
                    }
                    var blocks = this.blocks;
                    var n = blocks.length;
                    var doms = new Array(n);
                    doms[0] = 0;
                    // Blocks must be given to us in reverse postorder.
                    var rpo = [];
                    for (var b = 0; b < n; b++) {
                        rpo[blocks[b].id] = b;
                        blocks[b].dominatees = [];
                    }
                    var changed = true;
                    while (changed) {
                        changed = false;
                        for (var b = 1; b < n; b++) {
                            var predecessors = blocks[b].predecessors;
                            var j = predecessors.length;
                            var newIdom = rpo[predecessors[0].id];
                            // Because 0 is falsy, have to use |in| here.
                            if (!(newIdom in doms)) {
                                for (var i = 1; i < j; i++) {
                                    newIdom = rpo[predecessors[i].id];
                                    if (newIdom in doms) {
                                        break;
                                    }
                                }
                            }
                            release || assert(newIdom in doms);
                            for (var i = 0; i < j; i++) {
                                var p = rpo[predecessors[i].id];
                                if (p === newIdom) {
                                    continue;
                                }
                                if (p in doms) {
                                    newIdom = intersectDominators(doms, p, newIdom);
                                }
                            }
                            if (doms[b] !== newIdom) {
                                doms[b] = newIdom;
                                changed = true;
                            }
                        }
                    }
                    blocks[0].dominator = blocks[0];
                    var block;
                    for (var b = 1; b < n; b++) {
                        block = blocks[b];
                        var idom = blocks[doms[b]];
                        // Store the immediate dominator.
                        block.dominator = idom;
                        idom.dominatees.push(block);
                        block.npredecessors = block.predecessors.length;
                    }
                    // Assign dominator tree levels.
                    var worklist = [blocks[0]];
                    blocks[0].level || (blocks[0].level = 0);
                    while ((block = worklist.shift())) {
                        var dominatees = block.dominatees;
                        for (var i = 0; i < dominatees.length; i++) {
                            dominatees[i].level = block.level + 1;
                        }
                        worklist.push.apply(worklist, dominatees);
                    }
                };
                Analysis.prototype.computeFrontiers = function () {
                    var BlockSet = this.boundBlockSet;
                    var blocks = this.blocks;
                    for (var b = 0, n = blocks.length; b < n; b++) {
                        blocks[b].frontier = new BlockSet();
                    }
                    for (var b = 1, n = blocks.length; b < n; b++) {
                        var block = blocks[b];
                        var predecessors = block.predecessors;
                        if (predecessors.length >= 2) {
                            var idom = block.dominator;
                            for (var i = 0, j = predecessors.length; i < j; i++) {
                                var runner = predecessors[i];
                                while (runner !== idom) {
                                    runner.frontier.set(block.id);
                                    runner = runner.dominator;
                                }
                            }
                        }
                    }
                };
                Analysis.prototype.analyzeControlFlow = function () {
                    this.computeDominance();
                    this.analyzedControlFlow = true;
                    return true;
                };
                Analysis.prototype.markLoops = function () {
                    if (!this.analyzedControlFlow && !this.analyzeControlFlow()) {
                        return false;
                    }
                    var BlockSet = this.boundBlockSet;
                    //
                    // Find all SCCs at or below the level of some root that are not already
                    // natural loops.
                    //
                    function findSCCs(root) {
                        var preorderId = 1;
                        var preorder = {};
                        var assigned = {};
                        var unconnectedNodes = [];
                        var pendingNodes = [];
                        var sccs = [];
                        var level = root.level + 1;
                        var worklist = [root];
                        var node;
                        var u, s;
                        while ((node = top(worklist))) {
                            if (preorder[node.id]) {
                                if (peek(pendingNodes) === node) {
                                    pendingNodes.pop();
                                    var scc = [];
                                    do {
                                        u = unconnectedNodes.pop();
                                        assigned[u.id] = true;
                                        scc.push(u);
                                    } while (u !== node);
                                    if (scc.length > 1 || (u.spbacks && u.spbacks.get(u.id))) {
                                        sccs.push(scc);
                                    }
                                }
                                worklist.pop();
                                continue;
                            }
                            preorder[node.id] = preorderId++;
                            unconnectedNodes.push(node);
                            pendingNodes.push(node);
                            var successors = node.successors;
                            for (var i = 0, j = successors.length; i < j; i++) {
                                s = successors[i];
                                if (s.level < level) {
                                    continue;
                                }
                                var sid = s.id;
                                if (!preorder[sid]) {
                                    worklist.push(s);
                                }
                                else if (!assigned[sid]) {
                                    while (preorder[peek(pendingNodes).id] > preorder[sid]) {
                                        pendingNodes.pop();
                                    }
                                }
                            }
                        }
                        return sccs;
                    }
                    function findLoopHeads(blocks) {
                        var heads = new BlockSet();
                        for (var i = 0, j = blocks.length; i < j; i++) {
                            var block = blocks[i];
                            var spbacks = block.spbacks;
                            if (!spbacks) {
                                continue;
                            }
                            var successors = block.successors;
                            for (var k = 0, l = successors.length; k < l; k++) {
                                var s = successors[k];
                                if (spbacks.get(s.id)) {
                                    heads.set(s.dominator.id);
                                }
                            }
                        }
                        return heads.members();
                    }
                    function LoopInfo(scc, loopId) {
                        var body = new BlockSet();
                        body.setBlocks(scc);
                        body.recount();
                        this.id = loopId;
                        this.body = body;
                        this.exit = new BlockSet();
                        this.save = {};
                        this.head = new BlockSet();
                        this.npredecessors = 0;
                    }
                    var heads = findLoopHeads(this.blocks);
                    if (heads.length <= 0) {
                        this.markedLoops = true;
                        return true;
                    }
                    var worklist = heads.sort(function (a, b) {
                        return a.level - b.level;
                    });
                    var loopId = 0;
                    for (var n = worklist.length - 1; n >= 0; n--) {
                        var t = worklist[n];
                        var sccs = findSCCs(t);
                        if (sccs.length === 0) {
                            continue;
                        }
                        for (var i = 0, j = sccs.length; i < j; i++) {
                            var scc = sccs[i];
                            var loop = new LoopInfo(scc, loopId++);
                            for (var k = 0, l = scc.length; k < l; k++) {
                                var h = scc[k];
                                if (h.level === t.level + 1 && !h.loop) {
                                    h.loop = loop;
                                    loop.head.set(h.id);
                                    var predecessors = h.predecessors;
                                    for (var pi = 0, pj = predecessors.length; pi < pj; pi++) {
                                        loop.body.get(predecessors[pi].id) && h.npredecessors--;
                                    }
                                    loop.npredecessors += h.npredecessors;
                                }
                            }
                            for (var k = 0, l = scc.length; k < l; k++) {
                                var h = scc[k];
                                if (h.level === t.level + 1) {
                                    h.npredecessors = loop.npredecessors;
                                }
                            }
                            loop.head.recount();
                        }
                    }
                    this.markedLoops = true;
                    return true;
                };
                Analysis.prototype.induceControlTree = function () {
                    var hasExceptions = this.hasExceptions;
                    var BlockSet = this.boundBlockSet;
                    function maybe(exit, save) {
                        exit.recount();
                        if (exit.count === 0) {
                            return null;
                        }
                        exit.save = save;
                        return exit;
                    }
                    var exceptionId = this.blocks.length;
                    //
                    // Based on emscripten's relooper algorithm.
                    // The algorithm is O(|E|) -- it visits every edge in the CFG once.
                    //
                    // Loop header detection is done separately, using an overlaid DJ graph.
                    //
                    // For a vertex v, let successor(v) denote its non-exceptional successoressors.
                    //
                    // Basic blocks can be restructured into 4 types of nodes:
                    //
                    //  1. Switch. |successor(v) > 2|
                    //  2. If.     |successor(v) = 2|
                    //  3. Plain.  |successor(v) = 1|
                    //  4. Loop.   marked as a loop header.
                    //
                    // The idea is fairly simple: start at a set of heads, induce all its
                    // successoressors recursively in that head's context, discharging the edges
                    // that we take. If a vertex no longer has any incoming edges when we
                    // visit it, emit the vertex, else emit a label marking that we need to
                    // go to that vertex and mark that vertex as an exit in the current
                    // context.
                    //
                    // The algorithm starts at the root, the first instruction.
                    //
                    // Exceptions are restructured via rewriting. AVM bytecode stores try
                    // blocks as a range of bytecode positions. Our basic blocks respects
                    // these range boundaries. Each basic block which is in one or more of
                    // such exception ranges have exceptional successoressors (jumps) to all
                    // matching catch blocks. We then restructure the entire basic block as
                    // a try and have the restructuring take care of the jumps to the actual
                    // catch blocks. Finally blocks fall out naturally, but are not emitted
                    // as JavaScript |finally|.
                    //
                    // Implementation Notes
                    // --------------------
                    //
                    // We discharge edges by keeping a property |npredecessors| on each block that
                    // says how many incoming edges we have _not yet_ discharged. We
                    // discharge edges as we recur on the tree, but in case we can't emit a
                    // block (i.e. its |npredecessors| > 0), we need to restore its |npredecessors| before
                    // we pop out. We do this via a |save| proeprty on each block that says
                    // how many predecessors we should restore.
                    //
                    // |exit| is the set of exits in the current context, i.e. the set of
                    // vertices that we visited but have not yet discharged every incoming
                    // edge.
                    //
                    // |save| is a mapping of block id -> save numbers.
                    //
                    // When setting an exit in the exit set, the save number must be set for
                    // it also in the save set.
                    //
                    function induce(head, exit, save, loop, inLoopHead, lookupSwitch, fallthrough) {
                        var v = [];
                        while (head) {
                            if (head.count > 1) {
                                var exit2 = new BlockSet();
                                var save2 = {};
                                var cases = [];
                                var heads = head.members();
                                for (var i = 0, j = heads.length; i < j; i++) {
                                    var h = heads[i];
                                    var bid = h.id;
                                    var c;
                                    if (h.loop && head.contains(h.loop.head)) {
                                        var loop2 = h.loop;
                                        if (!loop2.induced) {
                                            var lheads = loop2.head.members();
                                            var lheadsave = 0;
                                            for (k = 0, l = lheads.length; k < l; k++) {
                                                lheadsave += head.save[lheads[k].id];
                                            }
                                            if (h.npredecessors - lheadsave > 0) {
                                                // Don't even enter the loop if we're just going to exit
                                                // anyways.
                                                h.npredecessors -= head.save[bid];
                                                h.save = head.save[bid];
                                                c = induce(h, exit2, save2, loop);
                                                cases.push(new Control.LabelCase([bid], c));
                                            }
                                            else {
                                                for (k = 0, l = lheads.length; k < l; k++) {
                                                    var lh = lheads[k];
                                                    lh.npredecessors -= lheadsave;
                                                    lh.save = lheadsave;
                                                }
                                                c = induce(h, exit2, save2, loop);
                                                cases.push(new Control.LabelCase(loop2.head.toArray(), c));
                                                loop2.induced = true;
                                            }
                                        }
                                    }
                                    else {
                                        h.npredecessors -= head.save[bid];
                                        h.save = head.save[bid];
                                        c = induce(h, exit2, save2, loop);
                                        cases.push(new Control.LabelCase([bid], c));
                                    }
                                }
                                var pruned = [];
                                var k = 0;
                                var c;
                                for (var i = 0; i < cases.length; i++) {
                                    c = cases[i];
                                    var labels = c.labels;
                                    var lk = 0;
                                    for (var ln = 0, nlabels = labels.length; ln < nlabels; ln++) {
                                        var bid = labels[ln];
                                        if (exit2.get(bid) && heads[i].npredecessors - head.save[bid] > 0) {
                                            pruned.push(bid);
                                        }
                                        else {
                                            labels[lk++] = bid;
                                        }
                                    }
                                    labels.length = lk;
                                    // Prune the case unless it still has some entry labels.
                                    if (labels.length > 0) {
                                        cases[k++] = c;
                                    }
                                }
                                cases.length = k;
                                if (cases.length === 0) {
                                    for (var i = 0; i < pruned.length; i++) {
                                        var bid = pruned[i];
                                        save[bid] = (save[bid] || 0) + head.save[bid];
                                        exit.set(bid);
                                    }
                                    break;
                                }
                                v.push(new Control.LabelSwitch(cases));
                                head = maybe(exit2, save2);
                                continue;
                            }
                            var h, bid, c;
                            if (head.count === 1) {
                                h = head.choose();
                                bid = h.id;
                                h.npredecessors -= head.save[bid];
                                h.save = head.save[bid];
                            }
                            else {
                                h = head;
                                bid = h.id;
                            }
                            if (inLoopHead) {
                                inLoopHead = false;
                            }
                            else {
                                if (loop && !loop.body.get(bid)) {
                                    h.npredecessors += h.save;
                                    loop.exit.set(bid);
                                    loop.save[bid] = (loop.save[bid] || 0) + h.save;
                                    v.push(new Control.Break(bid, loop));
                                    break;
                                }
                                if (loop && h.loop === loop) {
                                    h.npredecessors += h.save;
                                    v.push(new Control.Continue(bid, loop));
                                    break;
                                }
                                if (h === fallthrough) {
                                    break;
                                }
                                if (h.npredecessors > 0) {
                                    h.npredecessors += h.save;
                                    save[bid] = (save[bid] || 0) + h.save;
                                    exit.set(bid);
                                    v.push(lookupSwitch ? new Control.Break(bid, lookupSwitch) : new Control.Exit(bid));
                                    break;
                                }
                                if (h.loop) {
                                    var l = h.loop;
                                    var body;
                                    if (l.head.count === 1) {
                                        body = induce(l.head.choose(), null, null, l, true);
                                    }
                                    else {
                                        var lcases = [];
                                        var lheads = l.head.members();
                                        for (var i = 0, j = lheads.length; i < j; i++) {
                                            var lh = lheads[i];
                                            var lbid = lh.id;
                                            var c = induce(lh, null, null, l, true);
                                            lcases.push(new Control.LabelCase([lbid], c));
                                        }
                                        body = new Control.LabelSwitch(lcases);
                                    }
                                    v.push(new Control.Loop(body));
                                    head = maybe(l.exit, l.save);
                                    continue;
                                }
                            }
                            var sv;
                            var successors;
                            var exit2 = new BlockSet();
                            var save2 = {};
                            if (hasExceptions && h.hasCatches) {
                                var allsuccessors = h.successors;
                                var catchsuccessors = [];
                                successors = [];
                                for (var i = 0, j = allsuccessors.length; i < j; i++) {
                                    var s = allsuccessors[i];
                                    (s.exception ? catchsuccessors : successors).push(s);
                                }
                                var catches = [];
                                for (var i = 0; i < catchsuccessors.length; i++) {
                                    var t = catchsuccessors[i];
                                    t.npredecessors -= 1;
                                    t.save = 1;
                                    var c = induce(t, exit2, save2, loop);
                                    var ex = t.exception;
                                    catches.push(new Control.Catch(ex.varName, ex.typeName, c));
                                }
                                sv = new Control.Try(h, catches);
                            }
                            else {
                                successors = h.successors;
                                sv = h;
                            }
                            /*
                             if (h.end.op === OP_lookupswitch) {
                             var cases = [];
                             var targets = h.end.targets;
                  
                             for (var i = targets.length - 1; i >= 0; i--) {
                             var t = targets[i];
                             t.npredecessors -= 1;
                             t.save = 1;
                             c = induce(t, exit2, save2, loop, null, h, targets[i + 1]);
                             cases.unshift(new Control.Case(i, c));
                             }
                  
                             // The last case is the default case.
                             cases.top().index = undefined;
                  
                             if (hasExceptions && h.hasCatches) {
                             sv.nothingThrownLabel = exceptionId;
                             sv = new Control.Switch(sv, cases, exceptionId++);
                             } else {
                             sv = new Control.Switch(sv, cases);
                             }
                  
                             head = maybe(exit2, save2);
                             } else
                             */
                            if (successors.length > 2) {
                                var cases = [];
                                var targets = successors;
                                for (var i = targets.length - 1; i >= 0; i--) {
                                    var t = targets[i];
                                    t.npredecessors -= 1;
                                    t.save = 1;
                                    c = induce(t, exit2, save2, loop, null, h, targets[i + 1]);
                                    cases.unshift(new Control.Case(i, c));
                                }
                                // The last case is the default case.
                                top(cases).index = undefined;
                                if (hasExceptions && h.hasCatches) {
                                    sv.nothingThrownLabel = exceptionId;
                                    sv = new Control.Switch(sv, cases, exceptionId++);
                                }
                                else {
                                    sv = new Control.Switch(sv, cases);
                                }
                                head = maybe(exit2, save2);
                            }
                            else if (successors.length === 2) {
                                var branch1 = h.hasFlippedSuccessors ? successors[1] : successors[0];
                                var branch2 = h.hasFlippedSuccessors ? successors[0] : successors[1];
                                branch1.npredecessors -= 1;
                                branch1.save = 1;
                                var c1 = induce(branch1, exit2, save2, loop);
                                branch2.npredecessors -= 1;
                                branch2.save = 1;
                                var c2 = induce(branch2, exit2, save2, loop);
                                if (hasExceptions && h.hasCatches) {
                                    sv.nothingThrownLabel = exceptionId;
                                    sv = new Control.If(sv, c1, c2, exceptionId++);
                                }
                                else {
                                    sv = new Control.If(sv, c1, c2);
                                }
                                head = maybe(exit2, save2);
                            }
                            else {
                                c = successors[0];
                                if (c) {
                                    if (hasExceptions && h.hasCatches) {
                                        sv.nothingThrownLabel = c.id;
                                        save2[c.id] = (save2[c.id] || 0) + 1;
                                        exit2.set(c.id);
                                        head = maybe(exit2, save2);
                                    }
                                    else {
                                        c.npredecessors -= 1;
                                        c.save = 1;
                                        head = c;
                                    }
                                }
                                else {
                                    if (hasExceptions && h.hasCatches) {
                                        sv.nothingThrownLabel = -1;
                                        head = maybe(exit2, save2);
                                    }
                                    else {
                                        head = c;
                                    }
                                }
                            }
                            v.push(sv);
                        }
                        if (v.length > 1) {
                            return new Control.Seq(v);
                        }
                        return v[0];
                    }
                    var root = this.blocks[0];
                    this.controlTree = induce(root, new BlockSet(), {});
                };
                Analysis.prototype.restructureControlFlow = function () {
                    J2ME.enterTimeline("Restructure Control Flow");
                    if (!this.markedLoops && !this.markLoops()) {
                        J2ME.leaveTimeline();
                        return false;
                    }
                    this.induceControlTree();
                    this.restructuredControlFlow = true;
                    J2ME.leaveTimeline();
                    return true;
                };
                return Analysis;
            })();
            Looper.Analysis = Analysis;
            function analyze(cfg) {
                var analysis = new Analysis(cfg);
                analysis.restructureControlFlow();
                return analysis.controlTree;
            }
            Looper.analyze = analyze;
        })(Looper = C4.Looper || (C4.Looper = {}));
    })(C4 = J2ME.C4 || (J2ME.C4 = {}));
})(J2ME || (J2ME = {}));
/*
 * Copyright 2013 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var J2ME;
(function (J2ME) {
    var C4;
    (function (C4) {
        var Backend;
        (function (Backend) {
            var assert = J2ME.Debug.assert;
            var unexpected = J2ME.Debug.unexpected;
            var notImplemented = J2ME.Debug.notImplemented;
            var pushUnique = J2ME.ArrayUtilities.pushUnique;
            var Literal = C4.AST.Literal;
            var Identifier = C4.AST.Identifier;
            var VariableDeclaration = C4.AST.VariableDeclaration;
            var VariableDeclarator = C4.AST.VariableDeclarator;
            var MemberExpression = C4.AST.MemberExpression;
            var BinaryExpression = C4.AST.BinaryExpression;
            var CallExpression = C4.AST.CallExpression;
            var AssignmentExpression = C4.AST.AssignmentExpression;
            var ExpressionStatement = C4.AST.ExpressionStatement;
            var ReturnStatement = C4.AST.ReturnStatement;
            var ConditionalExpression = C4.AST.ConditionalExpression;
            var ObjectExpression = C4.AST.ObjectExpression;
            var ArrayExpression = C4.AST.ArrayExpression;
            var UnaryExpression = C4.AST.UnaryExpression;
            var Property = C4.AST.Property;
            var BlockStatement = C4.AST.BlockStatement;
            var ThisExpression = C4.AST.ThisExpression;
            var ThrowStatement = C4.AST.ThrowStatement;
            var IfStatement = C4.AST.IfStatement;
            var WhileStatement = C4.AST.WhileStatement;
            var BreakStatement = C4.AST.BreakStatement;
            var ContinueStatement = C4.AST.ContinueStatement;
            var SwitchStatement = C4.AST.SwitchStatement;
            var SwitchCase = C4.AST.SwitchCase;
            var Start = C4.IR.Start;
            var Variable = C4.IR.Variable;
            var Constant = C4.IR.Constant;
            var Operator = C4.IR.Operator;
            var Control = C4.Looper.Control;
            var last = J2ME.ArrayUtilities.last;
            Control.Break.prototype.compile = function (cx) {
                return cx.compileBreak(this);
            };
            Control.Continue.prototype.compile = function (cx) {
                return cx.compileContinue(this);
            };
            Control.Exit.prototype.compile = function (cx) {
                return cx.compileExit(this);
            };
            Control.LabelSwitch.prototype.compile = function (cx) {
                return cx.compileLabelSwitch(this);
            };
            Control.Seq.prototype.compile = function (cx) {
                return cx.compileSequence(this);
            };
            Control.Loop.prototype.compile = function (cx) {
                return cx.compileLoop(this);
            };
            Control.Switch.prototype.compile = function (cx) {
                return cx.compileSwitch(this);
            };
            Control.If.prototype.compile = function (cx) {
                return cx.compileIf(this);
            };
            Control.Try.prototype.compile = function (cx) {
                notImplemented("try");
                return null;
            };
            var F = new Identifier("$F");
            var C = new Identifier("$C");
            function isLazyConstant(value) {
                return false;
            }
            function constant(value, cx) {
                if (typeof value === "string" || value === null || value === true || value === false) {
                    return new Literal(value);
                }
                else if (value === undefined) {
                    return new Identifier("undefined");
                }
                else if (typeof value === "object" || typeof value === "function") {
                    if (isLazyConstant(value)) {
                        return call(property(F, "C"), [new Literal(cx.useConstant(value))]);
                    }
                    else {
                        return new MemberExpression(C, new Literal(cx.useConstant(value)), true);
                    }
                }
                else if (typeof value === "number" && isNaN(value)) {
                    return new Identifier("NaN");
                }
                else if (value === Infinity) {
                    return new Identifier("Infinity");
                }
                else if (value === -Infinity) {
                    return new UnaryExpression("-", true, new Identifier("Infinity"));
                }
                else if (typeof value === "number" && (1 / value) < 0) {
                    return new UnaryExpression("-", true, new Literal(Math.abs(value)));
                }
                else if (typeof value === "number") {
                    return new Literal(value);
                }
                else {
                    unexpected("Cannot emit constant for value: " + value);
                }
            }
            Backend.constant = constant;
            function id(name) {
                release || assert(typeof name === "string");
                return new Identifier(name);
            }
            Backend.id = id;
            function isIdentifierName(s) {
                if (!J2ME.isIdentifierStart(s[0])) {
                    return false;
                }
                for (var i = 1; i < s.length; i++) {
                    if (!J2ME.isIdentifierPart(s[i])) {
                        return false;
                    }
                }
                return true;
            }
            Backend.isIdentifierName = isIdentifierName;
            function property(obj) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                for (var i = 0; i < args.length; i++) {
                    var x = args[i];
                    if (typeof x === "string") {
                        if (isIdentifierName(x)) {
                            obj = new MemberExpression(obj, new Identifier(x), false);
                        }
                        else {
                            obj = new MemberExpression(obj, new Literal(x), true);
                        }
                    }
                    else if (x instanceof Literal && isIdentifierName(x.value)) {
                        obj = new MemberExpression(obj, new Identifier(x.value), false);
                    }
                    else {
                        obj = new MemberExpression(obj, x, true);
                    }
                }
                return obj;
            }
            Backend.property = property;
            function call(callee, args) {
                release || assert(args instanceof Array);
                release || args.forEach(function (x) {
                    release || assert(!(x instanceof Array));
                    release || assert(x !== undefined);
                });
                return new CallExpression(callee, args);
            }
            Backend.call = call;
            function callAsCall(callee, object, args) {
                return call(property(callee, "asCall"), [object].concat(args));
            }
            function callCall(callee, object, args) {
                return call(property(callee, "call"), [object].concat(args));
            }
            Backend.callCall = callCall;
            function assignment(left, right) {
                release || assert(left && right);
                return new AssignmentExpression("=", left, right);
            }
            Backend.assignment = assignment;
            function variableDeclaration(declarations) {
                return new VariableDeclaration(declarations, "var");
            }
            function negate(node) {
                if (node instanceof Constant) {
                    if (node.value === true || node.value === false) {
                        return constant(!node.value);
                    }
                }
                else if (node instanceof Identifier) {
                    return new UnaryExpression(Operator.FALSE.name, true, node);
                }
                release || assert(node instanceof BinaryExpression || node instanceof UnaryExpression, node);
                var left = node instanceof BinaryExpression ? node.left : node.argument;
                var right = node.right;
                var operator = Operator.fromName(node.operator);
                if (operator === Operator.EQ && right instanceof Literal && right.value === false) {
                    return left;
                }
                if (operator === Operator.FALSE) {
                    return left;
                }
                if (operator.not) {
                    if (node instanceof BinaryExpression) {
                        return new BinaryExpression(operator.not.name, left, right);
                    }
                    else {
                        return new UnaryExpression(operator.not.name, true, left);
                    }
                }
                return new UnaryExpression(Operator.FALSE.name, true, node);
            }
            var Context = (function () {
                function Context() {
                    this.label = new Variable("$L");
                    this.variables = [];
                    this.constants = [];
                    this.parameters = [];
                }
                Context.prototype.useConstant = function (constant) {
                    return pushUnique(this.constants, constant);
                };
                Context.prototype.useVariable = function (variable) {
                    release || assert(variable);
                    return pushUnique(this.variables, variable);
                };
                Context.prototype.useParameter = function (parameter) {
                    return this.parameters[parameter.index] = parameter;
                };
                Context.prototype.compileLabelBody = function (node) {
                    var body = [];
                    if (node.label !== undefined) {
                        this.useVariable(this.label);
                        body.push(new ExpressionStatement(assignment(id(this.label.name), new Literal(node.label))));
                    }
                    return body;
                };
                Context.prototype.compileBreak = function (node) {
                    var body = this.compileLabelBody(node);
                    body.push(new BreakStatement(null));
                    return new BlockStatement(body);
                };
                Context.prototype.compileContinue = function (node) {
                    var body = this.compileLabelBody(node);
                    body.push(new ContinueStatement(null));
                    return new BlockStatement(body);
                };
                Context.prototype.compileExit = function (node) {
                    return new BlockStatement(this.compileLabelBody(node));
                };
                Context.prototype.compileIf = function (node) {
                    var cr = node.cond.compile(this);
                    var tr = null, er = null;
                    if (node.then) {
                        tr = node.then.compile(this);
                    }
                    if (node.else) {
                        er = node.else.compile(this);
                    }
                    var condition = compileValue(cr.end.predicate, this);
                    condition = node.negated ? negate(condition) : condition;
                    cr.body.push(new IfStatement(condition, tr || new BlockStatement([]), er || null));
                    return cr;
                };
                Context.prototype.compileSwitch = function (node) {
                    var dr = node.determinant.compile(this);
                    var cases = [];
                    node.cases.forEach(function (x) {
                        var br;
                        if (x.body) {
                            br = x.body.compile(this);
                        }
                        var test = typeof x.index === "number" ? new Literal(x.index) : undefined;
                        cases.push(new SwitchCase(test, br ? [br] : []));
                    }, this);
                    var determinant = compileValue(dr.end.determinant, this);
                    dr.body.push(new SwitchStatement(determinant, cases, false));
                    return dr;
                };
                Context.prototype.compileLabelSwitch = function (node) {
                    var statement = null;
                    var labelName = id(this.label.name);
                    function compileLabelTest(labelID) {
                        release || assert(typeof labelID === "number");
                        return new BinaryExpression("===", labelName, new Literal(labelID));
                    }
                    for (var i = node.cases.length - 1; i >= 0; i--) {
                        var c = node.cases[i];
                        var labels = c.labels;
                        var labelTest = compileLabelTest(labels[0]);
                        for (var j = 1; j < labels.length; j++) {
                            labelTest = new BinaryExpression("||", labelTest, compileLabelTest(labels[j]));
                        }
                        statement = new IfStatement(labelTest, c.body ? c.body.compile(this) : new BlockStatement([]), statement);
                    }
                    return statement;
                };
                Context.prototype.compileLoop = function (node) {
                    var br = node.body.compile(this);
                    return new WhileStatement(constant(true), br);
                };
                Context.prototype.compileSequence = function (node) {
                    var cx = this;
                    var body = [];
                    node.body.forEach(function (x) {
                        var result = x.compile(cx);
                        if (result instanceof BlockStatement) {
                            body = body.concat(result.body);
                        }
                        else {
                            body.push(result);
                        }
                    });
                    return new BlockStatement(body);
                };
                Context.prototype.compileBlock = function (block) {
                    var body = [];
                    for (var i = 1; i < block.nodes.length - 1; i++) {
                        var node = block.nodes[i];
                        var statement;
                        var to;
                        var from;
                        if (node instanceof C4.IR.Throw) {
                            statement = compileValue(node, this, true);
                        }
                        else {
                            if (node instanceof C4.IR.Move) {
                                to = id(node.to.name);
                                this.useVariable(node.to);
                                from = compileValue(node.from, this);
                            }
                            else {
                                from = compileValue(node, this, true);
                                if (from instanceof C4.AST.Statement) {
                                    body.push(from);
                                    continue;
                                }
                                else {
                                    if (node.variable) {
                                        to = id(node.variable.name);
                                        this.useVariable(node.variable);
                                    }
                                    else {
                                        to = null;
                                    }
                                }
                            }
                            if (to) {
                                statement = new ExpressionStatement(assignment(to, from));
                            }
                            else {
                                statement = new ExpressionStatement(from);
                            }
                        }
                        body.push(statement);
                    }
                    var end = last(block.nodes);
                    if (end instanceof C4.IR.Stop) {
                        body.push(new ReturnStatement(compileValue(end.argument, this)));
                    }
                    var result = new BlockStatement(body);
                    result.end = last(block.nodes);
                    release || assert(result.end instanceof C4.IR.End);
                    // print("Block: " + block + " -> " + generateSource(result));
                    return result;
                };
                return Context;
            })();
            Backend.Context = Context;
            function compileValue(value, cx, noVariable) {
                release || assert(value);
                release || assert(value.compile, "Implement |compile| for " + value + " (" + value.nodeName + ")");
                release || assert(cx instanceof Context);
                release || assert(!isArray(value));
                if (noVariable || !value.variable) {
                    var node = value.compile(cx);
                    return node;
                }
                release || assert(value.variable, "Value has no variable: " + value);
                return id(value.variable.name);
            }
            Backend.compileValue = compileValue;
            function isArray(array) {
                return array instanceof Array;
            }
            function compileValues(values, cx) {
                release || assert(isArray(values));
                return values.map(function (value) {
                    return compileValue(value, cx);
                });
            }
            Backend.compileValues = compileValues;
            C4.IR.Parameter.prototype.compile = function (cx) {
                cx.useParameter(this);
                return id(this.name);
            };
            C4.IR.Constant.prototype.compile = function (cx) {
                return constant(this.value, cx);
            };
            C4.IR.Variable.prototype.compile = function (cx) {
                return id(this.name);
            };
            C4.IR.Phi.prototype.compile = function (cx) {
                release || assert(this.variable);
                return compileValue(this.variable, cx);
            };
            C4.IR.Latch.prototype.compile = function (cx) {
                return new ConditionalExpression(compileValue(this.condition, cx), compileValue(this.left, cx), compileValue(this.right, cx));
            };
            C4.IR.Unary.prototype.compile = function (cx) {
                var result = new UnaryExpression(this.operator.name, true, compileValue(this.argument, cx));
                if (this.operator === Operator.INEG) {
                    return new BinaryExpression("|", result, constant(0));
                }
                // Float and double don't need conversion.
                return result;
            };
            C4.IR.Copy.prototype.compile = function (cx) {
                return compileValue(this.argument, cx);
            };
            C4.IR.Binary.prototype.compile = function (cx) {
                var left = compileValue(this.left, cx);
                var right = compileValue(this.right, cx);
                var result = new BinaryExpression(this.operator.name, left, right);
                if (this.operator === Operator.IADD || this.operator === Operator.ISUB || this.operator === Operator.IMUL || this.operator === Operator.IDIV || this.operator === Operator.IREM) {
                    return new BinaryExpression("|", result, constant(0));
                }
                else if (this.operator === Operator.FADD || this.operator === Operator.FSUB || this.operator === Operator.FMUL || this.operator === Operator.FDIV || this.operator === Operator.FREM) {
                    return call(id("Math.fround"), [result]);
                }
                else if (this.operator === Operator.DADD || this.operator === Operator.DSUB || this.operator === Operator.DMUL || this.operator === Operator.DDIV || this.operator === Operator.DREM) {
                    return new UnaryExpression("+", true, result);
                }
                return result;
            };
            C4.IR.CallProperty.prototype.compile = function (cx) {
                var object = compileValue(this.object, cx);
                var name = compileValue(this.name, cx);
                var callee = property(object, name);
                var args = this.args.map(function (arg) {
                    return compileValue(arg, cx);
                });
                return call(callee, args);
            };
            C4.IR.Call.prototype.compile = function (cx) {
                var args = this.args.map(function (arg) {
                    return compileValue(arg, cx);
                });
                var callee = compileValue(this.callee, cx);
                var object;
                if (this.object) {
                    object = compileValue(this.object, cx);
                }
                else {
                    object = new Literal(null);
                }
                return callCall(callee, object, args);
            };
            C4.IR.This.prototype.compile = function (cx) {
                return new ThisExpression();
            };
            C4.IR.Throw.prototype.compile = function (cx) {
                var argument = compileValue(this.argument, cx);
                return new ThrowStatement(argument);
            };
            C4.IR.Arguments.prototype.compile = function (cx) {
                return id("arguments");
            };
            C4.IR.GlobalProperty.prototype.compile = function (cx) {
                return id(this.name);
            };
            C4.IR.GetProperty.prototype.compile = function (cx) {
                var object = compileValue(this.object, cx);
                var name = compileValue(this.name, cx);
                return property(object, name);
            };
            C4.IR.SetProperty.prototype.compile = function (cx) {
                var object = compileValue(this.object, cx);
                var name = compileValue(this.name, cx);
                var value = compileValue(this.value, cx);
                return assignment(property(object, name), value);
            };
            C4.IR.Projection.prototype.compile = function (cx) {
                release || assert(this.type === 4 /* CONTEXT */);
                release || assert(this.argument instanceof Start);
                return compileValue(this.argument.scope, cx);
            };
            C4.IR.NewArray.prototype.compile = function (cx) {
                return new ArrayExpression(compileValues(this.elements, cx));
            };
            C4.IR.NewObject.prototype.compile = function (cx) {
                var properties = this.properties.map(function (property) {
                    var key = compileValue(property.key, cx);
                    var value = compileValue(property.value, cx);
                    return new Property(key, value, "init");
                });
                return new ObjectExpression(properties);
            };
            C4.IR.Block.prototype.compile = function (cx) {
                return cx.compileBlock(this);
            };
            function generateSource(node) {
                return node.toSource();
            }
            var Compilation = (function () {
                function Compilation(parameters, body, constants) {
                    this.parameters = parameters;
                    this.body = body;
                    this.constants = constants;
                    // ...
                }
                /**
                 * Object references are stored on the compilation object in a property called |constants|. Some of
                 * these constants are |LazyInitializer|s and the backend makes sure to emit a call to a function
                 * named |C| that resolves them.
                 */
                Compilation.prototype.C = function (index) {
                    var value = this.constants[index];
                    // TODO: Avoid using |instanceof| here since this can be called quite frequently.
                    if (value._isLazyInitializer) {
                        this.constants[index] = value.resolve();
                    }
                    return this.constants[index];
                };
                Compilation.id = 0;
                return Compilation;
            })();
            Backend.Compilation = Compilation;
            function generate(cfg) {
                J2ME.enterTimeline("Looper");
                var root = C4.Looper.analyze(cfg);
                J2ME.leaveTimeline();
                var writer = new J2ME.IndentingWriter();
                var cx = new Context();
                J2ME.enterTimeline("Construct AST");
                var code = root.compile(cx);
                J2ME.leaveTimeline();
                var parameters = [];
                for (var i = 0; i < cx.parameters.length; i++) {
                    // Closure Compiler complains if the parameter names are the same even if they are not used,
                    // so we differentiate them here.
                    var name = cx.parameters[i] ? cx.parameters[i].name : "_" + i;
                    parameters.push(id(name));
                }
                var compilationId = Compilation.id++;
                var compilationGlobalPropertyName = "$$F" + compilationId;
                if (cx.constants.length) {
                    var compilation = new Identifier(compilationGlobalPropertyName);
                    var constants = new MemberExpression(compilation, new Identifier("constants"), false);
                    code.body.unshift(variableDeclaration([
                        new VariableDeclarator(id("$F"), compilation),
                        new VariableDeclarator(id("$C"), constants)
                    ]));
                }
                if (cx.variables.length) {
                    countTimeline("Backend: Locals", cx.variables.length);
                    var variables = variableDeclaration(cx.variables.map(function (variable) {
                        return new VariableDeclarator(id(variable.name));
                    }));
                    code.body.unshift(variables);
                }
                J2ME.enterTimeline("Serialize AST");
                var source = generateSource(code);
                J2ME.leaveTimeline();
                // Save compilation as a globa property name.
                return jsGlobal[compilationGlobalPropertyName] = new Compilation(parameters.map(function (p) {
                    return p.name;
                }), source, cx.constants);
            }
            Backend.generate = generate;
        })(Backend = C4.Backend || (C4.Backend = {}));
    })(C4 = J2ME.C4 || (J2ME.C4 = {}));
})(J2ME || (J2ME = {}));
/**
 * Created by mbebenita on 10/21/14.
 */
var J2ME;
(function (J2ME) {
    var C4;
    (function (C4) {
        var IR;
        (function (IR) {
            var JVMLong = (function (_super) {
                __extends(JVMLong, _super);
                function JVMLong(lowBits, highBits, kind) {
                    if (kind === void 0) { kind = 6 /* Long */; }
                    _super.call(this);
                    this.lowBits = lowBits;
                    this.highBits = highBits;
                    this.kind = kind;
                }
                JVMLong.prototype.toString = function () {
                    return "J<" + this.lowBits + "," + this.highBits + ">";
                };
                return JVMLong;
            })(IR.Value);
            IR.JVMLong = JVMLong;
            JVMLong.prototype.nodeName = "JVMLong";
            var JVMString = (function (_super) {
                __extends(JVMString, _super);
                function JVMString(value) {
                    _super.call(this, value);
                }
                JVMString.prototype.toString = function () {
                    return "S<" + this.value + ">";
                };
                return JVMString;
            })(IR.Constant);
            IR.JVMString = JVMString;
            JVMString.prototype.nodeName = "JVMString";
            var JVMClass = (function (_super) {
                __extends(JVMClass, _super);
                function JVMClass(classInfo) {
                    _super.call(this, classInfo);
                }
                JVMClass.prototype.toString = function () {
                    return "C<" + this.value.className + ">";
                };
                return JVMClass;
            })(IR.Constant);
            IR.JVMClass = JVMClass;
            JVMClass.prototype.nodeName = "JVMClass";
            var JVMNewArray = (function (_super) {
                __extends(JVMNewArray, _super);
                function JVMNewArray(control, store, arrayKind, length) {
                    _super.call(this, control, store);
                    this.control = control;
                    this.store = store;
                    this.arrayKind = arrayKind;
                    this.length = length;
                }
                JVMNewArray.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    visitor(this.length);
                };
                return JVMNewArray;
            })(IR.StoreDependent);
            IR.JVMNewArray = JVMNewArray;
            JVMNewArray.prototype.nodeName = "JVMNewArray";
            var JVMNewObjectArray = (function (_super) {
                __extends(JVMNewObjectArray, _super);
                function JVMNewObjectArray(control, store, classInfo, length) {
                    _super.call(this, control, store);
                    this.control = control;
                    this.store = store;
                    this.classInfo = classInfo;
                    this.length = length;
                }
                JVMNewObjectArray.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    visitor(this.length);
                };
                return JVMNewObjectArray;
            })(IR.StoreDependent);
            IR.JVMNewObjectArray = JVMNewObjectArray;
            JVMNewObjectArray.prototype.nodeName = "JVMNewObjectArray";
            var JVMLongBinary = (function (_super) {
                __extends(JVMLongBinary, _super);
                function JVMLongBinary(operator, a, b) {
                    _super.call(this);
                    this.operator = operator;
                    this.a = a;
                    this.b = b;
                    this.kind = 6 /* Long */;
                }
                JVMLongBinary.prototype.visitInputs = function (visitor) {
                    visitor(this.a);
                    visitor(this.b);
                };
                return JVMLongBinary;
            })(IR.Value);
            IR.JVMLongBinary = JVMLongBinary;
            JVMLongBinary.prototype.nodeName = "JVMLongBinary";
            var JVMLongUnary = (function (_super) {
                __extends(JVMLongUnary, _super);
                function JVMLongUnary(operator, a) {
                    _super.call(this);
                    this.operator = operator;
                    this.a = a;
                    this.kind = 6 /* Long */;
                }
                JVMLongUnary.prototype.visitInputs = function (visitor) {
                    visitor(this.a);
                };
                return JVMLongUnary;
            })(IR.Value);
            IR.JVMLongUnary = JVMLongUnary;
            JVMLongUnary.prototype.nodeName = "JVMLongUnary";
            var JVMFloatCompare = (function (_super) {
                __extends(JVMFloatCompare, _super);
                function JVMFloatCompare(control, a, b, lessThan) {
                    _super.call(this);
                    this.control = control;
                    this.a = a;
                    this.b = b;
                    this.lessThan = lessThan;
                }
                JVMFloatCompare.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                    visitor(this.a);
                    visitor(this.b);
                };
                return JVMFloatCompare;
            })(IR.Value);
            IR.JVMFloatCompare = JVMFloatCompare;
            JVMFloatCompare.prototype.nodeName = "JVMFloatCompare";
            var JVMLongCompare = (function (_super) {
                __extends(JVMLongCompare, _super);
                function JVMLongCompare(control, a, b) {
                    _super.call(this);
                    this.control = control;
                    this.a = a;
                    this.b = b;
                }
                JVMLongCompare.prototype.visitInputs = function (visitor) {
                    visitor(this.control);
                    visitor(this.a);
                    visitor(this.b);
                };
                return JVMLongCompare;
            })(IR.Value);
            IR.JVMLongCompare = JVMLongCompare;
            JVMLongCompare.prototype.nodeName = "JVMLongCompare";
            var JVMStoreIndexed = (function (_super) {
                __extends(JVMStoreIndexed, _super);
                function JVMStoreIndexed(control, store, kind, array, index, value) {
                    _super.call(this, control, store);
                    this.kind = kind;
                    this.array = array;
                    this.index = index;
                    this.value = value;
                }
                JVMStoreIndexed.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    visitor(this.array);
                    visitor(this.index);
                    visitor(this.value);
                };
                return JVMStoreIndexed;
            })(IR.StoreDependent);
            IR.JVMStoreIndexed = JVMStoreIndexed;
            JVMStoreIndexed.prototype.nodeName = "JVMStoreIndexed";
            var JVMLoadIndexed = (function (_super) {
                __extends(JVMLoadIndexed, _super);
                function JVMLoadIndexed(control, store, kind, array, index) {
                    _super.call(this, control, store);
                    this.kind = kind;
                    this.array = array;
                    this.index = index;
                }
                JVMLoadIndexed.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    visitor(this.array);
                    visitor(this.index);
                };
                return JVMLoadIndexed;
            })(IR.StoreDependent);
            IR.JVMLoadIndexed = JVMLoadIndexed;
            JVMLoadIndexed.prototype.nodeName = "JVMLoadIndexed ";
            var JVMConvert = (function (_super) {
                __extends(JVMConvert, _super);
                function JVMConvert(from, to, value) {
                    _super.call(this);
                    this.from = from;
                    this.to = to;
                    this.value = value;
                }
                JVMConvert.prototype.visitInputs = function (visitor) {
                    visitor(this.value);
                };
                return JVMConvert;
            })(IR.Value);
            IR.JVMConvert = JVMConvert;
            JVMConvert.prototype.nodeName = "JVMConvert";
            function visitStateInputs(a, visitor) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] === null) {
                        continue;
                    }
                    visitor(a[i]);
                    if (J2ME.isTwoSlot(a[i].kind)) {
                        i++;
                    }
                }
            }
            var JVMInvoke = (function (_super) {
                __extends(JVMInvoke, _super);
                function JVMInvoke(control, store, state, opcode, object, methodInfo, args) {
                    _super.call(this, control, store);
                    this.state = state;
                    this.opcode = opcode;
                    this.object = object;
                    this.methodInfo = methodInfo;
                    this.args = args;
                }
                JVMInvoke.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    this.object && visitor(this.object);
                    IR.visitArrayInputs(this.args, visitor);
                    if (this.state) {
                        visitStateInputs(this.state.local, visitor);
                        visitStateInputs(this.state.stack, visitor);
                    }
                };
                JVMInvoke.prototype.replaceInput = function (oldInput, newInput) {
                    var count = _super.prototype.replaceInput.call(this, oldInput, newInput);
                    if (this.state) {
                        count += this.state.local.replace(oldInput, newInput);
                        count += this.state.stack.replace(oldInput, newInput);
                    }
                    return count;
                };
                return JVMInvoke;
            })(IR.StoreDependent);
            IR.JVMInvoke = JVMInvoke;
            JVMInvoke.prototype.nodeName = "JVMInvoke";
            var JVMNew = (function (_super) {
                __extends(JVMNew, _super);
                function JVMNew(control, store, classInfo) {
                    _super.call(this, control, store);
                    this.classInfo = classInfo;
                }
                return JVMNew;
            })(IR.StoreDependent);
            IR.JVMNew = JVMNew;
            JVMNew.prototype.nodeName = "JVMNew";
            var JVMThrow = (function (_super) {
                __extends(JVMThrow, _super);
                function JVMThrow(control, store, object) {
                    _super.call(this, control, store);
                    this.object = object;
                    this.handlesAssignment = true;
                }
                JVMThrow.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    visitor(this.object);
                };
                return JVMThrow;
            })(IR.StoreDependent);
            IR.JVMThrow = JVMThrow;
            JVMThrow.prototype.nodeName = "JVMThrow";
            var JVMCheckCast = (function (_super) {
                __extends(JVMCheckCast, _super);
                function JVMCheckCast(control, store, object, classInfo) {
                    _super.call(this, control, store);
                    this.object = object;
                    this.classInfo = classInfo;
                }
                JVMCheckCast.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    visitor(this.object);
                };
                return JVMCheckCast;
            })(IR.StoreDependent);
            IR.JVMCheckCast = JVMCheckCast;
            JVMCheckCast.prototype.nodeName = "JVMCheckCast";
            var JVMInstanceOf = (function (_super) {
                __extends(JVMInstanceOf, _super);
                function JVMInstanceOf(control, store, object, classInfo) {
                    _super.call(this, control, store);
                    this.object = object;
                    this.classInfo = classInfo;
                }
                JVMInstanceOf.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    visitor(this.object);
                };
                return JVMInstanceOf;
            })(IR.StoreDependent);
            IR.JVMInstanceOf = JVMInstanceOf;
            JVMInstanceOf.prototype.nodeName = "JVMInstanceOf";
            var JVMCheckArithmetic = (function (_super) {
                __extends(JVMCheckArithmetic, _super);
                function JVMCheckArithmetic(control, store, value) {
                    _super.call(this, control, store);
                    this.value = value;
                }
                JVMCheckArithmetic.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    visitor(this.value);
                };
                return JVMCheckArithmetic;
            })(IR.StoreDependent);
            IR.JVMCheckArithmetic = JVMCheckArithmetic;
            JVMCheckArithmetic.prototype.nodeName = "JVMCheckArithmetic";
            var JVMGetField = (function (_super) {
                __extends(JVMGetField, _super);
                function JVMGetField(control, store, object, fieldInfo) {
                    _super.call(this, control, store);
                    this.object = object;
                    this.fieldInfo = fieldInfo;
                }
                JVMGetField.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    this.object && visitor(this.object);
                };
                return JVMGetField;
            })(IR.StoreDependent);
            IR.JVMGetField = JVMGetField;
            JVMGetField.prototype.nodeName = "JVMGetField";
            var JVMPutField = (function (_super) {
                __extends(JVMPutField, _super);
                function JVMPutField(control, store, object, fieldInfo, value) {
                    _super.call(this, control, store);
                    this.object = object;
                    this.fieldInfo = fieldInfo;
                    this.value = value;
                }
                JVMPutField.prototype.visitInputs = function (visitor) {
                    _super.prototype.visitInputs.call(this, visitor);
                    this.object && visitor(this.object);
                    visitor(this.value);
                };
                return JVMPutField;
            })(IR.StoreDependent);
            IR.JVMPutField = JVMPutField;
            JVMPutField.prototype.nodeName = "JVMPutField";
        })(IR = C4.IR || (C4.IR = {}));
    })(C4 = J2ME.C4 || (J2ME.C4 = {}));
})(J2ME || (J2ME = {}));
var J2ME;
(function (J2ME) {
    var C4;
    (function (C4) {
        var Backend;
        (function (Backend) {
            var Operator = C4.IR.Operator;
            var assert = J2ME.Debug.assert;
            C4.IR.JVMLong.prototype.compile = function (cx) {
                return new C4.AST.CallExpression(new C4.AST.Identifier("Long.fromBits"), [Backend.constant(this.lowBits), Backend.constant(this.highBits)]);
            };
            C4.IR.JVMString.prototype.compile = function (cx) {
                return new C4.AST.CallExpression(new C4.AST.Identifier("$S"), [Backend.constant(this.value)]);
            };
            C4.IR.JVMClass.prototype.compile = function (cx) {
                return Backend.id(J2ME.mangleClass(this.value));
            };
            C4.IR.JVMCheckCast.prototype.compile = function (cx) {
                var object = Backend.compileValue(this.object, cx);
                var runtimeFunction = "$CCK";
                if (this.classInfo.isInterface) {
                    runtimeFunction = "$CCI";
                }
                return new C4.AST.CallExpression(new C4.AST.Identifier(runtimeFunction), [object, Backend.id(J2ME.mangleClass(this.classInfo))]);
            };
            C4.IR.JVMInstanceOf.prototype.compile = function (cx) {
                var object = Backend.compileValue(this.object, cx);
                var runtimeFunction = "$IOK";
                if (this.classInfo.isInterface) {
                    runtimeFunction = "$IOI";
                }
                return new C4.AST.BinaryExpression("|", new C4.AST.CallExpression(new C4.AST.Identifier(runtimeFunction), [object, Backend.id(J2ME.mangleClass(this.classInfo))]), new C4.AST.Literal(0));
            };
            C4.IR.JVMCheckArithmetic.prototype.compile = function (cx) {
                var value = Backend.compileValue(this.value, cx);
                var check;
                if (this.value.kind === 6 /* Long */) {
                    check = "$CDZL";
                }
                else {
                    check = "$CDZ";
                }
                return new C4.AST.CallExpression(new C4.AST.Identifier(check), [value]);
            };
            C4.IR.JVMNewArray.prototype.compile = function (cx) {
                var jsTypedArrayType;
                switch (this.arrayKind) {
                    case 4 /* Int */:
                        jsTypedArrayType = "Int32Array";
                        break;
                    case 3 /* Char */:
                        jsTypedArrayType = "Uint16Array";
                        break;
                    case 2 /* Short */:
                        jsTypedArrayType = "Int16Array";
                        break;
                    case 1 /* Byte */:
                    case 0 /* Boolean */:
                        jsTypedArrayType = "Int8Array";
                        break;
                    case 5 /* Float */:
                        jsTypedArrayType = "Float32Array";
                        break;
                    case 6 /* Long */:
                        jsTypedArrayType = "Array";
                        break;
                    case 7 /* Double */:
                        jsTypedArrayType = "Float64Array";
                        break;
                    default:
                        throw J2ME.Debug.unexpected(J2ME.Kind[this.arrayKind]);
                }
                return new C4.AST.NewExpression(new C4.AST.Identifier(jsTypedArrayType), [Backend.compileValue(this.length, cx)]);
            };
            C4.IR.JVMNewObjectArray.prototype.compile = function (cx) {
                var emitClassInitializationCheck = !J2ME.CLASSES.isPreInitializedClass(this.classInfo);
                var callee = Backend.call(Backend.id("$NA"), [Backend.id(J2ME.mangleClass(this.classInfo)), Backend.compileValue(this.length, cx)]);
                if (emitClassInitializationCheck) {
                    callee = new C4.AST.SequenceExpression([getRuntimeClass(this.classInfo), callee]);
                }
                return callee;
            };
            function checkArrayBounds(array, index) {
                return new C4.AST.CallExpression(new C4.AST.Identifier("$CAB"), [array, index]);
            }
            function checkArrayStore(array, value) {
                return new C4.AST.CallExpression(new C4.AST.Identifier("$CAS"), [array, value]);
            }
            C4.IR.JVMStoreIndexed.prototype.compile = function (cx) {
                var array = Backend.compileValue(this.array, cx);
                var index = Backend.compileValue(this.index, cx);
                var value = Backend.compileValue(this.value, cx);
                return new C4.AST.SequenceExpression([checkArrayBounds(array, index), Backend.assignment(new C4.AST.MemberExpression(array, index, true), value)]);
            };
            C4.IR.JVMLoadIndexed.prototype.compile = function (cx) {
                var array = Backend.compileValue(this.array, cx);
                var index = Backend.compileValue(this.index, cx);
                return new C4.AST.SequenceExpression([checkArrayBounds(array, index), new C4.AST.MemberExpression(array, index, true)]);
            };
            C4.IR.JVMFloatCompare.prototype.compile = function (cx) {
                var a = Backend.compileValue(this.a, cx);
                var b = Backend.compileValue(this.b, cx);
                var nanResult;
                if (this.lessThan) {
                    nanResult = Backend.constant(-1);
                }
                else {
                    nanResult = Backend.constant(1);
                }
                var nan = new C4.AST.LogicalExpression("||", new C4.AST.CallExpression(new C4.AST.Identifier("isNaN"), [a]), new C4.AST.CallExpression(new C4.AST.Identifier("isNaN"), [b]));
                var gt = new C4.AST.BinaryExpression(">", a, b);
                var lt = new C4.AST.BinaryExpression("<", a, b);
                return new C4.AST.ConditionalExpression(nan, nanResult, new C4.AST.ConditionalExpression(gt, Backend.constant(1), new C4.AST.ConditionalExpression(lt, Backend.constant(-1), Backend.constant(0))));
            };
            C4.IR.JVMLongCompare.prototype.compile = function (cx) {
                var a = Backend.compileValue(this.a, cx);
                var b = Backend.compileValue(this.b, cx);
                var gt = Backend.call(new C4.AST.MemberExpression(a, new C4.AST.Identifier("greaterThan"), false), [b]);
                var lt = Backend.call(new C4.AST.MemberExpression(a, new C4.AST.Identifier("lessThan"), false), [b]);
                return new C4.AST.ConditionalExpression(gt, Backend.constant(1), new C4.AST.ConditionalExpression(lt, Backend.constant(-1), Backend.constant(0)));
            };
            C4.IR.JVMLongBinary.prototype.compile = function (cx) {
                var a = Backend.compileValue(this.a, cx);
                var b = Backend.compileValue(this.b, cx);
                var operator;
                switch (this.operator) {
                    case Operator.LADD:
                        operator = "add";
                        break;
                    case Operator.LSUB:
                        operator = "subtract";
                        break;
                    case Operator.LMUL:
                        operator = "multiply";
                        break;
                    case Operator.LDIV:
                        operator = "div";
                        break;
                    case Operator.LREM:
                        operator = "modulo";
                        break;
                    case Operator.LSH:
                        operator = "shiftLeft";
                        break;
                    case Operator.RSH:
                        operator = "shiftRight";
                        break;
                    case Operator.URSH:
                        operator = "shiftRightUnsigned";
                        break;
                    case Operator.AND:
                        operator = "and";
                        break;
                    case Operator.OR:
                        operator = "or";
                        break;
                    case Operator.XOR:
                        operator = "xor";
                        break;
                    default:
                        assert(false);
                }
                return Backend.call(new C4.AST.MemberExpression(a, new C4.AST.Identifier(operator), false), [b]);
            };
            C4.IR.JVMLongUnary.prototype.compile = function (cx) {
                var a = Backend.compileValue(this.a, cx);
                var operator;
                switch (this.operator) {
                    case Operator.LNEG:
                        operator = "negate";
                        break;
                    default:
                        assert(false);
                }
                return Backend.call(new C4.AST.MemberExpression(a, new C4.AST.Identifier(operator), false), []);
            };
            C4.IR.JVMConvert.prototype.compile = function (cx) {
                var value = Backend.compileValue(this.value, cx);
                if (this.from === 4 /* Int */) {
                    switch (this.to) {
                        case 6 /* Long */:
                            return Backend.call(new C4.AST.Identifier("Long.fromInt"), [value]);
                        case 5 /* Float */:
                            return value;
                        case 7 /* Double */:
                            return value;
                        case 2 /* Short */:
                            return new C4.AST.BinaryExpression(">>", new C4.AST.BinaryExpression("<<", value, Backend.constant(16)), Backend.constant(16));
                        case 3 /* Char */:
                            return new C4.AST.BinaryExpression("&", value, Backend.constant(0xffff));
                        case 1 /* Byte */:
                            return new C4.AST.BinaryExpression(">>", new C4.AST.BinaryExpression("<<", value, Backend.constant(24)), Backend.constant(24));
                    }
                }
                else if (this.from === 6 /* Long */) {
                    switch (this.to) {
                        case 4 /* Int */:
                            return Backend.call(new C4.AST.MemberExpression(value, new C4.AST.Identifier("toInt"), false), []);
                        case 5 /* Float */:
                            return Backend.call(new C4.AST.Identifier("Math.fround"), [Backend.call(new C4.AST.MemberExpression(value, new C4.AST.Identifier("toNumber"), false), [])]);
                        case 7 /* Double */:
                            return Backend.call(new C4.AST.MemberExpression(value, new C4.AST.Identifier("toNumber"), false), []);
                    }
                }
                else if (this.from === 5 /* Float */) {
                    switch (this.to) {
                        case 4 /* Int */:
                            return Backend.call(new C4.AST.Identifier("util.double2int"), [value]);
                        case 6 /* Long */:
                            return Backend.call(new C4.AST.Identifier("Long.fromNumber"), [value]);
                        case 7 /* Double */:
                            return value;
                    }
                }
                else if (this.from === 7 /* Double */) {
                    switch (this.to) {
                        case 4 /* Int */:
                            return Backend.call(new C4.AST.Identifier("util.double2int"), [value]);
                        case 6 /* Long */:
                            return Backend.call(new C4.AST.Identifier("util.double2long"), [value]);
                        case 5 /* Float */:
                            return Backend.call(new C4.AST.Identifier("Math.fround"), [value]);
                    }
                }
                throw "Unimplemented conversion";
            };
            function compileStateValues(values, cx) {
                var compiledValues = [];
                for (var i = 0; i < values.length; i++) {
                    if (values[i] === null) {
                        compiledValues.push(Backend.constant(null));
                    }
                    else {
                        compiledValues.push(Backend.compileValue(values[i], cx));
                        if (J2ME.isTwoSlot(values[i].kind)) {
                            compiledValues.push(Backend.constant(null));
                            i++;
                        }
                    }
                }
                return new C4.AST.ArrayExpression(compiledValues);
            }
            function compileState(state, cx) {
                var local = compileStateValues(state.local, cx);
                var stack = compileStateValues(state.stack, cx);
                return [new C4.AST.Literal(state.bci), local, stack];
            }
            C4.IR.JVMInvoke.prototype.compile = function (cx) {
                var object = this.object ? Backend.compileValue(this.object, cx) : null;
                var args = this.args.map(function (arg) {
                    return Backend.compileValue(arg, cx);
                });
                var callee = null;
                var result = null;
                if (object) {
                    if (this.opcode === 183 /* INVOKESPECIAL */) {
                        result = Backend.callCall(Backend.id(J2ME.mangleClassAndMethod(this.methodInfo)), object, args);
                    }
                    else {
                        callee = Backend.property(object, J2ME.mangleMethod(this.methodInfo));
                        result = Backend.call(callee, args);
                    }
                }
                else {
                    release || assert(this.opcode === 184 /* INVOKESTATIC */);
                    callee = Backend.id(J2ME.mangleClassAndMethod(this.methodInfo));
                    var emitClassInitializationCheck = !J2ME.CLASSES.isPreInitializedClass(this.methodInfo.classInfo);
                    if (emitClassInitializationCheck) {
                        callee = new C4.AST.SequenceExpression([getRuntimeClass(this.methodInfo.classInfo), callee]);
                    }
                    result = Backend.call(callee, args);
                }
                if (this.state) {
                    var block = new C4.AST.BlockStatement([]);
                    var to = Backend.id(this.variable.name);
                    cx.useVariable(this.variable);
                    block.body.push(new C4.AST.ExpressionStatement(Backend.assignment(to, result)));
                    var ifUnwind = new C4.AST.IfStatement(Backend.id("U"), new C4.AST.BlockStatement([
                        new C4.AST.ExpressionStatement(Backend.call(Backend.property(Backend.id("$"), "B"), compileState(this.state, cx))),
                        new C4.AST.ReturnStatement(undefined)
                    ]));
                    block.body.push(ifUnwind);
                    return block;
                }
                return result;
            };
            function getRuntimeClass(classInfo) {
                return new C4.AST.MemberExpression(Backend.id("$"), Backend.id(J2ME.mangleClass(classInfo)), false);
            }
            C4.IR.JVMGetField.prototype.compile = function (cx) {
                if (this.object) {
                    var object = Backend.compileValue(this.object, cx);
                    return new C4.AST.MemberExpression(object, Backend.id(this.fieldInfo.mangledName), false);
                }
                else {
                    assert(this.fieldInfo.isStatic);
                    return new C4.AST.MemberExpression(getRuntimeClass(this.fieldInfo.classInfo), Backend.id(this.fieldInfo.mangledName), false);
                }
            };
            C4.IR.JVMPutField.prototype.compile = function (cx) {
                var value = Backend.compileValue(this.value, cx);
                if (this.object) {
                    var object = Backend.compileValue(this.object, cx);
                    return Backend.assignment(new C4.AST.MemberExpression(object, Backend.id(this.fieldInfo.mangledName), false), value);
                }
                else {
                    assert(this.fieldInfo.isStatic);
                    return Backend.assignment(new C4.AST.MemberExpression(getRuntimeClass(this.fieldInfo.classInfo), Backend.id(this.fieldInfo.mangledName), false), value);
                }
            };
            C4.IR.JVMNew.prototype.compile = function (cx) {
                var callee = Backend.id(J2ME.mangleClass(this.classInfo));
                var emitClassInitializationCheck = !J2ME.CLASSES.isPreInitializedClass(this.classInfo);
                if (emitClassInitializationCheck) {
                    callee = new C4.AST.SequenceExpression([getRuntimeClass(this.classInfo), callee]);
                }
                return new C4.AST.NewExpression(callee, []);
            };
            C4.IR.JVMThrow.prototype.compile = function (cx) {
                var object = Backend.compileValue(this.object, cx);
                return new C4.AST.ThrowStatement(object);
            };
        })(Backend = C4.Backend || (C4.Backend = {}));
    })(C4 = J2ME.C4 || (J2ME.C4 = {}));
})(J2ME || (J2ME = {}));
var J2ME;
(function (J2ME) {
    var Bytecode;
    (function (Bytecode) {
        var assert = J2ME.Debug.assert;
        var Uint32ArrayBitSet = J2ME.BitSets.Uint32ArrayBitSet;
        var writer = new J2ME.IndentingWriter();
        var Block = (function () {
            function Block() {
                this.loops = 0; // long
                this.exits = 0; // long
                this.loopID = -1; // long
                this.successors = [];
            }
            Block.prototype.clone = function () {
                var block = new Block();
                block.startBci = this.startBci;
                block.endBci = this.endBci;
                block.isExceptionEntry = this.isExceptionEntry;
                block.isLoopHeader = this.isLoopHeader;
                block.loops = this.loops;
                block.loopID = this.loopID;
                block.blockID = this.blockID;
                block.successors = this.successors.slice(0);
                return block;
            };
            return Block;
        })();
        Bytecode.Block = Block;
        var ExceptionBlock = (function (_super) {
            __extends(ExceptionBlock, _super);
            function ExceptionBlock() {
                _super.apply(this, arguments);
            }
            return ExceptionBlock;
        })(Block);
        Bytecode.ExceptionBlock = ExceptionBlock;
        var BlockMap = (function () {
            function BlockMap(method) {
                /**
                 * The next available loop number.
                 */
                this._nextLoop = 0;
                this.exceptionDispatch = new Map();
                this.blocks = [];
                this.method = method;
                this.blockMap = new Array(method.code.length);
                this.canTrap = new Uint32ArrayBitSet(this.blockMap.length);
                this.exceptionHandlers = this.method.exception_table;
            }
            BlockMap.prototype.build = function () {
                this.makeExceptionEntries();
                this.iterateOverBytecodes();
                this.addExceptionEdges();
                this.computeBlockOrder();
                this.fixLoopBits();
                this.initializeBlockIDs();
                this.computeLoopStores();
                // writer.writeLn("Blocks: " + this.blocks.length);
                // writer.writeLn(JSON.stringify(this.blocks, null, 2));
            };
            BlockMap.prototype.makeExceptionEntries = function () {
                for (var i = 0; i < this.exceptionHandlers.length; i++) {
                    var handler = this.exceptionHandlers[i];
                    var block = this.makeBlock(handler.handler_pc);
                    block.isExceptionEntry = true;
                }
            };
            BlockMap.prototype.computeLoopStores = function () {
            };
            BlockMap.prototype.initializeBlockIDs = function () {
                for (var i = 0; i < this.blocks.length; i++) {
                    this.blocks[i].blockID = i;
                }
            };
            BlockMap.prototype.getBlock = function (bci) {
                return this.blockMap[bci];
            };
            BlockMap.prototype.makeBlock = function (startBci) {
                var oldBlock = this.blockMap[startBci];
                if (!oldBlock) {
                    var newBlock = new Block();
                    newBlock.startBci = startBci;
                    this.blockMap[startBci] = newBlock;
                    return newBlock;
                }
                else if (oldBlock.startBci != startBci) {
                    // Backward branch into the middle of an already processed block.
                    // Add the correct fall-through successor.
                    var newBlock = new Block();
                    newBlock.startBci = startBci;
                    newBlock.endBci = oldBlock.endBci;
                    J2ME.ArrayUtilities.pushMany(newBlock.successors, oldBlock.successors);
                    newBlock.normalSuccessors = oldBlock.normalSuccessors;
                    oldBlock.endBci = startBci - 1;
                    oldBlock.successors.length = 0;
                    oldBlock.successors.push(newBlock);
                    oldBlock.normalSuccessors = 1;
                    for (var i = startBci; i <= newBlock.endBci; i++) {
                        this.blockMap[i] = newBlock;
                    }
                    return newBlock;
                }
                else {
                    return oldBlock;
                }
            };
            BlockMap.prototype.makeSwitchSuccessors = function (tswitch) {
                var max = tswitch.numberOfCases();
                var successors = new Array(max + 1);
                for (var i = 0; i < max; i++) {
                    successors[i] = this.makeBlock(tswitch.targetAt(i));
                }
                successors[max] = this.makeBlock(tswitch.defaultTarget());
                return successors;
            };
            BlockMap.prototype.setSuccessors = function (predBci, successors) {
                // writer.writeLn("setSuccessors " + predBci + " " + successors.map(x => x.startBci).join(", "));
                var predecessor = this.blockMap[predBci];
                assert(predecessor.successors.length === 0, predecessor.successors.map(function (x) { return x.startBci; }).join(", "));
                J2ME.ArrayUtilities.pushMany(predecessor.successors, successors);
                predecessor.normalSuccessors = successors.length;
            };
            BlockMap.prototype.canTrapAt = function (opcode, bci) {
                switch (opcode) {
                    case 184 /* INVOKESTATIC */:
                    case 183 /* INVOKESPECIAL */:
                    case 182 /* INVOKEVIRTUAL */:
                    case 185 /* INVOKEINTERFACE */:
                        return true;
                    case 79 /* IASTORE */:
                    case 80 /* LASTORE */:
                    case 81 /* FASTORE */:
                    case 82 /* DASTORE */:
                    case 83 /* AASTORE */:
                    case 84 /* BASTORE */:
                    case 85 /* CASTORE */:
                    case 86 /* SASTORE */:
                    case 46 /* IALOAD */:
                    case 47 /* LALOAD */:
                    case 48 /* FALOAD */:
                    case 49 /* DALOAD */:
                    case 50 /* AALOAD */:
                    case 51 /* BALOAD */:
                    case 52 /* CALOAD */:
                    case 53 /* SALOAD */:
                    case 181 /* PUTFIELD */:
                    case 180 /* GETFIELD */:
                        return false;
                }
                return false;
            };
            BlockMap.prototype.iterateOverBytecodes = function () {
                // iterate over the bytecodes top to bottom.
                // mark the entrypoints of basic blocks and build lists of successors for
                // all bytecodes that end basic blocks (i.e. goto, ifs, switches, throw, jsr, returns, ret)
                var code = this.method.code;
                var current = null;
                var bci = 0;
                while (bci < code.length) {
                    if (!current || this.blockMap[bci]) {
                        var b = this.makeBlock(bci);
                        if (current) {
                            this.setSuccessors(current.endBci, [b]);
                        }
                        current = b;
                    }
                    this.blockMap[bci] = current;
                    current.endBci = bci;
                    var opcode = Bytecode.Bytes.beU1(code, bci);
                    switch (opcode) {
                        case 172 /* IRETURN */:
                        case 173 /* LRETURN */:
                        case 174 /* FRETURN */:
                        case 175 /* DRETURN */:
                        case 176 /* ARETURN */:
                        case 177 /* RETURN */: {
                            current = null;
                            break;
                        }
                        case 191 /* ATHROW */: {
                            current = null;
                            this.canTrap.set(bci);
                            break;
                        }
                        case 153 /* IFEQ */:
                        case 154 /* IFNE */:
                        case 155 /* IFLT */:
                        case 156 /* IFGE */:
                        case 157 /* IFGT */:
                        case 158 /* IFLE */:
                        case 159 /* IF_ICMPEQ */:
                        case 160 /* IF_ICMPNE */:
                        case 161 /* IF_ICMPLT */:
                        case 162 /* IF_ICMPGE */:
                        case 163 /* IF_ICMPGT */:
                        case 164 /* IF_ICMPLE */:
                        case 165 /* IF_ACMPEQ */:
                        case 166 /* IF_ACMPNE */:
                        case 198 /* IFNULL */:
                        case 199 /* IFNONNULL */: {
                            current = null;
                            var probability = -1;
                            var b1 = this.makeBlock(bci + Bytecode.Bytes.beS2(code, bci + 1));
                            var b2 = this.makeBlock(bci + 3);
                            this.setSuccessors(bci, [b1, b2]);
                            break;
                        }
                        case 167 /* GOTO */:
                        case 200 /* GOTO_W */: {
                            current = null;
                            var target = bci + Bytecode.Bytes.beSVar(code, bci + 1, opcode == 200 /* GOTO_W */);
                            var b1 = this.makeBlock(target);
                            this.setSuccessors(bci, [b1]);
                            break;
                        }
                        case 170 /* TABLESWITCH */: {
                            current = null;
                            this.setSuccessors(bci, this.makeSwitchSuccessors(new Bytecode.BytecodeTableSwitch(code, bci)));
                            break;
                        }
                        case 171 /* LOOKUPSWITCH */: {
                            current = null;
                            this.setSuccessors(bci, this.makeSwitchSuccessors(new Bytecode.BytecodeLookupSwitch(code, bci)));
                            break;
                        }
                        case 196 /* WIDE */: {
                            var opcode2 = Bytecode.Bytes.beU1(code, bci);
                            switch (opcode2) {
                                case 169 /* RET */: {
                                    writer.writeLn("RET");
                                    // current.endsWithRet = true;
                                    current = null;
                                    break;
                                }
                            }
                            break;
                        }
                        case 185 /* INVOKEINTERFACE */:
                        case 183 /* INVOKESPECIAL */:
                        case 184 /* INVOKESTATIC */:
                        case 182 /* INVOKEVIRTUAL */: {
                            current = null;
                            var target = bci + Bytecode.lengthAt(code, bci);
                            var b1 = this.makeBlock(target);
                            this.setSuccessors(bci, [b1]);
                            this.canTrap.set(bci);
                            break;
                        }
                        default: {
                            if (this.canTrapAt(opcode, bci)) {
                                this.canTrap.set(bci);
                            }
                        }
                    }
                    bci += Bytecode.lengthAt(code, bci);
                }
            };
            /**
             * Mark the block as a loop header, using the next available loop number.
             * Also checks for corner cases that we don't want to compile.
             */
            BlockMap.prototype.makeLoopHeader = function (block) {
                if (!block.isLoopHeader) {
                    block.isLoopHeader = true;
                    if (block.isExceptionEntry) {
                        throw new J2ME.CompilerBailout("Loop formed by an exception handler");
                    }
                    if (this._nextLoop >= 32) {
                        throw "Too many loops in method";
                    }
                    assert(!block.loops, block.loops);
                    block.loops = 1 << this._nextLoop;
                    block.loopID = this._nextLoop;
                    this._nextLoop++;
                }
                assert(J2ME.IntegerUtilities.bitCount(block.loops) === 1);
            };
            // catch_type
            BlockMap.prototype.handlerIsCatchAll = function (handler) {
                return handler.catch_type === 0;
            };
            BlockMap.prototype.makeExceptionDispatch = function (handlers, index, bci) {
                var handler = handlers[index];
                if (this.handlerIsCatchAll(handler)) {
                    return this.blockMap[handler.handler_pc];
                }
                var block = this.exceptionDispatch.get(handler);
                if (!block) {
                    block = new ExceptionBlock();
                    block.startBci = -1;
                    block.endBci = -1;
                    block.deoptBci = bci;
                    block.handler = handler;
                    block.successors.push(this.blockMap[handler.handler_pc]);
                    if (index < handlers.length - 1) {
                        block.successors.push(this.makeExceptionDispatch(handlers, index + 1, bci));
                    }
                    this.exceptionDispatch.set(handler, block);
                }
                return block;
            };
            BlockMap.prototype.addExceptionEdges = function () {
                var length = this.canTrap.length;
                for (var bci = this.canTrap.nextSetBit(0, length); bci >= 0; bci = this.canTrap.nextSetBit(bci + 1, length)) {
                    var block = this.blockMap[bci];
                    var handlers = null;
                    for (var i = 0; i < this.exceptionHandlers.length; i++) {
                        var handler = this.exceptionHandlers[i];
                        if (handler.start_pc <= bci && bci < handler.end_pc) {
                            if (!handlers) {
                                handlers = [];
                            }
                            handlers.push(handler);
                            if (this.handlerIsCatchAll(handler)) {
                                break;
                            }
                        }
                    }
                    if (handlers) {
                        var dispatch = this.makeExceptionDispatch(handlers, 0, bci);
                        block.successors.push(dispatch);
                    }
                }
            };
            BlockMap.prototype.fixLoopBits = function () {
                var loopChanges = false;
                function _fixLoopBits(block) {
                    if (block.visited) {
                        // Return cached loop information for this block.
                        if (block.isLoopHeader) {
                            return block.loops & ~(1 << block.loopID);
                        }
                        else {
                            return block.loops;
                        }
                    }
                    block.visited = true;
                    var loops = block.loops;
                    var successors = block.successors;
                    for (var i = 0; i < successors.length; i++) {
                        // Recursively process successors.
                        loops |= _fixLoopBits(successors[i]);
                    }
                    for (var i = 0; i < successors.length; i++) {
                        var successor = successors[i];
                        successor.exits = loops & ~successor.loops;
                    }
                    if (block.loops !== loops) {
                        loopChanges = true;
                        block.loops = loops;
                    }
                    if (block.isLoopHeader) {
                        loops &= ~(1 << block.loopID);
                    }
                    return loops;
                }
                do {
                    loopChanges = false;
                    for (var i = 0; i < this.blocks.length; i++) {
                        this.blocks[i].visited = false;
                    }
                    var loop = _fixLoopBits(this.blockMap[0]);
                    if (loop !== 0) {
                        throw new J2ME.CompilerBailout("Non-reducible loop");
                    }
                } while (loopChanges);
            };
            BlockMap.prototype.computeBlockOrder = function () {
                var loop = this.computeBlockOrderFrom(this.blockMap[0]);
                if (loop != 0) {
                    throw new J2ME.CompilerBailout("Non-reducible loop");
                }
                // Convert postorder to the desired reverse postorder.
                this.blocks.reverse();
            };
            /**
             * Depth-first traversal of the control flow graph. The flag {@linkplain Block#visited} is used to
             * visit every block only once. The flag {@linkplain Block#active} is used to detect cycles (backward
             * edges).
             */
            BlockMap.prototype.computeBlockOrderFrom = function (block) {
                if (block.visited) {
                    if (block.active) {
                        // Reached block via backward branch.
                        this.makeLoopHeader(block);
                        return block.loops;
                    }
                    else if (block.isLoopHeader) {
                        return block.loops & ~(1 << block.loopID);
                    }
                    else {
                        return block.loops;
                    }
                }
                block.visited = true;
                block.active = true;
                var loops = 0;
                for (var i = 0; i < block.successors.length; i++) {
                    var successor = block.successors[i];
                    // Recursively process successors.
                    loops |= this.computeBlockOrderFrom(block.successors[i]);
                    if (successor.active) {
                        // Reached block via backward branch.
                        block.isLoopEnd = true;
                    }
                }
                block.loops = loops;
                if (block.isLoopHeader) {
                    loops &= ~(1 << block.loopID);
                }
                block.active = false;
                this.blocks.push(block);
                return loops;
            };
            BlockMap.prototype.trace = function (writer, traceBytecode) {
                if (traceBytecode === void 0) { traceBytecode = false; }
                var code = this.method.code;
                var stream = new Bytecode.BytecodeStream(code);
                writer.enter("Block Map: " + this.blocks.map(function (b) { return b.blockID; }).join(", "));
                this.blocks.forEach(function (block) {
                    writer.enter("blockID: " + String(block.blockID + ", ").padRight(" ", 5) + "bci: [" + block.startBci + ", " + block.endBci + "]" + (block.successors.length ? ", successors: => " + block.successors.map(function (b) { return b.blockID; }).join(", ") : "") + (block.isLoopHeader ? " isLoopHeader" : "") + (block.isLoopEnd ? " isLoopEnd" : "") + ", loops: " + block.loops.toString(2) + ", exits: " + block.exits.toString(2) + ", loopID: " + block.loopID);
                    if (traceBytecode) {
                        var bci = block.startBci;
                        stream.setBCI(bci);
                        while (stream.currentBCI <= block.endBci) {
                            writer.writeLn(Bytecode.Bytecodes[stream.currentBC()]);
                            stream.next();
                            bci = stream.currentBCI;
                        }
                    }
                    writer.outdent();
                });
                writer.outdent();
            };
            return BlockMap;
        })();
        Bytecode.BlockMap = BlockMap;
    })(Bytecode = J2ME.Bytecode || (J2ME.Bytecode = {}));
})(J2ME || (J2ME = {}));
var J2ME;
(function (J2ME) {
    var debug = false;
    var writer = null; // new IndentingWriter(true);
    var consoleWriter = new J2ME.IndentingWriter();
    J2ME.counter = new J2ME.Metrics.Counter(true);
    function printResults() {
        J2ME.counter.traceSorted(J2ME.stderrWriter);
        for (var k in J2ME.yieldMap) {
            J2ME.stderrWriter.writeLn(YieldReason[J2ME.yieldMap[k]].padRight(" ", 20) + " " + k);
        }
    }
    J2ME.printResults = printResults;
    var BlockMap = J2ME.Bytecode.BlockMap;
    var assert = J2ME.Debug.assert;
    var unique = J2ME.ArrayUtilities.unique;
    var IR = J2ME.C4.IR;
    var Node = IR.Node;
    var Phi = IR.Phi;
    var Constant = IR.Constant;
    var Region = IR.Region;
    var ProjectionType = IR.ProjectionType;
    var Null = IR.Null;
    var Undefined = IR.Undefined;
    var Operator = IR.Operator;
    var PeepholeOptimizer = IR.PeepholeOptimizer;
    var Bytecodes = J2ME.Bytecode.Bytecodes;
    var BytecodeStream = J2ME.Bytecode.BytecodeStream;
    var Condition = J2ME.Bytecode.Condition;
    function kindsFromSignature(signature) {
    }
    var staticCallGraph = Object.create(null);
    var yieldWriter = null; // stderrWriter;
    function isStaticallyBound(op, methodInfo) {
        // INVOKESPECIAL and INVOKESTATIC are always statically bound.
        if (op === 183 /* INVOKESPECIAL */ || op === 184 /* INVOKESTATIC */) {
            return true;
        }
        // INVOKEVIRTUAL is only statically bound if its class is final.
        if (op === 182 /* INVOKEVIRTUAL */ && methodInfo.classInfo.isFinal) {
            return true;
        }
        return false;
    }
    (function (YieldReason) {
        YieldReason[YieldReason["None"] = 0] = "None";
        YieldReason[YieldReason["Root"] = 1] = "Root";
        YieldReason[YieldReason["Synchronized"] = 2] = "Synchronized";
        YieldReason[YieldReason["MonitorEnterExit"] = 3] = "MonitorEnterExit";
        YieldReason[YieldReason["Virtual"] = 4] = "Virtual";
        YieldReason[YieldReason["Cycle"] = 5] = "Cycle";
    })(J2ME.YieldReason || (J2ME.YieldReason = {}));
    var YieldReason = J2ME.YieldReason;
    /**
     * Root set of methods that can yield. Keep this up to date or else the compiler will not generate yield code
     * at the right spots.
     */
    J2ME.yieldMap = {
        "java/lang/Thread.sleep.(J)V": 1 /* Root */,
        "com/sun/cldc/isolate/Isolate.waitStatus.(I)V": 1 /* Root */,
        "com/sun/midp/links/LinkPortal.getLinkCount0.()I": 1 /* Root */,
        "com/sun/midp/links/Link.receive0.(Lcom/sun/midp/links/LinkMessage;Lcom/sun/midp/links/Link;)V": 1 /* Root */,
        "com/nokia/mid/impl/jms/core/Launcher.handleContent.(Ljava/lang/String;)V": 1 /* Root */,
        "com/sun/midp/util/isolate/InterIsolateMutex.lock0.(I)V": 1 /* Root */,
        "com/sun/midp/events/NativeEventMonitor.waitForNativeEvent.(Lcom/sun/midp/events/NativeEvent;)I": 1 /* Root */,
        "com/sun/midp/main/CommandState.exitInternal.(I)V": 1 /* Root */,
        "com/sun/midp/io/j2me/push/ConnectionRegistry.poll0.(J)I": 1 /* Root */,
        "com/sun/midp/rms/RecordStoreUtil.exists.(Ljava/lang/String;Ljava/lang/String;I)Z": 1 /* Root */,
        "com/sun/midp/rms/RecordStoreUtil.deleteFile.(Ljava/lang/String;Ljava/lang/String;I)V": 1 /* Root */,
        "com/sun/midp/rms/RecordStoreFile.openRecordStoreFile.(Ljava/lang/String;Ljava/lang/String;I)I": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.existsImpl.([B)Z": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.fileSizeImpl.([B)J": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.isDirectoryImpl.([B)Z": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.listImpl.([B[BZ)[[B": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.mkdirImpl.([B)I": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.newFileImpl.([B)I": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.deleteFileImpl.([B)Z": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.lastModifiedImpl.([B)J": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.renameImpl.([B[B)V": 1 /* Root */,
        "com/ibm/oti/connection/file/Connection.truncateImpl.([BJ)V": 1 /* Root */,
        "com/ibm/oti/connection/file/FCInputStream.openImpl.([B)I": 1 /* Root */,
        "com/ibm/oti/connection/file/FCOutputStream.openImpl.([B)I": 1 /* Root */,
        "com/ibm/oti/connection/file/FCOutputStream.openOffsetImpl.([BJ)I": 1 /* Root */,
        "com/sun/midp/io/j2me/storage/RandomAccessStream.open.(Ljava/lang/String;I)I": 1 /* Root */,
        "javax/microedition/lcdui/ImageDataFactory.createImmutableImageDecodeImage.(Ljavax/microedition/lcdui/ImageData;[BII)V": 1 /* Root */,
        "com/nokia/mid/ui/TextEditorThread.sleep.()V": 1 /* Root */,
        "com/nokia/mid/ui/VKVisibilityNotificationRunnable.sleepUntilVKVisibilityChange.()Z": 1 /* Root */,
        "org/mozilla/io/LocalMsgConnection.init.(Ljava/lang/String;)V": 1 /* Root */,
        "org/mozilla/io/LocalMsgConnection.receiveData.([B)I": 1 /* Root */,
        "com/sun/mmedia/PlayerImpl.nRealize.(ILjava/lang/String;)Z": 1 /* Root */,
        "com/sun/mmedia/DirectRecord.nPause.(I)I": 1 /* Root */,
        "com/sun/mmedia/DirectRecord.nStop.(I)I": 1 /* Root */,
        "com/sun/mmedia/DirectRecord.nClose.(I)I": 1 /* Root */,
        "com/sun/mmedia/DirectRecord.nStart.(I)I": 1 /* Root */,
        "com/sun/midp/io/j2me/socket/Protocol.open0.([BI)V": 1 /* Root */,
        "com/sun/midp/io/j2me/socket/Protocol.read0.([BII)I": 1 /* Root */,
        "com/sun/midp/io/j2me/socket/Protocol.write0.([BII)I": 1 /* Root */,
        "com/sun/midp/io/j2me/socket/Protocol.close0.()V": 1 /* Root */,
        "com/sun/midp/io/j2me/sms/Protocol.receive0.(IIILcom/sun/midp/io/j2me/sms/Protocol$SMSPacket;)I": 1 /* Root */,
        "com/sun/midp/io/j2me/sms/Protocol.send0.(IILjava/lang/String;II[B)I": 1 /* Root */,
        "com/sun/j2me/pim/PIMProxy.getNextItemDescription0.(I[I)Z": 1 /* Root */,
        "java/lang/Object.wait.(J)V": 1 /* Root */,
        "java/lang/Class.invoke_clinit.()V": 1 /* Root */,
        "java/lang/Class.newInstance.()Ljava/lang/Object;": 1 /* Root */,
        "java/lang/Thread.yield.()V": 1 /* Root */
    };
    // Used to prevent cycles.
    var checkingForCanYield = Object.create(null);
    function canYield(ctx, methodInfo) {
        if (J2ME.yieldMap[methodInfo.implKey] !== undefined) {
            return J2ME.yieldMap[methodInfo.implKey];
        }
        if (methodInfo.isSynchronized) {
            return J2ME.yieldMap[methodInfo.implKey] = 2 /* Synchronized */;
        }
        if (checkingForCanYield[methodInfo.implKey]) {
            return 5 /* Cycle */;
        }
        if (!methodInfo.code) {
            assert(methodInfo.isNative);
            return J2ME.yieldMap[methodInfo.implKey] = 0 /* None */;
        }
        yieldWriter && yieldWriter.enter(methodInfo.implKey);
        checkingForCanYield[methodInfo.implKey] = true;
        try {
            var result = 0 /* None */;
            var stream = new BytecodeStream(methodInfo.code);
            stream.setBCI(0);
            while (stream.currentBCI < methodInfo.code.length) {
                var op = stream.currentBC();
                switch (op) {
                    case 194 /* MONITORENTER */:
                    case 195 /* MONITOREXIT */:
                        result = 3 /* MonitorEnterExit */;
                        break;
                    case 185 /* INVOKEINTERFACE */:
                        result = 4 /* Virtual */;
                        break;
                    case 182 /* INVOKEVIRTUAL */:
                    case 183 /* INVOKESPECIAL */:
                    case 184 /* INVOKESTATIC */:
                        var cpi = stream.readCPI();
                        var callee = ctx.resolve(methodInfo.classInfo.constant_pool, cpi, op === 184 /* INVOKESTATIC */);
                        if (!isStaticallyBound(op, callee)) {
                            result = 4 /* Virtual */;
                            break;
                        }
                        result = canYield(ctx, callee);
                        break;
                }
                if (result) {
                    break;
                }
                stream.next();
            }
        }
        catch (e) {
            J2ME.stderrWriter.writeLn("ERROR: " + methodInfo.implKey + " Cycle");
            J2ME.stderrWriter.writeLn(e);
            J2ME.stderrWriter.writeLns(e.stack);
        }
        checkingForCanYield[methodInfo.implKey] = false;
        yieldWriter && yieldWriter.leave(methodInfo.implKey + " " + YieldReason[result]);
        return J2ME.yieldMap[methodInfo.implKey] = result;
    }
    function conditionToOperator(condition) {
        switch (condition) {
            case 0 /* EQ */: return Operator.EQ;
            case 1 /* NE */: return Operator.NE;
            case 2 /* LT */: return Operator.LT;
            case 3 /* LE */: return Operator.LE;
            case 4 /* GT */: return Operator.GT;
            case 5 /* GE */: return Operator.GE;
            default: throw "TODO";
        }
    }
    function isTwoSlot(kind) {
        return kind === 6 /* Long */ || kind === 7 /* Double */;
    }
    J2ME.isTwoSlot = isTwoSlot;
    function assertHigh(x) {
        assert(x === null);
    }
    J2ME.assertHigh = assertHigh;
    (function (CompilationTarget) {
        CompilationTarget[CompilationTarget["Runtime"] = 0] = "Runtime";
        CompilationTarget[CompilationTarget["Buildtime"] = 1] = "Buildtime";
        CompilationTarget[CompilationTarget["Static"] = 2] = "Static";
    })(J2ME.CompilationTarget || (J2ME.CompilationTarget = {}));
    var CompilationTarget = J2ME.CompilationTarget;
    (function (TAGS) {
        TAGS[TAGS["CONSTANT_Class"] = 7] = "CONSTANT_Class";
        TAGS[TAGS["CONSTANT_Fieldref"] = 9] = "CONSTANT_Fieldref";
        TAGS[TAGS["CONSTANT_Methodref"] = 10] = "CONSTANT_Methodref";
        TAGS[TAGS["CONSTANT_InterfaceMethodref"] = 11] = "CONSTANT_InterfaceMethodref";
        TAGS[TAGS["CONSTANT_String"] = 8] = "CONSTANT_String";
        TAGS[TAGS["CONSTANT_Integer"] = 3] = "CONSTANT_Integer";
        TAGS[TAGS["CONSTANT_Float"] = 4] = "CONSTANT_Float";
        TAGS[TAGS["CONSTANT_Long"] = 5] = "CONSTANT_Long";
        TAGS[TAGS["CONSTANT_Double"] = 6] = "CONSTANT_Double";
        TAGS[TAGS["CONSTANT_NameAndType"] = 12] = "CONSTANT_NameAndType";
        TAGS[TAGS["CONSTANT_Utf8"] = 1] = "CONSTANT_Utf8";
        TAGS[TAGS["CONSTANT_Unicode"] = 2] = "CONSTANT_Unicode";
    })(J2ME.TAGS || (J2ME.TAGS = {}));
    var TAGS = J2ME.TAGS;
    var CompiledMethodInfo = (function () {
        function CompiledMethodInfo(args, body, referencedClasses) {
            this.args = args;
            this.body = body;
            this.referencedClasses = referencedClasses;
            // ...
        }
        return CompiledMethodInfo;
    })();
    J2ME.CompiledMethodInfo = CompiledMethodInfo;
    function assertKind(kind, x) {
        assert(J2ME.stackKind(x.kind) === J2ME.stackKind(kind), "Got " + J2ME.kindCharacter(J2ME.stackKind(x.kind)) + " expected " + J2ME.kindCharacter(J2ME.stackKind(kind)));
        return x;
    }
    var State = (function () {
        function State(bci) {
            if (bci === void 0) { bci = 0; }
            this.id = State._nextID += 1;
            this.bci = bci;
            this.local = [];
            this.stack = [];
            this.store = Undefined;
            this.loads = [];
        }
        State.prototype.clone = function (bci) {
            var s = new State();
            s.bci = bci !== undefined ? bci : this.bci;
            s.local = this.local.slice(0);
            s.stack = this.stack.slice(0);
            s.loads = this.loads.slice(0);
            s.store = this.store;
            return s;
        };
        State.prototype.matches = function (other) {
            return this.stack.length === other.stack.length && this.local.length === other.local.length;
        };
        State.prototype.makeLoopPhis = function (control, dirtyLocals) {
            var s = new State();
            release || assert(control);
            function makePhi(x) {
                var phi = new Phi(control, x);
                phi.kind = x.kind;
                phi.isLoop = true;
                return phi;
            }
            s.bci = this.bci;
            s.local = this.local.map(function (v, i) {
                if (v === null) {
                    return null;
                }
                if (true || dirtyLocals[i]) {
                    return makePhi(v);
                }
                return v;
            });
            s.stack = this.stack.map(makePhi);
            s.loads = this.loads.slice(0);
            s.store = makePhi(this.store);
            return s;
        };
        State.tryOptimizePhi = function (x) {
            if (x instanceof Phi) {
                var phi = x;
                if (phi.isLoop) {
                    return phi;
                }
                var args = unique(phi.args);
                if (args.length === 1) {
                    phi.seal();
                    countTimeline("Builder: OptimizedPhi");
                    return args[0];
                }
            }
            return x;
        };
        State.prototype.optimize = function () {
            this.local = this.local.map(State.tryOptimizePhi);
            this.stack = this.stack.map(State.tryOptimizePhi);
            this.store = State.tryOptimizePhi(this.store);
        };
        State.mergeValue = function (control, a, b) {
            var phi;
            if (a instanceof Phi && a.control === control) {
                phi = a;
            }
            else {
                phi = new Phi(control, a);
                phi.kind = a.kind;
            }
            if (a.kind === 11 /* Store */) {
                release || assert(b.kind === 11 /* Store */, "Got " + J2ME.Kind[b.kind] + " should be store.");
            }
            else if (b === null || b === Illegal || J2ME.stackKind(a.kind) !== J2ME.stackKind(b.kind)) {
                // TODO get rid of the null check by pushing Illegals for doubles/longs.
                b = Illegal;
            }
            phi.pushValue(b);
            return phi;
        };
        State.mergeValues = function (control, a, b) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === null) {
                    continue;
                }
                a[i] = State.mergeValue(control, a[i], b[i]);
                if (isTwoSlot(a[i].kind)) {
                    i++;
                }
            }
        };
        State.prototype.merge = function (control, other) {
            release || assert(control);
            release || assert(this.matches(other), this + " !== " + other);
            State.mergeValues(control, this.local, other.local);
            State.mergeValues(control, this.stack, other.stack);
            this.store = State.mergeValue(control, this.store, other.store);
            this.store.abstract = true;
        };
        State.prototype.trace = function (writer) {
            writer.writeLn(this.toString());
        };
        State.toBriefString = function (x) {
            if (x instanceof Node) {
                return J2ME.kindCharacter(x.kind); // + x.toString(true);
            }
            if (x === null) {
                return "_";
            }
            else if (x === undefined) {
                return "undefined";
            }
            return String(x);
        };
        State.prototype.toString = function () {
            return "<" + String(this.id + " @ " + this.bci).padRight(' ', 10) + (" M: " + State.toBriefString(this.store)).padRight(' ', 14) + (" L: " + this.local.map(State.toBriefString).join(", ")).padRight(' ', 40) + (" S: " + this.stack.map(State.toBriefString).join(", ")).padRight(' ', 60) + (" R: " + this.loads.map(State.toBriefString).join(", ")).padRight(' ', 60);
        };
        /**
         * Pushes a value onto the stack without checking the type.
         */
        State.prototype.xpush = function (x) {
            assert(x === null || !x.isDeleted);
            assert(x === null || (x.kind !== 9 /* Void */ && x.kind !== 10 /* Illegal */), "Unexpected value: " + x);
            this.stack.push(x);
        };
        /**
         * Pushes a value onto the stack and checks that it is an int.
         */
        State.prototype.ipush = function (x) {
            this.push(4 /* Int */, x);
        };
        /**
         * Pushes a value onto the stack and checks that it is a float.
         * @param x the instruction to push onto the stack
         */
        State.prototype.fpush = function (x) {
            this.push(5 /* Float */, x);
        };
        /**
         * Pushes a value onto the stack and checks that it is an object.
         */
        State.prototype.apush = function (x) {
            this.push(8 /* Reference */, x);
        };
        /**
         * Pushes a value onto the stack and checks that it is a long.
         */
        State.prototype.lpush = function (x) {
            this.push(6 /* Long */, x);
        };
        /**
         * Pushes a value onto the stack and checks that it is a double.
         */
        State.prototype.dpush = function (x) {
            this.push(7 /* Double */, x);
        };
        /**
         * Pushes an instruction onto the stack with the expected type.
         */
        State.prototype.push = function (kind, x) {
            assert(kind !== 9 /* Void */);
            if (x.kind === undefined) {
                x.kind = kind;
            }
            this.xpush(assertKind(kind, x));
            if (isTwoSlot(kind)) {
                this.xpush(null);
            }
        };
        /**
         * Pops an instruction off the stack with the expected type.
         */
        State.prototype.pop = function (kind) {
            assert(kind !== 9 /* Void */);
            kind = J2ME.stackKind(kind);
            if (isTwoSlot(kind)) {
                this.xpop();
            }
            return assertKind(kind, this.xpop());
        };
        /**
         * Pops a value off of the stack without checking the type.
         */
        State.prototype.xpop = function () {
            var result = this.stack.pop();
            assert(result === null || !result.isDeleted);
            return result;
        };
        /**
         * Pops a value off of the stack and checks that it is an int.
         */
        State.prototype.ipop = function () {
            return assertKind(4 /* Int */, this.xpop());
        };
        /**
         * Pops a value off of the stack and checks that it is a float.
         */
        State.prototype.fpop = function () {
            return assertKind(5 /* Float */, this.xpop());
        };
        /**
         * Pops a value off of the stack and checks that it is an object.
         */
        State.prototype.apop = function () {
            return assertKind(8 /* Reference */, this.xpop());
        };
        /**
         * Pops a value off of the stack and checks that it is a long.
         */
        State.prototype.lpop = function () {
            assertHigh(this.xpop());
            return assertKind(6 /* Long */, this.xpop());
        };
        /**
         * Pops a value off of the stack and checks that it is a double.
         */
        State.prototype.dpop = function () {
            assertHigh(this.xpop());
            return assertKind(7 /* Double */, this.xpop());
        };
        State.prototype.peek = function () {
            return this.stack[this.stack.length - 1];
        };
        /**
         * Loads the local variable at the specified index.
         */
        State.prototype.loadLocal = function (i) {
            var x = this.local[i];
            if (x != null) {
                if (x instanceof Phi) {
                    // assert ((PhiNode) x).type() == PhiType.Value;
                    if (x.isDeleted) {
                        return null;
                    }
                }
                assert(!isTwoSlot(x.kind) || this.local[i + 1] === null || this.local[i + 1] instanceof Phi);
            }
            return x;
        };
        /**
         * Stores a given local variable at the specified index. If the value takes up two slots,
         * then the next local variable index is also overwritten.
         */
        State.prototype.storeLocal = function (i, x) {
            assert(x === null || (x.kind !== 9 /* Void */ && x.kind !== 10 /* Illegal */), "Unexpected value: " + x);
            var local = this.local;
            local[i] = x;
            if (isTwoSlot(x.kind)) {
                // (tw) if this was a double word then kill i + 1
                local[i + 1] = null;
            }
            if (i > 0) {
                // if there was a double word at i - 1, then kill it
                var p = local[i - 1];
                if (p !== null && isTwoSlot(p.kind)) {
                    local[i - 1] = null;
                }
            }
        };
        State._nextID = 0;
        return State;
    })();
    J2ME.State = State;
    function quote(s) {
        return "\"" + s + "\"";
    }
    J2ME.quote = quote;
    function compileMethodInfo(methodInfo, ctx, target) {
        if (!methodInfo.code) {
            throw new Error("Method: " + methodInfo.implKey + " has no code.");
        }
        if (methodInfo.exception_table.length) {
            throw new Error("Method: " + methodInfo.implKey + " has exception handlers.");
        }
        var builder = new Builder(methodInfo, ctx, target);
        var fn;
        var compilation = builder.build();
        var args = [];
        for (var i = 0; i < builder.parameters.length; i++) {
            var parameter = builder.parameters[i];
            args.push(parameter.name);
        }
        var body = compilation.body;
        return new CompiledMethodInfo(args, body, builder.referencedClasses);
    }
    J2ME.compileMethodInfo = compileMethodInfo;
    function genConstant(x, kind) {
        var constant;
        if (kind === 6 /* Long */) {
            constant = new IR.JVMLong(x, 0);
        }
        else if (kind === 8 /* Reference */) {
            if (J2ME.isString(x)) {
                constant = new IR.JVMString(x);
            }
            else {
                constant = new IR.Constant(x);
            }
        }
        else {
            constant = new IR.Constant(x);
        }
        constant.kind = kind;
        return constant;
    }
    var Illegal = genConstant(undefined, 10 /* Illegal */);
    var StopInfo = (function () {
        function StopInfo(control, target, state) {
            this.control = control;
            this.target = target;
            this.state = state;
            // ...
        }
        return StopInfo;
    })();
    var ReturnInfo = (function () {
        function ReturnInfo(control, store, value) {
            this.control = control;
            this.store = store;
            this.value = value;
            // ...
        }
        return ReturnInfo;
    })();
    /**
     * TODO: Consider using debug info for nicer parameter names, if available.
     */
    function getParameterName(methodInfo, i) {
        var parameterNames = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return i < parameterNames.length ? parameterNames[i] : "p" + (parameterNames.length - i);
    }
    var Builder = (function () {
        function Builder(methodInfo, ctx, target) {
            this.methodInfo = methodInfo;
            this.ctx = ctx;
            this.target = target;
            // ...
            this.peepholeOptimizer = new PeepholeOptimizer();
            this.signatureDescriptor = J2ME.SignatureDescriptor.makeSignatureDescriptor(methodInfo.signature);
            this.methodReturnInfos = [];
            this.parameters = [];
            this.referencedClasses = [];
        }
        Builder.prototype.build = function () {
            IR.Node.startNumbering();
            var methodInfo = this.methodInfo;
            writer && writer.enter("Compiling Method: " + methodInfo.name + " " + methodInfo.signature + " {");
            writer && writer.writeLn("Size: " + methodInfo.code.length);
            var blockMap = this.blockMap = new BlockMap(methodInfo);
            blockMap.build();
            var start = this.buildStart();
            var dfg = this.buildGraph(start, start.entryState.clone());
            writer && dfg.trace(writer);
            J2ME.enterTimeline("Build CFG");
            var cfg = dfg.buildCFG();
            J2ME.leaveTimeline();
            J2ME.enterTimeline("Verify IR");
            cfg.verify();
            J2ME.leaveTimeline();
            J2ME.enterTimeline("Optimize Phis");
            cfg.optimizePhis();
            J2ME.leaveTimeline();
            J2ME.enterTimeline("Schedule Nodes");
            cfg.scheduleEarly();
            J2ME.leaveTimeline();
            writer && cfg.trace(writer);
            J2ME.enterTimeline("Verify IR");
            cfg.verify();
            J2ME.leaveTimeline();
            J2ME.enterTimeline("Allocate Variables");
            cfg.allocateVariables();
            J2ME.leaveTimeline();
            J2ME.enterTimeline("Generate Source");
            var result = J2ME.C4.Backend.generate(cfg);
            J2ME.leaveTimeline();
            Node.stopNumbering();
            J2ME.leaveTimeline();
            writer && writer.leave("}");
            IR.Node.stopNumbering();
            return result;
        };
        Builder.prototype.buildStart = function () {
            var start = new IR.Start();
            var state = start.entryState = new State();
            var methodInfo = this.methodInfo;
            for (var i = 0; i < methodInfo.max_locals; i++) {
                state.local.push(null);
            }
            state.store = new IR.Projection(start, 3 /* STORE */);
            state.store.kind = 11 /* Store */;
            var signatureDescriptor = this.signatureDescriptor;
            writer && writer.writeLn("SIG: " + signatureDescriptor);
            var typeDescriptors = signatureDescriptor.typeDescriptors;
            var localIndex = 0;
            var parameterIndex = 1;
            if (!methodInfo.isStatic) {
                var self = new IR.This(start);
                self.kind = 8 /* Reference */;
                state.storeLocal(0, self);
                parameterIndex++;
                localIndex = 1;
            }
            for (var i = 1; i < typeDescriptors.length; i++) {
                var kind = 8 /* Reference */;
                if (typeDescriptors[i] instanceof J2ME.AtomicTypeDescriptor) {
                    kind = typeDescriptors[i].kind;
                }
                var parameter = new IR.Parameter(start, parameterIndex, getParameterName(this.methodInfo, parameterIndex - 1));
                this.parameters.push(parameter);
                parameter.kind = kind;
                parameterIndex++;
                state.storeLocal(localIndex, parameter);
                localIndex += isTwoSlot(kind) ? 2 : 1;
            }
            return start;
        };
        Builder.prototype.buildGraph = function (start, state) {
            var worklist = new J2ME.SortedList(function compare(a, b) {
                return a.block.blockID - b.block.blockID;
            });
            worklist.push({
                region: start,
                block: this.blockMap.blocks[0]
            });
            var next;
            while ((next = worklist.pop())) {
                writer && writer.writeLn("Processing: " + next.region + " " + next.block.blockID + " " + next.region.entryState);
                this.buildBlock(next.region, next.block, next.region.entryState.clone());
                if (!this.blockStopInfos) {
                    continue;
                }
                this.blockStopInfos.forEach(function (stop) {
                    var target = stop.target;
                    writer && writer.writeLn(String(target));
                    var region = target.region;
                    if (region) {
                        writer && writer.enter("Merging into region: " + region + " @ " + target.startBci + ", block " + target.blockID + " {");
                        writer && writer.writeLn("  R " + region.entryState);
                        writer && writer.writeLn("+ I " + stop.state);
                        region.entryState.merge(region, stop.state);
                        region.predecessors.push(stop.control);
                        writer && writer.writeLn("  = " + region.entryState);
                        writer && writer.leave("}");
                    }
                    else {
                        region = target.region = new Region(stop.control);
                        var dirtyLocals = [];
                        //            if (target.loop) {
                        //              dirtyLocals = enableDirtyLocals.value && target.loop.getDirtyLocals();
                        //              writer && writer.writeLn("Adding PHIs to loop region. " + dirtyLocals);
                        //            }
                        region.entryState = target.isLoopHeader ? stop.state.makeLoopPhis(region, dirtyLocals) : stop.state.clone(target.startBci);
                        writer && writer.writeLn("Adding new region: " + region + " @ " + target.startBci + " to worklist.");
                        worklist.push({ region: region, block: target });
                    }
                });
                writer && writer.enter("Worklist: {");
                worklist.forEach(function (item) {
                    writer && writer.writeLn(item.region + " " + item.block.blockID + " " + item.region.entryState);
                });
                writer && writer.leave("}");
            }
            var signatureDescriptor = this.signatureDescriptor;
            var returnType = signatureDescriptor.typeDescriptors[0];
            // TODO handle void return types
            var stop;
            var returnInfos = this.methodReturnInfos;
            assert(returnInfos.length > 0);
            var returnRegion = new Region(null);
            var returnValuePhi = new Phi(returnRegion, null);
            var returnStorePhi = new Phi(returnRegion, null);
            returnInfos.forEach(function (returnInfo) {
                returnRegion.predecessors.push(returnInfo.control);
                returnValuePhi.pushValue(returnInfo.value);
                returnStorePhi.pushValue(returnInfo.store);
            });
            stop = new IR.Stop(returnRegion, returnStorePhi, returnValuePhi);
            return new IR.DFG(stop);
        };
        Builder.prototype.buildBlock = function (region, block, state) {
            this.blockStopInfos = null;
            this.state = state;
            this.region = region;
            var code = this.methodInfo.code;
            var stream = new BytecodeStream(code);
            var bci = block.startBci;
            stream.setBCI(bci);
            while (stream.currentBCI <= block.endBci) {
                state.bci = bci;
                this.processBytecode(stream, state);
                if (J2ME.Bytecode.isReturn(stream.currentBC()) || 191 /* ATHROW */ === stream.currentBC()) {
                    release || assert(!this.blockStopInfos, "Should not have any stops.");
                    return;
                }
                stream.next();
                bci = stream.currentBCI;
            }
            if (!this.blockStopInfos) {
                this.blockStopInfos = [new StopInfo(region, this.blockMap.getBlock(stream.currentBCI), this.state)];
            }
        };
        Builder.prototype.loadLocal = function (index, kind) {
            this.state.push(kind, this.state.loadLocal(index));
        };
        Builder.prototype.storeLocal = function (kind, index) {
            this.state.storeLocal(index, this.state.pop(kind));
        };
        Builder.prototype.stackOp = function (opcode) {
            var state = this.state;
            switch (opcode) {
                case 87 /* POP */: {
                    state.xpop();
                    break;
                }
                case 88 /* POP2 */: {
                    state.xpop();
                    state.xpop();
                    break;
                }
                case 89 /* DUP */: {
                    var w = state.xpop();
                    state.xpush(w);
                    state.xpush(w);
                    break;
                }
                case 90 /* DUP_X1 */: {
                    var w1 = state.xpop();
                    var w2 = state.xpop();
                    state.xpush(w1);
                    state.xpush(w2);
                    state.xpush(w1);
                    break;
                }
                case 91 /* DUP_X2 */: {
                    var w1 = state.xpop();
                    var w2 = state.xpop();
                    var w3 = state.xpop();
                    state.xpush(w1);
                    state.xpush(w3);
                    state.xpush(w2);
                    state.xpush(w1);
                    break;
                }
                case 92 /* DUP2 */: {
                    var w1 = state.xpop();
                    var w2 = state.xpop();
                    state.xpush(w2);
                    state.xpush(w1);
                    state.xpush(w2);
                    state.xpush(w1);
                    break;
                }
                case 93 /* DUP2_X1 */: {
                    var w1 = state.xpop();
                    var w2 = state.xpop();
                    var w3 = state.xpop();
                    state.xpush(w2);
                    state.xpush(w1);
                    state.xpush(w3);
                    state.xpush(w2);
                    state.xpush(w1);
                    break;
                }
                case 94 /* DUP2_X2 */: {
                    var w1 = state.xpop();
                    var w2 = state.xpop();
                    var w3 = state.xpop();
                    var w4 = state.xpop();
                    state.xpush(w2);
                    state.xpush(w1);
                    state.xpush(w4);
                    state.xpush(w3);
                    state.xpush(w2);
                    state.xpush(w1);
                    break;
                }
                case 95 /* SWAP */: {
                    var w1 = state.xpop();
                    var w2 = state.xpop();
                    state.xpush(w1);
                    state.xpush(w2);
                    break;
                }
                default:
                    J2ME.Debug.unexpected("");
            }
        };
        Builder.prototype.genArithmeticOp = function (result, opcode, canTrap) {
            var state = this.state;
            var y = state.pop(result);
            var x = state.pop(result);
            if (canTrap) {
                this.genDivideByZeroCheck(y);
            }
            var v;
            switch (opcode) {
                case 96 /* IADD */:
                    v = new IR.Binary(Operator.IADD, x, y);
                    break;
                case 97 /* LADD */:
                    v = new IR.JVMLongBinary(Operator.LADD, x, y);
                    break;
                case 98 /* FADD */:
                    v = new IR.Binary(Operator.FADD, x, y);
                    break;
                case 99 /* DADD */:
                    v = new IR.Binary(Operator.DADD, x, y);
                    break;
                case 100 /* ISUB */:
                    v = new IR.Binary(Operator.ISUB, x, y);
                    break;
                case 101 /* LSUB */:
                    v = new IR.JVMLongBinary(Operator.LSUB, x, y);
                    break;
                case 102 /* FSUB */:
                    v = new IR.Binary(Operator.FSUB, x, y);
                    break;
                case 103 /* DSUB */:
                    v = new IR.Binary(Operator.DSUB, x, y);
                    break;
                case 104 /* IMUL */:
                    v = new IR.Binary(Operator.IMUL, x, y);
                    break;
                case 105 /* LMUL */:
                    v = new IR.JVMLongBinary(Operator.LMUL, x, y);
                    break;
                case 106 /* FMUL */:
                    v = new IR.Binary(Operator.FMUL, x, y);
                    break;
                case 107 /* DMUL */:
                    v = new IR.Binary(Operator.DMUL, x, y);
                    break;
                case 108 /* IDIV */:
                    v = new IR.Binary(Operator.IDIV, x, y);
                    break;
                case 109 /* LDIV */:
                    v = new IR.JVMLongBinary(Operator.LDIV, x, y);
                    break;
                case 110 /* FDIV */:
                    v = new IR.Binary(Operator.FDIV, x, y);
                    break;
                case 111 /* DDIV */:
                    v = new IR.Binary(Operator.DDIV, x, y);
                    break;
                case 112 /* IREM */:
                    v = new IR.Binary(Operator.IREM, x, y);
                    break;
                case 113 /* LREM */:
                    v = new IR.JVMLongBinary(Operator.LREM, x, y);
                    break;
                case 114 /* FREM */:
                    v = new IR.Binary(Operator.FREM, x, y);
                    break;
                case 115 /* DREM */:
                    v = new IR.Binary(Operator.DREM, x, y);
                    break;
                default:
                    assert(false);
            }
            v = this.peepholeOptimizer.fold(v);
            state.push(result, v);
        };
        Builder.prototype.genShiftOp = function (kind, opcode) {
            var state = this.state;
            var s = state.ipop();
            var x = state.pop(kind);
            var v;
            switch (opcode) {
                case 120 /* ISHL */:
                    v = new IR.Binary(Operator.LSH, x, s);
                    break;
                case 121 /* LSHL */:
                    v = new IR.JVMLongBinary(Operator.LSH, x, s);
                    break;
                case 122 /* ISHR */:
                    v = new IR.Binary(Operator.RSH, x, s);
                    break;
                case 123 /* LSHR */:
                    v = new IR.JVMLongBinary(Operator.RSH, x, s);
                    break;
                case 124 /* IUSHR */:
                    v = new IR.Binary(Operator.URSH, x, s);
                    break;
                case 125 /* LUSHR */:
                    v = new IR.JVMLongBinary(Operator.URSH, x, s);
                    break;
                default:
                    assert(false);
            }
            state.push(kind, v);
        };
        Builder.prototype.genLogicOp = function (kind, opcode) {
            var state = this.state;
            var y = state.pop(kind);
            var x = state.pop(kind);
            var v;
            switch (opcode) {
                case 126 /* IAND */:
                    v = new IR.Binary(Operator.AND, x, y);
                    break;
                case 127 /* LAND */:
                    v = new IR.JVMLongBinary(Operator.AND, x, y);
                    break;
                case 128 /* IOR */:
                    v = new IR.Binary(Operator.OR, x, y);
                    break;
                case 129 /* LOR */:
                    v = new IR.JVMLongBinary(Operator.OR, x, y);
                    break;
                case 130 /* IXOR */:
                    v = new IR.Binary(Operator.XOR, x, y);
                    break;
                case 131 /* LXOR */:
                    v = new IR.JVMLongBinary(Operator.XOR, x, y);
                    break;
                default:
                    assert(false);
            }
            state.push(kind, v);
        };
        Builder.prototype.genNegateOp = function (kind) {
            var x = this.state.pop(kind);
            var v;
            switch (kind) {
                case 4 /* Int */:
                    v = new IR.Unary(Operator.INEG, x);
                    break;
                case 6 /* Long */:
                    v = new IR.JVMLongUnary(Operator.LNEG, x);
                    break;
                case 5 /* Float */:
                    v = new IR.Unary(Operator.FNEG, x);
                    break;
                case 7 /* Double */:
                    v = new IR.Unary(Operator.DNEG, x);
                    break;
                default:
                    assert(false);
            }
            this.state.push(kind, v);
        };
        Builder.prototype.genNewInstance = function (cpi) {
            var classInfo = this.lookupClass(cpi);
            var jvmNew = new IR.JVMNew(this.region, this.state.store, classInfo);
            this.recordStore(jvmNew);
            this.state.apush(jvmNew);
        };
        Builder.prototype.genNewTypeArray = function (typeCode) {
            var kind = J2ME.arrayTypeCodeToKind(typeCode);
            var length = this.state.ipop();
            var result = new IR.JVMNewArray(this.region, this.state.store, kind, length);
            this.recordStore(result);
            this.state.apush(result);
        };
        Builder.prototype.genNewObjectArray = function (cpi) {
            var classInfo = this.lookupClass(cpi);
            var length = this.state.ipop();
            var result = new IR.JVMNewObjectArray(this.region, this.state.store, classInfo, length);
            this.recordStore(result);
            this.state.apush(result);
        };
        Builder.prototype.genLoadConstant = function (cpi, state) {
            var cp = this.methodInfo.classInfo.constant_pool;
            var entry = cp[cpi];
            switch (entry.tag) {
                case 3 /* CONSTANT_Integer */:
                    state.ipush(genConstant(entry.integer, 4 /* Int */));
                    return;
                case 4 /* CONSTANT_Float */:
                    state.fpush(genConstant(entry.float, 5 /* Float */));
                    return;
                case 6 /* CONSTANT_Double */:
                    state.dpush(genConstant(entry.double, 7 /* Double */));
                    return;
                case 5:
                    state.lpush(new IR.JVMLong(entry.lowBits, entry.highBits));
                    return;
                case 8 /* CONSTANT_String */:
                    entry = cp[entry.string_index];
                    return state.push(8 /* Reference */, genConstant(entry.bytes, 8 /* Reference */));
                default:
                    throw "Not done for: " + entry.tag;
            }
        };
        Builder.prototype.genCheckCast = function (cpi) {
            var classInfo = this.lookupClass(cpi);
            var object = this.state.peek();
            var checkCast = new IR.JVMCheckCast(this.region, this.state.store, object, classInfo);
            this.recordStore(checkCast);
        };
        Builder.prototype.genInstanceOf = function (cpi) {
            var classInfo = this.lookupClass(cpi);
            var object = this.state.apop();
            var instanceOf = new IR.JVMInstanceOf(this.region, this.state.store, object, classInfo);
            this.recordStore(instanceOf);
            this.state.push(0 /* Boolean */, instanceOf);
        };
        Builder.prototype.genIncrement = function (stream) {
            var index = stream.readLocalIndex();
            var local = this.state.loadLocal(index);
            var increment = genConstant(stream.readIncrement(), 4 /* Int */);
            var value = new IR.Binary(Operator.IADD, local, increment);
            value.kind = J2ME.stackKind(local.kind);
            this.state.storeLocal(index, value);
        };
        Builder.prototype.genConvert = function (from, to) {
            var value = this.state.pop(from);
            this.state.push(to, new IR.JVMConvert(from, to, value));
        };
        Builder.prototype.genIf = function (stream, predicate) {
            release || assert(!this.blockStopInfos);
            var _if = new IR.If(this.region, predicate);
            this.blockStopInfos = [new StopInfo(new IR.Projection(_if, 1 /* TRUE */), this.blockMap.getBlock(stream.readBranchDest()), this.state), new StopInfo(new IR.Projection(_if, 2 /* FALSE */), this.blockMap.getBlock(stream.nextBCI), this.state)];
        };
        Builder.prototype.genIfNull = function (stream, condition) {
            this.state.apush(Null);
            var y = this.state.apop();
            var x = this.state.apop();
            this.genIf(stream, new IR.Binary(conditionToOperator(condition), x, y));
        };
        Builder.prototype.genIfSame = function (stream, kind, condition) {
            var y = this.state.pop(kind);
            var x = this.state.pop(kind);
            this.genIf(stream, new IR.Binary(conditionToOperator(condition), x, y));
        };
        Builder.prototype.genIfZero = function (stream, condition) {
            this.state.ipush(genConstant(0, 4 /* Int */));
            var y = this.state.ipop();
            var x = this.state.ipop();
            this.genIf(stream, new IR.Binary(conditionToOperator(condition), x, y));
        };
        Builder.prototype.genCompareOp = function (kind, isLessThan) {
            var b = this.state.pop(kind);
            var a = this.state.pop(kind);
            var compare;
            if (kind === 6 /* Long */) {
                compare = new IR.JVMLongCompare(this.region, a, b);
            }
            else {
                compare = new IR.JVMFloatCompare(this.region, a, b, isLessThan);
            }
            this.state.ipush(compare);
        };
        Builder.prototype.genGoto = function (stream) {
            release || assert(!this.blockStopInfos);
            this.blockStopInfos = [new StopInfo(this.region, this.blockMap.getBlock(stream.readBranchDest()), this.state)];
        };
        Builder.prototype.genReturn = function (value) {
            if (value === null) {
                value = Undefined;
            }
            this.methodReturnInfos.push(new ReturnInfo(this.region, this.state.store, value));
        };
        Builder.prototype.lookupClass = function (cpi) {
            var classInfo = this.ctx.resolve(this.methodInfo.classInfo.constant_pool, cpi, false);
            J2ME.ArrayUtilities.pushUnique(this.referencedClasses, classInfo);
            return classInfo;
        };
        Builder.prototype.lookupMethod = function (cpi, opcode, isStatic) {
            var methodInfo = this.ctx.resolve(this.methodInfo.classInfo.constant_pool, cpi, isStatic);
            J2ME.ArrayUtilities.pushUnique(this.referencedClasses, methodInfo.classInfo);
            return methodInfo;
        };
        Builder.prototype.lookupField = function (cpi, opcode, isStatic) {
            var fieldInfo = this.ctx.resolve(this.methodInfo.classInfo.constant_pool, cpi, isStatic);
            J2ME.ArrayUtilities.pushUnique(this.referencedClasses, fieldInfo.classInfo);
            return fieldInfo;
        };
        /**
         * Marks the |node| as the active store node, with dependencies on all loads appearing after the
         * previous active store node.
         */
        Builder.prototype.recordStore = function (node) {
            var state = this.state;
            state.store = new IR.Projection(node, 3 /* STORE */);
            state.store.kind = 11 /* Store */;
            node.loads = state.loads.slice(0);
            state.loads.length = 0;
        };
        /**
         * Keeps track of the current set of loads.
         */
        Builder.prototype.recordLoad = function (node) {
            var state = this.state;
            state.loads.push(node);
            return node;
        };
        Builder.prototype.genDivideByZeroCheck = function (value) {
            var checkArithmetic = new IR.JVMCheckArithmetic(this.region, this.state.store, value);
            this.recordStore(checkArithmetic);
        };
        Builder.prototype.genThrow = function (bci) {
            var object = this.state.peek();
            var _throw = new IR.JVMThrow(this.region, this.state.store, object);
            this.recordStore(_throw);
            this.methodReturnInfos.push(new ReturnInfo(this.region, this.state.store, Undefined));
        };
        Builder.prototype.genInvoke = function (methodInfo, opcode, nextBCI) {
            var calleeCanYield = 4 /* Virtual */;
            if (isStaticallyBound(opcode, methodInfo)) {
                calleeCanYield = canYield(this.ctx, methodInfo);
            }
            var signature = J2ME.SignatureDescriptor.makeSignatureDescriptor(methodInfo.signature);
            var types = signature.typeDescriptors;
            var args = [];
            for (var i = types.length - 1; i > 0; i--) {
                args.unshift(this.state.pop(types[i].kind));
            }
            var object = null;
            if (opcode !== 184 /* INVOKESTATIC */) {
                object = this.state.pop(8 /* Reference */);
            }
            //switch (methodInfo.implKey) {
            //  // There's no reason to call the object initializer.
            //  case "java/lang/Object.<init>.()V":
            //    return;
            //}
            var state;
            if (calleeCanYield) {
                // Only save the state if the callee can yield.
                state = this.state.clone(nextBCI);
            }
            J2ME.counter && J2ME.counter.count("Yield Code: " + YieldReason[calleeCanYield] + " " + methodInfo.implKey);
            J2ME.counter && J2ME.counter.count("Yield Code: " + YieldReason[calleeCanYield]);
            var call = new IR.JVMInvoke(this.region, this.state.store, state, opcode, object, methodInfo, args);
            this.recordStore(call);
            if (types[0].kind !== 9 /* Void */) {
                this.state.push(types[0].kind, call);
            }
        };
        Builder.prototype.genStoreIndexed = function (kind) {
            var value = this.state.pop(J2ME.stackKind(kind));
            var index = this.state.ipop();
            var array = this.state.apop();
            var arrayStore = new IR.JVMStoreIndexed(this.region, this.state.store, kind, array, index, value);
            this.recordStore(arrayStore);
        };
        Builder.prototype.genLoadIndexed = function (kind) {
            var index = this.state.ipop();
            var array = this.state.apop();
            var arrayLoad = new IR.JVMLoadIndexed(this.region, this.state.store, kind, array, index);
            this.recordLoad(arrayLoad);
            this.state.push(kind, arrayLoad);
        };
        Builder.prototype.genArrayLength = function () {
            var array = this.state.apop();
            var getProperty = new IR.GetProperty(this.region, this.state.store, array, new Constant('length'));
            this.recordLoad(getProperty);
            this.state.ipush(getProperty);
        };
        Builder.prototype.genClass = function (classInfo) {
            J2ME.ArrayUtilities.pushUnique(this.referencedClasses, classInfo);
            return new IR.JVMClass(classInfo);
        };
        Builder.prototype.genGetField = function (fieldInfo, isStatic) {
            var signature = J2ME.TypeDescriptor.makeTypeDescriptor(fieldInfo.signature);
            var object = isStatic ? null : this.state.apop();
            var getField = new IR.JVMGetField(this.region, this.state.store, object, fieldInfo);
            this.recordLoad(getField);
            this.state.push(signature.kind, getField);
        };
        Builder.prototype.genPutField = function (fieldInfo, isStatic) {
            var signature = J2ME.TypeDescriptor.makeTypeDescriptor(fieldInfo.signature);
            var value = this.state.pop(signature.kind);
            var object = isStatic ? null : this.state.apop();
            var putField = new IR.JVMPutField(this.region, this.state.store, object, fieldInfo, value);
            this.recordStore(putField);
        };
        Builder.prototype.processBytecode = function (stream, state) {
            var cpi;
            var opcode = stream.currentBC();
            writer && writer.enter("State Before: " + Bytecodes[opcode].padRight(" ", 12) + " " + state.toString());
            switch (opcode) {
                case 0 /* NOP */: break;
                case 1 /* ACONST_NULL */:
                    state.apush(genConstant(null, 8 /* Reference */));
                    break;
                case 2 /* ICONST_M1 */:
                    state.ipush(genConstant(-1, 4 /* Int */));
                    break;
                case 3 /* ICONST_0 */:
                    state.ipush(genConstant(0, 4 /* Int */));
                    break;
                case 4 /* ICONST_1 */:
                    state.ipush(genConstant(1, 4 /* Int */));
                    break;
                case 5 /* ICONST_2 */:
                    state.ipush(genConstant(2, 4 /* Int */));
                    break;
                case 6 /* ICONST_3 */:
                    state.ipush(genConstant(3, 4 /* Int */));
                    break;
                case 7 /* ICONST_4 */:
                    state.ipush(genConstant(4, 4 /* Int */));
                    break;
                case 8 /* ICONST_5 */:
                    state.ipush(genConstant(5, 4 /* Int */));
                    break;
                case 9 /* LCONST_0 */:
                    state.lpush(genConstant(0, 6 /* Long */));
                    break;
                case 10 /* LCONST_1 */:
                    state.lpush(genConstant(1, 6 /* Long */));
                    break;
                case 11 /* FCONST_0 */:
                    state.fpush(genConstant(0, 5 /* Float */));
                    break;
                case 12 /* FCONST_1 */:
                    state.fpush(genConstant(1, 5 /* Float */));
                    break;
                case 13 /* FCONST_2 */:
                    state.fpush(genConstant(2, 5 /* Float */));
                    break;
                case 14 /* DCONST_0 */:
                    state.dpush(genConstant(0, 7 /* Double */));
                    break;
                case 15 /* DCONST_1 */:
                    state.dpush(genConstant(1, 7 /* Double */));
                    break;
                case 16 /* BIPUSH */:
                    state.ipush(genConstant(stream.readByte(), 4 /* Int */));
                    break;
                case 17 /* SIPUSH */:
                    state.ipush(genConstant(stream.readShort(), 4 /* Int */));
                    break;
                case 18 /* LDC */:
                case 19 /* LDC_W */:
                case 20 /* LDC2_W */:
                    this.genLoadConstant(stream.readCPI(), state);
                    break;
                case 21 /* ILOAD */:
                    this.loadLocal(stream.readLocalIndex(), 4 /* Int */);
                    break;
                case 22 /* LLOAD */:
                    this.loadLocal(stream.readLocalIndex(), 6 /* Long */);
                    break;
                case 23 /* FLOAD */:
                    this.loadLocal(stream.readLocalIndex(), 5 /* Float */);
                    break;
                case 24 /* DLOAD */:
                    this.loadLocal(stream.readLocalIndex(), 7 /* Double */);
                    break;
                case 25 /* ALOAD */:
                    this.loadLocal(stream.readLocalIndex(), 8 /* Reference */);
                    break;
                case 26 /* ILOAD_0 */:
                case 27 /* ILOAD_1 */:
                case 28 /* ILOAD_2 */:
                case 29 /* ILOAD_3 */:
                    this.loadLocal(opcode - 26 /* ILOAD_0 */, 4 /* Int */);
                    break;
                case 30 /* LLOAD_0 */:
                case 31 /* LLOAD_1 */:
                case 32 /* LLOAD_2 */:
                case 33 /* LLOAD_3 */:
                    this.loadLocal(opcode - 30 /* LLOAD_0 */, 6 /* Long */);
                    break;
                case 34 /* FLOAD_0 */:
                case 35 /* FLOAD_1 */:
                case 36 /* FLOAD_2 */:
                case 37 /* FLOAD_3 */:
                    this.loadLocal(opcode - 34 /* FLOAD_0 */, 5 /* Float */);
                    break;
                case 38 /* DLOAD_0 */:
                case 39 /* DLOAD_1 */:
                case 40 /* DLOAD_2 */:
                case 41 /* DLOAD_3 */:
                    this.loadLocal(opcode - 38 /* DLOAD_0 */, 7 /* Double */);
                    break;
                case 42 /* ALOAD_0 */:
                case 43 /* ALOAD_1 */:
                case 44 /* ALOAD_2 */:
                case 45 /* ALOAD_3 */:
                    this.loadLocal(opcode - 42 /* ALOAD_0 */, 8 /* Reference */);
                    break;
                case 46 /* IALOAD */:
                    this.genLoadIndexed(4 /* Int */);
                    break;
                case 47 /* LALOAD */:
                    this.genLoadIndexed(6 /* Long */);
                    break;
                case 48 /* FALOAD */:
                    this.genLoadIndexed(5 /* Float */);
                    break;
                case 49 /* DALOAD */:
                    this.genLoadIndexed(7 /* Double */);
                    break;
                case 50 /* AALOAD */:
                    this.genLoadIndexed(8 /* Reference */);
                    break;
                case 51 /* BALOAD */:
                    this.genLoadIndexed(1 /* Byte */);
                    break;
                case 52 /* CALOAD */:
                    this.genLoadIndexed(3 /* Char */);
                    break;
                case 53 /* SALOAD */:
                    this.genLoadIndexed(2 /* Short */);
                    break;
                case 54 /* ISTORE */:
                    this.storeLocal(4 /* Int */, stream.readLocalIndex());
                    break;
                case 55 /* LSTORE */:
                    this.storeLocal(6 /* Long */, stream.readLocalIndex());
                    break;
                case 56 /* FSTORE */:
                    this.storeLocal(5 /* Float */, stream.readLocalIndex());
                    break;
                case 57 /* DSTORE */:
                    this.storeLocal(7 /* Double */, stream.readLocalIndex());
                    break;
                case 58 /* ASTORE */:
                    this.storeLocal(8 /* Reference */, stream.readLocalIndex());
                    break;
                case 59 /* ISTORE_0 */:
                case 60 /* ISTORE_1 */:
                case 61 /* ISTORE_2 */:
                case 62 /* ISTORE_3 */:
                    this.storeLocal(4 /* Int */, opcode - 59 /* ISTORE_0 */);
                    break;
                case 63 /* LSTORE_0 */:
                case 64 /* LSTORE_1 */:
                case 65 /* LSTORE_2 */:
                case 66 /* LSTORE_3 */:
                    this.storeLocal(6 /* Long */, opcode - 63 /* LSTORE_0 */);
                    break;
                case 67 /* FSTORE_0 */:
                case 68 /* FSTORE_1 */:
                case 69 /* FSTORE_2 */:
                case 70 /* FSTORE_3 */:
                    this.storeLocal(5 /* Float */, opcode - 67 /* FSTORE_0 */);
                    break;
                case 71 /* DSTORE_0 */:
                case 72 /* DSTORE_1 */:
                case 73 /* DSTORE_2 */:
                case 74 /* DSTORE_3 */:
                    this.storeLocal(7 /* Double */, opcode - 71 /* DSTORE_0 */);
                    break;
                case 75 /* ASTORE_0 */:
                case 76 /* ASTORE_1 */:
                case 77 /* ASTORE_2 */:
                case 78 /* ASTORE_3 */:
                    this.storeLocal(8 /* Reference */, opcode - 75 /* ASTORE_0 */);
                    break;
                case 79 /* IASTORE */:
                    this.genStoreIndexed(4 /* Int */);
                    break;
                case 80 /* LASTORE */:
                    this.genStoreIndexed(6 /* Long */);
                    break;
                case 81 /* FASTORE */:
                    this.genStoreIndexed(5 /* Float */);
                    break;
                case 82 /* DASTORE */:
                    this.genStoreIndexed(7 /* Double */);
                    break;
                case 83 /* AASTORE */:
                    this.genStoreIndexed(8 /* Reference */);
                    break;
                case 84 /* BASTORE */:
                    this.genStoreIndexed(1 /* Byte */);
                    break;
                case 85 /* CASTORE */:
                    this.genStoreIndexed(3 /* Char */);
                    break;
                case 86 /* SASTORE */:
                    this.genStoreIndexed(2 /* Short */);
                    break;
                case 87 /* POP */:
                case 88 /* POP2 */:
                case 89 /* DUP */:
                case 90 /* DUP_X1 */:
                case 91 /* DUP_X2 */:
                case 92 /* DUP2 */:
                case 93 /* DUP2_X1 */:
                case 94 /* DUP2_X2 */:
                case 95 /* SWAP */:
                    this.stackOp(opcode);
                    break;
                case 96 /* IADD */:
                case 100 /* ISUB */:
                case 104 /* IMUL */:
                    this.genArithmeticOp(4 /* Int */, opcode, false);
                    break;
                case 108 /* IDIV */:
                case 112 /* IREM */:
                    this.genArithmeticOp(4 /* Int */, opcode, true);
                    break;
                case 97 /* LADD */:
                case 101 /* LSUB */:
                case 105 /* LMUL */:
                    this.genArithmeticOp(6 /* Long */, opcode, false);
                    break;
                case 109 /* LDIV */:
                case 113 /* LREM */:
                    this.genArithmeticOp(6 /* Long */, opcode, true);
                    break;
                case 98 /* FADD */:
                case 102 /* FSUB */:
                case 106 /* FMUL */:
                case 110 /* FDIV */:
                case 114 /* FREM */:
                    this.genArithmeticOp(5 /* Float */, opcode, false);
                    break;
                case 99 /* DADD */:
                case 103 /* DSUB */:
                case 107 /* DMUL */:
                case 111 /* DDIV */:
                case 115 /* DREM */:
                    this.genArithmeticOp(7 /* Double */, opcode, false);
                    break;
                case 116 /* INEG */:
                    this.genNegateOp(4 /* Int */);
                    break;
                case 117 /* LNEG */:
                    this.genNegateOp(6 /* Long */);
                    break;
                case 118 /* FNEG */:
                    this.genNegateOp(5 /* Float */);
                    break;
                case 119 /* DNEG */:
                    this.genNegateOp(7 /* Double */);
                    break;
                case 120 /* ISHL */:
                case 122 /* ISHR */:
                case 124 /* IUSHR */:
                    this.genShiftOp(4 /* Int */, opcode);
                    break;
                case 126 /* IAND */:
                case 128 /* IOR */:
                case 130 /* IXOR */:
                    this.genLogicOp(4 /* Int */, opcode);
                    break;
                case 121 /* LSHL */:
                case 123 /* LSHR */:
                case 125 /* LUSHR */:
                    this.genShiftOp(6 /* Long */, opcode);
                    break;
                case 127 /* LAND */:
                case 129 /* LOR */:
                case 131 /* LXOR */:
                    this.genLogicOp(6 /* Long */, opcode);
                    break;
                case 132 /* IINC */:
                    this.genIncrement(stream);
                    break;
                case 133 /* I2L */:
                    this.genConvert(4 /* Int */, 6 /* Long */);
                    break;
                case 134 /* I2F */:
                    this.genConvert(4 /* Int */, 5 /* Float */);
                    break;
                case 135 /* I2D */:
                    this.genConvert(4 /* Int */, 7 /* Double */);
                    break;
                case 136 /* L2I */:
                    this.genConvert(6 /* Long */, 4 /* Int */);
                    break;
                case 137 /* L2F */:
                    this.genConvert(6 /* Long */, 5 /* Float */);
                    break;
                case 138 /* L2D */:
                    this.genConvert(6 /* Long */, 7 /* Double */);
                    break;
                case 139 /* F2I */:
                    this.genConvert(5 /* Float */, 4 /* Int */);
                    break;
                case 140 /* F2L */:
                    this.genConvert(5 /* Float */, 6 /* Long */);
                    break;
                case 141 /* F2D */:
                    this.genConvert(5 /* Float */, 7 /* Double */);
                    break;
                case 142 /* D2I */:
                    this.genConvert(7 /* Double */, 4 /* Int */);
                    break;
                case 143 /* D2L */:
                    this.genConvert(7 /* Double */, 6 /* Long */);
                    break;
                case 144 /* D2F */:
                    this.genConvert(7 /* Double */, 5 /* Float */);
                    break;
                case 145 /* I2B */:
                    this.genConvert(4 /* Int */, 1 /* Byte */);
                    break;
                case 146 /* I2C */:
                    this.genConvert(4 /* Int */, 3 /* Char */);
                    break;
                case 147 /* I2S */:
                    this.genConvert(4 /* Int */, 2 /* Short */);
                    break;
                case 148 /* LCMP */:
                    this.genCompareOp(6 /* Long */, false);
                    break;
                case 149 /* FCMPL */:
                    this.genCompareOp(5 /* Float */, true);
                    break;
                case 150 /* FCMPG */:
                    this.genCompareOp(5 /* Float */, false);
                    break;
                case 151 /* DCMPL */:
                    this.genCompareOp(7 /* Double */, true);
                    break;
                case 152 /* DCMPG */:
                    this.genCompareOp(7 /* Double */, false);
                    break;
                case 153 /* IFEQ */:
                    this.genIfZero(stream, 0 /* EQ */);
                    break;
                case 154 /* IFNE */:
                    this.genIfZero(stream, 1 /* NE */);
                    break;
                case 155 /* IFLT */:
                    this.genIfZero(stream, 2 /* LT */);
                    break;
                case 156 /* IFGE */:
                    this.genIfZero(stream, 5 /* GE */);
                    break;
                case 157 /* IFGT */:
                    this.genIfZero(stream, 4 /* GT */);
                    break;
                case 158 /* IFLE */:
                    this.genIfZero(stream, 3 /* LE */);
                    break;
                case 159 /* IF_ICMPEQ */:
                    this.genIfSame(stream, 4 /* Int */, 0 /* EQ */);
                    break;
                case 160 /* IF_ICMPNE */:
                    this.genIfSame(stream, 4 /* Int */, 1 /* NE */);
                    break;
                case 161 /* IF_ICMPLT */:
                    this.genIfSame(stream, 4 /* Int */, 2 /* LT */);
                    break;
                case 162 /* IF_ICMPGE */:
                    this.genIfSame(stream, 4 /* Int */, 5 /* GE */);
                    break;
                case 163 /* IF_ICMPGT */:
                    this.genIfSame(stream, 4 /* Int */, 4 /* GT */);
                    break;
                case 164 /* IF_ICMPLE */:
                    this.genIfSame(stream, 4 /* Int */, 3 /* LE */);
                    break;
                case 165 /* IF_ACMPEQ */:
                    this.genIfSame(stream, 8 /* Reference */, 0 /* EQ */);
                    break;
                case 166 /* IF_ACMPNE */:
                    this.genIfSame(stream, 8 /* Reference */, 1 /* NE */);
                    break;
                case 167 /* GOTO */:
                    this.genGoto(stream);
                    break;
                case 172 /* IRETURN */:
                    this.genReturn(state.ipop());
                    break;
                case 173 /* LRETURN */:
                    this.genReturn(state.lpop());
                    break;
                case 174 /* FRETURN */:
                    this.genReturn(state.fpop());
                    break;
                case 175 /* DRETURN */:
                    this.genReturn(state.dpop());
                    break;
                case 176 /* ARETURN */:
                    this.genReturn(state.apop());
                    break;
                case 177 /* RETURN */:
                    this.genReturn(null);
                    break;
                case 178 /* GETSTATIC */:
                    cpi = stream.readCPI();
                    this.genGetField(this.lookupField(cpi, opcode, true), true);
                    break;
                case 179 /* PUTSTATIC */:
                    cpi = stream.readCPI();
                    this.genPutField(this.lookupField(cpi, opcode, true), true);
                    break;
                case 180 /* GETFIELD */:
                    cpi = stream.readCPI();
                    this.genGetField(this.lookupField(cpi, opcode, false), false);
                    break;
                case 181 /* PUTFIELD */:
                    cpi = stream.readCPI();
                    this.genPutField(this.lookupField(cpi, opcode, false), false);
                    break;
                case 182 /* INVOKEVIRTUAL */:
                    cpi = stream.readCPI();
                    this.genInvoke(this.lookupMethod(cpi, opcode, false), opcode, stream.nextBCI);
                    break;
                case 183 /* INVOKESPECIAL */:
                    cpi = stream.readCPI();
                    this.genInvoke(this.lookupMethod(cpi, opcode, false), opcode, stream.nextBCI);
                    break;
                case 184 /* INVOKESTATIC */:
                    cpi = stream.readCPI();
                    this.genInvoke(this.lookupMethod(cpi, opcode, true), opcode, stream.nextBCI);
                    break;
                case 185 /* INVOKEINTERFACE */:
                    cpi = stream.readCPI();
                    this.genInvoke(this.lookupMethod(cpi, opcode, false), opcode, stream.nextBCI);
                    break;
                case 187 /* NEW */:
                    this.genNewInstance(stream.readCPI());
                    break;
                case 188 /* NEWARRAY */:
                    this.genNewTypeArray(stream.readLocalIndex());
                    break;
                case 189 /* ANEWARRAY */:
                    this.genNewObjectArray(stream.readCPI());
                    break;
                case 190 /* ARRAYLENGTH */:
                    this.genArrayLength();
                    break;
                case 191 /* ATHROW */:
                    this.genThrow(stream.currentBCI);
                    break;
                case 192 /* CHECKCAST */:
                    this.genCheckCast(stream.readCPI());
                    break;
                case 193 /* INSTANCEOF */:
                    this.genInstanceOf(stream.readCPI());
                    break;
                case 198 /* IFNULL */:
                    this.genIfNull(stream, 0 /* EQ */);
                    break;
                case 199 /* IFNONNULL */:
                    this.genIfNull(stream, 1 /* NE */);
                    break;
                default:
                    throw new Error("Not Implemented " + Bytecodes[opcode]);
            }
            writer && writer.leave("State  After: " + Bytecodes[opcode].padRight(" ", 12) + " " + state.toString());
            writer && writer.writeLn("");
        };
        return Builder;
    })();
})(J2ME || (J2ME = {}));
var J2ME;
(function (J2ME) {
    var Emitter = (function () {
        function Emitter(writer, closure, debugInfo, klassHeaderOnly, definitions) {
            if (klassHeaderOnly === void 0) { klassHeaderOnly = false; }
            if (definitions === void 0) { definitions = false; }
            this.writer = writer;
            this.closure = closure;
            this.debugInfo = debugInfo;
            this.klassHeaderOnly = klassHeaderOnly;
            this.definitions = definitions;
            // ...
        }
        return Emitter;
    })();
    J2ME.Emitter = Emitter;
    function getClassInheritanceChain(classInfo) {
        var list = [];
        var klass = classInfo;
        while (klass) {
            list.unshift(klass);
            klass = klass.superClass;
        }
        return list;
    }
    function typeDescriptorToDefinition(value) {
        var typeDescriptor = J2ME.TypeDescriptor.parseTypeDescriptor(value, 0);
        var type = "";
        if (typeDescriptor.kind === 8 /* Reference */) {
            var dimensions = J2ME.TypeDescriptor.getArrayDimensions(typeDescriptor);
            if (dimensions) {
                var elementType = typeDescriptor.value.substring(dimensions);
                var elementTypeDescriptor = J2ME.TypeDescriptor.parseTypeDescriptor(elementType, 0);
                dimensions--;
                switch (elementTypeDescriptor.kind) {
                    case 4 /* Int */:
                        type = "Int32Array";
                        break;
                    case 3 /* Char */:
                        type = "Uint16Array";
                        break;
                    case 2 /* Short */:
                        type = "Int16Array";
                        break;
                    case 1 /* Byte */:
                    case 0 /* Boolean */:
                        type = "Int8Array";
                        break;
                    case 5 /* Float */:
                        type = "Float32Array";
                        break;
                    case 6 /* Long */:
                        type = "Array";
                        break;
                    case 7 /* Double */:
                        type = "Float64Array";
                        break;
                    default:
                        type = typeDescriptorToDefinition(elementType);
                        dimensions++;
                        break;
                }
            }
            else {
                type = typeDescriptor.value.substring(dimensions + 1, typeDescriptor.value.length - 1);
                type = type.replace(/\//g, '.');
            }
            for (var i = 0; i < dimensions; i++) {
                type += "[]";
            }
        }
        else {
            switch (typeDescriptor.kind) {
                case 0 /* Boolean */: return "boolean";
                case 1 /* Byte */:
                case 2 /* Short */:
                case 3 /* Char */:
                case 4 /* Int */:
                case 5 /* Float */:
                case 7 /* Double */:
                    return "number";
                case 6 /* Long */:
                    return "number";
                case 9 /* Void */:
                    return "void";
                default: throw J2ME.Debug.unexpected("Unknown kind: " + typeDescriptor.kind);
            }
        }
        return type;
    }
    function signatureToDefinition(signature, includeReturnType, excludeArgumentNames) {
        if (includeReturnType === void 0) { includeReturnType = true; }
        if (excludeArgumentNames === void 0) { excludeArgumentNames = false; }
        var types = J2ME.SignatureDescriptor.makeSignatureDescriptor(signature).typeDescriptors;
        var argumentNames = "abcdefghijklmnopqrstuvwxyz";
        var i = 0;
        var result;
        if (excludeArgumentNames) {
            result = "(" + types.slice(1).map(function (t) { return typeDescriptorToDefinition(t.value); }).join(", ") + ")";
        }
        else {
            result = "(" + types.slice(1).map(function (t) { return argumentNames[i++] + ": " + typeDescriptorToDefinition(t.value); }).join(", ") + ")";
        }
        J2ME.Debug.assert(i < argumentNames.length);
        if (includeReturnType) {
            result += " => " + typeDescriptorToDefinition(types[0].value);
        }
        return result;
    }
    J2ME.signatureToDefinition = signatureToDefinition;
    function emitMethodDefinition(emitter, methodInfo) {
        if (methodInfo.name === "<clinit>") {
            return;
        }
        if (methodInfo.isStatic && methodInfo.classInfo.isInterface) {
            return;
        }
        var isStaticString = methodInfo.isStatic ? "static " : "";
        var isConstructor = methodInfo.name === "<init>";
        if (isConstructor) {
        }
        else {
            var name = methodInfo.name + methodInfo.signature;
            emitter.writer.writeLn(isStaticString + J2ME.quote(name) + ": " + signatureToDefinition(methodInfo.signature) + ";");
        }
    }
    J2ME.emitMethodDefinition = emitMethodDefinition;
    function emitFieldDefinition(emitter, fieldInfo) {
        if (fieldInfo.isStatic && fieldInfo.classInfo.isInterface) {
            return;
        }
        var isStaticString = fieldInfo.isStatic ? "static " : "";
        emitter.writer.writeLn(isStaticString + fieldInfo.name + ": " + typeDescriptorToDefinition(fieldInfo.signature) + ";");
    }
    J2ME.emitFieldDefinition = emitFieldDefinition;
    function emitKlass(emitter, classInfo) {
        var writer = emitter.writer;
        var mangledClassName = J2ME.mangleClass(classInfo);
        if (emitter.closure) {
            writer.writeLn("/** @constructor */");
        }
        function emitFields(fields, emitStatic) {
            for (var i = 0; i < fields.length; i++) {
                var fieldInfo = fields[i];
                if (fieldInfo.isStatic !== emitStatic) {
                    continue;
                }
                var signature = J2ME.TypeDescriptor.makeTypeDescriptor(fieldInfo.signature);
                var kind = signature.kind;
                var defaultValue;
                switch (kind) {
                    case 8 /* Reference */:
                        defaultValue = "null";
                        break;
                    case 6 /* Long */:
                        defaultValue = "Long.ZERO";
                        break;
                    default:
                        defaultValue = "0";
                        break;
                }
                if (emitter.definitions) {
                    emitFieldDefinition(emitter, fieldInfo);
                }
                else {
                    if (emitter.closure) {
                        writer.writeLn("this[" + J2ME.quote(fieldInfo.mangledName) + "] = " + defaultValue + ";");
                    }
                    else {
                        writer.writeLn("this." + fieldInfo.mangledName + " = " + defaultValue + ";");
                    }
                }
            }
        }
        if (emitter.definitions) {
            emitFields(classInfo.fields, false);
            emitFields(classInfo.fields, true);
            return;
        }
        // Emit class initializer.
        writer.enter("function " + mangledClassName + "() {");
        //
        // Should we or should we not generate hash codes at this point? Eager or lazy, we should at least
        // initialize it zero to keep object shapes fixed.
        // writer.writeLn("this._hashCode = $.nextHashCode(this);");
        writer.writeLn("this._hashCode = 0;");
        getClassInheritanceChain(classInfo).forEach(function (ci) {
            emitFields(ci.fields, false);
        });
        writer.leave("}");
        // Emit class static initializer if it has any static fields. We don't emit this for now
        // since it probably doesn't pay off to emit code that only gets executed once.
        if (false && classInfo.fields.some(function (f) { return f.isStatic; })) {
            writer.enter(mangledClassName + ".staticInitializer = function() {");
            emitFields(classInfo.fields, true);
            writer.leave("}");
        }
        if (emitter.klassHeaderOnly) {
            return;
        }
        if (emitter.closure) {
            writer.writeLn("window[" + J2ME.quote(mangledClassName) + "] = " + mangledClassName + ";");
        }
    }
    J2ME.emitKlass = emitKlass;
    function classNameWithDots(classInfo) {
        return classInfo.className.replace(/\//g, '.');
    }
    function emitReferencedSymbols(emitter, classInfo, compiledMethods) {
        var referencedClasses = [];
        for (var i = 0; i < compiledMethods.length; i++) {
            var compiledMethod = compiledMethods[i];
            compiledMethod.referencedClasses.forEach(function (classInfo) {
                J2ME.ArrayUtilities.pushUnique(referencedClasses, classInfo);
            });
        }
        var mangledClassName = J2ME.mangleClass(classInfo);
        emitter.writer.writeLn(mangledClassName + ".classSymbols = [" + referencedClasses.map(function (classInfo) {
            return J2ME.quote(classInfo.className);
        }).join(", ") + "];");
    }
    J2ME.emitReferencedSymbols = emitReferencedSymbols;
    function compileClassInfo(emitter, classInfo, methodFilter, ctx) {
        var writer = emitter.writer;
        var mangledClassName = J2ME.mangleClass(classInfo);
        if (!J2ME.C4.Backend.isIdentifierName(mangledClassName)) {
            mangledClassName = J2ME.quote(mangledClassName);
        }
        var classNameParts;
        if (emitter.definitions) {
            classNameParts = classInfo.className.split("/");
            if (classNameParts.length > 1) {
                writer.enter("module " + classNameParts.slice(0, classNameParts.length - 1).join(".") + " {");
            }
            var classOrInterfaceString = classInfo.isInterface ? "interface" : "class";
            var extendsString = classInfo.superClass ? " extends " + classNameWithDots(classInfo.superClass) : "";
            if (classInfo.isInterface) {
                extendsString = "";
            }
            // var implementsString = classInfo.interfaces.length ? " implements " + classInfo.interfaces.map(i => classNameWithDots(i)).join(", ") : "";
            var implementsString = "";
            writer.enter("export " + classOrInterfaceString + " " + classNameParts[classNameParts.length - 1] + extendsString + implementsString + " {");
        }
        emitKlass(emitter, classInfo);
        var methods = classInfo.methods;
        var compiledMethods = [];
        for (var i = 0; i < methods.length; i++) {
            var method = methods[i];
            if (method.isNative) {
                continue;
            }
            if (!methodFilter(method)) {
                continue;
            }
            var mangledMethodName = J2ME.mangleMethod(method);
            if (!J2ME.C4.Backend.isIdentifierName(mangledMethodName)) {
                mangledMethodName = J2ME.quote(mangledMethodName);
            }
            if (emitter.definitions) {
                emitMethodDefinition(emitter, method);
                continue;
            }
            try {
                var mangledClassAndMethodName = J2ME.mangleClassAndMethod(method);
                if (emitter.debugInfo) {
                    writer.writeLn("// " + classInfo.className + "/" + method.name + " " + method.signature + " (" + mangledClassAndMethodName + ") " + method.getSourceLocationForPC(0));
                }
                var compiledMethod = undefined;
                try {
                    compiledMethod = J2ME.compileMethodInfo(method, ctx, 2 /* Static */);
                }
                catch (e) {
                    writer.writeLn("// " + e.toString());
                }
                if (compiledMethod && compiledMethod.body) {
                    var compiledMethodName = mangledClassAndMethodName;
                    if (method.isSynchronized) {
                        compiledMethodName = "_" + mangledClassAndMethodName + "_";
                        // Emit Synchronization Wrapper
                        var lockObject = method.isStatic ? "$." + J2ME.mangleClass(method.classInfo) : "this";
                        var me = "$ME(" + lockObject + "); if (U) return;"; // We may need to unwind after a monitorEnter.
                        var mx = "$MX(" + lockObject + ");";
                        writer.writeLn("// Synchronization Wrapper");
                        writer.enter("function " + mangledClassAndMethodName + "(" + compiledMethod.args.join(",") + ") {");
                        writer.enter("try {");
                        writer.writeLn(me);
                        if (method.isStatic) {
                            writer.writeLn("var r = " + compiledMethodName + "(" + compiledMethod.args.join(",") + ");");
                        }
                        else {
                            if (compiledMethod.args.length > 0) {
                                writer.writeLn("var r = " + compiledMethodName + ".call(this, " + compiledMethod.args.join(",") + ");");
                            }
                            else {
                                writer.writeLn("var r = " + compiledMethodName + ".call(this);");
                            }
                        }
                        writer.writeLn(mx);
                        writer.writeLn("return r;");
                        writer.leave("} catch (e) { " + mx + " throw e; }");
                        writer.leave("}");
                    }
                    writer.enter("function " + compiledMethodName + "(" + compiledMethod.args.join(",") + ") {");
                    writer.writeLns(compiledMethod.body);
                    writer.leave("}");
                    if (method.name === "<clinit>") {
                        writer.writeLn(mangledClassName + ".staticConstructor = " + mangledClassAndMethodName);
                    }
                    else if (!method.isStatic) {
                        //if (emitter.closure) {
                        //  writer.writeLn(mangledClassName + ".prototype[" + quote(mangledMethodName) + "] = " + mangledClassAndMethodName + ";");
                        //} else {
                        //  writer.writeLn(mangledClassName + ".prototype." + mangledMethodName + " = " + mangledClassAndMethodName + ";");
                        //}
                        if (emitter.closure) {
                            writer.writeLn("window[" + J2ME.quote(mangledClassAndMethodName) + "] = " + mangledClassAndMethodName + ";");
                        }
                    }
                    compiledMethods.push(compiledMethod);
                }
            }
            catch (x) {
                J2ME.stderrWriter.writeLn("XXXX: " + x);
                J2ME.stderrWriter.writeLn(x.stack);
            }
        }
        emitReferencedSymbols(emitter, classInfo, compiledMethods);
        if (emitter.definitions) {
            if (classNameParts.length > 1) {
                writer.leave("}");
            }
            writer.leave("}");
        }
        return compiledMethods;
    }
    function compile(jvm, jarFilter, classFilter, methodFilter, fileFilter, debugInfo, tsDefinitions) {
        var runtime = new J2ME.Runtime(jvm);
        var jarFiles = J2ME.CLASSES.jarFiles;
        var ctx = new J2ME.Context(runtime);
        var code = "";
        var writer = new J2ME.IndentingWriter(false, function (s) {
            code += s + "\n";
        });
        var emitter = new Emitter(writer, false, debugInfo, false, tsDefinitions);
        var compiledMethods = [];
        var classInfoList = [];
        Object.keys(jarFiles).every(function (path) {
            if (path.substr(-4) !== ".jar" || !jarFilter(path)) {
                return true;
            }
            var zipFile = jarFiles[path];
            Object.keys(zipFile.directory).every(function (fileName) {
                if (fileName.substr(-6) !== '.class') {
                    return true;
                }
                try {
                    var className = fileName.substring(0, fileName.length - 6);
                    var classInfo = J2ME.CLASSES.getClass(className);
                    if (classInfo.sourceFile && !classInfo.sourceFile.match(fileFilter)) {
                        return true;
                    }
                    if (!classFilter(classInfo)) {
                        return true;
                    }
                    classInfoList.push(classInfo);
                }
                catch (e) {
                    J2ME.stderrWriter.writeLn(e);
                }
                return true;
            }.bind(this));
            return true;
        }.bind(this));
        var orderedClassInfoList = [];
        function hasDependencies(list, classInfo) {
            var superClass = classInfo.superClass;
            if (!superClass && classInfo.interfaces.length === 0) {
                return false;
            }
            for (var i = 0; i < list.length; i++) {
                if (list[i].className === superClass.className) {
                    return true;
                }
            }
            for (var j = 0; j < classInfo.interfaces; j++) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].className === classInfo.interfaces[j].className) {
                        return true;
                    }
                }
            }
            return false;
        }
        while (classInfoList.length) {
            for (var i = 0; i < classInfoList.length; i++) {
                var classInfo = classInfoList[i];
                if (!hasDependencies(classInfoList, classInfo)) {
                    orderedClassInfoList.push(classInfo);
                    classInfoList.splice(i--, 1);
                    break;
                }
            }
        }
        for (var i = 0; i < orderedClassInfoList.length; i++) {
            var classInfo = orderedClassInfoList[i];
            if (emitter.debugInfo) {
                writer.writeLn("// " + classInfo.className + (classInfo.superClass ? " extends " + classInfo.superClass.className : ""));
            }
            // Don't compile interfaces.
            if (classInfo.isInterface) {
                continue;
            }
            J2ME.ArrayUtilities.pushMany(compiledMethods, compileClassInfo(emitter, classInfo, methodFilter, ctx));
        }
        J2ME.stdoutWriter.writeLn(code);
    }
    J2ME.compile = compile;
})(J2ME || (J2ME = {}));
// Basics
///<reference path='utilities.ts' />
//# sourceMappingURL=j2me.js.map