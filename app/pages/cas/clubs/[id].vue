<script lang="ts" setup>
import type { Club, Clubs } from '@@/types/clubs'
import Badge from '@/components/ui/badge/Badge.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import sanitizeHtml from 'sanitize-html'
import { useRoute } from 'vue-router'
import type { GroupInfo } from '@prisma/client'
import { useUser } from 'vue-clerk'

const { data } = await useFetch<Clubs>('/api/club/all_details')

const clubs = data.value!

const route = useRoute()
const id = route.params.id

const { user } = useUser()

const filteredClubs = Object.values(clubs).flatMap(clubCategory =>
  clubCategory.filter((club: Club) =>
    club.groups.some(group => group.C_GroupsID === id),
  ).map((club: Club) => ({
    ...club,
    groups: club.groups.filter(group => group.C_GroupsID === id),
  })),
) as Club[]

// Get the number of members in each group
const groupMemberCounts = filteredClubs.length > 0 ? filteredClubs[0].gmember.length : 0

// Get the Chinese Description of the club
let hasDescriptionC = false
let Description_C = ''

if (filteredClubs[0] && filteredClubs[0].groups[0].C_DescriptionC) {
  const tempDescription = sanitizeHtml(filteredClubs[0].groups[0].C_DescriptionC, {
    allowedTags: [],
  })
  if (tempDescription.trim() !== '') {
    Description_C = tempDescription
    hasDescriptionC = true
  }
}

const { data: groupInfo } = await useQuery<GroupInfo>({
  queryKey: ['/api/cas/info/get', { club: id }],
  enabled: !!id,
})

const isPresident = computed(() => {
  if (!user.value || !filteredClubs.length) return false
  const club = filteredClubs[0]
  return club.presidentByTsimsStudentId === Number(user.value.tsimsStudentId)
})

// Group info editing
const isEditing = ref(false)
const newGroupUrl = ref('')
const newExpiration = ref('')

async function updateGroupInfo() {
  if (!newGroupUrl.value || !newExpiration.value) return

  try {
    if (!groupInfo.value) {
      // Create
      await $fetch('/api/cas/info/new', {
        method: 'POST',
        body: {
          clubId: Number(id),
          wechatGroupUrl: newGroupUrl.value,
          wechatGroupExpiration: newExpiration.value,
        },
      })
    } else {
      // Update
      await $fetch('/api/cas/info/update', {
        method: 'POST',
        body: {
          clubId: Number(id),
          wechatGroupUrl: newGroupUrl.value, 
          wechatGroupExpiration: newExpiration.value,
        },
      })
    }
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update group info:', error)
  }
}

definePageMeta({
  middleware: ['auth'],
  breadcrumb: '社团详情',
})

useHead({
  title: 'Clubs | Enspire',
})
</script>

<template>
  <div v-if="filteredClubs.length > 0">
    <div v-for="club in filteredClubs" :key="club.groups[0].C_GroupNo">
      <div v-for="group in club.groups" :key="group.C_GroupsID">
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div class="xl:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center justify-between">
                  <div>
                    {{ group.C_NameC }}
                  </div>
                  <Badge v-if="club.gmember.length === 0" variant="destructive">
                    已解散
                  </Badge>
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
                <div v-else class="my-2 w-full text-center text-sm text-muted-foreground italic">
                  暂无简介 ;-(
                </div>
                <!-- Don't show the English Description until i18n is completed -->
                <Separator class="my-4" />
                <div class="font-bold">
                  成员
                </div>
                <div v-if="club.gmember.length === 0" class="my-2 w-full text-center text-sm text-muted-foreground italic">
                  暂无成员 ;-(
                </div>
                <div v-else class="mt-3">
                  <div class="flex flex-wrap">
                    <div v-for="(member, index) in club.gmember" :key="member.StudentID" class="flex items-center">
                      <div class="mt-0.5 flex items-center text-sm">
                        <span class="">{{ member.S_Name }}</span>
                        <span v-if="member.S_Nickname" class="ml-1 text-muted-foreground">({{ member.S_Nickname }})</span>
                        <Badge v-if="Number(member.LeaderYes) === 2" variant="default" class="ml-1 -py-0.5">
                          社长
                        </Badge>
                        <Badge v-else-if="Number(member.LeaderYes) === 1" variant="secondary" class="ml-1 -py-0.5">
                          副社
                        </Badge>
                        <span v-if="index < club.gmember.length - 1" class="mx-2">/</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Right sidebar -->
          <div class="xl:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="h-min flex items-center gap-x-1">
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

            <Card>
              <CardHeader>
                <CardTitle class="h-min flex items-center gap-x-1">
                  招新信息
                </CardTitle>
                <CardDescription class="flex items-center">
                  <Icon name="material-symbols:group-add" />
                  <div class="ml-1">
                    Recruitment
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div v-if="groupInfo && !isEditing" class="space-y-4">
                  <div class="text-sm text-muted-foreground">
                    扫描下方二维码加入微信群
                  </div>
                  <div class="flex justify-center">
                    <img 
                      :src="groupInfo.wechatGroupUrl" 
                      alt="WeChat QR Code" 
                      class="w-48 h-48 rounded-lg shadow-sm" 
                    />
                  </div>
                  <div class="text-sm text-muted-foreground">
                    二维码有效期至: {{ new Date(groupInfo.wechatGroupExpiration).toLocaleDateString() }}
                  </div>
                  <Button v-if="isPresident" @click="isEditing = true" class="w-full">
                    <Icon name="material-symbols:edit" class="mr-2" />
                    更新群二维码
                  </Button>
                </div>

                <div v-else-if="isPresident" class="space-y-4">
                  <form @submit.prevent="updateGroupInfo" class="space-y-4">
                    <FormField>
                      <FormLabel>微信群二维码链接</FormLabel>
                      <FormControl>
                        <Input 
                          v-model="newGroupUrl"
                          placeholder="https://weixin.qq.com/g/xxxxxx"
                          type="url"
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        请粘贴微信群二维码链接
                      </FormDescription>
                    </FormField>

                    <FormField>
                      <FormLabel>有效期</FormLabel>
                      <FormControl>
                        <Input
                          v-model="newExpiration"
                          type="datetime-local"
                          required
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </FormControl>
                    </FormField>

                    <div class="flex gap-2">
                      <Button type="submit" class="w-full">保存</Button>
                      <Button variant="outline" @click="isEditing = false" class="w-full">取消</Button>
                    </div>
                  </form>
                </div>

                <div v-else>
                  <p class="text-sm text-muted-foreground text-center">该社团暂未开放招新</p>
                </div>
              </CardContent>
            </Card>
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
    <div class="h-1/2 flex flex-col justify-center text-center">
      <h3 class="text-xl font-bold">
        你当前访问的页面不存在，也许你应该考虑...
      </h3>
      <br>
      <NuxtLink class="w-full" to="/">
        <Button>回到主页</Button>
      </NuxtLink>
    </div>
  </div>
</template>
