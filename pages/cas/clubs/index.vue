<script setup lang="ts">
import { Input } from '@/components/ui/input'
import TabsList from '@/components/ui/tabs/TabsList.vue'
import Tabs from '@/components/ui/tabs/Tabs.vue'
import TabsContent from '@/components/ui/tabs/TabsContent.vue'
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue'
import ClubCard from '@/components/custom/club-card.vue'

import type { Club, ClubCategoryKey, Clubs, Groups } from '@/content/clubs'

// This page requires login
definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Clubs | Enspire',
})

const categories = (['Sports', 'Service', 'Arts', 'Life', 'Academic'] as const).map(c => c as ClubCategoryKey)

const searchTerm = ref('')

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
</script>

<template>
  <div>
    <Tabs class="h-full space-y-6" :value="isSearchActive ? '' : undefined" :default-value="isSearchActive ? '' : 'Sports'">
      <div class="flex flex-row items-center justify-between">
        <TabsList class="w-min">
          <TabsTrigger :value="isSearchActive ? '' : 'Sports'" :disabled="isSearchActive" class="flex items-center">
            <Icon name="material-symbols:sports-basketball" />
            <div class="hidden sm:block ml-1">
              Sports
            </div>
          </TabsTrigger>
          <TabsTrigger :value="isSearchActive ? '' : 'Service'" :disabled="isSearchActive" class="flex items-center">
            <Icon name="material-symbols:home-repair-service" />
            <div class="hidden sm:block ml-1">
              Service
            </div>
          </TabsTrigger>
          <TabsTrigger :value="isSearchActive ? '' : 'Arts'" :disabled="isSearchActive" class="flex items-center">
            <Icon name="material-symbols:format-paint" />
            <div class="hidden sm:block ml-1">
              Arts
            </div>
          </TabsTrigger>
          <TabsTrigger :value="isSearchActive ? '' : 'Life'" :disabled="isSearchActive" class="flex items-center">
            <Icon name="material-symbols:nightlife" />
            <div class="hidden sm:block ml-1">
              Life
            </div>
          </TabsTrigger>
          <TabsTrigger :value="isSearchActive ? '' : 'Academic'" :disabled="isSearchActive" class="flex items-center">
            <Icon name="material-symbols:book" />
            <div class="hidden sm:block ml-1">
              Academic
            </div>
          </TabsTrigger>
        </TabsList>
        <Input v-model="searchTerm" type="text" placeholder="Search..." class="float-right w-1/4" />
      </div>
      <TabsContent
        v-for="i in categories"
        :key="i"
        :value="i"
        class="border-none p-0 outline-none"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ClubCard v-for="j in filteredClubs[i]" :key="j.groups[0].C_NameE" :club="j" />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<style scoped>

</style>
