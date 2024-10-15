<template>
  <view>
    <tui-row is-flex margin-bottom="10px">
      <tui-col :span="18">
        <view class="resource-name"> {{ resource.resourceName }} </view>
      </tui-col>
      <tui-col :span="6" class="paper-btn">
        <!-- 已完成仍展示作业报告按钮 -->
        <view
          v-if="
            operBtnsShow ||
            props.resource.resourceType === 'video' ||
            props.resource.resourceFinishFlag === 2
          "
          class="btn-desc"
          @click="go2Resource(resource)"
        >
          {{ resourceBtnDesc }}
        </view>
      </tui-col>
    </tui-row>
  </view>
</template>

<script setup lang="ts">
import utils from '@/uni-module-common/utils';
import {
  evaluationAnswerReportH5,
  evaluationFinishH5,
  goToH5,
  mathClassPracticeSelfAnswerReportH5,
  mathClassPracticeStuAnswerReportH5,
  mathClassPracticeStuFinishH5
} from '@/uni-module-common/utils/uniToAppH5Bridge';
import type { resourceItem } from '@/pages/teacher/correct-homework/correct-homework';
const props = defineProps({
  taskId: {
    type: Number,
    default: 0
  },
  taskSubType: {
    type: Number,
    default: 0
  },
  resource: {
    type: Object,
    default: () => {}
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
  operBtnsShow: {
    type: Boolean,
    default: true
  }
});
const stuInfo: any = inject('stuInfo');
const isMyself = inject('isMyself', true); // 默认是查看自己

const resourceBtnDesc = computed(() => {
  if (props.resource.resourceType === 'video') {
    return props.resource.watchNum > 0 || props.isTeacher
      ? utils.secondsFormat(props.resource.watchNum, 2)
      : '去学习';
  } else {
    const resourceFinishFlag = props.resource.resourceFinishFlag;
    return resourceFinishFlag === 1 ? '去完成' : resourceFinishFlag === 2 ? '作答报告' : '继续完成';
  }
});

// 寒假作业
const getHolidayUrlParams = async (
  resource: resourceItem,
  resourceFinishFlag: number,
  eType: number,
  paramStr: string
) => {
  if (resourceFinishFlag === 2) {
    let paramString = `&pId=${resource.resourceId}&aType=${resource.applicationType}&ccId=${resource.catalogCollectionId}&eType=${eType}${paramStr}`;
    if (!isMyself) {
      const uId = stuInfo?.value?.xinzxUserId;
      const uType = stuInfo?.value?.userType;
      paramString += `&uId=${uId}&uType=${uType}`;
    }
    // 作业报告
    evaluationAnswerReportH5(paramString);
  } else {
    // 去完成
    evaluationFinishH5(
      `&pId=${resource.resourceId}&aType=${resource.applicationType}&ccId=${resource.catalogCollectionId}&cItemId=${resource.catalogItemId}&eType=${eType}`
    );
  }
};

const go2Resource = (resource: any) => {
  if (resource.resourceType === 'video') {
    if (!props.isTeacher) {
      // 学生点击去看视频
      goToH5(`${resource.filePath}&unimpParams=1&unimpAppId=__UNI__A9BA932`);
    }
    return;
  }
  const resourceFinishFlag = resource.resourceFinishFlag;
  const taskSubType = props.taskSubType;
  if (resourceFinishFlag === 2) {
    const uniUrl = props.isTeacher
      ? 'pages/teacher/correct-homework/correct-homework'
      : 'pages/student/task-detail/task-detail';
    // 跳到对应的作业报告页
    switch (taskSubType) {
      case 3: // 数学课时练
      case 4: // 天天练
        if (isMyself) {
          // 查看自己
          mathClassPracticeSelfAnswerReportH5(
            `&unimpUrl=${uniUrl}&pid=${resource.resourceId}&title=${resource.resourceName}`
          );
        } else {
          // 查看他人（教师看学生、学生看学生）
          mathClassPracticeStuAnswerReportH5(
            `&unimpUrl=${uniUrl}&paperId=${resource.resourceId}&blogId=${
              stuInfo.value?.blogId
            }&stuName=${encodeURIComponent(
              stuInfo.value?.userName as string
            )}&unitName=${encodeURIComponent(stuInfo.value?.unitName as string)}&subjectId=${
              resource.subjectId
            }`
          );
        }
        break;
      case 8: // 寒假作业
      case 9: // 温故与知新
        getHolidayUrlParams(resource, resourceFinishFlag, 2, `&unimpUrl=${uniUrl}`);
        break;
      case 10: // 单元练习
      case 11: // 期中期末卷
      case 12: // 中考专区
        getHolidayUrlParams(resource, resourceFinishFlag, 1, `&unimpUrl=${uniUrl}`);
        break;
      default:
        break;
    }
  } else {
    // 跳到 h5 作答流程
    switch (taskSubType) {
      case 3: // 数学课时练
      case 4: // 天天练
        mathClassPracticeStuFinishH5(`&pid=${resource.resourceId}`);
        break;
      case 8: // 寒假作业
      case 9: // 温故与知新
        getHolidayUrlParams(resource, resourceFinishFlag, 2, '');
        break;
      case 10: // 单元练习
      case 11: // 期中期末卷
      case 12: // 中考专区
        getHolidayUrlParams(resource, resourceFinishFlag, 1, '');
        break;
      default:
        break;
    }
  }
};
</script>

<style scoped lang="scss">
.resource-name {
  font-size: 28rpx;
}
.paper-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.btn-desc {
  padding: 8rpx 16rpx;
  border: #4ad975 2rpx solid;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #4ad975;
}
</style>
