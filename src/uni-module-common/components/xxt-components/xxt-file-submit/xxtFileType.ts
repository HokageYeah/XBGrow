export interface imageObjType {
  path: string;
  isNetwork: boolean;
  bigImageUrl?: string; // 网络大图地址
  fileId: string;
  size?: number;
  itemSeq?: number; // 填表打卡中，一个表单里可能有多个上传图片的表单项，为了区分不同表单项上传的图片，增加该参数
}

export interface iconType {
  name: string;
  type: number;
  icon: string;
}

export interface videoType {
  videoPath: string;
  videoSize?: number;
  videoImgPath?: string;
  videoId?: string;
  videoDuration?: number;
  isNetwork: boolean;
  itemSeq?: number; // 兼容填表打卡
}
export interface audioType {
  audioPath: string;
  isNetwork: boolean;
  audioTimeNum?: number;
  audioId?: string;
  audioName?: string;
  itemSeq?: number; // 兼容填表打卡
}

// filetype: 0 是链接。 1 是docx、pdf、ppt、txt
export interface fileType {
  fileID: string;
  fileAddress: string;
  fileType: number;
  fileName: string;
  fileSize?: number;
  isNetwork: boolean;
  itemSeq?: number; // 兼容填表打卡
}

export interface allHttpRequestFilesType {
  imageHttpAry?: imageObjType[]; // 图片类型
  videoHttpAry?: videoType[]; // 视频类型
  fileHttpAry?: fileType[]; // 文件类型
  audioHttpAry?: audioType[]; // 音频类型
}
