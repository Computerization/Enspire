<template>
  <v-container>
    <v-row>
      <v-col>
        <v-img
          :src="logoUrl"
          height="200"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          {{ club.chnName }}
          <small>{{ club.engName }}</small>
        </h1>
        <p class="subheading font-weight-regular" style="white-space: pre-wrap">
          {{ club.chnDesc }}
        </p>
        <p class="subheading font-weight-regular" style="white-space: pre-wrap">
          {{ club.engDesc }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import fetchImg from "../utils/fetchImg";

export default Vue.extend({
  name: "Club",
  props: {
    club: Object as PropType<ClubInfo>,
  },
  data() {
    return {
      logoUrl: "",
    };
  },
  mounted: function () {
    this.logoUrl = fetchImg(
      `club/${this.$props.club.id}.png`,
      "club/not-found.png"
    );
  },
});
</script>
