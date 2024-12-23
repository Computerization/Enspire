<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { ComboboxContentEmits, ComboboxContentProps } from 'radix-vue'
import { ComboboxContent, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxContentProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<ComboboxContentEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <!-- Modified from original code: Heights limit is removed. Please use `<ScrollArea>` inside `<CommandList>`. -->
  <ComboboxContent v-bind="forwarded" :class="cn(props.class)">
    <div role="presentation">
      <slot />
    </div>
  </ComboboxContent>
</template>
