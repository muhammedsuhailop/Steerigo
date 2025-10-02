import React from 'react';
import { Badge } from '@/shared/components/ui';
import type { Driver } from '@/features/admin/shared/types';

interface VehicleDetailsProps {
  driver: Driver;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({ driver }) => {

  type VehicleType = 'Sedan' | 'SUV' | 'Hatchback';

const getVehicleTypeBadge = (type: VehicleType) => {
  const typeConfig: Record<VehicleType, { variant: 'outline'; text: string }> = {
    Sedan: { variant: 'outline', text: 'Sedan' },
    SUV: { variant: 'outline', text: 'SUV' },
    Hatchback: { variant: 'outline', text: 'Hatchback' },
  };

  const config = typeConfig[type];
  return <Badge variant={config.variant}>{config.text}</Badge>;
};

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>

      <div className="space-y-4">
        {/* Vehicle Types */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Eligible Vehicle Types</h4>
          <div className="flex flex-wrap gap-2">
            {driver.eligibleVehicleType.length > 0 ? (
              driver.eligibleVehicleType.map((type) => (
                <React.Fragment key={type}>
                  {getVehicleTypeBadge(type as VehicleType)}
                </React.Fragment>
              ))
            ) : (
              <span className="text-sm text-gray-500">No vehicle types available</span>
            )}
          </div>
        </div>

        {/* Gear Types */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Eligible Gear Types</h4>
          <div className="flex flex-wrap gap-2">
            {driver.eligibleGearType.length > 0 ? (
              driver.eligibleGearType.map((gear) => (
                <Badge key={gear} variant="outline">
                  {gear}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">No gear types available</span>
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{driver.totalRides}</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{driver.rating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Status Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Driver Status:</span>
              <Badge
                variant={
                  driver.status === 'Active'
                    ? 'success'
                    : driver.status === 'InReview'
                    ? 'warning'
                    : driver.status === 'Blocked'
                    ? 'danger'
                    : 'secondary'
                }
              >
                {driver.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">KYC Status:</span>
              <Badge
                variant={
                  driver.kycStatus === 'Verified'
                    ? 'success'
                    : driver.kycStatus === 'Pending'
                    ? 'warning'
                    : driver.kycStatus === 'Rejected'
                    ? 'danger'
                    : 'outline'
                }
                size="sm"
              >
                {driver.kycStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
