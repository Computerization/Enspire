<template>
  <div class="home" id="mainpage">
    <div class="art-welcome">
      <div class="art-title">
        <div class="art-titleTx1">Welcome to</div>
        <div class="art-titleTx2">Enspire</div>
      </div>
      <v-carousel
        class="art-banner"
        height="200"
        show-arrows-on-hover
        cycle="cycle"
        hide-delimiter-background
        hide-delimiters
      >
        <v-carousel-item v-for="(banner, i) in banners" :key="i">
          <img :src="banner.src" style="height: 20vw; width: auto" />
        </v-carousel-item>
      </v-carousel>
    </div>
    <div class="art-components">
      <div class="art-news">
        <div class="art-Ntitle">News</div>
        <v-row class="art-row"> test N </v-row>
        <v-row class="art-row"> test N2 </v-row>
        <v-row class="art-row">
          test Overflow
          222222222222222222222222222222222222222222222222222222222222222
        </v-row>
      </div>
      <div class="art-community">
        <div class="art-Ctitle">Community</div>
        <v-row class="art-row"> test C </v-row>
        <v-row class="art-row"> test C2 </v-row>
      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: title;
  src: url("../assets/fonts/impact.ttf");
}

.home {
  display: block;
}
.art-welcome {
  width: 100vw;
  height: 32vw;
  box-shadow: 0px 0px 3vw 2vw rgba(0, 0, 0, 0.021);
}
.art-title {
  text-align: left;
  width: 37vw;
  height: 15vw;
  margin: 6vw 0 0 5vw;
  line-height: 7.5vw;
  font-family: title;
  float: left;
}
.art-titleTx1 {
  font-size: 5vw;
  color: #79b2be;
}
.art-titleTx2 {
  font-size: 12vw;
  color: #0696b5;
}
.art-banner {
  margin-top: 6vw;
  width: 53vw;
  height: 20vw !important;
  float: right;
  border-radius: 1vw;
  box-shadow: 0 0 0px 0.5px rgba(0, 0, 0, 0.11);
  text-align: center;
}
.art-components {
  background-color: #ebba36;
  width: 100vw;
  height: auto;
  padding: 3.5vw 4vw 4vw 4vw;
}
.art-news,
.art-community {
  display: inline-block;
  vertical-align: top;
  padding: 1vw 2vw 2vw 2vw;
  height: auto;
  background: #ffffff;
  border-radius: 1.5vw;
  box-shadow: 0 0 1vw 0.3vw rgba(0, 0, 0, 0.068);
}
.art-news {
  width: 50vw;
  margin: 0px;
}
.art-community {
  width: 35vw;
  margin: 0 0 0 4vw;
}
.art-Ntitle,
.art-Ctitle {
  font-family: title;
  color: #066d85;
  font-size: 3vw;
}
.art-row {
  background-color: rgb(237, 241, 243);
  margin: 0 0 3px 0;
  padding: 1px 3px 3px 1px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  banners = [
    { src: require("../assets/img/Enspire-logo.svg") },
    { src: require("../assets/img/Josh-Cena-avatar.jpg") },
  ];
}
</script>
