// src/composables/usePermissions.js
import { computed } from "vue";
import { useAuth } from "./useAuth";

export function usePermissions() {
  const { getUserRole } = useAuth();

  const role = computed(() => getUserRole());

  const canAccess = (allowedRoles = []) => {
    if (!allowedRoles.length) return true;
    return allowedRoles.includes(role.value);
  };

  return {
    role,
    canAccess,
  };
}
