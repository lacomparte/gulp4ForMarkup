const gulp = require('gulp');
const config = require('../config').filelist;
const fs = require('fs');
const template = require('gulp-template');

module.exports = gulp.task(config.taskname, async () => {
  const fileList = [];
  fs.readdirSync(config.src).forEach(directory => {
    if (directory !== 'include' && !directory.includes('.')) {
      const directoryData = { directory, files: [] };
      fileList.push(directoryData);
      fs.readdirSync(`${config.src}/${directory}`)
        .forEach(file => {
          const fileObject = {
            title: '',
            subTitile: '',
            file
          };
          const fileContent = fs.readFileSync(`${config.src}/${directory}/${file}`, 'utf8');
          const headerText = `@@include('./common/layout/header.html', {`;
          const headerIndex = fileContent.indexOf(headerText);
          let objectStart = objectEnd = headerIndex + headerText.length - 1;
          if (headerIndex > -1) {
            let braceFlag = 0;
            let i = objectStart;
            for (; i < fileContent.length; i++) {
              const char = fileContent[i];
              if (char === '{') {
                braceFlag++;
              } else if (char === '}') {
                braceFlag--;
              }
              if (braceFlag === 0) {
                objectEnd = i + 1;
                break;
              }
            }
            const dataObject = eval('(' + fileContent.substring(objectStart, objectEnd) + ')');
            fileObject.title = dataObject.title || '';
            fileObject.subTitle = dataObject.title_sub || '';
            fileObject.file = file;
          }
          directoryData.files.push(fileObject);
        });
    }
  });

  return gulp.src(config.base + '/index.html', { base: config.base })
    .pipe(template({ fileList }))
    .pipe(gulp.dest(config.dest));  
});
