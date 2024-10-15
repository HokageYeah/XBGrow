import type { appConfigType } from './projectType';
const WxAppConfig: any = import.meta.env.VITE_LOGIN_WX_APP_CONFIG
  ? Object.fromEntries(JSON.parse(import.meta.env.VITE_LOGIN_WX_APP_CONFIG))
  : {};
const defalutAppConfig: appConfigType = {
  template: {
    basic: {
      tabBar: {
        selectedColor: '',
        color: '',
        // 朗读小程序自定义tabbar配置
        list: []
      }
    }
  }
};
const projectConfig = {
  // 微信订阅模板id
  wxSubscribeTemplIds: {
    // 迎新微信订阅老师模板id
    teacherSubscribeTemplIds: [],
    // 迎新微信订阅学生模板id  todo 待配置
    studentSubscribeTemplIds: ['XZAqsGk_Of4DpX4KkgzxZedXrw_N8EDkZaf4gtg8jXs']
  },
  // store中appConfig的默认配置，每个小程序的tabbar不一样所以单独配置
  defalutAppConfig,
  entry: 'wxmp_income',
  // 微信小程序账号的原始ID
  WXMPOriginalID: 'gh_317856cc568e',
  // 主包路径
  subPackagesRoot: 'uni_modules/xxt-income-uni',
  // 报名称
  subPackagesName: 'xxtIncomeUni',
  // 登录验证码
  loginPhoneCode: 41,
  // 绑定验证码
  bindPhoneCode: 53,
  // 项目id
  loginConfigKey: 'xxt-income',
  hostId: 104,
  // 在接口返回未登录的时候，不跳转登录页面接口白名单
  noLoginApiWhiteList: ['user-data-v2/user/get-user-account-list'],
  // 公共分包模块的配置路径
  publicSubPackgePath: `/uni_modules/uni-module-public`
};

export default projectConfig;
