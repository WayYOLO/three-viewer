function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

export var TextWriter = /*#__PURE__*/function () {
  function TextWriter() {
    _classCallCheck(this, TextWriter);

    this.text = '';
    this.indentation = 0;
  }

  _createClass(TextWriter, [{
    key: "GetText",
    value: function GetText() {
      return this.text;
    }
  }, {
    key: "Indent",
    value: function Indent(diff) {
      this.indentation += diff;
    }
  }, {
    key: "WriteArrayLine",
    value: function WriteArrayLine(arr) {
      this.WriteLine(arr.join(' '));
    }
  }, {
    key: "WriteLine",
    value: function WriteLine(str) {
      this.WriteIndentation();
      this.Write(str + '\n');
    }
  }, {
    key: "WriteIndentation",
    value: function WriteIndentation() {
      for (var i = 0; i < this.indentation; i++) {
        this.Write('  ');
      }
    }
  }, {
    key: "Write",
    value: function Write(str) {
      this.text += str;
    }
  }]);

  return TextWriter;
}();