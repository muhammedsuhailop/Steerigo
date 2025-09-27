import { DriverDataService } from "../types/driver.interfaces";
import type {
  Driver,
  RideRequest,
  CurrentRide,
  DriverStats,
} from "../types/driver.types";

export class ApiDriverDataService implements DriverDataService {
  private baseUrl = "/api/driver";

  async getDriverProfile(): Promise<Driver> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async updateDriverProfile(updates: Partial<Driver>): Promise<Driver> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getDriverStats(): Promise<DriverStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getPendingRequests(): Promise<RideRequest[]> {
    const response = await fetch(`${this.baseUrl}/requests/pending`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getCurrentRide(): Promise<CurrentRide | null> {
    const response = await fetch(`${this.baseUrl}/rides/current`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No current ride
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async acceptRideRequest(requestId: string): Promise<CurrentRide> {
    const response = await fetch(
      `${this.baseUrl}/requests/${requestId}/accept`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async rejectRideRequest(requestId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/requests/${requestId}/reject`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async updateRideStatus(
    rideId: string,
    status: CurrentRide["status"]
  ): Promise<CurrentRide> {
    const response = await fetch(`${this.baseUrl}/rides/${rideId}/status`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async setDriverOnlineStatus(isOnline: boolean): Promise<void> {
    const response = await fetch(`${this.baseUrl}/status`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ isOnline }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async updateDriverLocation(location: {
    latitude: number;
    longitude: number;
  }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/location`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(location),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}

// Mock implementation with dummy data for development
export class MockDriverDataService implements DriverDataService {
  private mockDriver: Driver = {
    id: "dfujf-1",
    driverId: "drf12345",
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+91 9876543210",
    profileImage: undefined,
    currentStatus: "Available",
    rating: 4.8,
    totalRides: 1247,
    completedRides: 1189,
    scheduledRides: 2,
    totalEarnings: 45990,
    todayEarnings: 850,
    weeklyEarnings: 6200,
    monthlyEarnings: 22500,
    vehicleInfo: {
      id: "vehicle-1",
      make: "Honda",
      model: "City",
      year: 2022,
      color: "White",
      plateNumber: "KL 07 AB 1234",
      type: "sedan",
      fuelType: "petrol",
    },
    location: {
      latitude: 9.9312,
      longitude: 76.2673,
      address: "Kochi, Kerala, India",
    },
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2025-09-26T15:30:00Z",
  };

  private mockRequests: RideRequest[] = [
    {
      id: "req-1",
      passengerId: "passenger-1",
      passengerName: "Alice Johnson",
      passengerPhone: "+91 8765432109",
      passengerRating: 4.6,
      pickupLocation: {
        address: "Oberon Mall, Kochi",
        latitude: 9.9312,
        longitude: 76.2673,
      },
      dropoffLocation: {
        address: "Kochi Airport",
        latitude: 9.9395,
        longitude: 76.2691,
      },
      estimatedFare: 250,
      distance: 8.5,
      estimatedDuration: 25,
      rideType: "roundtrip",
      requestTime: "2025-09-26T15:28:00Z",
      paymentMethod: "card",
    },
    {
      id: "req-2",
      passengerId: "passenger-2",
      passengerName: "Bob Smith",
      passengerPhone: "+91 7654321098",
      passengerRating: 4.2,
      pickupLocation: {
        address: "Marine Drive, Kochi",
        latitude: 9.9658,
        longitude: 76.2427,
      },
      dropoffLocation: {
        address: "InfoPark, Kochi",
        latitude: 10.0261,
        longitude: 76.3479,
      },
      estimatedFare: 350,
      distance: 12.3,
      estimatedDuration: 35,
      rideType: "oneway",
      requestTime: "2025-09-26T15:30:00Z",
      paymentMethod: "wallet",
    },
  ];

  private mockCurrentRide: CurrentRide | null = {
    id: "ride-current-1",
    passengerId: "passenger-3",
    passengerName: "Carol Brown",
    passengerPhone: "+91 6543210987",
    pickupLocation: {
      address: "Lulu Mall, Kochi",
      latitude: 9.9816,
      longitude: 76.2999,
    },
    dropoffLocation: {
      address: "Kakkanad, Kochi",
      latitude: 10.0261,
      longitude: 76.3479,
    },
    fare: 180,
    distance: 6.2,
    duration: 18,
    status: "ongoing",
    startTime: "2025-09-26T15:15:00Z",
    estimatedArrival: "2025-09-26T15:33:00Z",
    actualPickupTime: "2025-09-26T15:18:00Z",
    paymentMethod: "cash",
    paymentStatus: "pending",
  };

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getDriverProfile(): Promise<Driver> {
    await this.delay(300);
    return { ...this.mockDriver };
  }

  async updateDriverProfile(updates: Partial<Driver>): Promise<Driver> {
    await this.delay(500);
    this.mockDriver = {
      ...this.mockDriver,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.mockDriver };
  }

  async getDriverStats(): Promise<DriverStats> {
    await this.delay(200);
    return {
      totalRides: this.mockDriver.totalRides,
      completedRides: this.mockDriver.completedRides,
      scheduledRides: this.mockDriver.scheduledRides,
      todayEarnings: this.mockDriver.todayEarnings,
      weeklyEarnings: this.mockDriver.weeklyEarnings,
      monthlyEarnings: this.mockDriver.monthlyEarnings,
      totalEarnings: this.mockDriver.totalEarnings,
      rating: this.mockDriver.rating,
      acceptanceRate: 95.2,
      completionRate: 98.7,
    };
  }

  async getPendingRequests(): Promise<RideRequest[]> {
    await this.delay(300);
    return [...this.mockRequests];
  }

  async getCurrentRide(): Promise<CurrentRide | null> {
    await this.delay(200);
    return this.mockCurrentRide ? { ...this.mockCurrentRide } : null;
  }

  async acceptRideRequest(requestId: string): Promise<CurrentRide> {
    await this.delay(500);
    const request = this.mockRequests.find((r) => r.id === requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    // Remove from pending requests
    this.mockRequests = this.mockRequests.filter((r) => r.id !== requestId);

    // Create current ride
    const currentRide: CurrentRide = {
      id: `ride-${requestId}`,
      passengerId: request.passengerId,
      passengerName: request.passengerName,
      passengerPhone: request.passengerPhone,
      pickupLocation: request.pickupLocation,
      dropoffLocation: request.dropoffLocation,
      fare: request.estimatedFare,
      distance: request.distance,
      duration: request.estimatedDuration,
      status: "accepted",
      startTime: new Date().toISOString(),
      paymentMethod: request.paymentMethod,
      paymentStatus: "pending",
    };

    this.mockCurrentRide = currentRide;
    return { ...currentRide };
  }

  async rejectRideRequest(requestId: string): Promise<void> {
    await this.delay(300);
    this.mockRequests = this.mockRequests.filter((r) => r.id !== requestId);
  }

  async updateRideStatus(
    rideId: string,
    status: CurrentRide["status"]
  ): Promise<CurrentRide> {
    await this.delay(400);
    if (!this.mockCurrentRide || this.mockCurrentRide.id !== rideId) {
      throw new Error("Ride not found");
    }

    this.mockCurrentRide = {
      ...this.mockCurrentRide,
      status,
      ...(status === "completed" && {
        actualDropoffTime: new Date().toISOString(),
        paymentStatus: "completed" as const,
      }),
    };

    if (status === "completed") {
      this.mockDriver.completedRides += 1;
      this.mockDriver.todayEarnings += this.mockCurrentRide.fare;
    }

    return { ...this.mockCurrentRide };
  }

  async setDriverOnlineStatus(isOnline: boolean): Promise<void> {
    await this.delay(200);
    this.mockDriver.currentStatus = isOnline ? "Available" : "Offline";
  }

  async updateDriverLocation(location: {
    latitude: number;
    longitude: number;
  }): Promise<void> {
    await this.delay(100);
    this.mockDriver.location = { ...this.mockDriver.location, ...location };
  }
}
