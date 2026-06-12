import { defineStore } from "pinia";
import { ref } from "vue";
import { login as loginApi, getProfile } from "@/api";
import type { LoginForm, UserInfo } from "@/api/types";

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(localStorage.getItem("token") || "");
  const userInfo = ref<UserInfo | null>(null);

  const login = async (
    loginForm: LoginForm,
  ): Promise<{ data: { token: string; user: UserInfo } }> => {
    const res = await loginApi(loginForm);
    token.value = res.data.token;
    userInfo.value = res.data.user;
    localStorage.setItem("token", res.data.token);

    if (loginForm.rememberMe) {
      localStorage.setItem("loginForm", JSON.stringify(loginForm));
    } else {
      localStorage.removeItem("loginForm");
    }
    return res;
  };

  const saveLoginInfo = (loginForm: LoginForm): void => {
    console.log("saveLoginInfo ...");
    if (loginForm.rememberMe) {
      localStorage.setItem("loginForm", JSON.stringify(loginForm));
    } else {
      localStorage.removeItem("loginForm");
    }
  };

  const clearLoginInfo = (): void => {
    localStorage.removeItem("loginForm");
  };

  const getLoginInfo = async (): Promise<LoginForm | null> => {
    const loginForm = localStorage.getItem("loginForm");
    console.log(loginForm);
    return loginForm ? JSON.parse(loginForm) : null;
  };

  const getProfileInfo = async (): Promise<{ data: UserInfo }> => {
    const res = await getProfile();
    userInfo.value = res.data;
    return res;
  };

  const logout = (): void => {
    token.value = "";
    userInfo.value = null;
    localStorage.removeItem("token");
  };

  return {
    token,
    userInfo,
    login,
    saveLoginInfo,
    clearLoginInfo,
    getLoginInfo,
    getProfileInfo,
    logout,
  };
});
