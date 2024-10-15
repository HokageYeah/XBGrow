<template>
  <tui-modal
    :show="show"
    padding="0rpx"
    radius="32rpx"
    custom
    :mask-closable="maskClosable"
    @cancel="emits('update:show', false)"
  >
    <view class="custom-view">
      <view v-if="topImg" class="img-wrapper">
        <image class="custom-img" :src="topImg" mode="aspectFit" />
      </view>
      <view>
        <slot></slot>
      </view>
      <tui-icon
        v-if="isClose"
        class="close-icon"
        name="close-fill"
        :size="28"
        color="#ddd"
        @click="emits('update:show', false)"
      ></tui-icon>
    </view>
  </tui-modal>
</template>

<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  topImg: {
    type: String,
    default: ''
  },
  // 顶部星图是否镜像反转
  starsMirror: {
    type: Boolean,
    default: false
  },
  // 是否有关闭按钮
  isClose: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['update:show']);
</script>

<style scoped lang="scss">
.custom-view {
  position: relative;
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(169, 255, 183, 0.5) 0%, #fff 100%);
  background-repeat: no-repeat;
  background-size: 100% 40%;
  font-size: 14px;
  .img-wrapper {
    display: inline-block;
    position: relative;
    left: 50%;
    margin-top: -90px;
    transform: translateX(-50%);
    .custom-img {
      width: 130px;
      height: 130px;
      // border: 1px solid black;
    }
    .stars-img {
      position: absolute;
      left: -20px;
      bottom: 0;
      width: 180px;
      height: 160px;
      // border: 1px solid brown;
    }
    .stars-img__mirror {
      transform: scaleX(-1);
    }
  }
  .close-icon {
    position: absolute;
    left: 50%;
    bottom: -68px;
    transform: translateX(-50%);
  }
}
</style>
