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
export var ExporterStl = /*#__PURE__*/function (_ExporterBase) {
  _inherits(ExporterStl, _ExporterBase);

  var _super = _createSuper(ExporterStl);

  function ExporterStl() {
    _classCallCheck(this, ExporterStl);

    return _super.call(this);
  }

  _createClass(ExporterStl, [{
    key: "CanExport",
    value: function CanExport(format, extension) {
      return (format === FileFormat.Text || format === FileFormat.Binary) && extension === 'stl';
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
      var stlFile = new ExportedFile('model.stl');
      files.push(stlFile);
      var stlWriter = new TextWriter();
      stlWriter.WriteLine('solid Model');
      exporterModel.EnumerateTrianglesWithNormals(function (v0, v1, v2, normal) {
        stlWriter.WriteArrayLine(['facet', 'normal', normal.x, normal.y, normal.z]);
        stlWriter.Indent(1);
        stlWriter.WriteLine('outer loop');
        stlWriter.Indent(1);
        stlWriter.WriteArrayLine(['vertex', v0.x, v0.y, v0.z]);
        stlWriter.WriteArrayLine(['vertex', v1.x, v1.y, v1.z]);
        stlWriter.WriteArrayLine(['vertex', v2.x, v2.y, v2.z]);
        stlWriter.Indent(-1);
        stlWriter.WriteLine('endloop');
        stlWriter.Indent(-1);
        stlWriter.WriteLine('endfacet');
      });
      stlWriter.WriteLine('endsolid Model');
      stlFile.SetTextContent(stlWriter.GetText());
    }
  }, {
    key: "ExportBinary",
    value: function ExportBinary(exporterModel, files) {
      var stlFile = new ExportedFile('model.stl');
      files.push(stlFile);
      var triangleCount = exporterModel.TriangleCount();
      var headerSize = 80;
      var fullByteLength = headerSize + 4 + triangleCount * 50;
      var stlWriter = new BinaryWriter(fullByteLength, true);

      for (var i = 0; i < headerSize; i++) {
        stlWriter.WriteUnsignedCharacter8(0);
      }

      stlWriter.WriteUnsignedInteger32(triangleCount);
      exporterModel.EnumerateTrianglesWithNormals(function (v0, v1, v2, normal) {
        stlWriter.WriteFloat32(normal.x);
        stlWriter.WriteFloat32(normal.y);
        stlWriter.WriteFloat32(normal.z);
        stlWriter.WriteFloat32(v0.x);
        stlWriter.WriteFloat32(v0.y);
        stlWriter.WriteFloat32(v0.z);
        stlWriter.WriteFloat32(v1.x);
        stlWriter.WriteFloat32(v1.y);
        stlWriter.WriteFloat32(v1.z);
        stlWriter.WriteFloat32(v2.x);
        stlWriter.WriteFloat32(v2.y);
        stlWriter.WriteFloat32(v2.z);
        stlWriter.WriteUnsignedInteger16(0);
      });
      stlFile.SetBufferContent(stlWriter.GetBuffer());
    }
  }]);

  return ExporterStl;
}(ExporterBase);