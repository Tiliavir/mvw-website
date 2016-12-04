(function (require) {
  "use strict";

  const gulp = require("gulp"),
        fs = require("fs"),
        lazypipe = require("lazypipe"),
        parallel = require("concurrent-transform"),
        os = require("os"),
        sizeOf = require("image-size"),
        through = require("through2"),
        $ = require("gulp-load-plugins")();

  const img = require("./ImageProcessor.js");

  const paths = {
    output: "./build/",
    input: "./input/"
  };

  gulp.task("resize", function () {
    var processImage = function (w, h, p) {
      return lazypipe()
        .pipe($.rename, function (path) {
          if (/\\m$/.test(path.dirname) || /\\s$/.test(path.dirname)) {
            path.dirname = path.dirname.substring(0, path.dirname.length - 2);
          }
          path.dirname += (p ? ("/" + p) : "");
        })
        .pipe(parallel, $.imageResize({
            width: w,
            height: h,
            noProfile: true,
            crop: false,
            upscale: false,
            format: "jpg",
            quality: 0.7
          }),
          os.cpus().length)
        .pipe(gulp.dest, paths.output)
        .pipe(through.obj, function (file, enc, cb) {
          img.addSize(file, sizeOf(file.path));
          cb(null, file);
        });
    };

    var images = null;
    var state = null;
    try {
      images = require(paths.input + "galleries.json");
      state = require(paths.input + "state.json");
    } catch (e) {
    }
    if (!img.init(images, state)) {
      $.util.log("Could not restore gallery information - will start from scratch!");
    }

    return gulp.src(paths.input + "**/*.{png,jpg,jpeg,PNG,JPG,JPEG}",
                    { base: paths.input })
                .pipe(through.obj(function (chunk, enc, cb) {
                  img.addInformation(chunk);
                  cb(null, chunk);
                }))
                .pipe($.rename(function (path) {
                  path.basename = img.filename.replace(/(\..{3,4})$/, "");
                  var info = path.dirname.split("\\");
                  path.dirname = path.dirname.replace(info[info.length - 1], img.foldername);
                }))
                .pipe(processImage(1200, 1200, null)())
                .pipe(processImage(800, 800, "m")())
                .pipe(processImage(200, 200, "s")());
  });

  gulp.task("default", ["resize"], function () {
    img.writeFiles(fs.writeFileSync, paths.output);
  });
})(require);
