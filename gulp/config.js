const path = require('path');
const argv = require('yargs').argv;
const serveIndex = require('serve-index');

const ENV = argv.env || 'pc';
const SRC_DIR = path.join(ENV, 'src');
const DIST_DIR = path.join('dist', ENV);
const SHARED_DIR = path.join('shared', argv.env === 'pc' ? 'p' : 'm').replace(path.sep, '/');
let PROXY_HOST = argv.env === 'm' && !argv.ssl ? 'm.local.musinsa.co.kr' : 'local.musinsa.co.kr';
if (argv.subdomain === 'mobile') {
    PROXY_HOST = 'mobile.local.musinsa.co.kr';
}

const PROXY_PORT = argv.port || 8088;
const workConfig = require('./util/work-config')(ENV, SRC_DIR);
module.exports = {
    clean: {
        taskname: 'clean',
        src: [
            `${DIST_DIR}/**/*`,
            `${SRC_DIR}/scss/imgsize/*.scss`,
            `${SRC_DIR}/scss/sprite/*.scss`,
            `!${SRC_DIR}/scss/sprite/mixins.scss`
        ]
    },
    html: {
        taskname: 'html',
        src: workConfig[ENV].html
            .map((dir) => `${SRC_DIR}/html/${dir}/*.html`)
            .concat([
                `!${SRC_DIR}/html/include/**/*.html`
            ]),
        include_dir: `${SRC_DIR}/html/include/`,
        dest: `${DIST_DIR}/html/`,
        base: `${SRC_DIR}/html/`
    },
    copyim: {
        taskname: 'copyim',
        src: `${SRC_DIR}/sprite/**/__*.{png,jpg,gif,svg}`,
        dest: `${DIST_DIR}/im/`
    },
    copyimg: {
        taskname: 'copyimg',
        src: `${SRC_DIR}/img/**/*.{png,jpg,gif,svg,json}`,
        dest: `${DIST_DIR}/img/`
    },
    sprite: {
        taskname: 'sprite',
        src: `${SRC_DIR}/sprite/`,
        dest_scss: `${SRC_DIR}/scss/sprite/`,
        dest_image: `${DIST_DIR}/im/`,
        template: './gulp/template/sprite.hbs',
        imgpath_prefix: '../im',
        buildOnlyFolders: workConfig[ENV].scss
    },
    imgsize: {
        taskname: 'imgsize',
        src: `${SRC_DIR}/sprite/`,
        dest: `${SRC_DIR}/scss/imgsize/`,
        template: './gulp/template/imgsize.hbs',
        buildOnlyFolders: workConfig[ENV].sprite
    },
    javascript: {
        taskname: 'javascript',
        src: workConfig[ENV].javascript.map((filename) => `${SRC_DIR}/js/${filename}`),
        dest: `${DIST_DIR}/js/`
    },
    sass: {
        taskname: 'sass',
        src: workConfig[ENV].sass
            .map((filename) => `${SRC_DIR}/scss/${filename}`),
        dest: `${DIST_DIR}/css/`,
        options: {
            outputStyle: 'compact',
            includePaths: ['node_modules']
        },
        autoprefixer: {
            browsers: [
                "Android 5.0",
                "Android >= 5",
                "Chrome >= 50",
                "Firefox >= 50",
                "Explorer >= 9",
                "iOS >= 10",
                "Opera >= 40",
                "Safari >= 10"
            ],
            cascade: true
        },
        csscomb: './gulp/rules/.csscombrc',
        cleancss: {
            advanced: false,
            aggressiveMerging: false,
            compatibility: 'ie9',
            keepBreaks: true,
            keepSpecialComments: '*',
            mediaMerging: false,
            processImport: false,
            restructuring: false,
            roundingPrecision: -1,
            shorthandCompacting: false
        }
    },
    watch: {
        taskname: 'watch',
        html: `${SRC_DIR}/**/*.{html,svg}`,
        javascript: `${SRC_DIR}/**/*.js`,
        sass: `${SRC_DIR}/scss/**/*.scss`,
        image: `${SRC_DIR}/img/**/*.{png,jpg,gif,svg,json}`,
        __image: `${SRC_DIR}/sprite/**/__*.{png,jpg,gif,svg,json}`,
        sprite: [
            `${SRC_DIR}/sprite/**/*.{png,jpg,gif,svg}`,
            `!${SRC_DIR}/sprite/**/__*.{png,jpg,gif,svg}`
        ],
        sprite_dir: `${SRC_DIR}/sprite`,
        buildOnlyFolders: workConfig[ENV].sprite
    },
    browserSync: {
        server: {
            baseDir: DIST_DIR,
            directory: true
        },
        startPath: '/',
        serveStatic: [
            { route: '/common', dir: './common' },
            { route: '/js', dir: `${DIST_DIR}/js` }
        ],
        plugins: ['bs-fullscreen-message']
    },
    browserSyncProxy: {
        proxy: {
            target: `${PROXY_HOST}:${PROXY_PORT}`,
            middleware: [
                { route: '/dist', handle: serveIndex(`${DIST_DIR}`, { icons: true }) }
            ]
        },
        startPath: argv.env === 'm' && argv.ssl ? '/m' : '/',
        open: 'external',
        host: PROXY_HOST,
        serveStatic: [
            { route: '/common', dir: './common' },
            { route: '/dist', dir: `${DIST_DIR}` },
            { route: '/css', dir: `${DIST_DIR}/css` },
            { route: '/img', dir: `${DIST_DIR}/img` },
            { route: '/im', dir: `${DIST_DIR}/im` },
            { route: `${SHARED_DIR}/css`, dir: `${DIST_DIR}/css` },
            { route: `${SHARED_DIR}/img`, dir: `${DIST_DIR}/img` },
            { route: `${SHARED_DIR}/im`, dir: `${DIST_DIR}/im` }
        ],
        plugins: ['bs-fullscreen-message'],
        snippetOptions: {
            // IE 조건부 주석으로 인해 browser-sync-client.js가 정상적으로 추가되지 않는 문제 우회
            // https://github.com/BrowserSync/browser-sync/issues/677
            rule: {
                match: /<\/body>/,
                fn: function(snippet, match) {
                    return `<!--[if gt IE 8]><!-->${snippet}<!--<![endif]-->${match}`;
                }
            }
        }
    },
    sasslint: {
        taskname: 'sasslint',
        src: [
            `${SRC_DIR}/scss/**/*.scss`,
            `!${SRC_DIR}/scss/sprite/*.scss`,
            `!${SRC_DIR}/scss/imgsize/*.scss`
        ],
        dest: `dist/reports/${ENV}/sasslint-reports.html`,
        rule: './gulp/rules/.sass-lint.yml'
    },
    csslint: {
        taskname: 'csslint',
        src: [
            `${DIST_DIR}/css/*.css`
        ],
        rule: {
            dir: `dist/reports/${ENV}/`,
            name: 'csslint-reports.html'
        }
    },
    filelist: {
        taskname: 'filelist',
        src: `${SRC_DIR}/html`,
        dest: `${DIST_DIR}`,
        base: `${SRC_DIR}`
    },
};