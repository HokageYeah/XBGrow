import { loginInfoDealGradeTerm, loginInfoDealSingUserInfo } from './login-info';
import { initReadAPPData } from './loginGetInfo';

/**
 * 保持登录凭证 Cookie 保存
 * @param {*} res
 */
const { setToken, resetUserData } = useStore('user');
export const dealLoginSuccessResponse = (res) => {
  const app = getApp();
  console.log(app.globalData);
  debugger;
  console.log(res);
  const saveCookie = {
    _SSO_STATE_TICKET: null,
    _SSO_SAVE_STATE: null
  };
  console.log('登录信息保存');
  console.log(res.cookies);
  res.cookies.forEach((cookie) => {
    if (cookie.startsWith('_SSO_STATE_TICKET=') || cookie.startsWith('_SSO_SAVE_STATE=')) {
      // 全局设置并持久保存 - 保持登录凭证 Cookie
      const sections = cookie.split(';');
      if (sections.length > 0) {
        const tmp = sections[0].split('=');
        if (tmp.length === 2) {
          const cookieDataState = {
            value: tmp[1],
            expires: new Date().getTime() + 10080 * 60 * 1000
          };
          saveCookie[tmp[0]] = cookieDataState;
        }
      }
    }
  });
  // dd
  initReadAPPData(res.cookies.join(';'), res.data.userInfo);
  app.globalData!.saveStateCookie = saveCookie;
  uni.setStorageSync('saveStateCookie', JSON.stringify(saveCookie));
  const data = res.data;

  // 处理全局变量
  app.globalData!.loginFlag = true;
  app.globalData!.userNowRoleInfo = loginInfoDealSingUserInfo(
    data.userInfo,
    data.userInfo.xinzxAccountId
  );
  app.globalData!.deafultGradeTerm = loginInfoDealGradeTerm(app.globalData!);
  uni.setStorageSync('userInfo', JSON.stringify(app.globalData!.userNowRoleInfo));
  uni.setStorageSync(
    'userOtherInfo',
    JSON.stringify({
      loginFlag: true
    })
  );
};
export const dealLoginOutToken = () => {
  resetUserData();
};
