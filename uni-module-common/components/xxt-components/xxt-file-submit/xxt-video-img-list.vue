<template>
  <scroll-view class="video-list" :scroll-x="true" scroll-left="120" :show-scrollbar="false">
    <view v-for="(item, index) in videoList" :key="item.videoPath" class="video-list-item">
      <!-- <video
        id="video"
        ref="myVideo"
        class="video-list-item-img"
        :src="item.videoPath"
        controls
        @error="videoErrorCallback"
      /> -->
      <!-- <image
        class="video-list-item-img"
        mode="scaleToFill"
        :src="`${item.videoPath}?x-oss-process=video/snapshot,t_0,f_jpg`"
        :autoplay="false"
        @click="clickPlayVideo(item.videoPath)"
      /> -->
      <image
        class="video-list-item-img"
        mode="scaleToFill"
        :src="item.videoImgPath"
        :autoplay="false"
        @click="clickPlayVideo(item.videoPath)"
      />
      <tui-icon
        class="video-list-item-shipin"
        custom-prefix="icon-x-shipin"
        name="iconfont"
        color="#4bd975"
        :size="36"
      />
      <tui-icon
        v-if="isShowDelete"
        class="video-list-item-icon"
        custom-prefix="icon-x-cuowu"
        name="iconfont"
        color="#ec6144"
        :size="16"
        @click="deleteVideo(index)"
      />
    </view>
    <View style="display: none" :prop="videoList" :change:prop="captureFile.capturesyy"></View>
    <!-- <View style="display: none" :prop="videoList" :change:prop="videos.videosyy"></View> -->
  </scroll-view>
</template>

<script lang="ts">
import type { videoType } from './xxtFileType';
export default {
  props: ['videoList', 'isShowDelete', 'maxVideoNumber'],
  emits: ['update:videoList'],
  setup(props: any, context: any) {
    const myVideo: any = ref(null);
    const output: any = ref(null);
    let videoContext;
    const scale = 0.8;
    const videoImg = (item: videoType) => {
      const videoFile: any = item.videoPath;
      const videoElement = document.createElement('video');
      videoElement.src = videoFile;
      videoElement.currentTime = 1; // 获取第一帧的图片
      videoElement.addEventListener('loadedmetadata', () => {
        // eslint-disable-next-line no-debugger, no-restricted-syntax
        debugger;
        const canvasElement = document.createElement('canvas');
        const context: any = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        // 确保视频不显示在页面上
        videoElement.style.display = 'none';
        // 绘制视频的第一帧到画布上
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        // 将画布内容转换为数据 URL
        item.videoImgPath = canvasElement.toDataURL().replace(/[\r\n]/g, '');
      });
    };
    watch(
      () => props.videoList,
      () => {
        // debugger;
        props.videoList.forEach((item) => {
          // #ifdef H5
          videoImg(item);
          // #endif
        });
      },
      { deep: true }
    );
    const clickPlayVideo = (videoPath: string) => {};
    onMounted(() => {
      videoContext = uni.createVideoContext('myVideo');
      props.videoList.forEach((item) => {
        // #ifdef H5
        videoImg(item);
        // #endif
      });
    });
    const deleteVideo = (deIndex: number) => {
      context.emit(
        'update:videoList',
        props.videoList.filter((_: any, index: number) => index !== deIndex) as []
      );
    };
    const videoErrorCallback = (e: any) => {
      uni.showModal({
        content: e.target.errMsg,
        showCancel: false
      });
    };
    const captureList = (list: any) => {
      // context.emit('update:videoList', list);
    };
    return {
      captureList,
      deleteVideo,
      clickPlayVideo
    };
  }
};
</script>

<style scoped lang="scss">
.video-list {
  width: 100%;
  height: 98px;
  background-color: darkcyan;
  white-space: nowrap;
  &-item {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 100px;
    background-color: olive;
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
</style>

<script module="captureFile" lang="renderjs">
export default {
  setup(props) {
    const videoImg = (item) => {
      return new Promise(resolve => {
        const videoFile = item.videoPath;
        const videoElement = document.createElement('video');
        videoElement.src = videoFile;
        videoElement.currentTime = 1; // 获取第一帧的图片
        // videoElement.autoplay = true;
        // videoElement.play();
        videoElement.addEventListener('loadedmetadata', () => {
        // eslint-disable-next-line no-debugger, no-restricted-syntax
          debugger;
          const canvasElement = document.createElement('canvas');
          const context = canvasElement.getContext('2d');
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;
          // 确保视频不显示在页面上
          videoElement.style.display = 'none';
          // 绘制视频的第一帧到画布上
          context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          // 将画布内容转换为数据 URL
          resolve(canvasElement.toDataURL().replace(/[\r\n]/g, ''))
        });
      })
    }
    // 提供给renderjs调用的函数
    const capturesyy = async (newValue, oldValue, ownerVm, vm) => {
      // eslint-disable-next-line no-debugger, no-restricted-syntax
      debugger;
      const newlist = [];
      for (let index = 0; index < newValue.length; index++) {
        const element = newValue[index];
        const str = await videoImg(element);
        element.videoImgPath = str
        newlist.push(element)
      }
      // 用来处理业务逻辑
      ownerVm.callMethod('captureList', newlist)
    };
    return {
      capturesyy
    };
  }
};
</script>
