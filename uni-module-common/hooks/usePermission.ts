import ajax from '@/uni-module-common/http';
// 微信小程序不支持directive 自定义指令 所以采用hooks的方式鉴权
export const useElPermission = async (resourceCodeList: string[]) => {
  const { userInfo } = useStore('user');
  console.log('useElPermission----', userInfo.value);
  try {
    const data: any = await ajax<any>({
      url: '/user-data-v2/auth/check-user-resource-auth',
      method: 'POST',
      data: {
        resourceCodeList,
        groupId: userInfo.value.schoolId,
        groupType: -1
      }
    });
    console.log('useElPermission----data---', data);
    return !resourceCodeList.some((item, index) => {
      const dataCode = data[index];
      return !dataCode.authFlag;
    });
  } catch (error) {
    console.log('useElPermission----error---', error);
  }
};

/**
 * 此接口仅能鉴权家长查询自己孩子相关的资源的鉴权，比如家长查询自己孩子的成绩这种
 * @param resourceCodeList 资源编码：
 * 成绩查看权限编码：pe:exam-results:exam-list
 * 成绩分析权限编码：pe:exam-results:exam-analysis
 * @returns 出参
 */
export const useParentResourcePermission = async (resourceCodeList: string[]) => {
  const { userInfo, userAgent } = useStore('user');
  console.log('useElPermission----', userInfo.value);
  try {
    const data: any = await ajax<any>({
      url: '/user-data-v2/auth/check-parent-resource-auth',
      method: 'POST',
      data: {
        resourceCodeList,
        studentId: undefined, // 登录信息中目前没有 studentId，先不传，由接口去获取登录用户的 studentId
        hostId: userAgent.value.hostId
      }
    });
    console.log('useElPermission----data---', data);
    // return !resourceCodeList.some((item, index) => {
    //   const dataCode = data[index];
    //   return !dataCode.authFlag;
    // });
    return data;
  } catch (error) {
    console.log('useElPermission----error---', error);
    return {};
  }
};

// 判断是否具有分享权限
export const useClockShare = async (resourceCodeList: string[]) => {
  try {
    const data: any = await ajax<any>({
      url: '/user-data-v2/auth/check-resource-auth',
      method: 'POST',
      data: {
        resourceCodeList,
        studentId: undefined // 登录信息中目前没有 studentId，先不传，由接口去获取登录用户的 studentId
      }
    });
    console.log('useElPermission----data---', data[0].authFlag);
    return data[0].authFlag;
  } catch (error) {
    console.log('useElPermission----error---', error);
    return {};
  }
};
