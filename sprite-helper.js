/**
 * spriteHelper
 * spritesmith를 이용하여 디렉토리 기준으로 스프라이트 이미지 생성
 *
 * @param {Object} gulp
 * @param {Object} env development/production
 * @param {Object} paths gulpfile.js에 작성한 산출물 디렉토리 경로 설정
 * @param {Array} exclusion 제외 디렉토리
 * @param {Object} plugins gulp-load-plugins
 * @param {Boolean} bUseSubdir im 하위 디렉토리 생성 여부, true이면 생성
 * @param {Object} htRequires fs, path, merge, mustache, runSequence
 * @returns {Function} spriteTask gulp sprite task function
 */
var spriteHelper = function(gulp, env, paths, exclusion, plugins, bUseSubdir, htRequires){
    var fs = htRequires.fs;
    var path = htRequires.path;
    var merge = htRequires.merge;
    var mustache = htRequires.mustache;
    var runSequence = htRequires.runSequence;
    var gulpif = plugins.if;
    var debug = plugins.debug;
    var plumber = plugins.plumber;
    var spritesmith = plugins.spritesmith;
    var extend = require("util")._extend;
    var env = env;
    var paths = paths;

    /**
     * 공통 설정
     */
    var defaults = {
        cssOpts : {
            zerounit: function() {
                return function(text, render){
                    var value = render(text);
                    return "0px" === value ? "0" : value;
                };
            }
        }
    };

    /**
     * 공통 설정을 상속하여 디렉토리별 설정 생성
     * @returns {Object} spritesmith 설정
     */
    var createSpriteOptions = function(dirname, isVertical){
        var padding = isVertical ? 50 : 4;
        var algorithm = isVertical ? "top-down" : "binary-tree";
        var mustacheTemplate = isVertical ? paths.sprite_vertical : paths.sprite_mosaic;

        var spriteOptions = extend(defaults, {
                padding : padding,
                algorithm : algorithm,
                cssTemplate : function(params){
                    var template = fs.readFileSync(mustacheTemplate, { encoding : "utf-8" });

                    return mustache.render(template, params);
                },
                imgPath : path.relative(paths.css, path.join(paths.sprite_dest, bUseSubdir ? dirname : '', "sp-" + dirname + ".png")).split(path.sep).join("/"),
                imgName : "sp-" + dirname + ".png",
                cssName : dirname + ".scss",
                cssSpritesheetName : "sp-" + dirname
            });
        return spriteOptions;
    };

    /**
     * @param {string} src 하위 디렉토리 목록을 가져올 대상 디렉토리
     * @returns {Array} 하위 디렉토리 목록
     */
    var getDirectories = function(src){
        var directories = [];

        fs.readdirSync(src).map(function(subdir){
            var isDirectory = fs.statSync(path.join(src, subdir)).isDirectory();
            var isExcluded = exclusion.find(function(item){ return item === subdir});

            if(isDirectory && !isExcluded){
                directories.push(subdir);
            }
        });

        return directories;
    };

    // 전체 Task
    var allTasks = [];

    // 스프라이트 대상 하위 디렉토리
    var spriteDirectories = getDirectories(paths.sprite);

    // Task 생성
    spriteDirectories.map(function(dirname){
        var src = [path.join(paths.sprite, dirname, "/*.png"), "!" + path.join(paths.sprite, dirname, "/__*.{png,jpg,gif}")];
        var targetDir = path.join(paths.sprite_dest, dirname);
        var taskName = "sprite-" + dirname;
        var isVertical = dirname === "vertical";

        allTasks.push(taskName);

        gulp.task(taskName, function(){
            var spriteData = gulp.src(src)
                .pipe(spritesmith(createSpriteOptions(dirname, isVertical)));
            var imgStream = spriteData.img
                .pipe(gulp.dest(targetDir));
            var scssStream = spriteData.css.pipe(gulp.dest(paths.scss_sprite));

            return merge(imgStream, scssStream)
                .pipe(gulpif(env.development, plumber()))
                .pipe(debug({title:""}));
        });
    });

    var spriteTask = function(callback){
        var allTasksWithCallback = allTasks.concat(callback);
        runSequence.apply(this, allTasksWithCallback);
    };

    return spriteTask;
};

module.exports = spriteHelper;
