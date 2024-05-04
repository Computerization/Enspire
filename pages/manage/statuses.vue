<script setup lang="ts">
import { Card } from '@/components/ui/card'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Classroom Statuses | Enspire',
})
</script>

<template>
  <Card class="">
    hi
  </Card>
</template>
