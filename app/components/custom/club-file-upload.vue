<script setup lang="ts">
import type { FileCollection } from '@prisma/client'
import type { AllClubs } from '~~/types/api/user/all_clubs'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { toTypedSchema } from '@vee-validate/zod'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const props = defineProps({
  club: {
    type: String,
    required: true,
  },
  collection: {
    type: String,
    required: true,
  },
  filetypes: {
    type: Array<string>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

definePageMeta({
  middleware: ['auth'],
})

function fileTypesPrompt(fileTypes: string[]) {
  if (fileTypes.length === 0 || fileTypes.includes('*')) {
    return '无文件类型限制'
  }
  else {
    return `上传类型为 ${fileTypes.join(', ').toUpperCase()} 的文件`
  }
}
function fileTypesAcceptAttr(fileTypes: string[]) {
  if (fileTypes.length === 0 || fileTypes.includes('*')) {
    return '*'
  }
  else {
    return fileTypes.map(type => `.${type}`).join(',')
  }
}

// Still seems to be buggy
// const formSchema = toTypedSchema(z.object({
//   file: z.custom(v => v, 'File missing'),
// }))

// 滚一边去
function readFileAsDataURL(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const form = useForm({})
const inputKey = ref(uuidv4())
const submitting = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
  submitting.value = true
  await $fetch('/api/files/newRecord', {
    method: 'POST',
    body: {
      clubId: Number.parseInt(props.club),
      collectionId: props.collection,
      fileContent: await readFileAsDataURL(values.file),
      rawName: values.file.name,
    },
  })
  form.resetForm()
  inputKey.value = uuidv4()
  await updateClub()
  submitting.value = false
})

const downloadLink = ref('')
const downloadFilename = ref('')
const msg = ref('')
const currentClubData = ref(null)
const clubUpdating = ref(false)
async function updateClub() {
  downloadLink.value = ''
  downloadFilename.value = ''
  if (!props.club) {
    msg.value = '请先选择一个社团'
    currentClubData.value = undefined
    return
  }
  clubUpdating.value = true
  const data = await $fetch('/api/files/clubRecords', {
    method: 'POST',
    body: {
      cludId: Number.parseInt(props.club),
      collection: props.collection,
    },
  })
  if (data && data.length !== 0) {
    msg.value = `最后提交于 ${dayjs(data[0].createdAt).fromNow()}`
    currentClubData.value = data[0]
  }
  else {
    msg.value = '尚未提交'
    currentClubData.value = undefined
  }
  clubUpdating.value = false
}

const dlink: Ref<HTMLElement | null> = ref(null)
const downloading = ref(false)
async function download() {
  if (currentClubData.value) {
    downloading.value = true
    const data = await $fetch('/api/files/download', {
      method: 'POST',
      body: {
        fileId: currentClubData.value.fileId,
      },
    })
    // const blob = new Blob([new Uint8Array(Array.from(atob(data), c => c.charCodeAt(0)))])
    // window.open(URL.createObjectURL(blob))
    // window.open(data)
    downloadLink.value = data.url
    downloadFilename.value = data.name
    nextTick(() => {
      dlink.value.click()
    })
    downloading.value = false
  }
}

watch(
  () => props.club,
  async () => {
    await updateClub()
  },
)

await updateClub()
</script>

<template>
  <Card class="px-4 py-4">
    <div class="mb-5 text-xl font-bold">
      {{ title }}
    </div>
    <form class="inline-block" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="file">
        <FormItem>
          <FormControl>
            <Input
              v-bind="componentField"
              :key="inputKey" class="text-foreground"
              type="file"
              :accept="fileTypesAcceptAttr(filetypes)"
            />
          </FormControl>
          <FormDescription>
            {{ fileTypesPrompt(filetypes) }}
          </FormDescription>
          <!-- <FormMessage /> -->
        </FormItem>
      </FormField>
      <div class="mt-2">
        <Button type="submit" variant="secondary" :disabled="!form.values.file || submitting || clubUpdating">
          上传
        </Button>
        <Button v-if="currentClubData" :disabled="downloading" variant="outline" class="ml-2" type="button" @click="download">
          下载
        </Button>
      </div>
    </form>
    <div v-if="submitting || clubUpdating" class="mt-2">
      <Skeleton class="h-5 w-full" />
    </div>
    <div v-else class="mt-2">
      {{ msg }}
    </div>
    <a
      ref="dlink" :href="downloadLink" :download="downloadFilename" class="hidden"
    >Download</a>
    <!-- @click="downloadLink = '';
              downloadFilename = ''" -->
  </Card>
</template>
