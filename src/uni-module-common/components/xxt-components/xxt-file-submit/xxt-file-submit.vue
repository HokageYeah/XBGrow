<template>
  <XXTImgList
    v-show="imageAry!.length !== 0"
    v-model:image-list="imageAry"
    :is-show-delete="true"
    :max-img-number="maxImgNumber"
    :is-preview-img="false"
    :is-nine-grid="isNineGrid"
    @select-img="iconClick(1)"
    @delete-image="deleteFiles"
  />
  <!-- <XXTVideoListV2
    v-if="videoList.length !== 0"
    v-model:video-list="videoList"
    :is-show-delete="true"
  /> -->
  <XXTRecordingMask
    ref="recordingMask"
    :max-record-number="maxRecordNumber"
    @record-finish-click="recordFinishClick"
  />
  <XXTLinkMask ref="linkMask" @link-sure="linkSure" />
  <XXTVideoList
    v-if="videoAry!.length !== 0"
    v-model:video-list="videoAry"
    :is-show-delete="true"
    :is-nine-grid="isNineGrid"
    @delete-video="deleteFiles"
  />
  <!-- <XXTVideoRenderjsList
    v-if="videoAry!.length !== 0"
    v-model:video-list="videoAry"
    :is-show-delete="true"
  /> -->
  <!-- <XXTVideoImgList
    v-if="videoAry!.length !== 0"
    v-model:video-list="videoAry"
    :is-show-delete="true"
  /> -->
  <XXTAudioPlayer
    v-for="item in audioAry"
    :key="item.audioPath"
    v-model:audio-ary="audioAry"
    :record-muc-str="item.audioPath"
    :record-time="item.audioTimeNum"
    :is-show-delete="true"
    @delete-audio="deleteFiles"
  />
  <XXTFileDocument
    v-for="item in fileAry"
    :key="item.fileID"
    v-model:file-ary="fileAry"
    :file-type-num="item.fileType"
    :file-name="item.fileName"
    :link-address-str="item.fileAddress"
    :is-show-delete="true"
    :file-i-d="item.fileID"
    @delete-file-document="deleteFiles"
  />
  <view v-if="computedHideChooseFile" class="file-bg">
    <!-- 附件类型：1图片；2语音；3视频；4文件；5链接 -->
    <XXTIconButton
      v-for="item in computedIconBtns"
      :key="item.id"
      :icon-obj="item"
      :is-must-file="fileMustTypes.includes(item.type)"
      class="file-bg-icon-btn"
      @icon-click="iconClick(item.type)"
    />
    <xxt-compress ref="wCompress" />
    <l-shrink ref="shrinkRef"></l-shrink>
    <!-- <canvas id="myCanvas" canvas-id="myCanvas" style="border: 1px solid; background: #123456" /> -->
  </view>
  <!-- <view>-----------------</view>
  <view
    >ios最新的---videoTxtData展示的内容是：{{
      videoTxtData && videoTxtData.substring(0, 100)
    }}</view
  >
  <view>-----------------</view>
  <view
    >---uri222--------------{{ moduleUrl }} ---filePath222--------------{{ filePath }}
    <video
      v-if="filePath"
      :src="filePath"
      x5-playsinline="true"
      playsinline="true"
      webkit-playsinline="true"
      x-webkit-airplay="true"
      x5-video-orientation="portraint"
      controls
      controlslist="nodownload noplaybackrate"
      disablePictureInPicture
      width="260"
      height="160"
    />
    <image
      style="width: 200px; height: 200px; background-color: #eee"
      mode="scaleToFill"
      :src="imagePaths"
    ></image>
  </view>
  <view>----path-------------{{ modulePath }}</view> -->
  <!-- <view>----base64-------------{{ moduleBase.substring(0, 100) }}</view> -->

  <!-- <view>videoTxtData展示的内容是Path：{{ videoTxtData && JSON.stringify(videoTxtData) }}</view>
  <view>-----------------</view>
  <view>videoTxtData展示的内容是parse：{{ videoTxtData && JSON.parse(videoTxtData) }}</view>
  <view>-----------------</view>
  <view>videoTxtData展示的内容是tostring：{{ videoTxtData && videoTxtData.toString() }}</view> -->
  <!-- <view>-----------------</view> -->
</template>

