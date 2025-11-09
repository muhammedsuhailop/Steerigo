import React from "react";
import Card from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui";
import type {
  DriverDetailsProps,
  DriverStatus,
  KYCStatus,
} from "../../../../shared/types/adminDriverProfile.types";

export const DriverDetails: React.FC<DriverDetailsProps> = ({
  driver,
  user,
  stats,
}) => {
  const getStatusBadge = (status: DriverStatus) => {
    const statusMap = {
      Active: { variant: "success" as const, text: "Active" },
      Inactive: { variant: "secondary" as const, text: "Inactive" },
      Suspended: { variant: "warning" as const, text: "Suspended" },
      Blocked: { variant: "danger" as const, text: "Blocked" },
      InReview: { variant: "info" as const, text: "In Review" },
      Pending: { variant: "warning" as const, text: "Pending" },
    };
    const config = (statusMap as any)[status] || statusMap.Pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getKYCStatusBadge = (status: KYCStatus) => {
    const statusMap = {
      Approved: { variant: "success" as const, text: "Approved" },
      Pending: { variant: "warning" as const, text: "Pending" },
      Rejected: { variant: "danger" as const, text: "Rejected" },
      InReview: { variant: "info" as const, text: "In Review" },
    };
    const config = (statusMap as any)[status] || statusMap.Pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isLicenseExpired = (expiry?: string | null) => {
    if (!expiry) return false;
    const exp = new Date(expiry);
    if (isNaN(exp.getTime())) return false;
    return exp < new Date();
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        {/* Personal Information */}
        <div>
          <Card className="h-full">
            <Card.Header title="Personal Information" />
            <Card.Body>
              <div className="space-y-3">
                <Detail label="Driver ID" value={driver.id ?? "N/A"} />
                <Detail label="Name" value={user.name ?? "N/A"} />
                <Detail label="Email" value={user.email ?? "N/A"} />
                <Detail label="Mobile" value={user.mobile ?? "N/A"} />
                <StatusRow
                  label="Status"
                  badge={getStatusBadge(driver.status)}
                />
                <StatusRow
                  label="KYC Status"
                  badge={getKYCStatusBadge(driver.kycStatus)}
                />
                <Detail
                  label="Member Since"
                  value={formatDate(driver.createdAt)}
                />
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* License Information */}
        <div>
          <Card className="h-full">
            <Card.Header title="License Information" />
            <Card.Body>
              <div className="space-y-3">
                <Detail
                  label="License Category"
                  value={driver.licenceCategory ?? "N/A"}
                />
                <Detail
                  label="License Issue Date"
                  value={formatDate(driver.licenseIssueDate)}
                />
                <Detail
                  label="License Expiry Date"
                  value={formatDate(driver.licenseExpiryDate)}
                />
                <div className="pt-2">
                  {isLicenseExpired(driver.licenseExpiryDate) ? (
                    <Badge variant="danger">License Expired</Badge>
                  ) : (
                    <Badge variant="success">License Valid</Badge>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Driver Statistics */}
      <Card className="mb-4">
        <Card.Header title="Driver Statistics" />
        <Card.Body>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatItem
              label="Total Rides"
              value={String(stats.totalRides ?? 0)}
            />
            <StatItem
              label="Total Earnings"
              value={`₹${Number(stats.totalEarnings ?? 0).toLocaleString(
                "en-IN"
              )}`}
            />
            <StatItem
              label="Rating"
              value={
                stats.rating && stats.rating > 0
                  ? `${Number(stats.rating).toFixed(1)} ⭐`
                  : "No ratings yet"
              }
            />
            <StatItem
              label="Last Ride"
              value={
                stats.lastRideDate
                  ? formatDate(stats.lastRideDate)
                  : "No rides yet"
              }
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

function StatusRow({
  label,
  badge,
}: {
  label: string;
  badge: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <div>{badge}</div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}
