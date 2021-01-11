const WORKCONFIG = '.workconfig.json';

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const inquirer = require('inquirer');
const argv = require('yargs').argv;
const choiceSep = new inquirer.Separator();
const utils = require('./utils');
const stdioOption = { stdio: [0, 1, 2], maxBuffer: 1024 * 500 };
// 기본값
let workConfig = {};

// 기존 설정이 있으면 가져온다
if (fs.existsSync(WORKCONFIG)) {
    workConfig = JSON.parse(fs.readFileSync(WORKCONFIG));
}

/**
 * @param dir {String} 환경 (pc|m)
 * @returns {Array} inquirer의 체크박스 선택옵션
 */
function getProjectStructureChoices(dir) {
    const src = path.join(dir, 'src');
    const allSass = {
        name: 'sass: 전체',
        value: { type: 'sass', name: '*.scss' },
        checked: workConfig[argv.path] ? workConfig[argv.path].sass.indexOf('*.scss') !== -1 : false
    };
    const allHtml = {
        name: 'html: 전체',
        value: { type: 'html', name: '**' },
        checked: workConfig[argv.path] ? workConfig[argv.path].html.indexOf('**') !== -1 : false
    };
    const allJavascript = {
        name: 'js: 전체',
        value: { type: 'js', name: '**' },
        checked: workConfig[argv.path] ? workConfig[argv.path].javascript.indexOf('**') !== -1 : false
    };

    const rootSass = utils.getFileListByExt(path.join(src, 'scss'), '.scss')
        .map((filename) => ({
            name: `sass: ${filename}`,
            value: { type: 'sass', name: filename },
            checked: workConfig[argv.path] ? workConfig[argv.path].sass.indexOf(filename) !== -1 : false
        }));

    const htmlDir = utils.getSubdirList(path.join(src, 'html'))
        .filter((dirname) => dirname !== 'include')
        .map((dirname) => ({
            name: `html: ${dirname}`,
            value: { type: 'html', name: dirname },
            checked: workConfig[argv.path] ? workConfig[argv.path].html.indexOf(dirname) !== -1 : false
        }));

    const javascriptDir = utils.getFileListByExt(path.join(src, 'js'), '.js')
        .map((filename) => ({
            name: `js: ${filename}`,
            value: { type: 'javascript', name: filename },
            checked: workConfig[argv.path] ? workConfig[argv.path].javascript.indexOf(filename) !== -1 : false
        }));

    return [allSass].concat(
        rootSass, choiceSep,
        allHtml, htmlDir, choiceSep,
        allJavascript, javascriptDir, choiceSep
    );
};

const question = {
    type: 'checkbox',
    name: 'choices',
    message: '빌드 대상을 선택하세요.',
    choices: getProjectStructureChoices(argv.path),
    pageSize: 15
};

inquirer.prompt([question])
    .then(({ choices }) => {
        let sass = choices
            .filter((info) => info.type === 'sass')
            .map((info) => info.name);
        const isAllSass = sass.indexOf('*.scss') !== -1 || sass.length === 0;

        let html = choices
            .filter((info) => info.type === 'html')
            .map((info) => info.name);
        const isAllHtml = html.indexOf('**') !== -1 || html.length === 0;

        let javascript = choices
            .filter((info) => info.type === 'javascript')
            .map((info) => info.name);
        const isAllJavascript = javascript.indexOf('*.js') !== -1 || javascript.length === 0;

        // 선택한 옵션이 없거나 전체를 선택한 경우 모든 파일로 설정한다
        if (isAllSass) {
            sass = ['*.scss'];
        }

        // 선택한 옵션이 없거나 전체를 선택한 경우 모든 디렉토리로 설정한다
        if (isAllHtml) {
            html = ['**'];
        }

        // 선택한 옵션이 없거나 전체를 선택한 경우 모든 디렉토리로 설정한다
        if (isAllJavascript) {
            javascript = ['**'];
        }

        // 변경된 내용을 업데이트한다
        workConfig[argv.path] = { sass, html, javascript };

        // 변경된 내용을 json으로 저장한다
        fs.writeFileSync(WORKCONFIG, JSON.stringify(workConfig, null, 4));

        // 처음 메뉴로 돌아간다
        execSync('npm start', stdioOption);
    });