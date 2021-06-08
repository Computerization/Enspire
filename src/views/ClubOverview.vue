<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>社团总览</h2>
      </v-col>
      <v-col cols="6">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-text-field label="搜索名称" v-on="on" v-model="searchingText" @keyup="searchResult()" outlined dense />
          </template>
          <v-list v-if="resultNum > 0" class="border-list overflow-y-auto overflow-x-hidden" v-on="on" max-height="35vh" dense>
            <v-list-item v-for="item in resultList" :key="item" :to="`/clubs/${encode(item)}`">
              <v-list-item-title> {{item}} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
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
.v-menu__content {
  box-shadow: none !important;
}
.border-list {
  border: 1px solid #eee !important;
}

</style>

<script lang="ts">
import Vue from "vue";
import clubInfo from "../assets/data/Club-Info.json";
import ClubCard from "../components/ClubCard.vue";
import { encode } from "../utils/urlTransform";

export default Vue.extend({
  components: {
    ClubCard: ClubCard,
  },
  data: () => ({
    a: [],
    clubInfo: clubInfo,
    visible: [false, true, false, false, false, false],
    lengths: [0, 12, 30, 39, 45, 72],
    inSearchList: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    resultNum: 0,
    searchingText: "",
    resultList: new Array<string>(),
  }),
  methods: {
    toggleSection: function (index: number) {
      this.visible = this.visible.map((e, i) => (i === index ? !e : e));
    },
    searchResult: function() {
      var text:string = this.searchingText;
      if(text == "") {
        this.inSearchList = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        this.searchList();
        return;
      }
      this.resultNum = 0;
      for(var i = 0; i < 6; ++i) {
        for(var id in clubInfo[i].clubs) {
          var club : ClubInfo = clubInfo[i].clubs[id];
          var eng_result: boolean = club.engName.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) != -1;
          var chn_result: boolean = club.chnName.indexOf(text) != -1;
          var result: boolean = eng_result || chn_result;
          var realid: number = this.lengths[i] + Number.parseInt(id);
          this.inSearchList[realid] = result;
          if(result) this.resultNum ++;
        }
      }
      this.searchList();
    },
    showThisClub(eName: string): boolean {
      var show = false;
      for(var i = 0; i < 6; ++i) {
        for(var id in clubInfo[i].clubs) {
          var club : ClubInfo = clubInfo[i].clubs[id];
          if(club.engName == eName){
            var realid: number = this.lengths[i] + Number.parseInt(id);
            show = this.inSearchList[realid];
          }
        }
      }
      return show;
    },
    searchList: function() {
      var resultArray: Array<string> = new Array<string>();
      for(var i = 0; i < 6; ++i) {
        for(var id in clubInfo[i].clubs) {
          var club : ClubInfo = clubInfo[i].clubs[id];
          if(this.showThisClub(club.engName)){
            resultArray.push(club.engName);
          }
        }
      }
      this.resultList = resultArray;
    },
    encode: encode,
  },
});
</script>
