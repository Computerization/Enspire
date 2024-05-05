<script setup lang="ts">
import { format, formatDistanceToNow, parse } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { LoaderCircle } from 'lucide-vue-next'
import { VueElement, onMounted } from 'vue'

definePageMeta({
  middleware: ['auth'],
})

enum Statuses {
  LOADING,
  ERROR,
  READY,
}

const status = ref(Statuses.LOADING)
let content: any[] = []
let RStatuses: any

async function load() {
  status.value = Statuses.LOADING
  try {
    const data = await $fetch('/api/reservation/all')
    if (!data) {
      status.value = Statuses.ERROR
    }
    else {
      status.value = Statuses.READY
      const response = JSON.parse(data)
      RStatuses = response.enum
      content = response.data
      console.log('UPDATED')
    }
  }
  catch (error) {
    status.value = Statuses.ERROR
  }
}

function toDayString(day: string) {
  let r = '每周'
  for (let i = 0; i < 7; i++)
    r += day[i] === '1' ? '日一二三四五六'[i] : ''
  return r
}

function toTimeString(time: number) {
  const padded = time.toString().padStart(4, '0')
  const h = padded.slice(0, 2)
  const m = padded.slice(2)
  return `${h}:${m}`
}

const dlgOpen = ref(false)
const alertContent = {
  title: '是否确认操作?',
  message: '',
  id: -1,
  action: 'UNKNOWN',
}
const managePending = ref(false)

function confirmManage(id: number, action: string, currentStatus = '') {
  alertContent.message = `将对 预约#${id} 执行以下操作: `
  if (action === 'APPROVE') {
    alertContent.message += '通过申请'
  }
  else if (action === 'DENY') {
    alertContent.message += '拒绝申请'
  }
  else if (action === 'UNDO') {
    alertContent.message += `撤销当前的${
      currentStatus === RStatuses.DENIED
      ? '已拒绝'
      : (currentStatus === RStatuses.APPROVED ? '已通过' : '未知')
    }状态`
  }
  alertContent.id = id
  alertContent.action = action
  dlgOpen.value = true
}

async function manage() {
  managePending.value = true
  try {
    const data = await $fetch('/api/reservation/manage', {
      query: {
        id: alertContent.id,
        action: alertContent.action,
      },
    })
    await load()
  }
  catch (error) {
    console.log(error.message)
  }
  managePending.value = false
  dlgOpen.value = false
}

onMounted(async () => {
  await load()
})
</script>

<template>
  <AlertDialog v-model:open="dlgOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ alertContent.title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ alertContent.message }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="managePending">
          取消
        </AlertDialogCancel>
        <Button :disabled="managePending" @click="manage()">
          <LoaderCircle v-if="managePending" class="animate-spin mr-2" />
          <span v-if="!managePending">确认</span>
          <span v-if="managePending">处理中...</span>
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-16">
          编号
        </TableHead>
        <TableHead>提交时间</TableHead>
        <TableHead>申请者</TableHead>
        <TableHead>类型</TableHead>
        <TableHead>日期</TableHead>
        <TableHead>开始时间</TableHead>
        <TableHead>结束时间</TableHead>
        <TableHead>教室</TableHead>
        <TableHead>活动描述 (悬浮查看额外备注)</TableHead>
        <TableHead>状态</TableHead>
        <TableHead>操作</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody v-if="status === Statuses.LOADING">
      <TableRow v-for="i in 5" :key="i">
        <TableCell v-for="j in 11" :key="j">
          <Skeleton class="h-5 my-2" />
        </TableCell>
      </TableRow>
    </TableBody>
    <TableBody v-if="status === Statuses.READY">
      <TableRow v-for="record in content" :key="record.id">
        <TableCell class="text-muted-foreground">
          #{{ record.id }}
        </TableCell>
        <TableCell>{{ formatDistanceToNow(new Date(record.creationTimestamp), { locale: zhCN, addSuffix: true }) }}</TableCell>
        <TableCell>{{ record.userId }}</TableCell>
        <TableCell>{{ record.loop ? '循环' : '单次' }}</TableCell>
        <TableCell>
          {{ record.loop
            ? toDayString(record.day)
            : format(parse(record.date.toString(), 'yyyymmdd', new Date()), 'yyyy 年 mm 月 dd 日') }}
        </TableCell>
        <TableCell>{{ toTimeString(record.start) }}</TableCell>
        <TableCell>{{ toTimeString(record.end) }}</TableCell>
        <TableCell>A000</TableCell>
        <TableCell>
          <HoverCard>
            <HoverCardTrigger>{{ record.description }}</HoverCardTrigger>
            <HoverCardContent>
              {{ record.note ? record.note : '无额外备注' }}
            </HoverCardContent>
          </HoverCard>
        </TableCell>
        <TableCell>
          <div v-if="record.status === RStatuses.DENIED" class="text-red-500">
            已拒绝
          </div>
          <div v-if="record.status === RStatuses.APPROVED" class="text-green-500">
            已通过
          </div>
          <div v-if="record.status === RStatuses.PENDING" class="text-yellow-500">
            待处理
          </div>
        </TableCell>
        <TableCell class="text-left">
          <div v-if="record.status === RStatuses.DENIED || record.status === RStatuses.APPROVED" class="text-red-500">
            <Button variant="link" class="p-0 text-blue-500" @click="confirmManage(record.id, 'UNDO', record.status)">
              撤销
            </Button>
          </div>
          <div v-if="record.status === RStatuses.PENDING">
            <Button variant="link" class="p-0 text-green-500" @click="confirmManage(record.id, 'APPROVE')">
              通过
            </Button>
            &nbsp;
            <Button variant="link" class="p-0 text-red-500" @click="confirmManage(record.id, 'DENY')">
              拒绝
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div v-if="status === Statuses.ERROR" class="w-1/3 my-2 mx-auto text-center">
    <Alert variant="destructive">
      加载失败
    </Alert>
  </div>
</template>
