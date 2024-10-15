<template>
  <view v-if="tabbar?.list.length > 0" class="u-page__item">
    <xxtSubTabbar
      :value="path"
      :fixed="true"
      :placeholder="true"
      :safe-area-inset-bottom="true"
      :inactive-color="tabbar.color"
      :active-color="tabbar.selectedColor"
      :mid-tab-bar="tabbar.mode === 2"
      :custom-style="tabbarStyle"
    >
      <xxtSubTabbarItem
        v-for="(item, index) in tabbar.list"
        :key="item.text"
        :text="item.text"
        :name="item.pagePath"
        :is-center="getTabbarCenter(index)"
        :center-image="`${$cdn}/nb/m/uni-notice/img/${item.iconPath}`"
        :dot="item.dot"
        @tap="tabbarClick(item.pagePath)"
      >
        <template #active-icon>
          <image
            class="u-page__item__slot-icon"
            :src="`${$cdn}/nb/m/uni-notice/img/${item.selectedIconPath}`"
          ></image>
        </template>
        <template #inactive-icon>
          <image
            class="u-page__item__slot-icon"
            :src="`${$cdn}/nb/m/uni-notice/img/${item.iconPath}`"
          ></image>
        </template>
      </xxtSubTabbarItem>
    </xxtSubTabbar>
  </view>
</template>

<script setup lang="ts">
import xxtSubTabbar from './xxt-sub-tabbar.vue';
import xxtSubTabbarItem from './xxt-sub-tabbar-item.vue';

// pagePath: string;
//   text: string;
//   iconPath: string;
//   selectedIconPath: string;
const props = withDefaults(defineProps<{ path: string }>(), {
  path: ''
});
const instance: any = getCurrentInstance();
const eventBus = instance!.appContext.config.globalProperties.$eventBus;

const { appConfig } = useStore('appConfig');
const tabbar = computed(() => {
  return appConfig.value.template.basic.tabBar;
});
const tabbarStyle = computed(() => ({}));
const getTabbarCenter = (index) => {
  if (unref(tabbar).mode !== 2) return false;
  return unref(tabbar).list % 2 > 0
    ? Math.ceil(unref(tabbar).list.length / 2) === index + 1
    : false;
};
const tabbarClick = (url: string) => {
  console.log('url----', url);
  uni.switchTab({
    url
  });
  eventBus.emit('tabbarClick', url);
};
console.log('tabbar---', tabbar);
</script>

<style scoped lang="scss">
.u-page {
  padding: 0;

  &__item {
    &__title {
      color: var(--textSize);
      background-color: #fff;
      padding: 15px;
      font-size: 15px;

      &__slot-title {
        color: var(--textSize);
        font-size: 14px;
      }
    }

    &__slot-icon {
      width: 25px;
      height: 25px;
    }
  }
}
</style>
