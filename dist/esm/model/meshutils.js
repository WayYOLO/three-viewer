import { CrossVector3D, SubCoord3D } from "../geometry/coord3d.js";
import { Transformation } from "../geometry/transformation.js";
export var MeshType = {
  Empty: 0,
  TriangleMesh: 1
};
export function GetMeshType(mesh) {
  if (mesh.TriangleCount() > 0) {
    return MeshType.TriangleMesh;
  }

  return MeshType.Empty;
}
export function CalculateTriangleNormal(v0, v1, v2) {
  var v = SubCoord3D(v1, v0);
  var w = SubCoord3D(v2, v0);
  var normal = CrossVector3D(v, w);
  normal.Normalize();
  return normal;
}
export function TransformMesh(mesh, transformation) {
  if (transformation.IsIdentity()) {
    return;
  }

  for (var i = 0; i < mesh.VertexCount(); i++) {
    var vertex = mesh.GetVertex(i);
    var transformed = transformation.TransformCoord3D(vertex);
    vertex.x = transformed.x;
    vertex.y = transformed.y;
    vertex.z = transformed.z;
  }

  if (mesh.NormalCount() > 0) {
    var normalMatrix = transformation.GetMatrix().InvertTranspose();

    if (normalMatrix !== null) {
      var normalTransformation = new Transformation(normalMatrix);

      for (var _i = 0; _i < mesh.NormalCount(); _i++) {
        var normal = mesh.GetNormal(_i);

        var _transformed = normalTransformation.TransformCoord3D(normal);

        normal.x = _transformed.x;
        normal.y = _transformed.y;
        normal.z = _transformed.z;
      }
    }
  }
}
export function FlipMeshTrianglesOrientation(mesh) {
  for (var i = 0; i < mesh.TriangleCount(); i++) {
    var triangle = mesh.GetTriangle(i);
    var tmp = triangle.v1;
    triangle.v1 = triangle.v2;
    triangle.v2 = tmp;
  }
}