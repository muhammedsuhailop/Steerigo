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
  const fare = `₹${request.fare || 0}`;
  const typeBadge =
    request.rideType?.toLowerCase() === "one way" ? (
      <Badge variant="info" size="sm">
        One Way
      </Badge>
    ) : (
      <Badge variant="secondary" size="sm">
        Round Trip
      </Badge>
    );

  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      {/* Header: Timer, Fare & Type */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {fare}
          </span>
          {typeBadge}
        </div>
      </div>

      {/* Passenger Info */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
            {getInitials(request.userName)}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {request.userName || "Unknown User"}
            </p>
          </div>
        </div>

        {/* Action Icons - Disabled since we don't have phone */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => console.log("Call feature coming soon")}
            variant="outline"
            size="icon"
            disabled
            className="opacity-50"
          >
            <FiPhone className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => console.log("Message", request.requestId)}
            variant="outline"
            size="icon"
            disabled
            className="opacity-50"
          >
            <FiMessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Route Information */}
      <div className="px-4 py-3 space-y-3">
        {/* Pickup */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Pickup
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
              {request.pickup?.address || "Address not available"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ETA: {request.pickupETA || "N/A"}
            </p>
          </div>
        </div>

        {/* Connector */}
        <div className="ml-4 border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-4"></div>

        {/* Drop-off */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Drop-off
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
              {request.drop?.address || "Address not available"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
        <Button
          onClick={() => onReject(request.requestId)}
          disabled={loading}
          variant="danger"
          size="md"
          className="flex-1 py-3"
        >
          Decline
        </Button>
        <Button
          onClick={() => onAccept(request.requestId)}
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
