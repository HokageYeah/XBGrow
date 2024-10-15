<template>
  <!-- #ifndef APP-NVUE -->
  <canvas
    v-if="!canIUseOffscreenCanvas && canvasId"
    :id="canvasId"
    class="l-shrink"
    :canvas-id="canvasId"
    :style="[styles]"
  ></canvas>
  <!-- #endif -->
</template>

<script lang="ts">
// @ts-nocheck
import { computed, defineComponent, getCurrentInstance } from './vue';
import { canIUseOffscreenCanvas, useCanvas } from './useCanvas';
import { Shrink } from './shrink';
import { addUnit } from '@/uni_modules/lime-shared/addUnit';
import { createImage } from '@/uni_modules/lime-shared/createImage';
import { arrayBufferToFile } from '@/uni_modules/lime-shared/arrayBufferToFile';
import { base64ToPath } from '@/uni_modules/lime-shared/base64ToPath';
import { isBase64 } from '@/uni_modules/lime-shared/isBase64';
import { isBrowser } from '@/uni_modules/lime-shared/isBrowser';
import { exif } from '@/uni_modules/lime-shared/exif';
export default defineComponent({
  setup(_, { expose }) {
    const context = getCurrentInstance();
    const canvasId = `l-shrink${context.uid}`;
    const canvas = useCanvas(canvasId, context);
    // console.log('canvasId::', canvasId);
    // console.log('canvas::', canvas);
    const styles = computed(() => {
      return {
        width: addUnit(canvas.width),
        height: addUnit(canvas.height)
      };
    });

    const options: any = {
      // 判断图片方向
      getImageOrientation(img: string) {
        console.log('l-shrink--最新图片压缩结果imgshrikres--getImageOrientation-options-');
        return new Promise((resolve) => {
          console.log('l-shrink--最新图片压缩结果imgshrikres--getImageOrientation-Promise-');
          exif.getData(img, function () {
            console.log('l-shrink--最新图片压缩结果imgshrikres--getImageOrientation-getData-', img);
            console.log(
              'l-shrink--最新图片压缩结果imgshrikres--getImageOrientation-getData-this-',
              this
            );
            resolve(exif.getTag(this, 'Orientation') || 1);
          });
        });
      },
      dataToFile(data: any, name: string, type: string) {
        if (!data) throw new Error('data can not be null');
        if (isBrowser && !isBase64(data)) {
          return arrayBufferToFile(data, name, type);
        } else if (isBase64(data)) {
          return base64ToPath(data, name);
        } else {
          return data;
        }
      },
      canvasId
    };
    if (!canIUseOffscreenCanvas) {
      options.createCanvas = () => canvas;
      options.createImage = createImage;
    }
    const shrink = new Shrink(options);
    // console.log('shrink----', shrink);

    // #ifdef VUE3
    expose({
      compressImage: shrink.compressImage.bind(shrink)
    });
    // #endif

    return {
      canvasId,
      canIUseOffscreenCanvas,
      styles,
      // #ifndef VUE3
      compressImage: shrink.compressImage.bind(shrink)
      // #endif
    };
  }
});
</script>

<style lang="scss">
.l-shrink {
  position: fixed;
  left: 200%;
}
</style>
