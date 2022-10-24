function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Coord3D } from "./coord3d.js";
export var Box3D = /*#__PURE__*/function () {
  function Box3D(min, max) {
    _classCallCheck(this, Box3D);

    this.min = min;
    this.max = max;
  }

  _createClass(Box3D, [{
    key: "GetMin",
    value: function GetMin() {
      return this.min;
    }
  }, {
    key: "GetMax",
    value: function GetMax() {
      return this.max;
    }
  }, {
    key: "GetCenter",
    value: function GetCenter() {
      return new Coord3D((this.min.x + this.max.x) / 2.0, (this.min.y + this.max.y) / 2.0, (this.min.z + this.max.z) / 2.0);
    }
  }]);

  return Box3D;
}();
export var BoundingBoxCalculator3D = /*#__PURE__*/function () {
  function BoundingBoxCalculator3D() {
    _classCallCheck(this, BoundingBoxCalculator3D);

    this.box = new Box3D(new Coord3D(Infinity, Infinity, Infinity), new Coord3D(-Infinity, -Infinity, -Infinity));
    this.isValid = false;
  }

  _createClass(BoundingBoxCalculator3D, [{
    key: "GetBox",
    value: function GetBox() {
      if (!this.isValid) {
        return null;
      }

      return this.box;
    }
  }, {
    key: "AddPoint",
    value: function AddPoint(point) {
      this.box.min.x = Math.min(this.box.min.x, point.x);
      this.box.min.y = Math.min(this.box.min.y, point.y);
      this.box.min.z = Math.min(this.box.min.z, point.z);
      this.box.max.x = Math.max(this.box.max.x, point.x);
      this.box.max.y = Math.max(this.box.max.y, point.y);
      this.box.max.z = Math.max(this.box.max.z, point.z);
      this.isValid = true;
    }
  }]);

  return BoundingBoxCalculator3D;
}();