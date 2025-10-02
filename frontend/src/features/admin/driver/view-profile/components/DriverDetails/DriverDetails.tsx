import React from 'react';
import { Badge } from '@/shared/components/ui';
import type { Driver, DocumentStatus } from '@/features/admin/shared/types';

interface DriverDetailsProps {
  driver: Driver;
}

export const DriverDetails: React.FC<DriverDetailsProps> = ({ driver }) => {
  const getDocumentStatusBadge = (status?: DocumentStatus['status']) => {
    if (!status) return null;

    const statusConfig = {
      Pending: { variant: 'warning' as const, text: 'Pending' },
      Approved: { variant: 'success' as const, text: 'Approved' },
      Rejected: { variant: 'danger' as const, text: 'Rejected' },
    };

    const config = statusConfig[status];

    return <Badge variant={config.variant} size="sm">{config.text}</Badge>;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Details</h3>

      <div className="space-y-4">
        {/* Personal Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Full Name:</span>
              <p className="font-medium">{driver.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{driver.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <p className="font-medium">{driver.mobile}</p>
            </div>
            <div>
              <span className="text-gray-500">Address:</span>
              <p className="font-medium">{driver.address || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500">City:</span>
              <p className="font-medium">{driver.city || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500">ZIP Code:</span>
              <p className="font-medium">{driver.zipCode || '-'}</p>
            </div>
          </div>
        </div>

        {/* License Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">License Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">License Number:</span>
              <p className="font-medium">{driver.licenseNumber}</p>
            </div>
            <div>
              <span className="text-gray-500">Expiry Date:</span>
              <p className="font-medium">
                {new Date(driver.licenseExpiryDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Activity Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Activity</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Trips:</span>
              <p className="font-medium">{driver.totalRides}</p>
            </div>
            <div>
              <span className="text-gray-500">Rating:</span>
              <p className="font-medium">{driver.rating.toFixed(1)} ★</p>
            </div>
            <div>
              <span className="text-gray-500">Join Date:</span>
              <p className="font-medium">
                {new Date(driver.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Last Active:</span>
              <p className="font-medium">
                {driver.lastRide ? new Date(driver.lastRide).toLocaleString() : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Document Status */}
        {driver.documents && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Document Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">License</span>
                {getDocumentStatusBadge(driver.documents.license?.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vehicle Registration</span>
                {getDocumentStatusBadge(driver.documents.registration?.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Insurance</span>
                {getDocumentStatusBadge(driver.documents.insurance?.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profile Photo</span>
                {getDocumentStatusBadge(driver.documents.profilePhoto?.status)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
