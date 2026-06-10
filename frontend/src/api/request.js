/**
 * request.js - Axios 请求封装（Vuetify 版，无 Element Plus 依赖）
 */
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useSnackbarStore } from "@/stores/snackbar";
import router from "@/router";

// 开发模式用 /api（Vite 代理），生产模式用相对路径
const baseURL = import.meta.env.DEV ? "/api" : "./api";

const request = axios.create({
  baseURL,
  timeout: 10000,
});

/** 全局 snackbar 触发器 */
export function showSnackbar(text, color = "success") {
  console.info(`Show snackbar: ${text} (${color})`);
  const snackbarStore = useSnackbarStore();
  snackbarStore.showSnackbar(text, color);
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器 — 使用 showSnackbar 触发 custom event
request.interceptors.response.use(
  (response) => {
    // console.info("API 请求应答:", response);
    // 如果请求期望 blob，直接返回原始 data（可能是 Blob 或 ArrayBuffer）
    if (response.config.responseType === "blob") {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    console.warn("API 请求错误 response:", error.response);
    if (error.response) {
      const { status, data } = error.response;
      // 处理 blob 请求的错误：尝试从 Blob 中解析 JSON
      if (error.config?.responseType === "blob" && data instanceof Blob) {
        data
          .text()
          .then((text) => {
            try {
              const json = JSON.parse(text);
              showSnackbar(json.error || "请求失败", "error");
            } catch (e) {
              console.error("Failed to parse blob error:", e);
              showSnackbar("请求失败", "error");
            }
          })
          .catch((err) => {
            console.error("Failed to read blob:", err);
            showSnackbar("请求失败", "error");
          });
      } else if (status === 401) {
        const userStore = useUserStore();
        const errorMsg = typeof data === "object" ? data?.error : data;

        // 如果是已登录状态的 401，表示 token 过期
        if (userStore.token) {
          userStore.logout();
          showSnackbar("登录已过期，请重新登录", "error");
          router.push("/login");
        } else {
          // 登录失败，显示错误消息
          showSnackbar(errorMsg || "登录失败", "error");
        }
      } else {
        const errorMsg = typeof data === "object" ? data?.error : data;
        showSnackbar(errorMsg || "请求失败", "error");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      showSnackbar("网络错误：无响应", "error");
    } else {
      console.error("Error:", error.message);
      showSnackbar(error.message || "网络错误", "error");
    }
    return Promise.reject(error);
  },
);

export default request;
