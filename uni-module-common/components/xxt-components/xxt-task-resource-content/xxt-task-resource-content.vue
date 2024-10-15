<template>
  <view>
    <template v-if="readResTask.includes(props.taskSubType)">
      <view
        v-for="(resource, index) in props.resourceList"
        :key="resource.resourceId"
        class="resource-view"
      >
        <!-- 头部 -->
        <view class="thorui-flex__between">
          <view class="fontsize14">
            <view>
              {{ `${index + 1}.${resource.resourceName}` }}
              <text v-if="resource.closeEyesRate">闭眼时间占比 {{ resource.closeEyesRate }}</text>
            </view>
            <!--
              READ(10, "read", "朗读", false),
              UNIT_LEARN_PREPARE(11, "unit-learn-prepare", "语文同步学预习", true),
              UNIT_LEARN_EXERCISE(12, "unit-learn-exercise", "语文同步学巩固练习", true),
              UNIT_LEARN_TEST(13, "unit-learn-test", "语文同步学单元测试", true),
              VIDEO(14, "video", "视频", false),
              TEXT_READ(15, "text-read", "课文朗读-朗读", false),
              TEXT_RECITE(16, "text-recite", "课文朗读-背诵", false),
              CLASSIC_READ(17, "classic-read", "经典诵读-朗读", false),
              CLASSIC_RECITE(18, "classic-recite", "经典诵读-背诵", false),
              ENGLISH_READ(19, "english-read", "英语-朗读", false),
              ENGLISH_RECITE(20, "english-recite", "英语-背诵", false), -->
            <view
              v-if="
                ['read', 'text-read', 'classic-read', 'english-read'].includes(
                  resource.resourceType
                )
              "
              class="mt4"
              style="color: #999"
            >
              已朗读{{ `${resource.stuReadNum}/${resource.readNum}` }}
            </view>
          </view>
          <!-- 添加跳转逻辑 -->
          <view
            v-if="[1, 3].includes(resource.resourceFinishFlag) && operBtnsShow"
            class="round-btn"
            @click="goFinishRead(resource)"
          >
            {{ resource.resourceFinishFlag === 1 ? '去完成' : '继续完成' }}
          </view>
        </view>
        <view
          v-for="result in resource.resultList"
          :key="result.resultId"
          class="result-card"
          @click="goFinishReport(resource, result)"
        >
          <tui-row>
            <tui-col :span="4">
              <image
                class="result-card-img"
                lazy-load
                mode="aspectFit"
                :src="
                  ['read', 'text-read', 'classic-read', 'english-read'].includes(
                    resource.resourceType
                  )
                    ? `${$cdn}/nb/gll/reading/img/reading-icon.png`
                    : `${$cdn}/nb/gll/reading/img/beisong.png`
                "
              />
            </tui-col>
            <tui-col :span="20">
              <view class="fontsize14" style="color: #000">{{ result.resultName }}</view>
              <view class="mt4">
                <tui-rate
                  :current="getRateByScore(result.score)"
                  disabled
                  active="#FFB700"
                  normal="#d9d9d9"
                ></tui-rate>
              </view>
              <view class="mt4 fontsize12" style="color: #999">
                <text>{{ utils.parseTime(result.createDate, '{y}年{m}月{d}日 {h}:{i}') }}</text>
                <tui-icon class="result-card-icon" name="clock" :size="14"></tui-icon>
                <text>
                  {{ utils.formatTime(Number(result.fileParam)) }}
                </text>
                <template v-if="result.closeEyesDuration">
                  <tui-icon class="result-card-icon" name="clock" :size="14"></tui-icon>
                  <text>
                    {{ utils.formatTime(Number(result.closeEyesDuration)) }}
                  </text>
                </template>
              </view>
            </tui-col>
          </tui-row>
        </view>
      </view>
    </template>

    <template v-if="paperResTask.includes(props.taskSubType)">
      <paperTaskCon
        v-for="resource in resList"
        :key="resource.resourceId"
        :task-id="props.taskId"
        :task-sub-type="props.taskSubType"
        :is-teacher="props.isTeacher"
        :resource="resource"
        :oper-btns-show="props.operBtnsShow"
      ></paperTaskCon>
      <view v-if="videoList.length > 0" style="margin: 24rpx 0 20rpx; color: #222"> 推荐视频 </view>
      <paperTaskCon
        v-for="resource in videoList"
        :key="resource.resourceId"
        :task-id="props.taskId"
        :task-sub-type="props.taskSubType"
        :is-teacher="props.isTeacher"
        :resource="resource"
        :oper-btns-show="props.operBtnsShow"
      ></paperTaskCon>
    </template>
  </view>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import paperTaskCon from './paper-task-con.vue';
import utils from '@/uni-module-common/utils';
import type { resourceItem } from '@/pages/teacher/correct-homework/correct-homework';
import {
  englishReadingStuFinishH5,
  englishReadingStuReadResultH5,
  englishReadingStuReciteResultH5,
  readStudentAnswerReportH5,
  readStudentFinishH5
} from '@/uni-module-common/utils/uniToAppH5Bridge';

