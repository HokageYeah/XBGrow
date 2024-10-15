import ajax from '@/uni-module-common/http';

/**
 * 保存需要向 h5 页面传递的信息，如登录信息、store 等
 * 用于uni 通过 webview 嵌套 h5 页面时，uni 与 h5 进行通信
 * @param data 要保存的信息
 * @param saveCookie 是否保存 cookie，若是则由接口保存当前登录用户的 cookie
 * @returns 凭证，用该凭证从服务器获取保存的信息
 */
export const saveCommunicationData = async (data: String | Object, saveCookie = false) => {
  const url = '/base/get-token-by-param';
  let params = '';
  if (typeof data === 'object') {
    params = JSON.stringify(data);
  } else {
    params = data;
  }
  const result: { token: string } = await ajax({
    url,
    method: 'POST',
    data: {
      params,
      saveCookie
    }
  });
  return result.token;
};

/**
 * 根据凭证获取服务端信息，用于 uni 通过 webview 嵌套 h5 时，uni 与 h5 间通信
 * 与 /base/get-token-by-param 接口配套使用
 * @param token 凭证
 * @param resetCookie 是否重置 cookie，若是则由接口使用已保存的 cookie 重置当前浏览器的 cookie
 * @returns 返回保存的信息
 */
export const getCommunicationData = async (token: String, resetCookie = false) => {
  const url = '/base/get-param-by-token';
  const result: { content: string } = await ajax({
    url,
    method: 'POST',
    data: {
      token,
      resetCookie
    }
  });
  try {
    const content = JSON.parse(result.content);
    return {
      content
    };
  } catch (error) {
    return {
      content: result.content
    };
  }
};
