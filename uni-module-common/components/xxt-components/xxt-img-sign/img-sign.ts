export interface Sign {
  showSign: boolean;
  x: number | string;
  y: number | string;
  scale: number;
  signUrl?: string;
  can2Sign?: boolean;
  areaX1?: number;
  areaY1?: number;
  areaX2?: number;
  areaY2?: number;
  xpx?: number;
  ypx?: number;
  senderPlatform?: string; // 发布者使用的平台/端
  senderBgImgHeight?: number;
}

export const initSign: Sign = {
  showSign: true,
  x: '0rpx',
  y: '0rpx',
  scale: 1,
  signUrl: '',
  can2Sign: true,
  areaX1: 0,
  areaY1: 0
};
export interface SignArea {
  x: number | string;
  y: number | string;
  scale?: number;
  areaX1?: number;
  areaY1?: number;
  areaX2?: number;
  areaY2?: number;
  signFileId: string | number;
  showSign: boolean;
  can2Sign: boolean;
  xpx?: number;
  ypx?: number;
  senderPlatform?: string; // 发布者使用的平台/端
  senderBgImgHeight?: number;
}

export const defaultSignArea: SignArea = {
  showSign: true,
  x: 0,
  y: 0,
  scale: 1.43,
  can2Sign: false,
  areaX1: 0,
  areaY1: 0,
  signFileId: ''
};

export interface SignArea2Submit {
  showSign: boolean;
  x: number;
  y: number;
  xpx: number;
  ypx: number;
  scale: number;
  signUrl: string;
  areaX1: number;
  areaY1: number;
  areaX2: number;
  areaY2: number;
  can2Sign: boolean;
  signImgId?: string; /// 签名图片id
}
