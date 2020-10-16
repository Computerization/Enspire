<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          {{ info.chnName }}
          <small>{{ info.engName }}</small>
        </h1>
        <p class="subheading font-weight-regular" style="white-space: pre-wrap">
          {{ info.chnDesc }}
        </p>
        <p class="subheading font-weight-regular" style="white-space: pre-wrap">
          {{ info.engDesc }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Club",
  props: {
    info: Object
  }
};
</script>
