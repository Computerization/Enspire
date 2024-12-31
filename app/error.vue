<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => reloadNuxtApp({ path: '/' })

console.error(props.error)
</script>

<template>
  <div class="min-h-screen flex items-center px-4 py-12 lg:px-12 md:px-8 sm:px-6 xl:px-16">
    <div class="grid w-full">
      <div class="col-start-1 row-start-1 h-full w-full flex items-center justify-center">
        <div class="z-10 select-none text-9xl text-foreground font-bold tracking-tighter opacity-10">
          {{ props.error?.statusCode }}
        </div>
      </div>
      <div class="z-20 col-start-1 row-start-1 w-full text-center space-y-6">
        <div class="space-y-3">
          <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl">
            Oops! Lost in Cyberspace
          </h1>
          <p class="text-gray-500">
            别担心，错误已被报告，我们会尽快修复。<br>
            请尝试点击“回到首页”，在多数情况下这会解决问题。
          </p>
        </div>
        <div class="flex justify-center space-x-2">
          <Button
            @click="handleError"
          >
            回到首页
          </Button>
          <NuxtLink to="https://github.com/Computerization/Enspire/issues" external>
            <Button variant="outline">
              查看已知问题
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
