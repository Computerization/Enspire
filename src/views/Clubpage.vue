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
        <ClubPageMain :club="club" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Axios from "axios";
import ClubPageMain from "../components/ClubPageMain.vue";
import { encode } from "../utils/urlTransform";

@Component({
  components: {
    ClubPageMain,
  },
})
export default class Clubpage extends Vue {
  club: Club = {
    id: 0,
    category_id: 0,
    zh_name: "",
    en_name: "",
    zh_desc: "",
    en_desc: "",
  };
  mounted(): void {
    Axios.get("getClubList.php").then((response) => {
      const name = this.$route.params.name;
      const clubs = response.data as unknown as Club[];
      const club = clubs.find((it) => encode(it.en_name) === name) as Club;
      this.club = club;
    });
  }
}
</script>
