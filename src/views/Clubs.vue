<template>
  <v-container>
    <v-row v-for="index in 6" :key="index">
      <v-subheader>{{ clubInfo[index - 1].catName }}</v-subheader>
      <v-container fluid>
        <v-row>
          <v-col
            v-for="item in clubInfo[index - 1].clubs"
            :key="item.engName"
            align="center"
          >
            <v-card width="370" align="left" :to="`/clubpage/${item.engName}`">
              <v-img
                :src="`https://cdn.vuetifyjs.com/images/cards/cooking.png`"
                height="200"
              />
              <v-card-title>{{ item.chnName }}</v-card-title>
              <v-card-text>
                <div>
                  {{
                    item.chnDesc === ""
                      ? "暂无介绍"
                      : item.chnDesc.substring(0, 90) +
                        (item.chnDesc.length > 90 ? "..." : "")
                  }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import clubInfo from "../assets/data/Club-Info.json";

export default Vue.extend({
  data: () => ({
    clubInfo: clubInfo,
  }),
});
</script>
