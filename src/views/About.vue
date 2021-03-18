<template>
  <div class="about">
    <v-container>
      <v-row>
        <v-subheader>贡献者们</v-subheader>
      </v-row>
      <v-row>
        <v-col v-for="person in contributors" :key="person.alias">
          <v-card class="mx-auto" max-width="300" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">C社2020</div>
                <v-list-item-title class="headline mb-1">
                  {{ person.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ person.desc }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-avatar size="100">
                <img
                  :src="require('@/assets/img/' + person.alias + '-avatar.jpg')"
                  :alt="person.alias"
                />
              </v-list-item-avatar>
            </v-list-item>
            <v-card-actions class="white justify-center">
              <v-btn
                icon
                :href="'https://github.com/' + person.alias"
                target="_blank"
              >
                <v-icon>mdi-link</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "about",
  data: () => ({
    contributors: [
      {
        alias: "Josh-Cena",
        name: "陈思达",
        desc: "22届Web部负责人",
      },
      {
        alias: "yechs",
        name: "舒烨",
        desc: "20届社长",
      },
      {
        alias: "JoyceQu",
        name: "曲乐成",
        desc: "22届美工",
      },
      {
        alias: "Will-WHT",
        name: "王昊天",
        desc: "22届社长",
      },
      {
        alias: "ETwilight",
        name: "郭培扬",
        desc: "22届副社长",
      },
      {
        alias: "edgexyz",
        name: "杨书",
        desc: "22届后端（伪）",
      },
    ],
  }),
});
</script>
