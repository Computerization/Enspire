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
      <v-card-actions>
        <v-spacer />
        <v-btn
          icon
          v-if="club.services && club.services.website"
          :href="`${club.services.website}`"
          @click.stop=""
          target="_blank"
          rel="noreferer"
        >
          <v-icon>mdi-web</v-icon>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import fetchImg from "../utils/fetchImg";
import { encode } from "../utils/urlTransform";

export default Vue.extend({
  name: "ClubCard",
  props: {
    club: Object as PropType<ClubInfo>,
  },
  data: function () {
    return {
      imgUrl: "",
    };
  },
  mounted() {
    this.imgUrl = fetchImg(
      `club/${this.$props.club.id}.png`,
      "club/not-found.png"
    );
  },
  methods: {
    encode: encode,
  },
});
</script>
