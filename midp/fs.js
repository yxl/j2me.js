/* -*- Mode: Java; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*- */
/* vim: set shiftwidth=4 tabstop=4 autoindent cindent expandtab: */

'use strict';

var RECORD_STORE_BASE = "/RecordStore";

// The filesystem roots, which are used by both FileSystemRegistry.getRoots
// and System.getProperty to provide inquiring midlets with the list.  Each root
// must have a trailing slash.  See FileSystemRegistry.listRoots for more info.
MIDP.fsRoots = [
    "MemoryCard/",
    "Persistent/",
    "Phone/",
    "Private/",
];
// The names here should be localized.
MIDP.fsRootNames = [
    "Memory card",
    "Persistent",
    "Phone memory",
    "Private",
];

Native["com/sun/midp/io/j2me/storage/File.initConfigRoot.(I)Ljava/lang/String;"] = function(storageId) {
    return J2ME.newString("assets/" + storageId + "/");
};

Native["com/sun/midp/io/j2me/storage/File.initStorageRoot.(I)Ljava/lang/String;"] = function(storageId) {
    return J2ME.newString("assets/" + storageId + "/");
};

Native["com/sun/midp/midletsuite/MIDletSuiteStorage.getSecureFilenameBase.(I)Ljava/lang/String;"] = function(id) {
    return J2ME.newString("");
};

Native["com/sun/midp/rms/RecordStoreUtil.exists.(Ljava/lang/String;Ljava/lang/String;I)Z"] =
function(filenameBase, name, ext) {
    var path = RECORD_STORE_BASE + "/" + J2ME.fromJavaString(filenameBase) + "/" + J2ME.fromJavaString(name) + "." + ext;
    return fs.exists(path) ? 1 : 0;
};

Native["com/sun/midp/rms/RecordStoreUtil.deleteFile.(Ljava/lang/String;Ljava/lang/String;I)V"] =
function(filenameBase, name, ext) {
    var path = RECORD_STORE_BASE + "/" + J2ME.fromJavaString(filenameBase) + "/" + J2ME.fromJavaString(name) + "." + ext;
    fs.remove(path);
};

Native["com/sun/midp/rms/RecordStoreFile.getNumberOfStores.(Ljava/lang/String;)I"] =
function(filenameBase) {
    var path = RECORD_STORE_BASE + "/" + J2ME.fromJavaString(filenameBase);
    return fs.list(path).length;
};

Native["com/sun/midp/rms/RecordStoreFile.getRecordStoreList.(Ljava/lang/String;[Ljava/lang/String;)V"] =
function (filenameBase, names) {
    var path = RECORD_STORE_BASE + "/" + J2ME.fromJavaString(filenameBase);
    var files = fs.list(path);
    for (var i = 0; i < files.length; i++) {
        names[i] = J2ME.newString(files[i]);
    }
};

Native["com/sun/midp/rms/RecordStoreFile.spaceAvailableNewRecordStore0.(Ljava/lang/String;I)I"] = function(filenameBase, storageId) {
    // Pretend there is 50MiB available.  Our implementation is backed
    // by IndexedDB, which has no actual limit beyond space available on device,
    // which I don't think we can determine.  But this should be sufficient
    // to convince the MIDlet to use the API as needed.
    return 50 * 1024 * 1024;
};

Native["com/sun/midp/rms/RecordStoreFile.spaceAvailableRecordStore.(ILjava/lang/String;I)I"] = function(handle, filenameBase, storageId) {
    // Pretend there is 50MiB available.  Our implementation is backed
    // by IndexedDB, which has no actual limit beyond space available on device,
    // which I don't think we can determine.  But this should be sufficient
    // to convince the MIDlet to use the API as needed.
    return 50 * 1024 * 1024;
};

Native["com/sun/midp/rms/RecordStoreFile.openRecordStoreFile.(Ljava/lang/String;Ljava/lang/String;I)I"] =
function(filenameBase, name, ext) {
    var ctx = $.ctx;

    var path = RECORD_STORE_BASE + "/" + J2ME.fromJavaString(filenameBase) + "/" + J2ME.fromJavaString(name) + "." + ext;

    function open() {
        asyncImpl("I", new Promise(function(resolve, reject) {
            fs.open(path, function(fd) {
                if (fd == -1) {
                    ctx.setAsCurrentContext();
                    reject($.newIOException("openRecordStoreFile: open failed"));
                } else {
                    resolve(fd); // handle
                }
            });
        }));
    }

    if (fs.exists(path)) {
        open();
    } else {
        // Per the reference impl, create the file if it doesn't exist.
        var dirname = fs.dirname(path);
        if (!fs.mkdirp(dirname)) {
            throw $.newIOException("openRecordStoreFile: mkdirp failed");
        }

        if (!fs.create(path, new Blob())) {
            throw $.newIOException("openRecordStoreFile: create failed");
        }

        open();
    }
};

