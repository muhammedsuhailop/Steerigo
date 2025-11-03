import React from "react";
import type { KYCDocumentDetail } from "../../../shared/types";

interface DocumentInfoProps {
  kyc: KYCDocumentDetail;
}

const DocumentInfo: React.FC<DocumentInfoProps> = ({ kyc }) => {
  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    return expiry < thirtyDaysFromNow && expiry > now;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Document Information
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide">
            Document Type
          </p>
          <p className="text-gray-900 font-medium">{kyc.docType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide">
            Document Number
          </p>
          <p className="text-gray-900 font-medium font-mono">{kyc.docNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide">
            Issue Date
          </p>
          <p className="text-gray-900">{formatDate(kyc.issueDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide">
            Expiry Date
          </p>
          <div className="flex items-center gap-2">
            <p className="text-gray-900">{formatDate(kyc.expiryDate)}</p>
            {kyc.isExpired && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                Expired
              </span>
            )}
            {isExpiringSoon(kyc.expiryDate) && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                Expiring Soon
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide">
            Submitted On
          </p>
          <p className="text-gray-900">{formatDate(kyc.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide">
            Last Updated
          </p>
          <p className="text-gray-900">{formatDate(kyc.updatedAt)}</p>
        </div>
      </div>

      {kyc.verificationStatus === "Rejected" && kyc.rejectionReason && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-800 font-semibold uppercase tracking-wide mb-1">
            Rejection Reason
          </p>
          <p className="text-red-700">{kyc.rejectionReason}</p>
        </div>
      )}

      {kyc.reviewedAt && kyc.reviewedBy && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-semibold uppercase tracking-wide mb-2">
            Review Information
          </p>
          <div className="space-y-1">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Reviewed By:</span> {kyc.reviewedBy}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Reviewed At:</span>{" "}
              {formatDate(kyc.reviewedAt)}
            </p>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 pt-2 border-t">
        <p>
          Total Images:{" "}
          {(kyc.docImageUrlsFront?.length || 0) +
            (kyc.docImageUrlsBack?.length || 0)}
        </p>
      </div>
    </div>
  );
};

export default DocumentInfo;
