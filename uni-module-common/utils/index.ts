/**
 * 根据博客 ID 计算头像地址
 * @param {*} _uid   （可选）博客 ID。不设置时返回的默认头像地址
 * @param {*} _size  （可选）图片规格。可选值包括：s、m、l。默认 s
 * @param {*} _rand  （可选）是否增加防缓存参数。默认增加
 */
function getAvatorUrl(_uid?: string, _size?: string, _rand?: boolean) {
  if (!(_size === 's' || _size === 'm' || _size === 'l')) {
    _size = 's';
  }

  let avatorUrlPrefix = '/common/images/blogDefaultHeader';

  if (_uid) {
    let uidStr = `${_uid}`;
    if (uidStr.length <= 13) {
      uidStr = '0000000000000'.substring(0, 13 - uidStr.length) + uidStr;
      uidStr = uidStr.replace(/^(\d{9})(\d{2})(\d{2})$/, ($0, $1, $2) => {
        const _$1 = parseInt($1, 10);
        return `${_$1}/${parseInt($1 + $2, 10)}/`;
      });

      avatorUrlPrefix = `/upload/blog/head_photo/${uidStr}${_uid}`;
    }
  }

  let avatorUrl = `//pic.xxt.cn${avatorUrlPrefix}_${_size}.gif`;
  if (_rand !== false) {
    // 增加防缓存参数
    const now = new Date();
    avatorUrl = `${avatorUrl}?tmp=${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
  }
  return avatorUrl;
}

/**
 * Parse the time to string
 * @param {(Date|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
function parseTime(time: Date | string | number, cFormat: string) {
  if (arguments.length === 0) {
    return null;
  }

  if (time === null) {
    return null;
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time, 10);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(/-/gm, '/');
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time *= 1000;
    }
    date = new Date(time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 * 获取目标日期和当前日期间隔的时间
 * @param time 为时间戳
 * @return 间隔的时间
 * */
export function compareDate(time: number) {
  const dateNow = new Date().getTime();
  const between: number = Math.floor((time - dateNow) / 1000);
  if (between < 0) {
    return '';
  }
  let timeDesc = '';
  switch (between > 0) {
    case between < 60:
      timeDesc = `${between}秒`;
      break;
    case between >= 60:
      timeDesc = secondsFormat(between, 1);
      break;
    default:
      timeDesc = '';
      break;
  }
  return timeDesc;
}

/**
 * 将秒数转为n分n秒的形式
 * param seconds 秒数
 * param type 1: d天h时m分s秒 2: 1D1h29min59s
 * eg：
 * 100秒 type=1 ==> 00:01:40
 * 100秒 type=2 ==> 1分40秒
 * 100秒 type=3 ==> 1分
 * 100秒 type=4 ==> 1h29min
 * */
function secondsFormat(seconds: number, type: number) {
  let second = 0;
  let minute = 0;
  let hour = 0;
  let day = 0;
  let secondStr = '';
  day = Math.floor(seconds / 24 / 3600);
  hour = Math.floor(seconds / 60 / 60) - day * 24;
  minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60;
  second = seconds % 60;
  if (type === 1) {
    if (day) {
      secondStr += `${day}天`;
    }
    if (hour) {
      secondStr += `${hour}时`;
    }
    if (minute) {
      secondStr += `${minute}分`;
    }
    secondStr += `${second}秒`;
  } else if (type === 2) {
    if (day) {
      secondStr += `${day}d`;
    }
    if (hour) {
      secondStr += `${hour}h`;
    }
    if (minute) {
      secondStr += `${minute}min`;
    }
    secondStr += `${second}s`;
  }

  return secondStr;
}

/**
 * 针对当前日期前后两天的时间化为如下格式
 * 前天/昨天/今天/明天/后天 h:m
 * 其他日期格式化为 M月D日 h:m
 * 如果跨年展示 Y年M月D日 h:m
 */
function formatTimeWithChinese(time: number) {
  // 获取当前时间
  const now = new Date();
  const today = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} 00:00:00`;
  const todayTime = new Date(today).getTime();
  // 成绩通知创建时间
  const createTime = new Date(time);
  const createHourse =
    createTime.getHours() > 9 ? createTime.getHours() : `0${createTime.getHours()}`;
  const createMin =
    createTime.getMinutes() > 9 ? createTime.getMinutes() : `0${createTime.getMinutes()}`;
  let timeDesc = '';
  const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
  switch (time > 0) {
    case time >= todayTime && time < todayTime + oneDay: // 今天创建
      timeDesc = `今天 ${createHourse}:${createMin}`;
      break;
    case time < todayTime && time >= todayTime - oneDay: // 昨天创建
      timeDesc = `昨天 ${createHourse}:${createMin}`;
      break;
    case time < todayTime - oneDay && time >= todayTime - 2 * oneDay: // 前天创建
      timeDesc = `前天 ${createHourse}:${createMin}`;
      break;
    case time >= todayTime + oneDay && time < todayTime + 2 * oneDay:
      timeDesc = `明天 ${createHourse}:${createMin}`;
      break;
    case time >= todayTime + 2 * oneDay && time < todayTime + 3 * oneDay:
      timeDesc = `后天 ${createHourse}:${createMin}`;
      break;
    default:
      {
        // 三天前/三天后创建
        const createMonth =
          createTime.getMonth() + 1 > 9
            ? createTime.getMonth() + 1
            : `0${createTime.getMonth() + 1}`;
        const createDay =
          createTime.getDate() > 9 ? createTime.getDate() : `0${createTime.getDate()}`;
        timeDesc = `${createMonth}月${createDay}日 ${createHourse}:${createMin}`;
        if (now.getFullYear() > createTime.getFullYear()) {
          timeDesc = `${createTime.getFullYear()}年${timeDesc}`;
        }
      }
      break;
  }
  return timeDesc;
}

function formatTime(time: any) {
  if (typeof time !== 'number' || time < 0) {
    return time;
  }

  time = time % 3600;
  const minutestr = (time / 60).toString();
  const minute = parseInt(minutestr);
  time = time % 60;
  const second = time;

  return [minute, second]
    .map(function (n) {
      n = n.toString();
      return n[1] ? n : `0${n}`;
    })
    .join(':');
}

/**
 * 转换为时钟
 * @param time
 * @returns
 */
function formatClock(seconds: any) {
  if (typeof seconds !== 'number' || seconds < 0) {
    return seconds;
  }
  const hour = Math.floor(seconds / 3600).toString();
  const minute = Math.floor((seconds % 3600) / 60).toString();

  return [hour, minute]
    .map(function (n) {
      n = n.toString();
      return n[1] ? n : `0${n}`;
    })
    .join(':');
}

// 全局方法
function toast(data: {
  title: string;
  duration?: number;
  icon?: 'success' | 'loading' | 'error' | 'none' | 'fail' | 'exception' | undefined;
}) {
  uni.showToast({
    duration: data.duration || 2000,
    title: data.title || '出错啦~',
    icon: data.icon || 'none'
  });
}

// 过滤表情
function filterEmoji(content: string) {
  const emoji =
    /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201F\u2026\u2022\u20AC\r\n]/g;
  return content.replace(emoji, '');
}