Native["com/sun/midp/rms/RecordStoreFile.setPosition.(II)V"] = function(handle, pos) {
    fs.setpos(handle, pos);
};

Native["com/sun/midp/rms/RecordStoreFile.readBytes.(I[BII)I"] = function(handle, buf, offset, numBytes) {
    var from = fs.getpos(handle);
    var to = from + numBytes;
    var readBytes = fs.read(handle, from, to);

    if (readBytes.byteLength <= 0) {
        throw $.newIOException("handle invalid or segment indices out of bounds");
    }

    var subBuffer = buf.subarray(offset, offset + readBytes.byteLength);
    for (var i = 0; i < readBytes.byteLength; i++) {
        subBuffer[i] = readBytes[i];
    }
    return readBytes.byteLength;
};

Native["com/sun/midp/rms/RecordStoreFile.writeBytes.(I[BII)V"] = function(handle, buf, offset, numBytes) {
    fs.write(handle, buf.subarray(offset, offset + numBytes));
};

Native["com/sun/midp/rms/RecordStoreFile.commitWrite.(I)V"] = function(handle) {
    fs.flush(handle);
};

Native["com/sun/midp/rms/RecordStoreFile.closeFile.(I)V"] = function(handle) {
    fs.close(handle);
};

Native["com/sun/midp/rms/RecordStoreFile.truncateFile.(II)V"] = function(handle, size) {
    fs.flush(handle);
    fs.ftruncate(handle, size);
};

MIDP.RecordStoreCache = [];

Native["com/sun/midp/rms/RecordStoreSharedDBHeader.getLookupId0.(ILjava/lang/String;I)I"] =
function(suiteId, jStoreName, headerDataSize) {
    var storeName = J2ME.fromJavaString(jStoreName);

    var sharedHeader =
        MIDP.RecordStoreCache.filter(function(v) { return (v && v.suiteId == suiteId && v.storeName == storeName); })[0];
    if (!sharedHeader) {
        sharedHeader = {
            suiteId: suiteId,
            storeName: storeName,
            headerVersion: 0,
            headerData: null,
            headerDataSize: headerDataSize,
            refCount: 0,
            // Use cache indices as IDs, so we can look up objects by index.
            lookupId: MIDP.RecordStoreCache.length,
        };
        MIDP.RecordStoreCache.push(sharedHeader);
    }
    ++sharedHeader.refCount;

    return sharedHeader.lookupId;
};

Native["com/sun/midp/rms/RecordStoreSharedDBHeader.shareCachedData0.(I[BI)I"] = function(lookupId, headerData, headerDataSize) {
    var sharedHeader = MIDP.RecordStoreCache[lookupId];
    if (!sharedHeader) {
        throw $.newIllegalStateException("invalid header lookup ID");
    }

    if (!headerData) {
        throw $.newIllegalArgumentException("header data is null");
    }

    var size = headerDataSize;
    if (size > sharedHeader.headerDataSize) {
        size = sharedHeader.headerDataSize;
    }
    sharedHeader.headerData = headerData.buffer.slice(0, size);
    ++sharedHeader.headerVersion;

    return sharedHeader.headerVersion;
};

Native["com/sun/midp/rms/RecordStoreSharedDBHeader.updateCachedData0.(I[BII)I"] =
function(lookupId, headerData, headerDataSize, headerVersion) {
    var sharedHeader = MIDP.RecordStoreCache[lookupId];
    if (!sharedHeader) {
        throw $.newIllegalStateException("invalid header lookup ID");
    }

    if (!headerData) {
        throw $.newIllegalArgumentException("header data is null");
    }

    if (sharedHeader.headerVersion > headerVersion && sharedHeader.headerData) {
        var size = sharedHeader.headerDataSize;
        if (size > headerDataSize) {
            size = headerDataSize;
        }
        var sharedHeaderData = new Int8Array(sharedHeader.headerData);
        for (var i = 0; i < size; i++) {
            headerData[i] = sharedHeaderData[i];
        }
        return sharedHeader.headerVersion;
    }

    return headerVersion;
};

