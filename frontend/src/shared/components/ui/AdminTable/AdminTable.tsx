import React from "react";
import { Table } from "@/shared/components/ui";
import type {
  BaseAdminTableProps,
  AdminTableRow,
} from "@/shared/components/ui/AdminTable/AdminTable.types";
import type { Column } from "@/shared/components/ui/Table";

export const AdminTable = React.forwardRef<
  HTMLDivElement,
  BaseAdminTableProps<any>
>(
  (
    {
      data,
      loading = false,
      columns,
      onRowClick,
      errorMessage,
      emptyMessage = "No data available",
      className,
    },
    ref
  ) => {
    const memoizedColumns = React.useMemo(
      () => columns as Column<any>[],
      [columns]
    );
    const memoizedData = React.useMemo(() => data, [data]);

    return (
      <div
        ref={ref}
        className={`w-full overflow-hidden rounded-lg border border-gray-200 text-gray-900 ${
          className || ""
        }`}
      >
        {errorMessage && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}

        <Table
          columns={memoizedColumns}
          data={memoizedData}
          loading={loading}
          onRowClick={onRowClick}
          className={
            emptyMessage && memoizedData.length === 0 ? "opacity-50" : ""
          }
        />

        {!loading && memoizedData.length === 0 && !errorMessage && (
          <div className="p-8 text-center text-gray-700">
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    );
  }
);

AdminTable.displayName = "AdminTable";

export const validateAdminTableProps = <T extends AdminTableRow>(
  props: BaseAdminTableProps<T>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!props.data || !Array.isArray(props.data)) {
    errors.push("'data' prop must be an array");
  }

  if (!props.columns || props.columns.length === 0) {
    errors.push("'columns' prop must be a non-empty array");
  }

  if (props.onRowClick && typeof props.onRowClick !== "function") {
    errors.push("'onRowClick' prop must be a function");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const AdminTableWithValidation = React.forwardRef<
  HTMLDivElement,
  BaseAdminTableProps<any>
>((props, ref) => {
  if (process.env.NODE_ENV === "development") {
    const validation = validateAdminTableProps(props);
    if (!validation.valid) {
      console.warn("AdminTable Props Validation Errors:", validation.errors);
    }
  }

  return <AdminTable ref={ref} {...props} />;
});

AdminTableWithValidation.displayName = "AdminTableWithValidation";

export class AdminColumnBuilder<T extends AdminTableRow> {
  private columns: Column<T>[] = [];

  addTextColumn(
    key: keyof T,
    header: string,
    options?: { width?: string; align?: "left" | "center" | "right" }
  ): this {
    this.columns.push({
      key: String(key),
      header,
      render: (value) => value || "—",
      width: options?.width,
      align: options?.align,
    });
    return this;
  }

  addCustomColumn(
    key: string,
    header: string,
    render: (value: any, row: T) => React.ReactNode,
    options?: { width?: string; align?: "left" | "center" | "right" }
  ): this {
    this.columns.push({
      key,
      header,
      render,
      width: options?.width,
      align: options?.align,
    });
    return this;
  }

  addStatusColumn(
    key: keyof T,
    header: string,
    statusRenderer: (value: any) => React.ReactNode,
    options?: { width?: string }
  ): this {
    this.columns.push({
      key: String(key),
      header,
      render: (_, row) => statusRenderer(row[key]),
      width: options?.width,
      align: "center",
    });
    return this;
  }

  addFormattedColumn(
    key: keyof T,
    header: string,
    formatter: (value: unknown) => string,
    options?: { width?: string; align?: "left" | "center" | "right" }
  ): this {
    this.columns.push({
      key: String(key),
      header,
      render: (value) => formatter(value),
      width: options?.width,
      align: options?.align,
    });
    return this;
  }

  addActionsColumn(
    render: (row: T) => React.ReactNode,
    options?: { width?: string }
  ): this {
    this.columns.push({
      key: "actions",
      header: "Actions",
      render: (_, row) => render(row),
      width: options?.width || "200px",
      align: "center",
    });
    return this;
  }

  build(): Column<T>[] {
    return this.columns;
  }

  reset(): this {
    this.columns = [];
    return this;
  }
}

export const createColumnBuilder = <T extends AdminTableRow>() => {
  return new AdminColumnBuilder<T>();
};
