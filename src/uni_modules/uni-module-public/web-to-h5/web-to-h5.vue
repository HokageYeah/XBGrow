<template>
  <view>
    <xxt-webview-to-h5
      v-if="webUrl"
      :url="webUrl"
      :unimp="unimp"
      :comm-token="commToken"
      :is-login="isLogin"
    ></xxt-webview-to-h5>
  </view>
</template>

<script setup lang="ts">
// import { PUSH_URL } from '@/pages/config/index';

const webUrl = ref('');
const unimp = ref('unimpParams=1');
const commToken = ref('');
const isLogin = ref(false);

onLoad(async (_opt) => {
  console.log('_opt:: ', _opt);
  let tmpUnimp: any = {};
  if (_opt?.unimp) {
    try {
      tmpUnimp = JSON.parse(_opt.unimp);
      const keys = Object.keys(tmpUnimp);
      for (let i = 0; i < keys.length; i++) {
        const e = keys[i];
        const param = tmpUnimp[e];
        if (i === 0) {
          unimp.value = `${e}=${param}`;
        } else {
          unimp.value += `&${e}=${param}`;
        }
      }
    } catch (error) {
      unimp.value = _opt.unimp;
    }
  }
  commToken.value = _opt?.commToken || '';
  isLogin.value = _opt?.isLogin === 'true';
  webUrl.value = decodeURIComponent(_opt?.url);
  // console.log('PUSH_URL:: ', PUSH_URL);
});
</script>
