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
  const newBlob = new Blob(byteArrays, { type: contentType });
  return newBlob;
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

const blob2Url = (file: File) => {
  let sourcesSrc;
  if (window.createObjectURL !== undefined) {
    // basic
    // file.file是文件体，文件体本身就是 blob 格式
    sourcesSrc = window.createObjectURL(file);
    // console.log('-------sourcesSrc-------', sourcesSrc);
  } else if (window.URL !== undefined) {
    // mozilla(firefox)
    sourcesSrc = window.URL.createObjectURL(file);
    // console.log('-------sourcesSrc-------', sourcesSrc);
  } else if (window.webkitURL !== undefined) {
    // webkit or chrome
    sourcesSrc = window.webkitURL.createObjectURL(file);
    // console.log('-------sourcesSrc-------', sourcesSrc);
  }
  return sourcesSrc;
};

const base64ToTempFilePath = (base64Data: string) => {
  // console.log('base64ToTempFilePath----');
  const fs = uni.getFileSystemManager();
  // // console.log('getFileSystemManager----', fs);
  const parts = base64Data.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const mapTypeAry = contentType.split('/');
  const fileName = `temp_${mapTypeAry[0]}_${Date.now()}.${mapTypeAry[1]}`; // 自定义文件名，可根据需要修改
  const filePath = `temporaryFiles/${fileName}`;
  const buffer = uni.base64ToArrayBuffer(base64Data);
  // console.log('uni.base64ToArrayBuffer----', buffer);

  uni.saveFile({
    tempFilePath: './xxtFileType.ts',
    success: (res: any) => {
      // console.log('临时文件保存成功', res.tempFilePath);
      // console.log('临时文件保存成功----', res);
      // 使用保存的临时文件路径展示图片、音频等
      // 也可以使用uni.removeSavedFile API在使用完后删除临时文件
    },
    fail: () => {}
  });

  fs.writeFile({
    filePath,
    data: buffer,
    encoding: 'binary',
    success() {
      // console.log('写入文件成功----');
    },
    fail() {
      // fail && fail();
      // console.log('写入文件失败----');
    }
  });
};

const base64DataDraw = (Url: string) => {
  return new Promise((resolve, reject) => {
    // 将视频转为base64位
    // Url 为视频的路径
    const path = plus.io.convertLocalFileSystemURL(Url);
    const fileReader = new plus.io.FileReader();
    fileReader.readAsDataURL(path);
    fileReader.onloadend = (res: any) => {
      const txtData = res.target.result;
      // 64位编码    res.target.result
      // base64ToTempFilePath(txtData);

      // ---------------------------
      const blob = base64ToBlob(res);
      const file = new File([blob], `${new Date().getTime()}.${blob.type.split('/').pop()}`, {
        type: blob.type
      });
      const sourcesSrc = blob2Url(file);
      resolve(sourcesSrc);
    };
    fileReader.onerror = (e) => {
      // 读文件失败
      plus.nativeUI.toast('获取文件失败,请重启应用', {
        background: '#ffa38c'
      });
      reject(fileReader.error);
    };
    fileReader.onload = (e: any) => {
      // 读文件成功
      const txtData = e.target.result;
      // console.log('读取成功base64Data----', '-----base64Data读取成功');
      // base64ToTempFilePath(txtData);
      // ---------------------------

      // const dataURLtoFileStr = dataURLtoFile(txtData, `${new Date().getTime()}.mp3`);

      const blob = base64ToBlob(txtData);
      const file = new File([blob], `${new Date().getTime()}.${blob.type.split('/').pop()}`, {
        type: blob.type
      });
      const sourcesSrc = blob2Url(file);
      resolve(sourcesSrc);
    };
  });
};

export { base64ToBlob, blob2Url, base64DataDraw, base64ToTempFilePath };