/**
 * 阿拉伯数字转中文汉字数字
 * @num 阿拉伯数字
 * @return 中文数字
 */
function noToChinese(str: any) {
  if (str == null) {
    return '';
  }
  str = `${str}`.trim().replace(/^0*/, ''); // 去掉前面修饰的0
  const match = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '零'];
  return (
    `0000${str}`
      .substr(str.length % 4 || 4)
      .replace(/(\d){4}/g, (_str, endIndex, startIndex) => {
        const dot = (((str.length - 1) / 4) >> 0) - ((startIndex / 4) >> 0);
        let prefix = (function getPrfix(dot) {
          return dot > 2
            ? +_str
              ? Number(dot) === 3
                ? '万'
                : `${getPrfix(dot - 1)}万`
              : ''
            : Number(dot) === 1
              ? +_str
                ? '万'
                : ''
              : Number(dot) === 2
                ? '亿'
                : '';
        })(dot);
        /0+$/g.test(_str) && (prefix += match[10]); // 处理单元内后半部分有零的地方
        return +_str
          ? _str.replace(/(\d)(\d)(\d)(\d)/g, ($0, $1, $2, $3, $4) => {
            !match[$1] &&
                (match[$2] ? ($1 = 10) : match[$3] ? ($2 = 10) : match[$4] ? ($3 = 10) : ''); // 处理相邻单元前半部分
            // eslint-disable-next-line max-len
            match[$1] && match[$3] && !match[$2] && ($2 = 10),
            match[$2] && match[$4] && !match[$3] && ($3 = 10),
            match[$1] && match[$4] && !match[$3] && !match[$2] && ($3 = 10); // 中间两个连续为0，只是获取最后一个
            return (
              (match[$1] && ($1 < 10 ? `${match[$1]}千` : match[$1])) +
                (match[$2] && ($2 < 10 ? `${match[$2]}百` : match[$2])) +
                (match[$3] &&
                  ($3 < 10 ? (Number($3) === 1 ? '十' : `${match[$3]}十`) : match[$3])) +
                (match[$4] && match[$4])
            );
          }) + prefix
          : prefix;
      })
      .replace(/^零*/g, '')
      .replace(/零*$/g, '')
      .replace(/(零)*/g, '$1')
      .replace(/零亿/g, '亿') || match[10]
  ); // 处理连续零的问题
}

