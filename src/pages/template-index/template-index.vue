<template>
  <!-- <xxt-layout tabbar="/pages/template-index/template-index"> -->
  <view class="content tui-skeleton">
    <image class="logo tui-skeleton-rect" src="/static/logo.png" />
    <view class="text-area tui-skeleton-rect">
      <text class="title tui-skeleton-rect">{{ title }}</text>
    </view>
  </view>
  <xxt-skeleton :skeleton-show="skeletonShow" :is-list="false"></xxt-skeleton>
  <!-- </xxt-layout> -->
</template>

<script setup lang="ts">
const title = ref('Hello');
interface testtype {
  a: number;
  [key: string]: any;
}
const haha = 12;
const a1 = '10';
const props: testtype = {
  a: 1,
  b: 12
};

console.log(props, a1, haha);
const skeletonShow = ref(true);
onLoad(() => {
  // 模拟
  setTimeout(() => {
    skeletonShow.value = false;
  }, 2000);
});
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logo {
  margin-left: auto;
  margin-right: auto;
  margin-top: 200rpx;
  margin-bottom: 50rpx;
  width: 200rpx;
  height: 200rpx;
}
.text-area {
  display: flex;
  justify-content: center;
}
.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
