<template>
  <tui-bottom-popup
    :z-index="1002"
    :mask-z-index="1001"
    :radius="false"
    :show="popupShow"
    @close="hiddenPopup"
  >
    <view class="tui-bottom-popup">
      <view class="tui-bottom-popup-top">
        <tui-input
          :value="linkText"
          clearable
          :placeholder="placeholder"
          :maxlength="maxlength"
          :focus="focus"
          :border-bottom="false"
          @input="callBackInput"
          @focus="callBackFocus"
          @blur="callBackBlur"
          @keyboardheightchange="keyboardheightchange"
        ></tui-input>
        <!-- <tui-icon name="close-fill" size="18" @click="clearInput"></tui-icon> -->
        <tui-form-button
          class="tui-bottom-popup-top-button"
          background="#4bd975"
          size="26"
          type="warning"
          width="80rpx"
          height="60rpx"
          @click="linkSure"
          >确定</tui-form-button
        >
      </view>
    </view>
  </tui-bottom-popup>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    isCommon?: boolean;
    maxlength?: number;
  }>(),
  {
    placeholder: '请输入内容',
    isCommon: false,
    maxlength: 120
  }
);
const emits = defineEmits<{
  (e: 'linkSure', linkText: string): void;
  (e: 'linkCancel'): void;
}>();
const popupShow = ref(false);
const focus = ref(false);
const clear = false;
const showPopup = () => {
  popupShow.value = true;
  nextTick(() => {
    focus.value = true;
  });
};
const hiddenPopup = () => {
  popupShow.value = false;
  focus.value = false;
  emits('linkCancel');
};
const linkText = ref('');
const callBackFocus = (e: any) => {};
const callBackBlur = (e: any) => {};
const keyboardheightchange = (e: any) => {
  if (e.height <= 0 && !clear) {
    popupShow.value = true;
    hiddenPopup();
  }
};
// const clearInput = () => {
//   linkText.value = '';
//   focus.value = true;
//   clear = true;
//   // console.log('clearInput----');
// };
const callBackInput = (e: any) => {
  linkText.value = e;
};
const linkSure = () => {
  if (props.isCommon) {
    emits('linkSure', linkText.value);
    linkText.value = '';
    hiddenPopup();
    return;
  }
  const regex = /^((http|https):\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,}){1,}(\S*)$/;
  if (regex.test(linkText.value)) {
    emits('linkSure', linkText.value);
    linkText.value = '';
  } else {
    uni.showToast({
      title: `您输入的链接地址不正确，请检查后重新输入`,
      mask: true,
      duration: 2000,
      icon: 'none',
      fail: () => {
        uni.hideToast();
      }
    });
  }
};
defineExpose({ showPopup, hiddenPopup });
</script>

<style scoped lang="scss">
.tui-bottom-popup {
  box-sizing: border-box;
  padding: 0 20px;
  height: 50px;
  &-top {
    @include normalFlex();
    height: 50px;
    /* background-color: orangered; */
    &-button {
      margin-left: 20px !important;
    }
    .tui-input__wrap {
      padding: 0 !important;
    }
  }
}
</style>
