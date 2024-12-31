<script lang="ts" setup>
import { ref } from 'vue'

const refreshState = ref(false)

definePageMeta({
  middleware: ['auth'],
  breadcrumb: '新建',
})
</script>

<template>
  <Suspense>
    <CustomCASRecordNewActivityRecord @refresh="refreshState = !refreshState" />
    <template #fallback>
      <Card class="w-full">
        <CardHeader>
          <CardTitle class="flex items-center gap-x-1">
            <Icon name="material-symbols:add-circle-outline" />
            新增
          </CardTitle>
          <CardDescription>在此处新增活动记录</CardDescription>
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
</template>
