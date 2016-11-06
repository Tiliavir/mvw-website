"use strict";

var lunr = require('lunr');

var store = {};
var index= lunr(function () {
                  this.field('title', { boost: 10 });
                  this.field('keywords', { boost: 6 });
                  this.field('description', { boost: 3 });
                  this.field('body');
                  this.ref('href');
                });

module.exports = {
  add: function (file) {
    let data = file.contents.toString();
    if (file.data.scope.hasOwnProperty(file.data.referencedFile)) {
      data += JSON.stringify(file.data.scope[file.data.referencedFile]).replace(/\[|\]|\)|\(|\{|\}|\"|:/g, " ");
    }

    var doc = {
      'title': file.data.title,
      'keywords': file.data.keywords,
      'description': file.data.description,
      'body': data,
      'href': file.data.referencedFile
    };

    store[doc.href] = {
      'title': doc.title,
      'description': doc.description
    };

    index.add(doc);
  },

  write: function(dest) {
    fs.writeFileSync(dest, JSON.stringify({
      index: index,
      store: store
    }));
  }
}
