<template>
  <view class="navigation-header">
    <tui-navigation-bar
      background-color="#FFFFFF"
      color="#222222"
      title="书籍测试"
      :is-opacity="false"
      :is-fixed="false"
      @init="initNavigation"
    >
      <view class="tui-header-icon" :style="{ marginTop: `${top}px` }">
        <tui-icon name="arrowleft" color="'#222222'" @click="routeBack"></tui-icon>
      </view>
    </tui-navigation-bar>
  </view>
  <view class="container">
    <image
      class="answer-bgimage"
      :src="`${$cdn}/nb/m/uni-zhyd/img/test_answer_bg.png`"
      mode="scaleToFill"
      :style="{
        width: '100%',
        height: `212px`,
        top: `${height - 44}px`
      }"
    />
    <view
      class="answer-bg"
      :style="{
        marginTop: `${height + 130 - 44}px`
      }"
    >
      <!-- <view class="countdown">
        <tui-text :text="`${count}s`" :size="40" color="#4AD975" font-weight="600"></tui-text>
        <tui-text text="剩余时间" :size="20" color="#999999" font-weight="400"></tui-text>
      </view> -->
      <tui-circular-progress
        class="countdown"
        :percentage="percentage"
        :percent-text="`${count}s`"
        :font-show="true"
        :font-size="20"
        :line-width="4"
        font-color="#4AD975"
        :default-color="defaultColor"
        progress-color="#f5f5f5"
        active-mode="forwards"
        :diam="90"
      >
        <template #default>
          <view class="countdown-view">
            <!-- <tui-text :text="`${count}s`" :size="40" color="#4AD975" font-weight="600"></tui-text> -->
            <!-- <tui-text text="剩余时间" :size="20" color="#999999" font-weight="400"></tui-text> -->
          </view>
        </template>
      </tui-circular-progress>
      <view class="answer-top">
        <view class="answer-top-title">
          问题 <span class="answer-top-title-count">{{ questionObj?.questSeq }}</span
          >/{{ questList.length }}
        </view>
        <view class="answer-top-progress">
          <tui-progress
            :percent="progressPercent"
            active-color="#4AD975"
            background-color="#F2F2F2"
          ></tui-progress>
        </view>
      </view>
      <view class="answer-question">
        <tui-text :text="questionObj?.content" :size="32" color="#222" font-weight="600"></tui-text>
        <view
          v-for="item in newChoiceList"
          :key="item.choiceCode"
          class="answer-question-item"
          @click="itemClick(item)"
        >
          <view
            class="answer-question-item-bg"
            :class="{
              'answer-question-item-right': parseInt(item.correctAnswer) === 1 && item.checked,
              'answer-question-item-wrong': parseInt(item.correctAnswer) === 0 && item.checked
            }"
          ></view>
          <view class="answer-question-item-text">
            <tui-text
              :text="item.choiceCode"
              style="z-index: 2"
              :size="32"
              :color="item.checked ? '#FFFFFF' : '#222'"
              font-weight="600"
            ></tui-text>
            <tui-text
              style="margin-left: 12px; z-index: 2"
              text="|"
              :size="32"
              :color="item.checked ? '#FFFFFF' : '#DDDDDD'"
              font-weight="300"
            ></tui-text>
            <tui-text
              style="margin-left: 12px; z-index: 2"
              :text="item.choiceContent"
              :size="32"
              :color="item.checked ? '#FFFFFF' : '#222'"
              font-weight="400"
            ></tui-text>
          </view>
          <image
            v-if="item.checked"
            class="answer-question-item-image"
            mode="aspectFill"
            :src="
              item.correctAnswer === 1
                ? `${$cdn}/nb/m/uni-zhyd/img/books_etest_wrong.png`
                : `${$cdn}/nb/m/uni-zhyd/img/books_etest_right.png`
            "
          ></image>
        </view>
      </view>
    </view>
  </view>
  <tui-modal
    :show="modal"
    :button="btnAry"
    content="确认要退出答题吗？"
    @click="handleClick"
    @cancel="modal = false"
  ></tui-modal>
</template>

<script setup lang="ts">
const instance: any = getCurrentInstance();
const timeCount = 60;
const count = ref(timeCount);
const questList = ref([]);
// 已经回答问题的数组
const answerList: any = [];
let timer: any = null;
// 用户整体耗时时间
let useTime = 0;
console.log('useTime---', useTime);
let watchTime = 0;
// 按钮是否可以点击
let btnCanClick = true;
// 当前回答的哪一道题
const curAnswerIndex = ref(0);
// 试卷信息
let paperInfo: any = {};
const waCount = 1000 / 50;
const router = useRouter();
// 自定义导航
const top = ref(0);
const height = ref(44);
const modal = ref(false);
const btnAry = ref([
  {
    text: '取消',
    type: 'green',
    plain: true
  },
  {
    text: '确定',
    type: 'green',
    plain: false
  }
]);
const initNavigation = (e: any) => {
  top.value = e.top;
  height.value = e.height;
};
const routeBack = () => {
  modal.value = true;
};
const handleClick = (e: any) => {
  modal.value = false;
  const index = e.index;
  if (index === 1) {
    router.back();
  }
};
// 自定义导航
const percentage = computed(() => {
  if (count.value < 0) {
    return 100;
  }
  const res = ((timeCount - count.value) / timeCount) * 100;
  // console.log('percentage---', res);
  return res;
});
const progressPercent = computed(() => {
  return ((curAnswerIndex.value + 1) / questList.value.length) * 100;
});
const defaultColor = computed(() => {
  return count.value <= 10 ? '#4AD975' : '#4AD975';
});

const questionObj: any = computed(() => {
  return questList.value[curAnswerIndex.value];
});

