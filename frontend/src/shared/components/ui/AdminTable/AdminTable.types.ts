/**
 * Admin Table Type Definitions
 * Centralized types for all admin tables - WITHOUT HOOKS
 * Pure TypeScript interfaces and utilities
 */

import type { ReactNode } from "react";
import type { Column } from "@/shared/components/ui/Table";

/**
 * Generic admin table row data type
 */
export interface AdminTableRow {
  id: string;
  [key: string]: any;
}

/**
 * Base props for all admin tables
 */
export interface BaseAdminTableProps<T extends AdminTableRow> {
  data: T[];
  loading?: boolean;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  errorMessage?: string;
  emptyMessage?: string;
  className?: string;
}

/**
 * Date formatting options
 */
export interface DateFormatOptions {
  locale?: string;
  day?: "2-digit" | "numeric";
  month?: "2-digit" | "numeric" | "long" | "short";
  year?: "numeric" | "2-digit";
  includeTime?: boolean;
}

/**
 * Status badge configuration type
 */
export interface StatusConfig {
  variant: "warning" | "success" | "secondary" | "outline" | "danger";
  text: string;
}

/**
 * Status badge registry interface
 */
export interface StatusBadgeRegistry {
  [key: string]: StatusConfig;
}

/**
 * Format utilities - STANDALONE (no hooks)
 */
export interface FormatUtils {
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (
    date: string | Date | null,
    options?: DateFormatOptions
  ) => string;
  formatPhoneNumber: (phone: string) => string;
  formatDateWithExpiry: (
    date: string | null,
    isExpiryDate?: boolean
  ) => ReactNode;
}

/**
 * Action loading state tracker
 */
export interface ActionLoadingState {
  getIsLoading: (id: string) => boolean;
  setLoading: (id: string, isLoading: boolean) => void;
}

/**
 * Table state interface
 */
export interface AdminTableState<T extends AdminTableRow> {
  data: T[];
  loading: boolean;
  selectedRows?: Set<string>;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
}

/**
 * Pagination interface
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/**
 * Filter interface
 */
export interface FilterState {
  [key: string]: string | number | boolean | Date;
}
