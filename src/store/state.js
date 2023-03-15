import { getStore as getStoreLocal } from "Utils/localstore";
import { appId } from "Utils/appconfig.js";
const state = {
  theme_img_path: "img",
  openId: getStoreLocal(appId + "openId") || null,
  authorization: getStoreLocal(appId + "authorization") || null,
  cardInfo: getStoreLocal(appId + "cardInfo") || null,
  netError: false,
  showOverlay: false,
  addressData: getStoreLocal(appId + "addressData") || null,
  organizationId: getStoreLocal(appId + "organizationId") || null,
  checkedAddress: getStoreLocal(appId + "checkedAddress") || null,
  checkedRegionCode: getStoreLocal(appId + "checkedRegionCode") || null,
  whiteListUserFree: getStoreLocal(appId + "whiteListUserFree") || null
};
export default state;
