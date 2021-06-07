<template>
  <v-app-bar app class="art-header">
    <div class="d-flex align-center">
      <v-app-bar-nav-icon @click.stop="expandSidebar"></v-app-bar-nav-icon>
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
    <loginDialog ref="loginDialog" @login-success="globalInit"></loginDialog>
    <v-btn fab outlined small @click="showLoginDialog">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
.art-header {
  background-color: #ffffff !important;
  box-shadow: rgba(0, 0, 0, 0.096) 0px 0px 50px 8px !important;
}
.logo {
  border-radius: 20%;
  background-color: white;
  margin-left: 20px;
}
</style>

<script lang="ts">
import Vue from "vue";
import loginDialog from "./LoginDialog.vue";

type dialog = {
  show(): void;
  hide(): void;
};

export default Vue.extend({
  methods: {
    showLoginDialog() {
      (this.$refs.loginDialog as unknown as dialog).show();
    },
    globalInit() {
      (this.$refs.loginDialog as unknown as dialog).hide();
      alert("Hi:)");
    },
    expandSidebar() {
      this.$emit("toggle-sidebar");
    },
  },
  components: {
    loginDialog,
  },
});
</script>
