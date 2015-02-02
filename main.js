/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var jvm = new JVM();

if ("gamepad" in config && !/no|0/.test(config.gamepad)) {
  document.documentElement.classList.add('gamepad');
}

var jars = ["java/classes.jar"];

if (config.midletClassName == "RunTests") {
  jars.push("tests/tests.jar");
}

if (config.jars) {
  jars = jars.concat(config.jars.split(":"));
}

// Mobile info gets accessed a lot, so we cache it on startup.
var mobileInfo;
var getMobileInfo = new Promise(function(resolve, reject) {
  var sender = DumbPipe.open("mobileInfo", {}, function(message) {
    mobileInfo = message;
    DumbPipe.close(sender);
    resolve();
  });
});

var loadingPromises = [initFS, getMobileInfo];

jars.forEach(function(jar) {
  loadingPromises.push(load(jar, "arraybuffer").then(function(data) {
    CLASSES.addPath(jar, data);
  }));
});

function processJAD(data) {
  data
  .replace(/\r\n|\r/g, "\n")
  .replace(/\n /g, "")
  .split("\n")
  .forEach(function(entry) {
    if (entry) {
      var keyEnd = entry.indexOf(":");
      var key = entry.substring(0, keyEnd);
      var val = entry.substring(keyEnd + 1).trim();
      MIDP.manifest[key] = val;

      if (key == "MIDlet-Name") {
        var title = document.getElementById("splash-screen").querySelector(".title");
        title.textContent = "Loading " + val;
      }
    }
  });
}

if (config.jad) {
  loadingPromises.push(load(config.jad, "text").then(processJAD).then(backgroundCheck));
}

function performDownload(url, dialog, callback) {
  var dialogText = dialog.querySelector('h1.download-dialog-text');
  dialogText.textContent = "Downloading " + MIDlet.name + "…";

  var progressBar = dialog.querySelector('progress.pack-activity');

  var sender = DumbPipe.open("JARDownloader", url, function(message) {
    switch (message.type) {
      case "done":
        DumbPipe.close(sender);

        callback(message.data);

        break;

      case "progress":
        progressBar.value = message.progress;
        break;

      case "fail":
        DumbPipe.close(sender);

        progressBar.value = 0;
        progressBar.style.display = "none";

        var dialogText = dialog.querySelector('h1.download-dialog-text');
        dialogText.textContent = "Download failure";

        var btnRetry = dialog.querySelector('button.recommend');
        btnRetry.style.display = '';

        btnRetry.addEventListener('click', function onclick(e) {
          e.preventDefault();
          btnRetry.removeEventListener('click', onclick);

          btnRetry.style.display = "none";

          progressBar.style.display = '';

          performDownload(url, dialog, callback);
        });

        break;
    }
  });
}

if (config.downloadJAD) {
  loadingPromises.push(initFS.then(function() {
    return new Promise(function(resolve, reject) {
      if (fs.exists("/midlet.jar")) {
        Promise.all([
          new Promise(function(resolve, reject) {
            fs.open("/midlet.jar", function(fd) {
              CLASSES.addPath("midlet.jar", fs.read(fd).buffer.slice(0));
              fs.close(fd);
              resolve();
            });
          }),
          new Promise(function(resolve, reject) {
            fs.open("/midlet.jad", function(fd) {
              processJAD(util.decodeUtf8(fs.read(fd)));
              fs.close(fd);
              resolve();
            });
          }),
        ]).then(resolve);
      } else {
        var dialog = document.getElementById('download-progress-dialog').cloneNode(true);
        dialog.style.display = 'block';
        dialog.classList.add('visible');
        document.body.appendChild(dialog);

        performDownload(config.downloadJAD, dialog, function(data) {
          dialog.parentElement.removeChild(dialog);

          CLASSES.addPath("midlet.jar", data.jarData);
          processJAD(data.jadData);

          fs.create("/midlet.jad", new Blob([ data.jadData ]));
          fs.create("/midlet.jar", new Blob([ data.jarData ]));
          resolve();
        });
      }
    });
  }).then(backgroundCheck));
}

if (config.midletClassName == "RunTests") {
  loadingPromises.push(loadScript("tests/native.js"),
                       loadScript("tests/override.js"),
                       loadScript("tests/mozactivitymock.js"));
}

loadingPromises.push(emoji.loadData());

function getIsOff(button) {
  return button.textContent.contains("OFF");
}
function toggle(button) {
  var isOff = getIsOff(button);
  button.textContent = button.textContent.replace(isOff ? "OFF" : "ON", isOff ? "ON" : "OFF");
}

var bigBang = 0;

function start() {
  J2ME.Context.setWriters(new J2ME.IndentingWriter());
  CLASSES.initializeBuiltinClasses();
  profiler && profiler.start(2000, false);
  bigBang = performance.now();
  jvm.startIsolate0(config.main, config.args);
}

