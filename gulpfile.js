"use strict";
var fs = require("fs");
var gulp = require("gulp");
var moment = require("moment");
var path = require("path");
var yargs = require("yargs");
var gulpLoadPlugins = require("gulp-load-plugins");
var mvw_navigation_1 = require("mvw-navigation");
var mvw_search_index_1 = require("mvw-search-index");
var isRelease = yargs["default"]("release", false).boolean("release").argv;
var baseUrl = isRelease ? "http://www.mv-wollbach.de/" : "http://localhost/";
var navigation;
var searchIndex = new mvw_search_index_1.SearchIndex();
var $ = gulpLoadPlugins();
var paths = {
    dest: "./build/",
    assets: "./assets/"
};
gulp.task("sitemap", function () {
    return gulp.src([paths.dest + "**/*.html", "!**/401.html", "!**/404.html"])
        .pipe($.sitemap({
        siteUrl: baseUrl,
        changefreq: "monthly"
    }))
        .pipe(gulp.dest(paths.dest));
});
gulp.task("html:writeNavigation", function () {
    navigation = new mvw_navigation_1.Navigation(require(paths.assets + "pages/site-structure.json"));
    fs.writeFileSync(paths.assets + "pages/siteOverviewList.pug", navigation.writeNavigation("allplain"));
    fs.writeFileSync(paths.assets + "pages/topnavigation.pug", navigation.writeNavigation("top"));
    fs.writeFileSync(paths.assets + "pages/footernavigation.pug", navigation.writeNavigation("footer"));
});
gulp.task("html:generatePages", ["html:writeNavigation"], function () {
    var scope = {
        register: require(paths.assets + "pages/data/register.json"),
        berichte: require(paths.assets + "pages/data/berichte.json"),
        vorstand: require(paths.assets + "pages/data/vorstand.json"),
        termine: require(paths.assets + "pages/data/termine.json"),
        jugendRegister: require(paths.assets + "pages/data/jugend-register.json"),
        news: require(paths.assets + "pages/data/news.json"),
        galleries: require(paths.assets + "gallery/galleries.json"),
        siteTitle: "Musikverein Wollbach 1866 e.V.",
        baseUrl: baseUrl,
        numberOfMusicians: 0
    };
    var getNumberOfMusicians = function (register) {
        var distinctNames = {};
        register.map(function (p) {
            return p.name + " " + p.familyName;
        }).forEach(function (p) {
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
            breadcrumb: filename === "index" ? null : navigation.getBreadcrumb(filename, true)
        };
    };
    return gulp.src(paths.assets + "pages/partials/**/*.pug")
        .pipe($.replace(/^(\s*#+) /gm, "$1# "))
        .pipe($.rename(function (path) { path.ext = ".html"; }))
        .pipe($.grayMatter())
        .pipe($.data(getScope))
        .pipe($.data(function (file) {
        searchIndex.add(file, file.data);
    }))
        .pipe($.pug())
        .pipe($.flatten())
        .pipe(gulp.dest(paths.dest));
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
gulp.task("search:index", function () {
    fs.writeFileSync(paths.dest + "index.json", JSON.stringify(searchIndex.getResult()));
});
gulp.task("default", $.sequence("html:generatePages", "search:index"));
gulp.task("release", $.sequence("html:generatePages", "sitemap", "html:minify", "search:index"));
