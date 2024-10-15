<template>
  <tui-skeleton
    v-if="skeletonShow"
    :preload-data="preloadData"
    background-color="white"
  ></tui-skeleton>
  <view v-if="!isList" class="skele-bgview tui-skeleton">
    <view class="skele-bgview-title tui-skeleton-rect"></view>
    <view class="skele-bgview-title">
      <text class="skele-bgview-title-name tui-skeleton-rect"></text>
      <text class="skele-bgview-title-name skele-bgview-title-time tui-skeleton-rect"></text>
    </view>
    <view class="skele-bgview-title">
      <text class="skele-bgview-title-name skele-bgview-title-time tui-skeleton-rect"></text>
      <text class="skele-bgview-title-name skele-bgview-title-time tui-skeleton-rect"></text>
    </view>
    <view v-for="item in 6" :key="item" class="skele-bgview-context tui-skeleton-rect" />
  </view>
  <view v-for="item1 in 3" v-else :key="item1" class="skele-bgview tui-skeleton">
    <view class="skele-bgview-title tui-skeleton-rect"></view>
    <view class="skele-bgview-title">
      <text class="skele-bgview-title-name tui-skeleton-rect"></text>
      <text class="skele-bgview-title-name skele-bgview-title-time tui-skeleton-rect"></text>
    </view>
    <view class="skele-bgview-title">
      <text class="skele-bgview-title-name skele-bgview-title-time tui-skeleton-rect"></text>
      <text class="skele-bgview-title-name skele-bgview-title-time tui-skeleton-rect"></text>
    </view>
    <view v-for="item in 3" :key="item" class="skele-bgview-context tui-skeleton-rect" />
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isList: boolean;
    skeletonShow: boolean;
  }>(),
  {
    skeletonShow: false,
    isList: false
  }
);

const preloadData = ref();
// #ifdef MP-WEIXIN
// 在微信中拿不到节点信息，此处手动塞一个默认值
preloadData.value = [
  {
    id: '',
    dataset: {},
    left: 10,
    right: 365,
    top: 20,
    bottom: 40,
    width: 355,
    height: 20,
    skeletonType: 'rect'
  },
  {
    id: '',
    dataset: {},
    left: 10,
    right: 365,
    top: 50,
    bottom: 70,
    width: 355,
    height: 20,
    skeletonType: 'rect'
  },
  {
    id: '',
    dataset: {},
    left: 10,
    right: 365,
    top: 100,
    bottom: 120,
    width: 355,
    height: 20,
    skeletonType: 'rect'
  },
  {
    id: '',
    dataset: {},
    left: 10,
    right: 365,
    top: 130,
    bottom: 150,
    width: 355,
    height: 20,
    skeletonType: 'rect'
  }
];
// #endif
</script>

<style scoped lang="scss">
.skele-bgview {
  padding: 16px;
  background-color: white;
  &-title {
    margin: 0 0 6px;
    width: 150px;
    height: 18px;
    &-name {
      display: inline-block;
      margin-right: 10px;
      width: 32px;
      height: 16px;
    }
    &-time {
      width: 44px;
    }
  }
  &-context {
    margin-bottom: 4px;
    width: 100%;
    height: 16px;
  }
}
</style>
