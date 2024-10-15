import type { appConfigType } from './projectType';
const WxAppConfig: any = import.meta.env.VITE_LOGIN_WX_APP_CONFIG
  ? Object.fromEntries(JSON.parse(import.meta.env.VITE_LOGIN_WX_APP_CONFIG))
  : {};
const defalutAppConfig: appConfigType = {
  template: {
    basic: {
      tabBar: {
        selectedColor: '#4AD975',
        color: '#999999',
        list: [
          {
            pagePath: '/pages/template-index/template-index',
            text: '首页',
            iconPath: 'tabbar_app_home_unselect.png',
            selectedIconPath: 'tabbar_app_home_unselect.png'
          },
          {
            pagePath: '/pages/friends-circle-home/friends-circle-home',
            text: '班级',
            iconPath: 'tabbar_app_new_circle_unselect.png',
            selectedIconPath: 'tabbar_app_new_circle_select.png'
          },
          {
            pagePath: '/pages/template-index/template-test',
            text: '学习',
            iconPath: 'tabbar_app_study_unselect.png',
            selectedIconPath: 'tabbar_app_study_unselect.png'
          },
          {
            pagePath: '/pages/template-index/template-mine',
            text: '我的',
            iconPath: 'tabbar_app_my_unselect.png',
            selectedIconPath: 'tabbar_app_my_unselect.png'
          }
        ]
      }
    }
  }
};
const projectConfig = {
  // 微信订阅模板id
  wxSubscribeTemplIds: {
    // 数智慧家校微信订阅老师模板id
    teacherSubscribeTemplIds: [],
    // 数智慧家校微信订阅学生模板id
    studentSubscribeTemplIds: []
  },
  // store中appConfig的默认配置，每个小程序的tabbar不一样所以单独配置
  defalutAppConfig,
  entry: 'wxmp_szjx',
  // 微信小程序账号的原始ID
  WXMPOriginalID: 'gh_9a830fd9843f',
  // 公共分包模块的配置路径
  publicSubPackgePath: `/uni_modules/uni-module-public`,
  // 主包路径
  subPackagesRoot: 'uni_modules/xxt-firends-circle-uni',
  // 报名称
  subPackagesName: 'xxtFirendsCircleUni',
  // 登录验证码
  loginPhoneCode: 71,
  // 绑定验证码
  bindPhoneCode: 54,
  // 项目id
  loginConfigKey: 'szjx',
  hostId: 102,
  // 在接口返回未登录的时候，不跳转登录页面接口白名单
  noLoginApiWhiteList: [
    'user-data-v2/user/get-user-account-list',
    'notice/common-notice/has-notice',
    'notice/common-notice/get-send-notice-list',
    'user-data-v2/auth/check-user-resource-auth'
  ]
};

export default projectConfig;
