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
  background-color: #303846 !important;
  padding: 45px 0px 23px 0px;
}
.art-footerTx1 {
  color: #f9fbfb !important;
  letter-spacing: -0.3px;
  height: 25px;
  line-height: 27px;
}
.art-footerBt1 {
  color: #f9fbfb;
  margin-bottom: 10px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Footer extends Vue {
  links = [
    { title: "GitHub", src: "https://github.com/Computerization/Enspire" },
  ];
}
</script>