<script setup lang="ts">
import XXTIconButton from './xxt-icon-button.vue';
import XXTImgList from './xxt-img-list.vue';
import XXTVideoList from './xxt-video-list.vue';
// import XXTVideoRenderjsList from './xxt-video-renderjs-list.vue';
import XXTRecordingMask from './xxt-recording-mask.vue';
import XXTFileDocument from './xxt-file-document.vue';
import XXTLinkMask from './xxt-link-mask.vue';
import XXTAudioPlayer from './xxt-audio-player.vue';
import type {
  allHttpRequestFilesType,
  audioType,
  fileType,
  imageObjType,
  videoType
} from './xxtFileType';
import { iconBtns } from './xxtFileCommonData';
import { getData } from './xxtFilesManager';
// import { base64DataDraw } from './xxtFilesManageDraw';
import {
  dealWithFile,
  dealWithImage,
  dealWithVideo,
  fileTypesMap,
  getfileListbyType,
  uniToNatChooseWxFileFun,
  useDiffMediaFile,
  useShowActionSheet
} from './useChooseMedia';
import {
  natToUniEditedImg,
  natToUniFilesSelected,
  natToUniImageEditing,
  natToUniImagePreview,
  natToUniImageSelected,
  natToUniOnChoosedWxFile,
  natToUniVideoSelected
} from '@/uni-module-common/utils/uniToNavProtocol';
import { uniToAppPluginBridge } from '@/uni-module-common/utils/uniToAppPluginBridge';
import { uniShowToast } from '@/uni-module-common/utils/uiUtile';
import { isIosMoreVersion, isNetworkUrl } from '@/uni-module-common/utils/util';
import { compressImage, showImageCacheMB } from '@/uni-module-common/utils/imageTools';
import { uniEmitsWxFileIdentify } from '@/uni-module-common/utils/uniEmitsProtocol';
type iconBtnsType = typeof iconBtns;
const props = withDefaults(
  defineProps<{
    maxImgNumber?: number;
    maxVideoNumber?: number;
    maxRecordNumber?: number;
    maxFileNumber?: number;
    // 是否展示微信聊天选择
    isShowWXChat?: boolean;
    // 需要传入不同模块下的上传地址，默认任务中心
    urlApi?: string;
    // 不同模块获取文件列表的url
    getFileUrlApi?: string;
    // 附件必需提交的数组列表（显示必交图标） //  附件类型：1图片；2语音；3视频；4文件；5链接
    fileMustTypes?: number[];
    // 适配班级圈只能显示图片和视频两个按钮,可以自定义显示几个按钮
    allIconBtns: iconBtnsType;
    // 是否隐藏选择附件的按钮
    isHideChooseFile?: boolean;
    // 是否显示班级圈图片九宫格、以及视频的全屏展示(设置后，相册九宫格展示，超过9张展示+更多, 视频全屏幕展示)
    isNineGrid?: boolean;
    // 视频录制的最大时长，默认10秒，最长60s（只对微信有用）
    maxVideoDuration?: number;
    /** 原声app内是否有微信聊天选择按钮 (此属性必须在isShowWXChat 为true时设置，才会生效。也就是如果isShowWXChat为
    false，表示不需要展示微信聊天选择按钮，微信端和原声app端都不会显示。 如果isShowWXChat为true，isNotHasWxUploadBtn生效，此时isNotHasWxUploadBtn
    true时，表示微信端有微信聊天选择按钮，原声app端没有微信聊天选择按钮 )
    */
    // 是否不显示原声app 微信聊天选择按钮。
    isNotHasWxUploadBtn?: boolean;
  }>(),
  {
    maxImgNumber: 9,
    maxVideoNumber: 1,
    maxRecordNumber: 1,
    maxFileNumber: 1,
    isShowWXChat: false,
    urlApi: '/zuul/task-center/task-attachment/upload-file',
    getFileUrlApi: '/notice/notice-attachment/get-file-list-by-batch',
    fileMustTypes: (): number[] => [],
    allIconBtns: (): iconBtnsType => [],
    isHideChooseFile: false,
    isNineGrid: false,
    maxVideoDuration: 10,
    isNotHasWxUploadBtn: false
  }
);
const recordingMask: any = ref<HTMLDivElement>();
const linkMask: any = ref<HTMLDivElement>();
const videoTxtData = ref('');
const instance = getCurrentInstance();
const eventBus = instance!.appContext.config.globalProperties.$eventBus;
const computedIconBtns = computed(() => {
  return props.allIconBtns && props.allIconBtns.length > 0 ? props.allIconBtns : iconBtns;
});
// filetype: 0 是链接。 1 是docx、 2 pdf、 3 ppt、 4 txt
const {
  imageAry,
  videoAry,
  fileAry,
  audioAry,
  localDeleteFileList,
  updateImgAry,
  updateVideoAry,
  updateFileAry,
  updateAudioAry,
  updateShrinkRef,
  updateUploadUrlApi,
  allHttpRequestFiles,
  updateAllHttpRequestFiles,
  updateMustFilesType
}: any = useStore('fileUpload');
const computedHideChooseFile = computed(() => {
  if (props.isHideChooseFile) {
    // 只要图片、视频、文件、语音有一个有值就隐藏
    return (
      !imageAry.value.length &&
      !videoAry.value.length &&
      !fileAry.value.length &&
      !audioAry.value.length
    );
  }
  return !props.isHideChooseFile;
});

