function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { IsEqual } from "./geometry.js";
export var Coord2D = /*#__PURE__*/function () {
  function Coord2D(x, y) {
    _classCallCheck(this, Coord2D);

    this.x = x;
    this.y = y;
  }

  _createClass(Coord2D, [{
    key: "Clone",
    value: function Clone() {
      return new Coord2D(this.x, this.y);
    }
  }]);

  return Coord2D;
}();
export function CoordIsEqual2D(a, b) {
  return IsEqual(a.x, b.x) && IsEqual(a.y, b.y);
}
export function AddCoord2D(a, b) {
  return new Coord2D(a.x + b.x, a.y + b.y);
}
export function SubCoord2D(a, b) {
  return new Coord2D(a.x - b.x, a.y - b.y);
}
export function CoordDistance2D(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}