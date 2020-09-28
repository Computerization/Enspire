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
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Enspire
          </v-list-item-title>
          <v-list-item-subtitle>
            Make CAS great again
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="primary--text text--accent-4"
        >
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
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.logo {
  border-radius: 20%;
  background-color: white;
  margin-left: 20px;
}
</style>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    drawerItems: [
      { title: "首页", icon: "mdi-home", to: "/" },
      { title: "关于我们", icon: "mdi-information", to: "/about" },
      { title: "预约教室", icon: "mdi-view-dashboard", to: "/reservation" },
      { title: "相册", icon: "mdi-image", to: "/album" }
    ]
  }),
  watch: {
    group() {
      this.drawer = false;
    }
  }
};
</script>
