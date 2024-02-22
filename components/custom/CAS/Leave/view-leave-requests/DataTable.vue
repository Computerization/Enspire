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

import type { Club, LeaveRequest } from '@prisma/client'
import { valueUpdater } from '@/lib/utils'
import { Input } from '@/components/ui/input'

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
}>()

type LeaveRequestWithClubInfo = LeaveRequest & { club: Club }

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
          日期
        </div>
        <div class="font-mono text-muted-foreground text-sm italic">
          {{ new Date(String(currentRequestInDialog?.startDate)).toLocaleDateString() }}
        </div>
      </div>
      <DialogFooter>
        Save changes
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
