<!-- eslint-disable vue/no-v-html -->
<template>
  <view>
    <view class="text-black">
      <view ref="textRef" class="break-words">
        <tui-textarea
          class="markdown-body"
          v-if="canEdit"
          :size="28"
          :maxlength="2000"
          v-model="textEdit"
          radius="5px"
          height="400rpx"
          min-height="400rpx"
          :borderTop="false"
          :borderBottom="false"
        ></tui-textarea>
        <scroll-view v-else scroll-y class="markdown-body">
          <view v-html="text"></view>
        </scroll-view>
        <!-- <div
        class="whitespace-pre-wrap"
        v-text="text"
      /> -->
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  textVale: {
    type: String,
    default: ''
  },
  canEdit: {
      type: Boolean,
      default: false,
    },
});
const textEdit = ref('');
const text = computed(() => {
  const value = props.textVale ?? '';
  return value;
});
const emit = defineEmits(['aiContentChange'])
watch(
  () => text.value,
  (newV, oldV) => {
    textEdit.value = newV
  },
  { immediate: true }
);
watch(
  () => textEdit.value,
  (newV, oldV) => {
    emit('aiContentChange',newV)
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.markdown-body {
  overflow: scroll;
  overflow-x: hidden;
  height: 200px;
  background-color: transparent;
  line-height: 24px;
  font-size: 14px;
}
.markdown-body p {
  white-space: pre-wrap;
}
.markdown-body ol {
  list-style-type: decimal;
}
.markdown-body ul {
  list-style-type: disc;
}
.markdown-body pre code,
.markdown-body pre tt {
  line-height: 1;
}
.markdown-body .highlight pre,
.markdown-body pre {
  /* background-color: #fff; */
  background-color: red;
}
.markdown-body code.hljs {
  padding: 0;
}
.markdown-body .code-block-wrapper {
  position: relative;
  padding-top: 24px;
}
.markdown-body .code-block-header {
  display: flex;
  position: absolute;
  right: 0;
  top: 5px;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;
  width: 100%;
  color: #b3b3b3;
}
.markdown-body .code-block-header__copy {
  margin-left: 0.5rem;
  cursor: pointer;
  user-select: none;
}
.markdown-body .code-block-header__copy:hover {
  color: #65a665;
}
.markdown-body :deep(.katex-html) {
  display: none !important;
}
html.dark .message-reply .whitespace-pre-wrap {
  color: var(--n-text-color);
  white-space: pre-wrap;
}
html.dark .highlight pre,
html.dark pre {
  background-color: #282c34;
}
</style>
