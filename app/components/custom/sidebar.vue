<script setup lang="ts">
import type { AllClubs } from '@@/types/api/user/all_clubs'
import { useClerk, useUser } from 'vue-clerk'

const { user } = useUser()
const config = useRuntimeConfig()

const clerk = useClerk()

function signOutHandler() {
  return clerk.signOut(() => window.location.replace('/sign-in'))
}

const isPresidentOrVicePresident = ref(false)
useState('isEnspireLoading').value = true

const { data: clubs, suspense } = useQuery<AllClubs>({
  queryKey: ['/api/user/all_clubs'],
})
await suspense()

if (clubs.value) {
  useState('isEnspireLoading').value = false
  if (clubs.value.president.length !== 0 || clubs.value.vice.length !== 0) {
    isPresidentOrVicePresident.value = true
  }
}

const sidebarData = ref({
  school: [
    {
      name: '首页',
      url: '/',
      icon: 'lucide:house',
    },
    {
      name: '表单',
      url: '/forms',
      icon: 'lucide:pie-chart',
    },
    {
      name: '社团列表',
      url: '/cas/clubs',
      icon: 'lucide:map',
    },
  ],
  cas: [
    {
      title: '教室',
      url: '#',
      icon: 'lucide:door-open',
      isActive: true,
      items: [
        {
          title: '教室状态',
          url: '/manage/statuses',
        },
        ...(isPresidentOrVicePresident.value
          ? [
              {
                title: '新建预约',
                url: '/manage/reservation',
              },
              {
                title: '管理预约',
                url: '/manage/manage',
              },
            ]
          : []),
      ],
    },
    ...(isPresidentOrVicePresident.value
      ? [
          {
            title: '社团文件',
            url: '#',
            icon: 'lucide:file-text',
            isActive: true,
            items: [
              {
                title: '社团文件',
                url: '/forms/files',
              },
            ],
          },
          {
            title: '活动记录',
            url: '#',
            icon: 'lucide:pencil-ruler',
            isActive: true,
            items: [
              {
                title: '新建记录',
                url: '/activity/new',
              },
              {
                title: '我的记录',
                url: '/activity/view',
              },
            ],
          },
        ]
      : []),
  ],
})
</script>

<template>
  <SidebarProvider class="h-full">
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-between hover:bg-transparent group-data-[collapsible=icon]:mt-2"
              >
                <div>
                  <SvgoLogo class="ml-0.2 pt-1 text-[30px]" />
                </div>
                <div class="mt-1.5">
                  <Icon name="lucide:ellipsis-vertical" class="ml-auto size-4" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg" side="bottom" align="end" :side-offset="4">
              <DropdownMenuLabel class="p-0 font-normal">
                <div class="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">Enspire</span>
                    <span class="truncate text-xs">
                      v{{ config.public.appVersion }}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <NuxtLink to="https://github.com/Computerization/Enspire" target="_blank" as-child>
                  <DropdownMenuItem>
                    <Icon class="mr-1" name="material-symbols:open-in-new" />
                    <span>GitHub</span>
                  </DropdownMenuItem>
                </NuxtLink>
                <NuxtLink to="https://github.com/Computerization/Enspire/discussions" target="_blank" as-child>
                  <DropdownMenuItem>
                    <Icon class="mr-1" name="material-symbols:help-outline" />
                    <span>Discussions</span>
                  </DropdownMenuItem>
                </NuxtLink>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <NuxtLink to="/about" as-child>
                  <DropdownMenuItem>
                    <Icon class="mr-1" name="lucide:info" />
                    <span>关于Enspire</span>
                  </DropdownMenuItem>
                </NuxtLink>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup class="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>学校事务</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="item in sidebarData.school"
              :key="item.name"
              class="rounded"
              :class="{ 'bg-foreground/10': $route.path === item.url }"
            >
              <SidebarMenuButton as-child>
                <NuxtLink :href="item.url">
                  <Icon :name="item.icon" size="1.1em" />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup class="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>社团管理</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible
              v-for="item in sidebarData.cas"
              :key="item.title"
              :default-open="true"
              class="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton :tooltip="item.title">
                    <Icon :name="item.icon" size="1.2em" />
                    <span>{{ item.title }}</span>
                    <Icon name="lucide:chevron-right" class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem
                      v-for="subItem in item.items"
                      :key="subItem.title"
                      class="flex items-center"
                    >
                      <div v-if="$route.path === subItem.url" class="border-text mr-2 h-4 w-1 border-l-2 border-foreground rounded -ml-3" />
                      <SidebarMenuSubButton as-child>
                        <NuxtLink :href="subItem.url">
                          <span>{{ subItem.title }}</span>
                        </NuxtLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage v-if="user" :src="user.imageUrl" :alt="user.firstName" />
                    <AvatarFallback class="rounded-lg">
                      {{ user?.firstName?.slice(0, 2) }}
                    </AvatarFallback>
                  </Avatar>
                  <div v-if="user" class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ user.firstName }}</span>
                    <span class="truncate text-xs">{{ user.primaryEmailAddress }}</span>
                  </div>
                  <Icon name="lucide:chevrons-up-down" class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg" side="bottom" align="end" :side-offset="4">
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage v-if="user" :src="user.imageUrl" :alt="user.firstName" />
                      <AvatarFallback class="rounded-lg">
                        {{ user?.firstName?.slice(0, 2) }}
                      </AvatarFallback>
                    </Avatar>
                    <div v-if="user" class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ user.firstName }}</span>
                      <span class="truncate text-xs">{{ user.primaryEmailAddress }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <NuxtLink to="#" target="_blank" as-child>
                    <DropdownMenuItem>
                      <Icon class="mr-1" name="material-symbols:person-outline" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </NuxtLink>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="signOutHandler">
                  <Icon class="mr-1" name="material-symbols:logout" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset class="h-full flex">
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
