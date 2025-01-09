<script setup lang="ts">
import type { FileCollection } from '@prisma/client'
import type { AllClubs } from '~~/types/api/user/all_clubs'
import ClubFileUpload from '@/components/custom/club-file-upload.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { toTypedSchema } from '@vee-validate/zod'
import { v4 as uuidv4 } from 'uuid'
import { useForm } from 'vee-validate'
import * as z from 'zod'

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
await _s1()

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
await _s2()

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

const selectedClub = ref('')
</script>

<template>
  <Select v-model="selectedClub">
    <SelectTrigger class="mb-4 w-full lg:w-72">
      <SelectValue placeholder="选择一个社团" />
    </SelectTrigger>
    <SelectContent v-if="clubLoaded && clubData">
      <SelectItem v-for="club in clubData.president" :key="club.id" :value="String(club.id)">
        {{ club.name.zh }}
      </SelectItem>
    </SelectContent>
  </Select>
  <div v-if="clubLoaded && collectionLoaded" class="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <ClubFileUpload
      v-for="collection in collectionsData"
      :key="collection.id"
      :club="selectedClub"
      :collection="collection.id"
      :filetypes="collection.fileTypes"
      :title="collection.name"
    />
  </div>
  <div v-else>
    loading
  </div>
  <Toaster />
</template>
