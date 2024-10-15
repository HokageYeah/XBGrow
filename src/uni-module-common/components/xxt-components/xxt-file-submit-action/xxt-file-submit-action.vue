<template>
  <!-- 后面考虑合并到 xxt-file-submit 组件中 -->
  <view class="file-bg">
    <tui-actionsheet
      :show="showTypeSheet"
      :item-list="fileTypeList"
      tips="选择类型"
      :size="32"
      @click="onActionClick"
      @cancel="onCancel"
    >
    </tui-actionsheet>
    <xxt-compress ref="wCompress" />
    <l-shrink ref="shrinkRef"></l-shrink>
  </view>
</template>

<script setup lang="ts">
import type {
  allHttpRequestFilesType,
  fileType,
  imageObjType,
  videoType
} from '@/uni-module-common/components/xxt-components/xxt-file-submit/xxtFileType';
import { fileTypeEnum } from '@/uni-module-common/utils/bizEnums';
// import { base64DataDraw } from './xxtFilesManageDraw';
import {
  dealWithFile,
  dealWithImage,
  dealWithVideo,
  getfileListbyType,
  uniToNatChooseWxFileFun,
  useDiffMediaFile,
  useShowActionSheet
} from '@/uni-module-common/components/xxt-components/xxt-file-submit/useChooseMedia';
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
import { compressImage } from '@/uni-module-common/utils/imageTools';
import {
  startAPPSignFileUpload,
  uniEmitsWxFileIdentify
} from '@/uni-module-common/utils/uniEmitsProtocol';

const props = withDefaults(
  defineProps<{
    maxImgNumber?: number;
    // 是否展示微信聊天选择
    isShowWXChat?: boolean;
    // 需要传入不同模块下的上传地址，默认任务中心
    urlApi?: string;
    // actionsheet显隐
    actionShow: boolean;
    // 显示哪几个文件类型 默认全部
    showTypeList: number[];
    // 当前支持限制文件类型格式 pdf word
    fileFormats: string[];
  }>(),
  {
    maxImgNumber: 9,
    isShowWXChat: false,
    urlApi: '/zuul/task-center/task-attachment/upload-file',
    actionShow: false,
    showTypeList: () => [1, 2, 3, 4, 5],
    fileFormats: () => []
  }
);

const emits = defineEmits(['update:actionShow', 'result']);

const showTypeSheet = ref(false);
const fileTypeList = ref([]);

watch(
  () => props.actionShow,
  (newV) => {
    if (newV) {
      const result = JSON.parse(JSON.stringify(fileTypeEnum)).filter((item: any) =>
        props.showTypeList.includes(item.type)
      );
      result.forEach((item: any) => (item.text = item.name));
      fileTypeList.value = result;
    }
    showTypeSheet.value = newV;
  },
  { immediate: true }
);

const onActionClick = (e: any) => {
  iconClick(e.type);
  // uni.$emit(natToUniImageSelected, { result: 1 });
  emits('result', e);
};

const onCancel = () => {
  showTypeSheet.value = false;
  emits('update:actionShow', false);
};

const recordingMask: any = ref<HTMLDivElement>();
const linkMask: any = ref<HTMLDivElement>();
const videoTxtData = ref('');
const instance = getCurrentInstance();
const eventBus = instance!.appContext.config.globalProperties.$eventBus;

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
  updateAllHttpRequestFiles
}: any = useStore('fileUpload');

updateUploadUrlApi(props.urlApi);
// filetype: 0 是链接。 1 是docx、 2 pdf、 3 ppt、 4 txt
// const fileAry = ref<fileType[]>([]);
const wCompress: any = ref(null);
const shrinkRef: any = ref(null);
let fileIdentity = '';

/**
 * 重置fileIdentity
 * 如果需要清空选择的文件重新上传需要调用该方法
 */
const resetFileIdentity = () => {
  fileIdentity = '';
};

const chooseAppAlbum = () => {
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
    maxNum: 9,
    selectableNum: 9 - httpImgList.length,
    index: 0
  });
  // #endif
};

const chooseAppVideo = () => {
  if (videoAry.value.length >= 1) {
    uniShowToast(`您最多可以上传1个视频文件`);
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
    maxNum: 1,
    selectableNum: 1 - selectedList.length,
    videoDurationLimit: 120
  });
  // #endif
};

/**
 * Uni Native相互调用协议
 * https://xinzx.yuque.com/zvlr0c/gwy45o/lke7d5i4dmkitkk1
 */
const getAppFileTypeList = () => {
  let appFileTypeList = [4];
  if (props.fileFormats && props.fileFormats.length > 0) {
    const tempTypeList = props.fileFormats
      .map((item: string) => {
        let code = 0;
        switch (item) {
          case 'pdf':
            code = 43;
            break;
          case 'word':
            code = 41;
            break;
          default:
            break;
        }
        return code;
      })
      .filter((item: number) => item !== 0);
    if (tempTypeList && tempTypeList.length > 0) {
      appFileTypeList = tempTypeList;
    }
  }
  return appFileTypeList;
};

