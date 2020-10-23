<template>
  <v-layout row justify-center>
    <v-dialog v-model="loginDialog" persistent max-width="400">
      <v-card class="pa-4">
        <v-card-title>
          <span class="headline">登录</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="用户名/邮箱"
                  type="userName"
                  v-model="userName"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="密码"
                  type="password"
                  v-model="password"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary lighten-1" outlined @click="hideLoginDialog()">
            关闭
          </v-btn>
          <v-btn color="primary lighten-1" flat @click="tryLogin()">
            登录
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      loginDialog: false,
      userName: null,
      password: null
    };
  },
  methods: {
    showLoginDialog() {
      this.loginDialog = true;
    },
    hideLoginDialog() {
      this.loginDialog = false;
    },
    tryLogin() {
      this.hideLoginDialog();
      this.$emit("login-success");
    }
  }
};
</script>
