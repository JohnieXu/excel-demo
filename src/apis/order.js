import http from "../utils/http";
/**
 * 威海银行新增接口
 * 修改默认地址
 */
export const getDefaultAddr = params =>
  http.post("/api/user/modifyDefaultAddr", params);
// 删除地址信息
export const deleteUserAddr = params =>
  http.post("/api/user/deleteUserAddr", params);
// 确认申请信息
export const confirmApplyInfo = params =>
  http.post("/api/bank/confirmApplyInfo", params);

// 查询用户地址列表
export const queryUserAddrList = params =>
  http.post("/api/user/queryUserAddrList", params);

// 保存用户地址
export const saveUserAddr = params =>
  http.post("/api/user/saveUserAddr", params);
