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
const allClubs = computed(() => Object.values(clubs).flat())

const filteredClubs = computed(() => {
  // return all clubs if no search term
  if (!searchTerm.value) {
    // Sort clubs, putting dissolved clubs at the end
    return Object.entries(clubs).reduce((acc, [category, clubs]) => {
      acc[category as ClubCategoryKey] = clubs.sort((a: any, b: any) => {
        const aDissolved = a.gmember.length === 0
        const bDissolved = b.gmember.length === 0
        if (aDissolved && !bDissolved)
          return 1 // a should come after b
        if (!aDissolved && bDissolved)
          return -1 // a should come before b
        return 0 // keep original order if both are dissolved or not dissolved
      })
      return acc
    }, {} as Clubs)
  }

  // ignore capitalization
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase()

  // return zh/en name match the search term
  return Object.entries(clubs).reduce((acc, [category]) => {
    const filteredClubs = allClubs.value.filter(club =>
      club.groups.some((group: Groups) =>
        (group.C_NameC as string).toLowerCase().includes(lowerCaseSearchTerm) || (group.C_NameE as string).toLowerCase().includes(lowerCaseSearchTerm),
      ),
    )

    // Sort filtered clubs, putting dissolved clubs at the end
    acc[category as ClubCategoryKey] = filteredClubs.sort((a, b) => {
      const aDissolved = a.gmember.length === 0
      const bDissolved = b.gmember.length === 0
      if (aDissolved && !bDissolved)
        return 1
      if (!aDissolved && bDissolved)
        return -1
      return 0
    })
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
