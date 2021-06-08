<template>
  <v-container>
    <v-row>
      <v-col>
        <v-img :src="logoUrl" height="200" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          {{ club.zh_name }}
          <small>{{ club.en_name }}</small>
        </h1>
        <p class="subheading font-weight-regular" style="white-space: pre-wrap">
          {{ club.zh_desc }}
        </p>
        <p class="subheading font-weight-regular" style="white-space: pre-wrap">
          {{ club.en_desc }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import fetchImg from "../utils/fetchImg";

export default class ClubPageMain extends Vue {
  logoUrl = "";
  props = {
    club: Object as PropType<Club>,
  };

  mounted(): void {
    this.logoUrl = fetchImg(
      `club/${this.$props.club.id}.png`,
      "club/not-found.png"
    );
  }
}
</script>
