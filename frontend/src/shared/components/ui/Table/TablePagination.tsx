import React from "react";
import { Button } from "../Button";
import { Select } from "../Select";
import type { TablePaginationProps } from "./Table.types";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
} from "react-icons/ri";

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  showSizeChanger = true,
  onPageSizeChange,
}) => {
  // Boundary validation
  const safeTotalPages = Math.max(totalPages, 0);
  const safeCurrentPage = Math.max(
    1,
    Math.min(currentPage, safeTotalPages || 1)
  );
  const safeTotalItems = Math.max(totalItems, 0);

  const startItem =
    safeTotalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem =
    safeTotalItems === 0
      ? 0
      : Math.min(safeCurrentPage * pageSize, safeTotalItems);

  const isPaginationDisabled = safeTotalItems === 0 || safeTotalPages <= 1;

  const handleFirstPage = () => {
    if (!isPaginationDisabled && safeCurrentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (!isPaginationDisabled && safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!isPaginationDisabled && safeCurrentPage < safeTotalPages) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (
      !isPaginationDisabled &&
      safeCurrentPage < safeTotalPages &&
      safeTotalPages > 0
    ) {
      onPageChange(safeTotalPages);
    }
  };

  const pageSizeOptions = [
    { value: "10", label: "10 / page" },
    { value: "25", label: "25 / page" },
    { value: "50", label: "50 / page" },
    { value: "100", label: "100 / page" },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      {/* Left: Items count & size selector */}
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-700">
          {safeTotalItems === 0
            ? "No results found"
            : `Showing ${startItem} to ${endItem} of ${safeTotalItems} results`}
        </div>
        {showSizeChanger && onPageSizeChange && (
          <Select
            options={pageSizeOptions}
            value={String(pageSize)}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            size="sm"
            fullWidth={false}
            className="w-32"
            disabled={safeTotalItems === 0}
          />
        )}
      </div>

      {/* Right: pagination controls */}
      <div className="flex items-center space-x-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleFirstPage}
          disabled={isPaginationDisabled || safeCurrentPage <= 1}
          leftIcon={<RiArrowLeftDoubleLine />}
          aria-label="Go to first page"
        />

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={isPaginationDisabled || safeCurrentPage <= 1}
          leftIcon={<RiArrowLeftSLine />}
          aria-label="Go to previous page"
        />

        {/* Page Indicator */}
        <div className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md min-w-[80px] justify-center">
          {safeTotalPages === 0
            ? "0 of 0"
            : `${String(safeCurrentPage).padStart(2, "0")} of ${String(
                safeTotalPages
              ).padStart(2, "0")}`}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={isPaginationDisabled || safeCurrentPage >= safeTotalPages}
          rightIcon={<RiArrowRightSLine />}
          aria-label="Go to next page"
        />

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLastPage}
          disabled={isPaginationDisabled || safeCurrentPage >= safeTotalPages}
          rightIcon={<RiArrowRightDoubleLine />}
          aria-label="Go to last page"
        />
      </div>
    </div>
  );
};
