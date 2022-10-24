function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

export var RGBColor = /*#__PURE__*/function () {
  function RGBColor(r, g, b) {
    _classCallCheck(this, RGBColor);

    this.r = r; // 0 .. 255

    this.g = g; // 0 .. 255

    this.b = b; // 0 .. 255
  }

  _createClass(RGBColor, [{
    key: "Set",
    value: function Set(r, g, b) {
      this.r = r;
      this.g = g;
      this.b = b;
    }
  }, {
    key: "Clone",
    value: function Clone() {
      return new RGBColor(this.r, this.g, this.b);
    }
  }]);

  return RGBColor;
}();
export var RGBAColor = /*#__PURE__*/function () {
  function RGBAColor(r, g, b, a) {
    _classCallCheck(this, RGBAColor);

    this.r = r; // 0 .. 255

    this.g = g; // 0 .. 255

    this.b = b; // 0 .. 255

    this.a = a; // 0 .. 255
  }

  _createClass(RGBAColor, [{
    key: "Set",
    value: function Set(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
  }, {
    key: "Clone",
    value: function Clone() {
      return new RGBAColor(this.r, this.g, this.b, this.a);
    }
  }]);

  return RGBAColor;
}();
export function ColorComponentFromFloat(component) {
  return parseInt(Math.round(component * 255.0), 10);
}
export function ColorComponentToFloat(component) {
  return component / 255.0;
}
export function RGBColorFromFloatComponents(r, g, b) {
  return new RGBColor(ColorComponentFromFloat(r), ColorComponentFromFloat(g), ColorComponentFromFloat(b));
}
export function SRGBToLinear(component) {
  if (component < 0.04045) {
    return component * 0.0773993808;
  } else {
    return Math.pow(component * 0.9478672986 + 0.0521327014, 2.4);
  }
}
export function LinearToSRGB(component) {
  if (component < 0.0031308) {
    return component * 12.92;
  } else {
    return 1.055 * Math.pow(component, 0.41666) - 0.055;
  }
}
export function IntegerToHexString(intVal) {
  var result = parseInt(intVal, 10).toString(16);

  while (result.length < 2) {
    result = '0' + result;
  }

  return result;
}
export function RGBColorToHexString(color) {
  var r = IntegerToHexString(color.r);
  var g = IntegerToHexString(color.g);
  var b = IntegerToHexString(color.b);
  return r + g + b;
}
export function RGBAColorToHexString(color) {
  var r = IntegerToHexString(color.r);
  var g = IntegerToHexString(color.g);
  var b = IntegerToHexString(color.b);
  var a = IntegerToHexString(color.a);
  return r + g + b + a;
}
export function HexStringToRGBColor(hexString) {
  if (hexString.length !== 6) {
    return null;
  }

  var r = parseInt(hexString.substring(0, 2), 16);
  var g = parseInt(hexString.substring(2, 4), 16);
  var b = parseInt(hexString.substring(4, 6), 16);
  return new RGBColor(r, g, b);
}
export function ArrayToRGBColor(arr) {
  return new RGBColor(arr[0], arr[1], arr[2]);
}
export function RGBColorIsEqual(a, b) {
  return a.r === b.r && a.g === b.g && a.b === b.b;
}