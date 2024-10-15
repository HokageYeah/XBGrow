import {
  natToUniAudioSelected,
  natToUniBridgeToH5,
  natToUniFilesSelected,
  natToUniImageEditing,
  natToUniImagePreview,
  natToUniImageSelected,
  natToUniVideoSelected
} from './uniToNavProtocol';

class UnimpModule {
  // #ifdef  APP || APP-PLUS
  static impPlugin: any;
  // #endif
  static instance: any;
  constructor() {
    if (UnimpModule.instance) {
      return UnimpModule.instance;
    }
    UnimpModule.instance = this;
    // #ifdef  APP || APP-PLUS
    UnimpModule.impPlugin = uni.requireNativePlugin('unimpmodule');
    // #endif
  }

  static getInstance() {
    if (!UnimpModule.instance) {
      UnimpModule.instance = new UnimpModule();
    }
    return UnimpModule.impPlugin;
  }

  // uni调用native照片选择、拍摄器
  gotoChooseImg(imgData: any) {
    UnimpModule.impPlugin &&
      UnimpModule.impPlugin.gotoChooseImg(imgData, (res: any) => {
        uni.$emit(natToUniImageSelected, { ...res, itemSeq: imgData.itemSeq });
      });
  }

  // uni调用native图片预览器
  gotoPreviewImg(imgData: any) {
    UnimpModule.impPlugin &&
      UnimpModule.impPlugin.gotoPreviewImg(imgData, (res: any) => {
        uni.$emit(natToUniImagePreview, res);
      });
  }

  // uni调用native图片预览编辑器（网络图片）
  gotoOpenImg(imgData: any) {
    UnimpModule.impPlugin &&
      UnimpModule.impPlugin.gotoOpenImg(imgData, (res: any) => {
        uni.$emit(natToUniImageEditing, res);
      });
  }

  // uni调用native视频选择、录制器
  gotoChooseVideo(videoData: any) {
    UnimpModule.impPlugin &&
      UnimpModule.impPlugin.gotoChooseVideo(videoData, (res: any) => {
        uni.$emit(natToUniVideoSelected, { ...res, itemSeq: videoData.itemSeq });
      });
  }

  // uni调用native视频播放器
  gotoPlayVideo(videoData: any) {
    UnimpModule.impPlugin &&
      UnimpModule.impPlugin.gotoPlayVideo(videoData, (res: any) => {
        // uni.$emit(natToUniVideoPlay, res);
      });
  }

  // uni吊起原生文档选择
  gotoChooseFile(filesData: any) {
    const fileType = filesData.fileTypeList[0];
    UnimpModule.impPlugin &&
      UnimpModule.impPlugin.gotoChooseFile(filesData, (res: any) => {
        if (fileType === 2) {
          // 音频
          uni.$emit(natToUniAudioSelected, res);
        } else {
          uni.$emit(natToUniFilesSelected, { ...res, itemSeq: filesData.itemSeq });
        }
      });
  }

  // uni吊起原生文档预览
  gotoOpenFile(filesData: any) {
    UnimpModule.impPlugin &&
      UnimpModule.impPlugin.gotoOpenFile(filesData, (res: any) => {
        // uni.$emit(natToUniFilesSelected, res);
      });
  }

  // uni吊起原生语音上传
  gotoUploadFile(AudioData: any) {
    UnimpModule.impPlugin &&
      UnimpModule.impPlugin.gotoUploadFile(AudioData, (res: any) => {
        // uni.$emit(natToUniFilesSelected, res);
      });
  }

  // uni统一调起app内的H5方法
  gotoWebView(webViewData: any) {
    UnimpModule.impPlugin &&
      UnimpModule.impPlugin.gotoWebView(webViewData, (res: any) => {
        uni.$emit(natToUniBridgeToH5, res);
      });
  }
}

export const uniToAppPluginBridge = new UnimpModule();
