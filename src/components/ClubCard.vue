<template>
  <v-col align="center" class="d-flex flex-column">
    <v-card
      width="370"
      align="left"
      :to="`/clubs/${encode(club.en_name)}`"
      class="flex"
    >
      <v-img :src="imgUrl" contain height="200" />
      <v-card-title>{{ club.zh_name }}</v-card-title>
      <v-card-text>
        <div>
          {{
            club.zh_desc === ""
              ? "暂无介绍"
              : club.zh_desc.substring(0, 90) +
                (club.zh_desc.length > 90 ? "..." : "")
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

export default class ClubCard extends Vue {
  imgUrl = "";
  props = {
    club: Object as PropType<Club>,
  };
  encode = encode;
  mounted(): void {
    this.imgUrl = fetchImg(
      `club/${this.$props.club.id}.png`,
      "club/not-found.png"
    );
  }
}
</script>
