<script setup lang="ts">
import type { Form } from '@@/types/data/forms'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import Toaster from '@/components/ui/toast/Toaster.vue'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Forms | Enspire',
})

const { data, suspense } = useQuery<Form[]>({
  queryKey: ['/api/forms/open'],
})
await suspense()

if (!data.value) {
  toast({
    title: '错误',
    description: '获取教室信息出错',
  })
}
</script>

<template>
  <div class="flex items-center text-lg font-bold space-x-2">
    <Icon name="material-symbols:edit-square-outline" />
    <div>可填写的表单</div>
  </div>
  <div class="grid grid-cols-1 mt-2 gap-4 md:grid-cols-2 xl:grid-cols-3">
    <NuxtLink v-for="club in data" :key="club.id" :to="`/forms/${club.id}`">
      <Card class="hover:underline">
        <CardHeader>
          <CardTitle>{{ club.title }}</CardTitle>
          <CardDescription>{{ club.description }}</CardDescription>
        </CardHeader>
        <CardFooter class="flex items-center text-sm text-muted-foreground">
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
