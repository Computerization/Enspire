<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { useClerk } from 'vue-clerk'
import { toast } from '~/components/ui/toast'
import type { Form } from '~/types/data/forms'

const clerk = useClerk()

const { height } = useWindowSize()

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Forms | Enspire',
})

const { data } = await useAsyncData<Form[]>('classroomStatuses', () => {
  return $fetch<Form[]>(`/api/forms/open`, {
    headers: useRequestHeaders(),
    method: 'GET',
  })
})

if (!data.value) {
  toast({
    title: '错误',
    description: '获取教室信息出错',
  })
}

const form = data.value!.find(
  form => form.id === String(useRoute().params.id),
)
</script>

<template>
  <div v-if="form" class="font-bold text-xl">
    {{ form.title }}
  </div>
  <div v-if="form" class="text-muted-foreground text-sm">
    {{ form.description }}
  </div>
  <div v-if="form" class="rounded">
    <ClientOnly>
      <iframe
        :height="height - 110"
        width="100%"
        class="rounded"
        :src="`${form.url}&userid=${clerk.user.id}`"
      />
    </ClientOnly>
  </div>
</template>

<style scoped></style>
