import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import {
  FaCheckCircle,
  FaHourglass,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import type { DriverKYCStatusProps } from "../types/driverProfile.types";
import { URLS } from "@/shared/constants";

const STATUS_VARIANT: Record<
  string,
  "success" | "info" | "warning" | "danger" | "secondary"
> = {
  Verified: "success",
  InReview: "info",
  Pending: "warning",
  Rejected: "danger",
};

const getStatusIcon = (status: string) => {
  const iconProps = { size: 18 };
  switch (status) {
    case "Verified":
      return <FaCheckCircle {...iconProps} className="text-green-600" />;
    case "InReview":
      return <FaHourglass {...iconProps} className="text-blue-600" />;
    case "Pending":
      return <FaClock {...iconProps} className="text-yellow-500" />;
    case "Rejected":
      return <FaTimesCircle {...iconProps} className="text-red-600" />;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDocumentTypeDisplay = (docType: string) => {
  const typeMap: Record<string, string> = {
    Aadhaar: "Aadhaar Card",
    License: "Driving License",
    PAN: "PAN Card",
    DrivingLicense: "Driving License",
  };
  return typeMap[docType] || docType;
};

const getStatusMessage = (status: string) => {
  const messages: Record<string, string> = {
    Verified: "All documents verified and approved",
    InReview: "Documents are currently under review",
    Pending: "Awaiting document submission",
    Rejected: "Some documents need resubmission",
  };
  return messages[status] || "Unknown status";
};

const getFullImageUrl = (publicId: string): string => {
  return `${URLS.CLOUDINARY_BASE}${publicId}.jpg`;
};

export const DriverKYCStatus: React.FC<DriverKYCStatusProps> = ({
  kyc,
  isLoading = false,
}) => {
  const overallStatus = kyc?.overallStatus || "Pending";

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <h3 className="text-lg font-bold text-gray-900 mb-6">KYC Status</h3>

        {/* Overall Status */}
        <div className="mb-6">
          <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200">
            <div className="flex-shrink-0 pt-1">
              {getStatusIcon(overallStatus)}
            </div>
            <div className="flex-1 min-w-0">
              <Badge
                variant={STATUS_VARIANT[overallStatus] || "secondary"}
                size="sm"
                className="mb-1"
              >
                {overallStatus}
              </Badge>
              <p className="text-xs opacity-80 mt-1">
                {getStatusMessage(overallStatus)}
              </p>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Documents ({kyc?.docs?.length || 0})
          </h4>

          {kyc?.docs && kyc.docs.length > 0 ? (
            <div className="space-y-3">
              {kyc.docs.map((doc) => (
                <div
                  key={doc.docId}
                  className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  {/* Document Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 pt-0.5">
                        {getStatusIcon(doc.verificationStatus)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900">
                          {getDocumentTypeDisplay(doc.docType)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {doc.docNumberMasked}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        STATUS_VARIANT[doc.verificationStatus] || "secondary"
                      }
                      size="sm"
                      className="text-xs font-medium rounded-lg flex-shrink-0"
                    >
                      {doc.verificationStatus}
                    </Badge>
                  </div>

                  {/* Document Details */}
                  <div
                    className={`grid ${
                      doc.comments && String(doc.comments).trim() !== ""
                        ? "grid-cols-1 sm:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2"
                    } gap-3 mb-4 pt-4 border-t border-gray-100`}
                  >
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Issue Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(doc.issueDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Expiry Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(doc.expiryDate)}
                      </p>
                    </div>

                    {doc.comments && String(doc.comments).trim() !== "" && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Comments</p>
                        <p className="text-sm text-gray-800">
                          {String(doc.comments)}
                        </p>
                      </div>
                    )}
                  </div>

                  {(doc.docImageUrlsFront?.length > 0 ||
                    doc.docImageUrlsBack?.length > 0 ||
                    (doc as any).comments) && (
                    <div className="flex items-center gap-4 mt-2">
                      {doc.docImageUrlsFront?.map((url, idx) => (
                        <div
                          key={`front-${idx}`}
                          className="flex flex-col items-center"
                        >
                          <a
                            href={getFullImageUrl(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-20 h-14 rounded-lg overflow-hidden border border-blue-200 bg-blue-50 shadow hover:shadow-md transition"
                            title="Preview: Front"
                          >
                            <img
                              src={getFullImageUrl(url)}
                              alt="KYC Front"
                              className="w-full h-full object-cover"
                            />
                          </a>
                        </div>
                      ))}

                      {doc.docImageUrlsBack?.map((url, idx) => (
                        <div
                          key={`back-${idx}`}
                          className="flex flex-col items-center"
                        >
                          <a
                            href={getFullImageUrl(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-20 h-14 rounded-lg overflow-hidden border border-emerald-200 bg-emerald-50 shadow hover:shadow-md transition"
                            title="Preview: Back"
                          >
                            <img
                              src={getFullImageUrl(url)}
                              alt="KYC Back"
                              className="w-full h-full object-cover"
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaClock className="mx-auto text-gray-300 mb-2" size={24} />
              <p className="text-sm text-gray-600">
                No documents submitted yet
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
