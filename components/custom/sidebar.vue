<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useClerk } from 'vue-clerk'
import type { AllClubs } from '~/types/api/user/all_clubs'

const { t } = useI18n({
  useScope: 'local',
})
const clerk = useClerk()
const route = useRoute()

const isPresidentOrVicePresident = ref(false)

if (import.meta.client) {
  if (clerk.user?.publicMetadata.binded) {
    const data = await $fetch<AllClubs>(`/api/user/all_clubs`, {
      headers: useRequestHeaders(),
      method: 'GET',
    })
    if (data && (data.president.length !== 0 || data.vice.length !== 0)) {
      isPresidentOrVicePresident.value = true
    }
  }
}
</script>

<template>
  <div :class="cn('h-full', $attrs.class ?? '')">
    <div class="space-y-3 py-4 backdrop-blur-3xl border-r-2 h-full">
      <div class="px-3 py-2">
        <div class="space-y-1 mt-2">
          <NuxtLink to="/">
            <Button :variant="route.name === 'index' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:home-outline-rounded" />
              {{ t('home') }}
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          {{ t('school_affairs') }}
        </h2>
        <div class="mt-2">
          <NuxtLink to="/forms">
            <Button :variant="route.name === 'forms' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:grid-view-outline-rounded" />
              {{ t('forms') }}
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          {{ t('cas_information') }}
        </h2>
        <div class="mt-2">
          <NuxtLink to="/cas/clubs">
            <Button :variant="route.name === 'cas-clubs' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:grid-view-outline-rounded" />
              {{ t('clubs') }}
            </Button>
          </NuxtLink>
          <NuxtLink v-if="[0, 1, 5, 6].includes(new Date().getMonth())" to="/cas/rating">
            <Button :variant="route.name === 'cas-rating' ? 'secondary' : 'ghost'" class="w-full justify-start mt-1">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:rate-review-outline" />
              期末评价
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          {{ t('manage') }}
        </h2>
        <div class="mt-2">
          <NuxtLink v-if="isPresidentOrVicePresident" to="/manage/reservation">
            <Button :variant="route.name === 'manage-reservation' ? 'secondary' : 'ghost'" class="w-full justify-start mt-1">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:calendar-today-outline" />
              {{ t('reservation') }}
            </Button>
          </NuxtLink>
          <NuxtLink to="/manage/manage">
            <Button v-if="isPresidentOrVicePresident" :variant="route.name === 'manage-manage' ? 'secondary' : 'ghost'" class="w-full justify-start mt-1">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:calendar-today-outline" />
              {{ t('manage_reservation') }}
            </Button>
          </NuxtLink>
          <NuxtLink to="/manage/statuses">
            <Button :variant="route.name === 'manage-statuses' ? 'secondary' : 'ghost'" class="w-full justify-start mt-1">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:calendar-today-outline" />
              {{ t('statuses') }}
            </Button>
          </NuxtLink>
          <NuxtLink to="/manage/record">
            <Button :variant="route.name === 'manage-record' ? 'secondary' : 'ghost'" class="w-full justify-start mt-1">
              <Icon class="mr-2 h-4 w-4" name="charm:tick-double" />
              {{ t('record') }}
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="py-2 px-3">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          {{ t('info') }}
        </h2>
        <div class="space-y-1 mt-2">
          <NuxtLink to="/about">
            <Button :variant="route.name === 'about' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:info-outline" />
              {{ t('about') }}
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "zh": {
    "home": "首页",
    "school_affairs": "校务",
    "forms": "表格",
    "cas_information": "CAS信息",
    "clubs": "社团",
    "rating": "期末评价",
    "manage": "CAS管理",
    "reservation": "预约教室",
    "manage_reservation": "管理预约",
    "statuses": "教室状态",
    "record": "活动签到",
    "info": "信息",
    "about": "关于 Enspire"
  },
  "en": {
    "home": "Home",
    "school_affairs": "School Affairs",
    "forms": "Forms",
    "cas_information": "CAS Information",
    "clubs": "Clubs",
    "rating": "Rating",
    "manage": "CAS Management",
    "reservation": "Reservation",
    "manage_reservation": "Manage Reservation",
    "statuses": "Statuses",
    "record": "Record",
    "info": "Info",
    "about": "About Enspire"
  }
}
</i18n>
