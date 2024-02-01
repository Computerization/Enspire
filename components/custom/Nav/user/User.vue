<script lang="ts" setup>
import {Avatar, AvatarFallback, AvatarImage,} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {useClerk} from 'vue-clerk'

const clerk = useClerk()

function signOutCallback() {
  console.log("Sign Out")
  window.location.replace("/sign-in");
}

function signOutHandler() {
  return clerk.signOut(signOutCallback)
}

</script>

<template>
  <!-- TODO: Just a placeholder. Change to actual code when backend is ready.-->
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="relative h-8 w-8 rounded-full" variant="ghost">
        <Avatar class="h-8 w-8">
          <AvatarImage alt="@shadcn" src="/avatars/01.png"/>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-56">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            computerization
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            m@example.com
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator/>
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
      <DropdownMenuSeparator/>
      <DropdownMenuItem @click="signOutHandler">
        退出登陆
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
