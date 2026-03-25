import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ApprovePayoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Approve Payout</h2>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to approve this payout request?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Approving..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovePayoutModal;
