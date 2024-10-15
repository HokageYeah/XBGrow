// 配置信息
// 考虑到不同环境的差异性，需通过 uni-app 条件编译才能得到最终配置
// 因此，需要从这里获取最终配置

import manifest from '../../manifest.json';
import config from './config.json';
import { projectModuleConfig } from '@/uni-module-common/config/all-common-config';
import type {
  appCommonConfigType,
  projectItemConfigType
} from '@/uni-module-common/config/all-common-config';

// 接口域名
let apiBaseUrl = import.meta.env.VITE_GLOB_API_URL;
// 上传接口域名
const uploadBaseUrl = import.meta.env.VITE_GLOB_UPLOAD_URL;
// 接口前缀
let apiUrlPrefix = import.meta.env.VITE_GLOB_API_URL_PREFIX;

// 点击日志接口域名
let clickBaseUrl = import.meta.env.VITE_GLOB_CLICK_URL;
// 点击日志接口前缀
const clickUrlPrefix = import.meta.env.VITE_GLOB_CLICK_URL_PREFIX;

// //  在接口返回未登录的时候，不跳转登录页面接口白名单
// const noLoginApiWhiteList = import.meta.env.VITE_LOGIN_WHITE_LIST
//   ? JSON.parse(import.meta.env.VITE_LOGIN_WHITE_LIST)
//   : [];
//  当前登录小程序各个配置 第一个是loginConfig.json配置文件的key，
//  第二个是public.json文件中subPackages的root值
const WxAppConfig: any = import.meta.env.VITE_LOGIN_WX_APP_CONFIG
  ? Object.fromEntries(JSON.parse(import.meta.env.VITE_LOGIN_WX_APP_CONFIG))
  : {};

const loginConfigKey = config.loginConfigKey as appCommonConfigType;
// 当前项目的配置信息
const appModuleConfig = projectModuleConfig[loginConfigKey] as projectItemConfigType;

//  在接口返回未登录的时候，不跳转登录页面接口白名单
const noLoginApiWhiteList = appModuleConfig.noLoginApiWhiteList;

console.log('config.json---', config, loginConfigKey, appModuleConfig);

// 「H5 应用」页面与接口使用的是同一个域名，不需要指定接口域名，但需要指定前缀
// #ifdef H5
apiBaseUrl = '';
clickBaseUrl = '';
// #endif

// 「非 H5 应用」接口使用 API 网关域名，不需要指定接口前缀
// #ifndef H5
apiUrlPrefix = '';
// #endif

// 静态资源 CDN 域名
const $cdn = import.meta.env.VITE_GLOB_IMG_CDN_URL;

// 小程序 versionName
const versionName = manifest.versionName;
// 小程序 versionCode
const versionCode = manifest.versionCode;

// 构建命令中通过 --mode XXX 指定，见 package.json
const mode = import.meta.env.MODE;
// 构建时间。在 build/utils.ts 中指定
const buildTime = import.meta.env.VITE_BUILD_TIME;
const baseCephUrl = 'https://obs-prod.xxt.cn';
console.log(
  `工程配置。  apiBaseUrl 接口域名: ${apiBaseUrl}, apiUrlPrefix 接口前缀: ${apiUrlPrefix},` +
    ` clickBaseUrl 点击日志接口域名: ${clickBaseUrl}, clickUrlPrefix 点击日志接口前缀: ${clickUrlPrefix},` +
    ` $cdn 静态资源 CDN 域名: ${$cdn},` +
    ` versionName: ${versionName}, versionCode: ${versionCode},` +
    ` mode: ${mode}, 打包时间: ${buildTime},` +
    ` 未登录时不跳转登录API白名单noLoginApiWhiteList: ${noLoginApiWhiteList}` +
    ` 各个小程序、app独有的文件配置: ${WxAppConfig}`
);

export {
  apiBaseUrl, // 接口域名
  apiUrlPrefix, // 接口前缀
  clickBaseUrl, // 点击日志接口域名
  clickUrlPrefix, // 点击日志接口前缀
  $cdn, // 静态资源 CDN 域名
  versionName, // 小程序 versionName
  versionCode, // 小程序 versionCode
  mode, // 编译模式
  buildTime, // 代码构建、发布时间
  uploadBaseUrl, // 上传接口域名
  noLoginApiWhiteList, // 在接口返回未登录的时候，不跳转登录页面接口白名单
  WxAppConfig, // 当前登录小程序各个配置,.env文件中的配置
  baseCephUrl,
  appModuleConfig // project-module-config各个文件的配置
};
