function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

export var BinaryWriter = /*#__PURE__*/function () {
  function BinaryWriter(byteLength, isLittleEndian) {
    _classCallCheck(this, BinaryWriter);

    this.arrayBuffer = new ArrayBuffer(byteLength);
    this.dataView = new DataView(this.arrayBuffer);
    this.isLittleEndian = isLittleEndian;
    this.position = 0;
  }

  _createClass(BinaryWriter, [{
    key: "GetPosition",
    value: function GetPosition() {
      return this.position;
    }
  }, {
    key: "SetPosition",
    value: function SetPosition(position) {
      this.position = position;
    }
  }, {
    key: "End",
    value: function End() {
      return this.position >= this.arrayBuffer.byteLength;
    }
  }, {
    key: "GetBuffer",
    value: function GetBuffer() {
      return this.arrayBuffer;
    }
  }, {
    key: "WriteArrayBuffer",
    value: function WriteArrayBuffer(arrayBuffer) {
      var bufferView = new Uint8Array(arrayBuffer);
      var thisBufferView = new Uint8Array(this.arrayBuffer);
      thisBufferView.set(bufferView, this.position);
      this.position += arrayBuffer.byteLength;
    }
  }, {
    key: "WriteBoolean8",
    value: function WriteBoolean8(val) {
      this.dataView.setInt8(this.position, val ? 1 : 0);
      this.position = this.position + 1;
    }
  }, {
    key: "WriteCharacter8",
    value: function WriteCharacter8(val) {
      this.dataView.setInt8(this.position, val);
      this.position = this.position + 1;
    }
  }, {
    key: "WriteUnsignedCharacter8",
    value: function WriteUnsignedCharacter8(val) {
      this.dataView.setUint8(this.position, val);
      this.position = this.position + 1;
    }
  }, {
    key: "WriteInteger16",
    value: function WriteInteger16(val) {
      this.dataView.setInt16(this.position, val, this.isLittleEndian);
      this.position = this.position + 2;
    }
  }, {
    key: "WriteUnsignedInteger16",
    value: function WriteUnsignedInteger16(val) {
      this.dataView.setUint16(this.position, val, this.isLittleEndian);
      this.position = this.position + 2;
    }
  }, {
    key: "WriteInteger32",
    value: function WriteInteger32(val) {
      this.dataView.setInt32(this.position, val, this.isLittleEndian);
      this.position = this.position + 4;
    }
  }, {
    key: "WriteUnsignedInteger32",
    value: function WriteUnsignedInteger32(val) {
      this.dataView.setUint32(this.position, val, this.isLittleEndian);
      this.position = this.position + 4;
    }
  }, {
    key: "WriteFloat32",
    value: function WriteFloat32(val) {
      this.dataView.setFloat32(this.position, val, this.isLittleEndian);
      this.position = this.position + 4;
    }
  }, {
    key: "WriteDouble64",
    value: function WriteDouble64(val) {
      this.dataView.setFloat64(this.position, val, this.isLittleEndian);
      this.position = this.position + 8;
    }
  }]);

  return BinaryWriter;
}();