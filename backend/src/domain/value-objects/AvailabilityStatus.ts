export enum AvailabilityStatus {
  AVAILABLE = "Available",
  BUSY = "Busy",
  OFFLINE = "Offline",
  SCHEDULED = "Scheduled",
}

export const VALID_AVAILABILITY_STATUSES = Object.values(AvailabilityStatus);

export const AVAILABILITY_STATUS_TRANSITIONS: Record<
  AvailabilityStatus,
  AvailabilityStatus[]
> = {
  [AvailabilityStatus.OFFLINE]: [
    AvailabilityStatus.AVAILABLE,
    AvailabilityStatus.SCHEDULED,
  ],
  [AvailabilityStatus.AVAILABLE]: [
    AvailabilityStatus.BUSY,
    AvailabilityStatus.OFFLINE,
  ],
  [AvailabilityStatus.BUSY]: [
    AvailabilityStatus.AVAILABLE,
    AvailabilityStatus.OFFLINE,
  ],
  [AvailabilityStatus.SCHEDULED]: [
    AvailabilityStatus.AVAILABLE,
    AvailabilityStatus.BUSY,
    AvailabilityStatus.OFFLINE,
  ],
};
