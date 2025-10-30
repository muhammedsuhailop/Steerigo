import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useGeocoding } from "../hooks/useGeocoding";
import AdvancedMarker from "./AdvancedMarker";
import type { Location } from "../types/scheduling.types";

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

const libraries: "places"[] = ["places"];

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    version: "weekly",
    libraries,
  });

  const { getAddressFromCoordinates } = useGeocoding();
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [selectedPosition, setSelectedPosition] =
    useState<google.maps.LatLngLiteral>(
      initialLocation
        ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
        : defaultCenter
    );

  const [address, setAddress] = useState<string>(
    initialLocation?.address || ""
  );
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const handleMapClick = useCallback(
    async (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        setSelectedPosition({ lat, lng });
        setIsLoadingAddress(true);

        try {
          const newAddress = await getAddressFromCoordinates(lat, lng);
          setAddress(newAddress);

          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: newAddress,
          });
        } catch (error) {
          console.error("Error getting address:", error);
          setAddress("Unable to fetch address");
        } finally {
          setIsLoadingAddress(false);
        }
      }
    },
    [getAddressFromCoordinates, onLocationSelect]
  );

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setSelectedPosition({ lat, lng });
          setIsLoadingAddress(true);

          // Center map on current location
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
          }

          try {
            const newAddress = await getAddressFromCoordinates(lat, lng);
            setAddress(newAddress);

            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address: newAddress,
            });
          } catch (error) {
            console.error("Error getting address:", error);
          } finally {
            setIsLoadingAddress(false);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert(
            "Unable to get your current location. Please select manually on the map."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, [getAddressFromCoordinates, onLocationSelect]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const onAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newAddress = place.formatted_address || "";

        setSelectedPosition({ lat, lng });
        setAddress(newAddress);

        // Center map on selected place
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        }

        onLocationSelect({
          latitude: lat,
          longitude: lng,
          address: newAddress,
        });
      }
    }
  };

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        Error loading Google Maps. Please check your API key and Map ID.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Select Location</h3>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
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
          <span>Use Current Location</span>
        </button>
      </div>

      {/* Search Autocomplete Input */}
      <Autocomplete
        onLoad={onAutocompleteLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "in" }, // Restrict to India
          fields: ["formatted_address", "geometry", "name"],
        }}
      >
        <input
          type="text"
          placeholder="Search for a location..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </Autocomplete>

      <div className="rounded-lg overflow-hidden border border-gray-300 shadow-md">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={selectedPosition}
          onClick={handleMapClick}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
          }}
        >
          <AdvancedMarker map={mapRef.current} position={selectedPosition} />
        </GoogleMap>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0"
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
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Selected Address:
            </p>
            {isLoadingAddress ? (
              <p className="text-sm text-gray-500 italic">Loading address...</p>
            ) : (
              <p className="text-sm text-gray-900">
                {address || "Search or click on the map to select a location"}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 italic">
        Tip: Search for a location, click on the map, or use your current
        location. Then click "Save Location" to update.
      </p>
    </div>
  );
};

export default LocationPicker;
