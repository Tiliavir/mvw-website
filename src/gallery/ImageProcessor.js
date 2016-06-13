"use strict";

const pad = require("pad");

var images = {};
var restored = false;
var galleryTitles = {};
var galleryCount = {};

var extensionRegex = /(\..{3,4})$/;

function getInfoFromFile(file) {
  var info = file.relative.split("\\");

  var p = "";
  if (info.length === 4) {
    p = info[2];
  }

  var fn = info[info.length - 1];
  return {
    year: info[0],
    gallery: info[1],
    prefix: p,
    filename: fn,
    title: fn.replace(extensionRegex, ""),
    extension: extensionRegex.exec(fn)[1]
  }
}

module.exports = {
  foldername: "",
  filename: "",

  init: function (oldGalleries, state) {
    if (!oldGalleries || !state) {
      return false;
    }

    images = oldGalleries;
    restored = true;
    galleryTitles = state.titles;
    galleryCount = state.count;
    return true;
  },

  addInformation: function (file) {
    var info = getInfoFromFile(file);

    var year = images[info.year] || (images[info.year] = {});
    var gallery = year[info.gallery];
    if (!gallery) {
      gallery = (year[info.gallery] = []);
      galleryCount[info.year] = (galleryCount[info.year] || 0) + 1;
    }

    var filecount = Object.keys(gallery || []).length;
    this.filename = pad(5, filecount, "0") + info.extension.toLowerCase();
    this.foldername = pad(3, galleryCount[info.year], "0");

    galleryTitles[info.year + "_" + this.foldername] = info.gallery;

    gallery.push({
      t: info.title,
      f: this.filename,
      b: info.year + "/" + this.foldername + "/",
      o: { },
      m: { },
      s: { }
    });
  },

  addSize: function (file, size) {
    var info = getInfoFromFile(file);
    var galleryTitle = galleryTitles[info.year + "_" + info.gallery];
    var e = images[info.year][galleryTitle].filter(function(o) {
      return o.f.toUpperCase() === info.filename.toUpperCase();
    })[0][info.prefix || "o"];

    e.w = size.width;
    e.h = size.height;
  },

  writeFiles: function (writer, path) {
    writer(path + (restored ? "new_" : "") + "galleries.json", JSON.stringify(images));
    var state = {
      titles: galleryTitles,
      count: galleryCount
    };
    writer(path + "state.json", JSON.stringify(state));
  }
}
