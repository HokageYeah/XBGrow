<template>
  <view>
    <tui-text :text="task.content" size="28" color="#222222" class="margin-top-set"></tui-text>
    <attach-preview
      class="margin-top-set"
      :img-editable="props.imgEditable"
      :attach-list="task.attachList"
    />
  </view>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import attachPreview from '../xxt-task-detail/attach-preview.vue';
const props = defineProps({
  // task 数据
  taskInfo: {
    type: Object,
    default: () => {}
  },
  imgEditable: {
    type: Boolean,
    default: false
  }
});
const task: any = ref({});

watch(
  () => props.taskInfo,
  (newV) => {
    task.value = newV;
  },
  { immediate: true }
);
</script>

<style scoped>
.margin-top-set {
  margin-top: 28rpx;
}
</style>
