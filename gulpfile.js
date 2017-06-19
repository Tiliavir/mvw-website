"use strict";
exports.__esModule = true;
var fs = require("fs");
var gulp = require("gulp");
var moment = require("moment");
var marked = require("marked");
var path = require("path");
var yargs = require("yargs");
var gulpLoadPlugins = require("gulp-load-plugins");
var mvw_navigation_1 = require("mvw-navigation");
var $ = gulpLoadPlugins();
var isRelease = yargs["default"]("release", false).boolean("release").argv.release;
var baseUrl = isRelease ? "https://www.mv-wollbach.de/" : "http://localhost/";
var navigation = new mvw_navigation_1.Navigation(require("./partials/site-structure.json"));
;
var paths = {
    dest: "./build/"
};
var getScope = function (file) {
    var filename = path.basename(file.path, path.extname(file.path));
    return {
        marked: marked,
        moment: moment,
        require: require,
        isAmp: false,
        isRelease: isRelease,
        scope: {
            siteTitle: "Musikverein Wollbach 1866 e.V.",
            baseUrl: baseUrl
        },
        referencedFile: filename,
        breadcrumb: filename === "index" ? null : navigation.getBreadcrumb(filename, true)
    };
};
var hasAmp = function (file) { return (file.data.isAmp = file.data.hasAmp); };
gulp.task("sitemap", function () {
    return gulp.src([paths.dest + "**/*.html", "!**/401.html"], {
        read: false
    })
        .pipe($.sitemap({
        siteUrl: baseUrl,
        changefreq: "monthly"
    }))
        .pipe(gulp.dest(paths.dest));
});
gulp.task("html:writeNavigation", function (done) {
    fs.writeFileSync("./partials/siteOverviewList.pug", navigation.writeNavigation("allplain"));
    fs.writeFileSync("./partials/topnavigation.pug", navigation.writeNavigation("top"));
    fs.writeFileSync("./partials/footernavigation.pug", navigation.writeNavigation("footer"));
    done();
});
gulp.task("html:generatePages", function (done) {
    return gulp.src("./partials/pages/**/*.pug")
        .pipe($.replace(/^(\s*#+) /gm, "$1# "))
        .pipe($.rename(function (path) { path.ext = ".html"; }))
        .pipe($.frontMatter({ "property": "data" }))
        .pipe($.data(getScope))
        .pipe($.pug())
        .pipe($.flatten())
        .pipe(gulp.dest(paths.dest));
});
gulp.task("html:generateAMP", function (done) {
    return gulp.src("./partials/pages/**/*.pug")
        .pipe($.replace(/^(\s*#+) /gm, "$1# "))
        .pipe($.rename(function (path) { path.ext = ".html"; }))
        .pipe($.frontMatter({ "property": "data" }))
        .pipe($.data(getScope))
        .pipe($["if"](hasAmp, $.pug()))
        .pipe($.flatten())
        .pipe($["if"](hasAmp, gulp.dest(paths.dest + "amp/")));
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
gulp.task("default", gulp.series("html:writeNavigation", "html:generatePages"));
gulp.task("release", gulp.series("html:writeNavigation", "html:generateAMP", "html:generatePages", "sitemap", "html:minify"));
