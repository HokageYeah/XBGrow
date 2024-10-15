import { natToUniBridgeToH5, uniToNatBridgeToH5 } from './uniToNavProtocol';
import { uniToAppPluginBridge } from './uniToAppPluginBridge';
import bridge from '@/uni-module-common/utils/uniToNativeBridge';

const baseUrl = 'https://m.xxt.cn';

// 所有的页面 新增unimpUrl参数。地址为你需要跳转的uni地址。例如：&unimpUrl=pages/detail/test
// 选择课文朗读资源（教师端）
const resourceSelectH5Url = `${baseUrl}/v2/gululu/reading/homework/tea-reading-list?unimpParams=1&unimpUrl=pages/assign-task/content-form/content-form`;
// 完成课文朗读（学生端）
const studentFinishH5Url = `${baseUrl}/v2/gululu/reading/homework/stu-article?unimpParams=1&unimpUrl=pages/student/task-detail/task-detail`;
// 课文朗读作答报告（学生端、教师端）
const studentAnswerReportH5Url = `${baseUrl}/v2/gululu/reading/homework/result?unimpParams=1`;
//  选择经典诵读资源（教师端）
const classicReadingResourceSelectH5Url = `${baseUrl}/v2/gululu/reading/homework/tea-recite-list?unimpParams=1&modular=3&unimpUrl=pages/assign-task/content-form/content-form`;
// 经典诵读完成作业（学生端）
// const classicReadingStuFinishH5URL = `${baseUrl}/v2/gululu/reading/homework/stu-article?unimpParams=1`;
// 经典诵读作答报告（学生端、教师端）
// const classicReadingStuAnswerReportH5URL = `${baseUrl}/v2/gululu/reading/reading-result?unimpParams=1`;
// 选择英语读测评资源（教师端）
const englishReadingResourceSelectH5Url = `${baseUrl}/v2/reading/homework/en-tea-reading-list?unimpParams=1&unimpUrl=pages/assign-task/content-form/content-form`;
// 英语读测评完成作业（学生端）
const englishReadingStuFinishH5Url = `${baseUrl}/v2/reading/en-article-details?unimpParams=1&unimpUrl=pages/student/task-detail/task-detail`;
// 英语读测评跟读作答报告（学生端、教师端）
const englishReadingStuReadResultH5Url = `${baseUrl}/v2/reading/en-reading-result?unimpParams=1`;
// 英语读测评背诵作答报告（学生端、教师端）
const englishReadingStuReciteResultH5Url = `${baseUrl}/v2/reading/en-recite-result?unimpParams=1`;
// 选择数学课时练资源（教师端）
const mathClassPracticeResourceSelectH5Url = `${baseUrl}/v2/gululu/classtrain/tea-resource?unimpParams=1&unimpUrl=pages/assign-task/content-form/content-form`;
// 选择天天练资源（教师端）
const dailyPracticeResourceSelectH5Url = `${baseUrl}/etest/teacher-ttl-book-show.htm?unimpParams=1&unimpUrl=pages/assign-task/content-form/content-form`;
// 数学课时练、天天练去做题页面（学生端、教师端）
const mathClassPracticeStuFinishH5Url = `${baseUrl}/etest/ttlquestionanswer.htm?unimpParams=1&resUseType=1&unimpUrl=pages/student/task-detail/task-detail`;
// 数学课时练、天天练去作答报告页面（学生端查看自己）
const mathClassPracticeSelfAnswerReportH5Url = `${baseUrl}/etest/ttlquestionanswer.htm?unimpParams=1&resUseType=1`;
// 数学课时练、天天练去作答报告页面（学生端、教师端）
const mathClassPracticeStuAnswerReportH5Url = `${baseUrl}/etest/teapaperstudetail.htm?unimpParams=1`;
// 选择温故与知新资源 -- 寒假作业（taskSubType 为 8）
const evaluationResourceSelectH5Url = `${baseUrl}/v2/toc/holiday-plan-intro?unimpParams=1&unimpUrl=pages/assign-task/content-form/content-form`;
// 温故与知新完成作业
const evaluationFinishH5URL = `${baseUrl}/v2/toc/evaluation-intro?unimpParams=1&unimpUrl=pages/student/task-detail/task-detail`;
// 温故与知新作答报告
const evaluationAnswerReportH5URL = `${baseUrl}/v2/toc/evaluation-result?unimpParams=1`;
// 温故与知新班级数据
const evaluationUnitDataH5Url = `${baseUrl}/v2/toc/summer-homework/learning-tea-view?unimpParams=1`;
// 寒假作业计划详情页
const holidayPlanDeatilH5Url = `${baseUrl}/v2/toc/holiday-plan?unimpParams=1&unimpUrl=pages/assign-task/content-form/content-form`;
// 选择温故与知新资源（taskSubType 为 9）
const wgyzxResourceSelectH5Url = `${baseUrl}/v2/toc/arrange-catalog?unimpParams=1&unimpUrl=pages/assign-task/content-form/content-form`;

