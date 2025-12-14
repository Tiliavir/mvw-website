'use strict';

import glob from "glob-all";
import {w3cHtmlValidator} from "w3c-html-validator";

glob([
    'public/**/*.html',
    '!public/google*.html'],
  async (err, files) => {
    for (const file of files) {
      const r = await w3cHtmlValidator.validate({filename: file});
      w3cHtmlValidator.reporter(r);

      if (!r.validates) {
        throw new Error('Validation failed!');
      }
    }
  }
);
