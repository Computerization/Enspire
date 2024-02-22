<script setup lang="ts">
defineProps<{
  club: {
    id: number
  }
}>()

const isLoading = ref(false)
const dialogOpen = ref(false)

async function submitDeletion(id: number) {
  isLoading.value = true
  await useFetch('/api/cas/leave/delete', {
    method: 'DELETE',
    body: {
      id,
    },
  })
  isLoading.value = true
  dialogOpen.value = false
}
</script>

<template>
  <Button variant="ghost" class="w-8 h-8 p-0">
    <span class="sr-only">Open menu</span>
    <Icon name="material-symbols:more-horiz" size="1.2em" />
  </Button>
</template>
