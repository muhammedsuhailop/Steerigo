export interface Column<T = any> {
  key: string;
  header: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}
export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (record: T, index: number) => void;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  size?: "sm" | "md" | "lg";
}
export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showSizeChanger?: boolean;
  onPageSizeChange?: (size: number) => void;
}
