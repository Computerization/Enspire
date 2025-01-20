<script setup lang="ts">
import type { AllClubs } from '@@/types/api/user/all_clubs'
import { Button } from '@/components/ui/button'
import { dark } from '@clerk/themes'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { MyRecords } from '@@/types/api/cas/record/my'
import { useUser } from 'vue-clerk'
import { usePreferredDark } from '@vueuse/core'
import { 
  User,
  Mail, 
  Settings,
  Clock,
} from 'lucide-vue-next'
import { UserProfile } from 'vue-clerk'

const isDark = usePreferredDark()

definePageMeta({
  middleware: ['auth'],
  breadcrumb: 'Profile',
})

useHead({
  title: 'Profile | Enspire',
})

const { user } = useUser()

// Stats data and loading state
const stats = ref({
  totalActivities: 0,
  totalClubs: 0,
  lastActive: '',
})

const isLoading = ref(true)

// Add this with your other refs
const isSettingsOpen = ref(false)

// Fetch clubs data
const { data: clubs } = await useQuery<AllClubs>({
  queryKey: ['/api/user/all_clubs'],
})

// Calculate stats when clubs data is available
if (clubs.value) {
  const totalClubs = clubs.value.president.length + clubs.value.vice.length + clubs.value.member.length
  stats.value.totalClubs = totalClubs
}

// Fetch activity records to calculate total activities and last active date
const fetchActivityData = async () => {
  try {
    let latestDate = new Date(0)
    let totalActivities = 0

    // Only fetch if user has clubs
    if (clubs.value?.president.length || clubs.value?.vice.length) {
      for (const club of [...clubs.value.president, ...clubs.value.vice]) {
        const { data } = await useFetch<MyRecords>(`/api/cas/record/my?club=${club.id}`)
        if (data.value) {
          totalActivities += data.value.data.length
          // Find latest activity date
          data.value.data.forEach(record => {
            const recordDate = new Date(record.date)
            if (recordDate > latestDate) {
              latestDate = recordDate
            }
          })
        }
      }
    }

    stats.value.totalActivities = totalActivities
    stats.value.lastActive = latestDate.getTime() > 0 
      ? latestDate.toLocaleDateString() 
      : '暂无活动'
  } catch (error) {
    console.error('Error fetching activity data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchActivityData()
})
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8">
    <Card>
      <CardHeader>
        <CardTitle class="text-3xl">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-4">
              <Avatar class="h-16 w-16 rounded-lg">
                <AvatarImage v-if="user" :src="user.imageUrl" :alt="user.firstName" />
                <AvatarFallback class="rounded-lg">
                  {{ user?.firstName?.slice(0, 2) }}
                </AvatarFallback>
              </Avatar>
              <div>
                👋🏻 Hi, {{ user?.firstName }}!
                <div class="text-base font-normal text-muted-foreground">
                  {{ user?.primaryEmailAddress }}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" @click="isSettingsOpen = true">
              <Settings class="h-5 w-5" />
              <span class="sr-only">Open settings</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <!-- Rest of your existing card content -->
    </Card>

    <!-- Settings Dialog -->
    <Dialog :open="isSettingsOpen" @update:open="isSettingsOpen = false">
      <DialogContent class="sm:max-w-[880px] p-0">
        <UserProfile 
          :appearance="{ baseTheme: isDark ? dark : undefined }"
        />
      </DialogContent>
    </Dialog>

    <div class="grid gap-4 md:grid-cols-2">
      <!-- Account Info Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            账户信息
          </CardTitle>
          <CardDescription>账户基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <div class="text-sm font-medium text-muted-foreground">邮箱</div>
                <div>{{ user?.primaryEmailAddress }}</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <Clock class="h-4 w-4 text-muted-foreground" />
              <div>
                <div class="text-sm font-medium text-muted-foreground">创建时间</div>
                <div>{{ new Date(user?.createdAt || '').toLocaleDateString() }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Statistics Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Icon name="material-symbols:analytics-outline" class="h-5 w-5" />
            账户统计
          </CardTitle>
          <CardDescription>您的活动数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="grid grid-cols-2 gap-4">
            <div v-for="i in 3" :key="i" class="space-y-2">
              <Skeleton class="h-4 w-24" />
              <Skeleton class="h-8 w-16" />
            </div>
          </div>
          <div v-else class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <div class="text-sm font-medium text-muted-foreground">所属社团</div>
              <div class="text-2xl font-bold">{{ stats.totalClubs }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-sm font-medium text-muted-foreground">活动记录</div>
              <div class="text-2xl font-bold">{{ stats.totalActivities }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-sm font-medium text-muted-foreground">最近活动</div>
              <div class="text-sm">{{ stats.lastActive }}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>