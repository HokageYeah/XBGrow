<template>
  <xxt-skeleton
    v-if="(!resultList || resultList.length < 1) && !finished && wholePage"
    style="margin-top: 60px"
    :skeleton-show="(!resultList || resultList.length < 1) && !finished && wholePage"
    :is-list="true"
  ></xxt-skeleton>
  <xxt-empty
    v-if="(!resultList || resultList.length < 1) && finished"
    :tip-image="emptyImg"
    tip-message="暂无内容"
  />
  <scroll-view
    v-if="resultList && resultList.length > 0 && wholePage"
    ref="scrollView"
    class="act-scroll-view"
    lower-threshold="100"
    scroll-top="10"
    scroll-y
    :refresher-enabled="wholePage"
    :refresher-triggered="trigger"
    :style="{
      position: 'absolute',
      height: scrollViewHeight
    }"
    @refresherrefresh="refresherrefresh"
    @scrolltolower="onLoadNotice"
  >
    <ActivityInfoCell :result-list="resultList" />
    <tui-nomore v-if="wholePage" :text="noMore ? '没有更多了' : '加载中...'"></tui-nomore>
  </scroll-view>
  <view v-else style="margin-top: 30rpx">
    <ActivityInfoCell :result-list="resultList" />
  </view>
</template>

<script setup lang="ts">
import ActivityInfoCell from './activity-info-cell.vue';
import { $cdn } from '@/uni-module-common/config';
const props = withDefaults(
  defineProps<{ activityId: number; pageSize: number; postUrl: string; wholePage: boolean }>(),
  {
    activityId: 0, // 活动id
    pageSize: 10, // 每页条数
    postUrl: '', // 请求地址
    wholePage: false // 是否是作为整个页面展示
  }
);
const emits = defineEmits<{
  (event: 'haveMoreActInfo', value: boolean): void;
}>();
const instance = getCurrentInstance();
const searchParam = {
  totalRow: 0,
  current: 1,
  pageSize: 10,
  search: {
    activityId: 0
  },
  filter: {},
  sorter: {}
};
const resultList = ref<any>([]);
const finished = ref(false);
const trigger = ref(false);
const noMore = ref(false);
// 空列表切图
const emptyImg = `${$cdn}/nb/m/uni-notice/img/empty.png`;
const getActInfoList = async () => {
  const url = props.postUrl || '/user-activity2/activity/get-activity-news';
  searchParam.pageSize = props.pageSize;
  searchParam.search.activityId = props.activityId;
  noMore.value = false;
  finished.value = false;
  searchParam.current === 1 && (resultList.value = []);
  setTimeout(async () => {
    const res: any = await instance?.proxy?.$uniAjax.post({
      url,
      data: searchParam
    });
    finished.value = true;
    if (res && res.resultList) {
      resultList.value = [...resultList.value, ...res.resultList];
      console.log('一空多少条数据----', resultList.value.length);
      searchParam.totalRow = res.totalRow;

      // 没有更多时
      if (!res || res.resultList.length === 0 || resultList.value.length >= res.totalRow) {
        noMore.value = true;
      }
      if (!props.wholePage) {
        // 作为组件展示，且 totalRow 大于 pageSize 时，显示更多按钮
        if (res.totalRow > props.pageSize) {
          emits('haveMoreActInfo', true);
          noMore.value = false;
        }
      }
    } else {
      resultList.value = [];
      searchParam.totalRow = 0;
    }
  }, 2000);
};
const scrollViewHeight = computed(() => {
  // 上拉加载时存在页面滚动的情况，导致列表上翻时最顶部内容被隐藏，计算 scrollView 高度
  let height;
  height = 'calc(100vh - 76rpx)';
  // #ifdef MP-WEIXIN
  height = 'calc(100vh - 76rpx - 100rpx)';
  // #endif
  return height;
});
const refreshPage = async (stopRefresh: boolean) => {
  searchParam.current = 1;
  await getActInfoList();
  if (stopRefresh) {
    // 关闭下拉刷新动画
    if (!trigger.value) {
      uni.stopPullDownRefresh();
    }
    trigger.value = false;
  }
};
// scroll-view 下拉刷新
const refresherrefresh = () => {
  console.log('refresherrefresh');
  trigger.value = true;
  refreshPage(true); // 调用你的方法
  // 上拉加载时存在页面滚动的情况，导致列表上翻时最顶部内容被隐藏，此处强制返回到页面顶部
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 100
  });
};
// 监听下拉动作
onPullDownRefresh(() => {
  console.log('onPullDownRefresh');
});
// 上拉加载
const onLoadNotice = () => {
  console.log('onLoadNotice');
  if (resultList.value.length < searchParam.totalRow) {
    searchParam.current += 1;
    getActInfoList();
  } else {
    noMore.value = true;
  }
};
onMounted(() => {
  getActInfoList();
});
console.log('props.activityId---', props.activityId);
</script>

<style scoped lang="scss">
.act-scroll-view {
  padding: 16px;
  box-sizing: border-box;
}
</style>
