<script setup lang="ts">
import { ConfigProvider } from 'radix-vue'

const useIdFunction = () => useId()

useHead({
  meta: [
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#1a202c' },
  ],
})
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <NuxtLoadingIndicator />
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ConfigProvider>
</template>
