import React from "react";
import { Card, CardHeader, CardBody, Badge } from "@/shared/components/ui";
import type { Driver, DocumentStatus } from "@/features/admin/shared/types";

interface DriverDetailsProps {
  driver: Driver;
}

export const DriverDetails: React.FC<DriverDetailsProps> = ({ driver }) => {
  const getBadge = (status?: DocumentStatus["status"]) => {
    if (!status) return null;
    const map = {
      Pending: { variant: "warning" as const, text: "Pending" },
      Approved: { variant: "success" as const, text: "Approved" },
      Rejected: { variant: "danger" as const, text: "Rejected" },
    };
    const cfg = map[status];
    return (
      <Badge variant={cfg.variant} size="sm">
        {cfg.text}
      </Badge>
    );
  };

  const findDocStatus = (type: string): DocumentStatus | undefined => {
    const doc = driver.kycDocs?.find((doc) => doc.documentType === type);
    if (!doc) return undefined;

    const statusMap: Record<string, DocumentStatus["status"]> = {
      Pending: "Pending",
      Verified: "Approved",
      Rejected: "Rejected",
    };

    return {
      ...doc,
      status: statusMap[doc.status] || "Pending",
    };
  };

  return (
    <Card>
      <CardHeader title="Personal Information" className="bg-gray-100" />
      <CardBody className="grid grid-cols-2 gap-4 text-sm">
        <Detail label="Full Name" value={driver.name} />
        <Detail label="Email" value={driver.email} />
        <Detail label="Phone" value={driver.mobile} />
        <Detail label="Address" value={driver.address || "-"} />
        <Detail label="State" value={driver.state || "-"} />
        <Detail label="PIN Code" value={driver.pinCode || "-"} />
      </CardBody>
      <CardHeader title="Document Status" className="mt-6" />
      <CardBody className="space-y-3 text-sm">
        <StatusRow
          label="License"
          badge={getBadge(findDocStatus("DrivingLicense")?.status)}
        />

        <StatusRow
          label="Aadhaar"
          badge={getBadge(findDocStatus("Aadhaar")?.status)}
        />

        <StatusRow
          label="PAN Card"
          badge={getBadge(findDocStatus("PAN")?.status) ?? "NA"}
        />

        <StatusRow
          label="Passport"
          badge={getBadge(findDocStatus("Passport")?.status) ?? "NA"}
        />
      </CardBody>
    </Card>
  );
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>
      <p className="font-medium">{value}</p>
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
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      {badge}
    </div>
  );
}
