/* eslint-disable no-unused-vars */

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "lib-flexible/flexible";
import "./assets/css/reset.css";
import "./assets/style/color.less";

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
Vue.use(Cascader);
Vue.use(Switch);
Vue.use(Dialog);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
