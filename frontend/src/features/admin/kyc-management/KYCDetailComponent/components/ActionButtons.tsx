import React, { useState } from "react";
import { Button } from "@/shared/components/ui";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { ConfirmationModal } from "@/shared/components/ui/ConfirmationModal";
import { Alert } from "@/shared/components/ui/Alert";

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

  const [approveModalOpen, setApproveModalOpen] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);

  const isPending = verificationStatus === "InReview";

  const handleApproveClick = () => {
    setApproveModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    try {
      await onAction("Approved");
      setApproveModalOpen(false);
    } catch (err: any) {
      setLocalError(
        err?.data?.message || err?.message || "Failed to approve KYC"
      );
      setApproveModalOpen(false);
    }
  };

  const handleRejectClick = () => {
    setLocalError(null);
    setRejectModal({ isOpen: true, reason: "" });
  };

  const handleConfirmReject = async () => {
    if (!rejectModal.reason.trim()) {
      setLocalError("Please provide a reason for rejection");
      return;
    }
    try {
      await onAction("Rejected", rejectModal.reason.trim());
      setRejectModal({ isOpen: false, reason: "" });
      setLocalError(null);
    } catch (err: any) {
      setLocalError(
        err?.data?.message || err?.message || "Failed to reject KYC"
      );
    }
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
            onClick={handleApproveClick}
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

      <ConfirmationModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Approve KYC Request"
        message="Are you sure you want to approve this KYC request?"
        confirmText="Approve"
        cancelText="Cancel"
        variant="success"
        isLoading={isLoading}
        size="md"
      />

      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject KYC Request
            </h3>

            {localError && (
              <div className="mb-4">
                <Alert
                  type="danger"
                  message={localError}
                  onClose={() => setLocalError(null)}
                />
              </div>
            )}

            <p className="text-gray-600 mb-2">
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
                onClick={() => {
                  setRejectModal({ isOpen: false, reason: "" });
                  setLocalError(null);
                }}
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
