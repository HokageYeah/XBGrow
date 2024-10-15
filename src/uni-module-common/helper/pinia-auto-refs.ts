// "https://github.com/Allen-1998/pinia-auto-refs"
/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
import type { AutoToRefs, ToRef } from 'vue'

import activityProductStore from '@/uni-module-common/store/activityProduct'
import addressStore from '@/uni-module-common/store/address'
import aiQuestionAnswerStore from '@/uni-module-common/store/aiQuestionAnswer'
import appConfigStore from '@/uni-module-common/store/appConfig'
import fileUploadStore from '@/uni-module-common/store/fileUpload'
import testStore from '@/uni-module-common/store/test'
import userStore from '@/uni-module-common/store/user'

import store from '@/uni-module-common/store'

declare module 'vue' {
  export type AutoToRefs<T> = {
    [K in keyof T]: T[K] extends Function ? T[K] : ToRef<T[K]>
  }
}

const storeExports = {
  activityProduct: activityProductStore,
  address: addressStore,
  aiQuestionAnswer: aiQuestionAnswerStore,
  appConfig: appConfigStore,
  fileUpload: fileUploadStore,
  test: testStore,
  user: userStore,
}

export function useStore<T extends keyof typeof storeExports>(storeName: T) {
  const targetStore = storeExports[storeName](store)
  const storeRefs = storeToRefs(targetStore)
  return { ...targetStore, ...storeRefs } as unknown as AutoToRefs<ReturnType<typeof storeExports[T]>>
}
