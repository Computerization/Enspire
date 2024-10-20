<script setup lang="ts">
import type { Ref } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Toaster } from '~/components/ui/toast'
import type { MyRecords } from '~/types/api/cas/record/my'
import type { AllClubs } from '~/types/api/user/all_clubs'
import { columns } from './view-activity-records/columns'
import DataTable from './view-activity-records/DataTable.vue'

const props = defineProps<{
  refreshWatcher: Ref<boolean>
}>()

definePageMeta({
  middleware: ['auth'],
})

const selectedClub = ref<string>()
const isLoading = ref(false)

const { data: clubs } = await useAsyncData<AllClubs>('clubs', () => {
  return $fetch<AllClubs>(`/api/user/all_clubs`, {
    headers: useRequestHeaders(),
    method: 'GET',
  })
})

const { data, refresh } = await useAsyncData<MyRecords>('allRequests', () => {
  return selectedClub.value
    ? $fetch<MyRecords>(`/api/cas/record/my?club=${selectedClub.value}`, {
      headers: useRequestHeaders(),
      method: 'GET',
    })
    : Promise.resolve({ total: 0, data: [] })
})

async function onRefresh() {
  isLoading.value = true
  await refresh()
  isLoading.value = false
}

watch(
  () => props.refreshWatcher,
  () => {
    onRefresh()
  },
)

watch(selectedClub, async () => {
  await onRefresh()
})

// Computed properties to calculate total CAS times
const totalCTime = computed(() => {
  return data.value?.data.reduce((sum, record) => sum + record.cTime, 0) || 0
})

const totalATime = computed(() => {
  return data.value?.data.reduce((sum, record) => sum + record.aTime, 0) || 0
})

const totalSTime = computed(() => {
  return data.value?.data.reduce((sum, record) => sum + record.sTime, 0) || 0
})

const totalCASTime = computed(() => {
  return totalCTime.value + totalATime.value + totalSTime.value
})
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center gap-x-1">
        <Icon name="ic:sharp-remove-red-eye" />
        我的记录
      </CardTitle>
      <CardDescription>在此处浏览您的活动记录</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex space-x-2">
        <Select v-if="clubs" v-model="selectedClub">
          <SelectTrigger class="mb-4">
            <SelectValue placeholder="选择一个社团" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="club in [...clubs.vice, ...clubs.president]"
                :key="club.id"
                :value="String(club.id)"
              >
                {{ club.name.zh }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          size="icon"
          variant="outline"
          :disabled="isLoading || !selectedClub"
          @click="onRefresh()"
        >
          <Icon
            name="material-symbols:refresh"
            :class="{ 'animate-spin': isLoading }"
          />
        </Button>
      </div>
      <div v-if="selectedClub" class="mb-4 text-sm">
        <div class="rounded border p-2 mt-1 flex justify-between">
          <div class="flex items-center space-x-0.5">
            <p class="font-bold">
              C:
            </p>
            <div>{{ totalCTime }} 小时</div>
          </div>
          <div class="flex items-center space-x-0.5">
            <p class="font-bold">
              A:
            </p>
            <div>{{ totalATime }} 小时</div>
          </div>
          <div class="flex items-center space-x-0.5">
            <p class="font-bold">
              S:
            </p>
            <div>{{ totalSTime }} 小时</div>
          </div>
          <div class="flex items-center space-x-0.5">
            <p class="font-bold">
              Total:
            </p>
            <div>{{ totalCASTime }} 小时</div>
          </div>
        </div>
      </div>
      <DataTable
        v-if="data && selectedClub"
        :columns="columns"
        :data="data.data"
        :refresh-function="refresh"
      />
    </CardContent>
  </Card>
  <Toaster />
</template>
