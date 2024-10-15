import { cloneDeep } from 'lodash';
import { appModuleConfig } from '@/uni-module-common/config/';
import type { headerModuleType } from '@/uni-module-common/config/project-modules-config/projectType';
export interface listType {
  pagePath: string;
  text: string;
  iconPath: string;
  selectedIconPath: string;
}
const appConfig = defineStore({
  id: 'appConfig',
  state: () => ({
    appConfig: cloneDeep(appModuleConfig.defalutAppConfig)
  }), // app基本配置信息
  actions: {
    getTabBarItem(index: number) {
      // 更改list第一个值
      return this.appConfig.template.basic.tabBar.list[index];
    },
    // 修改tabbar配置
    setTabBar(listObj: listType, index: number) {
      // 更改list第一个值
      this.appConfig.template.basic.tabBar.list[index] = listObj;
    },
    setTabBarDot(dot: boolean, pagePath: string) {
      const findItem = this.appConfig.template.basic.tabBar.list.find(
        (item: listType) => item.pagePath === pagePath
      );
      if (findItem) {
        findItem.dot = dot;
      }
      return !!findItem;
    },
    spliceTabBarItem(index: number, step = 1, ...args: listType[]) {
      // 更改list第一个值
      this.appConfig.template.basic.tabBar.list.splice(index, step, ...args);
    },
    // 获取老师/学生首页模块配置（小程序首页改版添加）
    getHomeModule() {
      const { userInfo } = useStore('user');
      // moduleJut模块身份 1老师 2学生
      // 角色 // jxlx身份类型 -1, "网站注册账号" 0, "教师" 1, "学生" 2, "家长" 3, "管理员"  99, "访客（未登录）"
      // 如果是老师
      console.log('getHomeModule---userInfo--', userInfo.value);
      console.log('getHomeModule---homeModule--', this.appConfig.template.basic);
      if (userInfo.value.jut === 0 || userInfo.value.jut === 3) {
        return this.appConfig.template.basic.homeTeacherModule || [];
      }
      return this.appConfig.template.basic.homeStudentModule || [];
    },
    // 设置老师/学生首页模块配置（小程序首页改版添加）
    setHomeModule(list: headerModuleType[], moduleJut: number) {
      const { userInfo } = useStore('user');
      // 角色 // jxlx身份类型 -1, "网站注册账号" 0, "教师" 1, "学生" 2, "家长" 3, "管理员"  99, "访客（未登录）"
      // moduleJut模块身份 1老师 2学生
      // 如果是老师
      console.log('setHomeModule---userInfo--', userInfo.value);
      console.log('setHomeModule---homeModule--', this.appConfig.template.basic);
      if (userInfo.value.jut === 0 || userInfo.value.jut === 3) {
        this.appConfig.template.basic.homeTeacherModule = list;
      } else {
        this.appConfig.template.basic.homeStudentModule = list;
      }
    },
    setAppConfig(appinfo: any) {
      this.appConfig = appinfo;
    },
    // 重置用户默认数据
    resetAppConfigData() {
      this.appConfig = cloneDeep(appModuleConfig.defalutAppConfig);
      console.log('resetAppConfigData-----', this.appConfig);
      console.log('resetAppConfigData-----defalutAppConfig---', appModuleConfig.defalutAppConfig);
    },
    // 初始化配置信息
    initStoreAppData() {
      const appConfigData = uni.getStorageSync('appConfig');
      appConfigData && this.setAppConfig(appConfigData);
      console.log('appConfigData---appConfigData----', this.appConfig);
    },
    persist: {
      enabled: true,
      H5Storage: window?.localStorage,
      strategies: [
        {
          storage: window?.localStorage
          // paths: ['userInfo']
        }
      ]
    }
  }
});
export default appConfig;
