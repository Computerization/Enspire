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
    <Login-dialog ref="loginDialog" @login-success="globalInit" />
    <v-switch
      @click="changeTheme"
      class="art-switch"
      inset
      label="Switch Theme"
    ></v-switch>
    <v-btn fab outlined small @click="showLoginDialog">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style lang="less" scoped>
@import url(../views/css/themes.less);
@font-face {
  font-family: title;
  src: url("../assets/fonts/impact.ttf");
}

.theme(@theme) {
  @bg: "@{theme}-bg";
  @switch: "@{theme}-switch";
  @header-bg: "@{theme}-header-bg";

  .art-header {
    background-color: @@header-bg !important;
    box-shadow: rgba(0, 0, 0, 0.062) 0px 0px 50px 8px !important;
    font-family: title;
  }
  .logo {
    border-radius: 20%;
    margin-left: 20px;
  }
  .art-switch {
    height: 25px;
    color: @@switch;
    margin-right: 3vw;
  }
}

.light-theme {
  .theme(li);
}
.dark-theme {
  .theme(da);
}
</style>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import LoginDialog from "./LoginDialog.vue";

@Component({
  components: {
    LoginDialog,
  },
})
export default class Appbar extends Vue {
  @Prop({ default: false }) darkTheme!: boolean;
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
  changeTheme(): void {
    this.$emit("change-theme");
  }
}
</script>
