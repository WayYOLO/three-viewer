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

import { Coord3D } from "../geometry/coord3d.js";
import { Direction } from "../geometry/geometry.js";
import { Matrix } from "../geometry/matrix.js";
import { Transformation } from "../geometry/transformation.js";
import { LoadExternalLibrary } from "../io/externallibs.js";
import { RGBColorFromFloatComponents } from "../model/color.js";
import { Mesh } from "../model/mesh.js";
import { Property, PropertyGroup, PropertyType } from "../model/property.js";
import { Triangle } from "../model/triangle.js";
import { ImporterBase } from "./importerbase.js";
import { ColorToMaterialConverter } from "./importerutils.js";
export var ImporterIfc = /*#__PURE__*/function (_ImporterBase) {
  _inherits(ImporterIfc, _ImporterBase);

  var _super = _createSuper(ImporterIfc);

  function ImporterIfc() {
    var _this;

    _classCallCheck(this, ImporterIfc);

    _this = _super.call(this);
    _this.ifc = null;
    return _this;
  }

  _createClass(ImporterIfc, [{
    key: "CanImportExtension",
    value: function CanImportExtension(extension) {
      return extension === 'ifc';
    }
  }, {
    key: "GetUpDirection",
    value: function GetUpDirection() {
      return Direction.Y;
    }
  }, {
    key: "ClearContent",
    value: function ClearContent() {
      this.expressIDToMesh = null;
      this.colorToMaterial = null;
    }
  }, {
    key: "ResetContent",
    value: function ResetContent() {
      this.expressIDToMesh = new Map();
      this.colorToMaterial = new ColorToMaterialConverter(this.model);
    }
  }, {
    key: "ImportContent",
    value: function ImportContent(fileContent, onFinish) {
      var _this2 = this;

      if (this.ifc === null) {
        LoadExternalLibrary('loaders/web-ifc-api-browser.js').then(function () {
          _this2.ifc = new WebIFC.IfcAPI();

          _this2.ifc.Init().then(function () {
            _this2.ImportIfcContent(fileContent);

            onFinish();
          });
        }).catch(function () {
          _this2.SetError('Failed to load web-ifc.');

          onFinish();
        });
      } else {
        this.ImportIfcContent(fileContent);
        onFinish();
      }
    }
  }, {
    key: "ImportIfcContent",
    value: function ImportIfcContent(fileContent) {
      var fileBuffer = new Uint8Array(fileContent);
      var modelID = this.ifc.OpenModel(fileBuffer, {
        COORDINATE_TO_ORIGIN: true
      });
      var ifcMeshes = this.ifc.LoadAllGeometry(modelID);

      for (var meshIndex = 0; meshIndex < ifcMeshes.size(); meshIndex++) {
        var ifcMesh = ifcMeshes.get(meshIndex);

        if (ifcMesh.geometries.size() > 0) {
          this.ImportIfcMesh(modelID, ifcMesh);
        }
      }

      this.ImportProperties(modelID);
      this.ifc.CloseModel(modelID);
    }
  }, {
    key: "ImportIfcMesh",
    value: function ImportIfcMesh(modelID, ifcMesh) {
      var mesh = new Mesh();
      mesh.SetName('Mesh ' + ifcMesh.expressID.toString());
      var vertexOffset = 0;
      var ifcGeometries = ifcMesh.geometries;

      for (var geometryIndex = 0; geometryIndex < ifcGeometries.size(); geometryIndex++) {
        var ifcGeometry = ifcGeometries.get(geometryIndex);
        var ifcGeometryData = this.ifc.GetGeometry(modelID, ifcGeometry.geometryExpressID);
        var ifcVertices = this.ifc.GetVertexArray(ifcGeometryData.GetVertexData(), ifcGeometryData.GetVertexDataSize());
        var ifcIndices = this.ifc.GetIndexArray(ifcGeometryData.GetIndexData(), ifcGeometryData.GetIndexDataSize());
        var materialIndex = this.GetMaterialIndexByColor(ifcGeometry.color);
        var matrix = new Matrix(ifcGeometry.flatTransformation);
        var transformation = new Transformation(matrix);

        for (var i = 0; i < ifcVertices.length; i += 6) {
          var x = ifcVertices[i];
          var y = ifcVertices[i + 1];
          var z = ifcVertices[i + 2];
          var coord = new Coord3D(x, y, z);
          var transformed = transformation.TransformCoord3D(coord);
          mesh.AddVertex(transformed);
        } // TODO: normals


        for (var _i = 0; _i < ifcIndices.length; _i += 3) {
          var v0 = ifcIndices[_i];
          var v1 = ifcIndices[_i + 1];
          var v2 = ifcIndices[_i + 2];
          var triangle = new Triangle(vertexOffset + v0, vertexOffset + v1, vertexOffset + v2);
          triangle.SetMaterial(materialIndex);
          mesh.AddTriangle(triangle);
        }

        vertexOffset += ifcVertices.length / 6;
      }

      this.expressIDToMesh.set(ifcMesh.expressID, mesh);
      this.model.AddMeshToRootNode(mesh);
    }
  }, {
    key: "ImportProperties",
    value: function ImportProperties(modelID) {
      var _this3 = this;

      var lines = this.ifc.GetLineIDsWithType(modelID, WebIFC.IFCRELDEFINESBYPROPERTIES);

      var _loop = function _loop(i) {
        var relID = lines.get(i);

        var rel = _this3.ifc.GetLine(modelID, relID);

        if (Array.isArray(rel.RelatingPropertyDefinition)) {
          return "continue";
        }

        rel.RelatedObjects.forEach(function (objectRelID) {
          var element = null;

          if (_this3.expressIDToMesh.has(objectRelID.value)) {
            element = _this3.expressIDToMesh.get(objectRelID.value);
          } else {
            var propSetOwner = _this3.ifc.GetLine(modelID, objectRelID.value, true);

            if (propSetOwner.type === WebIFC.IFCBUILDING) {
              element = _this3.model;
            }
          }

          if (element === null) {
            return;
          }

          var propSetDef = rel.RelatingPropertyDefinition;

          var propSet = _this3.ifc.GetLine(modelID, propSetDef.value, true);

          if (!propSet || !propSet.HasProperties) {
            return;
          }

          var propertyGroup = new PropertyGroup(propSet.Name.value);
          propSet.HasProperties.forEach(function (property) {
            if (!property || !property.Name || !property.NominalValue) {
              return;
            }

            var elemProperty = null;

            var propertyName = _this3.GetIFCString(property.Name.value);

            var strValue = null;

            switch (property.NominalValue.label) {
              case 'IFCTEXT':
              case 'IFCLABEL':
              case 'IFCIDENTIFIER':
                elemProperty = new Property(PropertyType.Text, propertyName, _this3.GetIFCString(property.NominalValue.value));
                break;

              case 'IFCBOOLEAN':
              case 'IFCLOGICAL':
                strValue = 'Unknown';

                if (property.NominalValue.value === 'T') {
                  strValue = 'True';
                } else if (property.NominalValue.value === 'F') {
                  strValue = 'False';
                }

                elemProperty = new Property(PropertyType.Text, propertyName, strValue);
                break;

              case 'IFCINTEGER':
              case 'IFCCOUNTMEASURE':
                elemProperty = new Property(PropertyType.Integer, propertyName, property.NominalValue.value);
                break;

              case 'IFCREAL':
              case 'IFCLENGTHMEASURE':
              case 'IFCPOSITIVELENGTHMEASURE':
              case 'IFCAREAMEASURE':
              case 'IFCVOLUMEMEASURE':
              case 'IFCRATIOMEASURE':
              case 'IFCPOSITIVERATIOMEASURE':
              case 'IFCMASSMEASURE':
              case 'IFCMASSPERLENGTHMEASURE':
              case 'IFCPLANEANGLEMEASURE':
              case 'IFCTHERMALTRANSMITTANCEMEASURE':
                elemProperty = new Property(PropertyType.Number, propertyName, property.NominalValue.value);
                break;

              default:
                // TODO
                console.log(property.NominalValue.label);
                console.log(property.NominalValue.value);
                break;
            }

            if (elemProperty !== null) {
              propertyGroup.AddProperty(elemProperty);
            }
          });

          if (propertyGroup.PropertyCount() > 0) {
            element.AddPropertyGroup(propertyGroup);
          }
        });
      };

      for (var i = 0; i < lines.size(); i++) {
        var _ret = _loop(i);

        if (_ret === "continue") continue;
      }
    }
  }, {
    key: "GetMaterialIndexByColor",
    value: function GetMaterialIndexByColor(ifcColor) {
      var color = RGBColorFromFloatComponents(ifcColor.x, ifcColor.y, ifcColor.z);
      var alpha = parseInt(ifcColor.w * 255.0, 10);
      return this.colorToMaterial.GetMaterialIndex(color.r, color.g, color.b, alpha);
    }
  }, {
    key: "GetIFCString",
    value: function GetIFCString(ifcString) {
      var decoded = this.DecodeIFCString(ifcString);

      if (decoded.length === 0) {
        decoded = '-';
      }

      return decoded;
    }
  }, {
    key: "DecodeIFCString",
    value: function DecodeIFCString(ifcString) {
      // TODO: https://github.com/tomvandig/web-ifc/issues/58
      var ifcUnicodeRegEx = /\\X2\\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)\\X0\\/ig;
      var resultString = ifcString;
      var match = ifcUnicodeRegEx.exec(ifcString);

      while (match) {
        var unicodeChar = String.fromCharCode(parseInt(match[1], 16));
        resultString = resultString.replace(match[0], unicodeChar);
        match = ifcUnicodeRegEx.exec(ifcString);
      }

      return resultString;
    }
  }]);

  return ImporterIfc;
}(ImporterBase);