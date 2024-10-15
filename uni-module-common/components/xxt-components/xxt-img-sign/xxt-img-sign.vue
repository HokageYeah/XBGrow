<template>
  <movable-area class="area" :style="{ height: `${bgImgHeight}px` }">
    <image v-if="props.imgUrl" :src="props.imgUrl" mode="widthFix"></image>
    <template v-for="(sign, index) in signList" :key="index">
      <movable-view
        v-if="props.hasSignArea && sign.showSign"
        :key="index"
        direction="all"
        :friction="5"
        :scale-min="scaleMin"
        :scale="!props.disableChange"
        :damping="1000"
        :x="
          sign.senderBgImgHeight && !props.isSender
            ? (parseFloat(`${sign.x}`) / sign.senderBgImgHeight) * bgImgHeight
            : sign.x
        "
        :y="
          sign.senderBgImgHeight && !props.isSender
            ? (parseFloat(`${sign.y}`) / sign.senderBgImgHeight) * bgImgHeight
            : sign.y
        "
        :disabled="props.disableChange"
        :scale-max="scaleMax"
        :scale-value="sign.scale"
        :style="{
          width: `${defWidthRpx}rpx`,
          height: `${defHeightRpx}rpx`,
          transform: `scale(${sign.scale})`
        }"
        @scale="onScale($event, index)"
        @change="onChange($event, index)"
      >
        <view
          :id="`text-${index}`"
          class="text"
          :class="sign.signUrl ? '' : 'text-bg'"
          :style="{ transform: viewScaleFlag || props.disableChange ? `scale(${sign.scale})` : '' }"
        >
          <template v-if="!sign.signUrl">
            <tui-icon
              v-if="!props.disableChange"
              class="close-icon"
              name="close"
              :size="16"
              color="#222"
              @click="close(index)"
            ></tui-icon>
            <view class="click-sign" @click="go2Sign(index)"> 点击签名 </view>
          </template>
          <image v-else :src="sign.signUrl" mode="aspectFit" @click="go2Sign(index)"></image>
        </view>
      </movable-view>
    </template>
  </movable-area>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import type { Sign } from './img-sign';
import { initSign } from './img-sign';
import eventBus from '@/uni-module-common/utils/eventBus';

const props = defineProps({
  imgUrl: {
    type: String,
    default: ''
  },
  hasSignArea: {
    type: Boolean,
    default: false
  },
  disableChange: {
    type: Boolean,
    default: false
  },
  componentRef: {
    // 该组件实例，用于获取节点信息
    type: Object,
    default: () => {
      return {};
    }
  },
  // 点击签名跳转页面路径
  signPageUrl: {
    type: String,
    default: ''
  },
  // 是否支持多签名
  addMulSignFlag: {
    type: Boolean,
    default: false
  },
  osName: {
    type: String,
    default: ''
  },
  isSender: {
    type: Boolean,
    default: false
  }
});

const signList = ref<Array<Sign>>([]);
const phoneWidth = ref(0);
const phoneHeight = ref(0);
// 像素比
const pixelRatio = ref(1);
const bgImgHeight = ref(0);
const currentSignIdx = ref(0);
const router = useRouter();
const pxPoint = reactive({
  xpx: 0,
  ypx: 0
});
const viewScaleFlag = ref(false);
const scaleMin = ref(0.35);
const scaleMax = ref(4.2857);
const defWidthRpx = ref(112);
const defHeightRpx = ref(49);
const { userAgent } = useStore('user');

const getBgImgCenterPoint = () => {
  const x = ((750 - defWidthRpx.value) * phoneWidth.value) / 750 / 2;
  const y = (bgImgHeight.value - (defHeightRpx.value * phoneWidth.value) / 750) / 2;
  return {
    x,
    y
  };
};

