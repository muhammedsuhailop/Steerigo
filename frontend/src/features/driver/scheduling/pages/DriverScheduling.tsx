import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaLocationArrow } from "react-icons/fa";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
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
import {
  Location,
  ScheduleFormData,
  AvailabilityData,
  DriverStatusResponse,
  DriverAvailabilityStatus,
  BaseLocation,
} from "../types/scheduling.types";
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
import LeafletMarker from "../components/LeafletMarker";
import BaseLocationManager from "../components/BaseLocationManager";
import CurrentLocationManager from "../components/CurrentLocationManager";
import { errorHandler } from "@/shared/utils";

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
    null,
  );

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [driverId, setDriverId] = useState<string | null>(null);

  const [currentStatus, setCurrentStatus] = useState<DriverAvailabilityStatus>(
    DriverAvailabilityStatus.OFFLINE,
  );

  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const [availabilityDataFull, setAvailabilityDataFull] =
    useState<AvailabilityData | null>(null);

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

  const [updateLocation, { isLoading: isLocationSaving }] =
    useUpdateLocationMutation();
  const [updateSchedule, { isLoading: isScheduleLoading }] =
    useUpdateScheduleMutation();
  const [updateStatus, { isLoading: isStatusLoading }] =
    useUpdateStatusMutation();

  const {
    data: driverStatusResponse,
    isLoading: isStatusLoading1,
    isError: isDriverStatusError,
    error: driverStatusError,
  } = useGetDriverStatusQuery();

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

  useEffect(() => {
    if (driverStatusResponse?.data) {
      const availability: AvailabilityData = driverStatusResponse.data;

      dispatch(setAvailability(availability));

      const firstTimeSlot =
        availability.recurringSchedule?.dailyRecurrence?.timeSlots?.[0];
      let defaultFromDate: Date | null = null;
      let defaultTillDate: Date | null = null;

      if (firstTimeSlot) {
        const validityStart = new Date(
          availability.recurringSchedule.validity.startDate,
        );
        const [hours, minutes] = firstTimeSlot.startTime.split(":").map(Number);
        const [endHours, endMinutes] = firstTimeSlot.endTime
          .split(":")
          .map(Number);

        defaultFromDate = new Date(validityStart);
        defaultFromDate.setHours(hours, minutes, 0, 0);

        defaultTillDate = new Date(validityStart);
        defaultTillDate.setHours(endHours, endMinutes, 0, 0);
      }

      setDefaultFormData({
        availableFrom: defaultFromDate,
        availableTill: defaultTillDate,
        location: {
          latitude: availability.currentLocation.latitude,
          longitude: availability.currentLocation.longitude,
          address: availability.currentLocation.address,
        },
      });

      setDriverId(availability.driverId);

      setAvailabilityDataFull(availability);

      setAvailabilityData({
        availableFrom: availability.recurringSchedule?.validity?.startDate,
        availableTill: availability.recurringSchedule?.validity?.endDate,
        currentLocation: {
          latitude: availability.currentLocation.latitude,
          longitude: availability.currentLocation.longitude,
          address: availability.currentLocation.address,
        },
      });

      setCurrentStatus(
        availability.availabilityStatus as DriverAvailabilityStatus,
      );

      setSelectedLocation({
        latitude: availability.currentLocation.latitude,
        longitude: availability.currentLocation.longitude,
        address: availability.currentLocation.address,
      });

      setHasAvailability(true);
      return;
    }

    const parsedError = driverStatusError
      ? errorHandler.parseApiError(driverStatusError)
      : null;

    const serverMessage = parsedError
      ? errorHandler.getUserMessage(parsedError)
      : driverStatusResponse?.message || "";

    const is404ByStatus = parsedError?.code === "NOT_FOUND";

    if (is404ByStatus) {
      setHasAvailability(false);
      setAvailabilityDataFull(null);
      setAvailabilityData({});

      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      const endTime = new Date(now);
      endTime.setHours(endTime.getHours() + 8);

      setDefaultFormData({
        availableFrom: now,
        availableTill: endTime,
        location: null,
      });

      const friendly =
        serverMessage ||
        "No existing availability found. Please create a new schedule.";
      showAlert(friendly, "success");
      return;
    }

    if (isDriverStatusError) {
      showAlert(
        serverMessage || "Unable to load availability. Please try again later.",
        "danger",
      );
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

  const handleBaseLocationUpdated = (newBaseLocation: BaseLocation) => {
    if (availabilityDataFull) {
      setAvailabilityDataFull({
        ...availabilityDataFull,
        baseLocation: newBaseLocation,
      });
    }
  };

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

      if (availabilityDataFull) {
        setAvailabilityDataFull({
          ...availabilityDataFull,
          currentLocation: {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            address: selectedLocation.address,
            lastUpdatedAt: new Date().toISOString(),
            accuracy: 10,
          },
        });
      }

      showAlert("Location saved successfully!", "success");
    } catch (error: unknown) {
      console.error("Failed to save location:", error);
      const parsedError = errorHandler.parseApiError(error);

      showAlert(errorHandler.getUserMessage(parsedError), "danger");
    }
  };

  const handleScheduleSubmit = async (
    data: ScheduleFormData,
  ): Promise<void> => {
    if (!data.currentLocation) {
      showAlert("Please select a location on the map", "danger");
      return;
    }

    if (!data.validityStartDate || !data.validityEndDate) {
      showAlert("Please select validity start and end dates", "danger");
      return;
    }

    if (data.daysOfWeek.length === 0) {
      showAlert("Please select at least one day", "danger");
      return;
    }

    if (data.timeSlots.length === 0) {
      showAlert("Please set time slots", "danger");
      return;
    }

    try {
      await updateSchedule({
        daysOfWeek: data.daysOfWeek,
        timeSlots: data.timeSlots,
        validityStartDate: data.validityStartDate,
        validityEndDate: data.validityEndDate,
        notes: data.notes,
        currentLocation: data.currentLocation,
      }).unwrap();

      setHasAvailability(true);

      const minutesToDate = (minutes: number, baseDate: string): Date => {
        const date = new Date(baseDate);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        date.setHours(hours, mins, 0, 0);
        return date;
      };

      const firstTimeSlot = data.timeSlots[0];
      if (firstTimeSlot) {
        setDefaultFormData({
          availableFrom: minutesToDate(
            firstTimeSlot.startTime,
            data.validityStartDate,
          ),
          availableTill: minutesToDate(
            firstTimeSlot.endTime,
            data.validityStartDate,
          ),
          location: data.currentLocation,
        });
      }

      setAvailabilityData({
        availableFrom: data.validityStartDate,
        availableTill: data.validityEndDate,
        currentLocation: data.currentLocation,
      });

      const minutesToTimeString = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const pad = (n: number): string => String(n).padStart(2, "0");
        return `${pad(hours)}:${pad(mins)}`;
      };

      if (availabilityDataFull) {
        setAvailabilityDataFull({
          ...availabilityDataFull,
          recurringSchedule: {
            ...availabilityDataFull.recurringSchedule,
            validity: {
              ...availabilityDataFull.recurringSchedule.validity,
              startDate: data.validityStartDate,
              endDate: data.validityEndDate,
              isCurrentlyValid: false,
            },
            dailyRecurrence: {
              ...availabilityDataFull.recurringSchedule.dailyRecurrence,
              daysOfWeek: data.daysOfWeek,
              timeSlots: data.timeSlots.map((slot) => ({
                startTime: minutesToTimeString(slot.startTime),
                endTime: minutesToTimeString(slot.endTime),
                durationMinutes: slot.endTime - slot.startTime,
              })),
            },
            notes: data.notes,
          },
          currentLocation: {
            latitude: data.currentLocation.latitude,
            longitude: data.currentLocation.longitude,
            address: data.currentLocation.address,
            lastUpdatedAt: new Date().toISOString(),
            accuracy: 10,
          },
        });
      }

      setShowScheduleForm(false);

      showAlert("Schedule updated successfully!", "success");
    } catch (error: unknown) {
      console.error("Failed to update schedule:", error);
      const parsedError = errorHandler.parseApiError(error);
      showAlert(errorHandler.getUserMessage(parsedError), "danger");
    }
  };

  const handleStatusChange = async (status: DriverAvailabilityStatus) => {
    try {
      await updateStatus({ driverId: driverId || "", status }).unwrap();
      setCurrentStatus(status);
      showAlert("Status updated successfully!", "success");
    } catch (error: unknown) {
      console.error("Failed to update status:", error);

      const parsedError = errorHandler.parseApiError(error);

      showAlert(errorHandler.getUserMessage(parsedError), "danger");
    }
  };

  const handleDisabledStatusClick = () => {
    showAlert(
      "Please create an availability schedule first before changing your status.",
      "danger",
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
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
            {/* LEFT SECTION  */}
            <div className="space-y-6 min-w-0">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Location Management
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Manage your base and current operating locations.
                  </p>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5 p-5">
                  {/* Base Location */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    {driverId && (
                      <BaseLocationManager
                        driverId={driverId}
                        initialBaseLocation={availabilityDataFull?.baseLocation}
                        onLocationUpdated={handleBaseLocationUpdated}
                      />
                    )}
                  </div>

                  {/* Current Location */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    <CurrentLocationManager
                      currentLocation={availabilityData.currentLocation}
                      selectedLocation={selectedLocation}
                      isLocationSaving={isLocationSaving}
                      onLocationSelect={handleLocationSelect}
                      onSaveLocation={handleSaveLocation}
                    />
                  </div>
                </div>
                {/* Schedule Form */}
                {showScheduleForm && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SECTION  */}
            <div className="space-y-6 xl:sticky xl:top-24">
              {/* Status Card */}
              <StatusCard
                availabilityStatus={currentStatus}
                availabilityData={availabilityDataFull}
                onShowAlert={showAlert}
              />

              {/* Status Toggle */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <StatusToggle
                  currentStatus={currentStatus}
                  onStatusChange={handleStatusChange}
                  isLoading={isStatusLoading}
                  hasAvailability={hasAvailability}
                  onDisabledClick={handleDisabledStatusClick}
                />
              </div>

              {/* Empty Availability Info */}
              {!hasAvailability && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <IoInformationCircleOutline className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />

                    <div>
                      <p className="font-semibold text-amber-900">
                        No Availability Found
                      </p>

                      <p className="text-sm text-amber-700 mt-1">
                        Create your availability schedule to start receiving
                        ride requests.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle Button */}
              <button
                onClick={() => setShowScheduleForm((prev) => !prev)}
                className={`
          w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl
          font-semibold text-sm transition-all duration-200
          ${
            showScheduleForm
              ? "bg-slate-800 text-white hover:bg-slate-900"
              : "bg-slate-700 text-white hover:bg-slate-800"
          }
        `}
              >
                {showScheduleForm ? (
                  <>
                    <FaCaretUp size={16} />
                    <span>Hide Schedule</span>
                  </>
                ) : (
                  <>
                    <FaCaretDown size={16} />
                    <span>Add / Edit Schedule</span>
                  </>
                )}
              </button>
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
