<template>
  <!-- pages/mine/switch-role/switch-role.wxml -->
  <view class="container">
    <view
      v-for="(item, index) in roles"
      :key="index"
      :class="index === activeIndex ? 'roles roles-active' : 'roles'"
      :data-index="index"
      @tap="changeRole"
    >
      <view v-if="index === activeIndex" class="active-role">当前身份</view>

      <view v-if="item.jut === 0" class="role-info">
        <image :src="`${$cdn}/nb/m/uni-notice/img/user_teacher_img.png`"></image>
        <view>老师</view>
      </view>

      <view v-if="item.jut === 1" class="role-info">
        <image :src="`${$cdn}/nb/m/uni-notice/img/user_select_img.png`"></image>
        <view>家长</view>
      </view>

      <view v-if="item.jut === -1" class="role-info">
        <image :src="`${$cdn}/nb/m/uni-notice/img/user_unselect_img.png`"></image>
        <view></view>
      </view>

      <view class="role-right">
        <view class="user-name">{{ item.userName }}</view>
        <view v-if="item.jut === 0" class="school-info">{{
          item.schoolName ? item.schoolName : ''
        }}</view>
        <view v-if="item.jut === 1" class="school-info">
          {{ item.schoolName ? item.schoolName : '' }}
          {{ item.xxtGradeName ? item.xxtGradeName : '' }}
          {{ item.xinzxClassName ? item.xinzxClassName : '' }}
        </view>
        <view v-if="item.jut === -1" class="school-info">网站注册账号</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import {
  getWxUserInfoAPI,
  postLoginOutAPI,
  postLoginSelectAPI,
  saveWxUserInfoAPI
} from './services/login';
import {
  dealLoginOutToken,
  dealLoginSuccessResponse
} from '@/uni-module-common/hooks/useLoginHooks';
import { $cdn, appModuleConfig } from '@/uni-module-common/config';
const roles: any = ref([]);
const router = useRouter();
const userInfo = ref({
  nickName: null,
  avatarUrl: null
});
const activeIndex = ref(-1);
const app = getApp();
const { accountList, isLogin, userInfo: storeUserInfo } = useStore('user');
onShow(() => {
  // app.globalData
  console.log('app.globalData!.accountList---', accountList, isLogin);
  console.log('app.globalData!.isLogin---', isLogin.value);
  roles.value = accountList.value;
  if (!isLogin.value) {
    const info = JSON.parse(uni.getStorageSync('userWxTemp'));
    userInfo.value.nickName = info.nickName;
    userInfo.value.avatarUrl = info.avatarUrl;
    uni.removeStorageSync('userWxTemp');
  } else {
    console.log('app.globalData!.storeUserInfo---', storeUserInfo);
    const webId = storeUserInfo.value.wid;
    for (let i = 0; i < roles.value.length; i++) {
      if (webId === roles.value[i].webId) {
        activeIndex.value = i;
        break;
      }
    }
  }
});

