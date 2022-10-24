function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import { WaitWhile } from "../core/taskrunner.js";
import { Direction } from "../geometry/geometry.js";
import { Matrix } from "../geometry/matrix.js";
import { Transformation } from "../geometry/transformation.js";
import { Base64DataURIToArrayBuffer, CreateObjectUrl, GetFileExtensionFromMimeType } from "../io/bufferutils.js";
import { GetFileExtension, GetFileName } from "../io/fileutils.js";
import { PhongMaterial, TextureMap } from "../model/material.js";
import { Node, NodeType } from "../model/node.js";
import { ConvertThreeColorToColor, ConvertThreeGeometryToMesh } from "../threejs/threeutils.js";
import { ImporterBase } from "./importerbase.js";
import * as THREE from 'three';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
export var ImporterThreeBase = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterThreeBase, _ImporterBase);

  var _super = _createSuper(ImporterThreeBase);

  function ImporterThreeBase() {
    _classCallCheck(this, ImporterThreeBase);

    return _super.call(this);
  }

  _createClass(ImporterThreeBase, [{
    key: "CreateLoader",
    value: function CreateLoader(manager) {
      return null;
    }
  }, {
    key: "GetMainObject",
    value: function GetMainObject(loadedObject) {
      return loadedObject;
    }
  }, {
    key: "IsMeshVisible",
    value: function IsMeshVisible(mesh) {
      return true;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      this.loader = null;
      this.materialIdToIndex = null;
      this.objectUrlToFileName = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.loader = null;
      this.materialIdToIndex = new Map();
      this.objectUrlToFileName = new Map();
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      this.LoadModel(fileContent, onFinish);
    }
  }, {
    key: "LoadModel",
    value: function LoadModel(fileContent, onFinish) {
      var _this = this;

      var isAllLoadersDone = false;
      var loadingManager = new THREE.LoadingManager(function () {
        isAllLoadersDone = true;
      });
      var mainFileUrl = CreateObjectUrl(fileContent);
      loadingManager.setURLModifier(function (url) {
        if (url === mainFileUrl) {
          return url;
        }

        var name = GetFileName(url);
        var extension = GetFileExtension(url);

        if (extension.length > 0) {
          var buffer = _this.callbacks.getFileBuffer(url);

          if (buffer !== null) {
            var objectUrl = CreateObjectUrl(buffer);

            _this.objectUrlToFileName.set(objectUrl, name);

            return objectUrl;
          }
        }

        return url;
      });
      var threeLoader = this.CreateLoader(loadingManager);

      if (threeLoader === null) {
        onFinish();
        return;
      }

      threeLoader.load(mainFileUrl, function (object) {
        WaitWhile(function () {
          if (isAllLoadersDone) {
            _this.OnThreeObjectsLoaded(object, onFinish);

            return false;
          }

          return true;
        });
      }, function () {}, function (err) {
        _this.SetError(err);

        onFinish();
      });
    }
  }, {
    key: "OnThreeObjectsLoaded",
    value: function OnThreeObjectsLoaded(loadedObject, onFinish) {
      function GetObjectTransformation(threeObject) {
        var matrix = new Matrix().CreateIdentity();
        threeObject.updateMatrix();

        if (threeObject.matrix !== undefined && threeObject.matrix !== null) {
          matrix.Set(threeObject.matrix.elements);
        }

        return new Transformation(matrix);
      }

      function AddObject(importer, model, threeObject, parentNode) {
        var node = new Node();

        if (threeObject.name !== undefined) {
          node.SetName(threeObject.name);
        }

        node.SetTransformation(GetObjectTransformation(threeObject));
        parentNode.AddChildNode(node);

        var _iterator = _createForOfIteratorHelper(threeObject.children),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var childObject = _step.value;
            AddObject(importer, model, childObject, node);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (threeObject.isMesh && importer.IsMeshVisible(threeObject)) {
          if (threeObject.children.length === 0) {
            node.SetType(NodeType.MeshNode);
          }

          var mesh = importer.ConvertThreeMesh(threeObject);
          var meshIndex = model.AddMesh(mesh);
          node.AddMeshIndex(meshIndex);
        }
      }

      var mainObject = this.GetMainObject(loadedObject);
      var rootNode = this.model.GetRootNode();
      rootNode.SetTransformation(GetObjectTransformation(mainObject));

      var _iterator2 = _createForOfIteratorHelper(mainObject.children),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var childObject = _step2.value;
          AddObject(this, this.model, childObject, rootNode);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      onFinish();
    }
  }, {
    key: "ConvertThreeMesh",
    value: function ConvertThreeMesh(threeMesh) {
      var mesh = null;

      if (Array.isArray(threeMesh.material)) {
        mesh = ConvertThreeGeometryToMesh(threeMesh.geometry, null);

        if (threeMesh.geometry.attributes.color === undefined || threeMesh.geometry.attributes.color === null) {
          var materialIndices = [];

          for (var i = 0; i < threeMesh.material.length; i++) {
            var material = threeMesh.material[i];
            var materialIndex = this.FindOrCreateMaterial(material);
            materialIndices.push(materialIndex);
          }

          for (var _i = 0; _i < threeMesh.geometry.groups.length; _i++) {
            var group = threeMesh.geometry.groups[_i];
            var groupEnd = null;

            if (group.count === Infinity) {
              groupEnd = mesh.TriangleCount();
            } else {
              groupEnd = group.start / 3 + group.count / 3;
            }

            for (var j = group.start / 3; j < groupEnd; j++) {
              var triangle = mesh.GetTriangle(j);
              triangle.SetMaterial(materialIndices[group.materialIndex]);
            }
          }
        }
      } else {
        var _materialIndex = this.FindOrCreateMaterial(threeMesh.material);

        mesh = ConvertThreeGeometryToMesh(threeMesh.geometry, _materialIndex);
      }

      if (threeMesh.name !== undefined && threeMesh.name !== null) {
        mesh.SetName(threeMesh.name);
      }

      return mesh;
    }
  }, {
    key: "FindOrCreateMaterial",
    value: function FindOrCreateMaterial(threeMaterial) {
      if (this.materialIdToIndex.has(threeMaterial.id)) {
        return this.materialIdToIndex.get(threeMaterial.id);
      }

      var material = this.ConvertThreeMaterial(threeMaterial);
      var materialIndex = this.model.AddMaterial(material);
      this.materialIdToIndex.set(threeMaterial.id, materialIndex);
      return materialIndex;
    }
  }, {
    key: "ConvertThreeMaterial",
    value: function ConvertThreeMaterial(threeMaterial) {
      function CreateTexture(threeMap, objectUrlToFileName) {
        function GetDataUrl(img) {
          if (img.data !== undefined && img.data !== null) {
            var imageData = new ImageData(img.width, img.height);
            var imageSize = img.width * img.height * 4;

            for (var i = 0; i < imageSize; i++) {
              imageData.data[i] = img.data[i];
            }

            return THREE.ImageUtils.getDataURL(imageData);
          } else {
            return THREE.ImageUtils.getDataURL(img);
          }
        }

        if (threeMap === undefined || threeMap === null) {
          return null;
        }

        if (threeMap.image === undefined || threeMap.image === null) {
          return null;
        }

        try {
          var dataUrl = GetDataUrl(threeMap.image);
          var base64Buffer = Base64DataURIToArrayBuffer(dataUrl);
          var texture = new TextureMap();
          var textureName = null;

          if (objectUrlToFileName.has(threeMap.image.src)) {
            textureName = objectUrlToFileName.get(threeMap.image.src);
          } else if (threeMap.name !== undefined && threeMap.name !== null) {
            textureName = threeMap.name + '.' + GetFileExtensionFromMimeType(base64Buffer.mimeType);
          } else {
            textureName = 'Embedded_' + threeMap.id.toString() + '.' + GetFileExtensionFromMimeType(base64Buffer.mimeType);
          }

          texture.name = textureName;
          texture.mimeType = base64Buffer.mimeType;
          texture.buffer = base64Buffer.buffer;
          texture.rotation = threeMap.rotation;
          texture.offset.x = threeMap.offset.x;
          texture.offset.y = threeMap.offset.y;
          texture.scale.x = threeMap.repeat.x;
          texture.scale.y = threeMap.repeat.y;
          return texture;
        } catch (err) {
          return null;
        }
      }

      var material = new PhongMaterial();
      material.name = threeMaterial.name;
      material.color = ConvertThreeColorToColor(threeMaterial.color);
      material.opacity = threeMaterial.opacity;
      material.transparent = threeMaterial.transparent;
      material.alphaTest = threeMaterial.alphaTest;

      if (threeMaterial.type === 'MeshPhongMaterial') {
        material.specular = ConvertThreeColorToColor(threeMaterial.specular);
        material.shininess = threeMaterial.shininess / 100.0;
      }

      material.diffuseMap = CreateTexture(threeMaterial.map, this.objectUrlToFileName);
      material.normalMap = CreateTexture(threeMaterial.normalMap, this.objectUrlToFileName);
      material.bumpMap = CreateTexture(threeMaterial.bumpMap, this.objectUrlToFileName);
      return material;
    }
  }]);

  return ImporterThreeBase;
}(ImporterBase);
export var ImporterThreeFbx = /*#__PURE__*/function (_ImporterThreeBase) {
  _inherits(ImporterThreeFbx, _ImporterThreeBase);

  var _super2 = _createSuper(ImporterThreeFbx);

  function ImporterThreeFbx() {
    _classCallCheck(this, ImporterThreeFbx);

    return _super2.call(this);
  }

  _createClass(ImporterThreeFbx, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'fbx';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Y;
    }
  }, {
    key: "CreateLoader",
    value: function CreateLoader(manager) {
      manager.addHandler(/\.tga$/i, new TGALoader(manager));
      return new FBXLoader(manager);
    }
  }, {
    key: "GetMainObject",
    value: function GetMainObject(loadedObject) {
      return loadedObject;
    }
  }]);

  return ImporterThreeFbx;
}(ImporterThreeBase);
export var ImporterThreeDae = /*#__PURE__*/function (_ImporterThreeBase2) {
  _inherits(ImporterThreeDae, _ImporterThreeBase2);

  var _super3 = _createSuper(ImporterThreeDae);

  function ImporterThreeDae() {
    _classCallCheck(this, ImporterThreeDae);

    return _super3.call(this);
  }

  _createClass(ImporterThreeDae, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'dae';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Y;
    }
  }, {
    key: "CreateLoader",
    value: function CreateLoader(manager) {
      manager.addHandler(/\.tga$/i, new TGALoader(manager));
      return new ColladaLoader(manager);
    }
  }, {
    key: "GetMainObject",
    value: function GetMainObject(loadedObject) {
      return loadedObject.scene;
    }
  }]);

  return ImporterThreeDae;
}(ImporterThreeBase);
export var ImporterThreeWrl = /*#__PURE__*/function (_ImporterThreeBase3) {
  _inherits(ImporterThreeWrl, _ImporterThreeBase3);

  var _super4 = _createSuper(ImporterThreeWrl);

  function ImporterThreeWrl() {
    _classCallCheck(this, ImporterThreeWrl);

    return _super4.call(this);
  }

  _createClass(ImporterThreeWrl, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'wrl';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Y;
    }
  }, {
    key: "CreateLoader",
    value: function CreateLoader(manager) {
      return new VRMLLoader(manager);
    }
  }, {
    key: "GetMainObject",
    value: function GetMainObject(loadedObject) {
      return loadedObject;
    }
  }, {
    key: "IsMeshVisible",
    value: function IsMeshVisible(mesh) {
      var isVisible = true;

      if (Array.isArray(mesh.material)) {
        for (var i = 0; i < mesh.material.length; i++) {
          if (mesh.material[i].side === THREE.BackSide) {
            isVisible = false;
            break;
          }
        }
      } else {
        isVisible = mesh.material.side !== THREE.BackSide;
      }

      return isVisible;
    }
  }]);

  return ImporterThreeWrl;
}(ImporterThreeBase);
export var ImporterThree3mf = /*#__PURE__*/function (_ImporterThreeBase4) {
  _inherits(ImporterThree3mf, _ImporterThreeBase4);

  var _super5 = _createSuper(ImporterThree3mf);

  function ImporterThree3mf() {
    _classCallCheck(this, ImporterThree3mf);

    return _super5.call(this);
  }

  _createClass(ImporterThree3mf, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === '3mf';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Z;
    }
  }, {
    key: "CreateLoader",
    value: function CreateLoader(manager) {
      return new ThreeMFLoader(manager);
    }
  }, {
    key: "GetMainObject",
    value: function GetMainObject(loadedObject) {
      return loadedObject;
    }
  }]);

  return ImporterThree3mf;
}(ImporterThreeBase);