'use strict';

import glob from "glob-all";
import {w3cHtmlValidator} from "w3c-html-validator";

glob([
    'public/**/*.html',
    '!public/google*.html',
    '!public/amp/**'],
  async (err, files) => {
    const promises = files.map(file => w3cHtmlValidator.validate({filename: file}));

    let results = await Promise.all(promises);

    results.forEach(vr => w3cHtmlValidator.reporter(vr));
    if (!results.reduce((p, c) => p && c.validates, true)) {
      throw new Error('Validation failed!');
    }
  }
);
