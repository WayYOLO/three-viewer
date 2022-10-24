function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import { LoadExternalLibrary } from "../io/externallibs.js";
import { FileFormat } from "../io/fileutils.js";
import { MaterialType } from "../model/material.js";
import { ConvertMeshToMeshBuffer } from "../model/meshbuffer.js";
import { ExportedFile, ExporterBase } from "./exporterbase.js";
export var Exporter3dm = /*#__PURE__*/function (_ExporterBase) {
  _inherits(Exporter3dm, _ExporterBase);

  var _super = _createSuper(Exporter3dm);

  function Exporter3dm() {
    var _this;

    _classCallCheck(this, Exporter3dm);

    _this = _super.call(this);
    _this.rhino = null;
    return _this;
  }

  _createClass(Exporter3dm, [{
    key: "CanExport",
    value: function CanExport(format, extension) {
      return format === FileFormat.Binary && extension === '3dm';
    }
  }, {
    key: "ExportContent",
    value: function ExportContent(exporterModel, format, files, onFinish) {
      var _this2 = this;

      if (this.rhino === null) {
        LoadExternalLibrary('loaders/rhino3dm.min.js').then(function () {
          rhino3dm().then(function (rhino) {
            _this2.rhino = rhino;

            _this2.ExportRhinoContent(exporterModel, files, onFinish);
          });
        }).catch(function () {
          onFinish();
        });
      } else {
        this.ExportRhinoContent(exporterModel, files, onFinish);
      }
    }
  }, {
    key: "ExportRhinoContent",
    value: function ExportRhinoContent(exporterModel, files, onFinish) {
      var _this3 = this;

      function ColorToRhinoColor(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: 255
        };
      }

      var rhinoFile = new ExportedFile('model.3dm');
      files.push(rhinoFile);
      var rhinoDoc = new this.rhino.File3dm();
      exporterModel.EnumerateTransformedMeshes(function (mesh) {
        var meshBuffer = ConvertMeshToMeshBuffer(mesh);

        for (var primitiveIndex = 0; primitiveIndex < meshBuffer.PrimitiveCount(); primitiveIndex++) {
          var primitive = meshBuffer.GetPrimitive(primitiveIndex);
          var threeJson = {
            data: {
              attributes: {
                position: {
                  itemSize: 3,
                  type: 'Float32Array',
                  array: primitive.vertices
                },
                normal: {
                  itemSize: 3,
                  type: 'Float32Array',
                  array: primitive.normals
                }
              },
              index: {
                type: 'Uint16Array',
                array: primitive.indices
              }
            }
          };
          var material = exporterModel.GetMaterial(primitive.material);
          var rhinoMaterial = new _this3.rhino.Material();
          rhinoMaterial.name = _this3.GetExportedMaterialName(material.name);

          if (material.type === MaterialType.Phong) {
            rhinoMaterial.ambientColor = ColorToRhinoColor(material.ambient);
            rhinoMaterial.specularColor = ColorToRhinoColor(material.specular);
          }

          rhinoMaterial.diffuseColor = ColorToRhinoColor(material.color);
          rhinoMaterial.transparency = 1.0 - material.opacity;
          var rhinoMaterialIndex = rhinoDoc.materials().count();
          rhinoDoc.materials().add(rhinoMaterial);
          var rhinoMesh = new _this3.rhino.Mesh.createFromThreejsJSON(threeJson);
          var rhinoAttributes = new _this3.rhino.ObjectAttributes();
          rhinoAttributes.name = _this3.GetExportedMeshName(mesh.GetName());
          rhinoAttributes.materialSource = _this3.rhino.ObjectMaterialSource.MaterialFromObject;
          rhinoAttributes.materialIndex = rhinoMaterialIndex;
          rhinoDoc.objects().add(rhinoMesh, rhinoAttributes);
        }
      });
      var writeOptions = new this.rhino.File3dmWriteOptions();
      writeOptions.version = 6;
      var rhinoDocBuffer = rhinoDoc.toByteArray(writeOptions);
      rhinoFile.SetBufferContent(rhinoDocBuffer);
      onFinish();
    }
  }]);

  return Exporter3dm;
}(ExporterBase);