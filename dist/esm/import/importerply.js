function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Coord3D } from "../geometry/coord3d.js";
import { Direction } from "../geometry/geometry.js";
import { BinaryReader } from "../io/binaryreader.js";
import { ArrayBufferToUtf8String } from "../io/bufferutils.js";
import { RGBColor, IntegerToHexString } from "../model/color.js";
import { PhongMaterial } from "../model/material.js";
import { Mesh } from "../model/mesh.js";
import { Triangle } from "../model/triangle.js";
import { ImporterBase } from "./importerbase.js";
import { ParametersFromLine, ReadLines, UpdateMaterialTransparency } from "./importerutils.js";
var PlyHeaderCheckResult = {
  Ok: 1,
  NoVertices: 2,
  NoFaces: 3,
  UnknownError: 4
};

var PlyHeader = /*#__PURE__*/function () {
  function PlyHeader() {
    _classCallCheck(this, PlyHeader);

    this.format = null;
    this.elements = [];
  }

  _createClass(PlyHeader, [{
    key: "SetFormat",
    value: function SetFormat(format) {
      this.format = format;
    }
  }, {
    key: "AddElement",
    value: function AddElement(name, count) {
      this.elements.push({
        name: name,
        count: count,
        format: []
      });
    }
  }, {
    key: "GetElements",
    value: function GetElements() {
      return this.elements;
    }
  }, {
    key: "AddSingleFormat",
    value: function AddSingleFormat(elemType, name) {
      var lastElement = this.elements[this.elements.length - 1];
      lastElement.format.push({
        name: name,
        isSingle: true,
        elemType: elemType
      });
    }
  }, {
    key: "AddListFormat",
    value: function AddListFormat(countType, elemType, name) {
      var lastElement = this.elements[this.elements.length - 1];
      lastElement.format.push({
        name: name,
        isSingle: false,
        countType: countType,
        elemType: elemType
      });
    }
  }, {
    key: "GetElement",
    value: function GetElement(name) {
      for (var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];

        if (element.name === name) {
          return element;
        }
      }

      return null;
    }
  }, {
    key: "Check",
    value: function Check() {
      var vertex = this.GetElement('vertex');

      if (vertex === null || vertex.length === 0 || vertex.format.length < 3) {
        return PlyHeaderCheckResult.NoVertices;
      }

      var face = this.GetElement('face');

      if (this.format === 'ascii') {
        if (face === null || face.count === 0 || face.format.length < 0) {
          return PlyHeaderCheckResult.NoFaces;
        }
      } else if (this.format === 'binary_little_endian' || this.format === 'binary_big_endian') {
        var triStrips = this.GetElement('tristrips');
        var hasFaces = face !== null && face.count > 0 && face.format.length > 0;
        var hasTriStrips = triStrips !== null && triStrips.count > 0 && triStrips.format.length > 0;

        if (!hasFaces && !hasTriStrips) {
          return PlyHeaderCheckResult.NoFaces;
        }
      } else {
        return PlyHeaderCheckResult.UnknownError;
      }

      return PlyHeaderCheckResult.Ok;
    }
  }]);

  return PlyHeader;
}();

var PlyMaterialHandler = /*#__PURE__*/function () {
  function PlyMaterialHandler(model) {
    _classCallCheck(this, PlyMaterialHandler);

    this.model = model;
    this.colorToMaterial = new Map();
  }

  _createClass(PlyMaterialHandler, [{
    key: "GetMaterialIndexByColor",
    value: function GetMaterialIndexByColor(color) {
      var materialName = 'Color ' + IntegerToHexString(color[0]) + IntegerToHexString(color[1]) + IntegerToHexString(color[2]) + IntegerToHexString(color[3]);

      if (this.colorToMaterial.has(materialName)) {
        return this.colorToMaterial.get(materialName);
      } else {
        var material = new PhongMaterial();
        material.name = materialName;
        material.color = new RGBColor(color[0], color[1], color[2]);
        material.opacity = color[3] / 255.0;
        UpdateMaterialTransparency(material);
        var materialIndex = this.model.AddMaterial(material);
        this.colorToMaterial.set(materialName, materialIndex);
        return materialIndex;
      }
    }
  }]);

  return PlyMaterialHandler;
}();

