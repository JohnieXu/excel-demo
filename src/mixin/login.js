import {
  merNoNo,
  wx_appid,
  indexDoc,
  appId,
  wx_scope,
  wx_component_appid
} from "Utils/appconfig.js";
import { getWxOpenId, quickLogin } from "Api/index.js";
import { confirmApplyInfo } from "Api/order.js";
import { mapMutations, mapGetters } from "vuex";
import {
  SET_OPEN_ID,
  SET_AUTHORIZATION,
  SET_OVERLAY
} from "Store/mutation-types.js";
import { getQuery } from "Utils";
// eslint-disable-next-line no-unused-vars
import { setStore, getStore } from "Utils/localstore";
import {
  setStore as setStoreLocal,
  getStore as getStoreLocal
} from "Utils/localstore";
import { Toast } from "vant";

/**
 * 开始微信重定向
 * 1.存储银行入口带过来的参数
 * 2.拼装重定向地址
 * 3.开始微信授权重定向
 * @param {Object} param0 参数
 */
// eslint-disable-next-line no-unused-vars
function redirectToWeixin({ redirectPage, applyDetail }) {
  // const redirectUrl = `https://${document.domain}/${indexDoc}/#/redirecthome/?redirectPage=${redirectPage}&applyDetail=${applyDetail}`
  const redirectUrl = `https://${document.domain}/${indexDoc}/#/redirect-home/`;
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wx_appid}&redirect_uri=${encodeURIComponent(
    redirectUrl
  )}&response_type=code&scope=${wx_scope}&state=a0&component_appid=${wx_component_appid}#wechat_redirect`;

  console.log(`start redirectPage url=${url}`);

  location.replace(url);
}
/**
 * 转换空格为加号
 * @param {String} str 参数
 * @returns 返回数据
 */
function transformSpace2Plus(str) {
  // FIX: HFYH-398修复getQueryParam方法会将+替换为空格
  if (!str) {
    return "";
  }
  return str.replace(/ /g, "+");
}
function getQueryParam(key) {
  return getQuery()[key];
}
/**
 * 保存申请表接口返回的数据
 */
