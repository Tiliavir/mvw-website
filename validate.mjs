'use strict';

import glob from "glob-all";
import vnuJar from 'vnu-jar';

await glob([
    'public/**/*.html',
    'public/**/*.svg',
    'public/**/*.css',
    '!public/google*.html'],
  async (err, files) => {
    await vnuJar.vnu.check([
        "--also-check-svg",
        "--also-check-css",
        "--filterpattern",
        ".*view-transition.*|.*CSS: Parse Error.*",
        ...files
      ],
      {});
  }
);
