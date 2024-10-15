// 判断是不是 30    Android众享阅读 31    iOS众享阅读
export const isZxReading = () => {
  const { userAgent } = useStore('user');
  console.log('查看是不是阅读app---大的22-', userAgent);
  const hostId = parseInt(userAgent.value.hostId || '0');
  return [30, 31].includes(hostId);
};

// 判断是不是朗读小程序 测试
export const isXzxReadingUni = () => {
  console.log('查看是不是阅读app---大的22-进入了');
  const { userAgent } = useStore('user');
  console.log('查看是不是阅读app---大的22-', userAgent);
  const hostId = parseInt(userAgent.value.hostId || '0');
  return [101].includes(hostId);
};
