<script setup lang='ts'>
import NewLeaveRequest from "~/components/custom/CAS/Leave/NewLeaveRequest.vue";

definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <NewLeaveRequest />
</template>
