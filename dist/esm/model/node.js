function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Transformation } from "../geometry/transformation.js";

var NodeIdGenerator = /*#__PURE__*/function () {
  function NodeIdGenerator() {
    _classCallCheck(this, NodeIdGenerator);

    this.nextId = 0;
  }

  _createClass(NodeIdGenerator, [{
    key: "GenerateId",
    value: function GenerateId() {
      var id = this.nextId;
      this.nextId += 1;
      return id;
    }
  }]);

  return NodeIdGenerator;
}();

export var NodeType = {
  GroupNode: 0,
  MeshNode: 1
};
export var Node = /*#__PURE__*/function () {
  function Node() {
    _classCallCheck(this, Node);

    this.type = NodeType.GroupNode;
    this.name = '';
    this.parent = null;
    this.transformation = new Transformation();
    this.childNodes = [];
    this.meshIndices = [];
    this.idGenerator = new NodeIdGenerator();
    this.id = this.idGenerator.GenerateId();
  }

  _createClass(Node, [{
    key: "IsEmpty",
    value: function IsEmpty() {
      return this.childNodes.length === 0 && this.meshIndices.length === 0;
    }
  }, {
    key: "GetType",
    value: function GetType() {
      return this.type;
    }
  }, {
    key: "SetType",
    value: function SetType(type) {
      this.type = type;
    }
  }, {
    key: "GetId",
    value: function GetId() {
      return this.id;
    }
  }, {
    key: "GetName",
    value: function GetName() {
      return this.name;
    }
  }, {
    key: "SetName",
    value: function SetName(name) {
      this.name = name;
    }
  }, {
    key: "HasParent",
    value: function HasParent() {
      return this.parent !== null;
    }
  }, {
    key: "GetParent",
    value: function GetParent() {
      return this.parent;
    }
  }, {
    key: "GetTransformation",
    value: function GetTransformation() {
      return this.transformation;
    }
  }, {
    key: "GetWorldTransformation",
    value: function GetWorldTransformation() {
      var transformation = this.transformation.Clone();
      var parent = this.parent;

      while (parent !== null) {
        transformation.Append(parent.transformation);
        parent = parent.parent;
      }

      return transformation;
    }
  }, {
    key: "SetTransformation",
    value: function SetTransformation(transformation) {
      this.transformation = transformation;
    }
  }, {
    key: "AddChildNode",
    value: function AddChildNode(node) {
      node.parent = this;
      node.idGenerator = this.idGenerator;
      node.id = node.idGenerator.GenerateId();
      this.childNodes.push(node);
      return this.childNodes.length - 1;
    }
  }, {
    key: "RemoveChildNode",
    value: function RemoveChildNode(node) {
      node.parent = null;
      var index = this.childNodes.indexOf(node);
      this.childNodes.splice(index, 1);
    }
  }, {
    key: "GetChildNodes",
    value: function GetChildNodes() {
      return this.childNodes;
    }
  }, {
    key: "ChildNodeCount",
    value: function ChildNodeCount() {
      return this.childNodes.length;
    }
  }, {
    key: "GetChildNode",
    value: function GetChildNode(index) {
      return this.childNodes[index];
    }
  }, {
    key: "AddMeshIndex",
    value: function AddMeshIndex(index) {
      this.meshIndices.push(index);
      return this.meshIndices.length - 1;
    }
  }, {
    key: "MeshIndexCount",
    value: function MeshIndexCount() {
      return this.meshIndices.length;
    }
  }, {
    key: "GetMeshIndex",
    value: function GetMeshIndex(index) {
      return this.meshIndices[index];
    }
  }, {
    key: "GetMeshIndices",
    value: function GetMeshIndices() {
      return this.meshIndices;
    }
  }, {
    key: "Enumerate",
    value: function Enumerate(processor) {
      processor(this);

      var _iterator = _createForOfIteratorHelper(this.childNodes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var childNode = _step.value;
          childNode.Enumerate(processor);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "EnumerateChildren",
    value: function EnumerateChildren(processor) {
      var _iterator2 = _createForOfIteratorHelper(this.childNodes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var childNode = _step2.value;
          processor(childNode);
          childNode.EnumerateChildren(processor);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "EnumerateMeshIndices",
    value: function EnumerateMeshIndices(processor) {
      var _iterator3 = _createForOfIteratorHelper(this.meshIndices),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var meshIndex = _step3.value;
          processor(meshIndex);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var _iterator4 = _createForOfIteratorHelper(this.childNodes),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var childNode = _step4.value;
          childNode.EnumerateMeshIndices(processor);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }]);

  return Node;
}();