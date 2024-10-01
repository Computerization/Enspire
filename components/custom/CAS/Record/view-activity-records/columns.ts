import type { ActivityRecord, Club, ClubMembership } from '@prisma/client'
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '#components'
import { ArrowUpDown } from 'lucide-vue-next'
import { h } from 'vue'
import DropdownAction from './DataTableAction.vue'

export const columns: ColumnDef<ActivityRecord>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['日期', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('date')).toLocaleDateString()
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
    accessorKey: 'attendees',
    header: () => h('div', '参与人数'),
    cell: ({ row }) => {
      const attendeesNum = (row.getValue('attendees') as object[]).length
      const totalMembers = (row.getValue('club') as { memberships: ClubMembership[] }).memberships.length
      return h('div', { class: 'font-medium min-w-20 md:min-w-32 flex items-center' }, [attendeesNum, h('div', { class: 'text-muted-foreground ml-1' }, `/${totalMembers}`)])
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
