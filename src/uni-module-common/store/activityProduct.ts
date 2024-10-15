export interface ActivityParams {
  [key: string]: any;
}

const activityProduct = defineStore({
  id: 'activityProduct',
  state: () => ({
    activityParams: {} // 地址信息
  }),
  actions: {
    setActivityParams(params: ActivityParams) {
      this.activityParams = params;
    },
    clearAddress() {
      this.activityParams = {};
    }
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
});

export default activityProduct;
