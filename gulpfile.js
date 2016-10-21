/// <binding AfterBuild='default' Clean='clean' />

(function (require) {
  "use strict";

  const gulp = require("gulp"),
        fs = require("fs"),
        lunr = require("lunr"),
        path = require("path"),
        marked = require("marked"),
        moment = require("moment"),
        args   = require("yargs").argv,
        $ = require("gulp-load-plugins")(),
        navigation = require("mvw-navigation");

  let isRelease = args.release || false;
  let baseUrl = isRelease ? "http://www.mv-wollbach.de/" : "http://localhost/";

  let searchStore = {};
  let searchIndex = lunr(function () {
    this.field('title', { boost: 10 });
    this.field('keywords', { boost: 6 });
    this.field('description', { boost: 3 });
    this.field('body');
    this.ref('href');
  });

  const paths = {
    dest: "./build/",
    assets: "./assets/"
  };

  gulp.task("beautify", function () {
    return gulp.src(paths.dest + "**/*")
               .pipe($.jsbeautifier({
                 indentSize: 2,
                 mode: "VERIFY_AND_WRITE"
               }))
               .pipe(gulp.dest(paths.dest + "beautified/"));
  });

  gulp.task("sitemap", function () {
      return gulp.src([paths.dest + "**/*.html", "!**/401.html", "!**/404.html"])
      .pipe($.sitemap({
        siteUrl: baseUrl,
        changefreq: "monthly"
      }))
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task("html:writeNavigation", function () {
    navigation.init(require(paths.assets + "pages/site-structure.json"));
    fs.writeFileSync(paths.assets + "pages/siteOverviewList.pug", navigation.writeNavigation("allplain"));
    fs.writeFileSync(paths.assets + "pages/topnavigation.pug", navigation.writeNavigation("top"));
    fs.writeFileSync(paths.assets + "pages/footernavigation.pug", navigation.writeNavigation("footer"));
  });

  gulp.task("html:generatePages", ["html:writeNavigation"], function () {
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

    var getNumberOfMusicians = function (register) {
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
    };

    scope.numberOfMusicians = getNumberOfMusicians(scope.register);

    var getScope = function (file) {
      var filename = path.basename(file.path, path.extname(file.path));
      return {
        marked: marked,
        moment: moment,
        require: require,

        isAmp: false,
        isRelease: isRelease,
        scope: scope,

        referencedFile: filename,
        breadcrumb: filename === "index" ? null : navigation.getBreadcrumbHtml(filename)
      };
    };

    var addToSearch = function (file) {
      let data = file.contents.toString();
      if (file.data.scope.hasOwnProperty(file.data.referencedFile)) {
        data += JSON.stringify(file.data.scope[file.data.referencedFile]).replace(/\[|\]|\)|\(|\{|\}|\"|:/g, " ");
      }

      var doc = {
        'title': file.data.title,
        'keywords': file.data.keywords,
        'description': file.data.description,
        'body': data,
        'href': file.data.referencedFile
      };

      searchStore[doc.href] = {
        'title': doc.title,
        'description': doc.description
      };

      searchIndex.add(doc);
    }

    var hasAmp = function (file) {
      return file.data.hasAmp;
    };

    return gulp.src(paths.assets + "pages/partials/**/*.pug")
               .pipe($.replace(/^(\s*#+) /gm, "$1# "))
               .pipe($.rename(function(path) { path.extname = ".html"; }))
               .pipe($.grayMatter())
               .pipe($.data(getScope))
               .pipe($.data(addToSearch))
               .pipe($.pug())
               .pipe($.flatten())
               .pipe(gulp.dest(paths.dest))

/*
               // https://github.com/pugjs/pug/issues/2367
               .pipe($.if(hasAmp, $.data(function(file) {
                 file.data.isAmp = true;
                 return file.data
               })))
               .pipe($.if(hasAmp, $.pug()))
               .pipe($.if(hasAmp, gulp.dest(paths.dest + "amp/")))
*/
    ;
  });

  gulp.task("html:minify", function () {
    return gulp.src(paths.dest + "**/*.html")
               .pipe($.htmlmin({
                 sortAttributes: true,
                 removeComments: true,
                 collapseWhitespace: true,
                 collapseInlineTagWhitespace: true,
                 removeAttributeQuotes: true,
                 conservativeCollapse: true,
                 minifyJS: true,
                 minifyCSS: true
               }))
               .pipe(gulp.dest(paths.dest));
  });

  gulp.task("html:validate", function () {
    return gulp.src([paths.dest + "**/*.html", "!" + paths.dest + "{beautified,amp}/**/*.html"])
               .pipe($.w3cjs());
  });

  gulp.task("html:bootlint", function () {
    return gulp.src([paths.dest + "**/*.html", "!" + paths.dest + "{beautified,amp}/**/*.html"])
               .pipe($.bootlint());
  });

  gulp.task("search:index", function () {
    fs.writeFileSync(paths.dest + "index.json", JSON.stringify({
      index: searchIndex,
      store: searchStore
    }));
  });

  gulp.task("default", $.sequence("html:generatePages", "search:index"));
  gulp.task("release", $.sequence("html:generatePages", "sitemap", "html:minify", ["search:index", "beautify", "html:bootlint", "html:validate"]));
})(require);
