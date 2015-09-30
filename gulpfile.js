var gulp = require('gulp');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
// var cssmin = require('gulp-minify-css');
var css = require('gulp-css');
var uglify = require('gulp-uglify');
var pngquant = require('imagemin-pngquant');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  js: 'src/**/*.js',
  scss: 'src/**/*.scss',
  image: 'src/**/*.{png,jpeg,gif,svg}'
}

// 清空文件夹
gulp.task('clean', function(){
  return gulp.src('build/', {read: false})
      .pipe(clean());
})

// js压缩
gulp.task('js', function () {
  return gulp.src( paths.js )
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({
        suffix: '-min'
      }))
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest('build'));
});

// scss编译压缩
gulp.task('css', function () {
  return gulp.src( paths.scss )
      .pipe(sourcemaps.init())
      .pipe(sass(
          {
              // outputStyle: 'compressed',
              bundleExec: true
          }
      ))
      .pipe(css())
      .pipe(rename({
        suffix: '-min'
      }))
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest('build/'));
});

// image压缩
gulp.task('image', function () {
  return gulp.src( paths.image )
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

gulp.task('watch', function() {
  gulp.watch( paths.image, ['image']);
  gulp.watch( paths.scss, ['css']);
  gulp.watch( paths.js, ['js']);
});