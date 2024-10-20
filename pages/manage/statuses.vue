<script setup lang="ts">
import type { ClassroomData, ReservationRecord } from '@prisma/client'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { enums, time2period } from '~/components/custom/enum2str'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Classroom Status | Enspire',
})

const { toast } = useToast()

const dayjs = useDayjs()

const utc8Time = dayjs().tz('Asia/Shanghai')

const selectedDay = ref(enums.days.values[utc8Time.day()])
const selectedPeriod = ref(
  time2period(utc8Time.hour() * 100 + utc8Time.minute(), selectedDay.value),
)

let dataLoaded = false

const { data, _refresh } = await useAsyncData<ClassroomData[]>(
  'classroomStatuses',
  () => {
    return $fetch<ClassroomData[]>(`/api/reservation/classroomId`, {
      headers: useRequestHeaders(),
      method: 'GET',
    })
  },
)

if (data.value) {
  data.value = data.value.sort((a: any, b: any) => (a.name < b.name ? -1 : 1))
  dataLoaded = true
}
else {
  toast({
    title: '错误',
    description: '获取教室信息出错',
  })
}

function status(reservationRecords: ReservationRecord[]) {
  for (const record of reservationRecords) {
    if (
      record.day === selectedDay.value
      && record.period === selectedPeriod.value
    ) {
      return record.club.name.zh
    }
  }
  return false
}
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-4 mb-4">
    <Select v-model="selectedDay">
      <SelectTrigger class="lg:w-32">
        <SelectValue placeholder="选择一天" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="day in enums.days.values" :key="day" :value="day">
          {{ enums.days.map[day] }}
        </SelectItem>
      </SelectContent>
    </Select>
    <Select v-model="selectedPeriod">
      <SelectTrigger class="lg:w-48">
        <SelectValue placeholder="选择时段" />
      </SelectTrigger>
      <SelectContent>
        <template v-if="1">
          <SelectItem
            v-for="period in enums.periods.values"
            :key="period"
            :value="period"
          >
            {{ enums.periods.map[period] }}
          </SelectItem>
        </template>
      </SelectContent>
    </Select>
  </div>
  <div v-if="!dataLoaded" class="flex flex-row flex-wrap gap-4">
    <div v-for="i in 30" :key="i" class="w-full lg:w-72 rounded-lg border">
      <div class="rounded-t-lg w-full px-4 py-2 text-xs bg-slate-800/[.2]">
        <Skeleton class="h-2 my-1" />
      </div>
      <div class="rounded-b-lg w-full px-4 py-3 lg:h-20">
        <Skeleton class="h-8 mb-2" />
        <Skeleton class="h-4" />
      </div>
    </div>
  </div>
  <div
    v-if="dataLoaded"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2"
  >
    <div
      v-for="classroom in data"
      :key="classroom.id"
      class="w-full rounded-lg border"
    >
      <div
        class="rounded-t-lg w-full px-4 py-2 text-xs"
        :class="{
          'bg-red-800/[.2]': !!status(classroom.ReservationRecord),
          'bg-green-800/[.2]': !status(classroom.ReservationRecord),
        }"
      >
        {{
          status(classroom.ReservationRecord)
            ? `${status(classroom.ReservationRecord)} 使用中`
            : "空闲"
        }}
      </div>
      <div class="rounded-b-lg w-full px-4 py-2">
        <div
          class="text-2xl font-bold flex flex-row flex-wrap items-center gap-2"
        >
          <span class="inline-block">
            {{ classroom.name }}
          </span>
        </div>
        <div class="text-muted-foreground">
          {{ classroom.alias }}
          <span v-if="classroom.size" class="text-sm">
            可容纳<span>{{ classroom.size }}</span>人
          </span>
        </div>
      </div>
    </div>
  </div>
  <Toaster />
</template>
