<script setup lang="ts">
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Classroom Reservation | Enspire',
})

const BASE_DATE = new Date(1970, 0, 1)
const formData = ref({
  date: null, // Date() object => ISO 8601 date string; use the date only
  loop: false,
  day: [false, false, false, false, false], // Monday ~ Friday
  utcTime: {
    // Date() object => ISO 8601 date string;
    // add the timezone offset to this time to reveal the user input; use the time only
    start: BASE_DATE,
    end: BASE_DATE,
  },
  timezoneOffset: -BASE_DATE.getTimezoneOffset() / 60, // in hours
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
              <!-- This ToggleGroup should be implemented in a better way but anyway it works -->
              <ToggleGroup v-if="formData.loop" variant="outline">
                每周
                <ToggleGroupItem value="mon" @click="formData.day[0] = !formData.day[0]">
                  一
                </ToggleGroupItem>
                <ToggleGroupItem value="tue" @click="formData.day[1] = !formData.day[1]">
                  二
                </ToggleGroupItem>
                <ToggleGroupItem value="wed" @click="formData.day[2] = !formData.day[2]">
                  三
                </ToggleGroupItem>
                <ToggleGroupItem value="thu" @click="formData.day[3] = !formData.day[3]">
                  四
                </ToggleGroupItem>
                <ToggleGroupItem value="fri" @click="formData.day[4] = !formData.day[4]">
                  五
                </ToggleGroupItem>
              </ToggleGroup>
              <div class="flex space-x-2 items-center">
                <Switch
                  :checked="formData.loop" @update:checked="(v) => {
                    formData.loop = v
                    // The following line is to fix a temporary problem caused by the implementation of ToggleGroup above
                    // If a v-model is applied to the ToggleGroup, this can be safely removed
                    formData.day = [false, false, false, false, false]
                  }"
                />
                <Label>循环</Label>
              </div>
              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" class="w-full">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    <span>
                      {{
                        formData.utcTime.start.getTime() !== BASE_DATE.getTime() && formData.utcTime.end.getTime() !== BASE_DATE.getTime()
                          ? `${format(formData.utcTime.start, 'hh:mm')} ~ ${format(formData.utcTime.end, 'hh:mm')}`
                          : `选择
                          ${formData.utcTime.start.getTime() === BASE_DATE.getTime() ? "开始" : ""}
                          ${formData.utcTime.end.getTime() === BASE_DATE.getTime() ? "结束" : ""}
                        时间`
                      }}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto pt-5 text-center">
                  开始时间
                  <Calendar v-model="formData.utcTime.start" mode="time" hide-time-header required />
                  结束时间
                  <Calendar v-model="formData.utcTime.end" mode="time" hide-time-header required />
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
