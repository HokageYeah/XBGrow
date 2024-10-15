/**
 * 添加拦截器:
 *   拦截 request 请求
 *   拦截 uploadFile 文件上传
 *
 * TODO:
 *   1. 非 http 开头需拼接地址
 *   2. 请求超时
 *   3. 添加小程序端请求头标识
 *   4. 添加 token 请求头标识
 */
import { isXzxReadingUni } from '../hooks/index';
import {
  loginInfoDealGradeTerm,
  loginInfoDealMoreIdentity,
  loginInfoDealSingUserInfo
} from './login-info';
import { initReadAPPData } from './loginGetInfo';

import { getCurPageUrlWithQS } from './util';
import { apiBaseUrl } from '@/uni-module-common/config/';

// 统一请求
import ajax from '@/uni-module-common/http';
// 统一请求

// import { useMemberStore } from '@/stores';

// export const baseURL = 'https://rest-test.xxt.cn';
export const baseURL = apiBaseUrl;
let curEnv = 'release';
// 是否 release 环境
let isRelease = true;
// 全局对象，通过 init(gd) 方法传入
let globalData = null;
// 环境初始化
const initEnv = () => {
  // 初始化
  try {
    const accountInfo = uni.getAccountInfoSync();
    const env = accountInfo.miniProgram.envVersion;
    curEnv = env;
    if (env === 'develop' || env === 'trial') {
      // 非 release 环境
      isRelease = false;

      // 开发、演示版本时替换全局变量 wx.$baseUrl
      // wx.$baseUrl.baseRestUrl = 'https://rest-test.xxt.cn'
      // wx.$baseUrl.baseLoginUrl = 'https://login-test.xxt.cn'
      // wx.$baseUrl.baseCephUrl = 'https://obs.xxt.cn'

      console.log(
        `================ 当前环境为 ${env}。wx.$baseUrl: ${JSON.stringify(
          baseURL
        )} ================`
      );
    }
  } catch (e) {
    console.log('CatchClause', e);
    console.log('CatchClause', e);
    console.error('识别运行环境时发生异常，将按 release 环境运行');
  }
};

/**
 * 生成随机字符串
 * @param {*} length
 */
const randomString = (length) => {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += str[Math.floor(Math.random() * str.length)];
  }
  return result;
};
/**
 * 保存响应头中的 Cookie 信息（仅针对 XXT_ID、XXT_TICKET、_XSID_ 做处理）
 * @param {*} cookies
 */
/**  使用统一的登录请求逻辑， 这里的拦截是要去掉的。
const needDealCookieNames = {
  JSESSIONID: true,
  XXT_ID: true,
  XXT_TICKET: true,
  _XSID_: true,
  _LOGIN_MA_: true,
  _SSID_: true,
  _XXT_ID: true,
  _WUID_: true,
  mat: true
};
*/
/**
 * 保存响应 Cookie
 * @param {*} cookies
 */
/**  使用统一的登录请求逻辑， 这里的拦截是要去掉的。
const saveCookies = (cookies) => {
  if (!cookies && cookies.length === 0) {
    return;
  }
  let cookieChanged = false;
  cookies.forEach((cookie) => {
    console.log(cookie);
    const sections = cookie.split(';');
    if (sections.length > 0) {
      const tmp = sections[0].split('=');
      if (tmp.length === 2) {
        const name = tmp[0];
        const value = tmp[1];
        if (name && needDealCookieNames[name]) {
          // 修改 globalData.cookieMap 对应数据
          if (value) {
            // Cookie 有效期 100 分钟（注：需要小于 120 分钟）
            globalData.cookieMap[name] = {
              value,
              expires: new Date().getTime() + 6000000
            };
          } else {
            delete globalData.cookieMap[name];
          }
          cookieChanged = true;
        }
      }
    }
    if (cookieChanged) {
      uni.setStorageSync('cookieMap', JSON.stringify(globalData.cookieMap));
    }
  });
};
 */

/**
 * 通用处理
 * @param {*} obj
 * @param {*} category
 */