updateUploadUrlApi(props.urlApi);
updateMustFilesType(props.fileMustTypes);
// filetype: 0 是链接。 1 是docx、 2 pdf、 3 ppt、 4 txt
// const fileAry = ref<fileType[]>([]);
const wCompress: any = ref(null);
const shrinkRef: any = ref(null);
let fileIdentity = '';
const chooseAlbum = () => {
  if (imageAry!.value!.length >= props.maxImgNumber) {
    uni.showToast({
      title: `最多选择${props.maxImgNumber}张图片`,
      mask: true,
      duration: 2000,
      icon: 'none',
      fail: () => {
        uni.hideToast();
      }
    });
    return;
  }
  // todo 微信小程序适配
  // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
  uni.chooseImage({
    count: props.maxImgNumber - imageAry!.value!.length,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: async (res: any) => {
      // 预览图片
      // updateImgAry([...imageAry!.value!, ...res.tempFiles]);
      getData(res.tempFiles[0].path).then((txtData) => {
        videoTxtData.value = `${videoTxtData.value + txtData}-----\n`;
      });

      console.log('uni图片选择-tempFilePaths-??-', res.tempFilePaths[0]);
      console.log('最新图片压缩结果imgshrikres--结果：', shrinkRef.value);
      // const ctx = uni.createCanvasContext('myCanvas');
      // console.log('最新图片压缩结果imgshrikres--结果--ctx：', ctx);
      // ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100);
      // ctx.draw();

      const imgary = [];
      for (const item of res.tempFiles) {
        console.log('图片压缩结果imgary--item.path---', item.path);
        let compressImg = '';
        if (!isNetworkUrl(item.path)) {
          // item.path = await shrinkRef.value.compressImage(item.path, {
          //   quality: 80
          // });
          compressImg = (await compressImage(item.path)) as string;
          // uni.saveImageToPhotosAlbum({
          //   filePath: compressImg,
          //   success(res) {
          //     console.log('图片压缩结果imgary---图片保存成功', res);
          //   },
          //   fail(result) {
          //     console.log('图片压缩结果imgary---图片保存失败', result);
          //   }
          // });

          console.log('图片压缩结果imgary--item.imgPath-after--', compressImg);
        }
        console.log('图片压缩结果imgary--item.imgPath-after-ddd-', compressImg);

        const imgObj = {
          path: compressImg,
          bigImageUrl: compressImg,
          fileId: item.fileId,
          size: 0,
          isNetwork: isNetworkUrl(compressImg)
        };

        imgary.push(imgObj);
      }
      updateImgAry([...imageAry!.value!, ...imgary]);
      await showImageCacheMB('_doc/');
      // await clearImageCacheMB('_doc/');
      // await showImageCacheMB('_doc/');
      console.log('showImageCacheMB---出来了---？？-');
      console.log('图片压缩结果imgary--', imgary);

      // const imgshrikres = await shrinkRef.value.compressImage(res.tempFilePaths[0], {
      //   quality: 80
      // });
      // uni.saveImageToPhotosAlbum({
      //   filePath: imgshrikres,
      //   success() {
      //     console.log('save success---imgshrikres');
      //   }
      // });

      // wCompress.value
      //   .start(res.tempFilePaths[0], {
      //     pixels: 4000000, // 最大分辨率，默认二百万
      //     quality: 0.8, // 压缩质量，默认0.8
      //     type: 'jpg', // 图片类型，默认jpg
      //     base64: false // 是否返回base64，默认false，非H5有效
      //   })
      //   .then((res: any) => {
      //     console.log('图片压缩结果：', res);
      //     uni.saveImageToPhotosAlbum({
      //       filePath: res,
      //       success() {
      //         console.log('图片压缩结果-save success---imgshrikres');
      //       }
      //     });
      //   })
      //   .catch((e: any) => {
      //     console.log('图片压缩报错：', e);
      //   });
    }
  });
};
// 视频选择
const chooseVideo = () => {
  uni.chooseVideo({
    sourceType: ['camera', 'album'],
    success(res: any) {
      updateVideoAry([
        ...videoAry!.value!,
        { videoPath: res.tempFilePath, videoSize: res.size, videoImgPath: '' }
      ]);
      getData(res.tempFilePath).then((txtData) => {
        videoTxtData.value = `${videoTxtData.value + txtData}-----\n`;
      });
      // base64DataDraw(res.tempFilePath);
    }
  });
};
const recordFinishClick = (musicSrc: string, recordTime: number) => {
  const audioObj = {
    audioPath: musicSrc,
    audioTimeNum: recordTime
  };
  updateAudioAry([...audioAry.value, audioObj]);

  // #ifdef APP-PLUS
  // 20241008 和余晔沟通可以去掉，没有什么作用
  // uniToAppPluginBridge.gotoUploadFile({
  //   videoPath: musicSrc
  // });
  // #endif
};
const linkSure = (linkStr: string) => {
  const fileObj = {
    fileID: '0',
    fileAddress: linkStr,
    fileType: 0,
    fileName: linkStr,
    isNetwork: false
  };
  updateFileAry([fileObj, ...fileAry.value]);
};
const chooseAppAlbum = () => {
  console.log('chooseAppAlbum----');
  if (imageAry!.value!.length >= props.maxImgNumber) {
    uniShowToast(`最多选择${props.maxImgNumber}张图片`);
    return;
  }
  const selectedList = imageAry.value
    .filter((item: imageObjType) => !item.isNetwork)
    .map((item: imageObjType) => ({
      imgPath: item.path,
      fileId: item.fileId
    }));
  const httpImgList = imageAry.value.filter((item: imageObjType) => item.isNetwork);

  // #ifdef APP-PLUS
  uniToAppPluginBridge.gotoChooseImg({
    selectedList,
    maxNum: props.maxImgNumber,
    selectableNum: props.maxImgNumber - httpImgList.length,
    index: 0
  });
  // #endif
};

