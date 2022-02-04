import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TransactionList from "../views/TransactionList.vue";
import DeployContract from "../views/DeployContract.vue";
import Minting from "../views/Minting.vue";
import TokenView from "../views/TokenView.vue";
import Login from "../views/Login.vue";
import ProtectedPages from "../components/ProtectedPages.vue";
import RouterGuard from "./router.guard";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: RouterGuard.Login,
  },
  {
    path: "/",
    name: "ProtectedPages",
    component: ProtectedPages,
    beforeEnter: RouterGuard.App,
    children: [
      {
        path: "/",
        name: "TransactionList",
        component: TransactionList,
      },
      {
        path: "/deploy",
        name: "DeployContract",
        component: DeployContract,
      },
      {
        path: "/mint",
        name: "Minting",
        component: Minting,
      },
      {
        path: "/token/:uuid",
        name: "Token",
        component: TokenView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
