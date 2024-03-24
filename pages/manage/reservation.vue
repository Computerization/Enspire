<script setup lang="ts">
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Classroom Reservation | Enspire',
})

const formData = ref({
  date: null,
  loop: false,
  day: {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
  },
  time: {
    start: new Date(0),
    end: new Date(0),
  },
  classroom: '',
  description: '',
  applicant: '',
  note: '',
})
</script>

<template>
  <div>
    <div class="inline-block align-top w-full lg:w-1/2 p-5">
      <div class="flex rounded border h-[50vh] lg:h-[80vh] items-center justify-center">
        <div>
          map placeholder
          <div class="my-5" />
          FORMDATA: (for testing only)
          <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>
    </div>
    <div class="inline-block align-top w-full lg:w-1/2 lg:max-w-[480px] p-5">
      <div class="text-2xl">
        预约教室
      </div>
      <div class="py-5" />
      <form class="space-y-2">
        <FormField name="main">
          <FormItem>
            <FormLabel>预约时间</FormLabel>
            <FormControl>
              <Popover v-if="!formData.loop">
                <PopoverTrigger as-child>
                  <Button variant="outline" class="w-full">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    <span>{{ formData.date ? format(formData.date, 'PPP') : "选择日期" }}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="formData.date" mode="date" required />
                </PopoverContent>
              </Popover>
              <!-- TODO: change the following container to a ToggleGroup -->
              <!-- BUG: Toggle does not work with formData -->
              <div v-if="formData.loop" class="flex space-x-2 items-center">
                <div>每周</div>
                <Toggle v-model="formData.day.mon" variant="outline">
                  一
                </Toggle>
                <Toggle v-model="formData.day.tue" variant="outline">
                  二
                </Toggle>
                <Toggle v-model="formData.day.wed" variant="outline">
                  三
                </Toggle>
                <Toggle v-model="formData.day.thu" variant="outline">
                  四
                </Toggle>
                <Toggle v-model="formData.day.fri" variant="outline">
                  五
                </Toggle>
              </div>
              <div class="flex space-x-2 items-center">
                <Switch :checked="formData.loop" @update:checked="(v) => (formData.loop = v)" />
                <Label>循环</Label>
              </div>
              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" class="w-full">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    <span>{{
                      formData.time.start.getTime() !== new Date(0).getTime() && formData.time.end.getTime() !== new Date(0).getTime()
                        ? `${format(formData.time.start, 'hh:mm')} ~ ${format(formData.time.end, 'hh:mm')}`
                        : `选择
                          ${formData.time.start.getTime() === new Date(0).getTime() ? "开始" : ""}
                          ${formData.time.end.getTime() === new Date(0).getTime() ? "结束" : ""}
                        时间`
                    }}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto pt-5 text-center">
                  开始时间
                  <Calendar v-model="formData.time.start" mode="time" hide-time-header required />
                  结束时间
                  <Calendar v-model="formData.time.end" mode="time" hide-time-header required />
                </PopoverContent>
              </Popover>
            </formcontrol>
          </FormItem>
          <FormItem>
            <FormLabel>选择教室</FormLabel>
            <FormControl>
              <Select v-model="formData.classroom" required>
                <SelectTrigger>
                  <SelectValue placeholder="选择教室" />
                </SelectTrigger>
                <!-- Only available classrooms should be filled in the following <SelectContent/> -->
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>A 楼</SelectLabel>
                    <SelectItem value="a">
                      Placeholder
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>B 楼</SelectLabel>
                    <SelectItem value="b">
                      Placeholder
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>C 楼</SelectLabel>
                    <SelectItem value="c">
                      Placeholder
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>D 楼</SelectLabel>
                    <SelectItem value="d">
                      Placeholder
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              列表中均为可用的教室
            </FormDescription>
          </FormItem>
          <div class="py-2" />
          <FormItem>
            <FormLabel>活动描述</FormLabel>
            <FormControl>
              <Input v-model="formData.description" type="text" placeholder="简短描述所预约教室的用途" required />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>申请人</FormLabel>
            <FormControl>
              <Select v-model="formData.applicant" required>
                <SelectTrigger>
                  <SelectValue placeholder="选择申请人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">
                    个人
                  </SelectItem>
                  <SelectItem value="a">
                    社团 A
                  </SelectItem>
                  <SelectItem value="b">
                    社团 B
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              以个人 / 所管理的社团的名义申请预约
            </FormDescription>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>备注</FormLabel>
            <FormControl>
              <Textarea v-model="formData.note" type="text" placeholder="备注" class="resize-none" rows="3" />
            </FormControl>
            <FormDescription>
              非必填
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="py-2" />
        <Button type="submit">
          提交预约申请
        </Button>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
