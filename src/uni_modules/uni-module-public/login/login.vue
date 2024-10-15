<template>
  <!-- pages/mine/login/login.wxml -->
  <view class="container">
    <!-- <view class="name">
      <view style="display: flex">
        <image
          :src="`${$cdn}/nb/m/uni-xzx-reading/read-flag.png`"
          style="margin: auto; width: 144rpx; height: 144rpx"
        ></image>
      </view>
    </view> -->
    <view class="container-head">
      <image
        class="container-head-img"
        mode="aspectFill"
        :src="`${$cdn}${loginInforef.logoImg}`"
      ></image>
      <view class="container-head-text">
        <tui-text block size="48" font-weight="600" :text="loginInforef.title"></tui-text>
        <tui-text
          block
          padding="8px 0px 40px 0px"
          size="28"
          color="#4AD975"
          :text="loginInforef.subTitle"
        ></tui-text>
      </view>
    </view>
    <view class="container-switchbtn" @tap="changePwdFlag">
      <view
        :data-pwd="true"
        class="container-switchbtn-normal"
        :class="[{ 'container-switchbtn-active': pwdFlag }]"
        >密码登录</view
      >
      <view
        :data-pwd="false"
        class="container-switchbtn-normal"
        :class="[{ 'container-switchbtn-active': !pwdFlag }]"
        >验证码登录</view
      >
    </view>
    <tui-input
      v-model="inputPhone"
      placeholder="请输入手机号码"
      maxlength="11"
      clearable
      is-fillet
    ></tui-input>
    <view v-if="pwdFlag" class="input-content pwd">
      <view class="df input-arr">
        <view class="icon-image" @tap="changePwdOpen">
          <image
            :src="
              isOpenPwd
                ? `${$cdn}/nb/m/uni-login/img/eye-close.png`
                : `${$cdn}/nb/m/uni-login/img/eyes-open.png`
            "
            style="width: 40rpx; height: 40rpx"
          ></image>
        </view>

        <tui-input
          v-model="inputPwd"
          style="padding-right: 60px"
          placeholder="请输入密码"
          is-fillet
          :password="isOpenPwd"
        ></tui-input>
      </view>
    </view>
    <view v-else class="input-content code">
      <tui-input v-model="inputCode" placeholder="请输入验证码" is-fillet>
        <template #right>
          <view v-if="clickCodeFlag" class="phone-code" @tap="getPhoneCode">
            <text>获取验证码</text>
          </view>
          <view v-else class="phone-code">
            <text class="phone-code-status">{{ seconds }}s后重新获取</text>
          </view>
        </template>
      </tui-input>
    </view>
    <tui-form-button
      :disabled="pwdFlag ? !(inputPhone && inputPwd) : !(inputPhone && inputCode)"
      radius="50px"
      background="#4AD975"
      @click="login"
      >立即登录</tui-form-button
    >
    <!-- <view class="login-info">
      <view class="login-info-image" @tap="checkInfo = !checkInfo">
        <image
          model="aspectFill"
          :src="
            checkInfo
              ? `${$cdn}/nb/m/uni-notice/img/login_select.png`
              : `${$cdn}/nb/m/uni-notice/img/login_no_select.png`
          "
          style="width: 40rpx; height: 40rpx"
        ></image>
      </view>
      <view class="login-info-text">
        我已阅读并同意
        <view
          v-for="(item, index) in loginInforef.privacy"
          :key="index"
          class="login-info-active"
          @tap="jumpToChildPrivacy(item.url)"
          >{{ item.title }}{{ index === loginInforef.privacy.length - 1 ? '' : '、' }}</view
        >
      </view>
    </view> -->
    <view class="container-wx">
      <!-- <image
        class="container-wx-image"
        mode="aspectFill"
        :src="`${$cdn}/nb/m/uni-notice/img/weixin.png`"
      ></image>
      <tui-text color="#999999" size="24" text="微信"></tui-text> -->
      <!-- 先隐藏快捷登录入口 -->
      <tui-form-button
        v-if="isShowBindBtn"
        class="container-wx-btn"
        radius="50px"
        plain
        background="#4AD975"
        color="#4AD975"
        @click="clickGetPhone"
        >快捷登录</tui-form-button
      >
      <view class="login-info">
        <view class="login-info-image" @tap="checkInfo = !checkInfo">
          <image
            model="aspectFill"
            :src="
              checkInfo
                ? `${$cdn}/nb/m/uni-notice/img/login_select.png`
                : `${$cdn}/nb/m/uni-notice/img/login_no_select.png`
            "
            style="width: 40rpx; height: 40rpx"
          ></image>
        </view>
        <view class="login-info-text">
          我已阅读并同意
          <view
            v-for="(item, index) in loginInforef.privacy"
            :key="index"
            class="login-info-active"
            @tap="jumpToChildPrivacy(item.url)"
            >{{ item.title }}{{ index === loginInforef.privacy.length - 1 ? '' : '、' }}</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onUnload } from '@dcloudio/uni-app';
