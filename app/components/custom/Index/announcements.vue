<script setup lang="ts">
import type { Announcements } from '@@/types/payloadcms/announcements'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const { data, suspense } = useQuery<Announcements>({
  queryKey: ['/api/cms/api/announcements'],
})
await suspense()
</script>

<template>
  <div class="border rounded">
    <Table class="px-2">
      <TableHeader class="px-2">
        <TableRow class="px-2">
          <TableHead class="w-32">
            日期
          </TableHead>
          <TableHead>信息</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="data">
        <TableRow v-for="announcement in data.docs" :key="announcement.id">
          <TableCell class="font-medium">
            {{ $dayjs().to($dayjs(announcement.createdAt)) }}
          </TableCell>
          <TableCell>
            {{ announcement.message }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style scoped>

</style>
