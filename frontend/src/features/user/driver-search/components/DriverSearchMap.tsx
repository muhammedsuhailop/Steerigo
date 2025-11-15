import React, { useCallback, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaStar, FaPhone } from "react-icons/fa";
import { GiDuration } from "react-icons/gi";
import type { Driver, Location } from "../types/driverSearch.types";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface DriverSearchMapProps {
  drivers: Driver[];
  userLocation: Location;
  searchRadius: number;
  onDriverSelect?: (driver: Driver) => void;
}

// Custom user location marker icon
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg">
      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd"/>
      </svg>
    </div>`,
    className: "user-location-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Custom driver marker icon
const createDriverMarkerIcon = (rating: number) => {
  const ratingColor =
    rating >= 4.5
      ? "#10b981"
      : rating >= 4
      ? "#3b82f6"
      : rating >= 3.5
      ? "#f59e0b"
      : "#ef4444";

  return L.divIcon({
    html: `<div class="flex flex-col items-center">
      <div class="relative">
        <svg class="w-8 h-8" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2))" fill="${ratingColor}" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
        <span class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full border border-white">
          ${rating.toFixed(1)}
        </span>
      </div>
    </div>`,
    className: "driver-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Map controller to handle map interactions
const MapController: React.FC<{
  center: [number, number];
  radius: number;
  onMapReady?: () => void;
}> = ({ center, radius, onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 14);
    onMapReady?.();
  }, [map, center, onMapReady]);

  return null;
};

const DriverSearchMap: React.FC<DriverSearchMapProps> = ({
  drivers,
  userLocation,
  searchRadius,
  onDriverSelect,
}) => {
  const mapContainerStyle = {
    width: "100%",
    height: "500px",
  };

  const centerPosition: [number, number] = [
    userLocation.latitude,
    userLocation.longitude,
  ];

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={centerPosition}
        zoom={14}
        style={mapContainerStyle}
        className="z-10"
      >
        {/* Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map Controller */}
        <MapController center={centerPosition} radius={searchRadius} />

        {/* User Location Marker */}
        <Marker
          position={centerPosition}
          icon={createUserLocationIcon()}
          title="Your Location"
        >
          <Popup>
            <div className="text-sm font-semibold">Your Search Location</div>
            <div className="text-xs text-gray-600">{userLocation.address}</div>
          </Popup>
        </Marker>

        {/* Driver Markers */}
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            position={[
              driver.currentLocation.latitude,
              driver.currentLocation.longitude,
            ]}
            icon={createDriverMarkerIcon(driver.rating)}
            title={driver.name}
            eventHandlers={{
              click: () => onDriverSelect?.(driver),
            }}
          >
            <Popup maxWidth={300}>
              <div className="w-full">
                {/* Driver Name and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-gray-900">
                    {driver.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 w-3 h-3" />
                    <span className="text-sm font-semibold text-gray-700">
                      {driver.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="mb-2 text-xs text-gray-600">
                  <p>
                    {driver.bodyType} • {driver.gearType}
                  </p>
                  <p>{driver.totalRides} rides</p>
                </div>

                {/* Distance and ETA */}
                <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-gray-600">Distance</div>
                    <div className="font-semibold text-gray-900">
                      {driver.distance.value.toFixed(1)} {driver.distance.unit}
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-gray-600">ETA</div>
                    <div className="font-semibold text-gray-900">
                      {driver.eta.value} {driver.eta.unit}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      driver.availabilityStatus === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {driver.availabilityStatus}
                  </span>
                </div>

                {/* Contact and Book Button */}
                <button
                  onClick={() => onDriverSelect?.(driver)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded transition"
                >
                  Select Driver
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DriverSearchMap;
