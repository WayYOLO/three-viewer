function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { RGBColor } from "../model/color.js";
import { ConvertColorToThreeColor } from "../threejs/threeutils.js";
import * as THREE from 'three';
export function SetThreeMeshPolygonOffset(mesh, offset) {
  function SetMaterialsPolygonOffset(materials, offset) {
    var _iterator = _createForOfIteratorHelper(materials),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var material = _step.value;
        material.polygonOffset = offset;
        material.polygonOffsetUnit = 1;
        material.polygonOffsetFactor = 1;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  SetMaterialsPolygonOffset(mesh.material, offset);

  if (mesh.userData.threeMaterials) {
    SetMaterialsPolygonOffset(mesh.userData.threeMaterials, offset);
  }
}
export var ViewerGeometry = /*#__PURE__*/function () {
  function ViewerGeometry(scene) {
    _classCallCheck(this, ViewerGeometry);

    this.scene = scene;
    this.mainObject = null;
    this.mainEdgeObject = null;
    this.edgeSettings = {
      showEdges: false,
      edgeColor: new RGBColor(0, 0, 0),
      edgeThreshold: 1
    };
  }

  _createClass(ViewerGeometry, [{
    key: "SetMainObject",
    value: function SetMainObject(mainObject) {
      this.mainObject = mainObject;
      this.scene.add(this.mainObject);

      if (this.edgeSettings.showEdges) {
        this.GenerateMainEdgeObject();
      }
    }
  }, {
    key: "UpdateWorldMatrix",
    value: function UpdateWorldMatrix() {
      if (this.mainObject !== null) {
        this.mainObject.updateWorldMatrix(true, true);
      }
    }
  }, {
    key: "SetEdgeSettings",
    value: function SetEdgeSettings(show, color, threshold) {
      var needToGenerate = false;

      if (show && (!this.edgeSettings.showEdges || this.edgeSettings.edgeThreshold !== threshold)) {
        needToGenerate = true;
      }

      this.edgeSettings.showEdges = show;
      this.edgeSettings.edgeThreshold = threshold;
      this.edgeSettings.edgeColor = color;

      if (this.mainObject === null) {
        return;
      }

      if (this.edgeSettings.showEdges) {
        if (needToGenerate) {
          this.ClearMainEdgeObject();
          this.GenerateMainEdgeObject();
        } else {
          var edgeColor = ConvertColorToThreeColor(this.edgeSettings.edgeColor);
          this.EnumerateEdges(function (edge) {
            edge.material.color = edgeColor;
          });
        }
      } else {
        this.ClearMainEdgeObject();
      }
    }
  }, {
    key: "GenerateMainEdgeObject",
    value: function GenerateMainEdgeObject() {
      var _this = this;

      var edgeColor = ConvertColorToThreeColor(this.edgeSettings.edgeColor);
      this.mainEdgeObject = new THREE.Object3D();
      this.UpdateWorldMatrix();
      this.EnumerateMeshes(function (mesh) {
        SetThreeMeshPolygonOffset(mesh, true);
        var edges = new THREE.EdgesGeometry(mesh.geometry, _this.edgeSettings.edgeThreshold);
        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
          color: edgeColor
        }));
        line.applyMatrix4(mesh.matrixWorld);
        line.userData = mesh.userData;
        line.visible = mesh.visible;

        _this.mainEdgeObject.add(line);
      });
      this.scene.add(this.mainEdgeObject);
    }
  }, {
    key: "GetBoundingBox",
    value: function GetBoundingBox(needToProcess) {
      var hasMesh = false;
      var boundingBox = new THREE.Box3();
      this.EnumerateMeshes(function (mesh) {
        if (needToProcess(mesh.userData)) {
          boundingBox.union(new THREE.Box3().setFromObject(mesh));
          hasMesh = true;
        }
      });

      if (!hasMesh) {
        return null;
      }

      return boundingBox;
    }
  }, {
    key: "GetBoundingSphere",
    value: function GetBoundingSphere(needToProcess) {
      var boundingBox = this.GetBoundingBox(needToProcess);

      if (boundingBox === null) {
        return null;
      }

      var boundingSphere = new THREE.Sphere();
      boundingBox.getBoundingSphere(boundingSphere);
      return boundingSphere;
    }
  }, {
    key: "Clear",
    value: function Clear() {
      this.ClearMainObject();
      this.ClearMainEdgeObject();
    }
  }, {
    key: "ClearMainObject",
    value: function ClearMainObject() {
      if (this.mainObject === null) {
        return;
      }

      this.EnumerateMeshes(function (mesh) {
        mesh.geometry.dispose();
      });
      this.scene.remove(this.mainObject);
      this.mainObject = null;
    }
  }, {
    key: "ClearMainEdgeObject",
    value: function ClearMainEdgeObject() {
      if (this.mainEdgeObject === null) {
        return;
      }

      this.EnumerateMeshes(function (mesh) {
        SetThreeMeshPolygonOffset(mesh, false);
      });
      this.EnumerateEdges(function (edge) {
        edge.geometry.dispose();
      });
      this.scene.remove(this.mainEdgeObject);
      this.mainEdgeObject = null;
    }
  }, {
    key: "EnumerateMeshes",
    value: function EnumerateMeshes(enumerator) {
      if (this.mainObject === null) {
        return;
      }

      this.mainObject.traverse(function (obj) {
        if (obj.isMesh) {
          enumerator(obj);
        }
      });
    }
  }, {
    key: "EnumerateEdges",
    value: function EnumerateEdges(enumerator) {
      if (this.mainEdgeObject === null) {
        return;
      }

      this.mainEdgeObject.traverse(function (obj) {
        if (obj.isLineSegments) {
          enumerator(obj);
        }
      });
    }
  }, {
    key: "GetMeshIntersectionUnderMouse",
    value: function GetMeshIntersectionUnderMouse(mouseCoords, camera, width, height) {
      if (this.mainObject === null) {
        return null;
      }

      if (mouseCoords.x < 0.0 || mouseCoords.x > width || mouseCoords.y < 0.0 || mouseCoords.y > height) {
        return null;
      }

      var raycaster = new THREE.Raycaster();
      var mousePos = new THREE.Vector2();
      mousePos.x = mouseCoords.x / width * 2 - 1;
      mousePos.y = -(mouseCoords.y / height) * 2 + 1;
      raycaster.setFromCamera(mousePos, camera);
      var iSectObjects = raycaster.intersectObject(this.mainObject, true);

      for (var i = 0; i < iSectObjects.length; i++) {
        var iSectObject = iSectObjects[i];

        if (iSectObject.object.type === 'Mesh' && iSectObject.object.visible) {
          return iSectObject;
        }
      }

      return null;
    }
  }]);

  return ViewerGeometry;
}();
export var ViewerExtraGeometry = /*#__PURE__*/function () {
  function ViewerExtraGeometry(scene) {
    _classCallCheck(this, ViewerExtraGeometry);

    this.scene = scene;
    this.mainObject = null;
  }

  _createClass(ViewerExtraGeometry, [{
    key: "AddObject",
    value: function AddObject(object) {
      if (this.mainObject === null) {
        this.mainObject = new THREE.Object3D();
        this.scene.add(this.mainObject);
      }

      this.mainObject.add(object);
    }
  }, {
    key: "Clear",
    value: function Clear() {
      if (this.mainObject === null) {
        return;
      }

      this.mainObject.traverse(function (obj) {
        if (obj.isMesh || obj.isLineSegments) {
          obj.geometry.dispose();
        }
      });
      this.scene.remove(this.mainObject);
      this.mainObject = null;
    }
  }]);

  return ViewerExtraGeometry;
}();