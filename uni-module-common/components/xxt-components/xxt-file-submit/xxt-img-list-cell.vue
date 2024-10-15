<template>
  <view :class="isNineGrid ? 'nine-grid' : ''">
    <view
      v-for="(item, index) in filterImageList"
      :key="item.path"
      :class="isNineGrid ? 'nine-grid-item' : 'image-list-item'"
    >
      <image
        :class="[
          isNineGrid ? 'nine-grid-item-img' : 'image-list-item-img',
          isNineGrid && isShowDelete ? 'nine-grid-item-img-delete' : ''
        ]"
        mode="aspectFill"
        :src="item.path"
        lazy-load
        @error="imageError"
        @click="clickImage(index)"
      />
      <tui-icon
        v-if="isShowDelete"
        :class="isNineGrid ? 'nine-grid-item-icon' : 'image-list-item-icon'"
        custom-prefix="icon-x-cuowu"
        name="iconfont"
        color="#ec6144"
        :size="16"
        @click="deleteImage(index)"
      />
      <view
        v-if="isNineGrid && !isShowDelete && beyondNineImgNumber > 0 && index === 8"
        class="nine-grid-item-beyond-view"
        @click="clickImage(index)"
        >+{{ beyondNineImgNumber }}</view
      >
    </view>
    <view
      v-if="imageList.length < maxImgNumber && isShowDelete"
      :class="[isNineGrid ? 'nine-grid-item' : 'image-list-item']"
      @click="selectImg"
    >
      <image
        :class="[
          isNineGrid
            ? 'nine-grid-item-img nine-grid-item-add'
            : 'image-list-item-img image-list-item-add',
          isNineGrid && isShowDelete ? 'nine-grid-item-img-delete' : ''
        ]"
      />
      <tui-icon
        :class="isNineGrid ? 'nine-grid-item-icon-add' : 'image-list-item-icon-add'"
        custom-prefix="icon-x-add"
        name="iconfont"
        color="#4bd975"
        :size="40"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { imageObjType } from './xxtFileType';
const props = withDefaults(
  defineProps<{
    imageList: imageObjType[];
    isShowDelete: boolean;
    maxImgNumber?: number;
    isNineGrid?: boolean;
  }>(),
  {
    imageList: (): imageObjType[] => {
      return [];
    },
    isShowDelete: true,
    maxImgNumber: 9,
    isNineGrid: false
  }
);
const emits = defineEmits<{
  (e: 'imageError', arg: any): void;
  (e: 'clickImage', index: number): void;
  (e: 'deleteImage', index: number): void;
  (e: 'selectImg'): void;
}>();
// 获取超过九张的图片张数
const beyondNineImgNumber = computed(() => {
  return props.imageList.length > 9 ? props.imageList.length - 9 : 0;
});
// 过滤后的图片列表
const filterImageList = computed(() => {
  console.log(
    'filterImageList ---new---',
    props.isNineGrid,
    props.isShowDelete,
    beyondNineImgNumber.value,
    props.imageList
  );
  if (props.isNineGrid && !props.isShowDelete) {
    return props.imageList.slice(0, 9);
  }
  return props.imageList;
});
const imageError = (e: any) => {
  emits('imageError', e);
};
const clickImage = (index: number) => {
  console.log('clickImage----', index);
  emits('clickImage', index);
};
const deleteImage = (index: number) => {
  emits('deleteImage', index);
};
const selectImg = () => {
  emits('selectImg');
};
</script>

<style scoped lang="scss">
.image-list {
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
      /* background-color: #ddd; */
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
  }
}
/* 以下是班级圈适配九宫格样式 */
.nine-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  // #ifndef MP-WEIXIN
  width: 100%;
  // #endif
  /* 样式新增条件编译，小程序中的样式 */
  // #ifdef MP-WEIXIN
  width: calc(100vw - 16px - 16px - 8px - 8px);
  // #endif
  /* background-color: aqua; */
}
.nine-grid {
  &-item {
    display: inline-block;
    position: relative;
    width: 100%;
    height: calc((100vw - 8px - 8px - 16px - 16px - 10px - 10px) / 3);
    /* background-color: olive; */
    vertical-align: middle;
    &-img {
      overflow: hidden;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 13px;
      width: 100%;
      height: 100%;
      /* background-color: #ddd; */
      transform: translate(-50%, -50%);
    }
    &-img-delete {
      width: 90%;
      height: 90%;
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
    &-beyond-view {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 13px;
      text-align: center;
      line-height: calc((100vw - 8px - 8px - 16px - 16px - 10px - 10px) / 3);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 26px;
    }
  }
}
</style>
