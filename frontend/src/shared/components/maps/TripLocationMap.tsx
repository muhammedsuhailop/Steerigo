import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "./types/maps.type";
import { getRouteGeometry } from "@/shared/utils/routingHelper";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface TripLocationMapProps {
  pickupLocation: Location | null;
  dropLocation: Location | null;
  tripType: "oneway" | "roundtrip";
}

// Create custom marker icon
const createCustomMarker = (color: string, label: string) => {
  return L.divIcon({
    html: `
      <div class="relative">
        <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 8.836 16 24 16 24s16-15.164 16-24C32 7.163 24.837 0 16 0z" 
                fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="15" r="6" fill="white"/>
        </svg>
        <div class="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs font-bold" style="color: ${color};">
          ${label}
        </div>
      </div>
    `,
    className: "custom-trip-marker",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });
};

// Map updater component
const MapUpdater: React.FC<{
  pickupLocation: Location | null;
  dropLocation: Location | null;
  tripType: "oneway" | "roundtrip";
}> = ({ pickupLocation, dropLocation, tripType }) => {
  const map = useMap();

  useEffect(() => {
    const updateMap = async () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      const bounds: L.LatLngBoundsExpression = [];

      if (pickupLocation) {
        const pickupMarker = L.marker(
          [pickupLocation.latitude, pickupLocation.longitude],
          {
            icon: createCustomMarker("#10b981", "P"),
          },
        ).addTo(map);

        pickupMarker.bindPopup(`
          <div class="p-2">
            <p class="font-semibold text-sm">Pickup Location</p>
            <p class="text-xs text-gray-600 mt-1">${pickupLocation.address}</p>
          </div>
        `);

        bounds.push([pickupLocation.latitude, pickupLocation.longitude]);
      }

      if (tripType === "oneway" && dropLocation) {
        const dropMarker = L.marker(
          [dropLocation.latitude, dropLocation.longitude],
          {
            icon: createCustomMarker("#ef4444", "D"),
          },
        ).addTo(map);

        dropMarker.bindPopup(`
          <div class="p-2">
            <p class="font-semibold text-sm">Drop Location</p>
            <p class="text-xs text-gray-600 mt-1">${dropLocation.address}</p>
          </div>
        `);

        bounds.push([dropLocation.latitude, dropLocation.longitude]);

        // Fetch real route
        if (pickupLocation) {
          const route = await getRouteGeometry(
            [pickupLocation.latitude, pickupLocation.longitude],
            [dropLocation.latitude, dropLocation.longitude],
          );

          L.polyline(route, {
            color: "#3b82f6",
            weight: 4,
            opacity: 0.9,
          }).addTo(map);
        }
      }

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    updateMap();
  }, [pickupLocation, dropLocation, tripType, map]);

  return null;
};

const TripLocationMap: React.FC<TripLocationMapProps> = ({
  pickupLocation,
  dropLocation,
  tripType,
}) => {
  const center: [number, number] = pickupLocation
    ? [pickupLocation.latitude, pickupLocation.longitude]
    : [11.2815, 75.8436];

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater
          pickupLocation={pickupLocation}
          dropLocation={dropLocation}
          tripType={tripType}
        />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000] text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="font-medium">Pickup</span>
        </div>
        {tripType === "oneway" && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium">Drop</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripLocationMap;
