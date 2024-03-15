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
  if (!searchTerm.value)
    return clubs

  // ignore capitalization
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase()

  // return zh/en name match the search term
  return Object.entries(clubs).reduce((acc, [category]) => {
    acc[category as ClubCategoryKey] = allClubs.value.filter(club =>
      club.groups.some((group: Groups) =>
        (group.C_NameC as string).toLowerCase().includes(lowerCaseSearchTerm) || (group.C_NameE as string).toLowerCase().includes(lowerCaseSearchTerm),
      ),
    )
    return acc
  }, {} as Clubs)
})

const isSearchActive = computed(() => searchTerm.value !== '')
</script>

<template>
  <div>
    <Tabs class="h-full space-y-6" :value="isSearchActive ? '' : undefined" :default-value="isSearchActive ? '' : 'Sports'">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <TabsList>
          <TabsTrigger :value="isSearchActive ? '' : 'Sports'" :disabled="isSearchActive">
            Sports
          </TabsTrigger>
          <TabsTrigger :value="isSearchActive ? '' : 'Service'" :disabled="isSearchActive">
            Service
          </TabsTrigger>
          <TabsTrigger :value="isSearchActive ? '' : 'Arts'" :disabled="isSearchActive">
            Arts
          </TabsTrigger>
          <TabsTrigger :value="isSearchActive ? '' : 'Life'" :disabled="isSearchActive">
            Life
          </TabsTrigger>
          <TabsTrigger :value="isSearchActive ? '' : 'Academic'" :disabled="isSearchActive">
            Academic
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
