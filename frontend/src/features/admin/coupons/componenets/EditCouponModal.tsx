import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "@/shared/components/ui";
import {
  CouponData,
  EditCouponRequestBody,
  CouponDiscountType,
  CouponFormErrors,
  FormErrors,
} from "../types/coupon.types";
import { useUpdateCouponMutation } from "../services/adminCouponApi";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  coupon: CouponData | null;
}

export const EditCouponModal: React.FC<Props> = ({
  isOpen,
  onClose,
  coupon,
}) => {
  const [formData, setFormData] = useState<EditCouponRequestBody>({});
  const [errors, setErrors] = useState<FormErrors<EditCouponRequestBody>>({});
  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  useEffect(() => {
    if (coupon) {
      setFormData({
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount ?? null,
        minRideAmount: coupon.minRideAmount ?? null,
        usageLimit: coupon.usageLimit ?? null,
        usagePerUser: coupon.usagePerUser ?? null,
        validFrom: coupon.validFrom ? coupon.validFrom.split(".")[0] : null,
        validTo: coupon.validTo ? coupon.validTo.split(".")[0] : null,
        isActive: coupon.isActive,
      });
      setErrors({});
    }
  }, [coupon]);

  const handleChange = (name: keyof EditCouponRequestBody, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: CouponFormErrors = {};

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = "Value must be greater than 0";
    } else if (
      formData.discountType === "PERCENTAGE" &&
      formData.discountValue > 100
    ) {
      newErrors.discountValue = "Percentage value cannot exceed 100%";
    }

    if (!formData.validFrom) {
      newErrors.validFrom = "Start date is required";
    }

    if (!formData.validTo) {
      newErrors.validTo = "Expiry date is required";
    }

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
    if (!coupon?.couponId) return;

    try {
      const response = await updateCoupon({
        couponId: coupon.couponId,
        body: formData,
      }).unwrap();

      toast.success(response.message || "Coupon updated successfully");
      onClose();
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Update failed");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Coupon: ${coupon?.code}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Discount Type
            </label>
            <select
              className={`border rounded-lg px-3 text-sm h-[42px] w-full outline-none ${
                errors.discountType
                  ? "border-red-500 focus:ring-2 focus:ring-red-500"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              value={formData.discountType || ""}
              onChange={(e) =>
                handleChange(
                  "discountType",
                  e.target.value as CouponDiscountType,
                )
              }
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </select>
            {errors.discountType && (
              <span className="text-xs text-red-500 mt-1">
                {errors.discountType}
              </span>
            )}
          </div>

          <Input
            label="Discount Value"
            type="number"
            value={formData.discountValue || ""}
            error={errors.discountValue}
            onChange={(e) =>
              handleChange(
                "discountValue",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Max Discount (Cap)"
            type="number"
            value={formData.maxDiscount ?? ""}
            onChange={(e) =>
              handleChange(
                "maxDiscount",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
          <Input
            label="Min Ride Amount"
            type="number"
            value={formData.minRideAmount ?? ""}
            onChange={(e) =>
              handleChange(
                "minRideAmount",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
          <Input
            label="Valid From"
            type="date"
            value={formData.validFrom ? formData.validFrom.split("T")[0] : ""}
            error={errors.validFrom}
            onChange={(e) =>
              handleChange(
                "validFrom",
                e.target.value ? new Date(e.target.value).toISOString() : null,
              )
            }
          />

          <Input
            label="Valid To"
            type="date"
            value={formData.validTo ? formData.validTo.split("T")[0] : ""}
            error={errors.validTo}
            onChange={(e) =>
              handleChange(
                "validTo",
                e.target.value ? new Date(e.target.value).toISOString() : null,
              )
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 items-end">
          <Input
            label="Limit per User"
            type="number"
            value={formData.usagePerUser || ""}
            onChange={(e) =>
              handleChange(
                "usagePerUser",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />

          <div className="flex items-center gap-3 h-[42px] px-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              id="isActive"
              type="checkbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              checked={!!formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              {formData.isActive ? "Status: Active" : "Status: Inactive"}
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Update Coupon
          </Button>
        </div>
      </form>
    </Modal>
  );
};
