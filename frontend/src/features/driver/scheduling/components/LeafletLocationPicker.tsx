import React, { useEffect, useRef } from "react";
import L from "leaflet";

interface LeafletLeafletLocationPickerProps {
  map?: L.Map | null;
  position: { lat: number; lng: number };
  onClick?: (marker: L.Marker) => void;
  color?: string; // hex or css color
  label?: string;
}

const createMarkerContent = (color = "#2563eb", label?: string) => {
  const content = document.createElement("div");
  content.className = "custom-marker";

  content.innerHTML = `
    <style>
      .custom-marker { position: relative; display:flex; align-items:center; justify-content:center; }
      .marker-pin {
        width: 32px; height: 32px;
        border-radius: 50% 50% 50% 0;
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1);
        border: 3px solid white;
      }
      .marker-pin::before {
        content: '';
        width: 12px; height: 12px;
        margin: 7px 0 0 7px;
        background: white; position: absolute; border-radius: 50%;
      }
      .marker-pulse {
        position: absolute;
        width: 40px; height: 40px; border-radius: 50%;
        background: ${color}33;
        animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; z-index:-1;
      }
      @keyframes pulse {
        0%,100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 0.1; transform: scale(1.5); }
      }
      .marker-label {
        position: absolute; bottom: -32px; left: 50%; transform: translateX(-50%);
        background: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight:600;
        color:#374151; white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;
      }
    </style>
    <div class="marker-pulse"></div>
    <div class="marker-pin"></div>
    ${label ? `<div class="marker-label">${label}</div>` : ""}
  `;
  return content;
};

const LeafletLocationPicker: React.FC<LeafletLeafletLocationPickerProps> = ({
  map,
  position,
  onClick,
  color = "#2563eb",
  label,
}) => {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create custom HTML icon
    const customIcon = L.divIcon({
      html: createMarkerContent(color, label).innerHTML,
      className: "custom-marker-wrapper",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Create marker
    const marker = L.marker([position.lat, position.lng], {
      icon: customIcon,
      draggable: false,
      title: label || "Location",
    }).addTo(map);

    // Add click listener
    if (onClick) {
      marker.on("click", () => onClick(marker));
    }

    markerRef.current = marker;

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, color, label, onClick]);

  // Update position when it changes
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([position.lat, position.lng]);
    }
  }, [position]);

  return null;
};

export default LeafletLocationPicker;
