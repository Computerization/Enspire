<script setup lang="ts">
import { useUser } from 'vue-clerk';

definePageMeta({
  middleware: ['auth'],
});

const { user } = useUser();
</script>

<template>
  <h1 class="text-3xl font-semibold">
    👋 Hi, {{ user?.firstName }}!
  </h1>
</template>
