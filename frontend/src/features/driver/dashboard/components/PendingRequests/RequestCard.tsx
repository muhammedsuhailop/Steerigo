import React, { useState } from "react";
import { Button, Badge } from "@/shared/components/ui";
import { RequestTimer } from "./RequestTimer";
import type { RequestCardProps } from "./RequestCard.types";
import { FiMessageSquare, FiPhone } from "react-icons/fi";

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onAccept,
  onReject,
  loading = false,
}) => {
  const [expired, setExpired] = useState(false);
  const handleExpire = () => {
    setExpired(true);
    onReject(request.id);
  };

  if (expired) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 opacity-60 text-center">
        <p className="text-gray-500">Request Expired</p>
      </div>
    );
  }

  const fare = `₹${request.estimatedFare}`;
  const typeBadge =
    request.rideType === "oneway" ? (
      <Badge variant="outline" size="sm">
        One Way
      </Badge>
    ) : (
      <Badge variant="outline" size="sm">
        Round Trip
      </Badge>
    );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition">
      {/* Header: Timer, Fare & Type */}
      <div className="flex items-center justify-between mb-4">
        <RequestTimer initialTime={30} onTimeUp={handleExpire} />
        <div className="flex items-center space-x-3">
          <div className="text-lg font-bold text-gray-900">{fare}</div>
          {typeBadge}
        </div>
      </div>

      {/* Passenger & Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center ring-2 ring-blue-50">
            <span className="text-blue-700 font-semibold">
              {request.passengerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {request.passengerName}
            </h3>
            <p className="text-sm text-gray-600">{request.passengerPhone}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => console.log("Call", request.passengerPhone)}
            variant="outline"
            size="icon"
          >
            <FiPhone className="w-5 h-5 text-gray-600" />
          </Button>

          <Button
            onClick={() => console.log("Message", request.id)}
            variant="outline"
            size="icon"
          >
            <FiMessageSquare className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Combined Route & ETAs */}
      <div className="space-y-4 mb-6">
        {/* Pickup */}
        <div className="flex items-start space-x-3">
          <span className="w-3 h-3 bg-emerald-400 rounded-full mt-1 ring-2 ring-emerald-100 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Pickup</p>
            <p className="text-sm text-gray-600">
              {request.pickupLocation.address}
            </p>
            <p className="text-xs text-gray-400">
              ETA: {request.estimatedDuration} min ({request.distance} km)
            </p>
          </div>
        </div>
        {/* Connector */}
        <div className="ml-2 border-l-2 border-dashed border-gray-300 h-4" />
        {/* Drop-off */}
        <div className="flex items-start space-x-3">
          <span className="w-3 h-3 bg-red-400 rounded-full mt-1 ring-2 ring-red-100 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Drop-off</p>
            <p className="text-sm text-gray-600">
              {request.dropoffLocation.address}
            </p>
            <p className="text-xs text-gray-400">
              Arrive in ~{request.estimatedDuration + 5} min
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button
          onClick={() => onReject(request.id)}
          disabled={loading}
          variant="danger"
          size="md"
          className="flex-1 py-3"
        >
          Decline
        </Button>
        <Button
          onClick={() => onAccept(request.id)}
          disabled={loading}
          variant="success"
          size="md"
          className="flex-1 py-3"
        >
          Accept
        </Button>
      </div>
    </div>
  );
};
