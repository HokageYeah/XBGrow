<template>
  <div>
    <tui-bottom-popup :show="paycash" position="bottom" class="online-pay" @close="cancelPay()">
      <scroll-view class="pay-list" scroll-y style="max-height: 800rpx">
        <view class="pay-list-title">选择支付方式 </view>
        <view v-if="props.showWxPay" class="pay-button">
          <tui-form-button block background="#fff" color="#222" @click="payByWX()">
            <template #default>
              <image
                class="wxpayimg"
                :src="`${$cdn}/nb/m/base/img/wxpay.png`"
              >
              </image>
              <span class="pay-span">微信快捷支付</span>
            </template>
          </tui-form-button>
        </view>
        <view v-if="props.showAliPay" class="pay-button">
          <tui-form-button block background="#fff" color="#222" @click="payByALi()">
            <template #default>
              <van-icon
                class="iconfont"
                class-prefix="icon"
                name="x-zhifubaozhifu"
                color="#027AFF"
                size="20"
              />
              <span class="pay-span">支付宝支付</span>
            </template>
          </tui-form-button>
        </view>
        <view class="cancel-pay" @click="cancelPay">取消</view>
      </scroll-view>
    </tui-bottom-popup>
  </div>
</template>

<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core';
import type { OrderInfoObj, PayParams } from './order-pay-type';
import { go2Login } from '@/uni-module-common/hooks/useLoginHooks';
import helper from '@/uni-module-common/helper/index';
import ajax from '@/uni-module-common/http';
import log from '@/uni-module-common/utils/log';

const props = defineProps({
  // 预留字段；调用支付弹框的应用或业务，用于兼容不同业务的处理逻辑，一般使用首字母缩写，如 众享阅读：zxyd
  enterApp: {
    type: String,
    default: 'zxyd'
  },
  // 展示支付弹框
  showPaycash: {
    type: Boolean,
    default: false
  },
  // 是否展示微信支付
  showWxPay: {
    type: Boolean,
    default: false
  },
  // 是否展示支付宝支付
  showAliPay: {
    type: Boolean,
    default: false
  },
  // 预支付订单信息  orderId: 订单ID, orderName: 订单名, payStatus: 支付状态
  orderInfo: {
    type: Object,
    default() {
      return {};
    }
  },
  /**
   * 扩展信息
   *  login: 用户是否已登录
   *  payTypeDesc: 支付类型描述  all：支持全部支付场景，
   *      ali-all：Android手机与iOS手机支付宝支付，ali-android：Android手机支付宝支付，ali-iOS：iOS手机支付宝支付，
   *      wx-all：Android手机与iOS手机微信支付，wx-android：Android手机微信支付，wx-iOS：iOS手机微信支付。
   *  paySuccessUrl：支付成功跳转链接
   *  curHref：手机浏览器支付成功跳转链接
   *  wxUrl：微信-JS支付取消支付或支付失败跳转链接
   */
  expandInfo: {
    type: Object,
    default() {
      return {};
    }
  }
});
const emits = defineEmits(['update:showPaycash', 'showWxH5Dialog', 'changePaycash', 'payResult']);
const { userAgent, isLogin } = useStore('user');
const orderCreateInfo = ref(); // 预支付订单信息
const paycash = computed({
  get() {
    return props.showPaycash;
  },
  set(val) {
    emits('update:showPaycash', val);
  }
});
// hostId 清单 https://gitlab.xxt.cn/app/android/xxtapp/app/-/wikis/HostId%E6%B8%85%E5%8D%95
const isXxtIOSApp = computed(() => {
  const hostId = parseInt(userAgent.value.hostId as string, 10) || 0;
  return [4, 29, 31].includes(hostId);
});
const isXxtAndroidApp = computed(() => {
  const hostId = parseInt(userAgent.value.hostId as string, 10) || 0;
  return [1, 28, 30].includes(hostId);
});

const Toast = (title: any) => {
  uni.showToast({
    title,
    duration: 3000,
    icon: 'none'
  });
};
const curUrl = helper.page();

