<script setup lang="ts">
import type { ClassroomData } from '@prisma/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import { LoaderCircle } from 'lucide-vue-next'
import { enums } from '~/components/custom/enum2str'
import type { AllClubs } from '~/types/api/user/all_clubs'

const { toast } = useToast()

const { data } = await useAsyncData<ClassroomData[]>('classroomStatuses', () => {
  return $fetch<ClassroomData[]>(`/api/reservation/classroomId`, {
    headers: useRequestHeaders(),
    method: 'GET',
  })
})

if (!data.value) {
  toast({
    title: '错误',
    description: '获取教室信息出错',
  })
}
else {
  data.value = data.value.sort((a: any, b: any) => a.name < b.name ? -1 : 1)
}

const { data: clubs } = await useAsyncData<AllClubs>('clubs', () => {
  return $fetch<AllClubs>(`/api/user/all_clubs`, {
    headers: useRequestHeaders(),
    method: 'GET',
  })
})

if (!clubs.value) {
  toast({
    title: '错误',
    description: '获取社团信息出错',
  })
}

let reloadKey = 0

const day = ref([false, false, false, false, false, false, false])

const pending = ref(false)

const formData = ref({
  day: computed(() => {
    let r = ''
    day.value.forEach((e) => {
      r += e ? '1' : '0'
    })
    return r
  }), // Sunday ~ Saturday
  period: '',
  classroom: '',
  applicant: '',
  note: '',
})

async function handleSubmit(e: any) {
  e.preventDefault()
  if (pending.value) {
    toast({
      description: '请等待前一个提交完成',
    })
    return
  }
  if (formData.value.day === '0000000') {
    toast({
      description: '请填写完整预约时间',
    })
    return
  }
  pending.value = true
  try {
    const { data, error } = await useFetch('/api/reservation/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    })
    if (error.value) {
      toast({
        title: '发生错误',
        description: error.value.data,
        variant: 'destructive',
      })
    }
    else if (data.value?.status === 'SUCCESS') {
      toast({
        title: '创建成功',
        description: '已成功创建预约记录，你可以在「管理预约」中查看',
      })
      // A VERY BAD PRACTICE TO RELOAD THE FORM
      // TODO: TO BE FIXED
      reloadKey++
      day.value = [false, false, false, false, false, false, false]
      formData.value.period = ''
      formData.value.classroom = ''
      formData.value.applicant = ''
      formData.value.note = ''
    }
    else if (data.value?.status === 'PRISMA_ERROR') {
      toast({
        title: '数据错误',
        description: '请稍后再试',
        variant: 'destructive',
      })
    }
  }
  catch (error) {
    toast({
      title: 'Error',
      description: error,
      variant: 'destructive',
    })
  }
  pending.value = false
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>预约教室</CardTitle>
      <CardDescription>在此处预约教室</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-2" @submit="handleSubmit">
        <FormField name="main">
          <FormItem>
            <FormLabel>预约时间</FormLabel>
            <FormControl>
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 justify-start">
                <!-- This ToggleGroup should be implemented in a better way but anyway it works -->
                <ToggleGroup :key="reloadKey" type="multiple" variant="outline">
                  <div class="text-muted-foreground text-sm text-center w-7">
                    每周
                  </div>
                  <ToggleGroupItem value="mon" @click="day[1] = !day[1]">
                    一
                  </ToggleGroupItem>
                  <ToggleGroupItem value="tue" @click="day[2] = !day[2]">
                    二
                  </ToggleGroupItem>
                  <ToggleGroupItem value="wed" @click="day[3] = !day[3]">
                    三
                  </ToggleGroupItem>
                  <ToggleGroupItem value="thu" @click="day[4] = !day[4]">
                    四
                  </ToggleGroupItem>
                  <ToggleGroupItem value="fri" @click="day[5] = !day[5]">
                    五
                  </ToggleGroupItem>
                </ToggleGroup>
                <Select v-model="formData.period" required>
                  <SelectTrigger class="lg:ml-3">
                    <SelectValue placeholder="选择时段" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="period in enums.periods.values" :key="period" :value="period">
                      {{ enums.periods.map[period] }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
          </FormItem>
          <div class="py-1" />
          <FormItem>
            <FormLabel>选择教室</FormLabel>
            <div v-if="!clubs || !data">
              <Skeleton class="h-5 p-3 my-3" />
            </div>
            <FormControl>
              <Select v-model="formData.classroom" required>
                <SelectTrigger>
                  <SelectValue placeholder="选择教室" />
                </SelectTrigger>
                <!-- Only available classrooms should be filled in the following <SelectContent/> -->
                <SelectContent>
                  <SelectGroup v-for="classroom in data" :key="classroom.id">
                    <SelectItem :value="classroom.id.toString()">
                      <span class="inline-block min-w-32 text-left">
                        <span class="inline-block min-w-14">
                          {{ classroom.name }}
                        </span>
                        <span class="inline-block text-gray-500">
                          {{ classroom.alias }}
                        </span>
                      </span>
                      <span v-if="classroom.size" class="text-gray-400">
                        可容纳<span class="inline-block w-5 text-center">{{ classroom.size }}</span>人
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          <div class="py-1" />
          <FormItem>
            <FormLabel>社团</FormLabel>
            <FormControl>
              <Select v-model="formData.applicant" required>
                <SelectTrigger>
                  <SelectValue placeholder="选择你的社团" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup v-if="clubs?.president.length">
                    <SelectItem v-for="club in clubs.president" :key="club.id" :value="club.id">
                      {{ club.name.zh }}
                      <span class="inline-block text-gray-500">
                        社长
                      </span>
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup v-if="clubs?.vice.length">
                    <SelectItem v-for="club in clubs?.vice" :key="club.id" :value="club.id">
                      {{ club.name.zh }}
                      <span class="inline-block text-gray-500">
                        副社
                      </span>
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup v-if="clubs?.member.length">
                    <SelectItem v-for="club in clubs?.member" :key="club.id" :value="club.id">
                      {{ club.name.zh }}
                      <span class="inline-block text-gray-500">
                        成员
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
          <div class="py-1" />
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
        <Button type="submit" :disabled="pending" class="mr-3">
          <LoaderCircle v-if="pending" class="animate-spin mr-2" />
          <span v-if="!pending">提交预约</span>
          <span v-if="pending">处理中...</span>
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
