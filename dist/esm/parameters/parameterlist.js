function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Coord3D } from "../geometry/coord3d.js";
import { RGBAColor, RGBColor } from "../model/color.js";
import { Camera } from "../viewer/camera.js";
import { CameraMode } from "../viewer/viewer.js";
export var ParameterConverter = {
  IntegerToString: function IntegerToString(integer) {
    return integer.toString();
  },
  StringToInteger: function StringToInteger(str) {
    return parseInt(str, 10);
  },
  NumberToString: function NumberToString(number) {
    var precision = 5;
    return number.toFixed(precision);
  },
  StringToNumber: function StringToNumber(str) {
    return parseFloat(str);
  },
  ModelUrlsToString: function ModelUrlsToString(urls) {
    if (urls === null) {
      return null;
    }

    return urls.join(',');
  },
  StringToModelUrls: function StringToModelUrls(str) {
    if (str === null || str.length === 0) {
      return null;
    }

    return str.split(',');
  },
  CameraToString: function CameraToString(camera) {
    if (camera === null) {
      return null;
    }

    var cameraParameters = [this.NumberToString(camera.eye.x), this.NumberToString(camera.eye.y), this.NumberToString(camera.eye.z), this.NumberToString(camera.center.x), this.NumberToString(camera.center.y), this.NumberToString(camera.center.z), this.NumberToString(camera.up.x), this.NumberToString(camera.up.y), this.NumberToString(camera.up.z), this.NumberToString(camera.fov)].join(',');
    return cameraParameters;
  },
  CameraModeToString: function CameraModeToString(cameraMode) {
    if (cameraMode === CameraMode.Perspective) {
      return 'perspective';
    } else if (cameraMode === CameraMode.Orthographic) {
      return 'orthographic';
    }

    return null;
  },
  StringToCamera: function StringToCamera(str) {
    if (str === null || str.length === 0) {
      return null;
    }

    var paramParts = str.split(',');

    if (paramParts.length !== 9 && paramParts.length !== 10) {
      return null;
    }

    var fieldOfView = 45.0;

    if (paramParts.length >= 10) {
      fieldOfView = this.StringToNumber(paramParts[9]);
    }

    var camera = new Camera(new Coord3D(this.StringToNumber(paramParts[0]), this.StringToNumber(paramParts[1]), this.StringToNumber(paramParts[2])), new Coord3D(this.StringToNumber(paramParts[3]), this.StringToNumber(paramParts[4]), this.StringToNumber(paramParts[5])), new Coord3D(this.StringToNumber(paramParts[6]), this.StringToNumber(paramParts[7]), this.StringToNumber(paramParts[8])), fieldOfView);
    return camera;
  },
  StringToCameraMode: function StringToCameraMode(str) {
    if (str === 'perspective') {
      return CameraMode.Perspective;
    } else if (str === 'orthographic') {
      return CameraMode.Orthographic;
    }

    return null;
  },
  RGBColorToString: function RGBColorToString(color) {
    if (color === null) {
      return null;
    }

    return [this.IntegerToString(color.r), this.IntegerToString(color.g), this.IntegerToString(color.b)].join(',');
  },
  RGBAColorToString: function RGBAColorToString(color) {
    if (color === null) {
      return null;
    }

    return [this.IntegerToString(color.r), this.IntegerToString(color.g), this.IntegerToString(color.b), this.IntegerToString(color.a)].join(',');
  },
  StringToRGBColor: function StringToRGBColor(str) {
    if (str === null || str.length === 0) {
      return null;
    }

    var paramParts = str.split(',');

    if (paramParts.length !== 3) {
      return null;
    }

    return new RGBColor(this.StringToInteger(paramParts[0]), this.StringToInteger(paramParts[1]), this.StringToInteger(paramParts[2]));
  },
  StringToRGBAColor: function StringToRGBAColor(str) {
    if (str === null || str.length === 0) {
      return null;
    }

    var paramParts = str.split(',');

    if (paramParts.length !== 3 && paramParts.length !== 4) {
      return null;
    }

    var color = new RGBAColor(this.StringToInteger(paramParts[0]), this.StringToInteger(paramParts[1]), this.StringToInteger(paramParts[2]), 255);

    if (paramParts.length === 4) {
      color.a = this.StringToInteger(paramParts[3]);
    }

    return color;
  },
  EnvironmentSettingsToString: function EnvironmentSettingsToString(environmentSettings) {
    if (environmentSettings === null) {
      return null;
    }

    var environmentSettingsParameters = [environmentSettings.environmentMapName, environmentSettings.backgroundIsEnvMap ? 'on' : 'off'].join(',');
    return environmentSettingsParameters;
  },
  StringToEnvironmentSettings: function StringToEnvironmentSettings(str) {
    if (str === null || str.length === 0) {
      return null;
    }

    var paramParts = str.split(',');

    if (paramParts.length !== 2) {
      return null;
    }

    var environmentSettings = {
      environmentMapName: paramParts[0],
      backgroundIsEnvMap: paramParts[1] === 'on' ? true : false
    };
    return environmentSettings;
  },
  EdgeSettingsToString: function EdgeSettingsToString(edgeSettings) {
    if (edgeSettings === null) {
      return null;
    }

    var edgeSettingsParameters = [edgeSettings.showEdges ? 'on' : 'off', this.RGBColorToString(edgeSettings.edgeColor), this.IntegerToString(edgeSettings.edgeThreshold)].join(',');
    return edgeSettingsParameters;
  },
  StringToEdgeSettings: function StringToEdgeSettings(str) {
    if (str === null || str.length === 0) {
      return null;
    }

    var paramParts = str.split(',');

    if (paramParts.length !== 5) {
      return null;
    }

    var edgeSettings = {
      showEdges: paramParts[0] === 'on' ? true : false,
      edgeColor: new RGBColor(this.StringToInteger(paramParts[1]), this.StringToInteger(paramParts[2]), this.StringToInteger(paramParts[3])),
      edgeThreshold: this.StringToInteger(paramParts[4])
    };
    return edgeSettings;
  }
};
export var ParameterListBuilder = /*#__PURE__*/function () {
  function ParameterListBuilder(separator) {
    _classCallCheck(this, ParameterListBuilder);

    this.separator = separator;
    this.paramList = '';
  }

  _createClass(ParameterListBuilder, [{
    key: "AddModelUrls",
    value: function AddModelUrls(urls) {
      this.AddUrlPart('model', ParameterConverter.ModelUrlsToString(urls));
      return this;
    }
  }, {
    key: "AddCamera",
    value: function AddCamera(camera) {
      this.AddUrlPart('camera', ParameterConverter.CameraToString(camera));
      return this;
    }
  }, {
    key: "AddCameraMode",
    value: function AddCameraMode(cameraMode) {
      this.AddUrlPart('cameramode', ParameterConverter.CameraModeToString(cameraMode));
      return this;
    }
  }, {
    key: "AddEnvironmentSettings",
    value: function AddEnvironmentSettings(envSettings) {
      this.AddUrlPart('envsettings', ParameterConverter.EnvironmentSettingsToString(envSettings));
      return this;
    }
  }, {
    key: "AddBackgroundColor",
    value: function AddBackgroundColor(background) {
      this.AddUrlPart('backgroundcolor', ParameterConverter.RGBAColorToString(background));
      return this;
    }
  }, {
    key: "AddDefaultColor",
    value: function AddDefaultColor(color) {
      this.AddUrlPart('defaultcolor', ParameterConverter.RGBColorToString(color));
      return this;
    }
  }, {
    key: "AddEdgeSettings",
    value: function AddEdgeSettings(edgeSettings) {
      this.AddUrlPart('edgesettings', ParameterConverter.EdgeSettingsToString(edgeSettings));
      return this;
    }
  }, {
    key: "AddUrlPart",
    value: function AddUrlPart(keyword, urlPart) {
      if (keyword === null || urlPart === null) {
        return;
      }

      if (this.paramList.length > 0) {
        this.paramList += this.separator;
      }

      this.paramList += keyword + '=' + urlPart;
    }
  }, {
    key: "GetParameterList",
    value: function GetParameterList() {
      return this.paramList;
    }
  }]);

  return ParameterListBuilder;
}();
export var ParameterListParser = /*#__PURE__*/function () {
  function ParameterListParser(paramList, separator) {
    _classCallCheck(this, ParameterListParser);

    this.separator = separator;
    this.paramList = paramList;
  }

  _createClass(ParameterListParser, [{
    key: "GetModelUrls",
    value: function GetModelUrls() {
      // detect legacy links
      if (this.paramList.indexOf('=') === -1) {
        return this.paramList.split(',');
      }

      var keywordParams = this.GetKeywordParams('model');
      return ParameterConverter.StringToModelUrls(keywordParams);
    }
  }, {
    key: "GetCamera",
    value: function GetCamera() {
      var keywordParams = this.GetKeywordParams('camera');
      return ParameterConverter.StringToCamera(keywordParams);
    }
  }, {
    key: "GetCameraMode",
    value: function GetCameraMode() {
      var keywordParams = this.GetKeywordParams('cameramode');
      return ParameterConverter.StringToCameraMode(keywordParams);
    }
  }, {
    key: "GetEnvironmentSettings",
    value: function GetEnvironmentSettings() {
      var environmentSettingsParams = this.GetKeywordParams('envsettings');
      return ParameterConverter.StringToEnvironmentSettings(environmentSettingsParams);
    }
  }, {
    key: "GetBackgroundColor",
    value: function GetBackgroundColor() {
      var backgroundParams = this.GetKeywordParams('backgroundcolor');
      return ParameterConverter.StringToRGBAColor(backgroundParams);
    }
  }, {
    key: "GetDefaultColor",
    value: function GetDefaultColor() {
      var colorParams = this.GetKeywordParams('defaultcolor');
      return ParameterConverter.StringToRGBColor(colorParams);
    }
  }, {
    key: "GetEdgeSettings",
    value: function GetEdgeSettings() {
      var edgeSettingsParams = this.GetKeywordParams('edgesettings');
      return ParameterConverter.StringToEdgeSettings(edgeSettingsParams);
    }
  }, {
    key: "GetKeywordParams",
    value: function GetKeywordParams(keyword) {
      if (this.paramList === null || this.paramList.length === 0) {
        return null;
      }

      var keywordToken = keyword + '=';
      var urlParts = this.paramList.split(this.separator);

      for (var i = 0; i < urlParts.length; i++) {
        var urlPart = urlParts[i];

        if (urlPart.startsWith(keywordToken)) {
          return urlPart.substring(keywordToken.length);
        }
      }

      return null;
    }
  }]);

  return ParameterListParser;
}();
export function CreateUrlBuilder() {
  return new ParameterListBuilder('$');
}
export function CreateUrlParser(urlParams) {
  return new ParameterListParser(urlParams, '$');
}
export function CreateModelUrlParameters(urls) {
  var builder = CreateUrlBuilder();
  builder.AddModelUrls(urls);
  return builder.GetParameterList();
}