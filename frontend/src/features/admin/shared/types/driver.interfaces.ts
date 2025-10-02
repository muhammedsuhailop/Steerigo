export interface Driver {
  driverId: string;
  name: string;
  email: string;
  mobile: string;
  status: 'Active' | 'Blocked' | 'InReview';
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  createdAt: string;
  lastRide: string | null;
  totalRides: number;
  rating: number;
  profileImage?: string;
  licenseNumber: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  eligibleVehicleType: string[];
  eligibleGearType: string[];
  kycDocs: KycDocument[];
  address?: string;
  state?: string;
  pinCode?: string;
}

export interface KycDocument {
  uploadedAt: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  id: string;
  driverId: string;
  documentType: 'DrivingLicense' | 'Aadhaar' | 'VehicleRegistration' ;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  documentImageUrls: string[];
  isVerified: boolean;
  comments?: string;
  submittedAt: string;
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

export type DriverAction = "InReview" | "block" | "unblock";


export interface KYCItem {
  id: string;
  documentType: string;
  urlFront: string;
  urlBack: string;
  isVerified:boolean;
  submittedAt: string;
  documentNumber:string;
  issueDate:string;
  expiryDate:string;

}

export interface DriverProfileKYCProps {
  items: KYCItem[];
  onAction: (id: string, action: "Approve" | "Reject") => void;
}