<template>
  <view class="xxt-unlogin">
    <view class="tip">{{ props.tip }}</view>
    <view v-if="props.showBtn" style="margin-top: 52rpx">
      <tui-form-button
        :background="btnBackground"
        width="304rpx"
        radius="50rpx"
        style="margin: 0 auto; width: 304rpx; display: inline-block"
        @click="go2Login"
      >
        {{ props.btnDesc }}
      </tui-form-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import bridge from '@/uni-module-common/utils/uniToNativeBridge';
const props = defineProps({
  tip: {
    type: String,
    default: '您尚未登录，请先登录'
  },
  showBtn: {
    type: Boolean,
    default: true
  },
  btnDesc: {
    type: String,
    default: '登录'
  },
  // 是否走组件内的登录处理流程
  // 备注：目前组件内的登录流程在「微信小程序」环境下跳转到的是「朗读小程序-登录页」，目前无法解决
  // 所以建议后续使用该组件时，该值传 false，在父组件中自己定义登录流程
  toLogin: {
    type: Boolean,
    default: true
  },
  url: {
    type: String,
    require: true,
    default: ''
  }
});
const emits = defineEmits(['clickBtn']);
// const { userAgent } = useStore('user');
const router = useRouter();
// 判断是不是朗读小程序，目前未登录时判断不出来
// const isReadingMiniProd = computed(() => {
//   console.log(userAgent.value);

//   return parseInt(userAgent.value.hostId || '0') === 101;
// });

const btnBackground = 'linear-gradient(90deg, rgb(82, 239, 129), rgb(74, 217, 117))';

// 去登录
const go2Login = async () => {
  if (props.toLogin) {
    // // #ifdef H5
    // // todo 待删 先手动塞一个 cookie，然后刷新页面
    // await setToken(
    //   'xxtSessionId=1703582470261.0.6050822401851152lve62d5t; getNewInfoFlag=0; _LOGIN_MA_=jut%2d0%23ma%2dt%23lw%2d59999990%2c2319877%23rce%2df; _SSO_SAVE_STATE=t; XXT_ID=2319877; _XXT_ID=2319877; XXT_TICKET=c3d4541696a261dee9d046159370f8ae2cf4f31a; _XSID_=c3d4541696a261dee9d046159370f8ae2cf4f31a; _SSID_=c3d4541696a261dee9d046159370f8ae2cf4f31a'
    // );
    // // #endif
    // #ifndef MP-WEIXIN
    bridge.login(props.url);
    // #endif
    // #ifdef MP-WEIXIN
    // if (isReadingMiniProd.value) {
    router.push({
      path: '/pages/mine/login/login',
      query: {
        redictUrl: encodeURIComponent(
          'uni_modules/xxt-task-center-uni/pages/task-list-home/task-list-home'
        )
      }
    });
    // }
    // #endif
  } else {
    emits('clickBtn');
  }
};
</script>

<style scoped lang="scss">
.xxt-unlogin {
  padding-top: 45%;
  min-height: 55vh;
  background-color: white;
  text-align: center;
  .tip {
    font-weight: bold;
    font-size: 28rpx;
    color: #666;
  }
}
</style>
