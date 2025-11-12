import React, { useEffect, useRef } from "react";

interface AdvancedMarkerProps {
  map?: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  onClick?: (
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement
  ) => void;
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

// simple SVG icon for fallback classic Marker
const createSvgIconUrl = (color = "#2563eb") => {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${color}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>`
  );
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
};

const AdvancedMarker: React.FC<AdvancedMarkerProps> = ({
  map,
  position,
  onClick,
  color = "#2563eb",
  label,
}) => {
  const advRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const fallbackRef = useRef<google.maps.Marker | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  // store listeners so we can remove them reliably
  const advClickListenerRef = useRef<any | null>(null);
  const fallbackClickListenerRef = useRef<any | null>(null);

  useEffect(() => {
    // create content once for AdvancedMarkerElement
    contentRef.current = createMarkerContent(color, label);

    let isMounted = true;
    let importedAdvancedMarkerConstructor: any = null;

    const loadAndCreate = async () => {
      if (!map) return;

      try {
        const markerLib: any = (google.maps as any).importLibrary
          ? await (google.maps as any).importLibrary("marker")
          : null;

        importedAdvancedMarkerConstructor =
          markerLib?.AdvancedMarkerElement ?? null;

        if (importedAdvancedMarkerConstructor && isMounted) {
          // create AdvancedMarkerElement
          advRef.current = new importedAdvancedMarkerConstructor({
            map,
            position,
            content: contentRef.current,
            title: label || "Location",
            gmpClickable: true,
          });

          // add click listener safely and store reference
          if (
            onClick &&
            advRef.current &&
            typeof (advRef.current as any).addListener === "function"
          ) {
            const listener = (advRef.current as any).addListener(
              "click",
              () => {
                if (advRef.current) onClick(advRef.current as any);
              }
            );
            advClickListenerRef.current = listener;
          }

          // ensure fallback marker removed if present
          if (fallbackRef.current) {
            try {
              fallbackRef.current.setMap(null);
            } catch (_) {}
            fallbackRef.current = null;
          }

          return;
        }
      } catch (err) {
        console.warn(
          "AdvancedMarker library not available or failed to load:",
          err
        );
      }

      // Fallback: create a classic google.maps.Marker with SVG icon
      if (map && isMounted) {
        // remove any existing advanced marker
        if (advRef.current) {
          try {
            (advRef.current as any).map = null;
          } catch (_) {}
          advRef.current = null;
        }

        // create fallback Marker
        const marker = new google.maps.Marker({
          map,
          position,
          title: label ?? "Location",
          icon: {
            url: createSvgIconUrl(color),
            scaledSize: new google.maps.Size(36, 36),
            anchor: new google.maps.Point(18, 36),
          },
        });

        fallbackRef.current = marker;

        // add click listener and store ref
        if (onClick) {
          const listener = marker.addListener("click", () => onClick(marker));
          fallbackClickListenerRef.current = listener;
        }
      }
    };

    loadAndCreate();

    return () => {
      isMounted = false;

      // remove advanced marker click listener
      if (advClickListenerRef.current) {
        try {
          if (typeof advClickListenerRef.current.remove === "function") {
            advClickListenerRef.current.remove();
          } else {
            // fallback removal
            google.maps.event.removeListener(advClickListenerRef.current);
          }
        } catch (_) {}
        advClickListenerRef.current = null;
      }

      // remove fallback marker click listener
      if (fallbackClickListenerRef.current) {
        try {
          if (typeof fallbackClickListenerRef.current.remove === "function") {
            fallbackClickListenerRef.current.remove();
          } else {
            google.maps.event.removeListener(fallbackClickListenerRef.current);
          }
        } catch (_) {}
        fallbackClickListenerRef.current = null;
      }

      // cleanup both marker variants
      if (advRef.current) {
        try {
          (advRef.current as any).map = null;
        } catch (_) {}
        advRef.current = null;
      }
      if (fallbackRef.current) {
        try {
          fallbackRef.current.setMap(null);
        } catch (_) {}
        fallbackRef.current = null;
      }

      // remove DOM content if created
      if (contentRef.current && contentRef.current.parentNode) {
        try {
          contentRef.current.parentNode.removeChild(contentRef.current);
        } catch (_) {}
      }
      contentRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // update position when props change
  useEffect(() => {
    if (advRef.current) {
      try {
        advRef.current.position = position;
      } catch (_) {}
    }
    if (fallbackRef.current) {
      try {
        fallbackRef.current.setPosition(position);
      } catch (_) {}
    }

    // if marker exists but map prop changed (e.g., map becomes available), set map
    if (advRef.current && map) {
      try {
        advRef.current.map = map;
      } catch (_) {}
    }
    if (fallbackRef.current && map) {
      try {
        fallbackRef.current.setMap(map);
      } catch (_) {}
    }
  }, [position, map]);

  // update visual content when color/label changes (for AdvancedMarker)
  useEffect(() => {
    if (advRef.current) {
      const newContent = createMarkerContent(color, label);
      try {
        advRef.current.content = newContent;
      } catch (_) {}
      // replace stored content so cleanup removes correct element
      contentRef.current = newContent;
    } else if (fallbackRef.current) {
      // update fallback icon
      try {
        fallbackRef.current.setIcon({
          url: createSvgIconUrl(color),
          scaledSize: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 36),
        });
        fallbackRef.current.setTitle(label ?? "Location");
      } catch (_) {}
    }
  }, [color, label]);

  return null;
};

export default AdvancedMarker;
