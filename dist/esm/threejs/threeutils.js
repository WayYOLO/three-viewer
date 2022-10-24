import { Coord2D } from "../geometry/coord2d.js";
import { Coord3D } from "../geometry/coord3d.js";
import { RGBColorFromFloatComponents } from "../model/color.js";
import { MaterialType } from "../model/material.js";
import { Mesh } from "../model/mesh.js";
import { Triangle } from "../model/triangle.js";
import * as THREE from 'three'; // Some mobile devices say that they support mediump, but in reality they don't. At the end
// all materials rendered as black. This hack renders a single plane with red material and
// it checks if it's really red. If it's not, then probably there is a driver issue.
// https://github.com/kovacsv/Online3DViewer/issues/69

export function HasHighpDriverIssue() {
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  var parameters = {
    canvas: canvas,
    antialias: true
  };
  var renderer = new THREE.WebGLRenderer(parameters);
  renderer.setClearColor('#ffffff', 1);
  renderer.setSize(10, 10);
  var scene = new THREE.Scene();
  var ambientLight = new THREE.AmbientLight(0x888888);
  scene.add(ambientLight);
  var light = new THREE.DirectionalLight(0x888888);
  light.position.set(0.0, 0.0, 1.0);
  scene.add(light);
  var camera = new THREE.PerspectiveCamera(45.0, 1.0, 0.1, 1000.0);
  camera.position.set(0.0, 0.0, 1.0);
  camera.up.set(0.0, 1.0, 0.0);
  camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
  scene.add(camera);
  var plane = new THREE.PlaneGeometry(1.0, 1.0);
  var mesh = new THREE.Mesh(plane, new THREE.MeshPhongMaterial({
    color: 0xcc0000
  }));
  scene.add(mesh);
  renderer.render(scene, camera);
  var context = renderer.getContext();
  var pixels = new Uint8Array(4);
  context.readPixels(5, 5, 1, 1, context.RGBA, context.UNSIGNED_BYTE, pixels);
  document.body.removeChild(canvas);
  var blackThreshold = 50;

  if (pixels[0] < blackThreshold && pixels[1] < blackThreshold && pixels[2] < blackThreshold) {
    return true;
  }

  return false;
}
export var ShadingType = {
  Phong: 1,
  Physical: 2
};
export function GetShadingType(model) {
  var phongCount = 0;
  var physicalCount = 0;

  for (var i = 0; i < model.MaterialCount(); i++) {
    var material = model.GetMaterial(i);

    if (material.type === MaterialType.Phong) {
      phongCount += 1;
    } else if (material.type === MaterialType.Physical) {
      physicalCount += 1;
    }
  }

  if (phongCount >= physicalCount) {
    return ShadingType.Phong;
  } else {
    return ShadingType.Physical;
  }
}
export function ConvertThreeColorToColor(threeColor) {
  return RGBColorFromFloatComponents(threeColor.r, threeColor.g, threeColor.b);
}
export function ConvertColorToThreeColor(color) {
  return new THREE.Color(color.r / 255.0, color.g / 255.0, color.b / 255.0);
}
export function ConvertThreeGeometryToMesh(threeGeometry, materialIndex) {
  var mesh = new Mesh();
  var vertices = threeGeometry.attributes.position.array;
  var vertexItemSize = threeGeometry.attributes.position.itemSize || 3;

  for (var i = 0; i < vertices.length; i += vertexItemSize) {
    var x = vertices[i];
    var y = vertices[i + 1];
    var z = vertices[i + 2];
    mesh.AddVertex(new Coord3D(x, y, z));
  }

  var hasVertexColors = threeGeometry.attributes.color !== undefined;

  if (hasVertexColors) {
    var colors = threeGeometry.attributes.color.array;
    var colorItemSize = threeGeometry.attributes.color.itemSize || 3;

    for (var _i = 0; _i < colors.length; _i += colorItemSize) {
      var threeColor = new THREE.Color(colors[_i], colors[_i + 1], colors[_i + 2]);
      mesh.AddVertexColor(ConvertThreeColorToColor(threeColor));
    }
  }

  var hasNormals = threeGeometry.attributes.normal !== undefined;

  if (hasNormals) {
    var normals = threeGeometry.attributes.normal.array;
    var normalItemSize = threeGeometry.attributes.normal.itemSize || 3;

    for (var _i2 = 0; _i2 < normals.length; _i2 += normalItemSize) {
      var _x = normals[_i2];
      var _y = normals[_i2 + 1];
      var _z = normals[_i2 + 2];
      mesh.AddNormal(new Coord3D(_x, _y, _z));
    }
  }

  var hasUVs = threeGeometry.attributes.uv !== undefined;

  if (hasUVs) {
    var uvs = threeGeometry.attributes.uv.array;
    var uvItemSize = threeGeometry.attributes.uv.itemSize || 2;

    for (var _i3 = 0; _i3 < uvs.length; _i3 += uvItemSize) {
      var _x2 = uvs[_i3];
      var _y2 = uvs[_i3 + 1];
      mesh.AddTextureUV(new Coord2D(_x2, _y2));
    }
  }

  var indices = null;

  if (threeGeometry.index !== null) {
    indices = threeGeometry.index.array;
  } else {
    indices = [];

    for (var _i4 = 0; _i4 < vertices.length / 3; _i4++) {
      indices.push(_i4);
    }
  }

  for (var _i5 = 0; _i5 < indices.length; _i5 += 3) {
    var v0 = indices[_i5];
    var v1 = indices[_i5 + 1];
    var v2 = indices[_i5 + 2];
    var triangle = new Triangle(v0, v1, v2);

    if (hasVertexColors) {
      triangle.SetVertexColors(v0, v1, v2);
    }

    if (hasNormals) {
      triangle.SetNormals(v0, v1, v2);
    }

    if (hasUVs) {
      triangle.SetTextureUVs(v0, v1, v2);
    }

    if (materialIndex !== null) {
      triangle.SetMaterial(materialIndex);
    }

    mesh.AddTriangle(triangle);
  }

  return mesh;
}