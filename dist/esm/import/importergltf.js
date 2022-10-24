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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Coord2D } from "../geometry/coord2d.js";
import { ArrayToCoord3D, Coord3D } from "../geometry/coord3d.js";
import { Coord4D } from "../geometry/coord4d.js";
import { Direction } from "../geometry/geometry.js";
import { Matrix } from "../geometry/matrix.js";
import { ArrayToQuaternion } from "../geometry/quaternion.js";
import { Transformation } from "../geometry/transformation.js";
import { BinaryReader } from "../io/binaryreader.js";
import { ArrayBufferToUtf8String, Base64DataURIToArrayBuffer, GetFileExtensionFromMimeType } from "../io/bufferutils.js";
import { LoadExternalLibrary } from "../io/externallibs.js";
import { RGBColor, ColorComponentFromFloat, RGBColorFromFloatComponents, LinearToSRGB } from "../model/color.js";
import { PhongMaterial, PhysicalMaterial, TextureMap } from "../model/material.js";
import { Mesh } from "../model/mesh.js";
import { Node, NodeType } from "../model/node.js";
import { Property, PropertyGroup, PropertyType } from "../model/property.js";
import { Triangle } from "../model/triangle.js";
import { ImporterBase } from "./importerbase.js";
var GltfComponentType = {
  BYTE: 5120,
  UNSIGNED_BYTE: 5121,
  SHORT: 5122,
  UNSIGNED_SHORT: 5123,
  UNSIGNED_INT: 5125,
  FLOAT: 5126
};
var GltfDataType = {
  SCALAR: 0,
  VEC2: 1,
  VEC3: 2,
  VEC4: 3,
  MAT2: 4,
  MAT3: 5,
  MAT4: 6
};
var GltfRenderMode = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
};
var GltfConstants = {
  GLTF_STRING: 0x46546C67,
  JSON_CHUNK_TYPE: 0x4E4F534A,
  BINARY_CHUNK_TYPE: 0x004E4942
};

function GetGltfColor(color) {
  return RGBColorFromFloatComponents(LinearToSRGB(color[0]), LinearToSRGB(color[1]), LinearToSRGB(color[2]));
}

function GetGltfVertexColor(color, componentType) {
  function GetColorComponent(component, componentType) {
    var normalized = component;

    if (componentType === GltfComponentType.UNSIGNED_BYTE) {
      normalized /= 255.0;
    } else if (componentType === GltfComponentType.UNSIGNED_SHORT) {
      normalized /= 65535.0;
    }

    return ColorComponentFromFloat(LinearToSRGB(normalized));
  }

  return new RGBColor(GetColorComponent(color[0], componentType), GetColorComponent(color[1], componentType), GetColorComponent(color[2], componentType));
}

