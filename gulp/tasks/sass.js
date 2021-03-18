var path = require('path');
var argv = require('yargs').argv;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('../config').sass;
var browserSync = require('browser-sync')
var sassModuleImporter = require('sass-module-importer');

function nodeSassFunctions(sassCompiler) {
    return {
        "timestamp()" : function() {
            var date = new Date();
            var fnFormat = function(n) {
                return (n < 10 ? "0" : "") + n;
            };
            var timestamp = new sassCompiler.types.String([
               date.getFullYear(),
               fnFormat(date.getMonth() + 1),
               fnFormat(date.getDate()),
               fnFormat(date.getHours()),
               fnFormat(date.getMinutes()),
               fnFormat(date.getSeconds())].join(""));

            return timestamp;
        },
        "sprite-ratio()": function() {
            var ratio = argv.env === "m" ? 2 : 1;
            return new sassCompiler.types.Number(ratio);
        }
    }
}
// sourceMap 사용시
// return 문 바로 아래 .pipe(plugins.sourcemaps.init()) 추가
// .pipe(gulp.dest(config.dest)); 바로 위 .pipe(plugins.sourcemaps.write('./')) 추가

module.exports = gulp.task(config.taskname, function () {
    return gulp.src(config.src, { allowEmpty:true })
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            importer: sassModuleImporter(),
            outputStyle : config.options.outputStyle,
            functions : nodeSassFunctions(plugins.sass.compiler),
            includePaths: config.options.includePaths
        })
        .on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer(config.autoprefixerOptions))
        .pipe(plugins.csscomb(config.csscomb))
        .pipe(plugins.cleanCss(config.cleancss))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.stream({ match: "*.scss" }));
});