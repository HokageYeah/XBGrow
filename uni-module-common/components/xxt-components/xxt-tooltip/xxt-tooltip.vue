<template>
  <view class="xxt-tooltip">
    <slot></slot>
    <view v-if="content || $slots.content" class="xxt-tooltip-popup" :style="initPlacement">
      <slot name="content">
        {{ content }}
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  placement: {
    type: String,
    default: 'left'
  },
  noWrap: {
    type: Boolean,
    default: false
  }
});
const initPlacement = computed(() => {
  let style = {};
  switch (props.placement) {
    case 'left':
      style = {
        top: '50%',
        transform: 'translateY(-50%)',
        right: '100%',
        'margin-right': '10rpx',
        whiteSpace: props.noWrap ? 'nowrap' : ''
      };
      break;
    case 'right':
      style = {
        top: '50%',
        transform: 'translateY(-50%)',
        left: '100%',
        'margin-left': '10rpx',
        whiteSpace: props.noWrap ? 'nowrap' : ''
      };
      break;
    case 'top':
      style = {
        bottom: '100%',
        transform: 'translateX(-50%)',
        left: '50%',
        'margin-bottom': '10rpx',
        whiteSpace: props.noWrap ? 'nowrap' : ''
      };
      break;
    case 'bottom':
      style = {
        top: '100%',
        transform: 'translateX(-50%)',
        left: '50%',
        'margin-top': '10rpx',
        whiteSpace: props.noWrap ? 'nowrap' : ''
      };
      break;
  }
  return style;
});
</script>

<style lang="scss" scoped>
.xxt-tooltip {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.xxt-tooltip-popup {
  z-index: 1;
  display: none;
  position: absolute;
  background-color: #333;
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  text-align: left;
  line-height: 16px;
  padding: 12px;
  overflow: auto;
  width: fit-content;
}

.xxt-tooltip:hover .xxt-tooltip-popup {
  display: block;
}
</style>
