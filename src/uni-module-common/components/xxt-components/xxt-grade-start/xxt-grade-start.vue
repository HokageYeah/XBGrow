<template>
  <view
    class="grade-start"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      marginTop: `${marginTop}px`
    }"
  >
    <view class="inactive-star normal-style">
      <image
        v-for="i in quantity"
        :key="i"
        :src="inactiveStarImage"
        :style="{
          width: `${startWidth}px`,
          height: `${startHeight}px`,
          marginRight: `${i === quantity ? 0 : space}px`,
          flexShrink: 0,
          flexGrow: 0
        }"
        mode="scaleToFill"
        @click="clickStar(i)"
      />
    </view>
    <view
      class="active-star normal-style"
      :style="{ height: `${startHeight}px`, width: startWidthFunc() }"
    >
      <image
        v-for="i in quantity"
        :key="i"
        :src="activeStarImage"
        :style="{
          width: `${startWidth}px`,
          height: `${startHeight}px`,
          marginRight: `${i === quantity ? 0 : space}px`,
          flexShrink: 0,
          flexGrow: 0,
          zIndex: 8
        }"
        mode="scaleToFill"
        @click="clickStar(i)"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { $cdn } from '@/uni-module-common/config';
const props = withDefaults(
  defineProps<{
    score?: number; // 当前评分，支持小数 只支持0-5， 如果数据不是请转换为0-5的评分小数
    disabled?: boolean; // 是否禁用点击
    quantity?: number; // 星星数量，默认5
    activeStarImage?: string; // 选中星星图片
    inactiveStarImage?: string; // 未选中星星图片
    startWidth?: number; // 星星宽度
    startHeight?: number; // 星星高度
    space?: number; // 星星间距
    width?: number; // 整体宽度
    height?: number; // 整体高度
    marginTop?: number; // 整体上边距
  }>(),
  {
    score: 0,
    disabled: true,
    quantity: 5,
    activeStarImage: `${$cdn}/nb/m/uni-zhyd/img/books_yellow_start.png`,
    inactiveStarImage: `${$cdn}/nb/m/uni-zhyd/img/books_grey_start.png`,
    startWidth: 16,
    startHeight: 16,
    space: 6,
    width: 104,
    height: 16,
    marginTop: 8
  }
);
const emits = defineEmits<{
  (e: 'update:score', i: number): void;
  (e: 'clickStar', i: number): void;
}>();
const startWidthFunc = () => {
  let zheng = Math.floor(props.score) === props.score ? props.score - 1 : Math.floor(props.score);
  zheng = zheng === -1 ? 0 : zheng;
  // 最大是5
  zheng = Math.min(4, zheng);
  return `${props.startWidth * Math.min(5, props.score) + zheng * props.space}px`;
};
const clickStar = (i: number) => {
  if (props.disabled) return;
  console.log('clickStar', i);
  emits('update:score', i);
  emits('clickStar', i);
};
</script>

<style scoped lang="scss">
.grade-start {
  /* background-color: aqua; */
  position: relative;
}
.normal-style {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}
/* .active-star {
  background-color: red;
} */
.inactive-star {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}
</style>
