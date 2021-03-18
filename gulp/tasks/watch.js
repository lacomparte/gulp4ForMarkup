var path = require('path');
var argv = require('yargs').argv;
var gulp = require('gulp');
var config = require('../config').watch;
var browserSyncConfig = require('../config').browserSync;
var browserSyncProxyConfig = require('../config').browserSyncProxy;
var browserSync = require('browser-sync').get('server');


function postWatchTask(done) {
    browserSync.reload();
    done();
}

gulp.task('html-watch', gulp.series(['html'], postWatchTask));
gulp.task('sass-watch', gulp.series(['sass'], postWatchTask));
gulp.task('javascript-watch', gulp.series(['javascript'], postWatchTask));

module.exports = gulp.task(config.taskname, function () {
    var messenger = require('../util/messenger')();

    browserSync.init(argv.proxy ? browserSyncProxyConfig : browserSyncConfig);

    function isCreatingSprite(folder) {
        return config.buildOnlyFolders === undefined
            || (config.buildOnlyFolders && config.buildOnlyFolders.indexOf(folder) !== -1);
    }

    function clearError() {
        messenger.clear();
    }

    gulp.watch(config.html, gulp.series(['html-watch'])).on('change', () => {});
    gulp.watch(config.sass, gulp.series(['sass-watch'])).on('change', clearError);
    gulp.watch(config.javascript, gulp.series(['javascript-watch'])).on('change', () => {
        browserSync.reload()
    });
    gulp.watch(config.image, gulp.series(['copyimg'])).on('change', browserSync.reload);
    gulp.watch(config.__image, gulp.series(['copyim', 'imgsize'])).on('change', browserSync.reload);
    gulp.watch(config.sprite, gulp.series(['sprite'])).on('change', browserSync.reload);
});
