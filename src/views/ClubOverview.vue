<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>社团总览</h2>
      </v-col>
      <v-col cols="6">
        <v-text-field label="搜索名称" outlined dense />
      </v-col>
    </v-row>
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
  data: () => ({
    clubInfo: clubInfo,
  }),
});
</script>
