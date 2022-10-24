function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Quaternion } from "./quaternion.js";
import { Coord3D, VectorLength3D } from "./coord3d.js";
import { Coord4D } from "./coord4d.js";
import { IsEqual, IsNegative } from "./geometry.js";
import { QuaternionFromAxisAngle } from "./quaternion.js";
export var Matrix = /*#__PURE__*/function () {
  function Matrix(matrix) {
    _classCallCheck(this, Matrix);

    this.matrix = null;

    if (matrix !== undefined && matrix !== null) {
      this.matrix = matrix;
    }
  }

  _createClass(Matrix, [{
    key: "IsValid",
    value: function IsValid() {
      return this.matrix !== null;
    }
  }, {
    key: "Set",
    value: function Set(matrix) {
      this.matrix = matrix;
      return this;
    }
  }, {
    key: "Get",
    value: function Get() {
      return this.matrix;
    }
  }, {
    key: "Clone",
    value: function Clone() {
      var result = [this.matrix[0], this.matrix[1], this.matrix[2], this.matrix[3], this.matrix[4], this.matrix[5], this.matrix[6], this.matrix[7], this.matrix[8], this.matrix[9], this.matrix[10], this.matrix[11], this.matrix[12], this.matrix[13], this.matrix[14], this.matrix[15]];
      return new Matrix(result);
    }
  }, {
    key: "CreateIdentity",
    value: function CreateIdentity() {
      this.matrix = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0];
      return this;
    }
  }, {
    key: "IsIdentity",
    value: function IsIdentity() {
      var identity = new Matrix().CreateIdentity().Get();

      for (var i = 0; i < 16; i++) {
        if (!IsEqual(this.matrix[i], identity[i])) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "CreateTranslation",
    value: function CreateTranslation(x, y, z) {
      this.matrix = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, x, y, z, 1.0];
      return this;
    }
  }, {
    key: "CreateRotation",
    value: function CreateRotation(x, y, z, w) {
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var xy = x * y2;
      var xz = x * z2;
      var yy = y * y2;
      var yz = y * z2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      this.matrix = [1.0 - (yy + zz), xy + wz, xz - wy, 0.0, xy - wz, 1.0 - (xx + zz), yz + wx, 0.0, xz + wy, yz - wx, 1.0 - (xx + yy), 0.0, 0.0, 0.0, 0.0, 1.0];
      return this;
    }
  }, {
    key: "CreateRotationAxisAngle",
    value: function CreateRotationAxisAngle(axis, angle) {
      var quaternion = QuaternionFromAxisAngle(axis, angle);
      return this.CreateRotation(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    }
  }, {
    key: "CreateScale",
    value: function CreateScale(x, y, z) {
      this.matrix = [x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, z, 0.0, 0.0, 0.0, 0.0, 1.0];
      return this;
    }
  }, {
    key: "ComposeTRS",
    value: function ComposeTRS(translation, rotation, scale) {
      var tx = translation.x;
      var ty = translation.y;
      var tz = translation.z;
      var qx = rotation.x;
      var qy = rotation.y;
      var qz = rotation.z;
      var qw = rotation.w;
      var sx = scale.x;
      var sy = scale.y;
      var sz = scale.z;
      var x2 = qx + qx;
      var y2 = qy + qy;
      var z2 = qz + qz;
      var xx = qx * x2;
      var xy = qx * y2;
      var xz = qx * z2;
      var yy = qy * y2;
      var yz = qy * z2;
      var zz = qz * z2;
      var wx = qw * x2;
      var wy = qw * y2;
      var wz = qw * z2;
      this.matrix = [(1.0 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0.0, (xy - wz) * sy, (1.0 - (xx + zz)) * sy, (yz + wx) * sy, 0.0, (xz + wy) * sz, (yz - wx) * sz, (1.0 - (xx + yy)) * sz, 0.0, tx, ty, tz, 1.0];
      return this;
    }
  }, {
    key: "DecomposeTRS",
    value: function DecomposeTRS() {
      var translation = new Coord3D(this.matrix[12], this.matrix[13], this.matrix[14]);
      var sx = VectorLength3D(this.matrix[0], this.matrix[1], this.matrix[2]);
      var sy = VectorLength3D(this.matrix[4], this.matrix[5], this.matrix[6]);
      var sz = VectorLength3D(this.matrix[8], this.matrix[9], this.matrix[10]);
      var determinant = this.Determinant();

      if (IsNegative(determinant)) {
        sx *= -1.0;
      }

      var scale = new Coord3D(sx, sy, sz);
      var m00 = this.matrix[0] / sx;
      var m01 = this.matrix[4] / sy;
      var m02 = this.matrix[8] / sz;
      var m10 = this.matrix[1] / sx;
      var m11 = this.matrix[5] / sy;
      var m12 = this.matrix[9] / sz;
      var m20 = this.matrix[2] / sx;
      var m21 = this.matrix[6] / sy;
      var m22 = this.matrix[10] / sz; // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

      var rotation = null;
      var tr = m00 + m11 + m22;

      if (tr > 0.0) {
        var s = Math.sqrt(tr + 1.0) * 2.0;
        rotation = new Quaternion((m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s, 0.25 * s);
      } else if (m00 > m11 && m00 > m22) {
        var _s = Math.sqrt(1.0 + m00 - m11 - m22) * 2.0;

        rotation = new Quaternion(0.25 * _s, (m01 + m10) / _s, (m02 + m20) / _s, (m21 - m12) / _s);
      } else if (m11 > m22) {
        var _s2 = Math.sqrt(1.0 + m11 - m00 - m22) * 2.0;

        rotation = new Quaternion((m01 + m10) / _s2, 0.25 * _s2, (m12 + m21) / _s2, (m02 - m20) / _s2);
      } else {
        var _s3 = Math.sqrt(1.0 + m22 - m00 - m11) * 2.0;

        rotation = new Quaternion((m02 + m20) / _s3, (m12 + m21) / _s3, 0.25 * _s3, (m10 - m01) / _s3);
      }

      return {
        translation: translation,
        rotation: rotation,
        scale: scale
      };
    }
  }, {
    key: "Determinant",
    value: function Determinant() {
      var a00 = this.matrix[0];
      var a01 = this.matrix[1];
      var a02 = this.matrix[2];
      var a03 = this.matrix[3];
      var a10 = this.matrix[4];
      var a11 = this.matrix[5];
      var a12 = this.matrix[6];
      var a13 = this.matrix[7];
      var a20 = this.matrix[8];
      var a21 = this.matrix[9];
      var a22 = this.matrix[10];
      var a23 = this.matrix[11];
      var a30 = this.matrix[12];
      var a31 = this.matrix[13];
      var a32 = this.matrix[14];
      var a33 = this.matrix[15];
      var b00 = a00 * a11 - a01 * a10;
      var b01 = a00 * a12 - a02 * a10;
      var b02 = a00 * a13 - a03 * a10;
      var b03 = a01 * a12 - a02 * a11;
      var b04 = a01 * a13 - a03 * a11;
      var b05 = a02 * a13 - a03 * a12;
      var b06 = a20 * a31 - a21 * a30;
      var b07 = a20 * a32 - a22 * a30;
      var b08 = a20 * a33 - a23 * a30;
      var b09 = a21 * a32 - a22 * a31;
      var b10 = a21 * a33 - a23 * a31;
      var b11 = a22 * a33 - a23 * a32;
      var determinant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      return determinant;
    }
  }, {
    key: "Invert",
    value: function Invert() {
      var a00 = this.matrix[0];
      var a01 = this.matrix[1];
      var a02 = this.matrix[2];
      var a03 = this.matrix[3];
      var a10 = this.matrix[4];
      var a11 = this.matrix[5];
      var a12 = this.matrix[6];
      var a13 = this.matrix[7];
      var a20 = this.matrix[8];
      var a21 = this.matrix[9];
      var a22 = this.matrix[10];
      var a23 = this.matrix[11];
      var a30 = this.matrix[12];
      var a31 = this.matrix[13];
      var a32 = this.matrix[14];
      var a33 = this.matrix[15];
      var b00 = a00 * a11 - a01 * a10;
      var b01 = a00 * a12 - a02 * a10;
      var b02 = a00 * a13 - a03 * a10;
      var b03 = a01 * a12 - a02 * a11;
      var b04 = a01 * a13 - a03 * a11;
      var b05 = a02 * a13 - a03 * a12;
      var b06 = a20 * a31 - a21 * a30;
      var b07 = a20 * a32 - a22 * a30;
      var b08 = a20 * a33 - a23 * a30;
      var b09 = a21 * a32 - a22 * a31;
      var b10 = a21 * a33 - a23 * a31;
      var b11 = a22 * a33 - a23 * a32;
      var determinant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

      if (IsEqual(determinant, 0.0)) {
        return null;
      }

      var result = [(a11 * b11 - a12 * b10 + a13 * b09) / determinant, (a02 * b10 - a01 * b11 - a03 * b09) / determinant, (a31 * b05 - a32 * b04 + a33 * b03) / determinant, (a22 * b04 - a21 * b05 - a23 * b03) / determinant, (a12 * b08 - a10 * b11 - a13 * b07) / determinant, (a00 * b11 - a02 * b08 + a03 * b07) / determinant, (a32 * b02 - a30 * b05 - a33 * b01) / determinant, (a20 * b05 - a22 * b02 + a23 * b01) / determinant, (a10 * b10 - a11 * b08 + a13 * b06) / determinant, (a01 * b08 - a00 * b10 - a03 * b06) / determinant, (a30 * b04 - a31 * b02 + a33 * b00) / determinant, (a21 * b02 - a20 * b04 - a23 * b00) / determinant, (a11 * b07 - a10 * b09 - a12 * b06) / determinant, (a00 * b09 - a01 * b07 + a02 * b06) / determinant, (a31 * b01 - a30 * b03 - a32 * b00) / determinant, (a20 * b03 - a21 * b01 + a22 * b00) / determinant];
      return new Matrix(result);
    }
  }, {
    key: "Transpose",
    value: function Transpose() {
      var result = [this.matrix[0], this.matrix[4], this.matrix[8], this.matrix[12], this.matrix[1], this.matrix[5], this.matrix[9], this.matrix[13], this.matrix[2], this.matrix[6], this.matrix[10], this.matrix[14], this.matrix[3], this.matrix[7], this.matrix[11], this.matrix[15]];
      return new Matrix(result);
    }
  }, {
    key: "InvertTranspose",
    value: function InvertTranspose() {
      var result = this.Invert();

      if (result === null) {
        return null;
      }

      return result.Transpose();
    }
  }, {
    key: "MultiplyVector",
    value: function MultiplyVector(vector) {
      var a00 = vector.x;
      var a01 = vector.y;
      var a02 = vector.z;
      var a03 = vector.w;
      var b00 = this.matrix[0];
      var b01 = this.matrix[1];
      var b02 = this.matrix[2];
      var b03 = this.matrix[3];
      var b10 = this.matrix[4];
      var b11 = this.matrix[5];
      var b12 = this.matrix[6];
      var b13 = this.matrix[7];
      var b20 = this.matrix[8];
      var b21 = this.matrix[9];
      var b22 = this.matrix[10];
      var b23 = this.matrix[11];
      var b30 = this.matrix[12];
      var b31 = this.matrix[13];
      var b32 = this.matrix[14];
      var b33 = this.matrix[15];
      var result = new Coord4D(a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30, a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31, a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32, a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33);
      return result;
    }
  }, {
    key: "MultiplyMatrix",
    value: function MultiplyMatrix(matrix) {
      var a00 = this.matrix[0];
      var a01 = this.matrix[1];
      var a02 = this.matrix[2];
      var a03 = this.matrix[3];
      var a10 = this.matrix[4];
      var a11 = this.matrix[5];
      var a12 = this.matrix[6];
      var a13 = this.matrix[7];
      var a20 = this.matrix[8];
      var a21 = this.matrix[9];
      var a22 = this.matrix[10];
      var a23 = this.matrix[11];
      var a30 = this.matrix[12];
      var a31 = this.matrix[13];
      var a32 = this.matrix[14];
      var a33 = this.matrix[15];
      var b00 = matrix.matrix[0];
      var b01 = matrix.matrix[1];
      var b02 = matrix.matrix[2];
      var b03 = matrix.matrix[3];
      var b10 = matrix.matrix[4];
      var b11 = matrix.matrix[5];
      var b12 = matrix.matrix[6];
      var b13 = matrix.matrix[7];
      var b20 = matrix.matrix[8];
      var b21 = matrix.matrix[9];
      var b22 = matrix.matrix[10];
      var b23 = matrix.matrix[11];
      var b30 = matrix.matrix[12];
      var b31 = matrix.matrix[13];
      var b32 = matrix.matrix[14];
      var b33 = matrix.matrix[15];
      var result = [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30, a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31, a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32, a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33, a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30, a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31, a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32, a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33, a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30, a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31, a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32, a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33, a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30, a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31, a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32, a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
      return new Matrix(result);
    }
  }]);

  return Matrix;
}();
export function MatrixIsEqual(a, b) {
  var aMatrix = a.Get();
  var bMatrix = b.Get();

  for (var i = 0; i < 16; i++) {
    if (!IsEqual(aMatrix[i], bMatrix[i])) {
      return false;
    }
  }

  return true;
}