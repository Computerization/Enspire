<script setup lang="ts">
import NewClassroomReservation from '~/components/custom/CAS/ClassroomReservation/NewClassroomReservation.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Classroom Reservation | Enspire',
})
</script>

<template>
  <Suspense>
    <NewClassroomReservation />
    <template #fallback>
      <Card>
        <CardHeader>
          <CardTitle>预约教室</CardTitle>
          <CardDescription>在此处预约教室</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-2">
            <FormField name="main">
              <FormItem>
                <FormLabel>预约时间</FormLabel>
                <FormControl>
                  <div>
                    <Skeleton class="h-[36px]" />
                  </div>
                </FormControl>
              </FormItem>
              <div class="py-1" />
              <FormItem>
                <FormLabel>选择教室</FormLabel>
                <FormControl>
                  <Skeleton class="h-[36px]" />
                </FormControl>
              </FormItem>
              <div class="py-1" />
              <FormItem>
                <FormLabel>社团</FormLabel>
                <FormControl>
                  <Skeleton class="h-[36px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
              <div class="py-1" />
              <FormItem>
                <FormLabel>备注</FormLabel>
                <FormControl>
                  <Skeleton class="h-[78px]" />
                </FormControl>
                <FormDescription>
                  非必填
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <div class="py-2" />
            <Skeleton class="h-[40px] w-[100px]" />
          </form>
        </CardContent>
      </Card>
    </template>
  </Suspense>
  <Toaster />
</template>
