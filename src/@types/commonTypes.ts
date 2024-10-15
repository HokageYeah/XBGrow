export interface resourceListType {
  resourceId?: number;
  resourceType?: string;
  resourceName?: string;
  paragraph?: string;
  vipFlag?: number;
  filePath?: string;
}
export interface h5ToUniParamsType {
  from: string;
  taskSubType: number;
  resourceList?: resourceListType[];
  [key: string]: any;
}
