import ajax from '@/uni-module-common/http';
import {
  newDelLoginInfoDealMoreIdentity,
  newloginInfoDealSingUserInfo
} from '@/uni-module-common/utils/login-info';
import eventBus from '@/uni-module-common/utils/eventBus';
import bridge from '@/uni-module-common/utils/uniToNativeBridge';

export const uniGetUserProfile = () => {
  return new Promise<{ userInfo: any }>((resolve) => {
    // 验证码验证
    uni.getUserProfile({
      desc: '用于完善个人信息',
      // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('getUserProfile----', res);
        if (res.userInfo) {
          console.log('getUserProfile----userInfo---', res.userInfo);
          resolve(res);
        } else {
          uni.showToast({
            title: '用户信息异常',
            icon: 'none'
          });
        }
      },
      fail(e) {
        console.log(e);
        uni.showToast({
          title: '请授权用户头像',
          icon: 'none'
        });
      }
    });
  });
};

export const allGrades = [
  {
    code: 21,
    desc: 'L1'
  },
  {
    code: 22,
    desc: 'L2'
  },
  {
    code: 23,
    desc: 'L3'
  },
  {
    code: 24,
    desc: 'L4'
  },
  {
    code: 25,
    desc: 'L5'
  },
  {
    code: 26,
    desc: 'L6'
  },
  {
    code: 31,
    desc: 'L7'
  },
  {
    code: 32,
    desc: 'L8'
  },
  {
    code: 33,
    desc: 'L9'
  }
];

/**
 * 保持登录凭证 Cookie 保存
 * @param {*} res
 */
