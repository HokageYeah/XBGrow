import type { LoginPhonePwdParams, LoginResult } from './member';
import ajax from '@/uni-module-common/http';

/**
 * 获取验证码
 * @param data 请求参数
 */
export const getPhoneCodeAPI = (data: { mobile: string; funcNo: number }) => {
  return ajax<{ content: string }>({
    url: '/base/getcodebymobilev2',
    data,
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http<{ content: string }>({
  //   method: 'POST',
  //   url: '/base/getcodebymobilev2',
  //   data
  // });
};
interface LoginPhoneCodeParams {
  entry: string;
  account: string;
  code: string;
  loginDefault: boolean;
  wxCode?: string;
}

/**
 * 验证码登录
 * @param data 请求参数
 */
export const loginPhoneCodeAPI = (data: LoginPhoneCodeParams) => {
  return ajax<LoginResult>({
    url: '/login-v2/login/login-by-mobile-code',
    data,
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http<LoginResult>({
  //   method: 'POST',
  //   url: '/login-v2/login/login-by-mobile-code',
  //   data
  // });
};
/**
 * 密码登录
 * @param data 请求参数
 */
export const loginPhonePwdAPI = (data: LoginPhonePwdParams) => {
  return ajax({
    url: '/login-v2/login/login-by-pwd',
    data,
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http({
  //   method: 'POST',
  //   url: '/login-v2/login/login-by-pwd',
  //   data
  // });
};

/**
 * 微信授权登录
 * @param data 请求参数
 */
export const loginPhoneWxAPI = (data: any) => {
  return ajax({
    url: '/login-v2/login/login-by-wx-applet-authorized',
    data,
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http({
  //   method: 'POST',
  //   url: '/login-v2/login/login-by-wx-applet-authorized',
  //   data
  // });
};

interface LoginWxMinParams {
  code: string;
  encryptedData?: string;
  iv?: string;
}
/**
 * 小程序登录
 * @param data 请求参数
 */
export const postLoginWxMinAPI = (data: LoginWxMinParams) => {
  return ajax<LoginResult>({
    url: '/login/wxMin',
    data,
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http<LoginResult>({
  //   method: 'POST',
  //   url: '/login/wxMin',
  //   data
  // });
};

/**
 * 选择身份登录
 * @param data 请求参数
 */
export const postLoginSelectAPI = (data: any) => {
  return ajax({
    url: '/login-v2/login/user-select-login',
    data,
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http({
  //   method: 'POST',
  //   url: '/login-v2/login/user-select-login',
  //   data
  // });
};

/**
 * 退出登录
 * @param data 请求参数
 */
export const postLoginOutAPI = (data: any) => {
  return ajax({
    url: '/login-v2/login/login-out',
    data,
    query: {},
    method: 'GET',
    custom: {
      showLoading: true
    }
  });
  // return http({
  //   method: 'GET',
  //   url: '/login-v2/login/login-out',
  //   data
  // });
};

/**
 * 获取教师信息
 * @param data 请求参数
 */
export const getTeacherAuthClassesAPI = () => {
  return ajax({
    url: '/user-data-v2/group/get-teacher-auth-classes',
    query: {},
    method: 'GET',
    custom: {
      showLoading: true
    }
  });
  // return http({
  //   method: 'GET',
  //   url: '/user-data-v2/group/get-teacher-auth-classes'
  // });
};

/**
 * 获取用户信息
 * @param data 请求参数
 */
export const getWxUserInfoAPI = () => {
  return ajax({
    url: '/login-v2/wx/get-wx-user-info',
    query: {},
    method: 'GET',
    custom: {
      showLoading: true
    }
  });
  // return http({
  //   method: 'GET',
  //   url: '/login-v2/wx/get-wx-user-info'
  // });
};

/**
 * 获取用户信息
 * @param data 请求参数
 */
export const saveWxUserInfoAPI = (data: any) => {
  return ajax({
    url: '/login-v2/wx/save-wx-user-info',
    data,
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http({
  //   method: 'POST',
  //   url: '/login-v2/wx/save-wx-user-info',
  //   data
  // });
};

/**
 * 小程序登录_内测版
 * @param phoneNumber 模拟手机号码
 */
export const postLoginWxMinSimpleAPI = (phoneNumber: string) => {
  return ajax<LoginResult>({
    url: '/login/wxMin/simple',
    data: {
      phoneNumber
    },
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http<LoginResult>({
  //   method: 'POST',
  //   url: '/login/wxMin/simple',
  //   data: {
  //     phoneNumber
  //   }
  // });
};

interface LoginParams {
  account: string;
  password: string;
}
/**
 * 传统登录-用户名+密码
 * @param data 请求参数
 */
export const postLoginAPI = (data: LoginParams) => {
  return ajax<LoginResult>({
    url: '/login',
    data,
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http<LoginResult>({
  //   method: 'POST',
  //   url: '/login',
  //   data
  // });
};

interface LoginWxCodeParams {
  entry: string;
  account?: string;
  wxCode: string;
  smsCode?: string;
  key?: string;
  loginDefault: Boolean;
}
/**
 * 使用微信 code 登录 / 关联微信账号与我方账号
 * @param data 请求参数
 */
export const loginByWxCodeAPI = (data: LoginWxCodeParams) => {
  return ajax<{ content: string }>({
    url: '/login-v2/login/login-by-wx-code',
    data,
    query: {},
    method: 'POST',
    custom: {
      showLoading: true
    }
  });
  // return http<{ content: string }>({
  //   method: 'POST',
  //   url: '/login-v2/login/login-by-wx-code',
  //   data
  // });
};
