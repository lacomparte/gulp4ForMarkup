var fs = require('fs');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('../config').sasslint;
var mkdirSync = require('../util/mkdirsync');

module.exports = gulp.task(config.taskname, function () {
    mkdirSync(config.dest);
    var file = fs.createWriteStream(config.dest);

    return gulp.src(config.src, { allowEmpty:true })
        .pipe(plugins.sassLint({
            configFile: config.rule
        }))
        .pipe(plugins.sassLint.format(file))
        .on('finish', function() {
            file.end();
        });
});
