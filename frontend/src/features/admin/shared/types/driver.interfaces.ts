export interface Driver {
  driverId: string;
  name: string;
  email: string;
  mobile: string;
  status: "Active" | "Blocked" | "InReview";
  createdAt: string;
  lastRide: string | null;
  totalRides: number;
  rating: number;
  profileImage?: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  eligibleVehicleType: string[];
  eligibleGearType: string[];
  documents?: {
    license?: DocumentStatus;
    registration?: DocumentStatus;
    insurance?: DocumentStatus;
    profilePhoto?: DocumentStatus;
  };
  kycStatus: "Pending" | "Verified" | "Rejected";
  address?: string;
  city?: string;
  zipCode?: string;
}

export interface DocumentStatus {
  status: "Pending" | "Approved" | "Rejected";
  url?: string;
  uploadedAt?: string;
  rejectionReason?: string;
}

export interface DriverFilters {
  search?: string;
  status: string;
  kycStatus: string;
  vehicleType: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface DriverPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export type DriverAction = "InReview" | "Block" | "Active";
