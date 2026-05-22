import React, { useCallback, useState } from "react";
import { FaMap, FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";
import TripLocationMap from "@/shared/components/maps/TripLocationMap";
import LocationSearchInput from "@/shared/components/maps/LocationSearchInput";
import FutureRideSearchForm from "../components/FutureRideSearchForm";
import FutureRideSuccessCard from "../components/FutureRideSuccessCard";
import { useScheduleRide } from "../hooks/useScheduleRide";
import { Location } from "@/shared/types/ride.types";
import { TripFormData } from "../types/driverSearch.types";

const generateMongoObjectId = (): string => {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, "0");

  const randomBytes = crypto.getRandomValues(new Uint8Array(8));

  const randomPart = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return timestamp + randomPart;
};

const FutureRideSearchPage: React.FC = () => {
  const {
    performSchedule,
    cancelSchedule,
    isLoading,
    isCancelling: isCancellingSchedule,
    lastResponse,
    acceptedRide,
    isExpired,
    isAllRejected,
    reset,
  } = useScheduleRide();

  const hasNoDriversInResponse =
    lastResponse?.success && lastResponse?.data?.totalDriversNotified === 0;

  const [currentFormData, setCurrentFormData] = useState<TripFormData | null>(
    null,
  );

  const [pickup, setPickup] = useState<Location | null>(null);

  const [drop, setDrop] = useState<Location | null>(null);

  const [activeSearchType, setActiveSearchType] = useState<
    "pickup" | "drop" | null
  >(null);

  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const handleFormChange = useCallback(
    (formData: TripFormData) => {
      if (isExpired || isAllRejected || hasNoDriversInResponse) {
        reset();
      }

      setCurrentFormData(formData);
    },
    [isExpired, isAllRejected, hasNoDriversInResponse, reset],
  );

  const handleLocationSelect = (location: Location | null): void => {
    if (activeSearchType === "pickup") {
      setPickup(location);
    } else {
      setDrop(location);
    }

    if (location) {
      setActiveSearchType(null);
    }
  };

  const handleClearLocation = (type: "pickup" | "drop"): void => {
    if (type === "pickup") {
      setPickup(null);
    } else {
      setDrop(null);
    }
  };

  const handleScheduleSubmit = async (
    formData: TripFormData,
  ): Promise<void> => {
    const requestGroupId = generateMongoObjectId();

    await performSchedule(formData, requestGroupId);
  };

  const handleCancelRequest = async () => {
    const activeGroupId = lastResponse?.data?.requestGroupId;
    if (!activeGroupId) return;

    await cancelSchedule(activeGroupId);
  };

  const shouldLockForm =
    !!lastResponse?.success &&
    !acceptedRide &&
    !isExpired &&
    !isAllRejected &&
    !hasNoDriversInResponse;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Schedule Future Ride
          </h1>

          <p className="text-gray-600">
            Book your ride in advance and wait for driver confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* FORM */}
            <div
              className={`bg-white rounded-xl shadow-lg p-4 border border-gray-200 transition ${
                shouldLockForm
                  ? "pointer-events-none opacity-70 select-none"
                  : ""
              }`}
            >
              <FutureRideSearchForm
                onSubmit={handleScheduleSubmit}
                onChange={handleFormChange}
                externalPickup={pickup}
                externalDrop={drop}
                onOpenLocationSearch={setActiveSearchType}
                onClearLocation={handleClearLocation}
                isLoading={isLoading || shouldLockForm}
              />
            </div>

            {/* SUCCESS CARD */}
            {lastResponse?.success && (
              <FutureRideSuccessCard
                response={lastResponse}
                formData={currentFormData}
                onCancelRequest={handleCancelRequest}
                isCancelling={isCancellingSchedule}
                isExpired={isExpired}
                isAllRejected={isAllRejected}
              />
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4 h-fit border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMap className="text-gray-600" />

                <span>Trip Preview</span>
              </h3>

              {currentFormData?.pickupLocation ||
              currentFormData?.dropLocation ? (
                <div className="h-80 rounded-lg overflow-hidden mb-4 border border-gray-200">
                  <TripLocationMap
                    pickupLocation={currentFormData?.pickupLocation || null}
                    dropLocation={currentFormData?.dropLocation || null}
                    tripType={currentFormData?.tripType || "oneway"}
                  />
                </div>
              ) : (
                <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border border-dashed border-gray-300">
                  <div className="text-center">
                    <FaMapMarkerAlt className="mx-auto text-gray-400 mb-2 text-3xl" />

                    <p className="text-sm text-gray-600 font-medium">
                      Select locations to see them on the map
                    </p>
                  </div>
                </div>
              )}

              {/* SUMMARY */}
              {currentFormData && (
                <div className="space-y-3 text-sm">
                  {/* PICKUP */}
                  {currentFormData.pickupLocation && (
                    <div className="py-2 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-green-600" />

                        <span className="text-gray-600 font-medium">
                          Pickup
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 break-words">
                        {currentFormData.pickupLocation.address}
                      </p>

                      <p className="text-xs mt-1 text-gray-500 flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-600" />

                        {currentFormData.rideStartDate}

                        <span className="mx-1">•</span>

                        <FaClock className="text-gray-600" />

                        {currentFormData.rideStartTime}
                      </p>
                    </div>
                  )}

                  {/* DROP */}
                  {currentFormData.dropLocation && (
                    <div className="py-2 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-red-600" />

                        <span className="text-gray-600 font-medium">Drop</span>
                      </div>

                      <p className="text-xs text-gray-700 break-words">
                        {currentFormData.dropLocation.address}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LOCATION MODAL */}
      {activeSearchType && !shouldLockForm && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative p-8">
            <button
              onClick={() => setActiveSearchType(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 p-2 rounded-full"
            >
              ✕
            </button>

            <LocationSearchInput
              label={`Search ${
                activeSearchType === "pickup" ? "Pickup" : "Drop"
              } Point`}
              value={activeSearchType === "pickup" ? pickup : drop}
              onChange={handleLocationSelect}
              placeholder="Start typing address..."
              required
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FutureRideSearchPage;
