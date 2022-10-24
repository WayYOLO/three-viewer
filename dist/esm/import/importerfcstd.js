function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Direction } from "../geometry/geometry.js";
import { ImporterBase } from "./importerbase.js";
import { GetFileExtension } from "../io/fileutils.js";
import { GetExternalLibPath } from "../io/externallibs.js";
import { ConvertThreeGeometryToMesh } from "../threejs/threeutils.js";
import { ArrayBufferToUtf8String } from "../io/bufferutils.js";
import { Node, NodeType } from "../model/node.js";
import { ColorToMaterialConverter } from "./importerutils.js";
import { RGBAColor } from "../model/color.js";
import { Property, PropertyGroup, PropertyType } from "../model/property.js";
import * as fflate from 'fflate';
var DocumentInitResult = {
  Success: 0,
  NoDocumentXml: 1
};

var FreeCadObject = /*#__PURE__*/function () {
  function FreeCadObject(name, type) {
    _classCallCheck(this, FreeCadObject);

    this.name = name;
    this.type = type;
    this.shapeName = null;
    this.isVisible = false;
    this.color = null;
    this.fileName = null;
    this.fileContent = null;
    this.inLinkCount = 0;
    this.properties = null;
  }

  _createClass(FreeCadObject, [{
    key: "IsConvertible",
    value: function IsConvertible() {
      if (this.fileName === null || this.fileContent === null) {
        return false;
      }

      if (!this.isVisible) {
        return false;
      }

      if (this.inLinkCount > 0) {
        return false;
      }

      return true;
    }
  }]);

  return FreeCadObject;
}();

