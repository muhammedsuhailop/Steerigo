export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
}

export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly meta: PaginationMeta;
}

export type LoadingState = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export interface FormFieldProps {
  readonly label?: string;
  readonly error?: string;
  readonly helperText?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
}

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}
