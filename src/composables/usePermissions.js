// src/composables/usePermissions.js
import { useAuth } from "./useAuth";

export function usePermissions() {
  const { getUserRole } = useAuth();
  const role = getUserRole();

  // রোল অনুযায়ী পারমিশন ম্যাপিং
  const permissions = {
    "Super Admin": ["all"],
    Admin: ["dashboard", "hrm", "inventory", "accounting", "settings", "pos"],
    Kitchen: ["kitchen_display", "food_status"],
    Waiter: ["pos", "place_order", "serve_status"],
    Cashier: ["pos", "billing_history"],
  };

  const canAccess = (feature) => {
    const userPermissions = permissions[role] || [];
    if (userPermissions.includes("all")) return true;
    return userPermissions.includes(feature);
  };

  return {
    canAccess,
    currentRole: role,
  };
}
