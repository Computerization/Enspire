<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useClerk } from 'vue-clerk'
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const clerk = useClerk()

interface backendResponse {
  token: string
  name: string
  studentNumber: string
}

definePageMeta({
  layout: 'sign-in-or-out',
  middleware: ['auth-without-bind'],
})

const { toast } = useToast()

const isLoading = ref(false)
const confirmData = ref<{ data?: backendResponse }>({})

interface InitDataSchema {
  token: string
  img: string
}

const formSchema = toTypedSchema(z.object({
  username: z.string().length(9).startsWith('s'),
  password: z.string(),
  captcha: z.string().length(4),
}))

const form = useForm({
  validationSchema: formSchema,
})

function signOutCallback() {
  window.location.replace('/sign-in')
}

function signOutHandler() {
  return clerk.signOut(signOutCallback)
}

const { data: initData } = await useFetch<InitDataSchema>('/api/bind/init')

console.log(initData.value)

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true
  const { data, error } = await useFetch<backendResponse>('/api/bind', {
    method: 'post',
    body: { ...values, ...{ token: initData.value?.token } },
  })
  if (error.value) {
    if (error.value.statusCode === 403) {
      toast({
        variant: 'destructive',
        title: '凭证错误',
        description: '请检查您输入的帐号密码',
      })
    }
    else if (error.value.statusCode === 500) {
      toast({
        variant: 'destructive',
        title: '服务器错误',
        description: '请稍后再试',
      })
    }
    else {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '请稍后再试',
      })
    }
  }
  isLoading.value = false
  if (data.value)
    confirmData.value = { data: data.value }
})

const submitConfirm = async function () {
  isLoading.value = true
  if (!confirmData.value.data) {
    toast({
      variant: 'destructive',
      title: '错误',
      description: '请稍后再试',
    })
    return
  }
  const { error } = await useFetch('/api/bind/confirm', {
    method: 'post',
    body: { token: confirmData.value.data.token },
  })
  if (error.value) {
    if (error.value.statusCode === 403) {
      toast({
        variant: 'destructive',
        title: '该TSIMS账户已被绑定',
        description: '请重试',
      })
    }
    else {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '请稍后再试',
      })
    }
  }
  else {
    window.location.replace('/')
    // await navigateTo('/', { replace: true })
  }
  isLoading.value = false
}
</script>

<template>
  <div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">
      绑定TSIMS账户
    </h1>
    <p class="text-sm text-muted-foreground">
      输入您在TSIMS中的账户信息
    </p>
  </div>
  <div class="grid place-items-center">
    <div class="grid w-2/5 min-w-80">
      <div v-if="!confirmData.data">
        <form class="space-y-6" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input
                  :disabled="isLoading" auto-correct="off" placeholder="TSIMS用户名" type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input
                  :disabled="isLoading" auto-correct="off" class="mt-1" placeholder="TSIMS密码" type="password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="captcha">
            <FormItem>
              <FormLabel>验证码</FormLabel>
              <FormControl>
                <div class="flex space-x-2">
                  <Input
                    :disabled="isLoading" auto-correct="off" class="mt-1" placeholder="四位验证码" type="text"
                    v-bind="componentField"
                  />
                  <img :src="`data:image/jpeg;base64, ${initData?.img}`" alt="captcha" class="rounded my-1">
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button :disabled="isLoading" class="w-full mt-1" type="submit">
            <Icon v-if="isLoading" class="mr-2" name="svg-spinners:180-ring-with-bg" />
            登陆
          </Button>
        </form>
        <Button class="mt-2 w-full" variant="outline" @click="signOutHandler">
          退出登陆
        </Button>
      </div>

      <div v-if="confirmData.data" class="flex items-center flex-col">
        <div class="space-y-3 flex-col items-center text-center">
          <h4 class="font-medium leading-none">
            姓名: {{ confirmData.data?.name }}
          </h4>
          <h4 class="font-medium leading-none text-center">
            学号: {{ confirmData.data?.studentNumber }}
          </h4>
        </div>
        <AlertDialog>
          <AlertDialogTrigger class="w-full">
            <Button :disabled="isLoading" class="mt-5 w-full">
              <Icon v-if="isLoading" class="mr-2" name="svg-spinners:180-ring-with-bg" />
              上述信息正确
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>您确定吗？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作无法撤销。一经绑定，其它帐号将无法绑定此TSIMS帐号，您的帐号也无法绑定其它TSIMS帐号。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction @click="submitConfirm">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </div>
  <Toaster />
</template>
