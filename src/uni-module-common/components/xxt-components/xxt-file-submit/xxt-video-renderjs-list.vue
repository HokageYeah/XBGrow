<template>
  <scroll-view class="video-list" :scroll-x="true" scroll-left="120" :show-scrollbar="false">
    <View v-for="(item, index) in videoList" :key="item.videoPath" class="video-list-item">
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
    </View>
    <video
      v-if="sourcesSrc"
      :src="sourcesSrc"
      autoplay
      x5-playsinline="true"
      playsinline="true"
      webkit-playsinline="true"
      x-webkit-airplay="true"
      x5-video-orientation="portraint"
      controls
      controlslist="nodownload noplaybackrate"
      disablePictureInPicture
      width="260"
      height="160"
    />
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
    let videoContext;
    const sourcesSrc = ref('');
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
        // console.log('videoImgPath-----', item.videoImgPath);
      });
    };
    const deleteVideo = (deIndex: number) => {
      context.emit(
        'update:videoList',
        props.videoList.filter((_: any, index: number) => index !== deIndex) as []
      );
      // console.log('renderjs---deleteVideo----', deIndex);
    };
    const clickPlayVideo = (videoPath: string) => {};
    onMounted(() => {
      videoContext = uni.createVideoContext('myVideo');
      // sourcesSrc.value = props.videoList[0].videoPath;
      props.videoList.forEach((item: any) => {
        // #ifdef H5
        videoImg(item);
        // #endif
      });
    });
    watch(
      () => props.videoList,
      () => {
        // debugger;
        props.videoList.forEach((item: any) => {
          // #ifdef H5
          videoImg(item);
          // #endif
        });
        // sourcesSrc.value = props.videoList[0].videoPath;
        // console.log('的watch-----', sourcesSrc.value);
      },
      { deep: true }
    );
    const decoding = (dataurl: string) => {
      const newBase64Arr = dataurl.split(',');
      const newBase64Src = atob(newBase64Arr[1]);
      // console.log('视频播放newBase64Src----', newBase64Src.length);
      return newBase64Src;
    };
    const captureList = (list: any) => {
      // sourcesSrc.value = decoding(list.txtData);
      // sourcesSrc.value = list.sourcesSrcNew;
      // console.log('我是从renderjs的回掉captureList-videoImgyy-----', sourcesSrc.value.length);
    };
    return {
      captureList,
      deleteVideo,
      clickPlayVideo,
      sourcesSrc
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
import {ref,onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onBeforeUnmount,onUnmounted, watch} from 'vue'
export default {
  setup(props) {
    // console.log('renderjs00---props -----', props.videoList);
    const refList = ref([]);
    let ownerNewVm;
    const dataURLtoFile = (dataurl, filename) => {
      // console.log('dataURLtoFile-arr------');
      // console.log('dataURLtoFile-arr------', dataurl.length);
      const arr = dataurl.split(',');
      // console.log('dataURLtoFile-arr------', arr.length);
      const mime = arr[0].match(/:(.*?);/)[1];
      // console.log('dataURLtoFile-mime------', mime.length);
      const bstr = atob(arr[1]);
      // console.log('dataURLtoFile-bstr------', bstr.length);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      // console.log('dataURLtoFile-u8arr------',u8arr.length);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // console.log('dataURLtoFile-u8arr-charCodeAt------',u8arr.length);
      return new File([u8arr], filename, {
        type: mime
      });
    }
    // 将base64转换为blob
    function dataURLtoBlob(dataurl) {
      // console.log('dataURLtoBlob-arr------');
      const arr = dataurl.split(',');
      // // console.log('dataURLtoBlob-arr------', arr);
      const mime = arr[0].match(/:(.*?);/)[1];
      // console.log('dataURLtoBlob-mime------', mime);
      const bstr = atob(arr[1]);
      // console.log('dataURLtoBlob-bstr------', bstr.length);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      // console.log('dataURLtoBlob-u8arr------', u8arr.length);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    }

    const base64ToBlob = (base64Data) => {
      try {
              // // console.log('base64Data-------', base64Data);
        const parts = base64Data.split(';base64,');
        // // console.log('base64Data----parts----',parts);
        const contentType = parts[0].split(':')[1];
        // console.log('contentType-嘿嘿------', contentType);
        const byteCharacters = atob(parts[1]);
        // console.log('byteCharacters-byteCharacters------', byteCharacters.length);
        const byteArrays = [];
        // console.log('byteCharacters.length-------', byteCharacters.length);
        // const arrayBuffer = uni.base64ToArrayBuffer(base64Data);
        // // console.log('arrayBufferdddd-------', arrayBuffer);
        // const arraybufferFile = new File([arrayBuffer], 'tempArrayBuffer');
        // // console.log('arraybufferFile-File------', arraybufferFile);
        // const arrayBufferBlob = new Blob([arrayBuffer]);
        // // console.log('arrayBufferBlob-------', arrayBufferBlob);
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        // console.log('byteArrays.length-------', byteArrays.length);
        const newBlob = new Blob(byteArrays, { type: contentType });
        // console.log('byteArrays-------', byteArrays.length);
        // console.log('newBlob-------', newBlob.length);
        return newBlob;
      } catch (error) {
        // console.log('这个是报错了trycatch-----',error);
      }
    };
    const blob2Url = (file) => {
      let sourcesSrc;
      if (window.createObjectURL !== undefined) {
        // basic
        // file.file是文件体，文件体本身就是 blob 格式
        sourcesSrc = window.createObjectURL(file);
        // console.log('-------sourcesSrc-------', sourcesSrc);
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        sourcesSrc = window.URL.createObjectURL(file);
        // console.log('-------sourcesSrc-------', sourcesSrc);
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        sourcesSrc = window.webkitURL.createObjectURL(file);
        // console.log('-------sourcesSrc-------', sourcesSrc);
      }
      return sourcesSrc;
    };
    const base64DataDraw = (Url) => {
      return new Promise((resolve, reject) => {
        // 将视频转为base64位
        // Url 为视频的路径
        const path = plus.io.convertLocalFileSystemURL(Url);
        // console.log('转换base64Url----', Url);
        // console.log('转换base64path----', path);
        const fileReader = new plus.io.FileReader();
        fileReader.readAsDataURL(path);
        fileReader.onloadend = (res) => {
          // const txtData = res.target.result;
          // // ---------------------------
          // const blob = base64ToBlob(res);
          // const file = new File([blob], `${new Date().getTime()}.${blob.type.split('/').pop()}`, {
          //   type: blob.type
          // });
          // const sourcesSrc = blob2Url(file);
          // // console.log('转换base64--sourcesSrc----', sourcesSrc);
          // resolve(sourcesSrc);
        };
        fileReader.onerror = (e) => {
          // 读文件失败
          // console.log('获取文件失败base64Data-----', fileReader.error, '-----base64Data获取文件失败');
          plus.nativeUI.toast('获取文件失败,请重启应用', {
            background: '#ffa38c'
          });
          reject(fileReader.error);
        };
        fileReader.onload = (e) => {
          // 读文件成功
          const txtData = e.target.result;
          // // console.log('读取成功base64Data----', txtData);

          const filenew = dataURLtoFile(txtData, `${new Date().getTime()}.video/mp4`);
          // console.log('转换dataURLtoFile----', JSON.stringify(filenew));
          const sourcesSrcNew = blob2Url(filenew);
          // console.log('转换dataURLtoFile--sourcesSrc----', sourcesSrcNew);


          // const blob = base64ToBlob(txtData);
          const blob = dataURLtoBlob(txtData);
          // // console.log('读取成功base64Data----', txtData);
          // console.log('转换blob.length----', blob.size);
          // console.log('转换blob.type----', blob.type);
          // console.log('转换blob.name----', `${new Date().getTime()}.${blob.type.split('/').pop()}`);
          const file = new File([blob], `${new Date().getTime()}.${blob.type.split('/').pop()}`, {
            type: blob.type
          });
          // console.log('转换base64--file----', file.size);
          const sourcesSrc = blob2Url(file);
          // console.log('转换base64--sourcesSrc----', sourcesSrc);
          resolve({sourcesSrcNew, txtData});
        };
      });
    };
    const videoImgyy = (item) => {
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
        const str = await videoImgyy(element);
        element.videoImgPath = str
        newlist.push(element)
      }
      refList.value = newlist;
      // 用来处理业务逻辑
      // // console.log('我是需要疯转搞得newValue-----', JSON.stringify(newValue));
      // // console.log('我是需要疯转搞得oldValue-----', JSON.stringify(oldValue));
      // console.log('我是需要疯转搞得ownerVm-----',ownerVm.callMethod);
      // console.log('我是需要疯转搞得vm-----',(vm));
      // ownerVm.callMethod('captureList', {
      //   newlist
      // })
      ownerNewVm = ownerVm;
    };
    watch(
      () => refList,
      () => {
        // debugger;
        // console.log('watch---调用了', refList.value);
        refList.value.forEach((item) => {
          // console.log('这是runderjs 的调用warch-----', JSON.stringify(item.videoPath));
          base64DataDraw(item.videoPath).then(resolve => {
            // console.log('我这个是毁掉了----', resolve);
            ownerNewVm.callMethod('captureList',resolve)
          });
        });
      },
      { deep: true, immediate:true }
    );
    return {
      capturesyy
    };
  }
};
</script>
