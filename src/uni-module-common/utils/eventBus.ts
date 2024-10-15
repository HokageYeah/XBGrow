export class EventBus {
  task: Record<string, Function[]> = {};
  constructor() {
    this.task = {};
  }

  on(type: string, listener: Function) {
    // 注册事件
    if (!this.task[type]) this.task[type] = [];
    this.task[type].push(listener);
    console.log('testEventBus-----on---', type, listener, this.task);
    console.log('testEventBus-----ontask---', this.task);
  }

  emit(type: string, ...args: any[]) {
    console.log('testEventBus-----emit---', type, args);
    if (this.task[type]) {
      this.task[type].forEach((listener) => {
        listener.apply(this, args);
      });
    }
    console.log('testEventBus-----emittask---', this.task);
  }

  off(type: string, listener?: Function) {
    // 删除事件
    if (this.task[type]) {
      if (!listener) {
        this.task[type] = [];
        return;
      }
      this.task[type] = this.task[type].filter((item) => item !== listener);
    }
  }

  clear() {
    this.task = {};
  }

  once(type: string, listener: Function) {
    // 只执行一次
    const onceListener = (...args: []) => {
      listener.apply(this, args);
      this.off(type, onceListener);
    };
    this.on(type, onceListener);
  }
}
const event = new EventBus();

export default event;
