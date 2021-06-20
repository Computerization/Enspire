<template>
  <v-app>
    <div :class="darkTheme ? 'dark-theme' : 'light-theme'">
      <Appbar
        style="z-index: 999"
        @change-theme="changeTheme"
        @toggle-sidebar="toggleSidebar"
      />
      <Sidebar :drawer="drawer" @hide-sidebar="hideSidebar" />
      <v-main>
        <v-container style="padding: 0px" fluid>
          <router-view :darkTheme="darkTheme" />
        </v-container>
      </v-main>
      <Myfooter style="z-index: 5" />
    </div>
  </v-app>
</template>

<style lang="less">
@import url(./views/css/themes.less);
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Appbar from "./components/Appbar.vue";
import Sidebar from "./components/Sidebar.vue";
import Myfooter from "./components/Footer.vue";

@Component({
  components: {
    Appbar,
    Sidebar,
    Myfooter,
  },
})
export default class App extends Vue {
  drawer = false;
  darkTheme = false;

  toggleSidebar(): void {
    this.drawer = !this.drawer;
  }
  hideSidebar(): void {
    this.drawer = false;
  }
  changeTheme(): void {
    this.darkTheme = !this.darkTheme;
  }
}
</script>
