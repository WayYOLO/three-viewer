function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { IsEqual } from "./geometry.js";
export var Coord3D = /*#__PURE__*/function () {
  function Coord3D(x, y, z) {
    _classCallCheck(this, Coord3D);

    this.x = x;
    this.y = y;
    this.z = z;
  }

  _createClass(Coord3D, [{
    key: "Length",
    value: function Length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
  }, {
    key: "MultiplyScalar",
    value: function MultiplyScalar(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
    }
  }, {
    key: "Normalize",
    value: function Normalize() {
      var length = this.Length();

      if (length > 0.0) {
        this.MultiplyScalar(1.0 / length);
      }

      return this;
    }
  }, {
    key: "Offset",
    value: function Offset(direction, distance) {
      var normal = direction.Clone().Normalize();
      this.x += normal.x * distance;
      this.y += normal.y * distance;
      this.z += normal.z * distance;
      return this;
    }
  }, {
    key: "Rotate",
    value: function Rotate(axis, angle, origo) {
      var normal = axis.Clone().Normalize();
      var u = normal.x;
      var v = normal.y;
      var w = normal.z;
      var x = this.x - origo.x;
      var y = this.y - origo.y;
      var z = this.z - origo.z;
      var si = Math.sin(angle);
      var co = Math.cos(angle);
      this.x = -u * (-u * x - v * y - w * z) * (1.0 - co) + x * co + (-w * y + v * z) * si;
      this.y = -v * (-u * x - v * y - w * z) * (1.0 - co) + y * co + (w * x - u * z) * si;
      this.z = -w * (-u * x - v * y - w * z) * (1.0 - co) + z * co + (-v * x + u * y) * si;
      this.x += origo.x;
      this.y += origo.y;
      this.z += origo.z;
      return this;
    }
  }, {
    key: "Clone",
    value: function Clone() {
      return new Coord3D(this.x, this.y, this.z);
    }
  }]);

  return Coord3D;
}();
export function CoordIsEqual3D(a, b) {
  return IsEqual(a.x, b.x) && IsEqual(a.y, b.y) && IsEqual(a.z, b.z);
}
export function AddCoord3D(a, b) {
  return new Coord3D(a.x + b.x, a.y + b.y, a.z + b.z);
}
export function SubCoord3D(a, b) {
  return new Coord3D(a.x - b.x, a.y - b.y, a.z - b.z);
}
export function CoordDistance3D(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z));
}
export function DotVector3D(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
export function VectorAngle3D(a, b) {
  var aDirection = a.Clone().Normalize();
  var bDirection = b.Clone().Normalize();

  if (CoordIsEqual3D(aDirection, bDirection)) {
    return 0.0;
  }

  var product = DotVector3D(aDirection, bDirection);
  return Math.acos(product);
}
export function CrossVector3D(a, b) {
  var result = new Coord3D(0.0, 0.0, 0.0);
  result.x = a.y * b.z - a.z * b.y;
  result.y = a.z * b.x - a.x * b.z;
  result.z = a.x * b.y - a.y * b.x;
  return result;
}
export function VectorLength3D(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z);
}
export function ArrayToCoord3D(arr) {
  return new Coord3D(arr[0], arr[1], arr[2]);
}