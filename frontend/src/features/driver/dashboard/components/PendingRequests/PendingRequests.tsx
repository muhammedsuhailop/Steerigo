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
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Pending Requests
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No pending requests. Stay online to receive rides.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Pending Requests
      </h2>
      <div className="space-y-4">
        {requests.map((req) => (
          <RequestCard
            key={req.requestId}
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
