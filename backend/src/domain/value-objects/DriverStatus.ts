export enum DriverStatus {
  PENDING_VERIFICATION = "Pending Verification",
  ACTIVE = "Active",
  SUSPENDED = "Suspended",
  REJECTED = "Rejected",
}

export const VALID_DRIVER_STATUSES = Object.values(DriverStatus);

export const DRIVER_STATUS_TRANSITIONS: Record<DriverStatus, DriverStatus[]> = {
  [DriverStatus.PENDING_VERIFICATION]: [
    DriverStatus.ACTIVE,
    DriverStatus.REJECTED,
  ],
  [DriverStatus.ACTIVE]: [DriverStatus.SUSPENDED],
  [DriverStatus.SUSPENDED]: [DriverStatus.ACTIVE],
  [DriverStatus.REJECTED]: [],
};
