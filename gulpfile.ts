import * as fs from "fs";
import * as File from "vinyl";
import * as gulp from "gulp";
import * as moment from "moment";
import * as marked from "marked"
import * as path from "path";
import * as yargs from "yargs";
import * as gulpLoadPlugins from "gulp-load-plugins";
import { Navigation } from "mvw-navigation";
import { SearchIndex } from "mvw-search-index";

let isRelease: boolean = yargs.default("release", false).boolean("release").argv;
let baseUrl = isRelease ? "http://www.mv-wollbach.de/" : "http://localhost/";
let navigation: Navigation;
let searchIndex: SearchIndex = new SearchIndex();
let $: any = gulpLoadPlugins();

const paths: {dest: string, assets: string} = {
  dest: "./build/",
  assets: "./assets/"
};

declare interface IPerson {
  name: string;
  familyName: string;
}

gulp.task("sitemap", () => {
    return gulp.src([paths.dest + "**/*.html", "!**/401.html", "!**/404.html"])
    .pipe($.sitemap({
      siteUrl: baseUrl,
      changefreq: "monthly"
    }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task("html:writeNavigation", () => {
  navigation = new Navigation(require(paths.assets + "pages/site-structure.json"));
  fs.writeFileSync(paths.assets + "pages/siteOverviewList.pug", navigation.writeNavigation("allplain"));
  fs.writeFileSync(paths.assets + "pages/topnavigation.pug", navigation.writeNavigation("top"));
  fs.writeFileSync(paths.assets + "pages/footernavigation.pug", navigation.writeNavigation("footer"));
});

gulp.task("html:generatePages", ["html:writeNavigation"], () => {
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
    numberOfMusicians: 0
  };

  let getNumberOfMusicians = (register: IPerson[]) => {
    let distinctNames: {[key: string]: boolean} = {};
    register.map((p) => {
        return p.name + " " + p.familyName;
      }).forEach((p) => {
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

  var getScope = (file: File) => {
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
              .pipe($.rename((path: path.ParsedPath): void => { path.ext = ".html"; }))
              .pipe($.grayMatter())
              .pipe($.data(getScope))
              .pipe($.data((file: File) => {
                searchIndex.add(file, (<any> file).data);
              }))
              .pipe($.pug())
              .pipe($.flatten())
              .pipe(gulp.dest(paths.dest))
/*
              // https://github.com/pugjs/pug/issues/2367
              .pipe($.if(file.data.hasAmp, $.data(function(file) {
                file.data.isAmp = true;
                return file.data
              })))
              .pipe($.if(file.data.hasAmp, $.pug()))
              .pipe($.if(file.data.hasAmp, gulp.dest(paths.dest + "amp/")))
*/
  ;
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

gulp.task("search:index", () => {
  fs.writeFileSync(paths.dest + "index.json", JSON.stringify(searchIndex.getResult()));
});

gulp.task("default", $.sequence("html:generatePages", "search:index"));
gulp.task("release", $.sequence("html:generatePages", "sitemap", "html:minify", "search:index"));
