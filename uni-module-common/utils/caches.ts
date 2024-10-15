import { variableTypeDetection } from './verifyType';
// 获取cookie
export function getCookie(name: string) {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return arr[2];
  }
  return null;
}

// 设置cookie,增加到vue实例方便全局调用
export function setCookie(c_name: string, value: string, opt_expires?: any, opt_path?: string) {
  let cookieText = `${c_name}=${escape(value)}`;
  if (opt_expires instanceof Date) {
    cookieText += `;expires=${opt_expires.toString()}`;
  }
  if (!opt_path) {
    opt_path = '/';
  }
  cookieText += `; path=${opt_path}`;
  // #ifdef H5
  document.cookie = cookieText;
  // #endif
  // #ifndef H5
  uni.setStorageSync(c_name, cookieText);
  // #endif
}

// 删除cookie
export function delCookie(name: string) {
  setCookie(name, '', -1);
}

/*
 * session.js
 * sessionstorage的实现
 */
export function getSession(key: string) {
  const item = sessionStorage.getItem(key);
  // 这点要判断是字符串还是对象
  const result = /^[{\[].*[}\]]$/g.test(item!);
  if (result) {
    return JSON.parse(item!);
  }
  return item;
}

export function setSession(key: string, value: string) {
  // 这点要判断是字符串还是对象
  if (typeof value === 'string') {
    sessionStorage.setItem(key, value);
  } else {
    const item = JSON.stringify(value);
    sessionStorage.setItem(key, item);
  }
}

export function removeSession(key: string) {
  sessionStorage.removeItem(key);
}

/*
 * localstorage.js
 * localStorage的实现
 */
export function getLocal(key: string) {
  let item: any = localStorage.getItem(key);
  const result = /^[{\[].*[}\]]$/g.test(item!);
  if (result) {
    item = JSON.parse(item!);
  }
  const currentTime = new Date().getTime();
  if (!item || !item.expiration || currentTime > item.expiration) {
    // 数据已过期，清除
    localStorage.removeItem(key);
    item = null;
    return item;
  }
  return item.value;
}

export function setLocal(key: string, value: string, expiration: string) {
  // expiration 失效时间以分钟为单位 默认是半个小时
  const delay = parseInt(expiration, 10) || 30;
  const ExpirationValue = new Date().getTime() + delay * 60 * 1000;
  // 这点要判断是字符串还是对象
  if (typeof value === 'string') {
    localStorage.setItem(key, JSON.stringify({ value, expiration: ExpirationValue }));
  } else {
    const keyValue = JSON.stringify(value);
    localStorage.setItem(key, JSON.stringify({ value: keyValue, expiration: ExpirationValue }));
  }
}

export function removeLocal(key: string) {
  localStorage.removeItem(key);
}

export function formatTokenObj(token: string) {
  // console.log('formatTokenObj---', token);
  // console.log('formatTokenObj---type---', Object.prototype.toString.call(token).slice(8, -1));
  let tokenStr = '';
  if (variableTypeDetection.isObject(token)) {
    Object.entries(token).forEach(([key, item]: any) => {
      const value = item.value;
      tokenStr += `${key}=${value};`;
    });
  } else {
    tokenStr = token;
  }
  // console.log('formatTokenObj---tokenStr---', tokenStr);
  const cookieAry = tokenStr.split(';').map((item) => item.split('='));
  // console.log('formatTokenObj---split---', cookieAry);
  const cookieObj: any = {};
  cookieAry.forEach((item) => {
    const key = item[0].replace(/\s/g, '');
    cookieObj[key] = item[1];
  });
  return cookieObj;
}
