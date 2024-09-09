<script setup lang="ts">
import Announcements from '~/components/custom/Index/announcements.vue'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Home | Enspire',
})

const now = new Date().getHours()
</script>

<template>
  <div class="text-3xl font-bold">
    {{
      now < 5 ? '晚上好！'
      : now < 12 ? '早上好！'
        : now < 13 ? '中午好！'
          : now < 18 ? '下午好！' : '晚上好！'
    }}
  </div>
  <div class="text-muted-foreground">
    Welcome to Enspire!
  </div>
  <div class="space-y-2 mt-7">
    <Announcements />
  </div>
</template>

<style scoped>

</style>
