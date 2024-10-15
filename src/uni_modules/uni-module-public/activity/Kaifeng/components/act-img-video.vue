<template>
  <view class="act-img">
    <view v-if="imgObj.imageList && imgObj.imageList.length > 0" class="act-content-item">
      <image
        v-for="img in imgObj.imageList"
        :key="img.imageId"
        mode="widthFix"
        style="width: 100%"
        :src="img.imagePath"
        @click="go2Url(img)"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ activityId: number }>(), {
  activityId: 0
});
const instance = getCurrentInstance();
const imgObj = ref<any>({});
const getActivityImageList = async () => {
  const url = '/user-activity2/activity/get-activity-image-list';
  const params = {
    activityId: props.activityId
  };

  const res: any = await instance?.proxy?.$uniAjax.post({
    url,
    data: params
  });
  if (res) {
    imgObj.value = res;
  }
};
watch(
  () => props.activityId,
  (newVal) => {
    console.log('props.activityId---', props.activityId, newVal);
    if (newVal) {
      getActivityImageList();
    }
  },
  { immediate: true }
);
const go2Url = (img: any) => {
  if (img && img.redirectUrl) {
    if (img.redirectUrlType === 0) {
      // h5 链接
      console.log('h5 链接');
      // this.$adapter.gotoUrlInNewWindow(img.redirectUrl);
    } else if (img.redirectUrlType === 1) {
      // uni-app链接
      console.log('uni-app链接');
      // this.$adapter.gotoUrlInNewWindow(img.redirectUrl);
    }
  }
};
</script>

<style scoped lang="scss">
.act-content-item {
  margin: 0px 16px 16px;
}
.img-item {
  margin-bottom: 16px;
  width: 100%;
  height: auto;
  background-color: #fff;
  overflow: hidden;
  object-fit: contain;
}
</style>