var GltfBufferReader = /*#__PURE__*/function () {
  function GltfBufferReader(buffer) {
    _classCallCheck(this, GltfBufferReader);

    this.reader = new BinaryReader(buffer, true);
    this.componentType = null;
    this.dataType = null;
    this.byteStride = null;
    this.dataCount = null;
    this.sparseReader = null;
  }

  _createClass(GltfBufferReader, [{
    key: "SetComponentType",
    value: function SetComponentType(componentType) {
      this.componentType = componentType;
    }
  }, {
    key: "SetDataType",
    value: function SetDataType(dataType) {
      if (dataType === 'SCALAR') {
        this.dataType = GltfDataType.SCALAR;
      } else if (dataType === 'VEC2') {
        this.dataType = GltfDataType.VEC2;
      } else if (dataType === 'VEC3') {
        this.dataType = GltfDataType.VEC3;
      } else if (dataType === 'VEC4') {
        this.dataType = GltfDataType.VEC4;
      } else if (dataType === 'MAT2') {
        this.dataType = GltfDataType.MAT2;
      } else if (dataType === 'MAT3') {
        this.dataType = GltfDataType.MAT3;
      } else if (dataType === 'MAT4') {
        this.dataType = GltfDataType.MAT4;
      }
    }
  }, {
    key: "SetByteStride",
    value: function SetByteStride(byteStride) {
      this.byteStride = byteStride;
    }
  }, {
    key: "SetDataCount",
    value: function SetDataCount(dataCount) {
      this.dataCount = dataCount;
    }
  }, {
    key: "SetSparseReader",
    value: function SetSparseReader(indexReader, valueReader) {
      this.sparseReader = {
        indexReader: indexReader,
        valueReader: valueReader
      };
    }
  }, {
    key: "ReadArrayBuffer",
    value: function ReadArrayBuffer(byteLength) {
      return this.reader.ReadArrayBuffer(byteLength);
    }
  }, {
    key: "GetDataCount",
    value: function GetDataCount() {
      return this.dataCount;
    }
  }, {
    key: "ReadData",
    value: function ReadData() {
      if (this.dataType === null) {
        return null;
      }

      if (this.dataType === GltfDataType.SCALAR) {
        var data = this.ReadComponent();
        this.SkipBytesByStride(1);
        return data;
      } else if (this.dataType === GltfDataType.VEC2) {
        var x = this.ReadComponent();
        var y = this.ReadComponent();
        this.SkipBytesByStride(2);
        return new Coord2D(x, y);
      } else if (this.dataType === GltfDataType.VEC3) {
        var _x = this.ReadComponent();

        var _y = this.ReadComponent();

        var z = this.ReadComponent();
        this.SkipBytesByStride(3);
        return new Coord3D(_x, _y, z);
      } else if (this.dataType === GltfDataType.VEC4) {
        var _x2 = this.ReadComponent();

        var _y2 = this.ReadComponent();

        var _z = this.ReadComponent();

        var w = this.ReadComponent();
        this.SkipBytesByStride(4);
        return new Coord4D(_x2, _y2, _z, w);
      }

      return null;
    }
  }, {
    key: "EnumerateData",
    value: function EnumerateData(onData) {
      if (this.sparseReader === null) {
        for (var i = 0; i < this.dataCount; i++) {
          onData(this.ReadData());
        }
      } else {
        var sparseData = [];

        for (var _i = 0; _i < this.sparseReader.indexReader.GetDataCount(); _i++) {
          var index = this.sparseReader.indexReader.ReadData();
          var value = this.sparseReader.valueReader.ReadData();
          sparseData.push({
            index: index,
            value: value
          });
        }

        var sparseIndex = 0;

        for (var _i2 = 0; _i2 < this.dataCount; _i2++) {
          var data = this.ReadData();

          if (sparseIndex < sparseData.length && sparseData[sparseIndex].index === _i2) {
            onData(sparseData[sparseIndex].value);
            sparseIndex += 1;
          } else {
            onData(data);
          }
        }
      }
    }
  }, {
    key: "SkipBytes",
    value: function SkipBytes(bytes) {
      this.reader.Skip(bytes);
    }
  }, {
    key: "ReadComponent",
    value: function ReadComponent() {
      if (this.componentType === null) {
        return null;
      }

      if (this.componentType === GltfComponentType.BYTE) {
        return this.reader.ReadCharacter8();
      } else if (this.componentType === GltfComponentType.UNSIGNED_BYTE) {
        return this.reader.ReadUnsignedCharacter8();
      } else if (this.componentType === GltfComponentType.SHORT) {
        return this.reader.ReadInteger16();
      } else if (this.componentType === GltfComponentType.UNSIGNED_SHORT) {
        return this.reader.ReadUnsignedInteger16();
      } else if (this.componentType === GltfComponentType.UNSIGNED_INT) {
        return this.reader.ReadInteger32();
      } else if (this.componentType === GltfComponentType.FLOAT) {
        return this.reader.ReadFloat32();
      }

      return null;
    }
  }, {
    key: "SkipBytesByStride",
    value: function SkipBytesByStride(componentCount) {
      if (this.byteStride === null) {
        return;
      }

      var readBytes = componentCount * this.GetComponentSize();
      this.reader.Skip(this.byteStride - readBytes);
    }
  }, {
    key: "GetComponentSize",
    value: function GetComponentSize() {
      if (this.componentType === GltfComponentType.BYTE) {
        return 1;
      } else if (this.componentType === GltfComponentType.UNSIGNED_BYTE) {
        return 1;
      } else if (this.componentType === GltfComponentType.SHORT) {
        return 2;
      } else if (this.componentType === GltfComponentType.UNSIGNED_SHORT) {
        return 2;
      } else if (this.componentType === GltfComponentType.UNSIGNED_INT) {
        return 4;
      } else if (this.componentType === GltfComponentType.FLOAT) {
        return 4;
      }

      return 0;
    }
  }]);

  return GltfBufferReader;
}();

