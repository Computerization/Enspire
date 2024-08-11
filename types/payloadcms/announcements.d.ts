interface Document {
  id: number
  message: string
  updatedAt: string
  createdAt: string
}

interface Pagination {
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number | null
  page: number
  pagingCounter: number
  prevPage: number | null
  totalDocs: number
  totalPages: number
}

export interface Announcements {
  docs: Document[]
  pagination: Pagination
}
