<template>
  <v-card class="pa-5">
    <v-card-title>请假单</v-card-title>
    <div class="text">
      <p>To whom it may concern:</p>
      <p>
        <span class="field">{{ name }}</span> (student id:
        <span class="field">{{ studentId }}</span
        >) would like to request a leave during period
        <span class="field">{{ this.$props.period + 1 }}</span> on
        <span class="field">{{ stringifyDate(this.$props.date) }}</span>
        for
        <span class="field" v-if="application">
          {{ application.reason }}
        </span>
        <v-text-field v-else dense label="事由" v-model="reason" required />.
      </p>
      <p>
        Date:
        {{
          (application
            ? application.submissionDate
            : new Date()
          ).toLocaleDateString("en-ZA")
        }}
        <br />
        Teacher:
        <span class="field" v-if="application">
          {{ application.teacher }}
        </span>
        <v-text-field v-else dense label="教师名" v-model="teacher" required />
      </p>
    </div>
    <v-card-actions>
      <v-spacer />
      <span v-if="application"
        >状态：<span class="status">{{ application.status }}</span></span
      >
      <v-btn v-else color="success" @click="submit()">提交</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.field {
  font-size: larger;
  font-weight: bold;
  padding: 0px 5px;
  border-bottom: 1px solid black;
}

.v-text-field {
  display: inline-block;
  margin-bottom: -10px;
}

.text {
  padding: 16px;
  line-height: 2;
}

.status {
  height: 36px;
  display: inline-block;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { stringifyDate } from "../utils/dateUtils";

@Component
export default class LeaveApplication extends Vue {
  @Prop() name!: string;
  @Prop() studentId!: number;
  @Prop() period!: number;
  @Prop() date!: Date;
  @Prop() application!: application | undefined;

  reason = "";
  teacher = "";

  stringifyDate = stringifyDate;

  submit(): void {
    const date = this.date;
    const period = this.period;
    const reason = this.reason;
    const teacher = this.teacher;
    console.log(date, period, reason, teacher);
  }
}
</script>
