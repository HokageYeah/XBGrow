<template>
  <view class="page-app">
    <view class="page-main">
      <view class="page-body">
        <slot />
        <!-- 底部导航 只有不是app中才有导航 -->
        <!-- #ifndef APP-PLUS || APP -->
        <!-- <xxt-tabbar v-if="tabbar !== ''" :path="tabbar" /> -->
        <!-- #endif -->
        <!-- app内也可以有导航只要有tabbar就显示导航 -->
        <xxt-tabbar v-if="tabbar !== ''" :path="tabbar" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    tabbar: string | boolean;
    leftWidth?: number | string;
    rightWidth?: number | string;
  }>(),
  {
    tabbar: '',
    leftWidth: 100,
    rightWidth: 100
  }
);
</script>

<style lang="scss" scoped>
.page-app {
  position: relative;
  color: var(--ui-TC);
  background-color: var(--ui-BG-1) !important;
  /* background-color: yellow; */
  z-index: 2;
  display: flex;
  width: 100%;
  height: 100vh;

  .page-main {
    position: absolute;
    z-index: 1;
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;

    .page-body {
      width: 100%;
      position: relative;
      z-index: 1;
      flex: 1;
    }

    .page-img {
      width: 100vw;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
  }
}
</style>