const chooseAppVideo = () => {
  if (videoAry.value.length >= props.maxVideoNumber) {
    uniShowToast(`您最多可以上传${props.maxVideoNumber}个视频文件`);
    return;
  }
  const selectedList = videoAry.value
    .filter((item: videoType) => !item.isNetwork)
    .map((item: videoType) => {
      return item.videoPath;
    });
  // #ifdef APP-PLUS
  uniToAppPluginBridge.gotoChooseVideo({
    selectedList,
    maxNum: props.maxVideoNumber,
    selectableNum: props.maxVideoNumber - selectedList.length,
    videoDurationLimit: 120
  });
  // #endif
};

const chooseAppFiles = () => {
  if (fileAry.value.filter((item: fileType) => item.fileType === 1).length >= props.maxFileNumber) {
    uniShowToast(`您最多可以上传1个文件`);
    return;
  }
  const maxSize = 1024 ** 2 * 10;
  const selectedList = fileAry.value
    .filter((item: fileType) => !item.isNetwork)
    .map((item: fileType) => ({
      fileId: item.fileID,
      filePath: item.fileAddress,
      fileName: item.fileName
    }));
  // #ifdef APP-PLUS
  uniToAppPluginBridge.gotoChooseFile({
    selectedList,
    maxNum: props.maxFileNumber,
    maxSize,
    fileTypeList: [4]
  });
  // #endif
};

