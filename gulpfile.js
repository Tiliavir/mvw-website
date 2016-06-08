/// <binding AfterBuild='default' Clean='clean' ProjectOpened='development' />

(function (require) {
  "use strict";

  const gulp = require("gulp"),
      del = require("del"),
      fs = require("fs"),
      path = require("path"),
      marked = require("marked"),
      moment = require("moment"),
      args   = require('yargs').argv,
      $ = require("gulp-load-plugins")(),
      structure = require("./src/static_site_creator/structure/StructureWalker.js");

  let isRelease = args.release || false;
  let baseUrl = isRelease ? "http://www.mv-wollbach.de/" : "http://localhost/";

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

  gulp.task("typings", function () {
    return gulp.src("./typings.json")
               .pipe($.typings()); ;
  });
  
  gulp.task("bower", function () {
    return $.bower();
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
               .pipe(gulp.dest(paths.assets + "/pages/css/"));
  });

  gulp.task("scripts:tslint", function () {
    return gulp.src([paths.scripts + "**/*.ts", paths.pageScripts + "**/*.ts"])
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
    processTS(paths.scripts + "**/*.ts", paths.assets + "pages/js/", "app.js");
    return processTS(paths.pageScripts + "**/*.ts", paths.assets + "pages/js/");
  });

  gulp.task("scripts:compile", ["scripts:app:compile"], function () {
    gulp.src(librariesJS)
        .pipe(gulp.dest(paths.dest + "js/"));

    var galJs = photoswipe.slice();
    galJs.push(paths.temp + "partials/js/bilder.js");
    return gulp.src(galJs)
               .pipe($.concat("bilder.js"))
               .pipe($.uglify())
               .pipe(gulp.dest(paths.assets + "pages/js/"));
  });

  gulp.task("sitemap", function () {
      return gulp.src([paths.dest + "**/*.html", "!**/401.html", "!**/404.html"])
      .pipe($.sitemap({
        siteUrl: baseUrl,
        changefreq: "monthly"
      }))
      .pipe(gulp.dest(paths.dest));
  });
  
  function getNumberOfMusicians(register) {
    var distinctNames = {};
    register.map(function(p) {
        return p.name + " " + p.familyName;
      }).forEach(function(p) {
        distinctNames[p] = true;
    });
    var numberOfMusicians = Object.keys(distinctNames).length;
    if (!numberOfMusicians || numberOfMusicians < 30 || numberOfMusicians > 70) {
      $.util.log("Unexpected number of musicians calculated:", numberOfMusicians);
      throw ("Unexpected number of musicians calculated: " + numberOfMusicians);
    }
    
    return numberOfMusicians;
  }

  gulp.task("html:generatePages", function () {
    structure.init(require(paths.assets + "pages/site-structure.json"));
    fs.writeFileSync(paths.assets + "pages/siteOverviewList.pug", structure.writeNavigation("allplain"));
    fs.writeFileSync(paths.assets + "pages/topnavigation.pug", structure.writeNavigation("top"));
    fs.writeFileSync(paths.assets + "pages/footernavigation.pug", structure.writeNavigation("footer"));

    const scope = {
      register: require(paths.assets + "pages/data/register.json"),
      berichte: require(paths.assets + "pages/data/berichte.json"),
      vorstand: require(paths.assets + "pages/data/vorstand.json"),
      termine: require(paths.assets + "pages/data/termine.json"),

      jugendRegister: require(paths.assets + "pages/data/jugend-register.json"),
      news: require(paths.assets + "pages/data/news.json"),
      galleries: require(paths.assets + "gallery/galleries.json"),

      siteTitle: "Musikverein Wollbach 1866 e.V.",
      baseUrl: baseUrl,
    };
    
    const buildNumber = parseInt((new Date()).valueOf() / 1000000);
    scope.numberOfMusicians = getNumberOfMusicians(scope.register);

 /*   var last;
    structure.performActionOnLeaf(function (entry, breadcrumb) {
      var referencedFile = entry.referencedFile;
      if(referencedFile) {
        $.util.log("- processing:", entry.title + ": " + referencedFile);*/

       /* if (entry.hasAmp) {
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
              .pipe($.pug(  ))
              .pipe(gulp.dest(paths.dest + "amp/"));
        }*/

        return gulp.src(paths.assets + "pages/partials/**/*.pug")
                   .pipe($.rename(function(path) {
                       path.extname = ".html";
                   }))
                   .pipe($.grayMatter())
                   .pipe($.data(function (file) {
                     var filename = path.basename(file.path, path.extname(file.path));
                     return {
                      marked: marked,
                      moment: moment,
                      require: require,

                      isRelease: isRelease,
                      buildNumber: buildNumber,
                      scope: scope,

                      referencedFile: filename,
                      breadcrumb: structure.getBreadcrumbHtml(filename)
                     };
                   }))
                   .pipe($.pug())
                   .pipe($.flatten())
                   .pipe(gulp.dest(paths.dest))

                   /*.pipe($.if(, $.data(function(file) {return {isAmp: true}})))
                   .pipe($.if(, $.pug()))
                   .pipe($.if(, gulp.dest(paths.dest + "amp/")));*/
/*      }
    });
    return last;*/
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
  });

  gulp.task("html:bootlint", function () {
    return gulp.src(paths.dest + "**/*.html")
               .pipe($.bootlint());
  });

  gulp.task("default", $.sequence(["styles:compile", "scripts:compile", "html:generatePages"], "html:minify", ["html:bootlint", "html:validate", "sitemap"]));

  gulp.task("fast", $.sequence(/*["styles:compile", "scripts:compile"],*/ "html:generatePages", ["sitemap", "html:minify"]));

  gulp.task("development", ["typings", "bower"]);
})(require);
