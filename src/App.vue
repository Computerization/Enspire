<template>
  <v-app>
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