// #ifdef APP-PLUS
const testModule = uni.requireNativePlugin('unimpmodule');
// #endif
const moduleUrl = ref('');
const moduleBase = ref('');
const modulePath = ref('');
const filePath = ref('');
const imagePaths = ref('');
const iconClick = async (type: number) => {
  console.log('iconClick-----', type, props.isShowWXChat);
  switch (type) {
    case 1:
      if (props.isShowWXChat) {
        // #ifdef MP-WEIXIN
        const res = await useDiffMediaFile(
          imageAry.value,
          ['拍照', '从手机相册选择', '从微信聊天会话中选择图片'],
          props.maxImgNumber,
          'image',
          'image',
          ['image'],
          [],
          props.maxVideoDuration || 10
        );
        dealWithImage(res, (imgary: any) => {
          updateImgAry([...imageAry!.value!, ...imgary]);
        });
        // #endif
        // #ifdef H5
        chooseAlbum();
        // #endif
        // #ifdef APP-PLUS || APP
        // app内待开发
        const newtapIndex = await useShowActionSheet(
          props.isNotHasWxUploadBtn ? ['图片'] : ['图片', '从微信聊天会话中选择图片']
        );
        newtapIndex === 0 && chooseAppAlbum();
        newtapIndex === 1 &&
          uniToNatChooseWxFileFun(
            1,
            imageAry.value.length,
            props.maxImgNumber,
            fileIdentity,
            [],
            props.urlApi
          );
        // #endif
      } else {
        // #ifdef H5
        // 图片选择
        chooseAlbum();
        // #endif
        // #ifdef APP-PLUS || APP
        // uni自己的图片选择
        chooseAppAlbum();
        // #endif
      }
      break;
    case 2:
      {
        // 录制
        if (audioAry.value.length >= props.maxRecordNumber) {
          uniShowToast(`您最多可以上传${props.maxRecordNumber}个音频文件`);
          return;
        }
        const audioObj = {
          audioPath: '/static/record_20220922_11_16_44.wav',
          audioTimeNum: 120
        };
        // updateAudioAry([...audioAry.value, audioObj]);
        recordingMask!.value.showPopup();
      }
      break;
    case 3:
      // 视频选择
      if (props.isShowWXChat) {
        // #ifdef MP-WEIXIN
        const res = await useDiffMediaFile(
          videoAry.value,
          ['拍摄', '从手机相册选择', '从微信聊天会话中选择视频'],
          props.maxVideoNumber,
          'video',
          'video',
          ['video'],
          [],
          props.maxVideoDuration || 10
        );
        dealWithVideo(res, (videoList: any) => {
          updateVideoAry([...videoAry!.value!, ...videoList]);
        });
        // #endif
        // #ifdef H5
        chooseVideo();
        // #endif
        // #ifdef APP-PLUS || APP
        // app内待开发
        const newtapIndex = await useShowActionSheet(
          props.isNotHasWxUploadBtn ? ['视频'] : ['视频', '从微信聊天会话中选择视频']
        );
        newtapIndex === 0 && chooseAppVideo();
        newtapIndex === 1 &&
          uniToNatChooseWxFileFun(
            3,
            videoAry.value.length,
            props.maxVideoNumber,
            fileIdentity,
            [],
            props.urlApi
          );
        // #endif
      } else {
        // #ifdef H5
        // uni自己的视频选择
        chooseVideo();
        // #endif
        // #ifdef APP-PLUS || APP
        chooseAppVideo();
        // uniToNativeVideoSelect();
        // #endif
      }
      break;
    case 4:
      {
        if (props.isShowWXChat) {
          // #ifdef MP-WEIXIN
          const res = await useDiffMediaFile(
            fileAry.value,
            ['从微信聊天会话中选择文件'],
            props.maxFileNumber,
            'file',
            'file',
            ['mix'],
            [],
            props.maxVideoDuration || 10
          );
          dealWithFile(res, (tempFiles: any) => {
            updateFileAry([...fileAry.value, ...tempFiles]);
          });
          // #endif
          // #ifdef APP-PLUS
          // app内待开发
          const newtapIndex = await useShowActionSheet(
            props.isNotHasWxUploadBtn ? ['文件'] : ['文件', '从微信聊天会话中选择文件']
          );
          const count = fileAry.value.filter((item: fileType) => item.fileType === 1).length;
          newtapIndex === 0 && chooseAppFiles();
          newtapIndex === 1 &&
            uniToNatChooseWxFileFun(4, count, props.maxFileNumber, fileIdentity, [], props.urlApi);
          // #endif
        } else {
          chooseAppFiles();
        }
        const filePathstr = '/storage/emulated/0/Movies/2023-12-19-095952799-crop.mp4';
        filePath.value =
          'file:///var/mobile/Containers/Data/Application/4635202D-C84B-4C21-B3EB-87655173D6CF/Documents/Pandora/apps/HBuilder/doc/uniapp_temp_1702958454266/gallery/IMG_3107_compressMedium.mp4';
        imagePaths.value =
          'file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/uniapp_temp/compressed/1702968823509_Screenshot_2023-09-11-12-08-22-96_b783bf344239542886fee7b48fa4b892.jpg';
        imagePaths.value =
          'file:///var/mobile/Containers/Data/Application/4635202D-C84B-4C21-B3EB-87655173D6CF/Documents/Pandora/apps/HBuilder/doc/uniapp_temp_1702968971732/gallery/1702541264-compressed-IMG_3114.PNG';
        // filePath.value =
        //   'file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/compress_video_1153781931.mp4';
        // path读取文件大小
        // uni.getFileInfo({
        //   filePath: filePathstr,
        //   success(res) {
        //     const aa = `path读取文件大小----：${JSON.stringify(res)} --大小`;
        //     // console.log(aa);
        //     uni.showToast({
        //       title: aa || '服务器开小差啦,请稍后再试~',
        //       icon: 'none',
        //       mask: true,
        //       duration: 5000
        //     });
        //     uni.saveFile({
        //       tempFilePath: filePathstr,
        //       success(res) {
        //         const savedFilePath = res.savedFilePath;
        //         filePath.value = savedFilePath;
        //         // console.log('这是我保存的临时文件地址-----', savedFilePath);
        //       }
        //     });
        //   },
        //   fail(err) {
        //     const aa = `path获取文件信息失败：${JSON.stringify(err)}`;
        //     uni.showToast({
        //       title: aa || '服务器开小差啦,请稍后再试~',
        //       icon: 'none',
        //       mask: true,
        //       duration: 5000
        //     });
        //     // console.log(aa);
        //   }
        // });

        // 调用异步方法
        // testModule.gotoChooseVideo(
        //   {
        //     name: '我给你传递信息了',
        //     age: 1
        //   },
        //   (ret: any) => {
        //     // console.log('我收到信息了----', JSON.stringify(ret));
        //     uni.showToast({
        //       title: ret || '服务器开小差啦,请稍后再试~',
        //       icon: 'none',
        //       mask: true,
        //       duration: 5000
        //     });
        //     // console.log('我收到信息了ret.path----', JSON.parse(ret).path);
        //     moduleUrl.value = ret.uri;
        //     modulePath.value = ret.path;
        //     filePath.value = JSON.parse(ret).path;
        //     // console.log('我收到信息了filePath.value----', filePath.value);
        //   }
        // );
      }
      break;
    case 5:
      if (fileAry.value.findIndex((item: fileType) => item.fileType === 0) !== -1) {
        uniShowToast(`您最多可以上传1个链接`);
        return;
      }
      // 链接输入
      linkMask!.value.showPopup();
      break;
    default:
      break;
  }
};

