function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Exporter3dm } from "./exporter3dm.js";
import { ExporterBim } from "./exporterbim.js";
import { ExporterGltf } from "./exportergltf.js";
import { ExporterModel } from "./exportermodel.js";
import { ExporterObj } from "./exporterobj.js";
import { ExporterOff } from "./exporteroff.js";
import { ExporterPly } from "./exporterply.js";
import { ExporterStl } from "./exporterstl.js";
export var Exporter = /*#__PURE__*/function () {
  function Exporter() {
    _classCallCheck(this, Exporter);

    this.exporters = [new ExporterObj(), new ExporterStl(), new ExporterPly(), new ExporterOff(), new ExporterGltf(), new Exporter3dm(), new ExporterBim()];
  }

  _createClass(Exporter, [{
    key: "AddExporter",
    value: function AddExporter(exporter) {
      this.exporters.push(exporter);
    }
  }, {
    key: "Export",
    value: function Export(model, settings, format, extension, callbacks) {
      var exporter = null;

      for (var i = 0; i < this.exporters.length; i++) {
        var currentExporter = this.exporters[i];

        if (currentExporter.CanExport(format, extension)) {
          exporter = currentExporter;
          break;
        }
      }

      if (exporter === null) {
        callbacks.onError();
        return;
      }

      var exporterModel = new ExporterModel(model, settings);
      exporter.Export(exporterModel, format, function (files) {
        if (files.length === 0) {
          callbacks.onError();
        } else {
          callbacks.onSuccess(files);
        }
      });
    }
  }]);

  return Exporter;
}();