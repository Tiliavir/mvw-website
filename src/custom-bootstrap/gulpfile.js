var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var config = {
  nodeDir: './node_modules',
  publicDir: './public',
};

gulp.task('fonts', function() {
  return gulp.src([
    config.nodeDir + '/bootstrap-sass/assets/fonts/**/*',
  ])
  .pipe(gulp.dest(config.publicDir + '/fonts'));
});

gulp.task('js', function() {
  return gulp.src([
    config.nodeDir + '/bootstrap-sass/assets/javascripts/bootstrap.js',
  ])
  .pipe(gulp.dest(config.publicDir + '/js'));
});

gulp.task('css', function() {
  return gulp.src('css/app.scss')
  .pipe(sass({
    includePaths: [config.nodeDir + '/bootstrap-sass/assets/stylesheets'],
  }))
  .pipe(gulp.dest(config.publicDir + '/css'));
});

gulp.task('default', ['css', 'js', 'fonts']);
