import React from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import {
  FaCheckCircle,
  FaHourglass,
  FaTimesCircle,
  FaClock,
  FaPlus,
} from "react-icons/fa";
import { URLS } from "@/shared/constants";
import type {
  DriverKYCStatusExtendedProps,
  DriverKYCStatusProps,
} from "../types/driverProfile.types";

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

export const DriverKYCStatus: React.FC<DriverKYCStatusExtendedProps> = ({
  kyc,
  isLoading = false,
  onDocumentAdded,
  onAddKYCClick,
}) => {
  const overallStatus = kyc?.overallStatus || "Pending";

  return (
    <div className="p-6 sm:p-8">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">KYC Status</h3>
        <Button
          onClick={onAddKYCClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FaPlus size={16} />
          <span>Add Document</span>
        </Button>
      </div>

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
                <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-gray-100">
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
                </div>

                {/* Comments if exists */}
                {doc.comments && String(doc.comments).trim() !== "" && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-700 font-medium mb-1">
                      Comments
                    </p>
                    <p className="text-xs text-amber-600">
                      {String(doc.comments)}
                    </p>
                  </div>
                )}

                {/* Document Images */}
                {(doc.docImageUrlsFront?.length > 0 ||
                  doc.docImageUrlsBack?.length > 0) && (
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    {/* Front Images */}
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
                        <Badge
                          variant="info"
                          size="sm"
                          className="mt-1 text-xs"
                        >
                          Front
                        </Badge>
                      </div>
                    ))}

                    {/* Back Images */}
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
                        <Badge
                          variant="success"
                          size="sm"
                          className="mt-1 text-xs"
                        >
                          Back
                        </Badge>
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
            <p className="text-sm text-gray-600">No documents submitted yet</p>
            <Button
              onClick={onAddKYCClick}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
            >
              <FaPlus size={16} />
              Add Your First Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
