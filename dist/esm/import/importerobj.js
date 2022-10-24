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

import { Coord2D } from "../geometry/coord2d.js";
import { Coord3D } from "../geometry/coord3d.js";
import { Direction } from "../geometry/geometry.js";
import { ArrayBufferToUtf8String } from "../io/bufferutils.js";
import { RGBColor, RGBColorFromFloatComponents } from "../model/color.js";
import { PhongMaterial, TextureMap } from "../model/material.js";
import { Mesh } from "../model/mesh.js";
import { Triangle } from "../model/triangle.js";
import { ImporterBase } from "./importerbase.js";
import { NameFromLine, ParametersFromLine, ReadLines, UpdateMaterialTransparency } from "./importerutils.js";

var ObjMeshConverter = /*#__PURE__*/function () {
  function ObjMeshConverter(mesh) {
    _classCallCheck(this, ObjMeshConverter);

    this.mesh = mesh;
    this.globalToMeshVertices = new Map();
    this.globalToMeshVertexColors = new Map();
    this.globalToMeshNormals = new Map();
    this.globalToMeshUvs = new Map();
  }

  _createClass(ObjMeshConverter, [{
    key: "AddVertex",
    value: function AddVertex(globalIndex, globalVertices) {
      var _this = this;

      return this.GetLocalIndex(globalIndex, globalVertices, this.globalToMeshVertices, function (val) {
        return _this.mesh.AddVertex(new Coord3D(val.x, val.y, val.z));
      });
    }
  }, {
    key: "AddVertexColor",
    value: function AddVertexColor(globalIndex, globalVertexColors) {
      var _this2 = this;

      return this.GetLocalIndex(globalIndex, globalVertexColors, this.globalToMeshVertexColors, function (val) {
        return _this2.mesh.AddVertexColor(new RGBColor(val.r, val.g, val.b));
      });
    }
  }, {
    key: "AddNormal",
    value: function AddNormal(globalIndex, globalNormals) {
      var _this3 = this;

      return this.GetLocalIndex(globalIndex, globalNormals, this.globalToMeshNormals, function (val) {
        return _this3.mesh.AddNormal(new Coord3D(val.x, val.y, val.z));
      });
    }
  }, {
    key: "AddUV",
    value: function AddUV(globalIndex, globalUvs) {
      var _this4 = this;

      return this.GetLocalIndex(globalIndex, globalUvs, this.globalToMeshUvs, function (val) {
        return _this4.mesh.AddTextureUV(new Coord2D(val.x, val.y));
      });
    }
  }, {
    key: "AddTriangle",
    value: function AddTriangle(triangle) {
      this.mesh.AddTriangle(triangle);
    }
  }, {
    key: "GetLocalIndex",
    value: function GetLocalIndex(globalIndex, globalValueArray, globalToMeshIndices, valueAdderFunc) {
      if (isNaN(globalIndex) || globalIndex < 0 || globalIndex >= globalValueArray.length) {
        return null;
      }

      if (globalToMeshIndices.has(globalIndex)) {
        return globalToMeshIndices.get(globalIndex);
      } else {
        var globalValue = globalValueArray[globalIndex];
        var localIndex = valueAdderFunc(globalValue);
        globalToMeshIndices.set(globalIndex, localIndex);
        return localIndex;
      }
    }
  }]);

  return ObjMeshConverter;
}();

function CreateColor(r, g, b) {
  return RGBColorFromFloatComponents(parseFloat(r), parseFloat(g), parseFloat(b));
}

