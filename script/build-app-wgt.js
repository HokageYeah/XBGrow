const { execSync } = require('node:child_process');
const { resolve } = require('node:path');
const { readFileSync, existsSync, unlinkSync, createWriteStream } = require('node:fs');
const archiver = require('archiver');
const envsParams = process.argv.slice(2);
console.log('envsParams---', envsParams);
const projectConfigKeyAry = ['szjx', 'xzx-reading', 'xxt', 'circle'];
const envsPopParams = envsParams.pop();
if (!projectConfigKeyAry.includes(envsPopParams)) {
  console.log(`请传入正确的参数，参数必须是${projectConfigKeyAry.toString()}其中之一 ❌❌❌`);
  process.exit();
}
let command = `uni build -p app ${envsPopParams}`;
let test = '';
if (envsParams.includes('--mode')) {
  command = `uni build -p app --mode test ${envsPopParams}`;
  test = '-test';
}
try {
  console.log(`开始打包uni-app端应用 🚀🚀🚀...`);
  execSync(command, {
    stdio: 'inherit' // 将标准输入重定向到 /dev/null
  });
  console.log(`uni-app端打包应用成功 🚀🚀🚀...`);
} catch (error) {
  console.log('uni-app端打包应用失败❌❌❌，失败原因：', error);
  process.exit();
}

const manifestPath = resolve(__dirname, '../src/manifest.json');
// 读取src目录下的manifest.json文件中的"appid": "__UNI__680F645",
const manifestStr = readFileSync(manifestPath, 'utf8');
// 使用正则表达式匹配 appid 的值
const match = manifestStr.match(/"appid"\s*:\s*"([^"]+)"/);
let appId = 'app';
if (match && match[1]) {
  console.log('App ID 的值是:', match[1]);
  appId = match[1];
}

const distAppWgtPath = resolve(__dirname, `../dist/build/${appId}${test}.wgt`);
// 同步判断文件是否存在
if (existsSync(distAppWgtPath)) {
  console.log(`${appId}文件存在先删除 ❎❎❎`);
  try {
    unlinkSync(distAppWgtPath);
    console.log(`${appId}文件已成功删除成功 🎉🎉🎉`);
  } catch (err) {
    console.error('删除文件失败 ❌❌❌:', err);
    process.exit();
  }
}

// 这块代码是在Mac上打包用的，因为没有兼容windows系统，所有采用下方打包。
// // 保证每次运行的时候wgt包都是最新的后在开始打包
// const zipPath = resolve(__dirname, `../dist/build/app`);
// const zipCommand = `zip -r ../${appId}${test}.wgt *`;
// console.log(`开始构建wgt压缩包 🚀🚀🚀...`);
// try {
//   execSync(zipCommand, {
//     cwd: zipPath,
//     stdio: 'inherit' // 将标准输入重定向到 /dev/null
//   });

//   console.log('wgt包构建成功 🎉🎉🎉，wgt包地址：', distAppWgtPath);
// } catch (error) {
//   console.log('wgt包构建失败❌❌❌，失败原因：', error);
//   process.exit();
// }

// 保证每次运行的时候wgt包都是最新的后在开始打包
// 兼容windows系统和Mac系统
// 创建输出流，输出为 .wgt 文件
console.log(`开始构建wgt压缩包 🚀🚀🚀...`);
const zipPath = resolve(__dirname, `../dist/build/app`);
const output = createWriteStream(distAppWgtPath);
const archive = archiver('zip', { zlib: { level: 9 } }); // 使用最强压缩级别
// 处理输出完成事件
output.on('close', () => {
  console.log('最新构建脚本：wgt包构建成功 🎉🎉🎉，wgt包地址：', distAppWgtPath);
});
// 处理错误事件
archive.on('error', (err) => {
  console.error('最新构建脚本：wgt包构建失败❌❌❌，失败原因：', err);
  process.exit();
});
// 将输出流管道到归档
archive.pipe(output);
// 添加要压缩的文件或文件夹
archive.directory(zipPath, false);
// 写入文件
archive.finalize();
