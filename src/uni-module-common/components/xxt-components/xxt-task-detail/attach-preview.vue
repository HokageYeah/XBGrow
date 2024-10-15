<template>
  <view>
    <XXTImgList
      v-if="imgAry.length > 0"
      v-model:image-list="imgAry"
      :is-editing="props.imgEditable"
      :is-show-delete="false"
    ></XXTImgList>
    <XXTVideoList
      v-if="videoAry!.length > 0"
      v-model:video-list="videoAry"
      :is-show-delete="false"
      :no-preload="props.noPreload"
    />
    <XXTAudioPlayer
      v-for="item in audioAry"
      :key="item.audioPath"
      v-model:audio-ary="audioAry"
      :record-muc-str="item.audioPath"
      :record-time="item.audioTimeNum"
      :is-show-delete="false"
      :no-preload="props.noPreload"
    />
    <XXTFileDocument
      v-for="item in fileAry"
      :key="item.fileID"
      v-model:file-ary="fileAry"
      :file-type-num="item.fileType"
      :file-name="item.fileName"
      :link-address-str="item.fileAddress"
      :is-show-delete="false"
      :file-i-d="item.fileID"
    />
  </view>
</template>

<script setup lang="ts">
import type { audioType, fileType, imageObjType, videoType } from '../xxt-file-submit/xxtFileType';
import XXTImgList from '../xxt-file-submit/xxt-img-list.vue';
import XXTVideoList from '../xxt-file-submit/xxt-video-list.vue';
import XXTAudioPlayer from '../xxt-file-submit/xxt-audio-player.vue';
import XXTFileDocument from '../xxt-file-submit/xxt-file-document.vue';

const props = defineProps({
  attachList: {
    type: Array,
    default: () => []
  },
  imgEditable: {
    type: Boolean,
    default: false
  },
  noPreload: {
    type: Boolean,
    default: false
  }
});
const imgAry = ref<imageObjType[]>([]);
const videoAry = ref<videoType[]>([]);
const audioAry = ref<audioType[]>([]);
const fileAry = ref<fileType[]>([]);

watch(
  () => props.attachList,
  (newV) => {
    imgAry.value = [];
    videoAry.value = [];
    audioAry.value = [];
    fileAry.value = [];
    newV.forEach((e: any) => {
      // fileType 1 图片 2语音 3视频 4文件 5链接
      switch (e.fileType) {
        case 1:
          imgAry.value.push({
            path: e.filePath,
            bigImageUrl: e.filePath,
            size: e.fileSize
          } as imageObjType);
          break;
        case 2:
          audioAry.value.push({
            audioPath: e.filePath,
            audioTimeNum: e.fileParam
          } as audioType);
          break;
        case 3:
          videoAry.value.push({
            videoPath: e.filePath,
            videoSize: e.fileSize
          } as videoType);
          break;
        case 4:
        case 5:
          fileAry.value.push({
            fileID: e.attachmentId,
            fileAddress: e.filePath,
            fileType: e.fileType === 5 ? 0 : e.fileType,
            fileName: e.fileName
          } as fileType);
          break;
        default:
          break;
      }
    });
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
