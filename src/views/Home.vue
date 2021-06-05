<template>
  <div class="home" id="mainpage">
    <div class="art-welcome">
      <div class="art-title">
        <h1 class="art-titleTx1">Welcome to</h1>
        <h1 class="art-titleTx2">Enspire</h1>
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
  src: url("../assets/fonts/Britannic_Bold_T.ttf");
}

.art-welcome {
  margin-top: 4.5vw;
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
  font-size: 4vw;
  color: #79b2be;
}
.art-titleTx2 {
  font-size: 11vw;
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
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      banners: [
        {
          src: require("../assets/img/Enspire-logo.svg"),
        },
        {
          src: require("../assets/img/Josh-Cena-avatar.jpg"),
        },
      ],
    };
  },
});
</script>
