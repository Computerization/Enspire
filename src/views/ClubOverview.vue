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
    <v-row v-for="(category, index) in categories" :key="index">
      <v-subheader class="sectionHead" @click="toggleSection(index)">
        <v-icon>
          {{ categories[index].visible ? "mdi-menu-down" : "mdi-menu-right" }}
        </v-icon>
        {{ category.name }}
      </v-subheader>
      <v-container fluid v-if="categories[index].visible">
        <v-row>
          <Club-card
            v-for="item in category.clubs"
            :key="item.id"
            :club="item"
          />
          <v-col>
            <p v-if="categories[index].visible && !dataLoaded">Loading...</p>
          </v-col>
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
import { Component, Vue } from "vue-property-decorator";
import Axios from "axios";
import ClubCard from "../components/ClubCard.vue";

@Component({
  components: {
    ClubCard: ClubCard,
  },
})
export default class ClubOverview extends Vue {
  categories: { name: string; visible: boolean; clubs: Club[] }[] = [
    { name: "体育类社团", visible: false, clubs: [] },
    { name: "服务类社团", visible: true, clubs: [] },
    { name: "艺术类社团", visible: false, clubs: [] },
    { name: "生活类社团", visible: false, clubs: [] },
    { name: "学术类社团", visible: false, clubs: [] },
    { name: "其他", visible: false, clubs: [] },
  ];
  dataLoaded = false;

  toggleSection(index: number): void {
    this.categories = this.categories.map((e, i) =>
      i === index ? { ...e, visible: !e.visible } : e
    );
  }
  mounted(): void {
    Axios.get("getClubList.php").then((response) => {
      const clubList = response.data as Club[];
      this.categories = this.categories.map((cat, i) => {
        return { ...cat, clubs: clubList.filter((e) => e.category_id === i) };
      });
      this.dataLoaded = true;
    });
  }
}
</script>
