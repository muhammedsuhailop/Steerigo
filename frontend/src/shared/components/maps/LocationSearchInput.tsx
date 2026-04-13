import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaSearch,
  FaCrosshairs,
  FaMapMarkerAlt,
  FaTimes,
  FaMap,
} from "react-icons/fa";
import { Location, SearchSuggestion } from "./types/maps.type";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore - Leaflet internals
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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

const MapClickHandler: React.FC<{
  onMapClick: (lat: number, lng: number) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick(e.latlng.lat, e.latlng.lng),
  });
  return null;
};

interface LocationSearchInputProps {
  label?: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  placeholder?: string;
  required?: boolean;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  label = "Select Location",
  value,
  onChange,
  placeholder = "Search address or city...",
  required = false,
}) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mapPosition, setMapPosition] = useState({
    lat: value?.latitude || 9.9312,
    lng: value?.longitude || 76.2673,
  });

  const NOMINATIM_BASE_URL = import.meta.env.VITE_NOMINATIM_BASE_URL;

  useEffect(() => {
    if (!value && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.log("Using Kochi fallback as location access was denied.");
        },
      );
    }
  }, [value]);

  const fetchAddress = async (lat: number, lon: number): Promise<string> => {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "SteeriGo-App/1.0",
        },
      },
    );
    const data = await response.json();
    return data.display_name || "Selected Location";
  };

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(
          searchQuery,
        )}&limit=5&addressdetails=1`,
        { headers: { "User-Agent": "SteeriGo-App/1.0" } },
      );
      const data: SearchSuggestion[] = await response.json();
      setSuggestions(data);
      setIsDropdownOpen(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(val), 500);
  };

  const handleSuggestionClick = (item: SearchSuggestion) => {
    const loc = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
    };
    onChange(loc);
    setMapPosition({ lat: loc.latitude, lng: loc.longitude });
    setQuery("");
    setIsDropdownOpen(false);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const address = await fetchAddress(latitude, longitude);
          onChange({ latitude, longitude, address });
          setMapPosition({ lat: latitude, lng: longitude });
        } catch {
          onChange({
            latitude,
            longitude,
            address: "Current Location (approx)",
          });
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        alert("Unable to retrieve location. Please check your permissions.");
        setIsLoading(false);
      },
    );
  };

  const handleMapSelection = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const address = await fetchAddress(lat, lng);
      onChange({ latitude: lat, longitude: lng, address });
      setMapPosition({ lat, lng });
      setShowMapModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-3" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="text-xs font-semibold text-gray-500 tracking-wide">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <div className="flex items-center bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <FaSearch className="ml-4 text-gray-400 text-sm" />

          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="flex-1 px-3 py-3 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="mr-2 p-2 rounded-xl hover:bg-blue-50 transition"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaCrosshairs className="text-blue-600 text-sm" />
            )}
          </button>
        </div>

        {/* Suggestions */}
        {isDropdownOpen && suggestions.length > 0 && (
          <div className="absolute z-[1001] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
            {suggestions.map((item) => (
              <button
                key={item.place_id}
                onClick={() => handleSuggestionClick(item)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-blue-50 transition"
              >
                <FaMapMarkerAlt className="mt-1 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 line-clamp-2">
                  {item.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setShowMapModal(true)}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-full flex items-center gap-1 transition"
        >
          <FaMap /> Select on map
        </button>

        <button
          onClick={handleGetCurrentLocation}
          className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full flex items-center gap-1 transition"
        >
          <FaCrosshairs /> Current location
        </button>
      </div>

      {/* Selected Location */}
      {value && (
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 flex items-center justify-center bg-blue-600 rounded-xl">
              <FaMapMarkerAlt className="text-white text-xs" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {value.address}
              </p>
              <p className="text-[11px] text-gray-500 font-mono">
                {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          <button
            onClick={() => onChange(null)}
            className="p-2 text-gray-400 hover:text-rose-500 transition"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-white">
              <h3 className="text-sm font-semibold text-gray-700">
                Select Location
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            {/* Map */}
            <div className="h-[420px] w-full">
              <MapContainer
                center={[mapPosition.lat, mapPosition.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler onMapClick={handleMapSelection} />
                <LocationMarker position={mapPosition} />
              </MapContainer>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 py-3 border-t">
              Tap anywhere on map to select location
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
