<script setup lang="ts">
import { useClerk, useUser } from 'vue-clerk'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const { user } = useUser()

const clerk = useClerk()

function signOutCallback() {
  window.location.replace('/sign-in')
}

function signOutHandler() {
  return clerk.signOut(signOutCallback)
}
</script>

<template>
  <!-- TODO: Just a placeholder. Change to actual code when backend is ready. -->
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="relative h-8 w-8 rounded-full" variant="ghost">
        <Avatar class="h-8 w-8">
          <AvatarImage alt="@shadcn" src="/avatars/01.png" />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-56">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p v-if="user" class="text-sm font-medium leading-none">
            {{ user.firstName }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>New Team</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="signOutHandler">
        退出登录
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
