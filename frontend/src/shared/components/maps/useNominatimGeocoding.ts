import { useState, useCallback } from "react";
import type { Location } from "./types/maps.type";

// Nominatim API configuration
const NOMINATIM_BASE_URL = import.meta.env.VITE_NOMINATIM_BASE_URL;
const REQUEST_DELAY = 1100; // Slightly over 1 second to respect rate limit

// Simple rate limiter
let lastRequestTime = 0;

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < REQUEST_DELAY) {
    const waitTime = REQUEST_DELAY - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();
};

export const useGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAddressFromCoordinates = useCallback(
    async (lat: number, lng: number): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        // Respect rate limit
        await waitForRateLimit();

        const response = await fetch(
          `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          {
            headers: {
              "User-Agent": "SteeriGo-App/1.0",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.display_name) {
          return data.display_name;
        }

        throw new Error("No address found");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Geocoding failed";
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getCoordinatesFromAddress = useCallback(
    async (address: string): Promise<{ lat: number; lng: number }> => {
      setIsLoading(true);
      setError(null);

      try {
        // Respect rate limit
        await waitForRateLimit();

        const response = await fetch(
          `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(
            address
          )}&addressdetails=1&limit=1`,
          {
            headers: {
              "User-Agent": "SteeriGo-App/1.0",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
          throw new Error("Location not found");
        }

        const location = data[0];

        return {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Geocoding failed";
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
    isLoading,
    error,
  };
};
