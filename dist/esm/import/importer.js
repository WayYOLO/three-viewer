function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { RunTaskAsync } from "../core/taskrunner.js";
import { FileSource, GetFileName } from "../io/fileutils.js";
import { RGBColor } from "../model/color.js";
import { ImporterFile, ImporterFileList } from "./importerfiles.js";
import { Importer3dm } from "./importer3dm.js";
import { Importer3ds } from "./importer3ds.js";
import { ImporterGltf } from "./importergltf.js";
import { ImporterIfc } from "./importerifc.js";
import { ImporterO3dv } from "./importero3dv.js";
import { ImporterObj } from "./importerobj.js";
import { ImporterOff } from "./importeroff.js";
import { ImporterPly } from "./importerply.js";
import { ImporterOcct } from "./importerocct.js";
import { ImporterStl } from "./importerstl.js";
import { ImporterBim } from "./importerbim.js";
import { ImporterThree3mf, ImporterThreeDae, ImporterThreeFbx, ImporterThreeWrl } from "./importerthree.js";
import * as fflate from 'fflate';
import { ImporterFcstd } from "./importerfcstd.js";
export var ImportSettings = /*#__PURE__*/_createClass(function ImportSettings() {
  _classCallCheck(this, ImportSettings);

  this.defaultColor = new RGBColor(200, 200, 200);
});
export var ImportErrorCode = {
  NoImportableFile: 1,
  FailedToLoadFile: 2,
  ImportFailed: 3,
  UnknownError: 4
};
export var ImportError = /*#__PURE__*/_createClass(function ImportError(code) {
  _classCallCheck(this, ImportError);

  this.code = code;
  this.mainFile = null;
  this.message = null;
});
export var ImportResult = /*#__PURE__*/_createClass(function ImportResult() {
  _classCallCheck(this, ImportResult);

  this.model = null;
  this.mainFile = null;
  this.upVector = null;
  this.usedFiles = null;
  this.missingFiles = null;
});
export var ImporterFileAccessor = /*#__PURE__*/function () {
  function ImporterFileAccessor(getBufferCallback) {
    _classCallCheck(this, ImporterFileAccessor);

    this.getBufferCallback = getBufferCallback;
    this.fileBuffers = new Map();
  }

  _createClass(ImporterFileAccessor, [{
    key: "GetFileBuffer",
    value: function GetFileBuffer(filePath) {
      var fileName = GetFileName(filePath);

      if (this.fileBuffers.has(fileName)) {
        return this.fileBuffers.get(fileName);
      }

      var buffer = this.getBufferCallback(fileName);
      this.fileBuffers.set(fileName, buffer);
      return buffer;
    }
  }]);

  return ImporterFileAccessor;
}();
export var Importer = /*#__PURE__*/function () {
  function Importer() {
    _classCallCheck(this, Importer);

    this.importers = [new ImporterObj(), new ImporterStl(), new ImporterOff(), new ImporterPly(), new Importer3ds(), new ImporterGltf(), new ImporterO3dv(), new ImporterBim(), new Importer3dm(), new ImporterIfc(), new ImporterOcct(), new ImporterFcstd(), new ImporterThreeFbx(), new ImporterThreeDae(), new ImporterThreeWrl(), new ImporterThree3mf()];
    this.fileList = new ImporterFileList();
    this.model = null;
    this.usedFiles = [];
    this.missingFiles = [];
  }

  _createClass(Importer, [{
    key: "AddImporter",
    value: function AddImporter(importer) {
      this.importers.push(importer);
    }
  }, {
    key: "ImportFiles",
    value: function ImportFiles(inputFiles, settings, callbacks) {
      var _this = this;

      callbacks.onLoadStart();
      this.LoadFiles(inputFiles, {
        onReady: function onReady() {
          callbacks.onImportStart();
          RunTaskAsync(function () {
            _this.DecompressArchives(_this.fileList, function () {
              _this.ImportLoadedFiles(settings, callbacks);
            });
          });
        },
        onFileListProgress: callbacks.onFileListProgress,
        onFileLoadProgress: callbacks.onFileLoadProgress
      });
    }
  }, {
    key: "LoadFiles",
    value: function LoadFiles(inputFiles, callbacks) {
      var newFileList = new ImporterFileList();
      newFileList.FillFromInputFiles(inputFiles);
      var reset = false;

      if (this.HasImportableFile(newFileList)) {
        reset = true;
      } else {
        var foundMissingFile = false;

        for (var i = 0; i < this.missingFiles.length; i++) {
          var missingFile = this.missingFiles[i];

          if (newFileList.ContainsFileByPath(missingFile)) {
            foundMissingFile = true;
          }
        }

        if (!foundMissingFile) {
          reset = true;
        } else {
          this.fileList.ExtendFromFileList(newFileList);
          reset = false;
        }
      }

      if (reset) {
        this.fileList = newFileList;
      }

      this.fileList.GetContent({
        onReady: callbacks.onReady,
        onFileListProgress: callbacks.onFileListProgress,
        onFileLoadProgress: callbacks.onFileLoadProgress
      });
    }
  }, {
    key: "ImportLoadedFiles",
    value: function ImportLoadedFiles(settings, callbacks) {
      var _this2 = this;

      var importableFiles = this.GetImportableFiles(this.fileList);

      if (importableFiles.length === 0) {
        callbacks.onImportError(new ImportError(ImportErrorCode.NoImportableFile));
        return;
      }

      if (importableFiles.length === 1 || !callbacks.onSelectMainFile) {
        var mainFile = importableFiles[0];
        this.ImportLoadedMainFile(mainFile, settings, callbacks);
      } else {
        var fileNames = importableFiles.map(function (importableFile) {
          return importableFile.file.name;
        });
        callbacks.onSelectMainFile(fileNames, function (mainFileIndex) {
          if (mainFileIndex === null) {
            callbacks.onImportError(new ImportError(ImportErrorCode.NoImportableFile));
            return;
          }

          RunTaskAsync(function () {
            var mainFile = importableFiles[mainFileIndex];

            _this2.ImportLoadedMainFile(mainFile, settings, callbacks);
          });
        });
      }
    }
  }, {
    key: "ImportLoadedMainFile",
    value: function ImportLoadedMainFile(mainFile, settings, callbacks) {
      var _this3 = this;

      if (mainFile === null || mainFile.file === null || mainFile.file.content === null) {
        var error = new ImportError(ImportErrorCode.FailedToLoadFile);

        if (mainFile !== null && mainFile.file !== null) {
          error.mainFile = mainFile.file.name;
        }

        callbacks.onImportError(error);
        return;
      }

      this.model = null;
      this.usedFiles = [];
      this.missingFiles = [];
      this.usedFiles.push(mainFile.file.name);
      var importer = mainFile.importer;
      var fileAccessor = new ImporterFileAccessor(function (fileName) {
        var fileBuffer = null;

        var file = _this3.fileList.FindFileByPath(fileName);

        if (file === null || file.content === null) {
          _this3.missingFiles.push(fileName);

          fileBuffer = null;
        } else {
          _this3.usedFiles.push(fileName);

          fileBuffer = file.content;
        }

        return fileBuffer;
      });
      importer.Import(mainFile.file.name, mainFile.file.extension, mainFile.file.content, {
        getDefaultMaterialColor: function getDefaultMaterialColor() {
          return settings.defaultColor;
        },
        getFileBuffer: function getFileBuffer(filePath) {
          return fileAccessor.GetFileBuffer(filePath);
        },
        onSuccess: function onSuccess() {
          _this3.model = importer.GetModel();
          var result = new ImportResult();
          result.mainFile = mainFile.file.name;
          result.model = _this3.model;
          result.usedFiles = _this3.usedFiles;
          result.missingFiles = _this3.missingFiles;
          result.upVector = importer.GetUpDirection();
          callbacks.onImportSuccess(result);
        },
        onError: function onError() {
          var error = new ImportError(ImportErrorCode.ImportFailed);
          error.mainFile = mainFile.file.name;
          error.message = importer.GetErrorMessage();
          callbacks.onImportError(error);
        },
        onComplete: function onComplete() {
          importer.Clear();
        }
      });
    }
  }, {
    key: "DecompressArchives",
    value: function DecompressArchives(fileList, onReady) {
      var files = fileList.GetFiles();
      var archives = [];

      var _iterator = _createForOfIteratorHelper(files),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _file = _step.value;

          if (_file.extension === 'zip') {
            archives.push(_file);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (archives.length === 0) {
        onReady();
        return;
      }

      for (var i = 0; i < archives.length; i++) {
        var archiveFile = archives[i];
        var archiveBuffer = new Uint8Array(archiveFile.content);
        var decompressed = fflate.unzipSync(archiveBuffer);

        for (var fileName in decompressed) {
          if (Object.prototype.hasOwnProperty.call(decompressed, fileName)) {
            var file = new ImporterFile(fileName, FileSource.Decompressed, null);
            file.SetContent(decompressed[fileName].buffer);
            fileList.AddFile(file);
          }
        }
      }

      onReady();
    }
  }, {
    key: "GetFileList",
    value: function GetFileList() {
      return this.fileList;
    }
  }, {
    key: "HasImportableFile",
    value: function HasImportableFile(fileList) {
      var importableFiles = this.GetImportableFiles(fileList);
      return importableFiles.length > 0;
    }
  }, {
    key: "GetImportableFiles",
    value: function GetImportableFiles(fileList) {
      function FindImporter(file, importers) {
        for (var importerIndex = 0; importerIndex < importers.length; importerIndex++) {
          var importer = importers[importerIndex];

          if (importer.CanImportExtension(file.extension)) {
            return importer;
          }
        }

        return null;
      }

      var importableFiles = [];
      var files = fileList.GetFiles();

      for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
        var file = files[fileIndex];
        var importer = FindImporter(file, this.importers);

        if (importer !== null) {
          importableFiles.push({
            file: file,
            importer: importer
          });
        }
      }

      return importableFiles;
    }
  }]);

  return Importer;
}();