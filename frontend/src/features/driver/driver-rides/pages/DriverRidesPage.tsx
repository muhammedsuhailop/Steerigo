import React, { useState, useEffect } from "react";
import { DriverSidebar, DriverTopbar } from "../../shared/components";
import { Footer } from "@/features/public/components";
import { useGetDriverRidesQuery } from "../services/driverRidesApi";
import { RideCard } from "../components/RideCard";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { Select } from "@/shared/components/ui";
import { type RidesFilters } from "../types/driverRides.types";
import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import { RideStatus } from "@/shared/types/ride.types";
import { getPaginationRange } from "@/shared/utils/paginationRangeHelper";

const DriverRidesPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Filtration & Pagination State
  const [filters, setFilters] = useState<RidesFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, isFetching } = useGetDriverRidesQuery(filters);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      status: (e.target.value as RideStatus) || undefined,
      page: 1,
    }));
  };

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DriverSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <DriverTopbar onToggleSidebar={toggleSidebar} title="My Rides" />

        <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="relative flex-1 max-w-xs">
                <Select
                  name="status"
                  value={filters.status || ""}
                  onChange={handleStatusChange}
                  options={[
                    { value: "", label: "All Statuses" },
                    ...Object.values(RideStatus).map((s) => ({
                      value: s,
                      label: s,
                    })),
                  ]}
                  className="pl-10"
                />
                <FaFilter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <select
                className="text-sm border-none bg-transparent font-semibold focus:ring-0"
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    sortOrder: e.target.value as "asc" | "desc",
                  }))
                }
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Grid View */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                {data?.rides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
              </div>

              {data?.rides.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-500">
                    No rides found matching your criteria.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {/* Previous */}
                  <button
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        page: Math.max(1, p.page - 1),
                      }))
                    }
                    disabled={filters.page === 1 || isFetching}
                    className="p-2 rounded-lg border border-slate-100 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
                  >
                    <FaChevronLeft size={12} />
                  </button>

                  {/* Page Numbers */}
                  {getPaginationRange(
                    data.pagination.page,
                    data.pagination.totalPages,
                  ).map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="px-1 text-slate-300 font-bold"
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNumber = page as number;
                    const isActive = filters.page === pageNumber;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            page: pageNumber,
                          }))
                        }
                        disabled={isFetching}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105"
                            : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100 hover:border-slate-300"
                        } disabled:opacity-50`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  {/* Next */}
                  <button
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        page: Math.min(data.pagination.totalPages, p.page + 1),
                      }))
                    }
                    disabled={
                      filters.page === data.pagination.totalPages || isFetching
                    }
                    className="p-2 rounded-lg border border-slate-100 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>

      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DriverRidesPage;
