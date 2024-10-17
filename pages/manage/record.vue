<script setup lang="ts">
import LazyNewActivityRecord from '~/components/custom/CAS/Record/NewActivityRecord.vue'
import ViewMyActivityRecords from '~/components/custom/CAS/Record/ViewMyActivityRecords.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import Skeleton from '~/components/ui/skeleton/Skeleton.vue'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Activity Record | Enspire',
})

const refreshState = ref(false)
</script>

<template>
  <div class="space-y-4">
    <Suspense>
      <ViewMyActivityRecords :refresh-watcher="ref(refreshState)" />
      <template #fallback>
        <Card class="w-full">
          <CardHeader>
            <CardTitle class="flex items-center gap-x-1">
              <Icon name="ic:sharp-remove-red-eye" />
              我的申请
            </CardTitle>
            <CardDescription>在此处浏览您的活动签到</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton class="w-full h-32" />
          </CardContent>
        </Card>
      </template>
    </Suspense>
    <Suspense>
      <LazyNewActivityRecord @refresh="refreshState = !refreshState" />
      <template #fallback>
        <Card class="w-full">
          <CardHeader>
            <CardTitle class="flex items-center gap-x-1">
              <Icon name="material-symbols:add-circle-outline" />
              新增
            </CardTitle>
            <CardDescription>在此处新增活动签到</CardDescription>
          </CardHeader>
          <CardContent>
            <form class="space-y-6">
              <FormField name="email">
                <FormItem>
                  <FormLabel>
                    <Skeleton class="w-16 h-4" />
                  </FormLabel>

                  <Skeleton class="w-full h-9" />
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="date">
                <FormItem class="flex flex-col">
                  <FormLabel>
                    <Skeleton class="w-16 h-4" />
                  </FormLabel>
                  <Skeleton class="w-full h-9" />
                </FormItem>
              </FormField>

              <FormField name="reason">
                <FormItem>
                  <FormLabel>
                    <Skeleton class="w-16 h-4" />
                  </FormLabel>
                  <Skeleton class="w-full h-14" />
                </FormItem>
              </FormField>

              <FormField name="text">
                <FormItem>
                  <FormLabel>
                    <Skeleton class="w-16 h-4" />
                  </FormLabel>
                  <Skeleton class="w-full h-14" />
                </FormItem>
              </FormField>

              <Skeleton class="w-20 h-9" />
            </form>
          </CardContent>
        </Card>
      </template>
    </Suspense>
  </div>
</template>
