<template>
  <view class="container" :class="isH5 ? 'h5-class' : ''">
    <!-- #ifdef MP-WEIXIN -->
    <tui-notice-bar
      single
      is-left
      is-right
      height="88"
      background-color="#dff8e8"
      color="#4AD975"
      :padding="['0rpx', '24rpx', '0rpx', '24rpx']"
      content="此投诉为本小程序自有投诉渠道，非微信官方投诉渠道"
    >
    </tui-notice-bar>
    <!-- #endif -->
    <view class="content-box">
      <view style="flex-shrink: 0; padding: 40rpx 22rpx 0">
        <view class="complain-title">请选择投诉原因</view>
      </view>
      <view class="complain-reason-box">
        <scroll-view scroll-y style="height: 100%">
          <!-- <view style="padding: 0 22rpx">
            <view v-for="item in 100" :key="item">{{ item }}</view>
          </view> -->
          <view style="padding: 0 22rpx">
            <tui-radio-group :value="checkReason">
              <view v-for="reason in complainReasons" :key="reason.id" class="complain-reason">
                <view class="thorui-align__center">
                  <tui-radio
                    :checked="reason.checked"
                    :value="`${reason.id}`"
                    color="#4AD975"
                  ></tui-radio>
                </view>
                <view class="reason-des" @click="radioChange(reason)">{{ reason.name }}</view>
              </view>
            </tui-radio-group>
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="footer">
      <tui-button
        width="260rpx"
        height="80rpx"
        shape="circle"
        :size="30"
        bold
        type="primary"
        @click="confirmComplain"
        >确定投诉</tui-button
      >
    </view>
  </view>
</template>

<script setup lang="ts">
import ajax from '@/uni-module-common/http';

// 判断是否是H5平台
const isH5 = ref(true);
isH5.value = false;
// #ifdef H5
isH5.value = true;
// #endif

// 投诉原因
const complainReasons = [
  { name: '欺诈', id: '1', checked: true },
  { name: '广告', id: '2', checked: false },
  { name: '不实信息', id: '3', checked: false },
  { name: '违法', id: '4', checked: false },
  { name: '侵权', id: '5', checked: false },
  { name: '侵犯未成年人权益', id: '6', checked: false },
  { name: '政治敏感', id: '7', checked: false },
  { name: '其它', id: '8', checked: false }
];

// 选中项
const checkReason = ref('1');

// 举报业务类型以及资源标识
const complainDate = reactive({ complaintType: 1, businessId: 1 });

const radioChange = (reason: any) => {
  checkReason.value = reason.id;
};

/**
 * 确认投诉
 */
const confirmComplain = async () => {
  console.log(checkReason.value);

  const url = '/circle/complaint/addcomplaint';
  await ajax({
    url,
    method: 'POST',
    data: {
      ...complainDate,
      complaintWhy: Number(checkReason.value),
      complaintDesc: ''
    }
  });
  // 返回之前的页面
  uni.navigateBack({
    delta: 1,
    success() {
      uni.showToast({ icon: 'none', title: '您已投诉成功' });
    }
  });
};

onLoad((options: any) => {
  const { cType, bId } = options;
  complainDate.complaintType = parseInt(cType || 0, 10);
  complainDate.businessId = parseInt(bId || 0, 10);
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  position: fixed;
  top: 0;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  background-color: #f9f9f9;
}
.h5-class {
  top: 44px;
  height: calc(100vh - 44px);
}
.content-box {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
  margin: 16px;
  border-radius: 11px;
  background-color: #fff;
  .complain-title {
    padding-bottom: 14px;
    border-bottom: 1px solid #e6e6e6;
    font-weight: bold;
    font-size: 18px;
    color: #222;
  }
  .complain-reason-box {
    overflow: hidden;
    flex: 1;
    background-color: #fff;
    .complain-reason {
      display: flex;
      align-items: center;
      gap: 0 13px;
      padding: 15px 0;
      .reason-des {
        font-size: 17px;
        color: #222;
      }
    }
  }
}
.footer {
  flex-shrink: 0;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 33px 0 50px;
}
.footer :deep(.tui-btn) {
  background-color: #4ad975 !important;
}
</style>
