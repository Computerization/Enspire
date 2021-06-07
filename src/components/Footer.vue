<template>
  <v-footer class="art-footer">
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in links"
        :key="link.title"
        text
        rounded
        class="art-footerBt1"
        :href="link.src"
      >
        {{ link.title }}
      </v-btn>
      <v-col class="text-center art-footerTx1" cols="12">
        Copyright © {{ new Date().getFullYear() }} Computerization. Built with
        Vue.
      </v-col>
    </v-row>
  </v-footer>
</template>

<style scoped>
.art-footer {
  background-color: #f9fbfb !important;
  padding: 23px 0px 23px 0px;
  border: solid 1px #e4e4e4;
}
.art-footerTx1 {
  color: #126b77 !important;
  letter-spacing: -0.3px;
  height: 25px;
  line-height: 27px;
}
.art-footerBt1 {
  background-color: #1baec1;
  color: #f9fbfb;
  margin-bottom: 10px;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    links: [
      { title: "GitHub", src: "https://github.com/Computerization/Enspire" },
    ],
  }),
});
</script>
