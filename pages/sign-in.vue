<script lang="ts" setup>
import {SignIn} from 'vue-clerk';

definePageMeta({
  layout: "empty",
  middleware: ['public'],
});
</script>

<template>
  <div class="grid h-screen place-items-center">
    <SignIn sign-up-url="/sign-up"/>
  </div>
</template>
