<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const props = defineProps({
  club: {
    type: Number,
    required: true,
  },
})

definePageMeta({
  middleware: ['auth'],
})

const { data } = await useAsyncData('allInfo', () => {
  return $fetch('/api/cas/info/get', {
    headers: useRequestHeaders(),
    method: 'GET',
    body: {
      club: props.club,
    },
  })
})

let noGroup = false

if (!data.value)
  noGroup = true
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center h-min gap-x-1">
        社团群聊
      </CardTitle>
      <CardDescription class="flex items-center">
        <Icon name="material-symbols:info-outline" />
        <div class="ml-1">
          Club Group
        </div>
      </CardDescription>
    </CardHeader>
    <CardContent v-if="!noGroup">
      <div>微信群聊链接: {{ data }}</div>
    </CardContent>
    <CardContent v-if="noGroup">
      <div class="text-sm italic text-muted-foreground text-center w-full my-2">
        暂无内容 ╥﹏╥...
      </div>
    </CardContent>
  </Card>
</template>
