<template>
  <view class="xxt-file-document">
    <view class="xxt-file-document-bg" @click="linkClick">
      <image class="xxt-file-document-bg-img" mode="aspectFill" :src="fileImgSrc"></image>
      <xxt-text-overflow class="xxt-file-document-bg-text" :text="fileName" :clamp="2" />
    </view>
    <tui-icon
      v-if="isShowDelete"
      class="xxt-file-document-delete-icon"
      custom-prefix="icon-x-cuowu"
      name="iconfont"
      color="#ec6144"
      :size="16"
      @click="deleteFile"
    />
  </view>
</template>

<script setup lang="ts">
import type { fileType } from './xxtFileType';
import { uniToAppPluginBridge } from '@/uni-module-common/utils/uniToAppPluginBridge';
import { $cdn } from '@/uni-module-common/config';
import { isNetworkUrl } from '@/uni-module-common/utils/util';
// filetype: 0 是链接。 1 是docx、 2 pdf、 3 ppt、 4 txt
const props = withDefaults(
  defineProps<{
    fileTypeNum: number;
    isShowDelete?: boolean;
    canPreviewFile?: boolean;
    fileName: string;
    linkAddressStr: string;
    fileID: string;
    itemSeq: number;
    fileAry: fileType[];
  }>(),
  {
    fileTypeNum: 0,
    isShowDelete: true,
    canPreviewFile: true,
    fileName: '',
    linkAddressStr: '',
    fileID: '',
    itemSeq: -1,
    fileAry: (): fileType[] => {
      return [];
    }
  }
);
const emits = defineEmits<{
  (e: 'update:fileAry', audioList: fileType[]): void;
  (e: 'deleteFileDocument', fileType: number, fileObj: fileType): void;
}>();
const getExtension = (filename: string) => {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex !== -1) {
    return filename.substring(dotIndex + 1).toLowerCase();
  }
  return 'word';
};
const getFileImage = (ext: string) => {
  let extstr = 'word';
  switch (ext) {
    case 'doc':
    case 'docx':
    case 'dot':
    case 'dotx':
      extstr = 'word';
      break;
    case 'xls':
    case 'xlsx':
      extstr = 'excel';
      break;
    case 'ppt':
    case 'pptx':
      extstr = 'ppt';
      break;
    case 'pdf':
      extstr = 'pdf';
      break;
    case 'mp3':
    case 'wav':
    case 'aac':
    case 'm4a':
    case 'mp4':
      extstr = 'music';
      break;
    case 'zip':
      extstr = 'file';
      break;
    case 'rar':
      extstr = 'file';
      break;
    case 'txt':
      extstr = 'txt';
      break;
    default:
      break;
  }
  return extstr;
};
// filetype: 0 是链接。 1 是docx、 2 pdf、 3 ppt、 4 txt
const fileImgSrc = computed(() => {
  switch (props.fileTypeNum) {
    case 0:
      return `${$cdn}/nb/m/uni-task-center/img/ic_link.png`;
    default: {
      const imgname = getFileImage(getExtension(props.fileName));
      return `${$cdn}/nb/m/uni-task-center/img/ic_${imgname}.png`;
    }
  }
});
const router = useRouter();
const deleteFile = () => {
  let deleteFile;
  let fileArr;
  if (props.itemSeq > 0) {
    deleteFile = props.fileAry.find(
      (item) => item.fileID === props.fileID && item.itemSeq === props.itemSeq
    ) as fileType;
    fileArr = props.fileAry.filter(
      (item) => item.fileID !== props.fileID || item.itemSeq !== props.itemSeq
    ) as [];
  } else {
    deleteFile = props.fileAry.find((item) => item.fileID === props.fileID) as fileType;
    fileArr = props.fileAry.filter((item) => item.fileID !== props.fileID) as [];
  }
  emits('update:fileAry', fileArr);
  // 附件类型 1 图片 2语音 3视频 4文件 5链接
  const type = props.fileTypeNum === 0 ? 5 : 4;
  emits('deleteFileDocument', type, deleteFile);
};
const openDocumentFunc = (filePath: string) => {
  uni.openDocument({
    filePath,
    showMenu: true,
    success(res) {
      console.log('打开文档成功', res);
    },
    fail(res) {
      console.log('打开文档失败', res);
    }
  });
};
const linkClick = () => {
  console.log('打开文件linkClick');
  if (!props.canPreviewFile) {
    return;
  }
  switch (props.fileTypeNum) {
    case 0:
      // #ifndef MP-WEIXIN
      router.push({
        path: '/uni_modules/uni-module-public/web-to-h5/web-to-h5',
        query: {
          url: props.linkAddressStr
        }
      });
      // #endif
      break;
    default:
      // app端预览文件
      // #ifdef APP-PLUS
      console.log('打开文件--app--', props.linkAddressStr, props.fileID, props.fileName);
      uniToAppPluginBridge.gotoOpenFile({
        fileId: props.fileID,
        filePath: props.linkAddressStr,
        fileName: props.fileName
      });
      // #endif
      // #ifdef MP-WEIXIN
      console.log('打开文件', props.linkAddressStr, isNetworkUrl(props.linkAddressStr));
      if (isNetworkUrl(props.linkAddressStr)) {
        console.log('打开文件', isNetworkUrl(props.linkAddressStr));
        uni.downloadFile({
          url: props.linkAddressStr,
          success(res) {
            const filePath = res.tempFilePath;
            openDocumentFunc(filePath);
          }
        });
      } else {
        console.log('打开文件---', isNetworkUrl(props.linkAddressStr));
        openDocumentFunc(props.linkAddressStr);
      }
      // #endif
      break;
  }
};
</script>

<style scoped lang="scss">
.xxt-file-document {
  position: relative;
  padding: 8px 16px;
  &-bg {
    @include normalFlex(row, flex-start);
    padding: 0 10px;
    border-radius: 8px;
    height: 40px;
    background-color: #f9f9f9;
    &-img {
      width: 30px;
      height: 30px;
    }
    &-text {
      flex: 1;
      margin-left: 10px;
      color: #4bd975;
    }
  }
  &-delete-icon {
    position: absolute;
    right: 10px;
    top: 2px;
  }
}
</style>
