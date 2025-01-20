<script setup lang="ts">
import type { AllClubs } from '@@/types/api/user/all_clubs'
import type { MyRecords } from '@@/types/api/cas/record/my'
import Announcements from '@/components/custom/Index/announcements.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from 'vue-clerk'

definePageMeta({
  middleware: ['auth'],
  breadcrumb: 'Home',
})

useHead({
  title: 'Home | Enspire',
})

const { user } = useUser()
const now = new Date().getHours()

// Get user's clubs
const { data: clubs } = useQuery<AllClubs>({
  queryKey: ['/api/user/all_clubs'],
})

// Track total CAS hours
const isLoading = ref(true)
const totalCASHours = ref(0)

watch(clubs, async () => {
  isLoading.value = true
  if (clubs.value?.president?.length || clubs.value?.vice?.length) {
    let total = 0
    for (const club of [...(clubs.value.president || []), ...(clubs.value.vice || [])]) {
      const { data } = await useFetch<MyRecords>(`/api/cas/record/my?club=${club.id}`)
      if (data.value) {
        total += data.value.data.reduce((sum, record) => {
          return sum + record.cTime + record.aTime + record.sTime
        }, 0)
      }
    }
    totalCASHours.value = total
  }
  isLoading.value = false
}, { immediate: true })
</script>

<template>
  <div class="space-y-6">
    
    <!-- Welcome Section -->
    <div>
      <div class="text-3xl font-bold">
        {{
          now < 5 ? '晚上好！'
          : now < 12 ? '早上好！'
            : now < 13 ? '中午好！'
              : now < 18 ? '下午好！' : '晚上好！'
        }}
      </div>
      <div class="text-muted-foreground">
        Welcome to Enspire!
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card class="transition-all hover:shadow-md hover:bg-muted/50">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Icon name="lucide:users" class="h-5 w-5 text-primary" />
            我的社团
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="space-y-2">
            <Skeleton class="h-8 w-16" />
            <Skeleton class="h-4 w-32" />
          </div>
          <div v-else>
            <div class="text-2xl font-bold">
              {{ (clubs?.president?.length || 0) + (clubs?.vice?.length || 0) + (clubs?.member?.length || 0) }}
            </div>
            <p class="mt-1 text-xs text-muted-foreground">总计参与社团数量</p>
          </div>
        </CardContent>
      </Card>

      <Card class="transition-all hover:shadow-md hover:bg-muted/50">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Icon name="lucide:star" class="h-5 w-5 text-primary" />
            管理社团
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="space-y-2">
            <Skeleton class="h-8 w-16" />
            <Skeleton class="h-4 w-32" />
          </div>
          <div v-else>
            <div class="text-2xl font-bold">
              {{ (clubs?.president?.length || 0) + (clubs?.vice?.length || 0) }}
            </div>
            <p class="mt-1 text-xs text-muted-foreground">担任社长或副社长的社团数量</p>
          </div>
        </CardContent>
      </Card>

      <Card class="transition-all hover:shadow-md hover:bg-muted/50">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Icon name="lucide:clock" class="h-5 w-5 text-primary" />
            活动记录时间
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="space-y-2">
            <Skeleton class="h-8 w-16" />
            <Skeleton class="h-4 w-32" />
          </div>
          <div v-else>
            <div class="text-2xl font-bold">
              {{ totalCASHours }}
            </div>
            <p class="mt-1 text-xs text-muted-foreground">总计活动时间（小时）</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="mb-4 text-lg font-semibold flex items-center gap-2">
        <Icon name="lucide:zap" class="h-5 w-5" />
        快捷操作
      </h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink to="/cas/clubs" class="group">
          <Card class="transition-all hover:bg-muted/50 hover:shadow-md">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Icon name="lucide:map" class="h-5 w-5" />
                浏览社团
              </CardTitle>
              <CardDescription class="flex items-center">
                查看所有社团信息
                <Icon name="lucide:arrow-right" class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </CardDescription>
            </CardHeader>
          </Card>
        </NuxtLink>

        <NuxtLink to="/forms" class="group">
          <Card class="transition-all hover:bg-muted/50 hover:shadow-md">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Icon name="lucide:clipboard" class="h-5 w-5" />
                填写表单
              </CardTitle>
              <CardDescription class="flex items-center">
                查看待填写的表单
                <Icon name="lucide:arrow-right" class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </CardDescription>
            </CardHeader>
          </Card>
        </NuxtLink>

        <NuxtLink to="/manage/statuses" class="group">
          <Card class="transition-all hover:bg-muted/50 hover:shadow-md">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Icon name="lucide:door-open" class="h-5 w-5" />
                教室状态
              </CardTitle>
              <CardDescription class="flex items-center">
                查看教室预约状态
                <Icon name="lucide:arrow-right" class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </CardDescription>
            </CardHeader>
          </Card>
        </NuxtLink>
      </div>
    </div>

    <!-- Announcements Section -->
    <div>
      <h2 class="mb-4 text-lg font-semibold flex items-center gap-2">
        <Icon name="lucide:megaphone" class="h-5 w-5" />
        公告
      </h2>
      <Announcements />
    </div>
  </div>
</template>