<template>
  <view class="icon-btn-bg" @click="iconClick">
    <tui-icon :custom-prefix="iconObj.icon" name="iconfont" size="26"></tui-icon>
    <tui-text :text="iconObj.name" size="26" align="center" color="#999999"></tui-text>
    <text v-if="isMustFile" class="icon-btn-bg-text">必交</text>
  </view>
</template>

<script setup lang="ts">
import type { iconType } from './xxtFileType';

const props = withDefaults(
  defineProps<{
    iconObj: iconType;
    isMustFile?: boolean;
  }>(),
  {
    iconObj: (): iconType => {
      return {
        name: '',
        type: 0,
        icon: ''
      };
    },
    isMustFile: false
  }
);
// TS写法
const emits = defineEmits<{
  (e: 'iconClick', selectIcon: number): void;
}>();
const iconClick = () => {
  emits('iconClick', props.iconObj.type);
};
</script>

<style scoped lang="scss">
.icon-btn-bg {
  position: relative;
  width: 50px;
  // height: 50px;
  /* background-color: sienna; */
  @include normalFlex(column);
  &-text {
    background-color: #ff5436;
    font-size: 10px;
    color: #ffffff;
    border-radius: 4px;
    position: absolute;
    padding: 2px;
    right: 0px;
    top: -3px;
  }
}
</style>
