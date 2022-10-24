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

import { MeshInstance, MeshInstanceId } from "./meshinstance.js";
import { Node } from "./node.js";
import { ModelObject3D } from "./object.js";
export var Model = /*#__PURE__*/function (_ModelObject3D) {
  _inherits(Model, _ModelObject3D);

  var _super = _createSuper(Model);

  function Model() {
    var _this;

    _classCallCheck(this, Model);

    _this = _super.call(this);
    _this.root = new Node();
    _this.materials = [];
    _this.meshes = [];
    return _this;
  }

  _createClass(Model, [{
    key: "GetRootNode",
    value: function GetRootNode() {
      return this.root;
    }
  }, {
    key: "MaterialCount",
    value: function MaterialCount() {
      return this.materials.length;
    }
  }, {
    key: "MeshCount",
    value: function MeshCount() {
      return this.meshes.length;
    }
  }, {
    key: "MeshInstanceCount",
    value: function MeshInstanceCount() {
      var count = 0;
      this.root.Enumerate(function (node) {
        count += node.MeshIndexCount();
      });
      return count;
    }
  }, {
    key: "VertexCount",
    value: function VertexCount() {
      var count = 0;
      this.EnumerateMeshInstances(function (meshInstance) {
        count += meshInstance.VertexCount();
      });
      return count;
    }
  }, {
    key: "VertexColorCount",
    value: function VertexColorCount() {
      var count = 0;
      this.EnumerateMeshInstances(function (meshInstance) {
        count += meshInstance.VertexColorCount();
      });
      return count;
    }
  }, {
    key: "NormalCount",
    value: function NormalCount() {
      var count = 0;
      this.EnumerateMeshInstances(function (meshInstance) {
        count += meshInstance.NormalCount();
      });
      return count;
    }
  }, {
    key: "TextureUVCount",
    value: function TextureUVCount() {
      var count = 0;
      this.EnumerateMeshInstances(function (meshInstance) {
        count += meshInstance.TextureUVCount();
      });
      return count;
    }
  }, {
    key: "TriangleCount",
    value: function TriangleCount() {
      var count = 0;
      this.EnumerateMeshInstances(function (meshInstance) {
        count += meshInstance.TriangleCount();
      });
      return count;
    }
  }, {
    key: "AddMaterial",
    value: function AddMaterial(material) {
      this.materials.push(material);
      return this.materials.length - 1;
    }
  }, {
    key: "GetMaterial",
    value: function GetMaterial(index) {
      return this.materials[index];
    }
  }, {
    key: "AddMesh",
    value: function AddMesh(mesh) {
      this.meshes.push(mesh);
      return this.meshes.length - 1;
    }
  }, {
    key: "AddMeshToRootNode",
    value: function AddMeshToRootNode(mesh) {
      var meshIndex = this.AddMesh(mesh);
      this.root.AddMeshIndex(meshIndex);
      return meshIndex;
    }
  }, {
    key: "RemoveMesh",
    value: function RemoveMesh(index) {
      this.meshes.splice(index, 1);
      this.root.Enumerate(function (node) {
        for (var i = 0; i < node.meshIndices.length; i++) {
          if (node.meshIndices[i] === index) {
            node.meshIndices.splice(i, 1);
            i -= 1;
          } else if (node.meshIndices[i] > index) {
            node.meshIndices[i] -= 1;
          }
        }
      });
    }
  }, {
    key: "GetMesh",
    value: function GetMesh(index) {
      return this.meshes[index];
    }
  }, {
    key: "GetMeshInstance",
    value: function GetMeshInstance(instanceId) {
      var foundNode = null;
      this.root.Enumerate(function (node) {
        if (node.GetId() === instanceId.nodeId) {
          foundNode = node;
        }
      });

      if (foundNode === null) {
        return null;
      }

      var nodeMeshIndices = foundNode.GetMeshIndices();

      if (nodeMeshIndices.indexOf(instanceId.meshIndex) === -1) {
        return null;
      }

      var foundMesh = this.GetMesh(instanceId.meshIndex);
      var id = new MeshInstanceId(foundNode.GetId(), instanceId.meshIndex);
      return new MeshInstance(id, foundNode, foundMesh);
    }
  }, {
    key: "EnumerateMeshes",
    value: function EnumerateMeshes(onMesh) {
      var _iterator = _createForOfIteratorHelper(this.meshes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var mesh = _step.value;
          onMesh(mesh);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "EnumerateMeshInstances",
    value: function EnumerateMeshInstances(onMeshInstance) {
      var _this2 = this;

      this.root.Enumerate(function (node) {
        var _iterator2 = _createForOfIteratorHelper(node.GetMeshIndices()),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var meshIndex = _step2.value;
            var id = new MeshInstanceId(node.GetId(), meshIndex);

            var mesh = _this2.GetMesh(meshIndex);

            var meshInstance = new MeshInstance(id, node, mesh);
            onMeshInstance(meshInstance);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      });
    }
  }, {
    key: "EnumerateTransformedMeshes",
    value: function EnumerateTransformedMeshes(onMesh) {
      this.EnumerateMeshInstances(function (meshInstance) {
        var transformed = meshInstance.GetTransformedMesh();
        onMesh(transformed);
      });
    }
  }, {
    key: "EnumerateVertices",
    value: function EnumerateVertices(onVertex) {
      this.EnumerateMeshInstances(function (meshInstance) {
        meshInstance.EnumerateVertices(onVertex);
      });
    }
  }, {
    key: "EnumerateTriangleVertexIndices",
    value: function EnumerateTriangleVertexIndices(onTriangleVertexIndices) {
      this.EnumerateMeshInstances(function (meshInstance) {
        meshInstance.EnumerateTriangleVertexIndices(onTriangleVertexIndices);
      });
    }
  }, {
    key: "EnumerateTriangleVertices",
    value: function EnumerateTriangleVertices(onTriangleVertices) {
      this.EnumerateMeshInstances(function (meshInstance) {
        meshInstance.EnumerateTriangleVertices(onTriangleVertices);
      });
    }
  }]);

  return Model;
}(ModelObject3D);