export var ImporterPly = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterPly, _ImporterBase);

  var _super = _createSuper(ImporterPly);

  function ImporterPly() {
    _classCallCheck(this, ImporterPly);

    return _super.call(this);
  }

  _createClass(ImporterPly, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'ply';
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
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.mesh = new Mesh();
      this.model.AddMeshToRootNode(this.mesh);
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      var headerString = this.GetHeaderContent(fileContent);
      var header = this.ReadHeader(headerString);
      var checkResult = header.Check();

      if (checkResult === PlyHeaderCheckResult.Ok) {
        if (header.format === 'ascii') {
          var contentString = ArrayBufferToUtf8String(fileContent);
          contentString = contentString.substring(headerString.length);
          this.ReadAsciiContent(header, contentString);
        } else if (header.format === 'binary_little_endian' || header.format === 'binary_big_endian') {
          this.ReadBinaryContent(header, fileContent, headerString.length);
        }
      } else {
        if (checkResult === PlyHeaderCheckResult.NoVertices) {
          this.SetError('The model contains no vertices.');
        } else if (checkResult === PlyHeaderCheckResult.NoFaces) {
          this.SetError('The model contains no faces.');
        } else {
          this.SetError('Invalid header information.');
        }
      }

      onFinish();
    }
  }, {
    key: "GetHeaderContent",
    value: function GetHeaderContent(fileContent) {
      var headerContent = '';
      var bufferView = new Uint8Array(fileContent);
      var bufferIndex = 0;

      for (bufferIndex = 0; bufferIndex < fileContent.byteLength; bufferIndex++) {
        headerContent += String.fromCharCode(bufferView[bufferIndex]);

        if (headerContent.endsWith('end_header')) {
          break;
        }
      }

      bufferIndex += 1;

      while (bufferIndex < fileContent.byteLength) {
        var char = String.fromCharCode(bufferView[bufferIndex]);
        headerContent += char;
        bufferIndex += 1;

        if (char === '\n') {
          break;
        }
      }

      return headerContent;
    }
  }, {
    key: "ReadHeader",
    value: function ReadHeader(headerContent) {
      var header = new PlyHeader();
      ReadLines(headerContent, function (line) {
        var parameters = ParametersFromLine(line, null);

        if (parameters.length === 0 || parameters[0] === 'comment') {
          return;
        }

        if (parameters[0] === 'ply') {
          return;
        } else if (parameters[0] === 'format' && parameters.length >= 2) {
          header.SetFormat(parameters[1]);
        } else if (parameters[0] === 'element' && parameters.length >= 3) {
          header.AddElement(parameters[1], parseInt(parameters[2], 10));
        } else if (parameters[0] === 'property' && parameters.length >= 3) {
          if (parameters[1] === 'list' && parameters.length >= 5) {
            header.AddListFormat(parameters[2], parameters[3], parameters[4]);
          } else {
            header.AddSingleFormat(parameters[1], parameters[2]);
          }
        }
      });
      return header;
    }
  }, {
    key: "ReadAsciiContent",
    value: function ReadAsciiContent(header, fileContent) {
      var _this = this;

      var vertex = header.GetElement('vertex');
      var face = header.GetElement('face');
      var foundVertex = 0;
      var foundFace = 0;
      ReadLines(fileContent, function (line) {
        if (_this.WasError()) {
          return;
        }

        var parameters = ParametersFromLine(line, null);

        if (parameters.length === 0 || parameters[0] === 'comment') {
          return;
        }

        if (foundVertex < vertex.count) {
          if (parameters.length >= 3) {
            _this.mesh.AddVertex(new Coord3D(parseFloat(parameters[0]), parseFloat(parameters[1]), parseFloat(parameters[2])));

            foundVertex += 1;
          }

          return;
        }

        if (face !== null && foundFace < face.count) {
          if (parameters.length >= 4) {
            var vertexCount = parseInt(parameters[0], 10);

            if (parameters.length < vertexCount + 1) {
              return;
            }

            for (var i = 0; i < vertexCount - 2; i++) {
              var v0 = parseInt(parameters[1]);
              var v1 = parseInt(parameters[i + 2]);
              var v2 = parseInt(parameters[i + 3]);
              var triangle = new Triangle(v0, v1, v2);

              _this.mesh.AddTriangle(triangle);
            }

            foundFace += 1;
          }

          return;
        }
      });
    }
  }, {
    key: "ReadBinaryContent",
    value: function ReadBinaryContent(header, fileContent, headerLength) {
      function ReadByFormat(reader, format) {
        function ReadType(reader, type) {
          if (type === 'char' || type === 'int8') {
            return reader.ReadCharacter8();
          } else if (type === 'uchar' || type === 'uint8') {
            return reader.ReadUnsignedCharacter8();
          } else if (type === 'short' || type === 'int16') {
            return reader.ReadInteger16();
          } else if (type === 'ushort' || type === 'uint16') {
            return reader.ReadUnsignedInteger16();
          } else if (type === 'int' || type === 'int32') {
            return reader.ReadInteger32();
          } else if (type === 'uint' || type === 'uint32') {
            return reader.ReadUnsignedInteger32();
          } else if (type === 'float' || type === 'float32') {
            return reader.ReadFloat32();
          } else if (type === 'double' || type === 'double64') {
            return reader.ReadDouble64();
          }

          return null;
        }

        if (format.isSingle) {
          return ReadType(reader, format.elemType);
        } else {
          var list = [];
          var count = ReadType(reader, format.countType);

          for (var i = 0; i < count; i++) {
            list.push(ReadType(reader, format.elemType));
          }

          return list;
        }
      }

      function SkipFormat(reader, format, startIndex) {
        for (var i = startIndex; i < format.length; i++) {
          ReadByFormat(reader, format[i]);
        }
      }

      function SkipAndGetColor(reader, format, startIndex) {
        var r = null;
        var g = null;
        var b = null;
        var a = 255;

        for (var i = startIndex; i < format.length; i++) {
          var currFormat = format[i];
          var val = ReadByFormat(reader, currFormat);

          if (currFormat.name === 'red') {
            r = val;
          } else if (currFormat.name === 'green') {
            g = val;
          } else if (currFormat.name === 'blue') {
            b = val;
          } else if (currFormat.name === 'alpha') {
            a = val;
          }
        }

        if (r !== null && g !== null && b !== null) {
          return [r, g, b, a];
        }

        return null;
      }

      var reader = null;

      if (header.format === 'binary_little_endian') {
        reader = new BinaryReader(fileContent, true);
      } else if (header.format === 'binary_big_endian') {
        reader = new BinaryReader(fileContent, false);
      } else {
        return;
      }

      reader.Skip(headerLength);
      var materialHandler = new PlyMaterialHandler(this.model);
      var elements = header.GetElements();

      for (var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
        var element = elements[elementIndex];

        if (element.name === 'vertex') {
          for (var vertexIndex = 0; vertexIndex < element.count; vertexIndex++) {
            var x = ReadByFormat(reader, element.format[0]);
            var y = ReadByFormat(reader, element.format[1]);
            var z = ReadByFormat(reader, element.format[2]);
            var color = SkipAndGetColor(reader, element.format, 3);

            if (color !== null) {
              this.mesh.AddVertexColor(new RGBColor(color[0], color[1], color[2]));
            }

            this.mesh.AddVertex(new Coord3D(x, y, z));
          }
        } else if (element.name === 'face') {
          for (var faceIndex = 0; faceIndex < element.count; faceIndex++) {
            var vertices = ReadByFormat(reader, element.format[0]);
            var faceColor = SkipAndGetColor(reader, element.format, 1);

            for (var i = 0; i < vertices.length - 2; i++) {
              var v0 = vertices[0];
              var v1 = vertices[i + 1];
              var v2 = vertices[i + 2];
              var triangle = new Triangle(v0, v1, v2);

              if (faceColor !== null) {
                triangle.mat = materialHandler.GetMaterialIndexByColor(faceColor);
              } else if (this.mesh.VertexColorCount() > 0) {
                triangle.SetVertexColors(v0, v1, v2);
              }

              this.mesh.AddTriangle(triangle);
            }
          }
        } else if (element.name === 'tristrips') {
          for (var triStripIndex = 0; triStripIndex < element.count; triStripIndex++) {
            var _vertices = ReadByFormat(reader, element.format[0]);

            SkipFormat(reader, element.format, 1);
            var ccw = true;

            for (var _i = 0; _i < _vertices.length - 2; _i++) {
              var _v = _vertices[_i];
              var _v2 = _vertices[_i + 1];
              var _v3 = _vertices[_i + 2];

              if (_v3 === -1) {
                _i += 2;
                ccw = true;
                continue;
              }

              if (!ccw) {
                var tmp = _v2;
                _v2 = _v3;
                _v3 = tmp;
              }

              ccw = !ccw;

              var _triangle = new Triangle(_v, _v2, _v3);

              this.mesh.AddTriangle(_triangle);
            }
          }
        } else {
          SkipFormat(reader, element.format, 0);
        }
      }
    }
  }]);

  return ImporterPly;
}(ImporterBase);