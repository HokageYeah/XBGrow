import { isCurEnvRelease } from './http';

/**
 * 获取当前页面 URL（含 querystring 查询参数）
 *
 * 正常返回： pages/reading/resource-list/resource-list?bookUrl=%2Freading%2Fbook%2F1cfed80a6d354091861645c6d8a07a7d%2Fcatalog.json
 * 异常返回： 空字符
 */
export const getCurPageUrlWithQS = () => {
  let pageUrlWithQS = '';
  try {
    const pages = getCurrentPages();
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      pageUrlWithQS = currentPage.route;
      if (currentPage.options) {
        const queryArray = [];
        for (const key in currentPage.options) {
          const value = currentPage.options[key];
          queryArray.push(`${key}=${encodeURIComponent(value)}`);
        }
        if (queryArray.length > 0) {
          pageUrlWithQS += `?${queryArray.join('&')}`;
        }
      }
    }
  } catch (e) {
    console.log('CatchClause', e);
    console.log('CatchClause', e);
    if (!isCurEnvRelease()) {
      console.error(e);
    }
  }
  return pageUrlWithQS;
};

function formatTime(time: number) {
  if (typeof time !== 'number' || time < 0) {
    return time;
  }

  const hour = parseInt((time / 3600).toString());
  time = time % 3600;
  const minute = parseInt((time / 60).toString());
  time = time % 60;
  const second = time;

  return [hour, minute, second]
    .map(function (n: any) {
      n = n.toString();
      return n[1] ? n : `0${n}`;
    })
    .join(':');
}

function formatLocation(longitude: any, latitude: any) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);
  }

  longitude = longitude.toFixed(2);
  latitude = latitude.toFixed(2);

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  };
}
// base64 转 file文件
function dataURLtoFile(dataurl: any, filename: any) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime
  });
}
// 将base64转换为blob
function dataURLtoBlob(dataurl: any) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}
// 将blob转换为file
function blobToFile(theBlob: any, fileName: any) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

// 必填校验
function RequiredRules(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      }
    ]
  };
}
// 必填校验
function RequiredRulesCardNo(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          const reg =
            /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
          if (!reg.test(value)) {
            callback('身份证输入不合法');
          }
          return true;
        }
      }
    ]
  };
}
// 公里数
function RequiredRulesmileage(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (!/^\d+(\.\d{0,2})?$/.test(value)) {
            callback('请输入数字且最大保留两位小数');
          }
          return true;
        }
      }
    ]
  };
}
function notRulesmileage(msg: any) {
  return {
    rules: [
      {
        required: false,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (!/^\d+(\.\d{0,2})?$/.test(value)) {
            callback('请输入数字且最大保留两位小数');
          }
          return true;
        }
      }
    ]
  };
}
// 必填校验 手机号
function RequiredRulesPhone(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (!/^1[0-9]{10,10}$/.test(value)) {
            callback('手机号格式不对');
          }
          return true;
        }
      }
    ]
  };
}
// 金额
function RequiredMoney(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          const reg =
            /(^([1-9]{1}[0-9]{0,7})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
          if (value === 0) {
            callback('金额必须大于0');
          }
          if (!reg.test(value)) {
            callback('金额最多保留两位小数');
          }
          if (value > 9999999.99) {
            callback('超出最大限额');
          }
          return true;
        }
      }
    ]
  };
}
// 固话手机号校验
function RequirelindLine(msg: any) {
  // var isTelePhone=
  const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
  const isMob = /^1[0-9]{10,10}$/;
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (isMob.test(value) || isPhone.test(value)) {
            return true;
          } else {
            callback('区号-电话号(分机号)或者11位以1开头的手机号码');
          }
        }
      }
    ]
  };
}

// 年限
function RequireYearRul(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (/^\d{1,}$/.test(value)) {
            return true;
          } else {
            callback('请输入正整数');
          }
        }
      }
    ]
  };
}
// 必填校验 姓名
function RequiredRulesName(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (
            /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/.test(
              value
            ) ||
            /^[a-zA-Z]+$/.test(value)
          ) {
            return true;
          } else {
            callback('仅支持中英文姓名');
          }
        }
      }
    ]
  };
}

