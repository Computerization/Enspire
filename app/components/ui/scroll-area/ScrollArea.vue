<script setup lang="ts">
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  type ScrollAreaRootProps,
  ScrollAreaViewport,
} from 'radix-vue'
import ScrollBar from './ScrollBar.vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    ScrollAreaRootProps & { class?: string }
  >(),
  {
    class: '',
    orientation: 'vertical',
  },
)

// Modified from original code from shadcn-vue: We need to add this class to `ScrollAreaViewport` to make it work with max-height.
// See https://github.com/radix-ui/primitives/issues/2307
const maxHClass = props.class.split(' ').findLast((className) => className.startsWith('max-h'))
</script>

<template>
  <ScrollAreaRoot :type="type" :class="cn('relative overflow-hidden', props.class)">
    <ScrollAreaViewport :class="cn('h-full w-full rounded-[inherit]', maxHClass ? maxHClass : '')">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
