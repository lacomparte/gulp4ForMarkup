const execSync = require('child_process').execSync;
const inquirer = require('inquirer');
const choiceSep = new inquirer.Separator();
const stdioOption = { stdio: [0, 1, 2], maxBuffer: 1024 * 500 };
const question = {
  type: 'list',
  name: 'target',
  message: '실행할 작업을 선택하세요.',
  default: 'start',
  choices: [
    { name: '💻 PC 마크업 개발', value: 'dev-p', short: 'PC 마크업 개발을 시작합니다.' },
    { name: '📱 MOBILE 마크업 개발', value: 'dev-m', short: 'MOBILE 마크업 개발을 시작합니다.' },
    choiceSep,
    { name: '⚙  PC 빌드설정', value: 'configure-p', short: '\n개인환경에 따라 PC 빌드 대상을 설정합니다.' },
    { name: '⚙  MOBILE 빌드설정', value: 'configure-m', short: '\n개인환경에 따라 MOBILE 빌드 대상을 설정합니다.' },
    { name: '😢  종료', value: 'exit', short: '\n' },
    choiceSep,
  ],
};
inquirer.prompt([question])
  .then(({ target }) => {
    if (target === 'exit') {
      process.exit();
    }
    execSync(`npm run ${target}`, stdioOption);
  });
