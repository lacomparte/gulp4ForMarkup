var path = require('path');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('../config').html;
var htmlmin = require('gulp-htmlmin');
var formatHtml = require('gulp-format-html');

module.exports = gulp.task(config.taskname, function() {
    return gulp.src(config.src, { base: config.base, allowEmpty: true })
        .pipe(plugins.fileInclude({
            prefix: "@@",
            basepath: config.include_dir
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(formatHtml())
        .pipe(gulp.dest(config.dest));
});