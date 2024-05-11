<script setup lang="ts">
import {
  renderSVG,
} from 'uqr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const props = defineProps({
  club: {
    type: Number,
    required: true,
  },
})

let svg: string

definePageMeta({
  middleware: ['auth'],
})

let clubInfo: any

const { data } = await useAsyncData('allInfo', () => {
  return $fetch('/api/cas/info/get', {
    headers: useRequestHeaders(),
    method: 'GET',
    body: {
      club: props.club,
    },
  })
})

// eslint-disable-next-line prefer-const
clubInfo = data.value

let noGroup = false

if (!data.value)
  noGroup = true

if (data.value)
  svg = renderSVG(clubInfo.wechatGroupUrl)
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
      <div v-html="svg" />
    </CardContent>
    <CardContent v-if="noGroup">
      <div class="text-sm italic text-muted-foreground text-center w-full my-2">
        暂无内容 ╥﹏╥...
      </div>
    </CardContent>
  </Card>
</template>
