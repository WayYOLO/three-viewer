function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Direction } from "../geometry/geometry.js";
import { Importer } from "../import/importer.js";
import { RevokeObjectUrl } from "../io/bufferutils.js";
import { ConvertModelToThreeObject, ModelToThreeConversionOutput, ModelToThreeConversionParams } from "./threeconverter.js";
import { ConvertColorToThreeColor, HasHighpDriverIssue } from "./threeutils.js";
import * as THREE from 'three';
export var ThreeModelLoader = /*#__PURE__*/function () {
  function ThreeModelLoader() {
    _classCallCheck(this, ThreeModelLoader);

    this.importer = new Importer();
    this.inProgress = false;
    this.defaultMaterial = null;
    this.objectUrls = null;
    this.hasHighpDriverIssue = HasHighpDriverIssue();
  }

  _createClass(ThreeModelLoader, [{
    key: "InProgress",
    value: function InProgress() {
      return this.inProgress;
    }
  }, {
    key: "LoadModel",
    value: function LoadModel(inputFiles, settings, callbacks) {
      var _this = this;

      if (this.inProgress) {
        return;
      }

      this.inProgress = true;
      this.RevokeObjectUrls();
      this.importer.ImportFiles(inputFiles, settings, {
        onLoadStart: function onLoadStart() {
          callbacks.onLoadStart();
        },
        onFileListProgress: function onFileListProgress(current, total) {
          callbacks.onFileListProgress(current, total);
        },
        onFileLoadProgress: function onFileLoadProgress(current, total) {
          callbacks.onFileLoadProgress(current, total);
        },
        onImportStart: function onImportStart() {
          callbacks.onImportStart();
        },
        onSelectMainFile: function onSelectMainFile(fileNames, selectFile) {
          if (!callbacks.onSelectMainFile) {
            selectFile(0);
          } else {
            callbacks.onSelectMainFile(fileNames, selectFile);
          }
        },
        onImportSuccess: function onImportSuccess(importResult) {
          callbacks.onVisualizationStart();
          var params = new ModelToThreeConversionParams();
          params.forceMediumpForMaterials = _this.hasHighpDriverIssue;
          var output = new ModelToThreeConversionOutput();
          ConvertModelToThreeObject(importResult.model, params, output, {
            onTextureLoaded: function onTextureLoaded() {
              callbacks.onTextureLoaded();
            },
            onModelLoaded: function onModelLoaded(threeObject) {
              _this.defaultMaterial = output.defaultMaterial;
              _this.objectUrls = output.objectUrls;

              if (importResult.upVector === Direction.X) {
                var rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0.0, 0.0, 1.0), Math.PI / 2.0);
                threeObject.quaternion.multiply(rotation);
              } else if (importResult.upVector === Direction.Z) {
                var _rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1.0, 0.0, 0.0), -Math.PI / 2.0);

                threeObject.quaternion.multiply(_rotation);
              }

              callbacks.onModelFinished(importResult, threeObject);
              _this.inProgress = false;
            }
          });
        },
        onImportError: function onImportError(importError) {
          callbacks.onLoadError(importError);
          _this.inProgress = false;
        }
      });
    }
  }, {
    key: "GetImporter",
    value: function GetImporter() {
      return this.importer;
    }
  }, {
    key: "GetDefaultMaterial",
    value: function GetDefaultMaterial() {
      return this.defaultMaterial;
    }
  }, {
    key: "ReplaceDefaultMaterialColor",
    value: function ReplaceDefaultMaterialColor(defaultColor) {
      if (this.defaultMaterial !== null && !this.defaultMaterial.vertexColors) {
        this.defaultMaterial.color = ConvertColorToThreeColor(defaultColor);
      }
    }
  }, {
    key: "RevokeObjectUrls",
    value: function RevokeObjectUrls() {
      if (this.objectUrls === null) {
        return;
      }

      var _iterator = _createForOfIteratorHelper(this.objectUrls),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var objectUrl = _step.value;
          RevokeObjectUrl(objectUrl);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.objectUrls = null;
    }
  }]);

  return ThreeModelLoader;
}();