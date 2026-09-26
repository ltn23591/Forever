export interface BaseResponse<T = any> {
  succeeded: boolean;
  success?: boolean;
  message: string;
  msg?: string;
  statusCode: number;
  code?: string;
  data: T | null;
  errors?: Record<string, string[]> | null;
}

export interface PaginationInfo {
  pageNum: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

export interface PageResponse<T> extends BaseResponse<T[]>, PaginationInfo {}

export interface SelectOption {
  value: number | string;
  label: string;
}
