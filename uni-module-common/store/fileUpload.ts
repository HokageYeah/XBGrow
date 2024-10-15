import { v4 as uuidv4 } from 'uuid';
import { natToUniFilesUpload, uniToNatFilesUpload } from '../utils/uniToNavProtocol';
import { uploadFilePromise, uploadFilesCallBack } from '../http';
import utils from '../utils';
import { getScalePercentage } from '../utils/imageTools';
import { isIosMoreVersion } from '../utils/util';
import { videoCompress } from '../utils/videoTools';
import type {
  allHttpRequestFilesType,
  audioType,
  fileType,
  imageObjType,
  videoType
} from '@/uni-module-common/components/xxt-components/xxt-file-submit/xxtFileType';
import bridge from '@/uni-module-common/utils/uniToNativeBridge';
import { wxuuid } from '@/uni-module-common/utils/wxUuid';

interface fileUpdateType {
  imageAry?: imageObjType[]; // 图片类型
  videoAry?: videoType[]; // 视频类型
  fileAry?: fileType[]; // 文件类型
  audioAry?: audioType[]; // 音频类型
  allHttpRequestFiles?: allHttpRequestFilesType;
  // 记录本地删除附件列表
  localDeleteFileList?: allHttpRequestFilesType;
  // 必须传递的附件 //  附件类型：1图片；2语音；3视频；4文件；5链接
  mustFilesType?: number[];
  currentIndex: number;
  shrinkRef: any; // 缩略图
  uploadUrlApi: string;
}
interface uploadResType {
  code: number;
  msg: string;
  fileIdentify: string;
}
type uploadFileType = imageObjType[] | videoType[] | audioType[] | fileType[];
type pathKeyType = 'fileAddress' | 'audioPath' | 'videoPath' | 'path';
interface fileProType {
  fileId: string;
  filePath: string;
  itemSeq?: number; // 兼容填表打卡，区分是第几项表单项
}
const fileUploadStore = defineStore({
  id: 'fileUpload',
  state: (): fileUpdateType => ({
    imageAry: [],
    videoAry: [],
    fileAry: [],
    audioAry: [],
    mustFilesType: [],
    currentIndex: 0,
    shrinkRef: null,
    allHttpRequestFiles: {},
    localDeleteFileList: {
      imageHttpAry: [], // 图片类型
      videoHttpAry: [], // 视频类型
      fileHttpAry: [], // 文件类型
      audioHttpAry: [] // 音频类型
    },
    // 需要支持多模块的上传地址不一样，这里传入地址，默认是任务中心的上传地址，这样任务中心可以不用改。
    uploadUrlApi: ''
  }),
  // 附件上传只需要上传本地附件、网络附件需要过滤掉。
  getters: {
    localImageAry(): imageObjType[] {
      return this.imageAry!.filter((item: imageObjType) => !item.isNetwork);
    },
    localVideoAry(): videoType[] {
      return this.videoAry!.filter((item: videoType) => !item.isNetwork);
    },
    localFileAry(): fileType[] {
      return this.fileAry!.filter((item: fileType) => !item.isNetwork);
    },
    localAudioAry(): audioType[] {
      return this.audioAry!.filter((item: audioType) => !item.isNetwork);
    }
  },
  actions: {
    updateShrinkRef(ref: any) {
      this.shrinkRef = ref;
      console.log('updateShrinkRef-----', this.shrinkRef);
    },
    updateImgAry(data: imageObjType[]) {
      this.imageAry = data;
    },
    updateVideoAry(data: videoType[]) {
      this.videoAry = data;
    },
    updateFileAry(data: fileType[]) {
      this.fileAry = data;
    },
    updateAudioAry(data: audioType[]) {
      this.audioAry = data;
    },
    updateAllHttpRequestFiles(data: allHttpRequestFilesType) {
      this.allHttpRequestFiles = data;
    },
    updateLocalDeleteFileList(data: allHttpRequestFilesType) {
      this.localDeleteFileList = data;
    },
    updateUploadUrlApi(url: string) {
      this.uploadUrlApi = url;
      console.log('updateUploadUrlApi-----123---', this.uploadUrlApi);
    },
    updateMustFilesType(data: number[]) {
      this.mustFilesType = data;
    },
    clearAllFilesCache() {
      this.imageAry = [];
      this.videoAry = [];
      this.fileAry = [];
      this.audioAry = [];
      this.allHttpRequestFiles = {};
      this.localDeleteFileList = {
        imageHttpAry: [], // 图片类型
        videoHttpAry: [], // 视频类型
        fileHttpAry: [], // 文件类型
        audioHttpAry: [] // 音频类型
      };
    },
    clearOtherData() {
      // 默认改回任务中心的上传地址
      this.uploadUrlApi = '';
      this.mustFilesType = [];
      console.log('updateUploadUrlApi-----clearAllFilesCache---', this.uploadUrlApi);
    },
    uploadAllFilesApp() {
      const imageAry = this.imageAry?.map((item) => item.path);
      const videoAry = this.videoAry?.map((item) => item.videoPath);
      const fileAry = this.fileAry?.map((item) => item.fileAddress);
      if (imageAry?.length || videoAry?.length || fileAry?.length) {
        bridge
          .sendNativeEvent(uniToNatFilesUpload, { imageAry, videoAry, fileAry })
          .then((res: any) => {
            const restype = res as uploadResType;
            if (restype.code === 1) {
              this.clearAllFilesCache();
            }
            uni.$emit(natToUniFilesUpload, restype);
          });
      }
    },
    // 图片压缩
    async compressImage(fileObjAry: uploadFileType) {
      console.log('updateShrinkRef--fileObjAry-compressImage--', fileObjAry);
      // 使用l-shrink这个压缩插件进行压缩
      // const imgary = [];
      // for (const item of fileObjAry) {
      //   const imgItem = item as imageObjType;
      //   console.log('updateShrinkRef--item.imgPath--', imgItem.path);
      //   console.log('updateShrinkRef--this.shrinkRef.value--', this.shrinkRef.value);
      //   console.log('updateShrinkRef--this.shrinkRef--', this.shrinkRef);
      //   console.log(
      //     'updateShrinkRef--this.shrinkRef.compressImage--',
      //     this.shrinkRef.compressImage
      //   );
      //   try {
      //     imgItem.path = await this.shrinkRef.compressImage(imgItem.path, {
      //       quality: 75
      //     });
      //     uni.saveImageToPhotosAlbum({
      //       filePath: imgItem.path,
      //       success() {
      //         utils.toast({ title: '图片保存成功' });
      //         console.log('updateShrinkRef--compressImage----图片保存成');
      //       },
      //       fail() {
      //         utils.toast({ title: '图片保存失败' });
      //         console.log('updateShrinkRef--compressImage----图片保存失败');
      //       }
      //     });
      //   } catch (error) {
      //     console.log('updateShrinkRef--error---', error);
      //   }
      //   console.log('updateShrinkRef--item.imgPath-after--', imgItem.path);

      //   imgary.push(imgItem);
      // }
      // console.log('updateShrinkRef--imgary--', imgary);
      // return imgary;

      // 自己写的压缩进行压缩
      // console.log('updateShrinkRef--fileObjAry--', fileObjAry);
      // const imgary = [];
      // for (const item of fileObjAry) {
      //   const imgItem = item as imageObjType;
      //   console.log('updateShrinkRef--item.imgPath--', imgItem.path);
      //   console.log('updateShrinkRef--this.shrinkRef.value--', this.shrinkRef.value);
      //   console.log('updateShrinkRef--this.shrinkRef--', this.shrinkRef);
      //   console.log(
      //     'updateShrinkRef--this.shrinkRef.compressImage--',
      //     this.shrinkRef.compressImage
      //   );
      //   const fileExtension = imgItem.path.split('.').pop();
      //   console.log('updateShrinkRef--this.shrinkRef-fileExtension--', fileExtension);
      //   try {
      //     console.log('updateShrinkRef--进入了---');
      //     imgItem.path = await this.shrinkRef.start(imgItem.path, {
      //       pixels: 4000000, // 最大分辨率，默认二百万
      //       quality: 0.6, // 压缩质量，默认0.8
      //       type: fileExtension, // 图片类型，默认jpg
      //       base64: false, // 是否返回base64，默认false，非H5有效
      //       width: 1080,
      //       height: 1440
      //     });
      //     uni.saveImageToPhotosAlbum({
      //       filePath: imgItem.path,
      //       success() {
      //         utils.toast({ title: '图片保存成' });
      //         console.log('updateShrinkRef-----图片保存成');
      //       }
      //     });
      //   } catch (error) {
      //     console.log('updateShrinkRef--error---', error);
      //     utils.toast({ title: '图片压缩失败' });
      //   }
      //   console.log('updateShrinkRef--item.imgPath-after--', imgItem.path);

      //   imgary.push(imgItem);
      // }
      // return imgary;

      // uni自带的压缩api uni.compressImage(OBJECT)
      const uniCompressImage = async (imagePath: string) => {
        // 将百分比转换为字符串并输出
        const percentageString = await getScalePercentage(imagePath);
        console.log('updateShrinkRef--percentageString--', percentageString);
        return new Promise<string>((resolve, reject) => {
          uni.compressImage({
            src: imagePath,
            quality: 80,
            width: percentageString,
            height: percentageString,
            success: (res) => {
              console.log('updateShrinkRef--uniCompressImage--', res.tempFilePath);
              resolve(res.tempFilePath);
            },
            fail: (res) => {
              resolve(imagePath);
              console.log('updateShrinkRef--uniCompressImage--fail--', res);
            }
          });
        });
      };
      console.log('updateShrinkRef--fileObjAry--', fileObjAry);
      const imgary = [];
      for (const item of fileObjAry) {
        const imgItem = item as imageObjType;
        console.log('updateShrinkRef--item.imgPath--', imgItem.path);
        // console.log('updateShrinkRef--this.shrinkRef.value--', this.shrinkRef.value);
        // console.log('updateShrinkRef--this.shrinkRef--', this.shrinkRef);
        // console.log(
        //   'updateShrinkRef--this.shrinkRef.compressImage--',
        //   this.shrinkRef.compressImage
        // );
        console.log('updateShrinkRef--uniCompressImage--');
        const fileExtension = imgItem.path.split('.').pop();
        console.log('updateShrinkRef--this.shrinkRef-fileExtension--', fileExtension);
        try {
          console.log('updateShrinkRef--进入了---');
          imgItem.path = await uniCompressImage(imgItem.path);
          // uni.saveImageToPhotosAlbum({
          //   filePath: imgItem.path,
          //   success() {
          //     utils.toast({ title: '图片保存成' });
          //     console.log('updateShrinkRef-----图片保存成');
          //   }
          // });
        } catch (error) {
          console.log('updateShrinkRef--error---', error);
          utils.toast({ title: '图片压缩失败' });
        }
        console.log('updateShrinkRef--item.imgPath-after--', imgItem.path);

        imgary.push(imgItem);
      }
      return imgary;
    },
    // 视频压缩
    async compressVideo(fileObjAry: uploadFileType) {
      const videoAry = [];
      for (const item of fileObjAry) {
        const videoItem = item as videoType;
        try {
          console.log('updateShrinkRef--进入了---');
          videoItem.videoPath = await videoCompress(videoItem.videoPath, 80);
        } catch (error) {
          console.log('updateShrinkRef--error---', error);
          utils.toast({ title: '视频压缩失败' });
        }
        videoAry.push(videoItem);
      }
      return videoAry;
    },
    async uploadDiffFiles(
      fileTypeNum: number,
      fileObjAry: uploadFileType,
      uuid: string,
      arryIndex: number
    ) {
      // 深拷贝
      const newfileObjAryDeepCopy = JSON.parse(JSON.stringify(fileObjAry));
      // 如果fileTypeNum 是1 ，则是图片，先对图片进行压缩。
      // 已经使用imagetools工具压缩过图片了不需要在压缩
      if (fileTypeNum === 1 && isIosMoreVersion(316)) {
        // 首先压缩图片
        const fileObjAryDeepCopy: imageObjType[] = JSON.parse(JSON.stringify(fileObjAry));
        console.log('updateShrinkRef--fileObjAryDeepCopy--', fileObjAryDeepCopy);
        const imageUploadAry = await this.compressImage(fileObjAryDeepCopy);
        console.log('updateShrinkRef--imageUploadAry--', imageUploadAry);
        fileObjAry = imageUploadAry;
      }
      // #ifdef MP-WEIXIN
      // 如果是微信小程序择需要对视频进行压缩上传。app自带压缩
      if (fileTypeNum === 3) {
        const fileObjAryDeepCopy: videoType[] = JSON.parse(JSON.stringify(fileObjAry));
        const videoUploadAry = await this.compressVideo(fileObjAryDeepCopy);
        fileObjAry = videoUploadAry;
      }
      // #endif
      // 视频大小如果超过100M则不上传，给出提示
      if (fileTypeNum === 3) {
        const arryIndex = (fileObjAry as videoType[]).findIndex((item) => {
          console.log(
            'updateShrinkRef--item.videoSize--fileTypeNum---',
            item.videoSize && item.videoSize / 1024 / 1024
          );
          return item.videoSize && item.videoSize / 1024 / 1024 > 100;
        });
        console.log('updateShrinkRef--arryIndex--fileTypeNum---', arryIndex);
        console.log('updateShrinkRef--fileObjAry--fileTypeNum---', fileObjAry);
        if (arryIndex !== -1) {
          // utils.toast({ title: `所选第${arryIndex + 1}个视频大小超过100M，请重新选择视频` });
          return new Promise((resolve, reject) => {
            const err = new Error(`所选的第${arryIndex + 1}个视频大小超过100M，请重新选择`);
            reject(err);
          });
        }
      }
      console.log('updateShrinkRef--开始上传了', fileObjAry);
      const promises = fileObjAry.map((item, index) => {
        const defultFormData = {
          fileIdentity: uuid,
          fileType: fileTypeNum,
          fileSeq: index + 1 + arryIndex
        };
        const deepCloneItem = newfileObjAryDeepCopy[index];
        let formData = {};
        let filePaths = '';
        let primiFilePath = '';
        // 附件类型：1图片；2语音；3视频；4文件；5链接
        switch (fileTypeNum) {
          case 1:
            formData = { ...defultFormData };
            filePaths = (<imageObjType>item).path;
            primiFilePath = (<imageObjType>deepCloneItem).path;
            break;
          case 2:
            formData = { ...defultFormData, fileParam: (<audioType>item).audioTimeNum };
            filePaths = (<audioType>item).audioPath;
            primiFilePath = (<audioType>deepCloneItem).audioPath;
            break;
          case 3:
            formData = {
              ...defultFormData,
              fileParam: (<videoType>item).videoDuration,
              'Content-Type': 'video/mp4'
            };
            filePaths = (<videoType>item).videoPath;
            primiFilePath = (<videoType>deepCloneItem).videoPath;
            break;
          case 4:
            // 如果fileName为空则不上传, 有的话则linkName有值
            formData = { ...defultFormData, linkName: (<fileType>item).fileName };
            filePaths = (<fileType>item).fileAddress;
            primiFilePath = (<fileType>deepCloneItem).fileAddress;
            break;
          case 5:
            formData = {
              ...defultFormData,
              linkUrl: (<fileType>item).fileAddress,
              linkName: (<fileType>item).fileName
            };
            filePaths = '';
            // 创建一个空文件 避免filePaths 为空在小程序端传不上去
            // #ifdef MP-WEIXIN
            filePaths = createEmptyFile();
            // #endif
            primiFilePath = (<fileType>item).fileAddress;
            break;

          default:
            break;
        }
        console.log('updateUploadUrlApi-----uploadDiffFiles----', this.uploadUrlApi);
        return uploadFilePromise(
          filePaths,
          primiFilePath,
          fileTypeNum,
          3,
          formData,
          this.uploadUrlApi,
          item.itemSeq
        );
      });
      return Promise.race([
        Promise.all(promises),
        // 超时处理
        new Promise((resolve, reject) => {
          const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error('附件上传请求超时'));
          }, 60000);
        })
      ]);
    },
    checkMustFilesType(fileType: number) {
      let showStr = '';
      let isMust = false;
      if (fileType === 1 && this.imageAry!.length === 0) {
        showStr = '请上传图片';
        isMust = true;
      } else if (fileType === 2 && this.audioAry!.length === 0) {
        showStr = '请上传语音';
        isMust = true;
      } else if (fileType === 3 && this.videoAry!.length === 0) {
        showStr = '请上传视频';
        isMust = true;
      } else if (fileType === 4) {
        const filessAry = this.fileAry?.filter((item) => item.fileType !== 0);
        if (!filessAry || filessAry.length === 0) {
          showStr = '请上传文件';
          isMust = true;
        }
      } else if (fileType === 5) {
        const linkAry = this.fileAry?.filter((item) => item.fileType === 0);
        if (!linkAry || linkAry.length === 0) {
          showStr = '请上传链接';
          isMust = true;
        }
      }
      if (isMust) {
        uni.showToast({
          title: showStr,
          icon: 'none',
          duration: 2000
        });
      }
      return isMust;
    },
    uploadAllFilesUni(fileIdentity = '') {
      console.log(
        'updateUploadUrlApi-----uploadDiffFiles----uploadAllFilesUni---',
        this.uploadUrlApi
      );
      // 设置一个附件类型对象
      // 附件类型：1图片；2语音；3视频；4文件；5链接
      const fileObj: { [key: number]: fileProType[] } = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
      };
      const ismustFilesType: any = this.mustFilesType?.some((item) => {
        return this.checkMustFilesType(item);
      });
      // 上传前必须教研是否有必传项， 且必传项不能为空
      if (ismustFilesType) {
        return;
      }
      uni.showLoading({
        title: '上传中...',
        mask: true,
        fail: () => {
          uni.hideLoading();
        }
      });
      console.log('fileupload--localImageAry--', this.localImageAry, this.localImageAry.length);
      if (
        this.localImageAry?.length ||
        this.localVideoAry?.length ||
        this.localFileAry?.length ||
        this.localAudioAry?.length
      ) {
        console.log('fileupload--开始上传了--', this.localImageAry, this.localVideoAry);
        let randomUUID: string;
        console.log('fileupload--fileIdentity--', fileIdentity);
        if (fileIdentity.length > 0) {
          randomUUID = fileIdentity;
        } else {
          // #ifdef MP-WEIXIN
          randomUUID = wxuuid();
          // #endif
          // #ifndef MP-WEIXIN
          randomUUID = uuidv4();
          //  #endif
        }
        console.log('fileupload--randomUUID--', randomUUID);
        // 附件类型：1图片；2语音；3视频；4文件；5链接
        this.uploadDiffFiles(1, this.localImageAry as imageObjType[], randomUUID, 0)
          .then((res) => {
            if (typeof res === 'object') {
              console.log('mapFileIds--', res);
              fileObj[1] = res as fileProType[];
              this.mapFileIds(this.imageAry, fileObj[1], 'path', 'fileId');
              // this.imageAry?.forEach((item) => {
              //   const fileItem = fileObj[1].find((i) => i.filePath === item.path);
              //   if (fileItem) {
              //     item.fileId = fileItem.fileId;
              //   }
              // });
            }
            return this.uploadDiffFiles(
              3,
              this.localVideoAry as videoType[],
              randomUUID,
              this.localImageAry!.length
            );
          })
          .then((res) => {
            if (typeof res === 'object') {
              fileObj[3] = res as fileProType[];
              this.mapFileIds(this.videoAry, fileObj[3], 'videoPath', 'videoId');
              // this.videoAry?.forEach((item) => {
              //   const fileItem = fileObj[3].find((i) => i.filePath === item.videoPath);
              //   if (fileItem) {
              //     item.videoId = fileItem.fileId;
              //   }
              // });
            }
            return this.uploadDiffFiles(
              2,
              this.localAudioAry as audioType[],
              randomUUID,
              this.localImageAry!.length + this.localVideoAry!.length
            );
          })
          .then((res) => {
            if (typeof res === 'object') {
              fileObj[2] = res as fileProType[];
              this.mapFileIds(this.audioAry, fileObj[2], 'audioPath', 'audioId');
              // this.audioAry?.forEach((item) => {
              //   const fileItem = fileObj[2].find((i) => i.filePath === item.audioPath);
              //   if (fileItem) {
              //     item.audioId = fileItem.fileId;
              //   }
              // });
            }
            const linkAry = this.localFileAry?.filter((item) => item.fileType === 0);
            return this.uploadDiffFiles(
              5,
              linkAry as fileType[],
              randomUUID,
              this.localImageAry!.length + this.localVideoAry!.length + this.localAudioAry!.length
            );
          })
          .then((res) => {
            if (typeof res === 'object') {
              fileObj[5] = res as fileProType[];
              this.mapFileIds(this.fileAry, fileObj[5], 'fileAddress', 'fileID');
              // this.fileAry?.forEach((item) => {
              //   const fileItem = fileObj[5].find((i) => i.filePath === item.fileAddress);
              //   if (fileItem) {
              //     item.fileID = fileItem.fileId;
              //   }
              // });
            }
            const linkAry = this.localFileAry?.filter((item) => item.fileType === 0);
            const filessAry = this.localFileAry?.filter((item) => item.fileType !== 0);
            return this.uploadDiffFiles(
              4,
              filessAry as fileType[],
              randomUUID,
              this.localImageAry!.length +
                this.localVideoAry!.length +
                this.localAudioAry!.length +
                linkAry!.length
            );
          })
          .then(async (res) => {
            if (typeof res === 'object') {
              fileObj[4] = res as fileProType[];
              this.mapFileIds(this.fileAry, fileObj[4], 'fileAddress', 'fileID');
              // this.fileAry?.forEach((item) => {
              //   const fileItem = fileObj[4].find((i) => i.filePath === item.fileAddress);
              //   if (fileItem) {
              //     item.fileID = fileItem.fileId;
              //   }
              // });
            }
            uni.hideLoading();
            uni.showToast({
              title: '所有文件上传完成',
              icon: 'success',
              mask: false,
              duration: 500
            });
            // this.clearAllFilesCache();
            uni.$emit(uploadFilesCallBack, { code: 1, fileIdentity: randomUUID, fileObj });
            // isIosMoreVersion(316) && (await clearImageCacheMB('_doc/'));
          })
          .catch((error) => {
            uni.hideLoading();
            const errorMessage = error.message || error;
            uni.$emit(uploadFilesCallBack, { code: 2, fileIdentity: randomUUID, fileObj });
            utils.toast({ title: errorMessage });
          });
      } else {
        uni.hideLoading();
        uni.$emit(uploadFilesCallBack, { code: 3, fileIdentity: null, fileObj });
      }
    },
    // 处理上传后的fileProType[]对象，将fileId写入到 对应的fileObj中
    mapFileIds(array: any, fileArray: fileProType[], pathKey: string, idKey: string) {
      array?.forEach((item: any) => {
        const filePath = item[pathKey];
        // const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        // console.log('mapFileIds--fileName--', fileName);
        // const fileItem = fileArray.find((i) => i.filePath.includes(fileName));
        const fileItem = fileArray.find((i) => i.filePath === filePath);
        console.log('mapFileIds--fileItem--', fileItem);
        if (fileItem) {
          item[idKey] = fileItem.fileId;
        }
      });
      console.log('mapFileIds-hellow---', array);
      console.log('mapFileIds--fileArray--', fileArray);
      console.log('mapFileIds--pathKey--', pathKey);
      console.log('mapFileIds--idKey--', idKey);
      console.log('mapFileIds----image', this.imageAry);
    }
  }
});
// 同步创建一个空文件 仅在微信可用
function createEmptyFile() {
  // #ifdef MP-WEIXIN
  const fs = wx.getFileSystemManager();
  // 微信小程序设置存储路径
  const filePath = `${wx.env.USER_DATA_PATH}/emptyFile.txt`;
  // 同步接口
  try {
    fs.accessSync(filePath);
    console.log('createEmptyFile----文件存在----', filePath);
  } catch (e) {
    console.error('createEmptyFile----文件不存在----', e);
    // 同步接口
    try {
      fs.writeFileSync(filePath, '1');
      console.log('createEmptyFile----文件创建成功----', filePath);
    } catch (e) {
      console.error('createEmptyFile----文件创建失败----', e);
    }
  }
  return filePath;
  // #endif
}

export default fileUploadStore;