Native["com/sun/midp/rms/RecordStoreSharedDBHeader.getHeaderRefCount0.(I)I"] = function(lookupId) {
    var sharedHeader = MIDP.RecordStoreCache[lookupId];
    if (!sharedHeader) {
        throw $.newIllegalStateException("invalid header lookup ID");
    }

    return sharedHeader.refCount;
};

Native["com/sun/midp/rms/RecordStoreSharedDBHeader.cleanup0.()V"] = function() {
    var lookupId = this.lookupId;
    if (MIDP.RecordStoreCache[lookupId] &&
        --MIDP.RecordStoreCache[lookupId].refCount <= 0) {
        // Set to null instead of removing from array to maintain
        // correspondence between lookup IDs and array indices.
        MIDP.RecordStoreCache[lookupId] = null;
    }
};

// In the reference implementation, finalize is identical to cleanup0.
Native["com/sun/midp/rms/RecordStoreSharedDBHeader.finalize.()V"] =
    Native["com/sun/midp/rms/RecordStoreSharedDBHeader.cleanup0.()V"];

Native["com/sun/midp/rms/RecordStoreRegistry.getRecordStoreListeners.(ILjava/lang/String;)[I"] =
function(suiteId, storeName) {
    console.warn("RecordStoreRegistry.getRecordStoreListeners.(IL...String;)[I not implemented (" +
                 suiteId + ", " + J2ME.fromJavaString(storeName) + ")");
    return null;
};

Native["com/sun/midp/rms/RecordStoreRegistry.sendRecordStoreChangeEvent.(ILjava/lang/String;II)V"] =
function(suiteId, storeName, changeType, recordId) {
    console.warn("RecordStoreRegistry.sendRecordStoreChangeEvent.(IL...String;II)V not implemented (" +
                 suiteId + ", " + J2ME.fromJavaString(storeName) + ", " + changeType + ", " + recordId + ")");
};

Native["com/sun/midp/rms/RecordStoreRegistry.startRecordStoreListening.(ILjava/lang/String;)V"] =
function(suiteId, storeName) {
    console.warn("RecordStoreRegistry.startRecordStoreListening.(IL...String;)V not implemented (" +
                 suiteId + ", " + J2ME.fromJavaString(storeName) + ")");
};

Native["com/sun/midp/rms/RecordStoreRegistry.stopRecordStoreListening.(ILjava/lang/String;)V"] =
function(suiteId, storeName) {
    console.warn("RecordStoreRegistry.stopRecordStoreListening.(IL...String;)V not implemented (" +
                 suiteId + ", " + J2ME.fromJavaString(storeName) + ")");
};

Native["com/sun/midp/rms/RecordStoreRegistry.stopAllRecordStoreListeners.(I)V"] = function(taskId) {
    console.warn("RecordStoreRegistry.stopAllRecordStoreListeners.(I)V not implemented (" + taskId + ")");
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.create.()V"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.create: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.create: ignored file");
        return;
    }

    var stat = fs.stat(pathname);

    if (stat !== null || !fs.create(pathname, new Blob())) {
        throw $.newIOException("error creating " + pathname);
    }
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.exists.()Z"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.exists: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.exists: ignored file");
        return 1;
    }

    var exists = fs.exists(pathname);
    DEBUG_FS && console.log("DefaultFileHandler.exists: " + exists);
    return exists ? 1 : 0;
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.isDirectory.()Z"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.isDirectory: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.isDirectory: ignored file");
        return 0;
    }

    var stat = fs.stat(pathname);
    var isDirectory = !!stat && stat.isDir;
    DEBUG_FS && console.log("DefaultFileHandler.isDirectory: " + isDirectory);
    return isDirectory ? 1 : 0;
}

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.delete.()V"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.delete: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.delete: ignored file");
        return;
    }

    if (!fs.remove(pathname)) {
        throw $.newIOException();
    }
};


Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.rename0.(Ljava/lang/String;)V"] = function(newName) {
    var pathname = J2ME.fromJavaString(this.nativePath);
    var newPathname = J2ME.fromJavaString(newName);
    DEBUG_FS && console.log("DefaultFileHandler.rename0: " + pathname + " to " + newPathname);

    if (fs.exists(newPathname)) {
        throw $.newIOException("file with new name exists");
    }

    if (!fs.rename(pathname, newPathname)) {
        throw $.newIOException("error renaming file");
    }
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.truncate.(J)V"] = function(byteOffset) {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.lastModified: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.lastModified: ignored file");
        return;
    }

    var stat = fs.stat(pathname);

    if (!stat) {
        throw $.newIOException("file does not exist");
    }

    if (stat.isDir) {
        throw $.newIOException("file is directory");
    }

    // TODO: If the file is open, flush it first.

    fs.truncate(pathname, byteOffset.toNumber());
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.fileSize.()J"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.fileSize: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.fileSize: ignored file");
        return Long.fromNumber(0);
    }

    return Long.fromNumber(fs.size(pathname));
};

