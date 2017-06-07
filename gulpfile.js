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
var mvw_search_index_1 = require("mvw-search-index");
var $ = gulpLoadPlugins();
var isRelease = yargs["default"]("release", false).boolean("release").argv.release;
var baseUrl = isRelease ? "https://www.mv-wollbach.de/" : "http://localhost/";
var navigation = new mvw_navigation_1.Navigation(require("./partials/site-structure.json"));
;
var fileCollection = [];
var paths = {
    dest: "./build/"
};
var scope = {
    register: require("./partials/data/register.json"),
    siteTitle: "Musikverein Wollbach 1866 e.V.",
    baseUrl: baseUrl,
    numberOfMusicians: 0
};
var getNumberOfMusicians = function (register) {
    var distinctNames = {};
    register.map(function (p) { return p.name + " " + p.familyName; })
        .forEach(function (p) { return distinctNames[p] = true; });
    return Object.keys(distinctNames).length;
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
        .pipe($.grayMatter())
        .pipe($.data(getScope))
        .pipe($.data(function (file) {
        fileCollection.push({
            file: file,
            metadata: file.data
        });
    }))
        .pipe($.pug())
        .pipe($.flatten())
        .pipe(gulp.dest(paths.dest));
});
gulp.task("html:generateAMP", function (done) {
    return gulp.src("./partials/pages/**/*.pug")
        .pipe($.replace(/^(\s*#+) /gm, "$1# "))
        .pipe($.rename(function (path) { path.ext = ".html"; }))
        .pipe($.grayMatter())
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
gulp.task("search:index", function (done) {
    var index = new mvw_search_index_1.SearchIndex(fileCollection);
    fs.writeFileSync(paths.dest + "index.json", JSON.stringify(index.getResult()));
    return done();
});
gulp.task("default", gulp.series("html:writeNavigation", "html:generatePages"));
gulp.task("release", gulp.series("html:writeNavigation", "html:generateAMP", "html:generatePages", "sitemap", "html:minify", "search:index"));
