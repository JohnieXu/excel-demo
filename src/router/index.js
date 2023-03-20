import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/excel/5",
    meta: { index: 1, title: "Home" }
  },
  {
    path: "/excel/:index",
    name: "excel",
    component: () => import("../views/excel"),
    meta: { index: 1, title: "Excel", requireAuth: false }
  }
];

const router = new VueRouter({
  routes
});

export default router;