// 学生加入班级页
const stuAddClassH5Url = `${baseUrl}/v2/xxtincome/search-tea-phone?unimpParams=1&ktType=2&unimpUrl=pages/task-list-home/task-list-home`;
// 投诉页
const complaintH5Url = `${baseUrl}/complaint/complaint.htm?unimpParams=1`;

// 成绩 start
// 教师查看成绩详情
const teaScoreReportH5Url = `${baseUrl}/v2/new-score-report/new-tea-score?unimpParams=1`;

// 无法收到短信名单
const noReceivedSmsStusH5Url = `${baseUrl}/v2/new-score-report/unable-receive-sms-list?unimpParams=1`;
// 成绩 end

// 会员中心--三方支付
const orderProductPayH5Url = `${baseUrl}/v2/order/order-product-pay?unimpParams=1`;
// 会员中心--运营商支付
const orderProductPhoneH5Url = `${baseUrl}/v2/order/order-product-phone?unimpParams=1`;

// 会员中心\用户权益页面
const orderRightsH5Url = `${baseUrl}/v2/order/order-rights?unimpParams=1`;
// 班级管理页面
const classStuListH5Url = `${baseUrl}/v2/userdata/class-manage/class-stu-list?unimpParams=1`;

const newTeaScoreChartH5Url = `${baseUrl}/v2/new-score-report/new-tea-score-chart?unimpParams=1`;

export const goToH5 = (h5Url = '') => {
  // #ifdef APP-PLUS || APP-PLUS
  bridge
    .sendNativeEvent(uniToNatBridgeToH5, {
      h5Url
    })
    .then((res) => {
      uni.$emit(natToUniBridgeToH5, res);
    });
  // #endif
  // #ifdef H5
  window.location.href = h5Url;
  // #endif
};
// 通信方式
// 跳转到 选择课文朗读资源（教师端）通信方式
export const readResourceSelectH5 = (paramsStr = '') => {
  const params = paramsStr || `&modular=2`;
  goToH5(`${resourceSelectH5Url}${params}`);
};
//  完成课文朗读（学生端）
const { userInfo } = useStore('user');
export const readStudentFinishH5 = (paramsStr = '') => {
  // unimpParams	为1代表uni
  // homeworkType	类型：1朗读 2背诵
  // aid	文章id（资源id）
  // ut	学生朗读次数
  // rt	老师要求的朗读次数
  // wid	webId
  // pas	段落
  const wid = userInfo.value.wid;
  const params = paramsStr || `&homeworkType=1&aid=1&ut=2&rt=2&wid=${wid}&pas=2`;
  goToH5(`${studentFinishH5Url}${params}`);
};

// 课文朗读作答报告（学生端、教师端）
export const readStudentAnswerReportH5 = (paramsStr = '') => {
  // fileId	朗读测评文件id
  // homeworkType	类型：1朗读 2背诵
  // aid	文章id（资源id）
  // ut	学生朗读次数
  // rt	老师要求的朗读次数
  // c	canRead
  // wid	webId
  // pas	段落
  const wid = userInfo.value.wid;
  const params = paramsStr || `&fileId=5177814&homeworkType=1&aid=1&ut=2&rt=2&wid=${wid}&pas=2`;
  goToH5(`${studentAnswerReportH5Url}${params}`);
};

