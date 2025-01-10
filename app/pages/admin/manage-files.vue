<script setup lang="ts">
import type { FileCollection } from '@prisma/client'
import dayjs from 'dayjs'

definePageMeta({
  middleware: ['admin'],
})

useHead({
  title: 'Club Files | Enspire Admin',
})

interface ClubInfo {
  id: number
  name: any
}

const prerequisiteDataLoading = ref(true)
const dataLoading = ref(true)
const selectedCollection = ref('')

const { data: collectionsData, suspense: __s1 } = useQuery<FileCollection[]>({
  queryKey: ['/api/files/collections'],
})
await __s1()
const { data: operatingClubs, suspense: __s2 } = useQuery<ClubInfo[]>({
  queryKey: ['/api/club/all-operating'],
})
await __s2()
if (collectionsData.value && operatingClubs.value)
  prerequisiteDataLoading.value = false

let clubsSubmission: any = {}

function resetSubmissionStatuses() {
  clubsSubmission = {}
  if (operatingClubs.value != null) {
    for (const club of operatingClubs.value) {
      clubsSubmission[club.id] = false
    }
  }
}
resetSubmissionStatuses()

let records: any = {}
let unsubmittedClubs: any = []

watch(
  () => selectedCollection.value,
  async () => {
    dataLoading.value = true
    const response = await $fetch('/api/admin/all-records', {
      method: 'GET',
      params: {
        id: selectedCollection.value,
      },
    })
    records = {}
    resetSubmissionStatuses()
    if (response) {
      for (const record of response) {
        records[record.clubId] = record
        clubsSubmission[record.clubId] = true
      }
      unsubmittedClubs = operatingClubs.value?.filter(club => !clubsSubmission[club.id]) || []
      dataLoading.value = false
    }
  },
)
</script>

<template>
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <div class="lg:col-span-2">
      <Select v-model="selectedCollection">
        <SelectTrigger class="mb-4 w-full lg:w-72">
          <SelectValue placeholder="选择一个文件" />
        </SelectTrigger>
        <SelectContent v-if="!prerequisiteDataLoading">
          <SelectItem v-for="collection in collectionsData" :key="collection.id" :value="collection.id">
            {{ collection.name }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>社团</TableHead>
            <TableHead>文件名</TableHead>
            <TableHead>提交时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-if="!dataLoading">
          <TableRow v-for="record of records" :key="record.id">
            <TableCell>{{ record.club.name.zh }}</TableCell>
            <TableCell>{{ record.file.name }}</TableCell>
            <TableCell>{{ dayjs(record.createdAt).fromNow() }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <Card class="h-4/5 flex flex-col p-4">
      <div class="mb-3">
        未提交的社团
        <Badge v-if="!dataLoading">
          {{ unsubmittedClubs.length }}
        </Badge>
      </div>
      <ScrollArea v-if="!dataLoading" class="grow">
        <Button v-for="club of unsubmittedClubs" :key="club.id" variant="outline" class="m-1">
          {{ club.name.zh }}
          <!-- <span v-if="index < unsubmittedClubs.length - 1" class="mx-2">/</span> -->
        </Button>
      </ScrollArea>
    </Card>
  </div>
</template>
