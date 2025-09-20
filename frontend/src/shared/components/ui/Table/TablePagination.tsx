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
  itemsPerPage,
  onPageChange,
  showSizeChanger = true,
  onPageSizeChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pageSizeOptions = [
    { value: "10", label: "10 / page" },
    { value: "25", label: "25 / page" },
    { value: "50", label: "50 / page" },
    { value: "100", label: "100 / page" },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
      {/* Left: Items count & size selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
        {showSizeChanger && onPageSizeChange && (
          <Select
            options={pageSizeOptions}
            value={itemsPerPage.toString()}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            size="sm"
            fullWidth={false}
            className="w-32"
          />
        )}
      </div>

      {/* Right: pagination controls */}
      <div className="flex items-center space-x-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="p-2 text-gray-500 disabled:text-gray-300 hover:bg-gray-100"
        >
          <RiArrowLeftDoubleLine className="w-5 h-5" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 text-gray-500 disabled:text-gray-300 hover:bg-gray-100"
        >
          <RiArrowLeftSLine className="w-5 h-5" />
        </Button>

        {/* Page Indicator */}
        <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
          {String(currentPage).padStart(2, "0")} of{" "}
          {String(totalPages).padStart(2, "0")}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 text-gray-500 disabled:text-gray-300 hover:bg-gray-100"
        >
          <RiArrowRightSLine className="w-5 h-5" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="p-2 text-gray-500 disabled:text-gray-300 hover:bg-gray-100"
        >
          <RiArrowRightDoubleLine className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
