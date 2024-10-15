<template>
  <scroll-view
    v-if="!isNineGrid"
    class="video-list"
    :scroll-x="true"
    scroll-left="120"
    :show-scrollbar="false"
  >
    <!-- <view
      v-for="(item, index) in videoList"
      :key="item.videoPath"
      class="video-list-item"
      @click="clickPlayVideo(item.videoPath)"
    > -->
    <!-- #ifdef MP-WEIXIN -->
    <!-- <video
        id="video"
        ref="myVideo"
        class="video-list-item-img"
        :src="item.videoPath"
        controls
        @error="videoErrorCallback"
      />
      <tui-icon
        v-if="isShowDelete"
        class="video-list-item-icon"
        custom-prefix="icon-x-cuowu"
        name="iconfont"
        color="#ec6144"
        :size="16"
        @click="deleteVideo(index)"
      /> -->
    <!-- #endif -->
    <!-- <image
        class="video-list-item-img"
        mode="scaleToFill"
        :src="`${item.videoPath}?x-oss-process=video/snapshot,t_0,f_jpg`"
        :autoplay="false"
        @click="clickPlayVideo(item.videoPath)"
      /> -->
    <!-- #ifndef MP-WEIXIN -->
    <!-- <image
        class="video-list-item-img"
        mode="aspectFill"
        :src="item.videoImgPath || `${$cdn}/nb/m/uni-task-center/img/video-cover-image.png`"
        :autoplay="false"
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
      /> -->
    <!-- #endif -->
    <!-- </view> -->
    <!-- <View style="display: none" :prop="videoList" :change:prop="captureFile.capturesyy"></View> -->
    <!-- <View style="display: none" :prop="videoList" :change:prop="videos.videosyy"></View> -->
    <XXTVideoListCell
      :video-list="videoList"
      :is-show-delete="isShowDelete"
      :no-preload="noPreload"
      @delete-video="deleteVideo"
      @click-play-video="clickPlayVideo"
      @video-error-callback="videoErrorCallback"
    />
  </scroll-view>
  <XXTVideoListCell
    v-else
    :video-list="videoList"
    :is-show-delete="isShowDelete"
    :is-nine-grid="isNineGrid"
    :no-preload="noPreload"
    @delete-video="deleteVideo"
    @click-play-video="clickPlayVideo"
    @video-error-callback="videoErrorCallback"
  />
</template>

<script setup lang="ts">
import { uniToNativeVideoPlay } from './xxtFileSupportHooks';
import type { videoType } from './xxtFileType';
import XXTVideoListCell from './xxt-video-list-cell.vue';
const props = withDefaults(
  defineProps<{
    videoList: videoType[];
    isShowDelete: boolean;
    maxVideoNumber?: number;
    noPreload?: boolean; // 是否不预加载视频，解决视频附件过多时，小程序页面崩溃问题
    isNineGrid?: boolean;
  }>(),
  {
    imageList: (): videoType[] => {
      return [];
    },
    isShowDelete: true,
    maxVideoNumber: 1,
    noPreload: false,
    isNineGrid: false
  }
);
const emits = defineEmits<{
  (e: 'update:videoList', imgList: []): void;
  (e: 'deleteVideo', fileType: number, fileObj: videoType): void;
}>();
const myVideo: any = ref(null);
const output: any = ref(null);
let videoContext;
const scale = 0.8;
// const captureImage = () => {
//   // console.log('myVideo----', myVideo);
//   const canvas = document.createElement('canvas');
//   canvas.width = myVideo.videoWidth * scale;
//   canvas.height = myVideo.videoHeight * scale;
//   const ctx = canvas.getContext('2d');
//   // eslint-disable-next-line no-debugger, no-restricted-syntax
//   debugger;
//   if (ctx) {
//     ctx.drawImage(myVideo.value, 0, 0, canvas.width, canvas.height);
//   } else {
//     console.error('Failed to get 2D context for canvas');
//   }
//   const img = document.createElement('img');
//   img.src = canvas.toDataURL('image/png');
//   output.value.appendChild(img);
// };

