<script lang="ts" setup>
import type { AllClubs } from '@@/types/api/user/all_clubs'

const isPresidentOrVicePresident = ref(false)
useState('isEnspireLoading').value = true

const { data: clubs, suspense } = useQuery<AllClubs>({
  queryKey: ['/api/user/all_clubs'],
})
await suspense()

if (clubs.value) {
  useState('isEnspireLoading').value = false
  if (clubs.value.president.length !== 0 || clubs.value.vice.length !== 0) {
    isPresidentOrVicePresident.value = true
  }
}
</script>

<template>
  <CustomSidebar>
    <header class="group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 h-16 flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <div class="flex items-center gap-2 px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <CustomBreadcrumb />
      </div>
    </header>
    <ScrollArea class="h-full w-full px-4 pt-8 lg:px-8">
      <div class="pb-24">
        <main>
          <slot />
        </main>
      </div>
    </ScrollArea>
  </CustomSidebar>
</template>

<style>

</style>
