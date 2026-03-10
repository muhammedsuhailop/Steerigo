import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DriverSearchForm from "../components/DriverSearchForm";
import DriverSearchResults from "../components/DriverSearchResults";
import TripLocationMap from "@/shared/components/maps/TripLocationMap";
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
} from "../store/driverSearchSlice";
import type { TripFormData, Driver } from "../types/driverSearch.types";
import { useRideRequest } from "../hooks/useRideRequest";
import { Alert } from "@/shared/components/ui/Alert";
import type { RideRequestError } from "../types/rideRequest.types";
import { v4 as uuidv4 } from "uuid";

import {
  FaMap,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaCar,
} from "react-icons/fa";

import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";
import { useAutoRideRequest } from "../hooks/useAutoRideRequest";

const DriverSearchPage: React.FC = () => {
  const dispatch = useDispatch();
  const drivers = useSelector(selectDrivers);
  const estimatedFare = useSelector(selectEstimatedFare);
  const searchCriteria = useSelector(selectSearchCriteria);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const totalFound = useSelector(selectTotalFound);
  const requestGroupId = useSelector(selectRequestGroupId);
  const [localError, setLocalError] = useState<string | null>(null);

  const [searchNearbyDrivers] = useSearchNearbyDriversMutation();
  const [currentFormData, setCurrentFormData] = useState<TripFormData | null>(
    null,
  );
  const [hasSearched, setHasSearched] = useState(false);

  const { startAutoRequest, isWaiting, cancel } = useAutoRideRequest({
    onSuccess: (rideId) => {
      window.location.href = `/ride/${rideId}`;
    },
    onTimeout: () => {
      dispatch(
        setError("No drivers found. Please try increasing search radius."),
      );
    },
    onError: (msg) => dispatch(setError(msg)),
  });
  // Ride request state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedDriverForRequest, setSelectedDriverForRequest] =
    useState<Driver | null>(null);

  // Track requested driver IDs
  const [requestedDriverIds, setRequestedDriverIds] = useState<Set<string>>(
    new Set(),
  );

  // Ride request hook
  const {
    sendRequest,
    isLoading: isRequestLoading,
    error: requestError,
    reset: resetRequest,
  } = useRideRequest({
    formData: currentFormData,
    estimatedFare,
    requestGroupId,
    onSuccess: (requestId: string) => {
      if (selectedDriverForRequest) {
        setSuccessMessage(
          `Request sent to ${selectedDriverForRequest.name} successfully! You'll be notified once the driver responds.`,
        );
        setSelectedDriverForRequest(null);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
    },
    onError: (error: RideRequestError) => {
      console.error("Ride request error:", error);

      if (selectedDriverForRequest) {
        setRequestedDriverIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedDriverForRequest.id);
          return newSet;
        });
      }
    },
  });

  const handleFormChange = (formData: TripFormData) => {
    setCurrentFormData(formData);
  };

  const handleFormSubmit = async (formData: TripFormData) => {
    if (
      !formData.pickupLocation ||
      !formData.rideStartDate ||
      !formData.rideStartTime
    ) {
      dispatch(setError("Please fill in all required fields"));
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      setHasSearched(true);

      const newRequestGroupId = uuidv4();
      dispatch(setRequestGroupId(newRequestGroupId));

      // Clear requested drivers when doing a new search
      setRequestedDriverIds(new Set());

      // Combine date and time
      const rideStartDateTime = `${formData.rideStartDate}T${formData.rideStartTime}:00.000Z`;

      const payload = {
        latitude: formData.pickupLocation.latitude,
        longitude: formData.pickupLocation.longitude,
        searchDate: rideStartDateTime,
        timeRequired: formData.timeRequired,
        radiusKm: formData.searchRadiusKm,
        gearType: formData.gearType,
        bodyType: formData.bodyType,
        limit: 20,
      };

      const response = await searchNearbyDrivers(payload).unwrap();

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
            rideStartDateTime,
            searchRadiusKm: formData.searchRadiusKm,
            gearType: formData.gearType,
            bodyType: formData.bodyType,
          }),
        );
      }
    } catch (err: any) {
      dispatch(setError(err?.data?.message || "Failed to search for drivers"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDriverSelect = useCallback(
    async (driver: Driver) => {
      if (requestedDriverIds.has(driver.id)) {
        return;
      }

      setRequestedDriverIds((prev) => new Set(prev).add(driver.id));

      setSelectedDriverForRequest(driver);
      await sendRequest(driver);
    },
    [sendRequest, requestedDriverIds],
  );

  const handleDriverCall = (driver: Driver) => {
    window.location.href = `tel:${driver.mobile}`;
  };

  const handleDismissSuccess = useCallback(() => {
    setSuccessMessage(null);
    resetRequest();
  }, [resetRequest]);

  const handleDismissError = useCallback(() => {
    resetRequest();
    setSelectedDriverForRequest(null);
  }, [resetRequest]);

  const handleRetryRequest = useCallback(() => {
    if (selectedDriverForRequest) {
      sendRequest(selectedDriverForRequest);
    }
  }, [selectedDriverForRequest, sendRequest]);

  const handleAutoRequestSubmit = (formData: TripFormData) => {
    setLocalError(null);
    const newId = uuidv4();
    dispatch(setRequestGroupId(newId));
    startAutoRequest(formData, newId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main page container  */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Driver
          </h1>
          <p className="text-gray-600">
            Search for available drivers based on your trip requirements
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6">
            <Alert type="success" onClose={handleDismissSuccess}>
              <div className="space-y-2">
                <p className="font-semibold">Request Sent!</p>
                <p className="text-sm">{successMessage}</p>
              </div>
            </Alert>
          </div>
        )}

        {/* Error Alert for Ride Request */}
        {requestError && (
          <div className="mb-6">
            <Alert type="danger" onClose={handleDismissError}>
              <div className="space-y-2">
                <p className="font-semibold">Request Failed</p>
                <p className="text-sm">{requestError.message}</p>
                {selectedDriverForRequest && (
                  <button
                    onClick={handleRetryRequest}
                    className="mt-2 text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </Alert>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <DriverSearchForm
                onSubmit={handleFormSubmit}
                onAutoRequest={handleAutoRequestSubmit}
                onChange={handleFormChange}
                isLoading={isLoading || isRequestLoading}
              />
            </div>

            {/* Trip Preview small card  */}
            {currentFormData?.pickupLocation && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                  Trip Preview
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-20">Pickup:</span>
                    <span className="text-gray-900 truncate">
                      {currentFormData.pickupLocation.address}
                    </span>
                  </div>
                  {currentFormData.dropLocation && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-20">Drop:</span>
                      <span className="text-gray-900 truncate">
                        {currentFormData.dropLocation.address}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-20">Vehicle:</span>
                    <span className="text-gray-900">
                      {currentFormData.bodyType} ({currentFormData.gearType})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-20">Date & Time:</span>
                    <span className="text-gray-900">
                      {currentFormData.rideStartDate}{" "}
                      {currentFormData.rideStartTime}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {hasSearched && (
              <DriverSearchResults
                drivers={drivers}
                estimatedFare={estimatedFare}
                totalFound={totalFound}
                searchRadius={searchCriteria?.searchRadiusKm || 0}
                pickupAddress={
                  searchCriteria?.pickupLocation?.address || "Unknown location"
                }
                error={error}
                onDriverSelect={handleDriverSelect}
                onDriverCall={handleDriverCall}
                requestedDriverIds={requestedDriverIds}
              />
            )}
          </div>

          {/* Right Column  */}
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
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600 font-medium">Trip:</span>
                    <span className="font-bold text-gray-900">
                      {currentFormData.tripType === "oneway"
                        ? "One Way"
                        : "Round Trip"}
                    </span>
                  </div>

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
                    <span className="text-gray-600 font-medium">Duration:</span>
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

                  {/* Vehicle */}
                  <div className="py-2 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCar className="text-gray-600" />
                      <span className="text-gray-600 font-medium">Vehicle</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {currentFormData.bodyType} ({currentFormData.gearType})
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Loading Overlay */}
      {isRequestLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-900 font-medium">Sending request...</p>
            </div>
          </div>
        </div>
      )}

      {isWaiting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white px-8 py-7 shadow-2xl text-center">
            {/* Spinner */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
            </div>

            <h3 className="text-base font-semibold text-gray-900">
              Finding nearby drivers
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              We’re sending your request to drivers around you. This usually
              takes less than a minute.
            </p>

            <button
              onClick={cancel}
              className="mt-6 text-sm font-medium text-rose-600 hover:underline"
            >
              Cancel request
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default DriverSearchPage;
