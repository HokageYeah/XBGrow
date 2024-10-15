const uniShowToast = (title: string, time = 2000, mask = true) => {
  uni.showToast({
    title,
    mask,
    duration: time,
    icon: 'none',
    fail: () => {
      uni.hideToast();
    }
  });
};
export { uniShowToast };
