<template>
  <v-app>
    <v-main>
      <v-sheet class="login-background" style="height: 100vh">
        <v-row class="fill-height ma-0" justify="center" align="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card elevation="12" rounded="xl" class="login-card mx-auto">
              <v-card-title class="card-header">
                <div class="header-content">
                  <v-icon size="56" color="white"
                    >mdi-book-open-page-variant</v-icon
                  >
                  <div>
                    <div class="text-h5 text-white font-weight-bold">
                      知识库
                    </div>
                    <div
                      class="text-white text-body-2 mt-1"
                      style="opacity: 0.8"
                    >
                      登录你的账号
                    </div>
                  </div>
                </div>
              </v-card-title>

              <v-card-text class="pa-8">
                <v-form ref="formRef" @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="form.username"
                    label="用户名"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    :rules="[(v) => !!v || '请输入用户名']"
                    density="comfortable"
                    class="mb-2"
                    autofocus
                  />
                  <v-text-field
                    v-model="form.password"
                    label="密码"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="[(v) => !!v || '请输入密码']"
                    density="comfortable"
                    class="mb-4"
                  />

                  <!-- 记住我 -->
                  <v-checkbox
                    v-model="form.rememberMe"
                    label="记住用户名和密码"
                    density="compact"
                    hide-details
                    class="mb-4"
                  ></v-checkbox>

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    rounded="lg"
                  >
                    登录
                  </v-btn>
                </v-form>
              </v-card-text>

              <v-card-actions class="justify-center pb-6">
                <span class="text-body-2 text-grey">没有账号？</span>
                <router-link
                  to="/register"
                  class="text-primary text-body-2 font-weight-bold ml-1"
                  style="text-decoration: none"
                >
                  立即注册
                </router-link>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-sheet>
    </v-main>

    <v-snackbar
      v-model="snackbarStore.snackbar.show"
      :color="snackbarStore.snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbarStore.snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useSnackbarStore } from "@/stores/snackbar";
import { showSnackbar } from "@/api/request";

const router = useRouter();
const userStore = useUserStore();
const snackbarStore = useSnackbarStore();

const formRef = ref(null);
const loading = ref(false);
const showPassword = ref(false);

const form = reactive({ username: "", password: "", rememberMe: false });

const handleLogin = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await userStore.login(form).then(() => {
      // 登录成功后保存登录信息,，根据勾选状态决定存储或清除
      console.log(form.rememberMe);
      if (form.rememberMe) {
        userStore.saveLoginInfo({
          username: form.username,
          password: form.rememberMe ? form.password : "",
          rememberMe: form.rememberMe,
        });
      } else {
        userStore.clearLoginInfo();
      }
    });
    showSnackbar("登录成功");
    router.push("/");
  } catch (error) {
    console.warn("登录失败:", error);
    // 错误已由 request.js 拦截器处理并显示
  } finally {
    loading.value = false;
  }
};

// 2. 页面加载时：尝试从 localStorage 恢复数据
onMounted(() => {
  userStore.getLoginInfo().then((loginInfo) => {
    if (loginInfo && loginInfo.rememberMe) {
      form.username = loginInfo.username || "";
      form.password = loginInfo.password || "";
      form.rememberMe = true;
    }
  });
});
</script>

<style scoped>
.login-background {
  background: linear-gradient(135deg, #e9f2fb, #9cc7f8);
}

.login-card {
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #e9f2fb, #3591fb);
  text-align: center;
  padding: 32px 24px 24px;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}
</style>
