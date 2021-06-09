<template>
  <v-container>
    <h1>提交请假单</h1>
    <v-row>
      <v-col>
        <v-text-field></v-text-field>
      </v-col>
      <v-col>
        <v-text-field></v-text-field>
      </v-col>
      <v-col>
        <v-text-field></v-text-field>
      </v-col>
      <v-col>
        <v-text-field></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Selfstudy extends Vue {}
</script>
