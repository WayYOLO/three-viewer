function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { EscapeHtmlChars } from "../core/core.js";
import { RGBColorToHexString } from "./color.js";
export var PropertyType = {
  Text: 1,
  Integer: 2,
  Number: 3,
  Boolean: 4,
  Percent: 5,
  Color: 6
};
export var Property = /*#__PURE__*/function () {
  function Property(type, name, value) {
    _classCallCheck(this, Property);

    this.type = type;
    this.name = name;
    this.value = value;
  }

  _createClass(Property, [{
    key: "Clone",
    value: function Clone() {
      var clonable = this.type === PropertyType.Color;

      if (clonable) {
        return new Property(this.type, this.name, this.value.Clone());
      } else {
        return new Property(this.type, this.name, this.value);
      }
    }
  }]);

  return Property;
}();
export var PropertyGroup = /*#__PURE__*/function () {
  function PropertyGroup(name) {
    _classCallCheck(this, PropertyGroup);

    this.name = name;
    this.properties = [];
  }

  _createClass(PropertyGroup, [{
    key: "PropertyCount",
    value: function PropertyCount() {
      return this.properties.length;
    }
  }, {
    key: "AddProperty",
    value: function AddProperty(property) {
      this.properties.push(property);
    }
  }, {
    key: "GetProperty",
    value: function GetProperty(index) {
      return this.properties[index];
    }
  }, {
    key: "Clone",
    value: function Clone() {
      var cloned = new PropertyGroup(this.name);

      var _iterator = _createForOfIteratorHelper(this.properties),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var property = _step.value;
          cloned.AddProperty(property.Clone());
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return cloned;
    }
  }]);

  return PropertyGroup;
}();
export function PropertyToString(property) {
  if (property.type === PropertyType.Text) {
    return EscapeHtmlChars(property.value);
  } else if (property.type === PropertyType.Integer) {
    return property.value.toLocaleString();
  } else if (property.type === PropertyType.Number) {
    return property.value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else if (property.type === PropertyType.Boolean) {
    return property.value ? 'True' : 'False';
  } else if (property.type === PropertyType.Percent) {
    return parseInt(property.value * 100, 10).toString() + '%';
  } else if (property.type === PropertyType.Color) {
    return '#' + RGBColorToHexString(property.value);
  }

  return null;
}