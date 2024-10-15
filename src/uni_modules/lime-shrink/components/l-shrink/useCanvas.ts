// @ts-nocheck
import { reactive } from './vue';
import { isBrowser } from '@/uni_modules/lime-shared/isBrowser';

const { platform, pixelRatio } = uni.getSystemInfoSync();
const isPc = /window|mac/.test(platform);
export const canIUseOffscreenCanvas = (Boolean(uni.createOffscreenCanvas) && !isPc) || isBrowser;

export interface Context extends UniNamespace.CanvasContext {
  getImageData: (x: number, y: number, width: number, height: number) => void;
}
export function useCanvas(canvasId: string, context: any) {
  const ctx = uni.createCanvasContext(canvasId, context) as Context;
  const { drawImage } = ctx;
  // console.log('查看drawimage---', drawImage);
  // console.log('查看drawimage-ctx---', ctx);
  ctx.drawImage = function ({ path }, ...args: number[]) {
    // console.log('查看drawimage-args---', args);
    console.log('查看drawimage-args-this---', this);
    drawImage.call(this, path, ...args);
  };
  ctx.getImageData = (x: number, y: number, width: number, height: number) => {
    return new Promise((resolve, reject) => {
      // #ifdef MP || VUE2
      if (context.proxy) context = context.proxy;
      // #endif
      uni.canvasGetImageData(
        {
          canvasId,
          x,
          y,
          width,
          height,
          success(res) {
            // console.log('canvasGetImageData-suc--', res);
            resolve(res);
          },
          fail(error) {
            // console.log('canvasGetImageData-err--', error);
            reject(error);
          }
        },
        context
      );
    });
  };
  const canvas = reactive({
    width: 0,
    height: 0,
    getContext: (type = '2d') => type === '2d' && ctx,
    toDataURL: (type: string, quality: number) => {
      return new Promise((resolve, reject) => {
        const options = {
          canvasId,
          quality,
          fileType: type.replace('image/', '').replace('jpeg', 'jpg'),
          // pc端导出的尺寸与画板大小不一致
          destHeight: canvas.height / (isPc ? pixelRatio : 1),
          destWidth: canvas.width / (isPc ? pixelRatio : 1),
          success(res) {
            resolve(res.tempFilePath);
          },
          fail: reject
        };
        uni.canvasToTempFilePath(options, context);
      });
    }
  });

  return canvas;
}