function firstBl(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (Number(value) > 100) {
            callback('首付比例不可大于100%');
          }
          return true;
        }
      }
    ]
  };
}
// 车牌号校验
function RequiredPlateNo(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          const reg =
            /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9]{5,6}/;
          if (reg.test(value)) {
            return true;
          } else {
            callback('请输入正确的车牌号');
          }
        }
      }
    ]
  };
}
// 车架号校验
function vinRules(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: '请输入车架号',
        validateFunction(rule: any, value: any, data: any, callback: any) {
          const onblurjs = function (vin: any) {
            if (vin.length > 0 && vin.length !== 17) {
              return false;
            }
            const vinVal = vin.toUpperCase();
            const charToNum: any = {
              A: 1,
              B: 2,
              C: 3,
              D: 4,
              E: 5,
              F: 6,
              G: 7,
              H: 8,
              J: 1,
              K: 2,
              L: 3,
              M: 4,
              N: 5,
              P: 7,
              R: 9,
              S: 2,
              T: 3,
              U: 4,
              V: 5,
              W: 6,
              X: 7,
              Y: 8,
              Z: 9
            };
            let obj = 0;
            const arr = [];
            for (let i = 0; i < vinVal.length; i++) {
              const temp = vinVal.charAt(i);
              if (charToNum[temp]) {
                arr[i] = charToNum[temp];
              } else {
                arr[i] = Number(temp);
              }
              if (i === 8) {
                arr[i] = vinVal.charAt(i);
              }
            }
            let a1 = 8;
            for (let i = 0; i < 7; i++) {
              obj += Number(arr[i]) * a1;
              a1--;
            }
            obj += Number(arr[7]) * 10;
            let a2 = 9;
            for (let i = 9; i < 17; i++) {
              obj += Number(arr[i]) * a2;
              a2--;
            }
            let result: any = Number(obj) % 11;
            if (parseInt(result) === 10) {
              result = 'X';
            }
            if (result === arr[8]) {
              // 成功
              return true;
            } else {
              // 失败
              return false;
            }
          };
          if (!onblurjs(value)) {
            callback('请输入正确车架号');
          }
          return true;
        }
      }
    ]
  };
}

const dateUtils = {
  UNITS: {
    年: 31557600000,
    月: 2629800000,
    天: 86400000,
    小时: 3600000,
    分钟: 60000,
    秒: 1000
  },
  humanize(milliseconds: any) {
    let humanize = '';
    const newUNITS = this.UNITS as any;
    for (const key in this.UNITS) {
      if (milliseconds >= newUNITS[key]) {
        humanize = `${Math.floor(milliseconds / newUNITS[key]) + key}前`;
        break;
      }
    }
    return humanize || '刚刚';
  },
  format(dateStr: any) {
    const date = this.parse(dateStr);
    const diff = Date.now() - date.getTime();
    if (diff < this.UNITS['天']) {
      return this.humanize(diff);
    }
    const _format = function (number: any) {
      return number < 10 ? `0${number}` : number;
    };
    return `${date.getFullYear()}/${_format(date.getMonth() + 1)}/${_format(
      date.getDate()
    )}-${_format(date.getHours())}:${_format(date.getMinutes())}`;
  },
  parse(str: any) {
    // 将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    const a = str.split(/[^0-9]/);
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
  }
};

const isNetworkUrl = (url: string) => {
  const regexPattern = /^(https?|ftp):\/\//i;
  return regexPattern.test(url);
};
// 判断当前是ios的是否大于指定版本
const isIosMoreVersion = (version: number): boolean => {
  const { clientInfo } = useStore('user');
  console.log('查看用户的clientInfo-value--', clientInfo.value);
  console.log('查看用户的clientInfo---getSystemInfoSync---', uni.getSystemInfoSync().platform);
  // #ifdef APP-PLUS
  if (uni.getSystemInfoSync().platform === 'ios') {
    const cbv = parseInt(clientInfo.value.cbv || '0');
    console.log('查看用户的clientInfo-cbv--version--', cbv > version);
    return cbv > version;
  }
  // #endif
  return true;
};

