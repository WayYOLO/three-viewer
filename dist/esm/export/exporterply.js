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

import { BinaryWriter } from "../io/binarywriter.js";
import { FileFormat } from "../io/fileutils.js";
import { TextWriter } from "../io/textwriter.js";
import { ExportedFile, ExporterBase } from "./exporterbase.js";
export var ExporterPly = /*#__PURE__*/function (_ExporterBase) {
  _inherits(ExporterPly, _ExporterBase);

  var _super = _createSuper(ExporterPly);

  function ExporterPly() {
    _classCallCheck(this, ExporterPly);

    return _super.call(this);
  }

  _createClass(ExporterPly, [{
    key: "CanExport",
    value: function CanExport(format, extension) {
      return (format === FileFormat.Text || format === FileFormat.Binary) && extension === 'ply';
    }
  }, {
    key: "ExportContent",
    value: function ExportContent(exporterModel, format, files, onFinish) {
      if (format === FileFormat.Text) {
        this.ExportText(exporterModel, files);
      } else {
        this.ExportBinary(exporterModel, files);
      }

      onFinish();
    }
  }, {
    key: "ExportText",
    value: function ExportText(exporterModel, files) {
      var plyFile = new ExportedFile('model.ply');
      files.push(plyFile);
      var plyWriter = new TextWriter();
      var vertexCount = exporterModel.VertexCount();
      var triangleCount = exporterModel.TriangleCount();
      var headerText = this.GetHeaderText('ascii', vertexCount, triangleCount);
      plyWriter.Write(headerText);
      exporterModel.EnumerateVerticesAndTriangles({
        onVertex: function onVertex(x, y, z) {
          plyWriter.WriteArrayLine([x, y, z]);
        },
        onTriangle: function onTriangle(v0, v1, v2) {
          plyWriter.WriteArrayLine([3, v0, v1, v2]);
        }
      });
      plyFile.SetTextContent(plyWriter.GetText());
    }
  }, {
    key: "ExportBinary",
    value: function ExportBinary(exporterModel, files) {
      var plyFile = new ExportedFile('model.ply');
      files.push(plyFile);
      var vertexCount = exporterModel.VertexCount();
      var triangleCount = exporterModel.TriangleCount();
      var headerText = this.GetHeaderText('binary_little_endian', vertexCount, triangleCount);
      var fullByteLength = headerText.length + vertexCount * 3 * 4 + triangleCount * (1 + 3 * 4);
      var plyWriter = new BinaryWriter(fullByteLength, true);

      for (var i = 0; i < headerText.length; i++) {
        plyWriter.WriteUnsignedCharacter8(headerText.charCodeAt(i));
      }

      exporterModel.EnumerateVerticesAndTriangles({
        onVertex: function onVertex(x, y, z) {
          plyWriter.WriteFloat32(x);
          plyWriter.WriteFloat32(y);
          plyWriter.WriteFloat32(z);
        },
        onTriangle: function onTriangle(v0, v1, v2) {
          plyWriter.WriteUnsignedCharacter8(3);
          plyWriter.WriteInteger32(v0);
          plyWriter.WriteInteger32(v1);
          plyWriter.WriteInteger32(v2);
        }
      });
      plyFile.SetBufferContent(plyWriter.GetBuffer());
    }
  }, {
    key: "GetHeaderText",
    value: function GetHeaderText(format, vertexCount, triangleCount) {
      var headerWriter = new TextWriter();
      headerWriter.WriteLine('ply');
      headerWriter.WriteLine('format ' + format + ' 1.0');
      headerWriter.WriteLine('element vertex ' + vertexCount);
      headerWriter.WriteLine('property float x');
      headerWriter.WriteLine('property float y');
      headerWriter.WriteLine('property float z');
      headerWriter.WriteLine('element face ' + triangleCount);
      headerWriter.WriteLine('property list uchar int vertex_index');
      headerWriter.WriteLine('end_header');
      return headerWriter.GetText();
    }
  }]);

  return ExporterPly;
}(ExporterBase);