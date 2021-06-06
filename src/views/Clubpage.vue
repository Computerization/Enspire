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
      const id = Number(this.$route.params.id);
      const club = clubInfo
        .map((subCategory) => subCategory.clubs.find((it) => it.id === id))
        .find((it) => it != null);
      if (club == null) {
        throw new Error(`Club with id '${id}' not found`);
      }
      return club;
    },
  },
});
</script>
