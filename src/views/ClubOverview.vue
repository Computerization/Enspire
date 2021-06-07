<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>社团总览</h2>
      </v-col>
      <!-- <v-col cols="6">
        <v-text-field label="搜索名称" outlined dense />
      </v-col> -->
    </v-row>
    <v-row v-for="(category, index) in clubInfo" :key="index">
      <v-subheader class="sectionHead" @click="toggleSection(index)">
        <v-icon>{{
          visible[index] ? "mdi-menu-down" : "mdi-menu-right"
        }}</v-icon>
        {{ category.catName }}
      </v-subheader>
      <v-container fluid v-if="visible[index]">
        <v-row>
          <Club-card
            v-for="item in category.clubs"
            :key="item.id"
            :club="item"
          />
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<style scoped>
.sectionHead {
  cursor: pointer;
}
</style>

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
    visible: [false, true, false, false, false, false],
  }),
  methods: {
    toggleSection: function (index: number) {
      this.visible = this.visible.map((e, i) => (i === index ? !e : e));
    },
  },
});
</script>
