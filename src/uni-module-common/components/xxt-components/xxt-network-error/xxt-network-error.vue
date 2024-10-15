<template>
  <view class="network-error-bgview clearfix">
    <image
      class="network-error-bgview-image"
      lazy-load
      mode="aspectFit"
      :src="`${$cdn}/nb/m/uni-task-center/img/network-error.png`"
    />
    <view class="network-error-bgview-text">您的手机网络不太顺畅哦</view>
    <button
      class="network-error-bgview-btn"
      size="mini"
      :plain="true"
      @click="() => emits('reloadClick')"
    >
      重新加载
    </button>
  </view>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: 'reloadClick'): void;
}>();
</script>

<style scoped lang="scss">
.network-error-bgview {
  height: 100%;
  background-color: #f9f9f9;
  text-align: center;
  &-image {
    display: block;
    margin: auto;
    margin-top: 40px;
    width: 200px;
    height: 200px;
  }
  &-text {
    margin-top: 16px;
    font-size: 14px;
    color: #999;
  }
  &-btn {
    margin-top: 16px;
    border: 1px solid #ffb700;
    border-radius: 22px;
    width: 120px;
    height: 44px;
    line-height: 44px;
    vertical-align: baseline;
    font-size: 14px;
    color: #666;
  }
}
.clearfix::before {
  display: table;
  content: '';
}
</style>
