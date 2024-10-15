const { execSync } = require('node:child_process');
// 读取submodule-config.json的配置
const submoduleConfig = require('./submodule-config.json');

console.log('submoduleConfig---', submoduleConfig);

// 警告每次允许此脚本 都会重新生成新的.git目录，请保证在项目初始化的时候才执行一次。
// 判断是否有.git目录有的话先删除.git目录,在重新初始化。
execSync('rm -rf .git', { stdio: 'inherit', cwd: process.cwd() });
console.log('git clean -df---', process.cwd());
// 先初始化git
execSync('git init', { stdio: 'inherit', cwd: process.cwd() });

(() => {
  submoduleConfig.forEach((item) => {
    // 先删除项目中的path下的所有文件
    const rmCommand = `rm -rf ${item.path}`;
    execSync(rmCommand, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    // // 在克隆下载
    const command = `git submodule add -b ${item.branch} ${item.url} ${item.path}`;
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
  });
})();
