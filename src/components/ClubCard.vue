<template>
  <v-col align="center">
    <v-card width="370" align="left" :to="`/clubs/${encode(club.engName)}`">
      <v-img :src="imgUrl" contain height="200" />
      <v-card-title>{{ club.chnName }}</v-card-title>
      <v-card-text>
        <div>
          {{
            club.chnDesc === ""
              ? "暂无介绍"
              : club.chnDesc.substring(0, 90) +
                (club.chnDesc.length > 90 ? "..." : "")
          }}
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { encode } from "../utils/urlTransform";

export default Vue.extend({
  name: "ClubCard",
  props: {
    club: Object as PropType<ClubInfo>,
  },
  data: function () {
    return {
      imgUrl: require("@/assets/img/club/not-found.png"),
    };
  },
  mounted() {
    try {
      this.imgUrl = require(`@/assets/img/club/${this.$props.club.id}.png`);
    } catch (e) {
      this.imgUrl = require("@/assets/img/club/not-found.png");
    }
  },
  methods: {
    encode: encode,
  },
});
</script>
