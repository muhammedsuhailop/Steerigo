export enum DriverStatus {
  ACTIVE = "Active",
  BLOCKED = "Blocked",
  SUSPENDED = "Suspended",
}

export const VALID_DRIVER_STATUSES = Object.values(DriverStatus);

export const DRIVER_STATUS_TRANSITIONS: Record<DriverStatus, DriverStatus[]> = {
  [DriverStatus.ACTIVE]: [DriverStatus.BLOCKED, DriverStatus.SUSPENDED],
  [DriverStatus.BLOCKED]: [DriverStatus.ACTIVE],
  [DriverStatus.SUSPENDED]: [DriverStatus.ACTIVE, DriverStatus.BLOCKED],
};
