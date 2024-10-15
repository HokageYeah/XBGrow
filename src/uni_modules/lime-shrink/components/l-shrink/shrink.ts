// @ts-nocheck
import { dataURItoBlob, fileToDataURL } from './utils';
import type { IFileTyep, IOffscreenCanvas, IShrinkImageOptions, IShrinkOptions } from './type';
import { isBrowser } from '@/uni_modules/lime-shared/isBrowser';
import { sleep } from '@/uni_modules/lime-shared/sleep';
import { isString } from '@/uni_modules/lime-shared/isString';
import { isPromise } from '@/uni_modules/lime-shared/isPromise';
import { isBase64 } from '@/uni_modules/lime-shared/isBase64';

export class Shrink {
  options: IShrinkOptions = {
    quality: 80,
    success: () => {},
    error: () => {}
  };

  constructor(options: IShrinkOptions = {}) {
    for (const key in options) {
      this[key] = options[key];
    }
  }

  getImageOrientation(img: string) {
    const orientation = 1;
    console.log('l-shrink--最新图片压缩结果imgshrikres--getImageOrientation-', orientation);
    return Promise.resolve(orientation);
  }

  dataToFile(data: any, name: string, type: string) {
    return new File([data], name, {
      type
    });
  }

  dataURLToImage(dataURL: string, canvas?: any): Promise<HTMLImageElement> {
    console.log('l-shrink--图片加载-dataURLToImage----', dataURL);
    return new Promise((resolve) => {
      const img = this.createImage(canvas);
      console.log('l-shrink--图片加载成功--', img);
      img.onload = () => {
        console.log('l-shrink--图片加载---', img);
        resolve(img);
      };
      img.src = dataURL;
    });
  }

  createImage(canvas?: IOffscreenCanvas) {
    console.log('l-shrink--createImage---');
    if (isBrowser) {
      return new Image();
    } else if (canvas && canvas.createImage) {
      console.log('l-shrink--查看数据---', canvas);
      return canvas.createImage();
    }
  }

  createCanvas() {
    console.log('l-shrink--createCanvas----');
    if (isBrowser) {
      console.log('l-shrink--createOffscreenCanvas-isBrowser--', this.canvasId);
      return document.createElement('canvas');
    } else if (typeof uni !== 'undefined' && uni.createOffscreenCanvas) {
      console.log('l-shrink--createOffscreenCanvas---', this.canvasId);
      return uni.createOffscreenCanvas({ type: '2d' }) as HTMLCanvasElement;
    }
  }

  canvastoFile(canvas: any, type: string, quality: number) {
    type = type.replace('pg', 'peg');
    if (isBrowser && canvas.toBlob) {
      return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality));
    }
    const res = canvas.toDataURL(type, quality);
    if (isPromise(res)) {
      return res;
    } else {
      return Promise.resolve(res);
    }
  }

  async compress(file: IFileTyep, options: IShrinkImageOptions = this.options): Promise<IFileTyep> {
    const { quality } = options;
    try {
      const canvas = this.createCanvas();
      const context = canvas.getContext('2d');
      const url = isString(file) ? file : file.path;
      console.log('l-shrink--最新图片压缩结果imgshrikres-quality---', quality);
      const type: string =
        !isString(file) && file.type
          ? file.type
          : `image/${/\.([0-9a-z]+)(?:[\?#]|$)/i.exec(url)?.[1] || 'jpeg'}`;
      const name: string =
        !isString(file) && file.name
          ? file.name
          : /\/?([^\/?#]+)\.[^\.\/?#]+(#|\?|$)/g.exec(url)?.[1] || `${+new Date()}`;
      let base64 = '';
      if (isBrowser && !isString(file)) {
        base64 = await fileToDataURL(file);
      } else {
        base64 = url;
      }
      const img = await this.dataURLToImage(base64, canvas);
      const { width, height } = img;
      console.log('l-shrink--最新图片压缩结果imgshrikres--dataURLToImage-', img);
      canvas.width = width;
      canvas.height = height;
      await sleep();
      // 调整坐标系
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, width, height);
      console.log('l-shrink--最新图片压缩结果imgshrikres--sleep-', base64);
      console.log('l-shrink--最新图片压缩结果imgshrikres--sleep--this', this);
      console.log(
        'l-shrink--最新图片压缩结果imgshrikres--sleep--this.getImageOrientation',
        this.getImageOrientation
      );
      const orientation = await this.getImageOrientation(base64);
      console.log('l-shrink--最新图片压缩结果imgshrikres--getImageOrientation-', base64);
      console.log('l-shrink--最新图片压缩结果imgshrikres--orientation-', orientation);
      // 根据图片方向进行旋转，并在 Canvas 上绘制
      if (orientation > 4) {
        canvas.width = height;
        canvas.height = width;
        await sleep();
        console.log('l-shrink--最新图片压缩结果imgshrikres--orientation-');
      }
      const orientations = {
        2: [-1, 0, 0, 1, width, 0],
        3: [-1, 0, 0, -1, width, height],
        4: [1, 0, 0, -1, 0, height],
        5: [0, 1, 1, 0, 0, 0],
        6: [0, 1, -1, 0, height, 0],
        7: [0, -1, -1, 0, height, width],
        8: [0, -1, 1, 0, 0, width]
      };
      console.log('l-shrink--最新图片压缩结果imgshrikres--orientations-', orientations);
      const transform = orientations[orientation];
      console.log('l-shrink--最新图片压缩结果imgshrikres--transform-', transform);
      if (transform) {
        console.log('l-shrink--最新图片压缩结果imgshrikres--context.transform-', transform);
        context.transform(...transform);
      }
      console.log('l-shrink--最新图片压缩结果imgshrikres--canvastoFile-img-', img);
      console.log('l-shrink--最新图片压缩结果imgshrikres--canvastoFile-context-', context);
      context.drawImage(img, 0, 0, width, height);
      if ('draw' in context) {
        const draw = () => new Promise((resolve) => context.draw(false, resolve));
        await draw();
        await sleep();
      }
      let res = await this.canvastoFile(canvas, type, quality / 100);
      if (isBrowser && isBase64(res)) {
        res = dataURItoBlob(res);
      }
      return this.dataToFile(res, name, type);
    } catch (error) {
      console.log('l-shrink--报错了');
      throw new Error(error.message);
    }
  }

  compressImage(file: IFileTyep | IFileTyep[], options: IShrinkImageOptions = this.options) {
    console.log('l-shrink---compressImage----');

    if (!file) throw new Error('file can not be null');
    if (Array.isArray(file)) {
      return Promise.all(file.map((file) => this.compress(file, options)));
    } else {
      return this.compress(file, options);
    }
  }
}

export function shrinkImage(file: IFileTyep | IFileTyep[], options: IShrinkImageOptions) {
  const shrink = new Shrink();
  return shrink.compressImage(file, options);
}
