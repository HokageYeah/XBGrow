// 参考：https://blog.csdn.net/m0_57033755/article/details/132871892
import log from './log';

const routerFunList = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];
routerFunList.forEach((item) => {
  // 用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
  uni.addInterceptor(item, {
    invoke(e) {
      // 调用前拦截
      // 获取用户的token
      const url = e.url;
      console.log('url----e---', e);
      const pages = getCurrentPages();
      // const prevPage = pages[pages.length - 2]; // 更改的地方 来源页面
      const prevPage: any = pages[pages.length - 1];
      const prevUrl = prevPage?.$page.fullPath || '';
      console.log('url----', url, 'prevUrl----', prevUrl, 'prevPage---', prevPage);
      log.view(url, prevUrl);
      // log.event(url, 'uniapp测试测试测试', '');

      return true;
    },
    fail() {
      // 失败回调拦截
    }
  });
});
