<template>
  <v-app>
    <appbar @toggle-sidebar="toggleSidebar" />
    <sidebar :drawer="drawer" @hide-sidebar="hideSidebar" />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <myfooter />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import appbar from "./components/Appbar.vue";
import sidebar from "./components/Sidebar.vue";
import myfooter from "./components/Footer.vue";

export default Vue.extend({
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    toggleSidebar: function () {
      this.drawer = !this.drawer;
    },
    hideSidebar: function () {
      this.drawer = false;
    },
  },
  components: {
    appbar,
    sidebar,
    myfooter,
  },
});
</script>
