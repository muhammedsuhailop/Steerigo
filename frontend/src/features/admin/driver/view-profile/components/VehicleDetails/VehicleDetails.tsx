import React from "react";
import { Card, CardHeader, CardBody, Badge } from "@/shared/components/ui";
import type { Driver } from "@/features/admin/shared/types";

interface VehicleDetailsProps {
  driver: Driver;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({ driver }) => {
  return (
    <Card>
      <CardHeader
        title="License Details & Vehicle Eligibility"
        className="bg-gray-100"
      />
      <CardBody className="space-y-4 text-sm">
        <DetailRow label="License Number" value={driver.licenseNumber} />
        <DetailRow
          label="Date of Issue"
          value={new Date(driver.licenseIssueDate).toLocaleDateString()}
        />
        <DetailRow
          label="Date of Expiry"
          value={new Date(driver.licenseExpiryDate).toLocaleDateString()}
        />

        <div>
          <span className="text-gray-500">Eligible Vehicle Categories :</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {driver.eligibleVehicleType.length > 0 ? (
              driver.eligibleVehicleType.map((type) => (
                <Badge key={type} variant="outline" size="sm">
                  {type}
                </Badge>
              ))
            ) : (
              <span className="font-medium">-</span>
            )}
          </div>
        </div>

        <div>
          <span className="text-gray-500">Eligible Transmission Types :</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {driver.eligibleGearType.length > 0 ? (
              driver.eligibleGearType.map((type) => (
                <Badge key={type} variant="outline" size="sm">
                  {type}
                </Badge>
              ))
            ) : (
              <span className="font-medium">-</span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}
