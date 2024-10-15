import ajax from '@/uni-module-common/http';
import { appModuleConfig } from '@/uni-module-common/config';

/**
 * 微信小程序文本内容安全识别
 * @param content 文本内容
 * @returns ret 状态 1成功 -1失败    msg 返回说明
 */
export const wxTextSeccheck = async (content: string) => {
  const { userAgent } = useStore('user');
  console.log('wxTextSeccheck----', userAgent.value, appModuleConfig.entry);
  try {
    const data: any = await ajax<any>({
      url: '/msg-censor/msg-filter/wx-msg-censor',
      method: 'POST',
      data: {
        entry: appModuleConfig.entry,
        content
      }
    });
    console.log('wxTextSeccheck----data---', data);
    return {
      ret: data.ret,
      msg: data.content
    };
  } catch (error) {
    console.log('wxTextSeccheck----error---', error);
  }
};
