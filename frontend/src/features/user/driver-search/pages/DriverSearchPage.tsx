import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DriverSearchForm from "../components/DriverSearchForm";
import TripLocationMap from "@/shared/components/maps/TripLocationMap";
import DriverSearchResults from "../components/DriverSearchResults";
import {
  TripFormData,
  SearchNearbyDriversPayload,
} from "../types/driverSearch.types";
import { useSearchNearbyDriversMutation } from "../services/driverSearchApi";
import {
  setDrivers,
  setSearchCriteria,
  setTotalFound,
  setSearchedAt,
  setLoading,
  setError,
} from "../store/driverSearchSlice";
import {
  selectDrivers,
  selectSearchCriteria,
  selectTotalFound,
  selectIsLoading,
} from "../store/driverSearchSlice";

const DriverSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // mutation
  const [searchNearbyDrivers, { isLoading: mutationLoading }] =
    useSearchNearbyDriversMutation();

  // local state to preview trip on the small map
  const [currentFormData, setCurrentFormData] = useState<TripFormData | null>(
    null
  );

  // read results from redux so DriverSearchResults can be reused
  const drivers = useSelector(selectDrivers) ?? [];
  const searchCriteria = useSelector(selectSearchCriteria);
  const totalFound = useSelector(selectTotalFound) ?? 0;
  const isLoading = useSelector(selectIsLoading) ?? mutationLoading;

  // Handle form submission
  const handleFormSubmit = async (formData: TripFormData) => {
    setCurrentFormData(formData);

    if (!formData.pickupLocation) {
      alert("Please select a pickup location");
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Combine date and time into ISO string (safe)
      const rideDateTime = new Date(
        `${formData.rideStartDate}T${formData.rideStartTime}`
      ).toISOString();

      // Prepare payload
      const payload: SearchNearbyDriversPayload = {
        latitude: formData.pickupLocation.latitude,
        longitude: formData.pickupLocation.longitude,
        searchDate: rideDateTime,
        timeRequired: 60, // Default time required
        radiusKm: formData.searchRadiusKm,
        gearType: formData.gearType,
        bodyType: formData.bodyType,
        limit: 10,
        // include trip type if your backend supports it
        // rideType: formData.tripType,
      };

      // Call API
      const response = await searchNearbyDrivers(payload).unwrap();

      if (response?.success) {
        // Update Redux state
        dispatch(setDrivers(response.data.drivers ?? []));
        dispatch(
          setSearchCriteria({
            tripType: formData.tripType,
            pickupLocation: formData.pickupLocation,
            dropLocation: formData.dropLocation || undefined,
            rideStartDateTime: rideDateTime,
            searchRadiusKm: formData.searchRadiusKm,
            gearType: formData.gearType,
            bodyType: formData.bodyType,
          })
        );

        // support both response shapes (summary or data.summary)
        const total =
          response.data?.summary?.totalFound ?? response.data?.totalFound ?? 0;
        const searchedAt =
          response.data?.summary?.searchedAt ??
          response.data?.searchedAt ??
          null;

        dispatch(setTotalFound(total));
        if (searchedAt) dispatch(setSearchedAt(searchedAt));

        // Navigate to results page (keeps deep-link capability)
        navigate("/search/results");
      } else {
        const msg = response?.message ?? "No drivers found";
        dispatch(setError(msg));
        alert(msg);
      }
    } catch (error: any) {
      console.error("Search error:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to search drivers";
      dispatch(setError(errorMessage));
      alert(`Error: ${errorMessage}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Optional handler when user selects a driver from inline results
  const handleDriverSelect = (driver: any) => {
    console.log("Selected driver (inline):", driver);
  };

  const handleDriverCall = (driver: any) => {
    window.location.href = `tel:${driver.mobile}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Driver
          </h1>
          <p className="text-gray-600">
            Search for available drivers based on your trip requirements
          </p>
        </div>

        {/* Main Content  */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <DriverSearchForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </div>

          {/* Map Section  */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Trip Overview
              </h3>

              {currentFormData?.pickupLocation ||
              currentFormData?.dropLocation ? (
                <div className="h-96">
                  <TripLocationMap
                    pickupLocation={currentFormData?.pickupLocation ?? null}
                    dropLocation={currentFormData?.dropLocation ?? null}
                    tripType={currentFormData?.tripType ?? "oneway"}
                  />
                </div>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500 p-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm">
                      Select locations to see them on the map
                    </p>
                  </div>
                </div>
              )}

              {/* Trip Details Summary */}
              {currentFormData && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600">Trip Type:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {currentFormData.tripType === "oneway"
                        ? "One Way"
                        : "Round Trip"}
                    </span>
                  </div>

                  {currentFormData.pickupLocation && (
                    <div className="py-2 border-t border-gray-200">
                      <span className="text-gray-600 block mb-1">Pickup:</span>
                      <span className="font-medium text-gray-900 text-xs block">
                        {currentFormData.pickupLocation.address}
                      </span>
                    </div>
                  )}

                  {currentFormData.tripType === "oneway" &&
                    currentFormData.dropLocation && (
                      <div className="py-2 border-t border-gray-200">
                        <span className="text-gray-600 block mb-1">Drop:</span>
                        <span className="font-medium text-gray-900 text-xs block">
                          {currentFormData.dropLocation.address}
                        </span>
                      </div>
                    )}

                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600">Search Radius:</span>
                    <span className="font-medium text-gray-900">
                      {currentFormData.searchRadiusKm} km
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium text-gray-900">
                      {currentFormData.bodyType} ({currentFormData.gearType})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results*/}
        <div className="mt-8">
          <DriverSearchResults
            drivers={drivers}
            isLoading={isLoading}
            totalFound={totalFound}
            searchCriteria={
              searchCriteria
                ? {
                    location: searchCriteria.pickupLocation,
                    radiusKm: searchCriteria.searchRadiusKm,
                    filters: {
                      gearType: searchCriteria.gearType,
                      bodyType: searchCriteria.bodyType,
                    },
                  }
                : null
            }
            onDriverSelect={handleDriverSelect}
            onDriverCall={handleDriverCall}
            onClearSearch={() => {
              dispatch(setDrivers([]));
              dispatch(setSearchCriteria(null));
              dispatch(setTotalFound(0));
            }}
            initialViewMode="map"
          />
        </div>
      </div>
    </div>
  );
};

export default DriverSearchPage;
