export function IsDefined(val) {
  return val !== undefined && val !== null;
}
export function ValueOrDefault(val, def) {
  if (val === undefined || val === null) {
    return def;
  }

  return val;
}
export function CopyObjectAttributes(src, dest) {
  if (!IsDefined(src)) {
    return;
  }

  for (var _i = 0, _Object$keys = Object.keys(src); _i < _Object$keys.length; _i++) {
    var attribute = _Object$keys[_i];

    if (IsDefined(src[attribute])) {
      dest[attribute] = src[attribute];
    }
  }
}
export function IsObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
export function EscapeHtmlChars(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}