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
        <v-card
          elevation="0"
          v-for="(N, i) in Ncards"
          :key="i"
          class="art-Ncard"
        >
          <v-card-title
            style="font-size: 1rem; line-height: 1.25rem; padding: 0.5rem"
          >
            {{ N.title }}
          </v-card-title>
          <v-card-subtitle
            style="font-size: 0.75rem; line-height: 1rem; padding: 0.5rem"
          >
            {{ N.content }}
          </v-card-subtitle>
        </v-card>
      </div>
      <div class="art-community">
        <div class="art-Ctitle">Community</div>
        <v-card
          elevation="0"
          v-for="(C, i) in Ccards"
          :key="i"
          class="art-Ccard"
        >
          <v-card-title
            style="font-size: 1rem; line-height: 1.25rem; padding: 0.5rem"
          >
            {{ C.title }}
          </v-card-title>
          <v-card-subtitle
            style="font-size: 0.75rem; line-height: 1rem; padding: 0.5rem"
          >
            {{ C.content }}
          </v-card-subtitle>
        </v-card>
      </div>
    </div>
    <div class="art-decoBar"></div>
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
  position: relative;
  width: 100vw;
  height: 32vw;
  box-shadow: 0px 0px 2vw 1.5vw rgba(0, 0, 0, 0.089);
  z-index: 1;
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
  position: relative;
  background-color: #ebba36;
  width: 100vw;
  height: auto;
  padding: 3.5vw 4vw 4vw 4vw;
  z-index: 0;
}
.art-news,
.art-community {
  display: inline-block;
  vertical-align: top;
  padding: 1.5vw 2vw 2vw 2vw;
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
  margin: 0 0 0 5vw;
}
.art-Ntitle,
.art-Ctitle {
  font-family: title;
  color: #066d85;
  font-size: 1.5rem;
  margin-bottom: 6px;
}
.art-Ccard,
.art-Ncard {
  background-color: rgb(237, 241, 243);
  margin: 0 0 5px 0;
  padding: 1px 3px 3px 1px;
  overflow: hidden;
}
.art-decoBar {
  position: relative;
  width: 100vw;
  height: 50vh;
  box-shadow: 0px 0px 2vw 1.5vw rgba(0, 0, 0, 0.068);
  z-index: 1;
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
  Ncards = [
    { title: "test1", content: "test1-C" },
    { title: "test2", content: "test2-C" },
    {
      title: "testOverflow",
      content:
        "333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333",
    },
  ];
  Ccards = [
    { title: "test1", content: "test1-C" },
    { title: "test2", content: "test2-C" },
    {
      title: "testOverflow",
      content:
        "333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333",
    },
  ];
}
</script>
