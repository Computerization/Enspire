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

<script>
export default {
  data () {
    return {
      type: 'month',
      typeOptions: [
        { text: 'Day', value: 'day' },
        { text: 'Week', value: 'week' },
        { text: 'Month', value: 'month' }
      ]
    }
  },
  methods: {
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    calendarNext () {
      this.$refs.calendar.next()
    }
  }
}
</script>

<style scoped>

</style>
