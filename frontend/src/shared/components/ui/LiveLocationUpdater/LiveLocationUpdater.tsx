import React, { useState } from "react";
import {
  FaLocationArrow,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useUpdateLocationMutation } from "../../../../features/driver/scheduling/services/schedulingApi";
import { useGeocoding } from "../../../../features/driver/scheduling/hooks/useNominatimGeocoding";

interface LiveLocationUpdaterProps {
  driverId: string;
}

type UpdaterStatus =
  | "idle"
  | "locating"
  | "geocoding"
  | "saving"
  | "success"
  | "error";

const LiveLocationUpdater: React.FC<LiveLocationUpdaterProps> = ({
  driverId,
}) => {
  const [status, setStatus] = useState<UpdaterStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [updateLocation] = useUpdateLocationMutation();
  const { getAddressFromCoordinates } = useGeocoding();

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      setStatus("error");
      return;
    }

    setStatus("locating");
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setStatus("geocoding");
          const address = await getAddressFromCoordinates(lat, lng);

          setStatus("saving");
          await updateLocation({
            driverId,
            currentLocation: {
              latitude: lat,
              longitude: lng,
              address: address,
            },
          }).unwrap();

          setStatus("success");
          setTimeout(() => setStatus("idle"), 4000);
        } catch (error: any) {
          console.error("Failed to update location:", error);
          setErrorMessage(
            error?.message || "Failed to update location. Please try again.",
          );
          setStatus("error");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrorMessage(
          "Unable to retrieve your device location. Please check your permissions.",
        );
        setStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const getButtonContent = () => {
    switch (status) {
      case "locating":
        return (
          <>
            <span className="animate-spin">⟳</span> Getting GPS...
          </>
        );
      case "geocoding":
        return (
          <>
            <span className="animate-spin">⟳</span> Fetching Address...
          </>
        );
      case "saving":
        return (
          <>
            <span className="animate-spin">⟳</span> Updating Profile...
          </>
        );
      case "success":
        return (
          <>
            <FaCheckCircle /> Location Updated!
          </>
        );
      case "error":
        return (
          <>
            <FaLocationArrow /> Retry Update
          </>
        );
      default:
        return (
          <>
            <FaLocationArrow /> Update Live Location
          </>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FaLocationArrow className="text-blue-500" />
          Live Location
        </h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Update your current device location to receive the most accurate
          nearby ride requests.
        </p>

        {status === "error" && (
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            <FaExclamationCircle className="text-sm flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-start sm:justify-end mt-auto">
        <button
          onClick={handleUpdateLocation}
          disabled={
            status === "locating" ||
            status === "geocoding" ||
            status === "saving" ||
            status === "success"
          }
          className={`w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-[0.98] ${
            status === "success"
              ? "bg-emerald-100 text-emerald-700 cursor-default"
              : status === "error"
                ? "bg-red-600 text-white hover:bg-red-700 shadow-md"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          } disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {getButtonContent()}
        </button>
      </div>
    </div>
  );
};

export default LiveLocationUpdater;
