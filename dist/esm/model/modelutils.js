import { BoundingBoxCalculator3D } from "../geometry/box3d.js";
import { Octree } from "../geometry/octree.js";
import { GetMeshType, MeshType } from "./meshutils.js";
import { Model } from "./model.js";
import { Topology } from "./topology.js";
export function IsModelEmpty(model) {
  var isEmpty = true;
  model.EnumerateMeshInstances(function (meshInstance) {
    if (GetMeshType(meshInstance) !== MeshType.Empty) {
      isEmpty = false;
    }
  });
  return isEmpty;
}
export function GetBoundingBox(object3D) {
  var calculator = new BoundingBoxCalculator3D();
  object3D.EnumerateVertices(function (vertex) {
    calculator.AddPoint(vertex);
  });
  return calculator.GetBox();
}
export function GetTopology(object3D) {
  function GetVertexIndex(vertex, octree, topology) {
    var index = octree.FindPoint(vertex);

    if (index === null) {
      index = topology.AddVertex();
      octree.AddPoint(vertex, index);
    }

    return index;
  }

  var boundingBox = GetBoundingBox(object3D);
  var octree = new Octree(boundingBox);
  var topology = new Topology();
  object3D.EnumerateTriangleVertices(function (v0, v1, v2) {
    var v0Index = GetVertexIndex(v0, octree, topology);
    var v1Index = GetVertexIndex(v1, octree, topology);
    var v2Index = GetVertexIndex(v2, octree, topology);
    topology.AddTriangle(v0Index, v1Index, v2Index);
  });
  return topology;
}
export function IsTwoManifold(object3D) {
  function GetEdgeOrientationInTriangle(topology, triangleIndex, edgeIndex) {
    var triangle = topology.triangles[triangleIndex];
    var triEdge1 = topology.triangleEdges[triangle.triEdge1];
    var triEdge2 = topology.triangleEdges[triangle.triEdge2];
    var triEdge3 = topology.triangleEdges[triangle.triEdge3];

    if (triEdge1.edge === edgeIndex) {
      return triEdge1.reversed;
    }

    if (triEdge2.edge === edgeIndex) {
      return triEdge2.reversed;
    }

    if (triEdge3.edge === edgeIndex) {
      return triEdge3.reversed;
    }

    return null;
  }

  if (object3D instanceof Model) {
    var isTwoManifold = true;
    object3D.EnumerateMeshInstances(function (meshInstance) {
      if (isTwoManifold) {
        isTwoManifold = IsTwoManifold(meshInstance);
      }
    });
    return isTwoManifold;
  } else {
    var topology = GetTopology(object3D);

    for (var edgeIndex = 0; edgeIndex < topology.edges.length; edgeIndex++) {
      var edge = topology.edges[edgeIndex];

      if (edge.triangles.length !== 2) {
        return false;
      }

      var edgeOrientation1 = GetEdgeOrientationInTriangle(topology, edge.triangles[0], edgeIndex);
      var edgeOrientation2 = GetEdgeOrientationInTriangle(topology, edge.triangles[1], edgeIndex);

      if (edgeOrientation1 === null || edgeOrientation2 === null || edgeOrientation1 === edgeOrientation2) {
        return false;
      }
    }

    return true;
  }
}
export function HasDefaultMaterial(model) {
  for (var i = 0; i < model.MaterialCount(); i++) {
    var material = model.GetMaterial(i);

    if (material.isDefault && !material.vertexColors) {
      return true;
    }
  }

  return false;
}
export function ReplaceDefaultMaterialColor(model, color) {
  for (var i = 0; i < model.MaterialCount(); i++) {
    var material = model.GetMaterial(i);

    if (material.isDefault) {
      material.color = color;
    }
  }
}