<template>
  <view class="container">
    <view class="container-tabs">
      <tui-tabs
        :tabs="tabs"
        :current-tab="activeCode"
        background-color="#ffffff"
        :selected-color="greenColor"
        slider-width="32"
        slider-height="8"
        :slider-bg-color="greenColor"
        is-fixed
        @change="changeTab"
      ></tui-tabs>
    </view>
    <view style="position: relative; width: 100%">
      <image
        mode="widthFix"
        style="width: 100%"
        :src="actCommon.primaryImg || ''"
        background-color="#ffffff"
      />
      <view class="act-num">
        <view class="act-num-bg">
          <span v-for="(num, idx) in dataList" :key="idx">
            {{ num.dataName }} {{ num.dataValue }}
          </span>
        </view>
      </view>
    </view>
    <view class="act-content" :style="{ backgroundColor: actCommon.mainClolor }">
      <ActImgVideo v-if="actCommon.activityId !== undefined" :activity-id="actCommon.activityId" />
      <template v-if="actCommon.subActivityList && actCommon.subActivityList.length > 0">
        <view
          v-for="subAct in actCommon.subActivityList"
          :key="subAct.activityId"
          class="act-content-item sub-act"
        >
          <tui-lazyload-img
            width="100%"
            :src="subAct.primaryImg || ''"
            background-color="#ffffff"
          ></tui-lazyload-img>
          <span v-if="subAct.activityId" class="sub-act-btn" @click="go2Act(subAct)">
            {{ subAct.msg }}
          </span>
        </view>
      </template>
    </view>
    <view class="activity-information">
      <view class="activity-information-header">
        <view class="activity-information-title">
          <img
            class="activity-information-title-img"
            :src="`${$cdn}/nb/m/activity/img/act-info-tag.png`"
          />
          <view class="activity-information-title-desc"> 活动资讯 </view>
        </view>
        <span v-if="showMoreActInfo" class="show-more" @click="go2ActivityInformation"
          >查看更多></span
        >
      </view>
      <ActivityInformation
        :activity-id="activityId"
        :page-size="3"
        :whole-page="false"
        @have-more-act-info="haveMoreActInfo"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import ActivityInformation from './components/activity-information.vue';
