<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { cleanHTML } from '~/components/custom/cleanHTML.d.ts'
import json from '~/content/clubs.json'
import type { Clubs } from '~/content/clubs'

const clubs: Clubs = json as Clubs
const route = useRoute()
const id = route.params.id // Fetch current Club ID via route params

// Filter clubs based on C_GroupsID
// It just works ;)
const filteredClubs = Object.values(clubs).flatMap(clubCategory =>
  clubCategory.flatMap(club => club.groups.filter(group => group.C_GroupsID === id)))

// Get the number of members in each group
// const groupMemberCounts = filteredClubs.map(group => group.gmember.length)

let Description_C
if (filteredClubs[0] && filteredClubs[0].C_DescriptionC)
  Description_C = cleanHTML(filteredClubs[0].C_DescriptionC) || '<div class="text-sm italic text-muted-foreground text-center w-full">暂无简介 ;-(</div>'
else
  Description_C = '<div class="text-sm italic text-muted-foreground text-center w-full">暂无简介 ;-(</div>'

// This page requires login
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <div v-if="filteredClubs.length > 0">
    <div v-for="group in filteredClubs" :key="group.C_GroupsID">
      <div class="flex flex-col lg:flex-row lg:space-x-2">
        <Card class="lg:w-3/4 w-full">
          <CardHeader>
            <CardTitle class="flex items-center gap-x-1">
              {{ group.C_NameC }}
            </CardTitle>

            <CardDescription>{{ group.C_NameE }}</CardDescription>
          </CardHeader>
          <CardContent>
            <p v-html="Description_C" />
            <!-- Don't show the English Description until i18n is completed -->
            <!-- <br> -->
            <!-- <p v-html="cleanDescription(group.C_DescriptionE)"></p> -->
          </CardContent>
        </Card>
        <Card class="lg:w-1/4 w-full mt-4 lg:mt-0">
          <CardHeader>
            <CardTitle class="flex items-center gap-x-1">
              社团属性
            </CardTitle>
            <CardDescription>Club Info</CardDescription>
          </CardHeader>
          <CardContent>
            <p>社团类型: {{ group.C_Category }}</p>
            <!-- <p>社团人数: {{ groupMemberCounts }}</p> -->
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex flex-col justify-center h-1/2 text-center">
      <h3 style="font-weight: bold;font-size: x-large">你当前访问的页面不存在，也许你应该考虑...</h3>
      <br>
      <NuxtLink :to="`/`" class="w-full">
        <Button>回到主页</Button>
      </NuxtLink>
    </div>
  </div>
</template>
