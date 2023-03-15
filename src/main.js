import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "lib-flexible/flexible";
import "./assets/css/reset.css";
import "./assets/style/color.less";
import { getStore } from "./utils/sessionstore";
import { big_data_code } from "./utils/appconfig";
// import Vconsole from "vconsole";
import { CardnoChoose } from "@whty/xtjk-ui";
import { UeditorPreview } from "@whty/xtjk-ui";

import "@whty/xtjk-ui/lib/index.css";

import {
  Step,
  Steps,
  PullRefresh,
  Loading,
  AddressList,
  AddressEdit,
  Area,
  SubmitBar,
  Field,
  Checkbox,
  Radio,
  RadioGroup,
  Form,
  Overlay,
  Button,
  List,
  Toast,
  ActionSheet,
  Search,
  Tabs,
  Tab,
  Icon,
  Picker,
  Cell,
  CellGroup,
  Popup,
  Empty,
  Tag,
  Switch,
  Cascader,
  Dialog
} from "vant";

Vue.use(Step);
Vue.use(Steps);
Vue.use(PullRefresh);
Vue.use(Loading);
Vue.use(AddressList);
Vue.use(AddressEdit);
Vue.use(Area);
Vue.use(SubmitBar);
Vue.use(Field);
Vue.use(CellGroup);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Button);
Vue.use(Overlay);
Vue.use(Form);
Vue.use(List);
Vue.use(ActionSheet);
Vue.use(Search);
Vue.use(Tabs);
Vue.use(Tab);
Vue.use(Icon);
Vue.use(Picker);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Popup);
Vue.use(Empty);
Vue.use(Tag);
Vue.use(CardnoChoose);
Vue.use(Cascader);
Vue.use(Switch);
Vue.use(Dialog);
Vue.use(UeditorPreview);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : "";
  const authorization = store.state.authorization;
  if (!authorization && to.meta.requireAuth) {
    if (getStore("fromUrl")) {
      location.href = getStore("fromUrl");
    } else {
      Toast.fail("token失效，请重新进入页面");
    }
  } else {
    next();
  }
  setTimeout(() => {
    if (typeof window.XTListener !== "undefined" && window.XTListener) {
      window.XTListener.genXTListenerLog({ type: "11" });
    }
  }, 100);
});
function onBridgeReady() {
  window.WeixinJSBridge.call("hideOptionMenu");
}
function cancleShare() {
  if (typeof WeixinJSBridge === "undefined") {
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", onBridgeReady(), false);
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
      document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
}
// eslint-disable-next-line
router.afterEach((to, from) => {
  console.log("cancleShare---------");
  cancleShare();
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

if (process.env.VUE_APP_VERSION_SHOW === "1") {
  import("vconsole").then(Vconsole => {
    try {
      new Vconsole.default();
    } catch (error) {
      console.log(error);
    }
  });
}

function initBigData() {
  window._hmt = [];
  window._hmt.push(["projectId", big_data_code]);
  const hm = document.createElement("script");
  hm.src = process.env.VUE_APP_BIG_DATA_SRC;
  const s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
}
initBigData();
