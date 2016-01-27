/// <binding AfterBuild='default' Clean='clean' ProjectOpened='development' />

(function (require) {
  "use strict";

  var gulp = require("gulp"),
      args = require("yargs").argv,
      del = require("del"),
      fs = require("fs"),
      lazypipe = require("lazypipe"),
      marked = require("marked"),
      moment = require("moment"),
      os = require("os"),
      parallel = require("concurrent-transform"),
      sizeOf = require("image-size"),
      through = require("through2"),
      $ = require("gulp-load-plugins")();

  var settings = require("./data/settings.json"),
      structure = require("./StructureWalker.js"),
      img = require("./ImageProcessor.js");

  var paths = {
    temp: "./temp/",
    dest: "./build/",
    styles: "./styles/",
    assets: "./assets/",
    scripts: "./scripts/",
    tests: "./scripts_tests/"
  };

  var libraryJSBootstrap = "./bower_modules/bootstrap/dist/js/bootstrap.min.js";
  var librariesJS = [
    "./bower_modules/jquery/dist/jquery.min.js",
    "./bower_modules/photoswipe/dist/photoswipe.min.js",
    "./bower_modules/photoswipe/dist/photoswipe-ui-default.min.js"
  ];

  var librariesCSS = [
    "./bower_modules/bootstrap/dist/css/bootstrap.min.css",
    "./bower_modules/bootstrap/dist/css/bootstrap-theme.min.css",
    "./bower_modules/photoswipe/dist/photoswipe.css",
    "./bower_modules/photoswipe/dist/default-skin/default-skin.css"
  ];

  var isRelease = !!args.release;
  isRelease = true;

  gulp.task("watch", function() {
    gulp.watch(paths.styles + "**/*.scss", ["styles_sass"]);
    return gulp.watch(paths.scripts + "**/*.ts", ["scripts_app_compile"]);
  });

  gulp.task("scripts_tsd", function (callback) {
    return $.tsd({
      "command": "reinstall",
      "latest": false,
      "config": "./tsd.json"
    }, callback);
  });

  gulp.task("clean", function () {
    del.sync(paths.temp);
    del.sync("./bin/");
    del.sync("./obj/");
    return del.sync([paths.dest + "**/*", "!" + paths.dest + "gallery", "!" + paths.dest + "gallery/**/*"], { force: true });
  });

  gulp.task("copy_toWebServer", function () {
    gulp.src([paths.dest + "**/*.*", "!**/state.json"])
        .pipe(gulp.dest(settings.paths.webServerPath));
    return gulp.src(["./bower_modules/photoswipe/dist/default-skin/*.*", "!**/*.css"])
        .pipe(gulp.dest(settings.paths.webServerPath + "css/"));
  });

  gulp.task("copy_toProdDiff", function () {
    return gulp.src(paths.dest + "**/*")
               .pipe(gulp.dest(settings.paths.prodDiff))
               .pipe($.jsbeautifier({
                 indentSize: 2,
                 mode: "VERIFY_AND_WRITE"
               }))
               .pipe(gulp.dest(settings.paths.prodDiff + "beautified/"));
  });

  gulp.task("styles_sass", function () {
    return gulp.src(paths.styles + "**/*.scss")
      .pipe($.sass({ outputStyle: "compressed" })
        .on("error", $.sass.logError))
      .pipe(gulp.dest(paths.dest + "css/"));
  });

  gulp.task("styles_css", ["styles_sass"], function () {
   return gulp.src(librariesCSS).pipe($.concat("libs.css"))
      .pipe(gulp.dest(paths.dest + "css/"));
  });

  gulp.task("scripts_tslint", function () {
    return gulp.src([paths.scripts + "**/*.ts", paths.tests + "**/*.ts"])
        .pipe($.tslint())
        .pipe($.tslint.report("verbose"));
  });

  function processTS(paths, dest, filename) {
    return gulp.src(paths)
        .pipe($.typescript({
          removeComments: true,
          sortOutput: true,
          out: filename,
          noImplicitAny: true
        }))
        .pipe($.if(isRelease, $.uglify()))
        .pipe(gulp.dest(dest));
  };

  gulp.task("scripts_app_compile", ["scripts_tslint"], function () {
    return processTS(paths.scripts + "**/*.ts", paths.dest + "js/", "app.js");
  });

  gulp.task("scripts_tests_compile", ["scripts_tslint"], function () {
    return processTS(paths.tests + "/**/*.ts", paths.tests, "tests.js");
  });

  gulp.task("scripts_libs_compile", function () {
    gulp.src(libraryJSBootstrap).pipe(gulp.dest(paths.dest + "js/"));
    return gulp.src(librariesJS).pipe($.concat("libs.js"))
               .pipe(gulp.dest(paths.dest + "js/"));
  });

  gulp.task("scripts_tests", ["scripts_libs_compile", "scripts_app_compile", "scripts_tests_compile"], function () {
    return gulp.src([paths.dest + "js/app.js", paths.tests + "*.js"])
        .pipe($.jasminePhantom({
          integration: true,
          vendor: paths.dest + "js/libs.js",
          keepRunner: "./"
        }));
  });

  gulp.task("sitemap", function () {
      return gulp.src(paths.dest + "**/*.html")
      .pipe($.sitemap({
        siteUrl: settings.baseUrl,
        changefreq: "monthly"
      }))
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task("html_preprocess", function () {
    var distinctNames = {};
    require("./assets/pages/data/register.json").map(function(p) {
        return p.name + " " + p.familyName;
      }).forEach(function(p) {
        distinctNames[p] = true;
    });
    var numberOfMusicians = Object.keys(distinctNames).length;

    if (!numberOfMusicians || numberOfMusicians < 30 || numberOfMusicians > 70) {
      $.util.log("Unexpected number of musicians calculated:", numberOfMusicians);
      throw ("Unexpected number of musicians calculated: " + numberOfMusicians);
    }

    fs.writeFileSync(paths.temp + "siteOverviewList.jade", structure.writeNavigation("allplain"));
    fs.writeFileSync(paths.temp + "topnavigation.jade", structure.writeNavigation("top"));
    fs.writeFileSync(paths.temp + "footernavigation.jade", structure.writeNavigation("footer"));

    return gulp.src(paths.assets + "pages/**/*")
      .pipe($.replace("<!--PRE:NUMBEROFMUSICIANS-->", numberOfMusicians))
      .pipe($.replace(/^(\s*#+) /gm, "$1# "))
      // todo : datums format in e.g. berichte
      .pipe(gulp.dest(paths.temp));
  });

  gulp.task("html_generatePages", ["html_preprocess"], function () {
    var termine = require(paths.assets + "pages/data/termine.json");
    var berichte = require(paths.assets + "pages/data/berichte.json");
    var vorstand = require(paths.assets + "pages/data/vorstand.json");
    var register = require(paths.assets + "pages/data/register.json");
    var jugendRegister = require(paths.assets + "pages/data/jugend-register.json");
    var news = require(paths.assets + "pages/data/news.json");
    var galleries = require(paths.dest + "gallery/galleries.json");

    var last;
    structure.performActionOnLeaf(function(entry, breadcrumb) {
      var referencedFile = entry.referencedFile;
      if(referencedFile) {
        $.util.log("- processing:", entry.title + ": " + referencedFile);
        last = gulp.src(paths.temp + "template.jade")
                   .pipe($.rename(referencedFile + ".html"))
                   .pipe($.replace("<!--PRE:HEADER-->", entry.hasHeader ? "include ./headers/" + referencedFile + ".jade" : ""))
                   .pipe($.replace("<!--PRE:CONTENT-->", "include ./partials/" + referencedFile + ".jade"))
                   .pipe($.jade({
                     locals: {
                       moment: moment,
                       marked: marked,

                       isRelease: isRelease,

                       siteTitle: (referencedFile === "index" ? "" : entry.title + " | ") + settings.siteTitle,
                       baseUrl:  isRelease ? settings.baseUrl : "/",
                       pageTitle: entry.title,
                       pageSubTitle: entry.subtitle,
                       breadcrumb: !entry.hideBreadcrumb && breadcrumb && breadcrumb.length > 1 ? structure.getBreadcrumbHtml(breadcrumb) : null,

                       termine: termine,
                       berichte: berichte,
                       vorstand: vorstand,
                       register: register,
                       jugendRegister: jugendRegister,
                       news: news,
                       galleries: galleries
                     },
                     pretty: !isRelease
                   }))
                   .pipe(gulp.dest(paths.dest));
      }
    });
    return last;
  });

  gulp.task("html_minify", function () {
    return gulp.src(paths.dest + "**/*.html")
               .pipe($.minifyHtml({ conditionals: true }))
               .pipe(gulp.dest(paths.dest));
  });

  gulp.task("html_validate", function () {
    return gulp.src(paths.dest + "**/*.html")
               .pipe($.w3cjs());
    // todo : verfiy, that there is no unreplaced "<!--PRE:"
  });

  gulp.task("html_bootlint", function () {
    return gulp.src(paths.dest + "**/*.html")
               .pipe($.bootlint());
  });

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

  gulp.task("gallery_resize", function () {
    var images = null;
    var state = null;
    try {
      images = require(paths.dest + "/gallery/galleries.json");
      state = require(paths.dest + "/gallery/state.json");
    } catch (e) {
    }
    if (!img.init(images, state)) {
      $.util.log("Could not restore gallery information - will start fom scratch!");
    }

    return gulp.src(settings.paths.gallerySource + "**/*.{png,jpg,jpeg,PNG,JPG,JPEG}",
                    { base: settings.paths.gallerySource })
               .pipe(through.obj(function (chunk, enc, cb) {
                 img.addInformation(chunk, isRelease);
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

  gulp.task("gallery_writeInfo", ["gallery_resize"], function () {
    img.writeFiles(fs.writeFileSync, paths.dest + "/gallery/");
  });

  gulp.task("default", $.sequence(["styles_css", "scripts_tests", "html_generatePages"], "html_minify", ["html_bootlint", "html_validate", "sitemap"]));

  gulp.task("development", ["scripts_tsd", "watch"]);
})(require);