// 校验订单是否支付成功
// const orderResultCheck = (data: Object) => {
//   const url = '/order/center/alipay/order-result-check';
//   ajax({
//     url,
//     method: 'POST',
//     data
//   })
//     .then((response: any) => {
//       if (response.valid && parseInt(response.payStatus) === 1) {
//         // 支付成功
//         emits('payResult', true);
//       } else {
//         Toast('支付失败');
//         orderCreateInfo.value.orderId = '';
//         orderCreateInfo.value.orderName = '';
//         orderCreateInfo.value.payStatus = '';
//         paycash.value = false;
//       }
//     })
//     .catch((err) => {
//       Toast(err.message || '网络异常，请稍后重试');
//     });
// };
// 调用支付宝-APP支付桥接  todo 桥接待确定，后续用到了再开发
// const appThirdAliToPay = (data: any) => {
//   bridge.sendNativeEvent('aliPay', data).then((res: any) => {
//     const objres = JSON.parse(res);
//     paycash.value = false;
//     orderCreateInfo.value.orderId = '';
//     orderCreateInfo.value.orderName = '';
//     orderCreateInfo.value.payStatus = '';
//     if (objres.resultStatus) {
//       switch (objres.resultStatus) {
//         case '9000':
//           // 支付宝团队提示：用户支付成功后返回9000，但并不保证它绝对可靠。需要进一步调接口判断支付状态。
//           orderResultCheck(objres);
//           break;
//         case '8000':
//         case '6004':
//           // 正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
//           Toast('异常操作，支付结果未知');
//           break;
//         case '6002':
//           // 网络连接出错
//           Toast('网络连接异常，稍后重试');
//           break;
//         case '6001':
//           // 用户中途取消
//           break;
//         case '5000':
//           // 重复请求
//           Toast('您已提交订单，不要重复请求');
//           break;
//         case '4000':
//           // 订单支付失败
//           Toast('支付失败');
//           break;
//         default:
//           Toast('支付失败');
//       }
//     }
//   });
// };
// 调用微信-APP支付桥接  todo 桥接待确定，后续用到了再开发
// const appThirdwxToPay = (data: any) => {
//   bridge.sendNativeEvent('wxPay', data).then((res: any) => {
//     const objres = JSON.parse(res);
//     paycash.value = false;
//     if (objres.result) {
//       orderCreateInfo.value.orderId = '';
//       orderCreateInfo.value.orderName = '';
//       orderCreateInfo.value.payStatus = '';
//       // 支付成功
//       emits('payResult', true);
//     }
//   });
// };
// 取消微信-JS支付
// const onBridgeReady = (data: any) => {
//   (window as any).WeixinJSBridge.invoke(
//     'getBrandWCPayRequest',
//     {
//       // 下面参数内容都是后台返回的
//       appId: data.resultMap.unifiedOrder.appid, // 公众号名称，由商户传入
//       timeStamp: data.resultMap.unifiedOrder.timestamp, // 时间戳
//       nonceStr: data.resultMap.unifiedOrder.noncestr, // 随机串
//       package: `prepay_id=${data.resultMap.unifiedOrder.prepay_id}`, // 预支付id
//       signType: 'MD5', // 微信签名方式
//       paySign: data.resultMap.unifiedOrder.sign // 微信签名
//     },
//     (res: any) => {
//       // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
//       if (res.err_msg === 'get_brand_wcpay_request:ok') {
//         paycash.value = false;
//         orderCreateInfo.value.orderId = '';
//         orderCreateInfo.value.orderName = '';
//         orderCreateInfo.value.payStatus = '';
//         // 支付成功
//         emits('payResult', true);
//       } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
//         // 用户取消支付
//         paycash.value = false;
//         window.location.replace(props.expandInfo.wxUrl);
//       } else {
//         // 支付失败  进行刷新本页面
//         paycash.value = false;
//         orderCreateInfo.value.orderId = '';
//         orderCreateInfo.value.orderName = '';
//         orderCreateInfo.value.payStatus = '';
//         window.location.replace(props.expandInfo.wxUrl);
//       }
//     }
//   );
// };
// const wxPay = (data: any) => {
//   // #ifdef h5
//   paycash.value = false;
//   const vm = getCurrentInstance();
//   // 下面是解决WeixinJSBridge is not defined 报错的方法
//   if (typeof (window as any)?.WeixinJSBridge === 'undefined') {
//     // 微信浏览器内置对象。参考微信官方文档
//     if (document.addEventListener) {
//       document.addEventListener(
//         'WeixinJSBridgeReady',
//         () => {
//           onBridgeReady(data);
//         },
//         false
//       );
//     } else if ((document as any)?.attachEvent) {
//       (document as any).attachEvent('WeixinJSBridgeReady', onBridgeReady(data));
//       (document as any).attachEvent('onWeixinJSBridgeReady', onBridgeReady(data));
//     }
//   } else {
//     onBridgeReady(data);
//   }
//   // #endif
// };
const uniRequestPayment = (orderInfo: PayParams) => {
  const payParams: any = {
    ...orderInfo,
    success: (res: any) => {
      console.log(res);
      log.event('支付成功', '产品列表页', {
        orderId: props.expandInfo?.orderId,
        prepayid: (orderInfo.orderInfo as OrderInfoObj)?.prepayid
      });

      Toast('感谢您的赞助!');
      // 支付成功
      emits('payResult', true);
    },
    fail: (res: any) => {
      console.log(res?.errMsg);

      Toast(`支付失败，请稍候重试`);
    },
    complete: () => {
      uni.hideLoading();
    }
  };
  console.log('uniRequestPayment::: ', payParams);
  console.log('uniRequestPayment::: ', orderInfo);

  uni.requestPayment(payParams);
};
// 预支付订单接口
const thirdOrderCreate = (orderId: number, paidType: number, wxCode?: any) => {
  const params = {
    orderId,
    paidType, // 支付方式标识：1 支付宝app 2 微信app 3 微信浏览器（JSAPI） 9 手机浏览器（支付宝）10 手机浏览器（ 微信）
    wxCode,
    quitUrl: curUrl, // 支付宝h5支付，支付失败回调地址
    returnUrl: props.expandInfo.paySuccessUrl
  };
  const url = '/order/center/thirdpay/third-order-create';
  ajax({
    url,
    method: 'POST',
    data: params
  })
    .then((res: any) => {
      if (paidType !== 12) {
        uni.hideLoading();
      }
      // let dealWithContent = '';
      if (paidType === 1) {
        // 说明是支付宝-APP支付
        // if (res.content.includes('%')) {
        //   // eslint-disable-next-line prefer-regex-literals
        //   dealWithContent = res.content.replace(new RegExp('%25', 'gm'), '%');
        // }
        // appThirdAliToPay(dealWithContent);
      } else if (paidType === 2) {
        // 说明是微信-APP支付
        // const signedOrder = JSON.parse(res.content);
        // const bridgeparams = {
        //   // 下面参数内容都是后台返回的
        //   thirdPayType: 2,
        //   appid: signedOrder.appId, // 公众号名称，由商户传入
        //   mch_id: signedOrder.partnerId,
        //   prepay_id: signedOrder.prepayId,
        //   timestamp: signedOrder.timeStamp, // 时间戳
        //   noncestr: signedOrder.nonceStr, // 随机串
        //   package: signedOrder.packageValue, // 预支付id
        //   sign: signedOrder.sign // 微信签名
        // };
        // const appParams = {
        //   resultMap: {
        //     unifiedOrder: bridgeparams
        //   }
        // };
        // appThirdwxToPay(appParams);
      } else if (paidType === 3) {
        // 说明是微信-JS支付
        // const signedOrder = JSON.parse(res.content);
        // const bridgeparams = {
        //   // 下面参数内容都是后台返回的
        //   thirdPayType: 2,
        //   appid: signedOrder.appId, // 公众号名称，由商户传入
        //   mch_id: signedOrder.partnerId,
        //   prepay_id: signedOrder.prepayId,
        //   timestamp: signedOrder.timeStamp, // 时间戳
        //   noncestr: signedOrder.nonceStr, // 随机串
        //   package: signedOrder.packageValue, // 预支付id
        //   sign: signedOrder.sign // 微信签名
        // };
        // const appParams = {
        //   resultMap: {
        //     unifiedOrder: bridgeparams
        //   }
        // };
        // wxPay(appParams);
      } else if (paidType === 9) {
        // const div = document.createElement('div');
        // div.innerHTML = res.content;
        // document.body.appendChild(div);
        // document.forms[0].submit();
        // // document.forms.punchout_form.submit()
      } else if (paidType === 10) {
        // const h5_url = res.content;
        // // 返回至指定页面
        // // const return_url = encodeURIComponent('https://m.xxt.cn')
        // window.location.href = `${h5_url}&redirect_url=${encodeURIComponent(
        //   `${props.expandInfo.curHref}&showWxH5Dialog=true`
        // )}`;
      } else if (paidType === 12) {
        // 微信小程序支付
        const signedOrder = JSON.parse(res.content);
        console.log('signedOrder::: ', signedOrder);
        const payParams: PayParams = {
          provider: 'wxpay',
          orderInfo: {
            appid: signedOrder.appId, // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
            partnerid: signedOrder.partnerId, // 微信支付商户号
            prepayid: signedOrder.prepayId // 统一下单订单号
          },
          timeStamp: signedOrder.timeStamp, // 时间戳（单位：秒）
          nonceStr: signedOrder.nonceStr, // 随机字符串
          package: signedOrder.packageValue, // 固定值
          signType: signedOrder.signType, // 签名算法
          paySign: signedOrder.paySign // 签名，这里用的 MD5/RSA 签名
        };
        uniRequestPayment(payParams);
      } else {
        Toast('请使用App订购');
      }
    })
    .catch((err) => {
      uni.hideLoading();
      Toast(err.message || '网络异常，请稍后重试');
    });
};