const getNodeInfo = (filterStr: string, idx: number) => {
  const query = uni.createSelectorQuery().in(props.componentRef);
  query
    .select(filterStr)
    .boundingClientRect((data: any) => {
      let left = 0;
      let top = 0;
      // 将 rpx 换算为 px
      if (signList.value[idx]?.x.toString().includes('rpx')) {
        const x = signList.value[idx].x.toString().replace('rpx', '');
        left = (parseInt(x) * phoneWidth.value) / 750;
      } else {
        left = parseInt(signList.value[idx].x.toString());
      }
      if (signList.value[idx]?.y.toString().includes('rpx')) {
        const y = signList.value[idx].y.toString().replace('rpx', '');
        top = (parseInt(y) * phoneWidth.value) / 750;
      } else {
        top = parseInt(signList.value[idx].y.toString());
      }
      // 由于缩放中心在签名区域正中间，缩放时区域的左上角位置有偏移，需进行补偿计算
      // defXpx、defYpx 是 1 倍时签名区域的宽、高
      const defXpx = (defWidthRpx.value * phoneWidth.value) / 750;
      const defYpx = (defHeightRpx.value * phoneWidth.value) / 750;
      const scale = signList.value[idx].scale;
      // 计算左上角坐标偏移距离
      // if (scale > 1) {
      //   pxPoint.xpx = (data.width - defXpx) / 2;
      //   pxPoint.ypx = (data.height - defYpx) / 2;
      // } else {
      //   pxPoint.xpx = (defXpx - data.width) / 2;
      //   pxPoint.ypx = (defYpx - data.height) / 2;
      // }
      pxPoint.xpx = ((scale - 1) * defXpx) / 2;
      pxPoint.ypx = ((scale - 1) * defYpx) / 2;

      signList.value[idx].areaX1 = parseFloat((left * pixelRatio.value).toFixed(2));
      signList.value[idx].areaY1 = parseFloat((top * pixelRatio.value).toFixed(2));
      signList.value[idx].areaX2 = parseFloat(
        (left * pixelRatio.value + data.width * pixelRatio.value).toFixed(2)
      );
      signList.value[idx].areaY2 = parseFloat(
        (top * pixelRatio.value + data.height * pixelRatio.value).toFixed(2)
      );
      signList.value[idx].xpx = parseFloat(pxPoint.xpx.toFixed(2));
      signList.value[idx].ypx = parseFloat(pxPoint.ypx.toFixed(2));
      console.log('getNodeInfo====****1234', signList.value[idx], bgImgHeight.value);
    })
    .exec();
};

const getImgInfo = () => {
  uni.getImageInfo({
    src: props.imgUrl,
    success(res) {
      pixelRatio.value = res.width / (phoneWidth.value * 0.94);
      bgImgHeight.value = res.height / pixelRatio.value;
    }
  });
};

const onChange = useDebounceFn((e: any, idx: number) => {
  if (!props.disableChange) {
    currentSignIdx.value = idx;
    signList.value[idx].x = e.detail.x;
    signList.value[idx].y = e.detail.y;
    getNodeInfo(`#text-${idx}`, idx);
  }
}, 50);
const onScale = useDebounceFn((e: any, idx: number) => {
  if (!props.disableChange) {
    currentSignIdx.value = idx;
    signList.value[idx].scale = e.detail.scale;
    // #ifdef APP-PLUS
    // scale 值不等于1，否则在 app 里拖动时签名框位置和手指坐标不一致
    signList.value[idx].scale = e.detail.scale === 1 ? 1.1 : e.detail.scale;
    // #endif
    getNodeInfo(`#text-${idx}`, idx);
  }
}, 50);

const go2Sign = (idx: number) => {
  if (!signList.value[idx].can2Sign) {
    return;
  }
  currentSignIdx.value = idx;
  if (props.signPageUrl) {
    router.push({
      path: props.signPageUrl,
      query: {
        idx: `${idx}`
      }
    });
  }
  // const subPackagesRoot = WxAppConfig.subPackagesRoot;
  // console.log('go2Sign---subPackagesRoot---', subPackagesRoot);
  // router.push({
  //   path: `/${subPackagesRoot}/pages/receiver-sign/receiver-sign`,
  //   query: {
  //     idx: `${idx}`
  //   }
  // });
};