/**  使用统一的登录请求逻辑， 这里的拦截是要去掉的。
const commonDeal = (obj, category) => {
  console.log('--------globalData.saveStateCookie-----------before---', globalData);
  const cookies = JSON.parse(JSON.stringify(globalData.cookieMap));
  console.log('--------globalData.saveStateCookie-----------', globalData.saveStateCookie);
  console.log(category);
  console.log(globalData.saveStateCookie);
  console.log(globalData.saveStateCookie && globalData.saveStateCookie._SSO_STATE_TICKET);
  if (globalData.saveStateCookie && globalData.saveStateCookie._SSO_STATE_TICKET) {
    cookies._SSO_STATE_TICKET = globalData.saveStateCookie._SSO_STATE_TICKET;
    cookies._SSO_SAVE_STATE = globalData.saveStateCookie._SSO_SAVE_STATE;
  }
  console.log('commonDeal-----cookies----', cookies);

  // 1. 自动添加 Cookie 请求头
  const header = obj.header || {};
  console.log('commonDeal-----obj.header----', obj.header);
  let headerCookieData = header.Cookie || '';
  const nowMills = new Date().getTime();
  for (const key in cookies) {
    const cookie = cookies[key];
    if (cookie.value && (cookie.expires === -1 || cookie.expires > nowMills)) {
      headerCookieData += `${(headerCookieData.length > 0 ? '; ' : '') + key}=${cookie.value}`;
    }
  }
  if (headerCookieData) {
    header.Cookie = headerCookieData;
  }
  console.log('commonDeal-----', header.Cookie);
  console.log('commonDeal-----header----', header);
  console.log('commonDeal-----obj----', obj);
  obj.header = header;

  // 对响应的通用处理
  const _success = obj.success;
  obj.success = function (res) {
    saveCookies(res.cookies);
    if (_success) {
      _success(res);
    }
  };
};

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    console.log('网络请求失败----httpInterceptor');
    if (!isXzxReadingUni()) {
      return;
    }
    // 1. 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url;
    }
    // 2. 请求超时, 默认 60s 在mainfest.json配置超时
    // options.timeout = 10000;
    // 3. 添加小程序端请求头标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp'
    };
    // 4. 添加 token 请求头标识
    // const memberStore = useMemberStore();
    // const token = memberStore.profile?.token;
    // if (token) {
    //   options.header.Authorization = token;
    // }
    commonDeal(options, 'request');
  }
};
uni.addInterceptor('request', httpInterceptor);
uni.addInterceptor('uploadFile', httpInterceptor);
*/

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型，支持泛型
 *  3. 获取数据失败
 *    3.1 401错误  -> 清理用户信息，跳转到登录页
 *    3.2 其他错误 -> 根据后端错误信息轻提示
 *    3.3 网络错误 -> 提示用户换网络
 */
// interface Data<T> {
//   code: string;
//   msg: string;
//   result: T;
// }
// 2.2 添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  const { url, method, data } = options;
  // 使用最新的统一登录请求摒弃之前的请求格式
  return ajax({
    url,
    method,
    data,
    // header,
    custom: { showLoading: false }
  });

  // 1. 返回 Promise 对象
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        console.log('res******', res);
        // 状态码 2xx， axios 就是这样设计的
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res.data as T);
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          // const memberStore = useMemberStore();
          // memberStore.clearProfile();
          uni.navigateTo({ url: '/pages/login/login' });
          reject(res);
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: '请求错误'
          });
          reject(res);
        }
      },
      // 响应失败
      fail(err) {
        console.log('err------', err);
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试'
        });
        reject(err);
      }
    });
  });
};
/**
 * 发送接口请求
 * @param {*} obj
 */
export const uniRequest = async (obj: any) => {
  // commonDeal(obj, 'request');

  // 使用统一的请求
  const { url, method, data, header, success, fail, custom = { showLoading: false } } = obj;
  try {
    const result: any = await ajax({
      url,
      method,
      data,
      // header,
      custom
    });
    console.log('uniRequest-----', result);
    success({ data: result });
  } catch (error) {
    console.log('uniRequest-----error---', error);
    fail(error);
  }
  // return uni.request(obj);
};

/**
 * 将小程序 URL 转为正常 URL
 * @param {*} url
 */
const normalizeUrl = (url: string) => {
  const app = getApp();
  const entry = app.globalData!.entry;
  console.log('normalizeUrl-----', app);
  console.log('normalizeUrl-----entry----', entry);
  return url ? `https://${entry}.xxt.cn/${url}` : '';
};

/**
 * 校验事件日志传参的格式
 * @param {String} eventType 事件类型标识
 * @param {String} _source   事件来源区域标识 【注】可选参数
 * @param {Object} _content  事件内容        【注】可选参数
 */
