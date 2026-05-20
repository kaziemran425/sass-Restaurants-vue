// src/router/authGuard.js
import { useAuth } from "src/composables/useAuth";

export default function authGuard(to, from, next) {
  const { isLoggedIn, getUserRole } = useAuth();

  const loggedIn = isLoggedIn();
  const userRole = getUserRole();

  // Guest only page (login/register/landing)
  if (to.meta.guestOnly && loggedIn) {
    return next(getRedirectPath(userRole));
  }

  // Protected page requires login
  if (to.meta.requiresAuth && !loggedIn) {
    return next({ name: "login" });
  }

  // Role check
  if (to.meta.requiresAuth && to.meta.role) {
    const allowedRoles = Array.isArray(to.meta.role)
      ? to.meta.role
      : [to.meta.role];

    if (!allowedRoles.includes(userRole)) {
      return next(getRedirectPath(userRole));
    }
  }

  return next();
}

function getRedirectPath(role) {
  if (role === "superadmin") return { name: "superadmin-dashboard" };
  if (role === "kitchen") return { name: "kitchen-display" };
  if (role === "waiter") return { name: "waiter-place-order" };
  return { name: "dashboard" };
}
