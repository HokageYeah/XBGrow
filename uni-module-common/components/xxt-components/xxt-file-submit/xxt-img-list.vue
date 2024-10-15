<template>
  <scroll-view v-if="!isNineGrid" class="image-list" :scroll-x="true" :show-scrollbar="false">
    <!-- <view v-for="(item, index) in imageList" :key="item.path" class="image-list-item">
      <image
        class="image-list-item-img"
        mode="aspectFill"
        :src="item.path"
        lazy-load
        @error="imageError"
        @click="clickImage(index)"
      />
      <tui-icon
        v-if="isShowDelete"
        class="image-list-item-icon"
        custom-prefix="icon-x-cuowu"
        name="iconfont"
        color="#ec6144"
        :size="16"
        @click="deleteImage(index)"
      />
    </view>
    <view
      v-if="imageList.length < maxImgNumber && isShowDelete"
      class="image-list-item"
      @click="selectImg"
    >
      <image class="image-list-item-img image-list-item-add" />
      <tui-icon
        class="image-list-item-icon-add"
        custom-prefix="icon-x-add"
        name="iconfont"
        color="#4bd975"
        :size="40"
      />
    </view> -->
    <XXTImgListCell
      :image-list="imageList"
      :is-show-delete="isShowDelete"
      :max-img-number="maxImgNumber"
      @image-error="imageError"
      @click-image="clickImage"
      @delete-image="deleteImage"
      @select-img="selectImg"
    />
  </scroll-view>
  <XXTImgListCell
    v-else
    :image-list="imageList"
    :is-show-delete="isShowDelete"
    :max-img-number="maxImgNumber"
    :is-nine-grid="isNineGrid"
    @image-error="imageError"
    @click-image="clickImage"
    @delete-image="deleteImage"
    @select-img="selectImg"
  />
  <!-- <view class="nine-grid"> -->
  <!-- <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>
    <div class="grid-item">4</div>
    <div class="grid-item">5</div>
    <div class="grid-item">6</div>
    <div class="grid-item">7</div>
    <div class="grid-item">8</div>
    <div class="grid-item">9</div> -->
  <!-- </view> -->
</template>

<script setup lang="ts">
import { uniToNativeImageEditing } from './xxtFileSupportHooks';
import type { imageObjType } from './xxtFileType';
import XXTImgListCell from './xxt-img-list-cell.vue';
import { isNetworkUrl } from '@/uni-module-common/utils/util';
import { uniToAppPluginBridge } from '@/uni-module-common/utils/uniToAppPluginBridge';
const props = withDefaults(
  defineProps<{
    imageList: imageObjType[];
    isShowDelete: boolean;
    isPreviewImg?: boolean;
    isEditing?: boolean;
    maxImgNumber?: number;
    // 班级圈九宫格排开，需要兼容
    isNineGrid?: boolean;
  }>(),
  {
    imageList: (): imageObjType[] => {
      return [];
    },
    isShowDelete: true,
    isEditing: false,
    isPreviewImg: true,
    maxImgNumber: 9,
    isNineGrid: false
  }
);
const emits = defineEmits<{
  (e: 'update:imageList', imgList: []): void;
  (e: 'selectImg'): void;
  (e: 'deleteImage', fileType: number, fileObj: imageObjType): void;
}>();

console.log('isShowDelete----', props.isShowDelete);
console.log(
  'isShowDelete----maxImgNumber-----',
  props.imageList.length < props.maxImgNumber && props.isShowDelete
);

console.log('查看图片数据----', props.imageList);

const imageError = (e: any) => {
  console.error(`image发生error事件，携带值为${e.detail.errMsg}`);
};
const show = ref(false);
const current = ref(0);
const urlsObj = computed(() => {
  return props.imageList.map((item) => ({
    imgPath: item.bigImageUrl?.replace('_s', '') || item.path,
    fileId: item.fileId,
    isNetwork: isNetworkUrl(item.path)
  }));
});
const clickImage = (index: number) => {
  show.value = true;
  current.value = index;
  const imgUrlList = urlsObj.value.filter((item) => item.isNetwork).map((item) => item.imgPath);
  const wImgUrlList = urlsObj.value.map((item) => item.imgPath);
  // #ifdef MP-WEIXIN
  // 小程序图片预览
  uni.previewImage({
    urls: wImgUrlList,
    current: current.value
  });
  // #endif
  if (props.isPreviewImg) {
    // #ifdef APP-PLUS
    // const imgUrlList = urlsObj.value.filter((item) => item.isNetwork).map((item) => item.imgPath);
    // uniToAppPluginBridge.gotoOpenImg({
    //   imgUrlList,
    //   showSave: true,
    //   showEdit: true,
    //   editTitle: '圈画批改',
    //   homeworkCorrect: true,
    //   index: current.value
    // });
    uniToNativeImageEditing({
      imgUrlList,
      showSave: true,
      showEdit: props.isEditing,
      editTitle: '圈画批改',
      homeworkCorrect: true,
      index: current.value
    });
    // #endif
  } else {
    // app端预览图片
    // #ifdef APP-PLUS
    const httpImgList = urlsObj.value.filter((item) => item.isNetwork);
    uniToAppPluginBridge.gotoPreviewImg({
      selectedList: urlsObj.value,
      maxNum: 9,
      selectableNum: 9 - httpImgList.length,
      index: current.value
    });
    // #endif
  }

  // uniToNativeImageOperate(
  //   uniToNatImagePreview,
  //   urls.value,
  //   9,
  //   9 - urls.value.length,
  //   current.value
  // );
};
const deleteImage = (deIndex: number) => {
  const deleImg = props.imageList[deIndex];
  emits('update:imageList', props.imageList.filter((_, index) => index !== deIndex) as []);
  // 附件类型 1 图片 2语音 3视频 4文件 5链接
  emits('deleteImage', 1, deleImg);
};
const selectImg = () => {
  emits('selectImg');
};
</script>

<style scoped lang="scss">
.image-list {
  width: 100%;
  height: 98px;
  /* background-color: aqua; */
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
      transform: translate(-50%, -50%);
    }
    &-add {
      border: 1px dashed #4ad975;
    }
    &-icon-add {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &-icon {
      position: absolute;
      left: 100%;
      top: 0%;
      transform: translate(-120%, 10%);
    }
  } */
}
.grid-item {
  text-align: center; /* 文字居中 */
  height: calc((100vw - 8px - 8px - 16px - 16px - 10px - 10px) / 3);
}
</style>
