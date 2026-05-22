import React, { useState, useCallback, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGeocoding } from "../hooks/useNominatimGeocoding";
import LeafletLocationPicker from "./LeafletLocationPicker";
import type { Location } from "../types/scheduling.types";
import { FaSearch, FaLocationArrow } from "react-icons/fa";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LeafletMarkerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
}

interface SearchSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

// Map Controller Component - handles map interactions
const MapController: React.FC<{
  selectedPosition: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
}> = ({ selectedPosition, onMapClick, mapRef }) => {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (selectedPosition) {
      map.setView([selectedPosition.lat, selectedPosition.lng], 15);
    }
  }, [selectedPosition, map]);

  return selectedPosition ? (
    <LeafletLocationPicker
      map={map}
      position={{ lat: selectedPosition.lat, lng: selectedPosition.lng }}
    />
  ) : null;
};

const LeafletMarker: React.FC<LeafletMarkerProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const { getCoordinatesFromAddress, getAddressFromCoordinates } =
    useGeocoding();

  const mapRef = useRef<L.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Position state
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(
    initialLocation
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : null,
  );

  const [address, setAddress] = useState<string>(
    initialLocation?.address || "",
  );
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Center when initialLocation changes
  useEffect(() => {
    if (mapRef.current && initialLocation) {
      const center: [number, number] = [
        initialLocation.latitude,
        initialLocation.longitude,
      ];
      mapRef.current.setView(center, 15);
      setSelectedPosition({
        lat: initialLocation.latitude,
        lng: initialLocation.longitude,
      });
      setAddress(initialLocation.address);
    }
  }, [initialLocation]);

  // Map click handler -> reverse geocode and notify parent
  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setSelectedPosition({ lat, lng });
      setShowSuggestions(false);
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
    },
    [getAddressFromCoordinates, onLocationSelect],
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
        setShowSuggestions(false);
        setIsLoadingAddress(true);

        // Pan map
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 15);
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
          "Unable to get your current location. Please select manually on the map.",
        );
      },
    );
  }, [getAddressFromCoordinates, onLocationSelect]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            "User-Agent": "SteeriGo-App/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce API calls - wait 500ms before fetching
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 500);
  };

  const handleSelectSuggestion = async (suggestion: SearchSuggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);

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
      setAddress(suggestion.display_name);
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        address: suggestion.display_name,
      });
    } finally {
      setIsLoadingAddress(false);
    }

    // Center map on selected location
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15);
    }
  };

  // Handle search form submission (Enter key)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (suggestions.length > 0) {
      // If there are suggestions, select the first one
      handleSelectSuggestion(suggestions[0]);
    } else if (searchQuery.trim()) {
      // Try to search if no suggestions
      try {
        const coords = await getCoordinatesFromAddress(searchQuery);
        const lat = coords.lat;
        const lng = coords.lng;

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
          setAddress(searchQuery);
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: searchQuery,
          });
        } finally {
          setIsLoadingAddress(false);
        }
      } catch (error) {
        console.error("Search failed:", error);
        alert("Location not found. Please try a different search term.");
      }
    }

    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const centerPosition: [number, number] = selectedPosition
    ? [selectedPosition.lat, selectedPosition.lng]
    : [defaultCenter.lat, defaultCenter.lng];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select Location</h2>

      <div className="flex flex-col sm:flex-row gap-3 items-center relative z-40">
        <div className="flex-1 flex gap-2 items-center w-full relative">
          {/* Search Form with Suggestions */}
          <form onSubmit={handleSearch} className="w-full relative">
            <div className="flex items-center w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-3 text-gray-500">
                <FaSearch />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() =>
                  searchQuery.length >= 2 &&
                  suggestions.length > 0 &&
                  setShowSuggestions(true)
                }
                aria-label="Search for a location"
                placeholder="Search for a location"
                className="w-full px-3 py-2 text-sm focus:outline-none"
                autoComplete="off"
              />
              {isSearching && (
                <div className="px-3 text-gray-400">
                  <span className="animate-spin">⟳</span>
                </div>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition flex flex-col"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {suggestion.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {suggestion.display_name
                        .split(",")
                        .slice(1)
                        .join(",")
                        .trim()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Current location button on the right for larger screens */}
        <div className="flex-shrink-0">
          <button
            onClick={getCurrentLocation}
            type="button"
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

      <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm relative z-0">
        <MapContainer
          center={centerPosition}
          zoom={12}
          style={mapContainerStyle}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <MapController
            selectedPosition={selectedPosition}
            onMapClick={handleMapClick}
            mapRef={mapRef}
          />
        </MapContainer>
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
        Start typing to see suggestions, click on the map, or use your device
        location.
      </p>
    </div>
  );
};

export default LeafletMarker;
