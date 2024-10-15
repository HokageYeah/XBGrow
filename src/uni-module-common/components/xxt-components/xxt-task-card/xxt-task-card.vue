<template>
  <view class="task-card" @click="clickCard">
    <view class="task-header" :style="showPingIcon ? 'width: 90%' : ''">
      <tui-tag type="light-green" shape="circle" padding="2rpx 18rpx">
        {{ taskTypeMap.get(task.taskType) }}
      </tui-tag>
      <text class="task-name">{{ task.taskName }}</text>
    </view>
    <view v-if="showPingIcon" class="ping-icon">
      <image v-if="task.excellentFlag" :src="excellent" mode="aspectFill" class="card-img"></image>
      <image
        v-else-if="task.commentFlag"
        :src="commented"
        mode="aspectFill"
        class="card-img"
      ></image>
    </view>
    <view v-if="task.destDescribe && props.isTeacher" class="mt-16 text-ellipsis">
      发给：{{ task.destDescribe }}
    </view>
    <view v-if="!props.isTeacher" class="mt-16 text-ellipsis">来自：{{ task.userName }}</view>
    <view v-if="task.endDate" class="mt-16" :style="{ color: endTimeColor }">{{
      handleEndTime(task.endDate)
    }}</view>
    <view v-if="task.taskContent" class="mt-16">
      <xxt-text-overflow :text="task.taskContent" :clamp="3"></xxt-text-overflow>
    </view>
    <view v-if="task.attachFlag" class="mt-16">
      <tui-icon
        custom-prefix="icon-x-tianjiafujian"
        name="iconfont"
        size="16"
        color="#ffac2d"
        style="margin-right: 12rpx"
      ></tui-icon>
      <text v-for="(attach, index) in task.attachList" :key="index">
        {{ `${attach.fileNum}${attach.fileTypeName} ` }}
      </text>
    </view>
    <tui-row is-flex>
      <tui-col :span="props.taskStatus === 0 ? 11 : 10">
        <view class="send-time">
          <tui-text v-if="task.sendDate" :text="handleSendTime(task.sendDate)" size="24"></tui-text>
        </view>
      </tui-col>
      <tui-col v-if="props.isTeacher" :span="props.taskStatus === 0 ? 13 : 14" class="finish-desc">
        <view v-if="task.feedbackFlag" class="card-name">
          完成情况：
          <!-- 20231225 寒假作业完成情况展示百分比 -->
          <view v-if="props.taskSubType !== 8 || !props.subTaskFlag" style="display: inline-block">
            <tui-text :text="task.finishNum" size="56" color="#4ad975"></tui-text>
            <text style="color: #666">/</text>
            <tui-text :text="task.totalNum" color="#666666"></tui-text>
          </view>
          <tui-text v-else :text="`${task.finishRate}%`" color="#4ad975"></tui-text>
        </view>
        <tui-text v-else text="无需反馈" size="40" color="#4ad975"></tui-text>
      </tui-col>
      <tui-col
        v-if="!props.isTeacher && task.feedbackFlag"
        :span="props.taskStatus === 0 ? 13 : 16"
        class="stu-btn"
      >
        <button v-if="props.taskStatus === 0" class="normal-btn" @click.stop="startHomework">
          {{ task.endDate > nowDate ? '开始作业' : '补做' }}
        </button>
        <button v-else disabled class="disable-btn">
          {{ taskStatusBtnDesc }}
        </button>
      </tui-col>
    </tui-row>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import utils from '@/uni-module-common/utils';
import { $cdn } from '@/uni-module-common/config';

const props = defineProps({
  // tabs 数据
  taskInfo: {
    type: Object,
    default: () => {}
  },
  // 作业状态
  // 教师： 0未开始、1进行中、2已结束
  taskStatus: {
    type: Number,
    default: 0
  },
  isTeacher: {
    type: Boolean,
    require: true
  },
  taskSubType: {
    type: Number,
    default: 0
  },
  subTaskFlag: {
    type: Boolean,
    default: false
  }
});
// 定义点击事件
const emits = defineEmits(['clickTaskCard', 'clickTaskCardBtn']);
const task: any = ref({});
const taskTypeMap = new Map();
taskTypeMap.set(1, '作业');
const nowDate = new Date().getTime();
const excellent = `${$cdn}/nb/m/uni-task-center/img/marked-excellent.png`;
const commented = `${$cdn}/nb/m/uni-task-center/img/reviewed.png`;

const showPingIcon = computed(() => {
  return !props.isTeacher && (task.value.commentFlag || task.value.excellentFlag);
});
const taskStatusBtnDesc = computed(() => {
  return props.taskStatus === 2 ? '已过期' : task.value.commitStatus === 1 ? '已完成' : '已补交';
});
const endTimeColor = computed(() => {
  if (props.isTeacher) {
    return '#ff5436';
  } else {
    return props.taskStatus === 1 ? '#999999' : '#ff5436';
  }
});
watch(
  () => props.taskInfo,
  (newV) => {
    task.value = newV;
  },
  { immediate: true }
);

const clickCard = () => {
  emits('clickTaskCard', task.value.taskId);
};
const startHomework = () => {
  emits('clickTaskCardBtn', {
    type: 'start-homework',
    data: task.value,
    taskSubType: props.taskSubType
  });
};
// 处理截止时间
const handleEndTime = (time: number) => {
  const tStatus = props.taskStatus;
  let timeStr = '';
  if (props.isTeacher) {
    // 老师
    switch (tStatus) {
      case 0: // 0未开始、1进行中
      case 1:
        timeStr = `${utils.compareDate(time)}后截止`;
        break;
      case 2: // 2已结束
        timeStr = `${utils.parseTime(time, '{m}月{d}日 {h}:{i}')}已截止`;
        break;
      default:
        timeStr = '';
        break;
    }
  } else {
    // 学生
    switch (tStatus) {
      case 0: // 0未完成
      case 1: // 1已完成
        timeStr =
          time > nowDate
            ? `${utils.compareDate(time)}后截止`
            : `${utils.parseTime(time, '{m}月{d}日 {h}:{i}')}已截止`;
        break;
      case 2: // 2 已过期
        timeStr = `${utils.parseTime(time, '{m}月{d}日 {h}:{i}')}已截止`;
        break;
      default:
        timeStr = '';
        break;
    }
  }
  return timeStr;
};
const handleSendTime = (time: number) => {
  let timeStr = utils.formatTimeWithChinese(time);
  if (props.taskStatus === 0 && props.isTeacher) {
    // 未开始
    timeStr = `将于${timeStr} 发送`;
  }
  return timeStr;
};
</script>

<style scoped lang="scss">
$number: 16;
.task-card {
  position: relative;
  padding: 44rpx 32rpx 36rpx;
  border-radius: 16rpx;
  background-color: white;
  font-size: $uni-font-size-base;
  .task-header {
    display: inline-block !important;
    width: 100%;
    .task-name {
      margin-left: 16rpx;
      line-height: 150%;
      font-weight: bold;
      font-size: 40rpx;
    }
  }
  .ping-icon {
    position: absolute;
    right: 32rpx;
    top: 44rpx;
  }
  .task-content {
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
    margin-top: 12rpx;
  }
  .finish-desc {
    text-align: right;
    color: #4ad975;
  }
  .card-name {
    text-align: right;
    color: #4ad975;
  }
  .stu-btn {
    display: flex;
    justify-content: flex-end;
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
</style>
