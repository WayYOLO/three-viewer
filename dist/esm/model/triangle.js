function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

export var Triangle = /*#__PURE__*/function () {
  function Triangle(v0, v1, v2) {
    _classCallCheck(this, Triangle);

    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.c0 = null;
    this.c1 = null;
    this.c2 = null;
    this.n0 = null;
    this.n1 = null;
    this.n2 = null;
    this.u0 = null;
    this.u1 = null;
    this.u2 = null;
    this.mat = null;
    this.curve = null;
  }

  _createClass(Triangle, [{
    key: "HasVertices",
    value: function HasVertices() {
      return this.v0 !== null && this.v1 !== null && this.v2 !== null;
    }
  }, {
    key: "HasVertexColors",
    value: function HasVertexColors() {
      return this.c0 !== null && this.c1 !== null && this.c2 !== null;
    }
  }, {
    key: "HasNormals",
    value: function HasNormals() {
      return this.n0 !== null && this.n1 !== null && this.n2 !== null;
    }
  }, {
    key: "HasTextureUVs",
    value: function HasTextureUVs() {
      return this.u0 !== null && this.u1 !== null && this.u2 !== null;
    }
  }, {
    key: "SetVertices",
    value: function SetVertices(v0, v1, v2) {
      this.v0 = v0;
      this.v1 = v1;
      this.v2 = v2;
      return this;
    }
  }, {
    key: "SetVertexColors",
    value: function SetVertexColors(c0, c1, c2) {
      this.c0 = c0;
      this.c1 = c1;
      this.c2 = c2;
      return this;
    }
  }, {
    key: "SetNormals",
    value: function SetNormals(n0, n1, n2) {
      this.n0 = n0;
      this.n1 = n1;
      this.n2 = n2;
      return this;
    }
  }, {
    key: "SetTextureUVs",
    value: function SetTextureUVs(u0, u1, u2) {
      this.u0 = u0;
      this.u1 = u1;
      this.u2 = u2;
      return this;
    }
  }, {
    key: "SetMaterial",
    value: function SetMaterial(mat) {
      this.mat = mat;
      return this;
    }
  }, {
    key: "SetCurve",
    value: function SetCurve(curve) {
      this.curve = curve;
      return this;
    }
  }, {
    key: "Clone",
    value: function Clone() {
      var cloned = new Triangle(this.v0, this.v1, this.v2);
      cloned.SetVertexColors(this.c0, this.c1, this.c2);
      cloned.SetNormals(this.n0, this.n1, this.n2);
      cloned.SetTextureUVs(this.u0, this.u1, this.u2);
      cloned.SetMaterial(this.mat);
      cloned.SetCurve(this.curve);
      return cloned;
    }
  }]);

  return Triangle;
}();