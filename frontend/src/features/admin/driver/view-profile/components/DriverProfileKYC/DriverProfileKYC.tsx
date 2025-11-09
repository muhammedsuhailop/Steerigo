import React from "react";
import Card from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui";
import type {
  DriverProfileKYCProps,
  KYCVerificationStatus,
} from "../../../../shared/types/adminDriverProfile.types";

export const DriverProfileKYC: React.FC<DriverProfileKYCProps> = ({
  kycDocuments,
}) => {
  const getBadgeVariant = (status: KYCVerificationStatus) => {
    const variantMap = {
      Approved: "success" as const,
      InReview: "warning" as const,
      Rejected: "danger" as const,
      Expired: "secondary" as const,
    };
    return (variantMap as any)[status] || "secondary";
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

  if (!kycDocuments || kycDocuments.length === 0) {
    return (
      <Card>
        <Card.Header title="KYC Documents" />
        <Card.Body>
          <p className="text-gray-500 text-center py-8">
            No KYC documents found
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header title={`KYC Documents (${kycDocuments.length})`} />
      <Card.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kycDocuments.map((doc) => (
            <Card key={doc.id} className="border border-gray-200">
              <Card.Header className="bg-gray-50" title={doc.docType}>
                <Badge variant={getBadgeVariant(doc.verificationStatus)}>
                  {doc.verificationStatus}
                </Badge>
              </Card.Header>

              <Card.Body>
                <div className="space-y-2">
                  <Detail
                    label="Document Number"
                    value={doc.docNumber ?? "N/A"}
                  />
                  <Detail
                    label="Issue Date"
                    value={formatDate(doc.issueDate)}
                  />
                  <Detail
                    label="Expiry Date"
                    value={formatDate(doc.expiryDate)}
                  />
                  <Detail
                    label="Uploaded On"
                    value={formatDate(doc.createdAt)}
                  />
                  {doc.isExpired && (
                    <div className="pt-2">
                      <Badge variant="danger">Expired</Badge>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-1 text-sm">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-900 text-right">{value}</span>
    </div>
  );
}
