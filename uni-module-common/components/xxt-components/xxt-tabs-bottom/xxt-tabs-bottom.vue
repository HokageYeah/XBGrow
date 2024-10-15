<template>
  <view class="tabs-bottom">
    <view
      v-for="(item, index) in tabList"
      :key="item.id"
      class="icon-btn-bg"
      :class="{ 'tui-tabs-disabled': item.disabled }"
      @click="iconClick(item.id, index)"
    >
      <tui-icon
        v-if="isShowImg"
        :custom-prefix="
          current === index
            ? item.selectedIconPath
              ? item.selectedIconPath
              : item.iconPath
            : item.iconPath
        "
        name="iconfont"
        :size="size"
        :color="current === index ? selectedColor : color"
      ></tui-icon>
      <!-- <tui-icon name="about" :size="26"></tui-icon> -->
      <tui-text
        :text="current === index ? (item.activeName ? item.activeName : item.name) : item.name"
        size="26"
        align="center"
        :color="current === index ? selectedColor : color"
      ></tui-text>
    </view>
    <view :style="[{ height: safeBottomHeight }]"></view>
  </view>
</template>

<script setup lang="ts">
interface tabListItem {
  id: number;
  name: string;
  iconPath: string; // icon图片地址
  selectedIconPath?: string; // 选中图片地址
  activeName?: string;
  disabled: boolean;
}

// const props = withDefaults(defineProps<{ activityId: number }>(), {
//   activityId: 0
// });
// current必传
const props = withDefaults(
  defineProps<{
    tabList: tabListItem[];
    selectedColor?: string;
    color?: string;
    current: number;
    size?: number;
    height?: number;
    isShowImg?: boolean;
  }>(),
  {
    tabList: () => [],
    selectedColor: '#4ad975',
    color: '#999999',
    current: 0,
    size: 26,
    height: 0,
    isShowImg: true
  }
);

const emits = defineEmits<{ (e: 'change', value: { index: number }): void }>();
console.log('props-----', props.tabList);
const safeBottomHeight = ref('0px');
// 获取手机系统信息
const systemInfo = uni.getSystemInfoSync();
// 获取底部安全区域的高度
safeBottomHeight.value = `${systemInfo?.safeAreaInsets!.bottom}px`;
const cssHeight = ref(`${props.height + safeBottomHeight.value}px`);
const bgHeight = ref(`${props.height}px`);
const iconClick = (iconId: number, index: number) => {
  console.log('iconId---', iconId);
  const item = props.tabList[index];
  if (item && item.disabled) return;
  if (props.current === index) {
    return false;
  } else {
    emits('change', {
      index: Number(index)
    });
  }
};
</script>

<style scoped lang="scss">
.tabs-bottom {
  width: 100%;
  position: fixed;
  top: calc(100% - v-bind(cssHeight));
  height: v-bind(cssHeight);
  background-color: saddlebrown;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 10px;
}
.icon-btn-bg {
  position: relative;
  width: 100%;
  height: v-bind(bgHeight);
  text-align: center;
  // height: 50px;
  /* background-color: sienna; */
  @include normalFlex(column, space-around);
}
.tui-tabs-disabled {
  opacity: 0.6;
}
</style>
