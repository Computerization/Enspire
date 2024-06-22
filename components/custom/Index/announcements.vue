<script setup lang="ts">
import type { Announcements } from '~/types/payloadcms/announcements'

const { data } = await useAsyncData<Announcements>('allRequests', () => {
  return $fetch('https://admin.enspire.one/api/announcements', {
    method: 'GET',
  })
})
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
