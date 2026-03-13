// Status registries and helpers

import React from "react";
import { Badge } from "@/shared/components/ui";
import type {
  StatusConfig,
  StatusBadgeRegistry,
} from "@/shared/components/ui/AdminTable/AdminTable.types";

//  Driver status mapping
export const DriverStatusRegistry: StatusBadgeRegistry = {
  InReview: { variant: "warning", text: "In Review" },
  Active: { variant: "success", text: "Active" },
  Blocked: { variant: "secondary", text: "Blocked" },
  Inactive: { variant: "secondary", text: "Inactive" },
  Suspended: { variant: "danger", text: "Suspended" },
};

//  KYC status mapping
export const KYCStatusRegistry: StatusBadgeRegistry = {
  InReview: { variant: "warning", text: "KYC In Review" },
  Approved: { variant: "success", text: "KYC Approved" },
  Rejected: { variant: "danger", text: "KYC Rejected" },
  Pending: { variant: "outline", text: "Pending" },
};

//  Driver badge mapping
export const DriverStatusBadgeRegistry: StatusBadgeRegistry = {
  Active: { variant: "success", text: "Active" },
  Suspended: { variant: "danger", text: "Suspended" },
  Inactive: { variant: "secondary", text: "Inactive" },
};

//  Document type colors
export const DocTypeColorRegistry: Record<string, string> = {
  License: "bg-blue-100 text-blue-800",
  "Driving License": "bg-blue-100 text-blue-800",
  PAN: "bg-purple-100 text-purple-800",
  Aadhaar: "bg-green-100 text-green-800",
  "Aadhaar Card": "bg-green-100 text-green-800",
  Passport: "bg-indigo-100 text-indigo-800",
  "Vehicle Registration": "bg-orange-100 text-orange-800",
  Insurance: "bg-cyan-100 text-cyan-800",
};

//  User status mapping
export const UserStatusRegistry: StatusBadgeRegistry = {
  Active: { variant: "success", text: "Active" },
  Inactive: { variant: "secondary", text: "Inactive" },
  Blocked: { variant: "danger", text: "Blocked" },
  Suspended: { variant: "warning", text: "Suspended" },
  Pending: { variant: "outline", text: "Pending" },
};

export const PayoutStatusRegistry: StatusBadgeRegistry = {
  REQUESTED: { variant: "warning", text: "Requested" },
  PENDING: { variant: "outline", text: "Processing" },
  COMPLETED: { variant: "success", text: "Paid" },
  FAILED: { variant: "danger", text: "Failed" },
};

//  Render status badge
export const renderStatusBadge = (
  status: string,
  registry: StatusBadgeRegistry,
  fallbackVariant: StatusConfig["variant"] = "secondary",
): React.ReactNode => {
  const config = registry[status];
  return (
    <Badge variant={config?.variant || fallbackVariant}>
      {config?.text || status}
    </Badge>
  );
};

//  Render document type badge
export const renderDocTypeBadge = (docType: string): React.ReactNode => {
  const colorClass =
    DocTypeColorRegistry[docType] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-block px-3 py-1 rounded text-sm font-medium ${colorClass}`}
    >
      {docType}
    </span>
  );
};

//  Create a custom status registry
export const createStatusRegistry = (
  baseRegistry: StatusBadgeRegistry,
  customStatuses: StatusBadgeRegistry = {},
): StatusBadgeRegistry => {
  return { ...baseRegistry, ...customStatuses };
};

//  Status helper utilities
export const StatusHelpers = {
  isPending: (status: string): boolean =>
    ["InReview", "Pending", "Processing"].includes(status),

  isApproved: (status: string): boolean =>
    ["Active", "Approved", "Success", "Complete"].includes(status),

  isBlocked: (status: string): boolean =>
    ["Blocked", "Rejected", "Suspended", "Error", "Failed"].includes(status),

  getStatusVariant: (
    status: string,
    registry: StatusBadgeRegistry,
  ): StatusConfig["variant"] => registry[status]?.variant || "secondary",

  getStatusText: (status: string, registry: StatusBadgeRegistry): string =>
    registry[status]?.text || status,
};

//  Batch process status list
export const processBatchStatuses = (
  statuses: string[],
  registry: StatusBadgeRegistry,
): Map<string, StatusConfig> => {
  const processed = new Map<string, StatusConfig>();

  for (const status of statuses) {
    processed.set(
      status,
      registry[status] || { variant: "secondary", text: status },
    );
  }

  return processed;
};
