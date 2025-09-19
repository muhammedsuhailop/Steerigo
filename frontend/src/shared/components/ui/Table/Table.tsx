import React from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import type { TableProps } from "./Table.types";

const getSizeStyles = (size: TableProps["size"] = "md") => {
  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };
  return sizes[size];
};

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  className = "",
  striped = true,
  hoverable = true,
  size = "md",
}: TableProps<T>) => {
  const sizeStyles = getSizeStyles(size);

  const tableClasses = `
    w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200
    ${sizeStyles}
    ${className}
  `.trim();

  const getColumnAlignment = (align?: string) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-gray-200">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        {/* Table Header */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 font-semibold text-gray-900 uppercase tracking-wider
                  ${getColumnAlignment(column.align)}
                  ${column.width ? `w-${column.width}` : ""}
                `}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={record.id || index}
                className={`
                  ${striped && index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  ${hoverable ? "hover:bg-gray-100" : ""}
                  ${onRowClick ? "cursor-pointer" : ""}
                  transition-colors duration-200
                `}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      px-6 py-4 whitespace-nowrap
                      ${getColumnAlignment(column.align)}
                    `}
                  >
                    {column.render
                      ? column.render(record[column.key], record, index)
                      : record[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
