var gulp = require('gulp');
var argv = require('yargs').argv;
var plugins = require('gulp-load-plugins')();
var messenger = require('./messenger')();

module.exports = function() {
    var errorHandler = function(error) {
        let errorMessage = '';
        if (error.plugin) {
            errorMessage = `Error (${error.plugin}): ${error.message}`;
        } else {
            errorMessage = error;
        }
        plugins.util.log(plugins.util.colors.red(errorMessage));
        messenger.clear();
        messenger.send(error.title, error.message);
        this.emit('end');
    };

    var gulpSrc = gulp.src;
    gulp.src = function() {
        return gulpSrc.apply(gulp, arguments)
            .pipe(plugins.if(!argv.build, plugins.plumber(errorHandler)))
            .pipe(plugins.debug({ title: 'Processing' }));
    };
};
