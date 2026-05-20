// src/composables/useAuth.js
import { ref } from "vue";

const user = ref(JSON.parse(localStorage.getItem("user")) || null);
const token = ref(localStorage.getItem("token") || null);

export function useAuth() {
  const login = (userData, authToken) => {
    user.value = userData;
    token.value = authToken;

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const register = (userData) => {
    // demo register save
    localStorage.setItem("registeredUser", JSON.stringify(userData));
  };

  const logout = () => {
    user.value = null;
    token.value = null;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isLoggedIn = () => {
    return !!token.value;
  };

  const getUser = () => {
    return user.value;
  };

  const getUserRole = () => {
    return user.value?.role || null;
  };

  const getToken = () => {
    return token.value;
  };

  return {
    login,
    register,
    logout,
    isLoggedIn,
    getUser,
    getUserRole,
    getToken,
  };
}
