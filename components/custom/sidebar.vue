<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div :class="cn('h-full', $attrs.class ?? '')">
    <div class="space-y-3 py-4 backdrop-blur-3xl border-r-2 h-full">
      <div class="px-3 py-2">
        <div class="space-y-1 mt-2">
          <NuxtLink to="/">
            <Button :variant="$route.name === 'index' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:home-outline-rounded" />
              首页
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          社团信息
        </h2>
        <div class="mt-2">
          <NuxtLink to="/cas/clubs">
            <Button :variant="$route.name === 'cas-clubs' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:grid-view-outline-rounded" />
              社团列表
            </Button>
          </NuxtLink>
          <NuxtLink v-if="[0, 1, 5, 6].includes(new Date().getMonth())" to="/cas/rating">
            <Button :variant="$route.name === 'cas-rating' ? 'secondary' : 'ghost'" class="w-full justify-start mt-1">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:rate-review-outline" />
              期末评价
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          CAS管理
        </h2>
        <div class="mt-2">
          <NuxtLink to="/manage/reservation">
            <Button :variant="$route.name === 'manage-reservation' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:calendar-today-outline" />
              预约教室
            </Button>
          </NuxtLink>
          <NuxtLink to="/manage/manage">
            <Button :variant="$route.name === 'manage-manage' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:calendar-today-outline" />
              管理预约
            </Button>
          </NuxtLink>
          <NuxtLink to="/manage/statuses">
            <Button :variant="$route.name === 'manage-statuses' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:calendar-today-outline" />
              教室状态
            </Button>
          </NuxtLink>
          <NuxtLink to="/manage/record">
            <Button :variant="$route.name === 'manage-record' ? 'secondary' : 'ghost'" class="w-full justify-start mt-1">
              <Icon class="mr-2 h-4 w-4" name="charm:tick-double" />
              活动记录
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="py-2 px-3">
        <h2 class="relative px-4 text-lg font-semibold tracking-tight">
          信息
        </h2>
        <div class="space-y-1 mt-2">
          <NuxtLink to="/about">
            <Button :variant="$route.name === 'about' ? 'secondary' : 'ghost'" class="w-full justify-start">
              <Icon class="mr-2 h-4 w-4" name="material-symbols:info-outline" />
              关于 Enspire
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
