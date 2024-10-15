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
    // 朗读微信订阅老师模板id
    teacherSubscribeTemplIds: [
      '2fkZYOwDt2FUYWRfI37kaeVaSYE-0yz_VaoVbUUmxbU',
      'Hyc1g64P2Wyn2eLvkt260HZ9jh9gCCt_PVOxyQujt1M',
      'XZAqsGk_Of4DpX4KkgzxZWwvzBJ-AJ-xUmyeZvgY0tk'
    ],
    // 朗读微信订阅学生模板id
    studentSubscribeTemplIds: [
      'XZAqsGk_Of4DpX4KkgzxZedXrw_N8EDkZaf4gtg8jXs',
      '2fkZYOwDt2FUYWRfI37kaSkpCadPrlt3czGcZ0RbWAI',
      'Hyc1g64P2Wyn2eLvkt260JYmmG5tBaI7CAs4ggcxKEk'
    ]
  },
  // store中appConfig的默认配置，每个小程序的tabbar不一样所以单独配置
  defalutAppConfig,
  entry: 'wxmp_read',
  // 微信小程序账号的原始ID
  WXMPOriginalID: 'gh_c74433287b6c',
  // 公共分包模块的配置路径
  publicSubPackgePath: `/uni_modules/uni-module-public`,
  // 主包路径
  subPackagesRoot: 'uni_modules/xxt-xzx-reading-uni',
  // 报名称
  subPackagesName: 'xxtReadingUni',
  // 登录验证码
  loginPhoneCode: 31,
  // 绑定验证码
  bindPhoneCode: 4,
  // 项目id
  loginConfigKey: 'xzx-reading',
  hostId: 101,
  // 在接口返回未登录的时候，不跳转登录页面接口白名单
  noLoginApiWhiteList: ['user-data-v2/user/get-user-account-list']
};

export default projectConfig;
