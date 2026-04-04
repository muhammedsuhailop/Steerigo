import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "./types/maps.type";
import { formatDuration } from "@/shared/utils/formatTime";
import {
  FaLocationArrow,
  FaClock,
  FaCrosshairs,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { getRouteData } from "@/shared/utils/routingHelper";

interface NavigationStep {
  maneuver: { instruction: string };
  name: string;
  distance: number;
}

interface LiveNavigationMapProps {
  pickupLocation: Location;
  dropLocation: Location;
  driverLocation: { lat: number; lng: number; bearing: number } | null;
  status: string;
  showInstructions?: boolean;
}

const MapController: React.FC<{
  center: LatLngTuple;
  isFollowing: boolean;
  setIsFollowing: (val: boolean) => void;
}> = ({ center, isFollowing, setIsFollowing }) => {
  const map = useMap();
  useEffect(() => {
    if (isFollowing) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, isFollowing, map]);

  useMapEvents({
    dragstart: () => setIsFollowing(false),
    zoomstart: () => setIsFollowing(false),
  });

  return null;
};

const LiveNavigationMap: React.FC<LiveNavigationMapProps> = ({
  pickupLocation,
  dropLocation,
  driverLocation,
  status,
  showInstructions = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const [instructions, setInstructions] = useState<NavigationStep[]>([]);
  const [eta, setEta] = useState<string>("");
  const [isFollowing, setIsFollowing] = useState(true);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const getDestination = useCallback(() => {
    return status === "Accepted" || status === "Arrived"
      ? { lat: pickupLocation.latitude, lng: pickupLocation.longitude }
      : { lat: dropLocation.latitude, lng: dropLocation.longitude };
  }, [status, pickupLocation, dropLocation]);

  useEffect(() => {
    const fetchDetailedRoute = async () => {
      if (!driverLocation) return;

      const dest = getDestination();
      const data = await getRouteData(
        [driverLocation.lat, driverLocation.lng],
        [dest.lat, dest.lng],
      );

      if (data) {
        setRoute(data.coordinates as LatLngTuple[]);
        setInstructions(data.instructions);
        setEta(formatDuration(data.duration));
      }
    };

    fetchDetailedRoute();
    const interval = setInterval(fetchDetailedRoute, 10000);
    return () => clearInterval(interval);
  }, [driverLocation?.lat, driverLocation?.lng, getDestination]);

  const currentCenter: LatLngTuple = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : [pickupLocation.latitude, pickupLocation.longitude];

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden transition-all duration-300 border border-gray-200 shadow-inner bg-slate-100 ${
        isFullscreen ? "h-screen rounded-none" : "h-full rounded-[28px]"
      }`}
    >
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-[1001] 
             bg-slate-900/60 backdrop-blur-md 
             border border-white/10 text-white 
             p-3.5 rounded-2xl shadow-2xl 
             hover:bg-slate-900/80 hover:scale-105
             active:scale-95 transition-all duration-300 
             flex items-center justify-center"
      >
        {isFullscreen ? (
          <FaCompress className="text-lg drop-shadow-md" />
        ) : (
          <FaExpand className="text-lg drop-shadow-md" />
        )}
      </button>

      {showInstructions && instructions.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-sm bg-blue-600/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <FaLocationArrow className="text-lg rotate-45" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase opacity-70">
              Next Step
            </p>
            <p className="text-sm font-bold leading-tight">
              {instructions[0].maneuver.instruction}
            </p>
          </div>
        </div>
      )}

      {!isFollowing && (
        <button
          onClick={() => setIsFollowing(true)}
          className="absolute bottom-24 right-4 z-[1000] bg-white text-blue-600 p-3 rounded-full shadow-xl border border-gray-200"
        >
          <FaCrosshairs className="text-lg" />
        </button>
      )}

      <MapContainer
        center={currentCenter}
        zoom={17}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapController
          center={currentCenter}
          isFollowing={isFollowing}
          setIsFollowing={setIsFollowing}
        />

        <Polyline
          positions={route}
          pathOptions={{ color: "#2563eb", weight: 7, opacity: 0.8 }}
        />

        {driverLocation && (
          <Marker
            position={[driverLocation.lat, driverLocation.lng]}
            icon={L.divIcon({
              html: `
          <div style="transform: rotate(${driverLocation.bearing}deg); transition: transform 0.4s ease-out;">
            <div class="relative flex items-center justify-center">
              <div class="absolute w-10 h-10 bg-blue-600/20 rounded-full animate-ping"></div>
              <svg width="40" height="40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="white" style="filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));"/>
                <path d="M50 15 L30 75 L50 60 L70 75 Z" fill="#2563eb"/>
              </svg>
            </div>
          </div>`,
              className: "",
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            })}
            zIndexOffset={1000}
          />
        )}

        <Marker
          position={[pickupLocation.latitude, pickupLocation.longitude]}
          icon={L.divIcon({
            html: `<div class="w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-lg"></div>`,
            className: "",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
        />

        <Marker
          position={[dropLocation.latitude, dropLocation.longitude]}
          icon={L.divIcon({
            html: `<div class="w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg"></div>`,
            className: "",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
        />
      </MapContainer>

      <div
        className="absolute bottom-4 left-4 right-4 z-[1000] 
                bg-white/70 backdrop-blur-xl border border-white/40 
                shadow-[0_15px_35px_rgba(0,0,0,0.1)] rounded-[24px] 
                px-4 py-3 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-inner">
            <FaClock className="text-lg" />
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] font-black text-slate-500/80 uppercase tracking-widest leading-none mb-1">
              ETA
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-black text-slate-900 leading-none tracking-tight">
                {eta ? eta.split(" ")[0] : "..."}
              </p>
              {eta && (
                <p className="text-[10px] font-bold text-slate-500 lowercase">
                  {eta.split(" ")[1]}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-900/5 rounded-lg border border-slate-900/5">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "Started"
                  ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              }`}
            />
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
              To {status === "Started" ? "Drop-off" : "Pickup"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNavigationMap;
