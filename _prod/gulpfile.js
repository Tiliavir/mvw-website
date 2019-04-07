(function (require) {
  "use strict";

  const gulp = require("gulp"),
        $ = require("gulp-load-plugins")();

  const paths = {
    src: "./artifacts/",
    beauty: "./beautified/"
  };

  gulp.task("html:validate", function () {
    return gulp.src(paths.src + "*.html")
               .pipe($.w3cjs());
  });

  gulp.task("beautify", function () {
    return gulp.src([paths.src + "**/*.html", paths.src + "gallery/*.json"])
               .pipe($.jsbeautifier({
                 indent_size: 2,
                 operator_position: "after-newline"
               }))
               .pipe(gulp.dest(paths.beauty));
  });

  gulp.task("default", gulp.parallel("html:validate", "beautify"));
})(require);
