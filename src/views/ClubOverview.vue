<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>社团总览</h2>
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="搜索名称"
          v-model="searchText"
          @keyup="search"
          outlined
          dense
        />
      </v-col>
    </v-row>
    <template v-if="dataLoaded && searchText.trim() !== ''">
      <v-row>
        <v-container fluid>
          <v-row>
            <Club-card v-for="item in resultList" :key="item.id" :club="item" />
          </v-row>
        </v-container>
      </v-row>
    </template>
    <template v-else-if="dataLoaded">
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
          </v-row>
        </v-container>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <p>Loading...</p>
        </v-col>
      </v-row>
    </template>
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
import { pinyin } from "pinyin-pro";

import ClubCard from "../components/ClubCard.vue";
import { encode } from "../utils/urlTransform";

// eslint-disable-next-line new-cap
@Component({
  components: {
    ClubCard,
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
  searchText = "";
  resultList: Club[] = [];
  clubList: Club[] = [];
  encode = encode;

  toggleSection(index: number): void {
    this.categories = this.categories.map((e, i) => i === index ? { ...e, visible: !e.visible } : e);
  }

  search(): void {
    const text = this.searchText.trim().toLowerCase();
    if (text === "")
      return;
    this.resultList = this.clubList.filter((club) => {
      const allText = [
        club.en_name.toLowerCase(),
        club.zh_name.toLowerCase(),
        club.pinyin_name,
      ];
      return allText.filter((entry) => entry.indexOf(text) !== -1).length > 0;
    });
  }

  mounted(): void {
    Axios.get("getClubList.php").then((response) => {
      const clubList = response.data as Club[];
      this.clubList = clubList.map((club) => ({
        ...club,
        // To conform with API from backend
        // eslint-disable-next-line camelcase
        pinyin_name: pinyin(club.zh_name, { toneType: "none" }).replaceAll(/\s/g, ""),
      }));
      this.categories = this.categories.map((cat, i) => (
        { ...cat, clubs: clubList.filter((e) => e.category_id === i) }
      ));
      this.dataLoaded = true;
    });
  }

}
</script>
