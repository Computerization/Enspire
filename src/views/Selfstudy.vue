<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>提交请假单</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="7">
        <v-card class="pa-5">
          <v-card-title>请假单</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field outlined dense label="姓名" />
              <v-text-field outlined dense label="班级" />
              <v-text-field outlined dense label="时间" />
              <v-text-field outlined dense label="事由" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="success">提交</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card class="pa-5">
          <v-card-title>
            我的课表（{{ transformBoundaries(getWeekBoundaries(new Date())) }}）
          </v-card-title>
          <v-card-text>
            <table class="schedule">
              <thead>
                <th></th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
              </thead>
              <tbody>
                <tr v-for="(row, ind) in schedule" :key="ind">
                  <td class="index">{{ ind + 1 }}</td>
                  <!-- TODO: the real schedule should not allow clicking but should be based on the registration data -->
                  <td
                    v-for="(item, ind2) in row"
                    :key="ind2"
                    @click="
                      item === 'available'
                        ? updateCell(ind, ind2, 'leave')
                        : updateCell(ind, ind2, 'available')
                    "
                    :class="item"
                  />
                </tr>
              </tbody>
            </table>
            <p>
              <span class="cell available" /> = 自修课；
              <span class="cell leave" /> = 请假
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.schedule {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 10px;
}

.schedule th,
.schedule td {
  border: 1px solid lightgray;
  height: 35px;
  width: 40px;
  text-align: center;
}

.schedule th + th {
  width: auto;
}

.schedule td + td {
  width: auto;
  cursor: pointer;
}

.available {
  background-color: lightgreen;
}

.leave {
  background-color: lightcoral;
}

.cell {
  display: inline-block;
  width: 20px;
  height: 15px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export type status = "available" | "leave" | "notSelfstudy";

@Component
export default class Selfstudy extends Vue {
  schedule = new Array<status[]>(9).fill(
    new Array<status>(5).fill("notSelfstudy")
  );

  updateCell(day: number, period: number, status: status): void {
    this.schedule = this.schedule.map((row, i) => {
      return i === day
        ? row.map((cell, j) => (j === period ? status : cell))
        : row;
    });
  }

  getWeekBoundaries(today: Date): [Date, Date] {
    today = new Date(today);
    const day = today.getDay();
    const monday = new Date(today.setDate(today.getDate() - day + 1)),
      friday = new Date(today.setDate(monday.getDate() + 4));
    return [monday, friday];
  }

  transformBoundaries(boundaries: [Date, Date]): string {
    return `${boundaries[0].toLocaleDateString(
      "en-ZA"
    )} — ${boundaries[1].toLocaleDateString("en-ZA")}`;
  }
}
</script>
