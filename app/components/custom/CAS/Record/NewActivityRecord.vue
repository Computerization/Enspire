<script setup lang="ts">
import type { AllClubs } from '@@/types/api/user/all_clubs'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { cn } from '@/lib/utils'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toTypedSchema } from '@vee-validate/zod'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { toDate } from 'radix-vue/date'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const emit = defineEmits(['refresh'])

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const { toast } = useToast()

const selectedClub = ref<string>()

const isLoading = ref(false)

const formSchema = toTypedSchema(z.object({
  club: z.string(),
  date: z
    .string()
    .refine(v => v, { message: '日期为必填项' }),
  text: z.string().min(10, "字数不得少于 10 字符").max(300, "字数不得大于 300 字符"),
  members: z.array(z.string().uuid()),
  cTime: z.number().min(0).max(5, "时长不得大于 5 小时"),
  aTime: z.number().min(0).max(5, "时长不得大于 5 小时"),
  sTime: z.number().min(0).max(5, "时长不得大于 5 小时"),
}))

const { data, suspense } = useQuery<AllClubs>({
  queryKey: ['/api/user/all_clubs'],
})
await suspense()

if (!data.value) {
  throw createError({
    statusCode: 500,
    message: '服务器错误',
  })
}

const { handleSubmit, resetForm, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    cTime: 0,
    aTime: 0,
    sTime: 0,
  },
})

const selectedMembers = ref<string[]>([])

const handleCheckboxChange = (memberId: string, checked: boolean) => {
  if (checked) {
    selectedMembers.value.push(memberId)
  } else {
    selectedMembers.value = selectedMembers.value.filter(id => id !== memberId)
  }
  setFieldValue('members', selectedMembers.value)
}

const calendarPlaceholder = ref()
const calendarValue = computed({
  get: () => values.date ? parseDate(values.date) : undefined,
  set: val => val,
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  const { error } = await useFetch('/api/cas/record/new', {
    headers: useRequestHeaders(),
    method: 'post',
    server: false,
    body: { ...values, date: new Date(values.date) },
  })
  if (error.value) {
    toast({
      title: '错误',
      description: '请稍后再试',
      variant: 'destructive',
    })
  }
  isLoading.value = false
  emit('refresh')
  resetForm()
})
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center gap-x-1">
        <Icon name="material-symbols:add-circle-outline" />
        新增
      </CardTitle>
      <CardDescription>在此处新增活动记录</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-6" @submit="onSubmit">
        <FormField v-slot="{ componentField, value }" name="club">
          <FormItem>
            <FormLabel>社团</FormLabel>

            <Select v-bind="componentField" @update:model-value="selectedClub = $event">
              <FormControl>
                <SelectTrigger
                  :class="cn(
                    'w-full ps-3 text-start font-normal hover:bg-muted',
                    !value && 'text-muted-foreground',
                  )" variant="outline" :disabled="isLoading"
                >
                  <SelectValue placeholder="选择您需要记录的社团..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup v-if="data">
                  <SelectItem
                    v-for="club in [...data.vice, ...data.president]"
                    :key="club.id" :value="String(club.id)"
                  >
                    {{ club.name.zh }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="date">
          <FormItem class="flex flex-col">
            <FormLabel>活动日期</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <FormControl>
                  <Button
                    variant="outline" :class="cn(
                      'w-[240px] ps-3 text-start font-normal w-full',
                      !calendarValue && 'text-muted-foreground',
                    )"
                  >
                    <span>{{ calendarValue ? df.format(toDate(calendarValue)) : "请选择日期..." }}</span>
                    <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                  </Button>
                  <input hidden>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar
                  v-model:placeholder="calendarPlaceholder"
                  v-model="calendarValue"
                  calendar-label="Date"
                  initial-focus
                  :min-value="new CalendarDate(2020, 1, 1)"
                  :max-value="today(getLocalTimeZone())"
                  @update:model-value="(v) => {
                    if (v) {
                      setFieldValue('date', v.toString())
                    }
                    else {
                      setFieldValue('date', undefined)
                    }
                  }"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="w-full flex justify-between space-x-2">
          <FormField v-for="(slot, index) in ['cTime', 'aTime', 'sTime']" :key="index" v-slot="{ value }" :name="slot">
            <FormItem class="w-full">
              <FormLabel>{{ ['C', 'A', 'S'][index] }}时间</FormLabel>
              <NumberField
                class="w-full gap-2"
                :min="0"
                :model-value="value"
                :step="0.5"
                :disabled="isLoading"
                :format-options="{
                  minimumFractionDigits: 1,
                }"
                @update:model-value="(v: number) => {
                  if (v) {
                    setFieldValue(slot as Parameters<typeof setFieldValue>[0], v)
                  }
                  else {
                    setFieldValue(slot as Parameters<typeof setFieldValue>[0], 0)
                  }
                }"
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <FormControl>
                    <NumberFieldInput />
                  </FormControl>
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField, value }" name="text">
          <FormItem>
            <div class="flex items-center justify-between">
              <FormLabel>活动概要</FormLabel>
              <span class="text-sm text-muted-foreground">{{ value?.length || 0 }}/300</span>
            </div>
            <FormControl>
              <Textarea
                class="resize-none"
                placeholder="详细记录，最多三百字..."
                v-bind="componentField"
                :disabled="isLoading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="members">
          <FormItem>
            <div class="flex items-center justify-between">
              <FormLabel>参与者 <span class="text-sm text-muted-foreground">({{ selectedMembers.length }}/{{ (([...data.president, ...data.vice].find(club => club.id === Number(selectedClub))?.memberships) ?? []).length }})</span></FormLabel>
            </div>
            <FormControl>
              <div class="flex flex-wrap gap-x-2 gap-y-2">
                <div 
                  v-for="member in (
                    [...data.president, ...data.vice].find(
                      club => club.id === Number(selectedClub)
                    )?.memberships
                  ) ?? []"
                  :key="member.id"
                  class="flex items-center space-x-1"
                >
                  <Checkbox 
                    :id="member.id"
                    :value="member.id"
                    :checked="selectedMembers.includes(member.id)"
                    @update:checked="(checked) => handleCheckboxChange(member.id, checked)"
                    class="w-3.5 h-3.5"
                  />
                  <Label :for="member.id">{{ member.name }}</Label>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button :disabled="isLoading" type="submit">
          <Icon v-if="isLoading" class="mr-2" name="svg-spinners:180-ring-with-bg" />
          提交
        </Button>
      </form>
    </CardContent>
  </Card>
  <Toaster />
</template>