export interface OrderInfoObj {
  appid?: string;
  partnerid?: string; // 微信支付商户号
  prepayid?: string; // 支付 id
  [key: string]: any;
}
export interface PayParams {
  provider: string;
  orderInfo: string | OrderInfoObj;
  timeStamp?: string; // 微信小程序必填
  nonceStr?: string; // 微信小程序必填
  package?: string; // 微信小程序必填
  signType?: string; // 微信小程序必填
  paySign?: string; // 微信小程序必填
  [key: string]: any;
}
