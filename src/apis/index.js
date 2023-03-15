import http from "../utils/http";
// import store from "../store/index"
let quickLogin,
  getWxOpenId,
  queryAddress,
  saveAddress,
  deleteAddress,
  setDefaultAdd,
  createDiyGood,
  createOrder,
  payOrder,
  getOrderList,
  getPostInfo,
  applyInvoice,
  pushInvoice,
  getFieldUrl,
  checkCustomizedNo,
  queryBeautyNo,
  queryRegionTree,
  queryOrganizationAddress,
  findTempletRights;

// 获取微信openId
getWxOpenId = params => http.post("/api/user/getWxOpenId", params);
// 快捷登录
quickLogin = params => http.post("/api/user/quickLogin", params);
// 查询用户地址列表
queryAddress = params => http.post("/user/queryUserAddrList", params);
// 保存用户地址
saveAddress = params => http.post("/user/saveUserAddr", params);
// 删除用户地址
deleteAddress = params => http.post("/user/deleteUserAddr", params);
// 修改默认用户地址
setDefaultAdd = params => http.post("/user/modifyDefaultAddr", params);
// 创建diy商品
createDiyGood = params => http.post("/api/goods/createDiyGoods", params);
// 创建订单
createOrder = params => http.post("/api/order/createRechargeOrder", params);
// 支付订单
payOrder = params => http.post("/api/order/createPayOrder", params);
// 查询订单
getOrderList = params => http.post("/api/order/queryOrderList", params);
// 查询物流
getPostInfo = params => http.post("/api/order/getPostInfo", params);
// 开发票
applyInvoice = params => http.post("/api/invoice/applyInvoice", params);
// 发票推送
pushInvoice = params => http.post("/api/invoice/push", params);

// 行方办卡人信息核查页面url+签名加密数据
getFieldUrl = params => http.post("/sdcsm/acquireBankCardHomeUrl", params);

// 查询自选卡号
checkCustomizedNo = params =>
  http.post("/api/customizedCardNo/checkCustomNo", params);

// 查询优选卡号
queryBeautyNo = params =>
  http.post("/api/customizedCardNo/checkBeautyNo", params);

// 查询省市区
queryRegionTree = params => http.post("/organization/regionTree", params);

// 查询机构地址
queryOrganizationAddress = params =>
  http.post("/organization/organizationAddress", params);

// 查询模版权益
findTempletRights = params => http.post("/api/goods/findTempletRights", params);

export {
  quickLogin,
  getWxOpenId,
  queryAddress,
  saveAddress,
  deleteAddress,
  setDefaultAdd,
  createDiyGood,
  createOrder,
  payOrder,
  getOrderList,
  getPostInfo,
  applyInvoice,
  pushInvoice,
  getFieldUrl,
  checkCustomizedNo,
  queryBeautyNo,
  queryRegionTree,
  queryOrganizationAddress,
  findTempletRights
};