addUnimplementedNative("com/sun/cdc/io/j2me/file/DefaultFileHandler.directorySize.(Z)J", Long.fromNumber(0));

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.canRead.()Z"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.canRead: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.canRead: ignored file");
        return 1;
    }

    return fs.exists(pathname) ? 1 : 0;
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.canWrite.()Z"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.canWrite: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.canWrite: ignored file");
        return 1;
    }

    return fs.exists(pathname) ? 1 : 0;
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.isHidden0.()Z"] = function() {
    // Per the comment in DefaultFileHandler.isHidden, we pretend we're Unix
    // and always return false.
    return 0;
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.setReadable.(Z)V"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.setReadable: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.setReadable: ignored file");
        return;
    }

    if (!fs.exists(pathname)) {
        throw $.newIOException("file does not exist");
    }

    // Otherwise this is a noop, as files are always readable in our filesystem.
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.setWritable.(Z)V"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.setWritable: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.setWritable: ignored file");
        return;
    }

    if (!fs.exists(pathname)) {
        throw $.newIOException("file does not exist");
    }

    // Otherwise this is a noop, as files are always writable in our filesystem.
};

addUnimplementedNative("com/sun/cdc/io/j2me/file/DefaultFileHandler.setHidden0.(Z)V");

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.mkdir.()V"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.mkdir: " + pathname);

    if (!fs.mkdir(pathname)) {
        throw $.newIOException("error creating " + pathname);
    };
};

// Pretend there is 1GiB in total and available.
addUnimplementedNative("com/sun/cdc/io/j2me/file/DefaultFileHandler.availableSize.()J",
                       Long.fromNumber(1024 * 1024 * 1024));
addUnimplementedNative("com/sun/cdc/io/j2me/file/DefaultFileHandler.totalSize.()J",
                       Long.fromNumber(1024 * 1024 * 1024));

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.lastModified.()J"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.lastModified: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.lastModified: ignored file");
        return Long.fromNumber(0);
    }

    var stat = fs.stat(pathname);
    return Long.fromNumber(stat != null ? stat.mtime : 0);
};

MIDP.markFileHandler = function(fileHandler, mode, state) {
    switch(mode) {
        case "read":
            fileHandler.isOpenForRead = state ? 1 : 0;
            break;
        case "write":
            fileHandler.isOpenForWrite = state ? 1 : 0;
            break;
    }
};

MIDP.openFileHandler = function(fileHandler, mode) {
    var pathname = J2ME.fromJavaString(fileHandler.nativePath);
    DEBUG_FS && console.log("MIDP.openFileHandler: " + pathname + " for " + mode);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("MIDP.openFileHandler: ignored file");
        return;
    }

    if (fileHandler.nativeDescriptor !== -1) {
        // The file is already open, so we only have to reset its position
        // and mark it as open.
        var fd = fileHandler.nativeDescriptor;
        fs.setpos(fd, 0);
        MIDP.markFileHandler(fileHandler, mode, true);
        return;
    }

    var stat = fs.stat(pathname);

    if (!stat) {
        throw $.newIOException("file does not exist");
    }

    if (stat.isDir) {
        throw $.newIOException("file is a directory");
    }

    var ctx = $.ctx;

    asyncImpl("V", new Promise(function(resolve, reject) {
        fs.open(pathname, function(fd) {
            if (fd === -1) {
              ctx.setAsCurrentContext();
              reject($.newIOException("Failed to open file handler for " + pathname));
              return;
            }
            fileHandler.nativeDescriptor = fd;
            MIDP.markFileHandler(fileHandler, mode, true);
            resolve();
        });
    }));
};

