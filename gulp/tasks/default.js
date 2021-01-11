var gulp = require('gulp');
var argv = require('yargs').argv;
var runSequence = require('gulp4-run-sequence');

module.exports = gulp.task('default', function(callback) {
    var defaults = ['copyim', 'copyimg', 'sprite', 'imgsize', 'html', 'javascript'];

    // CI에서 빌드 실패시 종료처리
    // http://dev.topheman.com/gulp-fail-run-sequence-with-a-correct-exit-code/
    var cbExit = function (err) {
        if (err) {
            var exitCode = 2;
            console.log('[ERROR] gulp build task failed', err);
            console.log('[FAIL] gulp build task failed - exiting with code ' + exitCode);
            return process.exit(exitCode);
        } else {
            return callback();
        }
    };

    if (argv.build) {
        runSequence('clean', defaults, 'sass', 'filelist', 'report', cbExit);
    } else {
        runSequence('clean', defaults, 'sass', 'watch', cbExit);
    }
});
