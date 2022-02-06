import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TransactionList from "../views/TransactionList.vue";
import DeployContract from "../views/DeployContract.vue";
import Minting from "../views/Minting.vue";
import TokenView from "../views/TokenView.vue";
import Login from "../views/Login.vue";
import CommonPages from "../components/CommonPages.vue";
import RouterGuard from "./router.guard";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "DPMI",
    component: CommonPages,
    beforeEnter: RouterGuard.App,
    children: [
      {
        path: "/login",
        name: "Login",
        component: Login,
        beforeEnter: RouterGuard.Login,
      },
      {
        path: "/token/:uuid",
        name: "Token",
        component: TokenView,
      },
      {
        path: "/",
        name: "TransactionList",
        component: TransactionList,
        beforeEnter: RouterGuard.RequiresLogin,
      },
      {
        path: "/deploy",
        name: "DeployContract",
        component: DeployContract,
        beforeEnter: RouterGuard.RequiresLogin,
      },
      {
        path: "/mint",
        name: "Minting",
        component: Minting,
        beforeEnter: RouterGuard.RequiresLogin,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
