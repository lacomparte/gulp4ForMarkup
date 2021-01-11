var path = require('path');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('../config').html;

module.exports = gulp.task(config.taskname, function() {
    return gulp.src(config.src, { base: config.base })
        .pipe(plugins.fileInclude({
            prefix: "@@",
            basepath: config.include_dir
        }))
        .pipe(gulp.dest(config.dest));
});