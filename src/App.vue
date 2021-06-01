<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
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
      <v-btn fab outlined small @click="showLoginDialog()">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary fixed bottom>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Enspire</v-list-item-title>
          <v-list-item-subtitle>Make CAS great again</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="primary--text text--accent-4"
        >
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>首页</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-subheader>CAS管理</v-subheader>
          <v-list-item
            v-for="item in drawerItems"
            :key="item.title"
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-subheader>信息</v-subheader>
          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>关于我们</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-footer class="primary lighten-2 pa-3" padless>
      <v-row justify="center" no-gutters>
        <v-btn
          v-for="link in links"
          :key="link.title"
          color="white"
          text
          rounded
          class="my-2"
          :href="link.src"
        >
          {{ link.title }}
        </v-btn>
        <v-col class="py-4 text-center white--text" cols="12">
          Copyright © {{ new Date().getFullYear() }} Computerization. Built with
          Vue.
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<style scoped>
.logo {
  border-radius: 20%;
  background-color: white;
  margin-left: 20px;
}
</style>

<script lang="ts">
import Vue from "vue";
import loginDialog from "./components/LoginDialog.vue";

type dialog = {
  show(): void;
  hide(): void;
};

export default Vue.extend({
  data: () => ({
    drawer: false,
    group: null,
    drawerItems: [
      { title: "我们的社团", icon: "mdi-view-dashboard", to: "/clubs" },
      { title: "预约教室", icon: "mdi-calendar", to: "/reservation" },
    ],
    links: [
      { title: "GitHub", src: "https://github.com/Computerization/Enspire" },
    ],
  }),
  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    showLoginDialog() {
      (this.$refs.loginDialog as unknown as dialog).show();
    },
    globalInit() {
      (this.$refs.loginDialog as unknown as dialog).hide();
      alert("Hi:)");
    },
  },
  components: {
    loginDialog,
  },
});
</script>
