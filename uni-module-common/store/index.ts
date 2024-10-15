import type { Pinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist-uni';

// 自动注入所有的pinia模块
const files: any = import.meta.glob('./modules/**/*.ts', { eager: true });
const modules: any = {};
Object.keys(files).forEach((key) => {
  modules[key.replace(/(.*\/)*([^.]+).*/gi, '$2')] = files[key].default;
});
const store = createPinia();
export const setupPinia = (app: { use: (arg0: Pinia) => void }) => {
  // const store = createPinia();
  store.use(piniaPluginPersist);
  app.use(store);
};
export default store;
export function $store(name: string) {
  return modules[name]();
}
