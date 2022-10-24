function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { IsLower } from "../geometry/geometry.js";
import { PhongMaterial } from "../model/material.js";
import { RGBColor, IntegerToHexString } from "../model/color.js";
export function NameFromLine(line, startIndex, commentChar) {
  var name = line.substring(startIndex);
  var commentStart = name.indexOf(commentChar);

  if (commentStart !== -1) {
    name = name.substring(0, commentStart);
  }

  return name.trim();
}
export function ParametersFromLine(line, commentChar) {
  if (commentChar !== null) {
    var commentStart = line.indexOf(commentChar);

    if (commentStart !== -1) {
      line = line.substring(0, commentStart).trim();
    }
  }

  return line.split(/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/);
}
export function ReadLines(str, onLine) {
  function LineFound(line, onLine) {
    var trimmed = line.trim();

    if (trimmed.length > 0) {
      onLine(trimmed);
    }
  }

  var cursor = 0;
  var next = str.indexOf('\n', cursor);

  while (next !== -1) {
    LineFound(str.substring(cursor, next), onLine);
    cursor = next + 1;
    next = str.indexOf('\n', cursor);
  }

  LineFound(str.substring(cursor), onLine);
}
export function IsPowerOfTwo(x) {
  return (x & x - 1) === 0;
}
export function NextPowerOfTwo(x) {
  if (IsPowerOfTwo(x)) {
    return x;
  }

  var npot = Math.pow(2, Math.ceil(Math.log(x) / Math.log(2)));
  return parseInt(npot, 10);
}
export function UpdateMaterialTransparency(material) {
  material.transparent = false;

  if (IsLower(material.opacity, 1.0)) {
    material.transparent = true;
  }
}
export var ColorToMaterialConverter = /*#__PURE__*/function () {
  function ColorToMaterialConverter(model) {
    _classCallCheck(this, ColorToMaterialConverter);

    this.model = model;
    this.colorToMaterialIndex = new Map();
  }

  _createClass(ColorToMaterialConverter, [{
    key: "GetMaterialIndex",
    value: function GetMaterialIndex(r, g, b, a) {
      var colorKey = IntegerToHexString(r) + IntegerToHexString(g) + IntegerToHexString(b);
      var hasAlpha = a !== undefined && a !== null;

      if (hasAlpha) {
        colorKey += IntegerToHexString(a);
      }

      if (this.colorToMaterialIndex.has(colorKey)) {
        return this.colorToMaterialIndex.get(colorKey);
      } else {
        var material = new PhongMaterial();
        material.name = colorKey.toUpperCase();
        material.color = new RGBColor(r, g, b);

        if (hasAlpha && a < 255) {
          material.opacity = a / 255.0;
          UpdateMaterialTransparency(material);
        }

        var materialIndex = this.model.AddMaterial(material);
        this.colorToMaterialIndex.set(colorKey, materialIndex);
        return materialIndex;
      }
    }
  }]);

  return ColorToMaterialConverter;
}();