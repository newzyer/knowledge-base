import { defineStore } from "pinia";
import { reactive } from "vue";

export interface SnackbarState {
  show: boolean;
  text: string;
  color: "success" | "error" | "info" | "warning";
  timeout?: number;
}

export const useSnackbarStore = defineStore("snackbar", () => {
  const snackbar = reactive<SnackbarState>({
    show: false,
    text: "",
    color: "success",
  });

  const showSnackbar = (
    text: string,
    color: SnackbarState["color"] = "success",
    timeout = 3000,
  ): void => {
    snackbar.text = text;
    snackbar.color = color;
    snackbar.show = true;
    snackbar.timeout = timeout;
  };

  return {
    snackbar,
    showSnackbar,
  };
});
