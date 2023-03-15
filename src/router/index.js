import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "RedirectHome",
    // component: () => import("../views/redirecthome"),
    redirect: "/home",
    meta: { index: 1, title: "登录" }
  },
  {
    path: "/redirect-home",
    name: "RedirectHome",
    component: () => import("../views/redirecthome"),
    meta: { index: 1, title: "登录" }
  },
  {
    path: "/order",
    name: "Order",
    component: () => import("../views/order"),
    meta: { index: 2, title: "我的订单" }
  },
  {
    path: "/logistics",
    name: "Logistics",
    component: () => import("../views/logistics"),
    meta: { index: 3, title: "物流详情", requireAuth: false }
  },
  {
    path: "/suborder",
    name: "Suborder",
    component: () => import("../views/suborder"),
    meta: { index: 3, title: "确认订单" }
  },
  {
    path: "/paycenter",
    name: "Paycenter",
    component: () => import("../views/paycenter"),
    meta: { index: 4, title: "支付中心", requireAuth: false }
  },
  {
    path: "/paysuccess",
    name: "Paysuccess",
    component: () => import("../views/paysuccess"),
    meta: { index: 5, title: "申请成功", requireAuth: false }
  },
  // {
  //   path: "/subsuccess",
  //   name: "Subsuccess",
  //   component: () => import("../views/subsuccess"),
  //   meta: { index: 5, title: "申请成功", requireAuth: true }
  // },
  {
    path: "/bill",
    name: "Bill",
    component: () => import("../views/bill"),
    meta: { index: 6, title: "获取发票", requireAuth: false }
  },
  {
    path: "/billsuccess",
    name: "Billsuccess",
    component: () => import("../views/billsuccess"),
    meta: { index: 6, title: "开票成功", requireAuth: false }
  },
  {
    path: "/billdetail",
    name: "BillDetail",
    component: () => import("../views/billdetail"),
    meta: { index: 9, title: "发票详情", requireAuth: false }
  },
  {
    path: "/myaddress",
    name: "MyAddress",
    component: () => import("../views/addresslist"),
    meta: { index: 4, title: "收货地址", requireAuth: true }
  },
  {
    path: "/reciveplace",
    name: "Reciveplace",
    component: () => import("../views/reciveplace"),
    meta: { index: 4, title: "选择领卡网点", requireAuth: true }
  },
  {
    path: "/mdposlist",
    name: "Mdposlist",
    component: () => import("../views/mdposlist"),
    meta: { index: 5, title: "编辑收货地址", requireAuth: true }
  },
  {
    path: "/createaddress",
    name: "createAddress",
    component: () => import("../views/createaddress"),
    meta: { index: 5, title: "新建收货地址", requireAuth: true }
  },
  {
    path: "/getField",
    name: "GetField",
    component: () => import("../views/redirectgetfield"),
    meta: { index: 1, title: "获取申请表", requireAuth: false }
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/home"),
    meta: { index: 1, title: "登录", requireAuth: false }
  },
  {
    path: "/addressList",
    name: "addressList",
    component: () => import("../views/addresslist/addressList"),
    meta: { index: 5, title: "选择收货地址", requireAuth: false }
  },
  {
    path: "/addressAdd",
    name: "addressAdd",
    component: () => import("../views/addresslist/addressAdd"),
    meta: { index: 4, title: "新建收货地址", requireAuth: false }
  },
  {
    path: "/addressEdit",
    name: "addressEdit",
    component: () => import("../views/addresslist/addressAdd"),
    meta: { index: 4, title: "编辑收货地址", requireAuth: false }
  }
];

const router = new VueRouter({
  routes
});

// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };

export default router;