const loginOut = async () => {
  try {
    const res = await postLoginOutAPI({ entry: appModuleConfig.entry });
    console.log('loginout----', res);
    // 退出登录需要清空user store内的用户信息 以及用户的多身份信息
    dealLoginOutToken();
  } catch (error) {}

  // uniRequest({
  //   url: '/login-v2/login/login-out',
  //   method: 'GET',
  //   data: {
  //     entry: app.globalData!.entry
  //   },
  //   success(res) {
  //     app.globalData!.loginFlag = false;
  //     app.globalData!.userNowRoleInfo = {
  //       // 用户标识
  //       accountId: null,
  //       // 角色 -1 网站注册身份  0 教师  1 学生  2 家长  3 管理员
  //       userRole: null,
  //       // webId标识身份
  //       webId: null,
  //       // 用户姓名
  //       userName: null,
  //       // 用户id-- 网站注册身份为 accountId   老师为teacherId  学生为studentId
  //       userId: null,
  //       // 用户班级  学生身份时存在
  //       classInfo: {
  //         classId: null,
  //         className: null
  //       },
  //       // 学校信息  网站注册身份时为空
  //       schoolInfo: {
  //         schoolId: null,
  //         schoolName: null
  //       },
  //       gradeInfo: {
  //         gradeId: null,
  //         gradeName: null,
  //         gradeCode: null
  //       },
  //       termCode: null
  //     };
  //     app.globalData!.userInfoList = [];
  //     app.globalData!.isMore = false;
  //     app.globalData!.deafultGradeTerm = {
  //       grade: {
  //         code: 21,
  //         desc: 'L1'
  //       },
  //       term: {
  //         code: 1,
  //         desc: '上学期'
  //       }
  //     };
  //     uni.removeStorageSync('userOtherInfo');
  //     uni.removeStorageSync('userInfo');
  //     uni.removeStorageSync('saveStateCookie');
  //     uni.removeStorageSync('cookieMap');
  //   },
  //   fail(e) {
  //     console.log(e);
  //   }
  // });
};
// 所以在这个地方添加逻辑如果没有newUrl（即重定向的地址）则回退到当前页面。
function loginNavigateBack() {
  // 获取来的页面
  uni.navigateBack({
    delta: 2,
    animationType: 'pop-out',
    success: (res: any) => {
      console.log('navigateBack---success----', res);
    },
    fail(e) {
      console.error('navigateBack---fail----', e);
    }
  });
}
const getUserOtherInfo = async () => {
  let newUrl = '';
  try {
    const data: any = await getWxUserInfoAPI();
    console.log('getUserOtherInfo----', data);
    if (data.nickname && data.avatarUrl) {
      console.log('getUserOtherInfo----nickName---');
      // todo 处理登录
      const pages = getCurrentPages();
      const currPage: any = pages[pages.length - 1];
      newUrl = decodeURIComponent(currPage.options.redictUrl);
      console.log(newUrl);
      // 这个redirectTo会有问题，如果是分享的页面未登录跳转到登录页面后，在重定向到指定的当前页面，会产生两个一摸一样的页面
      // 所以在这个地方添加逻辑如果没有newUrl（即重定向的地址）则回退到当前页面。
      if (!newUrl) {
        loginNavigateBack();
        return;
      }

      uni.redirectTo({
        url: newUrl,
        fail(e) {
          console.log(e);
          uni.switchTab({
            url: newUrl
          });
        }
      });
    } else {
      const saveRes: any = await saveWxUserInfoAPI({
        nickname: userInfo.value.nickName,
        avatar: userInfo.value.avatarUrl,
        entry: appModuleConfig.entry
      });
      const pages = getCurrentPages();
      const currPage: any = pages[pages.length - 1];
      console.log('saveWxUserInfoAPI-----currPage----', currPage);
      newUrl = decodeURIComponent(currPage.options.redictUrl);
      console.log('saveWxUserInfoAPI-----newUrl----', newUrl);
      console.log('saveWxUserInfoAPI-----saveRes----', saveRes);

      const data = saveRes;
      if (data.content === 'success') {
        console.log('用户信息保存成功');
        // 这个redirectTo会有问题，如果是分享的页面未登录跳转到登录页面后，在重定向到指定的当前页面，会产生两个一摸一样的页面
        // 所以在这个地方添加逻辑如果没有newUrl（即重定向的地址）则回退到当前页面。
        if (!newUrl) {
          loginNavigateBack();
          return;
        }
        uni.redirectTo({
          url: newUrl,
          success(res) {
            console.log('redirectTo---success----', res);
          },
          fail(e) {
            console.error('redirectTo---fail----', e);
            uni.switchTab({
              url: newUrl
            });
          }
        });
      } else {
        loginOut();
        uni.showToast({
          title: '用户信息保存失败，请重新登录',
          icon: 'none'
        });
        router.replace({
          path: `./login?redictUrl=${newUrl}`
        });
        // uni.redirectTo({
        //   url: `../login/login?redictUrl=${newUrl}`
        // });
      }
    }
  } catch (error) {
    console.log(error);
    loginOut();
    uni.showToast({
      title: '用户信息保存失败，请重新登录',
      icon: 'none'
    });
    uni.redirectTo({
      url: `../login/login?redictUrl=${newUrl}`
    });
  }
};

