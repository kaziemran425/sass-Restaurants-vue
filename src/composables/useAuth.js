// src/composables/useAuth.js
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export function useAuth() {
  const router = useRouter();
  const user = ref(JSON.parse(localStorage.getItem("user_session")) || null);

  const isAuthenticated = computed(() => !!user.value);

  const login = (userData) => {
    user.value = userData;
    localStorage.setItem("user_session", JSON.stringify(userData));
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user_session");
    router.push("/auth/login");
  };

  const getUserRole = () => user.value?.role || "guest";

  return {
    user,
    isAuthenticated,
    login,
    logout,
    getUserRole,
  };
}
