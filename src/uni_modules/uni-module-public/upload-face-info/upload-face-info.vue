<template>
  <view style="background-color: #f9f9f9">
    <view class="headPicDiv">
      <view @tap="showUploadPopup">
        <view class="headPortrait">
          <image
            mode="widthFix"
            style="width: 100%; object-fit: cover"
            :src="
              bgUserInfo.headPortraitUrl || 'https://pic.xxt.cn/n/csc/material/kaoqindefault.png'
            "
          />
        </view>
        <view class="up-button">
          <tui-button type="green" shape="circle">
            {{ bgUserInfo.headPortraitUrl ? '重新采集' : '采集学生人脸' }}
          </tui-button>
        </view>
      </view>
      <view class="up-example" @tap="showExample">
        <tui-row>
          <tui-col :span="12"> 人脸拍摄示范 </tui-col>
          <tui-col :span="12">
            <view style="text-align: right; font-size: 12px; color: #666"> 立即查看> </view>
          </tui-col>
        </tui-row>
      </view>
    </view>
    <view class="other-info">
      <view>照片要求</view>
      <view>
        <view
          >1.脸部清晰，无口罩、墨镜等遮盖物；男生、女生
          <span class="attention">刘海梳到侧面，露出额头</span>；尽量摘下近视眼镜，
          <span class="attention">避免镜片反光</span>；
        </view>
        <view>2.照片不宜逆光、曝光过度、过度美颜；</view>
        <view>3.照片需近期拍摄，可快速辨认。</view>
      </view>
    </view>
    <tui-modal
      :show="showExamplePop"
      mask-closable
      custom
      width="90%"
      @click="hideExample"
      @cancel="hideExample"
    >
      <view style="text-align: center">示例</view>
      <image
        mode="widthFix"
        style="width: 100%; object-fit: cover"
        src="https://pic.xxt.cn/n/csc/material/collectdemo.png"
      />
    </tui-modal>
    <tui-bottom-popup :height="228" :show="popupShow" @close="hiddenPopup">
      <view style="position: relative">
        <view class="popup-main">
          <view style="text-align: center" @click="chooseImage(1)">
            <image
              src="https://pic.xxt.cn/n/csc/material/picture-icon.png"
              mode="aspectFit"
              class="picture-view"
            ></image>
            <view class="picture-text">手机照片</view>
          </view>
          <!-- #ifdef MP-WEIXIN -->
          <view style="text-align: center" @click="chooseImage(2)">
            <image
              src="https://pic.xxt.cn/n/csc/material/photo-icon.png"
              mode="aspectFit"
              class="picture-view"
            ></image>
            <view class="picture-text">拍照</view>
          </view>
          <!-- #endif -->
        </view>
        <view class="divider-col"></view>
      </view>
    </tui-bottom-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useHandleChooseFiles, { chooseAppAlbum } from './handleChooseFilesHooks';
import { uploadFilePromise, uploadFilesCallBack } from '@/uni-module-common/http';
import { getCommunicationData } from '@/uni-module-common/utils/uniToH5ByWebview';
import { dealLoginSuccessResponse } from '@/uni-module-common/hooks/useLoginHooks';
import { dealWithImage } from '@/uni-module-common/components/xxt-components/xxt-file-submit/useChooseMedia';

const { userInfo, getInfo } = useStore('user');
const instance: any = getCurrentInstance();
const { imageAry, updateImgAry, clearAllFilesCache, clearOtherData, uploadAllFilesUni }: any =
  useStore('fileUpload');
const { updateUploadUrlApi, updateMustFilesType }: any = useStore('fileUpload');

const router = useRouter();
const bgUserInfo = ref<any>({});
const showExamplePop = ref(false);
const curUserId = ref(0);
const maxImgNumber = 1;
const fileObj: any = {
  isUploadAllFilesUni: true,
  fileIdentity: ''
};
// 上传地址的url
updateUploadUrlApi('/zuul/circle/upload-file');
// 必须上传的文件
updateMustFilesType([]);
const showExample = () => {
  showExamplePop.value = true;
};
const hideExample = () => {
  showExamplePop.value = false;
};
const popupShow = ref(false);

function hiddenPopup() {
  popupShow.value = false;
}

function showUploadPopup() {
  popupShow.value = true;
}

const bgGetUserInfo = (schoolId: number, userId: number, userType: number) => {
  instance?.proxy
    ?.$uniAjax({
      url: '/wisdom/bg/getUserInfo',
      query: { schoolId, userId, userType },
      method: 'GET',
      custom: {
        showLoading: true
      }
    })
    .then((res: any) => {
      bgUserInfo.value = res;
      uni.setNavigationBarTitle({
        title: res.userName
      });
    });
};
const handleQueryData = (resData: string) => {
  let data: any = {};
  //   resData = '{"msg":"pay-接口获取-哦-*****","productId":34,"marketingType":3,"qrcodeFlag":2}'; // todo 待删
  data = JSON.parse(resData);
  if (data.loginToken) {
    const url = '/login-v2/login/login-by-ticket3';
    const params = { webId: data.webId, token: data.loginToken };
    instance?.proxy
      ?.$uniAjax({
        url,
        data: params,
        method: 'POST',
        custom: {
          showLoading: true
        }
      })
      .then((loginData: any) => {
        if (loginData.loginResult.code === 101) {
          getInfo({}, '');
          dealLoginSuccessResponse(loginData);
          // const { schoolId, userId } = userInfo.value;
          curUserId.value = data.userId;
          bgGetUserInfo(data.schoolId, curUserId.value, 1);
        }
      });
  } else {
    const { schoolId, userId, stuId } = userInfo.value;
    curUserId.value = stuId || userId || 0;
    bgGetUserInfo(parseInt(schoolId || ''), curUserId.value, 1);
  }
};
onShow(async () => {
  const pagearr = getCurrentPages(); // 获取应用页面栈
  const currentPage: any = pagearr[pagearr.length - 1]; // 获取当前页面信息
  const options = currentPage.options;
  const uni2H5Token = options?.UNI_To_H5_Token || '';
  const logined = options?.UNI_To_H5_Logined || '';
  // 从h5页面（xxt-webview-to-h5）中往上传人脸照跳转的时候，需要获取从h5传过来的token，然后调用接口获取用户信息
  if (uni2H5Token) {
    const resData = await getCommunicationData(uni2H5Token, logined === 'true');
    handleQueryData(JSON.stringify(resData.content));
  } else {
    const { schoolId, userId, stuId } = userInfo.value;
    curUserId.value = stuId || userId || 0;
    bgGetUserInfo(parseInt(schoolId || ''), curUserId.value, 1);
  }
});

