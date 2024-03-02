<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import { useRoute } from 'vue-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

import { cleanHTML } from '~/utils/cleanHTML.d.ts'
import json from '~/content/clubs.json'
import type { Clubs } from '~/content/clubs'

const clubs: Clubs = json as Clubs
const route = useRoute()
const id = route.params.id // Fetch current Club ID via route params

// Filter clubs based on C_GroupsID and include information at the same level as groups
const filteredClubs = Object.values(clubs).flatMap(clubCategory =>
  clubCategory.filter(club =>
    club.groups.some(group => group.C_GroupsID === id),
  ).map(club => ({
    ...club, // Spread to include all same-level information
    groups: club.groups.filter(group => group.C_GroupsID === id), // Filter groups to only include those that match the ID
  })),
)

// Get the number of members in each group
const groupMemberCounts = filteredClubs.length > 0 ? filteredClubs[0].gmember.length : 0

// Get the Chinese Description of the club
let hasDescriptionC = false
let Description_C = ''

if (filteredClubs[0] && filteredClubs[0].groups[0].C_DescriptionC) {
  Description_C = cleanHTML(filteredClubs[0].groups[0].C_DescriptionC)
  hasDescriptionC = true
}

// This page requires login
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <div v-if="filteredClubs.length > 0">
    <div v-for="club in filteredClubs" :key="club.id">
      <div v-for="group in club.groups" :key="group.C_GroupsID">
        <div class="flex flex-col-reverse lg:flex-row lg:space-x-2 mb-2">
          <Card class="lg:w-3/4 w-full">
            <CardHeader>
              <CardTitle class="flex justify-between items-center">
                <div>
                  {{ group.C_NameC }}
                </div>
                <Badge v-if="club.gmember.length === 0" variant="destructive">
                  已解散
                </badge>
              </CardTitle>

              <CardDescription class="flex items-center">
                <Icon name="material-symbols:language" />
                <div class="ml-1">
                  {{ group.C_NameE }}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div v-if="hasDescriptionC" v-text="Description_C" />
              <div v-else class="text-sm italic text-muted-foreground text-center w-full">
                暂无简介 ;-(
              </div>
              <!-- Don't show the English Description until i18n is completed -->
            </CardContent>
          </Card>
          <Card class="lg:w-1/4 w-full mt-4 lg:mt-0">
            <CardHeader>
              <CardTitle class="flex items-center gap-x-1">
                社团属性
              </CardTitle>
              <CardDescription class="flex items-center">
                <Icon name="material-symbols:info-outline" />
                <div class="ml-1">
                  Club Information
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <span style="font-weight: bold">社团类型</span>: {{ group.C_Category }}
              </div>
              <div>
                <span style="font-weight: bold">社团人数</span>: {{ groupMemberCounts }} 人
              </div>
              <div style="display: flex; align-items: center;">
                <span style="font-weight: bold">指导老师:</span>
                <span v-for="supervisor in club.supervisor" :key="supervisor.TeacherID" style="margin-left: 8px;">
                  {{ supervisor.T_Name }} ({{ supervisor.T_Nickname }})
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div style="display:none">
          <Card v-if="club.grecord.length > 0" class="w-full">
            <CardHeader>
              <CardTitle class="flex justify-between items-center">
                <div>
                  近期活动
                </div>
              </CardTitle>

              <CardDescription class="flex items-center">
                <Icon name="material-symbols:language" />
                <div class="ml-1">
                  Recent Activities
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span v-for="grecord in club.grecord" :key="grecord.C_Theme">
                <div style="font-weight: bold">{{ grecord.C_Theme }}</div>
                <div class="text-sm text-muted-foreground mb-1"><Icon name="material-symbols:schedule-outline" /> {{ grecord.C_Date }}</div>
                <div class="text-sm">{{ grecord.C_Reflection }}</div><br>
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex flex-col justify-center h-1/2 text-center">
      <h3 style="font-weight: bold;font-size: x-large">
        你当前访问的页面不存在，也许你应该考虑...
      </h3>
      <br>
      <NuxtLink to="/" class="w-full">
        <Button>回到主页</Button>
      </NuxtLink>
    </div>
  </div>
</template>
