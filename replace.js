var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 语法检查
gulp.task('jshint', function () {
    return gulp.src('dialog.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 合并文件之后压缩代码
gulp.task('minify', function (){
     return gulp.src('dialog.js')
        // .pipe(concat('all.js'))
        // .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('dialog.min.js'))
        .pipe(gulp.dest('./'));
});

// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch('src/*.js', ['jshint', 'minify']);
});

// 注册缺省任务
gulp.task('default', ['jshint', 'minify', 'watch']);

// 可以看出，基本上所有的任务体都是这么个模式：
// gulp.task('任务名称', function () {
//     return gulp.src('文件')
//         .pipe(...)
//         .pipe(...)
//         // 直到任务的最后一步
//         .pipe(...);
// });