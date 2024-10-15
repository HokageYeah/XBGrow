import type { Router } from 'uni-mini-router';
import { createRouter } from 'uni-mini-router';

export const setupRouter = (app: { use: (arg0: Router) => void }) => {
  const router = createRouter({
    routes: [...ROUTES] // 路由表信息
  });
  // router.beforeEach((to, from, next) => {
  //   // TODO something
  //   // const { userInfo } = useStore('user');

  //   // 必须执行 next() 否则路由不会继续向下执行
  //   // next 函数需要传递一个 boolean 值参数
  //   // 不传参时默认为 true，路由会继续执行跳转。
  //   // 参数为 false 时禁止跳转，并在 error 回调中抛出异常
  //   // next(true)
  //   console.log('router----beforeEach-----', to, from);
  //   if (to.path === '/pages/mine/contact-us/contact-us') {
  //     console.log('router----beforeEach-----跳转');
  //     // next('/pages/mine/setting/setting');
  //     // next('/uni_modules/xxt-notice-uni/pages/no-permission/index');
  //   } else {
  //     next();
  //   }

  //   // 禁止跳转
  //   // next(false)
  // });
  // router.afterEach((to, from) => {
  //   // TODO something
  //   console.log('router----afterEach-----', to, from);
  // });
  app.use(router);
};
