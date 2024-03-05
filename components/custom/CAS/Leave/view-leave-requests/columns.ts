import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Club, LeaveRequest } from '@prisma/client'
import { ArrowUpDown } from 'lucide-vue-next'
import DropdownAction from './DataTableAction.vue'
import { Button } from '#components'

export const columns: ColumnDef<LeaveRequest>[] = [
  {
    accessorKey: 'startDate',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['日期', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('startDate')).toLocaleDateString()
      return h('div', { class: 'min-w-34 pl-4' }, date)
    },
  },
  {
    accessorKey: 'club',
    header: () => h('div', '社团'),
    cell: ({ row }) => {
      const club = row.getValue('club') as Club
      const clubName = club.name as { zh: string, en: string }
      return h('div', { class: 'font-medium min-w-20 md:min-w-32' }, clubName.zh)
    },
  },
  {
    accessorKey: 'reason',
    header: () => h('div', '原因'),
    cell: ({ row }) => {
      return h('div', { class: 'font-medium min-w-44 md:min-w-56' }, row.getValue('reason')) // use badge
    },
  },
  {
    accessorKey: 'status',
    header: () => h('div', '状态'),
    cell: ({ row }) => {
      const requestStatus = row.getValue('status')
      if (requestStatus === 'PENDING')
        return h('div', { class: 'bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 w-[70px]' }, '等待审批')
      else if (requestStatus === 'APPROVED')
        return h('div', { class: 'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 w-[70px]' }, '审批通过')
      else if (requestStatus === 'DENIED')
        return h('div', { class: 'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 w-[70px]' }, '审批拒绝')
      else return h('div', { class: 'font-medium' }, row.getValue('status'))
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const club = row.original
      return h('div', { class: 'relative text-right' }, h(DropdownAction, {
        club,
      }))
    },
  },
]
