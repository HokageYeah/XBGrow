<template>
  <!-- <xxt-layout tabbar="/pages/template-index/template-test"> -->
  <xxt-skeleton v-if="skeletonShow" :skeleton-show="skeletonShow" :is-list="true"></xxt-skeleton>
  <view v-else>
    <button @click="login">登录</button>
    <button @click="switchRoles">切换身份</button>
    <button @click="logout">退出登录</button>
    <button @click="clickList">自己的功能入口</button>
    <button
      @click="
        addSSID(
          'NTKF_T2D_CLIENTID=guestA91DF317-A021-C84E-06D2-CCC4B0FECA3C; nTalk_CACHE_DATA={uid:kf_9115_ISME9754_guestA91DF317-A021-C8,tid:1709349232899160}; xxtSessionId=77b6cb4ba9730b57a9b3a7f1aaac31a895954600; schoolOrderGuide={%22province%22:1%2C%22isHbLT%22:false%2C%22isHbYD%22:false%2C%22guideOrderInSzjx%22:true%2C%22webId%22:%222319877%22}; XXT_ID=2319877; _XXT_ID=2319877; _LOGIN_MA_=%2df%2df%23jut%2d0%23ma%2dt%23lw%2d12960079%2c2319877%23rce%2df; JSESSIONID=3a8f0cfaa88e0b4c190d48aba1d0c41ab568156c; XXT_TICKET=3a8f0cfaa88e0b4c190d48aba1d0c41ab568156c; _XSID_=3a8f0cfaa88e0b4c190d48aba1d0c41ab568156c; _SSID_=3a8f0cfaa88e0b4c190d48aba1d0c41ab568156c'
        )
      "
    >
      添加登录信息Cookies
    </button>
    <button @click="requestLogin">测试登录后接口请求</button>
    <view class="uni-btn-v-text"
      ><text style="color: #4ad975">用户登录信息：</text>{{ `${JSON.stringify(userInfo)}` }}</view
    >
    <view class="uni-btn-v-text"
      ><text style="color: #4ad975">用户登录TOKEN：</text>{{ `${JSON.stringify(useToken)}` }}</view
    >
    <view class="uni-btn-v-text"
      ><text style="color: #4ad975">接口请求：</text>{{ httpresult }}</view
    >
    <view class="uni-btn-v-text">
      <xxt-file-submit
        :is-show-w-x-chat="true"
        :file-must-types="[1, 2]"
        url-api="/zuul/notice/notice-attachment/upload-file"
      />
      <button @click="uploadAllFilesUni('')">测试必传</button>
    </view>
    <xxt-network-error @reload-click="reloadClick"></xxt-network-error>
  </view>
  <!-- </xxt-layout> -->
</template>

<script setup lang="ts">
import { natToUniSyncLoginInfo } from '@/uni-module-common/utils/uniToNavProtocol';
import { initAPPData } from '@/uni-module-common/utils/loginGetInfo';
import { needDealCookieNames } from '@/uni-module-common/http/index';
import { dealLoginOutToken } from '@/uni-module-common/hooks/useLoginHooks';
import { appModuleConfig } from '@/uni-module-common/config';
import ajax from '@/uni-module-common/http';
import { uniShowToast } from '@/uni-module-common/utils/uiUtile';
const { userInfo, useToken, setToken, loginAfter } = useStore('user');
const { uploadAllFilesUni }: any = useStore('fileUpload');
// const { template } = useStore('appConfig');
const httpresult = ref('');
interface testtype {
  a: number;
  [key: string]: any;
}
const router = useRouter();
const skeletonShow = ref(true);

