import { createApp } from "vue";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import LoginAdmin from "./components/ComponentsRoutes/LoginAdmin.vue";
import fireModule from "./stores/fireStore/index";
import BaseCard from "./components/ui/BaseCard.vue";
import primaryStats from "./stores/primaryStats/index";
import BaseButton from "./components/ui/BaseButton.vue";
import theStats from "./components/tronOrg/PrimaryStats.vue";
import AddressList from "./components/tronOrg/AddressList.vue";

import RecentTransactions from "./components/ComponentsRoutes/RecentTransactions.vue";

import HashView from "./components/BTC/HashView.vue";
import AddressBView from "./components/BTC/AddressView.vue";
import ExchangeStats from "./components/BTC/ExchangeStats.vue";
import RegisterExchange from "./components/BTC/RegisterExchange.vue";

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/recent" },
    { path: "/recent", component:RecentTransactions},
    { path: "/stats", component: theStats },
    { path: "/address", component: AddressList },
    { path: "/login", component: LoginAdmin},
    
    { path: "/exchange", component: ExchangeStats},
    { path: "/register", component: RegisterExchange },
    { path: "/hash/:hash", component: HashView, props: true },
    { path: "/addres/:address", component: AddressBView, props: true },
  ],
});

const store = createStore({
  modules: {
    fire: fireModule,
    stats: primaryStats,
  },
});

app.use(store);
app.use(router);
app.component("login-admin", LoginAdmin);
app.component("base-card", BaseCard);
app.component("the-stats", primaryStats);
app.component("base-button", BaseButton);
app.component("address-list", AddressList);

app.component("register-address", RegisterExchange);
app.component("address-bview", AddressBView);
app.component("hash-view", HashView);
app.component("exchange-stats", ExchangeStats);

app.mount("#app");