const fs = require('fs');
const path = require('path');
const mkdirSync = require('./mkdirsync');
const sassGraphUtil = require('./sass-graph');
const getDirectories = require('./getDirectories');

module.exports = function configureWorkConfig(env, src) {
    const WORKCONFIG = '.workconfig.json';
    const WORKCONFIG_PATH = path.join(process.cwd(), WORKCONFIG);
    const SPRTIE_PATH = path.join(src, 'sprite');
    const SPRTIE_SCSS_PATH = path.join(src, 'scss/sprite');
    const IMGSIZE_SCSS_PATH = path.join(src, 'scss/imgsize');

    let workConfig = {};
    // default
    workConfig[env] = {
        "sass": ['*.scss'],
        "html": ['**'],
        "javascript": ['*.js']
    };
    // .workconfig 파일이 있으면 읽어온다
    if (fs.existsSync(WORKCONFIG)) {
        workConfig = Object.assign(workConfig, JSON.parse(fs.readFileSync(WORKCONFIG_PATH)));
    }
    // sass가 설정되어 있으면 해당 파일을 기준으로 import한 sprite를 찾은 후 해당하는 스프라이트만 실행한다
    if (workConfig[env].sass[0] !== '*.scss') {
        // sass-graph가 파일이 없으면 의존성에서 제외하므로 임시파일을 생성하고 이 파일은 gulp가 실행되면 clean으로 삭제된다
        // sprite 디렉토리 목록으로 scss/sprite, scss/imgsize에 빈 scss 파일을 생성한다
        getDirectories(SPRTIE_PATH).forEach((dir) => {
            const sprite = path.join(SPRTIE_SCSS_PATH, `${dir}.scss`);
            const imgsize = path.join(IMGSIZE_SCSS_PATH, `${dir}.scss`);
            mkdirSync(sprite);
            mkdirSync(imgsize);
            fs.writeFileSync(sprite, '// 의존성 확인용 임시파일');
            fs.writeFileSync(imgsize, '// 의존성 확인용 임시파일');
        });

        workConfig[env].sprite = workConfig[env].sass
            .map((scss) => sassGraphUtil.getSprites(path.join(src, 'scss', scss)))
            .reduce((b, a) => b.concat(a), []);
    }
    return workConfig;
}
