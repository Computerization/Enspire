<script setup lang="ts">
import { Input } from '@/components/ui/input'
import TabsList from '@/components/ui/tabs/TabsList.vue'
import Tabs from '@/components/ui/tabs/Tabs.vue'
import TabsContent from '@/components/ui/tabs/TabsContent.vue'
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue'
import json from '@/content/clubs.json'

import type { ClubCategoryKey, Clubs, Groups } from '@/content/clubs'
import ClubCard from '@/components/custom/club-card.vue'

const clubs: Clubs = json as Clubs

// This page requires login
definePageMeta({
  middleware: ['auth'],
})

const categories = (['Sports', 'Service', 'Arts', 'Life', 'Academic'] as const).map(c => c as ClubCategoryKey)

const searchTerm = ref('')

function sortClubs(clubA: any, clubB: any): number {
  const aDissolved = clubA.gmember.length === 0
  const bDissolved = clubB.gmember.length === 0
  if (aDissolved && !bDissolved) return 1
  if (!aDissolved && bDissolved) return -1
  return 0
}

// pre-arrange the club list
const sortedClubs = Object.entries(clubs).reduce((acc, [category, clubsInCategory]) => {
  acc[category as ClubCategoryKey] = clubsInCategory.sort(sortClubs)
  return acc
}, {} as Clubs)

const allClubs = computed(() => Object.values(sortedClubs).flat())

const filteredClubs = computed(() => {
  if (!searchTerm.value) return sortedClubs

  const lowerCaseSearchTerm = searchTerm.value.toLowerCase()

  return Object.entries(sortedClubs).reduce((acc, [category]) => {
    const filtered = allClubs.value.filter(club =>
      club.groups.some((group: Groups) =>
        group.C_NameC.toLowerCase().includes(lowerCaseSearchTerm) || group.C_NameE.toLowerCase().includes(lowerCaseSearchTerm),
      ),
    )
    acc[category as ClubCategoryKey] = filtered
    return acc
  }, {} as Clubs)
})

const isSearchActive = computed(() => searchTerm.value !== '')
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
