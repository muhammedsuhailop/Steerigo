import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaMap,
  FaList,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { Alert } from "@/shared/components/ui/Alert";
import DriverSearchMap from "../components/DriverSearchMap";
import SearchFilters from "../components/SearchFilters";
import DriverCard from "../components/DriverCard";
import { useSearchNearbyDriversMutation } from "../services/driverSearchApi";
import {
  selectDrivers,
  selectIsLoading,
  selectError,
  selectSearchCriteria,
  selectTotalFound,
  setDrivers,
  setSearchCriteria,
  setTotalFound,
  setSearchedAt,
  setError,
  clearError,
  clearSearch,
} from "../store/driverSearchSlice";
import type {
  Driver,
  Location,
  SearchFormFilters,
} from "../types/driverSearch.types";
import { Header } from "@/features/public/components";
import { Footer } from "@/features/public/components";

const DriverSearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const drivers = useSelector(selectDrivers) ?? [];
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const searchCriteria = useSelector(selectSearchCriteria);
  const totalFound = useSelector(selectTotalFound) ?? 0;

  // Local state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "danger",
  });

  // API mutation
  const [searchNearbyDrivers] = useSearchNearbyDriversMutation();

  // Handle responsive layout
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

  const showAlert = useCallback(
    (message: string, type: "success" | "danger") => {
      setAlert({ show: true, message, type });
      // auto-hide
      window.setTimeout(
        () => setAlert({ show: false, message: "", type: "success" }),
        5000
      );
    },
    []
  );

  const handleSearch = useCallback(
    async (filters: SearchFormFilters, location: Location) => {
      try {
        dispatch(clearError());

        const payload = {
          latitude: location.latitude,
          longitude: location.longitude,
          searchDate: new Date().toISOString(),
          timeRequired: filters.timeRequired,
          radiusKm: filters.radiusKm,
          gearType: filters.gearType || undefined,
          bodyType: filters.bodyType || undefined,
          limit: 10,
        };

        const response = await searchNearbyDrivers(payload).unwrap();

        if (response?.success) {
          dispatch(setDrivers(response.data.drivers ?? []));
          dispatch(setTotalFound(response.data.summary.totalFound ?? 0));
          dispatch(
            setSearchCriteria(response.data.summary.searchCriteria ?? null)
          );
          dispatch(setSearchedAt(response.data.summary.searchedAt ?? null));
          showAlert(response.message ?? "Search successful", "success");
          setViewMode("map");
        } else {
          const msg = response?.message ?? "No drivers found";
          dispatch(setError(msg));
          showAlert(msg, "danger");
        }
      } catch (err: any) {
        const errorMessage =
          err?.data?.message ||
          err?.message ||
          "Failed to search nearby drivers";
        dispatch(setError(errorMessage));
        showAlert(errorMessage, "danger");
      }
    },
    [dispatch, searchNearbyDrivers, showAlert]
  );

  const handleClearSearch = useCallback(() => {
    dispatch(setDrivers([]));
    dispatch(clearSearch());
    // dispatch(setSearchCriteria(null));
    dispatch(setTotalFound(0));
    setSelectedDriver(null);
    setViewMode("map");
  }, [dispatch]);

  const handleDriverSelect = useCallback(
    (driver: Driver) => {
      setSelectedDriver(driver);
      showAlert(`Selected: ${driver.name}`, "success");
      // switch to details/view if needed
    },
    [showAlert]
  );

  const handleCallDriver = useCallback(
    (driver: Driver) => {
      // In real implementation, this would integrate with calling/messaging service
      showAlert(`Calling ${driver.name}...`, "success");
    },
    [showAlert]
  );

  const handleBackToDashboard = useCallback(() => {
    navigate("/user/dashboard");
  }, [navigate]);

  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sidebar */}
      {/* <UserSidebar collapsed={sidebarCollapsed} /> */}

      {/* Main Content */}
      <div
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease-out",
        }}
        className="flex-1 flex flex-col"
      >
        {/* Topbar */}
        <Header />

        {/* Content */}
        <main className="flex-1 px-4 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToDashboard}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
                title="Back to Dashboard"
                aria-label="Back to Dashboard"
              >
                <FaArrowLeft className="text-gray-700 w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Find Drivers</h1>
            </div>
          </div>

          {/* Alert */}
          {alert.show && (
            <Alert
              variant={alert.type}
              onClose={() => setAlert({ ...alert, show: false })}
            >
              {alert.message}
            </Alert>
          )}

          {/* Search Section */}
          {drivers.length === 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <SearchFilters onSearch={handleSearch} isLoading={isLoading} />
              </div>
              <div className="hidden lg:block">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-20">
                  <h3 className="font-bold text-gray-900 mb-4">How It Works</h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">
                        1
                      </span>
                      <span>Enter your pickup location</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">
                        2
                      </span>
                      <span>Set search radius and filters</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">
                        3
                      </span>
                      <span>View available drivers on map</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">
                        4
                      </span>
                      <span>Select and confirm your ride</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Found{" "}
                      <span className="font-bold text-blue-600">
                        {totalFound}
                      </span>{" "}
                      available {totalFound === 1 ? "driver" : "drivers"}
                    </p>

                    {searchCriteria && (
                      <p className="text-xs text-gray-500 mt-1">
                        Within {searchCriteria.radiusKm} km
                        {searchCriteria?.filters?.gearType &&
                          ` • ${searchCriteria.filters.gearType}`}
                        {searchCriteria?.filters?.bodyType &&
                          ` • ${searchCriteria.filters.bodyType}`}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("map")}
                        aria-pressed={viewMode === "map"}
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
                        aria-pressed={viewMode === "list"}
                        className={`px-4 py-2 rounded font-semibold transition flex items-center gap-2 text-sm ${
                          viewMode === "list"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <FaList /> <span>List</span>
                      </button>
                    </div>

                    {/* Edit Search Button */}
                    <button
                      onClick={handleClearSearch}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition text-sm"
                      aria-label="Edit search"
                    >
                      Edit Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                  {viewMode === "map" && searchCriteria ? (
                    <DriverSearchMap
                      drivers={drivers}
                      userLocation={{
                        latitude: searchCriteria.location?.latitude ?? 0,
                        longitude: searchCriteria.location?.longitude ?? 0,
                        address: searchCriteria.location
                          ? `${searchCriteria.location.latitude.toFixed(
                              4
                            )}, ${searchCriteria.location.longitude.toFixed(4)}`
                          : "Unknown location",
                      }}
                      searchRadius={searchCriteria.radiusKm ?? 5}
                      onDriverSelect={handleDriverSelect}
                    />
                  ) : (
                    <div className="grid gap-4">
                      {drivers.map((driver) => (
                        <DriverCard
                          key={driver.id}
                          driver={driver}
                          onSelect={handleDriverSelect}
                          onCall={handleCallDriver}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Driver Details */}
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
                        onCall={handleCallDriver}
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
                      <p className="text-gray-600 font-semibold">
                        No driver selected
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Click on a driver card or map marker to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DriverSearchResultsPage;
