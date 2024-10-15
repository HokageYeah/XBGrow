import { uniRequest } from '@/uni-module-common/utils/http';
import { needDealCookieNames } from '@/uni-module-common/http/index';

export const allGrades = [
  {
    code: 21,
    desc: 'L1'
  },
  {
    code: 22,
    desc: 'L2'
  },
  {
    code: 23,
    desc: 'L3'
  },
  {
    code: 24,
    desc: 'L4'
  },
  {
    code: 25,
    desc: 'L5'
  },
  {
    code: 26,
    desc: 'L6'
  },
  {
    code: 31,
    desc: 'L7'
  },
  {
    code: 32,
    desc: 'L8'
  },
  {
    code: 33,
    desc: 'L9'
  }
];
export const loginInfoDealSingUserInfo = (userInfo: any, accountId: any) => {
  let userRole = -1;
  if (userInfo.xinzxUserType != null) {
    userRole = userInfo.xinzxUserType;
  }
  userRole = userRole === 2 ? 1 : userRole;
  let name = '';
  const accountIdLength = `${accountId}`.length;
  if (accountIdLength === 1) {
    name = `用户00${accountId}`;
  } else if (accountIdLength === 2) {
    name = `用户0${accountId}`;
  } else {
    name = `用户${accountId}`;
  }
  return {
    accountId,
    // 角色 -1 网站注册身份  0 教师  1 学生  2 家长  3 管理员
    userRole,
    // webId标识身份
    webId: userInfo.webId,
    // 用户姓名 todo 规则需要调整
    userName:
      userRole === 1 ? userInfo.xinzxStudentName : userRole === 0 ? userInfo.xinzxUserName : name,
    // 用户id-- 网站注册身份为 accountId   老师为teacherId  学生为studentId
    userId:
      userRole === 0 ? userInfo.xinzxUserId : userRole === 1 ? userInfo.xinzxStudentId : accountId,
    // 用户班级  学生身份时存在
    classInfo: {
      classId: userRole === 1 ? userInfo.xinzxClassId : null,
      className: userRole === 1 ? userInfo.xinzxClassName : null
    },
    // 学校信息  网站注册身份时为空
    schoolInfo: {
      schoolId: userRole === 1 || userRole === 0 ? userInfo.xinzxSchoolId : null,
      schoolName: userRole === 1 || userRole === 0 ? userInfo.xinzxSchoolName : null
    },
    gradeInfo: {
      gradeId: userRole === 1 ? userInfo.xinzxGradeId : null,
      gradeName: userRole === 1 ? userInfo.xinzxGradeName : null,
      gradeCode: userRole === 1 ? userInfo.gradeCode : null
    },
    termInfo: {
      termCode: userRole === 1 ? userInfo.termCode : null
    },
    ...userInfo
  };
};
export const loginInfoDealGradeTerm = (globalData: any) => {
  const deafultGradeTerm = {
    grade: {
      code: 21,
      desc: 'L1'
    },
    term: {
      code: new Date().getMonth() < 6 ? 1 : 2,
      desc: new Date().getMonth() < 6 ? '上学期' : '下学期'
    }
  };
  if (globalData.userNowRoleInfo.userRole === 1) {
    for (let i = 0; i < allGrades.length; i++) {
      if (allGrades[i].code === globalData.userNowRoleInfo.gradeInfo.gradeCode) {
        deafultGradeTerm.grade = {
          code: allGrades[i].code,
          desc: allGrades[i].desc
        };
      }
    }
  }
  if (globalData.userNowRoleInfo.userRole === -1) {
    // 网站用户
    uniRequest({
      url: '/user-data-v2/user/get-user-area-grade-subject-bookversion',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res: any) {
        uni.setStorageSync('userAreaGradeSubjectBookversion', JSON.stringify(res.data));
        deafultGradeTerm.grade = {
          code: res.data.gradeCode,
          desc: res.data.gradeName
        };
        deafultGradeTerm.term = {
          code: globalData.userNowRoleInfo.termCode === 2 ? 2 : 1,
          desc: globalData.userNowRoleInfo.termCode === 2 ? '下学期' : '上学期'
        };
      }
    });
  }
  return deafultGradeTerm;
};
export const loginInfoDealMoreIdentity = (userInfoList: any, accountId: any) => {
  console.log('loginInfoDealMoreIdentity----', userInfoList);
  let aType = 99;
  const list = [];
  for (let i = 0; i < userInfoList.length; i++) {
    list.push(loginInfoDealSingUserInfo(userInfoList[i], accountId));
  }
  list.sort(function (a, b) {
    if (a.userRole !== -1) {
      aType = a.userRole;
    }
    const bType = b.userRole === -1 ? 99 : b.userRole;
    if (aType > bType) {
      return 1;
    } else if (aType < bType) {
      return -1;
    } else {
      return a.userName.localeCompare(b.userName, 'zh');
    }
  });
  return list;
};