var FreeCadDocument = /*#__PURE__*/function () {
  function FreeCadDocument() {
    _classCallCheck(this, FreeCadDocument);

    this.files = null;
    this.properties = null;
    this.objectNames = [];
    this.objectData = new Map();
  }

  _createClass(FreeCadDocument, [{
    key: "Init",
    value: function Init(fileContent) {
      var fileContentBuffer = new Uint8Array(fileContent);
      this.files = fflate.unzipSync(fileContentBuffer);

      if (!this.LoadDocumentXml()) {
        return DocumentInitResult.NoDocumentXml;
      }

      this.LoadGuiDocumentXml();
      return DocumentInitResult.Success;
    }
  }, {
    key: "GetObjectListToConvert",
    value: function GetObjectListToConvert() {
      var objectList = [];

      var _iterator = _createForOfIteratorHelper(this.objectNames),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var objectName = _step.value;
          var object = this.objectData.get(objectName);

          if (!object.IsConvertible()) {
            continue;
          }

          objectList.push(object);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return objectList;
    }
  }, {
    key: "IsSupportedType",
    value: function IsSupportedType(type) {
      if (!type.startsWith('Part::') && !type.startsWith('PartDesign::')) {
        return false;
      }

      if (type.indexOf('Part2D') !== -1) {
        return false;
      }

      return true;
    }
  }, {
    key: "HasFile",
    value: function HasFile(fileName) {
      return fileName in this.files;
    }
  }, {
    key: "LoadDocumentXml",
    value: function LoadDocumentXml() {
      var documentXml = this.GetXMLContent('Document.xml');

      if (documentXml === null) {
        return false;
      }

      this.properties = new PropertyGroup('Properties');
      var documentElements = documentXml.getElementsByTagName('Document');

      var _iterator2 = _createForOfIteratorHelper(documentElements),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var documentElement = _step2.value;

          var _iterator5 = _createForOfIteratorHelper(documentElement.childNodes),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var childNode = _step5.value;

              if (childNode.tagName === 'Properties') {
                this.GetPropertiesFromElement(childNode, this.properties);
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var objectsElements = documentXml.getElementsByTagName('Objects');

      var _iterator3 = _createForOfIteratorHelper(objectsElements),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var objectsElement = _step3.value;
          var objectElements = objectsElement.getElementsByTagName('Object');

          var _iterator6 = _createForOfIteratorHelper(objectElements),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var objectElement = _step6.value;
              var name = objectElement.getAttribute('name');
              var type = objectElement.getAttribute('type');

              if (!this.IsSupportedType(type)) {
                continue;
              }

              var object = new FreeCadObject(name, type);
              this.objectNames.push(name);
              this.objectData.set(name, object);
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var objectDataElements = documentXml.getElementsByTagName('ObjectData');

      var _iterator4 = _createForOfIteratorHelper(objectDataElements),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var objectDataElement = _step4.value;

          var _objectElements = objectDataElement.getElementsByTagName('Object');

          var _iterator7 = _createForOfIteratorHelper(_objectElements),
              _step7;

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var _objectElement = _step7.value;

              var _name = _objectElement.getAttribute('name');

              if (!this.objectData.has(_name)) {
                continue;
              }

              var _object = this.objectData.get(_name);

              _object.properties = new PropertyGroup('Properties');

              var _iterator8 = _createForOfIteratorHelper(_objectElement.childNodes),
                  _step8;

              try {
                for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                  var _childNode = _step8.value;

                  if (_childNode.tagName === 'Properties') {
                    this.GetPropertiesFromElement(_childNode, _object.properties);
                  }
                }
              } catch (err) {
                _iterator8.e(err);
              } finally {
                _iterator8.f();
              }

              var propertyElements = _objectElement.getElementsByTagName('Property');

              var _iterator9 = _createForOfIteratorHelper(propertyElements),
                  _step9;

              try {
                for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                  var propertyElement = _step9.value;
                  var propertyName = propertyElement.getAttribute('name');

                  if (propertyName === 'Label') {
                    _object.shapeName = this.GetFirstChildValue(propertyElement, 'String', 'value');
                  } else if (propertyName === 'Visibility') {
                    var isVisibleString = this.GetFirstChildValue(propertyElement, 'Bool', 'value');
                    _object.isVisible = isVisibleString === 'true';
                  } else if (propertyName === 'Visible') {
                    var _isVisibleString = this.GetFirstChildValue(propertyElement, 'Bool', 'value');

                    _object.isVisible = _isVisibleString === 'true';
                  } else if (propertyName === 'Shape') {
                    var fileName = this.GetFirstChildValue(propertyElement, 'Part', 'file');

                    if (!this.HasFile(fileName)) {
                      continue;
                    }

                    var extension = GetFileExtension(fileName);

                    if (extension !== 'brp' && extension !== 'brep') {
                      continue;
                    }

                    _object.fileName = fileName;
                    _object.fileContent = this.files[fileName];
                  }
                }
              } catch (err) {
                _iterator9.e(err);
              } finally {
                _iterator9.f();
              }

              var linkElements = _objectElement.getElementsByTagName('Link');

              var _iterator10 = _createForOfIteratorHelper(linkElements),
                  _step10;

              try {
                for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                  var linkElement = _step10.value;
                  var linkedName = linkElement.getAttribute('value');

                  if (this.objectData.has(linkedName)) {
                    var linkedObject = this.objectData.get(linkedName);
                    linkedObject.inLinkCount += 1;
                  }
                }
              } catch (err) {
                _iterator10.e(err);
              } finally {
                _iterator10.f();
              }
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return true;
    }
  }, {
    key: "LoadGuiDocumentXml",
    value: function LoadGuiDocumentXml() {
      var documentXml = this.GetXMLContent('GuiDocument.xml');

      if (documentXml === null) {
        return false;
      }

      var viewProviderElements = documentXml.getElementsByTagName('ViewProvider');

      var _iterator11 = _createForOfIteratorHelper(viewProviderElements),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var viewProviderElement = _step11.value;
          var name = viewProviderElement.getAttribute('name');

          if (!this.objectData.has(name)) {
            continue;
          }

          var object = this.objectData.get(name);
          var propertyElements = viewProviderElement.getElementsByTagName('Property');

          var _iterator12 = _createForOfIteratorHelper(propertyElements),
              _step12;

          try {
            for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
              var propertyElement = _step12.value;
              var propertyName = propertyElement.getAttribute('name');

              if (propertyName === 'Visibility') {
                var isVisibleString = this.GetFirstChildValue(propertyElement, 'Bool', 'value');
                object.isVisible = isVisibleString === 'true';
              } else if (propertyName === 'ShapeColor') {
                var colorString = this.GetFirstChildValue(propertyElement, 'PropertyColor', 'value');
                var rgba = parseInt(colorString, 10);
                object.color = new RGBAColor(rgba >> 24 & 0xff, rgba >> 16 & 0xff, rgba >> 8 & 0xff, 255);
              }
            }
          } catch (err) {
            _iterator12.e(err);
          } finally {
            _iterator12.f();
          }
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }

      return true;
    }
  }, {
    key: "GetPropertiesFromElement",
    value: function GetPropertiesFromElement(propertiesElement, propertyGroup) {
      var propertyElements = propertiesElement.getElementsByTagName('Property');

      var _iterator13 = _createForOfIteratorHelper(propertyElements),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var propertyElement = _step13.value;
          var propertyName = propertyElement.getAttribute('name');
          var propertyType = propertyElement.getAttribute('type');
          var property = null;

          if (propertyType === 'App::PropertyBool') {
            var propertyValue = this.GetFirstChildValue(propertyElement, 'String', 'bool');

            if (propertyValue !== null && propertyValue.length > 0) {
              property = new Property(PropertyType.Boolean, propertyName, propertyValue === 'true');
            }
          } else if (propertyType === 'App::PropertyInteger') {
            var _propertyValue = this.GetFirstChildValue(propertyElement, 'Integer', 'value');

            if (_propertyValue !== null && _propertyValue.length > 0) {
              property = new Property(PropertyType.Integer, propertyName, parseInt(_propertyValue));
            }
          } else if (propertyType === 'App::PropertyString') {
            var _propertyValue2 = this.GetFirstChildValue(propertyElement, 'String', 'value');

            if (_propertyValue2 !== null && _propertyValue2.length > 0) {
              property = new Property(PropertyType.Text, propertyName, _propertyValue2);
            }
          } else if (propertyType === 'App::PropertyUUID') {
            var _propertyValue3 = this.GetFirstChildValue(propertyElement, 'Uuid', 'value');

            if (_propertyValue3 !== null && _propertyValue3.length > 0) {
              property = new Property(PropertyType.Text, propertyName, _propertyValue3);
            }
          } else if (propertyType === 'App::PropertyFloat' || propertyType === 'App::PropertyLength' || propertyType === 'App::PropertyDistance' || propertyType === 'App::PropertyArea' || propertyType === 'App::PropertyVolume') {
            var _propertyValue4 = this.GetFirstChildValue(propertyElement, 'Float', 'value');

            if (_propertyValue4 !== null && _propertyValue4.length > 0) {
              property = new Property(PropertyType.Number, propertyName, parseFloat(_propertyValue4));
            }
          }

          if (property !== null) {
            propertyGroup.AddProperty(property);
          }
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }
    }
  }, {
    key: "GetXMLContent",
    value: function GetXMLContent(xmlFileName) {
      if (!this.HasFile(xmlFileName)) {
        return null;
      }

      var xmlParser = new DOMParser();
      var xmlString = ArrayBufferToUtf8String(this.files[xmlFileName]);
      return xmlParser.parseFromString(xmlString, 'text/xml');
    }
  }, {
    key: "GetFirstChildValue",
    value: function GetFirstChildValue(element, childTagName, childAttribute) {
      var childObjects = element.getElementsByTagName(childTagName);

      if (childObjects.length === 0) {
        return null;
      }

      return childObjects[0].getAttribute(childAttribute);
    }
  }]);

  return FreeCadDocument;
}();