import { useProcessLoginInfo, useWXProfile } from './processLoginInfoHooks';
import {
  getPhoneCodeAPI,
  loginByWxCodeAPI,
  loginPhoneCodeAPI,
  loginPhonePwdAPI,
  postLoginOutAPI
} from './services/login';
import loginInfo from './loginConfig.json';
import { uniGetUserProfile } from '@/uni-module-common/hooks/useLoginHooks';
import { encryptAse } from '@/uni-module-common/utils/ase';
import { encodeBase64 } from '@/uni-module-common/utils/base64';
import { dealLoginOutToken, dealLoginSuccessResponse } from '@/uni-module-common/utils/userLogin';
import { loginInfoDealMoreIdentity } from '@/uni-module-common/utils/login-info';
import { baseURL, uniRequest } from '@/uni-module-common/utils/http';
import { $cdn } from '@/uni-module-common/config';
import { wxAuthorizLogin } from '@/uni-module-common/utils/wxAuthorizedLogin';
import { appModuleConfig } from '@/uni-module-common/config/';
// 导入json文件
// pages/mine/login/login.js
const app = getApp();
const router = useRouter();
console.log(app.globalData);
// const { resetUserData } = useStore('user');
// const base64 = require('../../../utils/base64');
// const loginInfo = require('../../../utils/login-info');
// const http = require('../../../utils/http');
// const aes = require('../../../utils/aes');

// 公用函数定义
const enc = (param: string) => {
  return encodeURIComponent(param);
};

// 全局变量
// const app = getApp();
// const globalData = inject('globalData');

// 是否是密码登录
const isOpenPwd = ref(true);

const pwdFlag = ref(true);
const checkInfo = ref(false);
const inputPhone = ref('');
const inputPwd = ref('');
const inputCode = ref('');
const clickCodeFlag = ref(true);
const maxSeconds = ref(59); // 倒计时
const seconds = ref(0);
const isShowBindBtn = ref(false);
// wxcode 需要密码、验证码登录的时候传入
let wxCode = '';
let interval: NodeJS.Timeout;

const userInfo = ref({
  nickName: '',
  avatarUrl: ''
});

const isPhoneUserAgree = ref(false);
const buttonDisabled = ref(false);
console.log('WxAppConfig---登录配置--import----', import.meta.env);
const loginInfoWx = (loginInfo as any)[appModuleConfig.loginConfigKey];
const loginPhoneCode = appModuleConfig.loginPhoneCode;
console.log(
  'WxAppConfig---登录配置----',
  appModuleConfig.loginConfigKey,
  typeof appModuleConfig,
  appModuleConfig,
  loginPhoneCode
);
const loginInforef: any = ref(loginInfoWx);
console.log(
  'VITE_LOGIN_WX_NAME---登录配置----',
  appModuleConfig.loginConfigKey,
  loginInfo,
  typeof loginInfo
);
console.log('loginInforef---登录配置----', loginInforef.value);

onUnload(() => {
  // 关闭清除定时器
  if (interval) {
    clearInterval(interval);
  }
  console.log('清除定时器');
});
onLoad(() => {
  // 进入的时候需要根据微信 code 判断是否需要进行手机号绑定
  getCheckCodeBind();
});

const changePwdOpen = () => {
  console.log('isOpenPwd', isOpenPwd.value);
  isOpenPwd.value = !isOpenPwd.value;
};

// const clearInputPhone = () => {
//   inputPhone.value = '';
// };

/**
 * 短信验证码
 */
