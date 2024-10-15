<template>
  <tui-bottom-popup :z-index="1002" :mask-z-index="1001" :show="popupShow">
    <view class="tui-bottom-popup">
      <view class="tui-bottom-popup-cancel">
        <tui-icon
          custom-prefix="icon-x-chahao"
          name="iconfont"
          size="15"
          @click="hiddenPopup"
        ></tui-icon>
      </view>
      <view class="tui-bottom-popup-content">
        <tui-row margin-bottom="10px">
          <tui-col :span="7">
            <view class="tui-bottom-popup-content-left">
              <view
                v-if="recordPlayState === 1 && !isvoicePlaying"
                class="tui-bottom-popup-content-left-recording"
              >
                <image
                  class="tui-bottom-popup-content-left-recording-img"
                  mode="aspectFill"
                  :src="`${$cdn}/nb/m/uni-task-center/img/restart-record.png`"
                  @click="recordReloadClick"
                ></image>
                <text>重新开始</text>
              </view>
              <!-- #ifdef APP-PLUS || APP -->
              <view
                v-if="recordPlayState === 0 && !isvoicePlaying && recordingState === 0"
                class="tui-bottom-popup-content-left-recording"
              >
                <image
                  class="tui-bottom-popup-content-left-recording-img"
                  mode="aspectFill"
                  :src="`${$cdn}/nb/m/uni-task-center/img/choose-files.png`"
                  @click="chooseFilesClick"
                ></image>
                <text>选择文件</text>
              </view>
              <!-- #endif -->
            </view>
          </tui-col>
          <tui-col :span="10">
            <view class="tui-bottom-popup-content-center">
              <text v-if="recordPlayState === 0">{{ `${formatedRecordTime}/10:00` }}</text>
              <text v-if="recordPlayState === 1">{{
                `${formatedPlayTime}/${formatedRecordTime}`
              }}</text>
              <view class="tui-bottom-popup-content-center-recording">
                <image
                  class="tui-bottom-popup-content-center-recording-img"
                  mode="aspectFill"
                  :src="recordingImgSrc"
                  @click="recordClick"
                ></image>
                <text>{{ recordingStateText }}</text>
              </view>
            </view>
          </tui-col>
          <tui-col :span="7">
            <view class="tui-bottom-popup-content-right">
              <view v-if="recordPlayState === 1" class="tui-bottom-popup-content-right-recording">
                <image
                  class="tui-bottom-popup-content-right-recording-img"
                  mode="aspectFill"
                  :src="voicePlayStr"
                  @click="recordFinishClick"
                ></image>
                <text>{{ isvoicePlaying ? `停止播放` : `完成录音` }}</text>
              </view>
            </view>
          </tui-col>
        </tui-row>
      </view>
    </view>
  </tui-bottom-popup>
</template>

<script lang="ts" setup>
import type { audioType } from './xxtFileType';
import { $cdn } from '@/uni-module-common/config';
import utils from '@/uni-module-common/utils';
// #ifdef APP-PLUS
import permision from '@/uni-module-common/utils/permission';
import { uniShowToast } from '@/uni-module-common/utils/uiUtile';
import { uniToAppPluginBridge } from '@/uni-module-common/utils/uniToAppPluginBridge';
import {
  natToUniAudioSelected,
  uniToNatApplyPermission
} from '@/uni-module-common/utils/uniToNavProtocol';
import bridge from '@/uni-module-common/utils/uniToNativeBridge';
// #endif

// const instance = getCurrentInstance();
const props = defineProps({
  maxRecordNumber: {
    type: Number,
    default: 1
  }
});
// TS写法
const emits = defineEmits<{
  (e: 'recordFinishClick', musicSrc: string, recordTime: number): void;
}>();
const { audioAry }: any = useStore('fileUpload');
const popupShow = ref(false);
// 录制时间
const formatedRecordTime = ref('00:00');
// 播放录音时间
const formatedPlayTime = ref('00:00');
const reacordMaxTime = 600;
// 录音和播放的状态 0录音 1播放
const recordPlayState = ref(0);
// 录音状态 0:开始录制 1:停止录制 2:预览播放 3 暂停播放 4继续播放
// uni-app 1:暂停录制 2:继续录制  app不支持，只有小程序支持
const recordingState = ref(0);
const isvoicePlaying = ref(false);
let playTime = 0;
let recordTime = 0;

