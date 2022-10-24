function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { RunTasksBatch } from "../core/taskrunner.js";
import { IsEqual } from "../geometry/geometry.js";
import { CreateObjectUrl, CreateObjectUrlWithMimeType } from "../io/bufferutils.js";
import { MaterialType } from "../model/material.js";
import { MeshInstanceId } from "../model/meshinstance.js";
import { GetMeshType, MeshType } from "../model/meshutils.js";
import { ConvertColorToThreeColor, GetShadingType, ShadingType } from "./threeutils.js";
import * as THREE from 'three';
export var ModelToThreeConversionParams = /*#__PURE__*/_createClass(function ModelToThreeConversionParams() {
  _classCallCheck(this, ModelToThreeConversionParams);

  this.forceMediumpForMaterials = false;
});
export var ModelToThreeConversionOutput = /*#__PURE__*/_createClass(function ModelToThreeConversionOutput() {
  _classCallCheck(this, ModelToThreeConversionOutput);

  this.defaultMaterial = null;
  this.objectUrls = [];
});
export var ThreeConversionStateHandler = /*#__PURE__*/function () {
  function ThreeConversionStateHandler(callbacks) {
    _classCallCheck(this, ThreeConversionStateHandler);

    this.callbacks = callbacks;
    this.texturesNeeded = 0;
    this.texturesLoaded = 0;
    this.threeObject = null;
  }

  _createClass(ThreeConversionStateHandler, [{
    key: "OnTextureNeeded",
    value: function OnTextureNeeded() {
      this.texturesNeeded += 1;
    }
  }, {
    key: "OnTextureLoaded",
    value: function OnTextureLoaded() {
      this.texturesLoaded += 1;
      this.callbacks.onTextureLoaded();
      this.Finish();
    }
  }, {
    key: "OnModelLoaded",
    value: function OnModelLoaded(threeObject) {
      this.threeObject = threeObject;
      this.Finish();
    }
  }, {
    key: "Finish",
    value: function Finish() {
      if (this.threeObject !== null && this.texturesNeeded === this.texturesLoaded) {
        this.callbacks.onModelLoaded(this.threeObject);
      }
    }
  }]);

  return ThreeConversionStateHandler;
}();
export var ThreeNodeTree = /*#__PURE__*/function () {
  function ThreeNodeTree(rootNode, threeRootNode) {
    _classCallCheck(this, ThreeNodeTree);

    this.meshInstances = [];
    this.AddNode(rootNode, threeRootNode);
  }

  _createClass(ThreeNodeTree, [{
    key: "AddNode",
    value: function AddNode(node, threeNode) {
      var matrix = node.GetTransformation().GetMatrix();
      var threeMatrix = new THREE.Matrix4().fromArray(matrix.Get());
      threeNode.applyMatrix4(threeMatrix);

      var _iterator = _createForOfIteratorHelper(node.GetChildNodes()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var childNode = _step.value;
          var threeChildNode = new THREE.Object3D();
          threeNode.add(threeChildNode);
          this.AddNode(childNode, threeChildNode);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var _iterator2 = _createForOfIteratorHelper(node.GetMeshIndices()),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var meshIndex = _step2.value;
          this.meshInstances.push({
            node: node,
            threeNode: threeNode,
            meshIndex: meshIndex
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "GetMeshInstances",
    value: function GetMeshInstances() {
      return this.meshInstances;
    }
  }]);

  return ThreeNodeTree;
}();
export function ConvertModelToThreeObject(model, params, output, callbacks) {
  function CreateThreeMaterial(stateHandler, model, materialIndex, shadingType, params, output) {
    function SetTextureParameters(texture, threeTexture) {
      threeTexture.wrapS = THREE.RepeatWrapping;
      threeTexture.wrapT = THREE.RepeatWrapping;
      threeTexture.rotation = texture.rotation;
      threeTexture.offset.x = texture.offset.x;
      threeTexture.offset.y = texture.offset.y;
      threeTexture.repeat.x = texture.scale.x;
      threeTexture.repeat.y = texture.scale.y;
    }

    function LoadTexture(stateHandler, threeMaterial, texture, output, onTextureLoaded) {
      if (texture === null || !texture.IsValid()) {
        return;
      }

      var loader = new THREE.TextureLoader();
      stateHandler.OnTextureNeeded();
      var textureObjectUrl = null;

      if (texture.mimeType !== null) {
        textureObjectUrl = CreateObjectUrlWithMimeType(texture.buffer, texture.mimeType);
      } else {
        textureObjectUrl = CreateObjectUrl(texture.buffer);
      }

      output.objectUrls.push(textureObjectUrl);
      loader.load(textureObjectUrl, function (threeTexture) {
        SetTextureParameters(texture, threeTexture);
        threeMaterial.needsUpdate = true;
        onTextureLoaded(threeTexture);
        stateHandler.OnTextureLoaded();
      }, null, function (err) {
        stateHandler.OnTextureLoaded();
      });
    }

    var material = model.GetMaterial(materialIndex);
    var baseColor = ConvertColorToThreeColor(material.color);

    if (material.vertexColors) {
      baseColor.setRGB(1.0, 1.0, 1.0);
    }

    var materialParams = {
      color: baseColor,
      vertexColors: material.vertexColors,
      opacity: material.opacity,
      transparent: material.transparent,
      alphaTest: material.alphaTest,
      side: THREE.DoubleSide
    };

    if (params.forceMediumpForMaterials) {
      materialParams.precision = 'mediump';
    }

    var threeMaterial = null;

    if (shadingType === ShadingType.Phong) {
      threeMaterial = new THREE.MeshPhongMaterial(materialParams);

      if (material.type === MaterialType.Phong) {
        var specularColor = ConvertColorToThreeColor(material.specular);

        if (IsEqual(material.shininess, 0.0)) {
          specularColor.setRGB(0.0, 0.0, 0.0);
        }

        threeMaterial.specular = specularColor;
        threeMaterial.shininess = material.shininess * 100.0;
        LoadTexture(stateHandler, threeMaterial, material.specularMap, output, function (threeTexture) {
          threeMaterial.specularMap = threeTexture;
        });
      }
    } else if (shadingType === ShadingType.Physical) {
      threeMaterial = new THREE.MeshStandardMaterial(materialParams);

      if (material.type === MaterialType.Physical) {
        threeMaterial.metalness = material.metalness;
        threeMaterial.roughness = material.roughness;
        LoadTexture(stateHandler, threeMaterial, material.metalnessMap, output, function (threeTexture) {
          threeMaterial.metalness = 1.0;
          threeMaterial.roughness = 1.0;
          threeMaterial.metalnessMap = threeTexture;
          threeMaterial.roughnessMap = threeTexture;
        });
      }
    }

    var emissiveColor = ConvertColorToThreeColor(material.emissive);
    threeMaterial.emissive = emissiveColor;
    LoadTexture(stateHandler, threeMaterial, material.diffuseMap, output, function (threeTexture) {
      if (!material.multiplyDiffuseMap) {
        threeMaterial.color.setRGB(1.0, 1.0, 1.0);
      }

      threeMaterial.map = threeTexture;
    });
    LoadTexture(stateHandler, threeMaterial, material.bumpMap, output, function (threeTexture) {
      threeMaterial.bumpMap = threeTexture;
    });
    LoadTexture(stateHandler, threeMaterial, material.normalMap, output, function (threeTexture) {
      threeMaterial.normalMap = threeTexture;
    });
    LoadTexture(stateHandler, threeMaterial, material.emissiveMap, output, function (threeTexture) {
      threeMaterial.emissiveMap = threeTexture;
    });

    if (material.isDefault) {
      output.defaultMaterial = threeMaterial;
    }

    return threeMaterial;
  }

  function CreateThreeMesh(model, meshInstanceId, modelThreeMaterials) {
    var mesh = model.GetMesh(meshInstanceId.meshIndex);
    var triangleCount = mesh.TriangleCount();
    var triangleIndices = [];

    for (var i = 0; i < triangleCount; i++) {
      triangleIndices.push(i);
    }

    triangleIndices.sort(function (a, b) {
      var aTriangle = mesh.GetTriangle(a);
      var bTriangle = mesh.GetTriangle(b);
      return aTriangle.mat - bTriangle.mat;
    });
    var threeGeometry = new THREE.BufferGeometry();
    var meshThreeMaterials = [];
    var meshOriginalMaterials = [];
    var modelToThreeMaterials = new Map();
    var vertices = [];
    var vertexColors = [];
    var normals = [];
    var uvs = [];
    var groups = [];
    groups.push({
      start: 0,
      end: -1
    });
    var meshHasVertexColors = mesh.VertexColorCount() > 0;
    var meshHasUVs = mesh.TextureUVCount() > 0;

    for (var _i = 0; _i < triangleIndices.length; _i++) {
      var triangleIndex = triangleIndices[_i];
      var triangle = mesh.GetTriangle(triangleIndex);
      var v0 = mesh.GetVertex(triangle.v0);
      var v1 = mesh.GetVertex(triangle.v1);
      var v2 = mesh.GetVertex(triangle.v2);
      vertices.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);

      if (triangle.HasVertexColors()) {
        var vc0 = ConvertColorToThreeColor(mesh.GetVertexColor(triangle.c0));
        var vc1 = ConvertColorToThreeColor(mesh.GetVertexColor(triangle.c1));
        var vc2 = ConvertColorToThreeColor(mesh.GetVertexColor(triangle.c2));
        vertexColors.push(vc0.r, vc0.g, vc0.b, vc1.r, vc1.g, vc1.b, vc2.r, vc2.g, vc2.b);
      } else if (meshHasVertexColors) {
        vertexColors.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
      }

      var n0 = mesh.GetNormal(triangle.n0);
      var n1 = mesh.GetNormal(triangle.n1);
      var n2 = mesh.GetNormal(triangle.n2);
      normals.push(n0.x, n0.y, n0.z, n1.x, n1.y, n1.z, n2.x, n2.y, n2.z);

      if (triangle.HasTextureUVs()) {
        var u0 = mesh.GetTextureUV(triangle.u0);
        var u1 = mesh.GetTextureUV(triangle.u1);
        var u2 = mesh.GetTextureUV(triangle.u2);
        uvs.push(u0.x, u0.y, u1.x, u1.y, u2.x, u2.y);
      } else if (meshHasUVs) {
        uvs.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
      }

      var modelMaterialIndex = triangle.mat;

      if (!modelToThreeMaterials.has(modelMaterialIndex)) {
        modelToThreeMaterials.set(modelMaterialIndex, meshThreeMaterials.length);
        meshThreeMaterials.push(modelThreeMaterials[modelMaterialIndex]);
        meshOriginalMaterials.push(modelMaterialIndex);

        if (_i > 0) {
          groups[groups.length - 1].end = _i - 1;
          groups.push({
            start: groups[groups.length - 1].end + 1,
            end: -1
          });
        }
      }
    }

    groups[groups.length - 1].end = triangleCount - 1;
    threeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    if (vertexColors.length !== 0) {
      threeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(vertexColors, 3));
    }

    threeGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

    if (uvs.length !== 0) {
      threeGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    }

    for (var _i2 = 0; _i2 < groups.length; _i2++) {
      var group = groups[_i2];
      threeGeometry.addGroup(group.start * 3, (group.end - group.start + 1) * 3, _i2);
    }

    var threeMesh = new THREE.Mesh(threeGeometry, meshThreeMaterials);
    threeMesh.name = mesh.GetName();
    threeMesh.userData = {
      originalMeshId: meshInstanceId,
      originalMaterials: meshOriginalMaterials,
      threeMaterials: null
    };
    return threeMesh;
  }

  function ConvertMesh(threeObject, model, meshInstanceId, modelThreeMaterials) {
    var mesh = model.GetMesh(meshInstanceId.meshIndex);
    var type = GetMeshType(mesh);

    if (type === MeshType.TriangleMesh) {
      var threeMesh = CreateThreeMesh(model, meshInstanceId, modelThreeMaterials);
      threeObject.add(threeMesh);
    }
  }

  function ConvertNodeHierarchy(threeRootNode, model, modelThreeMaterials, stateHandler) {
    var rootNode = model.GetRootNode();
    var nodeTree = new ThreeNodeTree(rootNode, threeRootNode);
    var meshInstances = nodeTree.GetMeshInstances();
    RunTasksBatch(meshInstances.length, 100, {
      runTask: function runTask(firstMeshInstanceIndex, lastMeshInstanceIndex, onReady) {
        for (var meshInstanceIndex = firstMeshInstanceIndex; meshInstanceIndex <= lastMeshInstanceIndex; meshInstanceIndex++) {
          var meshInstance = meshInstances[meshInstanceIndex];
          var node = meshInstance.node;
          var threeNode = meshInstance.threeNode;
          var meshInstanceId = new MeshInstanceId(node.GetId(), meshInstance.meshIndex);
          ConvertMesh(threeNode, model, meshInstanceId, modelThreeMaterials);
        }

        onReady();
      },
      onReady: function onReady() {
        stateHandler.OnModelLoaded(threeRootNode);
      }
    });
  }

  var stateHandler = new ThreeConversionStateHandler(callbacks);
  var shadingType = GetShadingType(model);
  var modelThreeMaterials = [];

  for (var materialIndex = 0; materialIndex < model.MaterialCount(); materialIndex++) {
    var threeMaterial = CreateThreeMaterial(stateHandler, model, materialIndex, shadingType, params, output);
    modelThreeMaterials.push(threeMaterial);
  }

  var threeObject = new THREE.Object3D();
  ConvertNodeHierarchy(threeObject, model, modelThreeMaterials, stateHandler);
}