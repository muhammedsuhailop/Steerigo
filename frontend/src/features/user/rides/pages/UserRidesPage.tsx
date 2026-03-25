import React, { useState } from "react";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";
import { useGetUserRidesQuery } from "../services/userRidesApi";
import { UserRideCard } from "../components/UserRideCard";
import { UserRidesFilters, UserRidesResponse } from "../types/userRides.types";
import { RideStatus } from "@/shared/types/ride.types";
import { Select } from "@/shared/components/ui";
import {
  FaHistory,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getPaginationRange } from "@/shared/utils/paginationRangeHelper";

const UserRidesPage: React.FC = () => {
  const [filters, setFilters] = useState<UserRidesFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, isFetching } = useGetUserRidesQuery(filters);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      status: (e.target.value as RideStatus) || undefined,
      page: 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <FaHistory size={18} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Your Trips
              </h1>
            </div>
            <p className="text-gray-500 text-sm font-medium ml-11">
              Review and manage your ride history
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative min-w-[160px]">
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
                className="pl-9 h-10 text-xs font-bold border-none shadow-sm rounded-xl"
              />
              <FaFilter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={12}
              />
            </div>
          </div>
        </div>

        {/* Rides List */}
        <div className="space-y-1">
          {data?.rides && data.rides.length > 0 ? (
            data.rides.map((ride) => <UserRideCard key={ride.id} ride={ride} />)
          ) : !isLoading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                No rides found
              </p>
            </div>
          ) : null}
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {/* Previous Page Button */}
            <button
              onClick={() =>
                setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
              }
              disabled={filters.page === 1 || isFetching}
              className="p-2 rounded-lg border border-slate-100 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <FaChevronLeft size={12} />
            </button>

            {/* Dynamic Page Numbers */}
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
                    setFilters((p) => ({ ...p, page: pageNumber }))
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

            {/* Next Page Button */}
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
      </main>

      <Footer />
    </div>
  );
};

export default UserRidesPage;
