function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { CopyObjectAttributes } from "../core/core.js";
import { AddCoord3D, Coord3D, CoordIsEqual3D } from "../geometry/coord3d.js";
import { RGBColor } from "./color.js";
import { PhongMaterial } from "./material.js";
import { CalculateTriangleNormal, GetMeshType, MeshType } from "./meshutils.js";

var ModelFinalizer = /*#__PURE__*/function () {
  function ModelFinalizer(params) {
    _classCallCheck(this, ModelFinalizer);

    this.params = {
      getDefaultMaterialColor: function getDefaultMaterialColor() {
        return new RGBColor(0, 0, 0);
      }
    };
    CopyObjectAttributes(params, this.params);
    this.defaultMaterialIndex = null;
  }

  _createClass(ModelFinalizer, [{
    key: "Finalize",
    value: function Finalize(model) {
      this.Reset();
      this.FinalizeMeshes(model);
      this.FinalizeMaterials(model);
      this.FinalizeNodes(model);
    }
  }, {
    key: "FinalizeMaterials",
    value: function FinalizeMaterials(model) {
      if (model.VertexColorCount() === 0) {
        return;
      }

      var materialHasVertexColors = new Map();

      for (var meshIndex = 0; meshIndex < model.MeshCount(); meshIndex++) {
        var mesh = model.GetMesh(meshIndex);

        for (var triangleIndex = 0; triangleIndex < mesh.TriangleCount(); triangleIndex++) {
          var triangle = mesh.GetTriangle(triangleIndex);
          var hasVertexColors = triangle.HasVertexColors();

          if (!materialHasVertexColors.has(triangle.mat)) {
            materialHasVertexColors.set(triangle.mat, hasVertexColors);
          } else if (!hasVertexColors) {
            materialHasVertexColors.set(triangle.mat, false);
          }
        }
      }

      var _iterator = _createForOfIteratorHelper(materialHasVertexColors),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              materialIndex = _step$value[0],
              _hasVertexColors = _step$value[1];

          var material = model.GetMaterial(materialIndex);
          material.vertexColors = _hasVertexColors;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "FinalizeMeshes",
    value: function FinalizeMeshes(model) {
      for (var meshIndex = 0; meshIndex < model.MeshCount(); meshIndex++) {
        var mesh = model.GetMesh(meshIndex);
        var type = GetMeshType(mesh);

        if (type === MeshType.Empty) {
          model.RemoveMesh(meshIndex);
          meshIndex = meshIndex - 1;
          continue;
        }

        this.FinalizeMesh(model, mesh);
      }
    }
  }, {
    key: "FinalizeMesh",
    value: function FinalizeMesh(model, mesh) {
      function CalculateCurveNormals(mesh) {
        function AddAverageNormal(mesh, triangle, vertexIndex, triangleNormals, vertexToTriangles) {
          function IsNormalInArray(array, normal) {
            for (var i = 0; i < array.length; i++) {
              var current = array[i];

              if (CoordIsEqual3D(current, normal)) {
                return true;
              }
            }

            return false;
          }

          var averageNormals = [];
          var neigTriangles = vertexToTriangles.get(vertexIndex);

          for (var i = 0; i < neigTriangles.length; i++) {
            var neigIndex = neigTriangles[i];
            var neigTriangle = mesh.GetTriangle(neigIndex);

            if (triangle.curve === neigTriangle.curve) {
              var triangleNormal = triangleNormals[neigIndex];

              if (!IsNormalInArray(averageNormals, triangleNormal)) {
                averageNormals.push(triangleNormal);
              }
            }
          }

          var averageNormal = new Coord3D(0.0, 0.0, 0.0);

          for (var _i2 = 0; _i2 < averageNormals.length; _i2++) {
            averageNormal = AddCoord3D(averageNormal, averageNormals[_i2]);
          }

          averageNormal.MultiplyScalar(1.0 / averageNormals.length);
          averageNormal.Normalize();
          return mesh.AddNormal(averageNormal);
        }

        var triangleNormals = [];
        var vertexToTriangles = new Map();

        for (var vertexIndex = 0; vertexIndex < mesh.VertexCount(); vertexIndex++) {
          vertexToTriangles.set(vertexIndex, []);
        }

        for (var triangleIndex = 0; triangleIndex < mesh.TriangleCount(); triangleIndex++) {
          var triangle = mesh.GetTriangle(triangleIndex);
          var v0 = mesh.GetVertex(triangle.v0);
          var v1 = mesh.GetVertex(triangle.v1);
          var v2 = mesh.GetVertex(triangle.v2);
          var normal = CalculateTriangleNormal(v0, v1, v2);
          triangleNormals.push(normal);
          vertexToTriangles.get(triangle.v0).push(triangleIndex);
          vertexToTriangles.get(triangle.v1).push(triangleIndex);
          vertexToTriangles.get(triangle.v2).push(triangleIndex);
        }

        for (var _triangleIndex = 0; _triangleIndex < mesh.TriangleCount(); _triangleIndex++) {
          var _triangle = mesh.GetTriangle(_triangleIndex);

          if (!_triangle.HasNormals()) {
            var n0 = AddAverageNormal(mesh, _triangle, _triangle.v0, triangleNormals, vertexToTriangles);
            var n1 = AddAverageNormal(mesh, _triangle, _triangle.v1, triangleNormals, vertexToTriangles);
            var n2 = AddAverageNormal(mesh, _triangle, _triangle.v2, triangleNormals, vertexToTriangles);

            _triangle.SetNormals(n0, n1, n2);
          }
        }
      }

      var meshStatus = {
        calculateCurveNormals: false
      };

      for (var i = 0; i < mesh.TriangleCount(); i++) {
        var triangle = mesh.GetTriangle(i);
        this.FinalizeTriangle(mesh, triangle, meshStatus);

        if (triangle.mat === null) {
          triangle.mat = this.GetDefaultMaterialIndex(model);
        }
      }

      if (meshStatus.calculateCurveNormals) {
        CalculateCurveNormals(mesh);
      }
    }
  }, {
    key: "FinalizeTriangle",
    value: function FinalizeTriangle(mesh, triangle, meshStatus) {
      if (!triangle.HasNormals()) {
        if (triangle.curve === null || triangle.curve === 0) {
          var v0 = mesh.GetVertex(triangle.v0);
          var v1 = mesh.GetVertex(triangle.v1);
          var v2 = mesh.GetVertex(triangle.v2);
          var normal = CalculateTriangleNormal(v0, v1, v2);
          var normalIndex = mesh.AddNormal(normal);
          triangle.SetNormals(normalIndex, normalIndex, normalIndex);
        } else {
          meshStatus.calculateCurveNormals = true;
        }
      }

      if (triangle.curve === null) {
        triangle.curve = 0;
      }
    }
  }, {
    key: "FinalizeNodes",
    value: function FinalizeNodes(model) {
      var rootNode = model.GetRootNode();
      var emptyNodes = [];
      rootNode.EnumerateChildren(function (node) {
        if (node.IsEmpty()) {
          emptyNodes.push(node);
        }
      });

      for (var nodeIndex = 0; nodeIndex < emptyNodes.length; nodeIndex++) {
        var node = emptyNodes[nodeIndex];
        var parentNode = node.GetParent();

        if (parentNode === null) {
          continue;
        }

        parentNode.RemoveChildNode(node);

        if (parentNode.IsEmpty()) {
          emptyNodes.push(parentNode);
        }
      }
    }
  }, {
    key: "GetDefaultMaterialIndex",
    value: function GetDefaultMaterialIndex(model) {
      if (this.defaultMaterialIndex === null) {
        var defaultMaterialColor = this.params.getDefaultMaterialColor();
        var defaultMaterial = new PhongMaterial();
        defaultMaterial.color = defaultMaterialColor;
        defaultMaterial.isDefault = true;
        this.defaultMaterialIndex = model.AddMaterial(defaultMaterial);
      }

      return this.defaultMaterialIndex;
    }
  }, {
    key: "Reset",
    value: function Reset() {
      this.defaultMaterialIndex = null;
    }
  }]);

  return ModelFinalizer;
}();

export function FinalizeModel(model, params) {
  var finalizer = new ModelFinalizer(params);
  finalizer.Finalize(model);
}
export function CheckModel(model) {
  function IsCorrectValue(val) {
    if (val === undefined || val === null) {
      return false;
    }

    return true;
  }

  function IsCorrectNumber(val) {
    if (!IsCorrectValue(val)) {
      return false;
    }

    if (isNaN(val)) {
      return false;
    }

    return true;
  }

  function IsCorrectIndex(val, count) {
    if (!IsCorrectNumber(val)) {
      return false;
    }

    if (val < 0 || val >= count) {
      return false;
    }

    return true;
  }

  function CheckMesh(model, mesh) {
    function CheckTriangle(model, mesh, triangle) {
      if (!IsCorrectIndex(triangle.v0, mesh.VertexCount())) {
        return false;
      }

      if (!IsCorrectIndex(triangle.v1, mesh.VertexCount())) {
        return false;
      }

      if (!IsCorrectIndex(triangle.v2, mesh.VertexCount())) {
        return false;
      }

      if (triangle.HasVertexColors()) {
        if (!IsCorrectIndex(triangle.c0, mesh.VertexColorCount())) {
          return false;
        }

        if (!IsCorrectIndex(triangle.c1, mesh.VertexColorCount())) {
          return false;
        }

        if (!IsCorrectIndex(triangle.c2, mesh.VertexColorCount())) {
          return false;
        }
      }

      if (!IsCorrectIndex(triangle.n0, mesh.NormalCount())) {
        return false;
      }

      if (!IsCorrectIndex(triangle.n1, mesh.NormalCount())) {
        return false;
      }

      if (!IsCorrectIndex(triangle.n2, mesh.NormalCount())) {
        return false;
      }

      if (triangle.HasTextureUVs()) {
        if (!IsCorrectIndex(triangle.u0, mesh.TextureUVCount())) {
          return false;
        }

        if (!IsCorrectIndex(triangle.u1, mesh.TextureUVCount())) {
          return false;
        }

        if (!IsCorrectIndex(triangle.u2, mesh.TextureUVCount())) {
          return false;
        }
      }

      if (!IsCorrectIndex(triangle.mat, model.MaterialCount())) {
        return false;
      }

      if (!IsCorrectNumber(triangle.curve)) {
        return false;
      }

      return true;
    }

    for (var i = 0; i < mesh.VertexCount(); i++) {
      var vertex = mesh.GetVertex(i);

      if (!IsCorrectNumber(vertex.x)) {
        return false;
      }

      if (!IsCorrectNumber(vertex.y)) {
        return false;
      }

      if (!IsCorrectNumber(vertex.z)) {
        return false;
      }
    }

    for (var _i3 = 0; _i3 < mesh.VertexColorCount(); _i3++) {
      var color = mesh.GetVertexColor(_i3);

      if (!IsCorrectNumber(color.r)) {
        return false;
      }

      if (!IsCorrectNumber(color.g)) {
        return false;
      }

      if (!IsCorrectNumber(color.b)) {
        return false;
      }
    }

    for (var _i4 = 0; _i4 < mesh.NormalCount(); _i4++) {
      var normal = mesh.GetNormal(_i4);

      if (!IsCorrectNumber(normal.x)) {
        return false;
      }

      if (!IsCorrectNumber(normal.y)) {
        return false;
      }

      if (!IsCorrectNumber(normal.z)) {
        return false;
      }
    }

    for (var _i5 = 0; _i5 < mesh.TextureUVCount(); _i5++) {
      var uv = mesh.GetTextureUV(_i5);

      if (!IsCorrectNumber(uv.x)) {
        return false;
      }

      if (!IsCorrectNumber(uv.y)) {
        return false;
      }
    }

    for (var _i6 = 0; _i6 < mesh.TriangleCount(); _i6++) {
      var triangle = mesh.GetTriangle(_i6);

      if (!CheckTriangle(model, mesh, triangle)) {
        return false;
      }
    }

    return true;
  }

  for (var i = 0; i < model.MeshCount(); i++) {
    var mesh = model.GetMesh(i);

    if (!CheckMesh(model, mesh)) {
      return false;
    }
  }

  return true;
}