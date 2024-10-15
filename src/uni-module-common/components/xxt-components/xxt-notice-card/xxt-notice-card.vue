<template>
  <view class="notice-card" @click="clickCard">
    <view class="notice-header">
      <view class="notice-type" :style="nTypes[notice.noticeType]">
        {{ notice.noticeTypeShortName }}
      </view>
      <text class="notice-name">{{ notice.noticeTitle }}</text>
    </view>
    <view v-if="notice.destDescribe && props.isSender" class="mt-20 text-ellipsis gray-color">
      发给：{{ notice.destDescribe }}
    </view>
    <view v-if="!props.isSender" class="mt-20 text-ellipsis gray-color">
      来自：{{ notice.senderName }}
    </view>
    <view v-if="notice.feedbackEndDate" class="mt-16" :style="{ color: endTimeColor }">
      截止时间：{{ handleEndTime(notice.feedbackEndDate) }}
    </view>
    <view v-if="notice.content" class="mt-20">
      <xxt-text-overflow :text="notice.content" :clamp="3"></xxt-text-overflow>
    </view>
    <view v-if="notice.attachList?.length" class="mt-16">
      <tui-icon
        custom-prefix="icon-x-tianjiafujian"
        name="iconfont"
        size="16"
        color="#ffac2d"
        style="margin-right: 12rpx"
      ></tui-icon>
      <text v-for="(attach, index) in notice.attachList" :key="index">
        {{ `${attach.fileNum}${attach.fileTypeName} ` }}
      </text>
    </view>
    <tui-row is-flex>
      <tui-col :span="props.noticeStatus === 0 ? 11 : 8">
        <view class="send-time">
          <tui-text
            v-if="notice.sendDate"
            :text="handleSendTime(notice.sendDate)"
            color="#999"
            size="24"
          ></tui-text>
        </view>
      </tui-col>
      <tui-col v-if="props.isSender && props.noticeStatus === 1" :span="16" class="finish-desc">
        <view v-if="notice.feedbackFlag" class="send-time card-name">
          <view style="display: inline-block">
            反馈情况：
            <tui-text
              :text="notice.feedbackNum"
              size="32"
              :color="greenColor"
              font-weight="bold"
            ></tui-text>
            <text :style="{ color: greenColor }">/</text>
            <tui-text
              size="32"
              :text="notice.totalNum"
              :color="greenColor"
              font-weight="bold"
            ></tui-text>
          </view>
        </view>
        <view v-else class="send-time card-name">
          <tui-text text="无需反馈" size="28" color="#999"></tui-text>
        </view>
      </tui-col>
      <tui-col v-if="!props.isSender" :span="props.noticeStatus === 0 ? 13 : 16">
        <view class="stu-btn">
          <button v-if="notice.selfFeedbackFlag" disabled class="disable-btn">
            {{ noticeStatusBtnDesc }}
          </button>
          <button v-else class="normal-btn" @click.stop="clickCardBtn">
            {{ noticeStatusBtnDesc }}
          </button>
        </view>
      </tui-col>
    </tui-row>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Notice } from './notice.ts';
import { initNotice, nTypes, noticeBtn } from './notice';
import utils from '@/uni-module-common/utils';

const props = defineProps({
  // 通知卡片数据
  noticeInfo: {
    type: Object,
    default: () => {}
  },
  // 通知列表编码
  // 教师： 0未发送、1已发送、2已接收
  // 家长/学生 2已接收
  noticeStatus: {
    type: Number,
    default: 0
  },
  // 是否是发送者
  isSender: {
    type: Boolean,
    require: true
  }
});
// 定义点击事件
const emits = defineEmits(['clickNoticeCard', 'clickNoticeCardBtn']);
const notice = ref<Notice>(initNotice);
const greenColor = '#4ad975';

const noticeStatusBtnDesc = computed(() => {
  return notice.value.selfFeedbackFlag
    ? `已${noticeBtn[notice.value.noticeType]}`
    : `去${noticeBtn[notice.value.noticeType]}`;
});
const endTimeColor = computed(() => {
  return '#ff5436';
});
watch(
  () => props.noticeInfo,
  (newV) => {
    notice.value = newV as Notice;
  },
  { immediate: true }
);

const clickCard = () => {
  emits('clickNoticeCard', notice.value);
};
const clickCardBtn = () => {
  emits('clickNoticeCardBtn', {
    type: 'card-btn',
    data: notice.value
  });
};
// 处理截止时间
const handleEndTime = (time: number) => {
  const timeStr = utils.formatTimeWithChinese(time);
  return timeStr;
};
const handleSendTime = (time: number) => {
  let timeStr = utils.formatTimeWithChinese(time);
  if (props.noticeStatus === 0 && props.isSender) {
    // 未开始
    timeStr = `将于${timeStr} 发送`;
  }
  return timeStr;
};
</script>

<style scoped lang="scss">
$number: 16;
.notice-card {
  position: relative;
  padding: 32rpx 32rpx 10rpx;
  border-radius: 16rpx;
  background-color: white;
  font-size: $uni-font-size-base;
  .notice-header {
    display: inline-block !important;
    width: 100%;
    .notice-type {
      padding: 8rpx 12rpx;
      font-size: 24rpx;
      display: inline-block;
      border-radius: 40rpx;
    }
    .notice-name {
      margin-left: 16rpx;
      line-height: 150%;
      font-weight: bold;
      font-size: 28rpx;
    }
  }
  .notice-content {
    display: -webkit-box;
    overflow: hidden; //超出隐藏
    -webkit-line-clamp: 3; //文字行数
    text-overflow: ellipsis; //文字超出省略号
    color: #666;
    -webkit-box-orient: vertical;
  }
  .send-time {
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 12rpx;
  }
  .finish-desc {
    color: #4ad975;
  }
  .card-name {
    justify-content: flex-end;
    color: #4ad975;
  }
  .stu-btn {
    display: flex;
    justify-content: flex-end;
    align-self: center;
    margin-top: 12rpx;
  }
}
.text-ellipsis {
  overflow: hidden; /* 超出隐藏，必须同时设置该项才能生效 */
  text-overflow: ellipsis; /* 超过部分省略号代替 */
  white-space: nowrap !important; /* 强制不换行 */
}
.card-img {
  width: 46rpx;
  height: 46rpx;
}
.normal-btn,
.disable-btn {
  margin-right: 0;
  padding: 0 20rpx;
  border-radius: 50rpx;
  width: 170rpx;
  height: 56rpx;
  line-height: 180%;
  font-size: 28rpx;
  color: white;
}
.normal-btn::after,
.disable-btn::after {
  border: none;
}
.normal-btn {
  background: linear-gradient(90deg, rgb(82, 239, 129), rgb(74, 217, 117));
}
.disable-btn {
  background-color: #ddd;
}
.mt-#{$number} {
  margin-top: #{$number}rpx;
}
.gray-color {
  color: #666;
}
</style>