export function newloginInfoDealSingUserInfo(userInfo: any, accountId: number) {
  let userRole = -1;
  if (userInfo.xinzxUserType != null) {
    userRole = userInfo.xinzxUserType;
  }
  userRole = userRole === 2 ? 1 : userRole;
  let name = '';
  const accountIdLength = `${accountId}`.length;
  if (accountIdLength === 1) {
    name = `用户00${accountId}`;
  } else if (accountIdLength === 2) {
    name = `用户0${accountId}`;
  } else {
    name = `用户${accountId}`;
  }
  return {
    ...userInfo,
    accountId,
    // 角色 -1 网站注册身份  0 教师  1 学生  2 家长  3 管理员
    jut: userRole,
    xinzxUserType: userRole,
    // webId标识身份
    webId: userInfo.webId,
    // 用户姓名 todo 规则需要调整
    userName:
      userRole === 1 ? userInfo.xinzxStudentName : userRole === 0 ? userInfo.xinzxUserName : name,
    username:
      userRole === 1 ? userInfo.xinzxStudentName : userRole === 0 ? userInfo.xinzxUserName : name,
    // 用户id-- 网站注册身份为 accountId   老师为teacherId  学生为studentId
    userId:
      userRole === 0 ? userInfo.xinzxUserId : userRole === 1 ? userInfo.xinzxStudentId : accountId,
    // 用户班级  学生身份时存在
    xinzxClassId: userRole === 1 ? userInfo.xinzxClassId : null,
    xinzxClassName: userRole === 1 ? userInfo.xinzxClassName : null,
    xxtClassName: userRole === 1 ? userInfo.xinzxClassName : null,
    // 学校信息  网站注册身份时为空
    schoolId: userRole === 1 || userRole === 0 ? userInfo.xinzxSchoolId : null,
    schoolName: userRole === 1 || userRole === 0 ? userInfo.xinzxSchoolName : null,
    gradeId: userRole === 1 ? userInfo.xinzxGradeId : null,
    xxtGradeId: userRole === 1 ? userInfo.xinzxGradeId : null,
    xxtGradeName: userRole === 1 ? userInfo.xinzxGradeName : null,
    gradeCode: userRole === 1 ? userInfo.gradeCode : null,
    termCode: userRole === 1 ? userInfo.termCode : null,
    nickname: userInfo.nickName || userInfo.nickname,
    useXinzxData: userInfo.useXinzxData,
    gradeCodeIgnoreRole: userInfo.gradeCode // 返回年级编码，无论用户是什么身份
  };
}

// 多身份登录处理逻辑
export function newDelLoginInfoDealMoreIdentity(userInfoList: any[], accountId: number) {
  console.log('newDelLoginInfoDealMoreIdentity----', userInfoList);
  let aType = 99;
  const list = [];
  for (let i = 0; i < userInfoList.length; i++) {
    list.push(newloginInfoDealSingUserInfo(userInfoList[i], accountId));
  }
  console.log('newDelLoginInfoDealMoreIdentity----list---', list);
  // 角色 -1 网站注册身份  0 教师  1 学生  2 家长  3 管理员
  list.sort(function (a, b) {
    if (a.jut !== -1) {
      aType = a.jut;
    }
    const bType = b.jut === -1 ? 99 : b.jut;
    // 解决家长、老师、网站注册没有分类的问题
    return aType - bType;
    if (aType > bType) {
      return 1;
    } else if (aType < bType) {
      return -1;
    } else {
      return a.userName.localeCompare(b.userName, 'zh');
    }
  });
  return list;
}

export function loginByCookie(cookie: string) {
  const { setToken, loginAfter } = useStore('user');
  // #ifdef MP-WEIXIN
  const sections = cookie.split(';');
  const cookieMap: any = {};
  let cookieChanged = false;
  if (sections.length > 0) {
    sections.forEach((item: any) => {
      const tmp = item.split('=');
      if (tmp.length === 2) {
        const name = tmp[0].trim();
        const value = tmp[1].trim();
        console.log(name);
        console.log(needDealCookieNames[name]);
        if (name && needDealCookieNames[name]) {
          // 修改 cookieMap 对应数据
          if (value) {
            // Cookie 有效期 100 分钟（注：需要小于 120 分钟）
            cookieMap[name] = {
              value,
              expires: new Date().getTime() + 6000000
            };
          } else {
            delete cookieMap[name];
          }
          cookieChanged = true;
        }
      }
    });
  }
  if (cookieChanged) {
    console.log('saveCookies----setToken---addSSID---', cookieMap);
    // uni.setStorageSync('token', JSON.stringify(cookieMap));
    // 将token存储在user中
    setToken(cookieMap);
    loginAfter('', '', '');
    // isLogin.value = false;
  }
  // #endif
  // #ifndef MP-WEIXIN
  setToken(cookie);
  // #endif
}
