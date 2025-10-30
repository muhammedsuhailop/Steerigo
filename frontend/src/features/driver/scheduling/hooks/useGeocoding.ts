import { useState, useCallback } from "react";
import type { Location } from "../types/scheduling.types";

export const useGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAddressFromCoordinates = useCallback(
    async (lat: number, lng: number): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const geocoder = new google.maps.Geocoder();
        const result = await geocoder.geocode({
          location: { lat, lng },
        });

        if (result.results) {
          return result.results[0].formatted_address;
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
        const geocoder = new google.maps.Geocoder();
        const result = await geocoder.geocode({ address });

        if (result.results) {
          const location = result.results[0].geometry.location;
          return {
            lat: location.lat(),
            lng: location.lng(),
          };
        }
        throw new Error("Location not found");
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
