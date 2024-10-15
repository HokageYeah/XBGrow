import { uniToNativeChooseWxFile } from './xxtFileSupportHooks';
import type { allHttpRequestFilesType, fileType, imageObjType, videoType } from './xxtFileType';
import { uniShowToast } from '@/uni-module-common/utils/uiUtile';
import { isNetworkUrl } from '@/uni-module-common/utils/util';
import { appModuleConfig } from '@/uni-module-common/config/';
// 判断附件大小是否超过20m
export const isBeyondWithSize = (size: number, beyondSize: number) => {
  // size是字节 转换成m
  if (size / 1024 / 1024 > beyondSize) {
    uniShowToast(`文件大小不能超过${beyondSize}M`);
    return true;
  }
  return false;
};
// 判断附件类型是否符合word，excel，pdf，ppt，doc, docx, txt
export const fileTypeList = [
  'doc',
  'docx',
  'pdf',
  'ppt',
  'txt',
  'xls',
  'xlsx',
  'pptx',
  'DOC',
  'DOCX',
  'PDF',
  'PPT',
  'TXT',
  'XLS',
  'XLSX',
  'PPTX'
];
export const isIncludeWithFileType = (filePath: string) => {
  const fileType = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
  // 获取文件地址的后缀
  // const fileTypeList = ['doc', 'docx'];
  if (!fileTypeList.includes(fileType)) {
    uniShowToast(`文件类型不支持${fileType}格式`);
    return false;
  }
  return true;
};
export function useChooseMedia(
  mediaAry: any,
  maxImgNumber: number,
  mediaType: ('video' | 'image' | 'mix')[],
  sourceType: ('album' | 'camera')[],
  maxVideoDuration = 10
) {
  if (mediaAry.length >= maxImgNumber) {
    const showStr = mediaType.includes('image')
      ? `最多选择${maxImgNumber}张图片`
      : mediaType.includes('video')
        ? `您最多可以上传${maxImgNumber}个视频文件`
        : `您最多可以上传${maxImgNumber}个文件`;
    uniShowToast(showStr);
    return;
  }
  console.log('useChooseMedia----useChooseMedia----', maxVideoDuration);
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    // 微信小程序端
    wx.chooseMedia({
      count: maxImgNumber - mediaAry.length,
      mediaType,
      sourceType,
      maxDuration: maxVideoDuration,
      sizeType: ['original'],
      success: (res) => {
        console.log('微信小程序端--chooseMedia---', res);
        resolve(res);
      },
      fail: (res) => {
        console.log('微信小程序端--chooseMedia---fail--', res);
        reject(res);
      }
    });
    // #endif

    // #ifndef MP-WEIXIN
    uni.chooseMedia({
      count: maxImgNumber - mediaAry.length,
      mediaType,
      sourceType,
      maxDuration: maxVideoDuration,
      sizeType: ['original'],
      success: (res) => {
        console.log('chooseMedia---', res);
        resolve(res);
      },
      fail: (res) => {
        console.log('chooseMedia---fail--', res);
        reject(res);
      }
    });
    // #endif
  });
}
export const useShowActionSheet = (itemList: string[]) => {
  return new Promise((resolve, reject) => {
    uni.showActionSheet({
      itemList,
      success(res) {
        resolve(res.tapIndex);
      },
      fail(res) {
        console.log('useShowActionSheet----', res.errMsg);
        reject(res.errMsg);
      }
    });
  });
};
export type messageFileType = 'all' | 'video' | 'image' | 'file';
export type messageMediaType = 'image' | 'video' | 'file';
export const useChooseMessageFile = (
  mediaAryLength: number,
  maxImgNumber: number,
  mediaType: messageMediaType,
  type: messageFileType,
  extensions?: string[]
) => {
  console.log('点击了useChooseMessageFileddd---');
  if (mediaAryLength >= maxImgNumber) {
    console.log('点击了useChooseMessageFileddd-mediaAryLength--', mediaAryLength, maxImgNumber);
    const showStr =
      mediaType === 'image'
        ? `最多选择${maxImgNumber}张图片`
        : mediaType === 'video'
          ? `您最多可以上传${maxImgNumber}个视频文件`
          : `您最多可以上传${maxImgNumber}个文件`;
    uniShowToast(showStr);
    return;
  }
  // #ifdef MP-WEIXIN
  // 判断用户是否同意过隐私协议
  // api 官网文档： https://developers.weixin.qq.com/miniprogram/dev/api/open-api/privacy/wx.requirePrivacyAuthorize.html
  // wx.requirePrivacyAuthorize({
  //   success(res) {
  //     console.log(res);
  return new Promise((resolve, reject) => {
    console.log('点击了useChooseMessageFile-123-', mediaType, type);
    uni.chooseMessageFile({
      count: maxImgNumber - mediaAryLength,
      type,
      extension: extensions && extensions.length > 0 ? extensions : fileTypeList,
      success(result: any) {
        console.log('chooseMessageFile-after123----', result);
        if (mediaType === 'image') {
          result.tempFiles = result.tempFiles.map((item: any) => ({
            size: item.size,
            tempFilePath: item.path,
            fileType: item.type
          }));
        } else if (mediaType === 'video') {
          result.tempFiles = result.tempFiles.map((item: any) => ({
            size: item.size,
            tempFilePath: item.path,
            thumbTempFilePath: item.thumbTempFilePath || '',
            duration: item.duration || 0
          }));
        } else if (mediaType === 'file') {
          if (result.tempFiles.some((item: any) => !isIncludeWithFileType(item.name))) {
            reject(new Error('文件类型不支持'));
            return;
          }
          if (result.tempFiles.some((item: any) => isBeyondWithSize(item.size, 10))) {
            reject(new Error('文件大小不能超过10M'));
            return;
          }
          result.tempFiles = result.tempFiles.map((item: any, index: number) => ({
            fileID: item.path + index,
            fileAddress: item.path,
            fileType: 1,
            fileName: item.name || '文件',
            fileSize: item.size,
            isNetwork: isNetworkUrl(item.path)
          }));
        }
        resolve(result);
      },
      fail(err: any) {
        reject(err);
      }
    });
  });
  //   }
  // });
  // #endif
};

