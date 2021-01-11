var gulp = require('gulp');

module.exports = gulp.task('report', gulp.series(['csslint']));
