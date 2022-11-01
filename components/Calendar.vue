<template>
  <div>
    <v-row>
      <v-col>
        <div class="top-con">
          <div v-for="item in top" :key="item" class="top">星期{{ item }}</div>
        </div>
        <div class="date-con">
          <div
            v-for="(item, index) in visibleCalendar"
            :key="index"
            class="date"
            :class="[item.beforeToday, item.isToday, item.afterToday]"
          >
            <div v-if="item.afterToday" class="test-jmp">
              <router-link
                :to="{
                  path: '/leaverequest',
                  query: { year: item.year, month: item.month, day: item.day },
                }"
              >
                <button class="jmp-btn">{{ item.day }}</button>
              </router-link>
            </div>
            <div v-else>
              <div>{{ item.day }}</div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      top: ['一', '二', '三', '四', '五', '六', '日']
    }
  },
  computed: {
    visibleCalendar: function () {
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)

      const calendarArr = []
      const currentFirstDay = new Date(this.time.year, this.time.month, 1)
      const weekDay = currentFirstDay.getDay()
      const startDay = currentFirstDay - (weekDay - 1) * 24 * 3600 * 1000
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDay + i * 24 * 3600 * 1000)
        calendarArr.push({
          date: new Date(startDay + i * 24 * 3600 * 1000),
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate(),
          beforeToday: date.getTime() < today.getTime() ? 'beforeToday' : '',
          isToday:
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
              ? 'isToday'
              : '',
          afterToday: date.getTime() >= today.getTime() ? 'afterToday' : ''
        })
      }
      return calendarArr
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>
<style lang="less" scoped>
.top-con {
  display: flex;
  align-items: center;
  .top {
    width: 14.285%;
    background-color: rgb(242, 242, 242);
    padding: 10px;
    text-align: center;
  }
}
.date-con {
  display: flex;
  flex-wrap: wrap;
  .date {
    width: 14.285%;
    text-align: center;
    padding: 5px;
    font-size: x-large;
  }
  .beforeToday {
    a {
      color: grey;
    }
  }
  .isToday {
    font-weight: 700;
    background-color: rgb(242, 242, 242);
  }
}
.tip-con {
  margin-top: 51px;
  .tip {
    margin-top: 21px;
    width: 100%;
  }
}
</style>