export const useDiffMediaFile = (
  fileAry: any,
  sheetAry: string[],
  maxFileNumber: number,
  messageType: messageMediaType,
  type: messageFileType,
  mediaType: ('video' | 'image' | 'mix')[],
  extensions?: string[],
  maxVideoDuration = 10,
  itemSeq?: number
) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const tapIndex = await useShowActionSheet(sheetAry);
    let newFileAry = fileAry;
    if (type === 'file') {
      newFileAry = fileAry.filter((item: fileType) => item.fileType === 1);
    }
    if (itemSeq) {
      newFileAry = newFileAry.filter((item: fileType) => item.itemSeq === itemSeq);
    }
    if (tapIndex === 2 || type === 'file') {
      const res = await useChooseMessageFile(
        newFileAry.length,
        maxFileNumber,
        messageType,
        type,
        extensions
      );
      resolve(res);
      return;
    }
    const sourceType: ('album' | 'camera')[] = tapIndex === 0 ? ['camera'] : ['album'];
    const res = await useChooseMedia(
      newFileAry,
      maxFileNumber,
      mediaType,
      sourceType,
      maxVideoDuration
    );
    resolve(res);
  });
};

// 处理压缩图片
export const dealWithImage = (res: any, callBack: Function) => {
  const imgary = [];
  try {
    console.log('dealWithImage----', res.tempFiles);
    for (const item of res.tempFiles) {
      console.log('dealWithImage--item--', item);
      const index = res.tempFiles.indexOf(item);
      console.log('dealWithImage--index--', index);
      const imgObj = {
        path: item.tempFilePath,
        bigImageUrl: item.tempFilePath,
        fileId: index,
        size: item.size,
        isNetwork: isNetworkUrl(item.tempFilePath)
      };

      imgary.push(imgObj);
    }
    callBack(imgary);
  } catch (error) {
    console.log('图片dealWithImage--error-', error);
  }
};

