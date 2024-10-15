import ajax from '@/uni-module-common/http';
export class wxAuthorizLogin {
  static wxGetUserInfo = (desc: string) => {
    uni.showModal({
      title: '提醒',
      content: '请授权您的昵称、头像',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定');
          return new Promise((resolve, reject) => {
            uni.getUserProfile({
              desc,
              success: (res) => {
                console.log('wxGetUserInfo-success-', res);
                resolve(res);
              },
              fail: (err) => {
                console.log('wxGetUserInfo-fail-', err);
                reject(err);
              }
            });
          });
        }
      },
      fail(e) {
        console.log(e);
        uni.showToast({
          title: '请授权用户头像',
          icon: 'none'
        });
      }
    });
  };

  // static wxLogin = (url: string) => {
  //   return new Promise((resolve, reject) => {
  //     uni.login({
  //       provider: 'weixin',
  //       timeout: 10000,
  //       success: async (res) => {
  //         console.log('wxLogin-success-', res);
  //         try {
  //           const result: any = await ajax({
  //             url,
  //             method: 'GET'
  //           });
  //           resolve(result);
  //         } catch (error) {
  //           reject(error);
  //         }
  //       },
  //       fail: (err) => {
  //         console.log('wxLogin-fail-', err);
  //         reject(err);
  //       }
  //     });
  //   });
  // };
  static wxLogin = (url: string, method: any, entry: string) => {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        timeout: 10000,
        success: async (res) => {
          console.log('wxLogin-success-', res);
          try {
            const result: any = await ajax({
              url,
              method,
              data: {
                code: res.code,
                entry
              }
            });
            resolve({ ...result, code: res.code });
          } catch (error) {
            reject(error);
          }
        },
        fail: (err) => {
          console.log('wxLogin-fail-', err);
          reject(err);
        }
      });
    });
  };

  static wxCheckSession = () => {
    return new Promise((resolve, reject) => {
      uni.checkSession({
        success: (res) => {
          console.log('wxCheckSession-success-', res);
          resolve(res);
        },
        fail: (err) => {
          console.log('wxCheckSession-fail-', err);
          reject(err);
        }
      });
    });
  };
}
