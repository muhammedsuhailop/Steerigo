import React from "react";
import Card from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui";
import type { VehicleDetailsProps } from "../../../../shared/types/adminDriverProfile.types";

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({ driver }) => {
  return (
    <Card>
      <Card.Header title="Eligible Vehicle Information" />
      <Card.Body>
        <div className="space-y-4">
          {/* Eligible Body Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preffered Body Types:
            </label>
            <div className="flex flex-wrap gap-2">
              {driver?.eligibleBodyTypes &&
              driver.eligibleBodyTypes.length > 0 ? (
                driver.eligibleBodyTypes.map((type, index) => (
                  <Badge key={index} variant="info">
                    {type}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  No body types specified
                </span>
              )}
            </div>
          </div>

          {/* Eligible Gear Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preffered Gear Types:
            </label>
            <div className="flex flex-wrap gap-2">
              {driver?.eligibleGearTypes &&
              driver.eligibleGearTypes.length > 0 ? (
                driver.eligibleGearTypes.map((type, index) => (
                  <Badge key={index} variant="info">
                    {type}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  No gear types specified
                </span>
              )}
            </div>
          </div>

          {/* License Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Category:
            </label>
            <div>
              {driver?.licenceCategory ? (
                <Badge variant="success">{driver.licenceCategory}</Badge>
              ) : (
                <span className="text-sm text-gray-500">N/A</span>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
