const enums = {
  days: {
    values: [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ],
    map: {
      SUNDAY: '周日',
      MONDAY: '周一',
      TUESDAY: '周二',
      WEDNESDAY: '周三',
      THURSDAY: '周四',
      FRIDAY: '周五',
      SATURDAY: '周六',
    },
  },
  periods: {
    values: [
      'MORNING',
      'ONE',
      'TWO',
      'THREE',
      'FOUR',
      'NOON',
      'FIVE',
      'SIX',
      'SEVEN',
      'EIGHT',
      'NINE',
      'AFTERCLASS',
    ],
    map: {
      MORNING: '早读',
      ONE: '第 1 节课',
      TWO: '第 2 节课',
      THREE: '第 3 节课',
      FOUR: '第 4 节课',
      NOON: '午休',
      FIVE: '第 5 节课',
      SIX: '第 6 节课',
      SEVEN: '第 7 节课',
      EIGHT: '第 8 节课',
      NINE: '第 9 节课',
      AFTERCLASS: '放学后',
    },
  },
}

function time2period(hhmm: number, day: string) {
  const timePeriods = [
    { name: 'ONE', start: 815, end: 855 },
    { name: 'TWO', start: 855, end: 945 },
    { name: 'THREE', start: 945, end: 1035 },
    { name: 'FOUR', start: 1035, end: 1125 },
    { name: 'NOON', start: 1125, end: 1230 },
    { name: 'FIVE', start: 1230, end: 1310 },
    { name: 'SIX', start: 1310, end: 1400 },
    { name: 'SEVEN', start: 1400, end: 1450 },
    { name: 'EIGHT', start: 1450, end: 1540 },
    { name: 'NINE', start: 1540, end: 1630 },
  ]
  if (hhmm < timePeriods[0].start) {
    return 'MORNING'
  }
  else if (day === 'FRIDAY' && hhmm >= timePeriods[8].end) {
    return 'AFTERCLASS'
  }
  else if (hhmm >= timePeriods[9].end) {
    return 'AFTERCLASS'
  }
  else {
    for (const period of timePeriods) {
      if (period.start <= hhmm && hhmm < period.end) {
        return period.name
      }
    }
  }
}

export { enums, time2period }