onLoad(() => {
  // 模拟
  setTimeout(() => {
    skeletonShow.value = false;
  }, 2000);
});
onShow(() => {
  uni.hideLoading();
});
const login = () => {
  router.push({
    path: `/uni_modules/uni-module-public/login/login?redictUrl=${encodeURIComponent(
      '/pages/template-index/template-test'
    )}`
  });
};
const logout = async () => {
  try {
    const data = {
      // entry: app.globalData!.entry
      entry: appModuleConfig.entry
    };
    const res = await ajax({
      url: '/login-v2/login/login-out',
      data,
      query: {},
      method: 'GET',
      custom: {
        showLoading: true
      }
    });
    if (res) {
      // 退出登录需要清空user store内的用户信息 以及用户的多身份信息
      // uni.clearStorageSync();
      // resetUserData();
      dealLoginOutToken();
      uniShowToast('退出登录成功');
    }
  } catch (error) {}
};
const switchRoles = () => {
  router.push({
    path: `/uni_modules/uni-module-public/login/switch-role?redictUrl=${encodeURIComponent(
      '/pages/template-index/template-test'
    )}`
  });
};
const addSSID = (cookie: string) => {
  // #ifdef MP-WEIXIN
  const sections = cookie.split(';');
  const cookieMap: any = {};
  let cookieChanged = false;
  if (sections.length > 0) {
    sections.forEach((item) => {
      const tmp = item.split('=');
      if (tmp.length === 2) {
        const name = tmp[0].trim();
        const value = tmp[1].trim();
        console.log(name);
        console.log(needDealCookieNames[name]);
        if (name && needDealCookieNames[name]) {
          // 修改 cookieMap 对应数据
          if (value) {
            // Cookie 有效期 100 分钟（注：需要小于 120 分钟）
            cookieMap[name] = {
              value,
              expires: new Date().getTime() + 6000000
            };
          } else {
            delete cookieMap[name];
          }
          cookieChanged = true;
        }
      }
    });
  }

  if (cookieChanged) {
    console.log('saveCookies----setToken---addSSID---', cookieMap);
    // uni.setStorageSync('token', JSON.stringify(cookieMap));
    // 将token存储在user中
    setToken(cookieMap);
    loginAfter('', '', '');
    // isLogin.value = false;
  }
  // #endif
  // #ifndef MP-WEIXIN
  setToken(cookie);
  // #endif
};
const instance = getCurrentInstance();
const eventBus = instance!.appContext.config.globalProperties.$eventBus;
const requestLogin = () => {
  console.log('requestLogin---');
  instance?.proxy
    ?.$uniAjax({
      // url: 'demo/:yy',
      url: '/reading/study/get-user-works',
      data: { pageSize: 1, pageCurrent: 1 },
      method: 'POST',
      custom: {
        auth: true
      }
      // header: {
      //   'custom-header': 'hello' // 自定义请求头信息
      // }
    })
    .then((res: any) => {
      httpresult.value = res;
    });
};
const clickList = () => {
  console.log('88888888888************');
};
const reloadClick = () => {
  console.log('reloadClick');
  uni.showToast({
    title: '刷新成功'
  });
};
onLoad(() => {
  console.log('app启动信息传递---onLoad--userInfo.value--', userInfo.value);
  eventBus.on(natToUniSyncLoginInfo, (res: any) => {
    console.log('natToUniSyncLoginInfo----', res);
    eventBus.emit('uniToNatLogin', '我是登录成功后的回调到applunch-iOS');
    initAPPData(
      {
        referrerInfo: {
          extraData: res
        }
      },
      3
    );
  });

  // bridge.receiveNativeEvent(natToUniSyncLoginInfo).then((res) => {
  //   uni.$emit('uniToNatLogin', '我是登录成功后的回调到applunch-iOS');
  //   initAPPData(
  //     {
  //       referrerInfo: {
  //         extraData: res
  //       }
  //     },
  //     3
  //   );
  // });
});
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logo {
  margin-left: auto;
  margin-right: auto;
  margin-top: 200rpx;
  margin-bottom: 50rpx;
  width: 200rpx;
  height: 200rpx;
}
.text-area {
  display: flex;
  justify-content: center;
}
.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.uni-btn-v-text {
  box-sizing: border-box;
  margin: 20px;
  word-wrap: break-word; /* 或者使用 overflow-wrap: break-word; */
}
</style>