/**
 * 根据日期排序，将同一天的数据合并到一块展示，用于实现类似智能通知列表按天展示的效果
 * @param list 数据类型
 * @returns
 */
function handleListByDate(list: Array<any>, dateKey = 'sendDate') {
  let nextDate: string | null = '';
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    if (i === 0) {
      // 第一条数据
      nextDate = parseTime(e[dateKey], '{y}-{m}-{d}');
      // 卡片上方展示日期
      e.showDate = true;
      e.showDateDesc = formatTimeWithChinese(e[dateKey])?.split(' ')[0];
    } else {
      if (parseTime(e[dateKey], '{y}-{m}-{d}') !== nextDate) {
        // 不是同一天
        nextDate = parseTime(e[dateKey], '{y}-{m}-{d}');
        // 卡片上方展示日期
        e.showDate = true;
        e.showDateDesc = formatTimeWithChinese(e[dateKey])?.split(' ')[0];
      } else {
        e.showDate = false;
      }
    }
  }
  return list;
}

/**
 * 根据 hostId 判断是否是安卓app
 * https://gitlab.xxt.cn/app/android/xxtapp/app/-/wikis/HostId%E6%B8%85%E5%8D%95
 * @returns 是否是xxt安卓app
 */
function isXxtAndroidApp(hId?: string) {
  const { userAgent } = useStore('user');
  const hostId = hId || (userAgent.value.hostId as string);
  return [1, 28, 30].includes(parseInt(hostId, 10));
}
/**
 * 根据 hostId 判断是否是iOS app
 * https://gitlab.xxt.cn/app/android/xxtapp/app/-/wikis/HostId%E6%B8%85%E5%8D%95
 * @returns 是否是xxt iOS app
 */
function isXxtIOSApp(hId?: string) {
  const { userAgent } = useStore('user');
  const hostId = hId || (userAgent.value.hostId as string);
  return [4, 29, 31].includes(parseInt(hostId, 10));
}

/**
 * 获取两个日期间每天的日期列表
 * @param startDate
 * @param endDate
 * @returns
 */
function getDatesBetween(startDate: Date | number, endDate: Date | number) {
  const dates = [];
  let currentDate = new Date(startDate);
  const stopDate = new Date(endDate);

  while (currentDate <= stopDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export default {
  getAvatorUrl,
  parseTime,
  compareDate,
  secondsFormat,
  formatTimeWithChinese,
  formatTime,
  formatClock,
  toast,
  filterEmoji,
  noToChinese,
  handleListByDate,
  isXxtAndroidApp,
  isXxtIOSApp,
  getDatesBetween
};
