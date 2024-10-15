<template>
  <view class="notice-detail" :style="notice.noticeType === 7 ? 'padding:16px 16px 80px' : ''">
    <view class="notice-header">
      <view class="notice-type" :style="nTypes[notice.noticeType]">
        {{ notice.noticeTypeShortName }}
      </view>
      <view v-if="notice.noticeTitle" class="notice-name">
        {{ notice.noticeTitle }}
      </view>
      <tui-icon
        v-if="showMoreOpt"
        name="more-fill"
        color="#222"
        :size="16"
        @click="clickMoreOpt"
      ></tui-icon>
    </view>
    <view class="fs-28">
      <view v-if="props.isSender && notice.noticeType === 6" class="mt-16 fs-24" color="#666">
        {{ utils.formatTimeWithChinese(notice.createDate) }}
      </view>
      <view v-else-if="notice?.sendDate" class="mt-16 fs-24" color="#666">
        {{ utils.formatTimeWithChinese(notice.sendDate) }}
      </view>
      <view v-if="notice?.feedbackEndDate" class="mt-16">
        <tui-tag type="light-danger" shape="circle" padding="8rpx 10rpx" size="24rpx">
          截止时间
        </tui-tag>
        <text class="ml-12 fs-24" style="color: #666">{{
          utils.formatTimeWithChinese(notice.feedbackEndDate)
        }}</text>
      </view>
      <view v-if="props.isSender && notice.destDescribe" class="mt-16 mr-50" color="#222">
        发给：{{ notice.destDescribe }}
      </view>
      <view v-if="!props.isSender" class="mt-16 mr-50" color="#222">
        来自：{{ notice.senderName }}
      </view>
    </view>
    <view v-if="notice.content" class="mt-24">
      <xxt-text-overflow
        :text="notice.content"
        :show-hidden-btn="true"
        :default-hide="!props.isSender"
        :clamp="3"
      ></xxt-text-overflow>
    </view>
    <view v-if="notice?.attachList?.length > 0" class="mt-24">
      <attach-preview :attach-list="notice.attachList"></attach-preview>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Notice } from '../xxt-notice-card/notice.ts';
import { initNotice, nTypes } from '../xxt-notice-card/notice';
import attachPreview from '../xxt-task-detail/attach-preview.vue';
import utils from '@/uni-module-common/utils';

const props = defineProps({
  // notice 数据
  noticeInfo: {
    type: Object,
    default: () => {}
  },
  // 是否是发送者
  isSender: {
    type: Boolean,
    require: true
  },
  showMoreOpt: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['clickMoreOpt']);

const notice = ref<Notice>(initNotice);

watch(
  () => props.noticeInfo,
  (newV) => {
    notice.value = newV as Notice;
  },
  { immediate: true }
);

const clickMoreOpt = () => {
  emit('clickMoreOpt', {
    showMoreOpt: true
  });
};
</script>

<style scoped lang="scss">
$number: 24;
.notice-detail {
  padding: 16px;
  background-color: white;
}
.notice-header {
  display: flex;
  align-items: center;
  width: 100%;
  .notice-type {
    padding: 8rpx 12rpx;
    font-size: 24rpx;
    display: inline-block;
    border-radius: 40rpx;
  }
  .notice-name {
    display: inline-block;
    width: 80%;
    margin-left: 16rpx;
    line-height: 150%;
    font-weight: bold;
    font-size: 36rpx;
  }
}

.mt-#{$number} {
  margin-top: #{$number}rpx;
}
.mr-#{$number} {
  margin-right: #{$number}rpx;
}
.ml-#{$number} {
  margin-left: #{$number}rpx;
}
.fs-#{$number} {
  font-size: #{$number}rpx;
}
</style>
