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
    dest: "./build/",
    assets: "./assets/",
  };

  function processImage(w, h, p) {
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
          crop: false,
          upscale: false,
          format: "jpg",
          quality: 0.7
        }),
        os.cpus().length)
      .pipe(gulp.dest, paths.dest + "gallery/")
      .pipe(through.obj, function (file, enc, cb) {
        img.addSize(file, sizeOf(file.path));
        cb(null, file);
      });
  }

  gulp.task("gallery:resize", function () {
    var images = null;
    var state = null;
    try {
      images = require(paths.assets + "/gallery/galleries.json");
      state = require(paths.assets + "/gallery/state.json");
    } catch (e) {
    }
    if (!img.init(images, state)) {
      $.util.log("Could not restore gallery information - will start from scratch!");
    }

    return gulp.src(paths.assets + "gallery/**/*.{png,jpg,jpeg,PNG,JPG,JPEG}",
                    { base: paths.assets + "gallery/" })
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

  gulp.task("gallery:writeInfo", ["gallery:resize"], function () {
    img.writeFiles(fs.writeFileSync, paths.dest + "/gallery/");
  });
});