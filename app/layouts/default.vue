<script setup lang="ts">
import Sidebar from '@/components/custom/sidebar.vue'
import Toggle from '@/components/ui/toggle/Toggle.vue'
import { useFavicon, usePreferredDark } from '@vueuse/core'

const isDark = usePreferredDark()
const favicon = computed(() => isDark.value ? '/favicon-dark.ico' : '/favicon.ico')

useFavicon(favicon)

const isSidebarOpen = ref(false)
const route = useRoute()

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

const routeNameMap: Map<string, string> = new Map([
  ['index', 'home'],
  ['cas', 'club'],
  ['clubs', 'list'],
  ['rating', 'rating'],
])

const navList = computed(() => (route.name! as string).split('-'))

watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false
  },
)
</script>

<template>
  <!--
    Current main layout structure
    column flex [overflow-hidden, 100vh]:
      navbar [fixed height]
      row flex [occupies the rest of the screen]:
        sidebar [100% height, overflow-scroll]
        main content [100% height, overflow-scroll, additional whitespace in the bottom (that fills the space clipped by the main container)]
   -->
  <div class="h-screen">
    <div class="top-0 h-full flex flex-col overflow-hidden">
      <!-- Navbar -->
      <div class="z-30 w-full border-b px-4 backdrop-blur-3xl">
        <div class="h-14 flex items-center">
          <Toggle class="lg:hidden" data-state="off" @click="toggleSidebar">
            <Icon name="ph:list" size="1.3em" />
          </Toggle>
          <CustomNavIcon class="ml-4 h-full" />
          <div v-for="(nav, index) in navList" :key="index" class="flex items-center">
            <div class="ml-2 text-muted-foreground">
              /
            </div>
            <div class="ml-2">
              {{ routeNameMap.get(nav) ?? nav }}
            </div>
          </div>

          <div class="ml-auto flex items-center space-x-4">
            <CustomNavUser />
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div
        class="fixed left-0 top-0 z-20 h-full w-screen transition-all duration-500"
        :class="{ 'transform -translate-x-full': !isSidebarOpen, 'transform translate-x-0': isSidebarOpen }"
      >
        <Sidebar class="mt-14" />
      </div>

      <!-- Main area -->
      <div class="max-h-full grow grow-1">
        <div class="h-full border-t">
          <div class="h-full bg-background">
            <div class="h-full flex flex-row">
              <!-- Sidebar -->
              <Sidebar class="top-0 hidden h-full w-1/6 lg:inline-block" />
              <!-- Main content -->
              <ScrollArea class="h-full w-full px-4 pt-8 lg:px-8">
                <div class="pb-24">
                  <slot />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
