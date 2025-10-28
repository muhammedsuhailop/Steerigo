import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Badge, Button } from "@/shared/components/ui";
import type { TableProps } from "@/shared/components/ui/Table/Table.types";
import type { KYCRequest, KYCAction } from "../../../../shared/types";
import {
  MdVisibility,
  MdCheckCircle,
  MdCancel,
  MdDescription,
  MdCalendarToday,
  MdPhone,
  MdEmail,
} from "react-icons/md";

interface KYCRequestsTableProps {
  requests: KYCRequest[];
  loading: boolean;
  onKYCAction: (
    kycId: string,
    action: KYCAction,
    reason?: string
  ) => Promise<void>;
  isActionLoading: (kycId: string) => boolean;
}

export const KYCRequestsTable: React.FC<KYCRequestsTableProps> = ({
  requests,
  loading,
  onKYCAction,
  isActionLoading,
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (verificationStatus: string) => {
    switch (verificationStatus) {
      case "Approved":
        return (
          <Badge variant="success" className="font-medium">
            Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="danger" className="font-medium">
            Rejected
          </Badge>
        );
      case "InReview":
      default:
        return (
          <Badge variant="warning" className="font-medium">
            In Review
          </Badge>
        );
    }
  };

  const getDriverStatusBadge = (driverStatus: string) => {
    switch (driverStatus) {
      case "Active":
        return (
          <Badge variant="success" size="sm">
            Active
          </Badge>
        );
      case "Suspended":
        return (
          <Badge variant="danger" size="sm">
            Suspended
          </Badge>
        );
      case "Inactive":
      default:
        return (
          <Badge variant="secondary" size="sm">
            Inactive
          </Badge>
        );
    }
  };

  const getDocTypeBadge = (docType: string) => {
    const docTypeColors: Record<string, string> = {
      License: "bg-blue-100 text-blue-800",
      "Driving License": "bg-blue-100 text-blue-800",
      PAN: "bg-purple-100 text-purple-800",
      Aadhaar: "bg-green-100 text-green-800",
      "Aadhaar Card": "bg-green-100 text-green-800",
      Passport: "bg-indigo-100 text-indigo-800",
      "Vehicle Registration": "bg-orange-100 text-orange-800",
      Insurance: "bg-cyan-100 text-cyan-800",
    };

    const colorClass = docTypeColors[docType] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        <MdDescription className="mr-1 h-3 w-3" />
        {docType}
      </span>
    );
  };

  const formatDate = (date: string | null, isExpiryDate = false) => {
    if (!date) {
      return <span className="text-sm text-gray-400">No Expiry</span>;
    }

    const dateObj = new Date(date);
    const now = Date.now();
    const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;

    const isExpired = isExpiryDate && dateObj.getTime() < now;
    const isExpiringSoon =
      isExpiryDate &&
      dateObj.getTime() > now &&
      dateObj.getTime() < thirtyDaysFromNow;

    return (
      <div className="flex items-center space-x-1">
        <MdCalendarToday
          className={`h-3.5 w-3.5 ${
            isExpired
              ? "text-red-600"
              : isExpiringSoon
              ? "text-orange-500"
              : "text-gray-400"
          }`}
        />
        <span
          className={`text-sm ${
            isExpired
              ? "text-red-700 font-semibold"
              : isExpiringSoon
              ? "text-orange-600 font-medium"
              : "text-gray-700"
          }`}
        >
          {dateObj.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          {isExpired && (
            <span className="ml-1 text-xs font-normal">(Expired)</span>
          )}
          {isExpiringSoon && (
            <span className="ml-1 text-xs font-normal">(Soon)</span>
          )}
        </span>
      </div>
    );
  };

  const getActionButtons = (request: KYCRequest) => {
    const isLoading = isActionLoading(request.kyc.id);
    const isPending = request.kyc.verificationStatus === "InReview";

    return (
      <div className="flex items-center space-x-2">
        <Button
          size="xs"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/kyc-requests/${request.kyc.id}`);
          }}
          leftIcon={<MdVisibility />}
          className="!px-3"
          title="View details"
        >
          View
        </Button>

        {isPending && (
          <>
            <Button
              size="xs"
              variant="success"
              isLoading={isLoading}
              disabled={isLoading}
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await onKYCAction(request.kyc.id, "approve");
                } catch (error) {
                  console.error("Approve action failed:", error);
                }
              }}
              leftIcon={!isLoading ? <MdCheckCircle /> : undefined}
              className="!px-3"
              title="Approve KYC"
            >
              Approve
            </Button>
            <Button
              size="xs"
              variant="danger"
              isLoading={isLoading}
              disabled={isLoading}
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await onKYCAction(request.kyc.id, "reject");
                } catch (error) {
                  console.error("Reject action failed:", error);
                }
              }}
              leftIcon={!isLoading ? <MdCancel /> : undefined}
              className="!px-3"
              title="Reject KYC"
            >
              Reject
            </Button>
          </>
        )}
      </div>
    );
  };

  const getDocumentCount = (request: KYCRequest) => {
    const frontCount = request.kyc.docImageUrlsFront?.length || 0;
    const backCount = request.kyc.docImageUrlsBack?.length || 0;
    return frontCount + backCount;
  };

  const columns: TableProps<KYCRequest>["columns"] = [
    {
      key: "driver",
      header: "Driver Details",
      render: (_, request) => (
        <div className="flex flex-col space-y-1 py-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">
              {request.driver.userName}
            </span>
            {getDriverStatusBadge(request.driver.driverStatus)}
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <MdEmail className="h-3 w-3" />
            <span>{request.driver.userEmail}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <MdPhone className="h-3 w-3" />
            <span>{request.driver.userMobile}</span>
          </div>
        </div>
      ),
    },
    {
      key: "docType",
      header: "Document Type",
      render: (_, request) => getDocTypeBadge(request.kyc.docType),
    },
    {
      key: "docNumber",
      header: "Document Number",
      render: (_, request) => (
        <div className="flex flex-col">
          <span className="text-sm font-mono text-gray-900 font-medium">
            {request.kyc.docNumber}
          </span>
          <span className="text-xs text-gray-500">
            {getDocumentCount(request)} image(s)
          </span>
        </div>
      ),
    },
    {
      key: "issueDate",
      header: "Issue Date",
      render: (_, request) => formatDate(request.kyc.issueDate),
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
      render: (_, request) => formatDate(request.kyc.expiryDate, true),
    },
    {
      key: "verificationStatus",
      header: "Verification Status",
      render: (_, request) => (
        <div className="flex flex-col space-y-1">
          {getStatusBadge(request.kyc.verificationStatus)}
          {request.kyc.isExpired && (
            <Badge variant="danger" size="sm">
              Expired
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Submitted On",
      render: (_, request) => (
        <div className="text-sm text-gray-600">
          {formatDate(request.kyc.createdAt)}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, request) => getActionButtons(request),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table
        columns={columns}
        data={requests}
        loading={loading}
        emptyMessage="No KYC requests found. All requests will appear here once submitted."
        striped
        hoverable
        onRowClick={(request) =>
          navigate(`/admin/kyc-requests/${request.kyc.id}`)
        }
        className="min-w-full"
      />
    </div>
  );
};
