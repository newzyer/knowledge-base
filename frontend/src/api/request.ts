import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { useUserStore } from "@/stores/user";
import { useSnackbarStore } from "@/stores/snackbar";
import router from "@/router";

const baseURL = import.meta.env.DEV ? "/api" : "./api";

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

export function showSnackbar(
  text: string,
  color: "success" | "error" | "info" | "warning" = "success",
): void {
  console.info(`Show snackbar: ${text} (${color})`);
  const snackbarStore = useSnackbarStore();
  snackbarStore.showSnackbar(text, color);
}

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.set("Authorization", `Bearer ${userStore.token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.responseType === "blob") {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    console.warn("API 请求错误 response:", error.response);
    if (error.response) {
      const { status, data } = error.response;
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

        if (userStore.token) {
          userStore.logout();
          showSnackbar("登录已过期，请重新登录", "error");
          router.push("/login");
        } else {
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
