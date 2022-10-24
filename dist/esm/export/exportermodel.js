function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { CopyObjectAttributes } from "../core/core.js";
import { Transformation } from "../geometry/transformation.js";
import { CalculateTriangleNormal, TransformMesh } from "../model/meshutils.js";
export var ExporterSettings = /*#__PURE__*/_createClass(function ExporterSettings(settings) {
  _classCallCheck(this, ExporterSettings);

  this.transformation = new Transformation();

  this.isMeshVisible = function (meshInstanceId) {
    return true;
  };

  CopyObjectAttributes(settings, this);
});
export var ExporterModel = /*#__PURE__*/function () {
  function ExporterModel(model, settings) {
    _classCallCheck(this, ExporterModel);

    this.model = model;
    this.settings = settings || new ExporterSettings();
  }

  _createClass(ExporterModel, [{
    key: "GetModel",
    value: function GetModel() {
      return this.model;
    }
  }, {
    key: "MaterialCount",
    value: function MaterialCount() {
      return this.model.MaterialCount();
    }
  }, {
    key: "GetMaterial",
    value: function GetMaterial(index) {
      return this.model.GetMaterial(index);
    }
  }, {
    key: "VertexCount",
    value: function VertexCount() {
      var vertexCount = 0;
      this.EnumerateMeshInstances(function (meshInstance) {
        vertexCount += meshInstance.VertexCount();
      });
      return vertexCount;
    }
  }, {
    key: "TriangleCount",
    value: function TriangleCount() {
      var triangleCount = 0;
      this.EnumerateMeshInstances(function (meshInstance) {
        triangleCount += meshInstance.TriangleCount();
      });
      return triangleCount;
    }
  }, {
    key: "MeshInstanceCount",
    value: function MeshInstanceCount() {
      var meshInstanceCount = 0;
      this.EnumerateMeshInstances(function (meshInstance) {
        meshInstanceCount += 1;
      });
      return meshInstanceCount;
    }
  }, {
    key: "EnumerateMeshInstances",
    value: function EnumerateMeshInstances(onMeshInstance) {
      var _this = this;

      this.model.EnumerateMeshInstances(function (meshInstance) {
        if (_this.settings.isMeshVisible(meshInstance.GetId())) {
          onMeshInstance(meshInstance);
        }
      });
    }
  }, {
    key: "EnumerateTransformedMeshes",
    value: function EnumerateTransformedMeshes(onMesh) {
      var _this2 = this;

      this.EnumerateMeshInstances(function (meshInstance) {
        var transformation = meshInstance.GetTransformation();

        if (!_this2.settings.transformation.IsIdentity()) {
          transformation.Append(_this2.settings.transformation);
        }

        var mesh = meshInstance.GetMesh();
        var transformed = mesh.Clone();

        if (!transformation.IsIdentity()) {
          TransformMesh(transformed, transformation);
        }

        onMesh(transformed);
      });
    }
  }, {
    key: "EnumerateVerticesAndTriangles",
    value: function EnumerateVerticesAndTriangles(callbacks) {
      var transformedMeshes = [];
      this.EnumerateTransformedMeshes(function (mesh) {
        transformedMeshes.push(mesh);
      });

      for (var _i = 0, _transformedMeshes = transformedMeshes; _i < _transformedMeshes.length; _i++) {
        var mesh = _transformedMeshes[_i];
        mesh.EnumerateVertices(function (vertex) {
          callbacks.onVertex(vertex.x, vertex.y, vertex.z);
        });
      }

      var vertexOffset = 0;

      for (var _i2 = 0, _transformedMeshes2 = transformedMeshes; _i2 < _transformedMeshes2.length; _i2++) {
        var _mesh = _transformedMeshes2[_i2];

        _mesh.EnumerateTriangleVertexIndices(function (v0, v1, v2) {
          callbacks.onTriangle(v0 + vertexOffset, v1 + vertexOffset, v2 + vertexOffset);
        });

        vertexOffset += _mesh.VertexCount();
      }
    }
  }, {
    key: "EnumerateTrianglesWithNormals",
    value: function EnumerateTrianglesWithNormals(onTriangle) {
      this.EnumerateTransformedMeshes(function (mesh) {
        mesh.EnumerateTriangleVertices(function (v0, v1, v2) {
          var normal = CalculateTriangleNormal(v0, v1, v2);
          onTriangle(v0, v1, v2, normal);
        });
      });
    }
  }]);

  return ExporterModel;
}();