<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>社团总览</h2>
      </v-col>
      <v-col cols="6">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-text-field
              label="搜索名称"
              v-on="on"
              v-model="searchingText"
              @keyup="searchResult()"
              outlined
              dense
            />
          </template>
          <v-list
            v-if="resultNum > 0"
            class="border-list overflow-y-auto overflow-x-hidden"
            v-on="on"
            max-height="35vh"
            dense
          >
            <v-list-item
              v-for="item in resultList"
              :key="item"
              :to="`/clubs/${encode(item)}`"
            >
              <v-list-item-title> {{ item }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
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
import { encode } from "../utils/urlTransform";

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

  encode = encode;

  resultNum = 0;

  searchingText = "";

  resultList: Array<string> = new Array<string>();

  clubList: Array<Club> = new Array<Club>();

  toggleSection(index: number): void {
    this.categories = this.categories.map((e, i) =>
      i === index ? { ...e, visible: !e.visible } : e
    );
  }

  searchResult(): void {
    var text: string = this.searchingText;
    this.resultList = new Array<string>();
    if (text == "") {
      return;
    }
    this.resultNum = 0;
    for (var id in this.clubList) {
      var club: Club = this.clubList[id];
      var en_result: boolean =
        club.en_name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) !=
        -1;
      var zh_result: boolean = club.zh_name.indexOf(text) != -1;
      var result: boolean = en_result || zh_result;
      if (result) {
        this.resultList.push(club.en_name);
        this.resultNum++;
      }
    }
  }

  mounted(): void {
    Axios.get("getClubList.php").then((response) => {
      const clubList = response.data as Club[];
      this.clubList = clubList;
      console.log(clubList);
      this.categories = this.categories.map((cat, i) => {
        return { ...cat, clubs: clubList.filter((e) => e.category_id === i) };
      });
      this.dataLoaded = true;
    });
  }
}
</script>
