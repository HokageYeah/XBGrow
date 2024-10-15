<template>
  <view class="chat-bg">
    <tui-card :title="title">
      <template #body>
        <view class="tui-default">
          <span class="dot"></span>
          <span>{{ `先把${fileName}发送给任意好友` }}</span>
        </view>
        <view class="tui-default">
          <span class="dot"></span>
          <span>然后点击下方按钮进行选取</span>
        </view>
        <view style="padding: 16px"
          ><tui-button shape="circle" @click="chooseWxFile">从微信聊天中选取</tui-button></view
        >
        <!-- <button class="view-bottom-btn" @click="modal = true">点击弹窗</button> -->
      </template>
    </tui-card>
  </view>
  <!-- 底部按钮返回app吸附到底部 -->
  <view class="view-bottom">
    <button
      class="view-bottom-btn"
      open-type="launchApp"
      :app-parameter="callBackObj"
      @error="launchAppError"
    >
      返回到APP
    </button>
    <!-- <view class="view-bottom-btn" @click="backToApp"> 返回到APP </view> -->
  </view>
  <tui-modal :show="modal" custom>
    <view class="tui-modal-custom">
      <view class="tui-modal-custom-title">确认上传并返回APP</view>
      <view class="tui-modal-custom-text">{{ customText }}</view>
      <view class="tui-modal-custom-btn">
        <!-- <button class="tui-modal-custom-btn-cancel" @click="modal = false">取消</button>
        <button
          class="tui-modal-custom-btn-sure"
          open-type="launchApp"
          :app-parameter="callBackObj"
          @error="launchAppError"
        >
          确定
        </button> -->
        <!-- <tui-button
          width="100px"
          height="40px"
          type="black"
          shape="circle"
          plain
          @click="modal = false"
          >取消</tui-button
        > -->
        <tui-button
          width="100px"
          height="40px"
          type="primary"
          shape="circle"
          open-type="launchApp"
          :app-parameter="callBackObj"
          >确定</tui-button
        >
      </view>
    </view>
  </tui-modal>
</template>

<script setup lang="ts">
import {
  dealWithFile,
  dealWithImage,
  dealWithVideo,
  useChooseMessageFile
} from '@/uni-module-common/components/xxt-components/xxt-file-submit/useChooseMedia';
import { uploadFilesCallBack } from '@/uni-module-common/http';

// fileType WX_TYPE_IMAGE(1),WX_TYPE_AUDIO(2),WX_TYPE_VIDEO(3),WX_TYPE_DOC(4)
const fileType = ref(0);
let chooseNum = 0;
const modal = ref(false);
const customText = ref('');
let extensions: string[];
let fileIdentity = '';
// 附件类型：1图片；2语音；3视频；4文件；5链接
const typeObj: any = {
  0: {
    text: '',
    type: ''
  },
  1: {
    text: '图片',
    type: 'image'
  },
  2: {
    text: '语音',
    type: 'voice'
  },
  3: {
    text: '视频',
    type: 'video'
  },
  4: {
    text: '文件',
    type: 'file'
  }
};
const {
  imageAry,
  videoAry,
  fileAry,
  audioAry,
  updateImgAry,
  updateVideoAry,
  updateFileAry,
  updateAudioAry,
  uploadAllFilesUni,
  updateUploadUrlApi,
  clearAllFilesCache
}: any = useStore('fileUpload');
const fileName = computed(() => {
  return typeObj[fileType.value].text || '';
});
const title = reactive({
  text: '从聊天中选取',
  color: '#222222',
  size: 32
});
const uploadApiUrl = ref('');
let titleTExt = '';
const backToApp = () => {
  console.log('backToApp');
};
const handleClick = () => {
  console.log('handleClick');
};
const chooseWxFile = async () => {
  const res = await useChooseMessageFile(
    0,
    chooseNum,
    typeObj[fileType.value].type,
    typeObj[fileType.value].type,
    extensions
  );
  console.log('chooseWxFile-fileType123--', fileType.value, fileType.value === 1);
  console.log('chooseWxFile-fileTypeValue--', typeof fileType.value);
  // 图片
  if (fileType.value === 1) {
    console.log('chooseWxFile-fileType--fileType.value--', fileType.value);
    dealWithImage(res, (imgary: any) => {
      titleTExt = '图片';
      console.log('chooseWxFile-imgary--', imgary);
      updateImgAry([...imageAry!.value!, ...imgary]);
      console.log('chooseWxFile-imageAry--', imageAry.value);
    });
  } else if (fileType.value === 2) {
    // 语音
  } else if (fileType.value === 3) {
    // 视频
    dealWithVideo(res, (videoList: any) => {
      titleTExt = '视频';
      updateVideoAry([...videoAry!.value!, ...videoList]);
    });
  } else if (fileType.value === 4) {
    // 文件
    dealWithFile(res, (tempFiles: any) => {
      titleTExt = tempFiles[0].fileName;
      updateFileAry([...fileAry.value, ...tempFiles]);
    });
  }
  // 开始上传附件信息
  uploadAllFilesUni(fileIdentity); // 上传
  console.log('chooseWxFile---', res);
};
let callBackObj = '';
/**
 * 监听上传回调事件
 */
