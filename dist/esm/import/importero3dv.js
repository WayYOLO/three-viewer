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

import { ValueOrDefault } from "../core/core.js";
import { ArrayToCoord3D, Coord3D } from "../geometry/coord3d.js";
import { Direction } from "../geometry/geometry.js";
import { Matrix } from "../geometry/matrix.js";
import { ArrayToQuaternion, Quaternion } from "../geometry/quaternion.js";
import { Transformation } from "../geometry/transformation.js";
import { ArrayBufferToUtf8String } from "../io/bufferutils.js";
import { ArrayToRGBColor } from "../model/color.js";
import { GenerateCone, GenerateCuboid, GenerateCylinder, GeneratePlatonicSolid, GenerateSphere, GeneratorParams } from "../model/generator.js";
import { PhysicalMaterial } from "../model/material.js";
import { Node, NodeType } from "../model/node.js";
import { Property, PropertyGroup, PropertyType } from "../model/property.js";
import { ImporterBase } from "./importerbase.js";
export var ImporterO3dv = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterO3dv, _ImporterBase);

  var _super = _createSuper(ImporterO3dv);

  function ImporterO3dv() {
    _classCallCheck(this, ImporterO3dv);

    return _super.call(this);
  }

  _createClass(ImporterO3dv, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'o3dv';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Z;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {}
  }, {
    key: "ResetContent",
    value: function ResetContent() {}
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      var textContent = ArrayBufferToUtf8String(fileContent);
      var content = JSON.parse(textContent);

      if (content.root === undefined) {
        onFinish();
        return;
      }

      if (content.materials !== undefined) {
        for (var i = 0; i < content.materials.length; i++) {
          var materialContent = content.materials[i];
          this.ImportMaterial(materialContent);
        }
      }

      if (content.meshes !== undefined) {
        for (var _i = 0; _i < content.meshes.length; _i++) {
          var meshContent = content.meshes[_i];
          this.ImportMesh(meshContent);
        }
      }

      var rootNode = content.nodes[content.root];
      this.ImportNode(content, rootNode, this.model.GetRootNode());
      this.ImportProperties(this.model, content);
      onFinish();
    }
  }, {
    key: "ImportMaterial",
    value: function ImportMaterial(materialContent) {
      var material = new PhysicalMaterial();
      material.color.Set(255, 255, 255);

      if (materialContent.name !== undefined) {
        material.name = materialContent.name;
      }

      if (materialContent.color !== undefined) {
        material.color = ArrayToRGBColor(materialContent.color);
      }

      material.metalness = ValueOrDefault(materialContent.metalness, 0.0);
      material.roughness = ValueOrDefault(materialContent.roughness, 1.0);
      this.model.AddMaterial(material);
    }
  }, {
    key: "ImportMesh",
    value: function ImportMesh(meshContent) {
      var genParams = new GeneratorParams();

      if (meshContent.name !== undefined) {
        genParams.SetName(meshContent.name);
      }

      if (meshContent.material !== undefined) {
        genParams.SetMaterial(meshContent.material);
      }

      var parameters = meshContent.parameters;

      if (parameters === undefined) {
        return;
      }

      var mesh = null;

      if (meshContent.type === 'cuboid') {
        if (parameters.size_x === undefined || parameters.size_y === undefined || parameters.size_z === undefined) {
          return;
        }

        mesh = GenerateCuboid(genParams, parameters.size_x, parameters.size_y, parameters.size_z);
      } else if (meshContent.type === 'cylinder') {
        if (parameters.radius === undefined || parameters.height === undefined) {
          return;
        }

        var segments = ValueOrDefault(parameters.segments, 25);
        var smooth = ValueOrDefault(parameters.smooth, true);
        mesh = GenerateCylinder(genParams, parameters.radius, parameters.height, segments, smooth);
      } else if (meshContent.type === 'cone') {
        if (parameters.top_radius === undefined || parameters.bottom_radius === undefined || parameters.height === undefined) {
          return;
        }

        var _segments = ValueOrDefault(parameters.segments, 25);

        var _smooth = ValueOrDefault(parameters.smooth, true);

        mesh = GenerateCone(genParams, parameters.top_radius, parameters.bottom_radius, parameters.height, _segments, _smooth);
      } else if (meshContent.type === 'sphere') {
        if (parameters.radius === undefined) {
          return;
        }

        var _segments2 = ValueOrDefault(parameters.segments, 20);

        var _smooth2 = ValueOrDefault(parameters.smooth, true);

        mesh = GenerateSphere(genParams, parameters.radius, _segments2, _smooth2);
      } else if (meshContent.type === 'platonic') {
        if (parameters.solid_type === undefined) {
          return;
        }

        var radius = ValueOrDefault(parameters.radius, 1.0);
        mesh = GeneratePlatonicSolid(genParams, parameters.solid_type, radius);
      }

      if (mesh !== null) {
        this.ImportProperties(mesh, meshContent);
        this.model.AddMesh(mesh);
      }
    }
  }, {
    key: "ImportNode",
    value: function ImportNode(content, nodeContent, node) {
      if (nodeContent.name !== undefined) {
        node.SetName(nodeContent.name);
      }

      if (nodeContent.transformation !== undefined) {
        var nodeTransformation = this.GetTransformation(nodeContent.transformation);
        node.SetTransformation(nodeTransformation);
      }

      if (nodeContent.children !== undefined) {
        var _iterator = _createForOfIteratorHelper(nodeContent.children),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var childIndex = _step.value;
            var childContent = content.nodes[childIndex];
            var childNode = new Node();
            node.AddChildNode(childNode);
            this.ImportNode(content, childContent, childNode);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      if (nodeContent.mesh !== undefined) {
        if (nodeContent.children === undefined || nodeContent.children.length === 0) {
          node.SetType(NodeType.MeshNode);
        }

        node.AddMeshIndex(nodeContent.mesh);
      }
    }
  }, {
    key: "ImportProperties",
    value: function ImportProperties(element, nodeContent) {
      if (nodeContent.properties !== undefined) {
        var propertyGroup = new PropertyGroup('Properties');
        element.AddPropertyGroup(propertyGroup);

        var _iterator2 = _createForOfIteratorHelper(nodeContent.properties),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var nodeProperty = _step2.value;
            var property = new Property(PropertyType.Text, nodeProperty.name, nodeProperty.value);
            propertyGroup.AddProperty(property);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }
  }, {
    key: "GetTransformation",
    value: function GetTransformation(contentTransformation) {
      var translation = new Coord3D(0.0, 0.0, 0.0);
      var rotation = new Quaternion(0.0, 0.0, 0.0, 1.0);
      var scale = new Coord3D(1.0, 1.0, 1.0);

      if (contentTransformation.translation !== undefined) {
        translation = ArrayToCoord3D(contentTransformation.translation);
      }

      if (contentTransformation.rotation !== undefined) {
        rotation = ArrayToQuaternion(contentTransformation.rotation);
      }

      if (contentTransformation.scale !== undefined) {
        scale = ArrayToCoord3D(contentTransformation.scale);
      }

      var matrix = new Matrix().ComposeTRS(translation, rotation, scale);
      return new Transformation(matrix);
    }
  }]);

  return ImporterO3dv;
}(ImporterBase);