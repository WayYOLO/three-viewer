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

import { TransformMesh } from "./meshutils.js";
import { ModelObject3D } from "./object.js";
export var MeshInstanceId = /*#__PURE__*/function () {
  function MeshInstanceId(nodeId, meshIndex) {
    _classCallCheck(this, MeshInstanceId);

    this.nodeId = nodeId;
    this.meshIndex = meshIndex;
  }

  _createClass(MeshInstanceId, [{
    key: "IsEqual",
    value: function IsEqual(rhs) {
      return this.nodeId === rhs.nodeId && this.meshIndex === rhs.meshIndex;
    }
  }, {
    key: "GetKey",
    value: function GetKey() {
      return this.nodeId.toString() + ':' + this.meshIndex.toString();
    }
  }]);

  return MeshInstanceId;
}();
export var MeshInstance = /*#__PURE__*/function (_ModelObject3D) {
  _inherits(MeshInstance, _ModelObject3D);

  var _super = _createSuper(MeshInstance);

  function MeshInstance(id, node, mesh) {
    var _this;

    _classCallCheck(this, MeshInstance);

    _this = _super.call(this);
    _this.id = id;
    _this.node = node;
    _this.mesh = mesh;
    return _this;
  }

  _createClass(MeshInstance, [{
    key: "GetId",
    value: function GetId() {
      return this.id;
    }
  }, {
    key: "GetTransformation",
    value: function GetTransformation() {
      return this.node.GetWorldTransformation();
    }
  }, {
    key: "GetMesh",
    value: function GetMesh() {
      return this.mesh;
    }
  }, {
    key: "VertexCount",
    value: function VertexCount() {
      return this.mesh.VertexCount();
    }
  }, {
    key: "VertexColorCount",
    value: function VertexColorCount() {
      return this.mesh.VertexColorCount();
    }
  }, {
    key: "NormalCount",
    value: function NormalCount() {
      return this.mesh.NormalCount();
    }
  }, {
    key: "TextureUVCount",
    value: function TextureUVCount() {
      return this.mesh.TextureUVCount();
    }
  }, {
    key: "TriangleCount",
    value: function TriangleCount() {
      return this.mesh.TriangleCount();
    }
  }, {
    key: "EnumerateVertices",
    value: function EnumerateVertices(onVertex) {
      var transformation = this.node.GetWorldTransformation();

      if (transformation.IsIdentity()) {
        this.mesh.EnumerateVertices(onVertex);
      } else {
        this.mesh.EnumerateVertices(function (vertex) {
          var transformed = transformation.TransformCoord3D(vertex);
          onVertex(transformed);
        });
      }
    }
  }, {
    key: "EnumerateTriangleVertexIndices",
    value: function EnumerateTriangleVertexIndices(onTriangleVertexIndices) {
      this.mesh.EnumerateTriangleVertexIndices(onTriangleVertexIndices);
    }
  }, {
    key: "EnumerateTriangleVertices",
    value: function EnumerateTriangleVertices(onTriangleVertices) {
      var transformation = this.node.GetWorldTransformation();

      if (transformation.IsIdentity()) {
        this.mesh.EnumerateTriangleVertices(onTriangleVertices);
      } else {
        this.mesh.EnumerateTriangleVertices(function (v0, v1, v2) {
          var v0Transformed = transformation.TransformCoord3D(v0);
          var v1Transformed = transformation.TransformCoord3D(v1);
          var v2Transformed = transformation.TransformCoord3D(v2);
          onTriangleVertices(v0Transformed, v1Transformed, v2Transformed);
        });
      }
    }
  }, {
    key: "PropertyGroupCount",
    value: function PropertyGroupCount() {
      return this.mesh.PropertyGroupCount();
    }
  }, {
    key: "AddPropertyGroup",
    value: function AddPropertyGroup(propertyGroup) {
      return this.mesh.AddPropertyGroup(propertyGroup);
    }
  }, {
    key: "GetPropertyGroup",
    value: function GetPropertyGroup(index) {
      return this.mesh.GetPropertyGroup(index);
    }
  }, {
    key: "GetTransformedMesh",
    value: function GetTransformedMesh() {
      var transformation = this.node.GetWorldTransformation();
      var transformed = this.mesh.Clone();
      TransformMesh(transformed, transformation);
      return transformed;
    }
  }]);

  return MeshInstance;
}(ModelObject3D);