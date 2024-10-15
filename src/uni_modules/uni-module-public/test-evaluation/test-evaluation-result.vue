<template>
  <view class="container">
    <tui-navigation-bar
      background-color="#FFFFFF"
      color="#222222"
      title="答题结果"
      :is-opacity="false"
      :is-fixed="false"
      @init="initNavigation"
    >
      <view class="tui-header-icon" :style="{ marginTop: `${top}px` }">
        <tui-icon name="arrowleft" color="'#222222'" @click="routeBack"></tui-icon>
      </view>
    </tui-navigation-bar>
    <image
      class="answer-result-bgimage"
      mode="aspectFill"
      :src="`${$cdn}/nb/m/uni-zhyd/img/books_etest_bgimg.png`"
    ></image>
    <view class="answer-result-content" :style="{ 'margin-top': `${statusBarHeight + height}px` }">
      <image
        class="start-image"
        mode="aspectFill"
        :src="`${$cdn}/nb/m/uni-zhyd/img/books_etest_badge.png`"
      ></image>
      <xxt-grade-start
        v-model:score="result.starNum"
        :disabled="true"
        :start-width="32"
        :start-height="32"
        :space="8"
        :height="32"
        :width="192"
      />
      <tui-text
        style="margin-top: 10px"
        text="太棒了"
        :size="40"
        color="#00C93C"
        font-weight="600"
      ></tui-text>
      <tui-text
        style="margin-top: 10px"
        text="你已完成测试"
        :size="28"
        color="#222222"
        font-weight="400"
      ></tui-text>
      <view class="answer-result-info" :class="{ 'answer-result-info-catalog': showStartThree }">
        <view class="answer-result-info-normal">
          <view class="answer-result-info-top info-normal"></view>
          <image
            class="info-image"
            mode="aspectFill"
            :src="`${$cdn}/nb/m/uni-zhyd/img/books_etest_answer_time.png`"
          ></image>
          <tui-text
            style="margin-left: 12px"
            text="答题时长"
            :size="28"
            color="#666666"
            font-weight="400"
          ></tui-text>
          <view class="info-text">
            <tui-text
              v-if="minute > 0"
              :text="minute"
              :size="40"
              color="#4AD975"
              font-weight="400"
            ></tui-text>
            {{ minute > 0 ? '分钟' : '' }}
            <tui-text :text="second" :size="40" color="#4AD975" font-weight="400"></tui-text>
            秒
          </view>
        </view>
        <view class="answer-result-info-normal">
          <view class="answer-result-info-bottom info-normal"></view>
          <image
            class="info-image"
            mode="aspectFill"
            :src="`${$cdn}/nb/m/uni-zhyd/img/books_etest_answer_state.png`"
          ></image>
          <tui-text
            style="margin-left: 12px"
            text="答题情况"
            :size="28"
            color="#666666"
            font-weight="400"
          ></tui-text>
          <view class="info-text">
            <tui-text
              :text="result.correctQuestNum"
              :size="40"
              color="#4AD975"
              font-weight="400"
            ></tui-text>
            /{{ result.totalQuestNum }}题
          </view>
        </view>
        <view v-if="showStartThree" class="start-less-three"> 获得3颗星即可继续下一关 </view>
      </view>
    </view>
    <view class="answer-result-footer">
      <tui-form-button
        v-if="isShowAnswer"
        radius="60rpx"
        height="96rpx"
        width="326rpx"
        background="#4AD975"
        plain
        color="#4AD975"
        :size="28"
        @click="gotoBreakPaper"
        >{{
          questAnswerInfo?.catalogId === '0' ? '重新闯关' : showStartThree ? '重新闯关' : '继续闯关'
        }}</tui-form-button
      >
      <view :style="{ width: isShowAnswer ? '163px' : '100%' }">
        <tui-form-button
          radius="60rpx"
          height="96rpx"
          background="#4AD975"
          color="#FFFFFF"
          :size="28"
          @click="goToIndex"
          >返回首页</tui-form-button
        >
      </view>
    </view>
    <testIntegralModal
      v-model:show="rewardModal"
      :top-img="`${$cdn}/nb/m/uni-zhyd/img/my-flower-icon-star.png`"
    >
      <view style="margin-top: 10rpx; text-align: center">
        <view style="font-weight: bold; font-size: 16px; color: #222">恭喜完成图书测评</view>
        <view
          style="
            font-size: 14px;
            color: #222;
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <span style="font-size: 20px; color: #ff5436; font-weight: 600"
            >+{{ result.rewardNum }}朵</span
          >
          <image
            mode="aspectFill"
            class="flower-img"
            :src="`${$cdn}/nb/m/uni-clock-in/img/clock-flower.png`"
          ></image>
        </view>
        <view style="margin-top: 40rpx">
          <tui-form-button
            radius="50px"
            background="#4AD975"
            color="#FFFFFF"
            height="72rpx"
            @click="rewardModal = false"
            >我知道了</tui-form-button
          >
        </view>
      </view>
    </testIntegralModal>
  </view>
</template>

