<script setup lang="ts">
defineProps<{
  club: {
    id: string
  }
}>()
</script>

<template>
  <!-- Just acts as a fake button. Actually you could tap anywhere in the row to trigger the dialog. -->
  <Button variant="ghost" class="w-8 h-8 p-0">
    <span class="sr-only">Open menu</span>
    <Icon name="material-symbols:more-horiz" size="1.2em" />
  </Button>
</template>
