import {
  natToUniFilesSelected,
  natToUniImageEditing,
  natToUniImagePreview,
  natToUniImageSelected,
  natToUniVideoSelected,
  uniToNatChooseWxFile,
  uniToNatFilesOpen,
  uniToNatFilesSelect,
  uniToNatImageEditing,
  uniToNatImagePreview,
  uniToNatImageSelect,
  uniToNatVideoPlay,
  uniToNatVideoSelect
} from '@/uni-module-common/utils/uniToNavProtocol';
import bridge from '@/uni-module-common/utils/uniToNativeBridge';
// 调用原生事件
export const uniToNativeVideoSelect = (
  videoDuration = 120,
  videoNum = 1,
  videoPaths: string[] = []
) => {
  bridge
    .sendNativeEvent(uniToNatVideoSelect, {
      videoDuration,
      videoNum,
      videoPaths
    })
    .then((res) => {
      uni.$emit(natToUniVideoSelected, res);
    });
};

export const uniToNativeVideoPlay = (videoPath: string) => {
  bridge
    .sendNativeEvent(uniToNatVideoPlay, {
      videoPath
    })
    .then((res) => {});
};

export const uniToNativeFilesSelect = (
  filesNum = 1,
  filesPaths: string[] = [],
  fileType: number
) => {
  bridge
    .sendNativeEvent(uniToNatFilesSelect, {
      filesNum,
      filesPaths,
      fileType
    })
    .then((res) => {
      uni.$emit(natToUniFilesSelected, res);
    });
};

export const uniToNativeFilesOpen = (filePath: string) => {
  bridge
    .sendNativeEvent(uniToNatFilesOpen, {
      filePath
    })
    .then(() => {});
};

export const uniToNativeImageOperate = (
  eventStr: string = uniToNatImageSelect,
  selectedList: string[] = [],
  maxNum = 9,
  selectableNum = 9,
  index = 0
) => {
  bridge
    .sendNativeEvent(eventStr, {
      selectedList,
      maxNum,
      selectableNum,
      index
    })
    .then((res) => {
      switch (eventStr) {
        case uniToNatImageSelect:
          uni.$emit(natToUniImageSelected, res);
          break;
        case uniToNatImagePreview:
          uni.$emit(natToUniImagePreview, res);
          break;
        default:
          break;
      }
    });
};

export const uniToNativeImageEditing = (data: any) => {
  bridge.sendNativeEvent(uniToNatImageEditing, data).then((res: any) => {
    uni.$emit(natToUniImageEditing, res);
  });
};
export const uniToNativeChooseWxFile = (wxmpId: string, path: string) => {
  bridge
    .sendNativeEvent(uniToNatChooseWxFile, {
      wxmpId,
      path
    })
    .then((res) => {
      // uni.$emit(natToUniChooseWxFile, res);
    });
};

// 原生回传事件

export default function useNativeToUni() {
  onMounted(() => {});
}
