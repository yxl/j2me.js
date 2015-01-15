///<reference path='build/j2me.d.ts' />
var jsGlobal = (function () {
    return this || (1, eval)('this');
})();
var CC = {};
jsGlobal.window = {
    setZeroTimeout: function (callback) {
        callback();
    },
    addEventListener: function () {
    },
    crypto: {
        getRandomValues: function () {
        },
    },
};
jsGlobal.navigator = {
    language: "en-US",
};
jsGlobal.document = {
    documentElement: {
        classList: {
            add: function () {
            },
        },
    },
    querySelector: function () {
        return {
            addEventListener: function () {
            },
        };
    },
    getElementById: function () {
        return {
            addEventListener: function () {
            },
            getContext: function () {
            },
            getBoundingClientRect: function () {
                return { top: 0, left: 0, width: 0, height: 0 };
            }
        };
    },
    addEventListener: function () {
    },
};
jsGlobal.config = {
    logConsole: "native",
    args: "",
};
var J2ME;
(function (J2ME) {
    var isNode = typeof process === 'object';
    var writer;
    var rootPath = "";
    function loadFiles() {
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < files.length; i++) {
            load(rootPath + files[i]);
        }
    }
    loadFiles("libs/zipfile.js", "blackBox.js", "build/j2me.js", "libs/encoding.js", "util.js", "instrument.js", "override.js", "native.js", "string.js", "libs/console.js", "midp/midp.js", "libs/long.js", "midp/crypto.js", "libs/forge/md5.js", "libs/forge/util.js");
    J2ME.phase = 1 /* Compiler */;
    writer = new J2ME.IndentingWriter();
    var verboseOption;
    var classpathOption;
    var callGraphOption;
    var jarFileFilterOption;
    var classFileFilterOption;
    var classFilterOption;
    var methodFilterOption;
    var fileFilterOption;
    var debuggerOption;
    var releaseOption;
    var definitionOption;
    function main(commandLineArguments) {
        var options = new J2ME.Options.OptionSet("J2ME");
        var shellOptions = options.register(new J2ME.Options.OptionSet(""));
        verboseOption = shellOptions.register(new J2ME.Options.Option("v", "verbose", "boolean", false, "Verbose"));
        classpathOption = shellOptions.register(new J2ME.Options.Option("cp", "classpath", "string []", [], "Compile ClassPath"));
        callGraphOption = shellOptions.register(new J2ME.Options.Option("cg", "callGraph", "string []", [], "Call Grpah Files"));
        jarFileFilterOption = shellOptions.register(new J2ME.Options.Option("jf", "jarFileFilter", "string", "", "Compile Jar File Filter"));
        classFileFilterOption = shellOptions.register(new J2ME.Options.Option("cff", "classFileFilter", "string", "", "Compile Class File Filter"));
        classFilterOption = shellOptions.register(new J2ME.Options.Option("cf", "classFilter", "string", ".*", "Compile Class Filter"));
        methodFilterOption = shellOptions.register(new J2ME.Options.Option("mf", "methodFilter", "string", "", "Compile Method Filter"));
        fileFilterOption = shellOptions.register(new J2ME.Options.Option("ff", "fileFilter", "string", ".*", "Compile File Filter"));
        debuggerOption = shellOptions.register(new J2ME.Options.Option("d", "debugger", "boolean", false, "Emit Debug Information"));
        releaseOption = shellOptions.register(new J2ME.Options.Option("r", "release", "boolean", false, "Release mode"));
        definitionOption = shellOptions.register(new J2ME.Options.Option("t", "definition", "boolean", false, "Emit Definition"));
        var argumentParser = new J2ME.Options.ArgumentParser();
        argumentParser.addBoundOptionSet(shellOptions);
        function printUsage() {
            writer.enter("J2ME Command Line Interface");
            options.trace(writer);
            writer.leave("");
        }
        argumentParser.addArgument("h", "help", "boolean", {
            parse: function (x) {
                printUsage();
            }
        });
        var files = [];
        try {
            argumentParser.parse(commandLineArguments);
            classpathOption.value.filter(function (value, index, array) {
                if (value.endsWith(".jar")) {
                    files.push(value);
                }
                else {
                    return true;
                }
            });
            callGraphOption.value.filter(function (value, index, array) {
                if (value.endsWith(".json")) {
                    var calls = JSON.parse(snarf(value));
                    var Y = {};
                    Y["java/io/ByteArrayOutputStream.write.(I)V"] = true;
                    var changed = true;
                    while (changed) {
                        changed = false;
                        for (var k in calls) {
                            if (Y[k]) {
                                continue;
                            }
                            for (var z in Y) {
                                if (calls[k].indexOf(z) >= 0) {
                                    Y[k] = true;
                                    changed = true;
                                    break;
                                }
                            }
                        }
                    }
                    writer.writeLn(JSON.stringify(Y, null, 2));
                }
                else {
                    return true;
                }
            });
        }
        catch (x) {
            writer.writeLn(x.message);
            writer.writeLns(x.stack);
            quit();
        }
        release = releaseOption.value;
        var jvm = new J2ME.JVM();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.endsWith(".jar")) {
                if (verboseOption.value) {
                    writer.writeLn("Loading: " + file);
                }
                J2ME.CLASSES.addPath(file, snarf(file, "binary").buffer);
            }
        }
        J2ME.CLASSES.initializeBuiltinClasses();
        J2ME.Bytecode.defineBytecodes();
        if (verboseOption.value) {
            writer.writeLn("Compiling Pattern: " + classFilterOption.value + " " + classFileFilterOption.value);
        }
        var classNameList;
        if (classFileFilterOption.value) {
            var file;
            try {
                file = snarf(classFileFilterOption.value, "text");
            }
            catch (e) {
            }
            if (file) {
                classNameList = file.replace(/\r?\n/g, "\n").split("\n");
            }
        }
        function jarFilter(file) {
            if (jarFileFilterOption.value) {
                return file === jarFileFilterOption.value;
            }
            return true;
        }
        function classFilter(classInfo) {
            if (classNameList) {
                return classNameList.indexOf(classInfo.className) >= 0;
            }
            else if (classFilterOption.value) {
                return !!classInfo.className.match(classFilterOption.value);
            }
            return false;
        }
        function methodFilter(methodInfo) {
            if (!methodFilterOption.value) {
                return true;
            }
            return methodInfo.implKey === methodFilterOption.value;
        }
        J2ME.compile(jvm, jarFilter, classFilter, methodFilter, fileFilterOption.value, debuggerOption.value, definitionOption.value);
        if (verboseOption.value) {
            J2ME.printResults();
        }
    }
    var commandLineArguments;
    // Shell Entry Point
    if (typeof help === "function") {
        // SpiderMonkey
        if (typeof scriptArgs === "undefined") {
            commandLineArguments = arguments;
        }
        else {
            commandLineArguments = scriptArgs;
        }
    }
    else if (isNode) {
        // node.js
        var commandLineArguments = Array.prototype.slice.call(process.argv, 2);
    }
    main(commandLineArguments);
})(J2ME || (J2ME = {}));
//# sourceMappingURL=jsc.js.map