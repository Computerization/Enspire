<script setup lang="ts">
import TabsList from '@/components/ui/tabs/TabsList.vue'
import Tabs from '@/components/ui/tabs/Tabs.vue'
import TabsContent from '@/components/ui/tabs/TabsContent.vue'
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue'
import json from '@/content/clubs.json'

import type { ClubCategoryKey, Clubs } from '@/content/clubs'
import ClubCard from '@/components/custom/club-card.vue'

const clubs: Clubs = json as Clubs

// This page requires login
definePageMeta({
  middleware: ['auth'],
})

const categories = (['Sports', 'Service', 'Arts', 'Life', 'Academic'] as const).map(c => c as ClubCategoryKey)
</script>

<template>
  <div>
    <Tabs class="h-full space-y-6" default-value="Sports">
      <div class="space-between flex items-center">
        <TabsList>
          <TabsTrigger value="Sports">
            Sports
          </TabsTrigger>
          <TabsTrigger value="Service">
            Service
          </TabsTrigger>
          <TabsTrigger value="Arts">
            Arts
          </TabsTrigger>
          <TabsTrigger value="Life">
            Life
          </TabsTrigger>
          <TabsTrigger value="Academic">
            Academic
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        v-for="i in categories"
        :key="i"
        :value="i"
        class="border-none p-0 outline-none"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ClubCard v-for="j in clubs[i]" :key="j.groups[0].C_NameE" :club="j" />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<style scoped>

</style>
