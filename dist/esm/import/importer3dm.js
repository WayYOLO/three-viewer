function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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

import { Direction } from "../geometry/geometry.js";
import { Matrix } from "../geometry/matrix.js";
import { Transformation } from "../geometry/transformation.js";
import { LoadExternalLibrary } from "../io/externallibs.js";
import { GetFileName } from "../io/fileutils.js";
import { PhongMaterial, PhysicalMaterial } from "../model/material.js";
import { TransformMesh } from "../model/meshutils.js";
import { IsModelEmpty } from "../model/modelutils.js";
import { Property, PropertyGroup, PropertyType } from "../model/property.js";
import { ConvertThreeGeometryToMesh } from "../threejs/threeutils.js";
import { ImporterBase } from "./importerbase.js";
import { UpdateMaterialTransparency } from "./importerutils.js";
import { TextureMap } from "../model/material.js";
export var Importer3dm = /*#__PURE__*/function (_ImporterBase) {
  _inherits(Importer3dm, _ImporterBase);

  var _super = _createSuper(Importer3dm);

  function Importer3dm() {
    var _this;

    _classCallCheck(this, Importer3dm);

    _this = _super.call(this);
    _this.rhino = null;
    return _this;
  }

  _createClass(Importer3dm, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === '3dm';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Z;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      this.instanceIdToObject = null;
      this.instanceIdToDefinition = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.instanceIdToObject = new Map();
      this.instanceIdToDefinition = new Map();
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      var _this2 = this;

      if (this.rhino === null) {
        LoadExternalLibrary('loaders/rhino3dm.min.js').then(function () {
          rhino3dm().then(function (rhino) {
            _this2.rhino = rhino;

            _this2.ImportRhinoContent(fileContent);

            onFinish();
          });
        }).catch(function () {
          _this2.SetError('Failed to load rhino3dm.');

          onFinish();
        });
      } else {
        this.ImportRhinoContent(fileContent);
        onFinish();
      }
    }
  }, {
    key: "ImportRhinoContent",
    value: function ImportRhinoContent(fileContent) {
      var rhinoDoc = this.rhino.File3dm.fromByteArray(fileContent);

      if (rhinoDoc === null) {
        this.SetError('Failed to read Rhino file.');
        return;
      }

      this.ImportRhinoDocument(rhinoDoc);

      if (IsModelEmpty(this.model)) {
        this.SetError('The model doesn\'t contain any 3D meshes. Try to save the model while you are in shaded view in Rhino.');
      }
    }
  }, {
    key: "ImportRhinoDocument",
    value: function ImportRhinoDocument(rhinoDoc) {
      this.InitRhinoInstances(rhinoDoc);
      this.ImportRhinoUserStrings(rhinoDoc);
      this.ImportRhinoGeometry(rhinoDoc);
    }
  }, {
    key: "InitRhinoInstances",
    value: function InitRhinoInstances(rhinoDoc) {
      var rhinoObjects = rhinoDoc.objects();

      for (var i = 0; i < rhinoObjects.count; i++) {
        var rhinoObject = rhinoObjects.get(i);
        var rhinoAttributes = rhinoObject.attributes();

        if (rhinoAttributes.isInstanceDefinitionObject) {
          this.instanceIdToObject.set(rhinoAttributes.id, rhinoObject);
        }
      }

      var rhinoInstanceDefinitions = rhinoDoc.instanceDefinitions();

      for (var _i = 0; _i < rhinoInstanceDefinitions.count(); _i++) {
        var rhinoInstanceDefinition = rhinoInstanceDefinitions.get(_i);
        this.instanceIdToDefinition.set(rhinoInstanceDefinition.id, rhinoInstanceDefinition);
      }
    }
  }, {
    key: "ImportRhinoUserStrings",
    value: function ImportRhinoUserStrings(rhinoDoc) {
      var docStrings = rhinoDoc.strings();

      if (docStrings.count() > 0) {
        var propertyGroup = new PropertyGroup('Document user texts');

        for (var i = 0; i < docStrings.count(); i++) {
          var docString = docStrings.get(i);
          propertyGroup.AddProperty(new Property(PropertyType.Text, docString[0], docString[1]));
        }

        this.model.AddPropertyGroup(propertyGroup);
      }
    }
  }, {
    key: "ImportRhinoGeometry",
    value: function ImportRhinoGeometry(rhinoDoc) {
      var rhinoObjects = rhinoDoc.objects();

      for (var i = 0; i < rhinoObjects.count; i++) {
        var rhinoObject = rhinoObjects.get(i);
        this.ImportRhinoGeometryObject(rhinoDoc, rhinoObject, []);
      }
    }
  }, {
    key: "ImportRhinoGeometryObject",
    value: function ImportRhinoGeometryObject(rhinoDoc, rhinoObject, rhinoInstanceReferences) {
      var rhinoGeometry = rhinoObject.geometry();
      var rhinoAttributes = rhinoObject.attributes();
      var objectType = rhinoGeometry.objectType;

      if (rhinoAttributes.isInstanceDefinitionObject && rhinoInstanceReferences.length === 0) {
        return;
      }

      var rhinoMesh = null;
      var deleteMesh = false;

      if (objectType === this.rhino.ObjectType.Mesh) {
        rhinoMesh = rhinoGeometry;
        deleteMesh = false;
      } else if (objectType === this.rhino.ObjectType.Extrusion) {
        rhinoMesh = rhinoGeometry.getMesh(this.rhino.MeshType.Any);
        deleteMesh = true;
      } else if (objectType === this.rhino.ObjectType.Brep) {
        rhinoMesh = new this.rhino.Mesh();
        var faces = rhinoGeometry.faces();

        for (var i = 0; i < faces.count; i++) {
          var face = faces.get(i);
          var mesh = face.getMesh(this.rhino.MeshType.Any);

          if (mesh) {
            rhinoMesh.append(mesh);
            mesh.delete();
          }

          face.delete();
        }

        faces.delete();
        rhinoMesh.compact();
        deleteMesh = true;
      } else if (objectType === this.rhino.ObjectType.SubD) {
        rhinoGeometry.subdivide(3);
        rhinoMesh = this.rhino.Mesh.createFromSubDControlNet(rhinoGeometry);
        deleteMesh = true;
      } else if (objectType === this.rhino.ObjectType.InstanceReference) {
        var parentDefinitionId = rhinoGeometry.parentIdefId;

        if (this.instanceIdToDefinition.has(parentDefinitionId)) {
          var instanceDefinition = this.instanceIdToDefinition.get(parentDefinitionId);
          var instanceObjectIds = instanceDefinition.getObjectIds();

          for (var _i2 = 0; _i2 < instanceObjectIds.length; _i2++) {
            var instanceObjectId = instanceObjectIds[_i2];

            if (this.instanceIdToObject.has(instanceObjectId)) {
              var instanceObject = this.instanceIdToObject.get(instanceObjectId);
              rhinoInstanceReferences.push(rhinoObject);
              this.ImportRhinoGeometryObject(rhinoDoc, instanceObject, rhinoInstanceReferences);
              rhinoInstanceReferences.pop();
            }
          }
        }
      }

      if (rhinoMesh !== null) {
        this.ImportRhinoMesh(rhinoDoc, rhinoMesh, rhinoObject, rhinoInstanceReferences);

        if (deleteMesh) {
          rhinoMesh.delete();
        }
      }
    }
  }, {
    key: "ImportRhinoMesh",
    value: function ImportRhinoMesh(rhinoDoc, rhinoMesh, rhinoObject, rhinoInstanceReferences) {
      var rhinoAttributes = rhinoObject.attributes();
      var materialIndex = this.GetMaterialIndex(rhinoDoc, rhinoObject, rhinoInstanceReferences);
      var threeJson = rhinoMesh.toThreejsJSON();
      var mesh = ConvertThreeGeometryToMesh(threeJson.data, materialIndex);
      mesh.SetName(rhinoAttributes.name);
      var userStrings = rhinoAttributes.getUserStrings();

      if (userStrings.length > 0) {
        var propertyGroup = new PropertyGroup('User texts');

        for (var i = 0; i < userStrings.length; i++) {
          var userString = userStrings[i];
          propertyGroup.AddProperty(new Property(PropertyType.Text, userString[0], userString[1]));
        }

        mesh.AddPropertyGroup(propertyGroup);
      }

      if (rhinoInstanceReferences.length !== 0) {
        var matrix = new Matrix().CreateIdentity();

        for (var _i3 = rhinoInstanceReferences.length - 1; _i3 >= 0; _i3--) {
          var rhinoInstanceReference = rhinoInstanceReferences[_i3];
          var rhinoInstanceReferenceGeometry = rhinoInstanceReference.geometry();
          var rhinoInstanceReferenceMatrix = rhinoInstanceReferenceGeometry.xform.toFloatArray(false);
          var transformationMatrix = new Matrix(rhinoInstanceReferenceMatrix);
          matrix = matrix.MultiplyMatrix(transformationMatrix);
        }

        var transformation = new Transformation(matrix);
        TransformMesh(mesh, transformation);
      }

      this.model.AddMeshToRootNode(mesh);
    }
  }, {
    key: "GetMaterialIndex",
    value: function GetMaterialIndex(rhinoDoc, rhinoObject, rhinoInstanceReferences) {
      function GetRhinoMaterial(rhino, rhinoObject, rhinoInstanceReferences) {
        var rhinoAttributes = rhinoObject.attributes();

        if (rhinoAttributes.materialSource === rhino.ObjectMaterialSource.MaterialFromObject) {
          var materialIndex = rhinoAttributes.materialIndex;

          if (materialIndex > -1) {
            return rhinoDoc.materials().get(materialIndex);
          }
        } else if (rhinoAttributes.materialSource === rhino.ObjectMaterialSource.MaterialFromLayer) {
          var layerIndex = rhinoAttributes.layerIndex;

          if (layerIndex > -1) {
            var layer = rhinoDoc.layers().get(layerIndex);
            var layerMaterialIndex = layer.renderMaterialIndex;

            if (layerMaterialIndex > -1) {
              return rhinoDoc.materials().get(layerMaterialIndex);
            }
          }
        } else if (rhinoAttributes.materialSource === rhino.ObjectMaterialSource.MaterialFromParent) {
          if (rhinoInstanceReferences.length !== 0) {
            return GetRhinoMaterial(rhino, rhinoInstanceReferences[0], []);
          }
        }

        return null;
      }

      function ConvertRhinoMaterial(rhinoMaterial, callbacks) {
        function SetColor(color, rhinoColor) {
          color.Set(rhinoColor.r, rhinoColor.g, rhinoColor.b);
        }

        function IsBlack(rhinoColor) {
          return rhinoColor.r === 0 && rhinoColor.g === 0 && rhinoColor.b === 0;
        }

        function IsWhite(rhinoColor) {
          return rhinoColor.r === 255 && rhinoColor.g === 255 && rhinoColor.b === 255;
        }

        var material = null;
        var physicallyBased = rhinoMaterial.physicallyBased();

        if (physicallyBased.supported) {
          material = new PhysicalMaterial();
          material.metalness = physicallyBased.metallic ? 1.0 : 0.0;
          material.roughness = physicallyBased.roughness;
        } else {
          material = new PhongMaterial();
          SetColor(material.ambient, rhinoMaterial.ambientColor);
          SetColor(material.specular, rhinoMaterial.specularColor);
        }

        material.name = rhinoMaterial.name;
        SetColor(material.color, rhinoMaterial.diffuseColor);
        material.opacity = 1.0 - rhinoMaterial.transparency;
        UpdateMaterialTransparency(material);

        if (IsBlack(material.color) && !IsWhite(rhinoMaterial.reflectionColor)) {
          SetColor(material.color, rhinoMaterial.reflectionColor);
        }

        if (IsBlack(material.color) && !IsWhite(rhinoMaterial.transparentColor)) {
          SetColor(material.color, rhinoMaterial.transparentColor);
        }

        var rhinoTexture = rhinoMaterial.getBitmapTexture();

        if (rhinoTexture) {
          var texture = new TextureMap();
          var textureName = GetFileName(rhinoTexture.fileName);
          var textureBuffer = callbacks.getFileBuffer(textureName);
          texture.name = textureName;
          texture.buffer = textureBuffer;
          material.diffuseMap = texture;
        }

        return material;
      }

      function FindMatchingMaterial(model, rhinoMaterial, callbacks) {
        var material = ConvertRhinoMaterial(rhinoMaterial, callbacks);

        for (var i = 0; i < model.MaterialCount(); i++) {
          var current = model.GetMaterial(i);

          if (current.IsEqual(material)) {
            return i;
          }
        }

        return model.AddMaterial(material);
      }

      var rhinoMaterial = GetRhinoMaterial(this.rhino, rhinoObject, rhinoInstanceReferences);

      if (rhinoMaterial === null) {
        return null;
      }

      return FindMatchingMaterial(this.model, rhinoMaterial, this.callbacks);
    }
  }]);

  return Importer3dm;
}(ImporterBase);