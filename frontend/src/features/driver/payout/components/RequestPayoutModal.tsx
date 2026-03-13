import React, { useState } from "react";
import { RequestPayoutRequest } from "../types/payout.types";
import { useRequestPayoutMutation } from "../services/driverPayoutApi";
import { PayoutMethod } from "@/shared/types/payment.types";

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

interface FormErrors {
  amount?: string;
  beneficiaryName?: string;
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
}

const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
}) => {
  const [requestPayout, { isLoading }] = useRequestPayoutMutation();
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<RequestPayoutRequest>({
    amount: 0,
    method: PayoutMethod.BANK_TRANSFER,
    destination: {
      type: "BANK",
      accountNumber: "",
      ifsc: "",
      beneficiaryName: "",
      bankName: "",
    },
  });

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { amount, destination } = formData;

    if (amount <= 0) newErrors.amount = "Amount must be greater than 100";
    if (amount > availableBalance)
      newErrors.amount = "Insufficient wallet balance";

    if (!destination.beneficiaryName?.trim()) {
      newErrors.beneficiaryName = "Beneficiary name is required";
    }

    if (!/^\d{9,18}$/.test(destination.accountNumber ?? " ")) {
      newErrors.accountNumber = "Invalid account number (9-18 digits)";
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(destination.ifsc ?? " ")) {
      newErrors.ifsc = "Invalid IFSC format (e.g., SBIN0001234)";
    }

    if (!destination.bankName?.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await requestPayout(formData).unwrap();
      onClose();
    } catch (err) {
      console.error("Payout request failed", err);
    }
  };

  const inputClasses = (error?: string) => `
    w-full mt-1 border p-3 rounded-xl text-sm outline-none transition-all duration-200
    ${
      error
        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
        : "border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-100"
    }
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">Request Payout</h2>
          <p className="text-sm text-gray-500">
            Available: ₹{availableBalance.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Field */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Amount (₹)
            </label>
            <input
              type="number"
              className={inputClasses(errors.amount)}
              placeholder="0.00"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
            />
            {errors.amount && (
              <p className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                {errors.amount}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Beneficiary Name */}
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                Beneficiary Name
              </label>
              <input
                className={inputClasses(errors.beneficiaryName)}
                placeholder="Name as per bank records"
                value={formData.destination.beneficiaryName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destination: {
                      ...formData.destination,
                      beneficiaryName: e.target.value,
                    },
                  })
                }
              />
              {errors.beneficiaryName && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                  {errors.beneficiaryName}
                </p>
              )}
            </div>

            {/* Account Number */}
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                Account Number
              </label>
              <input
                className={inputClasses(errors.accountNumber)}
                placeholder="Enter account number"
                value={formData.destination.accountNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destination: {
                      ...formData.destination,
                      accountNumber: e.target.value,
                    },
                  })
                }
              />
              {errors.accountNumber && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                  {errors.accountNumber}
                </p>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                IFSC
              </label>
              <input
                className={inputClasses(errors.ifsc)}
                placeholder="SBIN0001234"
                value={formData.destination.ifsc}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destination: {
                      ...formData.destination,
                      ifsc: e.target.value.toUpperCase(),
                    },
                  })
                }
              />
              {errors.ifsc && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                  {errors.ifsc}
                </p>
              )}
            </div>

            {/* Bank Name */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                Bank Name
              </label>
              <input
                className={inputClasses(errors.bankName)}
                placeholder="e.g. HDFC Bank"
                value={formData.destination.bankName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destination: {
                      ...formData.destination,
                      bankName: e.target.value,
                    },
                  })
                }
              />
              {errors.bankName && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                  {errors.bankName}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {isLoading ? "Processing..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPayoutModal;
