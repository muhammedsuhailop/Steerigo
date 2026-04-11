import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMap } from "react-icons/fa";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";
import { Alert } from "@/shared/components/ui/Alert";
import MapLocationInput from "@/shared/components/maps";
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
import type { RideRequestError } from "../types/rideRequest.types";

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedDriverForRequest, setSelectedDriverForRequest] =
    useState<Driver | null>(null);
  const [requestedDriverIds, setRequestedDriverIds] = useState<Set<string>>(
    new Set(),
  );

  const [searchNearbyDrivers] = useSearchNearbyDriversMutation();

  const { startAutoRequest, cancel } = useAutoRideRequest({
    onSuccess: (rideId: string) => {
      window.location.href = `/ride/${rideId}`;
    },
  });

  const {
    sendRequest,
    isLoading: isRequestLoading,
    error: requestError,
    reset: resetRequest,
  } = useRideRequest({
    formData: currentFormData,
    estimatedFare,
    requestGroupId,
    onSuccess: () => {
      if (selectedDriverForRequest) {
        setSuccessMessage(
          `Request sent to ${selectedDriverForRequest.name}. You'll be notified once they respond.`,
        );
        setSelectedDriverForRequest(null);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    },
    onError: () => {
      if (selectedDriverForRequest) {
        setRequestedDriverIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedDriverForRequest.id);
          return newSet;
        });
      }
    },
  });

  const handleFormChange = (formData: TripFormData) =>
    setCurrentFormData(formData);

  const handleManualSearch = async (formData: TripFormData) => {
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
      setRequestedDriverIds(new Set());

      const newId = generateMongoObjectId();
      dispatch(setRequestGroupId(newId));

      const rideStartDateTime = `${formData.rideStartDate}T${formData.rideStartTime}:00.000Z`;

      const response = await searchNearbyDrivers({
        latitude: formData.pickupLocation.latitude,
        longitude: formData.pickupLocation.longitude,
        searchDate: rideStartDateTime,
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
            rideStartDateTime: rideStartDateTime,
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

  const handleAutoRequestSubmit = (formData: TripFormData) => {
    const newId = generateMongoObjectId();
    dispatch(setRequestGroupId(newId));
    startAutoRequest(formData, newId);
  };

  const handleDriverSelect = useCallback(
    async (driver: Driver) => {
      if (requestedDriverIds.has(driver.id)) return;
      setRequestedDriverIds((prev) => new Set(prev).add(driver.id));
      setSelectedDriverForRequest(driver);
      await sendRequest(driver);
    },
    [sendRequest, requestedDriverIds],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Driver
          </h1>
          <p className="text-gray-600">
            Search for available drivers or let us find one for you.
          </p>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-6">
            <Alert type="success" onClose={() => setSuccessMessage(null)}>
              <p className="font-semibold">{successMessage}</p>
            </Alert>
          </div>
        )}

        {requestError && (
          <div className="mb-6">
            <Alert type="danger" onClose={resetRequest}>
              <p className="font-semibold">Request Failed</p>
              <p className="text-sm">{requestError.message}</p>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                pickupAddress={
                  searchCriteria?.pickupLocation?.address || "Unknown"
                }
                error={apiError}
                onDriverSelect={handleDriverSelect}
                onDriverCall={(d) => (window.location.href = `tel:${d.mobile}`)}
                requestedDriverIds={requestedDriverIds}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMap className="text-gray-600" />
                <span>Trip Preview</span>
              </h3>

              <div className="h-80 rounded-lg overflow-hidden mb-4 border border-gray-200">
                <TripLocationMap
                  pickupLocation={currentFormData?.pickupLocation || null}
                  dropLocation={currentFormData?.dropLocation || null}
                  tripType={currentFormData?.tripType || "oneway"}
                />
              </div>

              {currentFormData && (
                <div className="space-y-3 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-bold">
                      {currentFormData.bodyType} ({currentFormData.gearType})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-bold">
                      {currentFormData.timeRequired} hrs
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Search Session Overlay */}
      {sessionStatus === "SEARCHING" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white px-8 py-7 shadow-2xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
            </div>

            <h3 className="text-base font-semibold text-gray-900">
              {progress && progress.currentIndex > 0
                ? "Finding another nearby driver..."
                : "Searching for nearby drivers..."}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {progress?.message ||
                "We're notifying drivers in your area. This usually takes less than a minute."}
            </p>

            {progress && progress.totalCandidates > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-gray-900 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${((progress.currentIndex + 1) / progress.totalCandidates) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-medium text-gray-500">
                  Attempt {progress.currentIndex + 1} of{" "}
                  {progress.totalCandidates}
                </span>
              </div>
            )}

            <button
              onClick={cancel}
              className="mt-6 text-sm font-medium text-rose-600 hover:underline"
            >
              Cancel Request
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DriverSearchPage;