// 选择经典诵读资源（教师端）通信方式
export const classicReadingResourceSelectH5 = (paramsStr = '') => {
  const params = paramsStr || `&modular=3`;
  goToH5(`${classicReadingResourceSelectH5Url}${params}`);
};
// 完成经典诵读作业（学生端）通信方式
export const classicReadingStuFinishH5 = (paramsStr = '') => {
  readStudentFinishH5(paramsStr);
};
// 经典诵读作答报告（学生端、教师端）通信方式
export const classicReadingStuAnswerReportH5 = (paramsStr = '') => {
  readStudentAnswerReportH5(paramsStr);
};

// 选择英语读测评资源（教师端）通信方式
export const englishReadingResourceSelectH5 = (paramsStr = '') => {
  goToH5(`${englishReadingResourceSelectH5Url}${paramsStr}`);
};
// 英语读测评完成作业（学生端）通信方式
export const englishReadingStuFinishH5 = (paramsStr = '') => {
  const wid = userInfo.value.wid;
  const params = paramsStr || `&aId=1&hwType=2&wid=${wid}`;
  // aId: 文章id；hwType：作业类型，有值时代表在完成作业；wid：用户webid
  goToH5(`${englishReadingStuFinishH5Url}${params}`);
};
// 英语读测评跟读作答报告（学生端、教师端）通信方式
export const englishReadingStuReadResultH5 = (paramsStr = '') => {
  // rId: 跟读测评报告id；hwType：作业类型，有值时代表在完成作业；wid：用户webid；
  goToH5(`${englishReadingStuReadResultH5Url}${paramsStr}`);
};
// 英语读测评背诵作答报告（学生端、教师端）通信方式
export const englishReadingStuReciteResultH5 = (paramsStr = '') => {
  // rId: 跟读测评报告id；hwType：作业类型，有值时代表在完成作业；wid：用户webid；
  goToH5(`${englishReadingStuReciteResultH5Url}${paramsStr}`);
};

// 温故与知新选择资源（教师端）通信方式
export const wgyzxResourceSelectH5 = (paramsStr = '') => {
  // 暂不传参
  goToH5(`${wgyzxResourceSelectH5Url}${paramsStr}`);
};
// 温故与知新完成作业（学生端）通信方式
export const evaluationFinishH5 = (paramsStr = '') => {
  /**
   * pId：试卷id；
   * aType：应用类型（1 在线测评、2 暑假作业）；
   * ccId：目录集合id；
   * cItemId：章节id；
   * eType：入口类型（1定制化进入，2暑假作业，3众享阅读）
   */
  goToH5(`${evaluationFinishH5URL}${paramsStr}`);
};
// 温故与知新作答报告（学生端、教师端）通信方式
export const evaluationAnswerReportH5 = (paramsStr = '') => {
  /**
   * pId：试卷id；
   * aType：应用类型（1 在线测评、2 暑假作业）；
   * ccId：目录集合id；
   * uId：userId；
   * uType：用户类型userType；
   * eType：入口类型（1定制化进入，2暑假作业，3众享阅读）
   */
  goToH5(`${evaluationAnswerReportH5URL}${paramsStr}`);
};
// 温故与知新班级数据（教师端）通信方式
export const evaluationUnitDataH5 = (paramsStr = '') => {
  /**
   * cId：班级id；
   * gc：年级编码；
   * sc：学科编码；
   * vc：版本编码；
   * stc：stageCode 阶段（上/下学期、寒暑假）
   * sType：场景类型，默认暑假作业
   */
  goToH5(`${evaluationUnitDataH5Url}${paramsStr}`);
};

// 寒假作业计划详情页
export const holidayPlanDeatilH5 = (paramsStr = '') => {
  // 传参待定
  goToH5(`${holidayPlanDeatilH5Url}${paramsStr}`);
};
// 温故与知新选择资源（教师端）通信方式
export const evaluationResourceSelectH5 = (paramsStr = '') => {
  // &activityId=97
  goToH5(`${evaluationResourceSelectH5Url}${paramsStr}`);
};

// 学生加入班级（学生端）
export const stuAddClassH5 = (paramsStr = '') => {
  // 传参待定
  goToH5(`${stuAddClassH5Url}${paramsStr}`);
};
// 投诉页
export const complaintH5 = (paramsStr = '') => {
  // 传参待定
  goToH5(`${complaintH5Url}${paramsStr}`);
};

