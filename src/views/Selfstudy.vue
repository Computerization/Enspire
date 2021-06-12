<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>提交请假单</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="7">
        <Leave-application
          :name="name"
          :studentId="studentId"
          :period="selected.period"
          :date="selectedDate"
          :application="selectedApplication"
        />
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
                        selected:
                          period === selected.period && day === selected.day,
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
import LeaveApplication from "../components/LeaveApplication.vue";
import { stringifyBoundaries, daysAfter } from "../utils/dateUtils";

export type status = "available" | "leave" | "notSelfstudy";
export type period = {
  period: number;
  day: number;
};

@Component({
  components: {
    LeaveApplication,
  },
})
export default class Selfstudy extends Vue {
  selected: period = { period: 0, day: 0 };
  currentWeek = new Date();
  // TODO: data below should be returned from backend
  name = "测试者";
  studentId = 20198000;
  selfstudyPeriods: period[] = [
    { period: 1, day: 0 },
    { period: 2, day: 0 },
    { period: 3, day: 1 },
    { period: 4, day: 3 },
    { period: 5, day: 3 },
  ];
  semesterStart = new Date(2021, 0, 1);
  semesterEnd = new Date(2021, 8, 1);
  /** [period, day, reason] */
  pastApplications: application[] = [
    {
      period: 4,
      date: new Date(2021, 5, 10),
      submissionDate: new Date(2021, 5, 10),
      teacher: "老师 1",
      reason: "推荐信",
      status: "approved",
    },
    {
      period: 1,
      date: new Date(2021, 5, 14),
      submissionDate: new Date(2021, 5, 10),
      teacher: "老师 2",
      reason: "物理 IA",
      status: "pending",
    },
  ];

  get weekBoundaries(): [Date, Date] {
    const now = this.currentWeek;
    const day = now.getDay();
    const monday = daysAfter(-day + 1 + (day === 6 ? 7 : 0), now),
      friday = daysAfter(4, monday);
    return [monday, friday];
  }

  get selectedDate(): Date {
    return daysAfter(this.selected.day, this.weekBoundaries[0]);
  }

  get selectedApplication(): application | undefined {
    return this.findApplication(
      this.selected.period,
      daysAfter(this.selected.day, this.weekBoundaries[0])
    );
  }

  get schedule(): status[][] {
    const schedule = new Array<status[]>(9)
      .fill([])
      .map(() => new Array<status>(5).fill("notSelfstudy"));
    for (let i = 0; i < this.selfstudyPeriods.length; i++)
      schedule[this.selfstudyPeriods[i].period][this.selfstudyPeriods[i].day] =
        this.periodStatuses[i];
    return schedule;
  }

  get periodStatuses(): status[] {
    const statuses = this.selfstudyPeriods.map((period) => {
      return this.findApplication(
        period.period,
        daysAfter(period.day, this.weekBoundaries[0])
      ) !== undefined
        ? "leave"
        : "available";
    });
    return statuses;
  }

  mounted(): void {
    this.selected = this.selfstudyPeriods[0];
  }

  findApplication(period: number, date: Date): application | undefined {
    return this.pastApplications.find(
      (entry) =>
        entry.period === period && entry.date.getDate() === date.getDate()
    );
  }

  selectCell(day: number, period: number): void {
    if (this.schedule[period][day] !== "notSelfstudy")
      this.selected = { period: period, day: day };
  }

  stringifyBoundaries = stringifyBoundaries;

  prev(): void {
    this.currentWeek = daysAfter(-7, this.currentWeek);
  }

  next(): void {
    this.currentWeek = daysAfter(7, this.currentWeek);
  }
}
</script>
