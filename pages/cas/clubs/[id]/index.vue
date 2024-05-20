<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { getEditableClub } from './utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { cleanHTML } from '@/lib/utils'
import type { Club, Clubs } from '~/types/clubs'
import EditClubInfo from '~/components/custom/CAS/Info/EditClubInfo.vue'
import ViewClubInfo from '~/components/custom/CAS/Info/ViewClubInfo.vue'

const { data } = await useFetch<Clubs>('/api/club/all_details')

const clubs = data.value!

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

// Get privilege information
const clubEdit = await getEditableClub(Number(id))
const isPresident = (clubEdit !== undefined)

// Format Club Found Time
function formatFoundTime(foundTime: string): string {
  if (!foundTime || foundTime === '0000-00-00 00:00:00')
    return ''

  const date = new Date(foundTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// This page requires login
definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: `${filteredClubs[0].groups[0].C_NameC} | Clubs | Enspire`,
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
                <EditClubInfo v-if="isPresident" :club="Number(id)" />
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
              <div v-if="hasDescriptionC" class="my-3 text-sm" v-text="Description_C" />
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
                    <!--                    <HoverCard> -->
                    <!--                      <HoverCardTrigger as-child> -->
                    <div class="flex items-center text-sm mt-0.5">
                      <span class="hover:underline">
                        <span>{{ member.S_Name }}</span>
                        <span v-if="member.S_Nickname" class="text-muted-foreground ml-1">({{ member.S_Nickname }})</span>
                      </span>
                      <Badge v-if="Number(member.LeaderYes) === 2" variant="default" class="ml-1 -py-0.5">
                        社长
                      </Badge>
                      <Badge v-else-if="Number(member.LeaderYes) === 1" variant="secondary" class="ml-1 -py-0.5">
                        副社
                      </Badge>
                      <span v-if="index < club.gmember.length - 1" class="mx-2">/</span>
                    </div>
                    <!--                      </HoverCardTrigger> -->
                    <!--                      <HoverCardContent class="w-80"> -->
                    <!--                        <div class="flex justify-between space-x-4"> -->
                    <!--                          <div class="space-y-1"> -->
                    <!--                            <h4 class="text-sm font-semibold"> -->
                    <!--                              {{ member.S_Name }} -->
                    <!--                              <span v-if="member.S_Nickname" class="text-muted-foreground"> -->
                    <!--                                ({{ member.S_Nickname }}) -->
                    <!--                              </span> -->
                    <!--                            </h4> -->
                    <!--                            <div class="flex items-center pt-2"> -->
                    <!--                              <span v-if="member.S_Email" class="text-sm text-muted-foreground hover:underline"> -->
                    <!--                                Email: <NuxtLink :to="`mailto:${member.S_Email}`">{{ member.S_Email }}</NuxtLink> -->
                    <!--                              </span> -->
                    <!--                            </div> -->
                    <!--                            <div class="flex items-center"> -->
                    <!--                              <span class="text-sm text-muted-foreground"> -->
                    <!--                                ID: {{ member.StudentID }} -->
                    <!--                              </span> -->
                    <!--                            </div> -->
                    <!--                          </div> -->
                    <!--                        </div> -->
                    <!--                      </HoverCardContent> -->
                    <!--                    </HoverCard> -->
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div class="xl:w-1/4 w-full xl:ml-2 h-min">
            <div class="xl:w-full">
              <Card class="w-full">
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
                    <span class="font-bold mr-1">社团类型:</span>{{ group.C_Category }}
                  </div>
                  <div>
                    <span class="font-bold mr-1">社团人数:</span>{{ groupMemberCounts }} 人
                  </div>
                  <div v-if="formatFoundTime(group.C_FoundTime)">
                    <span class="font-bold mr-1">成立日期:</span>{{ formatFoundTime(group.C_FoundTime) }}
                  </div>
                  <div v-if="club.supervisor" class="flex">
                    <span class="font-bold">指导老师:</span>
                    <span v-for="supervisor in club.supervisor" :key="supervisor.TeacherID" class="ml-1">
                      <HoverCard>
                        <HoverCardTrigger as-child>
                          <span class="hover:underline">
                            {{ supervisor.T_Name }}
                            <span v-if="supervisor.T_Nickname" class="text-muted-foreground">
                              ({{ supervisor.T_Nickname }})
                            </span>
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent class="w-80">
                          <div class="flex justify-between space-x-4">
                            <div class="space-y-1">
                              <h4 class="text-sm font-semibold">
                                {{ supervisor.T_Name }} 老师
                                <span v-if="supervisor.T_Nickname" class="text-muted-foreground">
                                  ({{ supervisor.T_Nickname }})
                                </span>
                              </h4>
                              <div class="flex items-center pt-2">
                                <span v-if="supervisor.T_Email" class="text-sm text-muted-foreground hover:underline">
                                  Email: <NuxtLink :to="`mailto:${supervisor.T_Email}`">{{ supervisor.T_Email }}</NuxtLink>
                                </span>
                              </div>
                              <div class="flex items-center">
                                <span class="text-sm text-muted-foreground">
                                  Teacher ID: {{ supervisor.TeacherID }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div v-if="club.gmember.length > 0" class="xl:w-full mt-2">
              <ViewClubInfo :club="id" />
            </div>
          </div>
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
