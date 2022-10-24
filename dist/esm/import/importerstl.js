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
import { Direction, IsPositive } from "../geometry/geometry.js";
import { BinaryReader } from "../io/binaryreader.js";
import { ArrayBufferToUtf8String } from "../io/bufferutils.js";
import { Mesh } from "../model/mesh.js";
import { Triangle } from "../model/triangle.js";
import { ImporterBase } from "./importerbase.js";
import { NameFromLine, ParametersFromLine, ReadLines } from "./importerutils.js";
export var ImporterStl = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterStl, _ImporterBase);

  var _super = _createSuper(ImporterStl);

  function ImporterStl() {
    _classCallCheck(this, ImporterStl);

    return _super.call(this);
  }

  _createClass(ImporterStl, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'stl';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Z;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      this.mesh = null;
      this.triangle = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.mesh = new Mesh();
      this.model.AddMeshToRootNode(this.mesh);
      this.triangle = null;
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      var _this = this;

      if (this.IsBinaryStlFile(fileContent)) {
        this.ProcessBinary(fileContent);
      } else {
        var textContent = ArrayBufferToUtf8String(fileContent);
        ReadLines(textContent, function (line) {
          if (!_this.WasError()) {
            _this.ProcessLine(line);
          }
        });
      }

      onFinish();
    }
  }, {
    key: "IsBinaryStlFile",
    value: function IsBinaryStlFile(fileContent) {
      var byteLength = fileContent.byteLength;

      if (byteLength < 84) {
        return false;
      }

      var reader = new BinaryReader(fileContent, true);
      reader.Skip(80);
      var triangleCount = reader.ReadUnsignedInteger32();

      if (byteLength !== triangleCount * 50 + 84) {
        return false;
      }

      return true;
    }
  }, {
    key: "ProcessLine",
    value: function ProcessLine(line) {
      if (line[0] === '#') {
        return;
      }

      var parameters = ParametersFromLine(line, '#');

      if (parameters.length === 0) {
        return;
      }

      var keyword = parameters[0];

      if (keyword === 'solid') {
        if (parameters.length > 1) {
          var name = NameFromLine(line, keyword.length, '#');
          this.mesh.SetName(name);
        }

        return;
      }

      if (keyword === 'facet') {
        this.triangle = new Triangle(-1, -1, -1);

        if (parameters.length >= 5 && parameters[1] === 'normal') {
          var normalVector = new Coord3D(parseFloat(parameters[2]), parseFloat(parameters[3]), parseFloat(parameters[4]));

          if (IsPositive(normalVector.Length())) {
            var normalIndex = this.mesh.AddNormal(normalVector);
            this.triangle.SetNormals(normalIndex, normalIndex, normalIndex);
          }
        }

        return;
      }

      if (keyword === 'vertex' && this.triangle !== null) {
        if (parameters.length >= 4) {
          var vertexIndex = this.mesh.AddVertex(new Coord3D(parseFloat(parameters[1]), parseFloat(parameters[2]), parseFloat(parameters[3])));

          if (this.triangle.v0 === -1) {
            this.triangle.v0 = vertexIndex;
          } else if (this.triangle.v1 === -1) {
            this.triangle.v1 = vertexIndex;
          } else if (this.triangle.v2 === -1) {
            this.triangle.v2 = vertexIndex;
          }
        }

        return;
      }

      if (keyword === 'endfacet' && this.triangle !== null) {
        if (this.triangle.v0 !== -1 && this.triangle.v1 !== -1 && this.triangle.v2 !== null) {
          this.mesh.AddTriangle(this.triangle);
        }

        this.triangle = null;
        return;
      }
    }
  }, {
    key: "ProcessBinary",
    value: function ProcessBinary(fileContent) {
      function ReadVector(reader) {
        var coord = new Coord3D();
        coord.x = reader.ReadFloat32();
        coord.y = reader.ReadFloat32();
        coord.z = reader.ReadFloat32();
        return coord;
      }

      function AddVertex(mesh, reader) {
        var coord = ReadVector(reader);
        return mesh.AddVertex(coord);
      }

      var reader = new BinaryReader(fileContent, true);
      reader.Skip(80);
      var triangleCount = reader.ReadUnsignedInteger32();

      for (var i = 0; i < triangleCount; i++) {
        var normalVector = ReadVector(reader);
        var v0 = AddVertex(this.mesh, reader);
        var v1 = AddVertex(this.mesh, reader);
        var v2 = AddVertex(this.mesh, reader);
        reader.Skip(2);
        var triangle = new Triangle(v0, v1, v2);

        if (IsPositive(normalVector.Length())) {
          var normal = this.mesh.AddNormal(normalVector);
          triangle.SetNormals(normal, normal, normal);
        }

        this.mesh.AddTriangle(triangle);
      }
    }
  }]);

  return ImporterStl;
}(ImporterBase);