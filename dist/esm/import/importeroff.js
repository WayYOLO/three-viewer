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

import { Coord3D } from "../geometry/coord3d.js";
import { Direction } from "../geometry/geometry.js";
import { ArrayBufferToUtf8String } from "../io/bufferutils.js";
import { RGBColor, ColorComponentFromFloat } from "../model/color.js";
import { Mesh } from "../model/mesh.js";
import { Triangle } from "../model/triangle.js";
import { ImporterBase } from "./importerbase.js";
import { ColorToMaterialConverter, ParametersFromLine, ReadLines } from "./importerutils.js";
export var ImporterOff = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterOff, _ImporterBase);

  var _super = _createSuper(ImporterOff);

  function ImporterOff() {
    _classCallCheck(this, ImporterOff);

    return _super.call(this);
  }

  _createClass(ImporterOff, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'off';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Y;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      this.mesh = null;
      this.status = null;
      this.colorToMaterial = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.mesh = new Mesh();
      this.model.AddMeshToRootNode(this.mesh);
      this.status = {
        vertexCount: 0,
        faceCount: 0,
        foundVertex: 0,
        foundFace: 0
      };
      this.colorToMaterial = new ColorToMaterialConverter(this.model);
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      var _this = this;

      var textContent = ArrayBufferToUtf8String(fileContent);
      ReadLines(textContent, function (line) {
        if (!_this.WasError()) {
          _this.ProcessLine(line);
        }
      });
      onFinish();
    }
  }, {
    key: "ProcessLine",
    value: function ProcessLine(line) {
      function CreateColorComponent(str) {
        if (str.indexOf('.') !== -1) {
          return ColorComponentFromFloat(parseFloat(str));
        } else {
          return parseInt(str, 10);
        }
      }

      if (line[0] === '#') {
        return;
      }

      var parameters = ParametersFromLine(line, '#');

      if (parameters.length === 0) {
        return;
      }

      if (parameters[0] === 'OFF') {
        return;
      }

      if (this.status.vertexCount === 0 && this.status.faceCount === 0) {
        if (parameters.length > 1) {
          this.status.vertexCount = parseInt(parameters[0], 10);
          this.status.faceCount = parseInt(parameters[1], 10);
        }

        return;
      }

      if (this.status.foundVertex < this.status.vertexCount) {
        if (parameters.length >= 3) {
          this.mesh.AddVertex(new Coord3D(parseFloat(parameters[0]), parseFloat(parameters[1]), parseFloat(parameters[2])));
          this.status.foundVertex += 1;
        }

        if (parameters.length >= 6) {
          this.mesh.AddVertexColor(new RGBColor(CreateColorComponent(parameters[3]), CreateColorComponent(parameters[4]), CreateColorComponent(parameters[5])));
        }

        return;
      }

      var hasVertexColors = this.mesh.VertexCount() === this.mesh.VertexColorCount();

      if (this.status.foundFace < this.status.faceCount) {
        if (parameters.length >= 4) {
          var vertexCount = parseInt(parameters[0], 10);

          if (parameters.length < vertexCount + 1) {
            return;
          }

          var materialIndex = null;

          if (!hasVertexColors && parameters.length >= vertexCount + 4) {
            var color = new RGBColor(CreateColorComponent(parameters[vertexCount + 1]), CreateColorComponent(parameters[vertexCount + 2]), CreateColorComponent(parameters[vertexCount + 3]));
            materialIndex = this.colorToMaterial.GetMaterialIndex(color.r, color.g, color.b);
          }

          for (var i = 0; i < vertexCount - 2; i++) {
            var v0 = parseInt(parameters[1]);
            var v1 = parseInt(parameters[i + 2]);
            var v2 = parseInt(parameters[i + 3]);
            var triangle = new Triangle(v0, v1, v2);

            if (hasVertexColors) {
              triangle.SetVertexColors(v0, v1, v2);
            } else {
              triangle.SetMaterial(materialIndex);
            }

            this.mesh.AddTriangle(triangle);
          }

          this.status.foundFace += 1;
        }

        return;
      }
    }
  }]);

  return ImporterOff;
}(ImporterBase);