const checkEventParams = (eventType: string, _source?: string, _content?: object) => {
  let valid = true;
  if (typeof eventType !== 'string') {
    valid = false;
    uni.showModal({
      title: `程序猿/媛请注意！ logEvent.event 方法入参 eventType: ${eventType} 格式错误，必须是字符串！`,
      showCancel: false
    });
  } else if (eventType.length === 0) {
    valid = false;
    uni.showModal({
      title: `程序猿/媛请注意！ logEvent.event 方法入参 eventType: ${eventType} 长度为 0，这能记上啥？`,
      showCancel: false
    });
  }
  if (_source) {
    if (typeof _source !== 'string') {
      valid = false;
      uni.showModal({
        title: `程序猿/媛请注意！ logEvent.event 方法入参 _source: ${_source} 格式错误，必须是字符串！`,
        showCancel: false
      });
    }
  }
  if (_content) {
    if (typeof _content !== 'object' || Array.isArray(_content)) {
      // 数组使用 typeof 求值也是 object，因此需要排查
      valid = false;
      uni.showModal({
        title: `程序猿/媛请注意！ logEvent.event 方法入参 _content: ${_content} 格式错误，必须是 json 对象！`,
        showCancel: false
      });
    }

    // 检查 _content 子属性，不能是 json 对象或数组
    for (const key in _content) {
      const value = _content[key];
      if (value != null && typeof value === 'object') {
        // 值为 null、undefined 时会在后续逻辑中移除，此处可放行
        valid = false;
        uni.showModal({
          title: `程序猿/媛请注意！ logEvent.event 方法入参 _content: ${_content} 格式错误，存在嵌套属性 ${key}！`,
          showCancel: false
        });
      }
    }
  }
  return valid;
};

/**
 * 发送事件日志
 * @param {String} eventType 事件类型标识
 * @param {String} _source   事件来源区域标识 【注】可选参数
 * @param {Object} _content  事件内容        【注】可选参数
 */
export const uniEvent = (eventType: string, _source?: string, _content?: object) => {
  const { isLogin, userInfo } = useStore('user');
  const currentPageUrl = getCurPageUrlWithQS();
  if (curEnv === 'develop') {
    if (checkEventParams(eventType, _source, _content)) {
      console.log(
        `========= ${curEnv} 环境只打印，不实际发送事件日志。currentPageUrl: ${currentPageUrl}, cureventType: ${eventType}, _source: ${_source}, _content: ${JSON.stringify(
          _content
        )} =========`
      );
    }
  } else {
    const webId = isLogin.value ? userInfo.value.wid : null;
    const logUrl = `https://click.xxt.cn/click/eventlog.do?eventLog.eventType=${encodeURI(
      encodeURI(eventType)
    )}&eventLog.webId=${webId}&eventLog.currentURL=${encodeURIComponent(
      normalizeUrl(currentPageUrl)
    )}&eventLog.source=${_source ? encodeURI(encodeURI(_source)) : ''}&eventLog.content=${
      _content ? encodeURI(encodeURI(JSON.stringify(_content))) : ''
    }`;
    // console.log(`logUrl: ${logUrl}`)
    console.log('uniEvent-----', logUrl);
    uniRequest({
      url: logUrl,
      method: 'GET'
    });
  }
};

const getUserMore = () => {
  // 获取用户所有身份
  uniRequest({
    url: `${baseURL}/user-data-v2/user/get-user-account-list`,
    method: 'GET',
    success(res) {
      const data = res.data;
      const accountId = data.accountId;
      const usableAccounts = data.usableAccounts;
      const list = loginInfoDealMoreIdentity(usableAccounts, accountId);

      // 处理多身份数据
      if (usableAccounts.length === 1) {
        globalData.isMore = false;
        globalData.userInfoList = [];
      } else {
        globalData.isMore = true;
        globalData.userInfoList = list;
      }
      uni.setStorageSync(
        'userOtherInfo',
        JSON.stringify({
          loginFlag: true,
          isMore: globalData.isMore
        })
      );
      console.log('--------------全局用户身份-----------------');
      console.log(globalData);
    },
    fail(e) {
      console.log(e);
    }
  });
};

/**
 * 保持登录凭证 Cookie 保存
 * @param {*} res
 */
