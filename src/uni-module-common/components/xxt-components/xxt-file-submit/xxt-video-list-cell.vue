<template>
  <view
    v-for="(item, index) in videoList"
    :key="item.videoPath"
    :class="isNineGrid ? 'nine-grid-item' : 'video-list-item'"
    @click="clickPlayVideo(item.videoPath, index)"
  >
    <!-- #ifdef MP-WEIXIN -->
    <video
      id="video"
      ref="myVideo"
      :class="[
        isNineGrid ? 'nine-grid-item-img' : 'video-list-item-img',
        isNineGrid && isShowDelete ? 'nine-grid-item-img-delete' : ''
      ]"
      :src="noPreload ? videoSrc(index) : item.videoPath"
      controls
      @error="videoErrorCallback"
    />
    <tui-icon
      v-if="isShowDelete"
      :class="isNineGrid ? 'nine-grid-item-icon' : 'video-list-item-icon'"
      custom-prefix="icon-x-cuowu"
      name="iconfont"
      color="#ec6144"
      :size="16"
      style="z-index: 999"
      @click="deleteVideo(index)"
    />
    <image
      v-if="noPreload && !videoSrc(index)"
      :class="[
        isNineGrid ? 'nine-grid-item-img' : 'video-list-item-img',
        isNineGrid && isShowDelete ? 'nine-grid-item-img-delete' : ''
      ]"
      mode="aspectFill"
      :src="item.videoImgPath || `${$cdn}/nb/m/uni-task-center/img/new-video-cover.png`"
      :autoplay="false"
      @click.stop="clickPlayVideo(item.videoPath, index)"
    />
    <tui-icon
      v-if="noPreload && !videoSrc(index)"
      :class="isNineGrid ? 'nine-grid-item-shipin' : 'video-list-item-shipin'"
      custom-prefix="icon-x-shipin"
      name="iconfont"
      color="#4bd975"
      :size="isNineGrid ? 66 : 36"
    />
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <image
      :class="[
        isNineGrid ? 'nine-grid-item-img' : 'video-list-item-img',
        isNineGrid && isShowDelete ? 'nine-grid-item-img-delete' : ''
      ]"
      mode="aspectFill"
      :src="item.videoImgPath || `${$cdn}/nb/m/uni-task-center/img/new-video-cover.png`"
      :autoplay="false"
    />
    <tui-icon
      :class="isNineGrid ? 'nine-grid-item-shipin' : 'video-list-item-shipin'"
      custom-prefix="icon-x-shipin"
      name="iconfont"
      color="#4bd975"
      :size="isNineGrid ? 66 : 36"
    />
    <tui-icon
      v-if="isShowDelete"
      :class="isNineGrid ? 'nine-grid-item-icon' : 'video-list-item-icon'"
      custom-prefix="icon-x-cuowu"
      name="iconfont"
      color="#ec6144"
      :size="16"
      @click="deleteVideo(index)"
    />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import type { videoType } from './xxtFileType';
const props = withDefaults(
  defineProps<{
    videoList: videoType[];
    isShowDelete: boolean;
    maxVideoNumber?: number;
    isNineGrid?: boolean;
    noPreload?: boolean;
  }>(),
  {
    imageList: (): videoType[] => {
      return [];
    },
    isShowDelete: true,
    maxVideoNumber: 1,
    isNineGrid: false,
    noPreload: false
  }
);
const emits = defineEmits<{
  (e: 'clickPlayVideo', videoPath: string): void;
  (e: 'videoErrorCallback', arg: any): void;
  (e: 'deleteVideo', index: number): void;
}>();

const videoSrcObj = ref<{ [key: number]: string }>({});
const videoSrc = computed(() => (index: number) => {
  console.log('videoSrcMap---idx', videoSrcObj.value[index]);
  return videoSrcObj.value[index];
});
const clickPlayVideo = (videoPath: string, idx: number) => {
  console.log('clickPlayVideo', videoPath, idx);

  videoSrcObj.value = {
    [idx]: videoPath
  };
  console.log('videoSrcMap', videoSrcObj.value);

  emits('clickPlayVideo', videoPath);
};
const deleteVideo = (index: number) => {
  emits('deleteVideo', index);
};
const videoErrorCallback = (e: any) => {
  emits('videoErrorCallback', e);
};
</script>

<style scoped lang="scss">
.video-list {
  &-item {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 100px;
    /* background-color: olive; */
    vertical-align: middle;
    &-img {
      overflow: hidden;
      position: absolute;
      left: 50%;
      top: 50%;
      border: 1px solid #4ad975;
      border-radius: 8px;
      width: 77px;
      height: 77px;
      background-color: #ddd;
      transform: translate(-50%, -50%);
    }
    &-icon {
      position: absolute;
      left: 100%;
      top: 0%;
      transform: translate(-120%, 10%);
    }
    &-shipin {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

/* 以下是班级圈适配九宫格样式 */
.nine-grid {
  &-item {
    position: relative;
    width: 100%;
    height: 180px;
    vertical-align: middle;
    margin-top: 8px;
    /* background-color: red; */
    &-img {
      overflow: hidden;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 11px;
      width: 100%;
      height: 100%;
      background-color: #ddd;
      transform: translate(-50%, -50%);
    }
    &-img-delete {
      width: 95%;
      height: 95%;
    }
    &-icon {
      position: absolute;
      left: 100%;
      top: 0%;
      transform: translate(-120%, 10%);
    }
    &-shipin {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.nine-grid-item:first-child {
  margin-top: 0;
}
</style>
