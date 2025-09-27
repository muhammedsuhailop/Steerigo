import React from "react";
import { RequestCard } from "./RequestCard";
import type { PendingRequestsProps } from "./PendingRequests.types";

export const PendingRequests: React.FC<PendingRequestsProps> = ({
  requests,
  onAccept,
  onReject,
  loading = false,
  className = "",
}) => {
  if (!requests.length) {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center ${className}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Pending Requests
        </h2>
        <p className="text-gray-500">
          No pending requests. Stay online to receive rides.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req) => (
          <RequestCard
            key={req.id}
            request={req}
            onAccept={onAccept}
            onReject={onReject}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};
