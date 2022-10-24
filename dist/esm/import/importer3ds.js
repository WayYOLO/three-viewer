function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { Coord2D } from "../geometry/coord2d.js";
import { ArrayToCoord3D, Coord3D } from "../geometry/coord3d.js";
import { DegRad, Direction, IsNegative } from "../geometry/geometry.js";
import { Matrix } from "../geometry/matrix.js";
import { ArrayToQuaternion } from "../geometry/quaternion.js";
import { Transformation } from "../geometry/transformation.js";
import { BinaryReader } from "../io/binaryreader.js";
import { RGBColor, ColorComponentFromFloat } from "../model/color.js";
import { PhongMaterial, TextureMap } from "../model/material.js";
import { Mesh } from "../model/mesh.js";
import { FlipMeshTrianglesOrientation, TransformMesh } from "../model/meshutils.js";
import { Node, NodeType } from "../model/node.js";
import { Triangle } from "../model/triangle.js";
import { ImporterBase } from "./importerbase.js";
import { UpdateMaterialTransparency } from "./importerutils.js";
var CHUNK3DS = {
  MAIN3DS: 0x4D4D,
  EDIT3DS: 0x3D3D,
  EDIT_MATERIAL: 0xAFFF,
  MAT_NAME: 0xA000,
  MAT_AMBIENT: 0xA010,
  MAT_DIFFUSE: 0xA020,
  MAT_SPECULAR: 0xA030,
  MAT_SHININESS: 0xA040,
  MAT_SHININESS_STRENGTH: 0xA041,
  MAT_TRANSPARENCY: 0xA050,
  MAT_COLOR_F: 0x0010,
  MAT_COLOR: 0x0011,
  MAT_LIN_COLOR: 0x0012,
  MAT_LIN_COLOR_F: 0x0013,
  MAT_TEXMAP: 0xA200,
  MAT_TEXMAP_NAME: 0xA300,
  MAT_TEXMAP_UOFFSET: 0xA358,
  MAT_TEXMAP_VOFFSET: 0xA35A,
  MAT_TEXMAP_USCALE: 0xA354,
  MAT_TEXMAP_VSCALE: 0xA356,
  MAT_TEXMAP_ROTATION: 0xA35C,
  PERCENTAGE: 0x0030,
  PERCENTAGE_F: 0x0031,
  EDIT_OBJECT: 0x4000,
  OBJ_TRIMESH: 0x4100,
  OBJ_LIGHT: 0x4600,
  OBJ_CAMERA: 0x4700,
  TRI_VERTEX: 0x4110,
  TRI_TEXVERTEX: 0x4140,
  TRI_FACE: 0x4120,
  TRI_TRANSFORMATION: 0x4160,
  TRI_MATERIAL: 0x4130,
  TRI_SMOOTH: 0x4150,
  KF3DS: 0xB000,
  OBJECT_NODE: 0xB002,
  OBJECT_HIERARCHY: 0xB010,
  OBJECT_INSTANCE_NAME: 0xB011,
  OBJECT_PIVOT: 0xB013,
  OBJECT_POSITION: 0xB020,
  OBJECT_ROTATION: 0xB021,
  OBJECT_SCALE: 0xB022,
  OBJECT_ID: 0xB030
};

var Importer3dsNode = /*#__PURE__*/_createClass(function Importer3dsNode() {
  _classCallCheck(this, Importer3dsNode);

  this.id = -1;
  this.name = '';
  this.flags = -1;
  this.parentId = -1;
  this.instanceName = '';
  this.pivot = [0.0, 0.0, 0.0];
  this.positions = [];
  this.rotations = [];
  this.scales = [];
});

var Importer3dsNodeList = /*#__PURE__*/function () {
  function Importer3dsNodeList() {
    _classCallCheck(this, Importer3dsNodeList);

    this.nodes = [];
    this.nodeIdToNode = new Map();
  }

  _createClass(Importer3dsNodeList, [{
    key: "IsEmpty",
    value: function IsEmpty() {
      return this.nodes.length === 0;
    }
  }, {
    key: "AddNode",
    value: function AddNode(node) {
      this.nodes.push(node);
      this.nodeIdToNode.set(node.nodeId, node);
    }
  }, {
    key: "GetNodes",
    value: function GetNodes() {
      return this.nodes;
    }
  }]);

  return Importer3dsNodeList;
}();

