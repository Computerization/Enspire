<template>
  <div class="home" id="mainpage">
    <div class="art-welcome">
      <div class="art-title">
        <div class="art-titleTx1">Welcome to</div>
        <div class="art-titleTx2">Enspire</div>
      </div>
      <v-carousel class="art-banner">
        <v-carousel-item v-for="(banner, i) in banners" :key="i">
          <img :src="banner.src" style="height: 20vw; width: auto" />
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: title;
  src: url("../assets/fonts/impact.ttf");
}

.art-welcome {
  margin-top: 3vh;
  width: 100vw;
  height: 18.5vw;
}
.art-title {
  text-align: left;
  width: 37vw;
  height: 15vw;
  margin: 1.5vw 0 0 5vw;
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
  width: 53vw;
  height: 20vw !important;
  float: right;
  border-radius: 1vw;
  outline: #e4e4e4 1px;
  text-align: center;
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
