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
          <!-- TODO: if the status is "leave", then the approved application form should be displayed. -->
          <div class="text">
            <p>To whom it may concern:</p>
            <p>
              <span class="field">{{ name }}</span> (student id:
              <span class="field">{{ studentId }}</span
              >) would like to request a leave during
              <span v-html="selectedPeriod"></span> for
              <v-text-field dense label="事由" v-model="reason" required />.
            </p>
            <p>
              Date:
              {{ new Date().toLocaleDateString("en-ZA") }}
            </p>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn color="success" @click="submit()">提交</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card class="pa-5">
          <v-card-title>
            <v-icon @click="prev()">mdi-arrow-left</v-icon>
            <v-spacer />
            课表 ({{ stringifyBoundaries(weekBoundaries) }})
            <v-spacer />
            <v-icon @click="next()">mdi-arrow-right</v-icon>
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
                <tr v-for="(row, period) in schedule" :key="period">
                  <td class="index">{{ period + 1 }}</td>
                  <td
                    v-for="(item, day) in row"
                    :key="day"
                    @click="selectCell(day, period)"
                    :class="[
                      item,
                      {
                        selected: period === selected[0] && day === selected[1],
                      },
                      {
                        selectable: item !== 'notSelfstudy',
                      },
                    ]"
                  />
                </tr>
              </tbody>
            </table>
            <p>
              <span class="cell available" /> = 空闲自修课；
              <span class="cell leave" /> = 已请假
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.field,
span >>> .field {
  font-size: larger;
  font-weight: bold;
  padding: 0px 5px;
  border-bottom: 1px solid black;
}

.v-text-field {
  display: inline-block;
}

.text {
  padding: 16px;
}

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
  transition: box-shadow 0.2s;
}

.selectable {
  cursor: pointer;
}

.available {
  background-color: lightgreen;
}

.leave {
  background-color: lightcoral;
}

.selected {
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.cell {
  display: inline-block;
  width: 20px;
  height: 15px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  stringifyBoundaries,
  stringifyDate,
  daysAfter,
} from "../utils/dateUtils";

export type status = "available" | "leave" | "notSelfstudy";

@Component
export default class Selfstudy extends Vue {
  /** [period, day] */
  selected: [number, number] = [0, 0];
  currentWeek = new Date();
  reason = "";
  // TODO: data below should be returned from backend
  name = "测试者";
  studentId = 20198000;
  /** [period, day] */
  selfstudyPeriods: [number, number][] = [
    [1, 0],
    [2, 0],
    [3, 1],
    [4, 3],
    [5, 3],
  ];
  semesterStart = new Date(2021, 0, 1);
  semesterEnd = new Date(2021, 8, 1);
  /** [period, day] */
  pastApplications: [number, Date][] = [
    [4, new Date(2021, 5, 10)],
    [1, new Date(2021, 5, 14)],
  ];

  get weekBoundaries(): [Date, Date] {
    const now = this.currentWeek;
    const day = now.getDay();
    const monday = daysAfter(-day + 1 + (day === 6 ? 7 : 0), now),
      friday = daysAfter(4, monday);
    return [monday, friday];
  }

  get selectedDate(): Date {
    return daysAfter(this.selected[1], this.weekBoundaries[0]);
  }

  get selectedPeriod(): string {
    return `period <span class="field">${
      this.selected[0] + 1
    }</span> on <span class="field">${stringifyDate(this.selectedDate)}</span>`;
  }

  get schedule(): status[][] {
    const schedule = new Array<status[]>(9)
      .fill([])
      .map(() => new Array<status>(5).fill("notSelfstudy"));
    for (let i = 0; i < this.selfstudyPeriods.length; i++)
      schedule[this.selfstudyPeriods[i][0]][this.selfstudyPeriods[i][1]] =
        this.periodStatus[i];
    return schedule;
  }

  get periodStatus(): status[] {
    const statuses = this.selfstudyPeriods.map((period) => {
      return this.pastApplications.find(
        (entry) =>
          entry[0] === period[0] &&
          entry[1].getDate() ===
            daysAfter(period[1], this.weekBoundaries[0]).getDate()
      ) !== undefined
        ? "leave"
        : "available";
    });
    return statuses;
  }

  mounted(): void {
    this.selected = this.selfstudyPeriods[0];
  }

  selectCell(day: number, period: number): void {
    if (this.schedule[period][day] !== "notSelfstudy")
      this.selected = [period, day];
  }

  stringifyBoundaries = stringifyBoundaries;

  prev(): void {
    this.currentWeek = daysAfter(-7, this.currentWeek);
  }

  next(): void {
    this.currentWeek = daysAfter(7, this.currentWeek);
  }

  submit(): void {
    const selectedDate = this.selectedDate;
    const selectedPeriod = this.selected[0];
    const reason = this.reason;
    console.log(selectedDate, selectedPeriod, reason);
  }
}
</script>
