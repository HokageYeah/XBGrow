<template>
  <view class="receiver-sign">
    <tui-row>
      <tui-col span="2">
        <view class="transform transform-btn" style="margin-top: 66vh">
          <tui-form-button
            plain
            btn-size="mini"
            radius="60rpx"
            :background="greenColor"
            :color="greenColor"
            @click="onClick('clear')"
          >
            重写
          </tui-form-button>
        </view>
        <view class="transform transform-btn">
          <tui-form-button
            radius="60rpx"
            btn-size="mini"
            :background="greenColor"
            @click="onClick('save')"
          >
            确定
          </tui-form-button>
        </view>
      </tui-col>
      <tui-col span="21">
        <view :style="{ width: '550rpx', height: `${pageHeight}px`, marginLeft: '28rpx' }">
          <l-signature
            ref="signatureRef"
            disable-scroll
            landscape
            :pen-color="penColor"
            :pen-size="penSize"
          ></l-signature>
        </view>
      </tui-col>
      <tui-col span="1">
        <view class="transform-text"> 请在空白区域内横向书写 </view>
      </tui-col>
    </tui-row>
  </view>
</template>

<script setup lang="ts">
import eventBus from '@/uni-module-common/utils/eventBus';

const penColor = ref('black');
const penSize = ref(5);
const url = ref('');
// const openSmooth = ref(true);
const signatureRef = ref();
const currentIdx = ref(0);
const greenColor = '#4ad975';
const pageHeight = ref(0);

const onClick = (type: string) => {
  // if (type === 'openSmooth') {
  //   openSmooth.value = !openSmooth.value;
  //   return;
  // }
  if (type === 'save') {
    signatureRef.value.canvasToTempFilePath({
      success: (res: any) => {
        // 是否为空画板 无签名
        console.log(res.isEmpty, res.tempFilePath);
        // 生成图片的临时路径
        // H5 生成的是base64
        url.value = res.tempFilePath;
        eventBus.emit('publicSignature', {
          url: url.value,
          idx: currentIdx.value
        });
        uni.navigateBack();
      }
    });
    return;
  }
  if (signatureRef.value) {
    signatureRef.value[type]();
  }
};
onLoad((opt) => {
  currentIdx.value = parseInt(opt?.idx);
  pageHeight.value = uni.getSystemInfoSync().windowHeight - 40;
});
</script>

<style lang="scss" scoped>
.receiver-sign {
  padding: 16px;
  height: 100vh;
  transform: rotate(0);
  transform-origin: 0 0;
}
// .receiver-sign :deep(.lime-signature, .lime-signature__canvas) {
//   width: 100% !important;
//   height: 100% !important;
// }
.transform {
  transform: rotate(90deg);
}
.transform-btn {
  width: 0rpx;
  height: 70px;
}
.transform-text {
  writing-mode: vertical-rl;
  text-orientation: sideways;
  color: #999;
}
</style>
