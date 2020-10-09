<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn outlined to="/clubs">
          <v-icon>mdi-arrow-left</v-icon>
          回到列表
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <Club :info="info"></Club>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Club from "@/components/Club.vue";
import clubInfo from "@/assets/data/Club-Info.json";

export default {
  components: {
    Club
  },
  data: () => ({
    info: null
  }),
  mounted() {
    let name = this.$route.params.name;
    for (let i = 0; i < 6; i++) {
      for (let club of clubInfo[i]) {
        if (club.engName == name) {
          this.info = club;
        }
      }
    }
  }
};
</script>
