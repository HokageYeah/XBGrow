// import { http } from '../utils/http';
import http from '@/uni-module-common/http';
import { appModuleConfig } from '@/uni-module-common/config/';

export const useUniOrderSubscribe = (templIds: string[], subscription: Function) => {
  console.log('查看模板----', templIds);
  uni.requestSubscribeMessage({
    tmplIds: templIds,
    success(res: any) {
      console.log('查看模板----success---', res);
      // uni.login({
      //   provider: 'weixin',
      //   success: (res) => {
      //     console.log('code', res.code);
      //     // 获取code传给后台
      //     subscription({
      //       code: res.code
      //     });
      //   }
      // });
      // delete res.errMsg;
      // 获取code传给后台
      subscription(res);
    },
    fail(errMessage) {
      console.log('errMessage', errMessage);
    },
    // 不管成功或失败都要执行
    complete(complete) {
      console.log('complete', complete);
    }
  });
};
export const useUniGetSetting = (templIds: string[], callBack: Function) => {
  console.log('查看模板----getSetting---', templIds);
  uni.getSetting({
    withSubscriptions: true,
    success: (res) => {
      console.log('查看模板----getSetting---success--', res);
      // 如果总开关关了或者总是拒绝不进行引导
      if (res.subscriptionsSetting.mainSwitch) {
        if (
          res.subscriptionsSetting.itemSettings &&
          templIds.every((tmplId) => res.subscriptionsSetting.itemSettings[tmplId])
        ) {
          callBack(res.subscriptionsSetting.itemSettings);
          return;
        }
        uni.showModal({
          title: '温馨提示',
          content: '您尚未订阅一次性消息，是否立即订阅？',
          confirmText: '订阅',
          success: (res) => {
            if (res.confirm) {
              // 用户点击了订阅按钮，调起订阅接口
              useUniOrderSubscribe(templIds, callBack);
            }
          }
        });
      } else {
        console.log('查看模板----getSetting---faile-未开启');
        // 用户尚未开启订阅消息总开关，建议提醒用户开启
        uni.openSetting({
          // 打开设置页
          success(res) {
            console.log('查看模板----getSetting---success', res.authSetting);
            console.log('查看模板----getSetting---success-res', res);
          },
          fail(res) {
            console.log('查看模板----getSetting---faile-res', res);
          }
        });
      }
    },
    fail: (err) => {
      console.log('查看模板----getSetting---err--', err);
    }
  });
};

/**
 *  用户订阅wx模板
 */
export const SubscribeWXTemplate = (params: any, url: string) => {
  return http({
    method: 'POST',
    url,
    data: params
  });
};
/**
 *  用户订阅wx模板 回调函数调用
 */
// export const SubscribeWXTemplateCallBack = async (data: any) => {
//   data.errMsg && delete data.errMsg;
//   const templateList = Object.entries(data).map(([k, v]) => {
//     return {
//       templateId: k,
//       subscribeStatus: v
//     };
//   });
//   const params = {
//     templateList,
//     entry: 'wxmp_read'
//   };
//   console.log('SubscribeWXTemplateCallBack--查看订阅数据', data);
//   console.log('查看订阅数据-params--', params);
//   const result: any = await SubscribeWXTemplate(params);
//   uni.showToast({
//     title: result.message,
//     icon: 'none'
//   });
//   console.log('查看订阅数据-result--', result);
// };
export const SubscribeWXTemplateCallBack = (entry: string, url: string) => {
  return async (data: any) => {
    data.errMsg && delete data.errMsg;
    const templateList = Object.entries(data).map(([k, v]) => {
      return {
        templateId: k,
        subscribeStatus: v
      };
    });
    const params = {
      templateList,
      entry
    };
    console.log('SubscribeWXTemplateCallBack--查看订阅数据', data);
    console.log('查看订阅数据-params--', params);
    const result: any = await SubscribeWXTemplate(params, url);
    uni.showToast({
      title: result.message,
      icon: 'none'
    });
    console.log('查看订阅数据-result--', result);
  };
};
/**
 *  调用微信订阅模板
 */
export const SubscribeWXTemplateAPI = (
  entry = 'wxmp_read',
  url = '/news/wx-news/subscribe-wx-template'
) => {
  const { userInfo } = useStore('user');
  const jut = userInfo.value.jut;
  // const xzxObj = appCommonConfig[WxAppConfig.loginConfigKey as appCommonConfigType];
  const xzxObj = appModuleConfig.wxSubscribeTemplIds;

  console.log('调用微信订阅模板userInfo---', userInfo, xzxObj);
  let tempIds: string[] = [];
  if (jut === -1) {
    // 登录身份是网站注册身份
  } else if (jut === 0 || jut === 3) {
    // 教师身份
    tempIds = xzxObj.teacherSubscribeTemplIds;
  } else if (jut !== 99) {
    // 学生身份
    tempIds = xzxObj.studentSubscribeTemplIds;
  }
  useUniGetSetting(tempIds, SubscribeWXTemplateCallBack(entry, url));
};
