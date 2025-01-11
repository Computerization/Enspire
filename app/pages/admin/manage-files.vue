<script setup lang="ts">
import type { FileCollection } from '@prisma/client'
import dayjs from 'dayjs'
import JSZip from 'jszip'

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

const prerequisiteDataLoading = ref(true) // Club and collection data loading
const dataLoading = ref(true) // Flag for loading any data
const downloading = ref(false) // Flag for any download is ongoing
const downloadingAll = ref(false) // Flag for download all

const selectedCollection = ref('') // The <Select>

const dlink: Ref<HTMLElement | null> = ref(null) // The <a> element
const downloadLink = ref('') // The data url to be filled in <a>
const downloadFilename = ref('') // The filename to be filled in <a>

const progress = ref(0) // Download all progress bar
const dlAllMsg = ref('') // Download all message
const dlAllCancel = ref(false) // Download all cancel flag

let clubsSubmission: any = {}
let records: any[] = []
let unsubmittedClubs: any = []

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

function resetSubmissionStatuses() {
  clubsSubmission = {}
  if (operatingClubs.value != null) {
    for (const club of operatingClubs.value) {
      clubsSubmission[club.id] = false
    }
  }
}
resetSubmissionStatuses()

async function getFile(fid: string) {
  try {
    const data = await $fetch('/api/files/download', {
      method: 'POST',
      body: {
        fileId: fid,
      },
    })
    return data
  }
  catch (error) {
    return {
      url: null,
      name: null,
      error: String(error),
    }
  }
}

async function download(fid: string | undefined) {
  let success = false
  if (fid) {
    downloading.value = true
    try {
      const data = await getFile(fid)
      if (typeof data.url === 'string' && data.url && data.name) {
        downloadLink.value = data.url
        downloadFilename.value = data.name
        nextTick(() => {
          dlink.value!.click()
        })
        success = true
      }
    }
    finally {
      downloading.value = false
    }
  }
  return success
}

async function downloadAll() {
  dlAllCancel.value = false
  downloadingAll.value = true
  progress.value = 0
  let count = 0
  const zip = new JSZip()
  for (const record of records) {
    count++
    if (dlAllCancel.value)
      break
    dlAllMsg.value = `正在下载 "${record.file.name}" (${count}/${records.length})`
    let data = await getFile(record.fileId)
    if (!(typeof data.url === 'string' && data.url && data.name)) {
      dlAllMsg.value = `正在下载 "${record.file.name}" (${count}/${records.length}) 重试中...`
      data = await getFile(record.fileId)
      if (!(typeof data.url === 'string' && data.url && data.name)) {
        dlAllMsg.value = '下载失败'
        break
      }
    }
    const b64str = data.url.split(',')[1] || ''
    zip.file(data.name, b64str, {
      base64: true,
    })
    progress.value = 100 * (count) / records.length
  }
  if (progress.value === 100) {
    dlAllMsg.value = '下载完成，打包中'
    const file = await zip.generateAsync({ type: 'base64' })
    const collectionName = collectionsData.value?.find(obj => obj.id === selectedCollection.value)?.name || 'bundle'
    downloadLink.value = `data:application/zip;base64,${file}`
    downloadFilename.value = `${collectionName}.zip`
    nextTick(() => {
      dlink.value!.click()
      dlAllMsg.value = '完成'
      downloadingAll.value = false
    })
  }
  else {
    dlAllMsg.value = '下载中断'
    downloadingAll.value = false
  }
}

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
    records = []
    resetSubmissionStatuses()
    if (response) {
      for (const record of response) {
        records.push(record)
        clubsSubmission[record.clubId] = true
      }
      unsubmittedClubs = operatingClubs.value?.filter(club => !clubsSubmission[club.id]) || []
      dataLoading.value = false
    }
  },
)
</script>

<template>
  <Card class="h-[80vh] p-4">
    <div class="mb-4 font-bold">
      管理社团文件
    </div>
    <div class="grid grid-cols-1 h-[70vh] items-stretch gap-4 lg:grid-cols-3">
      <div class="h-[70vh] lg:col-span-2">
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
        <ScrollArea class="h-[65vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>社团</TableHead>
                <TableHead>文件名</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead>
                  <AlertDialog>
                    <AlertDialogTrigger as-child>
                      <Button v-if="!dataLoading" variant="link" class="text-green-500" :disabled="downloading" @click="downloadAll()">
                        下载全部
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>下载中...</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div>{{ dlAllMsg }}</div>
                          <Progress v-model="progress" class="h-1 w-full" />
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <Button v-if="downloadingAll" variant="outline" @click="dlAllCancel = true">
                          取消
                        </Button>
                        <AlertDialogAction v-if="!downloadingAll">
                          完成
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody v-if="selectedCollection && dataLoading">
              <TableRow v-for="i in 7" :key="i">
                <TableCell v-for="j in 4" :key="j">
                  <Skeleton class="my-2 h-5" />
                </TableCell>
              </TableRow>
            </TableBody>
            <TableBody v-if="!dataLoading">
              <TableRow v-for="record of records" :key="record.id">
                <TableCell>{{ record.club.name.zh }}</TableCell>
                <TableCell>{{ record.file.name }}</TableCell>
                <TableCell>{{ dayjs(record.createdAt).fromNow() }}</TableCell>
                <TableCell>
                  <Button variant="link" class="text-blue-500" :disabled="downloading" @click="download(record.fileId)">
                    下载
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <Card class="h-[70vh] flex flex-col p-4">
        <div class="mb-3">
          未提交的社团
          <Badge v-if="!dataLoading">
            {{ unsubmittedClubs.length }}
          </Badge>
        </div>
        <ScrollArea v-if="selectedCollection && dataLoading">
          <span v-for="i of 8" :key="i">
            <Skeleton class="my-4 h-5 w-full" />
          </span>
        </ScrollArea>
        <ScrollArea v-if="!dataLoading">
          <Button v-for="club of unsubmittedClubs" :key="club.id" variant="outline" class="m-1">
            {{ club.name.zh }}
          </Button>
        </ScrollArea>
      </Card>
    </div>
  </Card>
  <a
    ref="dlink" :href="downloadLink" :download="downloadFilename" class="hidden"
  >Download</a>
</template>
