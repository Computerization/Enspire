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
        style="height: 4vh; width: 11vh; font-size: 2vh"
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

<style lang="less" scoped>
@import url(../views/css/themes.less);

.theme(@theme) {
  @bg: "@{theme}-bg";
  @outline: "@{theme}-outline";
  @footer-bg: "@{theme}-footer-bg";
  @footer-tx: "@{theme}-footer-tx";
  @footer-button: "@{theme}-footer-button";

  .art-footer {
    background-color: @@footer-bg !important;
    padding: 2.5vh 0px 2.5vh 0px;
    border: solid 1px @@outline;
  }
  .art-footerTx1 {
    color: @@footer-tx !important;
    letter-spacing: -0.3px;
    height: 2.5vh;
    line-height: 2.5vh;
    font-size: 2vh;
  }
  .art-footerBt1 {
    background-color: @@footer-button;
    color: @@footer-bg;
    margin-bottom: 1.5vh;
  }
}

.light-theme {
  .theme(li);
}
/* .dark-theme {
  .theme(da);
} */
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
