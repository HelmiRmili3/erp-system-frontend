export interface Response<T> {
  pageNumber: number
  pageSize: number
  recordsFiltered: number
  recordsTotal: number
  success: boolean
  message: string
  data: T
  status: string
}
