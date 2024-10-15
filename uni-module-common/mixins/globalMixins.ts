export default {
  // onBackPress(options: any) {
  //   console.log('h5 common---');
  //   if (options.from === 'backbutton') {
  //     console.log('h5 common button---');
  //     const pages = getCurrentPages();
  //     // const excludePages = ['pages/assign-task/content-form/content-form'];
  //     if (pages && pages.length === 1) {
  //       const page: any = pages[pages.length - 1];
  //       const params = getApp().globalData?.H5ToUniParams as h5ToUniParamsType;
  //       console.log('进入了---', params);
  //       if (!params) {
  //         console.log('进入了哈哈---', params);
  //         // #ifdef APP-PLUS
  //         plus.runtime.quit();
  //         // #endif
  //       } else if (params && typeof params === 'object') {
  //         console.log('进入了--object-');
  //         if (params.taskId || params.tId) {
  //           console.log('进入了--params.taskId -');
  //           // #ifdef APP-PLUS
  //           plus.runtime.quit();
  //           // #endif
  //         } else {
  //           console.log('进入了--true -');
  //           return true;
  //         }
  //       }
  //     }
  //   }
  // }
};
