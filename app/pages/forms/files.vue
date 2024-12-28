<script setup lang="ts">
import type { FileCollection } from '@prisma/client'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { v4 as uuidv4 } from 'uuid'
import { useForm } from 'vee-validate'

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
_s1()

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

const { data: clubData, suspense: _s2 } = useQuery<any>({
  queryKey: ['/api/user/all_clubs'],
})
_s2()

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
const form = useForm({})
function updateFiles(event: any, collection: string) {
  if (!selectedClub.value)
    return
  if (event != null) {
    document.getElementById(`${collection}-prompt`).textContent = event.target.files[0].name
  }
  else {
    document.getElementById(`${collection}-prompt`).textContent = fileTypesPrompt(
      collectionsData.value.find(c => c.id === collection)?.fileTypes || [],
    )
  }
}

let clubRecords = {}
const clubRecordsLoading = ref(false)
const uploading = ref(false)

function readFileAsDataURL(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function onSubmit(event: any, collection: string, club: number) {
  uploading.value = true
  await form.handleSubmit(async (files: any) => {
    if (!club) {
      toast({
        title: '提示',
        description: '请先选择一个社团',
      })
      return
    }
    if (files[collection] == null) {
      toast({
        title: '提示',
        description: '请先选择一个文件',
      })
      return
    }
    const dataURL = await readFileAsDataURL(files[collection])
    const responseData = await $fetch('/api/files/newRecord', {
      method: 'POST',
      body: JSON.stringify({
        clubId: club,
        collectionId: collection,
        fileContent: dataURL,
        fileName: '测试文件',
      }),
    })
    if (responseData && responseData.success) {
      toast({
        title: '成功',
        description: '文件上传成功',
      })
      console.log('SUCCESS')
    }
    else {
      toast({
        title: '错误',
        description: '文件上传失败',
      })
      console.log('FAILED')
      console.log(responseData)
    }
    form.resetForm()
    updateFiles(null, collection)
    await updateClub()
    uploading.value = false
  })(event)
}

async function updateClub() {
  clubRecordsLoading.value = true
  clubRecords = {}
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
  for (const record of data) {
    clubRecords[record.fileUploadId] = record
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
      <form class="inline-block" @submit="(e) => onSubmit(e, collection.id, Number.parseInt(selectedClub))">
        <FormField v-slot="{ componentField }" :name="collection.id">
          <FormItem class="inline-block">
            <FormControl>
              <Button variant="secondary" type="button" :disabled="!selectedClub || uploading">
                <Label class="cursor-pointer">
                  选择文件
                  <Input
                    type="file" class="hidden" v-bind="componentField"
                    :accept="fileTypesAcceptAttr(collection.fileTypes)"
                    @change="(e) => updateFiles(e, collection.id)"
                  />
                </Label>
              </Button>
            </FormControl>
          </FormItem>
        </FormField>
        <Button class="ml-2" type="submit">
          <div v-if="clubRecords[collection.id] == null">
            上传
          </div>
          <div v-if="clubRecords[collection.id] != null">
            修改
          </div>
        </Button>
      </form>
      <Button v-if="clubRecords[collection.id] != null" variant="outline" class="ml-2">
        下载
      </Button>
      <div :id="`${collection.id}-prompt`" class="mb-4 text-sm text-muted-foreground">
        {{ fileTypesPrompt(collection.fileTypes) }}
      </div>
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
