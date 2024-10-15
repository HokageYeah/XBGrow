// uni-app 切换前后台通知
const uniToNatLifeCycle = 'uniToNat-LifeCycle';
// 图片附件
const uniToNatImageSelect = 'uniToNat-ImageSelect'; // uni吊起原生图片选择
const uniToNatImagePreview = 'uniToNat-ImagePreview'; // uni吊起原生图片预览

const natToUniImageSelected = 'natToUni-ImageSelected'; // native回传给uni已经选择的图片
const natToUniImagePreview = 'natToUni-ImagePreview'; // native回传给uni已经操作预览的图片

// 视频附件
const uniToNatVideoSelect = 'uniToNat-VideoSelect'; // uni吊起原生视频选择
const uniToNatVideoPlay = 'uniToNat-VideoPlay'; // uni吊起原生视频播放

const natToUniVideoSelected = 'natToUni-VideoSelected'; // native回传给uni已经选择的视频
const natToUniVideoPlay = 'natToUni-VideoPlay'; // native回传给uni已经操作播放视频

// 音频附件
const natToUniAudioSelected = 'natToUni-AudioSelected'; // native回传给uni已经选择的音频

// 音频录制权限隐私弹框
const uniToNatApplyPermission = 'uniToNat-ApplyPermission'; // uni吊起音频录制权限隐私弹框

// 文档附件
const uniToNatFilesSelect = 'uniToNat-FilesSelect'; // uni吊起原生文档选择
const uniToNatFilesOpen = 'uniToNat-FilesOpen'; // uni吊起原生文档打开
const uniToNatLogin = 'uniToNat-ToLogin'; // uni吊起原生登录
const natToUniSyncLoginInfo = 'natToUni-SyncLoginInfo'; // 原生登录完成后主动调用uni

const natToUniFilesSelected = 'natToUni-FilesSelected'; // native回传给uni已经选择的文件

// 附件上传
const uniToNatFilesUpload = 'uniToNat-FilesUpload'; // uni吊起原生文件上传
const natToUniFilesUpload = 'natToUni-FilesUpload'; // 原生文件上传后的回掉

// 图片编辑调用
const uniToNatImageEditing = 'uniToNat-GotoOpenImg'; // uni吊起原生图片编辑
const natToUniImageEditing = 'natToUni-ImageEditing'; // native回传给uni已经操作图片编辑的图片
const natToUniEditedImg = 'natToUni-EditedImg'; // native回传给uni已经操作图片编辑的图片

// Uni统一调启原生H5的通信方法
const uniToNatBridgeToH5 = 'uniToNat-BridgeToH5'; // Uni统一调启原生H5的通信方法

// Uni通知反馈原生方法
const uniToNatCheckNotice = 'uniToNat-CheckNotice'; // Uni通知反馈原生方法

const natToUniBridgeToH5 = 'natToUni-BridgeToH5'; // ative回传给uni H5调用后的通信方法

// uni到原生通知选微信文件 uniToNat-chooseWxFile：{"fileType":1,"chooseNum":8}
const uniToNatChooseWxFile = 'uniToNat-chooseWxFile';
// 原生到uni发送微信文件选择结果 natToUni-onChoosedWxFile：{"fileType":1，"fileIdentify":[str, str]}
const natToUniOnChoosedWxFile = 'natToUni-onChoosedWxFile';
// uni通知App分享小程序到微信
const uniToNatShareWXMP = 'uniToNat-ShareWXMP';
// uni通知App分享文件到微信
const uniToNatShare = 'uniToNat-Share';
// uni通知原生切换底部tabbar（班级圈模块）
const uniToNatToNatTab = 'uniToNat-ToNatTab';

const uniToNatToPage = 'uniToNat-ToPage'; // uni吊起原生页面
const uniToNatToggleRefresh = 'uniToNat-ToggleRefresh'; // uni通知App刷新原生页面
const uniToNatCloseUnimp = 'closeUniMP'; // uni吊起原生关闭当前uni-app模块

// 调用原生的日志上传桥接（路由跳转）
const uniToNatAccessLog = 'uniToNat-AccessLog';
// 调用原生的日志上传桥接（点击事件）
const uniToNatClickLog = 'uniToNat-ClickLog';

export {
  // uni to nav 协议
  // 切换前后台通知
  uniToNatLifeCycle,
  // 图片
  uniToNatImageSelect,
  uniToNatImagePreview,
  // 视频
  uniToNatVideoSelect,
  uniToNatVideoPlay,
  // 文件
  uniToNatFilesSelect,
  uniToNatFilesOpen,
  uniToNatLogin,
  // 音频录制隐私谈唇膏
  uniToNatApplyPermission,
  // uni到原生通知选微信文件
  uniToNatChooseWxFile,
  // uni通知原生切换底部tabbar（班级圈模块）
  uniToNatToNatTab,
  // 调用原生的日志上传桥接（路由跳转）
  uniToNatAccessLog,
  // 调用原生的日志上传桥接（点击事件）
  uniToNatClickLog,

  // nav to uni 协议
  // 图片
  natToUniImageSelected,
  natToUniImagePreview,
  // 视频
  natToUniVideoSelected,
  natToUniVideoPlay,
  // 音频
  natToUniAudioSelected,
  // 文件
  natToUniFilesSelected,
  // 附件上传
  uniToNatFilesUpload,
  natToUniFilesUpload,
  // 图片编辑
  uniToNatImageEditing,
  natToUniImageEditing,
  natToUniEditedImg,
  // 原生到uni发送微信文件选择结果
  natToUniOnChoosedWxFile,
  // 通知反馈
  uniToNatCheckNotice,
  // 吊起原生H5统一方法
  uniToNatBridgeToH5,
  natToUniBridgeToH5,
  natToUniSyncLoginInfo,
  uniToNatShareWXMP,
  uniToNatShare,
  uniToNatToPage,
  uniToNatToggleRefresh,
  uniToNatCloseUnimp
};
