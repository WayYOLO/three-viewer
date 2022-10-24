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

import { IsObjectEmpty } from "../core/core.js";
import { Coord3D } from "../geometry/coord3d.js";
import { Direction } from "../geometry/geometry.js";
import { ArrayBufferToUtf8String } from "../io/bufferutils.js";
import { Node, NodeType } from "../model/node.js";
import { Mesh } from "../model/mesh.js";
import { Triangle } from "../model/triangle.js";
import { ImporterBase } from "./importerbase.js";
import { Quaternion } from "../geometry/quaternion.js";
import { Matrix } from "../geometry/matrix.js";
import { Transformation } from "../geometry/transformation.js";
import { ColorToMaterialConverter } from "./importerutils.js";
import { Property, PropertyGroup, PropertyType } from "../model/property.js";
export var ImporterBim = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterBim, _ImporterBase);

  var _super = _createSuper(ImporterBim);

  function ImporterBim() {
    _classCallCheck(this, ImporterBim);

    return _super.call(this);
  }

  _createClass(ImporterBim, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'bim';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Z;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      this.meshIdToMesh = null;
      this.colorToMaterial = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.meshIdToMesh = new Map();
      this.colorToMaterial = new ColorToMaterialConverter(this.model);
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      var textContent = ArrayBufferToUtf8String(fileContent);
      var bimJson = null;

      try {
        bimJson = JSON.parse(textContent);
      } catch (err) {
        this.SetError('Failed to parse bim file.');
        onFinish();
        return;
      }

      var _iterator = _createForOfIteratorHelper(bimJson.meshes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var bimMesh = _step.value;
          this.meshIdToMesh.set(bimMesh.mesh_id, bimMesh);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.ImportProperties(bimJson, this.model);

      var _iterator2 = _createForOfIteratorHelper(bimJson.elements),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var bimElement = _step2.value;
          var mesh = this.ImportElement(bimElement);
          mesh.SetName(bimElement.type);
          this.ImportProperties(bimElement, mesh);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      onFinish();
    }
  }, {
    key: "ImportElement",
    value: function ImportElement(bimElement) {
      var _this = this;

      var defaultMaterialIndex = this.colorToMaterial.GetMaterialIndex(bimElement.color.r, bimElement.color.g, bimElement.color.b, bimElement.color.a);
      var rootNode = this.model.GetRootNode();
      var bimMesh = this.meshIdToMesh.get(bimElement.mesh_id);
      var mesh = this.ImportMesh(bimMesh, function (triangleIndex) {
        if (bimElement.face_colors) {
          var faceMaterialIndex = _this.colorToMaterial.GetMaterialIndex(bimElement.face_colors[triangleIndex * 4 + 0], bimElement.face_colors[triangleIndex * 4 + 1], bimElement.face_colors[triangleIndex * 4 + 2], bimElement.face_colors[triangleIndex * 4 + 3]);

          return faceMaterialIndex;
        } else {
          return defaultMaterialIndex;
        }
      });
      var meshIndex = this.model.AddMesh(mesh);
      var elementNode = new Node();
      elementNode.SetType(NodeType.MeshNode);
      elementNode.AddMeshIndex(meshIndex);
      var translation = new Coord3D(0.0, 0.0, 0.0);

      if (bimElement.vector) {
        translation = new Coord3D(bimElement.vector.x, bimElement.vector.y, bimElement.vector.z);
      }

      var rotation = new Quaternion(0.0, 0.0, 0.0, 1.0);

      if (bimElement.rotation) {
        rotation = new Quaternion(bimElement.rotation.qx, bimElement.rotation.qy, bimElement.rotation.qz, bimElement.rotation.qw);
      }

      var scale = new Coord3D(1.0, 1.0, 1.0);
      var matrix = new Matrix().ComposeTRS(translation, rotation, scale);
      elementNode.SetTransformation(new Transformation(matrix));
      rootNode.AddChildNode(elementNode);
      return mesh;
    }
  }, {
    key: "ImportMesh",
    value: function ImportMesh(bimMesh, getMaterialIndex) {
      var mesh = new Mesh();

      for (var i = 0; i < bimMesh.coordinates.length; i += 3) {
        mesh.AddVertex(new Coord3D(bimMesh.coordinates[i + 0], bimMesh.coordinates[i + 1], bimMesh.coordinates[i + 2]));
      }

      for (var _i = 0; _i < bimMesh.indices.length; _i += 3) {
        var triangle = new Triangle(bimMesh.indices[_i + 0], bimMesh.indices[_i + 1], bimMesh.indices[_i + 2]);
        triangle.SetMaterial(getMaterialIndex(_i / 3));
        mesh.AddTriangle(triangle);
      }

      return mesh;
    }
  }, {
    key: "ImportProperties",
    value: function ImportProperties(source, target) {
      function AddProperty(group, name, value) {
        if (value === undefined || value === null) {
          return;
        }

        var property = new Property(PropertyType.Text, name, value);
        group.AddProperty(property);
      }

      if (!source.info || IsObjectEmpty(source.info)) {
        return;
      }

      var info = source.info;
      var propertyGroup = new PropertyGroup('Info');
      AddProperty(propertyGroup, 'Guid', source.guid);
      AddProperty(propertyGroup, 'Type', source.type);

      for (var propertyName in info) {
        if (Object.prototype.hasOwnProperty.call(info, propertyName)) {
          if (typeof info[propertyName] === 'string') {
            AddProperty(propertyGroup, propertyName, info[propertyName]);
          }
        }
      }

      target.AddPropertyGroup(propertyGroup);
    }
  }]);

  return ImporterBim;
}(ImporterBase);