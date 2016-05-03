/// <binding AfterBuild='default' Clean='clean' ProjectOpened='development' />

(function (require) {
  "use strict";

  const gulp = require("gulp"),
      del = require("del"),
      fs = require("fs"),
      lazypipe = require("lazypipe"),
      marked = require("marked"),
      moment = require("moment"),
      os = require("os"),
      parallel = require("concurrent-transform"),
      sizeOf = require("image-size"),
      through = require("through2"),
      args   = require('yargs').argv,
      $ = require("gulp-load-plugins")();

  const structure = require("./StructureWalker.js"),
        img = require("./ImageProcessor.js");

  const paths = {
    temp: "./temp/",
    dest: "./build/",
    styles: "./styles/",
    assets: "./assets/",
    scripts: "./scripts/",
    pageScripts: "./assets/pages/scripts/"
  };

  const librariesJS = [
    "./bower_modules/bootstrap/dist/js/bootstrap.min.js",
    "./bower_modules/jquery/dist/jquery.min.js",
  ];

  const photoswipe = [
    "./bower_modules/photoswipe/dist/photoswipe.min.js",
    "./bower_modules/photoswipe/dist/photoswipe-ui-default.min.js"
  ];

  const bootstrapCSS = [
    "./bower_modules/bootstrap/dist/css/bootstrap.min.css"
  ];

  const photoswipeCSS = [
    "./bower_modules/photoswipe/dist/photoswipe.css",
    "./bower_modules/photoswipe/dist/default-skin/default-skin.css"
  ];

  let isRelease = args.release || false;
  let baseUrl = isRelease ? "http://www.mv-wollbach.de/" : "http://localhost/";

  gulp.task("scripts:typings", function () {
    return gulp.src("./typings.json")
               .pipe($.typings()); ;
  });

  gulp.task("clean", function () {
    del.sync(paths.serve);
    del.sync(paths.temp);
    fs.mkdirSync(paths.temp);
    del.sync("./bin/");
    del.sync("./obj/");
    return del.sync([paths.dest + "**/*"], { force: true });
  });

  gulp.task("serve", function () {
    gulp.src(paths.dest)
        .pipe($.webserver({
          port: '80',
          livereload: true,
          open: true
    }));
  });

  gulp.task("copy:toProdDiff", function () {
    const prodDiff = "E:/Code/MVW.Website/MV.Website.Data.Prod/";
    return gulp.src(paths.dest + "**/*")
               .pipe(gulp.dest(prodDiff))
               .pipe($.jsbeautifier({
                 indentSize: 2,
                 mode: "VERIFY_AND_WRITE"
               }))
               .pipe(gulp.dest(prodDiff + "beautified/"));
  });

  gulp.task("styles:sass", function () {
    return gulp.src(paths.styles + "**/*.scss")
               .pipe($.sass({outputStyle: "compressed" })
                      .on("error", $.sass.logError))
               .pipe(gulp.dest(paths.temp + "css/"));
  });

  gulp.task("styles:compile", ["styles:sass"], function () {
    gulp.src(paths.temp + "css/print.css")
        .pipe($.cssnano({
          discardComments: { removeAll: true },
          zindex: false
        }))
        .pipe(gulp.dest(paths.dest + "css/"));

    gulp.src(photoswipeCSS)
        .pipe($.concat("photoswipe.css"))
        .pipe($.cssnano({
          discardComments: { removeAll: true },
          zindex: false
        }))
        .pipe(gulp.dest(paths.dest + "css/"));

    var css = bootstrapCSS.slice();
    css.push(paths.temp + "css/app.css");
    return gulp.src(css)
               .pipe($.concat("app.css"))
               .pipe($.cssnano({
                 discardComments: { removeAll: true },
                 zindex: false
               }))
               .pipe(gulp.dest(paths.temp + "css/"));
  });

  gulp.task("scripts:tslint", function () {
    return gulp.src([paths.scripts + "**/*.ts", paths.tests + "**/*.ts", paths.pageScripts + "**/*.ts"])
               .pipe($.tslint())
               .pipe($.tslint.report("verbose"));
  });

  function processTS(paths, dest, filename) {
    var options = {
      removeComments: true,
      sortOutput: true,
      noImplicitAny: true
    };

    if (filename) {
      options.out = filename;
    }

    return gulp.src(paths)
               .pipe($.typescript(options))
               .pipe($.if(isRelease, $.uglify()))
               .pipe(gulp.dest(dest));
  };

  gulp.task("scripts:app:compile", ["scripts:tslint"], function () {
    processTS(paths.scripts + "**/*.ts", paths.dest + "js/", "app.js");
    return processTS(paths.pageScripts + "**/*.ts", paths.dest + "js/");
  });

  gulp.task("scripts:compile", ["scripts:app:compile"], function () {
    gulp.src(librariesJS)
        .pipe(gulp.dest(paths.dest + "js/"));

    var galJs = photoswipe.slice();
    // todo : copy bilder to temp and work with that
    galJs.push(paths.dest + "js/bilder.js");
    return gulp.src(galJs)
               .pipe($.concat("bilder.js"))
               .pipe($.uglify())
               .pipe(gulp.dest(paths.dest + "js/"));
  });

  gulp.task("sitemap", function () {
      return gulp.src([paths.dest + "**/*.html", "!**/401.html", "!**/404.html"])
      .pipe($.sitemap({
        siteUrl: baseUrl,
        changefreq: "monthly"
      }))
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task("html:preprocess", function () {
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
    fs.writeFileSync(paths.temp + "siteOverviewList.pug", structure.writeNavigation("allplain"));
    fs.writeFileSync(paths.temp + "topnavigation.pug", structure.writeNavigation("top"));
    fs.writeFileSync(paths.temp + "footernavigation.pug", structure.writeNavigation("footer"));
    return gulp.src(paths.assets + "pages/**/*.pug")
               .pipe($.replace("<!--PRE:NUMBEROFMUSICIANS-->", numberOfMusicians))
               .pipe($.replace(/^(\s*#+) /gm, "$1# "))
               .pipe(gulp.dest(paths.temp));
  });

  gulp.task("html:generatePages", ["html:preprocess"], function () {
    const scope = {
      termine: require(paths.assets + "pages/data/termine.json"),
      berichte: require(paths.assets + "pages/data/berichte.json"),
      vorstand: require(paths.assets + "pages/data/vorstand.json"),
      register: require(paths.assets + "pages/data/register.json"),
      jugendRegister: require(paths.assets + "pages/data/jugend-register.json"),
      news: require(paths.assets + "pages/data/news.json"),
      galleries: require(paths.assets + "gallery/galleries.json"),

      siteTitle: "Musikverein Wollbach 1866 e.V.",
      baseUrl: baseUrl,
    };
    const buildNumber = parseInt((new Date()).valueOf() / 1000000);

    var last;
    structure.performActionOnLeaf(function (entry, breadcrumb) {
      var referencedFile = entry.referencedFile;
      if(referencedFile) {
        $.util.log("- processing:", entry.title + ": " + referencedFile);

        if (entry.hasAmp) {
          gulp.src(paths.temp + "template-amp.pug")
              .pipe($.rename(referencedFile + ".html"))
              .pipe($.replace("<!--PRE:CONTENT-->", "include ./partials/" + referencedFile + ".pug"))
              .pipe($.data(function (file) { return {
                marked: marked,
                moment: moment,
                isAmp: true,
                scope: scope,
                page: entry
              };}))
              .pipe($.pug({
                "pretty": !isRelease
              }))
              .pipe(gulp.dest(paths.dest + "amp/"));
        }

        last = gulp.src(paths.temp + "template.pug")
                   .pipe($.rename(referencedFile + ".html"))
                   .pipe($.replace("<!--PRE:HEADER-->", entry.hasHeader ? "include ./headers/" + referencedFile + ".pug" : ""))
                   .pipe($.replace("<!--PRE:CONTENT-->", "include ./partials/" + referencedFile + ".pug"))
                   .pipe($.data(function (file) { return {
                     marked: marked,
                     moment: moment,

                     isRelease: isRelease,
                     buildNumber: buildNumber,
                     scope: scope,

                     breadcrumb: !entry.hideBreadcrumb && breadcrumb && breadcrumb.length > 1 ? structure.getBreadcrumbHtml(breadcrumb) : null,

                     hasScript: function () {
                       try {
                         fs.accessSync(paths.pageScripts + referencedFile + ".ts", fs.F_OK);
                         return true;
                       } catch (e) {
                         return false
                       }
                     },

                     page: entry
                   };}))
                   .pipe($.pug({
                     pretty: !isRelease
                   }))
                   .pipe(gulp.dest(paths.dest));
      }
    });
    return last;
  });

  gulp.task("html:minify", function () {
    return gulp.src(paths.dest + "**/*.html")
               .pipe($.htmlmin({
                 removeComments: true,
                 collapseWhitespace: true,
                 collapseInlineTagWhitespace: true,
                 removeAttributeQuotes: true,
                 conservativeCollapse: true
               }))
               .pipe(gulp.dest(paths.dest));
  });

  gulp.task("html:validate", function () {
    return gulp.src([paths.dest + "**/*.html", "!" + paths.dest + "amp/**/*.html"])
               .pipe($.w3cjs());
    // todo : verfiy, that there is no unreplaced "<!--PRE:"
  });

  gulp.task("html:bootlint", function () {
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

  gulp.task("default", $.sequence(["styles:compile", "scripts:compile", "html:generatePages"], "html:minify", ["html:bootlint", "html:validate", "sitemap"]));

  gulp.task("development", ["scripts:typings"]);
})(require);