const changeRole = async (e: any) => {
  const flag = isLogin.value;
  console.log('changeRole----flag----', flag);
  const index = e.currentTarget.dataset.index;
  console.log('changeRole----index----', index);
  const userNowRoleInfo = roles.value[index];
  console.log('changeRole----userNowRoleInfo----', userNowRoleInfo);
  activeIndex.value = index;
  // uniEvent('切换身份', '切换身份', {
  //   accountId: userNowRoleInfo.accountId,
  //   userId: userNowRoleInfo.userId,
  //   userRole: userNowRoleInfo.jut,
  //   webId: userNowRoleInfo.webId
  // });
  const params = {
    entry: appModuleConfig.entry,
    webId: userNowRoleInfo.webId
  };
  try {
    const data: any = await postLoginSelectAPI(params);

    if (data.loginResult.code === 101) {
      dealLoginSuccessResponse(data);
      // 多身份选择完成， user store中显示登录
      isLogin.value = true;
      const pages = getCurrentPages();
      const currPage: any = pages[pages.length - 1];
      const newUrl = decodeURIComponent(currPage.options.redictUrl);
      console.log('changeRole----currPage----', currPage);
      console.log('changeRole----newUrl----', newUrl);
      console.log('changeRole----userInfo----', isLogin.value);
      // 处理头像
      if (flag) {
        // 这个redirectTo会有问题，如果是分享的页面未登录跳转到登录页面后，在重定向到指定的当前页面，会产生两个一摸一样的页面
        // 所以在这个地方添加逻辑如果没有newUrl（即重定向的地址）则回退到当前页面。
        if (!newUrl) {
          loginNavigateBack();
          return;
        }
        // todo
        uni.redirectTo({
          url: newUrl,
          fail(e) {
            console.log('redirectTo---fial----', e);
            uni.switchTab({
              url: newUrl
            });
          }
        });
      } else {
        getUserOtherInfo();
      }
    }
  } catch (error) {
    console.log(error);
    uni.showToast({
      title: '登录异常',
      icon: 'none'
    });
  }
  // uniRequest({
  //   url: '/login-v2/login/user-select-login',
  //   data: {
  //     entry: app.globalData!.entry,
  //     webId: userNowRoleInfo.webId
  //   },
  //   method: 'POST',
  //   success(res) {
  //     console.log(res);
  //     const data = res.data;
  //     if (data.loginResult.code === 101) {
  //       dealLoginSuccessResponse(res);
  //       uni.setStorageSync(
  //         'userOtherInfo',
  //         JSON.stringify({
  //           loginFlag: true,
  //           isMore: true
  //         })
  //       );
  //       const pages = getCurrentPages();
  //       const currPage = pages[pages.length - 1];
  //       const newUrl = decodeURIComponent(currPage.options.redictUrl);
  //       console.log(currPage);
  //       console.log(newUrl);

  //       // 处理头像
  //       if (flag) {
  //         // todo
  //         uni.redirectTo({
  //           url: newUrl,
  //           fail(e) {
  //             uni.switchTab({
  //               url: newUrl
  //             });
  //           }
  //         });
  //       } else {
  //         getUserOtherInfo();
  //       }
  //     }
  //   },
  //   fail(e) {
  //     console.log(e);
  //     uni.showToast({
  //       title: '登录异常',
  //       icon: 'none'
  //     });
  //   }
  // });

  // const data = await postLoginSelectAPI(params);
  // console.log('登录参数', params);
  // console.log('身份选择登录', data);

  // if (data) {
  //   console.log('结果数据');
  //   console.log(data);
  //   if (data.loginResult.code === 101) {
  //     // 保存cookie信息
  //     uni.setStorageSync(
  //       'userOtherInfo',
  //       JSON.stringify({
  //         loginFlag: true,
  //         isMore: true
  //       })
  //     );
  //     const pages = getCurrentPages();
  //     const currPage = pages[pages.length - 1];
  //     const newUrl = decodeURIComponent(currPage.options.redictUrl);
  //     console.log(currPage);
  //     console.log(newUrl);
  //     console.log(flag, 'flag');
  //     // 处理头像
  //     if (flag) {
  //       // todo
  //       uni.redirectTo({
  //         url: newUrl,
  //         fail(e) {
  //           uni.switchTab({
  //             url: newUrl
  //           });
  //         }
  //       });
  //     } else {
  //       getUserOtherInfo();
  //     }
  //   }
  // }
};
</script>

<style scoped lang="scss">
.container {
  /* background-color: #F6F6F6; */
  /* width: 100%; */
  @include normalContainer();
}
.roles {
  overflow: hidden;
  margin-left: 34rpx;
  margin-right: 34rpx;
  margin-top: 50rpx;
  /* border: 2rpx solid #ccc; */
  border-radius: 21rpx;
  height: 97px;
  background-color: #fff;
}
.active-role {
  float: right;
  margin-top: 42rpx;
  padding: 8rpx 24rpx;
  border-top-left-radius: 30rpx;
  border-bottom-left-radius: 30rpx;
  background-color: #4ad975 !important;
  font-size: 28rpx;
  color: white;
}
.role-info {
  float: left;
  margin-left: 40rpx;
  margin-right: 40rpx;
  margin-top: 40rpx;
  margin-bottom: 20rpx;
  text-align: center;
  font-size: 28rpx;
}
.role-right {
  align-items: center;
  margin-right: 16px;
  margin-top: 18px;
  height: 100%;
  vertical-align: middle;
  font-size: 28rpx;
}
.role-right view {
  padding: 4rpx 0rpx;
}
.role-info image {
  width: 44px;
  height: 44px;
}
.role-info view {
  height: 28rpx;
  font-size: 29rpx;
  color: #acacac;
}
.user-name {
  font-weight: bold;
  font-size: 16px;
  color: #181818;
}
.school-info {
  margin-top: 12rpx;
  font-size: 12px;
  color: #acacac;
}
.roles-active {
  border: 2rpx solid #4ad975 !important;
}
</style>
