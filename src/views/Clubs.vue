<template>
  <v-container>
    <v-row v-for="index in 7" :key="index">
      <v-subheader>{{ catName[index - 1] }}</v-subheader>
      <v-container fluid>
        <v-row>
          <v-col
            v-for="item in clubs[index - 1]"
            :key="item.name"
            align="center"
          >
            <v-card width="370" align="left">
              <v-img
                :src="`https://cdn.vuetifyjs.com/images/cards/cooking.png`"
                height="200"
              />
              <v-card-title>{{ item.chnName }}</v-card-title>
              <v-card-text>
                <div>
                  {{
                    item.chnDesc == 0
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

<script>
import clubInfo from "@/assets/data/Club-Info.json";

export default {
  data: () => ({
    catName: [
      "体育类社团",
      "服务类社团",
      "艺术类社团",
      "生活类社团",
      "学术类社团",
      "其他"
    ],
    clubs: clubInfo
  })
};
</script>
