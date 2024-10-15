import utils from '@/uni-module-common/utils';

function getLocalFilePath(path: any) {
  if (
    path.indexOf('_www') === 0 ||
    path.indexOf('_doc') === 0 ||
    path.indexOf('_documents') === 0 ||
    path.indexOf('_downloads') === 0
  ) {
    return path;
  }
  if (path.indexOf('file://') === 0) {
    return path;
  }
  if (path.indexOf('/storage/emulated/0/') === 0) {
    return path;
  }
  if (path.indexOf('/') === 0) {
    const localFilePath = plus.io.convertAbsoluteFileSystem(path);
    if (localFilePath !== path) {
      return localFilePath;
    } else {
      path = path.substr(1);
    }
  }
  return `_www/${path}`;
}
// base64转地址
function dataUrlToBase64(str: any) {
  const array = str.split(',');
  return array[array.length - 1];
}

let index = 0;
function getNewFileId() {
  return Date.now() + String(index++);
}

function biggerThan(v1: any, v2: any) {
  const v1Array = v1.split('.');
  const v2Array = v2.split('.');
  let update = false;
  for (let index = 0; index < v2Array.length; index++) {
    const diff = v1Array[index] - v2Array[index];
    if (diff !== 0) {
      update = diff > 0;
      break;
    }
  }
  return update;
}
// 地址转base64
function pathToBase64(path: any) {
  return new Promise(function (resolve, reject) {
    if (typeof window === 'object' && 'document' in window) {
      if (typeof FileReader === 'function') {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
          if (this.status === 200) {
            const fileReader = new FileReader();
            fileReader.onload = function (e: any) {
              resolve(e.target.result);
            };
            fileReader.onerror = reject;
            fileReader.readAsDataURL(this.response);
          }
        };
        xhr.onerror = reject;
        xhr.send();
        return;
      }
      const canvas = document.createElement('canvas');
      const c2x: any = canvas.getContext('2d');
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        c2x.drawImage(img, 0, 0);
        resolve(canvas.toDataURL());
        canvas.height = canvas.width = 0;
      };
      img.onerror = reject;
      img.src = path;
      return;
    }
    if (typeof plus === 'object') {
      plus.io.resolveLocalFileSystemURL(
        getLocalFilePath(path),
        function (entry: any) {
          entry.file(
            function (file: any) {
              const fileReader = new plus.io.FileReader();
              fileReader.onload = function (data: any) {
                resolve(data.target.result);
              };
              fileReader.onerror = function (error) {
                reject(error);
              };
              fileReader.readAsDataURL(file);
            },
            function (error: any) {
              reject(error);
            }
          );
        },
        function (error) {
          reject(error);
        }
      );
      return;
    }
    if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
      wx.getFileSystemManager().readFile({
        filePath: path,
        encoding: 'base64',
        success(res: any) {
          resolve(`data:image/png;base64,${res.data}`);
        },
        fail(error: any) {
          reject(error);
        }
      });
      return;
    }
    reject(new Error('not support'));
  });
}

function base64ToPath(base64: any) {
  return new Promise(function (resolve, reject) {
    if (typeof window === 'object' && 'document' in window) {
      base64 = base64.split(',');
      const type = base64[0].match(/:(.*?);/)[1];
      const str = atob(base64[1]);
      let n = str.length;
      const array = new Uint8Array(n);
      while (n--) {
        array[n] = str.charCodeAt(n);
      }
      return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([array], { type })));
    }
    let extName = base64.split(',')[0].match(/data\:\S+\/(\S+);/);
    if (extName) {
      extName = extName[1];
    } else {
      reject(new Error('base64 error'));
    }
    const fileName = `${getNewFileId()}.${extName}`;
    if (typeof plus === 'object') {
      const basePath = '_doc';
      const dirPath = 'uniapp_temp';
      const filePath = `${basePath}/${dirPath}/${fileName}`;
      if (
        !biggerThan(
          plus.os.name === 'Android' ? '1.9.9.80627' : '1.9.9.80472',
          plus.runtime.innerVersion
        )
      ) {
        plus.io.resolveLocalFileSystemURL(
          basePath,
          function (entry) {
            entry.getDirectory(
              dirPath,
              {
                create: true,
                exclusive: false
              },
              function (entry) {
                entry.getFile(
                  fileName,
                  {
                    create: true,
                    exclusive: false
                  },
                  function (entry) {
                    entry.createWriter(function (writer) {
                      writer.onwrite = function () {
                        resolve(filePath);
                      };
                      writer.onerror = reject;
                      writer.seek(0);
                      writer.writeAsBinary(dataUrlToBase64(base64));
                    }, reject);
                  },
                  reject
                );
              },
              reject
            );
          },
          reject
        );
        return;
      }
      const bitmap = new plus.nativeObj.Bitmap(fileName);
      bitmap.loadBase64Data(
        base64,
        function () {
          bitmap.save(
            filePath,
            {},
            function () {
              bitmap.clear();
              resolve(filePath);
            },
            function (error) {
              bitmap.clear();
              reject(error);
            }
          );
        },
        function (error) {
          bitmap.clear();
          reject(error);
        }
      );
      return;
    }
    if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
      wx.getFileSystemManager().writeFile({
        filePath,
        data: dataUrlToBase64(base64),
        encoding: 'base64',
        success() {
          resolve(filePath);
        },
        fail(error: any) {
          reject(error);
        }
      });
      return;
    }
    reject(new Error('not support'));
  });
}

