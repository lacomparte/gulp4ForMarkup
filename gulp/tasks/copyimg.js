var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('../config').copyimg;

module.exports = gulp.task(config.taskname, function() {
    return gulp.src(config.src, { allowEmpty:true })
        .pipe(gulp.dest(config.dest));
});
