function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

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

import { Coord2D, CoordIsEqual2D } from "../geometry/coord2d.js";
import { IsEqual as _IsEqual } from "../geometry/geometry.js";
import { RGBColor, RGBColorIsEqual } from "./color.js";
export var TextureMap = /*#__PURE__*/function () {
  function TextureMap() {
    _classCallCheck(this, TextureMap);

    this.name = null;
    this.mimeType = null;
    this.buffer = null;
    this.offset = new Coord2D(0.0, 0.0);
    this.scale = new Coord2D(1.0, 1.0);
    this.rotation = 0.0; // radians
  }

  _createClass(TextureMap, [{
    key: "IsValid",
    value: function IsValid() {
      return this.name !== null && this.buffer !== null;
    }
  }, {
    key: "HasTransformation",
    value: function HasTransformation() {
      if (!CoordIsEqual2D(this.offset, new Coord2D(0.0, 0.0))) {
        return true;
      }

      if (!CoordIsEqual2D(this.scale, new Coord2D(1.0, 1.0))) {
        return true;
      }

      if (!_IsEqual(this.rotation, 0.0)) {
        return true;
      }

      return false;
    }
  }, {
    key: "IsEqual",
    value: function IsEqual(rhs) {
      if (this.name !== rhs.name) {
        return false;
      }

      if (this.mimeType !== rhs.mimeType) {
        return false;
      }

      if (!CoordIsEqual2D(this.offset, rhs.offset)) {
        return false;
      }

      if (!CoordIsEqual2D(this.scale, rhs.scale)) {
        return false;
      }

      if (!_IsEqual(this.rotation, rhs.rotation)) {
        return false;
      }

      return true;
    }
  }]);

  return TextureMap;
}();
export function TextureMapIsEqual(aTex, bTex) {
  if (aTex === null && bTex === null) {
    return true;
  } else if (aTex === null || bTex === null) {
    return false;
  }

  return aTex.IsEqual(bTex);
}
export var MaterialType = {
  Phong: 1,
  Physical: 2
};
export var MaterialBase = /*#__PURE__*/function () {
  function MaterialBase(type) {
    _classCallCheck(this, MaterialBase);

    this.type = type;
    this.isDefault = false;
    this.name = '';
    this.color = new RGBColor(0, 0, 0);
    this.vertexColors = false;
  }

  _createClass(MaterialBase, [{
    key: "IsEqual",
    value: function IsEqual(rhs) {
      if (this.type !== rhs.type) {
        return false;
      }

      if (this.isDefault !== rhs.isDefault) {
        return false;
      }

      if (this.name !== rhs.name) {
        return false;
      }

      if (!RGBColorIsEqual(this.color, rhs.color)) {
        return false;
      }

      if (this.vertexColors !== rhs.vertexColors) {
        return false;
      }

      return true;
    }
  }]);

  return MaterialBase;
}();
export var FaceMaterial = /*#__PURE__*/function (_MaterialBase) {
  _inherits(FaceMaterial, _MaterialBase);

  var _super = _createSuper(FaceMaterial);

  function FaceMaterial(type) {
    var _this;

    _classCallCheck(this, FaceMaterial);

    _this = _super.call(this, type);
    _this.emissive = new RGBColor(0, 0, 0);
    _this.opacity = 1.0; // 0.0 .. 1.0

    _this.transparent = false;
    _this.diffuseMap = null;
    _this.bumpMap = null;
    _this.normalMap = null;
    _this.emissiveMap = null;
    _this.alphaTest = 0.0; // 0.0 .. 1.0

    _this.multiplyDiffuseMap = false;
    return _this;
  }

  _createClass(FaceMaterial, [{
    key: "IsEqual",
    value: function IsEqual(rhs) {
      if (!_get(_getPrototypeOf(FaceMaterial.prototype), "IsEqual", this).call(this, rhs)) {
        return false;
      }

      if (!RGBColorIsEqual(this.emissive, rhs.emissive)) {
        return false;
      }

      if (!_IsEqual(this.opacity, rhs.opacity)) {
        return false;
      }

      if (this.transparent !== rhs.transparent) {
        return false;
      }

      if (!TextureMapIsEqual(this.diffuseMap, rhs.diffuseMap)) {
        return false;
      }

      if (!TextureMapIsEqual(this.bumpMap, rhs.bumpMap)) {
        return false;
      }

      if (!TextureMapIsEqual(this.normalMap, rhs.normalMap)) {
        return false;
      }

      if (!TextureMapIsEqual(this.emissiveMap, rhs.emissiveMap)) {
        return false;
      }

      if (!_IsEqual(this.alphaTest, rhs.alphaTest)) {
        return false;
      }

      if (this.multiplyDiffuseMap !== rhs.multiplyDiffuseMap) {
        return false;
      }

      return true;
    }
  }]);

  return FaceMaterial;
}(MaterialBase);
export var PhongMaterial = /*#__PURE__*/function (_FaceMaterial) {
  _inherits(PhongMaterial, _FaceMaterial);

  var _super2 = _createSuper(PhongMaterial);

  function PhongMaterial() {
    var _this2;

    _classCallCheck(this, PhongMaterial);

    _this2 = _super2.call(this, MaterialType.Phong);
    _this2.ambient = new RGBColor(0, 0, 0);
    _this2.specular = new RGBColor(0, 0, 0);
    _this2.shininess = 0.0; // 0.0 .. 1.0

    _this2.specularMap = null;
    return _this2;
  }

  _createClass(PhongMaterial, [{
    key: "IsEqual",
    value: function IsEqual(rhs) {
      if (!_get(_getPrototypeOf(PhongMaterial.prototype), "IsEqual", this).call(this, rhs)) {
        return false;
      }

      if (!RGBColorIsEqual(this.ambient, rhs.ambient)) {
        return false;
      }

      if (!RGBColorIsEqual(this.specular, rhs.specular)) {
        return false;
      }

      if (!_IsEqual(this.shininess, rhs.shininess)) {
        return false;
      }

      if (!TextureMapIsEqual(this.specularMap, rhs.specularMap)) {
        return false;
      }

      return true;
    }
  }]);

  return PhongMaterial;
}(FaceMaterial);
export var PhysicalMaterial = /*#__PURE__*/function (_FaceMaterial2) {
  _inherits(PhysicalMaterial, _FaceMaterial2);

  var _super3 = _createSuper(PhysicalMaterial);

  function PhysicalMaterial() {
    var _this3;

    _classCallCheck(this, PhysicalMaterial);

    _this3 = _super3.call(this, MaterialType.Physical);
    _this3.metalness = 0.0; // 0.0 .. 1.0

    _this3.roughness = 1.0; // 0.0 .. 1.0

    _this3.metalnessMap = null;
    return _this3;
  }

  _createClass(PhysicalMaterial, [{
    key: "IsEqual",
    value: function IsEqual(rhs) {
      if (!_get(_getPrototypeOf(PhysicalMaterial.prototype), "IsEqual", this).call(this, rhs)) {
        return false;
      }

      if (!_IsEqual(this.metalness, rhs.metalness)) {
        return false;
      }

      if (!_IsEqual(this.roughness, rhs.roughness)) {
        return false;
      }

      if (!TextureMapIsEqual(this.metalnessMap, rhs.metalnessMap)) {
        return false;
      }

      return true;
    }
  }]);

  return PhysicalMaterial;
}(FaceMaterial);
export function TextureIsEqual(a, b) {
  if (a.name !== b.name) {
    return false;
  }

  if (a.mimeType !== b.mimeType) {
    return false;
  }

  if (!CoordIsEqual2D(a.offset, b.offset)) {
    return false;
  }

  if (!CoordIsEqual2D(a.scale, b.scale)) {
    return false;
  }

  if (!_IsEqual(a.rotation, b.rotation)) {
    return false;
  }

  return true;
}