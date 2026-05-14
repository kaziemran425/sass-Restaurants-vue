export default function authGuard(to, from, next) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // যদি route public হয়
  if (!to.meta.requiresAuth) {
    return next();
  }

  // যদি login না থাকে
  if (!token) {
    return next("/auth/login");
  }

  // role check
  const routeRole = to.meta.role;

  if (routeRole) {
    const userRole = user.role;

    // যদি routeRole array হয়
    if (Array.isArray(routeRole)) {
      if (!routeRole.includes(userRole)) {
        return next("/dashboard");
      }
    }

    // যদি routeRole string হয়
    if (typeof routeRole === "string") {
      if (routeRole !== userRole) {
        return next("/dashboard");
      }
    }
  }

  next();
}
