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

import { Direction } from "../geometry/geometry.js";
import { ImporterThreeBase } from "./importerthree.js";
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
export var ImporterThreeSvg = /*#__PURE__*/function (_ImporterThreeBase) {
  _inherits(ImporterThreeSvg, _ImporterThreeBase);

  var _super = _createSuper(ImporterThreeSvg);

  function ImporterThreeSvg() {
    _classCallCheck(this, ImporterThreeSvg);

    return _super.call(this);
  }

  _createClass(ImporterThreeSvg, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'svg';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Z;
    }
  }, {
    key: "CreateLoader",
    value: function CreateLoader(manager) {
      return new SVGLoader(manager);
    }
  }, {
    key: "GetMainObject",
    value: function GetMainObject(loadedObject) {
      function ShowFill(path) {
        var style = path.userData.style;

        if (style.fill === undefined || style.fill === 'none') {
          return false;
        }

        return true;
      }

      function GetOrCreateMaterial(materials, style, opacity) {
        var material = null;

        var _iterator = _createForOfIteratorHelper(materials),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var existingMaterial = _step.value;

            if (existingMaterial.style === style && existingMaterial.opacity === opacity) {
              material = existingMaterial.material;
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (material === null) {
          material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setStyle(style),
            opacity: opacity,
            transparent: opacity < 1.0
          });
          materials.push({
            style: style,
            opacity: opacity,
            material: material
          });
        }

        return material;
      }

      var materials = [];
      var object = new THREE.Object3D();
      object.rotation.x = Math.PI;

      var _iterator2 = _createForOfIteratorHelper(loadedObject.paths),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var path = _step2.value;
          var shapes = SVGLoader.createShapes(path);

          if (ShowFill(path)) {
            var pathStyle = path.userData.style;
            var pathMaterial = GetOrCreateMaterial(materials, pathStyle.fill, pathStyle.opacity);

            var _iterator3 = _createForOfIteratorHelper(shapes),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var shape = _step3.value;
                var geometry = new THREE.ExtrudeGeometry(shape, {
                  depth: 10,
                  bevelEnabled: false
                });
                var mesh = new THREE.Mesh(geometry, pathMaterial);
                mesh.name = path.userData.node.id;
                object.add(mesh);
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return object;
    }
  }]);

  return ImporterThreeSvg;
}(ImporterThreeBase);