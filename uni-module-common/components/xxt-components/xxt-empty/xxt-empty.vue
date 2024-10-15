<template>
  <view class="empty">
    <view>
      <image
        class="empty-tip-image"
        mode="widthFix"
        lazy-load
        :src="props.tipImage || 'https://static.xxt.cn/nb/gll/common/img/empty.png'"
      >
      </image>
    </view>

    <view
      v-if="!$slots.tipMessage"
      class="tip-message"
      v-html="props.tipMessage || '暂无资源'"
    ></view>
    <view v-else>
      <slot name="tipMessage"></slot>
    </view>

    <slot class="btn-slot" />
  </view>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps({
  tipMessage: {
    type: String,
    default: '暂无资源'
  },
  tipImage: {
    type: String,
    default: ''
  }
});
</script>

<style scoped lang="scss">
.empty {
  padding: 70px 0 0;
  text-align: center;
}
.tip-message {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 14px;
  color: #666;
}
.btn-slot {
  margin-bottom: 20px;
}
.empty-tip-image {
  width: 149px;
}
</style>
