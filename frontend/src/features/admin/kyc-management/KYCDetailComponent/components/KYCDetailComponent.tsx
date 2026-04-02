import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetKYCByIdQuery,
  useUpdateKYCStatusMutation,
} from "../../../shared/services/adminApi";
import {
  setSelectedKYC,
  selectSelectedKYC,
} from "../../../shared/store/adminKYCSlice";
import type { RootState } from "@/app/store/store";

import { LoadingSpinner } from "@/shared/components/ui";
import { Alert } from "@/shared/components/ui/Alert";
import DocumentInfo from "./DocumentInfo";
import ImageGallery from "./ImageGallery";
import ActionButtons from "./ActionButtons";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

interface KYCDetailComponentProps {
  requestId: string;
}

const KYCDetailComponent: React.FC<KYCDetailComponentProps> = ({
  requestId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedKYC = useSelector((state: RootState) =>
    selectSelectedKYC(state)
  );

  const {
    data: kycData,
    isLoading,
    error,
    refetch,
  } = useGetKYCByIdQuery(requestId, {
    skip: !requestId,
  });

  const [updateKYCStatus, { isLoading: isUpdating }] =
    useUpdateKYCStatusMutation();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (kycData?.data) {
      dispatch(setSelectedKYC(kycData.data));
    }
  }, [kycData, dispatch]);

  useEffect(() => {
    return () => {
      if (navTimeout.current) {
        clearTimeout(navTimeout.current);
      }
    };
  }, []);

  const handleKYCAction = async (
    action: "Approved" | "Rejected" | "Expired",
    reason?: string
  ) => {
    try {
      const _result = await updateKYCStatus({
        requestId,
        action,
        reason,
      }).unwrap();

      await refetch();

      setSuccessMsg("KYC status updated successfully.");

      navTimeout.current = setTimeout(() => {
        setSuccessMsg(null);
        navigate("/admin/kyc-requests");
      }, 1200);
    } catch (err: unknown) {
      console.error("KYC action failed:", err);
      const msg = getErrorMessage(err, "Failed to update KYC status");
      setErrorMsg(msg);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !selectedKYC) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-700 mb-4">Failed to load KYC request details</p>
        <button
          onClick={() => navigate("/admin/kyc-requests")}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Back to KYC Requests
        </button>
      </div>
    );
  }

  const { kyc, driver } = selectedKYC;

  return (
    <div className="space-y-6">
      {/* Alerts (success / error) */}
      <div className="max-w-3xl">
        {successMsg && (
          <Alert
            type="success"
            message={successMsg}
            onClose={() => setSuccessMsg(null)}
            className="mb-4"
          />
        )}
        {errorMsg && (
          <Alert
            type="danger"
            message={errorMsg}
            onClose={() => setErrorMsg(null)}
            className="mb-4"
          />
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/kyc-requests")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to KYC Requests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            KYC Request Details
          </h1>
          <p className="text-gray-600 text-sm mt-1">Document ID: {kyc.id}</p>
        </div>

        {/* Status Badge */}
        <div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              kyc.verificationStatus === "Approved"
                ? "bg-green-100 text-green-800"
                : kyc.verificationStatus === "Rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {kyc.verificationStatus}
          </span>
        </div>
      </div>

      {/* Driver Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Driver Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Name
              </p>
              <p className="text-gray-900 font-medium">{driver.userName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Email
              </p>
              <p className="text-gray-900 break-all">{driver.userEmail}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Phone
              </p>
              <p className="text-gray-900">{driver.userMobile}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Driver ID
              </p>
              <p className="text-gray-900 font-mono text-sm">
                {driver.driverId}
              </p>
            </div>
            <div className="pt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  driver.driverStatus === "Active"
                    ? "bg-green-100 text-green-800"
                    : driver.driverStatus === "Suspended"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {driver.driverStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Document Info Card */}
        <div className="lg:col-span-2">
          <DocumentInfo kyc={kyc} />
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Document Images
        </h2>
        <ImageGallery
          frontImages={kyc.docImageUrlsFront || []}
          backImages={kyc.docImageUrlsBack || []}
          docType={kyc.docType}
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons
        kycId={kyc.id}
        verificationStatus={kyc.verificationStatus}
        onAction={handleKYCAction}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default KYCDetailComponent;
