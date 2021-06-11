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
              {{ name }} (student id: {{ studentId }}) would like to request a
              leave during {{ selectedPeriod }} for
              <v-text-field dense label="事由" />.
            </p>
            <p>
              Date:
              {{ new Date().toLocaleDateString("en-ZA") }}
            </p>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn color="success">提交</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card class="pa-5">
          <v-card-title>
            我的课表（{{ stringifyBoundaries(weekBoundaries) }}）
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
  transition: all 0.2s;
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

export type status = "available" | "leave" | "notSelfstudy";

@Component
export default class Selfstudy extends Vue {
  schedule = new Array<status[]>(9)
    .fill([])
    .map(() => new Array<status>(5).fill("notSelfstudy"));
  selected = [0, 0];
  // TODO: data below should be returned from backend
  name = "测试者";
  studentId = 20198000;
  selfstudyPeriods: [number, number, status][] = [
    [1, 0, "available"],
    [2, 0, "available"],
    [3, 1, "available"],
    [4, 3, "available"],
    [5, 3, "available"],
  ];

  get weekBoundaries(): [Date, Date] {
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(
        today.setDate(today.getDate() - day + 1 + (day === 6 ? 7 : 0))
      ),
      friday = new Date(today.setDate(monday.getDate() + 4));
    return [monday, friday];
  }

  get selectedPeriod(): string {
    const selectedDate = new Date(
      new Date().setDate(this.weekBoundaries[0].getDate() + this.selected[1])
    );
    return `period ${this.selected[0] + 1} on ${selectedDate.toLocaleDateString(
      "en-ZA",
      { month: "numeric", day: "numeric" }
    )}`;
  }

  mounted(): void {
    const nSchedule = this.schedule.map((row) => [...row]);
    for (const period of this.selfstudyPeriods) {
      nSchedule[period[0]][period[1]] = period[2];
    }
    this.schedule = nSchedule;
    this.selected = this.selfstudyPeriods[0].slice(0, 2) as [number, number];
  }

  updateCell(day: number, period: number, status: status): void {
    this.schedule = this.schedule.map((row, i) => {
      return i === period
        ? row.map((cell, j) => (j === day ? status : cell))
        : row;
    });
  }

  selectCell(day: number, period: number): void {
    if (this.schedule[period][day] !== "notSelfstudy") {
      this.selected = [period, day];
    }
  }

  stringifyBoundaries(boundaries: [Date, Date]): string {
    return `${boundaries[0].toLocaleDateString("en-ZA", {
      month: "numeric",
      day: "numeric",
    })} — ${boundaries[1].toLocaleDateString("en-ZA", {
      month: "numeric",
      day: "numeric",
    })}`;
  }
}
</script>
