import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoArrowBack,
  IoInformationCircleOutline,
  IoSaveOutline,
} from "react-icons/io5";
import LocationPicker from "../components/LocationPicker";
import ScheduleForm from "../components/ScheduleForm";
import StatusToggle from "../components/StatusToggle";
import { Alert } from "@/shared/components/ui/Alert";
import {
  useUpdateLocationMutation,
  useUpdateScheduleMutation,
  useUpdateStatusMutation,
} from "../api/schedulingApi";
import type { Location, ScheduleFormData } from "../types/scheduling.types";

import {
  DriverSidebar,
  DriverTopbar,
} from "@/features/driver/shared/components";
import { Footer } from "@/features/public/components";
import { useSelector } from "react-redux";
import { selectDriverId } from "../../shared/store/driverSlice";

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger";
}

const DriverScheduling: React.FC = () => {
  const navigate = useNavigate();
  // Layout state for sidebar collapse and mobile detection
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [currentStatus, setCurrentStatus] = useState<
    "Available" | "Busy" | "Offline"
  >("Offline");

  // Alert state
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });

  const [updateLocation, { isLoading: isLocationSaving }] =
    useUpdateLocationMutation();
  const [updateSchedule, { isLoading: isScheduleLoading }] =
    useUpdateScheduleMutation();
  const [updateStatus, { isLoading: isStatusLoading }] =
    useUpdateStatusMutation();

  const driverId = useSelector(selectDriverId);
  console.log('driver id : ',driverId)

  const showAlert = (message: string, type: "success" | "danger") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 5000);
  };

  React.useEffect(() => {
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
        driverId,
        currentLocation: selectedLocation,
      }).unwrap();
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
      showAlert("Schedule updated successfully!", "success");
    } catch (error: any) {
      console.error("Failed to update schedule:", error);
      showAlert(
        error?.data?.message || "Failed to update schedule. Please try again.",
        "danger"
      );
    }
  };

  const handleStatusChange = async (
    status: "Available" | "Busy" | "Offline"
  ) => {
    try {
      await updateStatus({ driverId, status }).unwrap();
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <DriverSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
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

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Status and Form */}
            <div className="space-y-6">
              {/* Status Toggle */}
              <div className="bg-white/90 backdrop-blur p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <StatusToggle
                  currentStatus={currentStatus}
                  onStatusChange={handleStatusChange}
                  isLoading={isStatusLoading}
                />
              </div>

              {/* Schedule Form */}
              <ScheduleForm
                onSubmit={handleScheduleSubmit}
                selectedLocation={selectedLocation}
                isLoading={isScheduleLoading}
              />
            </div>

            {/* Right Column - Location Picker */}
            <div className="bg-white/90 backdrop-blur p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={selectedLocation || undefined}
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
                  {isLocationSaving ? "Saving..." : "Save Location"}
                </button>
              </div>
            </div>
          </div>
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

export default DriverScheduling;
