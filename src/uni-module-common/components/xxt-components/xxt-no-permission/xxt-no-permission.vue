<template>
  <view class="container">
    <xxt-empty :tip-image="emptyImg" :tip-message="tipMsg" />
  </view>
</template>

<script setup lang="ts">
import { $cdn } from '@/uni-module-common/config';
const emptyImg = `${$cdn}/nb/m/uni-notice/img/no-permission.png`;
const tipMsg = '功能暂未开放，敬请期待。';
</script>

<style lang="scss" scoped>
.container {
  @include normalContainer();
}
</style>
