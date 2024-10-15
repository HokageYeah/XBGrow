// @ts-nocheck
import { isString } from '@/uni_modules/lime-shared/isString'
export function fileToDataURL(file : File) : Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = function (e) {
			if (reader.result && isString(reader.result)) {
				resolve(reader.result);
			}
		};
		reader.onerror = function (e) {
			reject(e);
		};
		reader.readAsDataURL(file);
	});
}
// 将Base64编码的字符串转换成Blob对象
export function dataURItoBlob(dataURI : string) {
	// 将Base64编码的字符串解码成二进制数据
	const byteString = atob(dataURI.split(',')[1]);
	const mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// 创建一个Uint8Array对象来缓存二进制数据，并以数组缓冲区的方式存储起来
	const content = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) {
		content[i] = byteString.charCodeAt(i);
	}

	// 将缓冲区中的二进制数据封装成Blob对象，并返回该对象
	return new Blob([content.buffer], { type: mimeType });
}
