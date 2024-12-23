<script setup lang="ts">
import { SignUp } from 'vue-clerk'

definePageMeta({
  layout: 'sign-in-or-out',
  middleware: ['public'],
})

useHead({
  title: 'Sign Up | Enspire',
})
</script>

<template>
  <div class="flex flex-col space-y-2 text-center items-center">
    <h1 class="text-2xl font-semibold tracking-tight">
      创建账户
    </h1>
    <p class="text-sm text-muted-foreground">
      输入您的凭证
    </p>
  </div>
  <div class="grid place-items-center">
    <SignUp :appearance="{ elements: { card: 'clerk-card' } }" redirect-url="/account/bind" />
  </div>
</template>
