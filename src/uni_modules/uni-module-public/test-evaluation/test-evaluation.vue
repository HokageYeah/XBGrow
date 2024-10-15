<template>
  <view class="container">
    <view class="book-content">
      <tui-lazyload-img
        width="240rpx"
        height="316rpx"
        mode="aspectFill"
        :src="bookInfo.covers && bookInfo.covers[0]"
        radius="8rpx"
      ></tui-lazyload-img>
      <tui-text
        :text="bookInfo.bookName"
        style="margin-top: 16px"
        :size="32"
        color="#222222"
        font-weight="600"
      ></tui-text>
      <view class="book-zhangjie">
        <tui-text text="测试范围" :size="28" color="#666666" font-weight="400"></tui-text>
        <tui-text
          :text="bookCatalogRes.etestRange"
          :size="32"
          color="#222"
          font-weight="600"
        ></tui-text>
      </view>
    </view>
    <view class="bottom-one-btn">
      <tui-form-button
        background="#4AD975"
        height="96rpx"
        radius="50px"
        size="32"
        bold
        :disabled="!bookCatalogRes.questList || !bookCatalogRes.questList.length"
        @click="clickBottomBtn"
        >开始答题</tui-form-button
      >
    </view>
    <testIntegralModal
      v-model:show="flowerShowModal"
      :top-img="`${$cdn}/nb/m/uni-zhyd/img/my-flower-icon-star.png`"
    >
      <view style="margin-top: 10rpx; text-align: center">
        <view style="font-weight: bold; font-size: 16px; color: #222">小红花数量不足</view>
        <view style="font-size: 14px; color: #222; margin-top: 20px"
          >重新答题需要消耗一朵小红花</view
        >
        <view style="margin-top: 20px">
          <tui-form-button
            radius="50px"
            background="#4AD975"
            color="#FFFFFF"
            height="72rpx"
            @click="flowerShowModal = false"
            >我知道了</tui-form-button
          >
        </view>
      </view>
    </testIntegralModal>
    <tui-modal
      :show="integralModal"
      content="重新答题将消耗一朵小红花"
      color="#333"
      :size="32"
      :button="button6"
      @click="handleClick"
    ></tui-modal>
  </view>
</template>

<script setup lang="ts">
import {
  getBookBaseByIsbnApplet,
  getConsumeReward,
  getQuestionByBookCatalog
} from './api-hooks/test-evaluation-request-api';
import testIntegralModal from './components/test-integral-modal.vue';
import { appModuleConfig } from '@/uni-module-common/config';
const instance: any = getCurrentInstance();
const eventBus = instance!.appContext.config.globalProperties.$eventBus;
const bookCatalogRes = ref<any>({});
const bookInfo = ref<any>({});
// model弹窗
const flowerShowModal = ref(false);
// 消耗积分弹窗
const integralModal = ref(false);
const button6 = ref([
  {
    text: '取消',
    type: 'gray'
  },
  {
    text: '确定',
    type: 'green'
  }
]);
let optionIsbn = '';
let optionCatalogId = '0';
let optionCatalogIdAry: any = [];
const reqiestBooksAPI = async (isbn: string, catalogId: string) => {
  const params = {
    isbn,
    catalogId: catalogId === '0' ? '' : catalogId
  };
  // 获取题的信息
  bookCatalogRes.value = await getQuestionByBookCatalog(params);
  // 获取书的信息
  bookInfo.value = await getBookBaseByIsbnApplet(params);
};
onLoad(async (opt: any) => {
  const { isbn, catalogId, catalogIdAryStr } = opt;
  console.log('onLoad----isbn---catalogId---catalogIdAryStr', isbn, catalogId, catalogIdAryStr);
  optionIsbn = isbn;
  optionCatalogId = catalogId;
  optionCatalogIdAry = catalogIdAryStr.split(',').map((item: string) => item || '0');
  reqiestBooksAPI(optionIsbn, optionCatalogId);

  // 重新加载题目
  eventBus.on('goBackReloadTest', (data: any) => {
    console.log('goBackReloadTest---data---', data);
    optionIsbn = data.isbn;
    optionCatalogId = data.catalogId;
    optionCatalogIdAry = data.catalogIdAry;
    bookCatalogRes.value = {};
    bookInfo.value = {};
    reqiestBooksAPI(optionIsbn, optionCatalogId);
  });
});
const navgateToPage = () => {
  uni.navigateTo({
    url: '/uni_modules/uni-module-public/test-evaluation/test-answer',
    success: (res: any) => {
      console.log('goToAnswerPageSuccess', bookCatalogRes.value.questList);
      res.eventChannel.emit('goToAnswerPageSuccess', {
        bookCatalogRes: {
          ...bookCatalogRes.value,
          isbn: optionIsbn,
          catalogId: optionCatalogId,
          catalogIdAry: optionCatalogIdAry
        }
      });
    }
  });
};
const handleClick = async (e: any) => {
  console.log('handleClick', e);
  const index = e.index;
  integralModal.value = false;
  if (index === 1) {
    // 调用测评消耗奖励接口
    const res = await getConsumeReward({
      isbn: optionIsbn,
      hostId: appModuleConfig.hostId,
      catalogId: optionCatalogId === '0' ? '' : optionCatalogId
    });
    navgateToPage();
  }
};
const clickBottomBtn = () => {
  // answerFlag为true 且useRewardFlag为false 则证明是首次答题，不需要消耗小红花 直接答题
  if (bookCatalogRes.value.answerFlag && !bookCatalogRes.value.useRewardFlag) {
    navgateToPage();
  } else if (bookCatalogRes.value.answerFlag && bookCatalogRes.value.useRewardFlag) {
    // 重新答题且有小红花需要消耗一朵小红花,弹窗提示
    integralModal.value = true;
  } else if (!bookCatalogRes.value.answerFlag) {
    // 再次答题，无小红花余额false, 弹窗提示无小红花
    flowerShowModal.value = true;
  }
};
</script>

<style scoped lang="scss">
.container {
  @include normalContainer();
  padding: 16px;
  box-sizing: border-box;
  background-color: #f9f9f9;
}
.book-content {
  width: 100%;
  height: 328px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 16px;
  border-radius: 8px;
  @include normalFlex(column, flex-start, center);
}
.book-zhangjie {
  @include normalFlex(column, space-between, center);
  margin-top: 16px;
  padding: 16px;
  box-sizing: border-box;
  background: #f9f9f9;
  width: 100%;
  height: 83px;
  border-radius: 12px;
}
.bottom-one-btn {
  position: fixed;
  width: 90%;
  bottom: 16px;
  left: 50%;
  box-sizing: border-box;
  transform: translateX(-50%);
}
</style>
