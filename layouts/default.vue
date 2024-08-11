<script setup lang="ts">
import { useFavicon, usePreferredDark } from '@vueuse/core'
import Sidebar from '~/components/custom/sidebar.vue'
import Toggle from '~/components/ui/toggle/Toggle.vue'

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
    <div class="top-0 flex flex-col h-full overflow-hidden">
      <!-- Navbar -->
      <div class="border-b px-4 w-full backdrop-blur-3xl z-30">
        <div class="flex h-14 items-center">
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
        class="fixed top-0 left-0 z-20 h-full transition-all duration-500 w-screen"
        :class="{ 'transform -translate-x-full': !isSidebarOpen, 'transform translate-x-0': isSidebarOpen }"
      >
        <Sidebar class="mt-14" />
      </div>

      <!-- Main area -->
      <div class="grow grow-1 max-h-full">
        <div class="border-t h-full">
          <div class="bg-background h-full">
            <div class="flex flex-row h-full">
              <!-- Sidebar -->
              <Sidebar class="top-0 hidden lg:inline-block h-full w-1/6" />
              <!-- Main content -->
              <ScrollArea class="h-full px-4 lg:px-8 w-full pt-8">
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
