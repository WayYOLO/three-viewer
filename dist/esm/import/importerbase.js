function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Direction } from "../geometry/geometry.js";
import { Model } from "../model/model.js";
import { FinalizeModel } from "../model/modelfinalization.js";
import { IsModelEmpty } from "../model/modelutils.js";
export var ImporterBase = /*#__PURE__*/function () {
  function ImporterBase() {
    _classCallCheck(this, ImporterBase);

    this.name = null;
    this.extension = null;
    this.callbacks = null;
    this.model = null;
    this.error = null;
    this.message = null;
  }

  _createClass(ImporterBase, [{
    key: "Import",
    value: function Import(name, extension, content, callbacks) {
      var _this = this;

      this.Clear();
      this.name = name;
      this.extension = extension;
      this.callbacks = callbacks;
      this.model = new Model();
      this.error = false;
      this.message = null;
      this.ResetContent();
      this.ImportContent(content, function () {
        _this.CreateResult(callbacks);
      });
    }
  }, {
    key: "Clear",
    value: function Clear() {
      this.name = null;
      this.extension = null;
      this.callbacks = null;
      this.model = null;
      this.error = null;
      this.message = null;
      this.ClearContent();
    }
  }, {
    key: "CreateResult",
    value: function CreateResult(callbacks) {
      if (this.error) {
        callbacks.onError();
        callbacks.onComplete();
        return;
      }

      if (IsModelEmpty(this.model)) {
        this.SetError('The model doesn\'t contain any meshes.');
        callbacks.onError();
        callbacks.onComplete();
        return;
      }

      FinalizeModel(this.model, {
        getDefaultMaterialColor: this.callbacks.getDefaultMaterialColor
      });
      callbacks.onSuccess();
      callbacks.onComplete();
    }
  }, {
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return false;
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Z;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {}
  }, {
    key: "ResetContent",
    value: function ResetContent() {}
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {}
  }, {
    key: "GetModel",
    value: function GetModel() {
      return this.model;
    }
  }, {
    key: "SetError",
    value: function SetError(message) {
      this.error = true;

      if (message !== undefined && message !== null) {
        this.message = message;
      }
    }
  }, {
    key: "WasError",
    value: function WasError() {
      return this.error;
    }
  }, {
    key: "GetErrorMessage",
    value: function GetErrorMessage() {
      return this.message;
    }
  }]);

  return ImporterBase;
}();