// const { resetUserData, setDeafultGradeTerm, updateUserData, setAccountList, isLogin, getUserMore } =
//   useStore('user');
// const { resetAppConfigData, setTabBar, appConfig } = useStore('appConfig');
export const dealLoginSuccessResponse = async (data: any) => {
  const { setDeafultGradeTerm, updateUserData, userAgent } = useStore('user');
  const { setTabBar, getTabBarItem, spliceTabBarItem, appConfig } = useStore('appConfig');
  const saveCookie: any = {
    _SSO_STATE_TICKET: null,
    _SSO_SAVE_STATE: null
  };
  const cookies = uni.getStorageSync('requestCookies');
  console.log('登录信息保存');
  console.log('dealLoginSuccessResponse---', cookies);
  cookies.forEach((cookie: string) => {
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
  // 保存cookie 到saveStateCookie中
  uni.setStorageSync('saveStateCookie', JSON.stringify(saveCookie));
  // 此处需要调用 获取登录用户的信息 /user-data-v2/user/get-user-info-by-login 接口获取最新用户信息
  const res: any = await getLoginUserInfo();
  // 处理全局变量
  // const userNowRoleInfo = newloginInfoDealSingUserInfo(data.userInfo, data.userInfo.xinzxAccountId);
  const userNowRoleInfo = newloginInfoDealSingUserInfo(
    { ...data.userInfo, ...res },
    data.userInfo.xinzxAccountId
  );
  const deafultGradeTerm = loginInfoDealGradeTerm(userNowRoleInfo);
  setDeafultGradeTerm(deafultGradeTerm);
  // 用户信息写入user store中 如果 isLogin为false未登录，导致写入用户信息的时候，会清空用户数据。
  // 导致跳转到未登录页面
  updateUserData(userNowRoleInfo, 500);
  uni.setStorageSync('userInfo', JSON.stringify(userNowRoleInfo));

  // #ifndef APP-PLUS || APP
  // // 角色 -1 网站注册身份  0 教师  1 学生  2 家长  3 管理员
  // 根据身份信息去修改tabbar
  // const obj = {
  //   pagePath: '/pages/notice-list-home/notice-list-home',
  //   text: '智能通知',
  //   iconPath: 'tabbar_notice_unselect.png',
  //   selectedIconPath: 'tabbar_notice_select.png'
  // };
  // if (userNowRoleInfo.jut === 0 || userNowRoleInfo.jut === 3) {
  //   // 教师身份
  //   obj.pagePath = '/pages/teacher/notice-list/notice-list';
  // } else if (userNowRoleInfo.jut === 1 || userNowRoleInfo.jut === 2) {
  //   // 学生身份
  //   obj.pagePath = '/pages/student/notice-list/notice-list';
  // }
  // setTabBar(obj, 0);
  // setTabBar(obj1, 1);
  // 20240708 数智家校/校讯通小程序 在tabbar添加成绩模块
  // 20240806 最新小程序首页去掉底部成绩tabbar模块
  // if (['102', '103'].includes(userAgent.value.hostId as string)) {
  //   const tempTabbar = getTabBarItem(1);
  //   if (userNowRoleInfo.jut === 1 || userNowRoleInfo.jut === 2) {
  //     if (
  //       tempTabbar.pagePath !== '/pages/student/score-list/score-list' ||
  //       tempTabbar.text !== '成绩'
  //     ) {
  //       const obj = {
  //         pagePath: '/pages/student/score-list/score-list',
  //         text: '成绩',
  //         iconPath: 'tabbar_exam_score_unselect.png',
  //         selectedIconPath: 'tabbar_exam_score_select.png'
  //       };
  //       spliceTabBarItem(1, 0, obj);
  //     }
  //   } else {
  //     if (
  //       tempTabbar.pagePath === '/pages/student/score-list/score-list' &&
  //       tempTabbar.text === '成绩'
  //     ) {
  //       spliceTabBarItem(1, 1);
  //     }
  //   }
  // }
  uni.setStorageSync('appConfig', appConfig.value);
  console.log('查看身份-----switch---', appConfig.value.template.basic.tabBar.list[0]);
  eventBus.emit('appConfigReady');
  // #endif

  // isLogin.value = true;
};

export async function loginInfoDealGradeTerm(userNowRoleInfo: any) {
  const deafultGradeTerm = {
    grade: {
      code: 21,
      desc: 'L1'
    },
    term: {
      code: new Date().getMonth() < 6 ? 1 : 2,
      desc: new Date().getMonth() < 6 ? '上学期' : '下学期'
    }
  };
  if (userNowRoleInfo.userRole === 1) {
    for (let i = 0; i < allGrades.length; i++) {
      if (allGrades[i].code === userNowRoleInfo.gradeInfo.gradeCode) {
        deafultGradeTerm.grade = {
          code: allGrades[i].code,
          desc: allGrades[i].desc
        };
      }
    }
  }
  if (userNowRoleInfo.userRole === -1) {
    // 获取用户的地区年级学科版本
    const res = await ajax<any>({
      url: '/user-data-v2/user/get-user-area-grade-subject-bookversion',
      data: {},
      query: {},
      method: 'GET',
      custom: {
        showLoading: true
      }
    });

    uni.setStorageSync('userAreaGradeSubjectBookversion', JSON.stringify(res.data));
    deafultGradeTerm.grade = {
      code: res.data.gradeCode,
      desc: res.data.gradeName
    };
    deafultGradeTerm.term = {
      code: userNowRoleInfo.termCode === 2 ? 2 : 1,
      desc: userNowRoleInfo.termCode === 2 ? '下学期' : '上学期'
    };
    // 网站用户
    // uniRequest({
    //   url: '/user-data-v2/user/get-user-area-grade-subject-bookversion',
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success(res) {
    //     uni.setStorageSync('userAreaGradeSubjectBookversion', JSON.stringify(res.data));
    //     deafultGradeTerm.grade = {
    //       code: res.data.gradeCode,
    //       desc: res.data.gradeName
    //     };
    //     deafultGradeTerm.term = {
    //       code: globalData.userNowRoleInfo.termCode === 2 ? 2 : 1,
    //       desc: globalData.userNowRoleInfo.termCode === 2 ? '下学期' : '上学期'
    //     };
    //   }
    // });
  }
  return deafultGradeTerm;
}

export function loginByWxApplet(entry: string) {
  const { getUserMore } = useStore('user');
  // 静默登录
  uni.login({
    success: async (res) => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      try {
        const data: any = await ajax<any>({
          url: '/login-v2/login/login-by-wx-applet',
          method: 'POST',
          data: {
            entry,
            code: res.code,
            loginDefault: true
          }
        });
        console.log('loginByWxApplet-----123---', data);
        if (data.loginResult && data.loginResult.code === 101) {
          await getUserMore();
          dealLoginSuccessResponse(data);
        } else {
          // wx.$log.info(`静默登录其他信息:${JSON.stringify(data)}`);
        }
      } catch (error) {
        // 静默登录失败，需要清空存储数据，否则有token会认为以登录，userinfo中逻辑
        console.log('loginByWxApplet-----error---', error);
        dealLoginOutToken();
      }
    },
    fail: (error) => {
      console.log('loginByWxApplet-----login---error---', error);
      uni.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  });
}
export async function getHttpUserMore() {
  // 获取用户所有身份
  const data: any = await ajax({
    url: '/user-data-v2/user/get-user-account-list',
    method: 'GET'
  });
  const accountId = data.accountId;
  const usableAccounts = data.usableAccounts;
  const list = newDelLoginInfoDealMoreIdentity(usableAccounts, accountId);
  console.log('--------------全局用户身份-----------------list', list);
  // 处理多身份数据 // 将多身份数据保存起来
  return list;
}
export function saveAccountListData(list: any[]) {
  const { setAccountList } = useStore('user');
  setAccountList(list);
}
export function dealLoginOutToken() {
  const { resetUserData } = useStore('user');
  const { resetAppConfigData } = useStore('appConfig');
  uni.clearStorageSync();
  resetUserData();
  resetAppConfigData();
  console.log('dealLoginOutToken----');
}

export const clearJingMoLoginInfo = () => {
  uni.removeStorageSync('requestCookies');
  uni.removeStorageSync('accountList');
  uni.removeStorageSync('userInfo');
  uni.removeStorageSync('appConfig');
};

export const routerSwitchTabBar = (index: number) => {
  onShow(() => {
    console.log('routerSwitchTabBar---onShow');
    uni.hideLoading();
    // #ifndef APP-PLUS || APP
    const { appConfig } = useStore('appConfig');
    console.log('来了----', appConfig.value.template.basic.tabBar.list[index].pagePath);
    uni.switchTab({
      url: appConfig.value.template.basic.tabBar.list[index].pagePath
    });
    // #endif
    eventBus.on('appConfigReady', () => {
      console.log('routerSwitchTabBar---appConfigReady---');
      uni.switchTab({
        url: appConfig.value.template.basic.tabBar.list[index].pagePath
      });
    });
  });
  onHide(() => {
    console.log('routerSwitchTabBar---onHide');
    eventBus.off('appConfigReady');
  });
};

export const go2Login = (url: string) => {
  const router = useRouter();
  // #ifdef APP-PLUS || APP
  bridge.login(url);
  // #endif
  // #ifdef MP-WEIXIN
  router.push({
    path: `/uni_modules/uni-module-public/login/login`,
    query: {
      redictUrl: encodeURIComponent(url)
    }
  });
  // #endif
};

/**
 * 获取登录用户信息
 */
export async function getLoginUserInfo() {
  return await ajax({
    url: '/user-data-v2/user/get-user-info-by-login',
    method: 'GET'
  });
}
