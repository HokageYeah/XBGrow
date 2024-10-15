// import { WxAppConfig } from '@/uni-module-common/config/';
// const { loginConfigKey } = WxAppConfig;
// console.log('WxAppConfig----', WxAppConfig.loginConfigKey);
// const appCommonConfigFun = async () => {
//   const funTest = await import(`./${loginConfigKey}-config.ts`);
//   return funTest;
// };
// let appCommonConfig;
// // #ifdef H5
// appCommonConfig = await import(`./${loginConfigKey}-config.ts`);
// // #endif
// // #ifndef H5
// appCommonConfig = require(`./${loginConfigKey}-config.js`);
// appCommonConfig = appCommonConfigFun();
// // #endif
// console.log('appCommonConfig----', appCommonConfig);
// export { appCommonConfig, appCommonConfigFun };
import type { appConfigType } from './project-modules-config/projectType';
type appCommonConfigType = 'xzx-reading' | 'szjx' | 'xxt-income' | 'xxt';
interface projectItemConfigType {
  wxSubscribeTemplIds: {
    teacherSubscribeTemplIds: string[];
    studentSubscribeTemplIds: string[];
  };
  defalutAppConfig: appConfigType;
  // 请求的entry
  entry: string;
  // 微信小程序账号的原始ID
  WXMPOriginalID: string;
  // 公共分包模块的配置路径
  publicSubPackgePath: string;
  // 主包路径
  subPackagesRoot: string;
  // 报名称
  subPackagesName: string;
  // 登录验证码
  loginPhoneCode: number;
  // 绑定验证码
  bindPhoneCode: number;
  // 项目id
  loginConfigKey: appCommonConfigType;
  // hostId
  hostId: number;
  // 在接口返回未登录的时候，不跳转登录页面接口白名单
  noLoginApiWhiteList: string[];
  // 新增WX公众号的entry
  wxPublicEntry?: string;
}
type projectModuleConfigType = {
  [key in appCommonConfigType]?: projectItemConfigType;
};
const modules: Record<string, { default: string }> = import.meta.glob(
  './project-modules-config/**/*.ts',
  {
    eager: true
  }
);
console.log('projectModuleConfig-----modules---', modules);
const projectModuleConfig: projectModuleConfigType = {};
function getContentBetweenSlashes(str: string): false | string[] {
  const regex = /\/([^\s/]+)-config/g;
  const matches = str.match(regex) as any[];
  console.log('projectModuleConfig-----matches---', matches);
  const result = matches.length > 1 && matches.map((match) => match.slice(1, -7));
  return result;
}
Object.keys(modules).forEach((key) => {
  const keyAry = getContentBetweenSlashes(key);
  console.log('projectModuleConfig-----keyAry---', keyAry);
  console.log('projectModuleConfig-----[key]---', key);
  console.log('projectModuleConfig-----modules[key]---', modules[key]);
  if (keyAry) {
    const modObj = modules[key].default as unknown as projectItemConfigType;
    console.log('projectModuleConfig-----modObj---', modObj);
    const keyStr = keyAry[1] as appCommonConfigType;
    projectModuleConfig[keyStr] = modObj;
  }
});
console.log('projectModuleConfig-----', projectModuleConfig);

export { projectModuleConfig, appCommonConfigType, projectItemConfigType, projectModuleConfigType };