export var ImporterFcstd = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterFcstd, _ImporterBase);

  var _super = _createSuper(ImporterFcstd);

  function ImporterFcstd() {
    var _this;

    _classCallCheck(this, ImporterFcstd);

    _this = _super.call(this);
    _this.worker = null;
    _this.document = null;
    return _this;
  }

  _createClass(ImporterFcstd, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'fcstd';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Z;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      if (this.worker !== null) {
        this.worker.terminate();
        this.worker = null;
      }

      this.document = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.worker = null;
      this.document = new FreeCadDocument();
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      var result = this.document.Init(fileContent);

      if (result === DocumentInitResult.NoDocumentXml) {
        this.SetError('No Document.xml found.');
        onFinish();
        return;
      }

      if (this.document.properties !== null && this.document.properties.PropertyCount() > 0) {
        this.model.AddPropertyGroup(this.document.properties);
      }

      var objectsToConvert = this.document.GetObjectListToConvert();

      if (objectsToConvert.length === 0) {
        this.SetError('No importable object found.');
        onFinish();
        return;
      }

      this.ConvertObjects(objectsToConvert, onFinish);
    }
  }, {
    key: "ConvertObjects",
    value: function ConvertObjects(objects, onFinish) {
      var _this2 = this;

      var workerPath = GetExternalLibPath('loaders/occt-import-js-worker.js');
      this.worker = new Worker(workerPath);
      var convertedObjectCount = 0;
      var colorToMaterial = new ColorToMaterialConverter(this.model);

      var onFileConverted = function onFileConverted(resultContent) {
        if (resultContent !== null) {
          var _currentObject = objects[convertedObjectCount];

          _this2.OnFileConverted(_currentObject, resultContent, colorToMaterial);
        }

        convertedObjectCount += 1;

        if (convertedObjectCount === objects.length) {
          onFinish();
        } else {
          var _currentObject2 = objects[convertedObjectCount];

          _this2.worker.postMessage({
            format: 'brep',
            buffer: _currentObject2.fileContent
          });
        }
      };

      this.worker.addEventListener('message', function (ev) {
        onFileConverted(ev.data);
      });
      this.worker.addEventListener('error', function (ev) {
        onFileConverted(null);
      });
      var currentObject = objects[convertedObjectCount];
      this.worker.postMessage({
        format: 'brep',
        buffer: currentObject.fileContent
      });
    }
  }, {
    key: "OnFileConverted",
    value: function OnFileConverted(object, resultContent, colorToMaterial) {
      if (!resultContent.success || resultContent.meshes.length === 0) {
        return;
      }

      var objectNode = new Node();
      objectNode.SetType(NodeType.GroupNode);

      if (object.shapeName !== null) {
        objectNode.SetName(object.shapeName);
      }

      var objectMeshIndex = 1;

      var _iterator14 = _createForOfIteratorHelper(resultContent.meshes),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var resultMesh = _step14.value;
          var materialIndex = null;

          if (object.color !== null) {
            materialIndex = colorToMaterial.GetMaterialIndex(object.color.r, object.color.g, object.color.b, object.color.a);
          }

          var mesh = ConvertThreeGeometryToMesh(resultMesh, materialIndex);

          if (object.shapeName !== null) {
            var indexString = objectMeshIndex.toString().padStart(3, '0');
            mesh.SetName(object.shapeName + ' ' + indexString);
          }

          if (object.properties !== null && object.properties.PropertyCount() > 0) {
            mesh.AddPropertyGroup(object.properties);
          }

          var meshIndex = this.model.AddMesh(mesh);
          objectNode.AddMeshIndex(meshIndex);
          objectMeshIndex += 1;
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      var rootNode = this.model.GetRootNode();
      rootNode.AddChildNode(objectNode);
    }
  }]);

  return ImporterFcstd;
}(ImporterBase);