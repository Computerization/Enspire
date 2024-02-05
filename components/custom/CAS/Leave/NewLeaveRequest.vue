<script lang='ts' setup>
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import {Button} from '@/components/ui/button'
import type {AllClubs} from '@/types/api/user/all_clubs'
import Calendar from "~/components/ui/calendar/Calendar.vue";
import {cn} from "~/lib/utils";
import {Textarea} from '@/components/ui/textarea'

definePageMeta({
  middleware: ['auth'],
});

const {data} = await useFetch<AllClubs>('/api/user/all_clubs', {
  headers: useRequestHeaders(),
  method: 'get',
})

if (!data.value) {
  throw createError({
    statusCode: 500,
    statusMessage: '服务器错误'
  })
}

// TODO: onSubmit hook

</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center gap-x-1">
        <Icon name="material-symbols:add-circle-outline"/>
        新增
      </CardTitle>
      <CardDescription>在此处新增请假申请</CardDescription>
    </CardHeader>
    <CardContent>

      <form class="space-y-6" @submit="onSubmit">
        <FormField v-slot="{ componentField, value }" name="email">
          <FormItem>
            <FormLabel>社团</FormLabel>

            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger :class="cn(
                  'w-full ps-3 text-start font-normal hover:bg-muted',
                  !value && 'text-muted-foreground',
                )" variant="outline">
                  <SelectValue placeholder="选择您需要请假的社团..."/>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="club in [...data.member, ...data.vice, ...data.president]" v-if="data"
                              :value="String(club.id)">
                    {{ club.name['zh'] }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, value }" name="date">
          <FormItem class="flex flex-col">
            <FormLabel>请假日期</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <FormControl>
                  <Button
                      :class="cn(
                  'w-full ps-3 text-start font-normal',
                  !value && 'text-muted-foreground',
                )" variant="outline"
                  >
                    <span>{{ value ? format(value, "PPP") : "选择日期..." }}</span>
                    <Icon class="ms-auto opacity-50" name="material-symbols:calendar-today-outline"/>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent class="p-0">
                <Calendar :min-date='new Date()' v-bind="componentField"/>
              </PopoverContent>
            </Popover>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="reason">
          <FormItem>
            <FormLabel>请假原因</FormLabel>
            <FormControl>
          <Textarea
              class="resize-none"
              placeholder="WHY? WHY? WHY??"
              v-bind="componentField"
          />
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

        <Button type="submit">
          Submit
        </Button>
      </form>

    </CardContent>

  </Card>
</template>
