import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "@/shared/components/ui/AdminTable/AdminTable";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import {
  renderStatusBadge,
  renderDocTypeBadge,
  KYCStatusRegistry,
  DriverStatusBadgeRegistry,
} from "@/shared/components/ui/AdminTable/StatusRegistry";
import { Badge, Button } from "@/shared/components/ui";
import type { Column } from "@/shared/components/ui/Table";
import type { KYCRequest, KYCAction } from "../../../../shared/types";
import { MdVisibility } from "react-icons/md";

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
  isActionLoading,
}) => {
  const navigate = useNavigate();

  const columns: Column<KYCRequest>[] = React.useMemo(
    () => [
      {
        key: "driver",
        header: "Driver Details",
        render: (_, request) => (
          <div className="space-y-1">
            <p className="font-semibold text-gray-900 ">
              {request.driver.userName}
            </p>
            {renderStatusBadge(
              request.driver.driverStatus,
              DriverStatusBadgeRegistry
            )}
            <p className="text-sm text-gray-500 ">{request.driver.userEmail}</p>
            <p className="text-sm text-gray-500  flex items-center gap-1">
              {Formatters.formatPhoneNumber(request.driver.userMobile)}
            </p>
          </div>
        ),
        width: "220px",
      },
      {
        key: "docType",
        header: "Document Type",
        render: (_, request) => renderDocTypeBadge(request.kyc.docType),
        align: "center",
        width: "140px",
      },
      {
        key: "docNumber",
        header: "Document Number",
        render: (_, request) => {
          const frontCount = request.kyc.docImageUrlsFront?.length || 0;
          const backCount = request.kyc.docImageUrlsBack?.length || 0;
          const totalCount = frontCount + backCount;

          return (
            <div className="space-y-1">
              <p className="font-medium text-gray-900 ">
                {request.kyc.docNumber}
              </p>
              <p className="text-xs text-gray-500 ">{totalCount} image(s)</p>
            </div>
          );
        },
        width: "150px",
      },
      {
        key: "issueDate",
        header: "Issue Date",
        render: (_, request) => (
          <span className="text-sm text-gray-700 ">
            {Formatters.formatDate(request.kyc.issueDate)}
          </span>
        ),
        align: "center",
        width: "120px",
      },
      {
        key: "expiryDate",
        header: "Expiry Date",
        render: (_, request) =>
          Formatters.formatDateWithExpiry(request.kyc.expiryDate, true),
        align: "center",
        width: "140px",
      },
      {
        key: "verificationStatus",
        header: "Verification Status",
        render: (_, request) => {
          const statusBadge = renderStatusBadge(
            request.kyc.verificationStatus,
            KYCStatusRegistry
          );

          return (
            <div className="flex items-center gap-2">
              {statusBadge}
              {request.kyc.isExpired && <Badge variant="danger">Expired</Badge>}
            </div>
          );
        },
        align: "center",
        width: "180px",
      },
      {
        key: "createdAt",
        header: "Submitted On",
        render: (_, request) => (
          <span className="text-sm text-gray-700">
            {Formatters.formatDate(request.kyc.createdAt)}
          </span>
        ),
        align: "center",
        width: "120px",
      },
      {
        key: "actions",
        header: "Actions",
        render: (_, request) => {
          const isLoading = isActionLoading(request.kyc.id);

          return (
            <Button
              variant="primary"
              size="sm"
              isLoading={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/kyc-requests/${request.kyc.id}`);
              }}
              leftIcon={<MdVisibility />}
              title="View details"
            >
              View
            </Button>
          );
        },
        align: "center",
        width: "120px",
      },
    ],
    [navigate, isActionLoading]
  );

  return (
    <AdminTable
      data={requests}
      columns={columns}
      loading={loading}
      onRowClick={(request) =>
        navigate(`/admin/kyc-requests/${request.kyc.id}`)
      }
      emptyMessage="No KYC requests found"
      className="min-w-full"
    />
  );
};

export default KYCRequestsTable;
