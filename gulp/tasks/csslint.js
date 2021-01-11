var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('../config').csslint;

module.exports = gulp.task(config.taskname, () => {
    return gulp.src(config.src)
        .pipe(plugins.csslint())
        .pipe(plugins.csslintReport({
            filename: config.rule.filename,
            directory: config.rule.dir
        }))
});
