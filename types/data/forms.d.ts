export interface Form {
  id?: string
  title: string
  description: string
  url: string
  start_date: string
  end_date: string
}

export interface Forms {
  [key: string]: Form
}
