import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoInformationCircleOutline } from "react-icons/io5";
import { FaLocationArrow } from "react-icons/fa";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import LocationPicker from "../components/LocationPicker";
import ScheduleForm from "../components/ScheduleForm";
import StatusToggle from "../components/StatusToggle";
import StatusCard from "../components/StatusCard";
import { Alert } from "@/shared/components/ui/Alert";
import {
  useUpdateLocationMutation,
  useUpdateScheduleMutation,
  useUpdateStatusMutation,
} from "../services/schedulingApi";
import { useGetDriverStatusQuery } from "../../shared/services/driverApi";
import type { Location, ScheduleFormData } from "../types/scheduling.types";
import {
  DriverSidebar,
  DriverTopbar,
} from "@/features/driver/shared/components";
import { Footer } from "@/features/public/components";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDriverId,
  setAvailability,
} from "../../shared/store/driverSlice";

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger";
}

const DriverScheduling: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Layout state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const [driverId, setDriverId] = useState<string | null>(null);

  const [currentStatus, setCurrentStatus] = useState<
    "Available" | "Busy" | "Offline"
  >("Offline");

  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const [availabilityData, setAvailabilityData] = useState<{
    availableFrom?: string;
    availableTill?: string;
    currentLocation?: Location;
  }>({});

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });

  // API calls
  const [updateLocation, { isLoading: isLocationSaving }] =
    useUpdateLocationMutation();
  const [updateSchedule, { isLoading: isScheduleLoading }] =
    useUpdateScheduleMutation();
  const [updateStatus, { isLoading: isStatusLoading }] =
    useUpdateStatusMutation();

  // Get driver status to preload availability
  const {
    data: driverStatusResponse,
    isLoading: isStatusLoading1,
    isError: isDriverStatusError,
    error: driverStatusError,
  } = useGetDriverStatusQuery();

  // Initialize form data from API response or use defaults
  const [defaultFormData, setDefaultFormData] = useState<{
    availableFrom: Date | null;
    availableTill: Date | null;
    location: Location | null;
  }>({
    availableFrom: null,
    availableTill: null,
    location: null,
  });

  const [hasAvailability, setHasAvailability] = useState(false);
  const didRedirectRef = useRef(false);

  // Load availability data on component mount
  useEffect(() => {
    if (driverStatusResponse?.data) {
      const availability = driverStatusResponse.data;

      // Store availability in Redux
      dispatch(setAvailability(availability));

      // Set default form values
      setDefaultFormData({
        availableFrom: new Date(availability.availableFrom),
        availableTill: new Date(availability.availableTill),
        location: availability.currentLocation,
      });

      // Set DriverId locally
      setDriverId(availability.driverId);

      // Availability data for StatusCard
      setAvailabilityData({
        availableFrom: availability.availableFrom,
        availableTill: availability.availableTill,
        currentLocation: availability.currentLocation,
      });

      // Set current status
      setCurrentStatus(
        availability.availabilityStatus as "Available" | "Busy" | "Offline"
      );

      // Set selected location for map
      setSelectedLocation(availability.currentLocation);

      setHasAvailability(true);
      return; // done
    }

    // Errors
    const err: any = driverStatusError;

    const serverMessage =
      err?.data?.message || driverStatusResponse?.message || err?.message || "";

    const is404ByStatus = Boolean(
      err && (err.status === 404 || err?.data?.status === 404)
    );

    if (is404ByStatus) {
      // Clear availability state
      setHasAvailability(false);
      setAvailabilityData({});

      // Default times (now +30min to +8h)
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      const endTime = new Date(now);
      endTime.setHours(endTime.getHours() + 8);

      setDefaultFormData({
        availableFrom: now,
        availableTill: endTime,
        location: null,
      });

      // show the server-provided message if present
      const friendly =
        serverMessage ||
        "No existing availability found. Please create a new schedule.";
      showAlert(friendly, "success");
      return;
    }

    if (isDriverStatusError) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Unable to load availability. Please try again later.";
      showAlert(msg, "danger");
    }
  }, [
    driverStatusResponse,
    driverStatusError,
    isDriverStatusError,
    dispatch,
    navigate,
  ]);

  const showAlert = (message: string, type: "success" | "danger") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 5000);
  };

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

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  const handleLocationSelect = (location: Location) =>
    setSelectedLocation(location);

  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      showAlert("Please select a location first.", "danger");
      return;
    }

    try {
      await updateLocation({
        driverId: driverId || "",
        currentLocation: selectedLocation,
      }).unwrap();

      setAvailabilityData((prev) => ({
        ...prev,
        currentLocation: selectedLocation,
      }));

      showAlert("Location saved successfully!", "success");
    } catch (error: any) {
      console.error("Failed to save location:", error);
      showAlert(
        error?.data?.message || "Failed to save location. Please try again.",
        "danger"
      );
    }
  };

  const handleScheduleSubmit = async (data: ScheduleFormData) => {
    if (!data.location) {
      showAlert("Please select a location on the map", "danger");
      return;
    }

    if (!data.availableFrom || !data.availableTill) {
      showAlert("Please select both start and end times", "danger");
      return;
    }

    try {
      await updateSchedule({
        availableFrom: data.availableFrom.toISOString(),
        availableTill: data.availableTill.toISOString(),
        currentLocation: data.location,
      }).unwrap();

      // Update local state
      setHasAvailability(true);
      setDefaultFormData(data);

      // Update availability data for StatusCard
      setAvailabilityData({
        availableFrom: data.availableFrom.toISOString(),
        availableTill: data.availableTill.toISOString(),
        currentLocation: data.location,
      });

      // Hide form after successful submission
      setShowScheduleForm(false);

      showAlert("Schedule updated successfully!", "success");
    } catch (error: any) {
      console.error("Failed to update schedule:", error);
      const serverError =
        error?.data?.errors?.[0]?.message ||
        error?.data?.message ||
        "Failed to update schedule. Please try again.";

      showAlert(serverError, "danger");
    }
  };

  const handleStatusChange = async (
    status: "Available" | "Busy" | "Offline"
  ) => {
    try {
      await updateStatus({ driverId: driverId || "", status }).unwrap();
      setCurrentStatus(status);
      showAlert("Status updated successfully!", "success");
    } catch (error: any) {
      console.error("Failed to update status:", error);
      showAlert(
        error?.data?.message || "Failed to update status. Please try again.",
        "danger"
      );
    }
  };

  // Handle disabled status click
  const handleDisabledStatusClick = () => {
    showAlert(
      "Please create an availability schedule first before changing your status.",
      "danger"
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <DriverSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <DriverTopbar
          onToggleSidebar={toggleSidebar}
          title="Schedule & Availability"
        />

        {/* Alert Banner */}
        {alert.show && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ ...alert, show: false })}
            />
          </div>
        )}

        {/* Loading State */}
        {isStatusLoading1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700 flex items-center gap-2">
                <span className="animate-spin">⟳</span>
                Loading your availability...
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Status and Form */}
            <div className="space-y-6">
              {/* Status Card */}
              <StatusCard
                availabilityStatus={currentStatus}
                availableFrom={availabilityData.availableFrom}
                availableTill={availabilityData.availableTill}
                currentLocation={availabilityData.currentLocation}
              />

              {/* Status Toggle */}
              <div className="bg-white/90 backdrop-blur p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <StatusToggle
                  currentStatus={currentStatus}
                  onStatusChange={handleStatusChange}
                  isLoading={isStatusLoading}
                  hasAvailability={hasAvailability}
                  onDisabledClick={handleDisabledStatusClick}
                />
              </div>

              {/* Info Card */}
              {!hasAvailability && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <IoInformationCircleOutline className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-900">
                        No Availability Found
                      </p>
                      <p className="text-yellow-800 text-sm mt-1">
                        Create your first availability schedule to get started.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/*Button to toggle schedule form */}
              <button
                onClick={() => setShowScheduleForm((prev) => !prev)}
                className={`
                  w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-base transition-all duration-200 ease-out
                  ${
                    showScheduleForm
                      ? "bg-emerald-700 text-white hover:bg-emerald-800"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  } active:scale-[0.98] focus:outline-none `}
              >
                {showScheduleForm ? (
                  <>
                    <FaCaretUp size={18} />
                    <span>Hide Schedule Form</span>
                  </>
                ) : (
                  <>
                    <FaCaretDown size={18} />
                    <span>Add / Update Schedule</span>
                  </>
                )}
              </button>

              {/* Schedule Form */}
              {showScheduleForm && (
                <ScheduleForm
                  onSubmit={handleScheduleSubmit}
                  selectedLocation={selectedLocation}
                  isLoading={isScheduleLoading}
                  defaultAvailableFrom={
                    defaultFormData.availableFrom || undefined
                  }
                  defaultAvailableTill={
                    defaultFormData.availableTill || undefined
                  }
                  defaultLocation={defaultFormData.location || undefined}
                />
              )}
            </div>

            {/* Right Column - Location Picker */}
            <div className="bg-white/90 backdrop-blur p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={
                  availabilityData.currentLocation ||
                  selectedLocation ||
                  undefined
                }
              />

              {/* Save Location Button */}
              <div className="mt-5">
                <button
                  onClick={handleSaveLocation}
                  disabled={!selectedLocation || isLocationSaving}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
                    !selectedLocation || isLocationSaving
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  }`}
                >
                  <FaLocationArrow size={20} />
                  {isLocationSaving ? "Saving..." : "Update Location"}
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
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

export default DriverScheduling;
