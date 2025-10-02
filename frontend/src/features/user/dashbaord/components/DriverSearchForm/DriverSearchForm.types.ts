export interface SearchFormData {
  tripType: "oneway" | "roundtrip";
  carType: string;
  gearType: string;
  pickupLocation: string;
  dropLocation: string;
  rideDate: string;
  rideTimeWindow: "now" | "in15" | "in1h" | "custom";
  timeRequired: string;
  autoAssign?: boolean;
}

export interface DriverSearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isLoading?: boolean;
}
