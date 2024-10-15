import { cloneDeep } from 'lodash';
import utils from '../utils';
import { formatTokenObj, getCookie } from '../utils/caches';
import ajax from '@/uni-module-common/http';
import {
  clearJingMoLoginInfo,
  dealLoginSuccessResponse,
  getHttpUserMore,
  getLoginUserInfo,
  loginByWxApplet
} from '@/uni-module-common/hooks/useLoginHooks';
import { variableTypeDetection } from '@/uni-module-common/utils/verifyType';

export interface accountType {
  webId: number;
  info: string;
  userInfo?: string;
  nickname: string;
  userType?: number;
  jxlxUserType: number;
  ybtFlag: boolean;
  jxlxUserId: number;
  jxlxOrgId: number;
  jxlxPersonName: string;
  changed: boolean;
  xinzxUserId: string;
  xinzxUserType: number;
  xinzxUserName: string;
  xinzxStudentId: string;
  xinzxStudentName: string;
  xinzxClassId: string;
  xinzxClassName: string;
  xinzxGradeId: string;
  xinzxGradeName: string;
  xinzxSchoolId: string;
  xinzxSchoolName: string;
  xinzxAccountId: string;
  gradeCode: number;
  termCode: number;
}
type accountListType = accountType[]; // 身份列表
interface UserInfo {
  ima?: boolean; // 是否多身份账号
  wid?: number; // 账号ID
  uid?: string; // 博客ID
  avatorUrl?: string; // 头像
  nickname?: string; // 昵称
  provinceId?: number; // 省分id
  areaCode?: number; // 地区id
  jut?: number; // 角色 // jxlx身份类型 -1, "网站注册账号" 0, "教师" 1, "学生" 2, "家长" 3, "管理员"  99, "访客（未登录）"
  userId?: number; // jxlx userId
  schoolName?: string; // 学校名称'
  schoolId?: string; // 学校id
  xinzxClassId?: number; // 班级id
  xinzxClassName?: string; // 班级名称
  orgId?: number; // 组织id'
  jpmu?: boolean; // 是否有jxlx班级资料管理权限
  name?: string; //  jxlx姓名
  info?: string; // 身份描述
  gradeId?: number; // 学科年级
  zxjx?: number; // 是否众享家校，返回值 "1" "0"
  bookVersion?: number; // 学科教材版本
  username?: string; // 用户名
  mobile?: string; // 手机号'
  provinceName?: string; // 省分名称
  xxtGradeName?: string; // 学科年级名称
  xxtBookVersionName?: string; // 学科教材版本名称
  useXinzxData?: boolean; // 是否使用新众享家校数据
  phaseCode?: number; // 学段编码
  xinzxAdmin: boolean; // 是否是管理员
  gradeCode?: number; // 学科年级编码
  gradeCodeIgnoreRole?: number; // 学科年级编码，不区分用户身份，都返回数据
  termCode?: number; // 学期编码
  classInfo?: {}; // 用户班级  学生身份时存在
  permission?: boolean; // 是否有权限 暂时没有使用
  accountId?: number;
  brandCode?: string; // 品牌信息
  stuId?: number; // 学生id
}
interface clientInfoType {
  cv?: string;
  chv?: string;
  ch?: string;
  jv?: string;
  cbv?: string;
  [key: string]: any;
}

