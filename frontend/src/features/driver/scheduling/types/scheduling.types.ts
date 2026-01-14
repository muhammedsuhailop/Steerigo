export enum DriverAvailabilityStatus {
  SCHEDULED = "Scheduled",
  AVAILABLE = "Available",
  BUSY = "Busy",
  OFFLINE = "Offline",
}

export type ExceptionType = "break" | "leave" | "other";
export type RecurringPattern = "daily" | "weekly" | "monthly";
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface DailyRecurrence {
  daysOfWeek: number[];
  timeSlots: TimeSlot[];
  excludedTimeSlots: TimeSlot[];
  daysOfWeekLabels: string[];
}

export interface Validity {
  startDate: string;
  endDate: string;
  isCurrentlyValid: boolean;
}

export interface RecurringSchedule {
  dailyRecurrence: DailyRecurrence;
  validity: Validity;
  notes: string;
  isActive: boolean;
}

export interface Exception {
  type: ExceptionType;
  reason: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  isRecurring: boolean;
  recurringPattern: string;
  createdAt: string;
}

export interface ScheduleSummary {
  isCurrentlyAvailable: boolean;
  nextAvailableTime: string | null;
  nextUnavailableTime: string | null;
  totalHoursAvailableToday: number;
  activeExceptionsCount: number;
  scheduleStatus: string;
}

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  address: string;
  lastUpdatedAt: string;
  accuracy: number;
}

export interface AvailabilityData {
  id: string;
  driverId: string;
  availabilityStatus: DriverAvailabilityStatus;
  currentLocation: CurrentLocation;
  lastLocationUpdateAt: string;
  recurringSchedule: RecurringSchedule;
  exceptions: Exception[];
  activeExceptionsCount: number;
  summary: ScheduleSummary;
  todayTimeSlots: TimeSlot[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleData {
  availableFrom: string;
  availableTill: string;
  currentLocation: Location;
}

export interface UpdateLocationPayload {
  driverId: string | null;
  currentLocation: Location;
}

export interface UpdateStatusPayload {
  driverId: string | null;
  status: DriverAvailabilityStatus;
}

export interface ScheduleFormData {
  daysOfWeek: number[];
  timeSlots: Array<{
    startTime: number;
    endTime: number;
  }>;
  validityStartDate: string;
  validityEndDate: string;
  notes: string;
  currentLocation: Location;
}

export interface GeocodeResult {
  address: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface DriverStatusResponse {
  success: boolean;
  message: string;
  data: AvailabilityData;
}

export interface AvailabilityNotFoundResponse {
  success: boolean;
  message: string;
  type: "NOT_FOUND_ERROR";
}

export interface SchedulingState {
  availability: AvailabilityData | null;
  driverId: string | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  hasAvailability: boolean;
}

export interface ExceptionFormData {
  type: ExceptionType;
  reason: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
}

export interface ExceptionResponse {
  id: string;
  type: ExceptionType;
  reason: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: string;
}

export interface ExceptionCreateResponse {
  success: boolean;
  message: string;
  data: ExceptionResponse;
}

export interface ExceptionDeleteResponse {
  success: boolean;
  message: string;
}
