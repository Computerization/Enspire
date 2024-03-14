<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cleanHTML } from '@/lib/utils'
import json from '@/content/clubs.json'
import type { Club, Clubs } from '@/content/clubs'

const clubs: Clubs = json as Clubs
const route = useRoute()
const id = route.params.id // Fetch current Club ID via route params

// Filter clubs based on C_GroupsID and include information at the same level as groups
const filteredClubs = Object.values(clubs).flatMap(clubCategory =>
  clubCategory.filter((club: Club) =>
    club.groups.some(group => group.C_GroupsID === id),
  ).map((club: Club) => ({
    ...club, // Spread to include all same-level information
    groups: club.groups.filter(group => group.C_GroupsID === id), // Filter groups to only include those that match the ID
  })),
) as Club[]

// Get the number of members in each group
const groupMemberCounts = filteredClubs.length > 0 ? filteredClubs[0].gmember.length : 0

// Get the Chinese Description of the club
let hasDescriptionC = false
let Description_C = ''

if (filteredClubs[0] && filteredClubs[0].groups[0].C_DescriptionC) {
  const tempDescription = cleanHTML(filteredClubs[0].groups[0].C_DescriptionC)
  if (tempDescription.trim() !== '') {
    Description_C = tempDescription
    hasDescriptionC = true
  }
}

// This page requires login
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <div v-if="filteredClubs.length > 0">
    <div v-for="club in filteredClubs" :key="club.groups[0].C_GroupNo">
      <div v-for="group in club.groups" :key="group.C_GroupsID">
        <div class="flex flex-col-reverse xl:flex-row">
          <Card class="xl:w-3/4 w-full mt-2 xl:mt-0">
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
                <div v-if="group.C_NameE" class="ml-1">
                  {{ group.C_NameE }}
                </div>
                <div v-else class="ml-1">
                  Club Description
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="font-bold">
                简介
              </div>
              <div v-if="hasDescriptionC" class="my-3" v-text="Description_C" />
              <div v-else class="text-sm italic text-muted-foreground text-center w-full my-2">
                暂无简介 ;-(
              </div>
              <!-- Don't show the English Description until i18n is completed -->
              <Separator class="my-4" />
              <div class="font-bold">
                成员
              </div>
              <div v-if="club.gmember.length === 0" class="text-sm italic text-muted-foreground text-center w-full my-2">
                暂无成员 ;-(
              </div>
              <div v-else class="mt-3">
                <div class="flex flex-wrap">
                  <div v-for="(member, index) in club.gmember" :key="member.StudentID" class="flex items-center">
                    <div class="flex items-center">
                      <span class="">{{ member.S_Name }}</span>
                      <span v-if="member.S_Nickname" class="text-muted-foreground ml-2">({{ member.S_Nickname }})</span>
                      <Badge v-if="Number(member.LeaderYes) === 2" variant="default" class="ml-1">
                        社长
                      </Badge>
                      <Badge v-else-if="Number(member.LeaderYes) === 1" variant="secondary" class="ml-1">
                        副社
                      </Badge>
                      <Badge v-else variant="outline" class="ml-1">
                        社员
                      </Badge>
                      <span v-if="index < club.gmember.length - 1" class="mx-2">/</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card class="xl:w-1/4 w-full xl:ml-2 h-min">
            <CardHeader>
              <CardTitle class="flex items-center h-min gap-x-1">
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
                <span class="font-bold">社团类型</span>: {{ group.C_Category }}
              </div>
              <div>
                <span class="font-bold">社团人数</span>: {{ groupMemberCounts }} 人
              </div>
              <div v-if="club.supervisor" class="flex">
                <span class="font-bold">指导老师:</span>
                <span v-for="supervisor in club.supervisor" :key="supervisor.TeacherID" class="ml-2">
                  {{ supervisor.T_Name }} ({{ supervisor.T_Nickname }})
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <!--        <div style="display:none"> -->
        <!--          <Card v-if="club.grecord.length > 0" class="w-full"> -->
        <!--            <CardHeader> -->
        <!--              <CardTitle class="flex justify-between items-center"> -->
        <!--                <div> -->
        <!--                  近期活动 -->
        <!--                </div> -->
        <!--              </CardTitle> -->

        <!--              <CardDescription class="flex items-center"> -->
        <!--                <Icon name="material-symbols:draw-outline" /> -->
        <!--                <div class="ml-1"> -->
        <!--                  Recent Activities -->
        <!--                </div> -->
        <!--              </CardDescription> -->
        <!--            </CardHeader> -->
        <!--            <CardContent> -->
        <!--              <div v-for="grecord in club.grecord" :key="grecord.C_Theme"> -->
        <!--                <div class="font-bold"> -->
        <!--                  {{ grecord.C_Theme }} -->
        <!--                </div> -->
        <!--                <div class="text-sm text-muted-foreground mb-1"> -->
        <!--                  <Icon name="material-symbols:schedule-outline" /> -->
        <!--                  {{ grecord.C_Date }} -->
        <!--                </div> -->
        <!--                <div class="text-sm"> -->
        <!--                  {{ grecord.C_Reflection }} -->
        <!--                </div> -->
        <!--                <br> -->
        <!--              </div> -->
        <!--            </CardContent> -->
        <!--          </Card> -->
        <!--        </div> -->
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex flex-col justify-center h-1/2 text-center">
      <h3 class="font-bold text-xl">
        你当前访问的页面不存在，也许你应该考虑...
      </h3>
      <br>
      <NuxtLink class="w-full" to="/">
        <Button>回到主页</Button>
      </NuxtLink>
    </div>
  </div>
</template>
