<script setup lang="ts">
import { SignUp } from 'vue-clerk';

definePageMeta({
  layout: "sign-in-or-out",
  middleware: ['public'],
});
</script>

<template>
  <div class="grid h-screen place-items-center">
    <SignUp sign-in-url="/sign-in" />
  </div>
</template>
