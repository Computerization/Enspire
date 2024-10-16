<script setup lang="ts">
import { ConfigProvider } from 'radix-vue'

const useIdFunction = () => useId()

useHead({
  meta: [
    { name: 'description', content: 'Enspire is an open-source project led by the Computerization, '
    + 'aimed at providing a technical support platform for WFLAers.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Enspire' },
    { property: 'og:description', content: 'Enspire is an open-source project led by the Computerization, '
    + 'aimed at providing a technical support platform for WFLAers.' },
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: 'black' },
  ],
  htmlAttrs: {
    lang: 'zh-CN',
  },
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
