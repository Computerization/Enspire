<script setup lang="ts">
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { toast } from '~/components/ui/toast'
import type { Form } from '~/types/data/forms'

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
</script>

<template>
  <div class="font-bold flex items-center space-x-2 text-lg">
    <Icon name="material-symbols:edit-square-outline" />
    <div>可填写的表单</div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
    <NuxtLink v-for="club in data" :key="club.id" :to="`/forms/${club.id}`">
      <Card class="hover:underline">
        <CardHeader>
          <CardTitle>{{ club.title }}</CardTitle>
          <CardDescription>{{ club.description }}</CardDescription>
        </CardHeader>
        <CardFooter class="text-muted-foreground text-sm flex items-center">
          <div>点击填写</div>
          <Icon name="material-symbols:arrow-forward" />
        </CardFooter>
      </Card>
    </NuxtLink>
  </div>
  <Toaster />
</template>

<style scoped>
</style>
