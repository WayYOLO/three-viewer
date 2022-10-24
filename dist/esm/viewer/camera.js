function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { CoordIsEqual3D } from "../geometry/coord3d.js";
import { IsEqual } from "../geometry/geometry.js";
export var Camera = /*#__PURE__*/function () {
  function Camera(eye, center, up, fov) {
    _classCallCheck(this, Camera);

    this.eye = eye;
    this.center = center;
    this.up = up;
    this.fov = fov;
  }

  _createClass(Camera, [{
    key: "Clone",
    value: function Clone() {
      return new Camera(this.eye.Clone(), this.center.Clone(), this.up.Clone(), this.fov);
    }
  }]);

  return Camera;
}();
export function CameraIsEqual3D(a, b) {
  return CoordIsEqual3D(a.eye, b.eye) && CoordIsEqual3D(a.center, b.center) && CoordIsEqual3D(a.up, b.up) && IsEqual(a.fov, b.fov);
}