// 获取客户端传递过来的userAgent
interface userAgentType {
  hostId?: string;
  appversion?: string;
  appversioncode?: string;
  [key: string]: any;
}
// 默认用户信息
const defaultUserInfo: UserInfo = {
  ima: false, // 是否多身份账号
  wid: 0, // 账号ID
  uid: '', // 博客ID
  avatorUrl: '', // 头像
  nickname: '', // 昵称
  provinceId: 0, // 省分id
  areaCode: 0, // 地区id
  jut: 0, // 角色 // jxlx身份类型 -1, "网站注册账号" 0, "教师" 1, "学生" 2, "家长" 3, "管理员"   99, "访客（未登录）"
  userId: -1, // jxlx userId
  schoolName: '', // 学校名称'
  schoolId: '', // 学校id
  orgId: 0, // 组织id'
  xinzxClassId: 0, // 班级id
  xinzxClassName: '', // 班级名称
  jpmu: false, // 是否有jxlx班级资料管理权限
  name: '', //  jxlx姓名
  info: '', // 身份描述
  gradeId: 0, // 学科年级
  zxjx: 0, // 是否众享家校，返回值 "1" "0"
  bookVersion: 0, // 学科教材版本
  username: '', // 用户名
  mobile: '', // 手机号'
  provinceName: '', // 省分名称
  xxtGradeName: '', // 学科年级名称
  xxtBookVersionName: '', // 学科教材版本名称
  useXinzxData: false, // 是否使用新众享家校数据
  phaseCode: 0, // 学段编码
  xinzxAdmin: false, // 是否是管理员
  gradeCode: 0,
  gradeCodeIgnoreRole: 0, // 学科年级编码，不区分用户身份，都返回数据
  termCode: 0,
  classInfo: {}, // 用户班级  学生身份时存在
  permission: true, // 是否有权限 暂时没有使用
  accountId: 0,
  brandCode: '', // 品牌信息
  stuId: 0
};

// 用户默认 clientInfo
const defaultClientInfo: clientInfoType = {
  cv: '', // 客户端版本号
  chv: '', // 客户端渠道版本号
  ch: '', // 客户端渠道号
  jv: '', // 客户端版本号
  cbv: '' // 客户端build版本号
};

