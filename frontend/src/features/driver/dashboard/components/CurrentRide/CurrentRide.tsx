import React from "react";
import { Button, Badge } from "@/shared/components/ui";
import type { CurrentRideProps } from "./CurrentRide.types";
import { FiMessageSquare, FiPhone } from "react-icons/fi";

export const CurrentRide: React.FC<CurrentRideProps> = ({
  ride,
  onUpdateStatus,
  loading = false,
  className = "",
}) => {
  const statusMap: Record<string, string> = {
    accepted: "text-blue-600 bg-blue-50",
    pickup: "text-yellow-600 bg-yellow-50",
    ongoing: "text-green-600 bg-green-50",
    completed: "text-emerald-600 bg-emerald-50",
    cancelled: "text-red-600 bg-red-50",
  };

  const nextAction =
    {
      accepted: { label: "Arrived at Pickup", action: "pickup" as const },
      pickup: { label: "Start Trip", action: "ongoing" as const },
      ongoing: { label: "Complete Trip", action: "completed" as const },
    }[ride.status as "accepted" | "pickup" | "ongoing"] ?? null;

  const fmt = (t: string) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Current Ride</h2>
        <Badge variant="outline" size="sm" className={statusMap[ride.status]}>
          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </Badge>
      </div>

      {/* Passenger & Contact */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center ring-2 ring-blue-50">
            <span className="text-blue-700 font-semibold">
              {ride.passengerName
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
          </div>
          <div>
            <h3 className="text-gray-900 font-medium">{ride.passengerName}</h3>
            <p className="text-sm text-gray-600">{ride.passengerPhone}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FiPhone className="w-4 h-4" />}
          >
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FiMessageSquare className="w-4 h-4" />}
          >
            Chat
          </Button>
        </div>
      </div>

      {/* Route & ETAs */}
      <div className="space-y-4 px-6 mb-4">
        {[
          {
            label: "Pickup",
            addr: ride.pickupLocation.address,
            eta: ride.actualPickupTime
              ? fmt(ride.actualPickupTime)
              : fmt(ride.startTime),
            color: "emerald",
          },
          {
            label: "Drop-off",
            addr: ride.dropoffLocation.address,
            eta: ride.estimatedArrival ? fmt(ride.estimatedArrival) : "—",
            color: "red",
          },
        ].map((s, i, arr) => (
          <div key={i} className="flex items-start space-x-3 relative">
            <div className="flex flex-col items-center">
              <span
                className={`w-3 h-3 rounded-full mt-1 ring-2 ring-${s.color}-100 bg-${s.color}-400 shrink-0`}
              />
              {/* Connector*/}
              {i < arr.length - 1 && (
                <div className="w-px h-6 border-l-2 border-dashed border-gray-300 mt-1" />
              )}
            </div>

            {/* Text content */}
            <div>
              <p className="text-sm font-medium text-gray-900">{s.label}</p>
              <p className="text-sm text-gray-600">{s.addr}</p>
              <p className="text-xs text-gray-500 mt-1">ETA: {s.eta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 px-6 mb-4 bg-gray-50 py-4">
        {[
          { title: "Fare", value: `₹${ride.fare}`, color: "emerald" },
          { title: "Distance", value: `${ride.distance}km`, color: "blue" },
          { title: "Duration", value: `${ride.duration}m`, color: "purple" },
        ].map((c, i) => (
          <div
            key={i}
            className={`text-center p-4 bg-${c.color}-50 rounded-lg border border-${c.color}-200`}
          >
            <p className={`text-xl font-bold text-${c.color}-700`}>{c.value}</p>
            <p className={`text-xs text-${c.color}-600 mt-1`}>{c.title}</p>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Payment Method</p>
          <p className="font-medium text-gray-900 capitalize">
            {ride.paymentMethod}
          </p>
        </div>

        {/* Bottom Actions */}
        {nextAction && (
          <div className="flex-1 flex space-x-3 justify-end">
            <Button
              variant="primary"
              onClick={() => onUpdateStatus(ride.id, nextAction.action)}
              disabled={loading}
              className="py-2 px-4"
            >
              {nextAction.label}
            </Button>
            <Button
              variant="danger"
              onClick={() => onUpdateStatus(ride.id, "cancelled")}
              disabled={loading}
              className="py-2 px-4"
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              onClick={() => console.log("View Details")}
              className="py-2 px-4 border border-gray-200 hover:bg-gray-100"
            >
              View Details
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
