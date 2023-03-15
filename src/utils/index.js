import { Toast } from "vant";
const regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
export function matchPhoneNum(str) {
  const phoneNums = str.match(regx);
  if (!phoneNums) {
    return str;
  }
  for (var i = 0; i < phoneNums.length; i++) {
    //手机号全部替换
    //str = str.replace(phoneNums[i],"[****]");
    let temp = phoneNums[i];
    //隐藏手机号中间4位(例如:12300102020,隐藏后为132****2020)
    // temp = temp.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    temp = temp.replace(
      temp,
      "<a class='mobile-call' style='color:rgb(0, 101, 190)' href='tel:" +
        temp +
        "'>" +
        temp +
        "</a>"
    );
    console.log("temp:" + temp);
    str = str.replace(phoneNums[i], temp);
  }
  return str;
}

export function getQuery(str = window.location.href) {
  str = str.split("?")[1];
  if (!str) {
    return {};
  }
  let obj = {};
  const list = str.split("&");
  if (!list.length) {
    return {};
  }
  list.forEach(v => {
    const datalist = v.split("=");
    obj[datalist[0]] = datalist[1];
  });
  return obj;
}

/**
 * 将科学计数法的数字转为字符串
 * 说明：运算精度丢失方法中处理数字的时候，如果出现科学计数法，就会导致结果出错
 * 4.496794759834739e-9  ==> 0.000000004496794759834739
 * 4.496794759834739e+9  ==> 4496794759.834739
 * @param  num
 */
const toNonExponential = num => {
  if (num == null) {
    return num;
  }
  if (typeof num === "number") {
    var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
  } else {
    return num;
  }
};

/**
 * 两浮点数相乘（修复了 js 乘法精度丢失问题）
 * @param {Number} arg1 浮点数 1
 * @param {Number} arg2 浮点数 2
 */
export const floatMultiply = (arg1, arg2) => {
  arg1 = Number(arg1);
  arg2 = Number(arg2);
  if ((!arg1 && arg1 !== 0) || (!arg2 && arg2 !== 0)) {
    return null;
  }
  arg1 = toNonExponential(arg1);
  arg2 = toNonExponential(arg2);
  var n1, n2;
  var r1, r2; // 小数位数
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  n1 = Number(arg1.toString().replace(".", ""));
  n2 = Number(arg2.toString().replace(".", ""));
  return (n1 * n2) / Math.pow(10, r1 + r2).toFixed(2);
};

/**
 * 两浮点数相除（修复了 js 触发精度丢失问题）
 * @param {Number} arg1 被除数
 * @param {Number} arg2 除数
 */
export const floatDivide = (arg1, arg2) => {
  arg1 = Number(arg1);
  arg2 = Number(arg2);
  if (!arg2) {
    return null;
  }
  if (!arg1 && arg1 !== 0) {
    return null;
  } else if (arg1 === 0) {
    return "0.00";
  }
  arg1 = toNonExponential(arg1);
  arg2 = toNonExponential(arg2);
  var n1, n2;
  var r1, r2; // 小数位数
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  n1 = Number(arg1.toString().replace(".", ""));
  n2 = Number(arg2.toString().replace(".", ""));
  return floatMultiply(n1 / n2, Math.pow(10, r2 - r1)).toFixed(2);
  // return (n1 / n2) * Math.pow(10, r2 - r1);   // 直接乘法还是会出现精度问题
};
/**
 * 浏览器 复制方法
 * text 被复制内容
 */
export const copyToClipboard = text => {
  if (!text) {
    Toast("复制单号不能为空");
    return;
  }
  const textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.setAttribute("readonly", "readonly"); // 只读属性 防止ios聚焦触发键盘事件
  textArea.select();
  // ios必须先选中文字且不支持 input.select();
  textArea.setSelectionRange(0, text.length);
  try {
    const successful = document.execCommand("copy");
    const msg = successful
      ? "快递单号成功复制到剪贴板"
      : "该浏览器不支持点击复制到剪贴板，请长按快递单号手动复制。";
    // alert(msg);
    successful ? Toast.success(msg) : Toast.fail(msg);
  } catch (err) {
    Toast.fail("该浏览器不支持点击复制到剪贴板，请长按快递单号手动复制。");
  }
  document.body.removeChild(textArea);
};