const defaultUserAgent: userAgentType = {
  hostId: '', // 客户端版本号
  appversion: '', // 客户端渠道版本号
  appversioncode: '' // 客户端渠道号
};
// 用户身份默认列表
const defaultAccountList: accountListType = [];
const deafultGradeTermInit = {
  grade: {
    code: 21,
    desc: 'L1'
  },
  term: {
    code: 1,
    desc: '上学期'
  }
};
// 判断是否登录，需要考虑到微信和app两种不同cookie的情况
// app传入的token是字符串， 微信则可能是重新手动生成的包含过期时间的对象
// 也可能是请求响应头带的cookies数组
export const isLoginFunc = (token: any) => {
  // 判断token是否存在
  console.log('isLoginFunc----APP-MP-WEIXIN---', token);
  if (!token) {
    return false;
  }
  // 如果是对象，则判断对象的key是否包含 _SSID_和XXT_ID
  // 如果_SSID_和XXT_ID 可以为空，也返回true
  // 同时包含 _SSID_和XXT_ID 或者 login-by-pwd 有_LOGIN_MA_=mat%2d164ab4e0286f2d3d04dd444baab2ece5328a62a2; Domain=xxt.cn; Path=/
  if (variableTypeDetection.isObject(token)) {
    const isLogin =
      (Object.prototype.hasOwnProperty.call(token, '_SSID_') &&
        Object.prototype.hasOwnProperty.call(token, 'XXT_ID')) ||
      Object.prototype.hasOwnProperty.call(token, '_LOGIN_MA_');
    console.log('isLoginFunc----APP-MP-WEIXIN---object--', isLogin);
    return (
      (Object.prototype.hasOwnProperty.call(token, '_SSID_') &&
        Object.prototype.hasOwnProperty.call(token, 'XXT_ID')) ||
      Object.prototype.hasOwnProperty.call(token, '_LOGIN_MA_')
    );
  }
  // 如果是数组，数组中是字符串，类似JSESSIONID=319A253C58945895D07483E3BDF4BE50，
  // 判断数组的_SSID_和XXT_ID是否包含
  if (variableTypeDetection.isArray(token)) {
    // 判断数组中的字符串，包含_SSID_和XXT_ID, ['_SSID_', 'XXT_ID']
    // _SSID_和XXT_ID在数组中不同的地方
    const _SSID_ = token.some((item: string) => item.includes('_SSID_'));
    const XXT_ID = token.some((item: string) => item.includes('XXT_ID'));
    const _LOGIN_MA_ = token.some((item: string) => item.includes('_LOGIN_MA_'));
    console.log('isLoginFunc----APP-MP-WEIXIN---array--', (_SSID_ && XXT_ID) || _LOGIN_MA_);
    return (_SSID_ && XXT_ID) || _LOGIN_MA_;
  }
  // 如果是字符串 判断token是否存在, token在app端是字符串，且token中是否有_SSID_和XXT_ID
  return (
    variableTypeDetection.isString(token) &&
    ((token.includes('_SSID_') && token.includes('XXT_ID')) || token.includes('_LOGIN_MA_'))
  );
};
const user = defineStore({
  id: 'user',
  state: () => ({
    userInfo: cloneDeep(defaultUserInfo), // 用户信息,
    // isLogin: !!uni.getStorageSync('token'), // 登录状态
    isLogin: isLoginFunc(uni.getStorageSync('token')), // 登录状态
    lastUpdateTime: 0, // 上次更新时间
    useToken: uni.getStorageSync('token'),
    userAgent: cloneDeep(defaultUserAgent), // 用户设备信息'
    clientInfo: cloneDeep(defaultClientInfo), // 客户端信息 {}
    accountList: cloneDeep(defaultAccountList), // 用户身份信息
    deafultGradeTerm: cloneDeep(deafultGradeTermInit)
  }),
  actions: {
    // 设置token
    async setToken(token = '', userMessage: any = {}, userAgent = '', clientInfo: any = {}) {
      console.log('setToken----查看--', token);
      this.useToken = token;
      // if (token === '') {
      if (!isLoginFunc(token)) {
        this.isLogin = false;
        uni.removeStorageSync('token');
      } else {
        this.isLogin = true;
        uni.setStorageSync('token', token);
        // #ifdef APP-PLUS || APP
        console.log('setToken----APP-PlUS---', token);
        // 请求接口获取用户信息
        const res: any = await getLoginUserInfo();
        this.loginAfter(this.getClientInfo({ ...userMessage, ...res }), userAgent, clientInfo);
        // this.loginAfter(this.getClientInfo(userMessage), userAgent, clientInfo);
        // #endif
      }
      return this.isLogin;
    },
    // 设置用户身份列表
    setAccountList(accountList: accountType[]) {
      console.log('setAccountList----', accountList);
      if (accountList.length === 0) {
        // 多身份删除
        uni.removeStorageSync('accountList');
      } else {
        uni.setStorageSync('accountList', accountList);
        this.accountList = accountList;
      }
    },
    // 设置用户默认年级学科版本 微信小程序内需要用
    setDeafultGradeTerm(deafultGradeTerm: any) {
      this.deafultGradeTerm = deafultGradeTerm;
    },
    // 重置用户默认数据
    resetUserData() {
      console.log('resetUserData----重置用户默认数据---');
      this.setToken();
      this.userInfo = cloneDeep(defaultUserInfo);
      this.accountList = cloneDeep(defaultAccountList);
      this.deafultGradeTerm = cloneDeep(deafultGradeTermInit);
      // #ifdef APP-PLUS || APP
      this.clientInfo = cloneDeep(defaultClientInfo);
      this.userAgent = cloneDeep(defaultUserAgent);
      // #endif
    },
    getClientInfo(clientInfo: any) {
      try {
        console.log('app启动信息传递----getClientInfo-');
        if (typeof clientInfo === 'object') {
          clientInfo = JSON.stringify(clientInfo);
        }
        console.log('getClientInfo-----', clientInfo);
        const resParse = JSON.parse(clientInfo);
        return resParse;
      } catch (error) {}
    },
    // 设置客户端信息
    setClientInfo(clientInfo: any) {
      this.clientInfo = this.getClientInfo(clientInfo);
    },
    // 格式化 UA
    formatUserAgent(userAgent: string) {
      try {
        console.log('app启动信息传递----formatUserAgent-');
        const userary = userAgent.split(';');
        const userAgenObj = userary.reduce((result: any, token: any) => {
          const [key, value] = token.split(':');
          result[key || 'device'] = value || 'device';
          return result;
        }, {});
        return userAgenObj;
      } catch (error) {}
    },
    setUserAgent(userAgent: string) {
      this.userAgent = this.formatUserAgent(userAgent);
    },
    // 获取个人信息
    async getInfo(userMessage: any, entry: String = 'unknown') {
      // 如果登录传入用户信息走这个
      const getV = (k: any, _int?: any) => {
        if (userMessage[k] || (k === 'jxlxUserType' && userMessage[k] === 0)) {
          return _int ? parseInt(userMessage[k], 10) : userMessage[k];
        }
        return null;
      };
      if (Object.keys(userMessage).length > 0) {
        console.log('get-user-info-by-login------userMessage', userMessage);
        userMessage.accountList && this.setAccountList(userMessage.accountList);
        const unitCount = getV('unitCount', true);
        const uid = getV('uid', true);
        const userinfo = {
          ima: this.accountList && this.accountList.length > 1, // 是否多身份账号
          wid: getV('webId', true), // 账号ID
          uid, // 博客ID
          avatorUrl: utils.getAvatorUrl(getV('uid', true)), // 头像
          nickname: getV('nickname'), // 昵称
          provinceId: getV('province', true), // 省分id
          areaCode: userMessage.cityCode ? parseInt(userMessage.cityCode, 10) : 371, // 地区id
          jut: userMessage.xinzxUserType ?? getV('jxlxUserType', true), // 角色 // 用户身份类型 -1, "网站注册账号" 0, "教师" 1, "学生" 2, "家长" 3, "管理员"   99, "访客（未登录）"
          userId: getV('userId', true), // jxlx userId
          schoolName: userMessage.schoolName, // 学校名称'
          schoolId: userMessage.schoolId, // 学校id
          orgId: getV('orgId', true), // 组织id'
          xinzxClassId: userMessage.xinzxClassId, // 班级id
          jpmu: unitCount > 0, // 是否有jxlx班级资料管理权限
          name: getV('personName'), // jxlx姓名
          info: getV('info'), // 身份描述
          gradeId: getV('xxtGradeId', true), // 学科年级
          zxjx: getV('zxjx'), // 是否众享家校，返回值 "1" "0"
          bookVersion: getV('xxtBookVersion', true), // 学科教材版本
          username: getV('username'),
          mobile: getV('mobile'),
          provinceName: getV('provinceName'),
          xxtGradeName: getV('xxtGradeName'),
          xxtBookVersionName: getV('xxtBookVersionName'),
          phaseCode: getV('phaseCode', true) || 211, // 学段编码, 如果没有 则默认211， 朗读小程序需要这个参数
          useXinzxData: userMessage.useXinzxData,
          xinzxAdmin: userMessage.xinzxAdmin,
          gradeCode: getV('gradeCode', true),
          gradeCodeIgnoreRole: getV('gradeCode', true), // 学科年级编码，不区分用户身份，都返回数据
          termCode: getV('termCode', true),
          xinzxClassName: getV('xxtClassName'),
          classInfo: userMessage.classInfo || {},
          accountId: getV('accountId', true),
          brandCode: userMessage.brandCode,
          stuId: userMessage.useXinzxData ? userMessage.xinzxStudentId : 0
        };
        this.userInfo = userinfo;
        console.log('get-user-info-by-login------userInfo', this.userInfo);
        return Promise.resolve();
      }
      // 如果登录没有传入用户信息走请求
      // XXX：待改为接口返回 webId。引来 Cookie 可能会由于浏览器政策收紧导致获取不到
      let ckWid = null;
      if (entry === 'H5') {
        ckWid = getCookie('XXT_ID');
        if (ckWid != null) {
          ckWid = parseInt(ckWid);
        }
      }
      console.log('get-user-info-by-login------setcookie', userMessage);

      const result: any = await ajax({
        url: '/user-data-v2/user/get-user-info-by-login',
        method: 'GET'
      });
      // 请求身份列表
      await this.getUserMore();
      if (result && !result.message) {
        const userinfo = {
          ima: this.accountList && this.accountList.length > 0, // 是否多身份账号
          avatorUrl: utils.getAvatorUrl(result.blogId), // 头像
          nickname: result.nickName, // 昵称
          provinceId: result.provinceId, // 省分id
          areaCode: result.cityCode ? parseInt(result.cityCode, 10) : 371, // 地区id
          jut: result.userType, // 角色
          xinzxUserType: result.userType, // 新增角色身份
          schoolName: result.schoolName, // 学校名称'
          schoolId: result.schoolId, // 学校id
          orgId: result.orgId, // 组织id'
          useXinzxData: result.useXinzxData, // 是否使用新平台
          xinzxClassId: result.xinzxClassId,
          wid: formatTokenObj(this.useToken).XXT_ID || ckWid || result.webId, // webId
          username: result.userName,
          stuId: result.useXinzxData ? result.xinzxStudentId : 0,
          xinzxAdmin: result.xinzxAdmin,
          brandCode: result.brandCode,
          accountName: result.accountName,
          gradeCode: result.gradeCode,
          gradeCodeIgnoreRole: result.gradeCode // 学科年级编码，不区分用户身份，都返回数据
        };
        this.userInfo = userinfo;
        uni.setStorageSync('userInfo', JSON.stringify(userinfo));
        this.isLogin = true; // 重置登录状态
        console.log('get-user-info-by-login------getUserMore', this.userInfo);
        // #ifndef APP-PLUS || APP
        // this.initAppConfig();
        // #endif
        return Promise.resolve(result);
      }
      const errorMessage = '请求异常异常';
      uni.showToast({
        title: result.message || errorMessage,
        icon: 'error',
        mask: true
      });
      // 登录失败， 重置登录信息。
      this.resetUserData();
    },
    initAppConfig() {
      const { setTabBar, appConfig } = useStore('appConfig');
      // const obj = {
      //   pagePath: '/pages/notice-list-home/notice-list-home',
      //   text: '智能通知',
      //   iconPath: 'tabbar_notice_unselect.png',
      //   selectedIconPath: 'tabbar_notice_select.png'
      // };
      // if (this.userInfo.jut === 0 || this.userInfo.jut === 3) {
      //   // 教师身份
      //   obj.pagePath = '/pages/teacher/notice-list/notice-list';
      // } else if (this.userInfo.jut === 1 || this.userInfo.jut === 2) {
      //   // 学生身份
      //   obj.pagePath = '/pages/student/notice-list/notice-list';
      // }
      // setTabBar(obj, 0);
      uni.setStorageSync('appConfig', appConfig.value);
    },
    async getUserMore() {
      // 获取用户所有身份
      const list = await getHttpUserMore();
      console.log('getUserMore-----', list);
      // 处理多身份数据 // 将多身份数据保存起来
      this.setAccountList(list);
    },
    // 设置用户信息属性
    setUserInfoAttr(k: string, v: any) {
      // @ts-expect-error
      this.userInfo[k] = v;
    },
    // 更新用户相关信息 (手动限流 5秒之内不刷新)
    async updateUserData(userMessage: any, debounceTime = 5000) {
      console.log('updateUserData-----', userMessage);
      if (!this.isLogin) {
        this.resetUserData();
        return;
      }
      const nowTime = new Date().getTime();
      // 此处设置5秒，可能导致5秒内无法切换身份
      if (this.lastUpdateTime + debounceTime > nowTime) return;
      try {
        await this.getInfo(userMessage);
      } catch (error) {}
      this.lastUpdateTime = nowTime;
      return this.userInfo;
    },
    // 登录后获取用户信息 userAgent clientInfo
    async loginAfter(userMessage: any, userAgent: string, clientInfo: any) {
      console.log('app启动信息传递----loginAfter-');
      this.clientInfo = this.getClientInfo(clientInfo);
      this.userAgent = this.formatUserAgent(userAgent);
      console.log('app启动信息传递----clientInfo-', this.clientInfo);
      console.log('app启动信息传递----userAgent-', this.userAgent);
      console.log('app启动信息传递----userInfo-', userMessage);
      await this.updateUserData(userMessage);
    },
    // 判断uni的storage中是否有 userInfo、 accountList 如果有则初始化的时候给store赋值
    initStoreData(entry: string, noInitWxLogin?: boolean) {
      // #ifndef MP-WEIXIN
      // 如果不是微信小程序的话，直接从 storage 中获取
      const userInfo = uni.getStorageSync('userInfo');
      let userInfoObj: any = {};
      if (userInfo && userInfo !== 'undefined') {
        userInfoObj = JSON.parse(userInfo);
        // 初始化的时候给存储的字段更改名称
        userInfoObj = {
          ...userInfoObj,
          webId: userInfoObj.wid,
          province: userInfoObj.provinceId,
          xinzxUserType: userInfoObj.jut,
          cityCode: userInfoObj.areaCode,
          personName: userInfoObj.name,
          xxtGradeId: userInfoObj.gradeId,
          xxtBookVersion: userInfoObj.bookVersion,
          xxtClassName: userInfoObj.xinzxClassName,
          useXinzxData: userInfoObj.useXinzxData
        };
      }
      const accountList = uni.getStorageSync('accountList');
      accountList && this.setAccountList(accountList);
      userInfo && this.updateUserData(userInfoObj);
      console.log('initStoreData---userInfo----entry----', this.userInfo, entry);
      console.log('initStoreData---accountList----', this.accountList);
      // #endif
      // 如果是微信小程序的话，则需要初始化的时候腿cookie进行筛选、过滤、存储
      // #ifdef MP-WEIXIN
      if (!noInitWxLogin) {
        this.initWxLogin(entry);
      }
      // #endif
    },
    // 初始化微信登录, 获取登录凭证 微信静默登录
    async initWxLogin(entry: string) {
      const cookieMap = uni.getStorageSync('token') || {};
      console.log('initWxLogin----cookieMap----', cookieMap);
      console.log('initWxLogin----cookieMapuseToken----', this.useToken);
      const nowMills = new Date().getTime();
      // 剔除过期的 Cookie
      for (const key in cookieMap) {
        const cookie = cookieMap[key];
        if (cookie.expires !== -1 && cookie.expires < nowMills) {
          // this.useToken[key] = cookie;
          delete this.useToken[key];
        }
      }
      console.log('initWxLogin----this.useToke----', typeof this.useToken, this.useToken);
      if (variableTypeDetection.isString(this.useToken) && this.useToken.length <= 0)
        this.useToken = {};
      console.log('initWxLogin----this.useToke----', this.useToken);
      // xxtSessionId 不存在时生成一个
      if (!this.useToken.xxtSessionId) {
        console.log('initWxLogin----this.useToke.xxtSessionId----', this.useToken.xxtSessionId);
        const value = `wxmp.${nowMills}.${this.randomString(13)}`;
        console.log('initWxLogin----this.useToke.value----', value);
        this.useToken.xxtSessionId = {
          value,
          expires: -1
        };
      }
      console.log('initWxLogin----this.useToke----xxtSessionId---', this.useToken);
      uni.setStorageSync('token', this.useToken);
      console.log('initWxLogin----this.useToke----xxtSessionId---', uni.getStorageSync('token'));
      let saveStateCookie = {};
      let isValid = false;
      const cachedData = uni.getStorageSync('saveStateCookie');
      console.log('initWxLogin----', cachedData);
      let jsonData: any = {};
      if (cachedData) {
        jsonData = JSON.parse(cachedData);
      }
      let saveStateJson = null;
      if (jsonData) {
        saveStateJson = jsonData._SSO_STATE_TICKET;
      }
      console.log('initWxLogin----saveStateJson---', saveStateJson);
      console.log('initWxLogin----saveStateJson.expires---', saveStateJson?.expires);
      if (saveStateJson && saveStateJson.expires > nowMills) {
        isValid = true;
        saveStateCookie = jsonData;
        console.log('initWxLogin----saveStateCookie---', saveStateCookie);
      }
      console.log('initWxLogin-----init-----', saveStateCookie);
      uni.setStorageSync('saveStateCookie', JSON.stringify(saveStateCookie));

      const isfals = this.useToken.XXT_ID && (this.useToken.XXT_TICKET || this.useToken._XSID_);
      console.log('dealLoginSuccessResponse-----cookieMapinit-----', this.useToken);
      console.log('dealLoginSuccessResponse-----XXT_ID-----', this.useToken.XXT_ID);
      console.log('dealLoginSuccessResponse-----XXT_TICKET-----', this.useToken.XXT_TICKET);
      console.log('dealLoginSuccessResponse-----_XSID_-----', this.useToken._XSID_);
      console.log('dealLoginSuccessResponse-----isfals-----', isfals);
      if (this.useToken.XXT_ID && (this.useToken.XXT_TICKET || this.useToken._XSID_)) {
        console.log('initWxLogin---initAppConfig()---before---', entry);
        // 请求身份列表, 需要线请求身份列表， 不然userinfo中ima是否多身份字段无法获取正确值
        await this.getUserMore();
        const userInfo = uni.getStorageSync('userInfo');
        userInfo && this.updateUserData(JSON.parse(userInfo));
        // this.initAppConfig();
        console.log('initWxLogin---initAppConfig()---', entry);
      } else {
        console.log('initWxLogin---clearJingMoLoginInfo---');
        // 登录失败， 重置登录信息。
        clearJingMoLoginInfo();
        this.isLogin = false;
      }
      console.log('initWxLogin---init---after---', entry);
      if (!this.isLogin) {
        console.log('initWxLogin---loginByWxApplet---', entry);
        // 如果没有登录的话，小程序静默登录
        // 凭证登录
        let isNeedWxLogin = true;
        if (isValid) {
          isNeedWxLogin = false;
          try {
            const data: any = await ajax({
              url: '/login-v2/login/login-by-save-login',
              method: 'GET',
              data: {
                entry,
                loginDefault: true
              }
            });
            if (!data.loginResult) {
              loginByWxApplet(entry);
              return;
            }
            if (data.loginResult.code === 101) {
              console.log('initWxLogin---loginByWxApplet---data---', data);
              await this.getUserMore();
              dealLoginSuccessResponse(data);
            }
          } catch (error) {
            console.log('initWxLogin---error---', error);
            loginByWxApplet(entry);
          }
        }
        if (isNeedWxLogin) {
          console.log('initWxLogin---isNeedWxLogin---');
          loginByWxApplet(entry);
        }
      }
    },
    /**
     * 生成随机字符串
     * @param {*} length
     */
    randomString(length: number) {
      const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)];
      }
      return result;
    }
  },
  persist: {
    enabled: true,
    H5Storage: window?.localStorage,
    strategies: [
      {
        storage: window?.localStorage
        // paths: ['userInfo']
      }
    ]
  }
});

export default user;
