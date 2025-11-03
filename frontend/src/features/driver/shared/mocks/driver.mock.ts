import type { Driver, RideRequest, CurrentRide } from "../types/driver.types";

export const MOCK_DRIVER: Driver = {
  id: "driver-001",
  driverId: "DRV-001",
  name: "John Doe",
  email: "john.doe@example.com",
  mobile: "+1234567890",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  currentStatus: "Available",
  rating: 4.7,
  totalRides: 156,
  completedRides: 148,
  scheduledRides: 3,
  totalEarnings: 4280.5,
  todayEarnings: 125.0,
  weeklyEarnings: 520.0,
  monthlyEarnings: 2100.0,
  vehicleInfo: {
    id: "vehicle-001",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    color: "Silver",
    plateNumber: "ABC-1234",
    type: "sedan",
    fuelType: "hybrid",
  },
  location: {
    latitude: 40.7128,
    longitude: -74.006,
    address: "Manhattan, New York, NY",
  },
  createdAt: new Date("2024-01-15").toISOString(),
  updatedAt: new Date().toISOString(),
  userId: "user-001",
  licenseNumber: "DL123456789",
  licenceCategory: "Commercial",
  licenseIssueDate: "2020-01-15",
  licenseExpiryDate: "2025-01-15",
  kycStatus: "Approved",
  status: "Active",
  eligibleGearTypes: ["Manual", "Automatic"],
  eligibleBodyTypes: ["Sedan", "SUV"],
};

export const MOCK_PENDING_REQUESTS: RideRequest[] = [
  {
    id: "req-001",
    passengerId: "user-101",
    passengerName: "Alice Smith",
    passengerPhone: "+9134567891",
    passengerRating: 4.8,
    pickupLocation: {
      address: "Times Square, New York, NY",
      latitude: 40.758,
      longitude: -73.9855,
    },
    dropoffLocation: {
      address: "Grand Central Terminal, New York, NY",
      latitude: 40.7489,
      longitude: -73.968,
    },
    estimatedFare: 15.5,
    distance: 2.3,
    estimatedDuration: 12,
    rideType: "oneway",
    requestTime: new Date().toISOString(),
    paymentMethod: "card",
  },
  {
    id: "req-002",
    passengerId: "user-102",
    passengerName: "Bob Johnson",
    passengerPhone: "+1234567892",
    passengerRating: 4.5,
    pickupLocation: {
      address: "Central Park South, New York, NY",
      latitude: 40.7614,
      longitude: -73.9776,
    },
    dropoffLocation: {
      address: "Upper East Side, New York, NY",
      latitude: 40.7812,
      longitude: -73.9665,
    },
    estimatedFare: 12.0,
    distance: 1.8,
    estimatedDuration: 8,
    rideType: "oneway",
    requestTime: new Date().toISOString(),
    paymentMethod: "cash",
  },
  {
    id: "req-003",
    passengerId: "user-103",
    passengerName: "Carol White",
    passengerPhone: "+1234567893",
    passengerRating: 4.9,
    pickupLocation: {
      address: "Brooklyn Bridge, Brooklyn, NY",
      latitude: 40.7061,
      longitude: -73.9969,
    },
    dropoffLocation: {
      address: "Wall Street, New York, NY",
      latitude: 40.7074,
      longitude: -74.0113,
    },
    estimatedFare: 18.0,
    distance: 3.2,
    estimatedDuration: 15,
    rideType: "oneway",
    requestTime: new Date().toISOString(),
    specialRequests: "Please call on arrival",
    paymentMethod: "wallet",
  },
];

export class MockStateManager {
  private mockDriverState: Driver = { ...MOCK_DRIVER };
  private mockRequestsState: RideRequest[] = [...MOCK_PENDING_REQUESTS];
  private mockCurrentRideState: CurrentRide | null = null;

  getDriver(): Driver {
    return this.mockDriverState;
  }

  getRequests(): RideRequest[] {
    return this.mockRequestsState;
  }

  getCurrentRide(): CurrentRide | null {
    return this.mockCurrentRideState;
  }

  updateDriver(updates: Partial<Driver>): Driver {
    this.mockDriverState = {
      ...this.mockDriverState,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.mockDriverState;
  }

  setOnlineStatus(isOnline: boolean): Driver {
    return this.updateDriver({
      currentStatus: isOnline ? "Available" : "Offline",
    });
  }

  acceptRideRequest(requestId: string): CurrentRide | null {
    const request = this.mockRequestsState.find((r) => r.id === requestId);
    if (!request) return null;

    this.mockRequestsState = this.mockRequestsState.filter(
      (r) => r.id !== requestId
    );

    this.mockCurrentRideState = {
      id: `ride-${Date.now()}`,
      passengerId: request.passengerId,
      passengerName: request.passengerName,
      passengerPhone: request.passengerPhone,
      passengerRating: request.passengerRating,
      pickupLocation: request.pickupLocation,
      dropoffLocation: request.dropoffLocation,
      fare: request.estimatedFare,
      distance: request.distance,
      duration: request.estimatedDuration,
      rideType: request.rideType,
      status: "accepted",
      startTime: new Date().toISOString(),
      acceptedAt: new Date().toISOString(),
      paymentMethod: request.paymentMethod,
    };

    return this.mockCurrentRideState;
  }

  rejectRideRequest(requestId: string): boolean {
    const request = this.mockRequestsState.find((r) => r.id === requestId);
    if (!request) return false;

    this.mockRequestsState = this.mockRequestsState.filter(
      (r) => r.id !== requestId
    );
    return true;
  }

  updateRideStatus(
    rideId: string,
    status:
      | "accepted"
      | "pickup"
      | "ongoing"
      | "completed"
      | "cancelled"
      | "rejected"
  ): CurrentRide | null {
    if (!this.mockCurrentRideState) return null;

    this.mockCurrentRideState = {
      ...this.mockCurrentRideState,
      status: status as any,
    };

    return this.mockCurrentRideState;
  }

  // Reset to initial state 
  reset(): void {
    this.mockDriverState = { ...MOCK_DRIVER };
    this.mockRequestsState = [...MOCK_PENDING_REQUESTS];
    this.mockCurrentRideState = null;
  }
}

export const mockStateManager = new MockStateManager();
