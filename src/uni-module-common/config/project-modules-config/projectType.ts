export interface listType {
  pagePath: string;
  text: string;
  iconPath: string;
  selectedIconPath: string;
  dot?: boolean;
}
export interface headerModuleType {
  title: string;
  icon: string;
  path: string;
  menuId: number;
  [key: string]: any;
}
export interface appConfigType {
  template: {
    basic: {
      tabBar: {
        selectedColor: string;
        color: string;
        list: listType[];
      };
      homeTeacherModule?: headerModuleType[]; // 老师
      homeStudentModule?: headerModuleType[]; // 学生
      administratorModule?: headerModuleType[]; // 管理员
    };
  };
  [key: string]: any;
}
const aa = { a: 1 };
export default aa;
