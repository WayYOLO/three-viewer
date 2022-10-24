function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Coord2D, CoordIsEqual2D } from "../geometry/coord2d.js";
import { CoordIsEqual3D } from "../geometry/coord3d.js";
import { RGBColor, RGBColorIsEqual } from "./color.js";
export var MeshPrimitiveBuffer = /*#__PURE__*/function () {
  function MeshPrimitiveBuffer() {
    _classCallCheck(this, MeshPrimitiveBuffer);

    this.indices = [];
    this.vertices = [];
    this.colors = [];
    this.normals = [];
    this.uvs = [];
    this.material = null;
  }

  _createClass(MeshPrimitiveBuffer, [{
    key: "GetBounds",
    value: function GetBounds() {
      var min = [Infinity, Infinity, Infinity];
      var max = [-Infinity, -Infinity, -Infinity];

      for (var i = 0; i < this.vertices.length / 3; i++) {
        for (var j = 0; j < 3; j++) {
          min[j] = Math.min(min[j], this.vertices[i * 3 + j]);
          max[j] = Math.max(max[j], this.vertices[i * 3 + j]);
        }
      }

      return {
        min: min,
        max: max
      };
    }
  }, {
    key: "GetByteLength",
    value: function GetByteLength(indexTypeSize, numberTypeSize) {
      var indexCount = this.indices.length;
      var numberCount = this.vertices.length + this.colors.length + this.normals.length + this.uvs.length;
      return indexCount * indexTypeSize + numberCount * numberTypeSize;
    }
  }]);

  return MeshPrimitiveBuffer;
}();
export var MeshBuffer = /*#__PURE__*/function () {
  function MeshBuffer() {
    _classCallCheck(this, MeshBuffer);

    this.primitives = [];
  }

  _createClass(MeshBuffer, [{
    key: "PrimitiveCount",
    value: function PrimitiveCount() {
      return this.primitives.length;
    }
  }, {
    key: "GetPrimitive",
    value: function GetPrimitive(index) {
      return this.primitives[index];
    }
  }, {
    key: "GetByteLength",
    value: function GetByteLength(indexTypeSize, numberTypeSize) {
      var byteLength = 0;

      for (var i = 0; i < this.primitives.length; i++) {
        var primitive = this.primitives[i];
        byteLength += primitive.GetByteLength(indexTypeSize, numberTypeSize);
      }

      return byteLength;
    }
  }]);

  return MeshBuffer;
}();
export function ConvertMeshToMeshBuffer(mesh) {
  function AddVertexToPrimitiveBuffer(mesh, indices, primitiveBuffer, meshVertexToPrimitiveVertices) {
    function GetColorOrDefault(mesh, colorIndex, forceColors) {
      if (colorIndex !== null) {
        return mesh.GetVertexColor(colorIndex);
      } else if (forceColors) {
        return new RGBColor(0, 0, 0);
      } else {
        return null;
      }
    }

    function GetUVOrDefault(mesh, uvIndex, forceUVs) {
      if (uvIndex !== null) {
        return mesh.GetTextureUV(uvIndex);
      } else if (forceUVs) {
        return new Coord2D(0.0, 0.0);
      } else {
        return null;
      }
    }

    function AddVertex(mesh, indices, primitiveBuffer) {
      var forceColors = mesh.VertexColorCount() > 0;
      var forceUVs = mesh.TextureUVCount() > 0;
      var vertex = mesh.GetVertex(indices.vertex);
      var normal = mesh.GetNormal(indices.normal);
      var primitiveVertexIndex = primitiveBuffer.vertices.length / 3;
      primitiveBuffer.indices.push(primitiveVertexIndex);
      primitiveBuffer.vertices.push(vertex.x, vertex.y, vertex.z);
      var color = GetColorOrDefault(mesh, indices.color, forceColors);

      if (color !== null) {
        primitiveBuffer.colors.push(color.r / 255.0, color.g / 255.0, color.b / 255.0);
      }

      primitiveBuffer.normals.push(normal.x, normal.y, normal.z);
      var uv = GetUVOrDefault(mesh, indices.uv, forceUVs);

      if (uv !== null) {
        primitiveBuffer.uvs.push(uv.x, uv.y);
      }

      return {
        index: primitiveVertexIndex,
        color: color,
        normal: normal,
        uv: uv
      };
    }

    function FindMatchingPrimitiveVertex(mesh, primitiveVertices, indices) {
      function IsEqualColor(mesh, colorIndex, existingColor) {
        if (existingColor === null && colorIndex === null) {
          return true;
        }

        var color = GetColorOrDefault(mesh, colorIndex, true);
        return RGBColorIsEqual(existingColor, color);
      }

      function IsEqualNormal(mesh, normalIndex, existingNormal) {
        var normal = mesh.GetNormal(normalIndex);
        return CoordIsEqual3D(existingNormal, normal);
      }

      function IsEqualUV(mesh, uvIndex, existingUv) {
        if (existingUv === null && uvIndex === null) {
          return true;
        }

        var uv = GetUVOrDefault(mesh, uvIndex, true);
        return CoordIsEqual2D(existingUv, uv);
      }

      for (var i = 0; i < primitiveVertices.length; i++) {
        var primitiveVertex = primitiveVertices[i];
        var equalColor = IsEqualColor(mesh, indices.color, primitiveVertex.color);
        var equalNormal = IsEqualNormal(mesh, indices.normal, primitiveVertex.normal);
        var equalUv = IsEqualUV(mesh, indices.uv, primitiveVertex.uv);

        if (equalColor && equalNormal && equalUv) {
          return primitiveVertex;
        }
      }

      return null;
    }

    if (meshVertexToPrimitiveVertices.has(indices.vertex)) {
      var primitiveVertices = meshVertexToPrimitiveVertices.get(indices.vertex);
      var existingPrimitiveVertex = FindMatchingPrimitiveVertex(mesh, primitiveVertices, indices);

      if (existingPrimitiveVertex !== null) {
        primitiveBuffer.indices.push(existingPrimitiveVertex.index);
      } else {
        var primitiveVertex = AddVertex(mesh, indices, primitiveBuffer);
        primitiveVertices.push(primitiveVertex);
      }
    } else {
      var _primitiveVertex = AddVertex(mesh, indices, primitiveBuffer);

      meshVertexToPrimitiveVertices.set(indices.vertex, [_primitiveVertex]);
    }
  }

  var meshBuffer = new MeshBuffer();
  var triangleCount = mesh.TriangleCount();

  if (triangleCount === 0) {
    return null;
  }

  var triangleIndices = [];

  for (var i = 0; i < triangleCount; i++) {
    triangleIndices.push(i);
  }

  triangleIndices.sort(function (a, b) {
    var aTriangle = mesh.GetTriangle(a);
    var bTriangle = mesh.GetTriangle(b);
    return aTriangle.mat - bTriangle.mat;
  });
  var primitiveBuffer = null;
  var meshVertexToPrimitiveVertices = null;

  for (var _i = 0; _i < triangleIndices.length; _i++) {
    var triangleIndex = triangleIndices[_i];
    var triangle = mesh.GetTriangle(triangleIndex);

    if (primitiveBuffer === null || primitiveBuffer.material !== triangle.mat) {
      primitiveBuffer = new MeshPrimitiveBuffer();
      primitiveBuffer.material = triangle.mat;
      meshVertexToPrimitiveVertices = new Map();
      meshBuffer.primitives.push(primitiveBuffer);
    }

    var v0Indices = {
      vertex: triangle.v0,
      color: triangle.c0,
      normal: triangle.n0,
      uv: triangle.u0
    };
    var v1Indices = {
      vertex: triangle.v1,
      color: triangle.c1,
      normal: triangle.n1,
      uv: triangle.u1
    };
    var v2Indices = {
      vertex: triangle.v2,
      color: triangle.c2,
      normal: triangle.n2,
      uv: triangle.u2
    };
    AddVertexToPrimitiveBuffer(mesh, v0Indices, primitiveBuffer, meshVertexToPrimitiveVertices);
    AddVertexToPrimitiveBuffer(mesh, v1Indices, primitiveBuffer, meshVertexToPrimitiveVertices);
    AddVertexToPrimitiveBuffer(mesh, v2Indices, primitiveBuffer, meshVertexToPrimitiveVertices);
  }

  return meshBuffer;
}