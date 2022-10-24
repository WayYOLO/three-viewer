function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { ArrayBufferToUtf8String, Utf8StringToArrayBuffer } from "../io/bufferutils.js";
export var ExportedFile = /*#__PURE__*/function () {
  function ExportedFile(name) {
    _classCallCheck(this, ExportedFile);

    this.name = name;
    this.content = null;
  }

  _createClass(ExportedFile, [{
    key: "GetName",
    value: function GetName() {
      return this.name;
    }
  }, {
    key: "SetName",
    value: function SetName(name) {
      this.name = name;
    }
  }, {
    key: "GetTextContent",
    value: function GetTextContent() {
      var text = ArrayBufferToUtf8String(this.content);
      return text;
    }
  }, {
    key: "GetBufferContent",
    value: function GetBufferContent() {
      return this.content;
    }
  }, {
    key: "SetTextContent",
    value: function SetTextContent(content) {
      var buffer = Utf8StringToArrayBuffer(content);
      this.content = buffer;
    }
  }, {
    key: "SetBufferContent",
    value: function SetBufferContent(content) {
      this.content = content;
    }
  }]);

  return ExportedFile;
}();
export var ExporterBase = /*#__PURE__*/function () {
  function ExporterBase() {
    _classCallCheck(this, ExporterBase);
  }

  _createClass(ExporterBase, [{
    key: "CanExport",
    value: function CanExport(format, extension) {
      return false;
    }
  }, {
    key: "Export",
    value: function Export(exporterModel, format, onFinish) {
      var files = [];
      this.ExportContent(exporterModel, format, files, function () {
        onFinish(files);
      });
    }
  }, {
    key: "ExportContent",
    value: function ExportContent(exporterModel, format, files, onFinish) {}
  }, {
    key: "GetExportedMaterialName",
    value: function GetExportedMaterialName(originalName) {
      return this.GetExportedName(originalName, 'Material');
    }
  }, {
    key: "GetExportedMeshName",
    value: function GetExportedMeshName(originalName) {
      return this.GetExportedName(originalName, 'Mesh');
    }
  }, {
    key: "GetExportedName",
    value: function GetExportedName(originalName, defaultName) {
      if (originalName.length === 0) {
        return defaultName;
      }

      return originalName;
    }
  }]);

  return ExporterBase;
}();