var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var config = require('../config').clean;

module.exports = gulp.task(config.taskname, function() {
    return del(config.src, { force: true });
});
