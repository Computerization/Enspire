<template>
  <v-layout row justify-center>
    <v-dialog v-model="visible" persistent max-width="400">
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
          <v-btn color="primary lighten-1" outlined @click="hide()">
            关闭
          </v-btn>
          <v-btn color="primary lighten-1" @click="tryLogin()">登录</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Axios from "axios";

@Component
export default class LoginDialog extends Vue {
  visible = false;
  userName = "";
  password = "";

  show(): void {
    this.visible = true;
  }
  hide(): void {
    this.visible = false;
  }
  tryLogin(): void {
    Axios.post("login.php", {
      username: this.userName,
      password: this.password,
    }).then((response) => {
      const data = response.data;
      if (data.status == "ok") {
        this.hide();
        this.$emit("login-success");
      } else {
        alert("Login Failed");
      }
    });
  }
}
</script>
