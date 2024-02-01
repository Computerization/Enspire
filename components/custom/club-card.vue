<script lang="ts" setup>
import type {PropType} from 'vue'
import type {Club} from "~/content/clubs";
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import {cn} from '@/lib/utils'
import Badge from "~/components/ui/badge/Badge.vue";

const props = defineProps({
  club: {
    type: Object as PropType<Club>,
    required: true
  },
})
</script>

<template>
  <Card :class="cn(' h-76', $attrs.class ?? '')">
    <CardHeader>
      <CardTitle v-if="props.club.groups" class="flex justify-between items-center">
        <div>
          {{ props.club.groups[0].C_NameC }}
        </div>
        <Badge v-if="props.club.gmember.length == 0" variant="destructive">
          已解散
        </Badge>
      </CardTitle>
      <CardDescription v-if="props.club.gmember" class="flex items-center">
        <div class="flex items-center">
          <Icon name="material-symbols:person"/>
          <div class="ml-1">
            <div> {{ props.club.gmember.length }}</div>
          </div>
        </div>

        <div v-if="props.club.groups" class="flex items-center ml-2">
          <Icon name="material-symbols:language"/>
          <div class="ml-1">
            {{ props.club.groups[0].C_NameE }}
          </div>
        </div>
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class=" flex items-center space-x-4 rounded-md">
        <div class="flex-1 space-y-1">
          <ScrollArea v-if="props.club.groups[0].C_DescriptionC" class="text-sm h-32">
            {{ props.club.groups[0].C_DescriptionC }}
          </ScrollArea>
          <!-- idk why some clubs have no description -->
          <div v-else class="h-32 flex items-center">
            <div class="text-sm italic text-muted-foreground text-center w-full">
              暂无简介 ;-(
            </div>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button class="w-full">
        详细信息
      </Button>
    </CardFooter>
  </Card>
</template>
