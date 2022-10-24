var externalLibLocation = null;
var loadedExternalLibs = new Set();
export function SetExternalLibLocation(newExternalLibLocation) {
  externalLibLocation = newExternalLibLocation;
}
export function GetExternalLibPath(libName) {
  if (externalLibLocation === null) {
    return null;
  }

  return externalLibLocation + '/' + libName;
}
export function LoadExternalLibrary(libName) {
  return new Promise(function (resolve, reject) {
    if (externalLibLocation === null) {
      reject();
      return;
    }

    if (loadedExternalLibs.has(libName)) {
      resolve();
      return;
    }

    var scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = GetExternalLibPath(libName);

    scriptElement.onload = function () {
      loadedExternalLibs.add(libName);
      resolve();
    };

    scriptElement.onerror = function () {
      reject();
    };

    document.head.appendChild(scriptElement);
  });
}