const chooseAppFiles = () => {
  if (fileAry.value.filter((item: fileType) => item.fileType === 1).length >= 1) {
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
  // tips: app内ios android文件筛选暂不支持，先注释掉
  // const appFileTypeList = getAppFileTypeList();
  // #ifdef APP-PLUS
  uniToAppPluginBridge.gotoChooseFile({
    selectedList,
    maxNum: 1,
    maxSize,
    // tips: app内ios android文件筛选暂不支持，先注释掉
    // fileTypeList: appFileTypeList
    fileTypeList: [4]
  });
  // #endif
};

const getWxExtensions = () => {
  let extensions: string[] = [];
  if (props.fileFormats && props.fileFormats.length > 0) {
    const temp = props.fileFormats
      .map((item: string) => {
        let code: string[] = [];
        switch (item) {
          case 'pdf':
            code = ['pdf'];
            break;
          case 'word':
            code = ['docx', 'doc'];
            break;
          default:
            break;
        }
        return code;
      })
      .flat();
    if (temp && temp.length > 0) {
      extensions = temp;
    }
  }
  return extensions;
};

const filePath = ref('');
const imagePaths = ref('');
const iconClick = async (type: number) => {
  switch (type) {
    case 1:
      if (props.isShowWXChat) {
        // #ifdef MP-WEIXIN
        const res = await useDiffMediaFile(
          imageAry.value,
          ['拍照', '从手机相册选择', '从微信聊天会话中选择图片'],
          9,
          'image',
          'image',
          ['image']
        );
        dealWithImage(res, (imgary: any) => {
          updateImgAry([...imageAry!.value!, ...imgary]);
          // 同app端自己的选文件能力，需要触发上传
          uni.$emit(startAPPSignFileUpload);
        });
        // #endif
        // #ifdef APP-PLUS
        // app内待开发
        const newtapIndex = await useShowActionSheet(['图片', '从微信聊天会话中选择图片']);
        newtapIndex === 0 && chooseAppAlbum();
        newtapIndex === 1 && uniToNatChooseWxFileFun(1, imageAry.value.length, 9, fileIdentity);
        // #endif
      } else {
        // 图片选择
        // chooseAlbum();
        // uni自己的图片选择
        chooseAppAlbum();
      }
      break;
    case 2:
      {
        // 录制
        if (audioAry.value.length >= 1) {
          uniShowToast(`您最多可以上传1个音频文件`);
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
          1,
          'video',
          'video',
          ['video']
        );
        dealWithVideo(res, (videoList: any) => {
          updateVideoAry([...videoAry!.value!, ...videoList]);
        });
        // #endif
        // #ifdef APP-PLUS
        // app内待开发
        const newtapIndex = await useShowActionSheet(['视频', '从微信聊天会话中选择视频']);
        newtapIndex === 0 && chooseAppVideo();
        newtapIndex === 1 && uniToNatChooseWxFileFun(3, videoAry.value.length, 1, fileIdentity);
        // #endif
      } else {
        // chooseVideo();  uni自己的视频选择
        chooseAppVideo();
        // uniToNativeVideoSelect();
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
    case 4:
      {
        if (props.isShowWXChat) {
          const wxExtensions: any = getWxExtensions();
          // #ifdef MP-WEIXIN
          const res = await useDiffMediaFile(
            fileAry.value,
            ['从微信聊天会话中选择文件'],
            1,
            'file',
            'file',
            ['mix'],
            wxExtensions
          );
          dealWithFile(res, (tempFiles: any) => {
            updateFileAry([...fileAry.value, ...tempFiles]);
            // 同app端自己的选文件能力，需要触发上传
            uni.$emit(startAPPSignFileUpload);
          });
          // #endif
          // #ifdef APP-PLUS
          // app内待开发
          const newtapIndex = await useShowActionSheet(['文件', '从微信聊天会话中选择文件']);
          const count = fileAry.value.filter((item: fileType) => item.fileType === 1).length;
          newtapIndex === 0 && chooseAppFiles();
          newtapIndex === 1 && uniToNatChooseWxFileFun(4, count, 1, fileIdentity, wxExtensions);
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
      }
      break;
    default:
      break;
  }
};

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

const imgOperateCallBack = async (data: any) => {
  const imgPathList = await mapImgPathList(data.imgPathList);
  console.log('图片压缩结果imgary---imgOperateCallBack', imgPathList);
  updateImgAry([...imgPathList]);
};
const imgSelectCallBack = async (data: any) => {
  const imgPathList = await mapImgPathList(data.imgPathList);
  console.log('图片压缩结果imgary---imgSelectCallBack', imgPathList);
  const imgaryUrl = imageAry.value.filter((item: imageObjType) => item.isNetwork);
  updateImgAry([...imgaryUrl, ...imgPathList]);
  // 触发app文件上传
  uni.$emit(startAPPSignFileUpload);
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
  updateVideoAry([...videoList]);
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
  } = await getfileListbyType(data, selectFileAry, localDeleteFileList.value, instance);
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
  // 触发app文件上传
  uni.$emit(startAPPSignFileUpload);
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
eventBus.on(natToUniEditedImg, imgEditingCallBack);
eventBus.on(natToUniOnChoosedWxFile, chooseWxFileCallBackdif);

onMounted(() => {
  updateShrinkRef(wCompress);
});
onShow(() => {
  uni.hideLoading();
});

defineExpose({
  resetFileIdentity
});
</script>

<style scoped lang="scss">
.file-bg {
  /* background-color: orange; */
  // @include normalFlex(row, flex-start);
}
:deep(.tui-actionsheet-btn) {
  font-size: 16px !important;
}
</style>