import ActImgVideo from './components/act-img-video.vue';
import { uniShowToast } from '@/uni-module-common/utils/uiUtile';
import { appModuleConfig } from '@/uni-module-common/config/';
interface tabListItem {
  name: string;
  id: number;
}
// 网络请求
const instance = getCurrentInstance();
let activityId = 0;
const activeCode = ref(0);
const activityCommon = ref<any>([]);
const actCommon = ref<any>({});
const tabs = ref<tabListItem[]>([]);
const dataList = ref<any>([]);
const greenColor = '#4ad975';
const showMoreActInfo = ref(false);
const router = useRouter();
onLoad(async (options: any) => {
  activityId = parseInt(options.aId, 10);
  // 请求接口
  const res: any = await instance?.proxy?.$uniAjax.post({
    url: '/user-activity2/activity/get-activity-common',
    data: {
      activityId
    }
  });
  const aa = {
    ageRange: null,
    activityId: 11,
    mainActivityName: '暑期经典诵',
    name: '暑期经典',
    description:
      '庆祝新中国成立75周年，引领学生亲近中华经典，齐心共书强国新篇章，暑期我们将与全国众多学子一同踏上经典诵读之旅，共筑强国梦想。',
    startDatetime: 1716739200000,
    endDatetime: 1726847999000,
    activityType: 4,
    activityTypeDesc: '其他',
    activityVenue: 0,
    primaryImg: 'https://pic.xxt.cn/n/csc/material/advert/2024-ld-1.png',
    activityStatus: 1,
    msg: '点击参与',
    redirectUrl: null,
    redirectUrlType: null,
    mainColor: null,
    subActivityList: [
      {
        ageRange: null,
        activityId: 91,
        mainActivityName: '2024暑期经典诵读活动',
        name: '2024暑期经典诵读活动',
        description: null,
        startDatetime: 1716739200000,
        endDatetime: 1723737599000,
        activityType: 0,
        activityTypeDesc: '朗读活动',
        activityVenue: 1,
        primaryImg: 'https://pic.xxt.cn/n/csc/material/advert/2024-ld-3.png',
        activityStatus: 1,
        msg: '点击参与',
        redirectUrl: 'https://m.xxt.cn/v2/act/summer-math/common-intro?activityId=9',
        redirectUrlType: 0,
        mainColor: null,
        subActivityList: null
      },
      {
        ageRange: null,
        activityId: 111,
        mainActivityName: '“童心向国”主题作品征集活动',
        name: '“童心向国”主题作品征集活动',
        description: null,
        startDatetime: 1722441600000,
        endDatetime: 1726847999000,
        activityType: 1,
        activityTypeDesc: '投稿活动',
        activityVenue: 1,
        primaryImg: 'https://pic.xxt.cn/n/csc/material/advert/2024-ld-4.png',
        activityStatus: 0,
        msg: '敬请期待',
        redirectUrl: null,
        redirectUrlType: null,
        mainColor: null,
        subActivityList: null
      }
    ]
  };
  if (res && res.length > 0) {
    activityCommon.value = [...res, aa];
    tabs.value = activityCommon.value.map((item: any, index: number) => ({
      name: item.name,
      id: index
    }));
  }
  console.log('res---', activityCommon.value);
});
const changeTab = (e: { index: number }) => {
  console.log('changeTab---', e);
  activeCode.value = e.index;
};
const getActivitySummaryData = async () => {
  const url = '/user-activity2/activity/get-activity-summary-data';
  const params = {
    activityId: actCommon.value.activityId
  };

  const res: any = await instance?.proxy?.$uniAjax.post({
    url,
    data: params
  });
  if (res && res.length > 0) {
    dataList.value = res;
  }
};
watchEffect(() => {
  console.log('watchEffect---');
  if (activityCommon.value.length > 0) {
    // 防止默认第一次调用
    const title = activityCommon.value[activeCode.value]?.mainActivityName;
    actCommon.value = activityCommon.value[activeCode.value];
    uni.setNavigationBarTitle({
      title
    });
    if (actCommon.value && actCommon.value.activityId !== undefined) {
      getActivitySummaryData();
    }
    console.log('activeCode.value---', activeCode.value, activityCommon.value, title);
    console.log('actCommon.value---', actCommon.value);
  }
});
const go2Act = (act: any) => {
  if (act.activityStatus === 0) {
    uniShowToast('暂未开始，敬请期待');
  } else if (act.redirectUrlType === 0) {
    // h5 链接
    console.log('h5 链接');
    // this.$adapter.gotoUrlInNewWindow(act.redirectUrl);
  } else if (act.redirectUrlType === 1) {
    // uni-app链接
    console.log('uni-app链接');
    // this.$adapter.gotoUrlInNewWindow(act.redirectUrl);
  }
};
const go2ActivityInformation = () => {
  const subPackagesRoot = appModuleConfig.subPackagesRoot;
  // /uni_modules/xxt-xzx-reading-uni/pages/uni-module-public/activity/Kaifeng/activity-intro
  console.log('go2ActivityInformation---subPackagesRoot---1', subPackagesRoot);
  router.push({
    path: `/${subPackagesRoot}/pages/uni-module-public/activity/Kaifeng/activity-info-list`,
    query: {
      aId: `${activityId}`
    }
  });
};
const haveMoreActInfo = (val: boolean) => {
  showMoreActInfo.value = val;
};
</script>

<style scoped lang="scss">
.container {
  @include normalContainer();
  &-tabs {
    // #ifndef H5
    top: 88rpx; // h5 中应为 176rpx
    // #endif
    z-index: 996;
    width: 100%;
    height: 80rpx;
    background-color: #fff;
  }
}
.act-num {
  position: absolute;
  bottom: 20px;
  width: 100%;
  &-bg {
    margin: 0 16px;
    background: linear-gradient(to right, #ffe538, #b3ff20);
    border-radius: 18px 18px 0 0;
    padding: 8px 20px;
    @include normalFlex();
    font-size: 10px;
  }
  &-img {
    width: 100%;
    height: auto;
    background-color: #fff;
    object-fit: contain;
  }
}
.act-content {
  position: relative;
  width: 100%;
  margin-top: -20px;
  border-radius: 13px 13px 0 0;
  background-color: white;
  padding-top: 16px;
  &-item {
    margin: 0px 16px 16px;
  }
}

.sub-act {
  position: relative;
  &-btn {
    position: absolute;
    bottom: 24px;
    width: 98px;
    height: 25px;
    left: 50%;
    transform: translate(-50%, 0);
    border: none;
    background: linear-gradient(to right, #ff961a, #ffd74d);
    text-align: center;
    line-height: 25px;
    border-radius: 20px;
    font-size: 12px;
  }
}
.activity-information {
  padding: 5px 16px 16px;
  &-header {
    @include normalFlex(row);
    justify-content: space-between;
    align-items: top;
  }
  &-title {
    @include normalFlex(row, flex-start);
    font-size: 18px;
    color: #222;
    &-img {
      width: 15px;
      height: 15px;
      object-fit: contain;
      margin-right: 8px;
    }
    &-desc {
      margin-top: -3px;
    }
  }
}
.show-more {
  color: #666666;
  font-size: 12px;
  cursor: pointer;
}
</style>
