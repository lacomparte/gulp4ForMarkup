var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;
var options = {
    encodingOption : {
        encoding: 'utf-8'
    },
    stdioOption : {
        stdio : [0,1,2], // 콘솔 출력 http://stackoverflow.com/a/31104898
        maxBuffer : 1024 * 500
    }
};

module.exports = {
    mkdirSync : mkdirSync,
    getCurrentBranchName : getCurrentBranchName,
    getCurrnetBranchHeadInfo : getCurrnetBranchHeadInfo,
    checkUncommitedChanges : checkUncommitedChanges,
    checkUnpushedCommits : checkUnpushedCommits,
    getGitRootAbsolutePath : getGitRootAbsolutePath,
    getRelativeTargetPath : getRelativeTargetPath,
    deployPromotionToSun : deployPromotionToSun,
    getFileList : getFileList,
    getSubdirList: getSubdirList,
    getFileListByExt: getFileListByExt,
    execOptions : options
};

/**
 * 파일을 쓰기 위해서 디렉토리 생성
 * @param filepath 확장자를 포함한 전체 파일 경로
 */
function mkdirSync(filepath){
    var sep = path.sep,
        aDirs = filepath.split(sep),
        aDirpath = [],
        tmpPath;

    while(aDirs.length > 1){
        aDirpath.push(aDirs.shift());
        tmpPath = aDirpath.join(sep);
        if(!fs.existsSync(tmpPath)){
            fs.mkdirSync(tmpPath);
        }
    }
}

/**
 * @returns {string} 현재 브랜치명
 */
function getCurrentBranchName(){
    return execSync('git rev-parse --abbrev-ref HEAD', options.encodingOption).replace(/\n/, '');
}

/**
 * @returns {string} 현재 브랜치 헤드 커밋정보 [커밋번호][커밋시점]
 */
function getCurrnetBranchHeadInfo(){
    return execSync('git log ' + getCurrentBranchName() + ' --pretty=format:\"[%h][%ai]\" -n 1', options.encodingOption).replace(/\n/, '');
}

/**
 * 커밋하지 않은 내역이 있으면 빌드 종료
 */
function checkUncommitedChanges(){
    var bHasChanges = execSync('git status -s', options.encodingOption).replace(/[\s\n]/g, "").length > 0;

    if(bHasChanges){
        console.log("커밋하지 않은 수정사항이 있습니다. 확인해주세요.\n");
        execSync('git status -s', options.stdioOption);
        process.exit();
    }
}

/**
 * 푸쉬하지 않은 내역이 있으면 빌드 종료
 */
function checkUnpushedCommits(){
    var currentBranchName = getCurrentBranchName();
    var bHasCommits = execSync('git log --oneline origin/' + currentBranchName + '..HEAD -1', options.encodingOption).replace(/[\s\n]/g, '').length > 0;

    if(bHasCommits){
        console.log("푸쉬하지 않은 커밋이 있습니다. 확인해주세요.\n");
        execSync('git log --oneline origin/' + currentBranchName + '..HEAD', options.stdioOption);
        process.exit();
    }
}

/**
 * @returns {string} 현재 git의 루트 디렉토리 위치
 */
function getGitRootAbsolutePath(){
    return execSync('git rev-parse --show-toplevel', options.encodingOption).replace(/\n/, '');
}

/**
 * @param sTargetPath cdn 디렉토리 명칭
 * @returns {string} cdn 디렉토리 상대경로
 */
function getRelativeTargetPath(sTargetPath){
    return path.join(path.relative(process.cwd(), getGitRootAbsolutePath()), sTargetPath);
}

/**
 * @param dir 대상 디렉토리
 * @param aFilesPath 재귀를 위해 사용하는 파일 배열
 * @returns {Array} 디렉토리의 파일목록
 */
function getFileList(dir, aFilesPath){
    var aFilesPath = aFilesPath || [];

    fs.readdirSync(dir).forEach(function(list){
        var listpath = path.join(dir, list);
        var bIsDirectory = fs.statSync(listpath).isDirectory();
        if(bIsDirectory){
            getFileList(listpath, aFilesPath);
        }else{
            aFilesPath.push(listpath);
        }
    });

    return aFilesPath;
}

/**
 * @param dir 대상 디렉토리
 * @param ext .이 포함된 확장자 (.scss, .html)
 * @returns {Array} 디렉토리의 파일목록
 */
function getFileListByExt(dir, ext){
    return fs.readdirSync(dir)
        .filter((sub) => path.extname(sub) === ext);
}

/**
 * @param dir 대상 디렉토리
 * @returns {Array} 디렉토리의 하위 디렉토리 목록
 */
function getSubdirList(dir){
    return fs.readdirSync(dir)
        .filter((sub) => fs.statSync(path.join(dir, sub)).isDirectory());
}

/**
 * 프로모션 sun 배포
 * @param {string} sDeployBranch 리소스를 추가할 브랜치 admin_tmon_common
 * @param {string} sTargetDir 대상 디렉토리
 * @param {object} files 파일경로를 키로 하고 버퍼를 값으로 하는 객체
 * @param {string} targetPath 프로모션 기준의 대상 디렉토리의 상대경로
 */
function deployPromotionToSun(sDeployBranch, sTargetDir, files, targetPath){
    var currentBranchName = getCurrentBranchName(),
        currentBranchHeadInfo = getCurrnetBranchHeadInfo(),
        aFiles = Object.keys(files),
        sAllFilepath = aFiles.map(function(file){
            return path.join(targetPath, file);
        }).join(' ');

    execSync('git checkout ' + sDeployBranch, options.stdioOption);
    execSync('git pull', options.stdioOption);
    aFiles.forEach(function(filepath){
        var fullpath = path.join(targetPath, filepath);
        mkdirSync(fullpath);
        fs.writeFileSync(fullpath, files[filepath]);
    });
    execSync('git add ' + sAllFilepath, options.stdioOption);
    execSync('git commit -m \'[SUN][promotion][' + sTargetDir + '][' + currentBranchName + ']' + currentBranchHeadInfo + '\'', options.stdioOption);
    execSync('git push origin ' + sDeployBranch, options.stdioOption);
    execSync('git checkout ' + currentBranchName, options.stdioOption);
}
