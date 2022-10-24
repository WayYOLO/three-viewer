function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Coord2D } from "../geometry/coord2d.js";
import { Coord3D } from "../geometry/coord3d.js";
import { IsPositive, IsNegative, IsZero } from "../geometry/geometry.js";
import { Mesh } from "./mesh.js";
import { Triangle } from "./triangle.js";
export var GeneratorParams = /*#__PURE__*/function () {
  function GeneratorParams() {
    _classCallCheck(this, GeneratorParams);

    this.name = null;
    this.material = null;
  }

  _createClass(GeneratorParams, [{
    key: "SetName",
    value: function SetName(name) {
      this.name = name;
      return this;
    }
  }, {
    key: "SetMaterial",
    value: function SetMaterial(material) {
      this.material = material;
      return this;
    }
  }]);

  return GeneratorParams;
}();
export var Generator = /*#__PURE__*/function () {
  function Generator(params) {
    _classCallCheck(this, Generator);

    this.params = params || new GeneratorParams();
    this.mesh = new Mesh();

    if (this.params.name !== null) {
      this.mesh.SetName(this.params.name);
    }

    this.curve = null;
  }

  _createClass(Generator, [{
    key: "GetMesh",
    value: function GetMesh() {
      return this.mesh;
    }
  }, {
    key: "AddVertex",
    value: function AddVertex(x, y, z) {
      var coord = new Coord3D(x, y, z);
      return this.mesh.AddVertex(coord);
    }
  }, {
    key: "AddVertices",
    value: function AddVertices(vertices) {
      var indices = [];

      for (var i = 0; i < vertices.length; i++) {
        var vertex = vertices[i];
        indices.push(this.AddVertex(vertex.x, vertex.y, vertex.z));
      }

      return indices;
    }
  }, {
    key: "SetCurve",
    value: function SetCurve(curve) {
      this.curve = curve;
    }
  }, {
    key: "ResetCurve",
    value: function ResetCurve() {
      this.curve = null;
    }
  }, {
    key: "AddTriangle",
    value: function AddTriangle(v0, v1, v2) {
      var triangle = new Triangle(v0, v1, v2);

      if (this.params.material !== null) {
        triangle.mat = this.params.material;
      }

      if (this.curve !== null) {
        triangle.SetCurve(this.curve);
      }

      return this.mesh.AddTriangle(triangle);
    }
  }, {
    key: "AddTriangleInverted",
    value: function AddTriangleInverted(v0, v1, v2) {
      this.AddTriangle(v0, v2, v1);
    }
  }, {
    key: "AddConvexPolygon",
    value: function AddConvexPolygon(vertices) {
      for (var vertexIndex = 0; vertexIndex < vertices.length - 2; vertexIndex++) {
        this.AddTriangle(vertices[0], vertices[vertexIndex + 1], vertices[vertexIndex + 2]);
      }
    }
  }, {
    key: "AddConvexPolygonInverted",
    value: function AddConvexPolygonInverted(vertices) {
      for (var vertexIndex = 0; vertexIndex < vertices.length - 2; vertexIndex++) {
        this.AddTriangleInverted(vertices[0], vertices[vertexIndex + 1], vertices[vertexIndex + 2]);
      }
    }
  }]);

  return Generator;
}();
export var GeneratorHelper = /*#__PURE__*/function () {
  function GeneratorHelper(generator) {
    _classCallCheck(this, GeneratorHelper);

    this.generator = generator;
  }

  _createClass(GeneratorHelper, [{
    key: "GenerateSurfaceBetweenPolygons",
    value: function GenerateSurfaceBetweenPolygons(startIndices, endIndices) {
      if (startIndices.length !== endIndices.length) {
        return;
      }

      var vertexCount = startIndices.length;

      for (var i = 0; i < vertexCount; i++) {
        var index = i;
        var nextIndex = i < vertexCount - 1 ? index + 1 : 0;
        this.generator.AddConvexPolygon([startIndices[index], startIndices[nextIndex], endIndices[nextIndex], endIndices[index]]);
      }
    }
  }, {
    key: "GenerateTriangleFan",
    value: function GenerateTriangleFan(startIndices, endIndex) {
      var vertexCount = startIndices.length;

      for (var i = 0; i < vertexCount; i++) {
        var index = i;
        var nextIndex = i < vertexCount - 1 ? index + 1 : 0;
        this.generator.AddTriangle(endIndex, startIndices[index], startIndices[nextIndex]);
      }
    }
  }]);

  return GeneratorHelper;
}();

