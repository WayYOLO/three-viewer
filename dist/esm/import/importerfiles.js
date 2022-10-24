function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { RunTasks } from "../core/taskrunner.js";
import { FileSource, GetFileExtension, GetFileName, ReadFile, RequestUrl } from "../io/fileutils.js";
export var InputFile = /*#__PURE__*/_createClass(function InputFile(name, source, data) {
  _classCallCheck(this, InputFile);

  this.name = name;
  this.source = source;
  this.data = data;
});
export function InputFilesFromUrls(urls) {
  var inputFiles = [];

  var _iterator = _createForOfIteratorHelper(urls),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var url = _step.value;
      var fileName = GetFileName(url);
      inputFiles.push(new InputFile(fileName, FileSource.Url, url));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return inputFiles;
}
export function InputFilesFromFileObjects(fileObjects) {
  var inputFiles = [];

  var _iterator2 = _createForOfIteratorHelper(fileObjects),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var fileObject = _step2.value;
      var fileName = GetFileName(fileObject.name);
      inputFiles.push(new InputFile(fileName, FileSource.File, fileObject));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return inputFiles;
}
export var ImporterFile = /*#__PURE__*/function () {
  function ImporterFile(name, source, data) {
    _classCallCheck(this, ImporterFile);

    this.name = GetFileName(name);
    this.extension = GetFileExtension(name);
    this.source = source;
    this.data = data;
    this.content = null;
  }

  _createClass(ImporterFile, [{
    key: "SetContent",
    value: function SetContent(content) {
      this.content = content;
    }
  }]);

  return ImporterFile;
}();
export var ImporterFileList = /*#__PURE__*/function () {
  function ImporterFileList() {
    _classCallCheck(this, ImporterFileList);

    this.files = [];
  }

  _createClass(ImporterFileList, [{
    key: "FillFromInputFiles",
    value: function FillFromInputFiles(inputFiles) {
      this.files = [];

      var _iterator3 = _createForOfIteratorHelper(inputFiles),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var inputFile = _step3.value;
          var file = new ImporterFile(inputFile.name, inputFile.source, inputFile.data);
          this.files.push(file);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "ExtendFromFileList",
    value: function ExtendFromFileList(fileList) {
      var files = fileList.GetFiles();

      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        if (!this.ContainsFileByPath(file.name)) {
          this.files.push(file);
        }
      }
    }
  }, {
    key: "GetFiles",
    value: function GetFiles() {
      return this.files;
    }
  }, {
    key: "GetContent",
    value: function GetContent(callbacks) {
      var _this = this;

      RunTasks(this.files.length, {
        runTask: function runTask(index, onTaskComplete) {
          callbacks.onFileListProgress(index, _this.files.length);

          _this.GetFileContent(_this.files[index], {
            onReady: onTaskComplete,
            onProgress: callbacks.onFileLoadProgress
          });
        },
        onReady: callbacks.onReady
      });
    }
  }, {
    key: "ContainsFileByPath",
    value: function ContainsFileByPath(filePath) {
      return this.FindFileByPath(filePath) !== null;
    }
  }, {
    key: "FindFileByPath",
    value: function FindFileByPath(filePath) {
      var fileName = GetFileName(filePath).toLowerCase();

      for (var fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
        var file = this.files[fileIndex];

        if (file.name.toLowerCase() === fileName) {
          return file;
        }
      }

      return null;
    }
  }, {
    key: "IsOnlyUrlSource",
    value: function IsOnlyUrlSource() {
      if (this.files.length === 0) {
        return false;
      }

      for (var i = 0; i < this.files.length; i++) {
        var file = this.files[i];

        if (file.source !== FileSource.Url && file.source !== FileSource.Decompressed) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "AddFile",
    value: function AddFile(file) {
      this.files.push(file);
    }
  }, {
    key: "GetFileContent",
    value: function GetFileContent(file, callbacks) {
      if (file.content !== null) {
        callbacks.onReady();
        return;
      }

      var loaderPromise = null;

      if (file.source === FileSource.Url) {
        loaderPromise = RequestUrl(file.data, callbacks.onProgress);
      } else if (file.source === FileSource.File) {
        loaderPromise = ReadFile(file.data, callbacks.onProgress);
      } else {
        callbacks.onReady();
        return;
      }

      loaderPromise.then(function (content) {
        file.SetContent(content);
      }).catch(function () {}).finally(function () {
        callbacks.onReady();
      });
    }
  }]);

  return ImporterFileList;
}();