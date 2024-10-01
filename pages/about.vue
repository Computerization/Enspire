<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <div class="prose prose-invert prose-h1:mb-1 prose-h2:mt-5 max-w-full">
    <div class="inline-block h-full align-top lg:mr-24">
      <!-- /content/about/enspire.md -->
      <ContentDoc path="/about/enspire" class="mb-12" />
      <!-- /content/about/computerization.md -->
      <ContentDoc path="/about/computerization" class="mb-12" />
    </div>
  </div>
</template>

<style scoped>

</style>