const recordingMap = (stateMap: any) => {
  const [start, pause, resume] = stateMap[recordPlayState.value];
  return recordPlayState.value === 0
    ? [start, pause][recordingState.value]
    : [start, pause, resume][recordingState.value - 2];
};

const recordingStateText = computed(() => {
  const stateMap: any = {
    0: ['开始录制', '停止录制'],
    1: ['预览播放', '暂停播放', '继续播放']
  };

  return recordingMap(stateMap);
});
const instance = getCurrentInstance();
const eventBus = instance!.appContext.config.globalProperties.$eventBus;
// record-play@2x
const recordingImgSrc = computed(() => {
  const stateMap: any = {
    0: [
      `${$cdn}/nb/m/uni-task-center/img/start-recording.png`,
      `${$cdn}/nb/m/uni-task-center/img/stop-record.png`
    ],
    1: [
      `${$cdn}/nb/m/uni-task-center/img/record-play.png`,
      `${$cdn}/nb/m/uni-task-center/img/pause-playback.png`,
      `${$cdn}/nb/m/uni-task-center/img/record-play.png`
    ]
  };
  return recordingMap(stateMap);
});

const voicePlayStr = computed(() => {
  return isvoicePlaying.value
    ? `${$cdn}/nb/m/uni-task-center/img/stop-record.png`
    : `${$cdn}/nb/m/uni-task-center/img/complete-recording.png`;
});

let music: UniApp.InnerAudioContext | null = null;
let recorderManager: UniApp.RecorderManager | null = null;
let recordTimeInterval: any = null;
let playTimeInterval: any = null;

// #ifdef APP-PLUS
const checkPermission = async () => {
  let status = permision.isIOS
    ? await permision.requestIOS('record')
    : await permision.requestAndroid('android.permission.RECORD_AUDIO');
  if (status === null || status === 1) {
    status = 1;
  } else if (status === 2) {
    uni.showModal({
      content: '系统麦克风已关闭',
      confirmText: '确定',
      showCancel: false,
      success(_res) {}
    });
  } else {
    uni.showModal({
      content: '需要麦克风权限',
      confirmText: '设置',
      success(res) {
        if (res.confirm) {
          permision.gotoAppSetting();
        }
      }
    });
  }
  return status;
};

const appCheckPermission = () => {
  return new Promise((resolve, reject) => {
    bridge
      .sendNativeEvent(uniToNatApplyPermission, {
        permission: 'android.permission.RECORD_AUDIO',
        content: '需要获取您的录音权限，才能录制语音消息和朗读诗词',
        permissionName: '录音',
        functionName: '无法使用录制语音消息和朗读诗词功能'
      })
      .then((res: any) => {
        switch (res.result) {
          case 'granted':
            resolve(1);
            break;
          default:
            resolve(2);
            break;
        }
        // uni.$emit('uniToNatLogin', '我是登录成功后的回调到音频权限');
        eventBus.emit('uniToNatLogin', '我是登录成功后的回调到音频权限');
      });
  });
};
// #endif

const getPermission = () => {
  return new Promise<boolean>((resolve, reject) => {
    uni.authorize({
      scope: 'scope.record',
      success() {
        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
        resolve(true);
      },
      fail(e) {
        console.log('getPermission----error---', e);
        // 打开授权页面
        uni.showModal({
          content: '麦克风权限未打开，是否去打开？',
          confirmText: '确认',
          cancelText: '取消',
          success(res) {
            console.log('getPermission----success---', res);
            if (res.confirm) {
              uni.openSetting({
                success(res) {
                  console.log(res.authSetting);
                  if (!res.authSetting['scope.record']) {
                    uni.showToast({
                      title: '麦克风权限打开失败，请重新授权',
                      icon: 'none',
                      duration: 2000
                    });
                    resolve(false);
                  } else {
                    resolve(true);
                  }
                },
                fail(e) {
                  console.log('getPermission----fail---', e);
                  uni.showToast({
                    title: `${e.errMsg},麦克风权限打开失败，请重新授权`,
                    icon: 'none',
                    duration: 2000
                  });
                  reject(e);
                }
              });
            }
          }
        });
      }
    });
  });
};