// native 回传给uni的自定义hook
// uni.$on(natToUniVideoSelected, (data: videoType[]) => {
//   // console.log('native回传给uni已经选择的视频hook----', natToUniVideoSelected, data);
//   updateVideoAry([...videoAry!.value!, ...data]);
//   data.forEach((element) => {
//     getData(element.videoPath).then((txtData) => {
//       videoTxtData.value = `${videoTxtData.value + txtData}-----\n`;
//     });
//   });
// });

const getVideoUrl = (ret: string) => {
  uni.showToast({
    title: ret || '服务器开小差啦,请稍后再试~',
    icon: 'none',
    mask: true,
    duration: 5000
  });
  // moduleUrl.value = ret.uri;
  // modulePath.value = ret.path;
  filePath.value = ret;
};
const saveFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    console.log('图片压缩保存----', filePath);
    uni.saveFile({
      tempFilePath: filePath,
      success(res) {
        console.log('图片压缩保存--success---res--', res);
        console.log('图片压缩保存--success---res.savedFilePath--', res.savedFilePath);
        resolve(res.savedFilePath);
      },
      fail(res) {
        console.log('图片压缩保存--fail---res--', res);
        reject(res);
      }
    });
  });
};
console.log('submit-create');
const mapImgPathList = async (imgPathList: any[]) => {
  const imgary = [];
  for (const item of imgPathList) {
    console.log('图片压缩保存--item.imgPath---', item.imgPath);
    let compressImg = item.imgPath;
    if (!isNetworkUrl(compressImg) && isIosMoreVersion(316)) {
      console.log('图片压缩保存---图片compressImg', compressImg);
      compressImg = (await compressImage(compressImg)) as string;
    }
    console.log('图片压缩保存--item.imgPath-after--', compressImg);

    const imgObj = {
      path: compressImg,
      bigImageUrl: item.imgPath,
      fileId: item.fileId,
      size: 0,
      isNetwork: isNetworkUrl(compressImg)
    };

    imgary.push(imgObj);
  }
  console.log('图片压缩保存--imgary---：', imgary);
  return imgary;
};

