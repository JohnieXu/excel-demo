import {
  SET_THEME_IMG_PATH,
  SET_OPEN_ID,
  SET_NET_ERROR,
  SET_AUTHORIZATION,
  SET_CARDINFO,
  SET_OVERLAY,
  SET_ADDRESS_LIST,
  SET_ORGANIZATION_ID,
  SET_CHECKED_ADDRESS,
  SET_REGION_CODE,
  SET_WHITE_USER
} from "./mutation-types";
// import { setStore } from "Utils/sessionstore";
import { setStore as setStoreLocal } from "Utils/localstore";
import { appId } from "Utils/appconfig.js";
//必须是同步代码
const mutation = {
  [SET_THEME_IMG_PATH](state, themeimgpath) {
    state.theme_img_path = themeimgpath;
  },
  [SET_OPEN_ID](state, openId) {
    state.openId = openId;
    setStoreLocal(appId + "openId", openId);
  },
  [SET_AUTHORIZATION](state, authorization) {
    state.authorization = authorization;
    setStoreLocal(appId + "authorization", authorization);
  },
  [SET_NET_ERROR](state, netError) {
    state.netError = netError;
  },
  [SET_CARDINFO](state, cardInfo) {
    state.cardInfo = cardInfo;
    setStoreLocal(appId + "cardInfo", cardInfo);
  },
  [SET_OVERLAY](state, showOverlay) {
    state.showOverlay = showOverlay;
  },
  [SET_ADDRESS_LIST](state, addressData) {
    state.addressData = addressData;
    setStoreLocal(appId + "addressData", addressData);
  },
  [SET_ORGANIZATION_ID](state, organizationId) {
    state.organizationId = organizationId;
    setStoreLocal(appId + "organizationId", organizationId);
  },
  [SET_CHECKED_ADDRESS](state, checkedAddress) {
    state.checkedAddress = checkedAddress;
    setStoreLocal(appId + "checkedAddress", checkedAddress);
  },
  [SET_REGION_CODE](state, checkedRegionCode) {
    state.checkedRegionCode = checkedRegionCode;
    setStoreLocal(appId + "checkedRegionCode", checkedRegionCode);
  },
  [SET_WHITE_USER](state, whiteListUserFree) {
    state.whiteListUserFree = whiteListUserFree;
    setStoreLocal(appId + "whiteListUserFree", whiteListUserFree);
  }
};
export default mutation;