export var ImporterObj = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterObj, _ImporterBase);

  var _super = _createSuper(ImporterObj);

  function ImporterObj() {
    _classCallCheck(this, ImporterObj);

    return _super.call(this);
  }

  _createClass(ImporterObj, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'obj';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Y;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      this.globalVertices = null;
      this.globalVertexColors = null;
      this.globalNormals = null;
      this.globalUvs = null;
      this.currentMeshConverter = null;
      this.currentMaterial = null;
      this.currentMaterialIndex = null;
      this.meshNameToConverter = null;
      this.materialNameToIndex = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.globalVertices = [];
      this.globalVertexColors = [];
      this.globalNormals = [];
      this.globalUvs = [];
      this.currentMeshConverter = null;
      this.currentMaterial = null;
      this.currentMaterialIndex = null;
      this.meshNameToConverter = new Map();
      this.materialNameToIndex = new Map();
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      var _this5 = this;

      var textContent = ArrayBufferToUtf8String(fileContent);
      ReadLines(textContent, function (line) {
        if (!_this5.WasError()) {
          _this5.ProcessLine(line);
        }
      });
      onFinish();
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

      var keyword = parameters[0].toLowerCase();
      parameters.shift();

      if (this.ProcessMeshParameter(keyword, parameters, line)) {
        return;
      }

      if (this.ProcessMaterialParameter(keyword, parameters, line)) {
        return;
      }
    }
  }, {
    key: "AddNewMesh",
    value: function AddNewMesh(name) {
      if (this.meshNameToConverter.has(name)) {
        this.currentMeshConverter = this.meshNameToConverter.get(name);
      } else {
        var mesh = new Mesh();
        mesh.SetName(name);
        this.model.AddMeshToRootNode(mesh);
        this.currentMeshConverter = new ObjMeshConverter(mesh);
        this.meshNameToConverter.set(name, this.currentMeshConverter);
      }
    }
  }, {
    key: "ProcessMeshParameter",
    value: function ProcessMeshParameter(keyword, parameters, line) {
      if (keyword === 'g' || keyword === 'o') {
        if (parameters.length === 0) {
          return true;
        }

        var name = NameFromLine(line, keyword.length, '#');
        this.AddNewMesh(name);
        return true;
      } else if (keyword === 'v') {
        if (parameters.length < 3) {
          return true;
        }

        this.globalVertices.push(new Coord3D(parseFloat(parameters[0]), parseFloat(parameters[1]), parseFloat(parameters[2])));

        if (parameters.length >= 6) {
          this.globalVertexColors.push(CreateColor(parameters[3], parameters[4], parameters[5]));
        }

        return true;
      } else if (keyword === 'vn') {
        if (parameters.length < 3) {
          return true;
        }

        this.globalNormals.push(new Coord3D(parseFloat(parameters[0]), parseFloat(parameters[1]), parseFloat(parameters[2])));
        return true;
      } else if (keyword === 'vt') {
        if (parameters.length < 2) {
          return true;
        }

        this.globalUvs.push(new Coord2D(parseFloat(parameters[0]), parseFloat(parameters[1])));
        return true;
      } else if (keyword === 'f') {
        if (parameters.length < 3) {
          return true;
        }

        this.ProcessFace(parameters);
        return true;
      }

      return false;
    }
  }, {
    key: "ProcessMaterialParameter",
    value: function ProcessMaterialParameter(keyword, parameters, line) {
      var _this6 = this;

      function CreateTexture(keyword, line, callbacks) {
        var texture = new TextureMap();
        var textureName = NameFromLine(line, keyword.length, '#');
        var textureBuffer = callbacks.getFileBuffer(textureName);
        texture.name = textureName;
        texture.buffer = textureBuffer;
        return texture;
      }

      if (keyword === 'newmtl') {
        if (parameters.length === 0) {
          return true;
        }

        var material = new PhongMaterial();
        var materialName = NameFromLine(line, keyword.length, '#');
        var materialIndex = this.model.AddMaterial(material);
        material.name = materialName;
        this.currentMaterial = material;
        this.materialNameToIndex.set(materialName, materialIndex);
        return true;
      } else if (keyword === 'usemtl') {
        if (parameters.length === 0) {
          return true;
        }

        var _materialName = NameFromLine(line, keyword.length, '#');

        if (this.materialNameToIndex.has(_materialName)) {
          this.currentMaterialIndex = this.materialNameToIndex.get(_materialName);
        }

        return true;
      } else if (keyword === 'mtllib') {
        if (parameters.length === 0) {
          return true;
        }

        var fileName = NameFromLine(line, keyword.length, '#');
        var fileBuffer = this.callbacks.getFileBuffer(fileName);

        if (fileBuffer !== null) {
          var textContent = ArrayBufferToUtf8String(fileBuffer);
          ReadLines(textContent, function (line) {
            if (!_this6.WasError()) {
              _this6.ProcessLine(line);
            }
          });
        }

        return true;
      } else if (keyword === 'map_kd') {
        if (this.currentMaterial === null || parameters.length === 0) {
          return true;
        }

        this.currentMaterial.diffuseMap = CreateTexture(keyword, line, this.callbacks);
        UpdateMaterialTransparency(this.currentMaterial);
        return true;
      } else if (keyword === 'map_ks') {
        if (this.currentMaterial === null || parameters.length === 0) {
          return true;
        }

        this.currentMaterial.specularMap = CreateTexture(keyword, line, this.callbacks);
        return true;
      } else if (keyword === 'map_bump' || keyword === 'bump') {
        if (this.currentMaterial === null || parameters.length === 0) {
          return true;
        }

        this.currentMaterial.bumpMap = CreateTexture(keyword, line, this.callbacks);
        return true;
      } else if (keyword === 'ka') {
        if (this.currentMaterial === null || parameters.length < 3) {
          return true;
        }

        this.currentMaterial.ambient = CreateColor(parameters[0], parameters[1], parameters[2]);
        return true;
      } else if (keyword === 'kd') {
        if (this.currentMaterial === null || parameters.length < 3) {
          return true;
        }

        this.currentMaterial.color = CreateColor(parameters[0], parameters[1], parameters[2]);
        return true;
      } else if (keyword === 'ks') {
        if (this.currentMaterial === null || parameters.length < 3) {
          return true;
        }

        this.currentMaterial.specular = CreateColor(parameters[0], parameters[1], parameters[2]);
        return true;
      } else if (keyword === 'ns') {
        if (this.currentMaterial === null || parameters.length < 1) {
          return true;
        }

        this.currentMaterial.shininess = parseFloat(parameters[0]) / 1000.0;
        return true;
      } else if (keyword === 'tr') {
        if (this.currentMaterial === null || parameters.length < 1) {
          return true;
        }

        this.currentMaterial.opacity = 1.0 - parseFloat(parameters[0]);
        UpdateMaterialTransparency(this.currentMaterial);
        return true;
      } else if (keyword === 'd') {
        if (this.currentMaterial === null || parameters.length < 1) {
          return true;
        }

        this.currentMaterial.opacity = parseFloat(parameters[0]);
        UpdateMaterialTransparency(this.currentMaterial);
        return true;
      }

      return false;
    }
  }, {
    key: "ProcessFace",
    value: function ProcessFace(parameters) {
      function GetRelativeIndex(index, count) {
        if (index > 0) {
          return index - 1;
        } else {
          return count + index;
        }
      }

      var vertices = [];
      var colors = [];
      var normals = [];
      var uvs = [];

      for (var i = 0; i < parameters.length; i++) {
        var vertexParams = parameters[i].split('/');
        vertices.push(GetRelativeIndex(parseInt(vertexParams[0], 10), this.globalVertices.length));

        if (this.globalVertices.length === this.globalVertexColors.length) {
          colors.push(GetRelativeIndex(parseInt(vertexParams[0], 10), this.globalVertices.length));
        }

        if (vertexParams.length > 1 && vertexParams[1].length > 0) {
          uvs.push(GetRelativeIndex(parseInt(vertexParams[1], 10), this.globalUvs.length));
        }

        if (vertexParams.length > 2 && vertexParams[2].length > 0) {
          normals.push(GetRelativeIndex(parseInt(vertexParams[2], 10), this.globalNormals.length));
        }
      }

      if (this.currentMeshConverter === null) {
        this.AddNewMesh('');
      }

      for (var _i = 0; _i < vertices.length - 2; _i++) {
        var v0 = this.currentMeshConverter.AddVertex(vertices[0], this.globalVertices);
        var v1 = this.currentMeshConverter.AddVertex(vertices[_i + 1], this.globalVertices);
        var v2 = this.currentMeshConverter.AddVertex(vertices[_i + 2], this.globalVertices);

        if (v0 === null || v1 === null || v2 === null) {
          this.SetError('Invalid vertex index.');
          break;
        }

        var triangle = new Triangle(v0, v1, v2);

        if (colors.length === vertices.length) {
          var c0 = this.currentMeshConverter.AddVertexColor(colors[0], this.globalVertexColors);
          var c1 = this.currentMeshConverter.AddVertexColor(colors[_i + 1], this.globalVertexColors);
          var c2 = this.currentMeshConverter.AddVertexColor(colors[_i + 2], this.globalVertexColors);

          if (c0 === null || c1 === null || c2 === null) {
            this.SetError('Invalid vertex color index.');
            break;
          }

          triangle.SetVertexColors(c0, c1, c2);
        }

        if (normals.length === vertices.length) {
          var n0 = this.currentMeshConverter.AddNormal(normals[0], this.globalNormals);
          var n1 = this.currentMeshConverter.AddNormal(normals[_i + 1], this.globalNormals);
          var n2 = this.currentMeshConverter.AddNormal(normals[_i + 2], this.globalNormals);

          if (n0 === null || n1 === null || n2 === null) {
            this.SetError('Invalid normal index.');
            break;
          }

          triangle.SetNormals(n0, n1, n2);
        }

        if (uvs.length === vertices.length) {
          var u0 = this.currentMeshConverter.AddUV(uvs[0], this.globalUvs);
          var u1 = this.currentMeshConverter.AddUV(uvs[_i + 1], this.globalUvs);
          var u2 = this.currentMeshConverter.AddUV(uvs[_i + 2], this.globalUvs);

          if (u0 === null || u1 === null || u2 === null) {
            this.SetError('Invalid uv index.');
            break;
          }

          triangle.SetTextureUVs(u0, u1, u2);
        }

        if (this.currentMaterialIndex !== null) {
          triangle.mat = this.currentMaterialIndex;
        }

        this.currentMeshConverter.AddTriangle(triangle);
      }
    }
  }]);

  return ImporterObj;
}(ImporterBase);