const videoImg = (item: videoType) => {
  // nextTick(() => {
  //   const videoContext = uni.createVideoContext('video', this);
  //   // console.log('videoImg-----', videoContext);
  //   videoContext.pause(); // 暂停视频播放
  //   videoContext.seek(4); // 跳转到视频开始处
  //   const canvasContext = uni.createCanvasContext('idCanvas', this);
  //   canvasContext.drawImage(videoContext);

  //   const canvasId = 'idCanvas';
  //   const query = uni.createSelectorQuery().in(this);
  //   debugger;
  //   query
  //     .select('#idCanvas')
  //     .fields({ node: true, size: true })
  //     .exec((res) => {
  //       const canvas = res[0].node;
  //       // console.log('videoContext---', videoContext);
  //       debugger;
  //       const context = canvas.getContext('2d');
  //       canvas.width = videoContext.videoWidth;
  //       canvas.height = videoContext.videoHeight;
  //       context.drawImage(videoContext, 0, 0, canvas.width, canvas.height);
  //       const coverSrc = canvas.toDataURL(); // 将画面转换成图片
  //     });
  // });

  // nextTick(() => {
  //   // console.log('myVideo--ref----', myVideo.value[0]);
  //   // console.log('myVideo--ref----', myVideo.value[0].src);
  //   // console.log('myVideo--currentTime----', myVideo.value[0].currentTime);
  //   // console.log('myVideo--videoWidth----', myVideo.value[0].videoWidth);
  //   myVideo.value[0].addEventListener('loadedmetadata', () => {
  //     // console.log('loadedmetadata');
  //   });
  // });

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
// #ifdef H5
watch(
  () => props.videoList,
  () => {
    props.videoList.forEach((item) => {
      videoImg(item);
    });
  },
  { deep: true }
);
onMounted(() => {
  videoContext = uni.createVideoContext('myVideo');
  props.videoList.forEach((item) => {
    videoImg(item);
  });
});
// #endif
const clickPlayVideo = (videoPath: string) => {
  // app端预览视频
  // #ifdef APP-PLUS
  // uniToAppPluginBridge.gotoPlayVideo({
  //   videoPath
  // });
  console.log('小程序视频预览----app端', videoPath);

  uniToNativeVideoPlay(videoPath);

  // #endif

  // #ifdef MP-WEIXIN
  // 小程序预览视频
  console.log('小程序视频预览----', videoPath);
  // #endif
};
const deleteVideo = (deIndex: number) => {
  const deleVideo = props.videoList[deIndex];
  emits('update:videoList', props.videoList.filter((_, index) => index !== deIndex) as []);
  // 附件类型 1 图片 2语音 3视频 4文件 5链接
  emits('deleteVideo', 3, deleVideo);
};
const videoErrorCallback = (e: any) => {
  uni.showModal({
    content: e.target.errMsg,
    showCancel: false
  });
};
// const captureList = (list) => {
//   // console.log('我是从renderjs的回掉captureList-----', list);
// };
</script>

<style scoped lang="scss">
.video-list {
  width: 100%;
  height: 98px;
  white-space: nowrap;
  /* &-item {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 100px;
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
  } */
}
</style>

<!-- <script module="captureFile" lang="renderjs">
export default {
  setup() {
    const videoImg = (item) => {
      return new Promise(resolve => {
        const videoFile = item.videoPath;
        // console.log('document-----', document);
        const videoElement = document.createElement('video');
        videoElement.src = videoFile;
        videoElement.currentTime = 1; // 获取第一帧的图片
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
      // console.log('我是需要疯转搞得-----');
      const newlist = [];
      for (let index = 0; index < newValue.length; index++) {
        const element = newValue[index];
        const str = await videoImg(element);
        element.videoImgPath = str
        newlist.push(element)
      }
      // 用来处理业务逻辑
      // // console.log('我是需要疯转搞得newValue-----', JSON.stringify(newValue));
      // // console.log('我是需要疯转搞得oldValue-----', JSON.stringify(oldValue));
      // console.log('我是需要疯转搞得ownerVm-----',ownerVm.callMethod);
      // console.log('我是需要疯转搞得vm-----',(vm));
      // // console.log('我是需要疯转搞得this.$ownerInstance-----', JSON.stringify(newlist));
      ownerVm.callMethod('captureList', {
        newlist
      })
    };
    return {
      capturesyy
    };
  }
};
</script> -->
