// import { WxAppConfig } from '@/uni-module-common/config/';
const fs = require('node:fs');
const path = require('node:path');
// const { fileURLToPath } = require('node:url');
// const json5 = require('json5');
console.log('WxAppConfig------', process.env);
// 获取项目中.env配置文件内容

// 当前运行的路径
// const __filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(__filename);
const dirname = __dirname;
// 获取工程中public.json配置文件路径
const publicPath = path.resolve(dirname, './public.json');
// 读取文件内容
const publicJson = JSON.parse(fs.readFileSync(publicPath, 'utf-8'));
const subPackagesObj = publicJson.subPackages;
// 获取主工程中pages.json配置文件路径
const pagesPath = path.resolve(dirname, publicJson.mainPath);
const pagesCopyPath = path.resolve(dirname, publicJson.copyMainPath);
const envDevelopmentPath = path.resolve(dirname, publicJson.envDevelopmentPath);
// 读取envDevelopmentPath 中内容
const envData = fs.readFileSync(envDevelopmentPath, 'utf-8');
// 使用正则表达式匹配VITE_LOGIN_WX_APP_CONFIG的值
// const regex = /VITE_LOGIN_WX_APP_CONFIG = \[[\s\S]*?\]]/;
const regex = /VITE_LOGIN_WX_APP_CONFIG = \[\[.*?\]\]/s;
const match = envData.match(regex);
const regex2 = /VITE_LOGIN_WX_APP_CONFIG = (\[\[.*?\]\])/;
const match2 = match[0].match(regex2);
// 给定subPackagesRoot、subPackagesName 默认值
let subPackagesRoot = 'uni_modules/xxt-xzx-reading-uni';
let subPackagesName = 'xxtReadingUni';
if (match2) {
  // const configValue = JSON.parse(match[1]);
  const obj = Object.fromEntries(JSON.parse(match2[1]));
  subPackagesRoot = obj.subPackagesRoot;
  subPackagesName = obj.subPackagesName;
  console.log(
    'configValue----obj.subPackagesRoot---subPackagesName---',
    obj.subPackagesRoot,
    obj.subPackagesName
  );
} else {
  console.log('未找到VITE_LOGIN_WX_APP_CONFIG的值--xxx');
}
// 公共模块的root、name都是固定的，不需要跟项目绑定，所以注释掉
// subPackagesObj.root = subPackagesRoot;
// subPackagesObj.name = subPackagesName;

console.log('subPackagesObj----', subPackagesObj, subPackagesRoot, subPackagesName);

// const emptyObject = {};
// // 如果不存在则创建测试
// !fs.existsSync(pagesPath) && fs.writeFileSync(pagesPath, JSON.stringify(emptyObject, null, 2));
// 读取pages.json配置下的内容
if (fs.existsSync(pagesPath)) {
  console.log('存在', pagesPath);
  // 读取主文件内容
  let pagesJson = fs.readFileSync(pagesPath, 'utf-8');
  // 消除注释
  pagesJson = pagesJson.replace(/(\/\/\s*#.*?\n)/g, '');
  const pagesConfig = JSON.parse(pagesJson);
  if (pagesConfig.subPackages) {
    // 判断主pages文件中是否已经配置了subPackages，且public.json中的子包配置是否存在
    const subIndex = pagesConfig.subPackages.findIndex((item) => {
      return item.root === subPackagesObj.root;
    });
    if (subIndex === -1) {
      // 不存在则添加
      pagesConfig.subPackages.push(subPackagesObj);
    } else {
      // console.log('存在则找到里面相同的进行替换');
      // 存在则找到里面相同的进行替换
      const subObj = pagesConfig.subPackages[subIndex];
      // 遍历pages，如果里面的item跟subPackagesObj一样则替换掉
      const pagesAry = subObj.pages;
      const newPagesAry = pagesAry.map((item) => {
        const subItemIndex = subPackagesObj.pages.findIndex((sItem) => item.path === sItem.path);
        // 在删除掉subPackagesObj 中存在的
        if (subItemIndex !== -1) {
          const subItem = subPackagesObj.pages[subItemIndex];
          // 在删除掉
          subPackagesObj.pages.splice(subItemIndex, 1);
          // 如果存在则覆盖掉
          return subItem;
        }
        return item;
      });
      subObj.pages = [...newPagesAry, ...subPackagesObj.pages];
      // console.log('存在则找到里面相同的进行替换----', subObj.pages[0]);
      pagesConfig.subPackages[subIndex] = subObj;
    }
  } else {
    // 主包不存在subPackages
    pagesConfig.subPackages = [subPackagesObj];
  }
  // 将JSON对象转成JSON字符串
  const jsonString = JSON.stringify(pagesConfig, null, 2);
  // console.log('jsonString---', jsonString);
  // 写入pages.json
  fs.writeFileSync(pagesCopyPath, jsonString);
}

// 处理注释的代码 下面代码存在问题，所以先不使用
function test() {
  // 读取文件内容
  let content = fs.readFileSync(pagesPath, 'utf-8');
  console.log('content---', content);
  // 用正则表达式匹配注释并将其删除，但同时保留注释的位置
  const commentPositions = [];
  content = content.replace(/(\/\/\s*#.*?\n)/g, (match, p1, offset) => {
    commentPositions.push({ comment: match, position: offset });
    return ``;
  });
  console.log('content222---', commentPositions);
  // 解析为JSON对象
  const pagesConfig = JSON.parse(content);
  console.log('content222---', content);

  // 在JSON对象中添加内容
  // pagesConfig.newProperty = 'new value';

  // 对页面配置进行修改...
  // ...

  // 将修改后的JSON对象再转回字符串
  content = JSON.stringify(pagesConfig, null, 2);
  // 将注释插入
  commentPositions.forEach(({ comment, position }) => {
    content = content.slice(0, position) + comment + content.slice(position);
  });
  console.log('content333---', content);
  // fs.writeFileSync(pagesPath, content);
}

// function test2() {
//   const content = fs.readFileSync(pagesPath, 'utf-8');
//   // 使用 JSON5 解析为对象
//   const pagesConfig = json5.parse(content);
//   pagesConfig.subPackages = [subPackagesObj];
//   // 将对象转换为 JSON 字符串
//   const jsonString = json5.stringify(pagesConfig, null, 2);
//   console.log('jsonString---', pagesPath);
//   // 写入文件
//   fs.writeFileSync(pagesPath, jsonString);
// }
