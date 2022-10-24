function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { IsDefined } from "../core/core.js";
import { Direction } from "../geometry/geometry.js";
import { InputFilesFromFileObjects, InputFilesFromUrls } from "../import/importerfiles.js";
import { ImportErrorCode, ImportSettings } from "../import/importer.js";
import { TransformFileHostUrls } from "../io/fileutils.js";
import { ParameterConverter } from "../parameters/parameterlist.js";
import { ThreeModelLoader } from "../threejs/threemodelloader.js";
import { Viewer } from "./viewer.js";
export var EmbeddedViewer = /*#__PURE__*/function () {
  function EmbeddedViewer(parentElement, parameters) {
    var _this = this;

    _classCallCheck(this, EmbeddedViewer);

    this.parentElement = parentElement;
    this.parameters = {};

    if (IsDefined(parameters)) {
      this.parameters = parameters;
    }

    this.canvas = document.createElement('canvas');
    this.parentElement.appendChild(this.canvas);
    this.viewer = new Viewer();
    this.viewer.Init(this.canvas);
    var width = this.parentElement.clientWidth;
    var height = this.parentElement.clientHeight;
    this.viewer.Resize(width, height);

    if (this.parameters.cameraMode) {
      this.viewer.SetCameraMode(this.parameters.cameraMode);
    }

    if (this.parameters.backgroundColor) {
      this.viewer.SetBackgroundColor(this.parameters.backgroundColor);
    }

    if (this.parameters.edgeSettings) {
      this.viewer.SetEdgeSettings(this.parameters.edgeSettings.showEdges, this.parameters.edgeSettings.edgeColor, this.parameters.edgeSettings.edgeThreshold);
    }

    if (this.parameters.environmentSettings) {
      var environmentMap = this.parameters.environmentSettings.environmentMap;
      var backgroundIsEnvMap = this.parameters.environmentSettings.backgroundIsEnvMap;
      this.viewer.SetEnvironmentMapSettings(environmentMap, backgroundIsEnvMap);
    }

    this.model = null;
    window.addEventListener('resize', function () {
      _this.Resize();
    });
  }

  _createClass(EmbeddedViewer, [{
    key: "LoadModelFromUrlList",
    value: function LoadModelFromUrlList(modelUrls) {
      TransformFileHostUrls(modelUrls);
      var inputFiles = InputFilesFromUrls(modelUrls);
      this.LoadModelFromInputFiles(inputFiles);
    }
  }, {
    key: "LoadModelFromFileList",
    value: function LoadModelFromFileList(fileList) {
      var inputFiles = InputFilesFromFileObjects(fileList);
      this.LoadModelFromInputFiles(inputFiles);
    }
  }, {
    key: "LoadModelFromInputFiles",
    value: function LoadModelFromInputFiles(inputFiles) {
      var _this2 = this;

      if (inputFiles === null || inputFiles.length === 0) {
        return null;
      }

      this.viewer.Clear();
      var settings = new ImportSettings();

      if (this.parameters.defaultColor) {
        settings.defaultColor = this.parameters.defaultColor;
      }

      this.model = null;
      var progressDiv = null;
      var loader = new ThreeModelLoader();
      loader.LoadModel(inputFiles, settings, {
        onLoadStart: function onLoadStart() {
          _this2.canvas.style.display = 'none';
          progressDiv = document.createElement('div');
          progressDiv.innerHTML = 'Loading model...';

          _this2.parentElement.appendChild(progressDiv);
        },
        onFileListProgress: function onFileListProgress(current, total) {},
        onFileLoadProgress: function onFileLoadProgress(current, total) {},
        onImportStart: function onImportStart() {
          progressDiv.innerHTML = 'Importing model...';
        },
        onVisualizationStart: function onVisualizationStart() {
          progressDiv.innerHTML = 'Visualizing model...';
        },
        onModelFinished: function onModelFinished(importResult, threeObject) {
          _this2.parentElement.removeChild(progressDiv);

          _this2.canvas.style.display = 'inherit';

          _this2.viewer.SetMainObject(threeObject);

          var boundingSphere = _this2.viewer.GetBoundingSphere(function (meshUserData) {
            return true;
          });

          _this2.viewer.AdjustClippingPlanesToSphere(boundingSphere);

          if (_this2.parameters.camera) {
            _this2.viewer.SetCamera(_this2.parameters.camera);
          } else {
            _this2.viewer.SetUpVector(Direction.Y, false);

            _this2.viewer.FitSphereToWindow(boundingSphere, false);
          }

          _this2.model = importResult.model;

          if (_this2.parameters.onModelLoaded) {
            _this2.parameters.onModelLoaded();
          }
        },
        onTextureLoaded: function onTextureLoaded() {
          _this2.viewer.Render();
        },
        onLoadError: function onLoadError(importError) {
          var message = 'Unknown error.';

          if (importError.code === ImportErrorCode.NoImportableFile) {
            message = 'No importable file found.';
          } else if (importError.code === ImportErrorCode.FailedToLoadFile) {
            message = 'Failed to load file for import.';
          } else if (importError.code === ImportErrorCode.ImportFailed) {
            message = 'Failed to import model.';
          }

          if (importError.message !== null) {
            message += ' (' + importError.message + ')';
          }

          progressDiv.innerHTML = message;
        }
      });
    }
  }, {
    key: "GetViewer",
    value: function GetViewer() {
      return this.viewer;
    }
  }, {
    key: "GetModel",
    value: function GetModel() {
      return this.model;
    }
  }, {
    key: "Resize",
    value: function Resize() {
      var width = this.parentElement.clientWidth;
      var height = this.parentElement.clientHeight;
      this.viewer.Resize(width, height);
    }
  }]);

  return EmbeddedViewer;
}();
export function Init3DViewerElement(parentElement, modelUrls, parameters) {
  var viewer = new EmbeddedViewer(parentElement, parameters);
  viewer.LoadModelFromUrlList(modelUrls);
  return viewer;
}
export function Init3DViewerElements(onReady) {
  function LoadElement(element) {
    var camera = null;
    var cameraParams = element.getAttribute('camera');

    if (cameraParams) {
      camera = ParameterConverter.StringToCamera(cameraParams);
    }

    var cameraMode = null;
    var cameraModeParams = element.getAttribute('cameramode');

    if (cameraModeParams) {
      cameraMode = ParameterConverter.StringToCameraMode(cameraModeParams);
    }

    var backgroundColor = null;
    var backgroundColorParams = element.getAttribute('backgroundcolor');

    if (backgroundColorParams) {
      backgroundColor = ParameterConverter.StringToRGBAColor(backgroundColorParams);
    }

    var defaultColor = null;
    var defaultColorParams = element.getAttribute('defaultcolor');

    if (defaultColorParams) {
      defaultColor = ParameterConverter.StringToRGBColor(defaultColorParams);
    }

    var edgeSettings = null;
    var edgeSettingsParams = element.getAttribute('edgesettings');

    if (edgeSettingsParams) {
      edgeSettings = ParameterConverter.StringToEdgeSettings(edgeSettingsParams);
    }

    var environmentSettings = null;
    var environmentMapParams = element.getAttribute('environmentmap');

    if (environmentMapParams) {
      var environmentMapParts = environmentMapParams.split(',');

      if (environmentMapParts.length === 6) {
        var backgroundIsEnvMap = false;
        var backgroundIsEnvMapParam = element.getAttribute('environmentmapbg');

        if (backgroundIsEnvMapParam && backgroundIsEnvMapParam === 'true') {
          backgroundIsEnvMap = true;
        }

        environmentSettings = {
          environmentMap: environmentMapParts,
          backgroundIsEnvMap: backgroundIsEnvMap
        };
      }
    }

    var modelUrls = null;
    var modelParams = element.getAttribute('model');

    if (modelParams) {
      modelUrls = ParameterConverter.StringToModelUrls(modelParams);
    }

    return Init3DViewerElement(element, modelUrls, {
      camera: camera,
      cameraMode: cameraMode,
      backgroundColor: backgroundColor,
      defaultColor: defaultColor,
      edgeSettings: edgeSettings,
      environmentSettings: environmentSettings
    });
  }

  var viewerElements = [];
  window.addEventListener('load', function () {
    var elements = document.getElementsByClassName('online_3d_viewer');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var viewerElement = LoadElement(element);
      viewerElements.push(viewerElement);
    }

    if (onReady !== undefined && onReady !== null) {
      onReady(viewerElements);
    }
  });
}