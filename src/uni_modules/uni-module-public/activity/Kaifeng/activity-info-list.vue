<template>
  <view class="container">
    <ActivityInformation :activity-id="activityId" :page-size="10" :whole-page="true" />
  </view>
</template>

<script setup lang="ts">
import ActivityInformation from './components/activity-information.vue';
const activityId = ref(0);
onLoad((options: any) => {
  activityId.value = parseInt(options.aId, 10);
});
</script>

<style scoped lang="scss">
.container {
  @include normalContainer();
  /* padding: 16px; */
  background-color: #ffffff;
}
</style>
