<script lang="ts" setup>
import { NuxtLink } from '#components'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { type HTMLAttributes, resolveComponent } from 'vue'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
})
</script>

<template>
  <Primitive
    :as="NuxtLink"
    :as-child="asChild"
    :class="cn('transition-colors hover:text-foreground', props.class)"
  >
    <slot />
  </Primitive>
</template>
