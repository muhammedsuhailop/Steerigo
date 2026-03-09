import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Location } from "./types/maps.type";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getRouteGeometry } from "@/shared/utils/routingHelper";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LiveTrackingMapProps {
  pickupLocation: Location;
  dropLocation: Location;
  driverLocation?: {
    lat: number;
    lng: number;
    bearing: number;
  } | null;
}

// MARKERS

const pickupIcon = L.divIcon({
  html: `<div class="w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const dropIcon = L.divIcon({
  html: `<div class="w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const vehicleIcon = (bearing: number) =>
  L.divIcon({
    html: `
      <div style="transform: rotate(${bearing}deg); transition: transform .35s ease;">
        <svg width="34" height="34" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="white" stroke="#2563eb" stroke-width="6"/>
          <path d="M50 18 L32 70 L50 58 L68 70 Z" fill="#2563eb"/>
        </svg>
      </div>
    `,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

// AUTO FIT BOUNDS

const MapAutoFit: React.FC<{
  pickup: Location;
  drop: Location;
}> = ({ pickup, drop }) => {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;

    const bounds = L.latLngBounds([
      [pickup.latitude, pickup.longitude],
      [drop.latitude, drop.longitude],
    ]);

    map.fitBounds(bounds, { padding: [70, 70] });

    fitted.current = true;
  }, [pickup, drop, map]);

  return null;
};

// DRIVER MARKER

const DriverMarker: React.FC<{
  location: { lat: number; lng: number; bearing: number };
}> = ({ location }) => {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!markerRef.current) return;

    markerRef.current.setLatLng([location.lat, location.lng]);
  }, [location]);

  return (
    <Marker
      ref={(ref) => {
        markerRef.current = ref;
      }}
      position={[location.lat, location.lng]}
      icon={vehicleIcon(location.bearing)}
      zIndexOffset={1000}
    />
  );
};

// MAIN COMPONENT

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  pickupLocation,
  dropLocation,
  driverLocation,
}) => {
  const [route, setRoute] = useState<LatLngTuple[]>([]);

  const fallbackPath = useMemo<LatLngTuple[]>(
    () => [
      [pickupLocation.latitude, pickupLocation.longitude],
      [dropLocation.latitude, dropLocation.longitude],
    ],
    [pickupLocation, dropLocation],
  );

  // Fetch real road route

  useEffect(() => {
    const fetchRoute = async () => {
      const geometry = await getRouteGeometry(
        [pickupLocation.latitude, pickupLocation.longitude],
        [dropLocation.latitude, dropLocation.longitude],
      );

      setRoute(geometry as LatLngTuple[]);
    };

    fetchRoute();
  }, [pickupLocation, dropLocation]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      <MapContainer
        center={[pickupLocation.latitude, pickupLocation.longitude]}
        zoom={14}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />

        <MapAutoFit pickup={pickupLocation} drop={dropLocation} />

        <Polyline
          positions={route.length ? route : fallbackPath}
          pathOptions={{
            color: "#2563eb",
            weight: 5,
            opacity: 0.9,
          }}
        />

        <Marker
          position={[pickupLocation.latitude, pickupLocation.longitude]}
          icon={pickupIcon}
        />

        <Marker
          position={[dropLocation.latitude, dropLocation.longitude]}
          icon={dropIcon}
        />

        {driverLocation && <DriverMarker location={driverLocation} />}
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur border border-gray-200 shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-semibold text-gray-600">Live</span>
      </div>
    </div>
  );
};

export default LiveTrackingMap;
