var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var imagemin = require('gulp-image-optimization');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');

//var gifsicle = require('imagemin-gifsicle');
//var pngcrush = require('imagemin-pngcrush')

// 语法检查
gulp.task('jshint', function () {
    return gulp.src('dialog.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

var options = {
    preserveComments: 'some'
};
// js压缩代码
gulp.task('script', function (){
     return gulp.src('src/*/*.js')
          // .pipe(concat('all.js'))
          // .pipe(gulp.dest('dist'))
          .pipe(uglify(options))
          .pipe(rename({
            suffix: "-min"
          }))
          .pipe(gulp.dest('build'));
});

// css压缩代码
gulp.task('css', function (){
     return gulp.src('src/**/*.css')
          // .pipe(concat('all.js'))
          // .pipe(gulp.dest('dist'))
          .pipe(sourcemaps.init())
          .pipe(cssmin({
            keepSpecialComments: 1
          }))
          .pipe(rename({
            suffix: "-min"
          }))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('build/'));
});

// images压缩代码
gulp.task('image', function (cb){
      // gulp.src('src/images/*.[gif,png]', function(cb){

      // })
    console.log(cb)
     // return gulp.src('src/images/*.[gif,png]')
     //      // .pipe(concat('all.js'))
     //      // .pipe(gulp.dest('dist'))
     //      .pipe(gifsicle({
     //        interlaced: true
     //      }))
     //      // .pipe(rename({
     //      //   suffix: "-min"
     //      // }))
     //      .pipe(gulp.dest('build/images/'));
});

// 修改文件名
gulp.task('rev', function () {
    return gulp.src('src/*.scss')
          .pipe( rev() )
          .pipe( gulp.dest('build') );
});

// scss
gulp.task('sass', function () {
    return gulp.src('src/**/*.scss')
          .pipe(
            sass().on('error', sass.logError)
          )
          .pipe( gulp.dest('src') );
});

// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch('src/*.js', ['jshint', 'minify']);
});

// 压缩代码
gulp.task('minify', ['script', 'css', 'image' ] );

// 注册缺省任务
gulp.task('default', ['jshint', 'minify', 'watch']);