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
            pagePath: '/pages/home-design/new-home-design',
            text: '首页',
            iconPath: 'tabbar_app_home_unselect.png',
            selectedIconPath: 'tabbar_app_home_select.png'
          },
          {
            pagePath: '/pages/class-circles/class-circles-home',
            text: '班级',
            iconPath: 'tabbar_app_new_circle_unselect.png',
            selectedIconPath: 'tabbar_app_new_circle_select.png'
          },
          {
            pagePath: '/pages/mine/mine',
            text: '我的',
            iconPath: 'tabbar_app_my_unselect.png',
            selectedIconPath: 'tabbar_app_my_select.png'
          }
        ]
      },
      homeTeacherModule: [
        {
          title: '智能通知',
          icon: 'home-desigin-notice',
          path: '/uni_modules/xxt-notice-uni/pages/notice-list-home/notice-list-home',
          menuId: 1
        },
        {
          title: '成绩',
          icon: 'home-desigin-score',
          path: '/uni_modules/xxt-exam-score-uni/pages/score-list-home/score-list-home',
          menuId: 2
        },
        {
          title: '打卡',
          icon: 'home-desigin-clock',
          path: '/uni_modules/xxt-clock-in-uni/pages/clock-list-home/clock-list-home',
          menuId: 4
        },
        {
          title: '更多',
          icon: 'home-desigin-all',
          path: '',
          menuId: 0
        }
      ],
      homeStudentModule: [
        {
          title: '智能通知',
          icon: 'home-desigin-notice',
          path: '/uni_modules/xxt-notice-uni/pages/notice-list-home/notice-list-home',
          menuId: 1
        },
        {
          title: '成绩',
          icon: 'home-desigin-score',
          path: '/uni_modules/xxt-exam-score-uni/pages/score-list-home/score-list-home',
          menuId: 2
        },
        {
          title: '智能储物柜',
          icon: 'home-desigin-lockers',
          path: '/uni_modules/xxt-lockers-uni/pages/lockers-home/lockers-home',
          menuId: 3
        },
        {
          title: '打卡',
          icon: 'home-desigin-clock',
          path: '/uni_modules/xxt-clock-in-uni/pages/clock-list-home/clock-list-home',
          menuId: 4
        },
        {
          title: '更多',
          icon: 'home-desigin-all',
          path: '',
          menuId: 0
        }
      ]
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
  entry: 'wxmp_xxt',
  // 微信小程序账号的原始ID
  WXMPOriginalID: 'gh_6da54665c58a',
  // 公共分包模块的配置路径
  publicSubPackgePath: `/uni_modules/uni-module-public`,
  // 主包路径
  subPackagesRoot: 'uni_modules/xxt-wxmp-uni',
  // 报名称
  subPackagesName: 'xxtWxmpUni',
  // 登录验证码
  loginPhoneCode: 41,
  // 绑定验证码
  bindPhoneCode: 53,
  // 项目id
  loginConfigKey: 'xxt',
  hostId: 103,
  // 在接口返回未登录的时候，不跳转登录页面接口白名单
  noLoginApiWhiteList: [
    'user-data-v2/user/get-user-account-list',
    'notice/common-notice/has-notice',
    'notice/common-notice/get-send-notice-list',
    'user-data-v2/auth/check-user-resource-auth'
  ]
};

export default projectConfig;
