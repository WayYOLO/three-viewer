function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { Coord3D, CoordDistance3D, SubCoord3D } from "../geometry/coord3d.js";
import { DegRad, Direction, IsEqual } from "../geometry/geometry.js";
import { ColorComponentToFloat } from "../model/color.js";
import { ShadingType } from "../threejs/threeutils.js";
import { Camera } from "./camera.js";
import { GetDomElementInnerDimensions } from "./domutils.js";
import { Navigation } from "./navigation.js";
import { ViewerExtraGeometry, ViewerGeometry } from "./viewergeometry.js";
import * as THREE from 'three';
export var CameraMode = {
  Perspective: 1,
  Orthographic: 2
};
export function GetDefaultCamera(direction) {
  var fieldOfView = 45.0;

  if (direction === Direction.X) {
    return new Camera(new Coord3D(2.0, -3.0, 1.5), new Coord3D(0.0, 0.0, 0.0), new Coord3D(1.0, 0.0, 0.0), fieldOfView);
  } else if (direction === Direction.Y) {
    return new Camera(new Coord3D(-1.5, 2.0, 3.0), new Coord3D(0.0, 0.0, 0.0), new Coord3D(0.0, 1.0, 0.0), fieldOfView);
  } else if (direction === Direction.Z) {
    return new Camera(new Coord3D(-1.5, -3.0, 2.0), new Coord3D(0.0, 0.0, 0.0), new Coord3D(0.0, 0.0, 1.0), fieldOfView);
  }

  return null;
}
export function TraverseThreeObject(object, processor) {
  if (!processor(object)) {
    return false;
  }

  var _iterator = _createForOfIteratorHelper(object.children),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var child = _step.value;

      if (!TraverseThreeObject(child, processor)) {
        return false;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return true;
}
export function GetShadingTypeOfObject(mainObject) {
  var shadingType = null;
  TraverseThreeObject(mainObject, function (obj) {
    if (obj.isMesh) {
      var _iterator2 = _createForOfIteratorHelper(obj.material),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var material = _step2.value;

          if (material.type === 'MeshPhongMaterial') {
            shadingType = ShadingType.Phong;
          } else if (material.type === 'MeshStandardMaterial') {
            shadingType = ShadingType.Physical;
          }

          return false;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    return true;
  });
  return shadingType;
}
export var CameraValidator = /*#__PURE__*/function () {
  function CameraValidator() {
    _classCallCheck(this, CameraValidator);

    this.eyeCenterDistance = 0.0;
    this.forceUpdate = true;
  }

  _createClass(CameraValidator, [{
    key: "ForceUpdate",
    value: function ForceUpdate() {
      this.forceUpdate = true;
    }
  }, {
    key: "ValidatePerspective",
    value: function ValidatePerspective() {
      if (this.forceUpdate) {
        this.forceUpdate = false;
        return false;
      }

      return true;
    }
  }, {
    key: "ValidateOrthographic",
    value: function ValidateOrthographic(eyeCenterDistance) {
      if (this.forceUpdate || !IsEqual(this.eyeCenterDistance, eyeCenterDistance)) {
        this.eyeCenterDistance = eyeCenterDistance;
        this.forceUpdate = false;
        return false;
      }

      return true;
    }
  }]);

  return CameraValidator;
}();
export var UpVector = /*#__PURE__*/function () {
  function UpVector() {
    _classCallCheck(this, UpVector);

    this.direction = Direction.Z;
    this.isFixed = true;
    this.isFlipped = false;
  }

  _createClass(UpVector, [{
    key: "SetDirection",
    value: function SetDirection(newDirection, oldCamera) {
      this.direction = newDirection;
      this.isFlipped = false;
      var defaultCamera = GetDefaultCamera(this.direction);
      var defaultDir = SubCoord3D(defaultCamera.eye, defaultCamera.center);
      var distance = CoordDistance3D(oldCamera.center, oldCamera.eye);
      var newEye = oldCamera.center.Clone().Offset(defaultDir, distance);
      var newCamera = oldCamera.Clone();

      if (this.direction === Direction.X) {
        newCamera.up = new Coord3D(1.0, 0.0, 0.0);
        newCamera.eye = newEye;
      } else if (this.direction === Direction.Y) {
        newCamera.up = new Coord3D(0.0, 1.0, 0.0);
        newCamera.eye = newEye;
      } else if (this.direction === Direction.Z) {
        newCamera.up = new Coord3D(0.0, 0.0, 1.0);
        newCamera.eye = newEye;
      }

      return newCamera;
    }
  }, {
    key: "SetFixed",
    value: function SetFixed(isFixed, oldCamera) {
      this.isFixed = isFixed;

      if (this.isFixed) {
        return this.SetDirection(this.direction, oldCamera);
      }

      return null;
    }
  }, {
    key: "Flip",
    value: function Flip(oldCamera) {
      this.isFlipped = !this.isFlipped;
      var newCamera = oldCamera.Clone();
      newCamera.up.MultiplyScalar(-1.0);
      return newCamera;
    }
  }]);

  return UpVector;
}();
export var ShadingModel = /*#__PURE__*/function () {
  function ShadingModel(scene) {
    _classCallCheck(this, ShadingModel);

    this.scene = scene;
    this.type = ShadingType.Phong;
    this.cameraMode = CameraMode.Perspective;
    this.ambientLight = new THREE.AmbientLight(0x888888);
    this.directionalLight = new THREE.DirectionalLight(0x888888);
    this.environment = null;
    this.backgroundIsEnvMap = false;
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
  }

  _createClass(ShadingModel, [{
    key: "SetShadingType",
    value: function SetShadingType(type) {
      this.type = type;
      this.UpdateShading();
    }
  }, {
    key: "SetCameraMode",
    value: function SetCameraMode(cameraMode) {
      this.cameraMode = cameraMode;
      this.UpdateShading();
    }
  }, {
    key: "UpdateShading",
    value: function UpdateShading() {
      if (this.type === ShadingType.Phong) {
        this.ambientLight.color.set(0x888888);
        this.directionalLight.color.set(0x888888);
        this.scene.environment = null;
      } else if (this.type === ShadingType.Physical) {
        this.ambientLight.color.set(0x000000);
        this.directionalLight.color.set(0x555555);
        this.scene.environment = this.environment;
      }

      if (this.backgroundIsEnvMap && this.cameraMode === CameraMode.Perspective) {
        this.scene.background = this.environment;
      } else {
        this.scene.background = null;
      }
    }
  }, {
    key: "SetEnvironment",
    value: function SetEnvironment(textures, useAsBackground, onLoaded) {
      var loader = new THREE.CubeTextureLoader();
      this.environment = loader.load(textures, function () {
        onLoaded();
      });
      this.backgroundIsEnvMap = useAsBackground;
    }
  }, {
    key: "UpdateByCamera",
    value: function UpdateByCamera(camera) {
      var lightDir = SubCoord3D(camera.eye, camera.center);
      this.directionalLight.position.set(lightDir.x, lightDir.y, lightDir.z);
    }
  }, {
    key: "CreateHighlightMaterial",
    value: function CreateHighlightMaterial(highlightColor, withOffset) {
      var material = null;

      if (this.type === ShadingType.Phong) {
        material = new THREE.MeshPhongMaterial({
          color: highlightColor,
          side: THREE.DoubleSide
        });
      } else if (this.type === ShadingType.Physical) {
        material = new THREE.MeshStandardMaterial({
          color: highlightColor,
          side: THREE.DoubleSide
        });
      }

      if (material !== null && withOffset) {
        material.polygonOffset = true;
        material.polygonOffsetUnit = 1;
        material.polygonOffsetFactor = 1;
      }

      return material;
    }
  }]);

  return ShadingModel;
}();
export var Viewer = /*#__PURE__*/function () {
  function Viewer() {
    _classCallCheck(this, Viewer);

    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.geometry = null;
    this.extraGeometry = null;
    this.camera = null;
    this.cameraMode = null;
    this.cameraValidator = null;
    this.shadingModel = null;
    this.navigation = null;
    this.upVector = null;
    this.settings = {
      animationSteps: 40
    };
  }

  _createClass(Viewer, [{
    key: "Init",
    value: function Init(canvas) {
      this.canvas = canvas;
      this.canvas.id = 'viewer';
      var parameters = {
        canvas: this.canvas,
        antialias: true
      };
      this.renderer = new THREE.WebGLRenderer(parameters);

      if (window.devicePixelRatio) {
        this.renderer.setPixelRatio(window.devicePixelRatio);
      }

      this.renderer.setClearColor('#ffffff', 1.0);
      this.renderer.setSize(this.canvas.width, this.canvas.height);
      this.scene = new THREE.Scene();
      this.geometry = new ViewerGeometry(this.scene);
      this.extraGeometry = new ViewerExtraGeometry(this.scene);
      this.InitNavigation();
      this.InitShading();
      this.Render();
    }
  }, {
    key: "SetMouseClickHandler",
    value: function SetMouseClickHandler(onMouseClick) {
      this.navigation.SetMouseClickHandler(onMouseClick);
    }
  }, {
    key: "SetMouseMoveHandler",
    value: function SetMouseMoveHandler(onMouseMove) {
      this.navigation.SetMouseMoveHandler(onMouseMove);
    }
  }, {
    key: "SetContextMenuHandler",
    value: function SetContextMenuHandler(onContext) {
      this.navigation.SetContextMenuHandler(onContext);
    }
  }, {
    key: "SetEnvironmentMapSettings",
    value: function SetEnvironmentMapSettings(textures, useAsBackground) {
      var _this = this;

      this.shadingModel.SetEnvironment(textures, useAsBackground, function () {
        _this.Render();
      });
      this.shadingModel.UpdateShading();
      this.Render();
    }
  }, {
    key: "SetBackgroundColor",
    value: function SetBackgroundColor(color) {
      var bgColor = new THREE.Color(ColorComponentToFloat(color.r), ColorComponentToFloat(color.g), ColorComponentToFloat(color.b));
      var alpha = ColorComponentToFloat(color.a);
      this.renderer.setClearColor(bgColor, alpha);
      this.Render();
    }
  }, {
    key: "SetEdgeSettings",
    value: function SetEdgeSettings(show, color, threshold) {
      this.geometry.SetEdgeSettings(show, color, threshold);
      this.Render();
    }
  }, {
    key: "GetCanvas",
    value: function GetCanvas() {
      return this.canvas;
    }
  }, {
    key: "GetCamera",
    value: function GetCamera() {
      return this.navigation.GetCamera();
    }
  }, {
    key: "GetCameraMode",
    value: function GetCameraMode() {
      return this.cameraMode;
    }
  }, {
    key: "SetCamera",
    value: function SetCamera(camera) {
      this.navigation.SetCamera(camera);
      this.cameraValidator.ForceUpdate();
      this.Render();
    }
  }, {
    key: "SetCameraMode",
    value: function SetCameraMode(cameraMode) {
      if (this.cameraMode === cameraMode) {
        return;
      }

      this.scene.remove(this.camera);

      if (cameraMode === CameraMode.Perspective) {
        this.camera = new THREE.PerspectiveCamera(45.0, 1.0, 0.1, 1000.0);
      } else if (cameraMode === CameraMode.Orthographic) {
        this.camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, 0.1, 1000.0);
      }

      this.scene.add(this.camera);
      this.cameraMode = cameraMode;
      this.shadingModel.SetCameraMode(cameraMode);
      this.cameraValidator.ForceUpdate();
      this.AdjustClippingPlanes();
      this.Render();
    }
  }, {
    key: "Resize",
    value: function Resize(width, height) {
      var innerSize = GetDomElementInnerDimensions(this.canvas, width, height);
      this.ResizeRenderer(innerSize.width, innerSize.height);
    }
  }, {
    key: "ResizeRenderer",
    value: function ResizeRenderer(width, height) {
      if (window.devicePixelRatio) {
        this.renderer.setPixelRatio(window.devicePixelRatio);
      }

      this.renderer.setSize(width, height);
      this.cameraValidator.ForceUpdate();
      this.Render();
    }
  }, {
    key: "FitSphereToWindow",
    value: function FitSphereToWindow(boundingSphere, animation) {
      if (boundingSphere === null) {
        return;
      }

      var center = new Coord3D(boundingSphere.center.x, boundingSphere.center.y, boundingSphere.center.z);
      var radius = boundingSphere.radius;
      var newCamera = this.navigation.GetFitToSphereCamera(center, radius);
      this.navigation.MoveCamera(newCamera, animation ? this.settings.animationSteps : 0);
    }
  }, {
    key: "AdjustClippingPlanes",
    value: function AdjustClippingPlanes() {
      var boundingSphere = this.GetBoundingSphere(function (meshUserData) {
        return true;
      });
      this.AdjustClippingPlanesToSphere(boundingSphere);
    }
  }, {
    key: "AdjustClippingPlanesToSphere",
    value: function AdjustClippingPlanesToSphere(boundingSphere) {
      if (boundingSphere === null) {
        return;
      }

      if (boundingSphere.radius < 10.0) {
        this.camera.near = 0.01;
        this.camera.far = 100.0;
      } else if (boundingSphere.radius < 100.0) {
        this.camera.near = 0.1;
        this.camera.far = 1000.0;
      } else if (boundingSphere.radius < 1000.0) {
        this.camera.near = 10.0;
        this.camera.far = 10000.0;
      } else {
        this.camera.near = 100.0;
        this.camera.far = 1000000.0;
      }

      this.cameraValidator.ForceUpdate();
      this.Render();
    }
  }, {
    key: "IsFixUpVector",
    value: function IsFixUpVector() {
      return this.navigation.IsFixUpVector();
    }
  }, {
    key: "SetFixUpVector",
    value: function SetFixUpVector(fixUpVector) {
      var oldCamera = this.navigation.GetCamera();
      var newCamera = this.upVector.SetFixed(fixUpVector, oldCamera);
      this.navigation.SetFixUpVector(fixUpVector);

      if (newCamera !== null) {
        this.navigation.MoveCamera(newCamera, this.settings.animationSteps);
      }

      this.Render();
    }
  }, {
    key: "SetUpVector",
    value: function SetUpVector(upDirection, animate) {
      var oldCamera = this.navigation.GetCamera();
      var newCamera = this.upVector.SetDirection(upDirection, oldCamera);
      var animationSteps = animate ? this.settings.animationSteps : 0;
      this.navigation.MoveCamera(newCamera, animationSteps);
      this.Render();
    }
  }, {
    key: "FlipUpVector",
    value: function FlipUpVector() {
      var oldCamera = this.navigation.GetCamera();
      var newCamera = this.upVector.Flip(oldCamera);
      this.navigation.MoveCamera(newCamera, 0);
      this.Render();
    }
  }, {
    key: "Render",
    value: function Render() {
      var navigationCamera = this.navigation.GetCamera();
      this.camera.position.set(navigationCamera.eye.x, navigationCamera.eye.y, navigationCamera.eye.z);
      this.camera.up.set(navigationCamera.up.x, navigationCamera.up.y, navigationCamera.up.z);
      this.camera.lookAt(new THREE.Vector3(navigationCamera.center.x, navigationCamera.center.y, navigationCamera.center.z));

      if (this.cameraMode === CameraMode.Perspective) {
        if (!this.cameraValidator.ValidatePerspective()) {
          this.camera.aspect = this.canvas.width / this.canvas.height;
          this.camera.fov = navigationCamera.fov;
          this.camera.updateProjectionMatrix();
        }
      } else if (this.cameraMode === CameraMode.Orthographic) {
        var eyeCenterDistance = CoordDistance3D(navigationCamera.eye, navigationCamera.center);

        if (!this.cameraValidator.ValidateOrthographic(eyeCenterDistance)) {
          var aspect = this.canvas.width / this.canvas.height;

          var _eyeCenterDistance = CoordDistance3D(navigationCamera.eye, navigationCamera.center);

          var frustumHalfHeight = _eyeCenterDistance * Math.tan(0.5 * navigationCamera.fov * DegRad);

          this.camera.left = -frustumHalfHeight * aspect;
          this.camera.right = frustumHalfHeight * aspect;
          this.camera.top = frustumHalfHeight;
          this.camera.bottom = -frustumHalfHeight;
          this.camera.updateProjectionMatrix();
        }
      }

      this.shadingModel.UpdateByCamera(navigationCamera);
      this.renderer.render(this.scene, this.camera);
    }
  }, {
    key: "SetMainObject",
    value: function SetMainObject(object) {
      var shadingType = GetShadingTypeOfObject(object);
      this.geometry.SetMainObject(object);
      this.shadingModel.SetShadingType(shadingType);
      this.Render();
    }
  }, {
    key: "AddExtraObject",
    value: function AddExtraObject(object) {
      this.extraGeometry.AddObject(object);
      this.Render();
    }
  }, {
    key: "Clear",
    value: function Clear() {
      this.geometry.Clear();
      this.extraGeometry.Clear();
      this.Render();
    }
  }, {
    key: "ClearExtra",
    value: function ClearExtra() {
      this.extraGeometry.Clear();
      this.Render();
    }
  }, {
    key: "SetMeshesVisibility",
    value: function SetMeshesVisibility(isVisible) {
      this.geometry.EnumerateMeshes(function (mesh) {
        var visible = isVisible(mesh.userData);

        if (mesh.visible !== visible) {
          mesh.visible = visible;
        }
      });
      this.geometry.EnumerateEdges(function (edge) {
        var visible = isVisible(edge.userData);

        if (edge.visible !== visible) {
          edge.visible = visible;
        }
      });
      this.Render();
    }
  }, {
    key: "SetMeshesHighlight",
    value: function SetMeshesHighlight(highlightColor, isHighlighted) {
      function CreateHighlightMaterials(originalMaterials, highlightMaterial) {
        var highlightMaterials = [];

        for (var i = 0; i < originalMaterials.length; i++) {
          highlightMaterials.push(highlightMaterial);
        }

        return highlightMaterials;
      }

      var highlightMaterial = this.CreateHighlightMaterial(highlightColor);
      this.geometry.EnumerateMeshes(function (mesh) {
        var highlighted = isHighlighted(mesh.userData);

        if (highlighted) {
          if (mesh.userData.threeMaterials === null) {
            mesh.userData.threeMaterials = mesh.material;
            mesh.material = CreateHighlightMaterials(mesh.material, highlightMaterial);
          }
        } else {
          if (mesh.userData.threeMaterials !== null) {
            mesh.material = mesh.userData.threeMaterials;
            mesh.userData.threeMaterials = null;
          }
        }
      });
      this.Render();
    }
  }, {
    key: "CreateHighlightMaterial",
    value: function CreateHighlightMaterial(highlightColor) {
      var showEdges = this.geometry.edgeSettings.showEdges;
      return this.shadingModel.CreateHighlightMaterial(highlightColor, showEdges);
    }
  }, {
    key: "GetMeshUserDataUnderMouse",
    value: function GetMeshUserDataUnderMouse(mouseCoords) {
      var intersection = this.GetMeshIntersectionUnderMouse(mouseCoords);

      if (intersection === null) {
        return null;
      }

      return intersection.object.userData;
    }
  }, {
    key: "GetMeshIntersectionUnderMouse",
    value: function GetMeshIntersectionUnderMouse(mouseCoords) {
      var canvasSize = this.GetCanvasSize();
      var intersection = this.geometry.GetMeshIntersectionUnderMouse(mouseCoords, this.camera, canvasSize.width, canvasSize.height);

      if (intersection === null) {
        return null;
      }

      return intersection;
    }
  }, {
    key: "GetBoundingBox",
    value: function GetBoundingBox(needToProcess) {
      return this.geometry.GetBoundingBox(needToProcess);
    }
  }, {
    key: "GetBoundingSphere",
    value: function GetBoundingSphere(needToProcess) {
      return this.geometry.GetBoundingSphere(needToProcess);
    }
  }, {
    key: "EnumerateMeshesUserData",
    value: function EnumerateMeshesUserData(enumerator) {
      this.geometry.EnumerateMeshes(function (mesh) {
        enumerator(mesh.userData);
      });
    }
  }, {
    key: "InitNavigation",
    value: function InitNavigation() {
      var _this2 = this;

      var camera = GetDefaultCamera(Direction.Z);
      this.camera = new THREE.PerspectiveCamera(45.0, 1.0, 0.1, 1000.0);
      this.cameraMode = CameraMode.Perspective;
      this.cameraValidator = new CameraValidator();
      this.scene.add(this.camera);
      var canvasElem = this.renderer.domElement;
      this.navigation = new Navigation(canvasElem, camera, {
        onUpdate: function onUpdate() {
          _this2.Render();
        }
      });
      this.upVector = new UpVector();
    }
  }, {
    key: "InitShading",
    value: function InitShading() {
      this.shadingModel = new ShadingModel(this.scene);
    }
  }, {
    key: "GetShadingType",
    value: function GetShadingType() {
      return this.shadingModel.type;
    }
  }, {
    key: "GetImageSize",
    value: function GetImageSize() {
      var originalSize = new THREE.Vector2();
      this.renderer.getSize(originalSize);
      return {
        width: parseInt(originalSize.x, 10),
        height: parseInt(originalSize.y, 10)
      };
    }
  }, {
    key: "GetCanvasSize",
    value: function GetCanvasSize() {
      var width = this.canvas.width;
      var height = this.canvas.height;

      if (window.devicePixelRatio) {
        width /= window.devicePixelRatio;
        height /= window.devicePixelRatio;
      }

      return {
        width: width,
        height: height
      };
    }
  }, {
    key: "GetImageAsDataUrl",
    value: function GetImageAsDataUrl(width, height) {
      var originalSize = this.GetImageSize();
      var renderWidth = width;
      var renderHeight = height;

      if (window.devicePixelRatio) {
        renderWidth /= window.devicePixelRatio;
        renderHeight /= window.devicePixelRatio;
      }

      this.ResizeRenderer(renderWidth, renderHeight);
      this.Render();
      var url = this.renderer.domElement.toDataURL();
      this.ResizeRenderer(originalSize.width, originalSize.height);
      return url;
    }
  }]);

  return Viewer;
}();