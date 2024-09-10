<script setup lang="ts">
import { useFavicon, usePreferredDark } from '@vueuse/core'
import IconLogo from '@/assets/logo.svg'

const isDark = usePreferredDark()
const favicon = computed(() => isDark.value ? '/favicon-dark.ico' : '/favicon.ico')

useFavicon(favicon)
</script>

<template>
  <div class="md:hidden" />

  <div
    class="container h-screen relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <div class="relative hidden h-screen flex-col bg-muted text-white dark:border-r p-10 lg:flex bg-zinc-900">
      <div class="relative z-20 flex items-center text-lg font-medium">
        <IconLogo class="text-3xl mt-1.5 hover:animate-spin" />
        <div class="ml-0.5 text-2xl tracking-tight">
          enspire
        </div>
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <a href="https://www.netlify.com">
            <img src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg" alt="Deploys by Netlify">
          </a>
          <p class="text-lg">
            "Make life great again at SWFLA!"
          </p>
          <footer class="text-sm">
            Powered by Computerization
          </footer>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6">
        <slot />
        <p class="px-8 text-center text-sm text-muted-foreground">
          点击继续，即表示您同意将数据递交给我们处理，<br>信息化社将竭力保证每一位用户的隐私安全。
        </p>
      </div>
    </div>
  </div>
</template>
