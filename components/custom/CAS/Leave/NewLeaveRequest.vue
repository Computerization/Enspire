<script lang='ts' setup>
import { format } from 'date-fns'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { AllClubs } from '~/types/api/user/all_clubs'
import Calendar from '~/components/ui/calendar/Calendar.vue'
import { cn } from '~/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '~/components/ui/toast'

const emit = defineEmits(['refresh'])

const { toast } = useToast()

definePageMeta({
  middleware: ['auth'],
})

const isLoading = ref(false)

const formSchema = toTypedSchema(z.object({
  club: z.string(),
  date: z.date(),
  reason: z.string().max(100),
}))

const { data } = await useAsyncData<AllClubs>('allClubs', () => {
  return $fetch('/api/user/all_clubs', {
    headers: useRequestHeaders(),
    method: 'GET',
  })
})

if (!data.value) {
  throw createError({
    statusCode: 500,
    statusMessage: '服务器错误',
  })
}

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  const { error } = await useFetch('/api/cas/leave/new', {
    headers: useRequestHeaders(),
    method: 'post',
    server: false,
    body: values,
  })
  if (error.value) {
    toast({
      title: '错误',
      description: '请稍后再试',
      variant: 'destructive',
    })
  }
  isLoading.value = false
  emit('refresh')
  resetForm()
})
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center gap-x-1">
        <Icon name="material-symbols:add-circle-outline" />
        新增
      </CardTitle>
      <CardDescription>在此处新增请假申请</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-6" @submit="onSubmit">
        <FormField v-slot="{ componentField, value }" name="club">
          <FormItem>
            <FormLabel>社团</FormLabel>

            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger
                  :class="cn(
                    'w-full ps-3 text-start font-normal hover:bg-muted',
                    !value && 'text-muted-foreground',
                  )" variant="outline" :disabled="isLoading"
                >
                  <SelectValue placeholder="选择您需要请假的社团..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup v-if="data">
                  <SelectItem
                    v-for="club in [...data.member, ...data.vice, ...data.president]"
                    :key="club.id" :value="String(club.id)"
                  >
                    {{ club.name.zh }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, value }" name="date">
          <FormItem class="flex flex-col">
            <FormLabel>请假日期</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <FormControl>
                  <Button
                    :class="cn(
                      'w-full ps-3 text-start font-normal',
                      !value && 'text-muted-foreground',
                    )" variant="outline"
                    :disabled="isLoading"
                  >
                    <span>{{ value ? format(value, "PPP") : "选择日期..." }}</span>
                    <Icon class="ms-auto opacity-50" name="material-symbols:calendar-today-outline" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent class="p-0">
                <Calendar :min-date="new Date()" v-bind="componentField" />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="reason">
          <FormItem>
            <FormLabel>请假原因</FormLabel>
            <FormControl>
              <Textarea
                class="resize-none"
                placeholder="请假原因，最多一百字..."
                v-bind="componentField"
                :disabled="isLoading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button :disabled="isLoading" type="submit">
          <Icon v-if="isLoading" class="mr-2" name="svg-spinners:180-ring-with-bg" />
          提交
        </Button>
      </form>
    </CardContent>
  </Card>
  <Toaster />
</template>
