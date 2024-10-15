export function getFileInfoSync(imagePath: string) {
  return new Promise<any>((resolve, reject) => {
    uni.getFileSystemManager().getFileInfo({
      filePath: imagePath,
      success: (res) => {
        console.log(`getFileInfo--success`, res.size, imagePath);
        resolve({ status: true, imagePath, size: res.size });
      },
      fail: (res) => {
        console.log(`getFileInfo--error`, imagePath);
        reject(res);
      }
    });
  });
}
export function compressVideoSync(imagePath: string, inputMonile: number) {
  const num = inputMonile;
  return new Promise<any>((resolve, reject) => {
    uni.compressVideo({
      src: imagePath,
      quality: num === 100 ? 'high' : 'medium',
      success: (res) => {
        console.log('compressVideoSync--success--', res.tempFilePath, res);
        resolve({ status: true, imagePath: res.tempFilePath });
      },
      fail: (res) => {
        console.log('compressVideoSync--fail--', res.tempFilePath, res);
        reject(res);
      }
    });
  });
}
export async function videoCompress(videoPath: string, inputMonile: number) {
  const fileInfo = await getFileInfoSync(videoPath);
  if (fileInfo.status && fileInfo.size > 2 * 1024 * 1000) {
    const video = await compressVideoSync(videoPath, inputMonile);
    if (video.status) {
      // return await imageCompress(image.imagePath);
      return video.imagePath;
    } else {
      return videoPath;
    }
  } else {
    return videoPath;
  }
}
