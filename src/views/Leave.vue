<template>
  <v-card elevation="4" outlined>
    <v-card-actions>
      <monthpicker @changeMonth="changeMonth"></monthpicker>
    </v-card-actions>
    <div class="calendar-con">
      <calendar :time="time"></calendar>
    </div>
  </v-card>
</template>

<script>
import Monthpicker from "./../components/Monthpicker.vue";
import Calendar from "./../components/Calendar.vue";
export default {
  components: {
    monthpicker: Monthpicker,
    calendar: Calendar,
  },
  data() {
    return {
      time: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
      },
    };
  },
  methods: {
    changeMonth(time) {
      this.time = time;
    },
  },
};
</script>
<style lang="less" scoped>
.month-con {
  font-weight: 700;
  font-size: 18px;
  .month {
    margin: 0 10px;
  }
}
.calendar-con {
  margin-top: 20px;
}
</style>