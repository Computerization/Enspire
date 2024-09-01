<script setup lang="ts">
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { Card } from '@/components/ui/card'
import { enums, time2period } from '~/components/custom/enum2str'
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Classroom Statuses | Enspire',
})

const { toast } = useToast()

const utc8Time = utcToZonedTime((new Date()).toISOString(), 'Asia/Shanghai')

const selectedDay = ref(enums.days.values[utc8Time.getDay()])
const selectedPeriod = ref(time2period(utc8Time.getHours() * 100 + utc8Time.getMinutes(), selectedDay.value))

let dataLoaded = false
let data: any

try {
  const response = await $fetch('/api/reservation/classroomId')
  const rawData = JSON.parse(response).data
  data = rawData.sort((a: any, b: any) => a.name < b.name ? -1 : 1)
  dataLoaded = true
}
catch (error) {
  toast({
    title: '错误',
    description: '获取教室信息出错',
  })
}

function status(reservationRecords: object[]) {
  for (const record of reservationRecords) {
    if (record.day === selectedDay.value && record.period === selectedPeriod.value) {
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
        <SelectItem v-for="period in enums.periods.values" v-if="1" :key="period" :value="period">
          {{ enums.periods.map[period] }}
        </SelectItem>
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
  <div v-if="dataLoaded" class="flex flex-row flex-wrap gap-4">
    <div v-for="classroom in data" :key="classroom.id" class="w-full lg:w-72 rounded-lg border">
      <div
        class="rounded-t-lg w-full px-4 py-2 text-xs" :class="{
          'bg-red-800/[.2]': !!status(classroom.ReservationRecord),
          'bg-green-800/[.2]': !status(classroom.ReservationRecord),
        }"
      >
        {{ status(classroom.ReservationRecord) ? `${status(classroom.ReservationRecord)} 使用中` : '空闲' }}
      </div>
      <div class="rounded-b-lg w-full px-4 py-2 lg:h-20">
        <div class="text-2xl font-bold flex flex-row flex-wrap items-center gap-2">
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