const oldmapImgPathList = (imgPathList: any[]) => {
  console.log('图片压缩结果imgary---oldmapImgPathList');
  return imgPathList.map((item: any) => ({
    path: item.imgPath,
    bigImageUrl: item.imgPath,
    fileId: item.fileId,
    size: 0,
    isNetwork: isNetworkUrl(item.imgPath)
  }));
};

const imgOperateCallBack = async (data: any) => {
  const imgPathList = await mapImgPathList(data.imgPathList);
  console.log('图片压缩结果imgary---imgOperateCallBack', imgPathList);
  updateImgAry([...imgPathList]);
};
const imgSelectCallBack = async (data: any) => {
  uni.showLoading({
    title: '',
    fail: (err) => {
      console.log('图片压缩结果imgary---showLoading---error', err);
    }
  });
  const imgPathList = await mapImgPathList(data.imgPathList);
  console.log('图片压缩结果imgary---imgSelectCallBack', imgPathList);
  const imgaryUrl = imageAry.value.filter((item: imageObjType) => item.isNetwork);
  updateImgAry([...imgaryUrl, ...imgPathList]);
  uni.hideLoading();
};
const imgEditingCallBack = async (data: any) => {
  const imgPathList = await mapImgPathList(data.imgPathList);
  console.log('图片压缩结果imgary---imgEditingCallBack', imgPathList);
  updateImgAry([...imageAry!.value!, ...imgPathList]);
};
uni.$on(natToUniImageSelected, imgSelectCallBack);
uni.$on(natToUniImagePreview, imgOperateCallBack);
uni.$on(natToUniImageEditing, imgEditingCallBack);

uni.$on(natToUniVideoSelected, (data: any) => {
  const videoList = data.videoList.map((item: any) => ({
    videoPath: item.videoPath,
    videoSize: item.videoSize,
    videoImgPath: item.corverPath,
    videoDuration: item.videoDuration,
    isNetwork: isNetworkUrl(item.videoPath)
  }));
  console.log('videoList----', videoAry.value);
  console.log('videoList----videoList---', videoList);
  if (props.maxVideoNumber > 1) {
    updateVideoAry([...videoAry.value, ...videoList]);
  } else {
    updateVideoAry([...videoList]);
  }
});

// 原生到uni发送微信文件选择结果
const chooseWxFileCallBackdif = async (data: any) => {
  const selectFileAry: allHttpRequestFilesType = {
    imageHttpAry: imageAry!.value, // 图片类型
    videoHttpAry: videoAry!.value, // 视频类型
    fileHttpAry: fileAry.value // 文件类型
  };
  const {
    imageCallBackAry,
    videoCallBackAry,
    fileCallBackAry,
    allHttpFiles,
    fileIdentity: dataFileIdentity
  } = await getfileListbyType(
    data,
    selectFileAry,
    localDeleteFileList.value,
    instance,
    props.getFileUrlApi
  );
  updateImgAry([...imageAry!.value!, ...imageCallBackAry]);
  updateVideoAry([...videoAry!.value!, ...videoCallBackAry]);
  updateFileAry([...fileAry.value, ...fileCallBackAry]);
  updateAllHttpRequestFiles({ ...allHttpFiles });
  console.log('chooseWxFileCallBackdifcreate--allHttpFiles--', allHttpRequestFiles.value);
  fileIdentity = dataFileIdentity;
  uni.$emit(uniEmitsWxFileIdentify, { fileIdentity });
};

const fileSelectFunc = (data: any) => {
  const navFileAry = data.fileList.map((item: any) => {
    return {
      fileID: item.fileId,
      fileAddress: item.filePath,
      fileType: 1,
      fileName: item.fileName || '文件',
      fileSize: item.fileSize,
      isNetwork: isNetworkUrl(item.filePath)
    };
  });
  updateFileAry([...fileAry.value, ...navFileAry]);
};

