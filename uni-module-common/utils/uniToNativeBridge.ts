import { initAPPData } from './loginGetInfo';
import {
  natToUniEditedImg,
  natToUniOnChoosedWxFile,
  natToUniSyncLoginInfo,
  uniToNatLogin,
  uniToNatToPage
} from '@/uni-module-common/utils/uniToNavProtocol';
import type { EventBus } from '@/uni-module-common/utils/eventBus';
function sendNativeEvent(event: string, msg: string | Object) {
  return new Promise((resolve) => {
    // 向宿主App发送事件
    uni.sendNativeEvent(event, msg, (ret: any) => {
      // this.nativeMsg = `宿主App回传的数据：${ret}`;
      resolve(ret);
    });
  });
}

function receiveNativeEvent(eventName: string) {
  return new Promise((resolve) => {
    uni.onNativeEventReceive((event: string, data: any) => {
      console.log('receiveNativeEvent---event---', event, data, eventName);
      if (event === eventName) {
        console.log('receiveNativeEvent---eventName---', eventName);
        resolve(data);
      }
    });
  });
}
let eventBusAll: EventBus;
function receiveNewNativeEvent(eventBus: EventBus) {
  console.log('receiveNewNativeEvent---eventstart---');
  eventBusAll = eventBus;
  uni.onNativeEventReceive((event: string, data: any) => {
    console.log('receiveNewNativeEvent---event---', event, data);
    if (event === natToUniOnChoosedWxFile) {
      eventBus.emit(natToUniOnChoosedWxFile, data);
      // uni.$emit(natToUniOnChoosedWxFile, data);
      console.log('receiveNewNativeEvent---eventName---', data);
    } else if (event === natToUniSyncLoginInfo) {
      // uni.$emit(natToUniSyncLoginInfo, data);
      eventBus.emit(natToUniSyncLoginInfo, data);
    } else if (event === natToUniEditedImg) {
      // uni.$emit(natToUniEditedImg, data);
      eventBus.emit(natToUniEditedImg, data);
    }
  });
}

function login(url: string) {
  sendNativeEvent(uniToNatLogin, url).then((res: any) => {
    // uni.$emit('uniToNatLogin', '我是登录成功后的回调到applunch');
    console.log('app启动信息传递---referrerInfo---eventBusAll-', eventBusAll);
    console.log('app启动信息传递---referrerInfo---eventBusAll-all-', eventBusAll.emit);
    eventBusAll.emit('uniToNatLogin', '我是登录成功后的回调到applunch');
    console.log('app启动信息传递---referrerInfo--login-', res);
    // setTimeout(() => {
    initAPPData(
      {
        referrerInfo: {
          extraData: res
        }
      },
      2
    );
    // }, 4000);
  });
}
// 跳转到原声页面公用方法（分iOS和安卓端）
function jumpNativePage(params: { androidParams: any; iosParams: any }) {
  // 只在新平台上
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync();
  let objvalue: any = {};
  switch (systemInfo.platform) {
    case 'android':
      objvalue = params.androidParams;
      console.log('运行Android上');
      break;
    case 'ios':
      objvalue = params.iosParams;
      console.log('运行iOS上');
      break;
    default:
      console.log('运行在开发者工具上');
      break;
  }
  sendNativeEvent(uniToNatToPage, objvalue);
}

export default {
  sendNativeEvent,
  receiveNativeEvent,
  login,
  receiveNewNativeEvent,
  jumpNativePage
};
