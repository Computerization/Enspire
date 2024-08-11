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

import type { ActivityRecord, Club, ClubMembership } from '@prisma/client'
import { valueUpdater } from '@/lib/utils'
import { DonutChart } from '@/components/ui/chart-donut'

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
  // eslint-disable-next-line ts/no-unsafe-function-type
  refreshFunction: Function
}>()

type ActivityRecordtWithClubInfo = ActivityRecord & {
  attendees: ClubMembership[]
  club: Club & { memberships: ClubMembership[] }
}

const isDialogOpen = ref(false)
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const currentRequestInDialog = ref<ActivityRecordtWithClubInfo>()

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
  await useFetch('/api/cas/record/delete', {
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
              @click="currentRequestInDialog = row.original as ActivityRecordtWithClubInfo; isDialogOpen = true"
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
    <div class="flex justify-between pt-4 flex-row-reverse">
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
          活动记录详情
        </DialogDescription>
      </DialogHeader>

      <div>
        <div class="font-medium">
          日期
        </div>
        <div class="text-sm rounded border p-2 mt-1">
          {{ new Date(String(currentRequestInDialog?.date)).toLocaleDateString() }}
        </div>
      </div>

      <div>
        <div class="font-medium">
          活动概况
        </div>
        <div class="text-sm rounded border p-2 mt-1">
          {{ currentRequestInDialog?.text }}
        </div>
      </div>

      <div v-if="currentRequestInDialog?.attendees">
        <div class="font-medium">
          参与者
        </div>
        <div class="text-sm rounded border p-2 mt-1 grid grid-cols-2 gap-4">
          <DonutChart
            :data="[
              { name: '参与者', num: currentRequestInDialog.attendees.length },
              { name: '未参与者', num: currentRequestInDialog.club.memberships.length - currentRequestInDialog.attendees.length },
            ]"
            index="name"
            category="num"
            class="p-4"
          />
          <div class="h-full flex items-center justify-center">
            <div>
              <Badge class="mb-1" variant="outline">
                参与
              </Badge>
              <div class="flex items-center flex-wrap">
                <div v-for="(name, index) in currentRequestInDialog.attendees.map(attendee => attendee.name)" :key="index">
                  {{ name }}
                  <span v-if="index < currentRequestInDialog.attendees.length - 1" class="mr-1 text-muted-foreground">/</span>
                </div>
              </div>
              <Badge class="mt-2 mb-1" variant="outline">
                未参与
              </Badge>
              <div class="flex items-center flex-wrap">
                <div v-for="(name, index) in currentRequestInDialog.club.memberships.map(attendee => attendee.name).filter(name => !currentRequestInDialog!.attendees.map(attendee => attendee.name).includes(name))" :key="index">
                  {{ name }}
                  <span v-if="index < currentRequestInDialog.club.memberships.length - currentRequestInDialog.attendees.length - 1" class="mr-1 text-muted-foreground">/</span>
                </div>
              </div>
            </div>
          </div>
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
