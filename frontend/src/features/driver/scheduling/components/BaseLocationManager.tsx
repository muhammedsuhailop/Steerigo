import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import LeafletMarker from "./LeafletMarker";
import { Alert } from "@/shared/components/ui/Alert";
import { useUpdateBaseLocationMutation } from "../services/schedulingApi";
import type { Location, BaseLocation } from "../types/scheduling.types";
import { errorHandler } from "@/shared/utils";

interface BaseLocationManagerProps {
  driverId: string | null;
  initialBaseLocation?: BaseLocation;
  onLocationUpdated: (newLocation: BaseLocation) => void;
}

const BaseLocationManager: React.FC<BaseLocationManagerProps> = ({
  driverId,
  initialBaseLocation,
  onLocationUpdated,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "danger";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const [updateBaseLocation, { isLoading }] = useUpdateBaseLocationMutation();

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const showAlert = (message: string, type: "success" | "danger") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 5000);
  };

  const handleSaveLocation = async () => {
    if (!driverId) {
      showAlert("Driver profile not loaded. Please try again.", "danger");
      return;
    }
    if (!selectedLocation) {
      showAlert("Please select a base location first.", "danger");
      return;
    }

    try {
      const newBaseLocation = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: selectedLocation.address,
      };

      await updateBaseLocation({
        driverId,
        baseLocation: newBaseLocation,
      }).unwrap();

      onLocationUpdated(newBaseLocation);

      showAlert("Base location updated successfully!", "success");
    } catch (error: unknown) {
      console.error("Failed to save base location:", error);

      const parsedError = errorHandler.parseApiError(error);

      showAlert(errorHandler.getUserMessage(parsedError), "danger");
    }
  };

  // Convert BaseLocation to Location format for LeafletMarker
  const initialMapLocation = initialBaseLocation
    ? {
        latitude: initialBaseLocation.latitude,
        longitude: initialBaseLocation.longitude,
        address: initialBaseLocation.address || "",
      }
    : undefined;

  return (
    <div className="bg-white/90 backdrop-blur p-6 rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FaMapMarkerAlt className="text-indigo-500" />
          Base Location
        </h3>

        <p className="text-sm text-slate-500">
          Set your base location to receive scheduled ride requests in your
          preferred operating area.
        </p>
      </div>

      {alert.show && (
        <div className="mb-4">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      )}

      <LeafletMarker
        onLocationSelect={handleLocationSelect}
        initialLocation={initialMapLocation}
      />

      <div className="mt-5">
        <button
          onClick={handleSaveLocation}
          disabled={!selectedLocation || isLoading || !driverId}
          className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
            !selectedLocation || isLoading || !driverId
              ? "bg-indigo-300 text-white cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
          }`}
        >
          <FaMapMarkerAlt size={18} />
          {isLoading ? "Saving Base Location..." : "Update Base Location"}
        </button>
      </div>
    </div>
  );
};

export default BaseLocationManager;
