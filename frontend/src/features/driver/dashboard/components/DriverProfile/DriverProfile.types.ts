import type { Driver } from "../../../shared/types/driver.types";

export interface DriverProfileProps {
  driver: Driver;
  loading?: boolean;
  className?: string;
}
