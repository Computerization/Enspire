<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { ConfigProvider } from 'radix-vue'
import '@unocss/reset/tailwind.css'

const useIdFunction = () => useId()

useHead({
  meta: [
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: 'black' },
  ],
})
</script>

<template>
  <ConfigProvider :use-id="useIdFunction" :class="{ dark: useDark() }">
    <NuxtLoadingIndicator />
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ConfigProvider>
</template>

<style>
.dark {
  color-scheme: dark;
}

/* TODO: Weird that this border-color is ignored by Unocss. Might need to investigate further. */
* {
  border-color: hsl(var(--border)) !important;
}
</style>
