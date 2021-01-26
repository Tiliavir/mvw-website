(require => {
  "use strict";

  const gulp = require("gulp");
  const w3cjs = require("gulp-w3cjs")();

  gulp.task("default", () => gulp.src("./public/**/*.html").pipe(w3cjs()));
})(require);
