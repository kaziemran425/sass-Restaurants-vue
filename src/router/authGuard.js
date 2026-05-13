// src/router/routeGuards.js

export const setupRouteGuards = (router) => {
  router.beforeEach((to, from, next) => {
    // Local Storage থেকে ইউজার সেশন চেক করা
    const userSession = localStorage.getItem("user_session");
    const isAuthenticated = userSession !== null;

    // যদি রুটটি 'requiresAuth' মেটা ট্যাগ ধারণ করে এবং ইউজার লগইন না থাকে
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        // লগইন না থাকলে লগইন পেজে পাঠিয়ে দিন
        next({
          path: "/auth/login",
          query: { redirect: to.fullPath }, // যে পেজে যেতে চেয়েছিল তার পাথ সেভ রাখা
        });
      } else {
        next(); // লগইন থাকলে যেতে দিন
      }
    }
    // যদি ইউজার লগইন থাকে এবং সে পুনরায় লগইন বা রেজিস্ট্রেশন পেজে যেতে চায়
    else if (to.path.startsWith("/auth") && isAuthenticated) {
      next({ path: "/" }); // তাকে ড্যাশবোর্ডে পাঠিয়ে দিন
    } else {
      next(); // অন্য সব ক্ষেত্রে সাধারণ অনুমতি
    }
  });
};
