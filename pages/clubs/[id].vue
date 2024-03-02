<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { cleanHTML } from '~/components/custom/cleanHTML.d.ts';
import json from '~/content/clubs.json'
import type { Clubs } from '~/content/clubs'

const clubs: Clubs = json as Clubs
const route = useRoute()
const id = route.params.id // Fetch current Club ID via route params

// Filter clubs based on C_GroupsID
// It just works ;)
const filteredClubs = Object.values(clubs).flatMap(clubCategory =>
  clubCategory.flatMap(club => club.groups.filter(group => group.C_GroupsID === id)))

// Get the number of members in each group
// const groupMemberCounts = filteredClubs.map(group => group.gmember.length)

const Description_C = cleanHTML(filteredClubs[0].C_DescriptionC) || '<div class="text-sm italic text-muted-foreground text-center w-full">暂无简介 ;-(</div>';

// This page requires login
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <div v-if="filteredClubs.length > 0">
    <div v-for="group in filteredClubs" :key="group.C_GroupsID">
      <div class="flex flex-col lg:flex-row lg:space-x-2">
        <Card class="lg:w-3/4 w-full">
          <CardHeader>
            <CardTitle class="flex items-center gap-x-1">
              {{ group.C_NameC }}
            </CardTitle>

            <CardDescription>{{ group.C_NameE }}</CardDescription>
          </CardHeader>
          <CardContent>
            <p v-html="Description_C"></p>
            <!-- Don't show the English Description until i18n is completed -->
            <!-- <br> -->
            <!-- <p v-html="cleanDescription(group.C_DescriptionE)"></p> -->
          </CardContent>
        </Card>
        <Card class="lg:w-1/4 w-full mt-4 lg:mt-0">
          <CardHeader>
            <CardTitle class="flex items-center gap-x-1">
              社团属性
            </CardTitle>
            <CardDescription>Club Info</CardDescription>
          </CardHeader>
          <CardContent>
            <p>社团类型: {{ group.C_Category }}</p>
            <!-- <p>社团人数: {{ groupMemberCounts }}</p> -->
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  <p v-else>
    Sorry, but we didn't find anything here.
  </p>
</template>

<style scoped>

</style>
