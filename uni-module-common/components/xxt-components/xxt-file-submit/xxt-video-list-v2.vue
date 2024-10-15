<template>
  <scroll-view class="video-list" :scroll-x="true" scroll-left="120" :show-scrollbar="false">
    <View v-for="(item, index) in videoList" :key="item.videoPath" class="video-list-item">
      <image
        class="video-list-item-img"
        mode="scaleToFill"
        :src="`${item.videoPath}?x-oss-process=video/snapshot,t_0,f_jpg`"
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
        color="#92332d"
        :size="16"
        @click="deleteVideo(index)"
      />
    </View>
    <View
      id="captureFile"
      style="display: none"
      :prop="videoList"
      :change:prop="captureFile.capturesyy"
    ></View>
  </scroll-view>
</template>

<script>
export default {
  name: 'Name',
  components: {},
  props: {
    videoList: {},
    isShowDelete: {
      type: Boolean,
      default: true
    },
    maxVideoNumber: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  watch: {
    videoList() {
      this.videoList.forEach((item) => {
        this.videoImg(item);
      });
    }
  },
  mounted() {
    // videoContext = uni.createVideoContext('myVideo');
    this.videoList.forEach((item) => {
      this.videoImg(item);
    });
  },
  created() {},
  methods: {
    videoImg(item) {
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
    },
    deleteVideo(deIndex) {
      emits('update:videoList', props.videoList.filter((_, index) => index !== deIndex) as []);
    },
    clickPlayVideo() {},
    videoErrorCallback(e) {
      uni.showModal({
        content: e.target.errMsg,
        showCancel: false
      });
    },
    captureList(list) {}
  }
};
</script>

<style lang="scss" scoped>
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
	methods: {
     // 发送数据到逻辑层
    capturesyy(list) {
      // console.log('我是需要疯转搞得-----', newlist);
    }
  },
}
</script>
