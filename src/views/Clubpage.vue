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
        <ClubPageMain :club="club" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ClubPageMain from "../components/ClubPageMain.vue";
import clubInfo from "../assets/data/Club-Info.json";
import { encode } from "../utils/urlTransform";

export default Vue.extend({
  components: {
    ClubPageMain,
  },
  computed: {
    club(): ClubInfo {
      const name = this.$route.params.name;
      const club = clubInfo
        .map((subCategory) =>
          subCategory.clubs.find((it) => encode(it.engName) === name)
        )
        .find((it) => it != null);
      if (club == null) {
        throw new Error(`Club with name '${name}' not found`);
      }
      return club;
    },
  },
});
</script>
