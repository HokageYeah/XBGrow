<template>
  <div>我是组件uni-test123</div>
</template>

<script setup lang="ts">
interface testtype {
  a: number;
  [key: string]: any;
}
const props: testtype = {
  a: 1,
  b: 12
};
</script>

<style scoped></style>
