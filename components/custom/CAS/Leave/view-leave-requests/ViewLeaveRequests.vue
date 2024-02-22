<script lang='ts' setup>
import { columns } from './columns'
import DataTable from './DataTable.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '~/components/ui/toast'
import type { MyRequests } from '~/types/api/cas/leave/my'

definePageMeta({
  middleware: ['auth'],
})

const { data } = await useAsyncData<MyRequests>('allRequests', () => {
  return $fetch('/api/cas/leave/my', {
    headers: useRequestHeaders(),
    method: 'GET',
  })
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
        <Icon name="material-symbols:add-circle-outline" />
        新增
      </CardTitle>
      <CardDescription>在此处新增请假申请</CardDescription>
    </CardHeader>
    <CardContent v-if="data">
      <DataTable :columns="columns" :data="data.data" />
    </CardContent>
  </Card>
  <Toaster />
</template>
