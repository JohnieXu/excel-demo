import md5 from "js-md5";
import qs from "qs";
import { appKey } from "./appconfig";
// appParams 为请求固定参数
// 生成signature 步骤 为接口具体参数 => ... 拓展固定参数 =>参数对象字典序排序并序列化=>后面拼接appKey=>Md5加密并大写
// 请求 具体参数则为
export function sortParmasByLetters(params) {
  let sortParams = {};
  let sortKeys = Object.keys(params).sort();
  for (let index = 0; index < sortKeys.length; index++) {
    const key = sortKeys[index];
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      if (typeof params[key] === "string") {
        sortParams[key] = params[key].replace(" ", "");
      } else {
        sortParams[key] = params[key];
      }
    }
  }
  return sortParams;
}

export function signCreater(params) {
  const sortedParams = sortParmasByLetters(params);
  const qsedString = qs.stringify(sortedParams);
  const str = qsedString + "&key=" + appKey;
  console.log(str);
  // console.log("签名原始数据：" + str);
  return md5(str)
    .toString()
    .toUpperCase();
}

export function getMsgId() {
  var date = new Date(),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    ms = date.getMilliseconds();
  var month = M >= 10 ? "" + M : "0" + M;
  var day = D >= 10 ? "" + D : "0" + D;
  var hour = H >= 10 ? "" + H : "0" + H;
  var minute = m >= 10 ? "" + m : "0" + m;
  var second = s >= 10 ? "" + s : "0" + s;
  var minsec = "" + ms;
  if (ms < 10) {
    minsec = "00" + ms;
  } else if (ms < 100 && ms >= 10) {
    minsec = "0" + ms;
  }
  var msgId = Y + month + day + hour + minute + second + minsec;
  var strNumber = "";
  for (var i = 0; i < 4; i++) {
    strNumber = strNumber + (Math.floor(Math.random() * 10000) % 10).toString();
  }

  console.log(msgId + strNumber);
  return msgId + strNumber;
}