// 开始录音
const startRecord = async () => {
  // #ifdef APP-PLUS
  const platform = uni.getSystemInfoSync().platform;
  if (platform === 'android') {
    const anStatus = await appCheckPermission();
    if (anStatus !== 1) {
      return;
    }
  } else if (platform === 'ios') {
    const iosStatus = await checkPermission();
    if (iosStatus !== 1) {
      return;
    }
  }
  // #endif

  // #ifdef MP-WEIXIN
  // 如果是小程序则掉起录音授权弹窗
  try {
    const isPermission = await getPermission();
    if (!isPermission) {
      return;
    }
  } catch (error) {}
  // #endif

  clearInterval(recordTimeInterval);
  // TODO ios 在没有请求过权限之前无法得知是否有相关权限，这种状态下需要直接调用录音，但没有状态或回调判断用户拒绝
  recorderManager!.start({
    format: 'mp3',
    duration: 600000
  });
};

// 停止录音
const stopRecord = () => {
  recorderManager!.stop();
  clearInterval(recordTimeInterval);
};
const playVoice = () => {
  console.log('recording----playVoice----');
  // 设置状态为播放， 设置按钮状态为暂停播放
  recordPlayState.value = 1;
  recordingState.value = 3;
  playTimeInterval = setInterval(() => {
    playTime += 1;
    formatedPlayTime.value = utils.formatTime(playTime);
  }, 1000);
  music!.play();
};
const pauseVoice = () => {
  console.log('recording----pauseVoice----');
  clearInterval(playTimeInterval);
  // 设置状态为暂停播放， 设置按钮状态为继续播放
  recordPlayState.value = 1;
  recordingState.value = 4;
  music!.pause();
};
const recordClick = () => {
  // 0:开始录制 1:停止录制 2:预览播放 3 暂停播放 4继续播放
  switch (recordingState.value) {
    case 0:
      startRecord();
      break;
    case 1:
      stopRecord();
      break;
    case 2:
      playVoice();
      break;
    case 3:
      pauseVoice();
      break;
    case 4:
      playVoice();
      break;
    default:
      break;
  }
};
const normalMusic = () => {
  console.log('recording----normalMusic----');
  clearInterval(playTimeInterval);
  const playTimeer = 0;
  recordPlayState.value = 1;
  recordingState.value = 2;
  playTime = playTimeer;
  formatedPlayTime.value = utils.formatTime(playTime);
  isvoicePlaying.value = false;
};
const recordReloadClick = () => {
  music!.src = '';
  recordPlayState.value = 0;
  recordingState.value = 0;
  isvoicePlaying.value = false;
  recorderManager!.stop();
  // music!.stop();
  clearInterval(recordTimeInterval);
  recordTime = 0;
  formatedRecordTime.value = utils.formatTime(recordTime);
};
// 选择文件
const chooseFilesClick = () => {
  if (audioAry.value.length >= props.maxRecordNumber) {
    uniShowToast(`您最多可以上传${props.maxRecordNumber}个音频文件`);
    return;
  }
  const maxSize = 1024 ** 2 * 20;
  const selectedList = audioAry.value
    .filter((item: audioType) => !item.isNetwork)
    .map((item: audioType) => ({
      fileId: item.audioId,
      filePath: item.audioPath,
      fileName: item.audioName
    }));
  // #ifdef APP-PLUS
  uniToAppPluginBridge.gotoChooseFile({
    selectedList,
    maxNum: props.maxRecordNumber,
    maxSize,
    fileTypeList: [2]
  });
  // #endif
};
const showPopup = () => {
  popupShow.value = true;
};
const hiddenPopup = () => {
  popupShow.value = false;
  recordReloadClick();
};
const recordFinishClick = () => {
  if (isvoicePlaying.value) {
    music!.stop();
  } else {
    emits('recordFinishClick', music!.src, recordTime);
    hiddenPopup();
  }
};
onMounted(() => {
  console.log('getRecorderManager-----onMounted---');
  uni.hideLoading();
  // #ifndef H5
  music = uni.createInnerAudioContext();
  // 音频自然播放结束事件
  music.onEnded(() => {
    normalMusic();
  });
  music.onPlay(() => {
    isvoicePlaying.value = true;
  });
  music.onStop(() => {
    if (popupShow.value) {
      normalMusic();
    }
  });
  music.onPause(() => {
    // isvoicePlaying.value = true;
  });
  recorderManager = uni.getRecorderManager();
  console.log('getRecorderManager-----', recorderManager);
  recorderManager.onStart(() => {
    recordingState.value = 1;
    recordPlayState.value = 0;
    recordTimeInterval = setInterval(() => {
      recordTime += 1;
      formatedRecordTime.value = utils.formatTime(recordTime);
      if (recordTime >= reacordMaxTime) {
        stopRecord();
      }
    }, 1000);
  });
  recorderManager.onStop((res: { tempFilePath: any }) => {
    if (popupShow.value) {
      console.log('recording----recorderManager.onStop----');
      recordingState.value = 2;
      recordPlayState.value = 1;
      clearInterval(recordTimeInterval);
      music!.src = res.tempFilePath;
    }
  });
  recorderManager.onError(() => {});
  recorderManager.onPause((res) => {});
  // #endif
});

