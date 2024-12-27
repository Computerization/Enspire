<script setup lang="ts">
import type { FileCollection } from '@prisma/client'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
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

let collectionLoaded = false
if (collectionsData.value) {
  collectionLoaded = true
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

let clubLoaded = false
if (clubData.value) {
  clubLoaded = true
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

const selectedClub = ref('')

const form: any = useForm({})
// for (const collection of collectionsData) {
//   form[collection.id] = useForm({})
// }

const onSubmit = form.handleSubmit((values, cid) => {
  console.log(values)
  console.log(cid)
})
</script>

<template>
  <Select v-model="selectedClub">
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
      <form class="inline-block" @submit="onSubmit($event, collection.id)">
        <FormField v-slot="{ componentField }" name="theFile">
          <FormItem class="inline-block">
            <FormControl>
              <Button variant="secondary" type="button">
                <Label class="cursor-pointer">
                  选择文件
                  <Input type="file" class="hidden" v-bind="componentField" />
                </Label>
              </Button>
            </FormControl>
          </FormItem>
        </FormField>
        <Button class="ml-2" type="submit">
          上传
        </Button>
      </form>
      <Button variant="outline" class="ml-2">
        下载
      </Button>
      <div class="mb-4 text-sm text-muted-foreground">
        {{ fileTypesPrompt(collection.fileTypes) }}
      </div>
      <div>
        STATUS
      </div>
    </Card>
  </div>
  <Toaster />
</template>