uni.$on(
  uploadFilesCallBack,
  (data: { code: number; fileIdentity: string; fileObj: { [key: number]: string[] } }) => {
    // 附件类型：1图片；2语音；3视频；4文件；5链接
    if (data.code === 1 || data.code === 3) {
      // 附件上传成功
      callBackObj = JSON.stringify({
        fileType: fileType.value,
        fileIdentify: data.fileIdentity,
        fileIds: data.fileObj[fileType.value]
      });
      customText.value = `确认上传 ${titleTExt} 吗？`;
      modal.value = true;
      console.log('监听上传回调事件----', callBackObj);
    } else if (data.code === 2) {
      // 附件上传失败
      uni.showToast({ title: '附件上传失败，请稍候重试' });
    }
  }
);
const launchAppError = (e: any) => {
  console.log(e);
  uni.showToast({ title: e.detail.errMsg });
};
const obj = JSON.stringify({
  msg: '测试传参',
  code: 123
});
onShow((opt) => {
  console.log('onshow*********------', opt);
  clearAllFilesCache();
  if (uploadApiUrl.value && uploadApiUrl.value !== 'undefined') {
    updateUploadUrlApi(uploadApiUrl.value);
  } else {
    updateUploadUrlApi('/zuul/notice/notice-attachment/upload-file');
  }
});
onLoad((opt) => {
  console.log('onLoad*********------', opt);
  fileType.value = parseInt(opt!.fileType) || 1;
  chooseNum = parseInt(opt!.chooseNum) || 1;
  console.log('onLoad*********------opt!.fileIdentify---chooseNum---', opt!.fileIdentify);
  extensions = opt?.extensions ? JSON.parse(decodeURIComponent(opt?.extensions)) : null;
  fileIdentity = opt!.fileIdentify;
  console.log('onLoad*********------opt!.fileIdentify---', opt!.fileIdentify, fileIdentity);
  uploadApiUrl.value = opt!.uploadApiUrl;

  // clearAllFilesCache();
  // updateUploadUrlApi('/zuul/notice/notice-attachment/upload-file');
  chooseWxFile();
});
</script>

<style scoped lang="scss">
/* 铺满整个屏幕，然后设置背景颜色 */
.chat-bg {
  box-sizing: border-box;
  padding: 30px 0;
  width: 100%;
  height: 100vh;
  /* 深灰色 */
  background-color: #f2f2f2;
  :deep(.tui-button__wrap button) {
    background: #4ad975 !important;
  }
  :deep(.tui-header-left text) {
    font-weight: bold;
  }
}
.view-bottom {
  /* 放到最底部，吸附到底部 */
  position: fixed;
  bottom: 40px; /* 距离底部的距离 */
  box-sizing: border-box;
  padding: 0 20px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  &-btn {
    border: 1px solid #4ad975;
    /* 设置圆角 */
    border-radius: 25px;
    background-color: #fff;
    line-height: 50px;
    font-weight: bold;
    font-size: 16px;
    color: #4ad975;
  }
}
.tui-default {
  display: flex;
  /* 主轴方向 */
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 16px 0 0;
  .dot {
    position: relative;
    margin: 0 16px;
    border-radius: 50%;
    width: 6px;
    height: 6px;
    background-color: #4ad975; /* 设置中间颜色深 */
    /* 设置边框  颜色半透明 */
    /* border: 8px solid rgba(0, 0, 0, 0.1); */
    box-shadow: 0 0 0 4px rgba(74, 217, 117, 0.2);
  }
}
.tui-modal-custom {
  display: flex;
  /* 主轴方向 */
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  &-title {
    font-weight: bold;
    font-size: 18px;
  }
  &-text {
    margin: 30px 0;
  }
  &-btn {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
}
</style>
