<template>
  <v-layout wrap>
    <v-flex xs12 class="mb-3">
      <v-sheet height="500">
        <v-calendar ref="calendar" :type="type" color="primary"></v-calendar>
      </v-sheet>
    </v-flex>

    <v-flex sm4 xs12 class="text-sm-left text-xs-center">
      <v-btn @click="calendarPrev()">
        <v-icon dark left>mdi-arrow-left</v-icon>
        Prev
      </v-btn>
    </v-flex>
    <v-flex sm4 xs12 class="text-xs-center">
      <v-select v-model="type" :items="typeOptions" label="Type"></v-select>
    </v-flex>
    <v-flex sm4 xs12 class="text-sm-right text-xs-center">
      <v-btn @click="calendarNext()">
        Next
        <v-icon right dark>mdi-arrow-right</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

type Calendar = {
  prev: () => void;
  next: () => void;
} & Vue;

@Component
export default class Reservation extends Vue {
  type = "month";
  typeOptions = [
    { text: "Day", value: "day" },
    { text: "Week", value: "week" },
    { text: "Month", value: "month" },
  ];
  $refs!: {
    calendar: Calendar;
  };

  calendarPrev(): void {
    this.$refs.calendar.prev();
  }
  calendarNext(): void {
    this.$refs.calendar.next();
  }
}
</script>
