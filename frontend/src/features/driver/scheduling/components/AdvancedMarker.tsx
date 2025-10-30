import { useEffect, useRef, useState } from "react";

interface AdvancedMarkerProps {
  map: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  onClick?: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  color?: string;
  label?: string;
}

const AdvancedMarker: React.FC<AdvancedMarkerProps> = ({
  map,
  position,
  onClick,
  color = "#2563eb",
  label,
}) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const [markerLibrary, setMarkerLibrary] =
    useState<google.maps.MarkerLibrary | null>(null);

  const createMarkerContent = (): HTMLElement => {
    const content = document.createElement("div");
    content.className = "custom-marker";

    content.innerHTML = `
      <style>
        .custom-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .marker-pin {
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
                      0 2px 4px rgba(0, 0, 0, 0.1);
          border: 3px solid white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .marker-pin::before {
          content: '';
          width: 12px;
          height: 12px;
          margin: 7px 0 0 7px;
          background: white;
          position: absolute;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .marker-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${color}33;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          z-index: -1;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.5);
          }
        }
        
        .custom-marker:hover .marker-pin {
          transform: rotate(-45deg) scale(1.15);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2),
                      0 3px 6px rgba(0, 0, 0, 0.15);
        }
        
        .marker-label {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
      </style>
      
      <div class="marker-pulse"></div>
      <div class="marker-pin"></div>
      ${label ? `<div class="marker-label">${label}</div>` : ""}
    `;

    return content;
  };

  useEffect(() => {
    const loadMarkerLibrary = async () => {
      try {
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        setMarkerLibrary({
          AdvancedMarkerElement,
        } as google.maps.MarkerLibrary);
      } catch (error) {
        console.error("Error loading marker library:", error);
      }
    };

    if (!markerLibrary) {
      loadMarkerLibrary();
    }
  }, [markerLibrary]);

  useEffect(() => {
    if (!map || !markerLibrary) return;

    if (!markerRef.current) {
      const { AdvancedMarkerElement } = markerLibrary;

      markerRef.current = new AdvancedMarkerElement({
        map,
        position,
        content: createMarkerContent(),
        gmpClickable: true,
        title: label || "Location",
      });

      if (onClick) {
        markerRef.current.addListener("click", () => {
          if (markerRef.current) {
            onClick(markerRef.current);
          }
        });
      }
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, [map, markerLibrary, onClick, color, label]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.position = position;
    }
  }, [position]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.content = createMarkerContent();
    }
  }, [color, label]);

  return null;
};

export default AdvancedMarker;