const props = defineProps({
  taskId: {
    type: Number,
    default: 0
  },
  taskSubType: {
    type: Number,
    default: 0
  },
  resourceList: {
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
const { userAgent } = useStore('user');
// 判断是不是朗读小程序
const isReadingMiniProd = computed(() => {
  return parseInt(userAgent.value.hostId || '0') === 101;
});
const router = useRouter();

const resList: any = ref([]);
const videoList = ref<resourceItem[]>([]);
// 3 数学课时练、4 天天练、 8 寒假作业、9 温故与知新、10 单元练习、11 期中期末卷、12 中考专区
const paperResTask = [3, 4, 8, 9, 10, 11, 12];
const readResTask = [1, 5, 6, 7]; // 1朗读作业 5课文朗读 6经典诵读 7英语读测评

const filterVideoResource = (newV: any) => {
  newV?.forEach((e: any) => {
    if (e.resourceType === 'video') {
      videoList.value.push(e);
    } else {
      resList.value.push(e);
    }
  });
};

watch(
  () => props.resourceList,
  (newV) => {
    if (paperResTask.includes(props.taskSubType)) {
      nextTick(() => {
        resList.value = [];
        videoList.value = [];
        filterVideoResource(newV);
      });
    } else {
      resList.value = newV;
    }
  },
  { deep: true }
);

/**
 * 根据分数获取星数
 */
const getRateByScore = (score: number) => {
  let starValue = 0;
  if (score === 0) {
    starValue = 0;
  } else if (score <= 59) {
    starValue = 1;
  } else if (score <= 69) {
    starValue = 2;
  } else if (score <= 79) {
    starValue = 3;
  } else if (score <= 89) {
    starValue = 4;
  } else {
    starValue = 5;
  }
  return starValue;
};

/**
 * 去完成 或者 继续完成 朗读类作业
 */
const goFinishRead = (resource: any) => {
  // 1朗读 2背诵
  const homeworkType = ['read', 'text-read', 'classic-read', 'english-read'].includes(
    resource.resourceType
  )
    ? 1
    : 2;
  switch (props.taskSubType) {
    case 1: // 朗读作业
    case 6: // 经典诵读
      readStudentFinishH5(
        `&taskId=${props.taskId}&homeworkType=${homeworkType}&aid=${resource.resourceId}&ut=${resource.stuReadNum}&rt=${resource.readNum}&pas=${resource.paragraph}`
      );
      break;
    case 5: // 课文朗读
      if (isReadingMiniProd.value) {
        const path =
          homeworkType === 1
            ? '/uni_modules/xxt-xzx-reading-uni/pages/reading/read-recite/read-recite'
            : '/uni_modules/xxt-xzx-reading-uni/pages/reading/read-recite/recite-operate';
        router.push({
          path,
          query: {
            readorrecite: `${homeworkType}`,
            articleId: resource.resourceId,
            checkList: resource.paragraph,
            taskId: `${props.taskId}`
          }
        });
      } else {
        readStudentFinishH5(
          `&taskId=${props.taskId}&homeworkType=${homeworkType}&aid=${resource.resourceId}&ut=${resource.stuReadNum}&rt=${resource.readNum}&pas=${resource.paragraph}`
        );
      }
      break;
    case 7: // 英语读测评
      englishReadingStuFinishH5(
        `&taskId=${props.taskId}&aId=${resource.resourceId}&hwType=${homeworkType}`
      );
      break;
    default:
      break;
  }
};

/**
 * 朗读类作业报告跳转
 */
const goFinishReport = (resource: any, result: any) => {
  // 1朗读 2背诵
  const homeworkType = ['read', 'text-read', 'classic-read', 'english-read'].includes(
    resource.resourceType
  )
    ? 1
    : 2;
  switch (props.taskSubType) {
    case 1: // 朗读作业
    case 6: // 经典诵读
      readStudentAnswerReportH5(
        `&taskId=${props.taskId}&fileId=${result.resultId}&homeworkType=${homeworkType}&aid=${resource.resourceId}&ut=${resource.stuReadNum}&rt=${resource.readNum}&pas=${resource.paragraph}`
      );
      break;
    case 5: // 课文朗读
      if (isReadingMiniProd.value) {
        // 朗读小程序 结果页
        router.push({
          path: `/uni_modules/xxt-xzx-reading-uni/pages/reading/reading-results/reading-results`,
          query: {
            recordId: result.resultId,
            taskId: `${props.taskId}`,
            readorrecite: `${homeworkType}`
          }
        });
      } else {
        readStudentAnswerReportH5(
          `&taskId=${props.taskId}&fileId=${result.resultId}&homeworkType=${homeworkType}&aid=${resource.resourceId}&ut=${resource.stuReadNum}&rt=${resource.readNum}&pas=${resource.paragraph}`
        );
      }
      break;
    case 7: // 英语读测评
      if (homeworkType === 1) {
        englishReadingStuReadResultH5(
          `&taskId=${props.taskId}&rId=${result.resultId}&isnoShow=1&isNoSubmit=1`
        );
      } else {
        englishReadingStuReciteResultH5(
          `&taskId=${props.taskId}&rId=${result.resultId}&isnoShow=1&isNoSubmit=1`
        );
      }
      break;
    default:
      break;
  }
};
</script>

<style scoped lang="scss">
.resource-view {
  margin: 12px 0;
  .round-btn {
    border-radius: 58px;
    width: 80px;
    height: 32px;
    background: linear-gradient(270deg, #4ad975 0%, #52ef81 100%);
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
  .result-card {
    margin-top: 12px;
    border-radius: 8px;
    background: rgba(74, 217, 117, 0.1);
    padding: 12px;
  }
  .result-card:last-child {
    margin-bottom: 0;
  }
  .result-card-img {
    width: 40px;
    height: 40px;
  }
  .result-card-icon {
    margin: 0 2px 0 20px;
  }
}
.resource-view:first-child {
  margin-top: 0;
}
.fontsize14 {
  font-size: 14px;
}
.fontsize12 {
  font-size: 12px;
}
.mt4 {
  margin-top: 4px;
}
</style>
