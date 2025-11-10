import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useGeocoding } from "../hooks/useGeocoding";
import AdvancedMarker from "./AdvancedMarker";
import type { Location } from "../types/scheduling.types";
import { FaSearch, FaLocationArrow, FaMapMarkerAlt } from "react-icons/fa";

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

  // position state (lat/lng)
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

  // center when initialLocation changes
  useEffect(() => {
    if (mapRef.current && initialLocation) {
      const center = {
        lat: initialLocation.latitude,
        lng: initialLocation.longitude,
      };
      mapRef.current.panTo(center);
      mapRef.current.setZoom(15);
    }
  }, [initialLocation]);

  // map click handler -> reverse geocode and notify parent
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

  // Use device geolocation
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelectedPosition({ lat, lng });
        setIsLoadingAddress(true);

        // pan map
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
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
          setAddress("Unable to fetch address");
        } finally {
          setIsLoadingAddress(false);
        }
      },
      (err) => {
        console.error("Error getting current location:", err);
        alert(
          "Unable to get your current location. Please select manually on the map."
        );
      }
    );
  }, [getAddressFromCoordinates, onLocationSelect]);

  // onLoad and onUnmount for the map
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (initialLocation) {
        const center = {
          lat: initialLocation.latitude,
          lng: initialLocation.longitude,
        };
        map.panTo(center);
        map.setZoom(15);
      }
    },
    [initialLocation]
  );

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // autocomplete wiring
  const onAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = async () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry?.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const newAddress = place.formatted_address || "";
    setSelectedPosition({ lat, lng });
    setAddress(newAddress);

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }

    onLocationSelect({ latitude: lat, longitude: lng, address: newAddress });
  };

  // Loading and error UI
  if (loadError) {
    return (
      <div className="text-red-600">
        Error loading Google Maps. Please check your API key and Map ID.
      </div>
    );
  }

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select Location</h2>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 flex gap-2 items-center">
          {/* Search + icon */}
          <div className="flex items-center w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-3 text-gray-500">
              <FaSearch />
            </div>

            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                aria-label="Search for a location"
                placeholder="Search for a location"
                className="w-full px-3 py-2 text-sm focus:outline-none"
              />
            </Autocomplete>
          </div>
        </div>

        {/* Current location button on the right for larger screens */}
        <div className="flex-shrink-0">
          <button
            onClick={getCurrentLocation}
            title="Use current device location"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm"
          >
            <FaLocationArrow className="text-gray-700" />
            <span className="hidden sm:inline text-sm text-gray-700">
              Use device
            </span>
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={selectedPosition}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            mapId: import.meta.env.VITE_GOOGLE_MAP_ID || "",
          }}
        >
          {selectedPosition && mapRef.current && (
            <AdvancedMarker position={selectedPosition} map={mapRef.current} />
          )}
        </GoogleMap>
      </div>

      {/* Address Display */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Selected Address
        </p>
        {isLoadingAddress ? (
          <p className="text-gray-600 italic">Loading address...</p>
        ) : (
          <p className="text-gray-800">
            {address || "Search or click on the map to select a location"}
          </p>
        )}
      </div>

      <p className="text-xs text-gray-600">
        Search, click on the map, or use your device location. Click{" "}
        <strong>Update Location</strong> to confirm the currently selected location.
      </p>
    </div>
  );
};

export default LocationPicker;
