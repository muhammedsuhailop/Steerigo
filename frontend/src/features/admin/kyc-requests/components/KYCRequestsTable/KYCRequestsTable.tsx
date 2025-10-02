import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Badge, Button } from "@/shared/components/ui";
import type { TableProps } from "@/shared/components/ui/Table/Table.types";
import type { KYCRequest, KYCAction } from "../../../shared/types";

interface KYCRequestsTableProps {
  requests: KYCRequest[];
  loading: boolean;
  onKYCAction: (kycId: string, action: KYCAction) => void;
  isActionLoading: (kycId: string) => boolean;
}

export const KYCRequestsTable: React.FC<KYCRequestsTableProps> = ({
  requests,
  loading,
  onKYCAction,
  isActionLoading,
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (isVerified: boolean) => {
    if (isVerified === null || isVerified === undefined) {
      return <Badge variant="warning">Pending</Badge>;
    }
    return isVerified ? (
      <Badge variant="success">Verified</Badge>
    ) : (
      <Badge variant="warning">Not Verified</Badge>
    );
  };

  const getActionButtons = (request: KYCRequest) => {
    const isLoading = isActionLoading(request.kycId);

    return (
      <div className="flex space-x-2">
        <Button
          size="xs"
          variant="outline"
          onClick={() => navigate(`/admin/kyc-requests/${request.kycId}`)}
        >
          View
        </Button>

        {request.isVerified === false && (
          <>
            <Button
              size="xs"
              variant="success"
              isLoading={isLoading}
              onClick={() => onKYCAction(request.kycId, "Approve")}
            >
              Approve
            </Button>
            <Button
              size="xs"
              variant="danger"
              isLoading={isLoading}
              onClick={() => onKYCAction(request.kycId, "Reject")}
            >
              Reject
            </Button>
          </>
        )}
      </div>
    );
  };

  const columns: TableProps<KYCRequest>["columns"] = [
    {
      key: "driverName",
      header: "Driver",
      render: (_, request) => (
        <div className="font-medium text-gray-900">{request.driverName}</div>
      ),
    },
    {
      key: "docType",
      header: "Document Type",
      render: (docType) => (
        <div className="text-sm text-gray-900">{docType}</div>
      ),
    },
    {
      key: "docNumber",
      header: "Document Number",
      render: (docNumber) => (
        <div className="text-sm text-gray-900">{docNumber}</div>
      ),
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
      render: (expiryDate) =>
        new Date(expiryDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "isVerified",
      header: "Status",
      render: (isVerified) => getStatusBadge(isVerified),
    },
    {
      key: "createdAt",
      header: "Submitted",
      render: (createdAt) =>
        new Date(createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "comments",
      header: "Comments",
      render: (comments) => (
        <div className="text-sm text-gray-900">{comments}</div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, request) => getActionButtons(request),
    },
  ];

  return (
    <Table
      columns={columns}
      data={requests}
      loading={loading}
      emptyMessage="No KYC requests found"
      striped
      hoverable
      onRowClick={(request) => navigate(`/admin/kyc-requests/${request.kycId}`)}
    />
  );
};
