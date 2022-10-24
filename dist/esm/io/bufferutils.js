export function ArrayBufferToUtf8String(buffer) {
  var decoder = new TextDecoder('utf-8');
  return decoder.decode(buffer);
}
export function ArrayBufferToAsciiString(buffer) {
  var text = '';
  var bufferView = new Uint8Array(buffer);

  for (var i = 0; i < bufferView.byteLength; i++) {
    text += String.fromCharCode(bufferView[i]);
  }

  return text;
}
export function AsciiStringToArrayBuffer(str) {
  var buffer = new ArrayBuffer(str.length);
  var bufferView = new Uint8Array(buffer);

  for (var i = 0; i < str.length; i++) {
    bufferView[i] = str.charCodeAt(i);
  }

  return buffer;
}
export function Utf8StringToArrayBuffer(str) {
  var encoder = new TextEncoder();
  var uint8Array = encoder.encode(str);
  return uint8Array.buffer;
}
export function Base64DataURIToArrayBuffer(uri) {
  var dataPrefix = 'data:';

  if (!uri.startsWith(dataPrefix)) {
    return null;
  }

  var mimeSeparator = uri.indexOf(';');

  if (mimeSeparator === -1) {
    return null;
  }

  var bufferSeparator = uri.indexOf(',');

  if (bufferSeparator === -1) {
    return null;
  }

  var mimeType = uri.substring(dataPrefix.length, dataPrefix.length + mimeSeparator - 5);
  var base64String = atob(uri.substring(bufferSeparator + 1));
  var buffer = new ArrayBuffer(base64String.length);
  var bufferView = new Uint8Array(buffer);

  for (var i = 0; i < base64String.length; i++) {
    bufferView[i] = base64String.charCodeAt(i);
  }

  return {
    mimeType: mimeType,
    buffer: buffer
  };
}
export function GetFileExtensionFromMimeType(mimeType) {
  if (mimeType === undefined || mimeType === null) {
    return '';
  }

  var mimeParts = mimeType.split('/');

  if (mimeParts.length === 0) {
    return '';
  }

  return mimeParts[mimeParts.length - 1];
}
export function CreateObjectUrl(content) {
  var blob = new Blob([content]);
  var url = URL.createObjectURL(blob);
  return url;
}
export function CreateObjectUrlWithMimeType(content, mimeType) {
  var blob = new Blob([content], {
    type: mimeType
  });
  var url = URL.createObjectURL(blob);
  return url;
}
export function RevokeObjectUrl(url) {
  URL.revokeObjectURL(url);
}