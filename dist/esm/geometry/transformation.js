function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Coord3D } from "./coord3d.js";
import { Coord4D } from "./coord4d.js";
import { Matrix, MatrixIsEqual } from "./matrix.js";
export var Transformation = /*#__PURE__*/function () {
  function Transformation(matrix) {
    _classCallCheck(this, Transformation);

    if (matrix !== undefined && matrix !== null) {
      this.matrix = matrix;
    } else {
      this.matrix = new Matrix();
      this.matrix.CreateIdentity();
    }
  }

  _createClass(Transformation, [{
    key: "SetMatrix",
    value: function SetMatrix(matrix) {
      this.matrix = matrix;
      return this;
    }
  }, {
    key: "GetMatrix",
    value: function GetMatrix() {
      return this.matrix;
    }
  }, {
    key: "IsIdentity",
    value: function IsIdentity() {
      return this.matrix.IsIdentity();
    }
  }, {
    key: "AppendMatrix",
    value: function AppendMatrix(matrix) {
      this.matrix = this.matrix.MultiplyMatrix(matrix);
      return this;
    }
  }, {
    key: "Append",
    value: function Append(transformation) {
      this.AppendMatrix(transformation.GetMatrix());
      return this;
    }
  }, {
    key: "TransformCoord3D",
    value: function TransformCoord3D(coord) {
      var coord4D = new Coord4D(coord.x, coord.y, coord.z, 1.0);
      var resultCoord4D = this.matrix.MultiplyVector(coord4D);
      var result = new Coord3D(resultCoord4D.x, resultCoord4D.y, resultCoord4D.z);
      return result;
    }
  }, {
    key: "Clone",
    value: function Clone() {
      var clonedMatrix = this.matrix.Clone();
      return new Transformation(clonedMatrix);
    }
  }]);

  return Transformation;
}();
export function TransformationIsEqual(a, b) {
  return MatrixIsEqual(a.GetMatrix(), b.GetMatrix());
}