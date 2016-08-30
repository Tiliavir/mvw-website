/// <reference path="../main.d.ts" />

interface String {
  endsWith: (suffix : string) => boolean;
}

module MVW {
  if (typeof String.prototype.endsWith !== "function") {
    String.prototype.endsWith = function (suffix : string) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }
}
