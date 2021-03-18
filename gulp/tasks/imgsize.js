var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var sizeOf = require('image-size');
var handlebars = require('handlebars');
var config = require('../config').imgsize;
var getDirectories = require('../util/getDirectories');
var hasImages = getDirectories(config.src).length;

module.exports = gulp.task(
    config.taskname,
    !hasImages ? function() {} : // 스프라이트 없는 경우 오류방지
    plugins.folders4x(config.src, function spriteByFolder(folder) {
        var hbs = fs.readFileSync(config.template, { encoding: 'utf8' });
        var template = handlebars.compile(hbs);
        var src = path.join(config.src, folder, '__*.{png,jpg,gif}');
        var destname = `${folder}.scss`;
        var context = [];

        // 폴더 설정이 없거나 해당하는 폴더가 아니면 gulp-util의 noop을 던지고 이미지 처리를 하지 않는다
        var isCreatingSprite = config.buildOnlyFolders === undefined
            || (config.buildOnlyFolders && config.buildOnlyFolders.indexOf(folder) !== -1);

        if (!isCreatingSprite) {
            return gulp.src(folder, { allowEmpty: true })
                .pipe(plugins.util.noop());
        }

        function getImageSize(content, file, callback) {
            var filename = path.basename(file.path);
            var filepath = path.relative('./', file.path);
            var dimension = sizeOf(filepath);
            var dupeIndex = context.findIndex((d) => d.name === filename);
            var data = {
                name: filename,
                width: dimension.width,
                height: dimension.height,
                type: dimension.type
            };

            if (dupeIndex === -1) {
                context.push(data);
            } else {
                context[dupeIndex] = data;
            }

            callback(null, '');
        }

        function makeScss(content, file, callback) {
            var data = {
                mapname: folder,
                imgsize: context
            };

            callback(null, template(data));
        }

        function buildImageSize() {
            return gulp.src(src, { allowEmpty: true })
                    .pipe(plugins.each(getImageSize))
                    .pipe(plugins.concat(destname))
                    .pipe(plugins.each(makeScss))
                    .pipe(gulp.dest(config.dest));
        }

        // 스트림을 반환한다
        return buildImageSize();
    })
);
