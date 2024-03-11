<script setup lang="ts">
import Sidebar from '~/components/custom/sidebar.vue'
import Toggle from '~/components/ui/toggle/Toggle.vue'

const isSidebarOpen = ref(false)
const route = useRoute()

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false
  },
)
</script>

<template>
  <div class="h-screen">
    <div class="top-0 flex flex-col h-full overflow-hidden">
      <!-- Navbar -->
      <div class="border-b px-4 w-full backdrop-blur-3xl">
        <div class="flex h-14 items-center">
          <Toggle class="lg:hidden" data-state="off" @click="toggleSidebar">
            <Icon name="ph:list" size="1.3em" />
          </Toggle>
          <CustomNavIcon class="ml-4" />

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
              <div class="h-full px-4 lg:px-8 w-full pt-8 pb-24 overflow-y-scroll">
                <slot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
