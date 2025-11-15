import React, { useState, useCallback, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { useGeocoding } from "./useNominatimGeocoding";
import { Location } from "./types/maps.type";

// Fix Leaflet default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapLocationInputProps {
  label: string;
  value: Location | null;
  onChange: (location: Location) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

interface SearchSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Custom marker component
const LocationMarker: React.FC<{
  position: { lat: number; lng: number };
  color?: string;
}> = ({ position, color = "#ef4444" }) => {
  const map = useMap();

  useEffect(() => {
    const marker = L.divIcon({
      html: `
        <div class="relative">
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 8.836 16 24 16 24s16-15.164 16-24C32 7.163 24.837 0 16 0z" 
                  fill="${color}" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="15" r="6" fill="white"/>
          </svg>
        </div>
      `,
      className: "custom-location-marker",
      iconSize: [32, 40],
      iconAnchor: [16, 40],
    });

    const leafletMarker = L.marker([position.lat, position.lng], {
      icon: marker,
    }).addTo(map);

    map.setView([position.lat, position.lng], 13);

    return () => {
      leafletMarker.remove();
    };
  }, [position, map, color]);

  return null;
};

// Map click handler
const MapClickHandler: React.FC<{
  onMapClick: (lat: number, lng: number) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapLocationInput: React.FC<MapLocationInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Search or click on map to select location",
  required = false,
  disabled = false,
}) => {
  const { getAddressFromCoordinates } = useGeocoding();
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number }>({
    lat: value?.latitude || 11.2815,
    lng: value?.longitude || 75.8436,
  });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle map click
  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setMapPosition({ lat, lng });
      try {
        const address = await getAddressFromCoordinates(lat, lng);
        onChange({
          latitude: lat,
          longitude: lng,
          address,
        });
        setShowMap(false);
      } catch (error) {
        console.error("Error getting address:", error);
      }
    },
    [getAddressFromCoordinates, onChange]
  );

  // Search for locations
  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const NOMINATIM_BASE_URL = import.meta.env.VITE_NOMINATIM_BASE_URL;
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            "User-Agent": "SteeriGo-App/1.0",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchLocations(query);
    }, 500);
  };

  // Select suggestion
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const location: Location = {
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: suggestion.display_name,
    };
    onChange(location);
    setMapPosition({
      lat: location.latitude,
      lng: location.longitude,
    });
    setSearchQuery("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Display selected location */}
      {value && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <FaMapMarkerAlt className="text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {value.address}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
            </p>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange(null as any)}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <FaTimes />
            </button>
          )}
        </div>
      )}

      {/* Search input */}
      {!disabled && (
        <div className="relative" ref={suggestionsRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          {/* Search suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 transition border-b last:border-b-0"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.display_name.split(",")}
                  </div>
                  <div className="text-xs text-gray-600">
                    {suggestion.display_name
                      .split(",")
                      .slice(1)
                      .join(",")
                      .trim()}
                  </div>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      )}

      {/* Map toggle button */}
      {!disabled && (
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showMap ? "Hide Map" : "Select on Map"}
        </button>
      )}

      {/* Map modal */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Location on Map
              </h3>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="h-96">
              <MapContainer
                center={[mapPosition.lat, mapPosition.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={handleMapClick} />
                {mapPosition && <LocationMarker position={mapPosition} />}
              </MapContainer>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Click anywhere on the map to select a location
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLocationInput;
