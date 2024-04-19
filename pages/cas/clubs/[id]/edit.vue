<script setup lang="ts">
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { getEditableClub } from './utils'
import Calendar from '~/components/ui/calendar/Calendar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { Textarea } from '~/components/ui/textarea'
import { useToast } from '~/components/ui/toast/use-toast'
import { Toaster } from '~/components/ui/toast'

definePageMeta({
  middleware: ['auth'],
})

const { toast } = useToast()

const id = Number(useRoute().params.id)
const isLoading = ref(false)

const club = await getEditableClub(id)

if (!club) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

// Check if the Club have Group Information
const { data: groupValue } = await useAsyncData(
  'allInfo',
  () => $fetch(
    '/api/cas/info/get',
    { headers: useRequestHeaders(), method: 'GET', body: { club: id },
    },
  ),
)
const noGroup = !groupValue.value

const formSchema = toTypedSchema(z.object({
  clubId: z.number(),
  wechatGroupUrl: z.string().startsWith('https://weixin.qq.com/g/', { message: 'WeChat Info URL required' }),
  wechatGroupExpiration: z.date(),
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  values.clubId = Number(id)
  const apiUrl = noGroup ? '/api/cas/info/new' : '/api/cas/info/update'
  const { error } = await useFetch(apiUrl, {
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
  resetForm()
})
</script>

<template>
  <Card class="w-full h-min mt-2">
    <CardHeader>
      <CardTitle v-if="noGroup" class="flex items-center h-min gap-x-1">
        添加 {{ club.name.zh }} 群聊信息
      </CardTitle>
      <CardTitle v-if="!noGroup" class="flex items-center h-min gap-x-1">
        编辑 {{ club.name.zh }} 群聊信息
      </CardTitle>
      <CardDescription class="flex items-center">
        <Icon name="material-symbols:info-outline" />
        <div class="ml-1">
          {{ club.name.zh }} Group Info
        </div>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-6" @submit="onSubmit">
        <FormField v-slot="{ componentField, value }" name="wechatGroupExpiration">
          <FormItem class="flex flex-col">
            <FormLabel>失效日期 Expire Date</FormLabel>
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

        <FormField v-slot="{ componentField }" name="wechatGroupUrl">
          <FormItem>
            <FormLabel>WeChat Group URL</FormLabel>
            <FormControl>
              <Textarea
                class="resize-none"
                placeholder="WeChat Group URL"
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