export const dealLoginSuccessResponse = (res) => {
  debugger;
  console.log(res);
  debugger;
  const saveCookie = {
    _SSO_STATE_TICKET: null,
    _SSO_SAVE_STATE: null
  };
  res.cookies.forEach((cookie) => {
    if (cookie.startsWith('_SSO_STATE_TICKET=') || cookie.startsWith('_SSO_SAVE_STATE=')) {
      // 全局设置并持久保存 - 保持登录凭证 Cookie
      const sections = cookie.split(';');
      if (sections.length > 0) {
        const tmp = sections[0].split('=');
        if (tmp.length === 2) {
          const cookieDataState = {
            value: tmp[1],
            expires: new Date().getTime() + 7 * 24 * 60 * 60 * 1000
          };
          saveCookie[tmp[0]] = cookieDataState;
        }
      }
    }
  });

  initReadAPPData(res.cookies.join(';'), res.data.userInfo);
  console.log('dealLoginSuccessResponse-----', saveCookie);
  globalData.saveStateCookie = saveCookie;
  uni.setStorageSync('saveStateCookie', JSON.stringify(saveCookie));

  const data = res.data;

  // 处理全局变量
  globalData.loginFlag = true;
  globalData.userNowRoleInfo = loginInfoDealSingUserInfo(
    data.userInfo,
    data.userInfo.xinzxAccountId
  );
  globalData.deafultGradeTerm = loginInfoDealGradeTerm(globalData);

  uni.setStorageSync('userInfo', JSON.stringify(globalData.userNowRoleInfo));
  uni.setStorageSync(
    'userOtherInfo',
    JSON.stringify({
      loginFlag: true
    })
  );
};
const loginByWxApplet = () => {
  // wx.$log.info('静默登录');

  // wx.$event('静默登录', '首页', {});

  // 静默登录
  uni.login({
    success: (res) => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      uniRequest({
        url: `${baseURL}/login-v2/login/login-by-wx-applet`,
        method: 'POST',
        data: {
          entry: globalData.entry,
          code: res.code,
          loginDefault: true
        },
        success(res) {
          console.log(`静默登录cookie:${res.cookies}`);
          // wx.$log.info(`静默登录cookie:${res.cookies}`);
          const data = res.data;
          if (data.loginResult && data.loginResult.code === 101) {
            dealLoginSuccessResponse(res);

            getUserMore();
          } else {
            // wx.$log.info(`静默登录其他信息:${JSON.stringify(data)}`);
          }
        },
        fail(e) {
          // wx.$log.info(`静默登录失败原因:${e}`);
          // log.info(`静默登录失败原因：${e}`);
          console.log(e);
        }
      });
    }
  });
};
/**
 * 初始化。这个方法需要在 app 的 onLaunch 中调用
 * @param {Object} gd
 */
