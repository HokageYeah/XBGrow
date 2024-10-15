<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
import { getCookie } from './uni-module-common/utils/caches';
import { initAPPData } from './uni-module-common/utils/loginGetInfo';
import { globalData } from './uni-module-common/utils/global';
import { uniToNatLifeCycle } from '@/uni-module-common/utils/uniToNavProtocol';
import bridge from '@/uni-module-common/utils/uniToNativeBridge';
import { appModuleConfig, mode } from '@/uni-module-common/config';
console.log('app.vue-----appModuleConfig-----', appModuleConfig);
const { setUserInfoAttr, getInfo, setClientInfo, setUserAgent, resetUserData, initStoreData } =
  useStore('user');
const { initStoreAppData } = useStore('appConfig');
let isAppLogin = false;
const instance = getCurrentInstance();
const eventBus = instance!.appContext.config.globalProperties.$eventBus;
// 测试：将entry改为测试的：wxmp_szjx 数智家校
globalData.entry = appModuleConfig.entry;
const hostId = appModuleConfig.hostId;
// 当 uni-app 初始化完成时触发（全局只触发一次），参数为应用启动参数，同 uni.getLaunchOptionsSync 的返回值
onLaunch((_options) => {
  // 如果是从app登录进入的 则isAppLogin 不走onshow中的initAPPData初始化，因为这个时候_options为null
  // uni.$on('uniToNatLogin', () => {
  //   isAppLogin = true;
  // });

  // 隐藏原生导航栏 使用自定义底部导航，根据自己项目觉得是否使用
  // uni.hideTabBar();
  // #ifndef APP-PLUS || APP
  initStoreData(appModuleConfig.entry);
  initStoreAppData();
  // #endif
  // #ifdef MP-WEIXIN
  // 如果是微信需要手动写入 userAgent
  const userAgent4Dev = `${appModuleConfig.entry};hostId:${hostId};appversion:1.0.0;appversioncode:100`; // 河南校讯通
  const clientInfo4Dev = {
    cv: '', // 客户端版本号
    chv: '', // 客户端渠道版本号
    ch: '', // 客户端渠道号
    jv: '' // 客户端版本号
  };
  setUserAgent(userAgent4Dev);
  setClientInfo(clientInfo4Dev);
  // #endif
  // #ifdef APP-PLUS || APP
  eventBus.on('uniToNatLogin', () => {
    console.log('uniToNatLogin----eventbus---');
    isAppLogin = true;
  });
  // 添加监听 app端主动通信的协议
  bridge.receiveNewNativeEvent(eventBus);
  bridge.sendNativeEvent(uniToNatLifeCycle, {
    lifeCycle: 'onLaunch'
  });
  // #endif
});

// 当 uni-app 启动，或从后台进入前台显示时触发，参数为应用启动参数，同 uni.getLaunchOptionsSync 的返回值
onShow((_options) => {
  try {
    isAppLogin || initAPPData(_options, 1);
  } catch (e) {
    console.error('onShow声明周期报错----', e);
  }
  // 这个地方先去掉， 解决：从通知模块去登录，登录成功后在选择图片后返回app，依旧显示未登录的问题。
  // 下次进入onshow的时候initAPPData 不让它在执行，因为app传入的_options为空
  // isAppLogin = false;
  // #ifdef APP-PLUS
  uni.onNativeEventReceive((event: string, data: any) => {
    uni.$emit(event, data);
  });
  bridge.sendNativeEvent(uniToNatLifeCycle, {
    lifeCycle: 'onShow'
  });
  // #endif

  // #ifdef H5
  if (mode.startsWith('dev')) {
    const ckWid = getCookie('XXT_ID');
    if (ckWid != null) {
      // 已登录时
      getInfo({}, 'H5').then(() => {
        const userAgent4Dev = 'android-jxq;hostId:1;appversion:7.0.2;appversioncode:702'; // Android 河南校讯通
        const clientInfo4Dev = {
          cv: '', // 客户端版本号
          chv: '', // 客户端渠道版本号
          ch: '', // 客户端渠道号
          jv: '' // 客户端版本号
        };
        setUserAgent(userAgent4Dev);
        setClientInfo(clientInfo4Dev);
        setUserInfoAttr('phaseCode', 311); // 学段编码
        // h5登录成功后保存登录信息到 storage中，根小程序保持用户信息存储逻辑一致
      });
    } else {
      // 未登录时
      resetUserData();
    }
  }
  // #endif
});

// 当 uni-app 从前台进入后台时触发
onHide(() => {
  // #ifdef APP-PLUS
  bridge.sendNativeEvent(uniToNatLifeCycle, {
    lifeCycle: 'onHide'
  });
  // #endif
});
</script>

<!-- 必须配置，配置一些全局的信息 登录所用的entry需要从这个里面获取 -->
<script lang="ts">
export default {
  // 每个app或者小程序内独有的配置
  globalData: {
    // entry: 'wxmp_szjx',
    // // 微信小程序账号的原始ID
    // WXMPOriginalID: 'gh_9a830fd9843f',
    // // 公共分包模块的配置路径
    // publicSubPackgePath: '/uni_modules/uni-module-public'
  }
};
</script>

<style lang="scss">
/* #ifndef MP-WEIXIN */
@import url('@/style/thorui-extend.css');
@import url('@/static/css/xxt-fonts/iconfont.css');
/* #endif */
/* #ifdef MP-WEIXIN */
@import url('@/style/thorui-extend.wxss');
@import url('@/static/css/xxt-fonts/iconfont.wxss');
/* @import './static/css/xxt-fonts/iconfont.css'; */
/* @import './static/style/thorui-extend.css'; */
</style>