// 非微信浏览器h5支付
// const h5NotWxPay = () => {
//   if (orderCreateInfo.value.payStatus === 0) {
//     emits('showWxH5Dialog', true);
//     paycash.value = false;
//     thirdOrderCreate(orderCreateInfo.value.orderId, 10);
//   } else {
//     paycash.value = false;
//   }
// };
// 不能购买
const cannotBuy = (reason: number) => {
  switch (reason) {
    case 1:
      Toast('iOS 暂不支持购买');
      break;
    case 2:
      Toast('当前浏览器暂不支持支付，请微信中打开或下载app');
      break;
    case 3:
      Toast('仅支持微信5.0以上版本');
      break;
    case 4:
      Toast('您的手机上没有安装微信');
      break;
    default:
      break;
  }
};
// 微信浏览器中的微信支付
// const thirdJSwxPay = () => {
//   if (orderCreateInfo.value.payStatus === 0) {
//     const wxCode = getSession('code');
//     thirdOrderCreate(orderCreateInfo.value.orderId, 3, wxCode);
//   }
// };

// 微信小程序支付
const wxmpBuy = () => {
  if (isLogin.value) {
    uni.showLoading({
      title: '加载中...'
    });
    uni.login({
      provider: 'weixin',
      success(res) {
        console.log('uni.login success res::: ', res);

        const wxCode = res.code;
        thirdOrderCreate(orderCreateInfo.value.orderId, 12, wxCode);
      },
      fail(err) {
        Toast(err);
        uni.hideLoading();
      }
    });
  } else {
    go2Login(curUrl);
  }
};

