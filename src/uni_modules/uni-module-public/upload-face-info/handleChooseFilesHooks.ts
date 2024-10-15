import { uploadFilesCallBack } from '@/uni-module-common/http';
import {
  natToUniEditedImg,
  natToUniFilesSelected,
  natToUniImageEditing,
  natToUniImagePreview,
  natToUniImageSelected,
  natToUniOnChoosedWxFile,
  natToUniVideoSelected
} from '@/uni-module-common/utils/uniToNavProtocol';
import type {
  allHttpRequestFilesType,
  imageObjType
} from '@/uni-module-common/components/xxt-components/xxt-file-submit/xxtFileType';
import { getfileListbyType } from '@/uni-module-common/components/xxt-components/xxt-file-submit/useChooseMedia';
import { uniEmitsWxFileIdentify } from '@/uni-module-common/utils/uniEmitsProtocol';
import { isIosMoreVersion, isNetworkUrl } from '@/uni-module-common/utils/util';
import { compressImage, showImageCacheMB } from '@/uni-module-common/utils/imageTools';
import { getData } from '@/uni-module-common/components/xxt-components/xxt-file-submit/xxtFilesManager';
import { uniShowToast } from '@/uni-module-common/utils/uiUtile';
import { uniToAppPluginBridge } from '@/uni-module-common/utils/uniToAppPluginBridge';

const {
  imageAry,
  videoAry,
  fileAry,
  updateImgAry,
  updateVideoAry,
  updateFileAry,
  clearAllFilesCache,
  clearOtherData,
  localDeleteFileList,
  allHttpRequestFiles,
  updateAllHttpRequestFiles,
  uploadAllFilesUni
}: any = useStore('fileUpload');

let obj: any = {};
let instance: any = null;
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
  obj.fileIdentity = dataFileIdentity;
  uni.$emit(uniEmitsWxFileIdentify, { fileIdentity: obj.fileIdentity });
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
const imgEditingCallBack = async (data: any) => {
  const imgPathList = await mapImgPathList(data.imgPathList);
  console.log('图片压缩结果imgary---imgEditingCallBack', imgPathList);
  updateImgAry([...imageAry!.value!, ...imgPathList]);
};
const imgSelectCallBack = async (data: any) => {
  const imgPathList = await mapImgPathList(data.imgPathList);
  console.log('图片压缩结果imgary---imgSelectCallBack', imgPathList);
  const imgaryUrl = imageAry.value.filter((item: imageObjType) => item.isNetwork);
  updateImgAry([...imgaryUrl, ...imgPathList]);
  if (obj.isUploadAllFilesUni) {
    console.log('imgSelectCallBack---isUploadAllFilesUni---', obj.isUploadAllFilesUni);
    uploadAllFilesUni();
  }
};
const imgOperateCallBack = async (data: any) => {
  const imgPathList = await mapImgPathList(data.imgPathList);
  console.log('图片压缩结果imgary---imgOperateCallBack', imgPathList);
  updateImgAry([...imgPathList]);
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
// app端从微信链条选择附件
const useHandleChooseFiles = (fileObj: any) => {
  obj = fileObj;
  instance = getCurrentInstance();
  const eventBus = instance!.appContext.config.globalProperties.$eventBus;
  uni.$on(natToUniImageSelected, imgSelectCallBack);
  uni.$on(natToUniImagePreview, imgOperateCallBack);
  uni.$on(natToUniImageEditing, imgEditingCallBack);
  eventBus.on(natToUniEditedImg, imgEditingCallBack);
  eventBus.on(natToUniOnChoosedWxFile, chooseWxFileCallBackdif);
  uni.$on(natToUniFilesSelected, fileSelectFunc);
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

  onUnload(() => {
    // 清空 附件 store
    clearAllFilesCache();
    clearOtherData();
    uni.$off(uploadFilesCallBack);
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
    console.log('onUnload---wxchooseFilesHooks---');
  });
};

export const chooseAlbum = (maxImgNumber: number, videoTxtData: any) => {
  if (imageAry!.value!.length >= maxImgNumber) {
    uni.showToast({
      title: `最多选择${maxImgNumber}张图片`,
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
    count: maxImgNumber - imageAry!.value!.length,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: async (res: any) => {
      // 预览图片
      // updateImgAry([...imageAry!.value!, ...res.tempFiles]);
      getData(res.tempFiles[0].path).then((txtData) => {
        videoTxtData.value = `${videoTxtData.value + txtData}-----\n`;
      });

      console.log('uni图片选择-tempFilePaths-??-', res.tempFilePaths[0]);
      const imgary = [];
      for (const item of res.tempFiles) {
        console.log('图片压缩结果imgary--item.path---', item.path);
        let compressImg = '';
        if (!isNetworkUrl(item.path)) {
          compressImg = (await compressImage(item.path)) as string;
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
    }
  });
};

export const chooseAppAlbum = (maxImgNumber: number) => {
  console.log('chooseAppAlbum----');
  if (imageAry!.value!.length >= maxImgNumber) {
    uniShowToast(`最多选择${maxImgNumber}张图片`);
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
    maxNum: maxImgNumber,
    selectableNum: maxImgNumber - httpImgList.length,
    index: 0
  });
  // #endif
};

export default useHandleChooseFiles;
