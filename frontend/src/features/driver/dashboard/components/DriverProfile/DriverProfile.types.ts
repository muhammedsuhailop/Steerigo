import type { Driver } from "../../../shared/types/driver.types";

export interface DriverProfileProps {
  driver: Driver;
  isOnline: boolean;
  onToggleStatus: (isOnline: boolean) => void;
  loading?: boolean;
  className?: string;
}
