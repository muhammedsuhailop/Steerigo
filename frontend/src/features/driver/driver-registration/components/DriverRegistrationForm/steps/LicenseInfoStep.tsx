import React from "react";
import { Input, Select, DateInput } from "@/shared/components/ui";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";
import { BODY_TYPES, GEAR_TYPES, LICENSE_CATEGORIES } from "../../../types";
import { MdErrorOutline, MdCheck } from "react-icons/md";

export const LicenseInfoStep: React.FC = () => {
  const { formData, updateData, errors } = useDriverRegistration();
  const hasErrors = Object.keys(errors).length > 0;

  const handleInputChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      updateData({ [field]: event.target.value });
    };

  const handleMultiSelectChange = (field: string, value: string) => {
    const currentValues = (formData as any)[field] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item: string) => item !== value)
      : [...currentValues, value];

    updateData({ [field]: updatedValues });
  };

  const isSelected = (field: string, value: string) => {
    const currentValues = (formData as any)[field] || [];
    return currentValues.includes(value);
  };

  return (
    <div className="space-y-6">
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <MdErrorOutline className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Please review and resolve the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{String(message)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* License Categories */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          License Categories <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Select all license categories you hold
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LICENSE_CATEGORIES.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected("licenseCategory", option.value)
                  ? "border-gray-700 bg-gray-50 text-gray-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected("licenseCategory", option.value)}
                onChange={() =>
                  handleMultiSelectChange("licenseCategory", option.value)
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-3 w-full">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected("licenseCategory", option.value)
                      ? "border-gray-700 bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected("licenseCategory", option.value) && (
                    <MdCheck className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </div>
            </label>
          ))}
        </div>

        {errors.licenseCategory && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            <MdErrorOutline className="w-4 h-4 mr-1" />
            {errors.licenseCategory}
          </p>
        )}
      </div>

      {/* License Number */}
      <Input
        label="License Number"
        value={formData.licenseNumber || ""}
        onChange={handleInputChange("licenseNumber")}
        error={errors.licenseNumber}
        isInvalid={!!errors.licenseNumber}
        placeholder="Enter License Number"
        isRequired
      />

      {/* License Body Types */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          License Body Types <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Select body types covered by your license
        </p>

        <div className="grid grid-cols-2 gap-3">
          {BODY_TYPES.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected("licenseBodyTypes", option.value)
                  ? "border-gray-700 bg-gray-50 text-gray-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected("licenseBodyTypes", option.value)}
                onChange={() =>
                  handleMultiSelectChange("licenseBodyTypes", option.value)
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected("licenseBodyTypes", option.value)
                      ? "border-gray-700 bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected("licenseBodyTypes", option.value) && (
                    <MdCheck className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {errors.licenseBodyTypes && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            <MdErrorOutline className="w-4 h-4 mr-1" />
            {errors.licenseBodyTypes}
          </p>
        )}
      </div>

      {/* License Gear Types */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          License Gear Types <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Select gear types covered by your license
        </p>

        <div className="grid grid-cols-2 gap-3">
          {GEAR_TYPES.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected("licenseGearTypes", option.value)
                  ? "border-gray-700 bg-gray-50 text-gray-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected("licenseGearTypes", option.value)}
                onChange={() =>
                  handleMultiSelectChange("licenseGearTypes", option.value)
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected("licenseGearTypes", option.value)
                      ? "border-gray-700 bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected("licenseGearTypes", option.value) && (
                    <MdCheck className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {errors.licenseGearTypes && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            <MdErrorOutline className="w-4 h-4 mr-1" />
            {errors.licenseGearTypes}
          </p>
        )}
      </div>

      {/* License Issue Date */}
      <DateInput
        label="License Issue Date"
        value={formData.licenseIssueDate || ""}
        onChange={handleInputChange("licenseIssueDate")}
        error={errors.licenseIssueDate}
        isInvalid={!!errors.licenseIssueDate}
        max={new Date().toISOString().split("T")[0]}
        isRequired
      />

      {/* License Expiry Date */}
      <DateInput
        label="License Expiry Date"
        value={formData.licenseExpiryDate || ""}
        onChange={handleInputChange("licenseExpiryDate")}
        error={errors.licenseExpiryDate}
        isInvalid={!!errors.licenseExpiryDate}
        min={
          formData.licenseIssueDate || new Date().toISOString().split("T")[0]
        }
        isRequired
      />
    </div>
  );
};
