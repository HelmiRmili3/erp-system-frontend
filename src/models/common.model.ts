export interface PaginationMetadata {
  pageNumber: number
  pageSize: number
  totalCount: number
}

export interface ApiResponse<T> {
  data: T[]
  metadata: PaginationMetadata
}

export type IsLoadable<T extends object> = T & {
  isLoading: boolean;
};
