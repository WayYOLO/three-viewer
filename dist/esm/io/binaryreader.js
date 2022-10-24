function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

export var BinaryReader = /*#__PURE__*/function () {
  function BinaryReader(arrayBuffer, isLittleEndian) {
    _classCallCheck(this, BinaryReader);

    this.arrayBuffer = arrayBuffer;
    this.dataView = new DataView(arrayBuffer);
    this.isLittleEndian = isLittleEndian;
    this.position = 0;
  }

  _createClass(BinaryReader, [{
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
    key: "GetByteLength",
    value: function GetByteLength() {
      return this.arrayBuffer.byteLength;
    }
  }, {
    key: "Skip",
    value: function Skip(bytes) {
      this.position = this.position + bytes;
    }
  }, {
    key: "End",
    value: function End() {
      return this.position >= this.arrayBuffer.byteLength;
    }
  }, {
    key: "ReadArrayBuffer",
    value: function ReadArrayBuffer(byteLength) {
      var originalBufferView = new Uint8Array(this.arrayBuffer);
      var arrayBuffer = new ArrayBuffer(byteLength);
      var bufferView = new Uint8Array(arrayBuffer);
      var subArray = originalBufferView.subarray(this.position, this.position + byteLength);
      bufferView.set(subArray, 0);
      this.position += byteLength;
      return arrayBuffer;
    }
  }, {
    key: "ReadBoolean8",
    value: function ReadBoolean8() {
      var result = this.dataView.getInt8(this.position);
      this.position = this.position + 1;
      return result ? true : false;
    }
  }, {
    key: "ReadCharacter8",
    value: function ReadCharacter8() {
      var result = this.dataView.getInt8(this.position);
      this.position = this.position + 1;
      return result;
    }
  }, {
    key: "ReadUnsignedCharacter8",
    value: function ReadUnsignedCharacter8() {
      var result = this.dataView.getUint8(this.position);
      this.position = this.position + 1;
      return result;
    }
  }, {
    key: "ReadInteger16",
    value: function ReadInteger16() {
      var result = this.dataView.getInt16(this.position, this.isLittleEndian);
      this.position = this.position + 2;
      return result;
    }
  }, {
    key: "ReadUnsignedInteger16",
    value: function ReadUnsignedInteger16() {
      var result = this.dataView.getUint16(this.position, this.isLittleEndian);
      this.position = this.position + 2;
      return result;
    }
  }, {
    key: "ReadInteger32",
    value: function ReadInteger32() {
      var result = this.dataView.getInt32(this.position, this.isLittleEndian);
      this.position = this.position + 4;
      return result;
    }
  }, {
    key: "ReadUnsignedInteger32",
    value: function ReadUnsignedInteger32() {
      var result = this.dataView.getUint32(this.position, this.isLittleEndian);
      this.position = this.position + 4;
      return result;
    }
  }, {
    key: "ReadFloat32",
    value: function ReadFloat32() {
      var result = this.dataView.getFloat32(this.position, this.isLittleEndian);
      this.position = this.position + 4;
      return result;
    }
  }, {
    key: "ReadDouble64",
    value: function ReadDouble64() {
      var result = this.dataView.getFloat64(this.position, this.isLittleEndian);
      this.position = this.position + 8;
      return result;
    }
  }]);

  return BinaryReader;
}();