export var Importer3ds = /*#__PURE__*/function (_ImporterBase) {
  _inherits(Importer3ds, _ImporterBase);

  var _super = _createSuper(Importer3ds);

  function Importer3ds() {
    _classCallCheck(this, Importer3ds);

    return _super.call(this);
  }

  _createClass(Importer3ds, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === '3ds';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Z;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      this.materialNameToIndex = null;
      this.meshNameToIndex = null;
      this.nodeList = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.materialNameToIndex = new Map();
      this.meshNameToIndex = new Map();
      this.nodeList = new Importer3dsNodeList();
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      this.ProcessBinary(fileContent);
      onFinish();
    }
  }, {
    key: "ProcessBinary",
    value: function ProcessBinary(fileContent) {
      var _this = this;

      var reader = new BinaryReader(fileContent, true);
      var endByte = reader.GetByteLength();
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.MAIN3DS) {
          _this.ReadMainChunk(reader, chunkLength);
        } else {
          _this.SkipChunk(reader, chunkLength);
        }
      });
    }
  }, {
    key: "ReadMainChunk",
    value: function ReadMainChunk(reader, length) {
      var _this2 = this;

      var endByte = this.GetChunkEnd(reader, length);
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.EDIT3DS) {
          _this2.ReadEditorChunk(reader, chunkLength);
        } else if (chunkId === CHUNK3DS.KF3DS) {
          _this2.ReadKeyFrameChunk(reader, chunkLength);
        } else {
          _this2.SkipChunk(reader, chunkLength);
        }
      });
      this.BuildNodeHierarchy();
    }
  }, {
    key: "ReadEditorChunk",
    value: function ReadEditorChunk(reader, length) {
      var _this3 = this;

      var endByte = this.GetChunkEnd(reader, length);
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.EDIT_MATERIAL) {
          _this3.ReadMaterialChunk(reader, chunkLength);
        } else if (chunkId === CHUNK3DS.EDIT_OBJECT) {
          _this3.ReadObjectChunk(reader, chunkLength);
        } else {
          _this3.SkipChunk(reader, chunkLength);
        }
      });
    }
  }, {
    key: "ReadMaterialChunk",
    value: function ReadMaterialChunk(reader, length) {
      var _this4 = this;

      var material = new PhongMaterial();
      var endByte = this.GetChunkEnd(reader, length);
      var shininess = null;
      var shininessStrength = null;
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.MAT_NAME) {
          material.name = _this4.ReadName(reader);
        } else if (chunkId === CHUNK3DS.MAT_AMBIENT) {
          material.ambient = _this4.ReadColorChunk(reader, chunkLength);
        } else if (chunkId === CHUNK3DS.MAT_DIFFUSE) {
          material.color = _this4.ReadColorChunk(reader, chunkLength);
        } else if (chunkId === CHUNK3DS.MAT_SPECULAR) {
          material.specular = _this4.ReadColorChunk(reader, chunkLength);
        } else if (chunkId === CHUNK3DS.MAT_SHININESS) {
          shininess = _this4.ReadPercentageChunk(reader, chunkLength);
        } else if (chunkId === CHUNK3DS.MAT_SHININESS_STRENGTH) {
          shininessStrength = _this4.ReadPercentageChunk(reader, chunkLength);
        } else if (chunkId === CHUNK3DS.MAT_TRANSPARENCY) {
          material.opacity = 1.0 - _this4.ReadPercentageChunk(reader, chunkLength);
          UpdateMaterialTransparency(material);
        } else if (chunkId === CHUNK3DS.MAT_TEXMAP) {
          material.diffuseMap = _this4.ReadTextureMapChunk(reader, chunkLength);
          UpdateMaterialTransparency(material);
        } else {
          _this4.SkipChunk(reader, chunkLength);
        }
      });

      if (shininess !== null && shininessStrength !== null) {
        material.shininess = shininess * shininessStrength / 10.0;
      }

      var materialIndex = this.model.AddMaterial(material);
      this.materialNameToIndex.set(material.name, materialIndex);
    }
  }, {
    key: "ReadTextureMapChunk",
    value: function ReadTextureMapChunk(reader, length) {
      var _this5 = this;

      var texture = new TextureMap();
      var endByte = this.GetChunkEnd(reader, length);
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.MAT_TEXMAP_NAME) {
          var textureName = _this5.ReadName(reader);

          var textureBuffer = _this5.callbacks.getFileBuffer(textureName);

          texture.name = textureName;
          texture.buffer = textureBuffer;
        } else if (chunkId === CHUNK3DS.MAT_TEXMAP_UOFFSET) {
          texture.offset.x = reader.ReadFloat32();
        } else if (chunkId === CHUNK3DS.MAT_TEXMAP_VOFFSET) {
          texture.offset.y = reader.ReadFloat32();
        } else if (chunkId === CHUNK3DS.MAT_TEXMAP_USCALE) {
          texture.scale.x = reader.ReadFloat32();
        } else if (chunkId === CHUNK3DS.MAT_TEXMAP_VSCALE) {
          texture.scale.y = reader.ReadFloat32();
        } else if (chunkId === CHUNK3DS.MAT_TEXMAP_ROTATION) {
          texture.rotation = reader.ReadFloat32() * DegRad;
        } else {
          _this5.SkipChunk(reader, chunkLength);
        }
      });
      return texture;
    }
  }, {
    key: "ReadColorChunk",
    value: function ReadColorChunk(reader, length) {
      var _this6 = this;

      var color = new RGBColor(0, 0, 0);
      var endByte = this.GetChunkEnd(reader, length);
      var hasLinColor = false;
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.MAT_COLOR) {
          if (!hasLinColor) {
            color.r = reader.ReadUnsignedCharacter8();
            color.g = reader.ReadUnsignedCharacter8();
            color.b = reader.ReadUnsignedCharacter8();
          }
        } else if (chunkId === CHUNK3DS.MAT_LIN_COLOR) {
          color.r = reader.ReadUnsignedCharacter8();
          color.g = reader.ReadUnsignedCharacter8();
          color.b = reader.ReadUnsignedCharacter8();
          hasLinColor = true;
        } else if (chunkId === CHUNK3DS.MAT_COLOR_F) {
          if (!hasLinColor) {
            color.r = ColorComponentFromFloat(reader.ReadFloat32());
            color.g = ColorComponentFromFloat(reader.ReadFloat32());
            color.b = ColorComponentFromFloat(reader.ReadFloat32());
          }
        } else if (chunkId === CHUNK3DS.MAT_LIN_COLOR_F) {
          color.r = ColorComponentFromFloat(reader.ReadFloat32());
          color.g = ColorComponentFromFloat(reader.ReadFloat32());
          color.b = ColorComponentFromFloat(reader.ReadFloat32());
          hasLinColor = true;
        } else {
          _this6.SkipChunk(reader, chunkLength);
        }
      });
      return color;
    }
  }, {
    key: "ReadPercentageChunk",
    value: function ReadPercentageChunk(reader, length) {
      var _this7 = this;

      var percentage = 0.0;
      var endByte = this.GetChunkEnd(reader, length);
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.PERCENTAGE) {
          percentage = reader.ReadUnsignedInteger16() / 100.0;
        } else if (chunkId === CHUNK3DS.PERCENTAGE_F) {
          percentage = reader.ReadFloat32();
        } else {
          _this7.SkipChunk(reader, chunkLength);
        }
      });
      return percentage;
    }
  }, {
    key: "ReadObjectChunk",
    value: function ReadObjectChunk(reader, length) {
      var _this8 = this;

      var endByte = this.GetChunkEnd(reader, length);
      var objectName = this.ReadName(reader);
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.OBJ_TRIMESH) {
          _this8.ReadMeshChunk(reader, chunkLength, objectName);
        } else {
          _this8.SkipChunk(reader, chunkLength);
        }
      });
    }
  }, {
    key: "ReadMeshChunk",
    value: function ReadMeshChunk(reader, length, objectName) {
      var _this9 = this;

      function ApplyMeshTransformation(mesh, meshMatrix) {
        if (!meshMatrix.IsValid()) {
          return;
        }

        var determinant = meshMatrix.Determinant();
        var mirrorByX = IsNegative(determinant);

        if (mirrorByX) {
          var scaleMatrix = new Matrix().CreateScale(-1.0, 1.0, 1.0);
          meshMatrix = scaleMatrix.MultiplyMatrix(meshMatrix);
        }

        var invMeshMatrix = meshMatrix.Invert();

        if (invMeshMatrix === null) {
          return;
        }

        var transformation = new Transformation(invMeshMatrix);
        TransformMesh(mesh, transformation);

        if (mirrorByX) {
          FlipMeshTrianglesOrientation(mesh);
        }
      }

      var mesh = new Mesh();
      mesh.SetName(objectName);
      var endByte = this.GetChunkEnd(reader, length);
      var matrixElements = null;
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.TRI_VERTEX) {
          _this9.ReadVerticesChunk(mesh, reader);
        } else if (chunkId === CHUNK3DS.TRI_TEXVERTEX) {
          _this9.ReadTextureVerticesChunk(mesh, reader);
        } else if (chunkId === CHUNK3DS.TRI_FACE) {
          _this9.ReadFacesChunk(mesh, reader, chunkLength);
        } else if (chunkId === CHUNK3DS.TRI_TRANSFORMATION) {
          matrixElements = _this9.ReadTransformationChunk(reader);
        } else {
          _this9.SkipChunk(reader, chunkLength);
        }
      });

      if (mesh.VertexCount() === mesh.TextureUVCount()) {
        for (var i = 0; i < mesh.TriangleCount(); i++) {
          var triangle = mesh.GetTriangle(i);
          triangle.SetTextureUVs(triangle.v0, triangle.v1, triangle.v2);
        }
      }

      var meshMatrix = new Matrix(matrixElements);
      ApplyMeshTransformation(mesh, meshMatrix);
      var meshIndex = this.model.AddMesh(mesh);
      this.meshNameToIndex.set(mesh.GetName(), meshIndex);
    }
  }, {
    key: "ReadVerticesChunk",
    value: function ReadVerticesChunk(mesh, reader) {
      var vertexCount = reader.ReadUnsignedInteger16();

      for (var i = 0; i < vertexCount; i++) {
        var x = reader.ReadFloat32();
        var y = reader.ReadFloat32();
        var z = reader.ReadFloat32();
        mesh.AddVertex(new Coord3D(x, y, z));
      }
    }
  }, {
    key: "ReadTextureVerticesChunk",
    value: function ReadTextureVerticesChunk(mesh, reader) {
      var texVertexCount = reader.ReadUnsignedInteger16();

      for (var i = 0; i < texVertexCount; i++) {
        var x = reader.ReadFloat32();
        var y = reader.ReadFloat32();
        mesh.AddTextureUV(new Coord2D(x, y));
      }
    }
  }, {
    key: "ReadFacesChunk",
    value: function ReadFacesChunk(mesh, reader, length) {
      var _this10 = this;

      var endByte = this.GetChunkEnd(reader, length);
      var faceCount = reader.ReadUnsignedInteger16();

      for (var i = 0; i < faceCount; i++) {
        var v0 = reader.ReadUnsignedInteger16();
        var v1 = reader.ReadUnsignedInteger16();
        var v2 = reader.ReadUnsignedInteger16();
        reader.ReadUnsignedInteger16(); // flags

        mesh.AddTriangle(new Triangle(v0, v1, v2));
      }

      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.TRI_MATERIAL) {
          _this10.ReadFaceMaterialsChunk(mesh, reader);
        } else if (chunkId === CHUNK3DS.TRI_SMOOTH) {
          _this10.ReadFaceSmoothingGroupsChunk(mesh, faceCount, reader);
        } else {
          _this10.SkipChunk(reader, chunkLength);
        }
      });
    }
  }, {
    key: "ReadFaceMaterialsChunk",
    value: function ReadFaceMaterialsChunk(mesh, reader) {
      var materialName = this.ReadName(reader);
      var materialIndex = this.materialNameToIndex.get(materialName);
      var faceCount = reader.ReadUnsignedInteger16();

      for (var i = 0; i < faceCount; i++) {
        var faceIndex = reader.ReadUnsignedInteger16();
        var triangle = mesh.GetTriangle(faceIndex);

        if (materialIndex !== undefined) {
          triangle.mat = materialIndex;
        }
      }
    }
  }, {
    key: "ReadFaceSmoothingGroupsChunk",
    value: function ReadFaceSmoothingGroupsChunk(mesh, faceCount, reader) {
      for (var i = 0; i < faceCount; i++) {
        var smoothingGroup = reader.ReadUnsignedInteger32();
        var triangle = mesh.GetTriangle(i);
        triangle.curve = smoothingGroup;
      }
    }
  }, {
    key: "ReadTransformationChunk",
    value: function ReadTransformationChunk(reader) {
      var matrix = [];

      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
          matrix.push(reader.ReadFloat32());
        }

        if (i < 3) {
          matrix.push(0);
        } else {
          matrix.push(1);
        }
      }

      return matrix;
    }
  }, {
    key: "ReadKeyFrameChunk",
    value: function ReadKeyFrameChunk(reader, length) {
      var _this11 = this;

      var endByte = this.GetChunkEnd(reader, length);
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.OBJECT_NODE) {
          _this11.ReadObjectNodeChunk(reader, chunkLength);
        } else {
          _this11.SkipChunk(reader, chunkLength);
        }
      });
    }
  }, {
    key: "BuildNodeHierarchy",
    value: function BuildNodeHierarchy() {
      function GetNodeTransformation(node3ds, isMeshNode) {
        function GetNodePosition(node3ds) {
          if (node3ds.positions.length === 0) {
            return [0.0, 0.0, 0.0];
          }

          return node3ds.positions[0];
        }

        function GetNodeRotation(node3ds) {
          function GetQuaternionFromAxisAndAngle(axisAngle) {
            var result = [0.0, 0.0, 0.0, 1.0];
            var length = Math.sqrt(axisAngle[0] * axisAngle[0] + axisAngle[1] * axisAngle[1] + axisAngle[2] * axisAngle[2]);

            if (length > 0.0) {
              var omega = axisAngle[3] * -0.5;
              var si = Math.sin(omega) / length;
              result = [si * axisAngle[0], si * axisAngle[1], si * axisAngle[2], Math.cos(omega)];
            }

            return result;
          }

          if (node3ds.rotations.length === 0) {
            return [0.0, 0.0, 0.0, 1.0];
          }

          var rotation = node3ds.rotations[0];
          return GetQuaternionFromAxisAndAngle(rotation);
        }

        function GetNodeScale(node3ds) {
          if (node3ds.scales.length === 0) {
            return [1.0, 1.0, 1.0];
          }

          return node3ds.scales[0];
        }

        var matrix = new Matrix();
        matrix.ComposeTRS(ArrayToCoord3D(GetNodePosition(node3ds)), ArrayToQuaternion(GetNodeRotation(node3ds)), ArrayToCoord3D(GetNodeScale(node3ds)));

        if (isMeshNode) {
          var pivotPoint = node3ds.pivot;
          var pivotMatrix = new Matrix().CreateTranslation(-pivotPoint[0], -pivotPoint[1], -pivotPoint[2]);
          matrix = pivotMatrix.MultiplyMatrix(matrix);
        }

        return new Transformation(matrix);
      }

      var rootNode = this.model.GetRootNode();

      if (this.nodeList.IsEmpty()) {
        for (var meshIndex = 0; meshIndex < this.model.MeshCount(); meshIndex++) {
          rootNode.AddMeshIndex(meshIndex);
        }
      } else {
        var nodeIdToModelNode = new Map();

        var _iterator = _createForOfIteratorHelper(this.nodeList.GetNodes()),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var node3ds = _step.value;
            var node = new Node();

            if (node3ds.name.length > 0 && node3ds.name !== '$$$DUMMY') {
              node.SetName(node3ds.name);

              if (node3ds.instanceName.length > 0) {
                node.SetName(node.GetName() + ' ' + node3ds.instanceName);
              }
            }

            if (node3ds.parentId === 65535 || !nodeIdToModelNode.has(node3ds.parentId)) {
              rootNode.AddChildNode(node);
            } else {
              var parentNode = nodeIdToModelNode.get(node3ds.parentId);
              parentNode.AddChildNode(node);
            }

            nodeIdToModelNode.set(node3ds.id, node);
            var isMeshNode = this.meshNameToIndex.has(node3ds.name);
            node.SetTransformation(GetNodeTransformation(node3ds, isMeshNode));

            if (isMeshNode) {
              node.SetType(NodeType.MeshNode);
              node.AddMeshIndex(this.meshNameToIndex.get(node3ds.name));
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "ReadObjectNodeChunk",
    value: function ReadObjectNodeChunk(reader, length) {
      var _this12 = this;

      function ReadTrackVector(obj, reader, type) {
        var result = [];
        reader.Skip(10);
        var keyNum = reader.ReadInteger32();

        for (var i = 0; i < keyNum; i++) {
          reader.ReadInteger32();
          var flags = reader.ReadUnsignedInteger16();

          if (flags !== 0) {
            reader.ReadFloat32();
          }

          var current = null;

          if (type === CHUNK3DS.OBJECT_ROTATION) {
            var tmp = reader.ReadFloat32();
            current = obj.ReadVector(reader);
            current[3] = tmp;
          } else {
            current = obj.ReadVector(reader);
          }

          result.push(current);
        }

        return result;
      }

      var node3ds = new Importer3dsNode();
      var endByte = this.GetChunkEnd(reader, length);
      this.ReadChunks(reader, endByte, function (chunkId, chunkLength) {
        if (chunkId === CHUNK3DS.OBJECT_HIERARCHY) {
          node3ds.name = _this12.ReadName(reader);
          node3ds.flags = reader.ReadUnsignedInteger32();
          node3ds.parentId = reader.ReadUnsignedInteger16();
        } else if (chunkId === CHUNK3DS.OBJECT_INSTANCE_NAME) {
          node3ds.instanceName = _this12.ReadName(reader);
        } else if (chunkId === CHUNK3DS.OBJECT_PIVOT) {
          node3ds.pivot = _this12.ReadVector(reader);
        } else if (chunkId === CHUNK3DS.OBJECT_POSITION) {
          node3ds.positions = ReadTrackVector(_this12, reader, CHUNK3DS.OBJECT_POSITION);
        } else if (chunkId === CHUNK3DS.OBJECT_ROTATION) {
          node3ds.rotations = ReadTrackVector(_this12, reader, CHUNK3DS.OBJECT_ROTATION);
        } else if (chunkId === CHUNK3DS.OBJECT_SCALE) {
          node3ds.scales = ReadTrackVector(_this12, reader, CHUNK3DS.OBJECT_SCALE);
        } else if (chunkId === CHUNK3DS.OBJECT_ID) {
          node3ds.id = reader.ReadUnsignedInteger16();
        } else {
          _this12.SkipChunk(reader, chunkLength);
        }
      });
      this.nodeList.AddNode(node3ds);
    }
  }, {
    key: "ReadName",
    value: function ReadName(reader) {
      var name = '';
      var char = 0;
      var count = 0;

      while (count < 64) {
        char = reader.ReadCharacter8();

        if (char === 0) {
          break;
        }

        name = name + String.fromCharCode(char);
        count = count + 1;
      }

      return name;
    }
  }, {
    key: "ReadVector",
    value: function ReadVector(reader) {
      var result = [reader.ReadFloat32(), reader.ReadFloat32(), reader.ReadFloat32()];
      return result;
    }
  }, {
    key: "ReadChunks",
    value: function ReadChunks(reader, endByte, onChunk) {
      while (reader.GetPosition() <= endByte - 6) {
        var chunkId = reader.ReadUnsignedInteger16();
        var chunkLength = reader.ReadUnsignedInteger32();
        onChunk(chunkId, chunkLength);
      }
    }
  }, {
    key: "GetChunkEnd",
    value: function GetChunkEnd(reader, length) {
      return reader.GetPosition() + length - 6;
    }
  }, {
    key: "SkipChunk",
    value: function SkipChunk(reader, length) {
      reader.Skip(length - 6);
    }
  }]);

  return Importer3ds;
}(ImporterBase);