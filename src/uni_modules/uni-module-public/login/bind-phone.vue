<template>
  <view class="container">
    <tui-text block size="48" font-weight="600" text="绑定手机号码"></tui-text>
    <tui-text
      block
      padding="8px 0px 40px 0px"
      size="28"
      color="#4AD975"
      text="首次使用第三方账号，需要绑定手机号码哦~"
    ></tui-text>
    <tui-input
      v-model="inputPhone"
      placeholder="请输入手机号码"
      maxlength="11"
      clearable
      is-fillet
    ></tui-input>
    <tui-input v-model="inputCode" placeholder="请输入验证码" is-fillet>
      <template #right>
        <view v-if="clickCodeFlag" class="phone-code" @tap="getPhoneCode">
          <text>获取验证码</text>
        </view>
        <view v-else class="phone-code">
          <text class="phone-code-status">{{ seconds }}s后重新获取</text>
        </view>
      </template>
    </tui-input>
    <tui-form-button :disabled="btnDisable" radius="50px" background="#4AD975" @click="bindClick"
      >绑定</tui-form-button
    >
  </view>
</template>

<script setup lang="ts">
import { useProcessLoginInfo, useWXProfile } from './processLoginInfoHooks';
import { getPhoneCodeAPI, loginByWxCodeAPI } from './services/login';
import { encryptAse } from '@/uni-module-common/utils/ase';
import { encodeBase64 } from '@/uni-module-common/utils/base64';
import { appModuleConfig } from '@/uni-module-common/config/';
// import { ref, reactive } from 'vue';
const clickCodeFlag = ref(true);
const inputPhone = ref('');
const inputCode = ref('');
const maxSeconds = ref(59); // 倒计时
const seconds = ref(0);
const app = getApp();
const bindPhoneCode = appModuleConfig.bindPhoneCode;
console.log('bindPhoneCode---', bindPhoneCode);
let interval: any;
const btnDisable = computed(() => {
  return !(inputPhone.value && inputCode.value);
});
// 公用函数定义
const enc = (param: string) => {
  return encodeURIComponent(param);
};
let wxCode: string;
onLoad((options: any) => {
  console.log('onLoad---', options);
  wxCode = options.wxCode;
});

onUnload(() => {
  // 关闭清除定时器
  if (interval) {
    clearInterval(interval);
  }
  console.log('清除定时器');
});
const bindClick = async () => {
  const key = `-${new Date().getTime()}`;
  const username = encodeBase64(enc(inputPhone.value));
  const smsCode = encodeBase64(encodeBase64(enc(inputCode.value)) + key);
  // uniEvent('绑定手机号', '绑定', {
  //   username
  // });
  try {
    await useWXProfile();
    // 已经绑定手机号
    const res = await loginByWxCodeAPI({
      entry: appModuleConfig.entry,
      loginDefault: false,
      wxCode,
      account: username,
      smsCode,
      key
    });
    console.log('loginByWxCodeAPI----', res);
    // processLoginInfo({ data: res });
    useProcessLoginInfo(res, 2);
  } catch (error) {}
};
/**
 * 短信验证码
 */
const getPhoneCode = async () => {
  // 电话号码
  if (!/^1[3456789][0-9]{9}/.test(inputPhone.value)) {
    uni.showToast({
      title: '您输入的手机号无效',
      icon: 'none'
    });
    return;
  }
  let currentTime = maxSeconds.value;
  seconds.value = currentTime;
  clickCodeFlag.value = false;
  interval = setInterval(function () {
    currentTime--;
    seconds.value = currentTime;
    if (currentTime <= 0) {
      clearInterval(interval);
      clickCodeFlag.value = true;
    }
  }, 1000);
  const username = encryptAse(inputPhone.value);
  // uniEvent('发送短信验证码', '绑定手机号', {
  //   mobile: username
  // });
  const res: any = await getPhoneCodeAPI({ mobile: username, funcNo: bindPhoneCode });
  console.log(res);
  if (res.content === 'success') {
    uni.showToast({
      title: '手机验证码发送成功',
      icon: 'none'
    });
  } else {
    uni.showToast({
      title: res.content,
      icon: 'none'
    });
  }
};
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  padding: 40px 16px 0;
  width: 100%; /* 设置宽度为屏幕宽度 */
  height: 100%; /* 设置高度为屏幕高度 */
  background: linear-gradient(to bottom, #c2ffd4, #c3ffe9, #fff); /* 渐变背景颜色 */
  :deep(.tui-radius__fillet) {
    left: 0 !important;
    margin-bottom: 20px;
  }
  .phone-code {
    font-size: 16px;
    color: #4ad975;
  }
  .phone-code-status {
    font-size: 16px !important;
    color: #acacac !important;
  }
}
</style>