Promise.all(loadingPromises).then(start, function (reason) {
  console.error("Loading failed: \"" + reason + "\"");
});

document.getElementById("start").onclick = function() {
  start();
};

function loadAllClasses() {
  profiler.start(5000, false);
  for (var i = 0; i < 1; i++) {
    var s = performance.now();
    CLASSES.loadAllClassFiles();
    console.info("Loaded all classes in: " + (performance.now() - s));
  }
}

document.getElementById("loadAllClasses").onclick = function() {
  loadAllClasses();
};

window.onload = function() {
 document.getElementById("deleteDatabase").onclick = function() {
   indexedDB.deleteDatabase("asyncStorage");
 };
 document.getElementById("exportstorage").onclick = function() {
   fs.exportStore(function(blob) {
     saveAs(blob, "fs-" + Date.now() + ".json");
   });
 };
 document.getElementById("importstorage").onclick = function() {
   function performImport(file) {
     fs.importStore(file, function() {
       DumbPipe.close(DumbPipe.open("alert", "Import completed."));
     });
   }

   var file = document.getElementById("importstoragefile").files[0];
   if (file) {
     performImport(file);
   } else {
     load(document.getElementById("importstorageurl").value, "blob").then(function(blob) {
       performImport(blob);
     });
   }
 };
 document.getElementById("clearCompiledMethodCache").onclick = function() {
   CompiledMethodCache.clear().then(function() { console.log("cleared compiled method cache") });
 };
 document.getElementById("printAllExceptions").onclick = function() {
   VM.DEBUG_PRINT_ALL_EXCEPTIONS = !VM.DEBUG_PRINT_ALL_EXCEPTIONS;
   toggle(this);
 };
 document.getElementById("clearCounters").onclick = function() {
   clearCounters();
 };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  setInterval(function () {
    var el = document.getElementById("bytecodeCount");
    el.textContent = numberWithCommas(J2ME.bytecodeCount);

    var el = document.getElementById("interpreterCount");
    el.textContent = numberWithCommas(J2ME.interpreterCount);

    var el = document.getElementById("compiledCount");
    el.textContent = numberWithCommas(J2ME.compiledMethodCount) + " / " +
                     numberWithCommas(J2ME.cachedMethodCount);

    var el = document.getElementById("onStackReplacementCount");
    el.textContent = numberWithCommas(J2ME.onStackReplacementCount);

    var el = document.getElementById("unwindCount");
    el.textContent = numberWithCommas(J2ME.unwindCount);
  }, 500);

  function dumpCounters() {
    var writer = new J2ME.IndentingWriter();

    writer.writeLn("Frame Count: " + J2ME.frameCount);
    writer.writeLn("Unwind Count: " + J2ME.unwindCount);
    writer.writeLn("Bytecode Count: " + J2ME.bytecodeCount);
    writer.writeLn("OSR Count: " + J2ME.onStackReplacementCount);

    if (J2ME.interpreterCounter) {
      writer.enter("interpreterCounter");
      J2ME.interpreterCounter.traceSorted(writer);
      writer.outdent();
    }
    if (J2ME.interpreterMethodCounter) {
      writer.enter("interpreterMethodCounter");
      J2ME.interpreterMethodCounter.traceSorted(writer);
      writer.outdent();
    }
    if (J2ME.baselineMethodCounter) {
      writer.enter("baselineMethodCounter");
      J2ME.baselineMethodCounter.traceSorted(writer);
      writer.outdent();
    }
    if (J2ME.baselineCounter) {
      writer.enter("baselineCounter");
      J2ME.baselineCounter.traceSorted(writer);
      writer.outdent();
    }
    if (J2ME.nativeCounter) {
      writer.enter("nativeCounter");
      J2ME.nativeCounter.traceSorted(writer);
      writer.outdent();
    }
    if (J2ME.runtimeCounter) {
      writer.enter("runtimeCounter");
      J2ME.runtimeCounter.traceSorted(writer);
      writer.outdent();
    }
    if (J2ME.asyncCounter) {
      writer.enter("asyncCounter");
      J2ME.asyncCounter.traceSorted(writer);
      writer.outdent();
    }
  }
  function clearCounters() {
    J2ME.frameCount = 0;
    J2ME.unwindCount = 0;
    J2ME.bytecodeCount = 0;
    J2ME.interpreterCount = 0;
    J2ME.onStackReplacementCount = 0;

    J2ME.interpreterCounter && J2ME.interpreterCounter.clear();
    J2ME.interpreterMethodCounter && J2ME.interpreterMethodCounter.clear();
    J2ME.nativeCounter && J2ME.nativeCounter.clear();
    J2ME.runtimeCounter && J2ME.runtimeCounter.clear();
    J2ME.asyncCounter && J2ME.asyncCounter.clear();
    J2ME.baselineMethodCounter && J2ME.baselineMethodCounter.clear();
    J2ME.baselineCounter && J2ME.baselineCounter.clear();
  }

  document.getElementById("dumpCounters").onclick = function() {
    dumpCounters();
  };
  document.getElementById("sampleCounters1").onclick = function() {
    clearCounters();
    dumpCounters();
    setTimeout(function () {
      dumpCounters();
    }, 1000);
  };
  document.getElementById("sampleCounters2").onclick = function() {
    clearCounters();
    function sample() {
      var c = 1;
      function tick() {
        if (c-- > 0) {
          dumpCounters();
          clearCounters();
          setTimeout(tick, 16);
        }
      }

      setTimeout(tick, 100);
    }
    setTimeout(sample, 2000); // Wait 2s before starting.
  };
 document.getElementById("profile").onclick = function() {
   if (getIsOff(this)) {
     Instrument.startProfile();
   } else {
     Instrument.stopProfile();
   }
   toggle(this);
 };
 if (Instrument.profiling) {
   toggle(document.getElementById("profile"));
 }
};

