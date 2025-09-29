import React from "react";
import { Input, Select, DateInput } from "@/shared/components/ui";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";

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

  // Updated license category options for multi-select
  const licenseCategoryOptions = [
    { value: "LMV", label: "LMV (Light Motor Vehicle)" },
    { value: "HMV", label: "HMV (Heavy Motor Vehicle)" },
    { value: "LMVTR", label: "LMV-TR (Light Motor Vehicle Transport)" },
    { value: "HPMV", label: "HPMV (Heavy Passenger Motor Vehicle)" },
  ];

  const bodyTypeOptions = [
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "Hatchback", label: "Hatchback" },
  ];

  const gearTypeOptions = [
    { value: "Manual", label: "Manual" },
    { value: "Automatic", label: "Automatic" },
  ];

  return (
    <div className="space-y-6">
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
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
          {licenseCategoryOptions.map((option) => (
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
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
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
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
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
          {bodyTypeOptions.map((option) => (
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
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {errors.licenseBodyTypes && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
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
          {gearTypeOptions.map((option) => (
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
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {errors.licenseGearTypes && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
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
        min={formData.licenseIssueDate || new Date().toISOString().split("T")[0]}
        isRequired
      />
    </div>
  );
};
