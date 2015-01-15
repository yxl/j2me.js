module J2ME {
  declare var util;
  export class Reader {
    view: DataView;
    // DataView is not optimized, use Uint8Array for the fast paths.
    u8: Uint8Array;
    offset: number;

    static arrays: string [][] = Reader.makeArrays(128);

    private static makeArrays(length) {
      var arrays = [];
      for (var i = 0; i < length; i ++) {
        arrays.push(new Array(i));
      }
      return arrays;
    }

    static getArray(length: number) {
      return Reader.arrays[length];
    }

    constructor(buffer: ArrayBuffer, offset: number = 0) {
      this.view = new DataView(buffer);
      this.u8 = new Uint8Array(buffer);
      this.offset = offset;
    }

    read8() {
      return this.u8[this.offset++];
    }

    read16() {
      var u8 = this.u8;
      var o = this.offset;
      this.offset += 2;
      return u8[o] << 8 | u8[o + 1];
    }

    read32() {
      return this.readInteger() >>> 0;
    }

    readInteger() {
      var o = this.offset;
      var u8 = this.u8;
      var a = u8[o + 0];
      var b = u8[o + 1];
      var c = u8[o + 2];
      var d = u8[o + 3];
      this.offset = o + 4;
      return (a << 24) | (b << 16) | (c << 8) | d;
    }

    readFloat() {
      var data = this.view.getFloat32(this.offset, false);
      this.offset += 4;
      return data;
    }

    readDouble() {
      var data = this.view.getFloat64(this.offset, false);
      this.offset += 8;
      return data;
    }

    readStringFast(length: number): string {
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
        } else if (x <= 0xdf) {
          // The null code point ('\u0000') and code points in the range '\u0080'
          // to '\u07FF' are represented by a pair of bytes x and y.
          var y = u8[o++]
          a[j++] = String.fromCharCode(((x & 0x1f) << 6) + (y & 0x3f));
        } else {
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
    }

    readString(length) {
      if (length === 1) {
        var c = this.u8[this.offset];
        if (c <= 0x7f) {
          this.offset ++;
          return String.fromCharCode(c);
        }
      } else if (length < 128) {
        return this.readStringFast(length);
      }
      return this.readStringSlow(length);
    }

    readStringSlow(length) {
      // NB: no need to create a new slice.
      var data = new Uint8Array(this.view.buffer, this.offset, length);
      this.offset += length;

      // First try w/ TextDecoder, fallback to manually parsing if there was an
      // error. This will handle parsing errors resulting from Java's modified
      // UTF-8 implementation.
      try {
        var s = util.decodeUtf8Array(data);
        return s;
      } catch (e) {
        return util.javaUTF8Decode(data);
      }
    }

    readBytes(length) {
      var data = this.u8.buffer.slice(this.offset, this.offset + length);
      this.offset += length;
      return data;
    }
  }
}
