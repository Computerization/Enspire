<template>
  <v-app>
    <appbar @toggle-sidebar="toggleSidebar" />
    <sidebar v-model="drawer" />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <myfooter />
  </v-app>
</template>

<style scoped>
.container {
  padding: 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import appbar from "./components/Appbar.vue";
import sidebar from "./components/Sidebar.vue";
import myfooter from "./components/Footer.vue";

export default Vue.extend({
  data: () => ({
    drawer: false,
  }),
  methods: {
    toggleSidebar: function () {
      this.drawer = !this.drawer;
      console.log(this.drawer);
    },
  },
  components: {
    appbar,
    sidebar,
    myfooter,
  },
});
</script>
