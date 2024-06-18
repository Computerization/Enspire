<script setup lang="ts">
import { SignIn } from 'vue-clerk'
import { usePreferredDark } from '@vueuse/core'
import { dark } from '@clerk/themes'

const isDark = usePreferredDark()

definePageMeta({
  layout: 'sign-in-or-out',
  middleware: ['public'],
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
    <SignIn sign-up-url="/sign-up" :appearance="{ baseTheme: isDark ? dark : undefined }" />
  </div>
</template>
