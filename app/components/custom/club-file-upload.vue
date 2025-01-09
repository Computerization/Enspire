<script setup lang="ts">
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

const form = useForm({}) // The form
const inputKey = ref(uuidv4()) // To force update the <Input file>
const currentClubData: Ref<Record<string, any> | null> = ref(null) // Data for the current club's record
const msg = ref('') // Message (time / status) shown at the bottom of the card

const clubUpdating = ref(false) // Flag for club data updating
const submitting = ref(false) // Flag for file submission
const downloading = ref(false) // Flag for downloading file

const dlink: Ref<HTMLElement | null> = ref(null) // The <a> element
const downloadLink = ref('') // The data url to be filled in <a>
const downloadFilename = ref('') // The filename to be filled in <a>

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

function readFileAsDataURL(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const formSchema = z.object({
  clubId: z.number().int(),
  collectionId: z.string(),
  fileContent: z.string(),
  rawName: z.string().max(256),
})

const onSubmit = form.handleSubmit(async (values) => {
  submitting.value = true
  const fileName = values.file.name
  const data = {
    clubId: Number.parseInt(props.club),
    collectionId: props.collection,
    fileContent: await readFileAsDataURL(values.file),
    rawName: fileName,
  }
  if (formSchema.safeParse(data).success) {
    const status = await $fetch('/api/files/new-record', {
      method: 'POST',
      body: data,
    })
    form.resetForm()
    inputKey.value = uuidv4()
    await updateClub()
    msg.value = (status && status.success) ? `${fileName} (提交成功)` : '提交失败'
  }
  else {
    msg.value = '文件内容异常'
  }
  submitting.value = false
})

async function updateClub() {
  downloadLink.value = ''
  downloadFilename.value = ''
  if (!props.club) {
    msg.value = '请先选择一个社团'
    currentClubData.value = null
    return
  }
  clubUpdating.value = true
  const data = await $fetch('/api/files/club-records', {
    method: 'POST',
    body: {
      clubId: Number.parseInt(props.club),
      collection: props.collection,
    },
  })
  if (data[0] && data.length !== 0) {
    msg.value = `${data[0].file.name} (${dayjs(data[0].createdAt).fromNow()})`
    currentClubData.value = data[0]
  }
  else {
    msg.value = '尚未提交'
    currentClubData.value = null
  }
  clubUpdating.value = false
}

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
    if (typeof data.url === 'string' && typeof data.name === 'string') {
      downloadLink.value = data.url
      downloadFilename.value = data.name
      nextTick(() => {
        dlink.value!.click()
      })
      downloading.value = false
    }
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
        <Button type="submit" variant="secondary" :disabled="!form.values.file || submitting || clubUpdating || !props.club">
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
  </Card>
</template>
