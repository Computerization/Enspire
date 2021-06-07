<template>
  <v-container>
    <v-row v-for="index in 6" :key="index">
      <v-subheader>{{ clubInfo[index - 1].catName }}</v-subheader>
      <v-container fluid>
        <v-row>
          <club-card
            v-for="item in clubInfo[index - 1].clubs"
            :key="item.id"
            :club="item"
          />
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import clubInfo from "../assets/data/Club-Info.json";
import ClubCard from "../components/ClubCard.vue";

export default Vue.extend({
  components: {
    ClubCard: ClubCard,
  },
  data: () => ({
    clubInfo: clubInfo,
  }),
});
</script>
