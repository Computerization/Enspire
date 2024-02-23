<script lang='ts' setup>
import { columns } from './columns'
import DataTable from './DataTable.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '~/components/ui/toast'
import type { MyRequests } from '~/types/api/cas/leave/my'

const props = defineProps<{
  refreshWatcher: Ref<boolean>
}>()

definePageMeta({
  middleware: ['auth'],
})

const { data, refresh } = await useAsyncData<MyRequests>('allRequests', () => {
  return $fetch('/api/cas/leave/my', {
    headers: useRequestHeaders(),
    method: 'GET',
  })
})

watch(() => props.refreshWatcher, () => {
  refresh()
})

if (!data.value) {
  throw createError({
    statusCode: 500,
    statusMessage: '服务器错误',
  })
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center gap-x-1">
        <Icon name="ic:sharp-remove-red-eye" />
        我的申请
      </CardTitle>
      <CardDescription>在此处浏览您的请假申请</CardDescription>
    </CardHeader>
    <CardContent v-if="data">
      <DataTable :columns="columns" :data="data.data" :refresh-function="refresh" />
    </CardContent>
  </Card>
  <Toaster />
</template>
