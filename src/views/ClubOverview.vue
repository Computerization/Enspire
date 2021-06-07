<template>
  <v-container>
    <v-row v-for="(category, index) in clubInfo" :key="index">
      <v-subheader>{{ category.catName }}</v-subheader>
      <v-container fluid>
        <v-row>
          <club-card
            v-for="item in category.clubs"
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
  data() {
    return {
      clubInfo: clubInfo,
    };
  },
});
</script>
