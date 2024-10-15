<template>
  <view v-if="props.text" class="xxt-text-overflow">
    <!-- 注: 此处展示文本内容 -->
    <tui-overflow-hidden
      id="hiddenView"
      ref="hiddenView"
      size="28"
      :line-clamp="showAllText ? '' : props.clamp"
      style="white-space: pre-line"
    >
      <slot name="firstSlot"></slot>
      <text>{{ props.text }}</text>
    </tui-overflow-hidden>
    <!-- 此处用于展示超出文本省略的样式，用于获取高度判断是否展示「收起/展开」按钮 -->
    <tui-overflow-hidden
      v-if="showHiddenExample"
      id="hiddenExampleView"
      ref="hiddenExampleView"
      size="28"
      line-clamp=""
      style="visibility: hidden; font-size: 28rpx; white-space: pre-line"
    >
      <slot name="firstSlot"></slot>
      <text>{{ props.text }}</text>
    </tui-overflow-hidden>
    <slot
      name="default"
      :show-all-text="showAllText"
      :click-switch="clickHiddenBtn"
      :overflow-hidden-flag="overflowHiddenFlag"
    ></slot>
    <view
      v-if="props.showHiddenBtn && overflowHiddenFlag"
      style="text-align: center"
      @click="clickHiddenBtn"
    >
      <tui-text :text="showAllText ? '收起详情' : '展开详情'" type="success" size="28"></tui-text>
      <tui-icon :name="showAllText ? 'arrowup' : 'arrowdown'" color="#4ad975" size="16"></tui-icon>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
  // 文本数据
  text: {
    type: String,
    default: ''
  },
  // 是否有收起/展示按钮
  showHiddenBtn: {
    type: Boolean,
    default: false
  },
  // 超过几行隐藏数据
  clamp: {
    type: Number,
    default: 1
  },
  // 是否默认隐藏
  defaultHide: {
    type: Boolean,
    default: false
  },
  // 是否有插槽
  hasSlot: {
    type: Boolean,
    default: false
  }
});
const showAllText = ref(false);
const hiddenView = ref();
const overflowHiddenFlag = ref(false);
const hiddenExampleView = ref();
const showHiddenExample = ref(false);
const instance = getCurrentInstance();

const handleDefaultShow = () => {
  setTimeout(() => {
    const query = uni.createSelectorQuery().in(instance);
    let height = 0;
    let hiddenHeight = 0;
    query
      .select('#hiddenView')
      .boundingClientRect((data) => {
        height = data?.height;
      })
      .exec();
    const query1 = uni.createSelectorQuery().in(instance);
    query1
      .select('#hiddenExampleView')
      .boundingClientRect((data1) => {
        hiddenHeight = data1?.height;
        overflowHiddenFlag.value = height < hiddenHeight;
        console.log('overflowHiddenFlag---', overflowHiddenFlag.value);
        nextTick(() => {
          if (props.defaultHide) {
            showAllText.value = true;
          }
          showHiddenExample.value = false;
        });
      })
      .exec();
  }, 40);
};

watch(
  () => props.text,
  (newV) => {
    if (newV) {
      if ((props.showHiddenBtn || props.hasSlot) && !showAllText.value) {
        showHiddenExample.value = true;
        handleDefaultShow();
      }
    }
  },
  { immediate: true }
);

const clickHiddenBtn = () => {
  showAllText.value = !showAllText.value;
};
</script>

<style scoped lang="scss">
$num: 3;
.text-overflow-#{$num} {
  display: -webkit-box;
  overflow: hidden; //超出隐藏
  -webkit-line-clamp: $num; //文字行数
  text-overflow: ellipsis; //文字超出省略号
  -webkit-box-orient: vertical;
}
</style>
