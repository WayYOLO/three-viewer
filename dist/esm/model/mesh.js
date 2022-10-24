function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

import { ModelObject3D } from "./object.js";
export var Mesh = /*#__PURE__*/function (_ModelObject3D) {
  _inherits(Mesh, _ModelObject3D);

  var _super = _createSuper(Mesh);

  function Mesh() {
    var _this;

    _classCallCheck(this, Mesh);

    _this = _super.call(this);
    _this.vertices = [];
    _this.vertexColors = [];
    _this.normals = [];
    _this.uvs = [];
    _this.triangles = [];
    return _this;
  }

  _createClass(Mesh, [{
    key: "VertexCount",
    value: function VertexCount() {
      return this.vertices.length;
    }
  }, {
    key: "VertexColorCount",
    value: function VertexColorCount() {
      return this.vertexColors.length;
    }
  }, {
    key: "NormalCount",
    value: function NormalCount() {
      return this.normals.length;
    }
  }, {
    key: "TextureUVCount",
    value: function TextureUVCount() {
      return this.uvs.length;
    }
  }, {
    key: "TriangleCount",
    value: function TriangleCount() {
      return this.triangles.length;
    }
  }, {
    key: "AddVertex",
    value: function AddVertex(vertex) {
      this.vertices.push(vertex);
      return this.vertices.length - 1;
    }
  }, {
    key: "SetVertex",
    value: function SetVertex(index, vertex) {
      this.vertices[index] = vertex;
    }
  }, {
    key: "GetVertex",
    value: function GetVertex(index) {
      return this.vertices[index];
    }
  }, {
    key: "AddVertexColor",
    value: function AddVertexColor(color) {
      this.vertexColors.push(color);
      return this.vertexColors.length - 1;
    }
  }, {
    key: "SetVertexColor",
    value: function SetVertexColor(index, color) {
      this.vertexColors[index] = color;
    }
  }, {
    key: "GetVertexColor",
    value: function GetVertexColor(index) {
      return this.vertexColors[index];
    }
  }, {
    key: "AddNormal",
    value: function AddNormal(normal) {
      this.normals.push(normal);
      return this.normals.length - 1;
    }
  }, {
    key: "SetNormal",
    value: function SetNormal(index, normal) {
      this.normals[index] = normal;
    }
  }, {
    key: "GetNormal",
    value: function GetNormal(index) {
      return this.normals[index];
    }
  }, {
    key: "AddTextureUV",
    value: function AddTextureUV(uv) {
      this.uvs.push(uv);
      return this.uvs.length - 1;
    }
  }, {
    key: "SetTextureUV",
    value: function SetTextureUV(index, uv) {
      this.uvs[index] = uv;
    }
  }, {
    key: "GetTextureUV",
    value: function GetTextureUV(index) {
      return this.uvs[index];
    }
  }, {
    key: "AddTriangle",
    value: function AddTriangle(triangle) {
      this.triangles.push(triangle);
      return this.triangles.length - 1;
    }
  }, {
    key: "GetTriangle",
    value: function GetTriangle(index) {
      return this.triangles[index];
    }
  }, {
    key: "EnumerateVertices",
    value: function EnumerateVertices(onVertex) {
      var _iterator = _createForOfIteratorHelper(this.vertices),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var vertex = _step.value;
          onVertex(vertex);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "EnumerateTriangleVertexIndices",
    value: function EnumerateTriangleVertexIndices(onTriangleVertexIndices) {
      var _iterator2 = _createForOfIteratorHelper(this.triangles),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var triangle = _step2.value;
          onTriangleVertexIndices(triangle.v0, triangle.v1, triangle.v2);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "EnumerateTriangleVertices",
    value: function EnumerateTriangleVertices(onTriangleVertices) {
      var _iterator3 = _createForOfIteratorHelper(this.triangles),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var triangle = _step3.value;
          var v0 = this.vertices[triangle.v0];
          var v1 = this.vertices[triangle.v1];
          var v2 = this.vertices[triangle.v2];
          onTriangleVertices(v0, v1, v2);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "Clone",
    value: function Clone() {
      var cloned = new Mesh();
      cloned.SetName(this.GetName());
      this.CloneProperties(cloned);

      for (var i = 0; i < this.VertexCount(); i++) {
        var vertex = this.GetVertex(i);
        cloned.AddVertex(vertex.Clone());
      }

      for (var _i = 0; _i < this.VertexColorCount(); _i++) {
        var color = this.GetVertexColor(_i);
        cloned.AddVertexColor(color.Clone());
      }

      for (var _i2 = 0; _i2 < this.NormalCount(); _i2++) {
        var normal = this.GetNormal(_i2);
        cloned.AddNormal(normal.Clone());
      }

      for (var _i3 = 0; _i3 < this.TextureUVCount(); _i3++) {
        var uv = this.GetTextureUV(_i3);
        cloned.AddTextureUV(uv.Clone());
      }

      for (var _i4 = 0; _i4 < this.TriangleCount(); _i4++) {
        var triangle = this.GetTriangle(_i4);
        cloned.AddTriangle(triangle.Clone());
      }

      return cloned;
    }
  }]);

  return Mesh;
}(ModelObject3D);