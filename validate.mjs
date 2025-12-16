'use strict';

import glob from "glob-all";
import vnuJar from 'vnu-jar';

await glob([
    'public/**/*.html',
    '!public/google*.html'],
  async (err, files) => {
    await vnuJar.vnu.check(files, {});
  }
);
