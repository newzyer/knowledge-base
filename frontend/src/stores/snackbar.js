import { defineStore } from "pinia";
import { reactive } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const snackbar = reactive({ show: false, text: "", color: "success" });

  const showSnackbar = (text, color = "success", timeout = 3000) => {
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