// #ifdef APP-PLUS
uni.$on(natToUniAudioSelected, (data: any) => {
  console.log('recording----natToUniAudioSelected----');
  const audioFile = data.fileList[0];
  recordingState.value = 2;
  recordPlayState.value = 1;
  recordTime = audioFile.audioDuration;
  formatedRecordTime.value = utils.formatTime(recordTime);
  music!.src = audioFile.filePath;
});
// #endif
defineExpose({ showPopup, hiddenPopup });
</script>

<style scoped lang="scss">
@mixin normalRecording($bgColor: red, $textColor: #4bd975, $fontSize: 16px) {
  @include normalFlex(column, flex-start);
  align-items: center;
  margin: 0 auto;
  margin-top: 10px;
  height: 100%;
  font-weight: 400;
  /* background-color: $bgColor; */
  font-size: $fontSize;
  color: $textColor;
}
@mixin norRightCenter($padding: 30px, $bgColor: yellow) {
  padding-top: $padding;
  height: 190px;
  /* background-color: $bgColor; */
  text-align: center;
}
.tui-bottom-popup {
  height: 230px;
  /* background-color: bisque; */
  @include normalFlex(column, flex-start, space-between);
  &-cancel {
    box-sizing: border-box;
    padding: 10px;
    padding-left: 20px;
    height: 40px;
    /* background-color: aqua; */
    vertical-align: middle;
  }
  &-content {
    flex: 1;
    /* background-color: aquamarine; */
    &-left {
      @include norRightCenter(53px, yellow);
      & > &-recording {
        @include normalRecording(darkcyan, #222, 14px);
      }
    }
    &-center {
      @include norRightCenter(30px, aquamarine);
      font-size: 18px;
      & > &-recording {
        @include normalRecording(red, #4ad975);
      }
    }
    &-right {
      @include norRightCenter(53px, burlywood);
      & > &-recording {
        @include normalRecording(darkcyan, #222, 14px);
      }
    }
  }
}
.tui-bottom-popup-content-center-recording,
.tui-bottom-popup-content-right-recording,
.tui-bottom-popup-content-left-recording {
  &-img {
    margin-bottom: 6px;
    width: 80px;
    height: 80px;
    /* background-color: orange; */
  }
}
.tui-bottom-popup-content-right-recording,
.tui-bottom-popup-content-left-recording {
  &-img {
    margin-top: 20px;
    margin-bottom: 6px;
    width: 38px;
    height: 38px;
    /* background-color: orange; */
  }
}
</style>
