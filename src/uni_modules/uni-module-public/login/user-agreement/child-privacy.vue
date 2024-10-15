<template>
  <!-- pages/mine/user-agreement/child-privacy.wxml -->
  <view class="container">
    <web-view :src="src"></web-view>
  </view>
</template>

<script setup lang="ts">
const src = ref('');
// 接受传递过来的参数
onLoad((options: any) => {
  src.value = options.webSrc;
});
</script>

<style scoped lang="scss">
/* pages/mine/user-agreement/child-privacy.wxss */
.container view {
  padding: 0rpx 32rpx;
  font-size: 28rpx;
}
.text-right {
  text-align: right;
}
.text {
  margin-top: 16rpx;
  text-indent: 70rpx;
}
.text-active {
  font-weight: bold;
}
.text-line {
  text-decoration: underline;
}
</style>
