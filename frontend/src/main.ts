import { createApp } from "vue";
import { createPinia } from "pinia";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { zhHans } from "vuetify/locale";
import type { ThemeDefinition } from "vuetify";

import App from "./App.vue";
import router from "./router";

const lightTheme: ThemeDefinition = {
  colors: {
    primary: "#01976D",
    secondary: "#424242",
    accent: "#82B1FF",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
    background: "#FAFAFA",
    surface: "#FFFFFF",
  },
};

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: "zhHans",
    messages: { zhHans },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: lightTheme,
    },
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount("#app");
