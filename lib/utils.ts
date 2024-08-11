import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value
    = typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

export function cleanHTML(content: string): string {
  if (!content)
    return ''

  return content.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
}
