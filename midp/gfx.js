/* -*- Mode: Java; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*- */
/* vim: set shiftwidth=4 tabstop=4 autoindent cindent expandtab: */

'use strict';

var currentlyFocusedTextEditor;
(function(Native) {

    var NativeDisplay = function() {
        this.fullScreen = 1;
    };

    var NativeDisplays = {
        get: function(id) {
            var d = this._map.get(id);
            if (!d) {
                d = new NativeDisplay();
                this._map.set(id, d);
            }
            return d;
        },

        _map: new Map()
    };

    function setFullScreen(isFullScreen) {
        var sidebar = document.getElementById("sidebar");
        var header = document.getElementById("drawer").querySelector("header");
        var canvas = MIDP.Context2D.canvas;
        sidebar.style.display = header.style.display =
            isFullScreen ? "none" : "block";
        var headerHeight = isFullScreen ? 0 : header.offsetHeight;
        canvas.height = MIDP.ScreenHeight - headerHeight;
        canvas.dispatchEvent(new Event('canvasresize'));
    }

    Native["com/sun/midp/lcdui/DisplayDeviceContainer.getDisplayDevicesIds0.()[I"] = function() {
        var ids = util.newPrimitiveArray("I", 1);
        ids[0] = 1;
        return ids;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.getDisplayName0.(I)Ljava/lang/String;"] = function(id) {
        return null;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.isDisplayPrimary0.(I)Z"] = function(id) {
        console.warn("DisplayDevice.isDisplayPrimary0.(I)Z not implemented (" + id + ")");
        return 1;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.isbuildInDisplay0.(I)Z"] = function(id) {
        return 1;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.getDisplayCapabilities0.(I)I"] = function(id) {
        return 0x3ff;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.isDisplayPenSupported0.(I)Z"] = function(id) {
        return 1;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.isDisplayPenMotionSupported0.(I)Z"] = function(id) {
        return 1;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.getReverseOrientation0.(I)Z"] = function(id) {
        return 0;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.getScreenWidth0.(I)I"] = function(id) {
        return MIDP.Context2D.canvas.width;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.getScreenHeight0.(I)I"] = function(id) {
        return MIDP.Context2D.canvas.height;
    };

    Native["com/sun/midp/lcdui/DisplayDevice.displayStateChanged0.(II)V"] = function(hardwareId, state) {
        console.warn("DisplayDevice.displayStateChanged0.(II)V not implemented (" + hardwareId + ", " + state + ")");
    };

    Native["com/sun/midp/lcdui/DisplayDevice.setFullScreen0.(IIZ)V"] = function(hardwareId, displayId, mode) {
        var d = NativeDisplays.get(displayId);
        d.fullScreen = mode;
        if (MIDP.displayId === displayId) {
            setFullScreen(mode);
        }
    };

    Native["com/sun/midp/lcdui/DisplayDevice.gainedForeground0.(II)V"] = function(hardwareId, displayId) {
        document.getElementById("splash-screen").style.display = "none";
        var d = NativeDisplays.get(displayId);
        setFullScreen(d.fullScreen);
    };

    Native["com/sun/midp/lcdui/DisplayDeviceAccess.vibrate0.(IZ)Z"] = function(displayId, on) {
        return 1;
    };

    Native["com/sun/midp/lcdui/DisplayDeviceAccess.isBacklightSupported0.(I)Z"] = function(displayId) {
        return 1;
    };


    Native["com/sun/midp/lcdui/DisplayDevice.refresh0.(IIIIII)V"] =
        UnimplementedNative("com/sun/midp/lcdui/DisplayDevice.refresh0.(IIIIII)V");

    function swapRB(pixel) {
        return (pixel & 0xff00ff00) | ((pixel >> 16) & 0xff) | ((pixel & 0xff) << 16);
    }

    function swapRBAndSetAlpha(pixel) {
        return swapRB(pixel) | 0xff000000;
    }

    function ABGRToARGB(abgrData, argbData, width, height, offset, scanlength) {
        var i = 0;
        for (var y = 0; y < height; y++) {
            var j = offset + y * scanlength;

            for (var x = 0; x < width; x++) {
                argbData[j++] = swapRB(abgrData[i++]);
            }
        }
    }

    function ABGRToARGB4444(abgrData, argbData, width, height, offset, scanlength) {
        var i = 0;
        for (var y = 0; y < height; y++) {
            var j = offset + y * scanlength;

            for (var x = 0; x < width; x++) {
                var abgr = abgrData[i++];
                argbData[j++] = (abgr & 0xF0000000) >>> 16 |
                                (abgr & 0x000000F0) << 4 |
                                (abgr & 0x0000F000) >> 8 |
                                (abgr & 0x00F00000) >>> 20;
            }
        }
    }

    function ABGRToRGB565(abgrData, rgbData, width, height, offset, scanlength) {
        var i = 0;
        for (var y = 0; y < height; y++) {
            var j = offset + y * scanlength;

            for (var x = 0; x < width; x++) {
                var abgr = abgrData[i++];
                rgbData[j++] = (abgr & 0b000000000000000011111000) << 8 |
                               (abgr & 0b000000001111110000000000) >>> 5 |
                               (abgr & 0b111110000000000000000000) >>> 19;
            }
        }
    }

    function ARGBToABGR(argbData, abgrData, width, height, offset, scanlength) {
        var i = 0;
        for (var y = 0; y < height; ++y) {
            var j = offset + y * scanlength;

            for (var x = 0; x < width; ++x) {
                abgrData[i++] = swapRB(argbData[j++]);
            }
        }
    }

    function ARGBTo1BGR(argbData, abgrData, width, height, offset, scanlength) {
        var i = 0;
        for (var y = 0; y < height; ++y) {
            var j = offset + y * scanlength;

            for (var x = 0; x < width; ++x) {
                abgrData[i++] = swapRB(argbData[j++]) | 0xFF000000;
            }
        }
    }

    function ARGB4444ToABGR(argbData, abgrData, width, height, offset, scanlength) {
        var i = 0;
        for (var y = 0; y < height; ++y) {
            var j = offset + y * scanlength;

            for (var x = 0; x < width; ++x) {
                var argb = argbData[j++];
                abgrData[i++] = (argb & 0xF000) << 16 |
                                (argb & 0x0F00) >>> 4 |
                                (argb & 0x00F0) << 8 |
                                (argb & 0x000F) << 20;
            }
        }
    }

    function createContext2d(width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas.getContext("2d");
    }

    function setImageData(imageData, width, height, data) {
        imageData.klass.classInfo.getField("I.width.I").set(imageData, width);
        imageData.klass.classInfo.getField("I.height.I").set(imageData, height);
        imageData.context = data;
    }

    Native["javax/microedition/lcdui/ImageDataFactory.createImmutableImageDecodeImage.(Ljavax/microedition/lcdui/ImageData;[BII)V"] =
    function(imageData, bytes, offset, length) {
        var ctx = $.ctx;
        asyncImpl("V", new Promise(function(resolve, reject) {
            var blob = new Blob([bytes.subarray(offset, offset + length)], { type: "image/png" });
            var img = new Image();
            img.src = URL.createObjectURL(blob);
            img.onload = function() {
                var context = createContext2d(img.naturalWidth, img.naturalHeight);
                context.drawImage(img, 0, 0);
                setImageData(imageData, img.naturalWidth, img.naturalHeight, context);

                URL.revokeObjectURL(img.src);
                resolve();
            }
            img.onerror = function(e) {
               URL.revokeObjectURL(img.src);
               ctx.setAsCurrentContext();
               reject($.newIllegalArgumentException("error decoding image"));
            }
        }));
    };

    Native["javax/microedition/lcdui/ImageDataFactory.createImmutableImageDataRegion.(Ljavax/microedition/lcdui/ImageData;Ljavax/microedition/lcdui/ImageData;IIIIIZ)V"] =
    function(dataDest, dataSource, x, y, width, height, transform, isMutable) {
        var context = createContext2d(width, height);

        if (transform === TRANS_MIRROR || transform === TRANS_MIRROR_ROT180) {
            context.scale(-1, 1);
        } else if (transform === TRANS_MIRROR_ROT90 || transform === TRANS_MIRROR_ROT270) {
            context.scale(1, -1);
        } else if (transform === TRANS_ROT90 || transform === TRANS_MIRROR_ROT90) {
            context.rotate(Math.PI / 2);
        } else if (transform === TRANS_ROT180 || transform === TRANS_MIRROR_ROT180) {
            context.rotate(Math.PI);
        } else if (transform === TRANS_ROT270 || transform === TRANS_MIRROR_ROT270) {
            context.rotate(1.5 * Math.PI);
        }

        var imgdata = dataSource.context.getImageData(x, y, width, height);
        context.putImageData(imgdata, 0, 0);

        setImageData(dataDest, width, height, context);
        dataDest.klass.classInfo.getField("I.isMutable.Z").set(dataDest, isMutable);
    };

    Native["javax/microedition/lcdui/ImageDataFactory.createImmutableImageDataCopy.(Ljavax/microedition/lcdui/ImageData;Ljavax/microedition/lcdui/ImageData;)V"] =
    function(dest, source) {
        var srcCanvas = source.context.canvas;

        var context = createContext2d(srcCanvas.width, srcCanvas.height);
        context.drawImage(srcCanvas, 0, 0);
        setImageData(dest, srcCanvas.width, srcCanvas.height, context);
    };

    Native["javax/microedition/lcdui/ImageDataFactory.createMutableImageData.(Ljavax/microedition/lcdui/ImageData;II)V"] =
    function(imageData, width, height) {
        var context = createContext2d(width, height);
        context.fillStyle = "rgb(255,255,255)"; // white
        context.fillRect(0, 0, width, height);
        setImageData(imageData, width, height, context);
    };

    Native["javax/microedition/lcdui/ImageDataFactory.createImmutableImageDecodeRGBImage.(Ljavax/microedition/lcdui/ImageData;[IIIZ)V"] =
    function(imageData, rgbData, width, height, processAlpha) {
        var context = createContext2d(width, height);
        var ctxImageData = context.createImageData(width, height);
        var abgrData = new Int32Array(ctxImageData.data.buffer);

        var converterFunc = processAlpha ? ARGBToABGR : ARGBTo1BGR;
        converterFunc(rgbData, abgrData, width, height, 0, width);

        context.putImageData(ctxImageData, 0, 0);

        setImageData(imageData, width, height, context);
    };

    Native["javax/microedition/lcdui/ImageData.getRGB.([IIIIIII)V"] = function(rgbData, offset, scanlength, x, y, width, height) {
        var abgrData = new Int32Array(this.context.getImageData(x, y, width, height).data.buffer);
        ABGRToARGB(abgrData, rgbData, width, height, offset, scanlength);
    };

    Native["com/nokia/mid/ui/DirectUtils.makeMutable.(Ljavax/microedition/lcdui/Image;)V"] = function(image) {
        var imageData = image.klass.classInfo.getField("I.imageData.Ljavax/microedition/lcdui/ImageData;").get(image);
        imageData.klass.classInfo.getField("I.isMutable.Z").set(imageData, 1);
    };

    Native["com/nokia/mid/ui/DirectUtils.setPixels.(Ljavax/microedition/lcdui/Image;I)V"] = function(image, argb) {
        var width = image.klass.classInfo.getField("I.width.I").get(image);
        var height = image.klass.classInfo.getField("I.height.I").get(image);
        var imageData = image.klass.classInfo.getField("I.imageData.Ljavax/microedition/lcdui/ImageData;").get(image);

        var ctx = createContext2d(width, height);
        setImageData(imageData, width, height, ctx);

        var ctxImageData = ctx.createImageData(width, height);
        var pixels = new Int32Array(ctxImageData.data.buffer);

        var color = swapRB(argb);

        var i = 0;
        for (var y = 0; y < height; ++y) {
            for (var x = 0; x < width; ++x) {
                pixels[i++] = color;
            }
        }

        ctx.putImageData(ctxImageData, 0, 0);
    };

    var FACE_SYSTEM = 0;
    var FACE_MONOSPACE = 32;
    var FACE_PROPORTIONAL = 64;
    var STYLE_PLAIN = 0;
    var STYLE_BOLD = 1;
    var STYLE_ITALIC = 2;
    var STYLE_UNDERLINED = 4;
    var SIZE_SMALL = 8;
    var SIZE_MEDIUM = 0;
    var SIZE_LARGE = 16;

    Native["javax/microedition/lcdui/Font.init.(III)V"] = function(face, style, size) {
        var defaultSize = config.fontSize ? config.fontSize : Math.max(10, (MIDP.Context2D.canvas.height / 35) | 0);
        if (size & SIZE_SMALL)
            size = defaultSize / 1.25;
        else if (size & SIZE_LARGE)
            size = defaultSize * 1.25;
        else
            size = defaultSize;
        size |= 0;

        if (style & STYLE_BOLD)
            style = "bold ";
        else if (style & STYLE_ITALIC)
            style = "italic ";
        else
            style = "";

        if (face & FACE_MONOSPACE)
            face = "monospace";
        else if (face & FACE_PROPORTIONAL)
            face = "sans-serif";
        else
            face = "Arial,Helvetica,sans-serif";

        this.klass.classInfo.getField("I.baseline.I").set(this, size | 0);
        this.klass.classInfo.getField("I.height.I").set(this, (size * 1.3)|0);

        // Note:
        // When a css string, such as ` 10 pt Arial, Helvetica`, is set to
        // MIDP.Context2D.font, it will be formatted to `10 pt Arial,Helvetica`
        // with some spaces removed.
        // We need this css string to have the same format as that of the
        // MIDP.Context2D.font to do comparison in withFont() function.
        this.css = style + size + "pt " + face;
        this.size = size;
        this.style = style;
        this.face = face;
    };

    function calcStringWidth(font, str) {
        var emojiLen = 0;

        withFont(font, MIDP.Context2D);
        var len = measureWidth(MIDP.Context2D, str.replace(emoji.regEx, function() {
            emojiLen += font.size;
            return "";
        }));

        return len + emojiLen;
    }

    Native["javax/microedition/lcdui/Font.stringWidth.(Ljava/lang/String;)I"] = function(str) {
        return calcStringWidth(this, util.fromJavaString(str));
    };

    Native["javax/microedition/lcdui/Font.charWidth.(C)I"] = function(char) {
        withFont(this, MIDP.Context2D);
        return measureWidth(MIDP.Context2D, String.fromCharCode(char));
    };

    Native["javax/microedition/lcdui/Font.charsWidth.([CII)I"] = function(str, offset, len) {
        return calcStringWidth(this, util.fromJavaChars(str).slice(offset, offset + len));
    };

    Native["javax/microedition/lcdui/Font.substringWidth.(Ljava/lang/String;II)I"] = function(str, offset, len) {
        return calcStringWidth(this, util.fromJavaString(str).slice(offset, offset + len));
    };

    var HCENTER = 1;
    var VCENTER = 2;
    var LEFT = 4;
    var RIGHT = 8;
    var TOP = 16;
    var BOTTOM = 32;
    var BASELINE = 64;

    function withGraphics(g) {
        var img = g.klass.classInfo.getField("I.img.Ljavax/microedition/lcdui/Image;").get(g),
            c = null;

        if (img === null) {
            c = MIDP.Context2D;
        } else {
            var imgData = img.klass.classInfo.getField("I.imageData.Ljavax/microedition/lcdui/ImageData;").get(img),
                c = imgData.context;
        }

        return c;
    }

    function withClip(g, c, x, y) {
        var clipped = g.klass.classInfo.getField("I.clipped.Z").get(g),
            transX = g.klass.classInfo.getField("I.transX.I").get(g),
            transY = g.klass.classInfo.getField("I.transY.I").get(g);

        if (clipped) {
            var clipX1 = g.klass.classInfo.getField("I.clipX1.S").get(g),
                clipY1 = g.klass.classInfo.getField("I.clipY1.S").get(g),
                clipX2 = g.klass.classInfo.getField("I.clipX2.S").get(g),
                clipY2 = g.klass.classInfo.getField("I.clipY2.S").get(g);

            c.beginPath();
            c.rect(clipX1, clipY1, clipX2 - clipX1, clipY2 - clipY1);
            c.clip();
        }

        x += transX;
        y += transY;

        return [x, y];
    }

    function withAnchor(g, c, anchor, x, y, w, h) {
        var pair = withClip(g, c, x, y);
        x = pair[0];
        y = pair[1];

        if (anchor & RIGHT) {
            x -= w;
        } else if (anchor & HCENTER) {
            x -= (w >>> 1) | 0;
        }

        if (anchor & BOTTOM) {
            y -= h;
        } else if (anchor & VCENTER) {
            y -= (h >>> 1) | 0;
        }

        return [x, y];
    }

    function measureWidth(c, str) {
        return c.measureText(str).width | 0;
    }

    function withFont(font, c) {
        if (c.font != font.css) {
          c.font = font.css;
        }
    }

    function withTextAnchor(g, c, anchor, x, y, str) {
        withFont(g.klass.classInfo.getField("I.currentFont.Ljavax/microedition/lcdui/Font;").get(g), c);

        c.textAlign = "left";
        c.textBaseline = "top";

        if (anchor & RIGHT || anchor & HCENTER) {
            var w = measureWidth(c, str);

            if (anchor & RIGHT) {
                x -= w;
            } else if (anchor & HCENTER) {
                x -= (w >>> 1) | 0;
            }
        }

        if (anchor & BOTTOM) {
            c.textBaseline = "bottom";
        } else if (anchor & BASELINE) {
            c.textBaseline = "alphabetic";
        } else if (anchor & VCENTER) {
            throw $.newIllegalArgumentException("VCENTER not allowed with text");
        }

        return [x, y];
    }

    function abgrIntToCSS(pixel) {
        var a = (pixel >> 24) & 0xff;
        var b = (pixel >> 16) & 0xff;
        var g = (pixel >> 8) & 0xff;
        var r = pixel & 0xff;
        return "rgba(" + r + "," + g + "," + b + "," + (a/255) + ")";
    };

    function withPixel(g, c) {
        var pixel = g.klass.classInfo.getField("I.pixel.I").get(g);
        c.fillStyle = c.strokeStyle = abgrIntToCSS(pixel);
    }

    /**
     * Like withPixel, but ignores alpha channel, setting the alpha value to 1.
     * Useful when you suspect that the caller is specifying the alpha channel
     * incorrectly, although we should actually figure out why that's happening.
     */
    function withOpaquePixel(g, c) {
        var pixel = g.klass.classInfo.getField("I.pixel.I").get(g);
        var b = (pixel >> 16) & 0xff;
        var g = (pixel >> 8) & 0xff;
        var r = pixel & 0xff;
        var style = "rgba(" + r + "," + g + "," + b + "," + 1 + ")";
        c.fillStyle = c.strokeStyle = style;
    }

    /**
     * create the outline of an elliptical arc
     * covering the specified rectangle.
     * @param x the x-coordinate of the center of the ellipse.
     * @param y y-coordinate of the center of the ellipse.
     * @param rw the horizontal radius of the arc.
     * @param rh the vertical radius of the arc.
     * @param arcStart the beginning angle
     * @param arcEnd the ending angle
     * @param closed if true, draw a closed arc sector.
     */
    function createEllipticalArc(c, x, y, rw, rh, arcStart, arcEnd, closed) {
          c.save();
          c.translate(x, y);
          if (closed) {
            c.moveTo(0, 0);
          }
          // draw circle arc which will be stretched into an oval arc
          c.scale(1, rh / rw);
          c.arc(0, 0, rw, arcStart, arcEnd, false);
          if (closed) {
            c.lineTo(0, 0);
          }
          c.restore();
    }

    /**
     * Create a round rectangle path.
     * @param x the x coordinate of the rectangle
     * @param y the y coordinate of the rectangle
     * @param width the width of the rectangle
     * @param height the height of the rectangle
     * @param arcWidth the horizontal diameter of the arc at the four corners
     * @param arcHeight the vertical diameter of the arc at the four corners
     */
    function createRoundRect(c, x, y, width, height, arcWidth, arcHeight) {
        var rw = arcWidth / 2;
        var rh = arcHeight / 2;
        c.moveTo(x + rw, y);
        c.lineTo(x + width - rw, y);
        createEllipticalArc(c, x + width - rw, y + rh, rw, rh, 1.5 * Math.PI, 2 * Math.PI, false);
        c.lineTo(x + width, y + height - rh);
        createEllipticalArc(c, x + width - rw, y + height - rh, rw, rh, 0, 0.5 * Math.PI, false);
        c.lineTo(x + rw, y + height);
        createEllipticalArc(c, x + rw, y + height - rh, rw, rh, 0.5 * Math.PI, Math.PI, false);
        c.lineTo(x, y + rh);
        createEllipticalArc(c, x + rw, y + rh, rw, rh, Math.PI, 1.5 * Math.PI, false);
    }

    Native["javax/microedition/lcdui/Graphics.getDisplayColor.(I)I"] = function(color) {
        return color;
    };

    Native["javax/microedition/lcdui/Graphics.getPixel.(IIZ)I"] = function(rgb, gray, isGray) {
        return swapRB(rgb) | 0xff000000;
    };

    // DirectGraphics constants
    var TYPE_USHORT_4444_ARGB = 4444;
    var TYPE_USHORT_565_RGB = 565;

    Native["com/nokia/mid/ui/DirectGraphicsImp.setARGBColor.(I)V"] = function(rgba) {
        var g = this.klass.classInfo.getField("I.graphics.Ljavax/microedition/lcdui/Graphics;").get(this);
        var red = (rgba >> 16) & 0xff;
        var green = (rgba >> 8) & 0xff;
        var blue = rgba & 0xff;
        g.klass.classInfo.getField("I.pixel.I").set(g, swapRB(rgba));
        g.klass.classInfo.getField("I.rgbColor.I").set(g, rgba & 0x00ffffff);
        // Conversion matches Graphics#grayVal(int, int, int).
        g.klass.classInfo.getField("I.gray.I").set(g, (red * 76 + green * 150 + blue * 29) >> 8);
    };

    Native["com/nokia/mid/ui/DirectGraphicsImp.getAlphaComponent.()I"] = function() {
        var g = this.klass.classInfo.getField("I.graphics.Ljavax/microedition/lcdui/Graphics;").get(this);
        var pixel = g.klass.classInfo.getField("I.pixel.I").get(g);
        return (pixel >> 24) & 0xff;
    };

    Native["com/nokia/mid/ui/DirectGraphicsImp.getPixels.([SIIIIIII)V"] =
    function(pixels, offset, scanlength, x, y, width, height, format) {
        if (pixels == null) {
            throw $.newNullPointerException("Pixels array is null");
        }

        var converterFunc = null;
        if (format == TYPE_USHORT_4444_ARGB) {
            converterFunc = ABGRToARGB4444;
        } else if (format == TYPE_USHORT_565_RGB) {
            converterFunc = ABGRToRGB565;
        } else {
            throw $.newIllegalArgumentException("Format unsupported");
        }

        var graphics = this.klass.classInfo.getField("I.graphics.Ljavax/microedition/lcdui/Graphics;").get(this);
        var image = graphics.klass.classInfo.getField("I.img.Ljavax/microedition/lcdui/Image;").get(graphics);
        if (!image) {
            throw $.newIllegalArgumentException("getPixels with no image not yet supported");
        }
        var imageData = image.klass.classInfo.getField("I.imageData.Ljavax/microedition/lcdui/ImageData;").get(image);

        var abgrData = new Int32Array(imageData.context.getImageData(x, y, width, height).data.buffer);
        converterFunc(abgrData, pixels, width, height, offset, scanlength);
    };

    Native["com/nokia/mid/ui/DirectGraphicsImp.drawPixels.([SZIIIIIIII)V"] =
    function(pixels, transparency, offset, scanlength, x, y, width, height, manipulation, format) {
        if (pixels == null) {
            throw $.newNullPointerException("Pixels array is null");
        }

        var converterFunc = null;
        if (format == TYPE_USHORT_4444_ARGB && transparency && !manipulation) {
            converterFunc = ARGB4444ToABGR;
        } else {
            throw $.newIllegalArgumentException("Format unsupported");
        }

        var graphics = this.klass.classInfo.getField("I.graphics.Ljavax/microedition/lcdui/Graphics;").get(this);

        var context = createContext2d(width, height);
        var imageData = context.createImageData(width, height);
        var abgrData = new Int32Array(imageData.data.buffer);

        converterFunc(pixels, abgrData, width, height, offset, scanlength);

        context.putImageData(imageData, 0, 0);

        var c = withGraphics(graphics);
        c.save();

        var pair = withClip(graphics, c, x, y);
        x = pair[0];
        y = pair[1];

        c.drawImage(context.canvas, x, y);

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.render.(Ljavax/microedition/lcdui/Image;III)Z"] = function(image, x, y, anchor) {
        var texture = image.klass.classInfo.getField("I.imageData.Ljavax/microedition/lcdui/ImageData;").get(image)
                                 .context.canvas;

        var c = withGraphics(this);
        c.save();

        var pair = withAnchor(this, c, anchor, x, y, texture.width, texture.height);
        x = pair[0];
        y = pair[1];

        c.drawImage(texture, x, y);

        c.restore();

        return 1;
    };

    function parseEmojiString(str) {
        var parts = [];

        var match;
        var lastIndex = 0;
        emoji.regEx.lastIndex = 0;
        while (match = emoji.regEx.exec(str)) {
            parts.push({ text: str.substring(lastIndex, match.index), emoji: match[0] });
            lastIndex = match.index + match[0].length;
        }

        parts.push({ text: str.substring(lastIndex), emoji: null });

        return parts;
    }

    function drawString(g, str, x, y, anchor, isOpaque) {
        var font = g.klass.classInfo.getField("I.currentFont.Ljavax/microedition/lcdui/Font;").get(g);

        var c = withGraphics(g);
        c.save();

        var pair = withClip(g, c, x, y);
        x = pair[0];
        y = pair[1];

        parseEmojiString(str).forEach(function(part) {
            if (part.text) {
                var pair = withTextAnchor(g, c, anchor, x, y, part.text);
                var textX = pair[0];
                var textY = pair[1];

                if (isOpaque) {
                    withOpaquePixel(g, c);
                } else {
                    withPixel(g, c);
                }

                c.fillText(part.text, textX, textY);

                // If there are emojis in the string that we need to draw,
                // we need to calculate the string width
                if (part.emoji) {
                    x += measureWidth(c, part.text)
                }
            }

            if (part.emoji) {
                var emojiData = emoji.getData(part.emoji, font.size);
                c.drawImage(emojiData.img, emojiData.x, 0, emoji.squareSize, emoji.squareSize, x, y, font.size, font.size);
                x += font.size;
            }
        });

        c.restore();
    }

    Native["javax/microedition/lcdui/Graphics.drawString.(Ljava/lang/String;III)V"] = function(str, x, y, anchor) {
        drawString(this, util.fromJavaString(str), x, y, anchor, true);
    };

    Native["javax/microedition/lcdui/Graphics.drawSubstring.(Ljava/lang/String;IIIII)V"] = 
    function(str, offset, len, x, y, anchor) {
        drawString(this, util.fromJavaString(str).substr(offset, len), x, y, anchor, false);
    };

    Native["javax/microedition/lcdui/Graphics.drawChars.([CIIIII)V"] = function(data, offset, len, x, y, anchor) {
        drawString(this, util.fromJavaChars(data, offset, len), x, y, anchor, false);
    };

    Native["javax/microedition/lcdui/Graphics.drawChar.(CIII)V"] = function(jChr, x, y, anchor) {
        var chr = String.fromCharCode(jChr);

        var c = withGraphics(this);
        c.save();

        var pair = withClip(this, c, x, y);
        x = pair[0];
        y = pair[1];

        pair = withTextAnchor(this, c, anchor, x, y, chr), x = pair[0], y = pair[1];

        withPixel(this, c);

        c.fillText(chr, x, y);

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.fillTriangle.(IIIIII)V"] = function(x1, y1, x2, y2, x3, y3) {
        var c = withGraphics(this);
        c.save();

        var pair = withClip(this, c, x1, y1);
        var x = pair[0];
        var y = pair[1];

        withPixel(this, c);

        var dx1 = (x2 - x1) || 1;
        var dy1 = (y2 - y1) || 1;
        var dx2 = (x3 - x1) || 1;
        var dy2 = (y3 - y1) || 1;

        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + dx1, y + dy1);
        c.lineTo(x + dx2, y + dy2);
        c.closePath();
        c.fill();

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.drawRect.(IIII)V"] = function(x, y, w, h) {
        if (w < 0 || h < 0) {
            return;
        }

        var c = withGraphics(this);
        c.save();

        var pair = withClip(this, c, x, y);
        x = pair[0];
        y = pair[1];

        withPixel(this, c);

        w = w || 1;
        h = h || 1;

        c.strokeRect(x, y, w, h);

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.drawRoundRect.(IIIIII)V"] = function(x, y, w, h, arcWidth, arcHeight) {
        if (w < 0 || h < 0) {
            return;
        }

        var c = withGraphics(this);
        c.save();

        var pair = withClip(this, c, x, y);
        x = pair[0];
        y = pair[1];

        withPixel(this, c);

        w = w || 1;
        h = h || 1;

        c.beginPath();
        createRoundRect(c, x, y, w, h, arcWidth, arcHeight);
        c.stroke();

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.fillRect.(IIII)V"] = function(x, y, w, h) {
        if (w <= 0 || h <= 0) {
            return;
        }

        var c = withGraphics(this);
        c.save();

        var pair = withClip(this, c, x, y);
        x = pair[0];
        y = pair[1];

        withPixel(this, c);

        w = w || 1;
        h = h || 1;

        c.fillRect(x, y, w, h);

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.fillRoundRect.(IIIIII)V"] = function(x, y, w, h, arcWidth, arcHeight) {
        if (w <= 0 || h <= 0) {
            return;
        }

        var c = withGraphics(this);
        c.save();

        var pair = withClip(this, c, x, y);
        x = pair[0];
        y = pair[1];

        withPixel(this, c);

        w = w || 1;
        h = h || 1;

        c.beginPath();
        createRoundRect(c, x, y, w, h, arcWidth, arcHeight);
        c.fill();

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.drawArc.(IIIIII)V"] = function(x, y, width, height, startAngle, arcAngle) {
        if (width < 0 || height < 0) {
            return;
        }

        var c = withGraphics(this);
        c.save();

        withPixel(this, c);

        var endRad = -startAngle * 0.0175;
        var startRad = endRad - arcAngle * 0.0175;
        c.beginPath();
        createEllipticalArc(c, x, y, width / 2, height / 2, startRad, endRad, false);
        c.stroke();

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.fillArc.(IIIIII)V"] = function(x, y, width, height, startAngle, arcAngle) {
        if (width <= 0 || height <= 0) {
            return;
        }

        var c = withGraphics(this);
        c.save();

        withPixel(this, c);

        var endRad = -startAngle * 0.0175;
        var startRad = endRad - arcAngle * 0.0175;
        c.beginPath();
        c.moveTo(x, y);
        createEllipticalArc(c, x, y, width / 2, height / 2, startRad, endRad, true);
        c.moveTo(x, y);
        c.fill();

        c.restore();
    };

    var TRANS_NONE = 0;
    var TRANS_MIRROR_ROT180 = 1;
    var TRANS_MIRROR = 2;
    var TRANS_ROT180 = 3;
    var TRANS_MIRROR_ROT270 = 4;
    var TRANS_ROT90 = 5;
    var TRANS_ROT270 = 6;
    var TRANS_MIRROR_ROT90 = 7;

    Override["javax/microedition/lcdui/Graphics.drawRegion.(Ljavax/microedition/lcdui/Image;IIIIIIII)V"] =
    function(image, sx, sy, sw, sh, transform, x, y, anchor) {
        if (!image) {
            throw $.newNullPointerException("src image is null");
        }

        var imgData = image.klass.classInfo.getField("I.imageData.Ljavax/microedition/lcdui/ImageData;").get(image),
            texture = imgData.context.canvas;

        var c = withGraphics(this);
        c.save();

        var pair = withAnchor(this, c, anchor, x, y, sw, sh);
        x = pair[0];
        y = pair[1];

        c.translate(x, y);

        if (transform === TRANS_MIRROR || transform === TRANS_MIRROR_ROT180) {
            c.scale(-1, 1);
        } else if (transform === TRANS_MIRROR_ROT90 || transform === TRANS_MIRROR_ROT270) {
            c.scale(1, -1);
        } else if (transform === TRANS_ROT90 || transform === TRANS_MIRROR_ROT90) {
            c.rotate(Math.PI / 2);
        } else if (transform === TRANS_ROT180 || transform === TRANS_MIRROR_ROT180) {
            c.rotate(Math.PI);
        } else if (transform === TRANS_ROT270 || transform === TRANS_MIRROR_ROT270) {
            c.rotate(1.5 * Math.PI);
        }

        c.drawImage(texture, sx, sy, sw, sh, 0, 0, sw, sh);

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.drawLine.(IIII)V"] = function(x1, y1, x2, y2) {
        var c = withGraphics(this);
        c.save();

        var pair = withClip(this, c, x1, y1);
        var x = pair[0];
        var y = pair[1];

        withPixel(this, c);

        var dx = (x2 - x1) || 1;
        var dy = (y2 - y1) || 1;

        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + dx, y + dy);
        c.stroke();
        c.closePath();

        c.restore();
    };

    Native["javax/microedition/lcdui/Graphics.drawRGB.([IIIIIIIZ)V"] =
    function(rgbData, offset, scanlength, x, y, width, height, processAlpha) {
        var context = createContext2d(width, height);
        var imageData = context.createImageData(width, height);
        var abgrData = new Int32Array(imageData.data.buffer);

        var converterFunc = processAlpha ? ARGBToABGR : ARGBTo1BGR;
        converterFunc(rgbData, abgrData, width, height, offset, scanlength);

        context.putImageData(imageData, 0, 0);

        var c = withGraphics(this);
        c.save();

        var pair = withClip(this, c, x, y);
        x = pair[0];
        y = pair[1];

        c.drawImage(context.canvas, x, y);

        c.restore();
    };

    var textEditorId = 0,
        textEditorResolve = null,
        dirtyEditors = [];

    function wakeTextEditorThread(id) {
        dirtyEditors.push(id);
        if (textEditorResolve) {
            textEditorResolve();
            textEditorResolve = null;
        }
    }

    Native["com/nokia/mid/ui/TextEditor.init.(Ljava/lang/String;IIII)I"] =
    function(text, maxSize, constraints, width, height) {
        if (constraints != 0) {
            console.warn("TextEditor.constraints not implemented");
        }

        this.textEditorId = ++textEditorId;
        this.textEditor = TextEditorProvider.createEditor(constraints);
        this.visible = false;
        this.backgroundColor = 0xFFFFFFFF | 0; // opaque white
        this.foregroundColor = 0xFF000000 | 0; // opaque black
        this.textEditor.setStyle("border", "none");
        this.textEditor.setStyle("resize", "none");
        this.textEditor.setStyle("backgroundColor", abgrIntToCSS(this.backgroundColor));
        this.textEditor.setStyle("color", abgrIntToCSS(this.foregroundColor));

        this.getCaretPosition = function() {
            if (this.textEditor.getParent()) {
                return this.textEditor.getSelectionStart().index;
            }
            if (this.caretPosition !== null) {
                return this.caretPosition;
            }
            return 0;
        };

        this.setCaretPosition = function(index) {
            if (this.textEditor.getParent()) {
                this.textEditor.setSelectionRange(index, index);
            } else {
                this.caretPosition = index;
            }
        };

        this.textEditor.setAttribute("maxlength", maxSize);
        this.textEditor.setStyle("width", width + "px");
        this.textEditor.setStyle("height", height + "px");
        this.textEditor.setStyle("position", "absolute");
        this.textEditor.setVisible(false);
        var font = this.klass.classInfo.getField("I.font.Ljavax/microedition/lcdui/Font;").get(this);
        this.textEditor.setFont(font);

        this.textEditor.setContent(util.fromJavaString(text));
        this.setCaretPosition(this.textEditor.getSize());

        this.textEditor.oninput(function(e) {
            wakeTextEditorThread(this.textEditorId);
        }.bind(this));
        return textEditorId;
    };

    Native["com/nokia/mid/ui/CanvasItem.attachNativeImpl.()V"] = function() {
        this.textEditor.setParent(document.getElementById("display"));
        if (this.caretPosition !== null) {
            this.textEditor.setSelectionRange(this.caretPosition, this.caretPosition);
            this.caretPosition = null;
        }
    };

    Native["com/nokia/mid/ui/CanvasItem.detachNativeImpl.()V"] = function() {
        this.caretPosition = this.textEditor.getSelectionStart().index;
        this.textEditor.setParent(null);
    };

    Native["javax/microedition/lcdui/Display.unfocusTextEditorForScreenChange.()V"] = function() {
        if (currentlyFocusedTextEditor) {
            currentlyFocusedTextEditor.blur();
            currentlyFocusedTextEditor = null;
        }
    };

    Native["javax/microedition/lcdui/Display.unfocusTextEditorForAlert.()V"] = function() {
        if (currentlyFocusedTextEditor) {
            currentlyFocusedTextEditor.blur();
        }
    };

    Native["javax/microedition/lcdui/Display.refocusTextEditorAfterAlert.()V"] = function() {
        if (currentlyFocusedTextEditor) {
            currentlyFocusedTextEditor.focus();
        }
    };

    Native["javax/microedition/lcdui/Display.setTitle.(Ljava/lang/String;)V"] = function(title) {
        document.getElementById("display_title").textContent = util.fromJavaString(title);
    };

    Native["com/nokia/mid/ui/CanvasItem.setSize.(II)V"] = function(width, height) {
        this.textEditor.setStyle("width", width + "px");
        this.textEditor.setStyle("height", height + "px");
    };

    Native["com/nokia/mid/ui/CanvasItem.setVisible.(Z)V"] = function(visible) {
        this.textEditor.setVisible(visible ? true : false);
        this.visible = visible;
    };

    Native["com/nokia/mid/ui/CanvasItem.getWidth.()I"] = function() {
        return parseInt(this.textEditor.getStyle("width"));
    };

    Native["com/nokia/mid/ui/CanvasItem.getHeight.()I"] = function() {
        return parseInt(this.textEditor.getStyle("height"));
    };

    Native["com/nokia/mid/ui/CanvasItem.setPosition0.(II)V"] = function(x, y) {
        var top = MIDP.Context2D.canvas.offsetTop;
        this.textEditor.setStyle("left", x + "px");
        this.textEditor.setStyle("top", (top + y) + "px");
    };

    Native["com/nokia/mid/ui/CanvasItem.getPositionX.()I"] = function() {
        return parseInt(this.textEditor.getStyle("left")) || 0;
    };

    Native["com/nokia/mid/ui/CanvasItem.getPositionY.()I"] = function() {
        var base = MIDP.Context2D.canvas.offsetTop;
        return (parseInt(this.textEditor.getStyle("top")) - base) || 0;
    };

    Native["com/nokia/mid/ui/CanvasItem.isVisible.()Z"] = function() {
        return this.visible ? 1 : 0;
    };

    Native["com/nokia/mid/ui/TextEditor.setConstraints.(I)V"] = function(constraints) {
        this.textEditor.setConstraints(constraints);
    };

    Native["com/nokia/mid/ui/TextEditor.getConstraints.()I"] = function() {
        return this.textEditor.getConstraints();
    };

    Native["com/nokia/mid/ui/TextEditor.setFocus.(Z)V"] = function(shouldFocus) {
        if (shouldFocus && (currentlyFocusedTextEditor != this.textEditor)) {
            this.textEditor.focus();
            currentlyFocusedTextEditor = this.textEditor;
        } else if (!shouldFocus && (currentlyFocusedTextEditor == this.textEditor)) {
            this.textEditor.blur();
            currentlyFocusedTextEditor = null;
        }
        this.focused = shouldFocus;
    };

    Native["com/nokia/mid/ui/TextEditor.hasFocus.()Z"] = function() {
        return (this.textEditor == currentlyFocusedTextEditor) ? 1 : 0;
    };

    Native["com/nokia/mid/ui/TextEditor.setCaret.(I)V"] = function(index) {
        if (index < 0 || index > this.textEditor.getSize()) {
            throw $.newStringIndexOutOfBoundsException();
        }

        this.setCaretPosition(index);
    };

    Native["com/nokia/mid/ui/TextEditor.getCaretPosition.()I"] = function() {
        return this.getCaretPosition();
    };

    Native["com/nokia/mid/ui/TextEditor.getBackgroundColor.()I"] = function() {
        return this.backgroundColor;
    };
    Native["com/nokia/mid/ui/TextEditor.getForegroundColor.()I"] = function() {
        return this.foregroundColor;
    };
    Native["com/nokia/mid/ui/TextEditor.setBackgroundColor.(I)V"] = function(backgroundColor) {
        this.backgroundColor = backgroundColor;
        this.textEditor.setStyle("backgroundColor", abgrIntToCSS(backgroundColor));
    };
    Native["com/nokia/mid/ui/TextEditor.setForegroundColor.(I)V"] = function(foregroundColor) {
        this.foregroundColor = foregroundColor;
        this.textEditor.setStyle("color", abgrIntToCSS(foregroundColor));
    };

    Native["com/nokia/mid/ui/TextEditor.getContent.()Ljava/lang/String;"] = function() {
        return J2ME.newString(this.textEditor.getContent());
    };

    Native["com/nokia/mid/ui/TextEditor.setContent.(Ljava/lang/String;)V"] = function(jStr) {
        var str = util.fromJavaString(jStr);
        this.textEditor.setContent(str);
        this.setCaretPosition(this.textEditor.getSize());
    };

    Native["com/nokia/mid/ui/TextEditor.getContentHeight.()I"] = function() {
        return this.textEditor.getContentHeight();
    };

    Native["com/nokia/mid/ui/TextEditor.insert.(Ljava/lang/String;I)V"] = function(jStr, pos) {
        var str = util.fromJavaString(jStr);
        var len = util.toCodePointArray(str).length;
        if (this.textEditor.getSize() + len > this.textEditor.getAttribute("maxlength")) {
            throw $.newIllegalArgumentException();
        }
        this.textEditor.setContent(this.textEditor.getSlice(0, pos) + str + this.textEditor.getSlice(pos));
        this.setCaretPosition(pos + len);
    };

    Native["com/nokia/mid/ui/TextEditor.delete.(II)V"] = function(offset, length) {
        var old = this.textEditor.getContent();

        var size = this.textEditor.getSize();
        if (offset < 0 || offset > size || length < 0 || offset + length > size) {
            throw $.newStringIndexOutOfBoundsException("offset/length invalid");
        }

        this.textEditor.setContent(this.textEditor.getSlice(0, offset) + this.textEditor.getSlice(offset + length));
        this.setCaretPosition(offset);
    };

    Native["com/nokia/mid/ui/TextEditor.getMaxSize.()I"] = function() {
        return parseInt(this.textEditor.getAttribute("maxlength"));
    };

    Native["com/nokia/mid/ui/TextEditor.setMaxSize.(I)I"] = function(maxSize) {
        if (this.textEditor.getSize() > maxSize) {
            var oldCaretPosition = this.getCaretPosition();

            this.textEditor.setContent(this.textEditor.getSlice(0, maxSize));

            if (oldCaretPosition > maxSize) {
                this.setCaretPosition(maxSize);
            }
        }

        this.textEditor.setAttribute("maxlength", maxSize);

        // The return value is the assigned size, which could be less than
        // the size that was requested, although in this case we always set it
        // to the requested size.
        return maxSize;
    };

    Native["com/nokia/mid/ui/TextEditor.size.()I"] = function() {
        return this.textEditor.getSize();
    };

    Native["com/nokia/mid/ui/TextEditor.setFont.(Ljavax/microedition/lcdui/Font;)V"] = function(font) {
        this.klass.classInfo.getField("I.font.Ljavax/microedition/lcdui/Font;").set(this, font);
        this.textEditor.setFont(font);
    };

    Native["com/nokia/mid/ui/TextEditorThread.sleep.()V"] = function() {
        asyncImpl("V", new Promise(function(resolve, reject) {
          if (!dirtyEditors.length) {
              textEditorResolve = resolve;
          } else {
              resolve();
          }
        }));
    };

    Native["com/nokia/mid/ui/TextEditorThread.getNextDirtyEditor.()I"] = function() {
        if (!dirtyEditors.length) {
            console.error("ERROR: getNextDirtyEditor called but no dirty editors");
            return 0;
        }

        return dirtyEditors.shift();
    };

    var initialWindowHeight = window.innerHeight;
    var isVKVisible = false;
    var keyboardHeight = 0;
    var pendingShowNotify = false;
    var pendingHideNotify = false;
    var keyboardVisibilityListenerResolve;
    window.addEventListener("resize", function(evt) {
        if (window.innerHeight < initialWindowHeight) {
            if (isVKVisible) {
                console.warn("Window shrunk but we thought the keyboard was already visible!");
            }
            isVKVisible = true;
            keyboardHeight = initialWindowHeight - window.innerHeight;
            if (pendingHideNotify) {
                pendingHideNotify = false;
                return;
            } else if (keyboardVisibilityListenerResolve) {
                keyboardVisibilityListenerResolve(1);
                keyboardVisibilityListenerResolve = null;
            } else {
                pendingShowNotify = true;
            }
        } else if (window.innerHeight >= initialWindowHeight) {
            if (window.innerHeight > initialWindowHeight) {
                console.warn("Window grew beyond initial size!");
                initialWindowHeight = window.innerHeight;
            }
            if (!isVKVisible) {
                console.warn("Window grew but we thought the keyboard was already hidden!");
            }
            isVKVisible = false;
            keyboardHeight = 0;
            if (pendingShowNotify) {
                pendingShowNotify = false;
                return;
            } else if (keyboardVisibilityListenerResolve) {
                keyboardVisibilityListenerResolve(0);
                keyboardVisibilityListenerResolve = null;
            } else {
                pendingHideNotify = true;
            }
        }
    });

    Native["com/nokia/mid/ui/VirtualKeyboard.isVisible.()Z"] = function() {
        return isVKVisible ? 1 : 0;
    };

    Native["com/nokia/mid/ui/VirtualKeyboard.getXPosition.()I"] = function() {
        return 0;
    };

    Native["com/nokia/mid/ui/VirtualKeyboard.getYPosition.()I"] = function() {
        // We should return the number of pixels between the top of the
        // screen and the top of the keyboard
        return window.innerHeight;
    };

    Native["com/nokia/mid/ui/VirtualKeyboard.getWidth.()I"] = function() {
        return window.innerWidth;
    };

    Native["com/nokia/mid/ui/VirtualKeyboard.getHeight.()I"] = function() {
        return keyboardHeight;
    };

    Native["com/nokia/mid/ui/VKVisibilityNotificationRunnable.sleepUntilVKVisibilityChange.()Z"] = function() {
        asyncImpl("Z", new Promise(function(resolve, reject) {
            if (pendingShowNotify) {
                resolve(1);
                pendingShowNotify = false;
            } else if (pendingHideNotify) {
                resolve(0);
                pendingHideNotify = false;
            } else {
                keyboardVisibilityListenerResolve = resolve;
            }
        }));
    };

    var curDisplayableId = 0;
    var nextMidpDisplayableId = 1;
    var PLAIN = 0;

    Native["javax/microedition/lcdui/DisplayableLFImpl.initialize0.()V"] = function() {
    };

    Native["javax/microedition/lcdui/DisplayableLFImpl.deleteNativeResource0.(I)V"] = function(nativeId) {
        var el = document.getElementById("displayable-" + nativeId);
        if (el) {
            el.parentElement.removeChild(el);
            if (currentlyFocusedTextEditor) {
                currentlyFocusedTextEditor.focus();
            }
        }
    };

    Native["javax/microedition/lcdui/DisplayableLFImpl.setTitle0.(ILjava/lang/String;)V"] = function(nativeId, title) {
        document.getElementById("display_title").textContent = util.fromJavaString(title);
    };

    Native["javax/microedition/lcdui/CanvasLFImpl.createNativeResource0.(Ljava/lang/String;Ljava/lang/String;)I"] = function(title, ticker) {
        console.warn("javax/microedition/lcdui/CanvasLFImpl.createNativeResource0.(Ljava/lang/String;Ljava/lang/String;)I not implemented");
        curDisplayableId = nextMidpDisplayableId++;
        return curDisplayableId;
    };

    Native["javax/microedition/lcdui/AlertLFImpl.createNativeResource0.(Ljava/lang/String;Ljava/lang/String;I)I"] = function(title, ticker, type) {
        var nativeId = nextMidpDisplayableId++;
        var el = document.getElementById("lcdui-alert").cloneNode(true);
        el.id = "displayable-" + nativeId;
        el.querySelector('h1.title').textContent = util.fromJavaString(title);
        document.body.appendChild(el);

        return nativeId;
    };

    Native["javax/microedition/lcdui/AlertLFImpl.setNativeContents0.(ILjavax/microedition/lcdui/ImageData;[ILjava/lang/String;)Z"] =
    function(nativeId, imgId, indicatorBounds, text) {
        var el = document.getElementById("displayable-" + nativeId);
        el.querySelector('p.text').textContent = util.fromJavaString(text);

        return 0;
    };

    Native["javax/microedition/lcdui/AlertLFImpl.showNativeResource0.(I)V"] = function(nativeId) {
        var el = document.getElementById("displayable-" + nativeId);
        el.style.display = 'block';
        el.classList.add('visible');
        if (currentlyFocusedTextEditor) {
            currentlyFocusedTextEditor.blur();
        }

        curDisplayableId = nativeId;
    };

    var INDEFINITE = -1;
    var CONTINUOUS_RUNNING = 2;

    Native["javax/microedition/lcdui/GaugeLFImpl.createNativeResource0.(ILjava/lang/String;IZII)I"] =
    function(ownerId, label, layout, interactive, maxValue, initialValue) {
        if (label != null) {
            console.error("Expected null label");
        }

        if (layout != PLAIN) {
            console.error("Expected PLAIN layout");
        }

        if (interactive) {
            console.error("Expected not interactive gauge");
        }

        if (maxValue != INDEFINITE) {
            console.error("Expected INDEFINITE maxValue");
        }

        if (initialValue != CONTINUOUS_RUNNING) {
            console.error("Expected CONTINUOUS_RUNNING initialValue")
        }

        var el = document.getElementById("displayable-" + ownerId);
        el.querySelector("progress").style.display = "inline";

        return nextMidpDisplayableId++;
    };

    Native["javax/microedition/lcdui/TextFieldLFImpl.createNativeResource0.(ILjava/lang/String;ILcom/sun/midp/lcdui/DynamicCharacterArray;ILjava/lang/String;)I"] =
    function(ownerId, label, layout, buffer, constraints, initialInputMode) {
        console.warn("javax/microedition/lcdui/TextFieldLFImpl.createNativeResource0.(ILjava/lang/String;ILcom/sun/midp/lcdui/DynamicCharacterArray;ILjava/lang/String;)I not implemented");
        return nextMidpDisplayableId++;
    };

    Native["javax/microedition/lcdui/ImageItemLFImpl.createNativeResource0.(ILjava/lang/String;ILjavax/microedition/lcdui/ImageData;Ljava/lang/String;I)I"] =
    function(ownerId, label, layout, imageData, altText, appearanceMode) {
        console.warn("javax/microedition/lcdui/ImageItemLFImpl.createNativeResource0.(ILjava/lang/String;ILjavax/microedition/lcdui/ImageData;Ljava/lang/String;I)I not implemented");
        return nextMidpDisplayableId++;
    };

    Native["javax/microedition/lcdui/FormLFImpl.setScrollPosition0.(I)V"] =
        UnimplementedNative("javax/microedition/lcdui/FormLFImpl.setScrollPosition0.(I)V");

    Native["javax/microedition/lcdui/FormLFImpl.getScrollPosition0.()I"] =
        UnimplementedNative("javax/microedition/lcdui/FormLFImpl.getScrollPosition0.()I", 0);

    Native["javax/microedition/lcdui/FormLFImpl.createNativeResource0.(Ljava/lang/String;Ljava/lang/String;)I"] =
        UnimplementedNative(
            "javax/microedition/lcdui/FormLFImpl.createNativeResource0.(Ljava/lang/String;Ljava/lang/String;)I",
            function() { return nextMidpDisplayableId++ }
        );

    Native["javax/microedition/lcdui/FormLFImpl.showNativeResource0.(IIII)V"] =
        UnimplementedNative("javax/microedition/lcdui/FormLFImpl.showNativeResource0.(IIII)V");

    Native["javax/microedition/lcdui/FormLFImpl.getViewportHeight0.()I"] =
        UnimplementedNative("javax/microedition/lcdui/FormLFImpl.getViewportHeight0.()I", 0);

    Native["javax/microedition/lcdui/StringItemLFImpl.createNativeResource0.(ILjava/lang/String;ILjava/lang/String;ILjavax/microedition/lcdui/Font;)I"] =
        UnimplementedNative(
            "javax/microedition/lcdui/StringItemLFImpl.createNativeResource0.(ILjava/lang/String;ILjava/lang/String;ILjavax/microedition/lcdui/Font;)I",
            function() { return nextMidpDisplayableId++ }
        );

    Native["javax/microedition/lcdui/ItemLFImpl.setSize0.(III)V"] = function(nativeId, w, h) {
        console.warn("javax/microedition/lcdui/ItemLFImpl.setSize0.(III)V not implemented");
    };

    Native["javax/microedition/lcdui/ItemLFImpl.setLocation0.(III)V"] = function(nativeId, x, y) {
        console.warn("javax/microedition/lcdui/ItemLFImpl.setLocation0.(III)V not implemented");
    };

    Native["javax/microedition/lcdui/ItemLFImpl.show0.(I)V"] = function(nativeId) {
        console.warn("javax/microedition/lcdui/ItemLFImpl.show0.(I)V not implemented");
    };

    Native["javax/microedition/lcdui/ItemLFImpl.hide0.(I)V"] = function(nativeId) {
        console.warn("javax/microedition/lcdui/ItemLFImpl.hide0.(I)V not implemented");
    };

    Native["javax/microedition/lcdui/ItemLFImpl.getMinimumWidth0.(I)I"] =
        UnimplementedNative("javax/microedition/lcdui/ItemLFImpl.getMinimumWidth0.(I)I", 10);

    Native["javax/microedition/lcdui/ItemLFImpl.getMinimumHeight0.(I)I"] =
        UnimplementedNative("javax/microedition/lcdui/ItemLFImpl.getMinimumHeight0.(I)I", 10);

    Native["javax/microedition/lcdui/ItemLFImpl.getPreferredWidth0.(II)I"] =
        UnimplementedNative("javax/microedition/lcdui/ItemLFImpl.getPreferredWidth0.(II)I", 10);

    Native["javax/microedition/lcdui/ItemLFImpl.getPreferredHeight0.(II)I"] =
        UnimplementedNative("javax/microedition/lcdui/ItemLFImpl.getPreferredHeight0.(II)I", 10);

    Native["javax/microedition/lcdui/ItemLFImpl.delete0.(I)V"] =
        UnimplementedNative("javax/microedition/lcdui/ItemLFImpl.delete0.(I)V");

    var BACK = 2;
    var CANCEL = 3;
    var OK = 4;

    Native["javax/microedition/lcdui/NativeMenu.updateCommands.([Ljavax/microedition/lcdui/Command;I[Ljavax/microedition/lcdui/Command;I)V"] =
    function(itemCommands, numItemCommands, commands, numCommands) {
        if (numItemCommands != 0) {
            console.error("NativeMenu.updateCommands: item commands not yet supported");
        }

        var el = document.getElementById("displayable-" + curDisplayableId);

        if (!el) {
            document.getElementById("sidebar").querySelector("nav ul").innerHTML = "";
        }

        if (!commands) {
            return;
        }

        var validCommands = commands.filter(function(command) {
            return !!command;
        }).sort(function(a, b) {
            return a.klass.classInfo.getField("I.priority.I").get(a) -
                   b.klass.classInfo.getField("I.priority.I").get(b);
        });

        function sendEvent(command) {
            MIDP.sendNativeEvent({
                type: MIDP.COMMAND_EVENT,
                intParam1: command.klass.classInfo.getField("I.id.I").get(command),
                intParam4: MIDP.displayId,
            }, MIDP.foregroundIsolateId);
        }

        if (el) {
            if (numCommands > 2 && validCommands.length > 2) {
                console.error("NativeMenu.updateCommands: max two commands supported");
            }

            validCommands.slice(0, 2).forEach(function(command, i) {
                var button = el.querySelector(".button" + i);
                button.style.display = 'inline';
                button.textContent = util.fromJavaString(command.klass.classInfo.getField("I.shortLabel.Ljava/lang/String;").get(command));

                var commandType = command.klass.classInfo.getField("I.commandType.I").get(command);
                if (numCommands == 1 || commandType == OK) {
                    button.classList.add('recommend');
                } else if (commandType == CANCEL || commandType == BACK) {
                    button.classList.add('cancel');
                }

                button.onclick = function(e) {
                    e.preventDefault();
                    sendEvent(command);
                };
            });
        } else {
            var menu = document.getElementById("sidebar").querySelector("nav ul");

            var okCommand = null;
            var backCommand = null;

            var isSidebarEmpty = true;
            validCommands.forEach(function(command) {
                var commandType = command.klass.classInfo.getField("I.commandType.I").get(command);
                // Skip the OK command which will shown in the header.
                if (commandType == OK) {
                    okCommand = command;
                    return;
                }
                // Skip the BACK command which will shown in the footer.
                if (commandType == BACK) {
                    backCommand = command;
                    return;
                }
                var li = document.createElement("li");
                var text = util.fromJavaString(command.klass.classInfo.getField("I.shortLabel.Ljava/lang/String;").get(command));
                li.innerHTML = "<a>" + text + "</a>";

                li.onclick = function(e) {
                    e.preventDefault();

                    window.location.hash = "";

                    sendEvent(command);
                };

                menu.appendChild(li);
                isSidebarEmpty = false;
            });

            document.getElementById("header-drawer-button").style.display =
                isSidebarEmpty ? "none" : "block";

            // If existing, the OK command will be shown in the header.
            var headerBtn = document.getElementById("header-ok-button");
            if (okCommand) {
                headerBtn.style.display = "block";
                headerBtn.onclick = sendEvent.bind(headerBtn, okCommand);
            } else {
                headerBtn.style.display = "none";
            }

            // If existing, the BACK command will be shown in the footer.
            var backBtn = document.getElementById("back-button");
            if (backCommand) {
                backBtn.style.display = "block";
                backBtn.onclick = sendEvent.bind(backBtn, backCommand);
            } else {
                backBtn.style.display = "none";
            }
        }
    };
})(Native);
