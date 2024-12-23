import type { QueryFunctionContext } from '@tanstack/vue-query'

export async function defaultQuery(context: QueryFunctionContext) {
  let queryUrl = ''
  for (const key of context.queryKey) {
    if (typeof key === 'string') {
      queryUrl += key
    }
    else if (isRef(key)) {
      queryUrl += (key as globalThis.Ref).value
    }
  }
  const data = await $fetch(queryUrl, {
    method: 'GET',
    headers: useRequestHeaders(),
  })
  return data
}