if (config.profile && !/no|0/.test(config.profile)) {
  Instrument.startProfile();
}

function requestTimelineBuffers(fn) {
  if (J2ME.timeline) {
    fn([
      J2ME.timeline,
      J2ME.threadTimeline,
      J2ME.methodTimeline
    ]);
    return;
  }
  return fn([]);
}

var perfWriterCheckbox = document.querySelector('#perfWriter');

perfWriterCheckbox.checked = !!(J2ME.writers & J2ME.WriterFlags.Perf);
perfWriterCheckbox.addEventListener('change', function() {
  if (perfWriterCheckbox.checked) {
    J2ME.writers |= J2ME.WriterFlags.Perf;
  } else {
    J2ME.writers &= !J2ME.WriterFlags.Perf;
  }
});


var profiler = typeof Shumway !== "undefined" ? (function() {

  var elPageContainer = document.getElementById("pageContainer");
  elPageContainer.classList.add("profile-mode");

  var elProfilerToolbar = document.getElementById("profilerToolbar");
  var elProfilerMessage = document.getElementById("profilerMessage");
  var elProfilerPanel = document.getElementById("profilePanel");
  var elBtnMinimize = document.getElementById("profilerMinimizeButton");
  var elBtnStartStop = document.getElementById("profilerStartStop");

  var controller;
  var startTime;
  var timerHandle;
  var timeoutHandle;

  var Profiler = function() {
    controller = new Shumway.Tools.Profiler.Controller(elProfilerPanel);
    elBtnStartStop.addEventListener("click", this._onStartStopClick.bind(this));

    var self = this;
    window.addEventListener("keypress", function (event) {
      if (event.altKey && event.keyCode === 114) { // Alt + R
        self._onStartStopClick();
      }
    }, false);
  }

  Profiler.prototype.start = function(maxTime, resetTimelines) {
    window.profile = true;
    requestTimelineBuffers(function (buffers) {
      for (var i = 0; i < buffers.length; i++) {
        buffers[i].reset();
      }
    });
    controller.deactivateProfile();
    maxTime = maxTime || 0;
    elProfilerToolbar.classList.add("withEmphasis");
    elBtnStartStop.textContent = "Stop";
    startTime = Date.now();
    timerHandle = setInterval(showTimeMessage, 1000);
    if (maxTime) {
      timeoutHandle = setTimeout(this.createProfile.bind(this), maxTime);
    }
    showTimeMessage();
  }

  Profiler.prototype.createProfile = function() {
    requestTimelineBuffers(function (buffers) {
      controller.createProfile(buffers);
      elProfilerToolbar.classList.remove("withEmphasis");
      elBtnStartStop.textContent = "Start";
      clearInterval(timerHandle);
      clearTimeout(timeoutHandle);
      timerHandle = 0;
      timeoutHandle = 0;
      window.profile = false;
      showTimeMessage(false);
    });
  }

  Profiler.prototype.openPanel = function() {
    elProfilerContainer.classList.remove("collapsed");
  }

  Profiler.prototype.closePanel = function() {
    elProfilerContainer.classList.add("collapsed");
  }

  Profiler.prototype.resize = function() {
    controller.resize();
  }

  Profiler.prototype._onMinimizeClick = function(e) {
    if (elProfilerContainer.classList.contains("collapsed")) {
      this.openPanel();
    } else {
      this.closePanel();
    }
  }

  Profiler.prototype._onStartStopClick = function(e) {
    if (timerHandle) {
      this.createProfile();
      this.openPanel();
    } else {
      this.start(0, true);
    }
  }

  function showTimeMessage(show) {
    show = typeof show === "undefined" ? true : show;
    var time = Math.round((Date.now() - startTime) / 1000);
    elProfilerMessage.textContent = show ? "Running: " + time + " Seconds" : "";
  }

  return new Profiler();

})() : undefined;
