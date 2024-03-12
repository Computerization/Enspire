<script setup lang="ts">
import LazyNewLeaveRequest from '~/components/custom/CAS/Leave/NewLeaveRequest.vue'
import Skeleton from '~/components/ui/skeleton/Skeleton.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import ViewMyLeaveRequests from '~/components/custom/CAS/Leave/ViewMyLeaveRequests.vue'

definePageMeta({
  middleware: ['auth'],
})

const refreshState = ref(false)
</script>

<template>
  <div class="space-y-4">
    <Suspense>
      <ViewMyLeaveRequests :refresh-watcher="ref(refreshState)" />
      <template #fallback>
        <Card class="w-full">
          <CardHeader>
            <CardTitle class="flex items-center gap-x-1">
              <Icon name="ic:sharp-remove-red-eye" />
              我的申请
            </CardTitle>
            <CardDescription>在此处浏览您的请假申请</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton class="w-full h-32" />
          </CardContent>
        </Card>
      </template>
    </Suspense>
    <Suspense>
      <LazyNewLeaveRequest @refresh="refreshState = !refreshState" />
      <template #fallback>
        <Card class="w-full">
          <CardHeader>
            <CardTitle class="flex items-center gap-x-1">
              <Icon name="material-symbols:add-circle-outline" />
              新增
            </CardTitle>
            <CardDescription>在此处新增请假申请</CardDescription>
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

              <Skeleton class="w-20 h-9" />
            </form>
          </CardContent>
        </Card>
      </template>
    </Suspense>
  </div>
</template>