var GltfExtensions = /*#__PURE__*/function () {
  function GltfExtensions() {
    _classCallCheck(this, GltfExtensions);

    this.supportedExtensions = ['KHR_draco_mesh_compression', 'KHR_materials_pbrSpecularGlossiness', 'KHR_texture_transform'];
    this.draco = null;
  }

  _createClass(GltfExtensions, [{
    key: "LoadLibraries",
    value: function LoadLibraries(extensionsRequired, callbacks) {
      var _this = this;

      if (extensionsRequired === undefined) {
        callbacks.onSuccess();
        return;
      }

      if (this.draco === null && extensionsRequired.indexOf('KHR_draco_mesh_compression') !== -1) {
        LoadExternalLibrary('loaders/draco_decoder.js').then(function () {
          DracoDecoderModule().then(function (draco) {
            _this.draco = draco;
            callbacks.onSuccess();
          });
        }).catch(function () {
          callbacks.onError('Failed to load draco decoder.');
        });
      } else {
        callbacks.onSuccess();
      }
    }
  }, {
    key: "GetUnsupportedExtensions",
    value: function GetUnsupportedExtensions(extensionsRequired) {
      var unsupportedExtensions = [];

      if (extensionsRequired === undefined) {
        return unsupportedExtensions;
      }

      for (var i = 0; i < extensionsRequired.length; i++) {
        var requiredExtension = extensionsRequired[i];

        if (this.supportedExtensions.indexOf(requiredExtension) === -1) {
          unsupportedExtensions.push(requiredExtension);
        }
      }

      return unsupportedExtensions;
    }
  }, {
    key: "ProcessMaterial",
    value: function ProcessMaterial(gltfMaterial, material, imporTextureFn) {
      if (gltfMaterial.extensions === undefined) {
        return null;
      }

      var khrSpecularGlossiness = gltfMaterial.extensions.KHR_materials_pbrSpecularGlossiness;

      if (khrSpecularGlossiness === undefined) {
        return null;
      }

      var phongMaterial = new PhongMaterial();
      var diffuseColor = khrSpecularGlossiness.diffuseFactor;

      if (diffuseColor !== undefined) {
        phongMaterial.color = GetGltfColor(diffuseColor);
        phongMaterial.opacity = diffuseColor[3];
      }

      var diffuseTexture = khrSpecularGlossiness.diffuseTexture;

      if (diffuseTexture !== undefined) {
        phongMaterial.diffuseMap = imporTextureFn(diffuseTexture);
      }

      var specularColor = khrSpecularGlossiness.specularFactor;

      if (specularColor !== undefined) {
        phongMaterial.specular = GetGltfColor(specularColor);
      }

      var specularTexture = khrSpecularGlossiness.specularGlossinessTexture;

      if (specularTexture !== undefined) {
        phongMaterial.specularMap = imporTextureFn(specularTexture);
      }

      var glossiness = khrSpecularGlossiness.glossinessFactor;

      if (glossiness !== undefined) {
        phongMaterial.shininess = glossiness;
      }

      return phongMaterial;
    }
  }, {
    key: "ProcessTexture",
    value: function ProcessTexture(gltfTexture, texture) {
      if (gltfTexture.extensions === undefined) {
        return;
      }

      var khrTextureTransform = gltfTexture.extensions.KHR_texture_transform;

      if (khrTextureTransform !== undefined) {
        if (khrTextureTransform.offset !== undefined) {
          texture.offset.x = khrTextureTransform.offset[0];
          texture.offset.y = -khrTextureTransform.offset[1];
        }

        if (khrTextureTransform.scale !== undefined) {
          texture.scale.x = khrTextureTransform.scale[0];
          texture.scale.y = khrTextureTransform.scale[1];
        }

        if (khrTextureTransform.rotation !== undefined) {
          texture.rotation = -khrTextureTransform.rotation;
        }
      }
    }
  }, {
    key: "ProcessPrimitive",
    value: function ProcessPrimitive(importer, gltf, primitive, mesh) {
      function EnumerateComponents(draco, decoder, dracoMesh, attributeId, processor) {
        var attribute = decoder.GetAttributeByUniqueId(dracoMesh, attributeId);
        var numComponents = attribute.num_components();
        var numPoints = dracoMesh.num_points();
        var numValues = numPoints * numComponents;
        var dataSize = numValues * 4;

        var attributePtr = draco._malloc(dataSize);

        decoder.GetAttributeDataArrayForAllPoints(dracoMesh, attribute, draco.DT_FLOAT32, dataSize, attributePtr);
        var attributeArray = new Float32Array(draco.HEAPF32.buffer, attributePtr, numValues).slice();

        if (numComponents === 2) {
          for (var i = 0; i < attributeArray.length; i += 2) {
            processor(new Coord2D(attributeArray[i + 0], attributeArray[i + 1]));
          }
        } else if (numComponents === 3) {
          for (var _i3 = 0; _i3 < attributeArray.length; _i3 += 3) {
            processor(new Coord3D(attributeArray[_i3 + 0], attributeArray[_i3 + 1], attributeArray[_i3 + 2]));
          }
        } else if (numComponents === 4) {
          for (var _i4 = 0; _i4 < attributeArray.length; _i4 += 4) {
            processor(new Coord4D(attributeArray[_i4 + 0], attributeArray[_i4 + 1], attributeArray[_i4 + 2], attributeArray[_i4 + 3]));
          }
        }

        draco._free(attributePtr);
      }

      if (this.draco === null) {
        return false;
      }

      if (primitive.extensions === undefined || primitive.extensions.KHR_draco_mesh_compression === undefined) {
        return false;
      }

      var decoder = new this.draco.Decoder();
      var decoderBuffer = new this.draco.DecoderBuffer();
      var extensionParams = primitive.extensions.KHR_draco_mesh_compression;
      var compressedBufferView = gltf.bufferViews[extensionParams.bufferView];
      var compressedReader = importer.GetReaderFromBufferView(compressedBufferView);
      var compressedArrayBuffer = compressedReader.ReadArrayBuffer(compressedBufferView.byteLength);
      decoderBuffer.Init(new Int8Array(compressedArrayBuffer), compressedArrayBuffer.byteLength);
      var geometryType = decoder.GetEncodedGeometryType(decoderBuffer);

      if (geometryType !== this.draco.TRIANGULAR_MESH) {
        return true;
      }

      var dracoMesh = new this.draco.Mesh();
      var decodingStatus = decoder.DecodeBufferToMesh(decoderBuffer, dracoMesh);

      if (!decodingStatus.ok()) {
        return true;
      }

      var hasVertices = extensionParams.attributes.POSITION !== undefined;
      var hasVertexColors = false;
      var hasNormals = extensionParams.attributes.NORMAL !== undefined;
      var hasUVs = extensionParams.attributes.TEXCOORD_0 !== undefined;

      if (!hasVertices) {
        return true;
      }

      var vertexOffset = mesh.VertexCount();
      var vertexColorOffset = mesh.VertexColorCount();
      var normalOffset = mesh.NormalCount();
      var uvOffset = mesh.TextureUVCount();
      EnumerateComponents(this.draco, decoder, dracoMesh, extensionParams.attributes.POSITION, function (vertex) {
        mesh.AddVertex(vertex);
      });

      if (hasNormals) {
        EnumerateComponents(this.draco, decoder, dracoMesh, extensionParams.attributes.NORMAL, function (normal) {
          mesh.AddNormal(normal);
        });
      }

      if (hasUVs) {
        EnumerateComponents(this.draco, decoder, dracoMesh, extensionParams.attributes.TEXCOORD_0, function (uv) {
          uv.y = -uv.y;
          mesh.AddTextureUV(uv);
        });
      }

      var faceCount = dracoMesh.num_faces();
      var indexCount = faceCount * 3;
      var indexDataSize = indexCount * 4;

      var indexDataPtr = this.draco._malloc(indexDataSize);

      decoder.GetTrianglesUInt32Array(dracoMesh, indexDataSize, indexDataPtr);
      var indexArray = new Uint32Array(this.draco.HEAPU32.buffer, indexDataPtr, indexCount).slice();

      for (var i = 0; i < indexArray.length; i += 3) {
        var v0 = indexArray[i];
        var v1 = indexArray[i + 1];
        var v2 = indexArray[i + 2];
        importer.AddTriangle(primitive, mesh, v0, v1, v2, hasVertexColors, hasNormals, hasUVs, vertexOffset, vertexColorOffset, normalOffset, uvOffset);
      }

      this.draco._free(indexDataPtr);

      return true;
    }
  }]);

  return GltfExtensions;
}();

