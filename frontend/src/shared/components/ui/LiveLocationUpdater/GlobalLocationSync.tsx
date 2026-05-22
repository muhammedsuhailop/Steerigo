import { useAppSelector } from "@/app/store/hooks";
import { useUpdateLocationMutation } from "@/features/driver/scheduling/services/schedulingApi";
import {
  selectDriverId,
  selectIsAutoSyncEnabled,
} from "@/features/driver/shared/store/driverSlice";
import { useEffect, useCallback, useRef } from "react";
import { useGeocoding } from "../../maps/useNominatimGeocoding";

const GlobalLocationSync = () => {
  const driverId = useAppSelector(selectDriverId);
  const isAutoSyncEnabled = useAppSelector(selectIsAutoSyncEnabled);

  const [updateLocation] = useUpdateLocationMutation();
  const { getAddressFromCoordinates } = useGeocoding();

  const isEnabledRef = useRef<boolean>(isAutoSyncEnabled);
  useEffect(() => {
    isEnabledRef.current = isAutoSyncEnabled;
  }, [isAutoSyncEnabled]);

  const performUpdate = useCallback(() => {
    if (!navigator.geolocation || !driverId) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const address = await getAddressFromCoordinates(lat, lng);

          await updateLocation({
            driverId,
            currentLocation: {
              latitude: lat,
              longitude: lng,
              address: address,
            },
          }).unwrap();

          console.log(`[Auto-Sync] Location updated to ${address}`);
        } catch (error: unknown) {
          console.error("[Auto-Sync] Background location sync failed:", error);
        }
      },
      (error) => {
        console.error("[Auto-Sync] Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, [driverId, getAddressFromCoordinates, updateLocation]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isAutoSyncEnabled && driverId) {
      performUpdate();

      intervalId = setInterval(
        () => {
          if (isEnabledRef.current) {
            performUpdate();
          }
        },
        5 * 60 * 1000,
      );
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoSyncEnabled, driverId, performUpdate]);

  return null;
};

export default GlobalLocationSync;
