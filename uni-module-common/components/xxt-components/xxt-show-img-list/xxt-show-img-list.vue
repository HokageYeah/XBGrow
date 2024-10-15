<template>
  <view class="img-list">
    <tui-icon
      name="arrowleft"
      :color="noPreImg ? '#ccc' : '#222'"
      :size="48"
      unit="rpx"
      @click="preClick"
    ></tui-icon>
    <scroll-view class="img-list-view" scroll-x :scroll-left="imgTrans">
      <view
        v-for="(item, index) in props.imgList"
        :key="index"
        class="img-list-item"
        :style="{
          width: `${props.imgWidth}px`
        }"
      >
        <view class="img-list-item-img" :class="{ active: index === currentIdx }">
          <image
            :src="item.filePath"
            :style="{
              width: `${props.imgWidth}px`
            }"
            mode="widthFix"
            @click="onClick(index)"
          />
        </view>
      </view>
    </scroll-view>
    <tui-icon
      name="arrowright"
      :color="noNextImg ? '#ccc' : '#222'"
      :size="48"
      unit="rpx"
      @click="nextClick"
    ></tui-icon>
  </view>
</template>

<script setup lang="ts">
import type { File } from '../xxt-notice-card/notice';
const props = defineProps({
  imgList: {
    type: Array<File>,
    default: () => []
  },
  imgWidth: {
    type: Number,
    default: 60
  }
});
const emit = defineEmits(['clickImg']);
const currentIdx = ref(0);

const noPreImg = computed(() => {
  return currentIdx.value === 0;
});
const noNextImg = computed(() => {
  return currentIdx.value === props.imgList.length - 1;
});
const imgTrans = computed(() => {
  return currentIdx.value > 2 ? (currentIdx.value - 2) * props.imgWidth : 0;
});

const preClick = () => {
  if (noPreImg.value) {
    return;
  }
  currentIdx.value -= 1;
  emit('clickImg', props.imgList[currentIdx.value]);
};
const onClick = (idx: number) => {
  currentIdx.value = idx;
  emit('clickImg', props.imgList[idx]);
};
const nextClick = () => {
  if (noNextImg.value) {
    return;
  }
  currentIdx.value += 1;
  emit('clickImg', props.imgList[currentIdx.value]);
};
</script>

<style lang="scss" scoped>
.img-list {
  padding: 32rpx;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-view {
    width: 600rpx;
    display: inline-block;
    overflow-x: auto;
    white-space: nowrap;
  }
  &-item {
    display: inline-block;
    margin-left: 16rpx;
    min-height: 185rpx;
    background-color: white;
    // 垂直居中
    position: relative;
    &-img {
      position: absolute;
      top: 51%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.active {
  border: 4rpx solid #4ad975;
}
</style>