function GetCylindricalCoord(radius, angle) {
  return new Coord2D(radius * Math.cos(angle), radius * Math.sin(angle));
}

export function GenerateCuboid(genParams, xSize, ySize, zSize) {
  if (!IsPositive(xSize) || !IsPositive(ySize) || !IsPositive(zSize)) {
    return null;
  }

  var generator = new Generator(genParams);
  generator.AddVertex(0.0, 0.0, 0.0);
  generator.AddVertex(xSize, 0.0, 0.0);
  generator.AddVertex(xSize, ySize, 0.0);
  generator.AddVertex(0.0, ySize, 0.0);
  generator.AddVertex(0.0, 0.0, zSize);
  generator.AddVertex(xSize, 0.0, zSize);
  generator.AddVertex(xSize, ySize, zSize);
  generator.AddVertex(0.0, ySize, zSize);
  generator.AddConvexPolygon([0, 3, 2, 1]);
  generator.AddConvexPolygon([0, 1, 5, 4]);
  generator.AddConvexPolygon([1, 2, 6, 5]);
  generator.AddConvexPolygon([2, 3, 7, 6]);
  generator.AddConvexPolygon([3, 0, 4, 7]);
  generator.AddConvexPolygon([4, 5, 6, 7]);
  return generator.GetMesh();
}
export function GenerateCone(genParams, topRadius, bottomRadius, height, segments, smooth) {
  if (IsNegative(topRadius) || IsNegative(bottomRadius)) {
    return null;
  }

  if (!IsPositive(height) || segments < 3) {
    return null;
  }

  var isZeroTop = IsZero(topRadius);
  var isZeroBottom = IsZero(bottomRadius);

  if (isZeroTop && isZeroBottom) {
    return null;
  }

  var generator = new Generator(genParams);
  var helper = new GeneratorHelper(generator);
  var step = 2.0 * Math.PI / segments;
  var curve = smooth ? 1 : null;
  var topPolygon = [];

  if (isZeroTop) {
    topPolygon.push(generator.AddVertex(0.0, 0.0, height));
  } else {
    for (var i = 0; i < segments; i++) {
      var topVertex = GetCylindricalCoord(topRadius, i * step);
      topPolygon.push(generator.AddVertex(topVertex.x, topVertex.y, height));
    }
  }

  var bottomPolygon = [];

  if (isZeroBottom) {
    bottomPolygon.push(generator.AddVertex(0.0, 0.0, 0.0));
  } else {
    for (var _i = 0; _i < segments; _i++) {
      var bottomVertex = GetCylindricalCoord(bottomRadius, _i * step);
      bottomPolygon.push(generator.AddVertex(bottomVertex.x, bottomVertex.y, 0.0));
    }
  }

  if (isZeroTop) {
    generator.SetCurve(curve);
    helper.GenerateTriangleFan(bottomPolygon, topPolygon[0]);
    generator.ResetCurve();
    generator.AddConvexPolygonInverted(bottomPolygon);
  } else if (isZeroBottom) {
    generator.SetCurve(curve);
    helper.GenerateTriangleFan(topPolygon.slice().reverse(), bottomPolygon[0]);
    generator.ResetCurve();
    generator.AddConvexPolygon(topPolygon);
  } else {
    generator.SetCurve(curve);
    helper.GenerateSurfaceBetweenPolygons(bottomPolygon, topPolygon);
    generator.ResetCurve();
    generator.AddConvexPolygonInverted(bottomPolygon);
    generator.AddConvexPolygon(topPolygon);
  }

  return generator.GetMesh();
}
export function GenerateCylinder(genParams, radius, height, segments, smooth) {
  return GenerateCone(genParams, radius, radius, height, segments, smooth);
}
export function GenerateSphere(genParams, radius, segments, smooth) {
  function GetSphericalCoord(radius, theta, phi) {
    return new Coord3D(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
  }

  if (!IsPositive(radius) || segments < 3) {
    return null;
  }

  var generator = new Generator(genParams);
  var helper = new GeneratorHelper(generator);
  generator.SetCurve(smooth ? 1 : null);
  var allLevelVertices = [];
  var levels = segments + 1;
  var levelStep = Math.PI / segments;
  var cylindricalStep = 2.0 * Math.PI / segments;

  for (var levelIndex = 1; levelIndex < levels - 1; levelIndex++) {
    var levelVertices = [];
    var theta = levelIndex * levelStep;

    for (var cylindricalIndex = 0; cylindricalIndex < segments; cylindricalIndex++) {
      var phi = cylindricalIndex * cylindricalStep;
      var vertex = GetSphericalCoord(radius, theta, -phi);
      levelVertices.push(generator.AddVertex(vertex.x, vertex.y, vertex.z));
    }

    if (levelIndex > 1) {
      helper.GenerateSurfaceBetweenPolygons(allLevelVertices[allLevelVertices.length - 1], levelVertices);
    }

    allLevelVertices.push(levelVertices);
  }

  var topVertex = generator.AddVertex(0.0, 0.0, radius);
  var bottomVertex = generator.AddVertex(0.0, 0.0, -radius);
  helper.GenerateTriangleFan(allLevelVertices[0].slice().reverse(), topVertex);
  helper.GenerateTriangleFan(allLevelVertices[allLevelVertices.length - 1], bottomVertex);
  generator.ResetCurve();
  return generator.GetMesh();
}
export function GeneratePlatonicSolid(genParams, type, radius) {
  function AddVertex(generator, radius, x, y, z) {
    var vertex = new Coord3D(x, y, z);
    vertex.MultiplyScalar(radius / vertex.Length());
    generator.AddVertex(vertex.x, vertex.y, vertex.z);
  }

  if (!IsPositive(radius)) {
    return null;
  }

  var generator = new Generator(genParams);

  if (type === 'tetrahedron') {
    var a = 1.0;
    AddVertex(generator, radius, +a, +a, +a);
    AddVertex(generator, radius, -a, -a, +a);
    AddVertex(generator, radius, -a, +a, -a);
    AddVertex(generator, radius, +a, -a, -a);
    generator.AddTriangle(0, 1, 3);
    generator.AddTriangle(0, 2, 1);
    generator.AddTriangle(0, 3, 2);
    generator.AddTriangle(1, 2, 3);
  } else if (type === 'hexahedron') {
    var _a = 1.0;
    AddVertex(generator, radius, +_a, +_a, +_a);
    AddVertex(generator, radius, +_a, +_a, -_a);
    AddVertex(generator, radius, +_a, -_a, +_a);
    AddVertex(generator, radius, +_a, -_a, -_a);
    AddVertex(generator, radius, -_a, +_a, +_a);
    AddVertex(generator, radius, -_a, +_a, -_a);
    AddVertex(generator, radius, -_a, -_a, +_a);
    AddVertex(generator, radius, -_a, -_a, -_a);
    generator.AddConvexPolygon([0, 1, 5, 4]);
    generator.AddConvexPolygon([0, 2, 3, 1]);
    generator.AddConvexPolygon([0, 4, 6, 2]);
    generator.AddConvexPolygon([1, 3, 7, 5]);
    generator.AddConvexPolygon([2, 6, 7, 3]);
    generator.AddConvexPolygon([4, 5, 7, 6]);
  } else if (type === 'octahedron') {
    var _a2 = 1.0;
    var b = 0.0;
    AddVertex(generator, radius, +_a2, +b, +b);
    AddVertex(generator, radius, -_a2, +b, +b);
    AddVertex(generator, radius, +b, +_a2, +b);
    AddVertex(generator, radius, +b, -_a2, +b);
    AddVertex(generator, radius, +b, +b, +_a2);
    AddVertex(generator, radius, +b, +b, -_a2);
    generator.AddTriangle(0, 2, 4);
    generator.AddTriangle(0, 3, 5);
    generator.AddTriangle(0, 4, 3);
    generator.AddTriangle(0, 5, 2);
    generator.AddTriangle(1, 2, 5);
    generator.AddTriangle(1, 3, 4);
    generator.AddTriangle(1, 4, 2);
    generator.AddTriangle(1, 5, 3);
  } else if (type === 'dodecahedron') {
    var _a3 = 1.0;
    var _b = 0.0;
    var c = (1.0 + Math.sqrt(5.0)) / 2.0;
    var d = 1.0 / c;
    AddVertex(generator, radius, +_a3, +_a3, +_a3);
    AddVertex(generator, radius, +_a3, +_a3, -_a3);
    AddVertex(generator, radius, +_a3, -_a3, +_a3);
    AddVertex(generator, radius, -_a3, +_a3, +_a3);
    AddVertex(generator, radius, +_a3, -_a3, -_a3);
    AddVertex(generator, radius, -_a3, +_a3, -_a3);
    AddVertex(generator, radius, -_a3, -_a3, +_a3);
    AddVertex(generator, radius, -_a3, -_a3, -_a3);
    AddVertex(generator, radius, +_b, +d, +c);
    AddVertex(generator, radius, +_b, +d, -c);
    AddVertex(generator, radius, +_b, -d, +c);
    AddVertex(generator, radius, +_b, -d, -c);
    AddVertex(generator, radius, +d, +c, +_b);
    AddVertex(generator, radius, +d, -c, +_b);
    AddVertex(generator, radius, -d, +c, +_b);
    AddVertex(generator, radius, -d, -c, +_b);
    AddVertex(generator, radius, +c, +_b, +d);
    AddVertex(generator, radius, -c, +_b, +d);
    AddVertex(generator, radius, +c, +_b, -d);
    AddVertex(generator, radius, -c, +_b, -d);
    generator.AddConvexPolygon([0, 8, 10, 2, 16]);
    generator.AddConvexPolygon([0, 16, 18, 1, 12]);
    generator.AddConvexPolygon([0, 12, 14, 3, 8]);
    generator.AddConvexPolygon([1, 9, 5, 14, 12]);
    generator.AddConvexPolygon([1, 18, 4, 11, 9]);
    generator.AddConvexPolygon([2, 10, 6, 15, 13]);
    generator.AddConvexPolygon([2, 13, 4, 18, 16]);
    generator.AddConvexPolygon([3, 14, 5, 19, 17]);
    generator.AddConvexPolygon([3, 17, 6, 10, 8]);
    generator.AddConvexPolygon([4, 13, 15, 7, 11]);
    generator.AddConvexPolygon([5, 9, 11, 7, 19]);
    generator.AddConvexPolygon([6, 17, 19, 7, 15]);
  } else if (type === 'icosahedron') {
    var _a4 = 1.0;
    var _b2 = 0.0;

    var _c = (1.0 + Math.sqrt(5.0)) / 2.0;

    AddVertex(generator, radius, +_b2, +_a4, +_c);
    AddVertex(generator, radius, +_b2, +_a4, -_c);
    AddVertex(generator, radius, +_b2, -_a4, +_c);
    AddVertex(generator, radius, +_b2, -_a4, -_c);
    AddVertex(generator, radius, +_a4, +_c, +_b2);
    AddVertex(generator, radius, +_a4, -_c, +_b2);
    AddVertex(generator, radius, -_a4, +_c, +_b2);
    AddVertex(generator, radius, -_a4, -_c, +_b2);
    AddVertex(generator, radius, +_c, +_b2, +_a4);
    AddVertex(generator, radius, +_c, +_b2, -_a4);
    AddVertex(generator, radius, -_c, +_b2, +_a4);
    AddVertex(generator, radius, -_c, +_b2, -_a4);
    generator.AddTriangle(0, 2, 8);
    generator.AddTriangle(0, 4, 6);
    generator.AddTriangle(0, 6, 10);
    generator.AddTriangle(0, 8, 4);
    generator.AddTriangle(0, 10, 2);
    generator.AddTriangle(1, 3, 11);
    generator.AddTriangle(1, 4, 9);
    generator.AddTriangle(1, 6, 4);
    generator.AddTriangle(1, 9, 3);
    generator.AddTriangle(1, 11, 6);
    generator.AddTriangle(2, 5, 8);
    generator.AddTriangle(2, 7, 5);
    generator.AddTriangle(2, 10, 7);
    generator.AddTriangle(3, 5, 7);
    generator.AddTriangle(3, 7, 11);
    generator.AddTriangle(3, 9, 5);
    generator.AddTriangle(4, 8, 9);
    generator.AddTriangle(5, 9, 8);
    generator.AddTriangle(6, 11, 10);
    generator.AddTriangle(7, 10, 11);
  }

  return generator.GetMesh();
}