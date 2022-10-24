import { CoordDistance3D, CrossVector3D, DotVector3D } from "../geometry/coord3d.js";
import { Model } from "./model.js";
export function GetTriangleArea(v0, v1, v2) {
  var a = CoordDistance3D(v0, v1);
  var b = CoordDistance3D(v1, v2);
  var c = CoordDistance3D(v0, v2);
  var s = (a + b + c) / 2.0;
  var areaSquare = s * (s - a) * (s - b) * (s - c);

  if (areaSquare < 0.0) {
    return 0.0;
  }

  return Math.sqrt(areaSquare);
}
export function GetTetrahedronSignedVolume(v0, v1, v2) {
  return DotVector3D(v0, CrossVector3D(v1, v2)) / 6.0;
}
export function CalculateVolume(object3D) {
  if (object3D instanceof Model) {
    var volume = 0.0;
    object3D.EnumerateMeshInstances(function (meshInstance) {
      volume += CalculateVolume(meshInstance);
    });
    return volume;
  } else {
    var _volume = 0.0;
    object3D.EnumerateTriangleVertices(function (v0, v1, v2) {
      _volume += GetTetrahedronSignedVolume(v0, v1, v2);
    });
    return _volume;
  }
}
export function CalculateSurfaceArea(object3D) {
  var surface = 0.0;
  object3D.EnumerateTriangleVertices(function (v0, v1, v2) {
    surface += GetTriangleArea(v0, v1, v2);
  });
  return surface;
}