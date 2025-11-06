import React, { useState } from "react";
import { Button } from "@/shared/components/ui";
import { MdCheckCircle, MdCancel } from "react-icons/md";

interface ActionButtonsProps {
  kycId: string;
  verificationStatus: string;
  onAction: (
    action: "Approved" | "Rejected" | "Expired",
    reason?: string
  ) => Promise<void>;
  isLoading: boolean;
}

interface RejectModal {
  isOpen: boolean;
  reason: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  kycId,
  verificationStatus,
  onAction,
  isLoading,
}) => {
  const [rejectModal, setRejectModal] = useState<RejectModal>({
    isOpen: false,
    reason: "",
  });

  const isPending = verificationStatus === "InReview";

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this KYC?")) {
      return;
    }
    await onAction("Approved");
  };

  const handleRejectClick = () => {
    setRejectModal({ isOpen: true, reason: "" });
  };

  const handleConfirmReject = async () => {
    if (!rejectModal.reason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    await onAction("Rejected", rejectModal.reason);
    setRejectModal({ isOpen: false, reason: "" });
  };

  if (!isPending) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">
          This KYC request has already been{" "}
          <span className="font-semibold">
            {verificationStatus.toLowerCase()}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Take Action
        </h2>
        <div className="flex gap-3">
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            leftIcon={<MdCheckCircle />}
            className="bg-green-600 hover:bg-green-700 flex-1"
          >
            {isLoading ? "Processing..." : "Approve KYC"}
          </Button>
          <Button
            onClick={handleRejectClick}
            disabled={isLoading}
            leftIcon={<MdCancel />}
            className="bg-red-600 hover:bg-red-700 flex-1"
          >
            {isLoading ? "Processing..." : "Reject KYC"}
          </Button>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject KYC Request
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejection:
            </p>
            <textarea
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal({ ...rejectModal, reason: e.target.value })
              }
              rows={4}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRejectModal({ isOpen: false, reason: "" })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isLoading || !rejectModal.reason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;
