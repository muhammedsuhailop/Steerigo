import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  loading?: boolean;
}

const RejectPayoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Reject Payout</h2>
          <p className="text-sm text-gray-500 mt-1">
            Please provide a reason for rejecting this payout request.
          </p>
        </div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectPayoutModal;
