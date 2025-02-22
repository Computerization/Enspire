<script lang="ts" setup>
import { ref } from 'vue'
import CustomCASRecordViewMyActivityRecords from '@/components/custom/CAS/Record/ViewMyActivityRecords.vue'

definePageMeta({
  middleware: ['auth'],
  breadcrumb: '浏览',
})

useHead({
  title: 'Activities | Enspire',
})
</script> 

<template>
  <Suspense>
    <CustomCASRecordViewMyActivityRecords :refreshWatcher="ref(false)" />
    <template #fallback>
      <Card class="w-full">
        <CardHeader>
          <CardTitle class="flex items-center gap-x-1">
            <Icon name="ic:sharp-remove-red-eye" />
            我的申请
          </CardTitle>
          <CardDescription>在此处浏览您的活动记录</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton class="h-32 w-full" />
        </CardContent>
      </Card>
    </template>
  </Suspense>
</template>
