import type { h5ToUniParamsType } from '@/@types/commonTypes';

const initAPPData = (_options: any, number: number) => {
  const { setToken } = useStore('user');
  const referrerInfo = _options?.referrerInfo?.extraData;
  // const toastInfo = { ...referrerInfo.userInfo, accountList: {} };
  // uni.showToast({
  //   title: `这是app.vue的---${JSON.stringify(toastInfo || _options)}`,
  //   icon: 'none',
  //   duration: 2000
  // });
  // 获取登录信息
  const cookieStr = referrerInfo?.cookieStr;
  const userAgent =
    referrerInfo?.userAgent || 'android-jxq;hostId:1;appversion:7.0.2;appversioncode:702';
  const clientInfo = referrerInfo?.clientInfo;
  const userInfo = referrerInfo?.userInfo;
  console.log('app启动信息传递---referrerInfo--HHHYU', JSON.stringify(referrerInfo));
  console.log('app启动信息传递---clientInfo--', clientInfo);
  console.log('app启动信息传递---userInfo--', JSON.stringify(userInfo));

  if (typeof plus !== 'undefined') {
    // // console.log(
    //   'App Launch app启动的时候返回参数getUserAgent------',
    //   plus?.navigator?.getUserAgent()
    // );
  }

  // 回传过来的参数params
  const paramStr = referrerInfo?.params;
  console.log('app启动信息传递---paramStr--', paramStr);

  if (paramStr) {
    let paramObj: h5ToUniParamsType = {
      from: '',
      taskSubType: -1
    };
    if (typeof paramStr === 'string') {
      paramObj = JSON.parse(paramStr);
    } else if (typeof paramStr === 'object') {
      paramObj = paramStr;
    }
    uni.$emit('h5PushToUni', paramObj);
    getApp().globalData = {
      H5ToUniParams: paramObj
    };
  }
  if (cookieStr && cookieStr.length !== 0) {
    console.log('setToken-----initAPPData---');
    setToken(cookieStr, userInfo, userAgent, clientInfo);
  }
};

const initReadAPPData = (cookieStr: string, userInfo: any) => {
  const { setToken } = useStore('user');
  if (cookieStr && cookieStr.length !== 0) {
    const defaultUserAgent = 'weixin-read;hostId:101;appversion:1.0.0;appversioncode:100';
    console.log('setToken-----initReadAPPData---');
    setToken(cookieStr, { ...userInfo, phaseCode: 211 }, defaultUserAgent);
  }
};

export { initAPPData, initReadAPPData };
