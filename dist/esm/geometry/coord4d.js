function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

export var Coord4D = /*#__PURE__*/function () {
  function Coord4D(x, y, z, w) {
    _classCallCheck(this, Coord4D);

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  _createClass(Coord4D, [{
    key: "Clone",
    value: function Clone() {
      return new Coord4D(this.x, this.y, this.z, this.w);
    }
  }]);

  return Coord4D;
}();