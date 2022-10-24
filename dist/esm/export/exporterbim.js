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

import { FileFormat } from "../io/fileutils.js";
import { ColorComponentFromFloat } from "../model/color.js";
import { PropertyToString } from "../model/property.js";
import { ExportedFile, ExporterBase } from "./exporterbase.js";

function GenerateGuid() {
  // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
  var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return template.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

export var ExporterBim = /*#__PURE__*/function (_ExporterBase) {
  _inherits(ExporterBim, _ExporterBase);

  var _super = _createSuper(ExporterBim);

  function ExporterBim() {
    _classCallCheck(this, ExporterBim);

    return _super.call(this);
  }

  _createClass(ExporterBim, [{
    key: "CanExport",
    value: function CanExport(format, extension) {
      return format === FileFormat.Text && extension === 'bim';
    }
  }, {
    key: "ExportContent",
    value: function ExportContent(exporterModel, format, files, onFinish) {
      var _this = this;

      var bimContent = {
        schema_version: '1.0.0',
        meshes: [],
        elements: [],
        info: {}
      };
      this.ExportProperties(exporterModel.GetModel(), bimContent.info);
      var meshId = 0;
      exporterModel.EnumerateTransformedMeshes(function (mesh) {
        var bimMesh = {
          mesh_id: meshId,
          coordinates: [],
          indices: []
        };
        mesh.EnumerateVertices(function (vertex) {
          bimMesh.coordinates.push(vertex.x, vertex.y, vertex.z);
        });
        mesh.EnumerateTriangleVertexIndices(function (v0, v1, v2) {
          bimMesh.indices.push(v0, v1, v2);
        });
        var bimElement = {
          mesh_id: meshId,
          type: 'Other',
          color: {
            r: 200,
            g: 200,
            b: 200,
            a: 255
          },
          vector: {
            x: 0.0,
            y: 0.0,
            z: 0.0
          },
          rotation: {
            qx: 0.0,
            qy: 0.0,
            qz: 0.0,
            qw: 1.0
          },
          guid: GenerateGuid(),
          info: {}
        };
        var defaultColor = null;
        var hasOnlyOneColor = true;
        var faceColors = [];

        for (var i = 0; i < mesh.TriangleCount(); i++) {
          var triangle = mesh.GetTriangle(i);
          var material = exporterModel.GetMaterial(triangle.mat);
          var faceColor = {
            r: material.color.r,
            g: material.color.g,
            b: material.color.b,
            a: ColorComponentFromFloat(material.opacity)
          };
          faceColors.push(faceColor.r, faceColor.g, faceColor.b, faceColor.a);

          if (hasOnlyOneColor) {
            if (defaultColor === null) {
              defaultColor = faceColor;
            } else {
              if (defaultColor.r !== faceColor.r || defaultColor.g !== faceColor.g || defaultColor.b !== faceColor.b || defaultColor.a !== faceColor.a) {
                hasOnlyOneColor = false;
                defaultColor = null;
              }
            }
          }
        }

        if (hasOnlyOneColor) {
          bimElement.color = defaultColor;
        } else {
          bimElement.face_colors = faceColors;
        }

        bimElement.info['Name'] = mesh.GetName();

        _this.ExportProperties(mesh, bimElement.info);

        bimContent.meshes.push(bimMesh);
        bimContent.elements.push(bimElement);
        meshId += 1;
      });
      var bimFile = new ExportedFile('model.bim');
      bimFile.SetTextContent(JSON.stringify(bimContent, null, 4));
      files.push(bimFile);
      onFinish();
    }
  }, {
    key: "ExportProperties",
    value: function ExportProperties(element, targetObject) {
      for (var groupIndex = 0; groupIndex < element.PropertyGroupCount(); groupIndex++) {
        var group = element.GetPropertyGroup(groupIndex);

        for (var propertyIndex = 0; propertyIndex < group.PropertyCount(); propertyIndex++) {
          var property = group.GetProperty(propertyIndex);
          targetObject[property.name] = PropertyToString(property);
        }
      }
    }
  }]);

  return ExporterBim;
}(ExporterBase);