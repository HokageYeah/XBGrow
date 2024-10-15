<template>
  <view style="background-color: #fff">
    <tui-textarea
      v-model="textareaContent"
      :is-counter="!props.contentDisabled"
      :maxlength="1000"
      :border-top="false"
      :border-bottom="false"
      :size="28"
      color="#222"
      placeholder="请输入作业内容"
      placeholder-style="font-size: 14px; color: #999999"
      background-color="#f9f9f9"
      :counter-size="24"
      min-height="150px"
      :radius="16"
      :disabled="props.contentDisabled"
    ></tui-textarea>
    <view v-if="props.fileBarShow" style="padding-top: 12px">
      <xxt-file-submit />
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import { getDeleteAttachList, initTaskFile } from '@/uni-module-common/utils/bizCommon';

const props = defineProps({
  // 修改初始化传入content
  content: {
    type: String,
    default: ''
  },
  // 内容禁用
  contentDisabled: {
    type: Boolean,
    default: false
  },
  // 是否展示附件模块
  fileBarShow: {
    type: Boolean,
    default: true
  },
  // 修改初始化传入附件
  attachList: {
    type: Array,
    default: () => []
  }
});

const textareaContent = ref('');

// 作业附件 store
const { updateImgAry, updateVideoAry, updateFileAry, updateAudioAry }: any = useStore('fileUpload');

const getTextareaContent = () => {
  return textareaContent.value;
};

watch(
  () => props.content,
  (newV) => {
    if (newV) {
      textareaContent.value = newV;
    }
  },
  { immediate: true }
);

watch(
  () => props.attachList,
  (newV) => {
    if (newV && newV.length > 0) {
      initTaskFile(newV);
    }
  },
  { immediate: true }
);

defineExpose({
  getDeleteAttachList,
  getTextareaContent
});

onMounted(() => {
  // 清空 附件 store
  updateImgAry([]);
  updateVideoAry([]);
  updateFileAry([]);
  updateAudioAry([]);
});
onUnmounted(() => {
  // 清空 附件 store
  updateImgAry([]);
  updateVideoAry([]);
  updateFileAry([]);
  updateAudioAry([]);
});
</script>

<style scoped lang="scss"></style>
