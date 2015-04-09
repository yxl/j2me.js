/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

module J2ME {
  declare var ZipFile;
  declare var snarf;
  export var classCounter = new Metrics.Counter(true);
  declare var JARStore;

  export class ClassRegistry {
    /**
     * List of directories to look for source files in.
     */
    sourceDirectories: string [];

    /**
     * All source code, only ever used for debugging.
     */
    sourceFiles: Map<string, string []>;

    /**
     * List of classes whose sources files were not found. We keep track
     * of them so we don't have to search for them over and over.
     */
    missingSourceFiles: Map<string, string []>;

    classes: Map<string, ClassInfo>;

    preInitializedClasses: ClassInfo [];

    java_lang_Object: ClassInfo;
    java_lang_Class: ClassInfo;
    java_lang_String: ClassInfo;
    java_lang_Thread: ClassInfo;

    constructor() {
      this.sourceDirectories = [];
      this.sourceFiles = Object.create(null);
      this.missingSourceFiles = Object.create(null);

      this.classes = Object.create(null);
      this.preInitializedClasses = [];
    }

    initializeBuiltinClasses() {
      // These classes are guaranteed to not have a static initializer.
      enterTimeline("initializeBuiltinClasses");
      this.java_lang_Object = this.loadAndLinkClass("java/lang/Object");
      this.java_lang_Class = this.loadAndLinkClass("java/lang/Class");
      this.java_lang_String = this.loadAndLinkClass("java/lang/String");
      this.java_lang_Thread = this.loadAndLinkClass("java/lang/Thread");

      this.preInitializedClasses.push(this.java_lang_Object);
      this.preInitializedClasses.push(this.java_lang_Class);
      this.preInitializedClasses.push(this.java_lang_String);
      this.preInitializedClasses.push(this.java_lang_Thread);

      /**
       * Force these frequently used classes to be initialized eagerly. We can
       * skip the class initialization check for them. This is only possible
       * because they don't have any static state.
       */
      var classNames = [
        "java/lang/Integer",
        "java/lang/Character",
        "java/lang/Math",
        "java/util/HashtableEntry",
        "java/lang/StringBuffer",
        "java/util/Vector",
        "java/io/IOException",
        "java/lang/IllegalArgumentException",
        // Preload the Isolate class, that is needed to start the VM (see jvm.ts)
        "com/sun/cldc/isolate/Isolate",
        "org/mozilla/internal/Sys",
        "java/lang/System",
        "java/lang/RuntimeException",
        "java/lang/IllegalStateException",
        "java/lang/Long",
        "java/lang/NullPointerException",
        "java/lang/Boolean",
        "java/util/Hashtable",
        "java/lang/IndexOutOfBoundsException",
      ];

      for (var i = 0; i < classNames.length; i++) {
        this.preInitializedClasses.push(this.loadAndLinkClass(classNames[i]));
      }

      // Link primitive values.
      var primitiveTypes = "ZCFDBSIJ";
      for (var i = 0; i < primitiveTypes.length; i++) {
        var typeName = primitiveTypes[i];
        linkKlass(PrimitiveClassInfo[typeName]);
      }
      // Link primitive arrays.
      PrimitiveArrayClassInfo.initialize();
      for (var i = 0; i < primitiveTypes.length; i++) {
        this.getClass("[" + primitiveTypes[i]);
      }
      leaveTimeline("initializeBuiltinClasses");
    }

    isPreInitializedClass(classInfo: ClassInfo) {
      return this.preInitializedClasses.indexOf(classInfo) >= 0;
    }

    addSourceDirectory(name: string) {
      this.sourceDirectories.push(name);
    }

    getSourceLine(sourceLocation: SourceLocation): string {
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
          } catch (x) {
            // Keep looking.
            //stderrWriter.writeLn("" + x);
          }
        }
      }
      if (source) {
        return source[sourceLocation.lineNumber - 1];
      }
      this.missingSourceFiles[sourceLocation.className] = true;
      return null;
    }

    loadClassBytes(bytes: Uint8Array): ClassInfo {
      enterTimeline("loadClassBytes");
      var classInfo = new ClassInfo(bytes);
      leaveTimeline("loadClassBytes");
      loadWriter && loadWriter.writeLn(classInfo.getClassNameSlow() + " -> " + classInfo.superClassName + ";");
      this.classes[classInfo.getClassNameSlow()] = classInfo;
      return classInfo;
    }

    loadClassFile(fileName: string): ClassInfo {
      loadWriter && loadWriter.enter("> Loading Class File: " + fileName);
      var bytes = JARStore.loadFile(fileName);
      if (!bytes) {
        loadWriter && loadWriter.leave("< ClassNotFoundException");
        throw new (ClassNotFoundException)(fileName);
      }
      var self = this;
      var classInfo = this.loadClassBytes(bytes);
      if (classInfo.superClassName) {
        classInfo.superClass = this.loadClass(classInfo.superClassName);
        var superClass = classInfo.superClass;
        superClass.subClasses.push(classInfo);
        while (superClass) {
          superClass.allSubClasses.push(classInfo);
          superClass = superClass.superClass;
        }
      }
      classInfo.complete();
      loadWriter && loadWriter.leave("<");
      return classInfo;
    }

    loadClass(className: string): ClassInfo {
      var classInfo = this.classes[className];
      if (classInfo) {
        return classInfo;
      }
      return this.loadClassFile(className + ".class");
    }

    loadAndLinkClass(className: string): ClassInfo {
      var classInfo = this.loadClass(className);
      linkKlass(classInfo);
      return classInfo;
    }

    getEntryPoint(classInfo: ClassInfo): MethodInfo {
      var methods = classInfo.getMethods();
      for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        if (method.isPublic && method.isStatic && !method.isNative &&
            method.name === "main" &&
            method.signature === "([Ljava/lang/String;)V") {
          return method;
        }
      }
    }

    getClass(className: string): ClassInfo {
      var classInfo = this.classes[className];
      if (!classInfo) {
        if (className[0] === "[") {
          classInfo = this.createArrayClass(className);
        } else {
          classInfo = this.loadClass(className);
        }
        if (!classInfo)
          return null;
      }
      return classInfo;
    }

    createArrayClass(typeName: string): ArrayClassInfo {
      var elementType = typeName.substr(1);
      var constructor = getArrayConstructor(elementType);
      var classInfo;
      if (constructor) {
        classInfo = PrimitiveArrayClassInfo[elementType];
      } else {
        if (elementType[0] === "L") {
          elementType = elementType.substr(1).replace(";", "");
        }
        classInfo = new ObjectArrayClassInfo(this.getClass(elementType));
      }
      if (J2ME.phase === J2ME.ExecutionPhase.Runtime) {
        J2ME.linkKlass(classInfo);
      }
      return this.classes[typeName] = classInfo;
    }

  }

  export var ClassNotFoundException = function(message) {
    this.message = message;
  };

  ClassNotFoundException.prototype = Object.create(Error.prototype);
  ClassNotFoundException.prototype.name = "ClassNotFoundException";
  ClassNotFoundException.prototype.constructor = ClassNotFoundException;
}

