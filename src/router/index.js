// src/router/index.js

import { route } from "quasar/wrappers";
import { createRouter, createWebHistory } from "vue-router";

import routes from "./routes.js"; // ✅ .js must
import authGuard from "./authGuard.js"; // ✅ .js must

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  });

  Router.beforeEach((to, from, next) => {
    authGuard(to, from, next);
  });

  return Router;
});
