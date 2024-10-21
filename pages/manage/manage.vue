<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { LoaderCircle } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { enums } from '~/components/custom/enum2str'

definePageMeta({
  middleware: ['auth'],
})

const { toast } = useToast()

enum Statuses {
  LOADING,
  ERROR,
  READY,
}

const status = ref(Statuses.LOADING)
let content: any[] = []

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
      content = response.data
    }
  }
  catch (error) {
    status.value = Statuses.ERROR
  }
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
  if (action === 'DELETE') {
    alertContent.message += '撤销'
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
        admin: false,
      },
    })
    await load()
  }
  catch (error: any) {
    toast({
      description: error.data.message,
      variant: 'destructive',
    })
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
        <TableHead>社团</TableHead>
        <TableHead>日期</TableHead>
        <TableHead>时间</TableHead>
        <TableHead>教室</TableHead>
        <TableHead>备注</TableHead>
        <TableHead>管理</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody v-if="status === Statuses.LOADING">
      <TableRow v-for="i in 5" :key="i">
        <TableCell v-for="j in 9" :key="j">
          <Skeleton class="h-5 my-2" />
        </TableCell>
      </TableRow>
    </TableBody>
    <TableBody v-if="status === Statuses.READY">
      <TableRow v-for="record in content" :key="record.id">
        <TableCell class="text-muted-foreground">
          #{{ record.id }}
        </TableCell>
        <TableCell>{{ $dayjs(record.creationTimestamp).fromNow() }}</TableCell>
        <TableCell>{{ record.user.name }}</TableCell>
        <TableCell>{{ record.club.name.zh }}</TableCell>
        <TableCell>{{ enums.days.map[record.day] }}</TableCell>
        <TableCell>{{ enums.periods.map[record.period] }}</TableCell>
        <TableCell>{{ record.classroom.name }}</TableCell>
        <TableCell>
          {{ record.note ? '' : '–' }}
          <HoverCard v-if="record.note">
            <HoverCardTrigger>
              <Button variant="link" class="text-blue-500">
                查看
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              {{ record.note }}
            </HoverCardContent>
          </HoverCard>
        </TableCell>
        <TableCell class="text-left">
          <div v-if="true" class="text-red-500">
            <Button variant="link" class="p-0 text-red-500" @click="confirmManage(record.id, 'DELETE')">
              撤销
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div v-if="status === Statuses.READY && !content.length" class="w-1/3 my-2 mx-auto text-center">
    <Alert>
      暂无记录
    </Alert>
  </div>
  <div v-if="status === Statuses.ERROR" class="w-1/3 my-2 mx-auto text-center">
    <Alert variant="destructive">
      加载失败
    </Alert>
  </div>
  <Toaster />
</template>
