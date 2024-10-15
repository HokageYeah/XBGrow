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
            pagePath: '/pages/index/index',
            text: '首页',
            iconPath: 'tabbar_app_home_unselect.png',
            selectedIconPath: 'tabbar_app_home_select.png'
          },
          {
            pagePath: '/pages/book/book',
            text: '图书',
            iconPath: 'tabbar_app_study_unselect.png',
            selectedIconPath: 'tabbar_app_books_select.png'
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
          title: '图书漂流',
          subTitle: '分享图书',
          icon: 'new_books_stu_drift',
          bgIcon: 'books_drift_bg',
          path: '',
          backgroundColor: '#B9F6CB',
          toBackgroundColor: '#74F69B',
          titleColor: '#25C154',
          menuId: 1
        },
        {
          title: '我的借阅',
          subTitle: '我借的书',
          icon: 'new_books_stu_borrowing',
          bgIcon: 'books_borrowing_bg',
          path: '',
          backgroundColor: '#C7ECFF',
          toBackgroundColor: '#80D1FC',
          titleColor: '#008AD1',
          menuId: 2
        }
      ],
      homeStudentModule: [
        {
          title: '图书漂流',
          subTitle: '分享图书',
          icon: 'new_books_stu_drift',
          bgIcon: 'books_drift_bg',
          path: '',
          backgroundColor: '#B9F6CB',
          toBackgroundColor: '#74F69B',
          titleColor: '#25C154',
          menuId: 1
        },
        {
          title: '我的借阅',
          subTitle: '我借的书',
          icon: 'new_books_stu_borrowing',
          bgIcon: 'books_borrowing_bg',
          path: '',
          backgroundColor: '#C7ECFF',
          toBackgroundColor: '#80D1FC',
          titleColor: '#008AD1',
          menuId: 2
        }
      ],
      administratorModule: [
        {
          title: '图书上架',
          subTitle: '添加新书',
          icon: 'new_books_listing',
          path: '',
          backgroundColor: '#B9F6CB',
          toBackgroundColor: '#74F69B',
          titleColor: '#25C154',
          menuId: 3
        },
        {
          title: '图书下架',
          subTitle: '取出旧书',
          icon: 'new_books_removal',
          path: '',
          backgroundColor: '#FFE39D',
          toBackgroundColor: '#FFD364',
          titleColor: '#F67A06',
          menuId: 4
        },
        {
          title: '借阅管理',
          subTitle: '借阅数据',
          icon: 'new_books_borrowing',
          path: '',
          backgroundColor: '#C7ECFF',
          toBackgroundColor: '#80D1FC',
          titleColor: '#008AD1',
          menuId: 5
        }
      ]
    }
  }
};
const projectConfig = {
  // 微信订阅模板id
  wxSubscribeTemplIds: {
    // 数智慧家校微信订阅老师模板id
    teacherSubscribeTemplIds: ['nEEz30E2jlVOw9H_2dO6hRnCqW-eRXUWnigyvoYjqng'],
    // 数智慧家校微信订阅学生模板id
    studentSubscribeTemplIds: ['nEEz30E2jlVOw9H_2dO6hRnCqW-eRXUWnigyvoYjqng']
  },
  // store中appConfig的默认配置，每个小程序的tabbar不一样所以单独配置
  defalutAppConfig,
  entry: 'wxmp_zhyd',
  // WX公众号entry
  wxPublicEntry: 'wxoa_zhyd',
  // 微信小程序账号的原始ID
  WXMPOriginalID: 'gh_f0845c6d44a6',
  // 公共分包模块的配置路径
  publicSubPackgePath: `/uni_modules/uni-module-public`,
  // 主包路径
  subPackagesRoot: 'uni_modules/xxt-wxmp-wisdom-reading-uni',
  // 报名称
  subPackagesName: 'xxtWxmpWisdomReadingUni',
  // 登录验证码
  loginPhoneCode: 71,
  // 绑定验证码
  bindPhoneCode: 54,
  // 项目id
  loginConfigKey: 'zhyd',
  hostId: 106,
  // 在接口返回未登录的时候，不跳转登录页面接口白名单
  noLoginApiWhiteList: [
    'user-data-v2/user/get-user-account-list',
    'notice/common-notice/has-notice',
    'notice/common-notice/get-send-notice-list',
    'user-data-v2/auth/check-user-resource-auth'
  ]
};

export default projectConfig;
