/**
 * 阿拉伯数字转中文汉字数字
 * @num 阿拉伯数字
 * @return 中文数字
 */
export const noToChinese = (num: number): string => {
  if (isNaN(num)) {
    return '不是有效的数字';
  }

  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿'];
  let result = '';
  let currentUnit = 0;

  num = Math.abs(num);

  while (num > 0) {
    const digit = num % 10;
    const chineseDigit = chineseNumbers[digit];
    const unit = units[currentUnit];

    if (digit === 0) {
      if (result && result[result.length - 1] !== chineseNumbers[0]) {
        result += chineseNumbers[0];
      }
    } else {
      result = chineseDigit + unit + result;
    }

    num = Math.floor(num / 10);
    currentUnit++;
  }

  return result || chineseNumbers[0];
};
