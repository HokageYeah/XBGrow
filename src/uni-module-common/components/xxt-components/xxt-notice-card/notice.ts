export interface File {
  fileId: number;
  fileName: string;
  fileParam?: string;
  filePath: string;
  fileSeq: number;
  fileSize: number;
  fileType: number;
  fileTypeName?: string;
  fileNum?: number;
}

export interface Notice {
  noticeId: number;
  noticeType: number;
  noticeTypeName: string;
  noticeTitle: string;
  contentType?: number;
  contentTypeName?: string;
  content: string;
  destDescribe?: string;
  sendDate: number;
  senderId?: number;
  senderType?: number;
  senderName?: string;
  feedbackFlag: boolean;
  feedbackType: number;
  feedbackNum?: number;
  noFeedbackNum?: number;
  totalNum?: number;
  selfFeedbackFlag?: boolean;
  showDate?: boolean;
  showDateDesc?: string;
  checked?: boolean;
  attachList: Array<File>;
  [key: string]: any;
}

export const initNotice: Notice = {
  contentTypeName: '',
  content: '',
  destDescribe: '',
  sendDate: 0,
  senderId: 0,
  senderType: 0,
  senderName: '',
  feedbackFlag: false,
  feedbackType: 0,
  feedbackNum: 0,
  noFeedbackNum: 0,
  totalNum: 0,
  selfFeedbackFlag: false,
  showDate: false,
  showDateDesc: '',
  checked: false,
  noticeId: 0,
  noticeType: 0,
  noticeTypeName: '',
  noticeTitle: '',
  attachList: []
};

// noticeType：通知类型 1一般通知  2信必达 3阅读确认通知 4接龙通知 5提交回执通知  6循环通知 7文件签名通知
export const noticeBtn = ['', '查看', '确认', '确认', '接龙', '回执', '', '签名'];
export const nTypes = [
  {},
  { backgroundColor: `rgba(141, 62, 251, 0.15)`, color: '#8D3EFB' },
  {},
  {
    color: '#FFB700',
    backgroundColor: `rgba(255, 183, 0, 0.15)`
  },
  {
    color: '#2B8AFF',
    backgroundColor: `rgba(43, 138, 255, 0.15)`
  },
  {
    color: '#FF5436',
    backgroundColor: `rgba(255, 84, 54, 0.15)`
  },
  {
    backgroundColor: `rgba(74, 217, 117, 0.15)`,
    color: '#4AD975'
  },
  {
    backgroundColor: `rgba(74, 217, 117, 0.15)`,
    color: '#4AD975'
  }
];
