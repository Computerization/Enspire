<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import TabsList from '@/components/ui/tabs/TabsList.vue'
import Tabs from '@/components/ui/tabs/Tabs.vue'
import TabsContent from '@/components/ui/tabs/TabsContent.vue'
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue'
import ClubCard from '@/components/custom/club-card.vue'

import type { Club, ClubCategoryKey, Clubs, Groups } from '~/types/clubs'

// This page requires login
definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Clubs | Enspire',
})

const categories = (['Sports', 'Service', 'Arts', 'Life', 'Academic'] as const).map(c => c as ClubCategoryKey)

const searchTerm = ref('')
const selectedTab = ref('Sports')

const { data } = await useFetch<Clubs>('/api/club/all_details')

// sort the club
const clubs = Object.entries(data.value!).reduce((acc, [category, clubsInCategory]) => {
  acc[category as ClubCategoryKey] = clubsInCategory.sort(
    (a: Club, b: Club) => (a.gmember.length === 0) === (b.gmember.length === 0) ? 0 : (a.gmember.length === 0) ? 1 : -1,
  )
  return acc
}, {} as Clubs)

const allClubs = computed(() => Object.values(clubs).flat())
const isSearchActive = computed(() => searchTerm.value !== '')

const filteredClubs = computed(() => {
  if (!searchTerm.value)
    return clubs

  return Object.entries(clubs).reduce((acc, [category]) => {
    acc[category as ClubCategoryKey] = allClubs.value.filter(club =>
      club.groups.some((group: Groups) =>
        group.C_NameC.toLowerCase().includes(searchTerm.value.toLowerCase()) || group.C_NameE.toLowerCase().includes(searchTerm.value.toLowerCase()),
      ),
    )
    return acc
  }, {} as Clubs)
})

onMounted(() => {
  const storedTab = localStorage.getItem('selectedTab')
  if (storedTab)
    selectedTab.value = storedTab
})

watch(selectedTab, (newTab) => {
  if (typeof window !== 'undefined')
    localStorage.setItem('selectedTab', newTab)
})

function categoryIcon(category: ClubCategoryKey) {
  switch (category) {
    case 'Sports':
      return 'material-symbols:sports-basketball'
    case 'Service':
      return 'material-symbols:home-repair-service'
    case 'Arts':
      return 'material-symbols:format-paint'
    case 'Life':
      return 'material-symbols:nightlife'
    case 'Academic':
      return 'material-symbols:book'
    default:
      return ''
  }
}
</script>

<template>
  <div>
    <Tabs v-model="selectedTab" class="h-full space-y-6" :default-value="selectedTab">
      <div class="flex flex-row items-center justify-between">
        <TabsList class="w-min">
          <TabsTrigger
            v-for="category in categories"
            :key="category"
            :value="category"
            :disabled="isSearchActive"
            class="flex items-center"
          >
            <Icon :name="categoryIcon(category)" />
            <div class="hidden sm:block ml-1">
              {{ category }}
            </div>
          </TabsTrigger>
        </TabsList>

        <div class="relative w-1/3 xl:w-1/4">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="material-symbols:search" />
          </div>
          <Input v-model="searchTerm" type="text" placeholder="Search..." class="pl-10" />
        </div>
      </div>
      <TabsContent
        v-for="category in categories"
        :key="category"
        :value="category"
        class="border-none p-0 outline-none"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ClubCard v-for="club in filteredClubs[category]" :key="club.groups[0].C_NameE" :club="club" />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<style scoped>

</style>
