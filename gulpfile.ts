import * as fs from "fs";
import * as File from "vinyl";
import * as gulp from "gulp";
import * as moment from "moment";
import * as marked from "marked"
import * as path from "path";
import * as yargs from "yargs";
import * as gulpLoadPlugins from "gulp-load-plugins";
import { Navigation } from "mvw-navigation";
import { SearchIndex, IFile, IFileInformation } from "mvw-search-index";

let $: any = gulpLoadPlugins();

let isRelease: boolean = yargs.default("release", false).boolean("release").argv.release;
let baseUrl = isRelease ? "https://www.mv-wollbach.de/" : "http://localhost/";

let navigation: Navigation = new Navigation(require("./partials/site-structure.json"));;
let fileCollection: IFile[] = [];

const paths: {dest: string} = {
  dest: "./build/",
};

declare interface IPerson {
  name: string;
  familyName: string;
}

const scope = {
  register: require("./partials/data/register.json"),

  siteTitle: "Musikverein Wollbach 1866 e.V.",
  baseUrl: baseUrl,
  numberOfMusicians: 0
};

let getNumberOfMusicians = (register: IPerson[]) => {
  let distinctNames: {[key: string]: boolean} = {};
  register.map((p) => p.name + " " + p.familyName)
          .forEach((p) => distinctNames[p] = true);
  return Object.keys(distinctNames).length;
};

scope.numberOfMusicians = getNumberOfMusicians(scope.register);

let getScope = (file: File) => {
  const filename = path.basename(file.path, path.extname(file.path));
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

let hasAmp = (file: File) => ((<any> file).data.isAmp = (<any> file).data.hasAmp);

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

gulp.task("html:writeNavigation", (done) => {
  fs.writeFileSync("./partials/siteOverviewList.pug", navigation.writeNavigation("allplain"));
  fs.writeFileSync("./partials/topnavigation.pug", navigation.writeNavigation("top"));
  fs.writeFileSync("./partials/footernavigation.pug", navigation.writeNavigation("footer"));
  done();
});

gulp.task("html:generatePages", (done) => {
  return gulp.src("./partials/pages/**/*.pug")
             .pipe($.replace(/^(\s*#+) /gm, "$1# "))
             .pipe($.rename((path: path.ParsedPath): void => { path.ext = ".html"; }))
             .pipe($.grayMatter())
             .pipe($.data(getScope))
             .pipe($.data((file: File): void => {
               fileCollection.push({
                 file: file,
                 metadata: (<IFileInformation>(<any>file).data)
               });
             }))
             .pipe($.pug())
             .pipe($.flatten())
             .pipe(gulp.dest(paths.dest));
});

gulp.task("html:generateAMP", (done) => {
  return gulp.src("./partials/pages/**/*.pug")
             .pipe($.replace(/^(\s*#+) /gm, "$1# "))
             .pipe($.rename((path: path.ParsedPath): void => { path.ext = ".html"; }))
             .pipe($.grayMatter())
             .pipe($.data(getScope))
             .pipe($.if(hasAmp, $.pug()))
             .pipe($.flatten())
             .pipe($.if(hasAmp, gulp.dest(paths.dest + "amp/")));
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

gulp.task("search:index", (done) => {
  let index = new SearchIndex(fileCollection);
  fs.writeFileSync(paths.dest + "index.json", JSON.stringify(index.getResult()));
  return done();
});

gulp.task("default", gulp.series("html:writeNavigation", "html:generatePages"));
gulp.task("release", gulp.series("html:writeNavigation", "html:generateAMP", "html:generatePages", "sitemap", "html:minify", "search:index"));
