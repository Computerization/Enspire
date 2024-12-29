<script setup lang="ts">
import type { FileCollection } from '@prisma/client'
import type { AllClubs } from '~~/types/api/user/all_clubs'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { toTypedSchema } from '@vee-validate/zod'
import { v4 as uuidv4 } from 'uuid'
import { useForm } from 'vee-validate'
import * as z from 'zod'

// ZOD!
const formSchema = toTypedSchema(z.object({
  file: z
    .instanceof(FileList)
    .refine(file => file?.length === 1, 'File is required.'),
}))

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Club Files | Enspire',
})

const { toast } = useToast()

const { data: collectionsData, suspense: _s1 } = useQuery<FileCollection[]>({
  queryKey: ['/api/files/collections'],
})
await _s1() // suspense要await

const collectionLoaded = ref(false)
if (collectionsData.value) {
  collectionLoaded.value = true
}
else {
  toast({
    title: '错误',
    description: '获取上传通道信息出错',
  })
}

const { data: clubData, suspense: _s2 } = useQuery<AllClubs>({
  queryKey: ['/api/user/all_clubs'],
})
await _s2() // suspense要await

const clubLoaded = ref(false)
if (clubData.value) {
  clubLoaded.value = true
}
else {
  toast({
    title: '错误',
    description: '获取社团信息出错',
  })
}

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

const selectedClub = ref('')

// const { handleSubmit } = useForm({
//   validationSchema: formSchema,
// })

// 第一，为什么？
// 第二，你就算要这么改也请用vue的element ref，document will only be available on client side and we are using SSR
// function updateFiles(event: any, collection: string) {
// if (!selectedClub.value)
//   return
// if (event != null) {
//   document.getElementById(`${collection}-prompt`).textContent = event.target.files[0].name
// }
// else {
//   document.getElementById(`${collection}-prompt`).textContent = fileTypesPrompt(
//     collectionsData.value.find(c => c.id === collection)?.fileTypes || [],
//   )
// }
// }

const clubRecords = ref({})
const clubRecordsLoading = ref(false)
const uploading = ref(false)

// 滚一边去
// function readFileAsDataURL(file: File) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.onload = () => resolve(reader.result)
//     reader.onerror = reject
//     reader.readAsDataURL(file)
//   })
// }

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  // uploading.value = true
  // await $fetch('/api/files/newRecord', {
  //   method: 'POST',
  //   // 不要用Json.stringify，传一个object
  //   // 自己找怎么POST多个files
  //   // 不需要fileName，后端自己处理
  //   body: {
  //     clubId: club,
  //     collectionId: collection,
  //     fileContent: values.file[0],
  //   },
  // })
  // uploading.value = false
  console.log(values)
})

// function onSubmit(event: any, collection: string, club: number) {
//   console.log('on')
//   try {
//     handleSubmit(async (values) => {
//       console.log('handle')
//       // uploading.value = true
//       await $fetch('/api/files/newRecord', {
//         method: 'POST',
//         body: {
//           clubId: club,
//           collectionId: collection,
//           fileContent: values.file[0],
//           fileName: 'test file',
//         },
//       })
//       // await updateClub()
//       // uploading.value = false
//     })(event)
//   }
//   catch (error) {
//     console.log({ error })
//   }
// }

// 滚一边去
// async function onSubmit(event: any, collection: string, club: number) {
//   uploading.value = true
//   await form.handleSubmit(async (files: any) => {
//     if (!club) {
//       toast({
//         title: '提示',
//         description: '请先选择一个社团',
//       })
//       return
//     }
//     if (files[collection] == null) {
//       toast({
//         title: '提示',
//         description: '请先选择一个文件',
//       })
//       return
//     }
//     const dataURL = await readFileAsDataURL(files[collection])
//     const responseData = await $fetch('/api/files/newRecord', {
//       method: 'POST',
//       // 不要用Json.stringify，传一个object
//       body: {
//         clubId: club,
//         collectionId: collection,
//         fileContent: dataURL,
//         fileName: '测试文件',
//       },
//     })
//     if (responseData && responseData.success) {
//       toast({
//         title: '成功',
//         description: '文件上传成功',
//       })
//       console.log('SUCCESS')
//     }
//     else {
//       toast({
//         title: '错误',
//         description: '文件上传失败',
//       })
//       console.log('FAILED')
//       console.log(responseData)
//     }
//     // 不需要resetForm()，您说神奇不神奇
//     updateFiles(null, collection)
//     await updateClub()
//     uploading.value = false
//   })(event)
// }

// 不是都说了后端处理吗，前端上传完文件网断了怎么办？
async function updateClub() {
  clubRecordsLoading.value = true
  if (selectedClub.value === '')
    return
  const data = await $fetch('/api/files/clubRecords', {
    method: 'POST',
    body: JSON.stringify({ clubId: Number.parseInt(selectedClub.value) }),
  })
  if (!data) {
    toast({
      title: '错误',
      description: '获取社团文件信息出错',
    })
  }
  clubRecords.value = {}
  for (const record of data) {
    clubRecords.value[record.fileUploadId] = record
  }
  clubRecordsLoading.value = false
}
</script>

<template>
  <Select v-model="selectedClub" @update:model-value="updateClub">
    <SelectTrigger class="mb-4 w-full lg:w-72">
      <SelectValue placeholder="选择一个社团" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="club in clubData.president" :key="club.id" :value="club.id">
        {{ club.name.zh }}
      </SelectItem>
    </SelectContent>
  </Select>
  <div v-if="!collectionLoaded">
    loading
  </div>
  <div v-if="collectionLoaded" class="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <Card v-for="collection in collectionsData" :key="collection.id" class="px-4 py-4">
      <div class="mb-5 text-xl font-bold">
        {{ collection.name }}
      </div>
      <!-- @submit="(e) => onSubmit(e, collection.id, Number.parseInt(selectedClub))" -->
      <Form class="inline-block" @submit="onSubmit">
        <!-- 谁教你这么用name的？？？ name="file" -->
        <FormField v-slot="{ componentField }" name="file">
          <FormItem class="inline-block">
            <FormControl>
              <!-- "Choose File"的颜色是黑的，simple hack -->
              <!-- add <Input .... multiple> if you want -->
              <Input
                class="text-foreground"
                type="file" v-bind="componentField"
                :accept="fileTypesAcceptAttr(collection.fileTypes)"
              />
            </FormControl>
            <FormDescription>
              {{ fileTypesPrompt(collection.fileTypes) }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit">
          <div>
            {{ clubRecords[collection.id] ? '上传' : '修改' }}
          </div>
        </Button>
      </Form>
      <Button v-if="clubRecords[collection.id] != null" variant="outline" class="ml-2">
        下载
      </Button>

      <div :key="`${collection.id}-msg`">
        <div v-if="clubRecordsLoading">
          Loading
        </div>
        <div v-if="!clubRecordsLoading">
          <div v-if="selectedClub">
            <div v-if="clubRecords[collection.id] == null" class="text-red-800">
              尚未提交
            </div>
            <div v-if="clubRecords[collection.id] != null" class="text-green-600">
              最近提交于 {{ $dayjs(clubRecords[collection.id].createdAt).fromNow() }}
            </div>
          </div>
          <div v-if="!selectedClub">
            请先选择一个社团
          </div>
        </div>
      </div>
    </Card>
  </div>
  <Toaster />
</template>
