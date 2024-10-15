import { cloneDeep } from 'lodash';

export interface Address {
  addressId: number;
  addressTag: string;
  defaultAddress: number;
  receiverAddress: string;
  receiverArea: string;
  receiverCityCode: string;
  receiverMobile: string;
  receiverName: string;
  receiverProvinceCode: string;
  [key: string]: any;
}

export const deafultAddress: Address = {
  addressId: 0,
  addressTag: '',
  defaultAddress: 0,
  receiverAddress: '',
  receiverArea: '',
  receiverCityCode: '',
  receiverMobile: '',
  receiverName: '',
  receiverProvinceCode: ''
};

const address = defineStore({
  id: 'address',
  state: () => ({
    addressInfo: cloneDeep(deafultAddress), // 地址信息
    selectAddress: false // 判断是否选中了地址
  }),
  actions: {
    setAddress(address: Address) {
      this.addressInfo = address;
    },
    clearAddress() {
      // state.mailAddress = {}
      this.addressInfo.addressId = 0;
      this.addressInfo.receiverName = '';
      this.addressInfo.receiverMobile = '';
      this.addressInfo.receiverArea = '';
      this.addressInfo.receiverAddress = '';
      this.addressInfo.defaultAddress = 0;
    },
    setSelectAddress(selectFlag: boolean) {
      this.selectAddress = selectFlag;
    }
  },
  persist: {
    enabled: true,
    H5Storage: window?.localStorage,
    strategies: [
      {
        storage: window?.localStorage
        // paths: ['userInfo']
      }
    ]
  }
});

export default address;
