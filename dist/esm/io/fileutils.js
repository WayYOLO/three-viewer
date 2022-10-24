export var FileSource = {
  Url: 1,
  File: 2,
  Decompressed: 3
};
export var FileFormat = {
  Text: 1,
  Binary: 2
};
export function GetFileName(filePath) {
  var firstSeparator = filePath.lastIndexOf('/');

  if (firstSeparator === -1) {
    firstSeparator = filePath.lastIndexOf('\\');
  }

  var fileName = filePath;

  if (firstSeparator !== -1) {
    fileName = filePath.substring(firstSeparator + 1);
  }

  var firstParamIndex = fileName.indexOf('?');

  if (firstParamIndex !== -1) {
    fileName = fileName.substring(0, firstParamIndex);
  }

  return decodeURI(fileName);
}
export function GetFileExtension(filePath) {
  var fileName = GetFileName(filePath);
  var firstPoint = fileName.lastIndexOf('.');

  if (firstPoint === -1) {
    return '';
  }

  var extension = fileName.substring(firstPoint + 1);
  return extension.toLowerCase();
}
export function RequestUrl(url, onProgress) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onprogress = function (event) {
      onProgress(event.loaded, event.total);
    };

    request.onload = function () {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject();
      }
    };

    request.onerror = function () {
      reject();
    };

    request.responseType = 'arraybuffer';
    request.send(null);
  });
}
export function ReadFile(file, onProgress) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();

    reader.onprogress = function (event) {
      onProgress(event.loaded, event.total);
    };

    reader.onloadend = function (event) {
      if (event.target.readyState === FileReader.DONE) {
        resolve(event.target.result);
      }
    };

    reader.onerror = function () {
      reject();
    };

    reader.readAsArrayBuffer(file);
  });
}
export function TransformFileHostUrls(urls) {
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];

    if (url.search(/www\.dropbox\.com/) !== -1) {
      url = url.replace('www.dropbox.com', 'dl.dropbox.com');
      var separatorPos = url.indexOf('?');

      if (separatorPos !== -1) {
        url = url.substring(0, separatorPos);
      }

      urls[i] = url;
    } else if (url.search(/github\.com/) !== -1) {
      url = url.replace('github.com', 'raw.githubusercontent.com');
      url = url.replace('/blob', '');

      var _separatorPos = url.indexOf('?');

      if (_separatorPos !== -1) {
        url = url.substring(0, _separatorPos);
      }

      urls[i] = url;
    }
  }
}
export function IsUrl(str) {
  var regex = /^https?:\/\/\S+$/g;
  var match = str.match(regex);
  return match !== null;
}