// 统一处理逻辑
const allToDoFunc = (questId: any, userAnswerList: any) => {
  answerList.push({
    questId,
    userAnswerList
  });
  console.log('allToDoFunc----answerList---', answerList);

  if (curAnswerIndex.value === questList.value.length - 1) {
    // 说明是最后一道题了，关闭定时器，跳转到答题结果页面
    clearTimeout(timer);
    timer = null;
    useTime = watchTime / waCount;
    console.log('answerList---useTime---', useTime, watchTime);
    const obj = {
      paperId: paperInfo.paperId,
      applicationType: paperInfo.applicationType,
      isbn: paperInfo.isbn,
      catalogId: paperInfo.catalogId,
      useTime,
      submitType: 2,
      questList: answerList,
      catalogIdAry: paperInfo.catalogIdAry
    };
    uni.navigateTo({
      url: '/uni_modules/uni-module-public/test-evaluation/test-evaluation-result',
      success: (res: any) => {
        console.log('goToEvaluationResultSuccess----res', res);
        res.eventChannel.emit('goToEvaluationResultSuccess', {
          questAnswerInfo: obj
        });
      }
    });
    return;
  }
  count.value = timeCount;
  curAnswerIndex.value++;
};

// 监听count是否为0
watch(count, (newVal, oldVal) => {
  // console.log('count---watch---', newVal);
  if (newVal < 0) {
    const questId = questionObj.value.questId;
    const userAnswerList = [''];
    allToDoFunc(questId, userAnswerList);
  }
});
const newChoiceList = ref<any>([]);
watch(
  () => questionObj.value?.choiceList,
  (newVal, oldVal) => {
    newChoiceList.value = newVal.map((item: any) => ({
      ...item,
      checked: false
    }));
  },
  { deep: true }
);
const choiceList: any = computed(() => {
  console.log('choiceList---questionObj---', questionObj);
  const list = questionObj.value?.choiceList.map((item: any) => ({
    ...item,
    checked: false
  }));
  return list;
});

// 创建60秒倒计时
const createCountDown = () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    // console.log('count---createCountDown---', count.value);
    // count.value--;
    // useTime++;
    watchTime++;
    if (watchTime % waCount === 0) {
      count.value--;
    }
    // console.log('count---createCountDown---', watchTime);
    createCountDown();
  }, 50);
};
const itemClick = (item: any) => {
  if (!btnCanClick) {
    return;
  }
  item.checked = !item.checked;
  const questId = questionObj.value.questId;
  const userAnswerList = [item.choiceCode];
  btnCanClick = false;
  clearTimeout(timer);
  timer = null;
  setTimeout(() => {
    createCountDown();
    allToDoFunc(questId, userAnswerList);
    btnCanClick = true;
  }, 200);
  console.log('itemClick---item---', item);
  console.log('itemClick---answerList---', answerList);
};
onLoad(async (opt: any) => {
  const eventChannel = instance?.proxy.getOpenerEventChannel();
  eventChannel.on('goToAnswerPageSuccess', (data: any) => {
    console.log('goToAnswerPageSuccess---data---', data, curAnswerIndex.value);
    questList.value = data.bookCatalogRes.questList;
    paperInfo = data.bookCatalogRes;
  });
  createCountDown();
});
onHide(() => {
  console.log('onHide---');
  clearTimeout(timer);
  timer = null;
});
onUnload(() => {
  console.log('onUnload---');
  clearTimeout(timer);
  timer = null;
});
</script>

<style scoped lang="scss">
.container {
  @include normalContainer();
  @include normalFlex(column, flex-start, center);
  /* background-color: aqua; */
  /* background-color: #d3fafd !important; */
  background: linear-gradient(180deg, #d3ffe0 0%, #d3fafd 100%);
  padding: 16px;
  /* position: relative; */
}
.answer-bgimage {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 214px;
}
.answer-bg {
  min-height: 400px;
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  position: relative;
  padding: 0 16px 16px 16px;
  box-sizing: border-box;
}
.countdown {
  width: 80px;
  height: 80px;
  background-color: #ffffff;
  border-radius: 50%;
  /* border: 3px solid #4ad975; */
  @include normalFlex(column, center, center);
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  .countdown-view {
    background-color: aquamarine;
  }
}
.answer-top {
  margin-top: 56px;
  height: 28px;
  /* background-color: darkgoldenrod; */
  @include normalFlex(row, space-between, center);
  &-title {
    height: 100%;
    line-height: 28px;
    color: #999999;
    font-size: 14px;
  }
  &-title-count {
    color: #4ad975;
    font-size: 20px;
  }
  &-progress {
    width: 160px;
  }
}
.answer-question {
  margin-top: 20px;
  &-item {
    margin-top: 16px;
    padding: 16px;
    border-radius: 12px;
    position: relative;
    @include normalFlex(row, flex-start, center);
  }
  &-item-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background-color: rgba(255, 183, 0, 0.1);
  }
  &-item-right {
    background-color: #4ad975;
  }
  &-item-wrong {
    background-color: #ff5436;
  }
  &-item-text {
    flex: 1;
    /* background-color: #999999; */
    @include normalFlex(row, flex-start, center);
  }
  &-item-image {
    height: 28px;
    width: 28px;
    z-index: 1;
  }
}
/* 样式 */
.tui-header-icon {
  width: 100%;
  position: fixed;
  top: 0;
  padding: 0 12rpx;
  display: flex;
  align-items: center;
  height: 32px;
  transform: translateZ(0);
  z-index: 99999;
  box-sizing: border-box;
}
.navigation-header {
  background-color: red;
  position: fixed;
  width: 100%;
  z-index: 1;
}
</style>
