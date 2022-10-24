import { CoordDistance3D, SubCoord3D } from "./coord3d.js";
export function BezierTweenFunction(distance, index, count) {
  var t = index / count;
  return distance * (t * t * (3.0 - 2.0 * t));
}
export function LinearTweenFunction(distance, index, count) {
  return index * distance / count;
}
export function ParabolicTweenFunction(distance, index, count) {
  var t = index / count;
  var t2 = t * t;
  return distance * (t2 / (2.0 * (t2 - t) + 1.0));
}
export function TweenCoord3D(a, b, count, tweenFunc) {
  var dir = SubCoord3D(b, a).Normalize();
  var distance = CoordDistance3D(a, b);
  var result = [];

  for (var i = 0; i < count; i++) {
    var step = tweenFunc(distance, i, count - 1);
    result.push(a.Clone().Offset(dir, step));
  }

  return result;
}