const getPhoneCode = async () => {
  // 电话号码
  if (!/^1[3456789][0-9]{9}/.test(inputPhone.value)) {
    uni.showToast({
      title: '您输入的手机号无效',
      icon: 'none'
    });
    return;
  }
  let currentTime = maxSeconds.value;
  seconds.value = currentTime;
  clickCodeFlag.value = false;
  interval = setInterval(function () {
    currentTime--;
    seconds.value = currentTime;
    if (currentTime <= 0) {
      clearInterval(interval);
      clickCodeFlag.value = true;
    }
  }, 1000);
  const username = encryptAse(inputPhone.value);
  // uniEvent('发送短信验证码', '登录', {
  //   mobile: username
  // });
  const res: any = await getPhoneCodeAPI({ mobile: username, funcNo: loginPhoneCode });
  console.log(res);
  if (res.content === 'success') {
    uni.showToast({
      title: '手机验证码发送成功',
      icon: 'none'
    });
  } else {
    uni.showToast({
      title: res.content,
      icon: 'none'
    });
  }
};

const loginOut = async () => {
  try {
    const res = await postLoginOutAPI({ entry: appModuleConfig.entry });
    console.log('loginOut---', res);
    // 退出登录需要清空user store内的用户信息 以及用户的多身份信息
    dealLoginOutToken();
  } catch (error) {}
};
const getUserOtherInfo = () => {
  uniRequest({
    url: `${baseURL}/login-v2/wx/get-wx-user-info`,
    method: 'GET',
    success(res: any) {
      const data = res.data;
      if (data.nickname && data.avatarUrl) {
        // todo 处理登录
        const pages = getCurrentPages();
        const currPage: any = pages[pages.length - 1];
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
        uniRequest({
          url: `${baseURL}/login-v2/wx/save-wx-user-info`,
          method: 'POST',
          data: {
            nickname: userInfo.value.nickName,
            avatar: userInfo.value.avatarUrl,
            entry: appModuleConfig.entry
          },
          success(res: any) {
            const data = res.data;
            if (data.content === 'success') {
              const pages = getCurrentPages();
              const currPage: any = pages[pages.length - 1];
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
          },
          fail(e: any) {
            console.log(e);
            loginOut();
            uni.showToast({
              title: '用户信息保存失败，请重新登录',
              icon: 'none'
            });
          }
        });
      }
    },
    fail(e: any) {
      console.log(e);
    }
  });
};

const dealMoreIdentity = (list: any) => {
  app.globalData!.userInfoList = list;
  uni.setStorageSync(
    'userWxTemp',
    JSON.stringify({
      nickName: userInfo.value.nickName,
      avatarUrl: userInfo.value.avatarUrl
    })
  );
  const pages = getCurrentPages();
  const currPage: any = pages[pages.length - 1];
  const newUrl = currPage.options.redictUrl;
  console.log(currPage);
  console.log('新地址---', currPage);
  console.log('新地址', newUrl);
  uni.redirectTo({
    url: `../switch-role/switch-role?redictUrl=${newUrl}`
  });
};
// 处理登录信息
const processLoginInfo = (res: any) => {
  console.log('返回的结果****', res);
  const data = res.data;
  if (!data.loginResult) {
    uni.showToast({
      title: data.message,
      icon: 'none'
    });
    return;
  }
  if (data.loginResult.code === 101) {
    app.globalData!.isMore = false;
    dealLoginSuccessResponse(res);
    uni.setStorageSync(
      'userOtherInfo',
      JSON.stringify({
        loginFlag: true,
        isMore: false
      })
    );
    getUserOtherInfo();
  } else if (data.loginResult.code === 201) {
    app.globalData!.loginFlag = false;
    app.globalData!.isMore = true;
    console.log(data.usableAccounts);
    const list = loginInfoDealMoreIdentity(
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
};
/**
 * 手机微信授权登录
 * @param {*} e
 */
const getPhoneNumber = (e: any) => {
  console.log('getPhoneNumber---', e);
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({
      title: '请授权手机号',
      icon: 'none'
    });
    return;
  }
  if (!e.detail.code) {
    uni.showToast({
      title: '你当前微信版本不支持，请先更新微信再使用',
      icon: 'none'
    });
    return;
  }
  // uniEvent('微信一键登录', '登录', {});
  uni.showModal({
    title: '提醒',
    content: '请授权您的昵称、头像',
    success(res) {
      if (res.confirm) {
        uni.getUserProfile({
          desc: '用于完善个人信息',
          // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          // success: (res) => {
          //   console.log(res);
          //   userInfo.value.nickName = res.userInfo.nickName;
          //   userInfo.value.avatarUrl = res.userInfo.avatarUrl;
          //   const loginParams = {
          //     entry: app.globalData!.entry,
          //     code: e.detail.code,
          //     loginDefault: false
          //   };
          //   const resLogin = loginPhoneWxAPI(loginParams);
          //   console.log(resLogin);
          //   processLoginInfo(resLogin);
          // }
          success: (res) => {
            console.log(res);
            userInfo.value.nickName = res.userInfo.nickName;
            userInfo.value.avatarUrl = res.userInfo.avatarUrl;
            uniRequest({
              url: `${baseURL}/login-v2/login/login-by-wx-applet-authorized`,
              data: {
                entry: appModuleConfig.entry,
                code: e.detail.code,
                loginDefault: false
              },
              method: 'POST',
              success(res: any) {
                console.log(res);
                useProcessLoginInfo(res, 1, {
                  nickName: userInfo.value.nickName,
                  avatarUrl: userInfo.value.avatarUrl
                });
                // processLoginInfo(res);
              },
              fail(e: any) {
                console.log(e);
              }
            });
          },
          fail(e) {
            console.log(e);
            uni.showToast({
              title: '请授权用户头像',
              icon: 'none'
            });
          }
        });
      } else if (res.cancel) {
        uni.showToast({
          title: '请授权用户头像',
          icon: 'none'
        });
      }
    }
  });
};

// 获取当前微信的绑定关系(这个一进入页面就调用)
async function getCheckCodeBind() {
  try {
    // await useWXProfile();
    const { content, code } = (await wxAuthorizLogin.wxLogin(
      '/login-v2/wx/check-code-bind',
      'POST',
      appModuleConfig.entry
    )) as any;
    wxCode = code;
    if (content) {
      // 已经绑定手机号 展示快捷登录按钮
      isShowBindBtn.value = true;
    }
  } catch (error: any) {
    uni.showToast({
      title: error.message,
      icon: 'none'
    });
  }
}

const getWXLogin = async () => {
  try {
    await useWXProfile();
    if (wxCode) {
      // 逻辑更改 wxCode有值 且能够显示快捷登录按钮的一定是已经绑定手机号
      // 已经绑定手机号
      const res = await loginByWxCodeAPI({
        entry: appModuleConfig.entry,
        loginDefault: false,
        wxCode
      });
      console.log('loginByWxCodeAPI----', res);
      // processLoginInfo({ data: res });
      useProcessLoginInfo(res, 1);
      return;
    }
    const { content, code } = (await wxAuthorizLogin.wxLogin(
      '/login-v2/wx/check-code-bind',
      'POST',
      appModuleConfig.entry
    )) as any;
    if (content) {
      // 已经绑定手机号
      const res = await loginByWxCodeAPI({
        entry: appModuleConfig.entry,
        loginDefault: false,
        wxCode: code
      });
      console.log('loginByWxCodeAPI----', res);
      // processLoginInfo({ data: res });
      useProcessLoginInfo(res, 1);
    } else {
      console.log('点击跳转--');
      uni.navigateTo({
        url: `./bind-phone?wxCode=${code}`
      });
    }
    console.log('getWXLogin---', content);
  } catch (error: any) {
    uni.showToast({
      title: error.message,
      icon: 'none'
    });
  }
};

/**
 * 切换 密码和短信验证码切换
 * @param {*} e
 */
const changePwdFlag = (e: any) => {
  const pwdflg = e.target.dataset.pwd;
  console.log('changePwdFlag----', e.target.dataset.pwd);
  pwdFlag.value = pwdflg;
  inputCode.value = '';
  inputPwd.value = '';
  buttonDisabled.value = true;
};
/**
 * 用户名密码登录处理
 */
const loginByPwd = async () => {
  const key = `-${new Date().getTime()}`;
  const username = encodeBase64(enc(inputPhone.value));
  const password = encodeBase64(encodeBase64(enc(inputPwd.value)) + key);
  // uniEvent('密码登录', '登录', {
  //   username
  // });
  // 登录参数
  console.log('appModuleConfig.entry', appModuleConfig.entry);
  const loginParams = {
    entry: appModuleConfig.entry,
    account: username,
    pwd: password,
    key,
    loginDefault: false,
    wxCode
  };
  const res: any = await loginPhonePwdAPI(loginParams);
  console.log('loginByPwd-----', res);
  useProcessLoginInfo(res, 1, {
    nickName: userInfo.value.nickName,
    avatarUrl: userInfo.value.avatarUrl
  });

  // const res = await loginPhonePwdAPI(loginParams);
  // if (res.code === 1) {
  //   uni.showToast({ title: '登录异常', icon: 'none' });
  // } else {
  //   processLoginInfo(res);
  // }

  // console.log('账号密码登录');
  // uniRequest({
  //   url: `${baseURL}/login-v2/login/login-by-pwd`,
  //   data: loginParams,
  //   method: 'POST',
  //   success(res) {
  //     console.log(res);
  //     // processLoginInfo(res);
  //     useProcessLoginInfo(res, 1, {
  //       nickName: userInfo.value.nickName,
  //       avatarUrl: userInfo.value.avatarUrl
  //     });
  //   },
  //   fail(e) {
  //     console.log(e);
  //     uni.showToast({
  //       title: '登录异常',
  //       icon: 'none'
  //     });
  //   }
  // });
};
// 验证码登录
const loginByCode = async () => {
  const username = encodeBase64(enc(inputPhone.value));
  // uniEvent('短信验证码登录', '登录', {
  //   username
  // });
  console.log('验证码登录......');
  try {
    const res = await loginPhoneCodeAPI({
      entry: appModuleConfig.entry,
      account: username,
      code: inputCode.value,
      loginDefault: false,
      wxCode
    });
    console.log('验证码登录成功', res);
    // processLoginInfo(res);
    useProcessLoginInfo(res, 1, {
      nickName: userInfo.value.nickName,
      avatarUrl: userInfo.value.avatarUrl
    });
  } catch (error) {
    console.log('loginPhoneCodeAPI-----', error);
    uni.showToast({
      title: '登录异常',
      icon: 'none'
    });
  }
  // uniRequest({
  //   url: `${baseURL}/login-v2/login/login-by-mobile-code`,
  //   data: {
  //     entry: app.globalData!.entry,
  //     account: username,
  //     code: inputCode.value,
  //     loginDefault: false
  //   },
  //   method: 'POST',
  //   success(res: any) {
  //     console.log('验证码登录成功', res);
  //     // processLoginInfo(res);
  //     useProcessLoginInfo(res, 1, {
  //       nickName: userInfo.value.nickName,
  //       avatarUrl: userInfo.value.avatarUrl
  //     });
  //   },
  //   fail(e: any) {
  //     console.log(e);
  //     uni.showToast({
  //       title: '登录异常',
  //       icon: 'none'
  //     });
  //   }
  // });
};
/**
 * 登录
 */
const login = async () => {
  if (!checkInfo.value) {
    uni.showToast({
      title: '请先阅读下方协议内容',
      icon: 'none'
    });
    return;
  }
  if (!/^1[3456789][0-9]{9}/.test(inputPhone.value)) {
    uni.showToast({
      title: '您输入的手机号无效',
      icon: 'none'
    });
    return;
  }
  Object.assign(userInfo.value, { nickName: null, avatarUrl: null });
  if (!pwdFlag.value && !/[0-9]{6}/.test(inputCode.value)) {
    // 验证码验证
    if (!/[0-9]{6}/.test(inputCode.value)) {
      uni.showToast({
        title: '请输入6位验证码',
        icon: 'none'
      });
      return;
    }
  }
  console.log('login-----');
  // 验证码验证
  const res = await uniGetUserProfile();
  Object.assign(userInfo.value, {
    nickName: res.userInfo.nickName,
    avatarUrl: res.userInfo.avatarUrl
  });
  if (pwdFlag.value) {
    loginByPwd();
  } else {
    console.log('loginByCode-----');
    loginByCode();
  }
};

/**
 * 微信一键登录--校验按钮
 */
const clickGetPhone = () => {
  // if (true) {
  //   wxAuthorizLogin.wxCheckSession();
  //   wxAuthorizLogin.wxGetUserInfo();
  //   return;
  // }
  if (!checkInfo.value) {
    uni.showToast({
      title: '请先阅读下方协议内容',
      icon: 'none'
    });
    return;
  }
  isPhoneUserAgree.value = false;
  getWXLogin();
};

/**
 * 监听输入手机号按钮
 * @param {*} e
 */
const inputPhoneFun = (e: any) => {
  inputPhone.value = e.detail.value;
};

/**
 * 监听密码输入
 * @param {*} e
 */
const inputPwdFun = (e: any) => {
  inputPwd.value = e.detail.value;
};

/**
 * 监听短信验证码输入事件
 * @param {*} e
 */
const inputCodeFun = (e: any) => {
  inputCode.value = e.detail.value;
};

const jumpToChildPrivacy = (webSrc: string) => {
  const subPackagesRoot = appModuleConfig.subPackagesRoot;
  console.log('jumpToChildPrivacy---subPackagesRoot---', subPackagesRoot);
  router.push({
    // path: `/${subPackagesRoot}/pages/uni-module-public/login/user-agreement/child-privacy?webSrc=${webSrc}`
    path: `/uni_modules/uni-module-public/login/user-agreement/child-privacy?webSrc=${webSrc}`
  });
  // uni.navigateTo({
  //   url: '../user-agreement/child-privacy'
  // });
};
</script>

<style scoped lang="scss">
/* pages/mine/login/login.wxss */
.container {
  position: absolute;
  left: 0;
  top: 0;
  /* align-items: center; */
  box-sizing: border-box;
  padding: 40px 16px 0;
  width: 100%; /* 设置宽度为屏幕宽度 */
  height: 100%; /* 设置高度为屏幕高度 */
  background: linear-gradient(to bottom, #c2ffd4, #c3ffe9, #fff); /* 渐变背景颜色 */
  &-head {
    margin-bottom: 80px;
    @include normalFlex(row, flex-start);
    &-img {
      /* 设置圆角 */
      border-radius: 12px;
      width: 64px;
      height: 64px;
      background-color: #888;
    }
    &-text {
      margin-left: 12px;
      height: 64px;
      @include normalFlex(column, space-between, flex-start);
    }
  }
  &-switchbtn {
    @include normalFlex(row, flex-start);
    margin-bottom: 24px;
    height: 32px;
    &-normal {
      margin-right: 20px;
      line-height: 32px;
      font-size: 16px;
      color: #666;
    }
    &-active {
      position: relative;
      font-weight: bold;
      color: #4ad975;
    }
    &-active::after {
      position: absolute;
      left: 50%; /* 在中间位置 */
      bottom: 0;
      border-radius: 2px;
      width: 16px;
      height: 4px;
      background-color: #4ad975;
      content: '';
      transform: translateX(-50%); /* 位移中间位置 */
    }
  }
  .container-wx {
    /* 距离屏幕底部 60px */
    position: absolute;
    /* 剧中 */
    left: 50%;
    width: 100%;
    padding: 40px 16px 0;
    box-sizing: border-box;
    bottom: 60px;
    transform: translateX(-50%);
    /* margin-bottom: 60px; */
    @include normalFlex(column, space-between, center);
    &-btn {
      width: 100%;
    }
    &-image {
      margin-bottom: 8px;
      width: 40px;
      height: 40px;
      /* background-color: #28c445; */
    }
  }
  .phone-code {
    font-size: 16px;
    color: #4ad975;
  }
  .phone-code-status {
    font-size: 26rpx !important;
    color: #acacac !important;
  }
  .icon-image {
    position: absolute;
    right: 40px;
    z-index: 99;
    padding-top: 8px;
  }
  .input-content {
    margin-bottom: 20px;
  }
  .input-arr {
    /* margin: 0rpx 68rpx; */
    /* border: 2rpx solid #d0d0d0; */
    /* border-radius: 56rpx; */
    height: 96rpx;
    /* background-color: #f2f2f2; */
    line-height: 96rpx;
  }
  .pwd,
  .code {
    margin-top: 20px;
  }
  .login-info-text {
    font-size: 12px;
    /* text-align: center; */
  }
  .login-info-active {
    display: inline;
    color: #4ad975;
  }
  .login-info-image {
    float: left;
    margin-left: 0;
    margin-top: 2px;
    padding-left: 0rpx;
    /* margin-top: 4rpx; */
    height: 50rpx;
  }
  .login-info {
    margin-top: 20px;
    /* padding: 0rpx 40rpx; */
    font-size: 12px;
    color: #acacac;
  }
  :deep(.tui-input__border-bottom) {
    border-bottom: 0rpx solid transparent;
  }
}
</style>