export var ImporterGltf = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterGltf, _ImporterBase);

  var _super = _createSuper(ImporterGltf);

  function ImporterGltf() {
    var _this2;

    _classCallCheck(this, ImporterGltf);

    _this2 = _super.call(this);
    _this2.gltfExtensions = new GltfExtensions();
    return _this2;
  }

  _createClass(ImporterGltf, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'gltf' || extension === 'glb';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Y;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      this.bufferContents = null;
      this.imageIndexToTextureParams = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.bufferContents = [];
      this.imageIndexToTextureParams = new Map();
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      if (this.extension === 'gltf') {
        this.ProcessGltf(fileContent, onFinish);
      } else if (this.extension === 'glb') {
        this.ProcessBinaryGltf(fileContent, onFinish);
      }
    }
  }, {
    key: "ProcessGltf",
    value: function ProcessGltf(fileContent, onFinish) {
      var textContent = ArrayBufferToUtf8String(fileContent);
      var gltf = JSON.parse(textContent);

      if (gltf.asset.version !== '2.0') {
        this.SetError('Invalid glTF version.');
        onFinish();
        return;
      }

      for (var i = 0; i < gltf.buffers.length; i++) {
        var buffer = null;
        var gltfBuffer = gltf.buffers[i];
        var base64Buffer = Base64DataURIToArrayBuffer(gltfBuffer.uri);

        if (base64Buffer !== null) {
          buffer = base64Buffer.buffer;
        } else {
          var fileBuffer = this.callbacks.getFileBuffer(gltfBuffer.uri);

          if (fileBuffer !== null) {
            buffer = fileBuffer;
          }
        }

        if (buffer === null) {
          this.SetError('One of the requested buffers is missing.');
          onFinish();
          return;
        }

        this.bufferContents.push(buffer);
      }

      this.ProcessMainFile(gltf, onFinish);
    }
  }, {
    key: "ProcessBinaryGltf",
    value: function ProcessBinaryGltf(fileContent, onFinish) {
      function ReadChunk(reader) {
        var length = reader.ReadUnsignedInteger32();
        var type = reader.ReadUnsignedInteger32();
        var buffer = reader.ReadArrayBuffer(length);
        return {
          type: type,
          buffer: buffer
        };
      }

      var reader = new BinaryReader(fileContent, true);
      var magic = reader.ReadUnsignedInteger32();

      if (magic !== GltfConstants.GLTF_STRING) {
        this.SetError('Invalid glTF file.');
        onFinish();
        return;
      }

      var version = reader.ReadUnsignedInteger32();

      if (version !== 2) {
        this.SetError('Invalid glTF version.');
        onFinish();
        return;
      }

      var length = reader.ReadUnsignedInteger32();

      if (length !== reader.GetByteLength()) {
        this.SetError('Invalid glTF file.');
        onFinish();
        return;
      }

      var gltfTextContent = null;

      while (!reader.End()) {
        var chunk = ReadChunk(reader);

        if (chunk.type === GltfConstants.JSON_CHUNK_TYPE) {
          gltfTextContent = ArrayBufferToUtf8String(chunk.buffer);
        } else if (chunk.type === GltfConstants.BINARY_CHUNK_TYPE) {
          this.bufferContents.push(chunk.buffer);
        }
      }

      if (gltfTextContent !== null) {
        var gltf = JSON.parse(gltfTextContent);
        this.ProcessMainFile(gltf, onFinish);
      }
    }
  }, {
    key: "ProcessMainFile",
    value: function ProcessMainFile(gltf, onFinish) {
      var _this3 = this;

      var unsupportedExtensions = this.gltfExtensions.GetUnsupportedExtensions(gltf.extensionsRequired);

      if (unsupportedExtensions.length > 0) {
        this.SetError('Unsupported extension: ' + unsupportedExtensions.join(', ') + '.');
        onFinish();
        return;
      }

      this.gltfExtensions.LoadLibraries(gltf.extensionsRequired, {
        onSuccess: function onSuccess() {
          _this3.ImportModel(gltf);

          onFinish();
        },
        onError: function onError(message) {
          _this3.SetError(message);

          onFinish();
        }
      });
    }
  }, {
    key: "ImportModel",
    value: function ImportModel(gltf) {
      var materials = gltf.materials;

      if (materials !== undefined) {
        var _iterator = _createForOfIteratorHelper(materials),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var material = _step.value;
            this.ImportMaterial(gltf, material);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      var meshes = gltf.meshes;

      if (meshes !== undefined) {
        var _iterator2 = _createForOfIteratorHelper(meshes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var mesh = _step2.value;
            this.ImportMesh(gltf, mesh);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      this.ImportNodes(gltf);
      this.ImportModelProperties(gltf);
    }
  }, {
    key: "ImportModelProperties",
    value: function ImportModelProperties(gltf) {
      function ImportProperties(model, propertyGroupName, propertyObject) {
        var propertyGroup = new PropertyGroup(propertyGroupName);

        for (var propertyName in propertyObject) {
          if (Object.prototype.hasOwnProperty.call(propertyObject, propertyName)) {
            if (typeof propertyObject[propertyName] === 'string') {
              var property = new Property(PropertyType.Text, propertyName, propertyObject[propertyName]);
              propertyGroup.AddProperty(property);
            }
          }
        }

        if (propertyGroup.PropertyCount() > 0) {
          model.AddPropertyGroup(propertyGroup);
        }

        return propertyGroup;
      }

      ImportProperties(this.model, 'Asset properties', gltf.asset);

      if (gltf.asset['extras']) {
        ImportProperties(this.model, 'Extras', gltf.asset['extras']);
      }
    }
  }, {
    key: "GetDefaultScene",
    value: function GetDefaultScene(gltf) {
      var defaultSceneIndex = gltf.scene || 0;

      if (defaultSceneIndex >= gltf.scenes.length) {
        return null;
      }

      return gltf.scenes[defaultSceneIndex];
    }
  }, {
    key: "ImportMaterial",
    value: function ImportMaterial(gltf, gltfMaterial) {
      var _this4 = this;

      var material = new PhysicalMaterial();

      if (gltfMaterial.name !== undefined) {
        material.name = gltfMaterial.name;
      }

      material.color = GetGltfColor([1.0, 1.0, 1.0]);

      if (gltfMaterial.pbrMetallicRoughness !== undefined) {
        var baseColor = gltfMaterial.pbrMetallicRoughness.baseColorFactor;

        if (baseColor !== undefined) {
          material.color = GetGltfColor(baseColor);
          material.opacity = baseColor[3];
        }

        var metallicFactor = gltfMaterial.pbrMetallicRoughness.metallicFactor;

        if (metallicFactor !== undefined) {
          material.metalness = metallicFactor;
        }

        var roughnessFactor = gltfMaterial.pbrMetallicRoughness.roughnessFactor;

        if (roughnessFactor !== undefined) {
          material.roughness = roughnessFactor;
        }

        var emissiveColor = gltfMaterial.emissiveFactor;

        if (emissiveColor !== undefined) {
          material.emissive = GetGltfColor(emissiveColor);
        }

        material.diffuseMap = this.ImportTexture(gltf, gltfMaterial.pbrMetallicRoughness.baseColorTexture);
        material.metalnessMap = this.ImportTexture(gltf, gltfMaterial.pbrMetallicRoughness.metallicRoughnessTexture);
        material.normalMap = this.ImportTexture(gltf, gltfMaterial.normalTexture);
        material.emissiveMap = this.ImportTexture(gltf, gltfMaterial.emissiveTexture);

        if (material.diffuseMap !== null) {
          material.multiplyDiffuseMap = true;
        }

        var alphaMode = gltfMaterial.alphaMode;

        if (alphaMode !== undefined) {
          if (alphaMode === 'BLEND') {
            material.transparent = true;
          } else if (alphaMode === 'MASK') {
            material.transparent = true;
            material.alphaTest = gltfMaterial.alphaCutoff || 0.5;
          }
        }
      }

      var newMaterial = this.gltfExtensions.ProcessMaterial(gltfMaterial, material, function (textureRef) {
        return _this4.ImportTexture(gltf, textureRef);
      });

      if (newMaterial !== null) {
        material = newMaterial;
      }

      this.model.AddMaterial(material);
    }
  }, {
    key: "ImportTexture",
    value: function ImportTexture(gltf, gltfTextureRef) {
      if (gltfTextureRef === undefined || gltfTextureRef === null) {
        return null;
      }

      var texture = new TextureMap();
      var gltfTexture = gltf.textures[gltfTextureRef.index];
      var gltfImageIndex = gltfTexture.source;
      var gltfImage = gltf.images[gltfImageIndex];
      var textureParams = null;

      if (this.imageIndexToTextureParams.has(gltfImageIndex)) {
        textureParams = this.imageIndexToTextureParams.get(gltfImageIndex);
      } else {
        textureParams = {
          name: null,
          mimeType: null,
          buffer: null
        };
        var textureIndexString = gltfImageIndex.toString();

        if (gltfImage.uri !== undefined) {
          var base64Buffer = Base64DataURIToArrayBuffer(gltfImage.uri);

          if (base64Buffer !== null) {
            textureParams.name = 'Embedded_' + textureIndexString + '.' + GetFileExtensionFromMimeType(base64Buffer.mimeType);
            textureParams.mimeType = base64Buffer.mimeType;
            textureParams.buffer = base64Buffer.buffer;
          } else {
            var textureBuffer = this.callbacks.getFileBuffer(gltfImage.uri);
            textureParams.name = gltfImage.uri;
            textureParams.buffer = textureBuffer;
          }
        } else if (gltfImage.bufferView !== undefined) {
          var bufferView = gltf.bufferViews[gltfImage.bufferView];
          var reader = this.GetReaderFromBufferView(bufferView);

          if (reader !== null) {
            var buffer = reader.ReadArrayBuffer(bufferView.byteLength);
            textureParams.name = 'Binary_' + textureIndexString + '.' + GetFileExtensionFromMimeType(gltfImage.mimeType);
            textureParams.mimeType = gltfImage.mimeType;
            textureParams.buffer = buffer;
          }
        }

        this.imageIndexToTextureParams.set(gltfImageIndex, textureParams);
      }

      texture.name = textureParams.name;
      texture.mimeType = textureParams.mimeType;
      texture.buffer = textureParams.buffer;
      this.gltfExtensions.ProcessTexture(gltfTextureRef, texture);
      return texture;
    }
  }, {
    key: "ImportMesh",
    value: function ImportMesh(gltf, gltfMesh) {
      var mesh = new Mesh();
      this.model.AddMesh(mesh);

      if (gltfMesh.name !== undefined) {
        mesh.SetName(gltfMesh.name);
      }

      for (var i = 0; i < gltfMesh.primitives.length; i++) {
        var primitive = gltfMesh.primitives[i];
        this.ImportPrimitive(gltf, primitive, mesh);
      }
    }
  }, {
    key: "ImportPrimitive",
    value: function ImportPrimitive(gltf, primitive, mesh) {
      function HasAttribute(gltf, primitive, attributeName) {
        var accessorIndex = primitive.attributes[attributeName];

        if (accessorIndex === undefined) {
          return false;
        }

        var accessor = gltf.accessors[accessorIndex];

        if (accessor === undefined || accessor.count === 0) {
          return false;
        }

        return true;
      }

      if (this.gltfExtensions.ProcessPrimitive(this, gltf, primitive, mesh)) {
        return;
      }

      if (primitive.attributes === undefined) {
        return;
      }

      var hasVertices = HasAttribute(gltf, primitive, 'POSITION');
      var hasVertexColors = HasAttribute(gltf, primitive, 'COLOR_0');
      var hasNormals = HasAttribute(gltf, primitive, 'NORMAL');
      var hasUVs = HasAttribute(gltf, primitive, 'TEXCOORD_0');
      var hasIndices = primitive.indices !== undefined;
      var mode = GltfRenderMode.TRIANGLES;

      if (primitive.mode !== undefined) {
        mode = primitive.mode;
      }

      if (mode !== GltfRenderMode.TRIANGLES && mode !== GltfRenderMode.TRIANGLE_STRIP && mode !== GltfRenderMode.TRIANGLE_FAN) {
        return;
      }

      var vertexOffset = mesh.VertexCount();
      var vertexColorOffset = mesh.VertexColorCount();
      var normalOffset = mesh.NormalCount();
      var uvOffset = mesh.TextureUVCount();

      if (hasVertices) {
        var accessor = gltf.accessors[primitive.attributes.POSITION];
        var reader = this.GetReaderFromAccessor(gltf, accessor);

        if (reader === null) {
          return;
        }

        reader.EnumerateData(function (data) {
          mesh.AddVertex(data);
        });
      } else {
        return;
      }

      if (hasVertexColors) {
        var _accessor = gltf.accessors[primitive.attributes.COLOR_0];

        var _reader = this.GetReaderFromAccessor(gltf, _accessor);

        if (_reader === null) {
          return;
        }

        _reader.EnumerateData(function (data) {
          var color = GetGltfVertexColor([data.x, data.y, data.z], _reader.componentType);
          mesh.AddVertexColor(color);
        });
      }

      if (hasNormals) {
        var _accessor2 = gltf.accessors[primitive.attributes.NORMAL];

        var _reader2 = this.GetReaderFromAccessor(gltf, _accessor2);

        if (_reader2 === null) {
          return;
        }

        _reader2.EnumerateData(function (data) {
          mesh.AddNormal(data);
        });
      }

      if (hasUVs) {
        var _accessor3 = gltf.accessors[primitive.attributes.TEXCOORD_0];

        var _reader3 = this.GetReaderFromAccessor(gltf, _accessor3);

        if (_reader3 === null) {
          return;
        }

        _reader3.EnumerateData(function (data) {
          data.y = -data.y;
          mesh.AddTextureUV(data);
        });
      }

      var vertexIndices = [];

      if (hasIndices) {
        var _accessor4 = gltf.accessors[primitive.indices];

        var _reader4 = this.GetReaderFromAccessor(gltf, _accessor4);

        if (_reader4 === null) {
          return;
        }

        _reader4.EnumerateData(function (data) {
          vertexIndices.push(data);
        });
      } else {
        var primitiveVertexCount = mesh.VertexCount() - vertexOffset;

        for (var i = 0; i < primitiveVertexCount; i++) {
          vertexIndices.push(i);
        }
      }

      if (mode === GltfRenderMode.TRIANGLES) {
        for (var _i5 = 0; _i5 < vertexIndices.length; _i5 += 3) {
          var v0 = vertexIndices[_i5];
          var v1 = vertexIndices[_i5 + 1];
          var v2 = vertexIndices[_i5 + 2];
          this.AddTriangle(primitive, mesh, v0, v1, v2, hasVertexColors, hasNormals, hasUVs, vertexOffset, vertexColorOffset, normalOffset, uvOffset);
        }
      } else if (mode === GltfRenderMode.TRIANGLE_STRIP) {
        for (var _i6 = 0; _i6 < vertexIndices.length - 2; _i6++) {
          var _v = vertexIndices[_i6];
          var _v2 = vertexIndices[_i6 + 1];
          var _v3 = vertexIndices[_i6 + 2];

          if (_i6 % 2 === 1) {
            var tmp = _v2;
            _v2 = _v3;
            _v3 = tmp;
          }

          this.AddTriangle(primitive, mesh, _v, _v2, _v3, hasVertexColors, hasNormals, hasUVs, vertexOffset, vertexColorOffset, normalOffset, uvOffset);
        }
      } else if (mode === GltfRenderMode.TRIANGLE_FAN) {
        for (var _i7 = 1; _i7 < vertexIndices.length - 1; _i7++) {
          var _v4 = vertexIndices[0];
          var _v5 = vertexIndices[_i7];
          var _v6 = vertexIndices[_i7 + 1];
          this.AddTriangle(primitive, mesh, _v4, _v5, _v6, hasVertexColors, hasNormals, hasUVs, vertexOffset, vertexColorOffset, normalOffset, uvOffset);
        }
      }
    }
  }, {
    key: "AddTriangle",
    value: function AddTriangle(primitive, mesh, v0, v1, v2, hasVertexColors, hasNormals, hasUVs, vertexOffset, vertexColorOffset, normalOffset, uvOffset) {
      var triangle = new Triangle(vertexOffset + v0, vertexOffset + v1, vertexOffset + v2);

      if (hasVertexColors) {
        triangle.SetVertexColors(vertexColorOffset + v0, vertexColorOffset + v1, vertexColorOffset + v2);
      }

      if (hasNormals) {
        triangle.SetNormals(normalOffset + v0, normalOffset + v1, normalOffset + v2);
      }

      if (hasUVs) {
        triangle.SetTextureUVs(uvOffset + v0, uvOffset + v1, uvOffset + v2);
      }

      if (primitive.material !== undefined) {
        triangle.mat = primitive.material;
      }

      mesh.AddTriangle(triangle);
    }
  }, {
    key: "ImportNodes",
    value: function ImportNodes(gltf) {
      var scene = this.GetDefaultScene(gltf);

      if (scene === null) {
        return;
      }

      var rootNode = this.model.GetRootNode();

      var _iterator3 = _createForOfIteratorHelper(scene.nodes),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var nodeIndex = _step3.value;
          var gltfNode = gltf.nodes[nodeIndex];
          this.ImportNode(gltf, gltfNode, rootNode);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "ImportNode",
    value: function ImportNode(gltf, gltfNode, parentNode) {
      function GetNodeTransformation(gltfNode) {
        var matrix = new Matrix().CreateIdentity();

        if (gltfNode.matrix !== undefined) {
          matrix.Set(gltfNode.matrix);
        } else {
          var translation = [0.0, 0.0, 0.0];
          var rotation = [0.0, 0.0, 0.0, 1.0];
          var scale = [1.0, 1.0, 1.0];

          if (gltfNode.translation !== undefined) {
            translation = gltfNode.translation;
          }

          if (gltfNode.rotation !== undefined) {
            rotation = gltfNode.rotation;
          }

          if (gltfNode.scale !== undefined) {
            scale = gltfNode.scale;
          }

          matrix.ComposeTRS(ArrayToCoord3D(translation), ArrayToQuaternion(rotation), ArrayToCoord3D(scale));
        }

        return new Transformation(matrix);
      }

      if (gltfNode.children === undefined && gltfNode.mesh === undefined) {
        return;
      }

      var node = new Node();

      if (gltfNode.name !== undefined) {
        node.SetName(gltfNode.name);
      }

      node.SetTransformation(GetNodeTransformation(gltfNode));
      parentNode.AddChildNode(node);

      if (gltfNode.children !== undefined) {
        var _iterator4 = _createForOfIteratorHelper(gltfNode.children),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var childIndex = _step4.value;
            var childGltfNode = gltf.nodes[childIndex];
            this.ImportNode(gltf, childGltfNode, node);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }

      if (gltfNode.mesh !== undefined) {
        if (gltfNode.children === undefined || gltfNode.children.length === 0) {
          node.SetType(NodeType.MeshNode);
        }

        node.AddMeshIndex(gltfNode.mesh);
      }
    }
  }, {
    key: "GetReaderFromBufferView",
    value: function GetReaderFromBufferView(bufferView) {
      var bufferIndex = bufferView.buffer || 0;
      var buffer = this.bufferContents[bufferIndex];

      if (buffer === undefined || buffer === null) {
        return null;
      }

      var reader = new GltfBufferReader(buffer);
      reader.SkipBytes(bufferView.byteOffset || 0);
      var byteStride = bufferView.byteStride;

      if (byteStride !== undefined && byteStride !== 0) {
        reader.SetByteStride(byteStride);
      }

      return reader;
    }
  }, {
    key: "GetReaderFromAccessor",
    value: function GetReaderFromAccessor(gltf, accessor) {
      var bufferViewIndex = accessor.bufferView || 0;
      var bufferView = gltf.bufferViews[bufferViewIndex];
      var reader = this.GetReaderFromBufferView(bufferView);

      if (reader === null) {
        return null;
      }

      reader.SetComponentType(accessor.componentType);
      reader.SetDataType(accessor.type);
      reader.SetDataCount(accessor.count);
      reader.SkipBytes(accessor.byteOffset || 0);

      if (accessor.sparse !== undefined) {
        var indexReader = this.GetReaderFromSparseAccessor(gltf, accessor.sparse.indices, accessor.sparse.indices.componentType, 'SCALAR', accessor.sparse.count);
        var valueReader = this.GetReaderFromSparseAccessor(gltf, accessor.sparse.values, accessor.componentType, accessor.type, accessor.sparse.count);

        if (indexReader !== null && valueReader !== null) {
          reader.SetSparseReader(indexReader, valueReader);
        }
      }

      return reader;
    }
  }, {
    key: "GetReaderFromSparseAccessor",
    value: function GetReaderFromSparseAccessor(gltf, sparseAccessor, componentType, type, count) {
      if (sparseAccessor.bufferView === undefined) {
        return null;
      }

      var bufferView = gltf.bufferViews[sparseAccessor.bufferView];
      var reader = this.GetReaderFromBufferView(bufferView);

      if (reader === null) {
        return null;
      }

      reader.SetComponentType(componentType);
      reader.SetDataType(type);
      reader.SetDataCount(count);
      reader.SkipBytes(sparseAccessor.byteOffset || 0);
      return reader;
    }
  }]);

  return ImporterGltf;
}(ImporterBase);