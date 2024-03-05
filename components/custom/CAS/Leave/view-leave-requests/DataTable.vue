<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import type { Club, LeaveRequest, User } from '@prisma/client'
import { valueUpdater } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  refreshFunction: Function
}>()

type LeaveRequestWithClubInfo = LeaveRequest & { club: Club, user: User }

const isDialogOpen = ref(false)
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const currentRequestInDialog = ref<LeaveRequestWithClubInfo>()

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
  },
})

const isLoading = ref(false)
const deleteDialogOpen = ref(false)

table.setPageSize(5)

async function submitDeletion(id: string) {
  isLoading.value = true
  await useFetch('/api/cas/leave/delete', {
    method: 'DELETE',
    body: {
      id,
    },
  })
  isLoading.value = true
  deleteDialogOpen.value = false
  isDialogOpen.value = false
  props.refreshFunction()
}
</script>

<template>
  <div>
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows" :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
              @click="currentRequestInDialog = row.original as LeaveRequestWithClubInfo; isDialogOpen = true"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :col-span="columns.length" class="text-center">
                No results.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <div class="flex justify-between pt-4">
      <div class="flex items-center">
        <Input
          class="max-w-sm" placeholder="搜索原因..." size="sm"
          :model-value="table.getColumn('reason')?.getFilterValue() as string"
          @update:model-value=" table.getColumn('reason')?.setFilterValue($event)"
        />
      </div>
      <div class="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <Icon name="material-symbols:arrow-back-rounded" />
        </Button>
        <Button
          variant="outline"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <Icon name="material-symbols:arrow-forward-rounded" />
        </Button>
      </div>
    </div>
  </div>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>详情</DialogTitle>
        <DialogDescription>
          请假申请详情
        </DialogDescription>
      </DialogHeader>

      <div>
        <div class="font-medium">
          状态
        </div>
        <div v-if="currentRequestInDialog?.status === 'PENDING'" class="mt-1 bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 w-[70px]">
          等待审批
        </div>
        <Badge v-if="currentRequestInDialog?.status === 'APPROVED'" class="mt-1 bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 w-[70px]">
          审批通过
        </Badge>
        <Badge v-if="currentRequestInDialog?.status === 'DENIED'" class="mt-1 bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 w-[70px]" color="orange">
          被拒绝
        </Badge>
      </div>

      <div>
        <div class="font-medium">
          日期
        </div>
        <div class="font-mono text-muted-foreground text-sm italic">
          {{ new Date(String(currentRequestInDialog?.startDate)).toLocaleDateString() }}
        </div>
      </div>

      <div>
        <div class="font-medium">
          申请者
        </div>
        <div class="font-mono text-muted-foreground text-sm italic">
          {{ currentRequestInDialog?.user.name }}
        </div>
      </div>

      <div>
        <div class="font-medium">
          原因
        </div>
        <div class="font-mono text-muted-foreground text-sm italic">
          {{ currentRequestInDialog?.reason }}
        </div>
      </div>

      <DialogFooter>
        <Dialog v-model:open="deleteDialogOpen">
          <DialogTrigger as-child>
            <Button class="mt-1" size="sm">
              <span class="sr-only">Open menu</span>
              <Icon name="material-symbols:delete-outline" size="1.5em" />
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>您确定吗？</DialogTitle>
            </DialogHeader>
            <div class="text-muted-foreground text-sm">
              该操作无法撤消。
            </div>
            <DialogFooter class="justify-end">
              <DialogClose as-child>
                <Button type="button" variant="secondary" :disabled="isLoading">
                  Close
                </Button>
              </DialogClose>
              <Button v-if="currentRequestInDialog?.id" variant="destructive" type="button" :disabled="isLoading" @click="submitDeletion(currentRequestInDialog?.id)">
                <Icon v-if="isLoading" class="mr-2" name="svg-spinners:180-ring-with-bg" />
                确定
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
