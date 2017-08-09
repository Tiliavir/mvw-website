import * as fs from "fs";
import * as File from "vinyl";
import * as gulp from "gulp";
import * as moment from "moment";
import "moment/locale/de";
import * as marked from "marked"
import * as path from "path";
import * as yargs from "yargs";
import * as gulpLoadPlugins from "gulp-load-plugins";
import { Navigation } from "mvw-navigation";

var logger = require("gulplog");

let $: any = gulpLoadPlugins();

let isRelease: boolean = yargs.default("release", false).boolean("release").argv.release;
let baseUrl = isRelease ? "https://www.mv-wollbach.de/" : "http://localhost/";

let navigation: Navigation = new Navigation(require("./partials/site-structure.json"));;

const paths: {dest: string} = {
  dest: "./build/",
};

let getScope = (file: File, isAmp: boolean = false) => {
  const filename = path.basename(file.path, path.extname(file.path));
  moment.locale("de");

  return {
    marked: marked,
    moment: moment,
    require: require,

    isAmp: isAmp,
    isRelease: isRelease,
    scope: {
      siteTitle: "Musikverein Wollbach 1866 e.V.",
      baseUrl: baseUrl
    },

    referencedFile: filename,
    breadcrumb: filename === "index" ? null : navigation.getBreadcrumb(filename, true)
  };
};

let build = (path: string, isAmp: boolean, dest: string) => {
  return gulp.src(path)
             .pipe($.replace(/^(\s*#+) /gm, "$1# "))
             .pipe($.rename((path: path.ParsedPath): void => { path.ext = ".html"; }))
             .pipe($.data((f: File) => getScope(f, isAmp)))
             .pipe($.data((f: File) => logger.info("  Starting " + f.relative)))
             .pipe($.pug())
             .pipe($.data((f: File) => logger.info("√ Finished " + f.relative)))
             .pipe($.flatten())
             .pipe(gulp.dest(dest));
}

gulp.task("sitemap", () => {
    return gulp.src([paths.dest + "**/*.html", "!**/401.html"], {
                  read: false
                })
               .pipe($.sitemap({
                 siteUrl: baseUrl,
                 changefreq: "monthly"
               }))
               .pipe(gulp.dest(paths.dest));
});

gulp.task("lint:pug", () => {
  var PugLint = require("pug-lint");
  var linter = new PugLint();
  linter.configure({extends: __dirname + "\\\.pug-lint.json"});

  return gulp.src("./partials/pages/**/*.pug")
              .pipe($.data((f: File) => {
                for (let error of linter.checkPath(f.path)) {
                  logger.warn(`${error.msg}: ${error.filename} ${error.line}:${error.column || 0}`);
                }
              }));
});

gulp.task("html:writeNavigation", (done) => {
  fs.writeFileSync("./partials/siteOverviewList.pug", navigation.writeNavigation("allplain"));
  fs.writeFileSync("./partials/topnavigation.pug", navigation.writeNavigation("top"));
  fs.writeFileSync("./partials/footernavigation.pug", navigation.writeNavigation("footer"));
  done();
});

gulp.task("html:generatePages", () => {
  return build("./partials/pages/**/*.pug", false, paths.dest);
});

gulp.task("html:generateAMP", () => {
  return build("./partials/pages/Blog/*.pug", true, paths.dest + "amp/");
});

gulp.task("html:minify", () => {
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

gulp.task("default", gulp.series("html:writeNavigation", "html:generatePages"));
gulp.task("release", gulp.series("html:writeNavigation", "html:generateAMP", "html:generatePages", "sitemap", "html:minify"));
