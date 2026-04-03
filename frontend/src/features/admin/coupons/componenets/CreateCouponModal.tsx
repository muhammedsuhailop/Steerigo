import React, { useState } from "react";
import { Modal, Button, Input, Alert } from "@/shared/components/ui";
import {
  CreateCouponRequest,
  CouponFormErrors,
  CouponDiscountType,
} from "../types/coupon.types";
import { useAddCouponMutation } from "../services/adminCouponApi";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const initialState: CreateCouponRequest = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  maxDiscount: "",
  minRideAmount: "",
  usageLimit: "",
  usagePerUser: 1,
  validFrom: "",
  validTo: "",
};

export const CreateCouponModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CreateCouponRequest>(initialState);
  const [errors, setErrors] = useState<CouponFormErrors>({});
  const [addCoupon, { isLoading }] = useAddCouponMutation();

  const validate = (): boolean => {
    const newErrors: CouponFormErrors = {};
    if (!formData.code.trim()) newErrors.code = "Coupon code is required";
    if (!formData.discountValue || formData.discountValue <= 0)
      newErrors.discountValue = "Value must be greater than 0";
    if (!formData.validFrom) newErrors.validFrom = "Start date is required";
    if (!formData.validTo) newErrors.validTo = "Expiry date is required";

    if (
      formData.validFrom &&
      formData.validTo &&
      new Date(formData.validFrom) >= new Date(formData.validTo)
    ) {
      newErrors.validTo = "Expiry must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue || 0),
        maxDiscount: Number(formData.maxDiscount || 0),
        minRideAmount: Number(formData.minRideAmount || 0),
        usageLimit: Number(formData.usageLimit || 0),
      };
      const response = await addCoupon(payload).unwrap();
      toast.success(response.message || "Coupon created successfully");
      setFormData(initialState);
      onClose();
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to create coupon");
    }
  };

  const handleChange = (
    name: keyof CreateCouponRequest,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleClear = () => {
    setFormData(initialState);
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Coupon"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Coupon Code"
            placeholder="e.g. RIDE50"
            value={formData.code}
            error={errors.code}
            onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Discount Type
            </label>
            <select
              className="border border-gray-300 rounded-lg p-2 text-sm h-[42px]"
              value={formData.discountType}
              onChange={(e) =>
                handleChange(
                  "discountType",
                  e.target.value as CouponDiscountType,
                )
              }
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FLAT">Fixed Amount (₹)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Discount Value"
            type="number"
            value={formData.discountValue}
            error={errors.discountValue}
            placeholder="Enter value"
            onChange={(e) =>
              handleChange(
                "discountValue",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          />
          <Input
            label="Max Discount (Cap)"
            type="number"
            value={formData.maxDiscount}
            placeholder="max discount"
            onChange={(e) =>
              handleChange(
                "maxDiscount",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          />
          <Input
            label="Min Ride Fare"
            type="number"
            value={formData.minRideAmount}
            placeholder="min fare amount"
            onChange={(e) =>
              handleChange(
                "minRideAmount",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <Input
            label="Usage Limit (Total)"
            type="number"
            value={formData.usageLimit}
            placeholder="total limit"
            onChange={(e) =>
              handleChange(
                "usageLimit",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          />
          <Input
            label="Usage Per User"
            type="number"
            value={formData.usagePerUser}
            onChange={(e) =>
              handleChange(
                "usagePerUser",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <Input
            label="Valid From"
            type="datetime-local"
            value={formData.validFrom.split(".")[0]}
            error={errors.validFrom}
            onChange={(e) =>
              handleChange("validFrom", new Date(e.target.value).toISOString())
            }
          />
          <Input
            label="Valid To"
            type="datetime-local"
            value={formData.validTo.split(".")[0]}
            error={errors.validTo}
            onChange={(e) =>
              handleChange("validTo", new Date(e.target.value).toISOString())
            }
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="ghost" onClick={handleClear} type="button">
            Clear
          </Button>

          <Button variant="danger" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Create Coupon
          </Button>
        </div>
      </form>
    </Modal>
  );
};
