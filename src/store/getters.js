//相当于store的计算属性
//Getter 也可以接受其他 getter 作为第二个参数：
const getters = {
  theme_img_path(state) {
    return state.theme_img_path;
  },
  openId(state) {
    return state.openId;
  },
  authorization(state) {
    return state.authorization;
  },
  netError(state) {
    return state.netError;
  },
  cardInfo(state) {
    return state.cardInfo;
  },
  showOverlay(state) {
    return state.showOverlay;
  },
  addressData(state) {
    return state.addressData;
  },
  organizationId(state) {
    return state.organizationId;
  },
  checkedAddress(state) {
    return state.checkedAddress;
  },
  checkedRegionCode(state) {
    return state.checkedRegionCode;
  },
  whiteListUserFree(state) {
    return state.whiteListUserFree;
  }
};
export default getters;
