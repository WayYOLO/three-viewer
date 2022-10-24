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

import { FileFormat, GetFileName } from "../io/fileutils.js";
import { TextWriter } from "../io/textwriter.js";
import { MaterialType } from "../model/material.js";
import { ExportedFile, ExporterBase } from "./exporterbase.js";
export var ExporterObj = /*#__PURE__*/function (_ExporterBase) {
  _inherits(ExporterObj, _ExporterBase);

  var _super = _createSuper(ExporterObj);

  function ExporterObj() {
    _classCallCheck(this, ExporterObj);

    return _super.call(this);
  }

  _createClass(ExporterObj, [{
    key: "CanExport",
    value: function CanExport(format, extension) {
      return format === FileFormat.Text && extension === 'obj';
    }
  }, {
    key: "ExportContent",
    value: function ExportContent(exporterModel, format, files, onFinish) {
      var _this = this;

      function WriteTexture(mtlWriter, keyword, texture, files) {
        if (texture === null || !texture.IsValid()) {
          return;
        }

        var fileName = GetFileName(texture.name);
        mtlWriter.WriteArrayLine([keyword, fileName]);
        var fileIndex = files.findIndex(function (file) {
          return file.GetName() === fileName;
        });

        if (fileIndex === -1) {
          var textureFile = new ExportedFile(fileName);
          textureFile.SetBufferContent(texture.buffer);
          files.push(textureFile);
        }
      }

      var mtlFile = new ExportedFile('model.mtl');
      var objFile = new ExportedFile('model.obj');
      files.push(mtlFile);
      files.push(objFile);
      var mtlWriter = new TextWriter();
      mtlWriter.WriteLine(this.GetHeaderText());

      for (var materialIndex = 0; materialIndex < exporterModel.MaterialCount(); materialIndex++) {
        var material = exporterModel.GetMaterial(materialIndex);
        mtlWriter.WriteArrayLine(['newmtl', this.GetExportedMaterialName(material.name)]);
        mtlWriter.WriteArrayLine(['Kd', material.color.r / 255.0, material.color.g / 255.0, material.color.b / 255.0]);
        mtlWriter.WriteArrayLine(['d', material.opacity]);

        if (material.type === MaterialType.Phong) {
          mtlWriter.WriteArrayLine(['Ka', material.ambient.r / 255.0, material.ambient.g / 255.0, material.ambient.b / 255.0]);
          mtlWriter.WriteArrayLine(['Ks', material.specular.r / 255.0, material.specular.g / 255.0, material.specular.b / 255.0]);
          mtlWriter.WriteArrayLine(['Ns', material.shininess * 1000.0]);
        }

        WriteTexture(mtlWriter, 'map_Kd', material.diffuseMap, files);

        if (material.type === MaterialType.Phong) {
          WriteTexture(mtlWriter, 'map_Ks', material.specularMap, files);
        }

        WriteTexture(mtlWriter, 'bump', material.bumpMap, files);
      }

      mtlFile.SetTextContent(mtlWriter.GetText());
      var objWriter = new TextWriter();
      objWriter.WriteLine(this.GetHeaderText());
      objWriter.WriteArrayLine(['mtllib', mtlFile.GetName()]);
      var vertexOffset = 0;
      var normalOffset = 0;
      var uvOffset = 0;
      var usedMaterialName = null;
      exporterModel.EnumerateTransformedMeshes(function (mesh) {
        objWriter.WriteArrayLine(['g', _this.GetExportedMeshName(mesh.GetName())]);

        for (var vertexIndex = 0; vertexIndex < mesh.VertexCount(); vertexIndex++) {
          var vertex = mesh.GetVertex(vertexIndex);
          objWriter.WriteArrayLine(['v', vertex.x, vertex.y, vertex.z]);
        }

        for (var normalIndex = 0; normalIndex < mesh.NormalCount(); normalIndex++) {
          var normal = mesh.GetNormal(normalIndex);
          objWriter.WriteArrayLine(['vn', normal.x, normal.y, normal.z]);
        }

        for (var textureUVIndex = 0; textureUVIndex < mesh.TextureUVCount(); textureUVIndex++) {
          var uv = mesh.GetTextureUV(textureUVIndex);
          objWriter.WriteArrayLine(['vt', uv.x, uv.y]);
        }

        for (var triangleIndex = 0; triangleIndex < mesh.TriangleCount(); triangleIndex++) {
          var triangle = mesh.GetTriangle(triangleIndex);
          var v0 = triangle.v0 + vertexOffset + 1;
          var v1 = triangle.v1 + vertexOffset + 1;
          var v2 = triangle.v2 + vertexOffset + 1;
          var n0 = triangle.n0 + normalOffset + 1;
          var n1 = triangle.n1 + normalOffset + 1;
          var n2 = triangle.n2 + normalOffset + 1;

          if (triangle.mat !== null) {
            var _material = exporterModel.GetMaterial(triangle.mat);

            var materialName = _this.GetExportedMaterialName(_material.name);

            if (materialName !== usedMaterialName) {
              objWriter.WriteArrayLine(['usemtl', materialName]);
              usedMaterialName = materialName;
            }
          }

          var u0 = '';
          var u1 = '';
          var u2 = '';

          if (triangle.HasTextureUVs()) {
            u0 = triangle.u0 + uvOffset + 1;
            u1 = triangle.u1 + uvOffset + 1;
            u2 = triangle.u2 + uvOffset + 1;
          }

          objWriter.WriteArrayLine(['f', [v0, u0, n0].join('/'), [v1, u1, n1].join('/'), [v2, u2, n2].join('/')]);
        }

        vertexOffset += mesh.VertexCount();
        normalOffset += mesh.NormalCount();
        uvOffset += mesh.TextureUVCount();
      });
      objFile.SetTextContent(objWriter.GetText());
      onFinish();
    }
  }, {
    key: "GetHeaderText",
    value: function GetHeaderText() {
      return '# exported by https://3dviewer.net';
    }
  }]);

  return ExporterObj;
}(ExporterBase);