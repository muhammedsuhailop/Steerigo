import React from "react";
import { RideRequestCard } from "./RideRequestCard";
import type { RideRequestsListProps } from "../types/rideRequests.types";

export const RideRequestsList: React.FC<RideRequestsListProps> = ({
  requests,
  isLoading,
  onAccept,
  onReject,
  acceptingRequestId,
  rejectingRequestId,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-5 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
            <div className="space-y-3 mb-4">
              <div className="h-16 bg-gray-200 rounded" />
              <div className="h-16 bg-gray-200 rounded" />
            </div>
            <div className="h-20 bg-gray-200 rounded mb-4" />
            <div className="flex gap-3">
              <div className="h-10 flex-1 bg-gray-200 rounded" />
              <div className="h-10 flex-1 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {requests.map((request) => (
        <RideRequestCard
          key={request.requestId}
          request={request}
          onAccept={onAccept}
          onReject={onReject}
          isAccepting={acceptingRequestId === request.requestId}
          isRejecting={rejectingRequestId === request.requestId}
        />
      ))}
    </div>
  );
};
