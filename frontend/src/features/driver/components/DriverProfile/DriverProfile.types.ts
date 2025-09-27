import type { Driver } from "../../types/driver.types";

export interface DriverProfileProps {
  driver: Driver;
  isOnline: boolean;
  onToggleStatus: (isOnline: boolean) => void;
  loading?: boolean;
  className?: string;
}
