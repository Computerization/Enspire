<template>
  <v-container>
    <v-row>
      <v-col>
        <v-container fluid>
          <v-layout box>
            <v-flex xs3 item1 align="center" :align-self-center="true">
              <v-img :src="logoUrl" contain height="200" width="300" />
            </v-flex>
            <v-flex item2 align="left" :align-self-center="true">
              <h1 class="display-2 font-weight-bold mb-3">
                {{ club.chnName }}
                <br />
                <small>{{ club.engName }}</small>
              </h1>
            </v-flex>
          </v-layout>
        </v-container>
        <!--
        <v-simple-table>
          <table>
            <tbody>
              <tr>
                <td width="320" height="200">
                  <v-img :src="logoUrl" contain height="200" width="300" />
                </td>
                <td>
                  <h1 class="display-2 font-weight-bold mb-3">
                    {{ club.chnName }}
                    <br />
                    <small>{{ club.engName }}</small>
                  </h1>
                </td>
              </tr>
            </tbody>
          </table>
        </v-simple-table>
        -->
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mb-4">
        <p class="subheading font-weight-regular" style="white-space: pre-wrap">
          {{ club.chnDesc }}
        </p>
        <p class="subheading font-weight-regular" style="white-space: pre-wrap">
          {{ club.engDesc }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import fetchImg from "../utils/fetchImg";

export default Vue.extend({
  name: "Club",
  props: {
    club: Object as PropType<ClubInfo>,
  },
  data() {
    return {
      logoUrl: "",
    };
  },
  mounted: function () {
    this.logoUrl = fetchImg(
      `club/${this.$props.club.id}.png`,
      "club/not-found.png"
    );
  },
});
</script>
