/**
 * 图片压缩
 * @param {String} imgUrl  需要压缩的图片路径
 * @param {Object} self	必传，当前组件对象
 * @param {Object} options 压缩参数
 * 		width: 压缩到多宽，默认图片宽度(待优化，传入宽度，应计算高度)
 * 		height: 压缩到多高，默认图片高度
 * 		pixels: 压缩图片的最大分辨率，默认二百万
 * 		quality: 压缩质量，默认0.8
 * 		type: 获取的base64类型，默认jpg
 * 		base64: 是否返回base64，默认true(非H5有效)
 * @return {Promise}
 * 		reject
 * 			code
 * 				-1: 获取图片信息错误
 * 				-2: 极大可能创建图片对象出错(h5会出现，出现概率无限接近0)
 * 				-3: canvas转图片错误(小程序会出现)
 * 				-4: 图片转base64错误(小程序会出现)
 */

// 图片分辨率压缩
const calcImageSize = (res: any, pixels: any): { imgW: number; imgH: number } => {
  let imgW, imgH;
  imgW = res.width;
  imgH = res.height;

  let ratio: any;
  // eslint-disable-next-line no-cond-assign
  if ((ratio = (imgW * imgH) / pixels) > 1) {
    ratio = Math.sqrt(ratio);
    const newW: any = imgW / ratio;
    const newH: any = imgH / ratio;
    imgW = parseInt(newW);
    imgH = parseInt(newH);
  } else {
    ratio = 1;
  }
  console.log('calcImageSize----', imgW, imgH);
  return { imgW, imgH };
};

const urlTobase64 = (url: string, type: any) => {
  return new Promise((resolve, reject) => {
    console.log('这个是什么uni---', uni);
    try {
      console.log('这个是什么getFileSystemManage运行---', uni.getFileSystemManager());
    } catch (error) {
      console.log('这个是什么getFileSystemManager报错---', error);
    }
    console.log('这个是什么getFileSystemManager---', uni.getFileSystemManager);
    console.log('这个是什么getFileSystemManager--后面---');
    uni.getFileSystemManager().readFile({
      filePath: url,
      encoding: 'base64',
      success: (res) => {
        let base64 = res.data;
        base64 = `data:image/${type};base64,${base64}`;
        resolve(base64);
      }
    });
  });
};

const compress = (imgUrl: any, slef: any, options: any = {}) => {
  /** ************* 参数默认值 ***************/
  const MAX_PIXELS = 2000000; // 最大分辨率，宽 * 高 的值
  const MAX_QUALITY = 0.8; // 压缩质量
  const IMG_TYPE = 'jpg';
  const CANVAS_ID = 'compress_canvas';
  const BASE_64 = false;

  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: imgUrl,
      success: (res) => {
        const pixels = options.pixels || MAX_PIXELS;
        const quality = options.quality || MAX_QUALITY;
        let type = options.type || IMG_TYPE;
        const canvasId = options.canvasId || CANVAS_ID;
        const isBase64 = options.base64 || BASE_64;

        const { imgW, imgH } = calcImageSize(res, pixels);
        const w = options.width || imgW;
        const h = options.height || imgH;
        console.log('calcImageSize-options---', options);
        console.log('calcImageSize-h---w---', w, h);
        // #ifdef H5
        type = type === 'jpg' ? 'jpeg' : type;
        // #endif

        // #ifndef H5
        type = type === 'png' ? 'png' : 'jpg';
        // #endif
        console.log(
          `%c 宽: ${w} %c 高: ${h} %c 分辨率: ${w * h} %c 质量: ${quality} %c 类型: ${type}`,
          'color:#f00',
          'background-color:#f60;color:#fff',
          'color:#F00',
          'background-color:#f60;color:#fff',
          'color:#F00'
        );

        // #ifdef H5
        const img = new Image();
        img.src = res.path;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          canvas.width = w;
          canvas.height = h;
          const drawW = w;
          const drawH = h;

          ctx.drawImage(img, 0, 0, drawW, drawH);

          const base64 = canvas.toDataURL(`image/${type}`, quality);

          resolve(base64);
        };
        // #endif

        // 非h5
        // #ifndef H5
        slef.height = h;
        slef.width = w;
        console.log('calcImageSize--非h5--', slef);
        nextTick(function () {
          let canvas = null;
          if (!canvas) {
            canvas = uni.createCanvasContext(canvasId, slef);
          }
          canvas.drawImage(res.path, 0, 0, w, h);
          canvas.draw();
          console.log('画板canvas---', canvas);
          // 这里有点问题 是ctx.draw()还没有画完，uni.canvasToTempFilePath就截取了画布内容并保存了
          // 导致图片白屏。
          // setTimeout是延迟调用保存图片，但是如果图片画的慢，会导致白屏问题。
          setTimeout(() => {
            console.log('setTimeout---??-try-');
            try {
              uni.canvasToTempFilePath(
                {
                  canvasId,
                  x: 0,
                  y: 0,
                  width: w,
                  height: h,
                  destWidth: w,
                  destHeight: h,
                  fileType: type,
                  quality,
                  success: (file) => {
                    if (isBase64) {
                      console.log('canvas转图片错误-success-isBase64');
                      urlTobase64(file.tempFilePath, type)
                        .then((res) => {
                          canvas = null;
                          resolve(res);
                        })
                        .catch((e) => {
                          console.log('图片转base64错误-----', e);
                          // eslint-disable-next-line prefer-promise-reject-errors
                          reject({
                            code: -4,
                            msg: '图片转base64错误',
                            data: e
                          });
                        });
                    } else {
                      console.log('canvas转图片错误-success');
                      resolve(file.tempFilePath);
                    }
                  },
                  fail: (e) => {
                    console.log('canvas转图片错误-fail');
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject({
                      code: -3,
                      msg: 'canvas转图片错误',
                      data: e
                    });
                  }
                },
                slef
              );
            } catch (error) {
              console.log('canvas转图片错误-try', error);
            }
          }, 500);
        });
        // #endif
      }
    });
  });
};

export default compress;