MIDP.closeFileHandler = function(fileHandler, mode) {
    var pathname = J2ME.fromJavaString(fileHandler.nativePath);
    DEBUG_FS && console.log("MIDP.closeFileHandler: " + pathname + " for " + mode);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("MIDP.closeFileHandler: ignored file");
        return;
    }

    MIDP.markFileHandler(fileHandler, mode, false);

    var isOpenForOtherMode;
    switch(mode) {
        case "read":
            isOpenForOtherMode = fileHandler.isOpenForWrite;
            break;
        case "write":
            isOpenForOtherMode = fileHandler.isOpenForRead;
            break;
    }

    // If the file isn't open for the other mode, but it still has a native
    // descriptor, then it's time to close the native file.  Otherwise, we leave
    // it open until it gets closed for the other mode.
    if (isOpenForOtherMode === 0 && fileHandler.nativeDescriptor !== -1) {
        fs.close(fileHandler.nativeDescriptor);
        fileHandler.nativeDescriptor = -1;
    }
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.openForRead.()V"] = function() {
    MIDP.openFileHandler(this, "read");
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.closeForRead.()V"] = function() {
    MIDP.closeFileHandler(this, "read");
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.openForWrite.()V"] = function() {
    MIDP.openFileHandler(this, "write");
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.closeForWrite.()V"] = function() {
    MIDP.closeFileHandler(this, "write");
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.closeForReadWrite.()V"] = function() {
    MIDP.closeFileHandler(this, "read");
    MIDP.closeFileHandler(this, "write");
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.read.([BII)I"] = function(b, off, len) {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.read: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.read: ignored file");
        return -1;
    }

    var fd = this.nativeDescriptor;

    if (off < 0 || len < 0 || off > b.byteLength || (b.byteLength - off) < len) {
        throw $.newIOException();
    }

    if (b.byteLength == 0 || len == 0) {
        return 0;
    }

    var curpos = fs.getpos(fd);
    var data = fs.read(fd, curpos, curpos + len);
    b.set(data, off);

    return (data.byteLength > 0) ? data.byteLength : -1;
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.write.([BII)I"] = function(b, off, len) {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.write: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.write: ignored file");
        return len;
    }

    var fd = this.nativeDescriptor;
    fs.write(fd, b.subarray(off, off + len));
    // The "length of data really written," which is always the length requested
    // in our implementation.
    return len;
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.positionForWrite.(J)V"] = function(offset) {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.positionForWrite: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.positionForWrite: ignored file");
        return;
    }

    var fd = this.nativeDescriptor;
    fs.setpos(fd, offset.toNumber());
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.flush.()V"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.flush: " + pathname);
    if (config.ignoredFiles.has(pathname)) {
        DEBUG_FS && console.log("DefaultFileHandler.flush: ignored file");
        return;
    }

    var fd = this.nativeDescriptor;
    fs.flush(fd);
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.close.()V"] = function() {
    DEBUG_FS && console.log("DefaultFileHandler.close: " + J2ME.fromJavaString(this.nativePath));

    MIDP.closeFileHandler(this, "read");
    MIDP.closeFileHandler(this, "write");
};

// Not implemented because we don't use native pointers, so we've commented out
// calls to this private method in DefaultFileHandler.
addUnimplementedNative("com/sun/cdc/io/j2me/file/DefaultFileHandler.getNativeName.(Ljava/lang/String;J)J",
                       Long.fromNumber(0));

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.getFileSeparator.()C"] = function() {
    return "/".charCodeAt(0);
}

MIDP.openDirs = new Map();
MIDP.openDirHandle = 0;

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.openDir.()J"] = function() {
    var pathname = J2ME.fromJavaString(this.nativePath);
    DEBUG_FS && console.log("DefaultFileHandler.openDir: " + pathname);

    try {
        var files = fs.list(pathname);
    } catch(ex) {
        if (ex.message == "Path does not exist") {
            throw $.newIOException("Directory does not exist: file://" + pathname);
        }
        if (ex.message == "Path is not a directory") {
            throw $.newIOException("Connection is open on a file: file://" + pathname);
        }
    }

    var openDirHandle = ++MIDP.openDirHandle;

    MIDP.openDirs.set(openDirHandle, {
        files: files,
        index: -1,
    });

    return Long.fromNumber(openDirHandle);
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.closeDir.(J)V"] = function(dirHandle) {
    MIDP.openDirs.delete(dirHandle.toNumber());
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.dirGetNextFile.(JZ)Ljava/lang/String;"] =
function(dirHandle, includeHidden) {
    var iterator = MIDP.openDirs.get(dirHandle.toNumber());
    var nextFile = iterator.files[++iterator.index];
DEBUG_FS && console.log(iterator.index + " " + nextFile);
    return nextFile ? J2ME.newString(nextFile) : null;
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.getNativePathForRoot.(Ljava/lang/String;)Ljava/lang/String;"] =
function(root) {
// XXX Ensure root is in MIDP.fsRoots?
DEBUG_FS && console.log("getNativePathForRoot: " + J2ME.fromJavaString(root));
    var nativePath = J2ME.newString("/" + J2ME.fromJavaString(root));
    return nativePath;
};

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.illegalFileNameChars0.()Ljava/lang/String;"] = function() {
    return J2ME.newString('<>:"\\|?');
};

