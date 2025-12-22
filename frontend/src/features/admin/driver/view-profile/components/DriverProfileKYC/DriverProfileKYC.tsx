import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/shared/components/ui/Card";
import { Badge, Button } from "@/shared/components/ui";
import type {
  DriverProfileKYCProps,
  KYCStatus,
  KYCVerificationStatus,
} from "../../../../shared/types/adminDriverProfile.types";

interface ExtendedDriverProfileKYCProps extends DriverProfileKYCProps {
  overallStatus?: KYCStatus;
  onMarkAsApproved?: () => void;
  isUpdatingKYC?: boolean;
}

export const DriverProfileKYC: React.FC<ExtendedDriverProfileKYCProps> = ({
  kycDocuments,
  overallStatus,
  onMarkAsApproved,
  isUpdatingKYC = false,
}) => {
  const navigate = useNavigate();

  type BadgeVariant = "success" | "warning" | "danger" | "secondary" | "info";

  const getBadgeVariant = (
    status: KYCVerificationStatus | KYCStatus
  ): BadgeVariant => {
    const variantMap: Record<KYCVerificationStatus | KYCStatus, BadgeVariant> =
      {
        Approved: "success",
        InReview: "warning",
        Rejected: "danger",
        Expired: "secondary",
        Pending: "warning",
      };

    return variantMap[status] ?? "secondary";
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = (kycId: string) => {
    navigate(`/admin/kyc-requests/${kycId}`);
  };

  if (!kycDocuments || kycDocuments.length === 0) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="info">Total Documents: 0</Badge>
              {overallStatus && (
                <Badge variant={getBadgeVariant(overallStatus)}>
                  {overallStatus}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-center text-gray-500">No KYC documents found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="info">Total Documents: {kycDocuments.length}</Badge>
            {overallStatus && (
              <Badge variant={getBadgeVariant(overallStatus)}>
                {overallStatus}
              </Badge>
            )}
          </div>

          {onMarkAsApproved && overallStatus !== "Approved" && (
            <Button
              variant="success"
              size="sm"
              onClick={onMarkAsApproved}
              disabled={isUpdatingKYC}
            >
              {isUpdatingKYC ? "Updating..." : "Mark as Approved"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kycDocuments.map((doc) => (
            <Card key={doc.id} className="border border-gray-200">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{doc.docType}</h4>
                    <p className="text-sm text-gray-600">
                      Doc Number:{" "}
                      <span className="font-mono">
                        {doc.docNumber || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getBadgeVariant(doc.verificationStatus)}>
                      {doc.verificationStatus}
                    </Badge>
                    {doc.isExpired && <Badge variant="danger">Expired</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <Detail
                    label="Issue Date"
                    value={formatDate(doc.issueDate)}
                  />
                  <Detail
                    label="Expiry Date"
                    value={formatDate(doc.expiryDate)}
                  />
                  <Detail
                    label="Created At"
                    value={formatDate(doc.createdAt)}
                  />
                  <Detail
                    label="Updated At"
                    value={formatDate(doc.updatedAt)}
                  />
                </div>

                {doc.comments && (
                  <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">Comments:</span>{" "}
                      {doc.comments}
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewDetails(doc.id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}:</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
