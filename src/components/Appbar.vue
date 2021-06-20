<template>
  <v-app-bar app class="art-header" :dark="darkTheme">
    <div class="d-flex align-center">
      <v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
      <v-img
        alt="Enspire logo"
        class="shrink mr-2 logo"
        contain
        transition="scale-transition"
        src="@/assets/img/Enspire-logo.svg"
        width="40px"
      />
      <v-toolbar-title>Enspire</v-toolbar-title>
    </div>
    <v-spacer />
    <v-switch
      v-model="darkTheme"
      class="art-switch"
      inset
      label="Switch Theme"
    ></v-switch>
    <Login-dialog ref="loginDialog" @login-success="globalInit" />
    <v-btn fab outlined small @click="showLoginDialog">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
@font-face {
  font-family: title;
  src: url("../assets/fonts/impact.ttf");
}
.art-header {
  background-color: #ffffff !important;
  box-shadow: rgba(0, 0, 0, 0.062) 0px 0px 50px 8px !important;
  font-family: title;
}
.logo {
  border-radius: 20%;
  margin-left: 20px;
}
.art-switch {
  height: 25px;
  color: rgba(0, 0, 0, 0.03);
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoginDialog from "./LoginDialog.vue";

@Component({
  components: {
    LoginDialog,
  },
})
export default class Appbar extends Vue {
  darkTheme = false;
  $refs!: {
    loginDialog: LoginDialog;
  };
  showLoginDialog(): void {
    this.$refs.loginDialog.show();
  }
  globalInit(): void {
    this.$refs.loginDialog.hide();
    alert("Hi:)");
  }
  toggleSidebar(): void {
    this.$emit("toggle-sidebar");
  }
}
</script>