addUnimplementedNative("com/sun/cdc/io/j2me/file/DefaultFileHandler.initialize.()V");

Native["com/sun/cdc/io/j2me/file/DefaultFileHandler.getSuiteIdString.(I)Ljava/lang/String;"] = function(id) {
DEBUG_FS && console.log("getSuiteIdString: " + id);
    // return J2ME.newString(id.toString());
    // The implementation adds this to the path of the file, presumably
    // to segregate files by midlet, but we only run a single midlet
    // per installation, so presumably we don't have to do that.
    return J2ME.newString("");
};

Native["com/sun/cdc/io/j2me/file/Protocol.available.()I"] = function() {
    var fd = this.fileHandler.nativeDescriptor;
    var available = fs.getsize(fd) - fs.getpos(fd);
    DEBUG_FS && console.log("Protocol.available: " + J2ME.fromJavaString(this.fileHandler.nativePath) + ": " + available);
    return available;
};

Native["com/sun/midp/io/j2me/storage/RandomAccessStream.open.(Ljava/lang/String;I)I"] = function(fileName, mode) {
    var path = "/" + J2ME.fromJavaString(fileName);

    var ctx = $.ctx;

    function open() {
        asyncImpl("I", new Promise(function(resolve, reject) {
            fs.open(path, function(fd) {
                if (fd == -1) {
                    ctx.setAsCurrentContext();
                    reject($.newIOException("RandomAccessStream::open(" + path + ") failed opening the file"));
                } else {
                    resolve(fd);
                }
            });
        }));
    }

    if (fs.exists(path)) {
        open();
    } else if (mode == 1) {
        throw $.newIOException("RandomAccessStream::open(" + path + ") file doesn't exist");
    } else if (fs.create(path, new Blob())) {
        open();
    } else {
        throw $.newIOException("RandomAccessStream::open(" + path + ") failed creating the file");
    }
};

Native["com/sun/midp/io/j2me/storage/RandomAccessStream.read.(I[BII)I"] =
function(handle, buffer, offset, length) {
    var from = fs.getpos(handle);
    var to = from + length;
    var readBytes = fs.read(handle, from, to);

    if (readBytes.byteLength <= 0) {
        return -1;
    }

    var subBuffer = buffer.subarray(offset, offset + readBytes.byteLength);
    for (var i = 0; i < readBytes.byteLength; i++) {
        subBuffer[i] = readBytes[i];
    }
    return readBytes.byteLength;
};

Native["com/sun/midp/io/j2me/storage/RandomAccessStream.write.(I[BII)V"] =
function(handle, buffer, offset, length) {
    fs.write(handle, buffer.subarray(offset, offset + length));
};

Native["com/sun/midp/io/j2me/storage/RandomAccessStream.commitWrite.(I)V"] = function(handle) {
    fs.flush(handle);
};

Native["com/sun/midp/io/j2me/storage/RandomAccessStream.position.(II)V"] = function(handle, position) {
    fs.setpos(handle, position);
};

Native["com/sun/midp/io/j2me/storage/RandomAccessStream.sizeOf.(I)I"] = function(handle) {
    var size = fs.getsize(handle);

    if (size == -1) {
        throw $.newIOException("RandomAccessStream::sizeOf(" + handle + ") failed");
    }

    return size;
};

Native["com/sun/midp/io/j2me/storage/RandomAccessStream.close.(I)V"] = function(handle) {
    fs.close(handle);
};

Native["javax/microedition/io/file/FileSystemRegistry.getRoots.()[Ljava/lang/String;"] = function() {
    var array = J2ME.newStringArray(MIDP.fsRoots.length);

    for (var i = 0; i < MIDP.fsRoots.length; i++) {
        array[i] = J2ME.newString(MIDP.fsRoots[i]);
    }

    return array;
};
