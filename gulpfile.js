var gulp = require('gulp');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var cssmin = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var pngquant = require('imagemin-pngquant');
var clean = require('gulp-clean');
// var rev = require('gulp-rev');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('clean', function(){
  return gulp.src('build/', {read: false})
      .pipe(clean());
})

// js压缩
gulp.task('js', function () {
  return gulp.src('src/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({
        suffix: '-min'
      }))
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest('build'));
});

// css压缩
gulp.task('css', function () {
  return gulp.src('src/**/*.css')
      .pipe(sourcemaps.init())
      .pipe(cssmin())
      .pipe(rename({
        suffix: '-min'
      }))
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest('build/'));
});

// image压缩
gulp.task('image', function () {
  return gulp.src('src/**/*.{png,jpeg,gif,svg}')
      .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
      }))
      .pipe(gulp.dest('build/'));
});

// dev
gulp.task('dev', ['clean'], function(){
  gulp.start('css', 'image', 'js');
})