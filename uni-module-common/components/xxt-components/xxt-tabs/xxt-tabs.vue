<template>
  <view>
    <!-- 顶部导航栏 tabs -->
    <scroll-view
      class="scroll-view-h"
      scroll-x
      :scroll-into-view="`id-${navIndex - 1}`"
      :style="tabsStyle"
      @scroll="scroll"
    >
      <slot name="tabs">
        <view
          v-for="(tab, index) in tabs"
          :id="`id-${index}`"
          :key="tab.id"
          class="scroll-view-item-h"
          :class="navIndex === index ? 'activite' : ''"
          @tap="checkIndex(index)"
        >
          {{ tab.name }}
          <view class="tab-tip"></view>
        </view>
      </slot>
    </scroll-view>

    <!-- 内容 tab -->
    <swiper v-if="slidingSwitchFlag" :current="navIndex" class="tab-content" @change="tabChange">
      <swiper-item v-for="(tab, index) in tabs" :key="tab.id" class="swiper-item">
        <slot name="tab">{{ `${index} - ${tab.name}` }}</slot>
      </swiper-item>
    </swiper>
    <view v-else>
      <slot name="tab"><view class="empty-view">暂无数据</view></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';

interface tabListItem {
  id: string | number;
  name: string;
}

const props = defineProps({
  // tabs 数据
  tabList: {
    type: Array<tabListItem>,
    default: () => []
  },
  // 选中 tab 索引
  idx: {
    type: Number,
    default: 0
  },
  // 是否开启左右滑动切换 tab
  slidingSwitchFlag: {
    type: Boolean,
    default: false
  },
  tabsStyle: {
    type: Object,
    default: () => {}
  }
});
// 定义 更新idx事件
const emits = defineEmits(['update:idx']);

const scrollTop = ref(0);
const navIndex = computed({
  // getter
  get() {
    return props.idx;
  },
  // setter
  set(newV) {
    // 更新父组件 idx 值
    emits('update:idx', newV);
  }
});
const tabs = ref<tabListItem[]>([]);

watch(
  () => props.tabList,
  (newV) => {
    tabs.value = newV;
  },
  { immediate: true }
);

const checkIndex = (index: number) => {
  navIndex.value = index;
};
const scroll = (e: any) => {
  scrollTop.value = e.detail.scrollTop;
};
// 滑动切换swiper
const tabChange = (e: any) => {
  const navIdx = e.detail.current;
  navIndex.value = navIdx;
};
</script>

<style scoped lang="scss">
.activite {
  color: #4ad975;
}
.tab-content {
  color: #333;
}
.scroll-view-h {
  width: 100%;
  color: #333;
  white-space: nowrap;
}
.scroll-view-item-h {
  display: inline-block;
  padding: 16px 0;
  width: 20%;
  height: 50rpx;
  line-height: 55rpx;
  text-align: center;
  font-size: 32rpx;
}
.activite .tab-tip {
  margin: 0 auto;
  border-radius: 5px;
  width: 20px;
  height: 4px;
  background-color: #4ad975;
}
.empty-view {
  padding-top: 40px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