const addSign = (val: Sign, idx: number) => {
  console.log('addSign', val, idx);

  if (!props.addMulSignFlag && signList.value.length > 0) {
    uni.showToast({ title: '只能设置一处签名框' });
  } else {
    viewScaleFlag.value = true;
    currentSignIdx.value = idx;
    // #ifdef APP-PLUS
    // 新建签名框时 scale 值要进行一次更新（值不等于1），否则在 app 里拖动时签名框位置和手指坐标不一致
    val.scale = val.scale === 1 ? 1.1 : val.scale;
    // #endif
    signList.value.length > idx
      ? (signList.value[idx] = { ...initSign, ...val })
      : signList.value.push(JSON.parse(JSON.stringify({ ...initSign, ...val })));
    console.log('signList.value********---------///////', signList.value);
    nextTick(() => {
      // 先关闭，否则会出现 movable-view 与 text view 同时放大
      viewScaleFlag.value = false;
      nextTick(() => {
        // 再计算节点信息
        getNodeInfo(`#text-${idx}`, idx);
      });
    });
  }
};
const reSign = (idx: number) => {
  signList.value[idx].can2Sign = true;
  signList.value[idx].signUrl = '';
};
const getCurrentSign = () => {
  return { ...signList.value[currentSignIdx.value], ...pxPoint };
};

const getPlatform = () => {
  const hostId = userAgent.value.hostId || '';
  if (['1', '28', '30'].includes(hostId)) {
    return 'android-app';
  } else if (['4', '29', '31'].includes(hostId)) {
    return 'ios-app';
  } else if (props.osName === 'ios') {
    return 'ios-wxmp';
  } else if (props.osName === 'android') {
    return 'android-wxmp';
  }
};
const getSignList = () => {
  const senderPlatform = getPlatform();
  signList.value.forEach((el) => {
    // 记录发布者使用的平台
    el.senderPlatform = senderPlatform;
    // 记录发布时背景图的高度
    el.senderBgImgHeight = parseFloat(bgImgHeight.value.toFixed(2));
  });
  return signList.value;
};

const close = (idx: number) => {
  signList.value.splice(idx, 1);
  nextTick(() => {
    eventBus.emit('closeSignature', idx);
  });
};
const clearSign = () => {
  signList.value = [];
};

const signatureChange = (data: { idx: number; url: string }) => {
  if (signList.value[data.idx]) {
    signList.value[data.idx].signUrl = data.url;
    signList.value[data.idx].can2Sign = false;
    currentSignIdx.value = data.idx;
    nextTick(() => {
      getNodeInfo(`#text-${data.idx}`, data.idx);
    });
  }
};

eventBus.on('signature', signatureChange);

watch(
  () => props.imgUrl,
  (newV) => {
    if (newV) {
      nextTick(() => {
        getImgInfo();
      });
    }
  }
);

defineExpose({
  addSign,
  reSign,
  clearSign,
  getSignList,
  getCurrentSign,
  getBgImgCenterPoint
});

onLoad(() => {
  phoneWidth.value = uni.getSystemInfoSync().windowWidth;
  phoneHeight.value = uni.getSystemInfoSync().windowHeight;
  nextTick(() => {
    getImgInfo();
  });
});
onUnload(() => {
  eventBus.off('signature', signatureChange);
});
</script>

<style lang="scss" scoped>
.text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 49rpx; // 随着 defHeightRpx 变
  width: 112rpx; // 随着 defWidthRpx 变
  color: #fff;
  position: relative;
}
.text-bg {
  background-color: rgba($color: #ff5436, $alpha: 0.5);
  border: #ff5436 solid 2px;
}
.text image {
  height: 49rpx !important; // 随着 defHeightRpx 变
  display: block !important;
}

.area image {
  width: 100% !important;
  display: block !important;
}
.area {
  width: 100%;
  background-color: white;
  overflow: hidden;
}
.max {
  width: 500rpx;
  height: 500rpx;
}
.close-icon {
  position: absolute;
  top: -20rpx;
  right: -20rpx;
}
.click-sign {
  font-size: 12rpx;
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
