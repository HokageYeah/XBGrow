import type { AjaxConfigType, AjaxInstance } from 'uni-ajax';
import { createSSRApp } from 'vue';
import { setupPinia } from './uni-module-common/store';
import { setupRouter } from './uni-module-common/router';
import App from './App.vue';
import 'uno.css';
import { $cdn } from './uni-module-common/config';
import ajax from '@/uni-module-common/http';
import './uni-module-common/utils/interceptor';
import globalMixin from '@/uni-module-common/mixins/globalMixins';
import type { EventBus } from '@/uni-module-common/utils/eventBus';
import eventBus from '@/uni-module-common/utils/eventBus';
export function createApp() {
  const app = createSSRApp(App);
  // 注册pinia
  setupPinia(app);
  // 注册路由
  setupRouter(app);
  // 添加全局的mixin混入
  app.mixin(globalMixin);
  // 全局请求实例挂在到实例身上
  app.config.globalProperties.$uniAjax = ajax;
  app.config.globalProperties.$cdn = $cdn;
  app.config.globalProperties.$eventBus = eventBus;
  return {
    app
  };
}

// 编写ts loading 声明文件放置报错 和 智能提示
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $uniAjax: AjaxInstance<AjaxConfigType>;
    $cdn: string;
    $eventBus: EventBus;
  }
}