// 保存标准照
function upload(res: any) {
  const url = '/zuul/wisdom/group/uploadUserHeadPortrait';
  const tempFilePaths = res.tempFilePaths;
  const formData = {
    type: 2,
    cardNo: bgUserInfo.value.cardNo || '',
    verify: 1,
    userType: 1,
    userId: curUserId.value
  };

  uploadFilePromise(tempFilePaths[0], '', 1, 1, formData, url).then((res: any) => {
    const response = JSON.parse(res);
    if (parseInt(response.resultCode) === 0) {
      uni.showToast({
        title: response.resultMsg,
        icon: 'error'
      });
    } else {
      uni.showToast({
        title: '上传成功',
        icon: 'success'
      });
      bgUserInfo.value.headPortraitUrl = response.fileUrl;
    }
  });
}
const doSubmit = async (fileIdentity: string) => {
  const data: any = {
    fileIdentity
  };
  const res = await instance?.proxy?.$uniAjax.post({
    url: '/circle/album/upload-facial-photo',
    data,
    custom: {
      showLoading: true
    }
  });
  bgUserInfo.value.headPortraitUrl = res.url;
  const eventChanne = instance?.proxy.getOpenerEventChannel();
  eventChanne.emit('uploadStandardPhotoSuccess', { headPortraitUrl: res.url });
  // router.back();
};
/**
 * 监听上传回调事件
 */
uni.$on(uploadFilesCallBack, (data: { code: number; fileIdentity: string }) => {
  if (data.code === 1 || data.code === 3) {
    // 附件上传成功
    console.log('监听上传回调事件----uploadFilesCallBack---', data);
    doSubmit(data.fileIdentity);
  } else if (data.code === 2) {
    // 附件上传失败
    uni.showToast({ title: '附件上传失败，请稍候重试', icon: 'none' });
  }
});

function chooseImage(type: number) {
  popupShow.value = false;
  // 每次选择前清空图片
  clearAllFilesCache();
  if (type === 1) {
    // 选择照片
    // #ifdef MP-WEIXIN
    uni.chooseMedia({
      count: maxImgNumber,
      mediaType: ['image'],
      sizeType: ['original'],
      sourceType: ['album'], // 从相册选择
      success(res) {
        console.log('chooseImage----imgary---', res);
        dealWithImage(res, (imgary: any) => {
          console.log('dealWithImage----imgary---', imgary);
          updateImgAry([...imageAry!.value!, ...imgary]);
          // 先上传附件， 然后监听附件的id
          uploadAllFilesUni();
        });
      }
    });
    // #endif
    // #ifdef APP-PLUS || APP
    chooseAppAlbum(maxImgNumber);
    // #endif
  } else {
    // 拍照
    uni.chooseMedia({
      count: maxImgNumber,
      mediaType: ['image'],
      sizeType: ['original'],
      sourceType: ['camera'],
      success(res) {
        dealWithImage(res, (imgary: any) => {
          updateImgAry([...imageAry!.value!, ...imgary]);
          // 先上传附件， 然后监听附件的id
          uploadAllFilesUni();
        });
      }
    });
  }
}
// 处理原声附件上传回掉的一系列逻辑函数hooks
useHandleChooseFiles(fileObj);
</script>

<style lang="scss" scoped>
.headPicDiv {
  margin: 20px;
  border-radius: 10px;
  background: #e7f6ec;
}
.headPortrait {
  padding: 10px 25%;
  width: 50%;
}
.up-button {
  margin: 10px 25%;
  width: 50%;
}
.up-example {
  border-radius: 0 0 10px 10px;
  height: 60px;
  background: linear-gradient(49deg, #cbf0cf 0%, #e6fde3 100%);
  line-height: 60px;
}
.up-example :deep(.tui-col) {
  padding: 0 10px;
}
.attention {
  color: #d84135;
}
.other-info {
  margin: 0 20px;
}
.other-info > view:nth-child(1) {
  line-height: 42px;
  font-weight: bolder;
  font-size: 16px;
}
.other-info > view:nth-child(2) {
  padding: 10px;
  border-radius: 10px;
  background: #fff;
  line-height: 24px;
  font-size: 14px;
}
.popup-main {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 228rpx;
  .picture-view {
    margin: auto 0;
    width: 80rpx;
    height: 80rpx;
  }
  .picture-text {
    margin-top: 14rpx;
    font-size: 24rpx;
    color: #222;
  }
}
</style>
