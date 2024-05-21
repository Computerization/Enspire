<script setup lang="ts">
import { SignIn } from 'vue-clerk'

definePageMeta({
  layout: 'sign-in-or-out',
  middleware: ['public'],
})

useHead({
  title: 'Sign In | Enspire',
})
</script>

<template>
  <div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">
      登录账户
    </h1>
    <p class="text-sm text-muted-foreground">
      在下方输入凭证
    </p>
  </div>
  <div class="grid place-items-center">
    <SignIn sign-up-url="/sign-up" />
  </div>
</template>
