/** 通用的用户信息 */
type BaseProfile = {
  webId: number
  uid: number
  nickName: string
  userGroupId: number
  userType: number
  jxlxUserType: number
  gradeId: number
  province: number
  jxlxUserId: number
  jxlxOrgId: number
  jxlxInfo: string
  jxlxPersonName: string
  zxjx: boolean
  ybt: boolean
  shanDong: boolean
  hjy: boolean
  fuJianHjy: boolean
  shanDongUserInfo: string
  hjyUserInfo: string
  fuJianHjyUserInfo: string
  xxtFlag: number
  useFlag: number
  xinzxUserId: number
  xinzxUserType: number
  xinzxUserName: string
  xinzxStudentId: number
  xinzxStudentName: string
  xinzxClassId: number
  xinzxClassName: string
  xinzxGradeId: number
  gradeCode: number
  xinzxGradeName: string
  xinzxSchoolId: number
  xinzxSchoolName: string
}

/** 小程序登录 登录用户信息 */
export type LoginResult = {
  loginResult:{
    code: number
    remindMsg: string}
  userInfo: BaseProfile
  username: string
}



export type  LoginPhonePwdParams {
  entry: string;
  account: string;
  pwd: string;
  key: string;
  loginDefault: string | boolean;
}

/** 个人信息 用户详情信息 */
export type ProfileDetail = BaseProfile & {
  /** 性别 */
  gender?: Gender
  /** 生日 */
  birthday?: string
  /** 省市区 */
  fullLocation?: string
  /** 职业 */
  profession?: string
}
/** 性别 */
export type Gender = '女' | '男'

/** 个人信息 修改请求体参数 */
export type ProfileParams = Pick<
  ProfileDetail,
  'nickname' | 'gender' | 'birthday' | 'profession'
> & {
  /** 省份编码 */
  provinceCode?: string
  /** 城市编码 */
  cityCode?: string
  /** 区/县编码 */
  countyCode?: string
}