interface imageObjType {
  width: number;
  height: number;
  path: string;
  orientation: string;
  type: string;
}
// 获取图片的基本信息
const getImageInfo = (filePath: string) => {
  return new Promise<imageObjType>((resolve) => {
    uni.getImageInfo({
      src: filePath,
      success: (res) => {
        resolve(res as imageObjType);
      },
      fail: (res) => {
        uni.hideLoading();
        utils.toast({
          title: `图片压缩失败，请重新选择图片！`
        });
        console.log('图片压缩compressImage--getImageInfo--error--', res);
      }
    });
  });
};
// 获取压缩图片的百分比
const getScalePercentage = async (imagePath: string) => {
  console.log('图片压缩compressImage--imagePath--', imagePath);
  const imageInfo = await getImageInfo(imagePath);
  console.log('图片压缩compressImage--imageInfo--', JSON.stringify(imageInfo));
  const largerDimension = imageInfo.width >= imageInfo.height ? 'width' : 'height';
  // 计算缩小的比例
  const scalePercentage = 1024 / imageInfo[largerDimension];
  console.log('图片压缩compressImage--scalePercentage--', scalePercentage);
  // 将百分比转换为字符串并输出
  const percentageString = `${(scalePercentage * 100).toFixed(0)}%`;
  console.log('图片压缩compressImage--percentageString--', percentageString);
  return percentageString;
};

const unique = (n = 6) => {
  let rnd = '';
  for (let i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
  return `xxt_${new Date().getTime()}${rnd}`;
};
// 图片压缩方法
const compressImage = async (filePath: string) => {
  // _www/a.jpg"、"_doc/b.jpg"、"_documents/c.jpg"、"_downloads/d.jpg"
  const f_dst = `_doc/${unique()}.jpg`;
  console.log('图片压缩compressImage--进入_doc--', f_dst);
  console.log('图片压缩compressImage--filePath--', filePath);
  // const percentageString = await getScalePercentage(filePath);

  return new Promise((resolve) => {
    plus.zip.compressImage(
      {
        src: filePath,
        dst: f_dst,
        overwrite: true,
        format: 'jpg'
      },
      (i) => {
        console.log('图片压缩compressImage--success--', i);
        resolve(i.target);
      },
      (e) => {
        console.log('图片压缩compressImage--error--', e);
        resolve(filePath);
        utils.toast({
          title: `上传图片压缩失败，将用原图上传`
        });
      }
    );
  });
};

const getFileSize = (entries: any, isfile: boolean) => {
  return new Promise<number>((resolve) => {
    if (isfile) {
      entries.file(
        function (file: any) {
          const fileSize = file.size * 0.0009766;
          resolve(fileSize);
          console.log('showImageCacheMB---.file.size---', fileSize);
        },
        function (e: any) {
          console.log('showImageCacheMB---.file---', e.message);
        }
      );
    } else {
      entries.getMetadata(
        function (metadata: any) {
          const fileSize = metadata.size * 0.0009766;
          resolve(fileSize); // 1字节=0.0009766kb
          console.log('showImageCacheMB---.metadata.size---', fileSize);
        },
        function (e: any) {
          console.log('showImageCacheMB---getMetadata---', e.message);
        }
      );
    }
  });
};

// 获取指定地址的uni缓存大小（通常是图片地址）
const showImageCacheMB = (filePath: string) => {
  console.log('showImageCacheMB---进入了----');
  return new Promise<string>((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(
      filePath,
      function (entry: any) {
        // 通过URL参数获取目录对象或文件对象
        let fileSize = 0;
        // 创建目录读取对象
        const directoryReader = entry.createReader();
        directoryReader.readEntries(
          async function (entries: any) {
            // 获取当前目录中的所有文件和子目录
            for (let i = 0; i < entries.length; i++) {
              if (entries[i].isFile) {
                fileSize += await getFileSize(entries[i], true);
              } else {
                fileSize += await getFileSize(entries[i], false);
              }
            }
            const fileSizeMb = (fileSize / 1024).toFixed(2);
            resolve(fileSizeMb);
            console.log('showImageCacheMB---fileSize---', fileSizeMb);
            console.log('showImageCacheMB---fileSize---mb', `${fileSizeMb}mb`);
          },
          function (e: any) {
            console.log('showImageCacheMB---文件读取失败', e);
            reject(e);
          }
        );
      },
      function (e) {
        console.log('showImageCacheMB---文件路径读取失败---', e);
        reject(e);
      }
    );
  });
};
// 清除指定地址的uni缓存（通常是图片地址）
const clearImageCacheMB = (filePath: string) => {
  return new Promise<boolean>((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(
      filePath,
      function (entry: any) {
        // 递归删除目录
        entry.removeRecursively(
          function (rmEntry: any) {
            console.log('clearImageCache---缓存清理完成--', rmEntry);
            resolve(true);
          },
          function (e: any) {
            console.log('clearImageCache---缓存清理失败--', e);
            reject(e);
          }
        );
      },
      function (e) {
        console.log('clearImageCache---文件路径读取失败---', e);
        reject(e);
      }
    );
  });
};

export {
  compressImage,
  pathToBase64,
  base64ToPath,
  getImageInfo,
  getScalePercentage,
  showImageCacheMB,
  clearImageCacheMB
};