uni.$on(natToUniFilesSelected, fileSelectFunc);
onUnmounted(() => {
  console.log('onUnmounted----');
  uni.$off([
    natToUniFilesSelected,
    natToUniImageSelected,
    natToUniImagePreview,
    natToUniImageEditing,
    natToUniVideoSelected,
    natToUniOnChoosedWxFile,
    natToUniEditedImg
  ]);
  eventBus.off(natToUniOnChoosedWxFile, chooseWxFileCallBackdif);
  eventBus.off(natToUniEditedImg, imgEditingCallBack);
});
console.log('onUnmounted---create----');
// uni.$on(natToUniOnChoosedWxFile, chooseWxFileCallBackdif);
// uni.$on(natToUniEditedImg, imgEditingCallBack);
eventBus.on(natToUniEditedImg, imgEditingCallBack);
eventBus.on(natToUniOnChoosedWxFile, chooseWxFileCallBackdif);

onMounted(() => {
  // const imgurl =
  //   'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Facbc8e3d-9e34-43b8-933c-875d088c6ac8%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1706169888&t=3dd7fb7fb343d450bc5c18f33893d0e5';
  // const imgPathList = [
  //   {
  //     path: imgurl,
  //     bigImageUrl: imgurl,
  //     fileId: '123',
  //     size: 0,
  //     isNetwork: isNetworkUrl(imgurl)
  //   }
  // ];
  // updateImgAry([...imgPathList]);
  // #ifdef APP-PLUS
  // bridge.receiveNativeEvent(natToUniEditedImg).then(imgEditingCallBack);
  // uni.$on(natToUniOnChoosedWxFile, chooseWxFileCallBackdif);
  // uni.$on(natToUniEditedImg, imgEditingCallBack);
  // uni.onNativeEventReceive((event: string, data: any) => {
  //   console.log('receiveNativeEvent---event-chooseWxFileCallBack---', event, data);
  //   if (event === natToUniOnChoosedWxFile) {
  //     console.log('receiveNativeEvent---eventName-chooseWxFileCallBack---');
  //     chooseWxFileCallBack(data);
  //   }
  // });
  // bridge.receiveNativeEvent(natToUniOnChoosedWxFile).then(chooseWxFileCallBack);
  // #endif

  // chooseWxFileCallBack('12323');
  updateShrinkRef(wCompress);
  console.log('chooseWxFileCallBack--onMounted--');
});
onShow(() => {
  uni.hideLoading();
  // #ifdef APP-PLUS
  // bridge.receiveNativeEvent(natToUniOnChoosedWxFile).then(chooseWxFileCallBack);
  // #endif
  console.log('chooseWxFileCallBack--onShow--');
});
const deleteFiles = (
  fileType: number,
  fileObj: imageObjType | fileType | videoType | audioType
) => {
  // 附件类型 1 图片 2语音 3视频 4文件 5链接
  console.log('deleteFiles--', fileType, fileObj);
  const fileListKey = fileTypesMap[fileType];
  localDeleteFileList.value[fileListKey].push(fileObj);
  console.log('deleteFiles--localDeleteFileList---', localDeleteFileList.value);
};
onLoad(() => {
  console.log('submit-onload');
  // updateUploadUrlApi(props.urlApi);
});
onHide(() => {
  console.log('chooseWxFileCallBack--onHide--');
});
onActivated(() => {
  console.log('chooseWxFileCallBack--onActivated--');
});
// uni.$on(natToUniVideoSelected, (data: string) => {
//   // console.log('native回传给uni已经选择的视频hook----', natToUniVideoSelected, data);
//   updateVideoAry([
//     ...videoAry!.value!,
//     {
//       videoPath: data
//     }
//   ]);
//   getData(data).then((txtData) => {
//     videoTxtData.value = `${videoTxtData.value + txtData}-----\n`;
//   });
//   getVideoUrl(data);
// });

// uni.$on(natToUniFilesSelected, (data: fileType[]) => {
//   // console.log('native回传给uni已经选择的文件hook----', natToUniFilesSelected, data);
//   const navFileAry = data.map((item: fileType, index: number) => {
//     return {
//       fileID: index + item.fileAddress,
//       fileAddress: item.fileAddress,
//       fileType: item.fileType,
//       fileName: item.fileName
//     };
//   });
//   updateFileAry([...navFileAry, ...fileAry.value]);
// });
</script>

<style scoped lang="scss">
.file-bg {
  /* background-color: orange; */
  @include normalFlex(row, flex-start);
}
</style>