<script setup lang="ts">
import { submitPaperQuestAnswer } from './api-hooks/test-evaluation-request-api';
import testIntegralModal from './components/test-integral-modal.vue';
import { appModuleConfig } from '@/uni-module-common/config';
const statusBarHeight = ref<any>(uni.getSystemInfoSync().statusBarHeight);
const height = ref(44);
const instance: any = getCurrentInstance();
const eventBus = instance!.appContext.config.globalProperties.$eventBus;
const questAnswerInfo = ref<any>({});
const result = ref<any>({});
const router = useRouter();
const top = ref(0);
const eventChannel = instance?.proxy.getOpenerEventChannel();
const rewardModal = ref(false);
const initNavigation = (e: any) => {
  top.value = e.top;
};
const routeBack = () => {
  router.back({ delta: 2, animationType: 'pop-out' });
};
const showStartThree = computed(() => {
  const a = questAnswerInfo?.value?.catalogId !== '0';
  const b = questAnswerInfo?.value.catalogIdAry && questAnswerInfo?.value?.catalogIdAry.length > 1;
  const c = result.value && result.value.starNum < 3;
  return a && b && c;
});
onLoad(async (opt: any) => {
  eventChannel.on('goToEvaluationResultSuccess', async (data: any) => {
    console.log('goToEvaluationResultSuccess---data---', data);
    questAnswerInfo.value = data.questAnswerInfo;
    const params = Object.assign({}, questAnswerInfo.value);
    // 请求catalogId===0 的时候，不传catalogId
    if (params.catalogId === '0') {
      params.catalogId = '';
    }
    params.hostId = appModuleConfig.hostId;
    // 提交作答结果
    result.value = await submitPaperQuestAnswer(params);
    eventBus.emit('testEvaluationFinish', { result: result.value });
    if (result.value.rewardNum > 0) {
      rewardModal.value = true;
    }
  });
});
// 秒获取里面的分钟
const minute = computed(() => {
  return Math.floor(result.value.useTime / 60);
});
// 秒获取里面的秒
const second = computed(() => {
  return result.value.useTime % 60;
});
// 只有是打卡列表传过来的才显示
const isShowAnswer = computed(() => {
  if (questAnswerInfo?.questList?.length === 0) {
    return true;
  }
  const index = questAnswerInfo.value?.catalogIdAry?.findIndex(
    (item: number) => item === questAnswerInfo.value?.catalogId
  );
  console.log('isShowAnswer---index---', index);
  if (
    index === -1 ||
    (index === questAnswerInfo.value?.catalogIdAry?.length - 1 &&
      questAnswerInfo.value?.catalogId !== '0')
  ) {
    return false;
  }
  return true;
});
const gotoBreakPaper = () => {
  // 是否是重新答题
  const isReAnswer = questAnswerInfo?.value.catalogId === '0';
  let catalogId = '0';
  if (isReAnswer || showStartThree.value) {
    catalogId = questAnswerInfo.value.catalogId;
  } else {
    const index = questAnswerInfo.value.catalogIdAry.findIndex(
      (item: number) => item === questAnswerInfo.value.catalogId
    );
    catalogId = index !== -1 ? questAnswerInfo.value.catalogIdAry[index + 1] : '0';
  }
  // eventBus.emit('testEvaluationFinish', { result: result.value });
  uni.navigateBack({
    delta: 2,
    animationType: 'pop-out',
    success: (res: any) => {
      console.log('goBackReloadTest---', res);
      eventBus.emit('goBackReloadTest', {
        isReAnswer,
        catalogId,
        isbn: questAnswerInfo.value.isbn,
        catalogIdAry: toRaw(questAnswerInfo.value.catalogIdAry)
      });
    }
  });
};
const goToIndex = () => {
  // eventBus.emit('testEvaluationFinish', { result: result.value });
  router.back({ delta: 3, animationType: 'pop-out' });
};
</script>

<style scoped lang="scss">
.container {
  @include normalContainer();
  /* background-color: aqua; */
}
.answer-result-bgimage {
  width: 100%;
  height: 376px;
  margin-top: -44px;
}
.answer-result-content {
  position: absolute;
  top: 0;
  @include normalFlex(column, flex-start, center);
  /* background-color: red; */
  width: 100%;
  .start-image {
    margin-top: 18px;
    width: 240px;
    height: 104px;
  }
}
.answer-result-info {
  margin-top: 16px;
  height: 160px;
  width: calc(100% - 32px);
  border-radius: 16px;
  background: #ffffff;
  @include normalFlex(column, space-around, center);
  padding: 12px 16px;
  box-sizing: border-box;
  &-normal {
    height: 56px;
    width: 100%;
    @include normalFlex(row, flex-start, center);
    padding: 12px;
    box-sizing: border-box;
    position: relative;
    .info-image {
      height: 32px;
      width: 32px;
    }
    .info-text {
      margin-left: 12px;
      font-size: 16px;
      color: #222222;
    }
  }
  .info-normal {
    border-radius: 12px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &-top {
    background: rgba(16, 174, 255, 0.1);
  }
  &-bottom {
    background: rgba(255, 183, 0, 0.1);
  }
}
.answer-result-info-catalog {
  height: 200px;
}
.answer-result-footer {
  @include normalFlex(row, space-between, center);
  position: fixed;
  width: 100%;
  bottom: 0px;
  padding: 16px;
  box-sizing: border-box;
  background-color: #f9f9f9;
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
.flower-img {
  margin-left: 8px;
  width: 58rpx;
  height: 58rpx;
}
.start-less-three {
  text-align: center;
  font-size: 14px;
  color: #666666;
  height: 20px;
  line-height: 20px;
  margin-top: 6px;
}
</style>
