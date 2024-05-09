<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { format } from 'date-fns'
import { ref } from 'vue'
import { scan } from 'qr-scanner-wechat'
import Calendar from '../../../ui/calendar/Calendar.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '~/components/ui/toast/use-toast'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const props = defineProps({
  club: {
    type: Number,
    required: true,
  },
})

definePageMeta({
  middleware: ['auth'],
})

const { toast } = useToast()
const isLoading = ref(false)
const id = props.club
// const club = await getEditableClub(id)
const groupUrlValid = ref(false)

// if (!club) {
//   throw createError({
//     statusCode: 404,
//     statusMessage: 'Page Not Found',
//   })
// }

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

const form = ref({
  wechatGroupUrl: '', // Initialize the form data
})

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file)
    return

  const reader = new FileReader()
  reader.onload = async () => {
    const dataUrl = reader.result as string
    const img = new Image()
    img.src = dataUrl

    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        try {
          const result = await scan(canvas)
          if (result && result.text) {
            form.value.wechatGroupUrl = result.text
            groupUrlValid.value = true
            toast({
              title: 'Success',
              description: 'URL detected from Image ;)',
            })
          }
          else {
            toast({
              title: 'Warning',
              description: 'No QR code found or no URL detected',
              variant: 'destructive',
            })
          }
        }
        catch (error) {
          toast({
            title: 'Error',
            description: 'Error scanning QR code. Please try again.',
            variant: 'destructive',
          })
        }
      }
      else {
        toast({
          title: 'Error',
          description: 'Error loading image. Please try again.',
          variant: 'destructive',
        })
      }
    }

    img.onerror = () => {
      toast({
        title: 'Error',
        description: 'Error loading image. Please try again.',
        variant: 'destructive',
      })
    }
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">
        编辑信息
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>修改社团信息</DialogTitle>
        <DialogDescription>
          您可在此处修改社团相关信息
        </DialogDescription>
      </DialogHeader>
      <form class="space-y-6" @submit="onSubmit">
        <FormField v-slot="{ componentField, value }" name="wechatGroupExpiration">
          <FormItem class="flex flex-col">
            <FormLabel>
              失效日期 Expire Date
            </FormLabel>
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

        <FormField name="wechatGroupUrl">
          <FormItem>
            <FormLabel>
              微信群聊
              <Icon v-if="groupUrlValid" class="mr-2 h-4 w-4" name="material-symbols:done" />
            </FormLabel>
            <FormControl>
              <input type="file" accept="image/*" :disabled="isLoading" @change="onFileChange">
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button :disabled="isLoading || !groupUrlValid" type="submit">
            <Icon v-if="isLoading" class="mr-2" name="svg-spinners:180-ring-with-bg" />
            提交
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