// 处理压缩视频
export const dealWithVideo = (res: any, callBack: Function) => {
  try {
    const videoList = res.tempFiles.map((item: any) => ({
      videoPath: item.tempFilePath,
      videoSize: item.size,
      videoImgPath: item.thumbTempFilePath,
      videoDuration: item.duration,
      isNetwork: isNetworkUrl(item.tempFilePath)
    }));
    console.log('dealWithVideo---', videoList);
    callBack(videoList);
  } catch (error) {
    console.log('视频dealWithVideo--error-', error);
  }
};
// 处理附件
export const dealWithFile = async (res: any, callBack: Function) => {
  try {
    callBack(res.tempFiles);
  } catch (error) {
    console.log('附件dealWithFile--error-', error);
  }
};
// app内需要监听natToUni-onChoosedWxFile事件， 把微信聊天选择记录传到相应数据内
// 附件类型：1图片；2语音；3视频；4文件；5链接
export const uniToNatChooseWxFileFun = (
  fileType: number,
  mediaAryLength: number,
  maxImgNumber: number,
  fileIdentify: string,
  extensions?: string[],
  uploadApiUrl?: string
) => {
  // #ifdef APP-PLUS
  if (mediaAryLength >= maxImgNumber) {
    const showStr =
      fileType === 1
        ? `最多选择${maxImgNumber}张图片`
        : fileType === 3
          ? `您最多可以上传${maxImgNumber}个视频文件`
          : `您最多可以上传${maxImgNumber}个文件`;
    uniShowToast(showStr);
  } else {
    console.log('uniToNatChooseWxFileFun----', appModuleConfig.WXMPOriginalID);
    console.log('uniToNatChooseWxFileFun----fileIdentify----', fileIdentify);
    const extensionsStr =
      extensions && extensions?.length > 0
        ? `&extensions=${encodeURIComponent(JSON.stringify(extensions))}`
        : '';
    const publicSubPackgePath = appModuleConfig.publicSubPackgePath;
    console.log(
      'uniToNatChooseWxFileFun----subPackagesRoot---',
      appModuleConfig.WXMPOriginalID,
      publicSubPackgePath
    );
    uniToNativeChooseWxFile(
      appModuleConfig.WXMPOriginalID,
      `${publicSubPackgePath}/weChatFileSelect/index?fileType=${fileType}&chooseNum=${
        maxImgNumber - mediaAryLength
      }&fileIdentify=${fileIdentify}&extensions=${extensionsStr}&uploadApiUrl=${uploadApiUrl || ''}`
    );
  }
  // #endif
};
interface getlistType {
  fileIdentity: string;
  imageCallBackAry: imageObjType[];
  videoCallBackAry: videoType[];
  fileCallBackAry: fileType[];
  allHttpFiles: allHttpRequestFilesType;
}
export const fileTypesMap: { [key: number]: string } = {
  1: 'imageHttpAry',
  2: 'audioHttpAry',
  3: 'videoHttpAry',
  4: 'fileHttpAry',
  5: 'fileHttpAry'
};
type FileTypesMapValues = 'imageHttpAry' | 'audioHttpAry' | 'videoHttpAry' | 'fileHttpAry';
export const getfileListbyType = (
  data: any,
  selectFileAry: allHttpRequestFilesType,
  localDeleteFileList: allHttpRequestFilesType,
  instance: any,
  url = '/notice/notice-attachment/get-file-list-by-batch'
) => {
  return new Promise<getlistType>((resolve, reject) => {
    console.log('chooseWxFileCallBack-----', data);
    const callBackObj = JSON.parse(data);
    console.log('chooseWxFileCallBack--callBackObj---', callBackObj);
    //  此时需要根据批次号获取通知附件列表
    // const url = '/notice/notice-attachment/get-file-list-by-batch';
    const fileIdentity = callBackObj.fileIdentify;
    const params = {
      fileIdentity
    };
    console.log('chooseWxFileCallBack--params---', params);
    instance?.proxy
      ?.$uniAjax({
        url,
        data: { ...params },
        query: {},
        method: 'POST',
        custom: {
          showLoading: true
        }
      })
      .then((res: any) => {
        console.log('chooseWxFileCallBack--instance---', res);
        console.log('chooseWxFileCallBack--localDeleteFileList---', localDeleteFileList);
        console.log('chooseWxFileCallBack--selectFileAry---', selectFileAry);
        const imageCallBackAry: any = [];
        const videoCallBackAry: any = [];
        const fileCallBackAry: any = [];
        // 附件类型 1 图片 2语音 3视频 4文件 5链接
        res.forEach((item: any) => {
          const fileListKey = fileTypesMap[item.fileType] as FileTypesMapValues;
          // 删除的list列表
          const fileList = localDeleteFileList[fileListKey];
          const selectFileList = selectFileAry[fileListKey];
          console.log('chooseWxFileCallBack--selectFileList---', selectFileList);
          if (item.fileType === 1) {
            const imageList = fileList as imageObjType[];
            const selectImgList = selectFileList as imageObjType[];
            const imgObj: imageObjType = {
              fileId: item.fileId,
              path: item.filePath,
              isNetwork: isNetworkUrl(item.filePath),
              bigImageUrl: item.filePath, // 网络大图地址
              size: item.fileSize
            };
            console.log(
              'chooseWxFileCallBack--selectFileList---',
              selectImgList?.some((file) => file.fileId === imgObj.fileId)
            );
            // 如果imgObj 切已选择的也没用此文件 不在fileList中才加入
            if (
              !imageList?.some((file) => file.fileId === imgObj.fileId) &&
              !selectImgList?.some((file) => file.fileId === imgObj.fileId)
            ) {
              imageCallBackAry.push(imgObj);
            }
            // imageCallBackAry.push(imgObj);
          } else if (item.fileType === 3) {
            const videoList = fileList as videoType[];
            const selectVideoList = selectFileList as videoType[];
            const videoObj: videoType = {
              videoPath: item.filePath,
              videoSize: item.fileSize,
              videoId: item.fileId,
              videoDuration: item.fileParam,
              isNetwork: isNetworkUrl(item.filePath)
            };
            // 如果videoObj 不在fileList中才加入
            if (
              !videoList?.some((file) => file.videoId === videoObj.videoId) &&
              !selectVideoList?.some((file) => file.videoId === videoObj.videoId)
            ) {
              videoCallBackAry.push(videoObj);
            }
            // videoCallBackAry.push(videoObj);
          } else if (item.fileType === 4) {
            const fileAry = fileList as fileType[];
            const selectFileAry = selectFileList as fileType[];
            const fileObj: fileType = {
              fileID: item.fileId,
              fileAddress: item.filePath,
              fileType: 1,
              fileName: item.fileName,
              fileSize: item.fileSize,
              isNetwork: isNetworkUrl(item.filePath)
            };
            // 如果fileObj 不在fileList中才加入
            if (
              !fileAry?.some((file) => file.fileID === fileObj.fileID) &&
              !selectFileAry?.some((file) => file.fileID === fileObj.fileID)
            ) {
              fileCallBackAry.push(fileObj);
            }
            // fileCallBackAry.push(fileObj);
          }
        });
        const allHttpFiles: allHttpRequestFilesType = {
          imageHttpAry: imageCallBackAry,
          videoHttpAry: videoCallBackAry,
          fileHttpAry: fileCallBackAry
        };
        console.log('chooseWxFileCallBack--allHttpFiles-diff--', allHttpFiles);
        resolve({
          imageCallBackAry,
          videoCallBackAry,
          fileCallBackAry,
          allHttpFiles,
          fileIdentity
        });
      })
      .catch((error: any) => {
        uniShowToast(`${error.message}`);
        reject(error);
        console.log('chooseWxFileCallBack--error--', error);
      })
      .finally(() => {});
  });
};
