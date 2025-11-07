import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";
import type { LicenseInfoProps } from "../types/driverProfile.types";

export const DriverLicenseInfo: React.FC<LicenseInfoProps> = ({
  license,
  isVerified,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpired = new Date(license.licenseExpiryDate) < new Date();

  const daysUntilExpiry = Math.ceil(
    (new Date(license.licenseExpiryDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const getExpiryVariant = () => {
    if (isExpired) return "danger";
    if (daysUntilExpiry <= 30) return "warning";
    return "success";
  };

  const formatDuration = (days: number): string => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);

    if (parts.length === 0) parts.push("1 month");

    return parts.join(" ");
  };

  const expiryLabel = isExpired
    ? "Expired"
    : daysUntilExpiry <= 30
    ? `Expiring in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""}`
    : `Expires in ${formatDuration(daysUntilExpiry)}`;

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Driving License</h3>
            <p className="text-xs text-gray-500 mt-1">
              {license.licenseNumber || "N/A"}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={getExpiryVariant()} size="md" className="text-sm">
              {expiryLabel}
            </Badge>
            {isVerified && (
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                <FaCheckCircle size={14} />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              License Number
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {license.licenseNumber}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Category
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {license.licenceCategory}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Issue Date
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(license.licenseIssueDate)}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold opacity-80 uppercase tracking-wide mb-2">
              Expiry Date
            </p>
            <p className="text-sm font-semibold">
              {formatDate(license.licenseExpiryDate)}
            </p>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-slate-50 rounded-xl p-4 border border-gray-100 mb-6">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Verification Status
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isVerified ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span className="text-sm text-gray-700 font-medium">
                {isVerified ? "Verified" : "Pending Verification"}
              </span>
            </div>
            <span className="text-xs text-gray-600">
              {isExpired ? "Expired" : ""}
            </span>
          </div>
        </div>

        {/* Warnings */}
        {isExpired && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3">
            <FaExclamationTriangle
              className="text-rose-600 flex-shrink-0 mt-0.5"
              size={18}
            />
            <div>
              <p className="font-semibold text-rose-900 text-sm mb-1">
                License Expired
              </p>
              <p className="text-xs text-rose-700">
                Your driving license has expired. Please renew it to continue
                driving.
              </p>
            </div>
          </div>
        )}

        {!isExpired && daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <FaCalendarAlt
              className="text-amber-600 flex-shrink-0 mt-0.5"
              size={18}
            />
            <div>
              <p className="font-semibold text-amber-900 text-sm mb-1">
                License Expiring Soon
              </p>
              <p className="text-xs text-amber-700">
                Your driving license will expire in {daysUntilExpiry} day
                {daysUntilExpiry !== 1 ? "s" : ""}. Please renew it before
                expiry.
              </p>
            </div>
          </div>
        )}

        {!isExpired && daysUntilExpiry > 30 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
            <FaCheckCircle
              className="text-emerald-600 flex-shrink-0 mt-0.5"
              size={18}
            />
            <div>
              <p className="font-semibold text-emerald-900 text-sm mb-1">
                License Valid
              </p>
              <p className="text-xs text-emerald-700">
                Your driving license is valid for{" "}
                {formatDuration(daysUntilExpiry)}.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