// 通用函数，使得在给定字符串中只匹配单独的数字。比如"2"只匹配"2"，而不是 "226"、"268" 等
const matchSingleDigit = (str: string, digit: string) => {
  // 构造正则表达式，匹配单独的数字 digit
  const regex = new RegExp(`\\b${digit}\\b`, 'g');
  // 使用正则表达式进行匹配
  const matches = str.match(regex);
  // 返回匹配结果数组
  return matches || [];
};

// 自定义双击事件（uniapp无双击事件）
/**
 * 每次一点击就增加点击次数
 * 开启定时间，如果在指定的时间没有第二次点击事件，就认为是单击，否则就是双击或者多次点击
 * fn 点击执行的回调
 * delay 点击事件间隔
 * flag 点击还是双击标志 1是单击 2是双击
 */
const dobuleClickEvent = (fn: any, delay: any, flag = 1) => {
  const clickData = { clickNum: 0, startTime: 0, endTime: 0 };
  return function () {
    clickData.clickNum = clickData.clickNum === 0 ? 1 : ++clickData.clickNum;
    if (clickData.clickNum === 1) {
      // 单击
      // 记录第一次点击的时间
      clickData.startTime = new Date().getTime();
      // 开启定时器，指定时间后重置点击次数
      setTimeout(() => {
        clickData.clickNum = clickData.startTime = clickData.endTime = 0;
        if (flag === 1) {
          fn();
        }
      }, delay);
    } else if (clickData.clickNum === 2) {
      // 双击
      // 记录第二次点击时间
      clickData.endTime = new Date().getTime();
      if (clickData.endTime - clickData.startTime < delay) {
        // 两次点击事件之间的时间间隔满足双击条件
        if (flag === 2) {
          fn();
        }
      }
    } else {
      clickData.clickNum = clickData.startTime = clickData.endTime = 0;
    }
    console.log(clickData, '自定义双击/单击事件触发了');
  };
};

type scopeType =
  | 'scope.userInfo'
  | 'scope.userLocation'
  | 'scope.address'
  | 'scope.invoiceTitle'
  | 'scope.invoice'
  | 'scope.werun'
  | 'scope.record'
  | 'scope.writePhotosAlbum'
  | 'scope.camera';
// uni公共权限授权方法
const getAuthorize = (
  scope: scopeType,
  title: string,
  content: string,
  confirmText: string,
  showCancel = false
) => {
  return new Promise((resolve, reject) => {
    uni.authorize({
      scope,
      success(res) {
        resolve(res);
      },
      fail() {
        uni.getSetting({
          success: (res) => {
            if (!res.authSetting[scope]) {
              // 权限封装
              uni.showModal({
                title,
                content,
                showCancel,
                confirmText,
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting({
                      success: (res) => {
                        if (res.authSetting[scope]) {
                          resolve(res);
                        }
                      }
                    });
                  } else {
                    // 用户拒绝了授权
                    const err = new Error('用户拒绝了授权');
                    reject(err);
                  }
                },
                fail: (err) => {
                  reject(err);
                }
              });
            }
          }
        });
      }
    });
  });
};

export {
  formatTime,
  formatLocation,
  dateUtils,
  dataURLtoFile,
  dataURLtoBlob,
  blobToFile,
  RequiredRules,
  RequiredRulesPhone,
  vinRules,
  firstBl,
  RequiredRulesCardNo,
  RequiredRulesmileage,
  RequiredRulesName,
  RequirelindLine,
  RequireYearRul,
  notRulesmileage,
  RequiredPlateNo,
  RequiredMoney,
  isNetworkUrl,
  isIosMoreVersion,
  matchSingleDigit,
  dobuleClickEvent,
  getAuthorize
};