// 选择数学课时练资源（教师端）通信方式
export const mathClassPracticeResourceSelectH5 = (paramsStr = '') => {
  goToH5(`${mathClassPracticeResourceSelectH5Url}${paramsStr}`);
};
// 选择天天练资源（教师端）通信方式
export const dailyPracticeResourceSelectH5 = (paramsStr = '') => {
  // 没有传参
  goToH5(`${dailyPracticeResourceSelectH5Url}${paramsStr}`);
};
// 数学课时练、天天练去做题页面（学生端、教师端）通信方式
export const mathClassPracticeStuFinishH5 = (paramsStr = '') => {
  // pid：试卷id 拼接&pid=27835
  goToH5(`${mathClassPracticeStuFinishH5Url}${paramsStr}`);
};
// 数学课时练、天天练去作答报告页面（学生端查看自己）通信方式
export const mathClassPracticeSelfAnswerReportH5 = (paramsStr = '') => {
  // pid：试卷id  title：标题  拼接&pid=27835&title=字母表示数与整式的加减（人教版)
  goToH5(`${mathClassPracticeSelfAnswerReportH5Url}${paramsStr}`);
};
// 数学课时练、天天练去作答报告页面（学生端、教师端）通信方式
export const mathClassPracticeStuAnswerReportH5 = (paramsStr = '') => {
  // pid：试卷id  title：标题  拼接&pid=27835&title=字母表示数与整式的加减（人教版)
  goToH5(`${mathClassPracticeStuAnswerReportH5Url}${paramsStr}`);
};

// 插件方式
export const goToH5Plug = (h5Url = '') => {
  uniToAppPluginBridge.gotoWebView({
    h5Url
  });
};
export const readResourceSelectH5Plugs = (paramsStr = '') => {
  // #ifdef APP-PLUS
  const params = paramsStr || `&modular=2`;
  goToH5Plug(`${resourceSelectH5Url}${params}`);
  // #endif
};
export const classicReadingSelectH5Plugs = (paramsStr = '') => {
  // #ifdef APP-PLUS
  const params = paramsStr || `&modular=3`;
  goToH5Plug(`${classicReadingResourceSelectH5Url}${params}`);
  // #endif
};

export const readStudentFinishH5Plugs = (paramsStr = '') => {
  // #ifdef APP-PLUS
  const wid = userInfo.value.wid;
  const params = paramsStr || `&aid=1&ut=2&rt=2&wid=${wid}&pas=2`;
  goToH5Plug(`${studentFinishH5Url}${params}`);
  // #endif
};

export const englishReadingSelectH5Plugs = (paramsStr = '') => {
  // #ifdef APP-PLUS
  goToH5Plug(`${englishReadingResourceSelectH5Url}${paramsStr}`);
  // #endif
};

export const mathClassPracticeResourceSelectH5Plugs = (paramsStr = '') => {
  // #ifdef APP-PLUS
  goToH5Plug(`${mathClassPracticeResourceSelectH5Url}${paramsStr}`);
  // #endif
};

// 成绩 start
export const teaScoreReportH5 = (paramsStr = '') => {
  // examId 考试id
  // classId 班级id
  goToH5(`${teaScoreReportH5Url}${paramsStr}`);
};

export const noReceivedSmsStusH5 = (paramsStr = '') => {
  // examId 考试id
  // classId 班级id
  console.log(`${noReceivedSmsStusH5Url}${paramsStr}`);
  goToH5(`${noReceivedSmsStusH5Url}${paramsStr}`);
};
// 成绩 end

// 会员中心--订购产品--三方支付
export const orderProductPayH5 = (paramsStr = '') => {
  // examId 考试id
  // classId 班级id
  console.log(`${orderProductPayH5Url}${paramsStr}`);
  goToH5(`${orderProductPayH5Url}${paramsStr}`);
};
// // 会员中心--订购产品--运营商支付
export const orderProductPhoneH5 = (paramsStr = '') => {
  goToH5(`${orderProductPhoneH5Url}${paramsStr}`);
};

// 会员中心--会员权益
export const orderRightsH5 = (paramsStr = '') => {
  goToH5(`${orderRightsH5Url}${paramsStr}`);
};

// 班级管理--班级成员
export const classStuListH5 = (paramsStr = '') => {
  goToH5(`${classStuListH5Url}${paramsStr}`);
};

export const newTeaScoreChartH5 = (paramsStr = '') => {
  goToH5(`${newTeaScoreChartH5Url}${paramsStr}`);
};
