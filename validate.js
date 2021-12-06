'use strict';

const glob = require('glob-all');
const {w3cHtmlValidator} = require('w3c-html-validator');

glob([
    'public/**/*.html',
    '!public/google*.html',
    '!public/amp/**'],
  async (err, files) => {
    const promises = files.map(file => w3cHtmlValidator.validate({filename: file}));

    let results = await Promise.all(promises);

    results.forEach(w3cHtmlValidator.reporter);
    if (!results.reduce((p, c) => p && c.validates, true)) {
      throw new Error('Validation failed!');
    }
  }
);
