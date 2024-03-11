<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <!-- Content source at /content/about.md -->
  <div class="prose prose-invert prose-h1:mb-1 prose-h2:mt-5">
    <ContentDoc path="/about" />
  </div>
</template>

<style scoped>

</style>
