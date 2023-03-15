function isInWx() {
  const ua = navigator.userAgent.toLowerCase();
  if (/micromessenger/i.test(ua)) {
    return true;
  } else {
    return false;
  }
}
export const isInWxEnv = isInWx();
// 三个固定参数
export const appParams = {
  appId: "1181500001013",
  deviceId: "whyh_h5",
  merNoNo: "181500001013"
};
export const appId = "1181500001013";
export const merNo = "181500001013"; // 商户号
export const merNoNo = "181500001013"; // 商户号
export const merType = "2"; // 商户类型
export const appKey = process.env.VUE_APP_APPKEY;
export const wx_appid = process.env.VUE_APP_WX_APPID;
export const wx_component_appid = process.env.VUE_APP_WX_COMPONENT_APPID;
export const wx_scope = process.env.VUE_APP_WX_SCOPE;
export const indexDoc = process.env.VUE_APP_INDEX_DOC;
export const big_data_code = "1024";
