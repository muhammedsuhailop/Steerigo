import React, { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCalendarAlt, FaClock, FaMap, FaMapMarkerAlt } from "react-icons/fa";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";
import TripLocationMap from "@/shared/components/maps/TripLocationMap";
import DriverSearchForm from "../components/DriverSearchForm";
import DriverSearchResults from "../components/DriverSearchResults";
import { useSearchNearbyDriversMutation } from "../services/driverSearchApi";
import {
  setDrivers,
  setEstimatedFare,
  setSearchCriteria,
  setTotalFound,
  setSearchedAt,
  setRequestGroupId,
  setLoading,
  setError,
  selectDrivers,
  selectEstimatedFare,
  selectSearchCriteria,
  selectIsLoading,
  selectError,
  selectTotalFound,
  selectRequestGroupId,
  selectSessionStatus,
  selectSearchProgress,
} from "../store/driverSearchSlice";
import { useRideRequest } from "../hooks/useRideRequest";
import { useAutoRideRequest } from "../hooks/useAutoRideRequest";
import type { TripFormData, Driver } from "../types/driverSearch.types";
import type { SearchModalState } from "../components/SearchStatusModal";
import SearchStatusModal from "../components/SearchStatusModal";

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

const DriverSearchPage: React.FC = () => {
  const dispatch = useDispatch();

  const drivers = useSelector(selectDrivers);
  const estimatedFare = useSelector(selectEstimatedFare);
  const searchCriteria = useSelector(selectSearchCriteria);
  const isLoading = useSelector(selectIsLoading);
  const apiError = useSelector(selectError);
  const totalFound = useSelector(selectTotalFound);
  const requestGroupId = useSelector(selectRequestGroupId);
  const sessionStatus = useSelector(selectSessionStatus);
  const progress = useSelector(selectSearchProgress);

  const [currentFormData, setCurrentFormData] = useState<TripFormData | null>(
    null,
  );

  const [hasSearched, setHasSearched] = useState(false);
  const [requestedDriverIds, setRequestedDriverIds] = useState<Set<string>>(
    new Set(),
  );

  const [modalState, setModalState] = useState<SearchModalState>(null);

  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchNearbyDrivers] = useSearchNearbyDriversMutation();

  const { startAutoRequest, cancel } = useAutoRideRequest({
    onSuccess: (rideId: string) => {
      setModalState("SUCCESS");

      modalTimerRef.current = setTimeout(() => {
        window.location.href = `/ride/${rideId}`;
      }, 2000);
    },

    onNoDriverFound: () => {
      setModalState("NO_DRIVER");

      modalTimerRef.current = setTimeout(() => {
        setModalState(null);
      }, 3000);
    },

    onCancelled: () => {
      setModalState(null);
      setRequestedDriverIds(new Set());
      dispatch(setError(null));
    },
  });

  const handleCloseModal = () => {
    setModalState(null);
  };

  const { sendRequest, isLoading: isRequestLoading } = useRideRequest({
    formData: currentFormData,
    estimatedFare,
    requestGroupId,
  });

  const handleFormChange = (formData: TripFormData) =>
    setCurrentFormData(formData);

  const handleManualSearch = async (formData: TripFormData) => {
    if (!formData.pickupLocation) {
      dispatch(setError("Pickup required"));
      return;
    }

    try {
      dispatch(setLoading(true));
      setHasSearched(true);
      setRequestedDriverIds(new Set());

      const newId = generateMongoObjectId();
      dispatch(setRequestGroupId(newId));

      const response = await searchNearbyDrivers({
        latitude: formData.pickupLocation.latitude,
        longitude: formData.pickupLocation.longitude,
        searchDate: new Date().toISOString(),
        timeRequired: formData.timeRequired,
        radiusKm: formData.searchRadiusKm,
        gearType: formData.gearType,
        bodyType: formData.bodyType,
        limit: 20,
      }).unwrap();

      if (response.success && response.data) {
        dispatch(setDrivers(response.data.drivers));
        dispatch(setEstimatedFare(response.data.estimatedFare));
        dispatch(setTotalFound(response.data.summary.totalFound));
        dispatch(setSearchedAt(response.data.summary.searchedAt));

        dispatch(
          setSearchCriteria({
            tripType: formData.tripType,
            pickupLocation: formData.pickupLocation,
            dropLocation: formData.dropLocation || undefined,
            rideStartDateTime: new Date().toISOString(),
            searchRadiusKm: formData.searchRadiusKm,
            gearType: formData.gearType,
            bodyType: formData.bodyType,
          }),
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAutoRequestSubmit = (formData: TripFormData) => {
    const newId = generateMongoObjectId();
    dispatch(setRequestGroupId(newId));

    setModalState("SEARCHING");

    startAutoRequest(formData, newId);
  };

  const handleDriverSelect = useCallback(
    async (driver: Driver) => {
      if (requestedDriverIds.has(driver.id)) return;

      setRequestedDriverIds((prev) => new Set(prev).add(driver.id));
      await sendRequest(driver);
    },
    [requestedDriverIds, sendRequest],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Driver
          </h1>
          <p className="text-gray-600">
            Search for available drivers or let us find one for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4 h-fit border border-gray-200">
              <DriverSearchForm
                onSubmit={handleManualSearch}
                onAutoRequest={handleAutoRequestSubmit}
                onChange={handleFormChange}
                isLoading={
                  isLoading || isRequestLoading || sessionStatus === "SEARCHING"
                }
              />
            </div>

            {hasSearched && (
              <DriverSearchResults
                drivers={drivers}
                estimatedFare={estimatedFare}
                totalFound={totalFound}
                searchRadius={searchCriteria?.searchRadiusKm || 0}
                pickupAddress={searchCriteria?.pickupLocation?.address || ""}
                error={apiError}
                onDriverSelect={handleDriverSelect}
                onDriverCall={(d) => (window.location.href = `tel:${d.mobile}`)}
                requestedDriverIds={requestedDriverIds}
              />
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4 h-fit border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMap className="text-gray-600" />
                <span>Trip Preview</span>
              </h3>

              {/* Live Map Display  */}
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

              {/* Trip Details Summary */}
              {currentFormData && (
                <div className="space-y-3 text-sm">
                  {/* Trip Type */}
                  {currentFormData.tripType === "roundtrip" && (
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <span className="text-gray-600 font-medium">
                        Trip Type:
                      </span>
                      <span className="font-bold text-gray-900">
                        Round Trip
                      </span>
                    </div>
                  )}

                  {/* Pickup Section */}
                  {currentFormData.pickupLocation && (
                    <div className="py-2 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-green-600" />
                        <span className="text-gray-600 font-medium">
                          Pickup
                        </span>
                      </div>

                      {/* Address */}
                      <p className="text-xs text-gray-700 break-words">
                        {currentFormData.pickupLocation.address}
                      </p>

                      {/* Date & Time */}
                      <p className="text-xs mt-1 text-gray-500 flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-600" />
                        {currentFormData.rideStartDate}

                        <span className="mx-1">•</span>

                        <FaClock className="text-gray-600" />
                        {currentFormData.rideStartTime}
                      </p>
                    </div>
                  )}

                  {/* Drop Section */}
                  {currentFormData.dropLocation && (
                    <div className="py-2 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-red-600" />
                        <span className="text-gray-600 font-medium">Drop</span>
                      </div>

                      {/* Address */}
                      <p className="text-xs text-gray-700 break-words">
                        {currentFormData.dropLocation.address}
                      </p>

                      {/* Drop Date/Time*/}
                      <p className="text-xs mt-1 text-gray-500 flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-600" />
                        {currentFormData.rideEndDate
                          ? currentFormData.rideEndDate
                          : currentFormData.rideStartDate}

                        <span className="mx-1">•</span>

                        <FaClock className="text-gray-600" />
                        {currentFormData.rideEndTime
                          ? currentFormData.rideEndTime
                          : currentFormData.rideStartTime}
                      </p>
                    </div>
                  )}

                  {/* Duration */}
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600 font-medium">
                      Required Duration:
                    </span>
                    <span className="font-bold text-gray-900">
                      {currentFormData.timeRequired * 60} mins
                    </span>
                  </div>

                  {/* Radius */}
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600 font-medium">
                      Search Radius:
                    </span>
                    <span className="font-bold text-gray-900">
                      {currentFormData.searchRadiusKm} km
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SearchStatusModal
        state={modalState}
        message={progress?.message}
        onCancel={cancel}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  );
};

export default DriverSearchPage;