// eslint-disable-next-line no-unused-vars
function saveApplyParams({ whiteListUserFree }) {
  /* userStt 00：普通用户（02,03,04收费客户）
   ** 05,06：钻石客户或私人银行客户（免费客户）
   **/
 if(whiteListUserFree == '05' || whiteListUserFree == '06'){ //eslint-disable-line
    setStoreLocal(appId + "whiteListUserFree", 1);
  } else {
    setStoreLocal(appId + "whiteListUserFree", 0);
  }
}
export const login = {
  data() {
    return {
      pageEntry: ""
    };
  },
  computed: {
    ...mapGetters(["openId", "authorization"])
  },
  methods: {
    ...mapMutations([SET_OPEN_ID, SET_AUTHORIZATION, SET_OVERLAY]),
    getCode(childPath) {
      const redirect_url = encodeURIComponent(
        "https://" + document.domain + "/" + indexDoc + "/#/" + childPath
      );
      try {
        const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wx_appid}&redirect_uri=${redirect_url}&response_type=code&scope=${wx_scope}&state=a0&component_appid=${wx_component_appid}#wechat_redirect`;
        location.replace(url);
      } catch (error) {
        Toast.fail("微信认证失败，请刷新页面");
      }
    },
    /**
     * 从微信进入
     * 1、校验入口参数
     * 2.保存入口参数
     * 3.进行微信授权重定向
     */
    // 地址栏 有字段说明微信还未认证
    checkPage() {
      this.validateurlParams()
        .then(() => {
          this.saveParams();
          this.wechatInit();
        })
        .catch(e => {
          this.$toast(e.message);
        });
    },
    /**
     * 校验入口参数
     * 1.校验redirectPage home: 跳转选择图片进行制卡页面 order: 跳转查看订单页面
     * 2.校验applyDetail
     * 入口参数在进行微信重定向时可能丢失，因此取值逻辑为url中取不到则在本地取
     */
    validateurlParams() {
      const redirectPages = ["home", "order"];
      return new Promise((resolve, reject) => {
        let redirectPage = getQueryParam("redirectPage");
        let applyDetail = transformSpace2Plus(getQueryParam("applyDetail"));
        redirectPage = redirectPage || getStoreLocal(appId + "redirectPage");
        applyDetail = applyDetail || getStoreLocal(appId + "applyDetail");
        console.log(
          "wechat debug applyDetail3333333",
          getStoreLocal(appId + "applyDetail")
        );
        if (!redirectPages.includes(redirectPage)) {
          console.error("url params redirectPage is limited");
          reject(new Error("参数错误，请返回重新进入"));
          return;
        }
        if (redirectPage === "home" && !applyDetail) {
          console.error("url params applyDetail is needed");
          reject(new Error("参数错误，请返回重新进入"));
          return;
        }
        resolve(true);
      });
    },
    /**
     * 保存URL参数
     * 1.保存用户头像昵称等（原项目逻辑）
     * 2.保存的applyDetail未encodeURIComponent编码过的
     * 3.保存银行页面跳过来的参数
     */
    // eslint-disable-next-line no-unused-vars
    saveParams() {
      console.log("start saveParams");

      const headimgurl = getQueryParam("headimgurl");
      const nickname = getQueryParam("nickname");
      const redirectPage = getQueryParam("redirectPage");
      const applyDetail = transformSpace2Plus(getQueryParam("applyDetail"));

      if (headimgurl && headimgurl.length > 0) {
        setStoreLocal("headimgurl", decodeURIComponent(headimgurl));
      }
      if (nickname && nickname.length > 0) {
        setStoreLocal("nickname", decodeURIComponent(nickname));
      }

      if (redirectPage && redirectPage.length > 0) {
        setStoreLocal(appId + "redirectPage", redirectPage);
      }

      if (applyDetail && applyDetail.length > 0) {
        setStoreLocal(appId + "applyDetail", applyDetail);
      }
    },
    /**
     * 微信授权逻辑
     */
    wechatInit() {
      console.log("start wechatInit");
      const redirectPage = getQueryParam("redirectPage");
      const applyDetail = transformSpace2Plus(getQueryParam("applyDetail"));
      const code = getQueryParam("code");
      console.log(
        "wechat debug",
        location.href,
        location.href.includes("?code")
      );

      if (!code) {
        console.log("wechat debug: no code start redirect to weixin");
        redirectToWeixin({ redirectPage, applyDetail });
      } else {
        this.getOpenId()
          .then(() => {
            this.startNavigate().catch(e => {
              console.log(e);
            });
          })
          .catch(e => {
            console.log(e);
            setTimeout(() => {
              redirectToWeixin({ redirectPage, applyDetail });
            }, 1500);
          });
      }
    },
    // 通过code获取openId
    getOpenId() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const code = getQueryParam("code") || "";
        const params = {
          code,
          merNo: merNoNo
        };
        const res = await getWxOpenId(params);
        if (res && res.returnCode === "SUCCESS") {
          let { openid = "", nickname = "", headimgurl = "" } = res.body;
          if (!nickname) {
            nickname = getStoreLocal(appId + "nickname") || "";
          }
          if (!headimgurl) {
            headimgurl = getStoreLocal(appId + "headimgurl") || "";
          }

          this[SET_OPEN_ID](openid);
          setStoreLocal(appId + "nickname", nickname);
          setStoreLocal(appId + "headimgurl", headimgurl);

          this.quicklogin({
            openid
            // nickname,
            // headimgurl
          })
            .then(() => {
              resolve(true);
            })
            .catch(reject);
        } else {
          // code失效,获取openId失败,请重新进入页面
          this[SET_OVERLAY](false);
          reject(new Error("获取openId失败"));
        }
      });
    },
    // 快速登录
    quicklogin(params) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async resolve => {
        const res = await quickLogin(params);
        if (res && res.returnCode === "SUCCESS") {
          const { token = "" } = res.body;
          this[SET_AUTHORIZATION](token);
          this[SET_OVERLAY](false);
          resolve(true);
        }
      });
    },
    /**
     * 1.解密URL中加密参数
     * 2.根据解密参数进行页面导航
     * 3.如果从跳转是order订单页，则不解密加密参数applyDetail为空
     * 4.取银行传递的参数逻辑：先取url再取local（因微信重定向会丢失银行传递的参数）
     * 5.存储确认申请表接口返回是否白名单内免费用户（20221020添加）
     */
    startNavigate() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        let _applyDetail = "";
        if (getQueryParam("applyDetail")) {
          const applyDetail = getQueryParam("applyDetail");
          // getQueryParam方法获取query参数不会进行url反编码
          // _applyDetail = encodeURIComponent(applyDetail)
          _applyDetail = applyDetail;
        } else {
          _applyDetail = getStoreLocal(appId + "applyDetail");
        }
        const redirectPage =
          getQueryParam("redirectPage") ||
          getStoreLocal(appId + "redirectPage");

        const param = { applyDetail: _applyDetail };

        const toOrder = () => {
          this.$router.push("/order", { replace: true });
        };

        if (redirectPage === "order") {
          toOrder();
          resolve(true);
          return;
        }

        /* userStt 00：普通用户（收费客户）
         ** 05：钻石客户或私人银行客户（免费客户）
         **/
        const result = await confirmApplyInfo(param);
        if (result.returnCode !== "SUCCESS") {
          reject(new Error(result.returnDes));
          return;
        } else {
          let whiteListUserFree = result.body.custLevelId;
          saveApplyParams({
            whiteListUserFree
          });
        }
        // 进行页面导航
        switch (redirectPage) {
          case "home":
            // 心怡卡（定制卡）
            this.getTemplateAndToChoose();
            break;
          case "order":
            toOrder();
            break;
          default:
            break;
        }
        resolve(true);
      });
    },
    /**
     * 查询定制卡模板并跳转至选择图片页面
     */
    getTemplateAndToChoose() {
      this.$router.push("/home"); // 成品卡接入之后，跳到首页
    },
    /**
     * 非微信环境进入
     * 威海银行暂无非微信入口，若从非微信环境入口进入不进行微信授权重定向，
     * 若本地有openid则用本地openid快速登录否则toast提示需要在微信环境打开
     */
    checkPageInApp() {
      this.validateurlParams()
        .then(() => {
          this.saveParams();
          const openId = getStoreLocal(appId + "openId");
          if (!openId) {
            this.$toast("请在微信环境打开");
            return;
          }
          const nickname = ""; // TODO:
          const headimgurl = ""; // TODO:
          this.quicklogin({
            openid: openId,
            nickname,
            headimgurl
          }).then(() => {
            this.startNavigate().catch(e => {
              console.log(e);
            });
          });
        })
        .catch(e => {
          this.$toast(e.message);
        });
    }
  }
};
