import { reactive } from 'vue';
import { apiBaseUrl } from '@/uni-module-common/config/';
import { appModuleConfig } from '@/uni-module-common/config/';
export const globalData = reactive({
  // baseRestUrl: 'https://rest-test.xxt.cn',
  baseRestUrl: apiBaseUrl,
  wss:'ws://192.168.3.119:8000',
  baseLoginUrl: 'https://login.xxt.cn',

  // 用于登录相关的入库设置
  entry: appModuleConfig.entry || 'wxmp_read',

  // 会话 Cookie，Hash 结构
  // key 为 Cookie 名，value 示例: {value: "1207681", expires: 1639976067412}
  cookieMap: {},

  // 保持登录凭证 Cookie
  saveStateCookie: null,

  // 用户昵称
  nickName: null,

  // 用户头像地址
  avatarUrl: null,

  // 是否登录
  loginFlag: false,

  // 是否是多重身份
  isMore: false,

  userInfoList: [],

  // 当用户登录后的现在使用的身份数据
  userNowRoleInfo: {
    // 用户标识
    accountId: null,
    // 角色 -1 网站注册身份  0 教师  1 学生  2 家长  3 管理员
    userRole: null,
    // webId标识身份
    webId: null,
    // 用户姓名
    userName: null,
    // 用户id-- 网站注册身份为 accountId   老师为teacherId  学生为studentId
    userId: null,
    // 用户班级  学生身份时存在
    classInfo: {
      classId: null,
      className: null
    },
    // 学校信息  网站注册身份时为空
    schoolInfo: {
      schoolId: null,
      schoolName: null
    },
    gradeInfo: {
      gradeId: null,
      gradeName: null,
      gradeCode: null
    },
    termCode: null
  },

  // 目前正在用的信息
  deafultGradeTerm: {
    grade: {
      code: 21,
      desc: 'L1'
    },
    term: {
      code: 1,
      desc: '上学期'
    }
  },
  UniToUniParams: {
    from: 'uniapp',
    taskSubType: null,
    resourceList: null
  },
  // 全局初始化
  init() {
    // 全局变量（默认是生产环境 URL）
    // uni.$baseUrl = {
    //   // 正式的域名
    //   baseCephUrl: 'https://obs-prod.xxt.cn',
    //   // baseCephUrl: 'https://obs.xxt.cn',
    //   baseRestUrl: 'https://rest.xxt.cn',
    //   baseLoginUrl: 'https://login.xxt.cn'
    // };

    // 挂载
    // uni.$log = log;
    // uni.$cephGet = cephUtil.get;
    // uni.$cephPutJson = cephUtil.putJson;
    // uni.$cephUploadFile = cephUtil.uploadFile;
    // uni.$cephPostFile = cephUtil.postFile;
    // uni.$cephPostJson = cephUtil.postJson;
    // uni.$request = http.request; // 请使用 wx.$request 替换 wx.request 方法，以获取对 Cookie 的支持
    // uni.$uploadFile = http.uploadFile; // 请使用 wx.$uploadFile 替换 wx.uploadFile 方法，以获取对 Cookie 的支持
    // uni.$downloadFile = http.downloadFile; // 请使用 wx.$downloadFile 替换 wx.downloadFile 方法，以获取对 Cookie 的支持
    // uni.$event = http.event; // XXT 事件日志记录方法

    // // http 请求相关工具方法设置初始化。同时会处理全局变量 wx.$baseUrl，根据环境替换为相应的域名
    // http.init(this);
    console.log(this);

    // 设置 InnerAudioContext 的播放选项
    uni.setInnerAudioOption({
      mixWithOther: true,
      obeyMuteSwitch: false,
      success(e) {
        console.log(e);
        console.log('play success');
      },
      fail(e) {
        console.log(e);
        console.log('play fail');
      }
    });
  }
});
