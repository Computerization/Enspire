<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn outlined to="/clubs">
          <v-icon>mdi-arrow-left</v-icon>
          回到列表
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-img
          :src="require('@/assets/img/club/' + getId + '.png')"
          height="200"
        />
        <Club :info="info"></Club>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Club from "../components/Club.vue";
import clubInfo from "../assets/data/Club-Info.json";

export default Vue.extend({
  components: {
    Club,
  },
  computed: {
    info(): ClubInfo {
      const name = this.$route.params.name;
      const club = clubInfo
        .map((subCategory) =>
          subCategory.clubs.find((it) => it.engName === name)
        )
        .find((it) => it != null);
      if (club == null) {
        throw new Error(`Club with name '${name}' not found`);
      }
      return club;
    },
    getId(): number {
      const name = this.$route.params.name;
      const club = clubInfo
        .map((subCategory) =>
          subCategory.clubs.find((it) => it.engName === name)
        )
        .find((it) => it != null);
      if (club == null) {
        throw new Error(`Club with name '${name}' not found`);
      }
      return club.id;
    },
  },
});
</script>
