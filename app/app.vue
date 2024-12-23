<script setup lang="ts">
import { ConfigProvider } from 'radix-vue'
import { useClerkProvider } from 'vue-clerk'
import '@unocss/reset/tailwind-compat.css'

const { isClerkLoaded } = useClerkProvider()

const useIdFunction = () => useId()

const isEnspireLoading = useState('isEnspireLoading', () => false)

useHead({
  meta: [
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: 'black' },
  ],
})
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <NuxtLoadingIndicator />
    <VitePwaManifest />
    <div v-if="!isClerkLoaded || isEnspireLoading" class="absolute z-100 h-screen w-screen bg-background">
      <div class="h-full w-full flex flex-col items-center justify-center space-y-6">
        <div class="flex justify-center space-x-1">
          <SvgoLogo class="pt-1 text-7xl hover:animate-spin" />
          <div class="mt-1 text-6xl tracking-tight">
            enspire
          </div>
        </div>
        <Icon name="svg-spinners:3-dots-fade" size="2em" />
      </div>
    </div>
    <NuxtLayout class="z-10">
      <NuxtPage />
    </NuxtLayout>
  </ConfigProvider>
</template>

<style lang="postcss">
@unocss;

.dark {
  color-scheme: dark;
}

/* TODO: Weird that this border-color is ignored by Unocss. Might need to investigate further. */
* {
  border-color: hsl(var(--border)) !important;
}

@media (prefers-color-scheme: light) {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
    --vis-tooltip-background-color: none !important;
    --vis-tooltip-border-color: none !important;
    --vis-tooltip-text-color: none !important;
    --vis-tooltip-shadow-color: none !important;
    --vis-tooltip-backdrop-filter: none !important;
    --vis-tooltip-padding: none !important;
    --vis-secondary-color: var(--primary);
    /* change to any hsl value you want */
    --vis-primary-color: 160 81% 40%;
    --vis-text-color: var(--muted-foreground);
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --ring: 0 0% 83.1%;
    --vis-tooltip-background-color: none !important;
    --vis-tooltip-border-color: none !important;
    --vis-tooltip-text-color: none !important;
    --vis-tooltip-shadow-color: none !important;
    --vis-tooltip-backdrop-filter: none !important;
    --vis-tooltip-padding: none !important;
    --vis-secondary-color: var(--primary);
    /* change to any hsl value you want */
    --vis-primary-color: 160 81% 40%;
    --vis-text-color: var(--muted-foreground);
  }
}
</style>