/**
 * @desc 判断微信浏览器 和浏览器版本
 */
// const isWeiXin = () => {
//   const ua = window.navigator.userAgent.toLowerCase();
//   const reg = /MicroMessenger\/([\d\.]+)/i;
//   const wechatInfo = ua.match(reg);
//   if (wechatInfo) {
//     return wechatInfo;
//   }
//   return false;
// };

// 浏览器中点击购买判断浏览器环境
// const browserBuy = (browserInfo: any) => {
//   if (!browserInfo) {
//     // that.cannotBuy(2)
//     // 不是微信浏览器，走微信h5支付
//     h5NotWxPay();
//   } else {
//     // 说明在微信浏览器环境中

//     if (browserInfo[1] < '5.0') {
//       cannotBuy(3);
//     } else if (props.expandInfo.login) {
//       // 走jsAPI支付
//       thirdJSwxPay();
//     } else {
//       go2Login(curUrl);
//       // Toast('请登陆后购买')
//     }
//   }
// };
const containType = () => {
  if (isXxtIOSApp.value) {
    // 在ios xxtapp容器里面不能购买
    cannotBuy(1);
  } else if (isXxtAndroidApp.value) {
    // 在Android xxtapp容器里面可以购买  todo 待确定桥接
    // bridge.sendNativeEvent('checkWx', {}).then((res) => {
    //   if (res === 'success') {
    //     if (props.expandInfo.login) {
    //       // 走app微信桥接支付
    //       thirdOrderCreate(orderCreateInfo.value.orderId, 2);
    //     } else {
    //       // Toast('请登录后购买')
    //       go2Login(curUrl);
    //     }
    //   } else {
    //     cannotBuy(4);
    //   }
    // });
  } else {
    // #ifdef H5
    // 说明在浏览器环境中 要判断是不是在微信浏览器环境中
    // const browserInfo = isWeiXin();
    // browserBuy(browserInfo);
    // #endif
    // #ifdef MP-WEIXIN
    wxmpBuy();
    // #endif
  }
};
const payByWX = useThrottleFn(() => {
  containType();
}, 3000);
// 点击支付宝支付
const payByALi = useThrottleFn(() => {
  if (isXxtAndroidApp.value) {
    if (
      props.expandInfo.payTypeDesc !== 'all' &&
      props.expandInfo.payTypeDesc !== 'ali-all' &&
      props.expandInfo.payTypeDesc !== 'ali-android'
    ) {
      Toast('Android 暂不支持支付宝支付');
      return;
    }
    // 在Android xxtapp容器里面可以购买
    if (props.expandInfo.login) {
      paycash.value = false;
      // 走app阿里桥接支付
      thirdOrderCreate(orderCreateInfo.value.orderId, 1);
    } else {
      // Toast('请登录后购买')
      go2Login(curUrl);
    }
  } else {
    if (
      isXxtIOSApp.value &&
      props.expandInfo.payTypeDesc !== 'all' &&
      props.expandInfo.payTypeDesc !== 'ali-all' &&
      props.expandInfo.payTypeDesc !== 'ali-iOS'
    ) {
      Toast('iOS 暂不支持支付宝支付');
      return;
    }
    // this.cannotBuy(1)
    if (props.expandInfo.login) {
      paycash.value = false;
      // 走app阿里桥接支付
      thirdOrderCreate(orderCreateInfo.value.orderId, 9);
    } else {
      // Toast('请登录后购买')
      go2Login(curUrl);
    }
  }
}, 3000);

// 取消支付
const cancelPay = () => {
  paycash.value = false;
};

watch(
  () => props.orderInfo,
  (newVal) => {
    orderCreateInfo.value = newVal;
  },
  {
    immediate: true
  }
);
watch(
  () => paycash,
  (newV, oldV) => {
    if (newV !== oldV && !newV) {
      // false: 关闭支付选择弹框
      emits('changePaycash', newV);
    }
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.pay-list {
  &-title {
    padding: 28rpx 0;
    text-align: center;
    font-weight: bold;
    font-size: 28rpx;
    color: #666;
  }
  .cancel-pay {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    vertical-align: middle;
  }
}
.wxpayimg {
  padding-right: 10px;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
