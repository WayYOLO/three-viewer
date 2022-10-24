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

import { BinaryWriter } from "../io/binarywriter.js";
import { Utf8StringToArrayBuffer } from "../io/bufferutils.js";
import { FileFormat, GetFileExtension, GetFileName } from "../io/fileutils.js";
import { RGBColor, SRGBToLinear } from "../model/color.js";
import { MaterialType } from "../model/material.js";
import { ConvertMeshToMeshBuffer } from "../model/meshbuffer.js";
import { ExportedFile, ExporterBase } from "./exporterbase.js";
export var ExporterGltf = /*#__PURE__*/function (_ExporterBase) {
  _inherits(ExporterGltf, _ExporterBase);

  var _super = _createSuper(ExporterGltf);

  function ExporterGltf() {
    var _this;

    _classCallCheck(this, ExporterGltf);

    _this = _super.call(this);
    _this.components = {
      index: {
        type: 5125,
        // unsigned int 32
        size: 4
      },
      number: {
        type: 5126,
        // float 32
        size: 4
      }
    };
    return _this;
  }

  _createClass(ExporterGltf, [{
    key: "CanExport",
    value: function CanExport(format, extension) {
      return format === FileFormat.Text && extension === 'gltf' || format === FileFormat.Binary && extension === 'glb';
    }
  }, {
    key: "ExportContent",
    value: function ExportContent(exporterModel, format, files, onFinish) {
      if (format === FileFormat.Text) {
        this.ExportAsciiContent(exporterModel, files);
      } else if (format === FileFormat.Binary) {
        this.ExportBinaryContent(exporterModel, files);
      }

      onFinish();
    }
  }, {
    key: "ExportAsciiContent",
    value: function ExportAsciiContent(exporterModel, files) {
      var gltfFile = new ExportedFile('model.gltf');
      var binFile = new ExportedFile('model.bin');
      files.push(gltfFile);
      files.push(binFile);
      var meshDataArr = this.GetMeshData(exporterModel);
      var mainBuffer = this.GetMainBuffer(meshDataArr);
      var mainJson = this.GetMainJson(meshDataArr);
      mainJson.buffers.push({
        uri: binFile.GetName(),
        byteLength: mainBuffer.byteLength
      });
      var fileNameToIndex = new Map();
      this.ExportMaterials(exporterModel, mainJson, function (texture) {
        var fileName = GetFileName(texture.name);

        if (fileNameToIndex.has(fileName)) {
          return fileNameToIndex.get(fileName);
        } else {
          var textureFile = new ExportedFile(fileName);
          textureFile.SetBufferContent(texture.buffer);
          files.push(textureFile);
          var textureIndex = mainJson.textures.length;
          fileNameToIndex.set(fileName, textureIndex);
          mainJson.images.push({
            uri: fileName
          });
          mainJson.textures.push({
            source: textureIndex
          });
          return textureIndex;
        }
      });
      gltfFile.SetTextContent(JSON.stringify(mainJson, null, 4));
      binFile.SetBufferContent(mainBuffer);
    }
  }, {
    key: "ExportBinaryContent",
    value: function ExportBinaryContent(exporterModel, files) {
      function AlignToBoundary(size) {
        var remainder = size % 4;

        if (remainder === 0) {
          return size;
        }

        return size + (4 - remainder);
      }

      function WriteCharacters(writer, char, count) {
        for (var i = 0; i < count; i++) {
          writer.WriteUnsignedCharacter8(char);
        }
      }

      var glbFile = new ExportedFile('model.glb');
      files.push(glbFile);
      var meshDataArr = this.GetMeshData(exporterModel);
      var mainBuffer = this.GetMainBuffer(meshDataArr);
      var mainJson = this.GetMainJson(meshDataArr);
      var textureBuffers = [];
      var textureOffset = mainBuffer.byteLength;
      var fileNameToIndex = new Map();
      this.ExportMaterials(exporterModel, mainJson, function (texture) {
        var fileName = GetFileName(texture.name);
        var extension = GetFileExtension(texture.name);

        if (fileNameToIndex.has(fileName)) {
          return fileNameToIndex.get(fileName);
        } else {
          var bufferViewIndex = mainJson.bufferViews.length;
          var textureIndex = mainJson.textures.length;
          fileNameToIndex.set(fileName, textureIndex);
          var textureBuffer = texture.buffer;
          textureBuffers.push(textureBuffer);
          mainJson.bufferViews.push({
            buffer: 0,
            byteOffset: textureOffset,
            byteLength: textureBuffer.byteLength
          });
          textureOffset += textureBuffer.byteLength;
          mainJson.images.push({
            bufferView: bufferViewIndex,
            mimeType: 'image/' + extension
          });
          mainJson.textures.push({
            source: textureIndex
          });
          return textureIndex;
        }
      });
      var mainBinaryBufferLength = mainBuffer.byteLength;

      for (var i = 0; i < textureBuffers.length; i++) {
        var textureBuffer = textureBuffers[i];
        mainBinaryBufferLength += textureBuffer.byteLength;
      }

      var mainBinaryBufferAlignedLength = AlignToBoundary(mainBinaryBufferLength);
      mainJson.buffers.push({
        byteLength: mainBinaryBufferAlignedLength
      });
      var mainJsonString = JSON.stringify(mainJson);
      var mainJsonBuffer = Utf8StringToArrayBuffer(mainJsonString);
      var mainJsonBufferLength = mainJsonBuffer.byteLength;
      var mainJsonBufferAlignedLength = AlignToBoundary(mainJsonBufferLength);
      var glbSize = 12 + 8 + mainJsonBufferAlignedLength + 8 + mainBinaryBufferAlignedLength;
      var glbWriter = new BinaryWriter(glbSize, true);
      glbWriter.WriteUnsignedInteger32(0x46546C67);
      glbWriter.WriteUnsignedInteger32(2);
      glbWriter.WriteUnsignedInteger32(glbSize);
      glbWriter.WriteUnsignedInteger32(mainJsonBufferAlignedLength);
      glbWriter.WriteUnsignedInteger32(0x4E4F534A);
      glbWriter.WriteArrayBuffer(mainJsonBuffer);
      WriteCharacters(glbWriter, 32, mainJsonBufferAlignedLength - mainJsonBufferLength);
      glbWriter.WriteUnsignedInteger32(mainBinaryBufferAlignedLength);
      glbWriter.WriteUnsignedInteger32(0x004E4942);
      glbWriter.WriteArrayBuffer(mainBuffer);

      for (var _i = 0; _i < textureBuffers.length; _i++) {
        var _textureBuffer = textureBuffers[_i];
        glbWriter.WriteArrayBuffer(_textureBuffer);
      }

      WriteCharacters(glbWriter, 0, mainBinaryBufferAlignedLength - mainBinaryBufferLength);
      glbFile.SetBufferContent(glbWriter.GetBuffer());
    }
  }, {
    key: "GetMeshData",
    value: function GetMeshData(exporterModel) {
      var meshDataArr = [];
      exporterModel.EnumerateTransformedMeshes(function (mesh) {
        var buffer = ConvertMeshToMeshBuffer(mesh);
        meshDataArr.push({
          name: mesh.GetName(),
          buffer: buffer,
          offsets: [],
          sizes: []
        });
      });
      return meshDataArr;
    }
  }, {
    key: "GetMainBuffer",
    value: function GetMainBuffer(meshDataArr) {
      var mainBufferSize = 0;

      for (var meshIndex = 0; meshIndex < meshDataArr.length; meshIndex++) {
        var meshData = meshDataArr[meshIndex];
        mainBufferSize += meshData.buffer.GetByteLength(this.components.index.size, this.components.number.size);
      }

      var writer = new BinaryWriter(mainBufferSize, true);

      for (var _meshIndex = 0; _meshIndex < meshDataArr.length; _meshIndex++) {
        var _meshData = meshDataArr[_meshIndex];

        for (var primitiveIndex = 0; primitiveIndex < _meshData.buffer.PrimitiveCount(); primitiveIndex++) {
          var primitive = _meshData.buffer.GetPrimitive(primitiveIndex);

          var offset = writer.GetPosition();

          for (var i = 0; i < primitive.indices.length; i++) {
            writer.WriteUnsignedInteger32(primitive.indices[i]);
          }

          for (var _i2 = 0; _i2 < primitive.vertices.length; _i2++) {
            writer.WriteFloat32(primitive.vertices[_i2]);
          }

          for (var _i3 = 0; _i3 < primitive.colors.length; _i3++) {
            writer.WriteFloat32(SRGBToLinear(primitive.colors[_i3]));
          }

          for (var _i4 = 0; _i4 < primitive.normals.length; _i4++) {
            writer.WriteFloat32(primitive.normals[_i4]);
          }

          for (var _i5 = 0; _i5 < primitive.uvs.length; _i5++) {
            var texCoord = primitive.uvs[_i5];

            if (_i5 % 2 === 1) {
              texCoord *= -1.0;
            }

            writer.WriteFloat32(texCoord);
          }

          _meshData.offsets.push(offset);

          _meshData.sizes.push(writer.GetPosition() - offset);
        }
      }

      return writer.GetBuffer();
    }
  }, {
    key: "GetMainJson",
    value: function GetMainJson(meshDataArr) {
      var BufferViewCreator = /*#__PURE__*/function () {
        function BufferViewCreator(mainJson, byteOffset) {
          _classCallCheck(this, BufferViewCreator);

          this.mainJson = mainJson;
          this.byteOffset = byteOffset;
        }

        _createClass(BufferViewCreator, [{
          key: "AddBufferView",
          value: function AddBufferView(byteLength) {
            this.mainJson.bufferViews.push({
              buffer: 0,
              byteOffset: this.byteOffset,
              byteLength: byteLength
            });
            this.byteOffset += byteLength;
            return this.mainJson.bufferViews.length - 1;
          }
        }]);

        return BufferViewCreator;
      }();

      var mainJson = {
        asset: {
          generator: 'https://3dviewer.net',
          version: '2.0'
        },
        scene: 0,
        scenes: [{
          nodes: []
        }],
        nodes: [],
        materials: [],
        meshes: [],
        buffers: [],
        bufferViews: [],
        accessors: []
      };

      for (var meshIndex = 0; meshIndex < meshDataArr.length; meshIndex++) {
        var meshData = meshDataArr[meshIndex];
        mainJson.scenes[0].nodes.push(meshIndex);
        mainJson.nodes.push({
          mesh: meshIndex
        });
        var jsonMesh = {
          name: this.GetExportedMeshName(meshData.name),
          primitives: []
        };
        var primitives = meshData.buffer.primitives;

        for (var primitiveIndex = 0; primitiveIndex < primitives.length; primitiveIndex++) {
          var primitive = primitives[primitiveIndex];
          var bufferViewCreator = new BufferViewCreator(mainJson, meshData.offsets[primitiveIndex]);
          var indicesBufferView = bufferViewCreator.AddBufferView(primitive.indices.length * this.components.index.size);
          var verticesBufferView = bufferViewCreator.AddBufferView(primitive.vertices.length * this.components.number.size);
          var colorsBufferView = null;

          if (primitive.colors.length > 0) {
            colorsBufferView = bufferViewCreator.AddBufferView(primitive.colors.length * this.components.number.size);
          }

          var normalsBufferView = bufferViewCreator.AddBufferView(primitive.normals.length * this.components.number.size);
          var uvsBufferView = null;

          if (primitive.uvs.length > 0) {
            uvsBufferView = bufferViewCreator.AddBufferView(primitive.uvs.length * this.components.number.size);
          }

          var jsonPrimitive = {
            attributes: {},
            mode: 4,
            material: primitive.material
          };
          var bounds = primitive.GetBounds();
          mainJson.accessors.push({
            bufferView: indicesBufferView,
            byteOffset: 0,
            componentType: this.components.index.type,
            count: primitive.indices.length,
            type: 'SCALAR'
          });
          jsonPrimitive.indices = mainJson.accessors.length - 1;
          mainJson.accessors.push({
            bufferView: verticesBufferView,
            byteOffset: 0,
            componentType: this.components.number.type,
            count: primitive.vertices.length / 3,
            min: bounds.min,
            max: bounds.max,
            type: 'VEC3'
          });
          jsonPrimitive.attributes.POSITION = mainJson.accessors.length - 1;

          if (colorsBufferView !== null) {
            mainJson.accessors.push({
              bufferView: colorsBufferView,
              byteOffset: 0,
              componentType: this.components.number.type,
              count: primitive.colors.length / 3,
              type: 'VEC3'
            });
            jsonPrimitive.attributes.COLOR_0 = mainJson.accessors.length - 1;
          }

          mainJson.accessors.push({
            bufferView: normalsBufferView,
            byteOffset: 0,
            componentType: this.components.number.type,
            count: primitive.normals.length / 3,
            type: 'VEC3'
          });
          jsonPrimitive.attributes.NORMAL = mainJson.accessors.length - 1;

          if (uvsBufferView !== null) {
            mainJson.accessors.push({
              bufferView: uvsBufferView,
              byteOffset: 0,
              componentType: this.components.number.type,
              count: primitive.uvs.length / 2,
              type: 'VEC2'
            });
            jsonPrimitive.attributes.TEXCOORD_0 = mainJson.accessors.length - 1;
          }

          jsonMesh.primitives.push(jsonPrimitive);
        }

        mainJson.meshes.push(jsonMesh);
      }

      return mainJson;
    }
  }, {
    key: "ExportMaterials",
    value: function ExportMaterials(exporterModel, mainJson, addTexture) {
      function ExportMaterial(obj, mainJson, material, addTexture) {
        function ColorToRGBA(color, opacity) {
          return [SRGBToLinear(color.r / 255.0), SRGBToLinear(color.g / 255.0), SRGBToLinear(color.b / 255.0), opacity];
        }

        function ColorToRGB(color) {
          return [SRGBToLinear(color.r / 255.0), SRGBToLinear(color.g / 255.0), SRGBToLinear(color.b / 255.0)];
        }

        function GetTextureParams(mainJson, texture, addTexture) {
          if (texture === null || !texture.IsValid()) {
            return null;
          }

          if (mainJson.images === undefined) {
            mainJson.images = [];
          }

          if (mainJson.textures === undefined) {
            mainJson.textures = [];
          }

          var textureIndex = addTexture(texture);
          var textureParams = {
            index: textureIndex
          };

          if (texture.HasTransformation()) {
            var extensionName = 'KHR_texture_transform';

            if (mainJson.extensionsUsed === undefined) {
              mainJson.extensionsUsed = [];
            }

            if (mainJson.extensionsUsed.indexOf(extensionName) === -1) {
              mainJson.extensionsUsed.push(extensionName);
            }

            textureParams.extensions = {
              KHR_texture_transform: {
                offset: [texture.offset.x, -texture.offset.y],
                scale: [texture.scale.x, texture.scale.y],
                rotation: -texture.rotation
              }
            };
          }

          return textureParams;
        }

        var jsonMaterial = {
          name: obj.GetExportedMaterialName(material.name),
          pbrMetallicRoughness: {
            baseColorFactor: ColorToRGBA(material.color, material.opacity)
          },
          emissiveFactor: ColorToRGB(material.emissive),
          doubleSided: true,
          alphaMode: 'OPAQUE'
        };

        if (material.transparent) {
          // TODO: mask, alphaCutoff?
          jsonMaterial.alphaMode = 'BLEND';
        }

        var baseColorTexture = GetTextureParams(mainJson, material.diffuseMap, addTexture);

        if (baseColorTexture !== null) {
          if (!material.multiplyDiffuseMap) {
            jsonMaterial.pbrMetallicRoughness.baseColorFactor = ColorToRGBA(new RGBColor(255, 255, 255), material.opacity);
          }

          jsonMaterial.pbrMetallicRoughness.baseColorTexture = baseColorTexture;
        }

        if (material.type === MaterialType.Physical) {
          var metallicTexture = GetTextureParams(mainJson, material.metalnessMap, addTexture);

          if (metallicTexture !== null) {
            jsonMaterial.pbrMetallicRoughness.metallicRoughnessTexture = metallicTexture;
          } else {
            jsonMaterial.pbrMetallicRoughness.metallicFactor = material.metalness;
            jsonMaterial.pbrMetallicRoughness.roughnessFactor = material.roughness;
          }
        }

        var normalTexture = GetTextureParams(mainJson, material.normalMap, addTexture);

        if (normalTexture !== null) {
          jsonMaterial.normalTexture = normalTexture;
        }

        var emissiveTexture = GetTextureParams(mainJson, material.emissiveMap, addTexture);

        if (emissiveTexture !== null) {
          jsonMaterial.emissiveTexture = emissiveTexture;
        }

        mainJson.materials.push(jsonMaterial);
      }

      for (var materialIndex = 0; materialIndex < exporterModel.MaterialCount(); materialIndex++) {
        var material = exporterModel.GetMaterial(materialIndex);
        ExportMaterial(this, mainJson, material, addTexture);
      }
    }
  }]);

  return ExporterGltf;
}(ExporterBase);