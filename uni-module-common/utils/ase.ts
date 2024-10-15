// const CryptoJS = require('crypto-js'); // 引用AES源码js
import * as CryptoJS from 'crypto-js';
const defKey = '26O5UHlBYYy12BwM'; // 十六位十六进制数作为密钥
const defIv = '2955632260638111'; // 十六位十六进制数作为密钥偏移量

// 加密方法
export const encryptAse = (word: string, keyV = defKey, ivV = defIv) => {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const key = CryptoJS.enc.Utf8.parse(keyV); // 十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse(ivV); // 十六位十六进制数作为密钥偏移量
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

export const decryptAse = (str: string, keyV = defKey, ivV = defIv) => {
  console.log('str', str);
  const data = CryptoJS.enc.Base64.parse(str);
  const key = CryptoJS.enc.Utf8.parse(keyV); // 十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse(ivV); // 十六位十六进制数作为密钥偏移量
  const option = {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };
  const baseData = CryptoJS.enc.Base64.stringify(data);
  const words = CryptoJS.AES.decrypt(baseData, key, option);
  const hex = CryptoJS.enc.Utf8.stringify(words);
  return hex;
};
