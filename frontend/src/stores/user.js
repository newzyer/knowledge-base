import { defineStore } from "pinia";
import { ref } from "vue";
import { login as loginApi, getProfile } from "@/api";

export const useUserStore = defineStore("user", () => {
  const token = ref(localStorage.getItem("token") || "");
  const userInfo = ref(null);

  const login = async (loginForm) => {
    const res = await loginApi(loginForm);
    token.value = res.data.token;
    userInfo.value = res.data.user;
    localStorage.setItem("token", res.data.token);

    // 根据勾选状态决定存储或清除
    if (loginForm.rememberMe) {
      localStorage.setItem("loginForm", JSON.stringify(loginForm));
    } else {
      localStorage.removeItem("loginForm");
    }
    return res;
  };

  const saveLoginInfo = (loginForm) => {
    console.log("saveLoginInfo ...");
    if (loginForm.rememberMe) {
      localStorage.setItem("loginForm", JSON.stringify(loginForm));
    } else {
      localStorage.removeItem("loginForm");
    }
  };

  const clearLoginInfo = () => {
    localStorage.removeItem("loginForm");
  };

  const getLoginInfo = async () => {
    const loginForm = localStorage.getItem("loginForm");
    console.log(loginForm);
    return loginForm ? JSON.parse(loginForm) : null;
  };

  const getProfileInfo = async () => {
    const res = await getProfile();
    userInfo.value = res.data;
    return res;
  };

  const logout = () => {
    token.value = "";
    userInfo.value = null;
    localStorage.removeItem("token");
  };

  return {
    token,
    userInfo,
    login,
    saveLoginInfo,
    getLoginInfo,
    getProfileInfo,
    logout,
  };
});
