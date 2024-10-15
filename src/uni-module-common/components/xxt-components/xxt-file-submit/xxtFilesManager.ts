// const getData = (path: string) => {
//   return new Promise((resolve) => {
//     // 文件读写是一个异步请求 用promise包起来方便使用时的async+await
//     plus.io.requestFileSystem(
//       plus.io.PRIVATE_WWW,
//       (fs) => {
//         // console.log('开始读取文件fs-----', fs);
//         // console.log('开始读取文件path-----', path);
//         // 请求文件系统
//         fs.root.getFile(
//           path,
//           {
//             // 请求地址文件  '/storage/emulated/0/config.txt'为根目录  '/config.txt'为/storage/Android/data/io.dcloud.HBuilder（包名）/documents/config.js
//             create: true // 当文件不存在时创建
//           },
//           (fileEntry) => {
//             fileEntry.file(function (file) {
//               const fileReader = new plus.io.FileReader(); // new一个可以用来读取文件的对象fileReader
//               fileReader.readAsText(file, 'utf-8'); // 读文件的格式
//               fileReader.onerror = (e) => {
//                 // 读文件失败
//                 // console.log('获取文件失败-----', fileReader.error, '-----获取文件失败');
//                 plus.nativeUI.toast('获取文件失败,请重启应用', {
//                   background: '#ffa38c'
//                 });
//               };
//               fileReader.onload = (e: any) => {
//                 // 读文件成功
//                 const txtData = e.target.result;
//                 // console.log('读取成功----', txtData, '-----读取成功');
//                 // console.log('读取成功txtData----', typeof txtData, '-----txtData读取成功');
//                 // console.log('读取成功txtData----', txtData.length, '-----txtData读取成功');
//                 // console.log(
//                   '读取成功toString----',
//                   txtData.substring(0, 100),
//                   '-----txtData读取成功'
//                 );
//                 resolve(txtData); /// /回调函数内的值想返回到函数外部  就用promise+resolve来返回出去
//               };
//             });
//           },
//           (error) => {
//             const er = `2新建获取文件失败-----${JSON.stringify(error)}------新建获取文件失败`;
//             // console.log('2新建获取文件失败-----', error, '------新建获取文件失败');
//             resolve(er);
//             plus.nativeUI.toast('获取文件失败,请重启应用', {
//               background: '#ffa38c'
//             });
//           }
//         );
//       },
//       (e) => {
//         // console.log('1请求文件系统失败', e.message);
//         plus.nativeUI.toast('请求系统失败,请重启应用', {
//           background: '#ffa38c'
//         });
//       }
//     );
//   });
// };

// 将Base64格式转换为Blob对象
const base64ToBlob = (base64Data: string) => {
  const parts = base64Data.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};

// 将blob 格式的文件体，转化成 url
// const afterRead = (file) => {
//   if (this.uploadInfo.contributeType === 2) {
//     // 视频走阿里云视频上传：初始化 uploader
//     const userData = '{"Vod":{}}';
//     if (this.uploader) {
//       this.uploader.stopUpload();
//       this.authProgress = 0;
//       this.statusText = '';
//     }
//     this.uploader = this.createUploader();
//     this.uploader.addFile(file.file, null, null, null, userData);
//   }

//   this.blob2Url(file.file);
//   if (this.fileType === 3) {
//     // 获取上传视频的时长，本次投稿约束时长不超过3分钟
//     const audioElement = new Audio(this.sourcesSrc);
//     audioElement.addEventListener('loadedmetadata', () => {
//       const duration = audioElement.duration;
//       this.$event('上传视频', '洛阳活动', { duration });
//       if (duration > 180) {
//         Toast({
//           message: '视频时长请控制在3分钟之内',
//           duration: 5000
//         });
//         // 清空文件列表
//         this.fileList = [];
//         // 释放 Url 对象
//         URL.revokeObjectURL(this.sourcesSrc);
//         return false;
//       }
//       return true;
//     });
//   }
// };

// const blob2Url = (file) => {
//   if (window.createObjectURL !== undefined) {
//     // basic
//     // file.file是文件体，文件体本身就是 blob 格式
//     this.sourcesSrc = window.createObjectURL(file);
//   } else if (window.URL !== undefined) {
//     // mozilla(firefox)
//     this.sourcesSrc = window.URL.createObjectURL(file);
//   } else if (window.webkitURL !== undefined) {
//     // webkit or chrome
//     this.sourcesSrc = window.webkitURL.createObjectURL(file);
//   }
// };

const base64Data = (Url: string) => {
  // 将视频转为base64位
  // Url 为视频的路径
  const path = plus.io.convertLocalFileSystemURL(Url);
  const fileReader = new plus.io.FileReader();
  fileReader.readAsDataURL(path);
  fileReader.onloadend = (res: any) => {
    // 64位编码    res.target.result
    const blob = base64ToBlob(res);
    const file = new File([blob], `${new Date().getTime()}.${blob.type.split('/').pop()}`, {
      type: blob.type
    });
  };
  fileReader.onerror = (e) => {
    // 读文件失败
    plus.nativeUI.toast('获取文件失败,请重启应用', {
      background: '#ffa38c'
    });
  };
  fileReader.onload = (e: any) => {
    // 读文件成功
    const txtData = e.target.result;
  };
};

const getData = (path: string) => {
  return new Promise((resolve) => {
    uni.getFileInfo({
      filePath: path,
      success(res) {
        // 文件信息获取成功
      },
      fail() {}
    });

    uni.saveFile({
      tempFilePath: path,
      success(res) {
        const savedFilePath = res.savedFilePath;
        resolve(JSON.stringify(res));
      },
      fail(err) {
        // 文件保存失败
        resolve(JSON.stringify(err));
      }
    });
  });
};
export { getData, base64Data };