export const init = (gd: any) => {
  initEnv();
  globalData = gd;
  // 读取缓存数据
  const cachedCookiesData = uni.getStorageSync('cookieMap');
  const cookieMap = JSON.parse(cachedCookiesData || '{}');
  const nowMills = new Date().getTime();

  // 剔除过期的 Cookie
  for (const key in cookieMap) {
    const cookie = cookieMap[key];
    if (cookie.expires === -1 || cookie.expires > nowMills) {
      globalData.cookieMap[key] = cookie;
    }
  }

  // xxtSessionId 不存在时生成一个
  if (!globalData.cookieMap.xxtSessionId) {
    const value = `wxmp.${nowMills}.${randomString(13)}`;
    globalData.cookieMap.xxtSessionId = {
      value,
      expires: -1
    };
  }
  uni.setStorageSync('cookieMap', JSON.stringify(globalData.cookieMap));
  console.log('dealLoginSuccessResponse-----cookieMap-----', globalData.cookieMap);
  let saveStateCookie = {};
  let isValid = false;
  const cachedData = uni.getStorageSync('saveStateCookie');
  console.log(cachedData);
  let jsonData = {};
  if (cachedData) {
    jsonData = JSON.parse(cachedData);
  }
  let saveStateJson = null;
  if (jsonData) {
    saveStateJson = jsonData._SSO_STATE_TICKET;
  }
  console.log(saveStateJson);
  if (saveStateJson && saveStateJson.expires > nowMills) {
    isValid = true;
    saveStateCookie = jsonData;
  }
  console.log('dealLoginSuccessResponse-----init-----', saveStateCookie);
  globalData.saveStateCookie = saveStateCookie;
  uni.setStorageSync('saveStateCookie', JSON.stringify(saveStateCookie));
  const isfals =
    globalData.cookieMap.XXT_ID && (globalData.cookieMap.XXT_TICKET || globalData.cookieMap._XSID_);
  console.log('dealLoginSuccessResponse-----cookieMapinit-----', globalData.cookieMap);
  console.log('dealLoginSuccessResponse-----XXT_ID-----', globalData.cookieMap.XXT_ID);
  console.log('dealLoginSuccessResponse-----XXT_TICKET-----', globalData.cookieMap.XXT_TICKET);
  console.log('dealLoginSuccessResponse-----_XSID_-----', globalData.cookieMap._XSID_);
  console.log('dealLoginSuccessResponse-----isfals-----', isfals);
  if (
    globalData.cookieMap.XXT_ID &&
    (globalData.cookieMap.XXT_TICKET || globalData.cookieMap._XSID_)
  ) {
    uniEvent('cookie登录', '首页', {});
    // 用户登录信息有效，直接设置 userInfo----todo
    globalData.userNowRoleInfo = JSON.parse(uni.getStorageSync('userInfo') || JSON.stringify({}));
    const otherInfo = JSON.parse(uni.getStorageSync('userOtherInfo') || JSON.stringify({}));
    console.log('initWxLogin---otherInfo---', otherInfo);
    globalData.loginFlag = otherInfo.loginFlag ? otherInfo.loginFlag : false;
    console.log('initWxLogin---loginFlag---', globalData.loginFlag);
    globalData.isMore = otherInfo.isMore ? otherInfo.isMore : false;
    // 处理年级
    globalData.deafultGradeTerm = loginInfoDealGradeTerm(globalData);
    getUserMore();
  } else {
    uni.setStorageSync('userInfo', JSON.stringify({}));
    uni.setStorageSync('userOtherInfo', JSON.stringify({}));
  }
  if (globalData.loginFlag) {
    return;
  }
  console.log('initWxLogin---globalData.loginFlag---', globalData.loginFlag);
  // 凭证登录
  let isNeedWxLogin = true;
  if (isValid) {
    isNeedWxLogin = false;
    // todo
    uniEvent('凭证登录', '首页', {});
    uniRequest({
      url: `${baseURL}/login-v2/login/login-by-save-login`,
      method: 'GET',
      data: {
        entry: globalData.entry,
        loginDefault: true
      },
      success(res) {
        const data = res.data;
        if (!data.loginResult) {
          loginByWxApplet();
          return;
        }
        if (data.loginResult.code === 101) {
          dealLoginSuccessResponse(res);
          getUserMore();
        }
      },
      fail(e) {
        console.log(e);
        loginByWxApplet();
      }
    });
  }
  if (isNeedWxLogin) {
    loginByWxApplet();
  }
};

// /**
//  * 发送页面浏览日志（打开页面时自动调用，业务代码中不需要关注）
//  *
//  * @param {String} url       跳转至的页面 Url（含参数）
//  * @param {String} referer   来源页面（含参数）
//  */
// const view = (url: string, referer: string) => {
//     const windowInfo = uni.getSystemInfoSync();
//     const width = windowInfo.screenWidth ? windowInfo.screenWidth : 0;
//     const height = windowInfo.screenHeight ? windowInfo.screenHeight : 0;
//     if (curEnv === 'develop') {
//         console.log(`========= ${curEnv} 环境只打印，不实际发送页面浏览日志。url: ${url}, referer: ${referer}, width: ${width}, height: ${height} =========`);
//     } else {
//         // 其他环境发送页面浏览日志
//         const webId = globalData.loginFlag ? globalData.userNowRoleInfo['webId'] : null;
//         const logUrl =
//             'https://click.xxt.cn/click/statrecord.do?cr.url=' +
//             encodeURIComponent(normalizeUrl(url)) +
//             '&cr.referURL=' +
//             encodeURIComponent(normalizeUrl(referer)) +
//             '&cr.webId=' +
//             webId +
//             '&cr.windowWidth=' +
//             width +
//             '&cr.windowHeight=' +
//             height +
//             '&cr.charset=UTF-8';
//         // console.log(`logUrl: ${logUrl}`)
//         uniRequest({
//             url: logUrl
//         });
//     }
// }

// /**
//  * 获取当前运行环境
//  */
// const getCurEnv = () => {
//   return curEnv
// }

/**
 * 当前是否 release 环境
 */
export const isCurEnvRelease = () => {
  return isRelease;
};
