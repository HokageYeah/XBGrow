<template>
  <view class="container">
    <web-view :webview-styles="webviewStyles" :src="externalUrl"></web-view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  unimp: {
    type: String,
    default: ''
  },
  // 服务端保存信息的获取凭证
  commToken: {
    type: String,
    default: ''
  },
  isLogin: {
    type: Boolean,
    default: false
  }
});
const externalUrl = ref('');
const webviewStyles = ref({
  progress: {
    color: '#4bd975'
  }
});

watch(
  () => props.url,
  (newVal) => {
    if (newVal) {
      let curUrl = decodeURIComponent(newVal);
      if (props.unimp) {
        curUrl = newVal.includes('?') ? `${curUrl}&${props.unimp}` : `${curUrl}?${props.unimp}`;
      }
      // UNI_To_H5_Token、UNI_To_H5_Logined 为固定传参
      if (props.commToken) {
        curUrl = newVal.includes('?')
          ? `${curUrl}&UNI_To_H5_Token=${props.commToken}&UNI_To_H5_Logined=${props.isLogin}`
          : `${curUrl}?UNI_To_H5_Token=${props.commToken}&UNI_To_H5_Logined=${props.isLogin}`;
      }
      externalUrl.value = newVal.includes('http') ? curUrl : `https://${curUrl}`;
      console.log('externalUrl.value:: ', externalUrl.value);
    }
  },
  {
    immediate: true
  }
);
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
}
</style>
