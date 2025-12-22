export interface ActivityItem {
  id: string;
  type: "user" | "driver" | "ride" | "payment" | "kyc";
  title: string;
  description: string;
  timestamp: string;
  status?: "success" | "pending" | "warning" | "error";
}

export interface ActivityItemProps {
  activity: ActivityItem;
}
