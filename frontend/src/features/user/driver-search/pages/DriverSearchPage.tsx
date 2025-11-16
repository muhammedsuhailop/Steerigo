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

// react-icons (all gray themed)
import {
  FaMapMarkerAlt,
  FaClock,
  FaMap,
  FaUsers,
  FaSearch,
  FaCar as FaCarIcon,
} from "react-icons/fa";

const DriverSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // mutation
  const [searchNearbyDrivers, { isLoading: mutationLoading }] =
    useSearchNearbyDriversMutation();

  // Local state to preview trip on the map in REAL-TIME
  const [currentFormData, setCurrentFormData] = useState<TripFormData | null>(
    null
  );

  // read results from redux
  const drivers = useSelector(selectDrivers) ?? [];
  const searchCriteria = useSelector(selectSearchCriteria);
  const totalFound = useSelector(selectTotalFound) ?? 0;
  const isLoading = useSelector(selectIsLoading) ?? mutationLoading;

  // Called on every form change for live preview
  const handleFormChange = (formData: TripFormData) => {
    setCurrentFormData(formData);
  };

  // Handle form submission (search button click)
  const handleFormSubmit = async (formData: TripFormData) => {
    setCurrentFormData(formData);

    if (!formData.pickupLocation) {
      alert("Please select a pickup location");
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Combine date and time into ISO string
      const rideDateTime = new Date(
        `${formData.rideStartDate}T${formData.rideStartTime}`
      ).toISOString();

      // Prepare payload
      const payload: SearchNearbyDriversPayload = {
        latitude: formData.pickupLocation.latitude,
        longitude: formData.pickupLocation.longitude,
        searchDate: rideDateTime,
        timeRequired: formData.timeRequired * 60, // Convert hours to minutes
        radiusKm: formData.searchRadiusKm,
        gearType: formData.gearType,
        bodyType: formData.bodyType,
        limit: 10,
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

        const total = response.data?.summary?.totalFound ?? 0;
        const searchedAt = response.data?.summary?.searchedAt ?? null;
        dispatch(setTotalFound(total));
        if (searchedAt) dispatch(setSearchedAt(searchedAt));
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaCarIcon className="text-gray-700" />
          <span>Find Your Perfect Driver</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Search for available drivers based on your trip requirements
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Layout: Form (3/4) + Map Sidebar (1/4) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form Section - 3/4 width */}
          <div className="lg:col-span-3">
            <DriverSearchForm
              onSubmit={handleFormSubmit}
              onChange={handleFormChange}
              isLoading={isLoading}
            />
          </div>

          {/* Map Sidebar Section - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4 h-fit border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMap className="text-gray-600" />
                <span>Trip Preview</span>
              </h3>

              {/* Live Map Display */}
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
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600 font-medium">Trip:</span>
                    <span className="font-bold text-gray-900">
                      {currentFormData.tripType === "oneway"
                        ? "One Way"
                        : "Round Trip"}
                    </span>
                  </div>

                  {currentFormData.pickupLocation && (
                    <div className="py-2 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-gray-600" />
                        <span className="text-gray-600 font-medium">
                          Pickup
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 break-words">
                        {currentFormData.pickupLocation.address}
                      </p>
                    </div>
                  )}

                  {currentFormData.tripType === "oneway" &&
                    currentFormData.dropLocation && (
                      <div className="py-2 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <FaMapMarkerAlt className="text-gray-600" />
                          <span className="text-gray-600 font-medium">
                            Drop
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 break-words">
                          {currentFormData.dropLocation.address}
                        </p>
                      </div>
                    )}

                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600 font-medium">Radius:</span>
                    <span className="font-bold text-gray-900">
                      {currentFormData.searchRadiusKm} km
                    </span>
                  </div>

                  <div className="py-2 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUsers className="text-gray-600" />
                      <span className="text-gray-600 font-medium">Vehicle</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {currentFormData.bodyType} ({currentFormData.gearType})
                    </p>
                  </div>

                  <div className="py-2 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClock className="text-gray-600" />
                      <span className="text-gray-600 font-medium">
                        Date & Time
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {currentFormData.rideStartDate}{" "}
                      {currentFormData.rideStartTime}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section - Below form */}
        {searchCriteria && (
          <div className="mt-12">
            <DriverSearchResults
              onClearSearch={() => {
                dispatch(setDrivers([]));
                dispatch(setSearchCriteria(null));
                dispatch(setTotalFound(0));
              }}
              initialViewMode="map"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverSearchPage;
