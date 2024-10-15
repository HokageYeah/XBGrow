import { getWxUserInfoAPI, postLoginOutAPI, saveWxUserInfoAPI } from './services/login';
import {
  dealLoginOutToken,
  dealLoginSuccessResponse,
  saveAccountListData
} from '@/uni-module-common/hooks/useLoginHooks';
import { newDelLoginInfoDealMoreIdentity } from '@/uni-module-common/utils/login-info';
import { appModuleConfig } from '@/uni-module-common/config';
const { accountList, isLogin, userInfo: storeUserInfo } = useStore('user');
const userInfo = ref({
  nickName: '',
  avatarUrl: ''
});
let app: any;
let pagesNum: any;
export const useProcessLoginInfo = (resLoginInfo: any, pagesNumber: number, proUserInfo?: any) => {
  app = getApp();
  proUserInfo && (userInfo.value = proUserInfo);
  storeUserInfo.value.avatorUrl = storeUserInfo.value.avatorUrl || userInfo.value.avatarUrl;
  console.log('useProcessLoginInfo----->', resLoginInfo);
  console.log('useProcessLoginInfo-----userInfo----->', userInfo);
  console.log('useProcessLoginInfo-----avatorUrl----->', storeUserInfo);
  // userInfo = ref({
  //   nickName: '',
  //   avatarUrl: '',
  // });
  pagesNum = pagesNumber;
  processLoginInfo(resLoginInfo);
};

export const useWXProfile = () => {
  return new Promise<void>((resolve, reject) => {
    uni.getUserProfile({
      desc: '用于完善个人信息',
      // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        if (res.userInfo) {
          Object.assign(userInfo.value, {
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl
          });
          console.log('getUserProfile----', userInfo.value);
          resolve();
        } else {
          reject(new Error('用户信息异常'));
          uni.showToast({
            title: '用户信息异常',
            icon: 'none'
          });
        }
      },
      fail(e) {
        console.log(e);
        reject(e.message);
        uni.showToast({
          title: '请授权用户头像',
          icon: 'none'
        });
      }
    });
  });
};

async function getUserOtherInfo() {
  try {
    const data: any = await getWxUserInfoAPI();
    if (data.nickname && data.avatarUrl) {
      // todo 处理登录
      const pages = getCurrentPages();
      const currPage: any = pages[pages.length - pagesNum];
      const newUrl = decodeURIComponent(currPage.options.redictUrl);
      uni.redirectTo({
        url: newUrl,
        fail(e) {
          console.log('getUserOtherInfo---', e);
          uni.switchTab({
            url: newUrl
          });
        }
      });
    } else {
      // uni.$log.info(`静默登录保存的cookie:${app.globalData!.cookieMap._WUID_}`);
      // console.log(`登录cookie:${JSON.stringify(app.globalData!.cookieMap)}`);
      // uni.$log.info(`登录cookie:${JSON.stringify(app.globalData!.cookieMap)}`);
      const saveRes = await saveWxUserInfoAPI({
        nickname: userInfo.value.nickName,
        avatar: userInfo.value.avatarUrl,
        entry: appModuleConfig.entry
      });

      const data: any = saveRes;
      if (data.content === 'success') {
        const pages = getCurrentPages();
        const currPage: any = pages[pages.length - pagesNum];
        const newUrl = decodeURIComponent(currPage.options.redictUrl);
        uni.redirectTo({
          url: newUrl,
          fail(e) {
            console.log('getUserOtherInfo---', e);
            uni.switchTab({
              url: newUrl
            });
          }
        });
      } else {
        loginOut();
        uni.showToast({
          title: '用户信息保存失败，请重新登录',
          icon: 'none'
        });
      }
    }
  } catch (error) {
    console.log(error);
    loginOut();
    uni.showToast({
      title: '用户信息保存失败，请重新登录',
      icon: 'none'
    });
  }
}

async function loginOut() {
  try {
    const res = await postLoginOutAPI({
      entry: appModuleConfig.entry
    });
    console.log('loginOut-----', res);
    dealLoginOutToken();
  } catch (error) {}
}
function dealMoreIdentity(list: any[]) {
  // 将多身份数据保存起来
  saveAccountListData(list);
  uni.setStorageSync(
    'userWxTemp',
    JSON.stringify({
      nickName: userInfo.value.nickName,
      avatarUrl: userInfo.value.avatarUrl
    })
  );
  const pages = getCurrentPages();
  const currPage: any = pages[pages.length - pagesNum];
  const newUrl = currPage.options.redictUrl;
  console.log(currPage);
  console.log('新地址---', currPage);
  console.log('新地址', newUrl);
  uni.redirectTo({
    url: `./switch-role?redictUrl=${newUrl}`
  });
  // uni.redirectTo({
  //   url: `../switch-role/switch-role?redictUrl=${newUrl}`
  // });
}

function processLoginInfo(data: any) {
  console.log('返回的结果****', data);
  if (!data.loginResult) {
    uni.showToast({
      title: data.message,
      icon: 'none'
    });
    return;
  }
  console.log('返回的结果loginResult****', data.loginResult);
  if (data.loginResult.code === 101) {
    // 单身份登录处理逻辑
    dealLoginSuccessResponse(data);
    getUserOtherInfo();
  } else if (data.loginResult.code === 201) {
    // 多身份登录处理逻辑 先给useinfo设置为未登录
    app.globalData!.loginFlag = false;
    isLogin.value = false;
    console.log(data.usableAccounts);
    const list = newDelLoginInfoDealMoreIdentity(
      data.usableAccounts,
      data.usableAccounts[0].xinzxAccountId
    );
    dealMoreIdentity(list);
  } else {
    uni.showToast({
      title: data.loginResult.remindMsg,
      icon: 'none'
    });
  }
}
