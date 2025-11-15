import React, { useState } from "react";
import { FaMap, FaList, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import DriverSearchMap from "../components/DriverSearchMap";
import DriverCard from "../components/DriverCard";
import type {
  Driver,
  Location,
  SearchFormFilters,
} from "../types/driverSearch.types";

interface Props {
  drivers: Driver[];
  isLoading?: boolean;
  totalFound?: number;
  searchCriteria?: {
    location?: Location;
    radiusKm?: number;
    filters?: Partial<SearchFormFilters>;
  } | null;
  // callbacks
  onDriverSelect?: (driver: Driver) => void;
  onDriverCall?: (driver: Driver) => void;
  onClearSearch?: () => void;
  // optional: initial view mode
  initialViewMode?: "map" | "list";
}

const DriverSearchResults: React.FC<Props> = ({
  drivers,
  isLoading = false,
  totalFound = 0,
  searchCriteria = null,
  onDriverSelect,
  onDriverCall,
  onClearSearch,
  initialViewMode = "map",
}) => {
  const [viewMode, setViewMode] = useState<"map" | "list">(initialViewMode);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const handleSelect = (d: Driver) => {
    setSelectedDriver(d);
    onDriverSelect?.(d);
  };

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Found{" "}
              <span className="font-bold text-blue-600">{totalFound}</span>{" "}
              available {totalFound === 1 ? "driver" : "drivers"}
            </p>

            {searchCriteria && (
              <p className="text-xs text-gray-500 mt-1">
                Within {searchCriteria.radiusKm ?? "—"} km
                {searchCriteria?.filters?.gearType &&
                  ` • ${searchCriteria.filters.gearType}`}
                {searchCriteria?.filters?.bodyType &&
                  ` • ${searchCriteria.filters.bodyType}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded font-semibold transition flex items-center gap-2 text-sm ${
                  viewMode === "map"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaMap /> <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded font-semibold transition flex items-center gap-2 text-sm ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaList /> <span>List</span>
              </button>
            </div>

            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition text-sm"
                aria-label="Edit search"
              >
                Edit Search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main results area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewMode === "map" && searchCriteria?.location ? (
            <DriverSearchMap
              drivers={drivers}
              userLocation={searchCriteria.location}
              searchRadius={searchCriteria.radiusKm ?? 5}
              onDriverSelect={(d) => {
                handleSelect(d);
              }}
            />
          ) : (
            <div className="grid gap-4">
              {drivers.map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  onSelect={(d) => handleSelect(d)}
                  onCall={(d) => onDriverCall?.(d)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="sticky top-20 h-fit">
          {selectedDriver ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                Selected Driver
              </h3>

              <DriverCard
                driver={selectedDriver}
                onSelect={() => {}}
                onCall={(d) => onDriverCall?.(d)}
              />

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-semibold mb-3">
                  Next Steps:
                </p>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li>1. Confirm your ride details</li>
                  <li>2. Set payment method</li>
                  <li>3. Confirm booking</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
              <FaTimesCircle className="text-gray-400 w-8 h-8 mx-auto mb-3" />
              <p className="text-gray-600 font-semibold">No driver selected</p>
              <p className="text-sm text-gray-500 mt-1">
                Click on a driver card or map marker to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverSearchResults;
