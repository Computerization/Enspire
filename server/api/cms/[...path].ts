export default defineEventHandler((event) => {
  return proxyRequest(
    event,
    useRuntimeConfig().public.payloadCmsUrl! + event.context.params!.path,
  )
})
