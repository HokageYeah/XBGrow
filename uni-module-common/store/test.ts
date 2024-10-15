const test = defineStore({
  id: 'test',
  state: () => ({
    count: 888,
    insertCount: '2'
  }),
  actions: {
    increment() {
      this.count++;
    },
    incrementCount() {
      this.insertCount += '3';
    }
  }
});

export default test;
