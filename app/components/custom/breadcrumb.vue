<script setup lang="ts">
import type { RouteRecordNormalized } from 'vue-router'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref<RouteRecordNormalized[]>()

watch(() => route.path, () => {
  breadcrumbs.value = []
  const fullPath = route.path
  const requestPath = fullPath.startsWith('/')
    ? fullPath.substring(1)
    : fullPath
  const crumbs = requestPath.split('/')
  let path = ''
  crumbs.forEach((crumb) => {
    if (crumb) {
      path = `${path}/${crumb}`
      const breadcrumb = router.getRoutes().find(r => r.path === path)
      if (breadcrumb && breadcrumbs.value) {
        breadcrumbs.value.push(breadcrumb)
      }
    }
  })
}, { immediate: true })
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem class="hidden md:block">
        <BreadcrumbLink to="/">
          Enspire
        </BreadcrumbLink>
      </BreadcrumbItem>
      <template v-for="(breadcrumb, index) in breadcrumbs" :key="`breadcrumb-${String(index)}`">
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem class="hidden md:block">
          <BreadcrumbLink :href="breadcrumb!.path">
            {{ breadcrumb!.meta.breadcrumb ?? breadcrumb.path.split('/').pop() }}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
