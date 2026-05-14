import React from "react";
import { FutureRideRequestCard } from "./FutureRideRequestCard";
import type { FutureRideRequestsListProps } from "../types/rideRequests.types";
import { FutureRideRequestStatus } from "@/shared/types/ride.types";

export const FutureRideRequestsList: React.FC<FutureRideRequestsListProps> = ({
  requests,
  isLoading,
  onAccept,
  acceptingRequestId,
  unavailableRequestIds,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-200 p-5 animate-pulse"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-200 rounded-2xl" />

                <div>
                  <div className="h-5 w-40 bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>
              </div>

              <div className="h-8 w-24 bg-slate-200 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="h-24 bg-slate-200 rounded-2xl" />
              <div className="h-24 bg-slate-200 rounded-2xl" />
            </div>

            <div className="h-40 bg-slate-200 rounded-2xl mb-5" />

            <div className="h-12 w-full bg-slate-200 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl min-h-[500px] flex items-center justify-center p-10">
        <div className="text-center">
          <p className="text-lg font-black text-slate-700">
            No Scheduled Requests
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Upcoming scheduled requests rides will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {requests.map((request) => (
        <FutureRideRequestCard
          key={request.requestId}
          request={request}
          onAccept={onAccept}
          isAccepting={acceptingRequestId === request.requestId}
          isUnavailable={unavailableRequestIds.has(request.requestId)}
          isAccepted={request.status === FutureRideRequestStatus.ACCEPTED}
        />
      ))}
    </div>
  );
};
