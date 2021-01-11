const path = require('path');
const sg = require('sass-graph');
const cwd = process.cwd();

module.exports = {
    getDependencies,
    getSprites
};

/**
 * @description 해당 파일이 의존하는 모든 scss 파일의 목록을 배열로 반환한다
 * @param {String} 확장자를 포함한 조회 대상 scss 파일 경로
 * @returns {Array} 해당 scss 파일과 그 파일이 의존하는 다른 scss 파일이 의존하는 scss 파일목록
 */
function getDependencies(target) {
    const targetBasename = path.basename(target);
    const result = sg.parseFile(target).index;

    let dependencies = [];

    // deps는 파일 경로
    Object.keys(result).forEach((deps) => {
        const isSelf = path.basename(deps) === targetBasename;

        // 해당 파일이 import하는 파일이 있으면 그 파일의 의존 파일을 포함시킨다
        if (isSelf) {
            dependencies = dependencies.concat(result[deps].imports);
        } else if (result[deps].imports.length > 0 && !isSelf) {
            dependencies = dependencies.concat(getDependencies(deps));
        }
    });

    // 중복제거
    return dependencies
        .filter((deps, index) => dependencies.indexOf(deps) === index);
}

/**
 * @description 해당 scss 파일에 의존하는 sprite 파일명(디렉토리명)을 반환한다
 * @param {String} 확장자를 포함한 조회 대상 scss 파일 경로
 * @returns {Array} sprite 파일명(디렉토리명)
 */
function getSprites(target) {
    return getDependencies(target)
        .filter((scss) => !(/(scss)\/(?!sprite(?!\/mixins)|imgsize)/gi.test(scss)))
        .map((scss) => path.basename(scss, '.scss'));
}
