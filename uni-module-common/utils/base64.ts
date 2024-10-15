// BASE64 算法

// 此变量为编码的key，每个字符的下标相对应于它所代表的编码。
const enKey = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const deKey = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27,
  28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
  -1, -1, -1, -1, -1
];

/**
 * 编码
 */
export const encodeBase64 = (src: string) => {
  // 用一个数组来存放编码后的字符，效率比用字符串相加高很多。
  const str = [];
  let ch1, ch2, ch3;
  let pos = 0;
  // 每三个字符进行编码。
  while (pos + 3 <= src.length) {
    ch1 = src.charCodeAt(pos++);
    ch2 = src.charCodeAt(pos++);
    ch3 = src.charCodeAt(pos++);
    str.push(enKey.charAt(ch1 >> 2), enKey.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f));
    str.push(enKey.charAt(((ch2 << 2) + (ch3 >> 6)) & 0x3f), enKey.charAt(ch3 & 0x3f));
  }
  // 给剩下的字符进行编码。
  if (pos < src.length) {
    ch1 = src.charCodeAt(pos++);
    str.push(enKey.charAt(ch1 >> 2));
    if (pos < src.length) {
      ch2 = src.charCodeAt(pos);
      str.push(enKey.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f));
      str.push(enKey.charAt((ch2 << 2) & 0x3f), '=');
    } else {
      str.push(enKey.charAt((ch1 << 4) & 0x3f), '==');
    }
  }
  // 组合各编码后的字符，连成一个字符串。
  return str.join('');
};
