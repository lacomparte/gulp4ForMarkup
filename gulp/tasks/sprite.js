var path = require('path');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var merge = require('merge-stream');
var config = require('../config').sprite;
var getDirectories = require('../util/getDirectories');
var hasImages = getDirectories(config.src).length;

module.exports = gulp.task(
    config.taskname,
    !hasImages ? function() {} : // 스프라이트 없는 경우 오류방지
    function() { 
        return new Promise(resolve => {
            plugins.folders(config.src, function spriteByFolder(folder) {
                // 폴더 설정이 없거나 해당하는 폴더가 아니면 gulp-util의 noop을 던지고 이미지 처리를 하지 않는다
                var isCreatingSprite = config.buildOnlyFolders === undefined
                    || (config.buildOnlyFolders && config.buildOnlyFolders.indexOf(folder) !== -1);

                if (!isCreatingSprite) {
                    return gulp.src(folder)
                        .pipe(plugins.util.noop());
                }

                var buildSprite = function () {
                    var sprite = [
                        path.join(config.src, folder, '*.{png,jpg,gif}'),
                        '!' + path.join(config.src, folder, '__*.{png,jpg,gif}')
                    ];
                    var spriteName = `sp-${folder}`;
                    var imgName = `${spriteName}.png`;
                    var scssName = `${folder}.scss`;
                    var imgPath = path.join(config.imgpath_prefix, folder, imgName);
                    var imgDest = path.join(config.dest_image, folder);

                    var spriteData = gulp.src(sprite)
                        .pipe(plugins.spritesmith({
                            padding: 4,
                            algorithm: 'binary-tree',
                            imgPath: imgPath,
                            imgName: imgName,
                            cssName: scssName,
                            cssTemplate: config.template,
                            cssSpritesheetName: spriteName,
                            cssHandlebarsHelpers: {
                                replacePathSeperator: function (spritesmithData) {
                                    // windows 환경에서 이미지 경로가 잘못 나오는 것을 방지
                                    return spritesmithData.data.root.spritesheet.escaped_image.replace(/\\/gi, '/');
                                }
                            }
                        }));

                    var imageData = spriteData.img
                        .pipe(gulp.dest(imgDest));

                    var scssData = spriteData.css
                        .pipe(gulp.dest(config.dest_scss));

                    return merge(imageData, scssData);
                }

                // 스트림을 반환한다
                return buildSprite();
            })
            resolve();
    })}
);
