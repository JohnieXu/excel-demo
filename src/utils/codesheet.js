export const orderListSheet = [
  {
    condition: item => item.firstOrderState == 1 && item.secondOrderState == 11, //eslint-disable-line
    imgPath: "1",
    continuePay: true,
    cancleOrder: true,
    state: "待支付",
    processState: "success"
  },
  {
    condition: item => item.firstOrderState == 1 && item.secondOrderState == 12, //eslint-disable-line
    imgPath: "1",
    fail: true,
    state: "订单关闭",
    processState: "fail"
  },
  {
    condition: item => item.firstOrderState == 1 && item.secondOrderState == 13, //eslint-disable-line
    continuePay: true,
    cancleOrder: false,
    imgPath: "1",
    fail: true,
    state: "支付失败",
    processState: "fail"
  },
  {
    // 异常人工关闭
    condition: item => item.firstOrderState == 1 && item.secondOrderState == 14, //eslint-disable-line
    imgPath: "1",
    fail: true,
    state: "订单关闭",
    processState: "fail"
  },
  {
    condition: item => item.firstOrderState == 1 && item.secondOrderState == 15, //eslint-disable-line
    imgPath: "1",
    state: "支付中",
    processState: "success"
  },
  {
    //  用户手动取消
    condition: item => item.firstOrderState == 1 && item.secondOrderState == 16, //eslint-disable-line
    imgPath: "1",
    fail: true,
    state: "订单关闭",
    processState: "fail"
  },
  // 支付审核超时
  {
    condition: item => item.firstOrderState == 2 && item.secondOrderState == 28, //eslint-disable-line
    imgPath: "1",
    fail: true,
    state: "订单关闭",
    processState: "fail"
  },
  {
    condition: item => item.firstOrderState == 2 && item.secondOrderState == 21, //eslint-disable-line
    imgPath: "2",
    state: "审核中",
    processState: "success"
  },
  {
    // 第1-4次审核未通过
    condition: item => item.firstOrderState == 2 && item.secondOrderState == 22, //eslint-disable-line
    imgPath: "2",
    paramsName: "refuseReason",
    reUploadImg: true,
    fail: true,
    state: "卡面审核未通过",
    processState: "fail"
  },
  {
    // 第5次审核未通过退款
    condition: item => item.firstOrderState == 2 && item.secondOrderState == 23, //eslint-disable-line
    imgPath: "2",
    fail: true,
    state: "订单关闭",
    processState: "fail"
  },
  {
    // 审核不通过用户手动关闭
    condition: item => item.firstOrderState == 2 && item.secondOrderState == 24, //eslint-disable-line
    imgPath: "2",
    fail: true,
    state: "订单关闭",
    processState: "fail"
  },
  {
    // 超时未重新上传
    condition: item => item.firstOrderState == 2 && item.secondOrderState == 25, //eslint-disable-line
    imgPath: "2",
    fail: true,
    state: "订单关闭",
    processState: "fail"
  },
  {
    // 退款中
    condition: item => item.firstOrderState == 2 && item.secondOrderState == 26, //eslint-disable-line
    imgPath: "2",
    fail: true,
    state: "退款中",
    processState: "fail"
  },
  {
    // 退款失败
    condition: item => item.firstOrderState == 2 && item.secondOrderState == 27, //eslint-disable-line
    imgPath: "2",
    fail: true,
    state: "退款失败",
    processState: "fail"
  },
  {
    // 制卡中
    condition: item => item.firstOrderState == 3 && item.secondOrderState == 31, //eslint-disable-line
    imgPath: "3",
    state: "制卡中",
    processState: "success"
  },
  {
    // 寄出卡片
    condition: item => item.firstOrderState == 4 && item.secondOrderState == 41, //eslint-disable-line
    copyOrderNum: true,
    serchLogistic: true,
    imgPath: "4",
    state: "已发货",
    processState: "success"
  },
  {
    // 已签收
    condition: item => item.firstOrderState == 5 && item.secondOrderState == 51, //eslint-disable-line
    paramsName: "organizationName",
    copyOrderNum: true,
    serchLogistic: true,
    imgPath: "5",
    state: "已签收",
    processState: "success"
  },
  {
    // 已开户
    condition: item => item.firstOrderState == 5 && item.secondOrderState == 52 && !(item.totalAmt == 0 || item.totalAmt == '0'), //eslint-disable-line
    paramsName: "organizationName",
    copyOrderNum: true,
    serchLogistic: true,
    imgPath: "5",
    state: "已签收",
    getBill: true,
    processState: "success"
  },
  {
    // 已开户
    condition: item => item.firstOrderState == 5 && item.secondOrderState == 52 && (item.totalAmt == 0 || item.totalAmt == '0') , //eslint-disable-line
    paramsName: "organizationName",
    copyOrderNum: true,
    serchLogistic: true,
    imgPath: "5",
    state: "已签收",
    getBill: false,
    processState: "success"
  }
  // 原威海银行订单状态
  // {
  //   condition: "item.orderState === 0",
  //   description: `尊敬的用户您好，您的银行卡申请已提交，请在半小时内完成支付，超时订单将自动取消。您可以继续付款`,
  //   imgPath: "1",
  //   continuePay: true
  // },
  // {
  //   condition: "item.orderState === 3",
  //   description: `尊敬的用户您好，您的银行卡申请已提交，订单正在支付中，请耐心等待！`,
  //   imgPath: "1"
  // },
  // {
  //   condition: "item.orderState === 9",
  //   description: `尊敬的用户您好，您的订单支付失败，您可以继续付款`,
  //   continuePay: true,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   //新增999001 订单用户信用审核不通过有提款！
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999001'",
  //   description: `尊敬的用户您好，您申请的银行卡资质审核未通过，已为您取消订单，如有异议，请联系银行客服咨询！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   //新增999002 订单用户信用审核不通过无退款！
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999002'",
  //   description: `尊敬的用户您好，您申请的银行卡资质审核未通过，已为您取消订单，如有异议，请联系银行客服咨询！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   //新增999003 999003 订单用户取消订单关闭！
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999003'",
  //   description: `尊敬的用户您好，您的订单已关闭！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   //新增999004 用户申请退款！
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999004'",
  //   description: `尊敬的用户您好，您已申请退款，订单已关闭！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   //新增999005 订单支付超时！
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999005'",
  //   description: `尊敬的用户您好，您的支付已超时，订单已关闭！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   //新增999006 订单卡样审核不通过！
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999006'",
  //   description: reason =>
  //     `尊敬的用户您好，您申请的银行卡卡面审核未通过(${
  //       reason ? reason : ""
  //     })，已为您取消订单，您可重新申请！`,
  //   imgPath: "2",
  //   paramsName: "refuseReason",
  //   fail: true
  // },
  // {
  //   //新增999007 未完工订单超时关闭！
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999007'",
  //   description: `尊敬的用户您好，订单未完工超时，订单已关闭！`,
  //   imgPath: "3",
  //   fail: true
  // },
  // {
  //   //新增999008 订单支付失败关闭！
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999008'",
  //   description: `尊敬的用户您好，订单支付失败，订单已关闭！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   //新增999009 银行核心不允许办理订单关闭
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999009'",
  //   description: `尊敬的用户您好，您申请的银行卡资质审核未通过，已为您取消订单，如有异议，请联系银行客服咨询！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   //新增999010 其它
  //   condition: "item.orderState === 999&&item.orderCloseCause === '999010'",
  //   description: `尊敬的用户您好，您的订单已关闭！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   //新增 其它item.orderCloseCause === ''
  //   condition: "item.orderState === 999&&item.orderCloseCause === ''",
  //   description: `尊敬的用户您好，您的订单已关闭！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // old
  // {
  //   condition: "item.orderState === 999&&!item.refundCode",
  //   description: `尊敬的用户您好，您的订单已关闭！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   // accountCheck 资质核查 2 表示不通过 refundCode 退款订单号  refuseReason图片审核拒绝原因
  //   condition: "item.orderState === 999 &&item.refundCode && item.refuseReason",
  //   description: reason =>
  //     `尊敬的用户您好，您申请的银行卡卡面审核未通过(${
  //       reason ? reason : ""
  //     })，已为您办理退款，退款金额将在 1~3 个工作日内退至原支付账户，请注意查收！`,
  //   imgPath: "2",
  //   paramsName: "refuseReason",
  //   fail: true
  // },
  // {
  //   // 订单关闭 核查不通过 有退款订单号
  //   condition:
  //     "item.orderState === 999 &&item.refundCode&&item.accountCheck=='2'",
  //   // description: `尊敬的用户您好，您申请的银行卡资质审核未通过，已为您办理退款，退款金额将在 1~3 个工作日内退回至原支付账户，请注意查收！`,
  //   description: `尊敬的用户您好，您申请的银行卡资质审核未通过，已为您取消订单，如有异议，请联系银行客服咨询！`,
  //   imgPath: "1",
  //   fail: true
  // },
  // {
  //   condition: "item.orderState === 6",
  //   description: `尊敬的用户您好，您的银行卡申请正在审核中，请耐心等待！`,
  //   imgPath: "2"
  // },
  // {
  //   condition: "item.orderState === 30",
  //   // description: reason =>
  //   //   `尊敬的用户您好，您申请的银行卡卡面审核未通过(${
  //   //     reason ? reason : ""
  //   //   })，已为您办理退款，退款金额将在 1~3 个工作日内退至原支付账户，请注意查收！`,
  //   description: reason =>
  //     `尊敬的用户您好，您申请的银行卡卡面审核未通过(${
  //       reason ? reason : ""
  //     })，已为您取消订单，您可重新申请！`,
  //   imgPath: "2",
  //   paramsName: "refuseReason",
  //   fail: true
  // },
  // {
  //   condition:
  //     "item.orderState === 36 || item.orderState === 39 || item.orderState === 100 || item.orderState === 101 || item.orderState === 102",
  //   description: `尊敬的用户您好，您申请的银行卡正在制作中，请耐心等候！`,
  //   imgPath: "3"
  // },
  // {
  //   condition: "item.orderState === 12 || item.orderState === 15",
  //   description: `您的退款申请已提交，退款金额已退至您的原支付账户中，请注意查收！`,
  //   imgPath: "2",
  //   fail: true
  // },
  // {
  //   condition: "item.orderState === 42",
  //   // description: `尊敬的用户您好，您申请的银行卡已寄出，您可通过如下快递单号查询物流进度。`,
  //   description: `尊敬的用户您好，您申请的银行卡已发货，正在送往预约网点的途中，请您耐心等待预约网点的领卡通知。`,
  //   copyOrderNum: true,
  //   serchLogistic: true,
  //   imgPath: "4"
  // },
  // {
  //   condition: "item.orderState === 996 || item.orderState === 45",
  //   // description: `尊敬的用户您好，您申请的银行卡已签收，请持有效身份证件前往任一营业网点激活。`,
  //   // description: `尊敬的用户您好，您申请的银行卡预约网点已签收，请您收到通知后，持有效身份证件前往预约银行办理开卡。`,
  //   description: organizationName =>
  //     `尊敬的用户您好，您申请的银行卡(${
  //       organizationName ? organizationName : ""
  //     }）已签收，请您收到通知后，持有效身份证件前往预约银行办理开卡。`,
  //   paramsName: "organizationName",
  //   copyOrderNum: true,
  //   serchLogistic: true,
  //   getBill: false,
  //   imgPath: "5"
  // },
  // {
  //   condition: "item.orderState === 21",
  //   description: `尊敬的用户您好，您的订单退款失败，请联系客服进行处理！`,
  //   imgPath: "2",
  //   fail: true
  // }
];

export const logisticCodeSheet = {
  "0": { name: "不分配物流", phone: "" },
  "1": { name: "挂号信", phone: "" },
  "2": { name: "EMS", phone: "11183" },
  "3": { name: "顺丰快递", phone: "95338" },
  "4": { name: "申通快递", phone: "95543" },
  "5": { name: "京东快递", phone: "950616" },
  "6": { name: "宅急送", phone: "400-6789-000" }
};
