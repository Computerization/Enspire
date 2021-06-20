<template>
  <v-app :class="darkTheme ? 'dark-theme' : 'light-theme'">
    <Appbar style="z-index: 999" @toggle-sidebar="toggleSidebar" />
    <Sidebar :drawer="drawer" @hide-sidebar="hideSidebar" />
    <v-main>
      <v-container style="padding: 0px" fluid>
        <router-view />
      </v-container>
    </v-main>
    <Myfooter style="z-index: 5" />
  </v-app>
</template>

<style lang="less">
@li-bg: #ffffff;
@li-bg-yellow: #ebbb36;
@li-outline: #e4e4e4;
@li-footer-bg: #f9fbfb;
@li-footer-tx: #126b77;
@li-footer-button: #1baec1;
@li-card-bg: #e4e8eb7f; //rgba(228, 232, 235, 0.5)
@li-card-bg-hover: #e4e8ebe8; //rgba(228, 232, 235, 0.911)
@li-title: #0696b5;
@li-title-dark: #066d85;
@li-subtitle: #79b2be;
@li-switch: #00000007; //rgba(0, 0, 0, 0.03)
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

  toggleSidebar(): void {
    this.drawer = !this.drawer;
  }
  hideSidebar(): void {
    this.drawer = false;
  }
}
</script>
