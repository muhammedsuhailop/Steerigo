export interface KYCRequest {
  kycId: string;
  driverId: string;
  driverName: string;
  email: string;
  phone: string;
  status: "Pending" | "Approved" | "Rejected";
  isVerified: boolean;
  submittedAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    address: string;
    city: string;
    zipCode: string;
    gender: string;
  };
  licenseInfo: {
    licenseNumber: string;
    expiryDate: string;
    issueDate: string;
    licenseClass: string;
  };
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    color: string;
    type: string;
  };
  documents: {
    frontSide: KYCDocument;
    backSide: KYCDocument;
    profilePhoto: KYCDocument;
    vehicleRegistration?: KYCDocument;
    insurance?: KYCDocument;
  };
}

export interface KYCDocument {
  id: string;
  type: "DrivingLicense" | "Aadhaar" | "VehicleRegistration";
  url: string;
  uploadedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
}

export interface KYCFilters {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export type KYCAction = "Approve" | "Reject";
